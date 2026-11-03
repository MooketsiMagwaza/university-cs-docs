import { preload } from 'react-dom';
import { describeQuiz } from '@/lib/quiz-data';
import { QuizLoader } from './quiz-loader';

/**
 * Renders a quiz whose questions live in a JSON file under content/quiz-data (see lib/quiz-data.ts). The questions are
 * not part of the page: the page asks the browser to start downloading the data file early (a low-priority preload
 * hint) and the quiz appears when the file arrives (see lib/lazy-data.ts).
 */
export async function QuizRef({ src, id }: { src: string; id: string }) {
  const { title, count, url } = await describeQuiz(src, id);
  preload(url, { as: 'fetch', crossOrigin: 'anonymous', fetchPriority: 'low' });
  return <QuizLoader url={url} id={id} title={title} count={count} quizKey={`${src}#${id}`} />;
}
