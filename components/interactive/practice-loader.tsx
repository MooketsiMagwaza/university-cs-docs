'use client';

import type { PracticeFile } from '@/lib/practice-data';
import { PracticeQuestions } from './practice-questions';
import { useLazyJson } from './use-lazy-json';

/**
 * The questions of a <PracticeRef />. The page carries only the number of questions and the address of the data file;
 * the questions are fetched when they come near the screen and then shown by PracticeQuestions in the same place.
 */
export function PracticeLoader({ url, group, count }: { url: string; group: string; count: number }) {
  const { ref, state, retry } = useLazyJson<PracticeFile>(url);
  const found = state.status === 'ready' ? state.data.groups?.[group] : undefined;

  if (found) return <PracticeQuestions questions={found.questions} />;

  const failed = state.status === 'error' || state.status === 'ready';
  return (
    <section ref={ref} className="ui-exam qz-loading" aria-busy={!failed}>
      {failed ? (
        <p className="ui-quiz-empty">
          The questions could not be loaded.{' '}
          <button type="button" className="ui-btn ui-btn-sm" onClick={retry}>Try again</button>
        </p>
      ) : (
        <p className="ui-quiz-empty" role="status">Loading {count} {count === 1 ? 'question' : 'questions'}.</p>
      )}
    </section>
  );
}
