

//orignal and complete file:


// app/api/checkout/route.ts
// import { NextResponse } from "next/server";
// import { supabaseAdmin } from "@/lib/supabase-server";

// const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!;
// const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;

// export async function POST(req: Request) {
//   try {
//     const body = await req.json();
//     const mode = (body.mode ?? "single") as "single" | "cart";
//     const { courseId, userId } = body;

//     if (!userId) {
//       return NextResponse.json(
//         { error: "userId is required" },
//         { status: 400 }
//       );
//     }

//     if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
//       console.error("Razorpay keys are missing");
//       return NextResponse.json(
//         { error: "Razorpay keys not configured on server" },
//         { status: 500 }
//       );
//     }

//     const supabase = supabaseAdmin();

//     let amountInPaise = 0;
//     let description = "";
//     let receipt = "";
//     let courseIds: string[] = [];

//     if (mode === "single") {
//       if (!courseId) {
//         return NextResponse.json(
//           { error: "courseId is required for single mode" },
//           { status: 400 }
//         );
//       }

//       // Single-course checkout: get course price
//       const { data: course, error: courseError } = await supabase
//         .from("courses")
//         .select("id, title, price")
//         .eq("id", courseId)
//         .single();

//       if (courseError || !course) {
//         console.error("Course lookup error:", courseError);
//         return NextResponse.json(
//           { error: "Course not found" },
//           { status: 404 }
//         );
//       }

//       amountInPaise = Math.round(Number(course.price) * 100);
//       if (!amountInPaise || amountInPaise <= 0) {
//         return NextResponse.json(
//           { error: "Invalid course price" },
//           { status: 400 }
//         );
//       }

//       description = course.title;
//       receipt = `c_${course.id.slice(0, 8)}_${Date.now()
//         .toString()
//         .slice(-6)}`;
//       courseIds = [course.id];
//     } else {
//       // CART MODE
//       const { data: cartRows, error: cartError } = await supabase
//         .from("cart_items")
//         .select(
//           `
//           course:courses (
//             id,
//             title,
//             price
//           )
//         `
//         )
//         .eq("user_id", userId);

//       if (cartError) {
//         console.error("Cart fetch error:", cartError);
//         return NextResponse.json(
//           { error: "Failed to load cart items" },
//           { status: 500 }
//         );
//       }

//       const rows = (cartRows as any[]) || [];
//       if (rows.length === 0) {
//         return NextResponse.json(
//           { error: "No items in cart" },
//           { status: 400 }
//         );
//       }

//       let total = 0;
//       const ids: string[] = [];

//       for (const row of rows) {
//         const c = row.course;
//         if (!c || c.price == null) continue;
//         total += Number(c.price);
//         ids.push(c.id);
//       }

//       if (!total || total <= 0 || ids.length === 0) {
//         return NextResponse.json(
//           { error: "Invalid cart total" },
//           { status: 400 }
//         );
//       }

//       amountInPaise = Math.round(total * 100);
//       description = `${ids.length} course(s) from Trupti Academy`;
//       receipt = `cart_${userId.slice(0, 8)}_${Date.now()
//         .toString()
//         .slice(-6)}`;
//       courseIds = ids;
//     }

//     const authHeader =
//       "Basic " +
//       Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString(
//         "base64"
//       );

//     const razorpayRes = await fetch("https://api.razorpay.com/v1/orders", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: authHeader,
//       },
//       body: JSON.stringify({
//         amount: amountInPaise,
//         currency: "INR",
//         receipt,
//         notes: {
//           mode,
//           user_id: userId,
//           course_ids: courseIds.join(","), // truncated-ish
//         },
//       }),
//     });

//     if (!razorpayRes.ok) {
//       const text = await razorpayRes.text();
//       console.error(
//         "Razorpay order error:",
//         razorpayRes.status,
//         razorpayRes.statusText,
//         text
//       );
//       return NextResponse.json(
//         {
//           error: "Failed to create Razorpay order",
//           providerMessage: text,
//         },
//         { status: 500 }
//       );
//     }

//     const order = await razorpayRes.json();

//     return NextResponse.json({
//       mode,
//       key: RAZORPAY_KEY_ID,
//       orderId: order.id,
//       amount: order.amount, // paise
//       currency: order.currency,
//       description,
//       courseIds,
//     });
//   } catch (err) {
//     console.error("Checkout error:", err);
//     return NextResponse.json(
//       { error: "Unexpected server error" },
//       { status: 500 }
//     );
//   }
// }
// 


//this cone coup with demo classes : 

// app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

const RAZORPAY_KEY_ID = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET!;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const mode = (body.mode ?? "single") as "single" | "cart" | "demo"; // 🔥 Add "demo"
    const { courseId, userId, demoClassId } = body; // 🔥 Add demoClassId

    if (!userId) {
      return NextResponse.json(
        { error: "userId is required" },
        { status: 400 }
      );
    }

    if (!RAZORPAY_KEY_ID || !RAZORPAY_KEY_SECRET) {
      console.error("Razorpay keys are missing");
      return NextResponse.json(
        { error: "Razorpay keys not configured on server" },
        { status: 500 }
      );
    }

    const supabase = supabaseAdmin();

    let amountInPaise = 0;
    let description = "";
    let receipt = "";
    let courseIds: string[] = [];

    // 🔥 NEW: Handle demo class checkout
    if (mode === "demo") {
      if (!demoClassId) {
        return NextResponse.json(
          { error: "demoClassId is required for demo mode" },
          { status: 400 }
        );
      }

      const { data: demoClass, error: demoError } = await supabase
        .from("demo_classes")
        .select("id, title, price")
        .eq("id", demoClassId)
        .single();

      if (demoError || !demoClass) {
        console.error("Demo class lookup error:", demoError);
        return NextResponse.json(
          { error: "Demo class not found" },
          { status: 404 }
        );
      }

      // If price is 0, no need for Razorpay
      if (Number(demoClass.price) === 0) {
        return NextResponse.json(
          { error: "This demo class is free - no payment needed" },
          { status: 400 }
        );
      }

      amountInPaise = Math.round(Number(demoClass.price) * 100);
      description = `Demo Class: ${demoClass.title}`;
      receipt = `demo_${demoClass.id.slice(0, 8)}_${Date.now().toString().slice(-6)}`;
    }
    else if (mode === "single") {
      if (!courseId) {
        return NextResponse.json(
          { error: "courseId is required for single mode" },
          { status: 400 }
        );
      }

      const { data: course, error: courseError } = await supabase
        .from("courses")
        .select("id, title, price")
        .eq("id", courseId)
        .single();

      if (courseError || !course) {
        console.error("Course lookup error:", courseError);
        return NextResponse.json(
          { error: "Course not found" },
          { status: 404 }
        );
      }

      amountInPaise = Math.round(Number(course.price) * 100);
      if (!amountInPaise || amountInPaise <= 0) {
        return NextResponse.json(
          { error: "Invalid course price" },
          { status: 400 }
        );
      }

      description = course.title;
      receipt = `c_${course.id.slice(0, 8)}_${Date.now().toString().slice(-6)}`;
      courseIds = [course.id];
    } 
    else {
      // CART MODE (existing code)
      const { data: cartRows, error: cartError } = await supabase
        .from("cart_items")
        .select(`
          course:courses (
            id,
            title,
            price
          )
        `)
        .eq("user_id", userId);

      if (cartError) {
        console.error("Cart fetch error:", cartError);
        return NextResponse.json(
          { error: "Failed to load cart items" },
          { status: 500 }
        );
      }

      const rows = (cartRows as any[]) || [];
      if (rows.length === 0) {
        return NextResponse.json(
          { error: "No items in cart" },
          { status: 400 }
        );
      }

      let total = 0;
      const ids: string[] = [];

      for (const row of rows) {
        const c = row.course;
        if (!c || c.price == null) continue;
        total += Number(c.price);
        ids.push(c.id);
      }

      if (!total || total <= 0 || ids.length === 0) {
        return NextResponse.json(
          { error: "Invalid cart total" },
          { status: 400 }
        );
      }

      amountInPaise = Math.round(total * 100);
      description = `${ids.length} course(s) from Trupti Academy`;
      receipt = `cart_${userId.slice(0, 8)}_${Date.now().toString().slice(-6)}`;
      courseIds = ids;
    }

    const authHeader =
      "Basic " +
      Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString("base64");

    const razorpayRes = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: "INR",
        receipt,
        notes: {
          mode,
          user_id: userId,
          ...(mode === "demo" ? { demo_class_id: demoClassId } : {}),
          ...(mode !== "demo" && courseIds.length > 0 ? { course_ids: courseIds.join(",") } : {}),
        },
      }),
    });

    if (!razorpayRes.ok) {
      const text = await razorpayRes.text();
      console.error("Razorpay order error:", razorpayRes.status, razorpayRes.statusText, text);
      return NextResponse.json(
        { error: "Failed to create Razorpay order", providerMessage: text },
        { status: 500 }
      );
    }

    const order = await razorpayRes.json();

    return NextResponse.json({
      mode,
      key: RAZORPAY_KEY_ID,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      description,
      ...(mode !== "demo" ? { courseIds } : {}),
    });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}