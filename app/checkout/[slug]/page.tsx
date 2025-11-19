// app/checkout/[slug]/page.tsx
import { fetchCourseBySlug } from "@/lib/supabase-course";
import CheckoutClient from "./CheckoutClient";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export default async function CheckoutPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const course = await fetchCourseBySlug(slug);

  if (!course) {
    return <div className="px-6 py-24">Course not found.</div>;
  }

  return <CheckoutClient course={course} />;
}
