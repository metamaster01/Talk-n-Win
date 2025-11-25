"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
// import { createClient } from "@supabase/supabase-js";
// import { supabaseServer } from "@/lib/supabase-course";
import { supabaseServer } from "@/lib/supabase-course";
// import { supabaseServer } from "@/lib/supabase-browser";
import { Loader2, CheckCircle2 } from "lucide-react";
import Image from "next/image";

// function supabaseServer() {
//   return createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//   );
// }

declare global {
  interface Window {
    Razorpay: any;
  }
}

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

export default function CheckoutCartClient() {
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [items, setItems] = useState<CartItemWithCourse[]>([]);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

    const [paymentMethod, setPaymentMethod] = useState<
    "card" | "upi" | "netbanking"
  >("card");

  // Load user + profile + cart items
  useEffect(() => {
    const supa = supabaseServer();
    (async () => {
      const { data } = await supa.auth.getUser();
      if (!data.user) {
        router.push("/login?mode=login&redirect=/checkout/cart");
        return;
      }
      setUser(data.user);

      const { data: prof } = await supa
        .from("profiles")
        .select("full_name, phone")
        .eq("id", data.user.id)
        .single();

      setFullName(prof?.full_name || "");
      setPhone(prof?.phone || "");
      setEmail(data.user.email || "");

      const { data: cartData, error: cartError } = await supa
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

      if (cartError) {
        console.error("Cart for checkout error:", cartError);
      }

      const rows = (cartData as any[]) || [];

      // Normalize thumbnails (Supabase storage)
      const bucket = supa.storage.from("public-thumbnails");
      rows.forEach((row) => {
        const c = row.course;
        if (c?.thumbnail_url && !/^https?:\/\//i.test(c.thumbnail_url)) {
          const { data: pub } = bucket.getPublicUrl(c.thumbnail_url);
          c.thumbnail_url = pub?.publicUrl || c.thumbnail_url;
        }
      });

      setItems(rows);
      setLoading(false);
    })();
  }, [router]);

  // Load Razorpay script
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.Razorpay) return;

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const total = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + Number(item.course.price || 0),
      0
    );
  }, [items]);

  const mrpTotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const m = item.course.mrp ?? item.course.price;
      return sum + Number(m || 0);
    }, 0);
  }, [items]);

  const savings = Math.max(0, mrpTotal - total);
  const discountPct =
    mrpTotal > 0 ? Math.round((savings / mrpTotal) * 100) : 0;

  const handlePay = async () => {
    setError(null);

    if (!fullName || !email || !phone) {
      setError("Please fill all required fields.");
      return;
    }

    if (!window.Razorpay) {
      setError("Payment SDK not loaded yet. Please wait a moment.");
      return;
    }

    if (!user) {
      router.push("/login?mode=login&redirect=/checkout/cart");
      return;
    }

    if (items.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setPaying(true);

    try {
      // 1) Create order on server in CART mode
      const checkoutRes = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "cart",
          userId: user.id,
          
        }),
      });

      const checkoutData = await checkoutRes.json();

      if (!checkoutRes.ok) {
        console.error("Checkout error payload:", checkoutData);
        throw new Error(checkoutData.error || "Failed to start payment.");
      }

      const { key, orderId, amount, currency, courseIds } = checkoutData;

      const options = {
        key,
        amount,
        currency,
        name: "Trupti Academy",
        description: `${items.length} course(s) from Trupti Academy`,
        order_id: orderId,
        prefill: {
          name: fullName,
          email,
          contact: phone,
        },
        theme: {
          color: "#a855f7",
        },
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch("/api/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                mode: "cart",
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                userId: user.id,
                amount, // paise
                courseIds: courseIds,
              }),
            });

            const verifyData = await verifyRes.json();
            if (!verifyRes.ok) {
              throw new Error(
                verifyData.error || "Payment verification failed."
              );
            }

            setShowSuccess(true);
          } catch (err: any) {
            console.error(err);
            setError(
              err?.message || "Payment succeeded but verification failed."
            );
          } finally {
            setPaying(false);
          }
        },
        modal: {
          ondismiss: function () {
            setPaying(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Payment failed. Please try again.");
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-purple-600" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">
            Payment Information
          </h1>
          <div className="rounded-3xl bg-white border border-gray-100 p-8 text-center text-sm text-gray-600">
            Your cart is empty.{" "}
            <button
              onClick={() => router.push("/courses")}
              className="text-purple-600 font-semibold hover:underline"
            >
              Browse courses
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-4 text-xs text-gray-500">
          Home ▸ Cart ▸ <span className="text-gray-800 font-medium">Payment</span>
        </div>

        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
          Payment Information
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-8">
          {/* Left: Recipient + payment method */}
          <section className="rounded-3xl bg-white shadow-sm border border-gray-100 p-6 space-y-6">
            <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Recipient&apos;s Information
              </h2>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field
                  label="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Your full name"
                />
                <Field
                  label="Email address"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
                <Field
                  label="Phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91XXXXXXXXXX"
                />
                <Field label="Country" value="India" readOnly />
              </div>
            </div>

                      <div>
              <h2 className="text-sm font-semibold text-gray-900">
                Payment Method
              </h2>
              <p className="mt-2 text-xs text-gray-500">
                Payments are securely handled by Razorpay. You can choose UPI,
                card, or netbanking in the next step.
              </p>

              <div className="mt-4 space-y-2">
                {/* Card */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("card")}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-xs transition
        ${
          paymentMethod === "card"
            ? "border-purple-500 bg-purple-50"
            : "border-gray-200 hover:border-purple-300"
        }`}
                >
                  <div>
                    <div className="font-semibold text-gray-900 text-[13px]">
                      Credit / Debit Card
                    </div>
                    <div className="mt-1 text-[11px] text-gray-500">
                      Visa, Mastercard, Rupay
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-gray-400">
                    <span
                      className={`h-3 w-3 rounded-full border ${
                        paymentMethod === "card"
                          ? "border-purple-600 bg-purple-600"
                          : "border-gray-300"
                      }`}
                    />
                  </div>
                </button>

                {/* UPI */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("upi")}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-xs transition
        ${
          paymentMethod === "upi"
            ? "border-purple-500 bg-purple-50"
            : "border-gray-200 hover:border-purple-300"
        }`}
                >
                  <div>
                    <div className="font-semibold text-gray-900 text-[13px]">
                      UPI Apps
                    </div>
                    <div className="mt-1 text-[11px] text-gray-500">
                      PhonePe, Google Pay, Paytm, BHIM
                    </div>
                  </div>
                  <span
                    className={`h-3 w-3 rounded-full border ${
                      paymentMethod === "upi"
                        ? "border-purple-600 bg-purple-600"
                        : "border-gray-300"
                    }`}
                  />
                </button>

                {/* Netbanking */}
                <button
                  type="button"
                  onClick={() => setPaymentMethod("netbanking")}
                  className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-left text-xs transition
        ${
          paymentMethod === "netbanking"
            ? "border-purple-500 bg-purple-50"
            : "border-gray-200 hover:border-purple-300"
        }`}
                >
                  <div>
                    <div className="font-semibold text-gray-900 text-[13px]">
                      Netbanking
                    </div>
                    <div className="mt-1 text-[11px] text-gray-500">
                      All major Indian banks
                    </div>
                  </div>
                  <span
                    className={`h-3 w-3 rounded-full border ${
                      paymentMethod === "netbanking"
                        ? "border-purple-600 bg-purple-600"
                        : "border-gray-300"
                    }`}
                  />
                </button>
              </div>
            </div>
            {error && (
              <div className="rounded-xl bg-red-50 px-4 py-3 text-xs text-red-600">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handlePay}
              disabled={paying}
              className="mt-2 inline-flex items-center justify-center rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg disabled:opacity-60"
            >
              {paying && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Complete Payment
            </button>
          </section>

          {/* Right: summary of all courses */}
          <aside className="h-fit rounded-3xl bg-white shadow-sm border border-gray-100 p-6 space-y-4">
            <h2 className="text-sm font-semibold text-gray-900 mb-2">
              Order Summary
            </h2>

            <div className="space-y-3 max-h-[300px] overflow-auto pr-1">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 border-b border-gray-100 pb-3 last:border-0"
                >
                  <div className="relative h-12 w-16 overflow-hidden rounded-xl bg-gray-100">
                    <Image
                      src={
                        item.course.thumbnail_url ??
                        "https://picsum.photos/seed/checkout-cart/200/120"
                      }
                      alt={item.course.title}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xs font-semibold text-gray-900 line-clamp-2">
                      {item.course.title}
                    </h3>
                    <p className="mt-1 text-[11px] text-purple-600 font-medium">
                      ₹
                      {Number(
                        item.course.price
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-1 text-xs text-gray-600 border-t border-gray-100 pt-3">
              <div className="flex justify-between">
                <span>Items ({items.length})</span>
                <span>₹{mrpTotal.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-emerald-600">
                <span>Discount</span>
                <span>
                  −₹{savings.toLocaleString("en-IN")} ({discountPct}%)
                </span>
              </div>
            </div>

            <div className="flex justify-between items-center text-sm font-semibold text-gray-900">
              <span>Total:</span>
              <span>₹{total.toLocaleString("en-IN")}</span>
            </div>
          </aside>
        </div>
      </div>

      {/* Success modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-3xl bg-white px-8 py-8 text-center shadow-2xl">
            <div className="flex justify-center mb-3">
              <CheckCircle2 className="h-8 w-8 text-emerald-500" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Payment Successful!
            </h2>
            <p className="mt-2 text-sm text-gray-700">
              You&apos;re now enrolled in{" "}
              <span className="font-semibold">
                {items.length} course{items.length > 1 ? "s" : ""}
              </span>
              .
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.push("/dashboard")}
                className="flex-1 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => router.push("/courses")}
                className="flex-1 rounded-full border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-800 hover:border-purple-500 hover:text-purple-600"
              >
                Explore More Courses
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function Field(
  props: React.InputHTMLAttributes<HTMLInputElement> & {
    label: string;
  }
) {
  const { label, ...rest } = props;
  return (
    <label className="block text-xs text-gray-600">
      <span>{label}</span>
      <input
        className="mt-1 w-full rounded-full border border-gray-200 px-4 py-2 text-sm outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500"
        {...rest}
      />
    </label>
  );
}
