// import QuizAttemptClient from "./quiz-attempt-client";

// export default function QuizAttemptPage({
//   params,
// }: {
//   params: { slug: string; quizId: string };
// }) {
//   return <QuizAttemptClient slug={params.slug} quizId={params.quizId} />;
// }


import QuizAttemptClient from "./quiz-attempt-client";

export default async function QuizAttemptPage({
  params,
}: {
  params: Promise<{ slug: string; quizId: string }>;
}) {
  const { slug, quizId } = await params;
  return <QuizAttemptClient slug={slug} quizId={quizId} />;
}
