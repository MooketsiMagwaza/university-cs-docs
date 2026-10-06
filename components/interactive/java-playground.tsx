'use client';

import { useId, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, Coffee, Loader2, Play, RotateCcw } from 'lucide-react';
import { JAVA_PLAYGROUND_EXAMPLES, getJavaPlaygroundExample } from '@/lib/java-playground/examples';
import { runJava, type JavaRunResult } from '@/lib/java-playground/runner';

type JavaPlaygroundProps = {
  code?: string;
  example?: string;
  title?: string;
  description?: string;
  showExamplePicker?: boolean;
};

export function JavaPlayground({
  code: initialCode,
  example: initialExampleId,
  title = 'Java playground',
  description,
  showExamplePicker = true,
}: JavaPlaygroundProps) {
  const startingExample = getJavaPlaygroundExample(initialExampleId);
  const startingCode = initialCode ?? startingExample.code;
  const selectId = useId();
  const escapedTab = useRef(false);
  const [selected, setSelected] = useState(initialCode ? 'lesson' : startingExample.id);
  const [code, setCode] = useState(startingCode);
  const [result, setResult] = useState<JavaRunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState('');

  const loadExample = (id: string) => {
    const next = getJavaPlaygroundExample(id === 'lesson' ? initialExampleId : id);
    setSelected(id === 'lesson' ? 'lesson' : next.id);
    setCode(id === 'lesson' ? startingCode : next.code);
    setResult(null);
  };

  const run = async () => {
    if (running) return;
    setRunning(true);
    setResult(null);
    setStatus('Preparing Java…');
    try {
      setResult(await runJava(code, setStatus));
    } finally {
      setRunning(false);
      setStatus('');
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      void run();
      return;
    }
    if (event.key === 'Escape') {
      escapedTab.current = true;
      return;
    }
    if (event.key === 'Tab' && !event.shiftKey && !escapedTab.current) {
      event.preventDefault();
      const field = event.currentTarget;
      field.setRangeText('    ', field.selectionStart, field.selectionEnd, 'end');
      setCode(field.value);
      return;
    }
    if (event.key !== 'Tab') escapedTab.current = false;
  };

  const activeExample = getJavaPlaygroundExample(selected === 'lesson' ? initialExampleId : selected);
  const shownDescription = description ?? activeExample.description;

  return (
    <section className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card shadow-sm">
      <div className="border-b border-fd-border bg-fd-muted/40 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Coffee className="h-5 w-5 text-fd-primary" aria-hidden="true" />
              <h3 className="m-0 text-xl font-semibold text-fd-foreground">{title}</h3>
              <span className="rounded-full border border-fd-border bg-fd-background px-2 py-0.5 text-xs font-medium text-fd-muted-foreground">
                Java · browser
              </span>
            </div>
            <p className="mb-0 mt-2 max-w-3xl text-sm text-fd-muted-foreground">{shownDescription}</p>
          </div>
          {showExamplePicker && (
            <label htmlFor={selectId} className="flex shrink-0 items-center gap-2 text-sm text-fd-muted-foreground">
              Example
              <select
                id={selectId}
                value={selected}
                onChange={(event) => loadExample(event.target.value)}
                className="rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-sm text-fd-foreground"
              >
                {selected === 'lesson' && <option value="lesson">This lesson</option>}
                {JAVA_PLAYGROUND_EXAMPLES.map((item) => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </select>
            </label>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-2">
        <div className="min-w-0 border-b border-fd-border lg:border-b-0 lg:border-r">
          <div className="flex items-center justify-between border-b border-fd-border px-4 py-2 text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">
            <span>Main.java</span>
            <span>Ctrl + Enter to run</span>
          </div>
          <textarea
            aria-label="Java code"
            value={code}
            onChange={(event) => { setCode(event.target.value); setResult(null); }}
            onKeyDown={onKeyDown}
            onBlur={() => { escapedTab.current = false; }}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            wrap="off"
            className="min-h-[28rem] w-full resize-y whitespace-pre bg-zinc-950 p-4 font-mono text-[13px] leading-6 text-zinc-100 outline-none [tab-size:4] focus:ring-2 focus:ring-inset focus:ring-fd-primary"
          />
          <div className="flex flex-wrap items-center gap-2 border-t border-fd-border bg-fd-muted/20 px-4 py-3">
            <button
              type="button"
              onClick={() => void run()}
              disabled={running}
              className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-4 py-2 text-sm font-semibold text-fd-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-primary disabled:opacity-60"
            >
              {running ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Play className="h-4 w-4" fill="currentColor" aria-hidden="true" />}
              {running ? 'Running…' : 'Run Java'}
            </button>
            <button
              type="button"
              onClick={() => loadExample(selected)}
              disabled={running}
              className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-4 py-2 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-muted disabled:opacity-60"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset
            </button>
            <span className="ml-auto text-xs text-fd-muted-foreground">Esc, then Tab leaves the editor</span>
          </div>
        </div>

        <div className="min-h-[28rem] min-w-0 overflow-hidden bg-zinc-950 text-zinc-100">
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
            <span>Output</span>
            {result && <span>{result.elapsedMs.toFixed(0)} ms</span>}
          </div>

          {running && (
            <div className="flex min-h-96 items-center justify-center gap-2 px-6 text-center text-sm text-zinc-300" role="status">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {status || 'Running…'}
            </div>
          )}
          {!running && !result && (
            <div className="flex min-h-96 items-center justify-center px-6 text-center text-sm text-zinc-400">
              Run the program to compile Main.java and see its output here.
            </div>
          )}
          {!running && result && (
            <div className="space-y-3 p-4">
              {result.ok && (
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  Program finished
                </div>
              )}
              {result.diagnostics.length > 0 && (
                <pre className="m-0 whitespace-pre-wrap break-words rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 font-mono text-[13px] leading-6 text-amber-100">
                  {result.diagnostics.join('\n')}
                </pre>
              )}
              {result.lines.length > 0 && (
                <pre className="m-0 whitespace-pre-wrap break-words font-mono text-[13px] leading-6">
                  {result.lines.map((line, index) => (
                    <span key={index} className={line.stream === 'err' ? 'block text-amber-300' : 'block text-zinc-100'}>
                      {line.text || ' '}
                    </span>
                  ))}
                </pre>
              )}
              {result.ok && result.lines.length === 0 && (
                <p className="m-0 text-sm text-zinc-400">No output. Use System.out.println(...) to display a value.</p>
              )}
              {!result.ok && result.error && (
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-400">
                    <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                    {result.timedOut ? 'Timed out' : result.diagnostics.length ? 'Could not run' : 'Runner error'}
                  </div>
                  <pre className="m-0 whitespace-pre-wrap break-words rounded-lg border border-red-500/30 bg-red-500/10 p-3 font-mono text-[13px] leading-6 text-red-100">{result.error}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-fd-border bg-fd-muted/20 px-4 py-3 text-xs leading-5 text-fd-muted-foreground sm:px-6">
        Compiles and runs locally in Web Workers with TeaVM; source code is not uploaded. The first run loads about 6.7 MB and may take longer. Use one public class named Main. Console programs are supported; files, networking, threads, reflection-heavy code, and multiple source files are not.
      </div>
    </section>
  );
}
