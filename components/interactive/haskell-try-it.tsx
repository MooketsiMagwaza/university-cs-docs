'use client';

import type { ReactNode } from 'react';
import { RunnableCode, tryItParts } from './runnable-code';

type HaskellTryItProps = {
  /** The program, as a fenced block inside the tag. Written as `code="…"` it loses its indentation in MDX. */
  children?: ReactNode;
  code?: string;
  /** What the program reads when it asks for input (getLine and friends). The reader can change it in the Input box. */
  input?: string;
  /** The code is a GHCi session: one command per line (a leading `ghci>` is allowed), and the output is the transcript. */
  session?: boolean;
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
export function HaskellTryIt({ children, code, input, session }: HaskellTryItProps) {
  const parts = tryItParts(children);
  return <RunnableCode language="haskell" code={code ?? parts.code} expected={parts.output} stdin={input} session={session} />;
}
