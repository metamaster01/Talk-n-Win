"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabase-course";

type Quiz = {
  id: string;
  title: string;
  description?: string | null;
  time_limit_seconds: number | null;
  course_id: string;
  module_id: string;
};

type Question = {
  id: string;
  prompt: string;
  explanation: string | null;
  points: number;
  position: number;
  options: {
    id: string;
    label: string | null;
    text: string;
    position: number;
  }[];
};

export default function QuizAttemptClient({
  slug,
  quizId,
}: {
  slug: string;
  quizId: string;
}) {
  const supa = supabaseBrowser();
  const router = useRouter();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attemptId, setAttemptId] = useState<string | null>(null);
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | null>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        // ---- auth ----
        const { data: auth } = await supa.auth.getUser();
        if (!auth.user) {
          router.push(
            `/login?mode=login&redirect=/dashboard/course/${slug}`
          );
          return;
        }

        // ---- fetch quiz first (needed for attempt insert NOT NULL fields) ----
        const { data: qz, error: qzErr } = await supa
          .from("quizzes")
          .select("id, title, description, time_limit_seconds, course_id, module_id")
          .eq("id", quizId)
          .single();

        if (qzErr || !qz) {
          console.error("quiz fetch err", qzErr);
          alert("Quiz not found.");
          setLoading(false);
          return;
        }

        setQuiz(qz as any);

        // ---- reuse any in-progress attempt ----
        const { data: existingAttempt, error: existingErr } = await supa
          .from("quiz_attempts")
          .select("id")
          .eq("quiz_id", quizId)
          .eq("user_id", auth.user.id)
          .eq("status", "in_progress")
          .maybeSingle();

        if (existingErr) {
          console.error("existing attempt err", existingErr);
        }

        let activeAttemptId = existingAttempt?.id ?? null;

        // ---- create attempt if none ----
        if (!activeAttemptId) {
          const { data: newAttempt, error: newErr } = await supa
            .from("quiz_attempts")
            .insert({
              quiz_id: quizId,
              user_id: auth.user.id,
              course_id: qz.course_id, // ✅ NOT NULL
              module_id: qz.module_id, // ✅ NOT NULL
              status: "in_progress",
            })
            .select("id")
            .single();

          if (newErr || !newAttempt) {
            console.error("create attempt err", newErr);
            alert(
              "Could not start quiz. Attempt insert blocked. Check RLS on quiz_attempts."
            );
            setLoading(false);
            return;
          }

          activeAttemptId = newAttempt.id;
        }

        setAttemptId(activeAttemptId);

        // ---- fetch questions ----
        const { data: qs, error: qsErr } = await supa
          .from("quiz_questions")
          .select("id, prompt, explanation, points, position")
          .eq("quiz_id", quizId)
          .order("position");

        if (qsErr) console.error("questions err", qsErr);

        const questionIds = (qs ?? []).map((x) => x.id);

        // ---- fetch options ----
        const { data: opts, error: optsErr } = await supa
          .from("quiz_options")
          .select("id, question_id, label, text, position")
          .in("question_id", questionIds)
          .order("position");

        if (optsErr) console.error("options err", optsErr);

        const optionsByQ = new Map<string, any[]>();
        (opts ?? []).forEach((o) => {
          const arr = optionsByQ.get(o.question_id) ?? [];
          arr.push(o);
          optionsByQ.set(o.question_id, arr);
        });

        const combined = (qs ?? []).map((q) => ({
          ...q,
          options: optionsByQ.get(q.id) ?? [],
        }));

        setQuestions(combined as any);
        setLoading(false);
      } catch (e: any) {
        console.error("quiz attempt load fatal", e);
        alert(e?.message ?? "Something went wrong loading the quiz.");
        setLoading(false);
      }
    })();
  }, [quizId, slug]);

  const current = questions[idx];

  const answeredCount = useMemo(
    () => Object.values(answers).filter(Boolean).length,
    [answers]
  );

  const onSelectOption = (qid: string, oid: string) => {
    setAnswers((a) => ({ ...a, [qid]: oid }));
  };

  const goNext = () => {
    if (idx < questions.length - 1) setIdx((i) => i + 1);
  };

  const goPrev = () => {
    if (idx > 0) setIdx((i) => i - 1);
  };

  const onSubmit = async () => {
    if (!attemptId) {
      alert("Attempt not created. Please refresh.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(`/api/quiz/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ attemptId, answers }),
      });

      const json = await res.json();

      if (!res.ok) {
        console.error("submit api err", json);
        alert(json.error ?? "Submit failed");
        return;
      }

      router.push(
        `/dashboard/course/${slug}/quiz/${quizId}/result?attempt=${attemptId}`
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !quiz || !current) {
    return <div className="p-6">Loading…</div>;
  }

  const selected = answers[current.id] ?? null;
  const isLast = idx === questions.length - 1;

  return (
    <div className="min-h-screen bg-purple-50/40 mt-32">
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        <button
          onClick={() => router.push(`/dashboard/course/${slug}`)}
          className="text-sm text-gray-700 hover:text-gray-900"
        >
          ← Back to course
        </button>

        <div className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Question {idx + 1} of {questions.length}
            </span>
            <span>
              {answeredCount}/{questions.length} answered
            </span>
          </div>

          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-purple-600"
              style={{ width: `${((idx + 1) / questions.length) * 100}%` }}
            />
          </div>

          <div className="pt-3">
            <p className="text-base font-semibold text-gray-900">
              {current.prompt}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {current.options.map((o) => {
              const active = selected === o.id;
              return (
                <button
                  key={o.id}
                  onClick={() => onSelectOption(current.id, o.id)}
                  className={`rounded-xl border px-4 py-3 text-left text-sm
                    ${
                      active
                        ? "border-purple-600 bg-purple-50"
                        : "border-gray-200 bg-white hover:bg-gray-50"
                    }`}
                >
                  {o.label ? <b className="mr-2">{o.label}.</b> : null}
                  {o.text}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              onClick={goPrev}
              disabled={idx === 0}
              className="rounded-xl bg-gray-100 px-4 py-2 text-sm font-semibold disabled:opacity-50"
            >
              Back
            </button>

            <div className="flex gap-2">
              {!isLast ? (
                <>
                  <button
                    onClick={goNext}
                    disabled={!selected}
                    className="rounded-xl bg-purple-600 text-white px-5 py-2 text-sm font-semibold disabled:opacity-50"
                  >
                    Next
                  </button>
                  <button
                    onClick={goNext}
                    className="rounded-xl bg-gray-200 px-5 py-2 text-sm font-semibold"
                  >
                    Skip
                  </button>
                </>
              ) : (
                <button
                  onClick={onSubmit}
                  disabled={submitting}
                  className="rounded-xl bg-emerald-600 text-white px-5 py-2 text-sm font-semibold disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit quiz"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
