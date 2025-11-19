// "use client";

// import { motion } from "framer-motion";
// import {
//   BadgeCheck,
//   Clock3,
//   Languages,
//   GraduationCap,
//   Users,
// } from "lucide-react";
// import AuthDialog from "./AuthDialog";
// import { useState } from "react";
// import type { PublicCourse } from "@/lib/supabase-course";
// import { createClient } from "@supabase/supabase-js";

// function client() {
//   return createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//   );
// }

// export default function CourseSidebar({ course }: { course: PublicCourse }) {
//   const [authOpen, setAuthOpen] = useState(false);

//   const onBuy = async () => {
//     // If not logged in, open auth
//     const { data } = await client().auth.getUser();
//     if (!data.user) {
//       setAuthOpen(true);
//       return;
//     }
//     // TODO: call /api/checkout with { course_id: course.id }
//     // For now, just open auth or show a toast.
//   };

//   return (
//     <div className="rounded-2xl bg-white shadow-lg ring-1 ring-black/5">
//       <div className="flex flex-col gap-4 p-5">
//         {/* Price */}
//         <div>
//           {course.mrp && (
//             <div className="text-sm text-neutral-400 line-through">
//               ₹{Number(course.mrp).toLocaleString("en-IN")}
//             </div>
//           )}
//           <div className="text-2xl font-bold">
//             ₹{Number(course.price).toLocaleString("en-IN")}
//           </div>
//         </div>

//         <button
//           onClick={onBuy}
//           className="w-full rounded-xl bg-purple-600 px-4 py-3 text-white shadow hover:bg-purple-700"
//         >
//           Buy Now
//         </button>

//         <div className="mt-2 grid grid-cols-2 gap-3 text-sm text-neutral-700">
//           <div className="flex items-center gap-2">
//             <Clock3 className="h-4 w-4 text-purple-600" />
//             {Math.round((course.duration_minutes ?? 0) / 60)} hrs
//           </div>
//           <div className="flex items-center gap-2">
//             <Users className="h-4 w-4 text-purple-600" />
//             {course.students_count} students
//           </div>
//           <div className="flex items-center gap-2">
//             <Languages className="h-4 w-4 text-purple-600" />
//             {course.language ?? "English"}
//           </div>
//           <div className="flex items-center gap-2">
//             <BadgeCheck className="h-4 w-4 text-purple-600" />
//             {course.certificate_provided ? "Certificate" : "—"}
//           </div>
//         </div>

//         <div className="mt-2 rounded-xl border border-neutral-200 p-3 text-xs text-neutral-600">
//           All courses include 30-day money-back guarantee, lifetime access and
//           downloadable resources.
//         </div>
//       </div>

//       {/* Auth modal */}
//       <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
//     </div>
//   );
// }


// "use client";

// import { useState, useMemo } from "react";
// import { createClient } from "@supabase/supabase-js";
// import {
//   BadgeCheck,
//   Clock3,
//   Languages,
//   Users,
//   GraduationCap,
//   ArrowRight,
//   BadgePercent,
// } from "lucide-react";
// import AuthDialog from "./AuthDialog";
// import type { PublicCourse } from "@/lib/supabase-course";

// function client() {
//   return createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL!,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
//   );
// }

// type Props = {
//   course: PublicCourse;
// };

// export default function CourseSidebar({ course }: Props) {
//   const [authOpen, setAuthOpen] = useState(false);

//   const discount = useMemo(() => {
//     if (!course.mrp || !course.price) return null;
//     const pct = Math.round(((course.mrp - course.price) / course.mrp) * 100);
//     if (!Number.isFinite(pct) || pct <= 0) return null;
//     return pct;
//   }, [course.mrp, course.price]);

//   const durationLabel = useMemo(() => {
//     const mins = course.duration_minutes ?? 0;
//     if (!mins) return "Self-paced";
//     const hours = Math.round(mins / 60);
//     if (hours >= 10) {
//       const weeks = Math.max(1, Math.round(hours / 10));
//       return `${weeks} weeks`;
//     }
//     return `${hours} hours`;
//   }, [course.duration_minutes]);

//   const subtitleLabel =
//     course.subtitle_languages && course.subtitle_languages.length > 0
//       ? course.subtitle_languages.join(", ")
//       : "English";

//   const onBuy = async () => {
//     const { data } = await client().auth.getUser();
//     if (!data.user) {
//       setAuthOpen(true);
//       return;
//     }
//     // TODO: call /api/checkout with { course_id: course.id }
//   };

//   const onEnroll = async () => {
//     const { data } = await client().auth.getUser();
//     if (!data.user) {
//       setAuthOpen(true);
//       return;
//     }
//     // TODO: if already purchased, redirect to dashboard
//   };

//   return (
//     <>
//       <aside className="rounded-3xl bg-white shadow-xl ring-1 ring-black/5">
//         {/* Price + discount */}
//         <div className="flex items-start justify-between gap-2 border-b px-6 pb-4 pt-5">
//           <div>
//             <div className="flex items-baseline gap-2">
//               <span className="text-2xl font-bold text-neutral-900">
//                 ₹{Number(course.price).toLocaleString("en-IN")}
//               </span>
//               {course.mrp && (
//                 <span className="text-xs text-neutral-400 line-through">
//                   ₹{Number(course.mrp).toLocaleString("en-IN")}
//                 </span>
//               )}
//             </div>
//             <p className="mt-1 text-xs font-medium text-rose-500">
//               2 days left at this price!
//             </p>
//           </div>

//           {discount && (
//             <div className="flex items-center gap-1 rounded-full bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-500">
//               <BadgePercent className="h-3 w-3" />
//               {discount}% OFF
//             </div>
//           )}
//         </div>

//         {/* Meta list */}
//         <div className="space-y-2 border-b px-6 py-4 text-xs text-neutral-700">
//           <MetaRow
//             label="Course Duration"
//             value={durationLabel}
//             icon={<Clock3 className="h-4 w-4 text-purple-600" />}
//           />
//           <MetaRow
//             label="Course Level"
//             value={
//               course.level
//                 ? course.level === "beginner"
//                   ? "Beginner"
//                   : course.level === "intermediate"
//                   ? "Intermediate"
//                   : "Advanced"
//                 : "All levels"
//             }
//             icon={<GraduationCap className="h-4 w-4 text-purple-600" />}
//           />
//           <MetaRow
//             label="Students Enrolled"
//             value={`${course.students_count ?? 0}`}
//             icon={<Users className="h-4 w-4 text-purple-600" />}
//           />
//           <MetaRow
//             label="Language"
//             value={course.language ?? "English"}
//             icon={<Languages className="h-4 w-4 text-purple-600" />}
//           />
//           <MetaRow
//             label="Subtitle Language"
//             value={subtitleLabel}
//             icon={<Languages className="h-4 w-4 text-purple-600" />}
//           />
//           <MetaRow
//             label="Certificate"
//             value={course.certificate_provided ? "Provided" : "Not included"}
//             icon={<BadgeCheck className="h-4 w-4 text-purple-600" />}
//           />
//         </div>

//         {/* Buttons */}
//         <div className="space-y-2 border-b px-6 py-4">
//           <button
//             type="button"
//             className="w-full rounded-full bg-purple-50 px-4 py-2 text-sm font-semibold text-purple-700 transition hover:bg-purple-100"
//           >
//             Add To Cart
//           </button>
//           {/* <button
//             type="button"
//             // onClick={onBuy}
//             className="w-full rounded-full bg-purple-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-purple-700"
//           >
//             Buy Now
//           </button> */}
//           <button
//             type="button"
//             onClick={onEnroll}
//             className="w-full rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black"
//           >
//             Enroll Now
//           </button>
//           <button
//             type="button"
//             className="w-full rounded-full border border-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-700 transition hover:border-purple-500 hover:text-purple-700"
//           >
//             Add To Wishlist
//           </button>

//           <p className="mt-2 text-[11px] text-neutral-500">
//             Note: all courses have 30-days money-back guarantee.
//           </p>
//         </div>

//         {/* This course includes */}
//         <div className="space-y-2 border-b px-6 py-4">
//           <h4 className="text-sm font-semibold text-neutral-900">
//             This course includes:
//           </h4>
//           <ul className="space-y-1 text-xs text-neutral-700">
//             <li>• Lifetime access</li>
//             <li>• 30-days money-back guarantee</li>
//             <li>• Free exercise files &amp; downloadable resources</li>
//             <li>• Shareable certificate of completion</li>
//             <li>• Access on mobile, tablet and TV</li>
//             <li>• English subtitles</li>
//             <li>• 100% online course</li>
//           </ul>
//         </div>

//         {/* Share section */}
//         <div className="flex items-center justify-between gap-3 px-6 py-4">
//           <span className="text-xs font-medium text-neutral-700">
//             Share this course:
//           </span>
//           <div className="flex items-center gap-2">
//             <ShareChip label="Copy link" />
//             <ShareCircle label="F" />
//             <ShareCircle label="X" />
//             <ShareCircle label="@" />
//             <ShareCircle label="✉" />
//           </div>
//         </div>
//       </aside>

//       <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
//     </>
//   );
// }

// function MetaRow({
//   icon,
//   label,
//   value,
// }: {
//   icon: React.ReactNode;
//   label: string;
//   value: string;
// }) {
//   return (
//     <div className="flex items-center justify-between gap-3">
//       <div className="flex items-center gap-2">
//         {icon}
//         <span className="text-[11px] text-neutral-500">{label}</span>
//       </div>
//       <span className="text-[11px] font-medium text-neutral-800">{value}</span>
//     </div>
//   );
// }

// function ShareChip({ label }: { label: string }) {
//   return (
//     <button className="rounded-full bg-purple-50 px-3 py-1 text-[11px] font-medium text-purple-700 hover:bg-purple-100">
//       {label}
//     </button>
//   );
// }

// function ShareCircle({ label }: { label: string }) {
//   return (
//     <button className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-50 text-[11px] font-semibold text-purple-700 hover:bg-purple-100">
//       {label}
//     </button>
//   );
// }


"use client";

import { useState, useMemo, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  BadgeCheck,
  Clock3,
  Languages,
  Users,
  GraduationCap,
  BadgePercent,
  Check,
  Heart,
} from "lucide-react";
import { useRouter } from "next/navigation";
import AuthDialog from "./AuthDialog";
import type { PublicCourse } from "@/lib/supabase-course";

function client() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

type Props = {
  course: PublicCourse;
};

export default function CourseSidebar({ course }: Props) {
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);

  const [userId, setUserId] = useState<string | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);

  const [isEnrolled, setIsEnrolled] = useState(false);
  const [inCart, setInCart] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);

  const [cartLoading, setCartLoading] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);

  const [toast, setToast] = useState<string | null>(null);

  const discount = useMemo(() => {
    if (!course.mrp || !course.price) return null;
    const pct = Math.round(((course.mrp - course.price) / course.mrp) * 100);
    if (!Number.isFinite(pct) || pct <= 0) return null;
    return pct;
  }, [course.mrp, course.price]);

  const durationLabel = useMemo(() => {
    const mins = course.duration_minutes ?? 0;
    if (!mins) return "Self-paced";
    const hours = Math.round(mins / 60);
    if (hours >= 10) {
      const weeks = Math.max(1, Math.round(hours / 10));
      return `${weeks} weeks`;
    }
    return `${hours} hours`;
  }, [course.duration_minutes]);

  const subtitleLabel =
    course.subtitle_languages && course.subtitle_languages.length > 0
      ? course.subtitle_languages.join(", ")
      : "English";

  // small toast helper
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  // Load initial status: user, enrollment, cart, wishlist
  useEffect(() => {
    const supa = client();

    (async () => {
      const { data } = await supa.auth.getUser();
      if (!data.user) {
        setInitialLoading(false);
        return;
      }
      const uid = data.user.id as string;
      setUserId(uid);

      const [enrolledRes, cartRes, wishlistRes] = await Promise.all([
        supa
          .from("enrollments") // change if your table name differs
          .select("id")
          .eq("user_id", uid)
          .eq("course_id", course.id)
          .maybeSingle(),
        supa
          .from("cart_items")
          .select("id")
          .eq("user_id", uid)
          .eq("course_id", course.id)
          .maybeSingle(),
        supa
          .from("wishlist_items")
          .select("id")
          .eq("user_id", uid)
          .eq("course_id", course.id)
          .maybeSingle(),
      ]);

      if (enrolledRes.data) setIsEnrolled(true);
      if (cartRes.data) setInCart(true);
      if (wishlistRes.data) setInWishlist(true);

      setInitialLoading(false);
    })();
  }, [course.id]);

  const requireAuth = async () => {
    const supa = client();
    const { data } = await supa.auth.getUser();
    if (!data.user) {
      setAuthOpen(true);
      return null;
    }
    return data.user.id as string;
  };

  const onEnroll = async () => {
    const uid = userId ?? (await requireAuth());
    if (!uid) return;

    if (isEnrolled) {
      // Already purchased → go to dashboard / course
      router.push("/dashboard");
      return;
    }

    // new purchase → checkout
    router.push(`/checkout/${course.slug}`);
  };

  const onAddToCart = async () => {
    if (inCart || cartLoading) return;
    const uid = userId ?? (await requireAuth());
    if (!uid) return;

    setCartLoading(true);
    const supa = client();

    const { error } = await supa.from("cart_items").insert({
      user_id: uid,
      course_id: course.id,
    });

    setCartLoading(false);

    if (error) {
      console.error("Add to cart error:", error);
      showToast("Could not add to cart. Please try again.");
      return;
    }

    setInCart(true);
    showToast("Course added to cart.");
  };

  const onAddToWishlist = async () => {
    if (inWishlist || wishlistLoading) return;
    const uid = userId ?? (await requireAuth());
    if (!uid) return;

    setWishlistLoading(true);
    const supa = client();

    const { error } = await supa.from("wishlist_items").insert({
      user_id: uid,
      course_id: course.id,
    });

    setWishlistLoading(false);

    if (error) {
      console.error("Add to wishlist error:", error);
      showToast("Could not add to wishlist. Please try again.");
      return;
    }

    setInWishlist(true);
    showToast("Course added to wishlist.");
  };

  return (
    <>
      <aside className="rounded-3xl bg-white shadow-xl ring-1 ring-black/5">
        {/* Price + discount */}
        <div className="flex items-start justify-between gap-2 border-b px-6 pb-4 pt-5">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-neutral-900">
                ₹{Number(course.price).toLocaleString("en-IN")}
              </span>
              {course.mrp && (
                <span className="text-xs text-neutral-400 line-through">
                  ₹{Number(course.mrp).toLocaleString("en-IN")}
                </span>
              )}
            </div>
            <p className="mt-1 text-xs font-medium text-rose-500">
              2 days left at this price!
            </p>
          </div>

          {discount && (
            <div className="flex items-center gap-1 rounded-full bg-rose-50 px-2 py-1 text-[11px] font-semibold text-rose-500">
              <BadgePercent className="h-3 w-3" />
              {discount}% OFF
            </div>
          )}
        </div>

        {/* Meta list */}
        <div className="space-y-2 border-b px-6 py-4 text-xs text-neutral-700">
          <MetaRow
            label="Course Duration"
            value={durationLabel}
            icon={<Clock3 className="h-4 w-4 text-purple-600" />}
          />
          <MetaRow
            label="Course Level"
            value={
              course.level
                ? course.level === "beginner"
                  ? "Beginner"
                  : course.level === "intermediate"
                  ? "Intermediate"
                  : "Advanced"
                : "All levels"
            }
            icon={<GraduationCap className="h-4 w-4 text-purple-600" />}
          />
          <MetaRow
            label="Students Enrolled"
            value={`${course.students_count ?? 0}`}
            icon={<Users className="h-4 w-4 text-purple-600" />}
          />
          <MetaRow
            label="Language"
            value={course.language ?? "English"}
            icon={<Languages className="h-4 w-4 text-purple-600" />}
          />
          <MetaRow
            label="Subtitle Language"
            value={subtitleLabel}
            icon={<Languages className="h-4 w-4 text-purple-600" />}
          />
          <MetaRow
            label="Certificate"
            value={course.certificate_provided ? "Provided" : "Not included"}
            icon={<BadgeCheck className="h-4 w-4 text-purple-600" />}
          />
        </div>

        {/* Buttons */}
        <div className="space-y-2 border-b px-6 py-4">
          {/* Add to cart */}
          <button
            type="button"
            onClick={onAddToCart}
            disabled={inCart || cartLoading || initialLoading}
            className={`w-full rounded-full px-4 py-2 text-sm font-semibold transition flex items-center justify-center gap-2 ${
              inCart
                ? "bg-emerald-50 text-emerald-700 cursor-default"
                : "bg-purple-50 text-purple-700 hover:bg-purple-100"
            }`}
          >
            {inCart ? (
              <>
                <Check className="h-4 w-4" />
                Added to Cart
              </>
            ) : (
              <>Add To Cart</>
            )}
          </button>

          {/* Enroll / Go to course */}
          <button
            type="button"
            onClick={onEnroll}
            disabled={initialLoading}
            className="w-full rounded-full bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black flex items-center justify-center gap-2"
          >
            {isEnrolled ? (
              <>
                <Check className="h-4 w-4" />
                Go to my course
              </>
            ) : (
              <>Enroll Now</>
            )}
          </button>

          {/* Wishlist */}
          <button
            type="button"
            onClick={onAddToWishlist}
            disabled={inWishlist || wishlistLoading || initialLoading}
            className={`w-full rounded-full border px-4 py-2 text-sm font-semibold transition flex items-center justify-center gap-2 ${
              inWishlist
                ? "border-pink-200 text-pink-600 bg-pink-50 cursor-default"
                : "border-neutral-200 text-neutral-700 hover:border-purple-500 hover:text-purple-700"
            }`}
          >
            <Heart
              className={`h-4 w-4 ${
                inWishlist ? "fill-pink-500 text-pink-500" : ""
              }`}
            />
            {inWishlist ? "Added to Wishlist" : "Add To Wishlist"}
          </button>

          <p className="mt-2 text-[11px] text-neutral-500">
            Note: all courses have 30-days money-back guarantee.
          </p>
        </div>

        {/* This course includes */}
        <div className="space-y-2 border-b px-6 py-4">
          <h4 className="text-sm font-semibold text-neutral-900">
            This course includes:
          </h4>
          <ul className="space-y-1 text-xs text-neutral-700">
            <li>• Lifetime access</li>
            <li>• 30-days money-back guarantee</li>
            <li>• Free exercise files &amp; downloadable resources</li>
            <li>• Shareable certificate of completion</li>
            <li>• Access on mobile, tablet and TV</li>
            <li>• English subtitles</li>
            <li>• 100% online course</li>
          </ul>
        </div>

        {/* Share section */}
        <div className="flex items-center justify-between gap-3 px-6 py-4">
          <span className="text-xs font-medium text-neutral-700">
            Share this course:
          </span>
          <div className="flex items-center gap-2">
            <ShareChip label="Copy link" />
            <ShareCircle label="F" />
            <ShareCircle label="X" />
            <ShareCircle label="@" />
            <ShareCircle label="✉" />
          </div>
        </div>
      </aside>

      {/* Auth modal */}
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />

      {/* Simple toast */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-neutral-900 px-4 py-2 text-xs font-medium text-white shadow-lg">
          {toast}
        </div>
      )}
    </>
  );
}

function MetaRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        {icon}
        <span className="text-[11px] text-neutral-500">{label}</span>
      </div>
      <span className="text-[11px] font-medium text-neutral-800">{value}</span>
    </div>
  );
}

function ShareChip({ label }: { label: string }) {
  return (
    <button className="rounded-full bg-purple-50 px-3 py-1 text-[11px] font-medium text-purple-700 hover:bg-purple-100">
      {label}
    </button>
  );
}

function ShareCircle({ label }: { label: string }) {
  return (
    <button className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-50 text-[11px] font-semibold text-purple-700 hover:bg-purple-100">
      {label}
    </button>
  );
}
