'use client';

import katex from 'katex';

/**
 * One formula rendered by KaTeX. This is the only module that imports the library, and MathText loads it only when a
 * text really contains a formula, so a page whose quizzes and flashcards have none never downloads KaTeX.
 */
export function KatexSpan({ math, displayMode, raw }: { math: string; displayMode: boolean; raw: string }) {
  try {
    const html = katex.renderToString(math, { displayMode, throwOnError: false });
    return <span dangerouslySetInnerHTML={{ __html: html }} />;
  } catch {
    return <span>{raw}</span>;
  }
}
