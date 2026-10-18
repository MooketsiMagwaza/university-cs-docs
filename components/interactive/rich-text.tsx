import { MathText } from './math-text';

/** Renders `inline code` spans as <code> and passes everything else through MathText. Used by the quiz and the flashcards. */
export const RichText = ({ text }: { text: string }) => {
  const parts = text.split(/(`[^`\n]+`)/g);
  return (
    <>
      {parts.map((part, index) =>
        part.length > 2 && part.startsWith('`') && part.endsWith('`') ? (
          <code key={index}>{part.slice(1, -1)}</code>
        ) : (
          <MathText key={index} text={part} />
        ),
      )}
    </>
  );
};
