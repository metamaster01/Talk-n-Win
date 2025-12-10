import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supaAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // 👈 server-only key
);

export async function POST(req: Request) {
  const { attemptId, answers } = (await req.json()) as {
    attemptId: string;
    answers: Record<string, string | null>;
  };

  // 1) fetch attempt (service role can see it)
  const { data: attempt, error: attemptErr } = await supaAdmin
    .from("quiz_attempts")
    .select("id, quiz_id, user_id, course_id, module_id")
    .eq("id", attemptId)
    .single();

  if (attemptErr || !attempt) {
    console.error("attempt fetch err", attemptErr);
    return NextResponse.json({ error: "Attempt not found" }, { status: 404 });
  }

  // 2) fetch quiz pass points
  const { data: quizRow, error: quizErr } = await supaAdmin
    .from("quizzes")
    .select("pass_points")
    .eq("id", attempt.quiz_id)
    .single();

  if (quizErr || !quizRow) {
    console.error("quiz fetch err", quizErr);
    return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
  }

  // 3) fetch questions
  const { data: qs, error: qsErr } = await supaAdmin
    .from("quiz_questions")
    .select("id, points")
    .eq("quiz_id", attempt.quiz_id);

  if (qsErr) console.error("questions err", qsErr);

  const qIds = (qs ?? []).map((q) => q.id);

  // 4) fetch correct options
  const { data: opts, error: optsErr } = await supaAdmin
    .from("quiz_options")
    .select("id, question_id, is_correct")
    .in("question_id", qIds);

  if (optsErr) console.error("options err", optsErr);

  const correctByQ = new Map<string, string>();
  (opts ?? []).forEach((o) => {
    if (o.is_correct) correctByQ.set(o.question_id, o.id);
  });

  let score = 0;
  let maxPoints = 0;

  const answerRows = (qs ?? []).map((q) => {
    const selected = answers[q.id] ?? null;
    const correct = correctByQ.get(q.id) ?? null;
    const isCorrect = selected && correct && selected === correct;

    maxPoints += q.points;
    if (isCorrect) score += q.points;

    return {
      attempt_id: attemptId,
      question_id: q.id,
      selected_option_id: selected,
      is_correct: !!isCorrect,
      points_awarded: isCorrect ? q.points : 0,
    };
  });

  // 5) upsert answers
  await supaAdmin.from("quiz_answers").upsert(answerRows, {
    onConflict: "attempt_id,question_id",
  });

  const passPoints = quizRow.pass_points;
  const passed = passPoints != null ? score >= passPoints : null;

  // 6) finalize attempt
  await supaAdmin
    .from("quiz_attempts")
    .update({
      submitted_at: new Date().toISOString(),
      status: "submitted",
      score_points: score,
      max_points: maxPoints,
      passed,
    })
    .eq("id", attemptId);

  return NextResponse.json({ ok: true, score, maxPoints, passed });
}
