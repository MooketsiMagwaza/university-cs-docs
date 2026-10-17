'use client';

import type { ReactNode } from 'react';
import { nodeText } from './code-window';
import { RunnableCode } from './runnable-code';

type HaskellTryItProps = {
  /** The program, as a fenced block inside the tag. Written as `code="…"` it loses its indentation in MDX. */
  children?: ReactNode;
  code?: string;
  /** What the program reads when it asks for input (getLine and friends). The reader can change it in the Input box. */
  input?: string;
  /** Kept so older notes still pass them; the code window names itself. */
  title?: string;
  description?: string;
};

/**
 * A Try it yourself example for the notes: an editable Haskell program that runs where it stands.
 *
 *     <HaskellTryIt>
 *
 *     ```haskell
 *     main = print (sum [1..10])
 *     ```
 *
 *     </HaskellTryIt>
 */
export function HaskellTryIt({ children, code, input }: HaskellTryItProps) {
  return <RunnableCode language="haskell" code={code ?? nodeText(children).replace(/\n$/, '')} stdin={input} />;
}
