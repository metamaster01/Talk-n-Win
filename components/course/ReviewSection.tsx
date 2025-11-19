// "use client";

// import { Star, StarHalf, UserCircle } from "lucide-react";

// type Review = {
//   id: string;
//   name: string;
//   rating: number;
//   comment: string;
//   created_at: string;
// };

// export default function ReviewsSection({
//   reviews,
// }: {
//   reviews: Review[];
// }) {
//   const total = reviews.length;
//   const avg =
//     total === 0
//       ? 0
//       : reviews.reduce((acc, r) => acc + r.rating, 0) / total;

//   const ratingsCount = [5, 4, 3, 2, 1].map((star) => ({
//     star,
//     count: reviews.filter((r) => r.rating === star).length,
//   }));

//   return (
//     <section id="reviews-section" className="scroll-mt-24 mt-20">
//       <h2 className="text-xl font-semibold text-neutral-900">Reviews</h2>

//       {/* Header */}
//       <div className="mt-6 flex flex-col gap-10 md:flex-row">
//         {/* AVG RATING */}
//         <div className="rounded-3xl bg-neutral-50 px-6 py-6 shadow-sm md:w-[300px]">
//           <p className="text-5xl font-bold text-purple-600">
//             {avg.toFixed(1)}
//           </p>
//           <Stars rating={avg} size={22} />
//           <p className="mt-1 text-xs text-neutral-500">{total} reviews</p>
//         </div>

//         {/* BARS */}
//         <div className="flex-1 space-y-3">
//           {ratingsCount.map((r) => {
//             const percent = total ? (r.count / total) * 100 : 0;
//             return (
//               <div
//                 key={r.star}
//                 className="flex items-center gap-3 text-xs"
//               >
//                 <span className="w-8 font-semibold">{r.star}★</span>
//                 <div className="h-2 flex-1 rounded-full bg-neutral-200">
//                   <div
//                     className="h-full rounded-full bg-purple-600"
//                     style={{ width: `${percent}%` }}
//                   />
//                 </div>
//                 <span className="w-10 text-neutral-500">{r.count}</span>
//               </div>
//             );
//           })}
//         </div>
//       </div>

//       {/* Reviews list */}
//       <div className="mt-12 space-y-8">
//         {reviews.map((rev) => (
//           <div
//             key={rev.id}
//             className="rounded-3xl border p-6 shadow-sm"
//           >
//             <div className="flex items-center gap-3">
//               <UserCircle className="h-10 w-10 text-neutral-400" />
//               <div>
//                 <p className="font-medium text-neutral-900">
//                   {rev.name}
//                 </p>
//                 <Stars rating={rev.rating} size={16} />
//                 <p className="text-xs text-neutral-500">
//                   {new Date(rev.created_at).toDateString()}
//                 </p>
//               </div>
//             </div>

//             <p className="mt-4 text-sm text-neutral-700">
//               {rev.comment}
//             </p>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// }

// function Stars({ rating, size = 18 }: { rating: number; size?: number }) {
//   const full = Math.floor(rating);
//   const half = rating % 1 >= 0.5;

//   return (
//     <div className="flex items-center gap-0.5">
//       {Array.from({ length: full }).map((_, i) => (
//         <Star key={i} size={size} className="text-yellow-400 fill-yellow-400" />
//       ))}

//       {half && (
//         <StarHalf size={size} className="text-yellow-400 fill-yellow-400" />
//       )}

//       {Array.from({ length: 5 - full - (half ? 1 : 0) }).map((_, i) => (
//         <Star
//           key={i + "empty"}
//           size={size}
//           className="text-neutral-300"
//         />
//       ))}
//     </div>
//   );
// }


"use client";

import { Star, StarHalf, UserCircle } from "lucide-react";
import type { CourseReview } from "@/lib/supabase-course";

export default function ReviewsSection({ reviews }: { reviews: CourseReview[] }) {
  const total = reviews.length;
  const avg =
    total === 0
      ? 0
      : reviews.reduce((acc, r) => acc + (r.rating || 0), 0) / total;

  const ratingsCount = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => r.rating === star).length,
  }));

  return (
    <section id="reviews-section" className="scroll-mt-24 mt-20">
      <h2 className="text-xl font-semibold text-neutral-900">Reviews</h2>

      {/* Header: average + bars */}
      <div className="mt-6 flex flex-col gap-10 md:flex-row">
        {/* Average card */}
        <div className="rounded-3xl bg-neutral-50 px-6 py-6 shadow-sm md:w-[300px]">
          <p className="text-5xl font-bold text-purple-600">
            {avg.toFixed(1)}
          </p>
          <Stars rating={avg} size={22} />
          <p className="mt-1 text-xs text-neutral-500">{total} reviews</p>
        </div>

        {/* Star distribution bars */}
        <div className="flex-1 space-y-3">
          {ratingsCount.map((r) => {
            const percent = total ? (r.count / total) * 100 : 0;
            return (
              <div
                key={r.star}
                className="flex items-center gap-3 text-xs"
              >
                <span className="w-8 font-semibold">{r.star}★</span>
                <div className="h-2 flex-1 rounded-full bg-neutral-200">
                  <div
                    className="h-full rounded-full bg-purple-600"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="w-10 text-neutral-500">{r.count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Review cards */}
      <div className="mt-12 space-y-8">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="rounded-3xl border p-6 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <UserCircle className="h-10 w-10 text-neutral-400" />
              <div>
                <p className="font-medium text-neutral-900">
                  {rev.display_name || "Anonymous learner"}
                </p>
                <Stars rating={rev.rating} size={16} />
                <p className="text-xs text-neutral-500">
                  {new Date(rev.created_at).toDateString()}
                </p>
              </div>
            </div>

            {rev.comment && (
              <p className="mt-4 text-sm text-neutral-700">
                {rev.comment}
              </p>
            )}
          </div>
        ))}

        {reviews.length === 0 && (
          <p className="text-sm text-neutral-500">
            No reviews yet. Learners who complete this course can leave a
            review from their dashboard.
          </p>
        )}
      </div>
    </section>
  );
}

function Stars({ rating, size = 18 }: { rating: number; size?: number }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: full }).map((_, i) => (
        <Star key={i} size={size} className="text-yellow-400 fill-yellow-400" />
      ))}

      {half && (
        <StarHalf size={size} className="text-yellow-400 fill-yellow-400" />
      )}

      {Array.from({ length: 5 - full - (half ? 1 : 0) }).map((_, i) => (
        <Star
          key={i + "empty"}
          size={size}
          className="text-neutral-300"
        />
      ))}
    </div>
  );
}
