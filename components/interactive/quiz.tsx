'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Check, ChevronLeft, ChevronRight, RotateCcw, X } from 'lucide-react';
import { hashText, pickMessage, quizTone } from '@/features/progress/core';
import { messages, useRecord } from '@/features/progress';
import { CodeWindow } from './code-window';
import { RichText } from './rich-text';

type Question = {
  /** A stable id. Without one, an id is derived from the question text. */
  id?: string;
  question: string;
  /** Optional program or snippet shown in a code block beneath the question text. */
  code?: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
  /** Optional per-option feedback, same length/order as `options`. Shown for whichever option the student picked. */
  optionFeedback?: string[];
  /** The topic or section. A quiz with more than one group lets the reader pick which to practise. */
  group?: string;
  /** Optional tag kept in the data (foundation, developing, exam). The quiz does not use it. */
  level?: string;
  /** A short worked solution shown after answering. */
  steps?: string[];
  /** Where the question comes from, for example a past paper and question number. */
  source?: string;
};

type Prepared = Question & { qid: string; groupName: string };

/** The language of a question's `code`, from the course in the page path; the window names itself "Code" when unknown. */
function codeLanguage(pathname: string): string | undefined {
  if (pathname.includes('/csi243/')) return 'haskell';
  if (/\/(csi141|csi142|csi247)\//.test(pathname)) return 'java';
  return undefined;
}

const DEFAULT_GROUP = 'All questions';
/** The "how many" menu appears only for quizzes longer than this. */
const COUNT_MIN = 10;

type Phase = 'choose' | 'run' | 'done';

function prepare(questions: Question[]): Prepared[] {
  const seen = new Set<string>();
  return questions.map((question, index) => {
    let qid = question.id ?? hashText(`${question.question}|${question.options.join('|')}`);
    if (seen.has(qid)) qid = `${qid}-${index}`;
    seen.add(qid);
    return { ...question, qid, groupName: question.group ?? DEFAULT_GROUP };
  });
}

/** A random subset of `count` questions, kept in the order they were written. */
function sample<T>(items: T[], count: number): T[] {
  if (count <= 0 || count >= items.length) return items;
  const picked = new Set<number>();
  while (picked.size < count) picked.add(Math.floor(Math.random() * items.length));
  return items.filter((_, index) => picked.has(index));
}

type QuizProps = {
  title?: string;
  questions?: Question[];
  /** Identifies this quiz in saved progress. QuizRef sets it; otherwise the page path and title are used. */
  quizKey?: string;
};

/**
 * The one multiple-choice quiz used on review pages in every course: one question at a time, with a Check button.
 * A quiz with more than one group first lets the reader choose topics (and, for a long quiz, how many questions).
 */
export function Quiz({ title = 'Knowledge check', questions = [], quizKey }: QuizProps) {
  const pathname = usePathname();
  const record = useRecord();
  const key = quizKey ?? `${pathname}#${title}`;
  const prepared = useMemo(() => prepare(questions), [questions]);
  const groups = useMemo(() => [...new Set(prepared.map((question) => question.groupName))], [prepared]);
  const chooser = groups.length > 1;

  const [phase, setPhase] = useState<Phase>(chooser ? 'choose' : 'run');
  const [selected, setSelected] = useState<string[]>(groups);
  const [count, setCount] = useState(0);
  const [deck, setDeck] = useState<Prepared[]>(() => (chooser ? [] : prepared));
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [position, setPosition] = useState(0);
  const [run, setRun] = useState(1);
  const reported = useRef(0);

  // Tell the progress system once per run when the results are shown.
  useEffect(() => {
    if (phase !== 'done' || reported.current === run) return;
    reported.current = run;
    const correct = deck.filter((question) => revealed[question.qid] && answers[question.qid] === question.correctIndex).length;
    record({ type: 'quiz-complete', quiz: key, total: deck.length, correct });
  }, [phase, run, deck, revealed, answers, key, record]);

  if (questions.length === 0) {
    return (
      <section className="ui-quiz">
        <header className="ui-quiz-head"><h3>{title}</h3></header>
        <p className="ui-quiz-empty">No questions for this section yet.</p>
      </section>
    );
  }

  const isCorrect = (question: Prepared) => answers[question.qid] === question.correctIndex;

  const start = (list: Prepared[]) => {
    setDeck(list);
    setAnswers({});
    setRevealed({});
    setPosition(0);
    setRun((value) => value + 1);
    setPhase('run');
  };

  /* ───── choosing topics ───── */

  const matching = prepared.filter((question) => selected.includes(question.groupName));
  const chosen = count > 0 ? Math.min(count, matching.length) : matching.length;

  if (phase === 'choose') {
    const counts = [10, 20].filter((option) => option < matching.length);
    return (
      <section className="ui-quiz qz">
        <header className="ui-quiz-head">
          <h3>{title}</h3>
          <span className="ui-quiz-stats">{prepared.length} questions</span>
        </header>
        <div className="qz-chooser">
          <div className="qz-chips" aria-label="Topics">
            {groups.map((group) => (
              <button
                key={group}
                type="button"
                className="qz-chip"
                aria-pressed={selected.includes(group)}
                onClick={() => setSelected((previous) => (previous.includes(group) ? previous.filter((item) => item !== group) : [...previous, group]))}
              >
                {group}
                <span>{prepared.filter((question) => question.groupName === group).length}</span>
              </button>
            ))}
          </div>
          {matching.length > COUNT_MIN && (
            <label className="qz-count">
              How many
              <select value={count} onChange={(event) => setCount(Number(event.target.value))}>
                <option value={0}>All of them</option>
                {counts.map((option) => <option key={option} value={option}>{option} questions</option>)}
              </select>
            </label>
          )}
        </div>
        <footer className="ui-quiz-foot">
          <span className="ui-quiz-stats" aria-live="polite">{chosen} {chosen === 1 ? 'question' : 'questions'}</span>
          <button type="button" className="ui-btn ui-btn-primary ui-btn-sm" disabled={chosen === 0} onClick={() => start(sample(matching, count))}>Start</button>
        </footer>
      </section>
    );
  }

  /* ───── results ───── */

  const answeredCount = deck.filter((question) => revealed[question.qid]).length;
  const correctCount = deck.filter((question) => revealed[question.qid] && isCorrect(question)).length;

  if (phase === 'done') {
    const missed = deck.filter((question) => revealed[question.qid] && !isCorrect(question));
    const byGroup = new Map<string, { total: number; right: number }>();
    for (const question of deck) {
      const row = byGroup.get(question.groupName) ?? { total: 0, right: 0 };
      row.total += 1;
      if (revealed[question.qid] && isCorrect(question)) row.right += 1;
      byGroup.set(question.groupName, row);
    }
    return (
      <section className="ui-quiz qz">
        <header className="ui-quiz-head">
          <h3>{title}</h3>
          <span className="ui-quiz-stats">Score {correctCount} / {deck.length}</span>
        </header>
        <div className="qz-result">
          <p className="ui-quiz-score" data-perfect={correctCount === deck.length || undefined}>
            {correctCount === deck.length
              ? 'All correct.'
              : `${correctCount} of ${deck.length} correct (${Math.round((correctCount / deck.length) * 100)}%).${answeredCount < deck.length ? ` ${deck.length - answeredCount} not answered.` : ''}`}
          </p>
          <p className="qz-affirm">{pickMessage(messages.quiz[quizTone(correctCount, deck.length)], `${key}:${run}`)}</p>
          {byGroup.size > 1 && (
            <div className="qz-breakdown">
              {[...byGroup.entries()].map(([name, row]) => (
                <div key={name} className="qz-brow">
                  <span>{name}</span>
                  <div className="pg-bar" role="progressbar" aria-label={name} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round((row.right / row.total) * 100)}>
                    <div style={{ width: `${(row.right / row.total) * 100}%` }} />
                  </div>
                  <span>{row.right}/{row.total}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <footer className="ui-quiz-foot">
          <span />
          <span className="qz-actions">
            {missed.length > 0 && (
              <button type="button" className="ui-btn ui-btn-primary ui-btn-sm" onClick={() => start(missed)}><RotateCcw size={15} /> Retry the {missed.length} missed</button>
            )}
            <button type="button" className="ui-btn ui-btn-sm" onClick={() => (chooser ? setPhase('choose') : start(prepared))}>
              {chooser ? 'Choose topics' : 'Start again'}
            </button>
          </span>
        </footer>
      </section>
    );
  }

  /* ───── answering, one question at a time ───── */

  const question = deck[Math.min(position, deck.length - 1)];
  const done = revealed[question.qid];
  const last = position >= deck.length - 1;

  const reveal = (choice: number) => {
    if (revealed[question.qid]) return;
    setAnswers((previous) => ({ ...previous, [question.qid]: choice }));
    setRevealed((previous) => ({ ...previous, [question.qid]: true }));
    record({ type: 'quiz-answer', quiz: key, qid: question.qid, choice, correct: choice === question.correctIndex });
  };

  const pick = (choice: number) => {
    if (!revealed[question.qid]) setAnswers((previous) => ({ ...previous, [question.qid]: choice }));
  };

  const optionState = (optionIndex: number) => {
    if (!done) return answers[question.qid] === optionIndex ? 'selected' : 'idle';
    if (optionIndex === question.correctIndex) return 'correct';
    if (answers[question.qid] === optionIndex) return 'wrong';
    return 'dim';
  };

  const right = done && isCorrect(question);
  const note = right ? question.explanation : question.optionFeedback?.[answers[question.qid]] || question.explanation;

  return (
    <section
      className="ui-quiz qz"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.target !== event.currentTarget) return;
        const number = Number(event.key);
        if (number >= 1 && number <= question.options.length) pick(number - 1);
        if (event.key === 'Enter') {
          if (!done && answers[question.qid] !== undefined) reveal(answers[question.qid]);
          else if (done) last ? setPhase('done') : setPosition(position + 1);
        }
      }}
    >
      <header className="ui-quiz-head">
        <h3>{title}</h3>
        <span className="ui-quiz-stats">Question {position + 1} of {deck.length}</span>
      </header>
      <div className="qz-progress" aria-hidden="true"><div style={{ width: `${((position + (done ? 1 : 0)) / deck.length) * 100}%` }} /></div>
      <div className="qz-focus">
        {(chooser || question.source) && (
          <div className="qz-meta">
            {chooser && <span>{question.groupName}</span>}
            {question.source && <span className="qz-source">Source: {question.source}</span>}
          </div>
        )}
        <p className="ui-quiz-prompt qz-prompt"><RichText text={question.question} /></p>
        {question.code && (
          <CodeWindow language={codeLanguage(pathname)} text={question.code} numbered className="ui-quiz-code">
            <code>
              {question.code.replace(/\n$/, '').split('\n').map((line, index) => (
                <span key={index} className="line">{line}</span>
              ))}
            </code>
          </CodeWindow>
        )}
        <div className="ui-quiz-options" role="radiogroup" aria-label={`Question ${position + 1}`}>
          {question.options.map((option, optionIndex) => {
            const state = optionState(optionIndex);
            return (
              <button
                key={optionIndex}
                type="button"
                role="radio"
                aria-checked={answers[question.qid] === optionIndex}
                className="ui-quiz-option"
                data-state={state}
                onClick={() => pick(optionIndex)}
                disabled={Boolean(done)}
              >
                <span><RichText text={option} /></span>
                {state === 'correct' && <Check size={16} aria-label="Correct answer" />}
                {state === 'wrong' && <X size={16} aria-label="Your answer" />}
              </button>
            );
          })}
        </div>
        {done && (
          <div className="ui-quiz-feedback" data-correct={right || undefined}>
            <strong>{right ? 'Correct.' : 'Not quite.'}</strong>
            {note && <> <RichText text={note} /></>}
            {!right && question.explanation && question.optionFeedback?.[answers[question.qid]] && (
              <p className="qz-answer"><strong>Answer:</strong> <RichText text={question.explanation} /></p>
            )}
            {question.steps && question.steps.length > 0 && (
              <ol className="qz-steps">{question.steps.map((step, stepIndex) => <li key={stepIndex}><RichText text={step} /></li>)}</ol>
            )}
            {question.optionFeedback && (
              <details className="qz-why">
                <summary>Why each option is right or wrong</summary>
                <ul>
                  {question.optionFeedback.map((text, optionIndex) => (
                    <li key={optionIndex}><strong>{String.fromCharCode(65 + optionIndex)}.</strong> <RichText text={text} /></li>
                  ))}
                </ul>
              </details>
            )}
          </div>
        )}
      </div>
      <footer className="ui-quiz-foot">
        <button type="button" className="ui-btn ui-btn-sm" disabled={position === 0} onClick={() => setPosition(position - 1)}><ChevronLeft size={15} /> Previous</button>
        <span className="ui-quiz-stats">{answeredCount} answered · {correctCount} correct</span>
        {!done ? (
          <button type="button" className="ui-btn ui-btn-primary ui-btn-sm" disabled={answers[question.qid] === undefined} onClick={() => reveal(answers[question.qid])}>Check answer</button>
        ) : last ? (
          <button type="button" className="ui-btn ui-btn-primary ui-btn-sm" onClick={() => setPhase('done')}>See results</button>
        ) : (
          <button type="button" className="ui-btn ui-btn-primary ui-btn-sm" onClick={() => setPosition(position + 1)}>Next <ChevronRight size={15} /></button>
        )}
      </footer>
    </section>
  );
}
