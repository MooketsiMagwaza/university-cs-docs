'use client';

import { useState } from 'react';
import { Coffee, Play, X } from 'lucide-react';
import { getJavaPlaygroundExample } from '@/lib/java-playground/examples';
import { JavaPlayground } from './java-playground';

type JavaTryItProps = {
  example?: string;
  code?: string;
  title?: string;
  description?: string;
};

export function JavaTryIt({ example, code, title = 'Try it yourself', description }: JavaTryItProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selected = getJavaPlaygroundExample(example);
  const source = code ?? selected.code;

  if (isOpen) {
    return (
      <div className="relative not-prose my-6">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute right-3 top-3 z-20 inline-flex items-center gap-1 rounded-lg border border-fd-border bg-fd-background px-2.5 py-1.5 text-xs font-medium text-fd-muted-foreground shadow-sm hover:bg-fd-muted hover:text-fd-foreground"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          Close editor
        </button>
        <JavaPlayground
          code={source}
          example={example}
          title={title}
          description={description ?? selected.description}
          showExamplePicker={false}
        />
      </div>
    );
  }

  return (
    <section className="not-prose my-6 overflow-hidden rounded-xl border border-fd-border bg-fd-card shadow-sm">
      <div className="flex items-center gap-2 border-b border-fd-border bg-fd-muted/30 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">
        <Coffee className="h-4 w-4" aria-hidden="true" />
        Java example
      </div>
      <pre className="m-0 max-h-64 overflow-auto bg-zinc-950 p-4 font-mono text-[13px] leading-6 text-zinc-100">
        <code>{source}</code>
      </pre>
      <div className="flex flex-col items-start gap-2 border-t border-fd-border bg-fd-muted/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="m-0 text-sm text-fd-muted-foreground">Edit this exact algorithm, compile it, and compare the output with your trace.</p>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-fd-primary px-4 py-2 text-sm font-semibold text-fd-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-primary"
        >
          <Play className="h-4 w-4" fill="currentColor" aria-hidden="true" />
          Try it yourself
        </button>
      </div>
    </section>
  );
}
