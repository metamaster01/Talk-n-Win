// // app/dashboard/page.tsx
// "use client";

// import { useEffect, useMemo, useState } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import { LogOut, Search } from "lucide-react";
// import Lottie from "lottie-react";
// import comingSoonAnimation from "@/public/coming-soon.json"; // make sure file exists
// import { createClient } from "@supabase/supabase-js";

// function supabaseBrowser() {
//   return createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//   );
// }

// type MyCourseRow = {
//   user_id: string;
//   id: string; // course id
//   title: string;
//   slug: string;
//   short_description: string | null;
//   thumbnail_url: string | null;
//   students_count: number | null;
// };

// type LessonRow = {
//   id: string;
//   course_id: string;
// };

// type ProgressRow = {
//   course_id: string;
//   lesson_id: string;
//   is_completed: boolean;
// };

// type CourseWithProgress = MyCourseRow & {
//   totalLessons: number;
//   completedLessons: number;
//   progressPercent: number;
// };

// type SidebarSection =
//   | "courses_all"
//   | "courses_active"
//   | "courses_archived"
//   | "practice_tests"
//   | "community";

// export default function DashboardPage() {
//   const router = useRouter();
//   const [section, setSection] = useState<SidebarSection>("courses_all");
//   const [loading, setLoading] = useState(true);
//   const [courses, setCourses] = useState<CourseWithProgress[]>([]);
//   const [search, setSearch] = useState("");
//   const [userName, setUserName] = useState<string>("");
//   const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

//   useEffect(() => {
//     const supa = supabaseBrowser();

//     (async () => {
//       // 1) Auth
//       const { data: authData } = await supa.auth.getUser();
//       const authUser = authData.user;
//       if (!authUser) {
//         router.push("/login?mode=login&redirect=/dashboard");
//         return;
//       }

//       // 2) Profile for name/avatar
//       const { data: profile } = await supa
//         .from("profiles")
//         .select("full_name, avatar_url")
//         .eq("id", authUser.id)
//         .single();

//       setUserName(profile?.full_name || authUser.email || "Student");
//       setAvatarUrl(profile?.avatar_url ?? null);

//       // 3) My enrolled courses (view)
//       const { data: myCourses, error: coursesError } = await supa
//         .from("my_courses")
//         .select(
//           "user_id, id, title, slug, short_description, thumbnail_url, students_count"
//         );

//       if (coursesError) {
//         console.error("Load my_courses error:", coursesError);
//         setCourses([]);
//         setLoading(false);
//         return;
//       }

//       const courseIds = (myCourses ?? []).map((c) => c.id);
//       if (courseIds.length === 0) {
//         setCourses([]);
//         setLoading(false);
//         return;
//       }

//       // 4) All lessons for those courses
//       const [{ data: lessons }, { data: progress }] = await Promise.all([
//         supa
//           .from("lessons")
//           .select("id, course_id")
//           .in("course_id", courseIds),
//         supa
//           .from("progress")
//           .select("course_id, lesson_id, is_completed")
//           .eq("user_id", authUser.id)
//           .in("course_id", courseIds),
//       ]);

//       const totalByCourse = new Map<string, number>();
//       (lessons ?? []).forEach((l: LessonRow) => {
//         totalByCourse.set(l.course_id, (totalByCourse.get(l.course_id) ?? 0) + 1);
//       });

//       const completedByCourse = new Map<string, number>();
//       (progress ?? [])
//         .filter((p: ProgressRow) => p.is_completed)
//         .forEach((p: ProgressRow) => {
//           completedByCourse.set(
//             p.course_id,
//             (completedByCourse.get(p.course_id) ?? 0) + 1
//           );
//         });

//       const withProgress: CourseWithProgress[] = (myCourses ?? []).map(
//         (c: MyCourseRow) => {
//           const total = totalByCourse.get(c.id) ?? 0;
//           const completed = completedByCourse.get(c.id) ?? 0;
//           const percent =
//             total > 0 ? Math.round((completed / total) * 100) : 0;
//           return {
//             ...c,
//             totalLessons: total,
//             completedLessons: completed,
//             progressPercent: percent,
//           };
//         }
//       );

//       setCourses(withProgress);
//       setLoading(false);
//     })();
//   }, [router]);

//   const filteredCourses = useMemo(() => {
//     let list = courses;

//     // Filter by sidebar section
//     if (section === "courses_active") {
//       list = list.filter((c) => c.progressPercent < 100);
//     } else if (section === "courses_archived") {
//       list = list.filter((c) => c.progressPercent >= 100);
//     }

//     // Text search
//     if (search.trim()) {
//       const q = search.toLowerCase();
//       list = list.filter(
//         (c) =>
//           c.title.toLowerCase().includes(q) ||
//           (c.short_description ?? "").toLowerCase().includes(q)
//       );
//     }

//     return list;
//   }, [courses, section, search]);

//   const handleLogout = async () => {
//     const supa = supabaseBrowser();
//     await supa.auth.signOut();
//     router.push("/");
//   };

//   const showCoursesSection =
//     section === "courses_all" ||
//     section === "courses_active" ||
//     section === "courses_archived";

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-gray-50">
//         <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 flex pt-12 mt-14">
//       {/* Sidebar */}
//       <aside className="w-64 border-r border-gray-200 bg-white flex flex-col">
//         {/* Logo */}
//         <div className="h-16 px-6 flex items-center border-b border-gray-100">
//           <div className="flex items-center gap-2">
//             <Image
//               src="/logo.png"
//               alt="Logo"
//               width={50}
//               height={42}
//               className="rounded-full"
//             />
//             <span className="text-sm font-semibold text-gray-900">
//               Talk'N'Win
//             </span>
//           </div>
//         </div>

//         {/* Nav */}
//         <nav className="flex-1 px-3 py-4 text-sm">
//           <p className="px-3 mb-2 text-[11px] font-semibold text-gray-400 uppercase">
//             Courses
//           </p>
//           <SidebarItem
//             active={section === "courses_all"}
//             onClick={() => setSection("courses_all")}
//           >
//             All courses
//           </SidebarItem>
//           <SidebarItem
//             active={section === "courses_active"}
//             onClick={() => setSection("courses_active")}
//           >
//             Active courses
//           </SidebarItem>
//           <SidebarItem
//             active={section === "courses_archived"}
//             onClick={() => setSection("courses_archived")}
//           >
//             Archived courses
//           </SidebarItem>

//           <div className="mt-6">
//             <p className="px-3 mb-2 text-[11px] font-semibold text-gray-400 uppercase">
//               More
//             </p>
//             <SidebarItem
//               active={section === "practice_tests"}
//               onClick={() => setSection("practice_tests")}
//             >
//               Practical tests
//             </SidebarItem>
//             <SidebarItem
//               active={section === "community"}
//               onClick={() => setSection("community")}
//             >
//               Community
//             </SidebarItem>
//           </div>
//         </nav>

//         {/* Bottom: logout + user */}
//         <div className="border-t border-gray-100 p-3 space-y-3">
//           <button
//             onClick={handleLogout}
//             className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-3 py-2 text-xs font-medium text-white hover:bg-black"
//           >
//             <LogOut className="h-4 w-4" />
//             Logout
//           </button>

//           <button
//             onClick={() => router.push("/account")}
//             className="w-full flex items-center gap-3 rounded-2xl px-2 py-2 hover:bg-gray-50 text-left"
//           >
//             <div className="h-9 w-9 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
//               {avatarUrl ? (
//                 <Image
//                   src={avatarUrl}
//                   alt={userName}
//                   width={36}
//                   height={36}
//                   className="h-9 w-9 object-cover"
//                 />
//               ) : (
//                 (userName || "U").charAt(0).toUpperCase()
//               )}
//             </div>
//             <div>
//               <div className="text-xs font-semibold text-gray-900">
//                 {userName}
//               </div>
//               <div className="text-[11px] text-gray-500">View account</div>
//             </div>
//           </button>
//         </div>
//       </aside>

//       {/* Main content */}
//       <main className="flex-1 pt-8 pb-10 px-8">
//         {showCoursesSection ? (
//           <>
//             {/* Header & search */}
//             <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
//               <div>
//                 <h1 className="text-xl font-semibold text-gray-900">
//                   {section === "courses_all"
//                     ? "All courses"
//                     : section === "courses_active"
//                     ? "Active courses"
//                     : "Archived courses"}
//                 </h1>
//                 <p className="mt-1 text-xs text-gray-500">
//                   Browse the courses you&apos;ve purchased.
//                 </p>
//               </div>

//               <div className="w-full sm:w-80 relative">
//                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
//                 <input
//                   value={search}
//                   onChange={(e) => setSearch(e.target.value)}
//                   placeholder="Search for a chapter, course or package"
//                   className="w-full rounded-full border border-gray-200 pl-9 pr-3 py-2 text-xs outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
//                 />
//               </div>
//             </div>

//             {/* Course grid */}
//             {filteredCourses.length === 0 ? (
//               <div className="rounded-3xl bg-white border border-gray-100 p-10 text-center text-sm text-gray-600">
//                 {section === "courses_archived"
//                   ? "You haven’t completed any courses yet."
//                   : "No courses found. Start by purchasing a course from the catalog."}
//               </div>
//             ) : (
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
//                 {filteredCourses.map((course) => (
//                   <CourseCard
//                     key={course.id}
//                     course={course}
//                     onClick={() =>
//                       router.push(`/dashboard/course/${course.slug}`)
//                     }
//                   />
//                 ))}
//               </div>
//             )}
//           </>
//         ) : (
//           <ComingSoonSection />
//         )}
//       </main>
//     </div>
//   );
// }

// function SidebarItem({
//   active,
//   children,
//   onClick,
// }: {
//   active?: boolean;
//   children: React.ReactNode;
//   onClick?: () => void;
// }) {
//   return (
//     <button
//       type="button"
//       onClick={onClick}
//       className={`w-full flex items-center justify-between rounded-full px-3 py-2 text-xs mb-1
//         ${
//           active
//             ? "bg-gray-900 text-white font-semibold"
//             : "text-gray-700 hover:bg-gray-100"
//         }`}
//     >
//       <span>{children}</span>
//       {active && (
//         <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(16,185,129,0.3)]" />
//       )}
//     </button>
//   );
// }

// function CourseCard({
//   course,
//   onClick,
// }: {
//   course: CourseWithProgress;
//   onClick: () => void;
// }) {
//   const pct = course.progressPercent;
//   const pctLabel =
//     pct >= 100 ? "Completed" : `${pct === 0 ? 0 : pct}% completed`;

//   return (
//     <article
//       className="flex flex-col rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition"
//       onClick={onClick}
//     >
//       <div className="relative h-40 w-full bg-gray-100">
//         <Image
//           src={
//             course.thumbnail_url ??
//             "https://picsum.photos/seed/dashboard-course/600/400"
//           }
//           alt={course.title}
//           fill
//           className="object-cover"
//           unoptimized
//         />
//       </div>
//       <div className="flex-1 p-4 flex flex-col gap-2">
//         <h2 className="text-sm font-semibold text-gray-900 line-clamp-2">
//           {course.title}
//         </h2>
//         {course.short_description && (
//           <p className="text-xs text-gray-600 line-clamp-2">
//             {course.short_description}
//           </p>
//         )}

//         <div className="mt-2">
//           <div className="flex justify-between items-center text-[11px] text-gray-500 mb-1">
//             <span>{pctLabel}</span>
//             <span>{course.totalLessons} lessons</span>
//           </div>
//           <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
//             <div
//               className={`h-full rounded-full ${
//                 pct >= 100 ? "bg-emerald-500" : "bg-purple-500"
//               }`}
//               style={{ width: `${Math.min(pct, 100)}%` }}
//             />
//           </div>
//         </div>

//         <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500">
//           <span>
//             Valid till:{" "}
//             <span className="font-medium text-gray-800">Lifetime</span>
//           </span>
//           {course.students_count != null && (
//             <span>{course.students_count} students</span>
//           )}
//         </div>
//       </div>
//     </article>
//   );
// }

// function ComingSoonSection() {
//   return (
//     <div className="h-full flex flex-col items-center justify-center">
//       <div className="w-full max-w-md">
//         <Lottie
//           animationData={comingSoonAnimation}
//           loop
//           style={{ width: "100%", height: "auto" }}
//         />
//       </div>
//       <p className="mt-4 text-sm font-semibold text-gray-800">
//         Coming soon!
//       </p>
//       <p className="mt-1 text-xs text-gray-500 max-w-sm text-center">
//         Practical tests and community features are on the way. For now,
//         enjoy your courses from the sidebar.
//       </p>
//     </div>
//   );
// }


// app/dashboard/page.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { LogOut, Search, MessageCircle, Bookmark, ChevronRight } from "lucide-react";
import Lottie from "lottie-react";
import comingSoonAnimation from "@/public/coming-soon.json"; // make sure file exists
import { createClient } from "@supabase/supabase-js";

function supabaseBrowser() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/** Always resolve thumbnails from Supabase `public-thumbnails` bucket */
function getThumbnailUrl(path: string | null): string {
  const fallback = "https://picsum.photos/seed/dashboard-course/600/400";
  if (!path) return fallback;

  // already a full URL
  if (path.startsWith("http://") || path.startsWith("https://")) return path;

  const base = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!base) return fallback;

  // treat DB value as relative path (e.g. "images/3c-course.png")
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

type SidebarSection =
  | "courses_all"
  | "courses_active"
  | "courses_archived"
  | "practice_tests"
  | "community";

type MobileTab = "courses" | "test" | "more" | "profile";

export default function DashboardPage() {
  const router = useRouter();
  const [section, setSection] = useState<SidebarSection>("courses_all");
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [search, setSearch] = useState("");
  const [userName, setUserName] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  // mobile bottom-nav state
  const [mobileTab, setMobileTab] = useState<MobileTab>("courses");
  const [showMoreSheet, setShowMoreSheet] = useState(false);

  useEffect(() => {
    const supa = supabaseBrowser();

    (async () => {
      // 1) Auth
      const { data: authData } = await supa.auth.getUser();
      const authUser = authData.user;
      if (!authUser) {
        router.push("/login?mode=login&redirect=/dashboard");
        return;
      }

      // 2) Profile for name/avatar
      const { data: profile } = await supa
        .from("profiles")
        .select("full_name, avatar_url")
        .eq("id", authUser.id)
        .single();

      setUserName(profile?.full_name || authUser.email || "Student");
      setAvatarUrl(profile?.avatar_url ?? null);

      // 3) My enrolled courses (view)
      const { data: myCourses, error: coursesError } = await supa
        .from("my_courses")
        .select(
          "user_id, id, title, slug, short_description, thumbnail_url, students_count"
        );

      if (coursesError) {
        console.error("Load my_courses error:", coursesError);
        setCourses([]);
        setLoading(false);
        return;
      }

      const courseIds = (myCourses ?? []).map((c) => c.id);
      if (courseIds.length === 0) {
        setCourses([]);
        setLoading(false);
        return;
      }

      // 4) All lessons for those courses
      const [{ data: lessons }, { data: progress }] = await Promise.all([
        supa.from("lessons").select("id, course_id").in("course_id", courseIds),
        supa
          .from("progress")
          .select("course_id, lesson_id, is_completed")
          .eq("user_id", authUser.id)
          .in("course_id", courseIds),
      ]);

      const totalByCourse = new Map<string, number>();
      (lessons ?? []).forEach((l: LessonRow) => {
        totalByCourse.set(
          l.course_id,
          (totalByCourse.get(l.course_id) ?? 0) + 1
        );
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

      const withProgress: CourseWithProgress[] = (myCourses ?? []).map(
        (c: MyCourseRow) => {
          const total = totalByCourse.get(c.id) ?? 0;
          const completed = completedByCourse.get(c.id) ?? 0;
          const percent =
            total > 0 ? Math.round((completed / total) * 100) : 0;
          return {
            ...c,
            totalLessons: total,
            completedLessons: completed,
            progressPercent: percent,
          };
        }
      );

      setCourses(withProgress);
      setLoading(false);
    })();
  }, [router]);

  const filteredCourses = useMemo(() => {
    let list = courses;

    // Filter by sidebar section
    if (section === "courses_active") {
      list = list.filter((c) => c.progressPercent < 100);
    } else if (section === "courses_archived") {
      list = list.filter((c) => c.progressPercent >= 100);
    }

    // Text search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          (c.short_description ?? "").toLowerCase().includes(q)
      );
    }

    return list;
  }, [courses, section, search]);

  const handleLogout = async () => {
    const supa = supabaseBrowser();
    await supa.auth.signOut();
    router.push("/");
  };

  const isCoursesSection =
    section === "courses_all" ||
    section === "courses_active" ||
    section === "courses_archived";

  // on mobile, if user taps "AI AVATAR" we show ComingSoon instead of course grid
  const showCourses = isCoursesSection && mobileTab === "courses";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex pt-0 md:pt-10 mt-14 relative">
      {/* Sidebar – hidden on mobile */}
      <aside className="hidden md:flex w-64 border-r border-gray-200 bg-white flex-col">
        {/* Logo */}
        <div className="h-16 px-6 flex items-center border-b border-gray-100">
          <div className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Logo"
              width={50}
              height={42}
              className="rounded-full"
            />
            <span className="text-sm font-semibold text-gray-900">
              Talk&apos;N&apos;Win
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 text-sm">
          <p className="px-3 mb-2 text-[11px] font-semibold text-gray-400 uppercase">
            Courses
          </p>
          <SidebarItem
            active={section === "courses_all"}
            onClick={() => setSection("courses_all")}
          >
            All courses
          </SidebarItem>
          <SidebarItem
            active={section === "courses_active"}
            onClick={() => setSection("courses_active")}
          >
            Active courses
          </SidebarItem>
          <SidebarItem
            active={section === "courses_archived"}
            onClick={() => setSection("courses_archived")}
          >
            Archived courses
          </SidebarItem>

          <div className="mt-6">
            <p className="px-3 mb-2 text-[11px] font-semibold text-gray-400 uppercase">
              More
            </p>
            <SidebarItem
              active={section === "practice_tests"}
              onClick={() => setSection("practice_tests")}
            >
              Practical tests
            </SidebarItem>
            <SidebarItem
              active={section === "community"}
              onClick={() => setSection("community")}
            >
              Community
            </SidebarItem>
          </div>
        </nav>

        {/* Bottom: logout + user */}
        <div className="border-t border-gray-100 p-3 space-y-3">
          <button
            onClick={handleLogout}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-gray-900 px-3 py-2 text-xs font-medium text-white hover:bg-black"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>

          <button
            onClick={() => router.push("/account")}
            className="w-full flex items-center gap-3 rounded-2xl px-2 py-2 hover:bg-gray-50 text-left"
          >
            <div className="h-9 w-9 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-xs font-semibold text-gray-600">
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt={userName}
                  width={36}
                  height={36}
                  className="h-9 w-9 object-cover"
                />
              ) : (
                (userName || "U").charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-900">
                {userName}
              </div>
              <div className="text-[11px] text-gray-500">View account</div>
            </div>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 pt-8 pb-24 px-4 sm:px-8">
        {/* Mobile section tabs (All / Active / Archived) */}
        <div className="mb-4 md:hidden">
          <div className="inline-flex rounded-full bg-white shadow-sm border border-gray-100 p-1 text-xs">
            <MobileSectionTab
              label="All"
              active={section === "courses_all"}
              onClick={() => setSection("courses_all")}
            />
            <MobileSectionTab
              label="Active"
              active={section === "courses_active"}
              onClick={() => setSection("courses_active")}
            />
            <MobileSectionTab
              label="Archived"
              active={section === "courses_archived"}
              onClick={() => setSection("courses_archived")}
            />
          </div>
        </div>

        {showCourses ? (
          <>
            {/* Header & search */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {section === "courses_all"
                    ? "All courses"
                    : section === "courses_active"
                    ? "Active courses"
                    : "Archived courses"}
                </h1>
                <p className="mt-1 text-xs text-gray-500">
                  Browse the courses you&apos;ve purchased.
                </p>
              </div>

              <div className="w-full sm:w-80 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for a chapter, course or package"
                  className="w-full rounded-full border border-gray-200 pl-9 pr-3 py-2 text-xs outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                />
              </div>
            </div>

            {/* Course grid */}
            {filteredCourses.length === 0 ? (
              <div className="rounded-3xl bg-white border border-gray-100 p-10 text-center text-sm text-gray-600">
                {section === "courses_archived"
                  ? "You haven’t completed any courses yet."
                  : "No courses found. Start by purchasing a course from the catalog."}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredCourses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onClick={() =>
                      router.push(`/dashboard/course/${course.slug}`)
                    }
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <ComingSoonSection />
        )}
      </main>

      {/* MOBILE bottom nav – only on dashboard */}
      <MobileBottomNav
        currentTab={mobileTab}
        userName={userName}
        onChangeTab={(t) => {
          setMobileTab(t);
          if (t === "courses") {
            setShowMoreSheet(false);
          } else if (t === "test") {
            // just show ComingSoon in center, keep section as-is
          } else if (t === "profile") {
            router.push("/account");
          } else if (t === "more") {
            setShowMoreSheet(true);
          }
        }}
      />

      {/* MOBILE "More" sheet */}
      {showMoreSheet && (
        <div
          className="fixed inset-0 z-50 bg-black/30 md:hidden"
          onClick={() => {
            setShowMoreSheet(false);
            setMobileTab("courses");
          }}
        >
          <div
            className="absolute inset-x-0 bottom-0 rounded-t-3xl bg-white p-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-gray-700">MORE</p>
              <button
                onClick={() => {
                  setShowMoreSheet(false);
                  setMobileTab("courses");
                }}
                className="h-8 w-8 rounded-full border border-gray-200 flex items-center justify-center text-[11px] text-gray-600"
              >
                Close
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                setSection("community");
                setShowMoreSheet(false);
                setMobileTab("courses");
              }}
              className="flex w-full items-center justify-between rounded-2xl border border-gray-100 px-3 py-3 text-xs text-gray-800 mb-2"
            >
              <span className="inline-flex items-center gap-2">
                <MessageCircle className="h-4 w-4" />
                Community
              </span>
              <ChevronRight className="h-3 w-3 text-gray-400" />
            </button>

            <button
              type="button"
              onClick={() => {
                router.push("/wishlist");
                setShowMoreSheet(false);
                setMobileTab("courses");
              }}
              className="flex w-full items-center justify-between rounded-2xl border border-gray-100 px-3 py-3 text-xs text-gray-800"
            >
              <span className="inline-flex items-center gap-2">
                <Bookmark className="h-4 w-4" />
                Bookmarks
              </span>
              <ChevronRight className="h-3 w-3 text-gray-400" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== small subcomponents ===== */

function SidebarItem({
  active,
  children,
  onClick,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center justify-between rounded-full px-3 py-2 text-xs mb-1
        ${
          active
            ? "bg-gray-900 text-white font-semibold"
            : "text-gray-700 hover:bg-gray-100"
        }`}
    >
      <span>{children}</span>
      {active && (
        <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_0_3px_rgba(16,185,129,0.3)]" />
      )}
    </button>
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
      className="flex flex-col rounded-2xl bg-white border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition"
      onClick={onClick}
    >
      <div className="relative h-40 w-full bg-gray-100">
        <Image
          src={getThumbnailUrl(course.thumbnail_url)}
          alt={course.title}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="flex-1 p-4 flex flex-col gap-2">
        <h2 className="text-sm font-semibold text-gray-900 line-clamp-2">
          {course.title}
        </h2>
        {course.short_description && (
          <p className="text-xs text-gray-600 line-clamp-2">
            {course.short_description}
          </p>
        )}

        <div className="mt-2">
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

        <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500">
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

function ComingSoonSection() {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="w-full max-w-md">
        <Lottie
          animationData={comingSoonAnimation}
          loop
          style={{ width: "100%", height: "auto" }}
        />
      </div>
      <p className="mt-4 text-sm font-semibold text-gray-800">
        Coming soon!
      </p>
      <p className="mt-1 text-xs text-gray-500 max-w-sm text-center">
        More dashboard features like AI Avatar, practical tests and
        community are on the way. For now, enjoy your courses from the
        Courses tab.
      </p>
    </div>
  );
}

/* Mobile helpers */

function MobileSectionTab({
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
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs font-medium ${
        active
          ? "bg-purple-600 text-white shadow-sm"
          : "text-gray-700 hover:bg-gray-100"
      }`}
    >
      {label}
    </button>
  );
}

function MobileBottomNav({
  currentTab,
  onChangeTab,
  userName,
}: {
  currentTab: MobileTab;
  onChangeTab: (tab: MobileTab) => void;
  userName: string;
}) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-40 border-t border-gray-200 bg-white px-4 py-2 md:hidden">
      <div className="flex items-center justify-between text-[11px]">
        <MobileNavItem
          label="COURSES"
          active={currentTab === "courses"}
          onClick={() => onChangeTab("courses")}
        />
        <MobileNavItem
          label="Practice Test"
          active={currentTab === "test"}
          onClick={() => onChangeTab("test")}
        />
        <MobileNavItem
          label="MORE"
          active={currentTab === "more"}
          onClick={() => onChangeTab("more")}
        />
        <button
          onClick={() => onChangeTab("profile")}
          className="flex flex-col items-center gap-1"
        >
          <div className="h-7 w-7 rounded-full bg-purple-100 flex items-center justify-center text-[11px] font-semibold text-purple-700">
            {(userName || "U").charAt(0).toUpperCase()}
          </div>
          <span className="text-[10px] text-gray-700">Profile</span>
        </button>
      </div>
    </div>
  );
}

function MobileNavItem({
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
      className={`flex flex-col items-center gap-1 ${
        active ? "text-purple-600" : "text-gray-600"
      }`}
    >
      <div
        className={`h-1 w-10 rounded-full ${
          active ? "bg-purple-500" : "bg-transparent"
        }`}
      />
      <span className="text-[10px] font-medium tracking-wide">{label}</span>
    </button>
  );
}
