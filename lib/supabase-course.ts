// // lib/supabase-course.ts (server-safe)
// import { createClient } from "@supabase/supabase-js";

// function supabaseServer() {
//   return createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//   );
// }

// export type PublicCourse = {
//   id: string;
//   title: string;
//   slug: string;
//   short_description: string | null;
//   full_description: string | null;
//   thumbnail_url: string | null;
//   price: number;
//   mrp: number | null;
//   duration_minutes: number | null;
//   students_count: number;
//   level: "beginner" | "intermediate" | "advanced" | null;
//   language: string | null;
//   category_id: string | null;
//   author_name: string | null;
//   category_name: string | null;
//   created_at: string;
//   certificate_provided?: boolean;
// };

// export function publicImageURL(pathOrUrl?: string | null): string | null {
//   if (!pathOrUrl) return null;
//   if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl; // already absolute
//   const supabase = supabaseServer();
//   const { data } = supabase.storage
//     .from("public-thumbnails")
//     .getPublicUrl(pathOrUrl);
//   return data.publicUrl ?? null;
// }

// export async function fetchPublicCourses(limit = 12): Promise<PublicCourse[]> {
//   const supabase = supabaseServer();
//   const { data, error } = await supabase
//     .from("public_courses")
//     .select("*")
//     .order("created_at", { ascending: false })
//     .limit(limit);

//   if (error) throw new Error(error.message);

//   return (data ?? []).map((c: any) => ({
//     ...c,
//     thumbnail_url: publicImageURL(c.thumbnail_url),
//   }));
// }

// export async function fetchCourseBySlug(slug: string) {
//   const s = supabaseServer();
//   const { data: c } = await s
//     .from("public_courses")
//     .select("*")
//     .eq("slug", slug)
//     .single();
//   if (!c) return null;
//   // Attach public URL for thumbnail if stored path was saved
//   const { data: p } = s.storage
//     .from("public-thumbnails")
//     .getPublicUrl(c.thumbnail_url || "");
//   c.thumbnail_url = p?.publicUrl || c.thumbnail_url;

//   return c as PublicCourse & { certificate_provided?: boolean };
// }

// export async function fetchRelatedCourses(
//   categoryId: string,
//   excludeCourseId: string,
//   limit = 6
// ) {
//   const s = supabaseServer();
//   const { data } = await s
//     .from("public_courses")
//     .select("*")
//     .eq("category_id", categoryId)
//     .neq("id", excludeCourseId)
//     .limit(limit);
//   return (data || []).map((c: any) => {
//     const { data: pub } = s.storage
//       .from("public-thumbnails")
//       .getPublicUrl(c.thumbnail_url || "");
//     c.thumbnail_url = pub?.publicUrl || c.thumbnail_url;
//     return c;
//   });
// }


import { createClient } from '@supabase/supabase-js';

function supabaseServer() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

export type PublicCourse = {
  id: string;
  title: string;
  slug: string;
  short_description: string | null;
  full_description: string | null;
  thumbnail_url: string | null;

  price: number;
  mrp: number | null;
  duration_minutes: number | null;
  students_count: number;

  level: "beginner" | "intermediate" | "advanced" | null;
  language: string | null;
  subtitle_languages: string[] | null;

  category_id: string | null;
  category_name: string | null;

  author_name: string | null;

  certificate_provided?: boolean;
  created_at: string;

  demo_lesson_id?: string | null;

  overview_lecture_description?: string | null;
  overview_what_you_will_learn?: string[] | null;
  overview_who_should_enroll?: string[] | null;
  overview_highlights?: string[] | null;
};


export function publicImageURL(pathOrUrl?: string | null): string | null {
  if (!pathOrUrl) return null;
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const s = supabaseServer();
  const { data } = s.storage.from('public-thumbnails').getPublicUrl(pathOrUrl);
  return data.publicUrl ?? null;
}

export async function fetchPublicCourses(limit = 12): Promise<PublicCourse[]> {
  const s = supabaseServer();
  const { data, error } = await s
    .from('public_courses')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);

  return (data ?? []).map((c: any) => ({
    ...c,
    thumbnail_url: publicImageURL(c.thumbnail_url),
  }));
}

export async function fetchCourseBySlug(slug: string) {
  const s = supabaseServer();
  const normalized = slug.trim().toLowerCase();

  // try exact match first
  let { data: c, error } = await s
    .from('public_courses')
    .select('*')
    .eq('slug', normalized)
    .maybeSingle();

  // optional relaxed match if you ever have uppercase slugs
  if (!c) {
    const res = await s
      .from('public_courses')
      .select('*')
      .ilike('slug', normalized);
    c = (res.data ?? [])[0];
  }

  if (!c) return null;

  const { data: pub } = s.storage
    .from('public-thumbnails')
    .getPublicUrl(c.thumbnail_url || '');
  c.thumbnail_url = pub?.publicUrl || c.thumbnail_url;

  return c as PublicCourse;
}

export async function fetchRelatedCourses(
  categoryId: string,
  excludeCourseId: string,
  limit = 6
) {
  const s = supabaseServer();
  const { data, error } = await s
    .from('public_courses')
    .select('*')
    .eq('category_id', categoryId)
    .neq('id', excludeCourseId)
    .limit(limit);

  if (error) throw new Error(error.message);

  return (data || []).map((c: any) => {
    const { data: pub } = s.storage
      .from('public-thumbnails')
      .getPublicUrl(c.thumbnail_url || '');
    c.thumbnail_url = pub?.publicUrl || c.thumbnail_url;
    return c as PublicCourse;
  });
}

export type CourseReview = {
  id: string;
  display_name: string | null;
  rating: number;
  comment: string | null;
  created_at: string;
};

export async function fetchCourseReviews(
  courseId: string
): Promise<CourseReview[]> {
  const s = supabaseServer();
  const { data, error } = await s
    .from("reviews")
    .select("id, display_name, rating, comment, created_at")
    .eq("course_id", courseId)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return (data ?? []) as CourseReview[];
}

export async function fetchDemoVideoId(
  demoLessonId: string | null | undefined
): Promise<string | null> {
  if (!demoLessonId) return null;

  const s = supabaseServer();
  const { data, error } = await s
    .from("lessons")
    .select("cloudflare_video_id")
    .eq("id", demoLessonId)
    .single();

  if (error || !data) return null;
  return data.cloudflare_video_id as string | null;
}


