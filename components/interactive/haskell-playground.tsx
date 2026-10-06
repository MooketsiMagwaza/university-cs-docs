'use client';

import { useId, useState } from 'react';
import { AlertTriangle, CheckCircle2, Play, RotateCcw, TerminalSquare } from 'lucide-react';
import { runHaskell, type HaskellRunResult } from '@/lib/haskell-simulator';
import { getPlaygroundData } from '@/lib/playground/data';

// The practice examples live in content/playground-data/haskell.json.
const examples = getPlaygroundData('haskell').examples;

type HaskellPlaygroundProps = {
  title?: string;
  description?: string;
  initialCode?: string;
  showExamplePicker?: boolean;
};

export function HaskellPlayground({
  title = 'Haskell practice runner',
  description = 'Edit a course example, run it in the browser, and inspect the result or diagnostic.',
  initialCode = examples[0].code,
  showExamplePicker = true,
}: HaskellPlaygroundProps) {
  const exampleSelectId = useId();
  const initialExampleIndex = examples.findIndex((example) => example.code === initialCode);
  const [code, setCode] = useState(initialCode);
  const [result, setResult] = useState<HaskellRunResult | null>(null);
  const [selectedExample, setSelectedExample] = useState(initialExampleIndex >= 0 ? String(initialExampleIndex) : 'lesson');

  const run = () => setResult(runHaskell(code));

  const reset = () => {
    const fallback = selectedExample === 'lesson' ? initialCode : examples[Number(selectedExample)]?.code ?? initialCode;
    setCode(fallback);
    setResult(null);
  };

  const selectExample = (index: string) => {
    setSelectedExample(index);
    setCode(index === 'lesson' ? initialCode : examples[Number(index)].code);
    setResult(null);
  };

  const diagnostic = result?.diagnostic;
  const location = diagnostic?.line
    ? `line ${diagnostic.line}${diagnostic.column ? `, column ${diagnostic.column}` : ''}`
    : undefined;

  return (
    <section className="my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card shadow-sm">
      <div className="border-b border-fd-border bg-fd-muted/40 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <TerminalSquare className="h-5 w-5 text-fd-primary" aria-hidden="true" />
              <h3 className="m-0 text-xl font-semibold text-fd-foreground">{title}</h3>
              <span className="rounded-full border border-fd-border bg-fd-background px-2 py-0.5 text-xs font-medium text-fd-muted-foreground">
                Course subset
              </span>
            </div>
            <p className="mb-0 mt-2 max-w-3xl text-sm text-fd-muted-foreground">{description}</p>
          </div>
          {showExamplePicker && (
            <label
              htmlFor={exampleSelectId}
              className="flex shrink-0 items-center gap-2 text-sm text-fd-muted-foreground"
            >
              Example
              <select
                id={exampleSelectId}
                aria-label="Example"
                value={selectedExample}
                onChange={(event) => selectExample(event.target.value)}
                className="rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-sm text-fd-foreground"
              >
                {initialExampleIndex < 0 && <option value="lesson">This lesson</option>}
                {examples.map((example, index) => (
                  <option key={example.label} value={index}>{example.label}</option>
                ))}
              </select>
            </label>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2">
        <div className="min-w-0 border-b border-fd-border lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between border-b border-fd-border px-4 py-2 text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">
            <span>Haskell</span>
            <span>Ctrl + Enter to run</span>
          </div>
          <textarea
            aria-label="Haskell code"
            value={code}
            onChange={(event) => {
              setCode(event.target.value);
              setResult(null);
            }}
            onKeyDown={(event) => {
              if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                event.preventDefault();
                run();
              }
            }}
            spellCheck={false}
            className="min-h-80 w-full resize-y bg-zinc-950 p-4 font-mono text-[13px] leading-6 text-zinc-100 outline-none focus:ring-2 focus:ring-inset focus:ring-fd-primary"
          />
          <div className="flex items-center gap-2 border-t border-fd-border bg-fd-muted/20 px-4 py-3">
            <button
              type="button"
              onClick={run}
              className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-4 py-2 text-sm font-semibold text-fd-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-primary"
            >
              <Play className="h-4 w-4" fill="currentColor" aria-hidden="true" />
              Run code
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-4 py-2 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-muted"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset
            </button>
          </div>
        </div>

        <div className="min-h-80 min-w-0 overflow-hidden bg-zinc-950 text-zinc-100">
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
            <span>Output</span>
            {result && <span>{result.elapsedMs.toFixed(1)} ms</span>}
          </div>
          {!result && (
            <div className="flex min-h-72 items-center justify-center px-6 text-center text-sm text-zinc-400">
              Run the program to see output or compiler-style feedback here.
            </div>
          )}
          {result?.ok && (
            <div className="p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-zinc-300">
                <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                Program finished
              </div>
              <pre className="m-0 whitespace-pre-wrap break-all font-mono text-[13px] leading-6 text-zinc-100">{result.output}</pre>
            </div>
          )}
          {result && !result.ok && diagnostic && (
            <div className="p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-red-400">
                <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                {diagnostic.kind}{location ? ` at ${location}` : ''}
              </div>
              <pre className="m-0 whitespace-pre-wrap break-all rounded-lg border border-red-500/30 bg-red-500/10 p-3 font-mono text-[13px] leading-6 text-red-100">{diagnostic.message}</pre>
              {diagnostic.hint && (
                <p className="mb-0 mt-3 text-sm leading-6 text-zinc-300">
                  <span className="font-semibold">Hint:</span> {diagnostic.hint}
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-fd-border bg-fd-muted/20 px-4 py-3 text-xs leading-5 text-fd-muted-foreground sm:px-6">
        Runs locally in your browser. Supports expressions, one-line function definitions, lambdas, finite and lazy ranges, list comprehensions,
        <code className="mx-1">if/then/else</code>, <code>main = do</code> with <code>let</code>/<code>print</code>/<code>putStrLn</code>,
        and the course list functions. Pattern matching, guards, imports, user-defined types, and arbitrary IO still need GHC or GHCi.
      </div>
    </section>
  );
}
