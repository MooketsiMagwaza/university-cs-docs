import { loadPrediction } from '@/lib/predict-data';
import { PredictQuestion } from './predict-question';

/**
 * A "predict, then reveal" question from a JSON file under content/predict-data (see lib/predict-data.ts). The reader
 * commits to an answer first; only then are the answer and the explanation shown. Like QuizRef and PracticeRef this
 * reads the file on the server and hands the question to a client component.
 */
export async function PredictReveal({ src, id }: { src: string; id: string }) {
  const question = await loadPrediction(src, id);
  return <PredictQuestion question={question} questionKey={`${src}#${id}`} />;
}
