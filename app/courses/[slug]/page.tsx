// import Image from "next/image";
// import FeaturedCourses from "@/components/FeaturedCourse";
// import Curriculum from "@/components/course/Curriculum";
// import CourseSidebar from "@/components/course/CourseSidebar";
// import TabsSection from "@/components/course/TabsSection";
// import { fetchCourseBySlug, fetchRelatedCourses } from "@/lib/supabase-course";

// export const dynamic = "force-dynamic";

// export default async function CourseSlugPage({
//   params,
// }: {
//   params: { slug: string };
// }) {
//   const { slug } = params;
//   const course = await fetchCourseBySlug(slug);
//   if (!course) return <div className="px-6 py-24">Course not found.</div>;

//   const related = await fetchRelatedCourses(course.category_id!, course.id, 6);

//   return (
//     <main className="min-h-screen bg-white">
//       <section className="bg-gradient-to-b from-purple-50 to-white">
//         <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 px-4 pb-10 pt-8 md:px-8 lg:grid-cols-[1fr_380px]">
//           {/* Left main */}
//           <div>
//             <nav className="mb-4 text-xs text-neutral-500">
//               Home ▸ Courses ▸{" "}
//               <span className="text-neutral-900">{course.title}</span>
//             </nav>
//             <h1 className="text-2xl font-bold leading-tight md:text-4xl">
//               {course.title}
//             </h1>
//             {course.full_description && (
//               <p className="mt-3 max-w-3xl text-neutral-600">
//                 {course.full_description}
//               </p>
//             )}

//             {/* Demo video or thumbnail */}
//             <div className="mt-6 overflow-hidden rounded-3xl">
//               <div className="relative aspect-video w-full">
//                 <Image
//                   src={
//                     course.thumbnail_url ??
//                     "https://picsum.photos/seed/fallback/1200/675"
//                   }
//                   alt={course.title}
//                   fill
//                   className="object-cover"
//                   sizes="100vw"
//                   priority
//                 />
//                 {/* A play button overlay – replace with actual player later */}
//                 <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
//                   <div className="h-14 w-14 rounded-full bg-white/90 shadow ring-1 ring-black/10" />
//                 </div>
//               </div>
//             </div>

//             <TabsSection courseId={course.id} />
//             <Curriculum courseId={course.id} />
//           </div>

//           <div>
//             <div className="lg:sticky lg:top-4">
//               <CourseSidebar course={course} />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Related */}
//       {related.length > 0 && (
//         <section className="mx-auto max-w-6xl px-4 pb-20 pt-6 md:px-8">
//           <FeaturedCourses title="Related Courses" courses={related} />
//         </section>
//       )}
//     </main>
//   );
// }

// app/courses/[slug]/page.tsx
import Image from "next/image";
import FeaturedCourses from "@/components/FeaturedCourse"; // keep this import name consistent with your file
import Curriculum from "@/components/course/Curriculum";
import CourseSidebar from "@/components/course/CourseSidebar";
import TabsSection from "@/components/course/TabsSection";
import { fetchCourseBySlug, fetchRelatedCourses } from "@/lib/supabase-course";
import OverviewSection from "@/components/course/OverviewSection";
import InstructorSection from "@/components/course/InstructorSection";
import ReviewsSection from "@/components/course/ReviewSection";
import { fetchCourseReviews , fetchDemoVideoId } from "@/lib/supabase-course";
import CourseHeroPlayer from "@/components/course/CourseHeroSection";

export const dynamic = "force-dynamic";

type RouteParams = { slug: string };

// export default async function CourseSlugPage({
//   params,
// }: {
//   // In your setup, `params` is async. Unwrap it first.
//   params: Promise<RouteParams>;
// }) {
//   const { slug } = await params; // ✅ fixes “params is a Promise” error

//   const course = await fetchCourseBySlug(slug);
//   if (!course) {
//     return <div className="px-6 py-24">Course not found.</div>;
//   }

//   const related = course.category_id
//     ? await fetchRelatedCourses(course.category_id, course.id, 6)
//     : [];

//   const reviews = await fetchCourseReviews(course.id);

//   return (
//     <main className="min-h-screen bg-white py-8 mt-20 ">
//       <section className="bg-gradient-to-b from-purple-50 to-white">
//         <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 pb-10 pt-8 md:px-8 lg:grid-cols-[1fr_380px]">
//           {/* Left main */}
//           <div>
//             <nav className="mb-4 text-xs text-neutral-500">
//               Home ▸ Courses ▸{" "}
//               <span className="text-neutral-900">{course.title}</span>
//             </nav>
//             <h1 className="text-2xl font-bold leading-tight md:text-4xl">
//               {course.title}
//             </h1>
//             {course.full_description && (
//               <p className="mt-3 max-w-3xl text-neutral-600">
//                 {course.full_description}
//               </p>
//             )}
//             {/* Demo video or thumbnail (player can replace this later) */}
//             <div className="mt-6 overflow-hidden rounded-3xl">
//               <div className="relative aspect-video w-full">
//                 <Image
//                   src={
//                     course.thumbnail_url ??
//                     "https://picsum.photos/seed/fallback/1200/675"
//                   }
//                   alt={course.title}
//                   fill
//                   className="object-cover"
//                   sizes="100vw"
//                   priority
//                   unoptimized
//                 />
//                 <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
//                   <div className="h-14 w-14 rounded-full bg-white/90 shadow ring-1 ring-black/10" />
//                 </div>
//               </div>
//             </div>
//             <TabsSection courseId={course.id} />
//             {/* <Curriculum courseId={course.id} /> */}
//             <OverviewSection course={course} /> 
//             <div id="curriculum-section">
//               <Curriculum courseId={course.id} />
//             </div>
//             <div id="instructor-section"> <InstructorSection /> </div>
//             <div id="reviews-section"> <ReviewsSection reviews={reviews} /> </div>
//           </div>

//           {/* Right sticky sidebar */}
//           <div>
//             <div className="lg:sticky lg:top-4">
//               <CourseSidebar course={course} />
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Related */}
//       {related.length > 0 && (
//         <section className="mx-auto max-w-7xl px-4 pb-20 pt-6">
//           <FeaturedCourses title="Related Courses" courses={related} />
//         </section>
//       )}
//     </main>
//   );
// }


export default async function CourseSlugPage({
  params,
}: {
  params: Promise<RouteParams>;
}) {
  const { slug } = await params;

  const course = await fetchCourseBySlug(slug);
  if (!course) {
    return <div className="px-6 py-24">Course not found.</div>;
  }

  const demoVideoId = await fetchDemoVideoId(course.demo_lesson_id ?? null);
  const related = course.category_id
    ? await fetchRelatedCourses(course.category_id, course.id, 6)
    : [];
  const reviews = await fetchCourseReviews(course.id);

  return (
    <main className="min-h-screen bg-white py-8 mt-20 ">
      <section className="bg-gradient-to-b from-purple-50 to-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 pb-10 pt-8 md:px-8 lg:grid-cols-[1fr_380px]">
          {/* Left main */}
          <div>
            <nav className="mb-4 text-xs text-neutral-500">
              Home ▸ Courses ▸{" "}
              <span className="text-neutral-900">{course.title}</span>
            </nav>

            <h1 className="text-2xl font-bold leading-tight md:text-4xl">
              {course.title}
            </h1>

            {course.full_description && (
              <p className="mt-3 max-w-3xl text-neutral-600">
                {course.full_description}
              </p>
            )}

            {/* Hero demo player (thumbnail + Cloudflare video) */}
            <CourseHeroPlayer
              title={course.title}
              thumbnailUrl={course.thumbnail_url}
              defaultVideoId={demoVideoId}
            />

            <TabsSection />

            <OverviewSection course={course} />

            <div id="curriculum-section">
              <Curriculum courseId={course.id} />
            </div>

            <div id="instructor-section">
              <InstructorSection />
            </div>

            <div id="reviews-section">
              <ReviewsSection reviews={reviews} />
            </div>
          </div>

          {/* Right sticky sidebar */}
          <div>
            <div className="lg:sticky lg:top-4">
              <CourseSidebar course={course} />
            </div>
          </div>
        </div>
      </section>

      {/* Related */}
      {related.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 pb-20 pt-6">
          <FeaturedCourses title="Related Courses" courses={related} />
        </section>
      )}
    </main>
  );
}