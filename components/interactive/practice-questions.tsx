'use client';

import type { ReactNode } from 'react';
import type { PracticeQuestionData } from '@/lib/practice-data';
import { ExamQuestion, SubQuestion } from './exam-question';
import { MathText } from './math-text';
import { Step, Steps } from './step-by-step';

/** `**bold**` and `code` around the maths: the maths is cut out first so a `*` or backtick inside a formula is left alone. */
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

/** A group of practice questions: each has its prompt, and a button that opens the worked solution. */
export function PracticeQuestions({ questions }: { questions: PracticeQuestionData[] }) {
  return (
    <>
      {questions.map((question) => (
        <ExamQuestion key={question.title} title={question.title}>
          <SubQuestion
            prompt={<Paragraphs text={question.prompt} />}
            solution={
              <>
                <Steps>
                  {question.steps.map((step) => (
                    <Step key={step.title} title={step.title}>
                      <Inline text={step.body} />
                    </Step>
                  ))}
                </Steps>
                {question.answer && (
                  <p>
                    <Inline text={question.answer} />
                  </p>
                )}
              </>
            }
          />
        </ExamQuestion>
      ))}
    </>
  );
}
