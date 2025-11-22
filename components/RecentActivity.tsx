"use client";

import { useEffect, useMemo, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronRight } from "lucide-react";

function supabaseBrowser() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/** Resolve thumbnails from Supabase `public-thumbnails` bucket */
function getThumbnailUrl(path: string | null): string {
  const fallback = "https://picsum.photos/seed/recent-activity/600/400";
  if (!path) return fallback;
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return fallback;

  return `${base}/storage/v1/object/public/public-thumbnails/${path}`;
}

type MyCourseRow = {
  user_id: string;
  id: string; // course id
  title: string;
  slug: string;
  short_description: string | null;
  thumbnail_url: string | null;
  students_count: number | null;
};

type LessonRow = {
  id: string;
  course_id: string;
};

type ProgressRow = {
  course_id: string;
  lesson_id: string;
  is_completed: boolean;
};

type CourseWithProgress = MyCourseRow & {
  totalLessons: number;
  completedLessons: number;
  progressPercent: number;
};

export default function RecentActivity() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [userName, setUserName] = useState<string>("");

  useEffect(() => {
    const supa = supabaseBrowser();

    (async () => {
      // 1) auth
      const { data: authData } = await supa.auth.getUser();
      const user = authData.user;

      if (!user) {
        setCourses([]);
        setLoading(false);
        return; // no UI if not logged in
      }

      // optional greeting name
      const { data: profile } = await supa
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();
      setUserName(profile?.full_name || user.email || "Student");

      // 2) purchased courses from view
      const { data: myCourses, error: coursesError } = await supa
        .from("my_courses")
        .select(
          "user_id, id, title, slug, short_description, thumbnail_url, students_count"
        )
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (coursesError || !myCourses?.length) {
        setCourses([]);
        setLoading(false);
        return;
      }

      const courseIds = myCourses.map((c) => c.id);

      // 3) lessons + progress
      const [{ data: lessons }, { data: progress }] = await Promise.all([
        supa.from("lessons").select("id, course_id").in("course_id", courseIds),
        supa
          .from("progress")
          .select("course_id, lesson_id, is_completed")
          .eq("user_id", user.id)
          .in("course_id", courseIds),
      ]);

      const totalByCourse = new Map<string, number>();
      (lessons ?? []).forEach((l: LessonRow) => {
        totalByCourse.set(l.course_id, (totalByCourse.get(l.course_id) ?? 0) + 1);
      });

      const completedByCourse = new Map<string, number>();
      (progress ?? [])
        .filter((p: ProgressRow) => p.is_completed)
        .forEach((p: ProgressRow) => {
          completedByCourse.set(
            p.course_id,
            (completedByCourse.get(p.course_id) ?? 0) + 1
          );
        });

      const withProgress: CourseWithProgress[] = myCourses.map((c) => {
        const total = totalByCourse.get(c.id) ?? 0;
        const completed = completedByCourse.get(c.id) ?? 0;
        const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

        return {
          ...(c as MyCourseRow),
          totalLessons: total,
          completedLessons: completed,
          progressPercent: percent,
        };
      });

      setCourses(withProgress);
      setLoading(false);
    })();
  }, [router]);

  const hasCourses = courses.length > 0;

  // do not render section if not logged in OR no purchases
  if (loading || !hasCourses) return null;

  return (
    <section className="mx-auto w-full px-4 md:px-14 lg:px-24 py-10">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-gray-900">
            Recent Activity
          </h2>
          <p className="mt-1 text-xs text-gray-500">
            Welcome back{userName ? `, ${userName}` : ""}! Continue learning.
          </p>
        </div>

        <button
          onClick={() => router.push("/dashboard")}
          className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold text-purple-600 hover:text-purple-700"
        >
          View all
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {courses.map((course) => (
          <CourseCard
            key={course.id}
            course={course}
            onClick={() => router.push(`/dashboard/course/${course.slug}`)}
          />
        ))}
      </div>
    </section>
  );
}

function CourseCard({
  course,
  onClick,
}: {
  course: CourseWithProgress;
  onClick: () => void;
}) {
  const pct = course.progressPercent;
  const pctLabel =
    pct >= 100 ? "Completed" : `${pct === 0 ? 0 : pct}% completed`;

  return (
    <article
      onClick={onClick}
      className="group cursor-pointer overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm transition
                 hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
    >
      <div className="relative h-36 sm:h-40 w-full bg-gray-100">
        <Image
          src={getThumbnailUrl(course.thumbnail_url)}
          alt={course.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
          unoptimized
        />
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-sm font-semibold text-gray-900 line-clamp-2">
          {course.title}
        </h3>

        {course.short_description && (
          <p className="text-xs text-gray-600 line-clamp-2">
            {course.short_description}
          </p>
        )}

        <div className="pt-1">
          <div className="flex justify-between items-center text-[11px] text-gray-500 mb-1">
            <span>{pctLabel}</span>
            <span>{course.totalLessons} lessons</span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <div
              className={`h-full rounded-full ${
                pct >= 100 ? "bg-emerald-500" : "bg-purple-500"
              }`}
              style={{ width: `${Math.min(pct, 100)}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-gray-500 pt-1">
          <span>
            Valid till:{" "}
            <span className="font-medium text-gray-800">Lifetime</span>
          </span>
          {course.students_count != null && (
            <span>{course.students_count} students</span>
          )}
        </div>
      </div>
    </article>
  );
}
