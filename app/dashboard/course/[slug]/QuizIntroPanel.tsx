"use client";

import Link from "next/link";

export default function QuizIntroPanel({
  quiz,
  courseSlug,
}: {
  quiz: {
    id: string;
    title: string;
    description: string | null;
    total_points: number | null;
  };
  courseSlug: string;
}) {
  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{quiz.title}</h3>
        {quiz.description && (
          <p className="text-sm text-gray-600 mt-1 whitespace-pre-line">
            {quiz.description}
          </p>
        )}
      </div>

      <div className="text-sm text-gray-700">
        <p>{quiz.total_points ?? 0} points</p>
      </div>

      <div className="flex gap-3">
        <Link
          href={`/dashboard/course/${courseSlug}/quiz/${quiz.id}`}
          className="rounded-xl bg-purple-600 text-white px-6 py-3 font-semibold hover:bg-purple-700"
        >
          Start quiz
        </Link>

        <Link
          href={`/dashboard/course/${courseSlug}`}
          className="rounded-xl bg-gray-100 text-gray-900 px-6 py-3 font-semibold hover:bg-gray-200"
        >
          Skip quiz
        </Link>
      </div>
    </div>
  );
}
