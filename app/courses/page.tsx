import FeaturedCourses from "@/components/FeaturedCourse"; // or FeaturedCourse if you used that filename
import CoursesHero from "@/components/CourseHero";
import { fetchPublicCourses } from "@/lib/supabase-course";

export default async function CoursesPage() {
  const courses = await fetchPublicCourses(24);
  return (
    <main className="min-h-screen bg-white">
      <CoursesHero />
      <div id="catalog" className="px-4 pb-16 pt-8 md:px-8">
        <FeaturedCourses title="All Courses" courses={courses} />
      </div>
    </main>
  );
}
