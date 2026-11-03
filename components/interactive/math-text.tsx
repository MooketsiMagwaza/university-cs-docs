'use client';

import dynamic from 'next/dynamic';

// KaTeX is about 270 KB of JavaScript. It sits in its own chunk that the browser downloads only on a page that renders a
// formula; text without a dollar sign never touches it.
const KatexSpan = dynamic(() => import('./katex-span').then((module_) => module_.KatexSpan), { loading: () => null });

export const MathText = ({ text }: { text: any }) => {
  if (!text) return null;

  // If text is a React node, number, or object, just render it directly.
  // This prevents the 'a.split is not a function' crash when passing JSX to MathText.
  if (typeof text !== 'string') {
    return <>{text}</>;
  }

  // No formula: the same single span the formula path would give, without loading KaTeX.
  if (!text.includes('$')) return <span>{text}</span>;

  const parts = text.split(/(\$\$[\s\S]+?\$\$|\$[^\$\n]+?\$)/g);

  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          return <KatexSpan key={index} math={part.slice(2, -2)} displayMode raw={part} />;
        } else if (part.startsWith('$') && part.endsWith('$')) {
          return <KatexSpan key={index} math={part.slice(1, -1)} displayMode={false} raw={part} />;
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
};
