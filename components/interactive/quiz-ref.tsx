import { loadQuiz } from '@/lib/quiz-data';
import { Quiz } from './quiz';

/** Renders a quiz whose questions live in a JSON file under content/quiz-data (see lib/quiz-data.ts). */
export async function QuizRef({ src, id }: { src: string; id: string }) {
  const { title, questions } = await loadQuiz(src, id);
  return <Quiz title={title} questions={questions} />;
}
