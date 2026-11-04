'use client';

import { useMemo } from 'react';
import type { QuizFile } from '@/lib/quiz-data';
import { Quiz } from './quiz';
import { useLazyJson } from './use-lazy-json';

/**
 * The quiz of a <QuizRef />. The page carries only the title, the number of questions and the address of the data file;
 * the questions are fetched when the quiz comes near the screen, and then the ordinary Quiz takes over in the same place.
 */
export function QuizLoader({ url, id, title, count, quizKey }: { url: string; id: string; title?: string; count: number; quizKey: string }) {
  const { ref, state, retry } = useLazyJson<QuizFile>(url);
  const quiz = state.status === 'ready' ? state.data.quizzes?.[id] : undefined;

  // A program given as lines becomes one string, as the quiz expects.
  const questions = useMemo(
    () => quiz?.questions.map((question) => ({ ...question, code: Array.isArray(question.code) ? question.code.join('\n') : question.code })),
    [quiz],
  );

  if (quiz && questions) return <Quiz title={quiz.title} questions={questions} quizKey={quizKey} />;

  const failed = state.status === 'error' || state.status === 'ready';
  return (
    <section ref={ref} className="ui-quiz qz qz-loading" aria-busy={!failed}>
      <header className="ui-quiz-head">
        <h3>{title ?? 'Knowledge check'}</h3>
        <span className="ui-quiz-stats">{count} {count === 1 ? 'question' : 'questions'}</span>
      </header>
      {failed ? (
        <p className="ui-quiz-empty">
          The questions could not be loaded.{' '}
          <button type="button" className="ui-btn ui-btn-sm" onClick={retry}>Try again</button>
        </p>
      ) : (
        <p className="ui-quiz-empty" role="status">Loading the questions.</p>
      )}
    </section>
  );
}
