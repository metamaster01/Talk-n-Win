import { fetchDemoClassBySlug } from "@/lib/supabase-course";
import DemoCheckoutClient from "./DemoCheckoutClient";

export const dynamic = "force-dynamic";

type Params = { slug: string };

export default async function DemoCheckoutPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const demoClass = await fetchDemoClassBySlug(slug);

  if (!demoClass) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Demo Class Not Found</h1>
          <p className="text-gray-600">The demo class you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return <DemoCheckoutClient demoClass={demoClass} />;
}