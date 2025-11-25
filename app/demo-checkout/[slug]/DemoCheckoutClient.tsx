"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
// import { createClient } from "@supabase/supabase-js";
import { supabaseServer } from "@/lib/supabase-course";
import { Loader2, CheckCircle2, Sparkles, Clock, Video } from "lucide-react";

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

interface DemoClass {
  id: string;
  title: string;
  slug: string;
  thumbnail_url: string | null;
  price: number;
  duration_minutes: number;
  instructor_name: string;
  next_session_date: string | null;
}

type Props = {
  demoClass: DemoClass;
};

export default function DemoCheckoutClient({ demoClass }: Props) {
  const router = useRouter();
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const isFree = demoClass.price === 0;

  // Load user and profile
  useEffect(() => {
    const supabase = supabaseServer();
    (async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push(
          `/login?mode=login&redirect=/demo-checkout/${demoClass.slug}`
        );
        return;
      }
      setUser(data.user);

      const { data: prof } = await supabase
        .from("profiles")
        .select("full_name, phone")
        .eq("id", data.user.id)
        .single();

      setFullName(prof?.full_name || "");
      setPhone(prof?.phone || "");
      setEmail(data.user.email || "");

      setLoading(false);
    })();
  }, [demoClass.slug, router]);

  // Load Razorpay script (only if paid)
  useEffect(() => {
    if (isFree) return;
    if (typeof window === "undefined") return;
    if (window.Razorpay) return;

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, [isFree]);

  const handleEnroll = async () => {
    setError(null);

    if (!fullName || !email || !phone) {
      setError("Please fill all required fields.");
      return;
    }

    if (!user) {
      router.push(
        `/login?mode=login&redirect=/demo-checkout/${demoClass.slug}`
      );
      return;
    }

    setPaying(true);

    try {
      if (isFree) {
        // Direct enrollment for free demo
        const supabase = supabaseServer();
        const { error: enrollError } = await supabase
          .from("demo_enrollments")
          .insert({
            user_id: user.id,
            demo_class_id: demoClass.id,
            payment_status: "free",
            amount_paid: 0,
          });

        if (enrollError) throw enrollError;

        setShowSuccess(true);
        setPaying(false);
      } else {
        // Paid enrollment via Razorpay
        if (!window.Razorpay) {
          setError("Payment SDK not loaded yet. Please wait a moment.");
          setPaying(false);
          return;
        }

        // Create order
        const checkoutRes = await fetch("/api/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mode: "demo", // 🔥 Add this
            demoClassId: demoClass.id,
            userId: user.id,
          }),
        });

        const checkoutData = await checkoutRes.json();
        if (!checkoutRes.ok) {
          throw new Error(checkoutData.error || "Failed to start payment.");
        }

        const { key, orderId, amount, currency } = checkoutData;

        const options = {
          key,
          amount,
          currency,
          name: "Talk and Win",
          description: demoClass.title,
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
                  mode: "demo", // 🔥 Add this
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  demoClassId: demoClass.id,
                  userId: user.id,
                  amount,
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
      }
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Enrollment failed. Please try again.");
      setPaying(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-600" />
      </div>
    );
  }

  const sessionDate = demoClass.next_session_date
    ? new Date(demoClass.next_session_date).toLocaleDateString("en-IN", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "To be announced";

  return (
    <main className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-white to-purple-50 pt-24 pb-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-4 text-xs text-gray-500">
          Home ▸ Demo Classes ▸ {demoClass.title} ▸{" "}
          <span className="text-gray-800 font-medium">
            {isFree ? "Book Your Spot" : "Payment"}
          </span>
        </div>

        {/* Header with sparkles */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-fuchsia-100 to-purple-100 border border-fuchsia-200 mb-3">
            <Sparkles className="h-4 w-4 text-fuchsia-600" />
            <span className="text-sm font-semibold bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
              {isFree ? "CLAIM YOUR FREE SPOT" : "SECURE YOUR SPOT"}
            </span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            {isFree ? "Book Your Free Demo Class" : "Complete Your Enrollment"}
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-8">
          {/* Left: Form */}
          <section className="rounded-3xl bg-white shadow-lg border border-gray-100 p-8 space-y-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-1">
                Your Information
              </h2>
              <p className="text-sm text-gray-500">
                We'll use this to send you joining details
              </p>
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
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

            {!isFree && (
              <div className="pt-4 border-t border-gray-100">
                <h2 className="text-lg font-semibold text-gray-900 mb-3">
                  Payment Method
                </h2>
                <div className="rounded-2xl border border-dashed border-purple-200 bg-purple-50/50 p-6 text-center">
                  <p className="text-sm text-gray-600">
                    💳 Secure payment via <strong>Razorpay</strong>
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Supports UPI, Cards, Net Banking & more
                  </p>
                </div>
              </div>
            )}

            {error && (
              <div className="rounded-2xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="button"
              onClick={handleEnroll}
              disabled={paying}
              className="w-full group relative overflow-hidden rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {paying && (
                <Loader2 className="mr-2 h-5 w-5 animate-spin inline" />
              )}
              {isFree ? "Confirm Free Enrollment" : "Proceed to Payment"}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-fuchsia-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>

            {isFree && (
              <p className="text-center text-xs text-gray-500">
                🎉 No payment required • Join instantly
              </p>
            )}
          </section>

          {/* Right: Summary */}
          <aside className="space-y-6">
            {/* Class Card */}
            <div className="rounded-3xl bg-white shadow-lg border border-gray-100 p-6 space-y-4">
              <div className="flex items-start gap-4 pb-4 border-b border-gray-100">
                <div className="relative h-20 w-28 flex-shrink-0 overflow-hidden rounded-2xl bg-gradient-to-br from-fuchsia-400 to-purple-600">
                  {demoClass.thumbnail_url ? (
                    <img
                      src={demoClass.thumbnail_url}
                      alt={demoClass.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <Video className="h-8 w-8 text-white opacity-50" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-gray-400 uppercase tracking-wide">
                    Demo Class
                  </p>
                  <h3 className="text-base font-bold text-gray-900 line-clamp-2 mt-1">
                    {demoClass.title}
                  </h3>
                  <p className="text-xs text-purple-600 font-medium mt-2">
                    with {demoClass.instructor_name}
                  </p>
                </div>
              </div>

              {/* Session Details */}
              <div className="space-y-3 py-2">
                <div className="flex items-center gap-3 text-sm">
                  <Clock className="h-5 w-5 text-fuchsia-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Duration</p>
                    <p className="font-semibold text-gray-900">
                      {demoClass.duration_minutes} minutes
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Video className="h-5 w-5 text-purple-600 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Next Session</p>
                    <p className="font-semibold text-gray-900 text-xs">
                      {sessionDate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="pt-4 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">
                    {isFree ? "Registration Fee" : "Demo Class Fee"}
                  </span>
                  <span className="text-2xl font-bold bg-gradient-to-r from-fuchsia-600 to-purple-600 bg-clip-text text-transparent">
                    {isFree ? "FREE" : `₹${demoClass.price}`}
                  </span>
                </div>
                {!isFree && (
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    <span className="line-through">₹999</span> • Save 90%
                  </p>
                )}
              </div>
            </div>

            {/* Benefits Card */}
            <div className="rounded-3xl bg-gradient-to-br from-fuchsia-50 to-purple-50 border border-fuchsia-100 p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">
                ✨ What's Included
              </h3>
              <div className="space-y-3">
                {[
                  "Live interactive session",
                  "Direct Q&A with instructor",
                  "Practice exercises",
                  "Certificate of participation",
                  "Lifetime recording access",
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <CheckCircle2 className="h-4 w-4 text-fuchsia-600 flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-3xl bg-white px-8 py-10 text-center shadow-2xl animate-scale-in">
            <div className="flex justify-center mb-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-r from-fuchsia-100 to-purple-100 flex items-center justify-center">
                <CheckCircle2 className="h-10 w-10 text-fuchsia-600" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              🎉 You're All Set!
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Welcome aboard! We've sent the joining details to{" "}
              <strong>{email}</strong>
            </p>
            <div className="space-y-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-600 px-6 py-3 text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all"
              >
                Go to Dashboard
              </button>
              <button
                onClick={() => router.push("/")}
                className="w-full rounded-full border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 hover:border-purple-500 hover:text-purple-600 transition-all"
              >
                Back to Home
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-scale-in {
          animation: scale-in 0.3s ease-out forwards;
        }
      `}</style>
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
    <label className="block text-sm text-gray-700">
      <span className="font-medium">{label}</span>
      <input
        className="mt-2 w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-fuchsia-500 focus:ring-2 focus:ring-fuchsia-100 transition-all"
        {...rest}
      />
    </label>
  );
}
