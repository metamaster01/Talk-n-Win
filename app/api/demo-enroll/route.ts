import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export async function POST(req: Request) {
  try {
    const { demoClassId, fullName, email, phone, userId } = await req.json();

    if (!demoClassId || !fullName || !email || !phone) {
      return NextResponse.json(
        { error: "demoClassId, fullName, email and phone are required" },
        { status: 400 }
      );
    }

    const supabase = supabaseAdmin();

    const { error } = await supabase.from("demo_enrollments").insert({
      user_id: userId ?? null,
      demo_class_id: demoClassId,
      payment_id: null,
      payment_status: "free",
      amount_paid: 0,
      customer_name: fullName,
      customer_email: email,
      customer_phone: phone,
    });

    if (error && error.code !== "23505") {
      console.error("Demo free enrollment error:", error);
      return NextResponse.json(
        { error: "Failed to enroll in demo class" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Demo enroll error:", err);
    return NextResponse.json(
      { error: "Unexpected server error" },
      { status: 500 }
    );
  }
}
