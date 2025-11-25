"use client";

import { useEffect, useState, useMemo } from "react";
// import { createClient } from "@supabase/supabase-js";
// import { supabaseServer } from "@/lib/supabase-course";
import { supabaseServer } from "@/lib/supabase-browser";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Trash2, Loader2 } from "lucide-react";

// function supabaseServer() {
//   return createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//   );
// }

type CartItemWithCourse = {
  id: string;
  course: {
    id: string;
    title: string;
    slug: string;
    short_description: string | null;
    thumbnail_url: string | null;
    price: number;
    mrp: number | null;
  };
};

export default function CartPage() {
  const router = useRouter();
  const [userLoaded, setUserLoaded] = useState(false);
  const [items, setItems] = useState<CartItemWithCourse[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  useEffect(() => {
    const supa = supabaseServer();
    (async () => {
      const { data } = await supa.auth.getUser();
      if (!data.user) {
        router.push("/login?mode=login&redirect=/cart");
        return;
      }

      setUserLoaded(true);

      const { data: cartData, error } = await supa
        .from("cart_items")
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
        console.error("Cart load error:", error);
        setLoading(false);
        return;
      }

      // 🔥 Normalize thumbnail_url → Supabase public URL
      const rows = (cartData as any[]) || [];
      const bucket = supa.storage.from("public-thumbnails");

      const normalized = rows.map((row) => {
        const c = row.course;
        if (c?.thumbnail_url && !/^https?:\/\//i.test(c.thumbnail_url)) {
          const { data: pub } = bucket.getPublicUrl(c.thumbnail_url);
          c.thumbnail_url = pub?.publicUrl || c.thumbnail_url;
        }
        return row;
      });

      setItems(normalized);
      setLoading(false);
    })();
  }, [router]);

  const totals = useMemo(() => {
    let mrpTotal = 0;
    let priceTotal = 0;
    items.forEach((item) => {
      const p = Number(item.course.price) || 0;
      const m = Number(item.course.mrp ?? item.course.price) || 0;
      priceTotal += p;
      mrpTotal += m;
    });
    const savings = Math.max(0, mrpTotal - priceTotal);
    const discountPct =
      mrpTotal > 0 ? Math.round((savings / mrpTotal) * 100) : 0;
    return { mrpTotal, priceTotal, savings, discountPct };
  }, [items]);

  const removeItem = async (id: string) => {
    const supa = supabaseServer();
    const { error } = await supa.from("cart_items").delete().eq("id", id);
    if (error) {
      console.error("Remove cart error:", error);
      showToast("Could not remove item. Please try again.");
      return;
    }
    setItems((prev) => prev.filter((it) => it.id !== id));
    showToast("Course removed from cart.");
  };

  const proceedToCheckout = () => {
    if (items.length === 0) return;
    // const first = items[0];
    router.push(`/checkout/cart`);
  };

  if (loading || !userLoaded) {
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
          Shopping Cart
        </h1>

        {items.length === 0 ? (
          <div className="rounded-3xl bg-white border border-gray-100 p-8 text-center text-sm text-gray-600">
            Your cart is empty. Browse{" "}
            <button
              onClick={() => router.push("/courses")}
              className="text-purple-600 font-semibold hover:underline"
            >
              courses
            </button>{" "}
            to get started.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-8">
            {/* Left: list of courses */}
            <section className="space-y-4">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="flex gap-4 rounded-2xl bg-white border border-gray-100 p-4 shadow-sm"
                >
                  <div className="relative h-24 w-40 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                    <Image
                      src={
                        item.course.thumbnail_url ??
                        "https://picsum.photos/seed/cart/400/250"
                      }
                      alt={item.course.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
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

                    <div className="mt-2 flex items-center justify-between">
                      <div className="text-sm font-semibold text-gray-900">
                        ₹{Number(item.course.price).toLocaleString("en-IN")}
                        {item.course.mrp && (
                          <span className="ml-2 text-xs text-gray-400 line-through">
                            ₹{Number(item.course.mrp).toLocaleString("en-IN")}
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="inline-flex items-center gap-1 text-xs text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            {/* Right: summary */}
            <aside className="h-fit rounded-3xl bg-white border border-gray-100 p-6 shadow-sm space-y-4">
              <h2 className="text-sm font-semibold text-gray-900">
                Order Summary
              </h2>

              <div className="space-y-2 text-xs text-gray-700">
                <div className="flex justify-between">
                  <span>Items ({items.length})</span>
                  <span>₹{totals.mrpTotal.toLocaleString("en-IN")}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="text-emerald-600">
                    -₹{totals.savings.toLocaleString("en-IN")}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-3 flex items-center justify-between text-sm font-semibold text-gray-900">
                <span>Total</span>
                <span>₹{totals.priceTotal.toLocaleString("en-IN")}</span>
              </div>

              {totals.savings > 0 && (
                <p className="text-[11px] text-emerald-600">
                  You&apos;re saving ₹{totals.savings.toLocaleString("en-IN")} (
                  {totals.discountPct}% off)
                </p>
              )}

              <button
                type="button"
                onClick={proceedToCheckout}
                disabled={items.length === 0}
                className="mt-2 w-full rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg disabled:opacity-60"
              >
                Proceed to Checkout
              </button>
            </aside>
          </div>
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
