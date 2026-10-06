'use client';

import { useState } from 'react';
import { Code2, Play, X } from 'lucide-react';
import { HaskellPlayground } from './haskell-playground';

type HaskellTryItProps = {
  code: string;
  title?: string;
  description?: string;
};

export function HaskellTryIt({
  code,
  title = 'Try it yourself',
  description = 'Change the example, run it, and compare the output with your prediction.',
}: HaskellTryItProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (isOpen) {
    return (
      <div className="relative my-6 not-prose">
        <button
          type="button"
          onClick={() => setIsOpen(false)}
          className="absolute right-3 top-3 z-20 inline-flex items-center gap-1 rounded-lg border border-fd-border bg-fd-background px-2.5 py-1.5 text-xs font-medium text-fd-muted-foreground shadow-sm hover:bg-fd-muted hover:text-fd-foreground"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
          Close editor
        </button>
        <HaskellPlayground
          title={title}
          description={description}
          initialCode={code}
          showExamplePicker={false}
        />
      </div>
    );
  }

  return (
    <section className="my-6 overflow-hidden rounded-xl border border-fd-border bg-fd-card shadow-sm not-prose">
      <div className="flex items-center gap-2 border-b border-fd-border bg-fd-muted/30 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">
        <Code2 className="h-4 w-4" aria-hidden="true" />
        Example
      </div>
      <pre className="m-0 max-h-64 overflow-auto bg-zinc-950 p-4 font-mono text-[13px] leading-6 text-zinc-100">
        <code>{code}</code>
      </pre>
      <div className="flex flex-col items-start gap-2 border-t border-fd-border bg-fd-muted/20 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="m-0 text-sm text-fd-muted-foreground">Edit this exact example and see its output immediately.</p>
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
