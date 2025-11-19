// // app/api/verify-payment/route.ts
// // import { NextResponse } from "next/server";
// // import crypto from "crypto";
// // import { supabaseAdmin } from "@/lib/supabase-server";

// // const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;

// // export async function POST(req: Request) {
// //   try {
// //     const {
// //       razorpay_order_id,
// //       razorpay_payment_id,
// //       razorpay_signature,
// //       courseId,
// //       userId,
// //       amount,
// //     } = await req.json();

// //     if (
// //       !razorpay_order_id ||
// //       !razorpay_payment_id ||
// //       !razorpay_signature ||
// //       !courseId ||
// //       !userId
// //     ) {
// //       return NextResponse.json(
// //         { error: "Missing payment data" },
// //         { status: 400 }
// //       );
// //     }

// //     // 1) Verify signature
// //     const body = `${razorpay_order_id}|${razorpay_payment_id}`;
// //     const expectedSignature = crypto
// //       .createHmac("sha256", RAZORPAY_KEY_SECRET)
// //       .update(body)
// //       .digest("hex");

// //     if (expectedSignature !== razorpay_signature) {
// //       console.error("Signature mismatch", {
// //         expectedSignature,
// //         razorpay_signature,
// //       });
// //       return NextResponse.json(
// //         { error: "Invalid payment signature" },
// //         { status: 400 }
// //       );
// //     }

// //     const supabase = supabaseAdmin();

// //     // 2) Record payment
// //     const { error: payError } = await supabase.from("payments").insert({
// //       user_id: userId,
// //       course_id: courseId,
// //       amount: amount / 100, // paise -> INR
// //       currency: "INR",
// //       payment_provider: "razorpay",
// //       payment_id: razorpay_payment_id,
// //       status: "success",
// //       provider_order_id: razorpay_order_id,
// //     });

// //     if (payError) {
// //       console.error("Payment insert error:", payError);
// //     }

// //     // 3) Enroll user (idempotent – ignore duplicate)
// //     const { error: enrollError } = await supabase
// //       .from("enrollments") // or 'enrolled' if that's your table name
// //       .insert({
// //         user_id: userId,
// //         course_id: courseId,
// //       })
// //       .select()
// //       .single();

// //     if (enrollError && enrollError.code !== "23505") {
// //       // 23505: unique violation – already enrolled
// //       console.error("Enrollment insert error:", enrollError);
// //     }

// //     return NextResponse.json({ ok: true });
// //   } catch (err) {
// //     console.error("Verify payment error:", err);
// //     return NextResponse.json(
// //       { error: "Unexpected server error" },
// //       { status: 500 }
// //     );
// //   }
// // }


// // app/api/verify-payment/route.ts
// import { NextResponse } from "next/server";
// import crypto from "crypto";
// import { supabaseAdmin } from "@/lib/supabase-server";

// const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();

//     const mode = (body.mode ?? "single") as "single" | "cart";
//     const {
//       razorpay_order_id,
//       razorpay_payment_id,
//       razorpay_signature,
//       courseId,
//       courseIds, // for cart
//       userId,
//       amount, // paise
//     } = body;

//     if (
//       !razorpay_order_id ||
//       !razorpay_payment_id ||
//       !razorpay_signature ||
//       !userId ||
//       !amount
//     ) {
//       return NextResponse.json(
//         { error: "Missing payment data" },
//         { status: 400 }
//       );
//     }

//     if (mode === "single" && !courseId) {
//       return NextResponse.json(
//         { error: "courseId required for single mode" },
//         { status: 400 }
//       );
//     }

//     if (mode === "cart" && (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0)) {
//       return NextResponse.json(
//         { error: "courseIds required for cart mode" },
//         { status: 400 }
//       );
//     }

//     // 1) Verify signature
//     const signBody = `${razorpay_order_id}|${razorpay_payment_id}`;
//     const expectedSignature = crypto
//       .createHmac("sha256", RAZORPAY_KEY_SECRET)
//       .update(signBody)
//       .digest("hex");

//     if (expectedSignature !== razorpay_signature) {
//       console.error("Signature mismatch", {
//         expectedSignature,
//         razorpay_signature,
//       });
//       return NextResponse.json(
//         { error: "Invalid payment signature" },
//         { status: 400 }
//       );
//     }

//     const supabase = supabaseAdmin();
//     const paidAmountInINR = amount / 100;

//     if (mode === "single") {
//       // 2) Record payment (single course)
//       const { error: payError } = await supabase.from("payments").insert({
//         user_id: userId,
//         course_id: courseId,
//         amount: paidAmountInINR,
//         currency: "INR",
//         payment_provider: "razorpay",
//         payment_id: razorpay_payment_id,
//         status: "success",
//         provider_order_id: razorpay_order_id,
//       });

//       if (payError) {
//         console.error("Payment insert error:", payError);
//       }

//       // 3) Enroll user (idempotent)
//       const { error: enrollError } = await supabase
//         .from("enrollments") // 🔁 or "enrollments" if that's your table
//         .insert({
//           user_id: userId,
//           course_id: courseId,
//         });

//       if (enrollError && enrollError.code !== "23505") {
//         // 23505: unique violation – already enrolled
//         console.error("Enrollment insert error:", enrollError);
//       }
//     } else {
//       // CART MODE
//       const ids: string[] = courseIds;
//       const perCourseAmount =
//         ids.length > 0 ? paidAmountInINR / ids.length : paidAmountInINR;

//       for (const cid of ids) {
//         // Payment per course (same payment_id)
//         const { error: payError } = await supabase.from("payments").insert({
//           user_id: userId,
//           course_id: cid,
//           amount: perCourseAmount,
//           currency: "INR",
//           payment_provider: "razorpay",
//           payment_id: razorpay_payment_id,
//           status: "success",
//           provider_order_id: razorpay_order_id,
//         });

//         if (payError) {
//           console.error("Cart payment insert error:", cid, payError);
//         }

//         // Enroll per course (ignore duplicates)
//         const { error: enrollError } = await supabase
//           .from("enrollements") // 🔁 or "enrollments"
//           .insert({
//             user_id: userId,
//             course_id: cid,
//           });

//         if (enrollError && enrollError.code !== "23505") {
//           console.error("Cart enrollment error:", cid, enrollError);
//         }
//       }

//       // Clear cart for these courses
//       const { error: clearError } = await supabase
//         .from("cart_items")
//         .delete()
//         .eq("user_id", userId)
//         .in("course_id", ids);

//       if (clearError) {
//         console.error("Cart clear error:", clearError);
//       }
//     }

//     return NextResponse.json({ ok: true });
//   } catch (err) {
//     console.error("Verify payment error:", err);
//     return NextResponse.json(
//       { error: "Unexpected server error" },
//       { status: 500 }
//     );
//   }
// }

import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase-server";

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const mode = (body.mode ?? "single") as "single" | "cart";
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
      courseIds, // for cart
      userId,
      amount, // paise
    } = body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature ||
      !userId ||
      !amount
    ) {
      return NextResponse.json(
        { error: "Missing payment data" },
        { status: 400 }
      );
    }

    if (mode === "single" && !courseId) {
      return NextResponse.json(
        { error: "courseId required for single mode" },
        { status: 400 }
      );
    }

    if (
      mode === "cart" &&
      (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0)
    ) {
      return NextResponse.json(
        { error: "courseIds required for cart mode" },
        { status: 400 }
      );
    }

    // 1) Verify signature
    const signBody = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(signBody)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("Signature mismatch", {
        expectedSignature,
        razorpay_signature,
      });
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();
    const paidAmountInINR = amount / 100;

    if (mode === "single") {
      // 2) Record payment (single course)
      const { error: payError } = await supabase.from("payments").insert({
        user_id: userId,
        course_id: courseId,
        amount: paidAmountInINR,
        currency: "INR",
        payment_provider: "razorpay",
        payment_id: razorpay_payment_id,
        // 🔥 MUST be one of: 'pending' | 'paid' | 'failed' | 'refunded'
        status: "paid",
        provider_order_id: razorpay_order_id,
      });

      if (payError) {
        console.error("Payment insert error:", payError);
      }

      // 3) Enroll user (idempotent)
      const { error: enrollError } = await supabase
        .from("enrollments") // ✅ your real table
        .insert({
          user_id: userId,
          course_id: courseId,
        });

      if (enrollError && enrollError.code !== "23505") {
        // 23505: unique violation – already enrolled
        console.error("Enrollment insert error:", enrollError);
      }
    } else {
      // CART MODE
      const ids: string[] = courseIds;
      const perCourseAmount =
        ids.length > 0 ? paidAmountInINR / ids.length : paidAmountInINR;

      for (const cid of ids) {
        // Payment per course (same payment_id)
        const { error: payError } = await supabase.from("payments").insert({
          user_id: userId,
          course_id: cid,
          amount: perCourseAmount,
          currency: "INR",
          payment_provider: "razorpay",
          payment_id: razorpay_payment_id,
          status: "paid", // 🔥 use a valid status here too
          provider_order_id: razorpay_order_id,
        });

        if (payError) {
          console.error("Cart payment insert error:", cid, payError);
        }

        // Enroll per course (ignore duplicates)
        const { error: enrollError } = await supabase
          .from("enrollments") // ✅ fixed spelling
          .insert({
            user_id: userId,
            course_id: cid,
          });

        if (enrollError && enrollError.code !== "23505") {
          console.error("Cart enrollment error:", cid, enrollError);
        }
      }

      // Clear cart for these courses
      const { error: clearError } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", userId)
        .in("course_id", ids);

      if (clearError) {
        console.error("Cart clear error:", clearError);
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Verify payment error:", err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
