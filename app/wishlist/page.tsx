"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Trash2 } from "lucide-react";

function supabaseBrowser() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

type WishlistItemWithCourse = {
  id: string;
  course: {
    id: string;
    title: string;
    slug: string;
    short_description: string | null;
    thumbnail_url: string | null;
    price: number;
    mrp: number | null;
    category_name?: string | null;
  };
};

export default function WishlistPage() {
  const router = useRouter();
  const [items, setItems] = useState<WishlistItemWithCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    const supa = supabaseBrowser();
    (async () => {
      const { data } = await supa.auth.getUser();
      if (!data.user) {
        router.push("/login?mode=login&redirect=/wishlist");
        return;
      }

      const { data: wishData, error } = await supa
        .from("wishlist_items")
        .select(
          `
          id,
          course:courses (
            id,
            title,
            slug,
            short_description,
            thumbnail_url,
            price,
            mrp
          )
        `
        )
        .eq("user_id", data.user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Wishlist load error:", error);
        setLoading(false);
        return;
      }

      // 🔥 Normalize thumbnail_url → Supabase public URL
      const bucket = supa.storage.from("public-thumbnails");

      const normalized =
        (wishData as any[])?.map((row) => {
          const c = row.course;
          if (c?.thumbnail_url && !/^https?:\/\//i.test(c.thumbnail_url)) {
            const { data: pub } = bucket.getPublicUrl(c.thumbnail_url);
            c.thumbnail_url = pub?.publicUrl || c.thumbnail_url;
          }
          return row;
        }) || [];

      setItems(normalized);
      setLoading(false);
    })();
  }, [router]);

  const removeItem = async (id: string) => {
    const supa = supabaseBrowser();
    const { error } = await supa
      .from("wishlist_items")
      .delete()
      .eq("id", id);
    if (error) {
      console.error("Remove wishlist error:", error);
      showToast("Could not remove item. Please try again.");
      return;
    }
    setItems((prev) => prev.filter((it) => it.id !== id));
    showToast("Removed from wishlist.");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16 px-4 mt-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Wishlist
        </h1>

        {items.length === 0 ? (
          <div className="rounded-3xl bg-white border border-gray-100 p-8 text-center text-sm text-gray-600">
            Your wishlist is empty. Save a course you like from the course
            page.
          </div>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {items.map((item) => (
              <article
                key={item.id}
                className="flex flex-col overflow-hidden rounded-2xl bg-white border border-gray-100 shadow-sm"
              >
                <div className="relative h-40 w-full">
                  <Image
                    src={
                      item.course.thumbnail_url ??
                      "https://picsum.photos/seed/wishlist/600/400"
                    }
                    alt={item.course.title}
                    fill
                    className="object-cover"
                    unoptimized
                    loading="eager"
                  />
                </div>
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h2 className="text-sm font-semibold text-gray-900 line-clamp-2">
                      {item.course.title}
                    </h2>
                    {item.course.short_description && (
                      <p className="mt-1 text-xs text-gray-600 line-clamp-2">
                        {item.course.short_description}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 flex items-center justify-between text-sm">
                    <div className="font-semibold text-gray-900">
                      ₹{Number(item.course.price).toLocaleString("en-IN")}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          router.push(`/courses/${item.course.slug}`)
                        }
                        className="text-xs font-semibold text-purple-600 hover:underline"
                      >
                        View Course
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="text-xs text-red-500 hover:text-red-600 inline-flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-neutral-900 px-4 py-2 text-xs font-medium text-white shadow-lg">
          {toast}
        </div>
      )}
    </main>
  );
}
