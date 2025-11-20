import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface DemoClass {
  id: string;
  title: string;
  slug: string;
  description: string;
  short_description: string;
  thumbnail_url: string | null;
  price: number;
  duration_minutes: number;
  instructor_name: string;
  features: string[];
  what_you_learn: string[];
  is_active: boolean;
  max_participants: number | null;
  next_session_date: string | null;
}

export async function fetchDemoClassBySlug(slug: string): Promise<DemoClass | null> {
  const { data, error } = await supabase
    .from("demo_classes")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !data) return null;
  return data;
}