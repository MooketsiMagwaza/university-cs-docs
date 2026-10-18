'use client';

import { useId, useState, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { hashText } from '@/features/progress/core';
import { useRecord } from '@/features/progress';
import { dependsOnX, parseExpression } from '@/lib/maths/expression';
import type { PredictQuestionData } from '@/lib/predict-data';
import { figures, signed } from './graph-frame';
import { MathText } from './math-text';

/** `**bold**` and `code` around the maths: the maths is cut out first so a `*` inside a formula is left alone. */
function Inline({ text }: { text: string }) {
  const parts = text.split(/(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g);
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('$')) return <MathText key={index} text={part} />;
        return (
          <span key={index}>
            {part.split(/(\*\*[^*]+\*\*|`[^`\n]+`)/g).map((piece, pieceIndex): ReactNode => {
              if (piece.startsWith('**') && piece.endsWith('**') && piece.length > 4) return <strong key={pieceIndex}>{piece.slice(2, -2)}</strong>;
              if (piece.startsWith('`') && piece.endsWith('`') && piece.length > 2) return <code key={pieceIndex}>{piece.slice(1, -1)}</code>;
              return piece;
            })}
          </span>
        );
      })}
    </>
  );
}

/** Paragraphs are separated by a blank line. */
function Paragraphs({ text }: { text: string }) {
  return (
    <>
      {text.split(/\n\s*\n/).map((paragraph, index) => (
        <p key={index}>
          <Inline text={paragraph.replace(/\n/g, ' ')} />
        </p>
      ))}
    </>
  );
}

/**
 * Read what the reader typed as a number. A plain number works, and so do fractions and the constants the parser knows:
 * 2.5, 8/3, 8pi/3. Returns null when the text is not a number.
 */
export function readNumber(text: string): number | null {
  if (text.trim() === '') return null;
  const parsed = parseExpression(text);
  if (!parsed.ok || dependsOnX(parsed.node)) return null;
  const value = parsed.evaluate(0);
  return Number.isFinite(value) ? value : null;
}

/**
 * One "predict, then reveal" question. The reader picks an option, or types a number, and presses a button to commit;
 * only then are the answer and the explanation shown. Nothing about the answer is drawn before that.
 */
export function PredictQuestion({ question, questionKey }: { question: PredictQuestionData; questionKey: string }) {
  const id = useId();
  const record = useRecord();
  const pathname = usePathname();
  const [choice, setChoice] = useState<number | null>(null);
  const [typed, setTyped] = useState('');
  const [committed, setCommitted] = useState(false);

  const typedValue = question.type === 'number' ? readNumber(typed) : null;
  const ready = question.type === 'choice' ? choice !== null : typedValue !== null;
  const right =
    question.type === 'choice'
      ? choice === question.correctIndex
      : typedValue !== null && Math.abs(typedValue - question.answer) <= question.tolerance + 1e-9 * Math.max(1, Math.abs(question.answer));

  const commit = () => {
    if (!ready || committed) return;
    setCommitted(true);
    // Working through a prediction counts the same as opening a check question.
    record({ type: 'check', page: pathname, key: hashText(questionKey) });
  };
  const again = () => {
    setCommitted(false);
    setChoice(null);
    setTyped('');
  };

  return (
    <section className="dx pic mv mv-predict not-prose" aria-labelledby={`${id}-title`}>
      <header className="dx-head">
        <h4 id={`${id}-title`}>Predict, then reveal</h4>
      </header>
      <div className="mv-question"><Paragraphs text={question.question} /></div>

      {question.type === 'choice' ? (
        <fieldset className="mv-options" disabled={committed}>
          <legend>Your prediction</legend>
          {question.options.map((option, index) => (
            <label key={index} className="mv-option" data-state={committed ? (index === question.correctIndex ? 'right' : index === choice ? 'wrong' : undefined) : undefined}>
              <input type="radio" name={`${id}-choice`} checked={choice === index} onChange={() => setChoice(index)} />
              <span><Inline text={option} />{committed && index === question.correctIndex ? ' (the answer)' : committed && index === choice ? ' (your choice)' : ''}</span>
            </label>
          ))}
        </fieldset>
      ) : (
        <div className="mv-number">
          <label className="pic-field">
            <span>Your answer</span>
            <input
              type="text"
              inputMode="decimal"
              value={typed}
              disabled={committed}
              autoComplete="off"
              spellCheck={false}
              aria-describedby={`${id}-hint`}
              onChange={(event) => setTyped(event.target.value)}
              onKeyDown={(event) => event.key === 'Enter' && commit()}
            />
          </label>
          {question.unit && <span className="mv-unit">{question.unit}</span>}
          <p id={`${id}-hint`} className="pic-note">
            {question.tolerance === 0 ? 'Give the exact value.' : `Anything within ${figures(question.tolerance, 4)} of the answer counts as right.`} You can type a fraction such as 8/3, or pi.
            {typed.trim() !== '' && typedValue === null && ' That is not a number yet.'}
          </p>
        </div>
      )}

      <div className="pic-run">
        <button type="button" className="ui-btn ui-btn-sm ui-btn-primary" disabled={!ready || committed} onClick={commit}>Lock in my prediction</button>
        {committed && <button type="button" className="ui-btn ui-btn-sm" onClick={again}>Try again</button>}
      </div>

      {committed && (
        <div className="mv-reveal" role="status" data-state={right ? 'right' : 'wrong'}>
          <p className="mv-verdict">
            <strong>{right ? 'Right.' : 'Not quite.'}</strong>{' '}
            {question.type === 'choice'
              ? right
                ? 'Your prediction matches.'
                : choice !== null && question.optionFeedback
                  ? ''
                  : 'The answer is marked in the list above.'
              : right
                ? `You said ${signed(typedValue as number, 6)}.`
                : `You said ${signed(typedValue as number, 6)}. The answer is ${signed(question.answer, 6)}.`}
          </p>
          {question.type === 'choice' && !right && choice !== null && question.optionFeedback && <p><Inline text={question.optionFeedback[choice]} /></p>}
          <Paragraphs text={question.explanation} />
        </div>
      )}
    </section>
  );
}
