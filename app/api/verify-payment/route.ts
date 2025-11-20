

// this one is the previous version before edit : 



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

//     if (
//       mode === "cart" &&
//       (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0)
//     ) {
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
//         // 🔥 MUST be one of: 'pending' | 'paid' | 'failed' | 'refunded'
//         status: "paid",
//         provider_order_id: razorpay_order_id,
//       });

//       if (payError) {
//         console.error("Payment insert error:", payError);
//       }

//       // 3) Enroll user (idempotent)
//       const { error: enrollError } = await supabase
//         .from("enrollments") // ✅ your real table
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
//           status: "paid", // 🔥 use a valid status here too
//           provider_order_id: razorpay_order_id,
//         });

//         if (payError) {
//           console.error("Cart payment insert error:", cid, payError);
//         }

//         // Enroll per course (ignore duplicates)
//         const { error: enrollError } = await supabase
//           .from("enrollments") // ✅ fixed spelling
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


// new version after edit :

// app/api/verify-payment/route.ts
import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase-server";

const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const mode = (body.mode ?? "single") as "single" | "cart" | "demo"; // 🔥 Add "demo"
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      courseId,
      courseIds,
      demoClassId, // 🔥 Add demoClassId
      userId,
      amount,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userId || !amount) {
      return NextResponse.json({ error: "Missing payment data" }, { status: 400 });
    }

    if (mode === "single" && !courseId) {
      return NextResponse.json({ error: "courseId required for single mode" }, { status: 400 });
    }

    if (mode === "cart" && (!courseIds || !Array.isArray(courseIds) || courseIds.length === 0)) {
      return NextResponse.json({ error: "courseIds required for cart mode" }, { status: 400 });
    }

    // 🔥 NEW: Validate demo mode
    if (mode === "demo" && !demoClassId) {
      return NextResponse.json({ error: "demoClassId required for demo mode" }, { status: 400 });
    }

    // 1) Verify signature
    const signBody = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac("sha256", RAZORPAY_KEY_SECRET)
      .update(signBody)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("Signature mismatch", { expectedSignature, razorpay_signature });
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    const supabase = supabaseAdmin();
    const paidAmountInINR = amount / 100;

    // 🔥 NEW: Handle demo class enrollment
    if (mode === "demo") {
      // Record enrollment
      const { error: enrollError } = await supabase
        .from("demo_enrollments")
        .insert({
          user_id: userId,
          demo_class_id: demoClassId,
          payment_id: razorpay_payment_id,
          payment_status: "completed",
          amount_paid: paidAmountInINR,
        });

      if (enrollError && enrollError.code !== "23505") {
        console.error("Demo enrollment error:", enrollError);
        return NextResponse.json({ error: "Failed to enroll in demo class" }, { status: 500 });
      }
    }
    else if (mode === "single") {
      // Existing single course logic
      const { error: payError } = await supabase.from("payments").insert({
        user_id: userId,
        course_id: courseId,
        amount: paidAmountInINR,
        currency: "INR",
        payment_provider: "razorpay",
        payment_id: razorpay_payment_id,
        status: "paid",
        provider_order_id: razorpay_order_id,
      });

      if (payError) {
        console.error("Payment insert error:", payError);
      }

      const { error: enrollError } = await supabase
        .from("enrollments")
        .insert({
          user_id: userId,
          course_id: courseId,
        });

      if (enrollError && enrollError.code !== "23505") {
        console.error("Enrollment insert error:", enrollError);
      }
    } 
    else {
      // Existing cart logic
      const ids: string[] = courseIds;
      const perCourseAmount = ids.length > 0 ? paidAmountInINR / ids.length : paidAmountInINR;

      for (const cid of ids) {
        const { error: payError } = await supabase.from("payments").insert({
          user_id: userId,
          course_id: cid,
          amount: perCourseAmount,
          currency: "INR",
          payment_provider: "razorpay",
          payment_id: razorpay_payment_id,
          status: "paid",
          provider_order_id: razorpay_order_id,
        });

        if (payError) {
          console.error("Cart payment insert error:", cid, payError);
        }

        const { error: enrollError } = await supabase
          .from("enrollments")
          .insert({
            user_id: userId,
            course_id: cid,
          });

        if (enrollError && enrollError.code !== "23505") {
          console.error("Cart enrollment error:", cid, enrollError);
        }
      }

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
    return NextResponse.json({ error: "Unexpected server error" }, { status: 500 });
  }
}
