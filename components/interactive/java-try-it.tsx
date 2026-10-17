'use client';

import type { ReactNode } from 'react';
import { getJavaPlaygroundExample } from '@/lib/java-playground/examples';
import { nodeText } from './code-window';
import { RunnableCode } from './runnable-code';

type JavaTryItProps = {
  /** The program, as a fenced block inside the tag. Written as `code="…"` it loses its indentation in MDX. */
  children?: ReactNode;
  example?: string;
  code?: string;
  /** Kept so older notes still pass them; the code window names itself. */
  title?: string;
  description?: string;
};

/** A Try it yourself example for the notes: an editable Java program that compiles and runs where it stands. */
export function JavaTryIt({ children, example, code }: JavaTryItProps) {
  const fenced = nodeText(children).replace(/\n$/, '');
  return <RunnableCode language="java" code={code ?? (fenced || getJavaPlaygroundExample(example).code)} />;
}
