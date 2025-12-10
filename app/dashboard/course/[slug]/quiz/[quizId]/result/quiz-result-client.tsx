"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-course";

export default function QuizResultClient({
  slug,
  quizId,
  attemptId,
}: {
  slug: string;
  quizId: string;
  attemptId: string;
}) {
  const supa = supabaseBrowser();
  const router = useRouter();

  const [attempt, setAttempt] = useState<any>(null);
  const [breakdown, setBreakdown] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);

      const { data: att } = await supa
        .from("quiz_attempts")
        .select("*")
        .eq("id", attemptId)
        .single();

      const { data: qs } = await supa
        .from("quiz_questions")
        .select("id, prompt, explanation, points, position")
        .eq("quiz_id", quizId)
        .order("position");

      const qIds = (qs ?? []).map(q => q.id);

      const { data: opts } = await supa
        .from("quiz_options")
        .select("id, question_id, text, is_correct, position, label")
        .in("question_id", qIds)
        .order("position");

      const { data: ans } = await supa
        .from("quiz_answers")
        .select("question_id, selected_option_id, is_correct, points_awarded")
        .eq("attempt_id", attemptId);

      const optsByQ = new Map<string, any[]>();
      (opts ?? []).forEach(o => {
        const arr = optsByQ.get(o.question_id) ?? [];
        arr.push(o); optsByQ.set(o.question_id, arr);
      });

      const ansByQ = new Map<string, any>();
      (ans ?? []).forEach(a => ansByQ.set(a.question_id, a));

      const items = (qs ?? []).map(q => {
        const options = optsByQ.get(q.id) ?? [];
        const a = ansByQ.get(q.id);
        return {
          ...q,
          options,
          selected_option_id: a?.selected_option_id ?? null,
          is_correct: a?.is_correct ?? false,
        };
      });

      setAttempt(att);
      setBreakdown(items);
      setLoading(false);
    })();
  }, [attemptId, quizId]);

  if (loading || !attempt) return <div className="p-6">Loading…</div>;

  return (
    <div className="min-h-screen bg-purple-50/40 mt-18">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-2xl shadow-sm p-6 text-center space-y-2">
          <p className="text-emerald-600 font-semibold">
            {attempt.passed ? "You passed!" : "Quiz completed"}
          </p>
          <h1 className="text-2xl font-bold">
            You scored {attempt.score_points}/{attempt.max_points}
          </h1>
          <p className="text-sm text-gray-600">
            Review answers below to see where to improve.
          </p>
        </div>

        <div className="space-y-4">
          {breakdown.map((q, i) => {
            const correctOpt = q.options.find((o: any) => o.is_correct);
            const selectedOpt = q.options.find((o: any) => o.id === q.selected_option_id);

            return (
              <div key={q.id} className="bg-white rounded-2xl p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">Question {i + 1}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    q.is_correct ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
                  }`}>
                    {q.is_correct ? "Correct" : "Incorrect"}
                  </span>
                </div>

                <p className="text-sm text-gray-900">{q.prompt}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {q.options.map((o: any) => {
                    const isSelected = selectedOpt?.id === o.id;
                    const isCorrect = correctOpt?.id === o.id;

                    return (
                      <div
                        key={o.id}
                        className={`rounded-xl border px-4 py-3 text-sm
                          ${isCorrect ? "border-emerald-500 bg-emerald-50" : "border-gray-200"}
                          ${isSelected && !isCorrect ? "border-red-500 bg-red-50" : ""}
                        `}
                      >
                        {o.label ? <b className="mr-2">{o.label}.</b> : null}
                        {o.text}
                      </div>
                    );
                  })}
                </div>

                {q.explanation && (
                  <p className="text-xs text-gray-600 whitespace-pre-line">
                    {q.explanation}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => router.push(`/dashboard/course/${slug}`)}
            className="rounded-xl bg-gray-900 text-white px-5 py-3 text-sm font-semibold"
          >
            Back to course
          </button>
          <button
            onClick={() => router.push(`/dashboard/course/${slug}/quiz/${quizId}`)}
            className="rounded-xl bg-purple-600 text-white px-5 py-3 text-sm font-semibold"
          >
            Retake quiz
          </button>
        </div>
      </div>
    </div>
  );
}
