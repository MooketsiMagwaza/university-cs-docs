import { loadPracticeGroup } from '@/lib/practice-data';
import { PracticeQuestions } from './practice-questions';

/** Shows one group of practice questions from a JSON file under content/practice-data (see lib/practice-data.ts). */
export async function PracticeRef({ src, group }: { src: string; group: string }) {
  const { questions } = await loadPracticeGroup(src, group);
  return <PracticeQuestions questions={questions} />;
}
