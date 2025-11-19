// app/dashboard/course/[slug]/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  FileText,
  MessageSquare,
  Play,
  Star,
  StarHalf,
  UserCircle
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import { CourseReview } from "@/lib/supabase-course";

function supabaseBrowser() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/* ---------- Types (align with your schema) ---------- */

type CourseRow = {
  id: string;
  title: string;
  slug: string;
  thumbnail_url: string | null;
  short_description: string | null;
  full_description: string | null;
};

type ModuleRow = {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  position: number;
};

type LessonRow = {
  id: string;
  course_id: string;
  module_id: string;
  title: string;
  description: string | null;
  duration_seconds: number | null;
  cloudflare_video_id: string | null; // or stream_uid – adjust as needed
  position: number;
  lecture_notes: string | null;
};

type ProgressRow = {
  lesson_id: string;
  course_id: string;
  is_completed: boolean;
  watched_seconds: number;
};

type AttachmentRow = {
  id: string;
  module_id: string;
  lesson_id: string;
  name: string;
  //   file_size_bytes: number | null;
  file_path: string; // path inside private_attachments bucket
};

type LessonWithProgress = LessonRow & {
  completed: boolean;
};

type ModuleWithLessons = ModuleRow & {
  lessons: LessonWithProgress[];
};

type TabKey = "description" | "notes" | "files" | "comments";

/* ---------- Page component ---------- */

export default function CourseWatchPage() {
  const params = useParams<{ slug: string }>();
  const slug = params?.slug as string;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [course, setCourse] = useState<CourseRow | null>(null);
  const [modules, setModules] = useState<ModuleWithLessons[]>([]);
  const [attachments, setAttachments] = useState<AttachmentRow[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("description");
  const [savingProgress, setSavingProgress] = useState(false);

  //   useEffect(() => {
  //     const supa = supabaseBrowser();

  //     (async () => {
  //       // 1) Auth
  //       const { data: authData } = await supa.auth.getUser();
  //       const user = authData.user;
  //       if (!user) {
  //         router.push(`/login?mode=login&redirect=/dashboard/course/${slug}`);
  //         return;
  //       }

  //       // 2) Ensure user is enrolled – from my_courses view
  //       const { data: myCourse, error: myCourseError } = await supa
  //         .from("my_courses")
  //         .select(
  //           "id, title, slug, short_description, full_description, thumbnail_url"
  //         )
  //         .eq("slug", slug)
  //         .eq("user_id", user.id)
  //         .single();

  //       if (myCourseError || !myCourse) {
  //         console.error("my_courses load error:", myCourseError);
  //         router.push(`/courses/${slug}`); // not enrolled → go to public page
  //         return;
  //       }

  //       setCourse(myCourse as any as CourseRow);

  //       const courseId = myCourse.id as string;

  //       // 3) Load modules, lessons, progress, attachments in parallel
  //       const [
  //         { data: modRows, error: modErr },
  //         { data: lessonRows, error: lessonErr },
  //         { data: progRows, error: progErr },
  //         { data: attachRows, error: attachErr },
  //       ] = await Promise.all([
  //         supa
  //           .from("modules")
  //           .select("id, course_id, title, description, position")
  //           .eq("course_id", courseId)
  //           .order("position"),
  //         supa
  //           .from("lessons")
  //           .select(
  //             "id, course_id, module_id, title, description, duration_seconds, cloudflare_video_id, position, lecture_notes"
  //           )
  //           .eq("course_id", courseId)
  //           .order("position"),
  //         supa
  //           .from("progress")
  //           .select("lesson_id, course_id, is_completed, watched_seconds")
  //           .eq("user_id", user.id)
  //           .eq("course_id", courseId),
  //         supa
  //           .from("attachments")
  //           .select("id, module_id, lesson_id, name, file_path")
  //           .eq("course_id", courseId)
  //           .order("created_at", { ascending: true }),
  //       ]);

  //       if (modErr) console.error("Modules error:", modErr);
  //       if (lessonErr) console.error("Lessons error:", lessonErr);
  //       if (progErr) console.error("Progress error:", progErr);
  //       if (attachErr) console.error("Attachments error:", attachErr);

  //       const lessonList = (lessonRows ?? []) as LessonRow[];
  //       const progressList = (progRows ?? []) as ProgressRow[];
  //       const progressByLesson = new Map<string, ProgressRow>();

  //       progressList.forEach((p) => progressByLesson.set(p.lesson_id, p));

  //       // Group lessons by module
  //       const moduleMap = new Map<string, ModuleWithLessons>();
  //       (modRows ?? []).forEach((m) => {
  //         moduleMap.set(m.id as string, {
  //           ...(m as ModuleRow),
  //           lessons: [],
  //         });
  //       });

  //       lessonList.forEach((lesson) => {
  //         const mod = moduleMap.get(lesson.module_id);
  //         const completed = !!progressByLesson.get(lesson.id)?.is_completed;
  //         const withProgress: LessonWithProgress = {
  //           ...lesson,
  //           completed,
  //         };
  //         if (mod) {
  //           mod.lessons.push(withProgress);
  //         }
  //       });

  //       // Sort lessons inside each module by position
  //       moduleMap.forEach((m) => {
  //         m.lessons.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
  //       });

  //       const modulesArray = Array.from(moduleMap.values()).sort(
  //         (a, b) => (a.position ?? 0) - (b.position ?? 0)
  //       );

  //       setModules(modulesArray);
  //       setAttachments((attachRows ?? []) as AttachmentRow[]);

  //       // Default selected lesson = first incomplete lesson, else first lesson
  //       const flatLessons = modulesArray.flatMap((m) => m.lessons);
  //       const firstIncomplete =
  //         flatLessons.find((l) => !l.completed) ?? flatLessons[0];
  //       if (firstIncomplete) {
  //         setSelectedLessonId(firstIncomplete.id);
  //       }

  //       setLoading(false);
  //     })();
  //   }, [router, slug]);

  useEffect(() => {
    const supa = supabaseBrowser();

    (async () => {
      // 1) Auth
      const { data: authData } = await supa.auth.getUser();
      const user = authData.user;
      if (!user) {
        router.push(`/login?mode=login&redirect=/dashboard/course/${slug}`);
        return;
      }

      // 2) Ensure user is enrolled – from my_courses view
      const { data: myCourse, error: myCourseError } = await supa
        .from("my_courses")
        .select(
          "id, title, slug, short_description, full_description, thumbnail_url"
        )
        .eq("slug", slug)
        .eq("user_id", user.id)
        .single();

      if (myCourseError || !myCourse) {
        console.error("my_courses load error:", myCourseError);
        router.push(`/courses/${slug}`); // not enrolled → go to public page
        return;
      }

      setCourse(myCourse as any as CourseRow);
      const courseId = myCourse.id as string;

      // 3) Load modules, lessons, progress in parallel
      const [
        { data: modRows, error: modErr },
        { data: lessonRows, error: lessonErr },
        { data: progRows, error: progErr },
      ] = await Promise.all([
        supa
          .from("modules")
          .select("id, course_id, title, description, position")
          .eq("course_id", courseId)
          .order("position"),
        supa
          .from("lessons")
          .select(
            "id, course_id, module_id, title, description, duration_seconds, cloudflare_video_id, position, lecture_notes"
          )
          .eq("course_id", courseId)
          .order("position"),
        supa
          .from("progress")
          .select("lesson_id, course_id, is_completed, watched_seconds")
          .eq("user_id", user.id)
          .eq("course_id", courseId),
      ]);

      if (modErr) console.error("Modules error:", modErr);
      if (lessonErr) console.error("Lessons error:", lessonErr);
      if (progErr) console.error("Progress error:", progErr);

      const lessonList = (lessonRows ?? []) as LessonRow[];
      const progressList = (progRows ?? []) as ProgressRow[];

      // 4) Now load ATTACHMENTS for all those lesson_ids
      let attachmentList: AttachmentRow[] = [];
      if (lessonList.length > 0) {
        const lessonIds = lessonList.map((l) => l.id);
        const { data: attachRows, error: attachErr } = await supa
          .from("attachments")
          .select("id, module_id, lesson_id, name, file_path")
          .in("lesson_id", lessonIds)
          .order("created_at", { ascending: true });

        if (attachErr) {
          console.error("Attachments error:", attachErr);
        }

        attachmentList = (attachRows ?? []) as AttachmentRow[];
      }

      // 5) Build progress maps
      const progressByLesson = new Map<string, ProgressRow>();
      progressList.forEach((p) => progressByLesson.set(p.lesson_id, p));

      // 6) Group lessons by module
      const moduleMap = new Map<string, ModuleWithLessons>();
      (modRows ?? []).forEach((m) => {
        moduleMap.set(m.id as string, {
          ...(m as ModuleRow),
          lessons: [],
        });
      });

      lessonList.forEach((lesson) => {
        const mod = moduleMap.get(lesson.module_id);
        const completed = !!progressByLesson.get(lesson.id)?.is_completed;
        const withProgress: LessonWithProgress = {
          ...lesson,
          completed,
        };
        if (mod) {
          mod.lessons.push(withProgress);
        }
      });

      // Sort lessons inside each module by position
      moduleMap.forEach((m) => {
        m.lessons.sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
      });

      const modulesArray = Array.from(moduleMap.values()).sort(
        (a, b) => (a.position ?? 0) - (b.position ?? 0)
      );

      setModules(modulesArray);
      setAttachments(attachmentList);

      // Default selected lesson = first incomplete lesson, else first lesson
      const flatLessons = modulesArray.flatMap((m) => m.lessons);
      const firstIncomplete =
        flatLessons.find((l) => !l.completed) ?? flatLessons[0];
      if (firstIncomplete) {
        setSelectedLessonId(firstIncomplete.id);
      }

      setLoading(false);
    })();
  }, [router, slug]);

  const selectedModule = useMemo(() => {
    for (const m of modules) {
      if (m.lessons.some((l) => l.id === selectedLessonId)) return m;
    }
    return modules[0] ?? null;
  }, [modules, selectedLessonId]);

  const selectedLesson: LessonWithProgress | null = useMemo(() => {
    for (const m of modules) {
      const found = m.lessons.find((l) => l.id === selectedLessonId);
      if (found) return found;
    }
    return null;
  }, [modules, selectedLessonId]);

  const allLessons = useMemo(
    () => modules.flatMap((m) => m.lessons),
    [modules]
  );

  const completedCount = allLessons.filter((l) => l.completed).length;
  const totalLessons = allLessons.length;
  const progressPercent =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  const lessonAttachments = useMemo(
    () => attachments.filter((a) => a.lesson_id === selectedLessonId),
    [attachments, selectedLessonId]
  );

  const handleSelectLesson = (lessonId: string) => {
    setSelectedLessonId(lessonId);
    setActiveTab("description");
  };

  const handleMarkComplete = async () => {
    if (!course || !selectedLesson) return;
    setSavingProgress(true);
    const supa = supabaseBrowser();

    try {
      const { data: authData } = await supa.auth.getUser();
      const user = authData.user;
      if (!user) {
        router.push(
          `/login?mode=login&redirect=/dashboard/course/${course.slug}`
        );
        return;
      }

      const { error } = await supa.from("progress").upsert(
        {
          user_id: user.id,
          course_id: course.id,
          lesson_id: selectedLesson.id,
          watched_seconds: selectedLesson.duration_seconds ?? 0,
          is_completed: true,
        },
        {
          onConflict: "user_id,lesson_id",
        }
      );

      if (error) {
        console.error("Mark complete error:", error);
      } else {
        // update local state
        setModules((prev) =>
          prev.map((m) => ({
            ...m,
            lessons: m.lessons.map((l) =>
              l.id === selectedLesson.id ? { ...l, completed: true } : l
            ),
          }))
        );
      }
    } finally {
      setSavingProgress(false);
    }
  };

  const handleNextLecture = () => {
    if (!selectedLesson) return;
    const idx = allLessons.findIndex((l) => l.id === selectedLesson.id);
    if (idx === -1) return;
    const next = allLessons[idx + 1];
    if (next) {
      setSelectedLessonId(next.id);
      setActiveTab("description");
    }
  };

  const handleDownloadAttachment = async (att: AttachmentRow) => {
    const supa = supabaseBrowser();
    const { data, error } = await supa.storage
      .from("private_attachments")
      .createSignedUrl(att.file_path, 60); // 60s

    if (error) {
      console.error("Download attachment error:", error);
      return;
    }
    if (data?.signedUrl) {
      window.open(data.signedUrl, "_blank");
    }
  };

  if (loading || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  // Helper for duration
  const totalDurationMinutes = allLessons.reduce(
    (sum, l) => sum + Math.round((l.duration_seconds ?? 0) / 60),
    0
  );

  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-50 via-white to-white pt-20 pb-16 mt-12">
      <div className="mx-auto max-w-7xl px-4">
        {/* Top header row */}
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
          <div className="space-y-1">
            <p className="text-[11px] text-gray-500">
              Dashboard / Courses /{" "}
              <span className="text-gray-800 font-medium">{course.title}</span>
            </p>
            <h1 className="text-lg md:text-xl font-semibold text-gray-900">
              {course.title}
            </h1>
            <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500">
              <span>
                {modules.length} Sections • {totalLessons} lectures •{" "}
                {totalDurationMinutes}m
              </span>
              <span className="inline-flex items-center gap-1">
                <Star className="h-3 w-3 text-yellow-400" />
                4.9 (demo)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 justify-start md:justify-end">
            <button
              onClick={() =>
                router.push(`/dashboard/course/${course.slug}#reviews-section`)
              }
              className="rounded-full border border-gray-200 px-4 py-1.5 text-xs font-semibold text-gray-800 hover:border-purple-500 hover:text-purple-600"
            >
              Write a Review
            </button>
            <button
              onClick={handleNextLecture}
              className="inline-flex items-center gap-2 rounded-full bg-purple-600 px-4 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-purple-700"
            >
              Next Lecture
              <ChevronRight className="h-3 w-3" />
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1.2fr)] gap-6 lg:gap-8">
          {/* Left: video + lesson details */}
          <section>
            {/* Video player / preview */}
            {/* TOP BAR: mark complete + overall progress (moved out of video area) */}
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={handleMarkComplete}
                disabled={savingProgress}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition
      ${
        selectedLesson?.completed
          ? "bg-emerald-50 text-emerald-700"
          : "bg-gray-900 text-white hover:bg-black disabled:opacity-60"
      }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                {selectedLesson?.completed
                  ? "Completed"
                  : savingProgress
                  ? "Saving..."
                  : "Mark this lesson as complete"}
              </button>

              <div className="flex items-center gap-2 text-[11px] text-gray-600">
                <Clock3 className="h-3 w-3" />
                <span>
                  {Math.round((selectedLesson?.duration_seconds ?? 0) / 60) ||
                    0}{" "}
                  min
                </span>
                <span className="mx-2 h-3 w-px bg-gray-200" />
                <span className="font-medium">
                  {progressPercent}% course completed
                </span>
              </div>
            </div>

            {/* VIDEO AREA */}
            <div className="rounded-3xl bg-black overflow-hidden relative aspect-video mb-4">
              {selectedLesson?.cloudflare_video_id ? (
                <CloudflarePlayer
                  videoId={selectedLesson.cloudflare_video_id}
                />
              ) : (
                <>
                  {/*
        Fallback thumbnail – uses Supabase public_thumbnails bucket.
        If thumbnail_url is already a full URL we use it directly.
      */}
                  <Image
                    src={
                      course.thumbnail_url
                        ? course.thumbnail_url.startsWith("http")
                          ? course.thumbnail_url
                          : `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/public_thumbnails/${course.thumbnail_url}`
                        : "https://picsum.photos/seed/course-fallback/1200/675"
                    }
                    alt={course.title}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="rounded-full bg-black/60 px-4 py-2 text-xs text-white">
                      No video set for this lesson yet.
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Lesson heading + meta */}
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  {selectedModule?.title ?? "Module"}
                </h2>
                <p className="text-xs text-gray-500">
                  {selectedLesson?.title ?? ""}
                </p>
              </div>
              <div className="flex items-center gap-3 text-[11px] text-gray-500">
                <div className="flex -space-x-2">
                  {/* demo avatars */}
                  <div className="h-6 w-6 rounded-full bg-purple-200 border border-white" />
                  <div className="h-6 w-6 rounded-full bg-rose-200 border border-white" />
                  <div className="h-6 w-6 rounded-full bg-amber-200 border border-white" />
                </div>
                <span>100 students watching</span>
              </div>
            </div>

            {/* Tabs under video */}
            <div>
              <div className="border-b border-gray-200 flex flex-wrap gap-4 text-xs font-semibold text-gray-500">
                <TabButton
                  label="Description"
                  active={activeTab === "description"}
                  onClick={() => setActiveTab("description")}
                />
                <TabButton
                  label="Lecture Notes"
                  active={activeTab === "notes"}
                  onClick={() => setActiveTab("notes")}
                />
                <TabButton
                  label={`Attach File${
                    lessonAttachments.length
                      ? ` (${lessonAttachments.length})`
                      : ""
                  }`}
                  active={activeTab === "files"}
                  onClick={() => setActiveTab("files")}
                />
                <TabButton
                  label="Comments"
                  active={activeTab === "comments"}
                  onClick={() => setActiveTab("comments")}
                />
              </div>

              <div className="pt-5 text-xs text-gray-700">
                {activeTab === "description" && (
                  <DescriptionTab
                    course={course}
                    module={selectedModule}
                    lesson={selectedLesson}
                  />
                )}

                {activeTab === "notes" && (
                  <LectureNotesTab lesson={selectedLesson} />
                )}

                {activeTab === "files" && (
                  <AttachmentsTab
                    attachments={lessonAttachments}
                    onDownload={handleDownloadAttachment}
                  />
                )}

                {activeTab === "comments" && (
                  <CommentsTab courseId={course.id} lesson={selectedLesson} />
                )}
              </div>
            </div>
          </section>

          {/* Right: curriculum / modules / lessons */}
          <aside className="rounded-3xl bg-white border border-gray-100 shadow-sm p-4 md:p-5 lg:p-6 h-fit">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">
                  Course Contents
                </h3>
                <p className="text-[11px] text-gray-500">
                  {totalLessons} lectures • {totalDurationMinutes}m total
                </p>
              </div>
              <p className="text-[11px] font-semibold text-emerald-600">
                {progressPercent}% Completed
              </p>
            </div>

            <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
              {modules.map((m) => (
                <ModuleBlock
                  key={m.id}
                  module={m}
                  selectedLessonId={selectedLessonId}
                  onSelectLesson={handleSelectLesson}
                />
              ))}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

/* ---------- Subcomponents ---------- */

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative pb-2 ${
        active ? "text-purple-600" : "text-gray-500 hover:text-gray-700"
      }`}
    >
      {label}
      {active && (
        <span className="absolute left-0 right-0 -bottom-[1px] h-[2px] rounded-full bg-purple-600" />
      )}
    </button>
  );
}

function DescriptionTab({
  course,
  module,
  lesson,
}: {
  course: CourseRow;
  module: ModuleWithLessons | null;
  lesson: LessonWithProgress | null;
}) {
  const text =
    lesson?.description ??
    module?.description ??
    course.full_description ??
    "No description provided yet.";

  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-semibold text-gray-900 mb-2">
          Description
        </h4>
        <p className="whitespace-pre-line leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function LectureNotesTab({ lesson }: { lesson: LessonWithProgress | null }) {
  if (!lesson?.lecture_notes) {
    return (
      <p className="text-gray-500">
        No lecture notes added yet for this lesson.
      </p>
    );
  }

  // Treat each line as bullet
  const lines = lesson.lecture_notes
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);

  return (
    <div>
      <h4 className="text-sm font-semibold text-gray-900 mb-3">
        Lecture Notes
      </h4>
      <ul className="space-y-2">
        {lines.map((line, idx) => (
          <li key={idx} className="flex items-start gap-2">
            <span className="mt-1 text-purple-500">
              <Play className="h-3 w-3" />
            </span>
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function humanFileSize(bytes: number | null) {
  if (!bytes || bytes <= 0) return "";
  const mb = bytes / (1024 * 1024);
  if (mb < 1) return `${bytes} bytes`;
  return `${mb.toFixed(1)} MB`;
}

function AttachmentsTab({
  attachments,
  onDownload,
}: {
  attachments: AttachmentRow[];
  onDownload: (a: AttachmentRow) => void;
}) {
  if (!attachments.length) {
    return (
      <p className="text-gray-500">No files attached to this lesson yet.</p>
    );
  }

  return (
    <div className="space-y-3">
      <h4 className="text-sm font-semibold text-gray-900">
        Attach Files ({attachments.length})
      </h4>
      {attachments.map((att) => (
        <div
          key={att.id}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl bg-purple-50 px-4 py-3 text-xs"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white text-purple-600">
              <FileText className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">{att.name}</p>
              {/* <p className="text-[11px] text-gray-500">
                {humanFileSize(att.file_size_bytes)}
              </p> */}
            </div>
          </div>
          <button
            onClick={() => onDownload(att)}
            className="inline-flex items-center justify-center rounded-full bg-purple-600 px-4 py-1.5 text-xs font-semibold text-white hover:bg-purple-700"
          >
            Download File
          </button>
        </div>
      ))}
    </div>
  );
}

// function CommentsTab({
//   courseId,
//   lesson,
// }: {
//   courseId: string;
//   lesson: LessonWithProgress | null;
// }) {
//   // Placeholder – later we can plug your Reviews/Comments component
//   return (
//     <div className="space-y-3">
//       <div className="flex items-center gap-2">
//         <MessageSquare className="h-4 w-4 text-purple-500" />
//         <h4 className="text-sm font-semibold text-gray-900">Comments</h4>
//       </div>
//       <p className="text-xs text-gray-500">
//         Comments for this lesson will appear here. For now you can still read
//         and write reviews on the main course page.
//       </p>
//       <button
//         onClick={() =>
//           window.open(`/courses/${courseId}#reviews-section`, "_blank")
//         }
//         className="inline-flex items-center gap-1 rounded-full border border-gray-200 px-4 py-1.5 text-xs font-semibold text-gray-800 hover:border-purple-500 hover:text-purple-600"
//       >
//         <Star className="h-3 w-3 text-yellow-400" />
//         Open reviews
//       </button>
//     </div>
//   );
// }


function CommentsTab({
  courseId,
  lesson,
}: {
  courseId: string;
  lesson: LessonWithProgress | null;
}) {
  const [reviews, setReviews] = useState<CourseReview[]>([]);
  const [loading, setLoading] = useState(true);

  const [canReview, setCanReview] = useState(false);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // We keep userId in state so we don't refetch on every submit
  const [userId, setUserId] = useState<string | null>(null);

  // Load reviews + enrollment + existing review
  useEffect(() => {
    const supa = supabaseBrowser();

    (async () => {
      setLoading(true);
      setError(null);
      setSuccess(null);

      // 1) Auth
      const { data: authData } = await supa.auth.getUser();
      const user = authData.user;
      if (!user) {
        // Not logged in → can’t review
        setCanReview(false);
        setLoading(false);
        return;
      }

      setUserId(user.id);

      // 2) Check enrollment
      const [{ data: enrollRow }, { data: existingReview }, { data: allReviews }] =
        await Promise.all([
          supa
            .from("enrollments")
            .select("id")
            .eq("user_id", user.id)
            .eq("course_id", courseId)
            .maybeSingle(),
          supa
            .from("reviews")
            .select("id, rating, comment, display_name")
            .eq("user_id", user.id)
            .eq("course_id", courseId)
            .maybeSingle(),
          supa
            .from("reviews")
            .select("id, rating, comment, created_at, display_name")
            .eq("course_id", courseId)
            .order("created_at", { ascending: false }),
        ]);

      // Can they review?
      setCanReview(!!enrollRow);
      setReviews((allReviews ?? []) as CourseReview[]);

      if (existingReview) {
        setAlreadyReviewed(true);
        setRating(existingReview.rating ?? 0);
        setComment(existingReview.comment ?? "");
      } else {
        setAlreadyReviewed(false);
        setRating(0);
        setComment("");
      }

      setLoading(false);
    })();
  }, [courseId]);

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    const sum = reviews.reduce((acc, r) => acc + (r.rating ?? 0), 0);
    return sum / reviews.length;
  }, [reviews]);

  const distribution = useMemo(
    () =>
      [5, 4, 3, 2, 1].map((star) => ({
        star,
        count: reviews.filter((r) => r.rating === star).length,
      })),
    [reviews]
  );

  const handleSubmit = async () => {
    if (!userId) {
      setError("Please sign in to leave a review.");
      return;
    }
    if (!canReview) {
      setError("Only learners enrolled in this course can review it.");
      return;
    }
    if (!rating) {
      setError("Please select a star rating.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const supa = supabaseBrowser();

      // Optional: pull display name from profiles
      const { data: profile } = await supa
        .from("profiles")
        .select("full_name")
        .eq("id", userId)
        .maybeSingle();

      const displayName =
        profile?.full_name ||
        // fallback: first part of email
        (await supa.auth.getUser()).data.user?.email?.split("@")[0] ||
        "Learner";

      const { error: upsertError } = await supa.from("reviews").upsert(
        {
          user_id: userId,
          course_id: courseId,
          rating,
          comment: comment.trim() || null,
          display_name: displayName,
        },
        {
          // respects unique (user_id, course_id)
          onConflict: "user_id,course_id",
        }
      );

      if (upsertError) {
        console.error("Review upsert error:", upsertError);
        setError("Could not save your review. Please try again.");
        setSubmitting(false);
        return;
      }

      setAlreadyReviewed(true);
      setSuccess("Thanks! Your review has been saved.");

      // Reload list so left column updates
      const { data: allReviews } = await supabaseBrowser()
        .from("reviews")
        .select("id, rating, comment, created_at, display_name")
        .eq("course_id", courseId)
        .order("created_at", { ascending: false });

      setReviews((allReviews ?? []) as CourseReview[]);
    } catch (err) {
      console.error(err);
      setError("Unexpected error while saving your review.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center text-xs text-gray-500">
        Loading comments…
      </div>
    );
  }

  const activeRating = hoverRating || rating;

  return (
    <div id="review-section" className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-4 w-4 text-purple-500" />
        <h4 className="text-sm font-semibold text-gray-900">Comments & Reviews</h4>
        {lesson && (
          <span className="text-[11px] text-gray-500">
            You&apos;re currently on: <span className="font-medium">{lesson.title}</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        {/* LEFT: stats + list */}
        <div className="space-y-6">
          {/* Stats header */}
          <div className="flex flex-col gap-6 md:flex-row">
            <div className="rounded-3xl bg-gray-900 px-6 py-6 text-white md:w-[260px] shadow-sm">
              <p className="text-[11px] uppercase tracking-wide text-gray-300">
                Average Rating
              </p>
              <p className="mt-1 text-4xl font-semibold">{averageRating.toFixed(1)}</p>
              <Stars rating={averageRating} size={18} />
              <p className="mt-1 text-[11px] text-gray-300">
                {reviews.length} review{reviews.length === 1 ? "" : "s"}
              </p>
            </div>

            <div className="flex-1 space-y-2">
              {distribution.map((row) => {
                const percent = reviews.length
                  ? Math.round((row.count / reviews.length) * 100)
                  : 0;
                return (
                  <div
                    key={row.star}
                    className="flex items-center gap-3 text-[11px] text-gray-600"
                  >
                    <span className="w-8 font-medium">{row.star}★</span>
                    <div className="h-2 flex-1 rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-purple-500"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-gray-400">
                      {row.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Reviews list */}
          <div className="space-y-4">
            {reviews.length === 0 && (
              <p className="text-xs text-gray-500">
                No reviews yet. Be the first to share your experience with this course.
              </p>
            )}

            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="rounded-2xl border border-gray-100 bg-white p-4 text-xs shadow-sm"
              >
                <div className="flex items-center gap-3">
                  <UserCircle className="h-9 w-9 text-gray-300" />
                  <div>
                    <p className="text-[13px] font-semibold text-gray-900">
                      {rev.display_name || "Anonymous learner"}
                    </p>
                    <Stars rating={rev.rating ?? 0} size={14} />
                    <p className="text-[11px] text-gray-400">
                      {new Date(rev.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {rev.comment && (
                  <p className="mt-3 text-[12px] text-gray-700">{rev.comment}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: form */}
        <div className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-gray-900 mb-1">
            Share your experience
          </p>
          <p className="mb-4 text-[11px] text-gray-500">
            Reviews help other learners decide if this course is right for them.
            You can edit your review anytime.
          </p>

          {!canReview && (
            <div className="mb-4 rounded-2xl bg-gray-50 px-4 py-3 text-[11px] text-gray-600">
              You&apos;ll be able to leave a review after enrolling in this course from
              the main catalog.
            </div>
          )}

          {/* Star input */}
          <div className="mb-3">
            <p className="text-[11px] font-medium text-gray-700 mb-1">
              Your rating
            </p>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    disabled={!canReview}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-0.5"
                  >
                    <Star
                      className={`h-5 w-5 transition ${
                        activeRating >= star
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  </button>
                ))}
              </div>
              {activeRating > 0 && (
                <span className="text-[11px] text-gray-500">
                  {activeRating} / 5
                </span>
              )}
            </div>
          </div>

          {/* Comment textarea */}
          <div className="mb-3">
            <p className="text-[11px] font-medium text-gray-700 mb-1">
              Any comments?
            </p>
            <textarea
              rows={4}
              disabled={!canReview}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-xs outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 disabled:bg-gray-50"
              placeholder="What did you like? What could be better?"
            />
          </div>

          {error && (
            <div className="mb-2 rounded-2xl bg-red-50 px-3 py-2 text-[11px] text-red-600">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-2 rounded-2xl bg-emerald-50 px-3 py-2 text-[11px] text-emerald-700">
              {success}
            </div>
          )}

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canReview || submitting}
            className="mt-1 inline-flex w-full items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-md hover:shadow-lg disabled:opacity-60"
          >
            {submitting ? "Saving..." : alreadyReviewed ? "Update review" : "Submit review"}
          </button>

          {!canReview && (
            <p className="mt-2 text-[10px] text-gray-400">
              You can buy this course from the public course page to unlock reviews and
              all lessons.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/** Small star display component, similar to the one used on course page */
function Stars({ rating, size = 16 }: { rating: number; size?: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className="text-yellow-400 fill-yellow-400"
        />
      ))}
      {half && (
        <StarHalf
          size={size}
          className="text-yellow-400 fill-yellow-400"
        />
      )}
      {Array.from({ length: 5 - full - (half ? 1 : 0) }).map((_, i) => (
        <Star
          key={`empty-${i}`}
          size={size}
          className="text-gray-300"
        />
      ))}
    </div>
  );
}


function ModuleBlock({
  module,
  selectedLessonId,
  onSelectLesson,
}: {
  module: ModuleWithLessons;
  selectedLessonId: string | null;
  onSelectLesson: (id: string) => void;
}) {
  const [open, setOpen] = useState(true);
  const completedLessons = module.lessons.filter((l) => l.completed).length;
  const total = module.lessons.length || 1;
  const pct = Math.round((completedLessons / total) * 100);

  return (
    <div className="rounded-2xl border border-gray-100 bg-gray-50/60 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-3 py-2 text-left text-[11px] font-semibold text-gray-800 bg-white"
      >
        <div className="flex flex-col">
          <span>{module.title}</span>
          <span className="text-[10px] text-gray-500">
            {module.lessons.length} lectures • {pct}% complete
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {open && (
        <div className="border-t border-gray-100 bg-white">
          {module.lessons.map((l) => {
            const active = l.id === selectedLessonId;
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => onSelectLesson(l.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-[11px] border-t border-gray-50
                  ${
                    active
                      ? "bg-purple-50 text-purple-700"
                      : "hover:bg-gray-50 text-gray-700"
                  }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className={`h-3 w-3 rounded-[4px] border ${
                      l.completed
                        ? "bg-emerald-500 border-emerald-500"
                        : "border-gray-300"
                    }`}
                  />
                  <span className="line-clamp-1">{l.title}</span>
                </div>
                <span className="text-[10px] text-gray-500">
                  {Math.round((l.duration_seconds ?? 0) / 60)}m
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function CloudflarePlayer({ videoId }: { videoId: string }) {
  if (!videoId) return null;

  return (
    <iframe
      src={`https://iframe.videodelivery.net/${videoId}`}
      title="Course video"
      allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
      allowFullScreen
      className="w-full h-full border-0"
    />
  );
}
