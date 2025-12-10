// import QuizResultClient from "./quiz-result-client";

// export default function QuizResultPage({
//   params,
//   searchParams,
// }: {
//   params: { slug: string; quizId: string };
//   searchParams: { attempt?: string };
// }) {
//   return (
//     <QuizResultClient
//       slug={params.slug}
//       quizId={params.quizId}
//       attemptId={searchParams.attempt!}
//     />
//   );
// }



import QuizResultClient from "./quiz-result-client";

export default async function QuizResultPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; quizId: string }>;
  searchParams: Promise<{ attempt?: string }>;
}) {
  const { slug, quizId } = await params;
  const sp = await searchParams;

  return (
    <QuizResultClient
      slug={slug}
      quizId={quizId}
      attemptId={sp.attempt!}
    />
  );
}
