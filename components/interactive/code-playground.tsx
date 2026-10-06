'use client';

import { useId, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, Loader2, Play, RotateCcw, TerminalSquare } from 'lucide-react';
import { EXAMPLES, LANGUAGE_META } from '@/lib/playground/examples';
import { runInWorker, type PlaygroundLanguage, type RunResult } from '@/lib/playground/runners';

type CodePlaygroundProps = {
  language: PlaygroundLanguage;
  /** Starting code. When omitted the first built-in example for the language is used. */
  code?: string;
  title?: string;
  description?: string;
  showExamplePicker?: boolean;
  /** Pre-filled text for Python's input() calls, one line per call. */
  stdin?: string;
};

export function CodePlayground({
  language,
  code: initialCode,
  title,
  description,
  showExamplePicker = true,
  stdin: initialStdin = '',
}: CodePlaygroundProps) {
  const meta = LANGUAGE_META[language];
  const examples = EXAMPLES[language];
  const startingCode = initialCode ?? examples[0].code;
  const exampleSelectId = useId();
  const stdinId = useId();
  const escapedTab = useRef(false);

  const matchIndex = examples.findIndex((example) => example.code === startingCode);
  const [selected, setSelected] = useState(matchIndex >= 0 ? String(matchIndex) : 'lesson');
  const [code, setCode] = useState(startingCode);
  const [stdin, setStdin] = useState(initialStdin);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState('');
  // The preview only changes when Run is pressed, never on every keystroke.
  const [previewDoc, setPreviewDoc] = useState(startingCode);
  const [previewRuns, setPreviewRuns] = useState(0);

  const isHtml = language === 'html';
  const exampleCode = (index: string) => (index === 'lesson' ? startingCode : examples[Number(index)]?.code ?? startingCode);

  const run = async () => {
    if (isHtml) {
      setPreviewDoc(code);
      setPreviewRuns((count) => count + 1);
      return;
    }
    if (running) return;
    setRunning(true);
    setStatus('Running…');
    setResult(null);
    try {
      setResult(await runInWorker(language, { code, stdin }, setStatus));
    } finally {
      setRunning(false);
      setStatus('');
    }
  };

  const loadCode = (next: string) => {
    setCode(next);
    setResult(null);
    if (isHtml) {
      setPreviewDoc(next);
      setPreviewRuns((count) => count + 1);
    }
  };

  const selectExample = (index: string) => {
    setSelected(index);
    loadCode(exampleCode(index));
  };

  const reset = () => loadCode(exampleCode(selected));

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
      field.setRangeText('  ', field.selectionStart, field.selectionEnd, 'end');
      setCode(field.value);
      return;
    }
    if (event.key !== 'Tab') escapedTab.current = false;
  };

  const hasOutput = result && (result.lines.length > 0 || result.tables.length > 0);

  return (
    <section className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card shadow-sm">
      <div className="border-b border-fd-border bg-fd-muted/40 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <TerminalSquare className="h-5 w-5 text-fd-primary" aria-hidden="true" />
              <h3 className="m-0 text-xl font-semibold text-fd-foreground">{title ?? `${meta.name} playground`}</h3>
              <span className="rounded-full border border-fd-border bg-fd-background px-2 py-0.5 text-xs font-medium text-fd-muted-foreground">
                {meta.name}
              </span>
            </div>
            <p className="mb-0 mt-2 max-w-3xl text-sm text-fd-muted-foreground">{description ?? meta.tagline}</p>
          </div>
          {showExamplePicker && (
            <label htmlFor={exampleSelectId} className="flex shrink-0 items-center gap-2 text-sm text-fd-muted-foreground">
              Example
              <select
                id={exampleSelectId}
                value={selected}
                onChange={(event) => selectExample(event.target.value)}
                className="rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-sm text-fd-foreground"
              >
                {matchIndex < 0 && <option value="lesson">This lesson</option>}
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
            <span>{meta.fileHint}</span>
            <span>Ctrl + Enter to run</span>
          </div>
          <textarea
            aria-label={`${meta.name} code`}
            value={code}
            onChange={(event) => {
              setCode(event.target.value);
              if (!isHtml) setResult(null);
            }}
            onKeyDown={onKeyDown}
            onBlur={() => { escapedTab.current = false; }}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            wrap="off"
            className="min-h-80 w-full resize-y whitespace-pre bg-zinc-950 p-4 font-mono text-[13px] leading-6 text-zinc-100 outline-none [tab-size:2] focus:ring-2 focus:ring-inset focus:ring-fd-primary"
          />
          {language === 'python' && (
            <div className="border-t border-zinc-800 bg-zinc-900 px-4 py-2">
              <label htmlFor={stdinId} className="mb-1 block text-xs font-semibold uppercase tracking-wide text-zinc-400">
                Input (one line per input() call)
              </label>
              <textarea
                id={stdinId}
                value={stdin}
                onChange={(event) => setStdin(event.target.value)}
                rows={2}
                spellCheck={false}
                className="w-full resize-y rounded-md border border-zinc-700 bg-zinc-950 p-2 font-mono text-[13px] leading-5 text-zinc-100 outline-none focus:border-fd-primary"
              />
            </div>
          )}
          <div className="flex flex-wrap items-center gap-2 border-t border-fd-border bg-fd-muted/20 px-4 py-3">
            <button
              type="button"
              onClick={() => void run()}
              disabled={running}
              className="inline-flex items-center gap-2 rounded-lg bg-fd-primary px-4 py-2 text-sm font-semibold text-fd-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-fd-primary disabled:opacity-60"
            >
              {running ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Play className="h-4 w-4" fill="currentColor" aria-hidden="true" />}
              {running ? 'Running…' : 'Run code'}
            </button>
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-lg border border-fd-border bg-fd-background px-4 py-2 text-sm font-medium text-fd-foreground transition-colors hover:bg-fd-muted"
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Reset
            </button>
            <span className="ml-auto text-xs text-fd-muted-foreground">Esc, then Tab leaves the editor</span>
          </div>
        </div>

        <div className="min-h-80 min-w-0 overflow-hidden bg-zinc-950 text-zinc-100">
          <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
            <span>{isHtml ? 'Result' : 'Output'}</span>
            {result && <span>{result.elapsedMs.toFixed(0)} ms</span>}
          </div>

          {isHtml && (
            <iframe
              key={previewRuns}
              title="HTML result"
              srcDoc={previewDoc}
              sandbox="allow-scripts allow-modals"
              className="block h-[22rem] w-full border-0 bg-white"
            />
          )}

          {!isHtml && running && (
            <div className="flex min-h-72 items-center justify-center gap-2 px-6 text-center text-sm text-zinc-300" role="status">
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              {status || 'Running…'}
            </div>
          )}

          {!isHtml && !running && !result && (
            <div className="flex min-h-72 items-center justify-center px-6 text-center text-sm text-zinc-400">
              Run the program to see its output here.
            </div>
          )}

          {!isHtml && !running && result && (
            <div className="space-y-3 p-4">
              {result.ok && (
                <div className="flex items-center gap-2 text-sm font-medium text-zinc-300">
                  <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                  Program finished
                </div>
              )}
              {result.lines.length > 0 && (
                <pre className="m-0 whitespace-pre-wrap break-words font-mono text-[13px] leading-6">
                  {result.lines.map((line, index) => (
                    <span
                      key={index}
                      className={line.stream === 'err' ? 'block text-amber-300' : line.stream === 'info' ? 'block text-zinc-400' : 'block text-zinc-100'}
                    >
                      {line.text || ' '}
                    </span>
                  ))}
                </pre>
              )}
              {result.tables.map((table, tableIndex) => (
                <div key={tableIndex} className="overflow-x-auto rounded-lg border border-zinc-700">
                  <table className="w-full border-collapse text-left font-mono text-[13px]">
                    <thead className="bg-zinc-800 text-zinc-200">
                      <tr>
                        {table.columns.map((column) => (
                          <th key={column} className="border-b border-zinc-700 px-3 py-1.5 font-semibold">{column}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {table.rows.map((row, rowIndex) => (
                        <tr key={rowIndex} className="odd:bg-zinc-900/60">
                          {row.map((cell, cellIndex) => (
                            <td key={cellIndex} className="border-b border-zinc-800 px-3 py-1.5">
                              {cell === null ? <span className="text-zinc-500">NULL</span> : String(cell)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <div className="bg-zinc-900 px-3 py-1 text-xs text-zinc-400">
                    {table.rows.length} row{table.rows.length === 1 ? '' : 's'}
                  </div>
                </div>
              ))}
              {result.ok && !hasOutput && (
                <p className="m-0 text-sm text-zinc-400">
                  {language === 'sql' ? 'Statements ran successfully. Add a SELECT to see rows.' : 'No output. Use print() or console.log() to show values.'}
                </p>
              )}
              {result.error && (
                <div>
                  <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-red-400">
                    <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                    {result.timedOut ? 'Timed out' : 'Error'}
                  </div>
                  <pre className="m-0 whitespace-pre-wrap break-words rounded-lg border border-red-500/30 bg-red-500/10 p-3 font-mono text-[13px] leading-6 text-red-100">{result.error}</pre>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="border-t border-fd-border bg-fd-muted/20 px-4 py-3 text-xs leading-5 text-fd-muted-foreground sm:px-6">
        {isHtml
          ? 'Your page runs in a sandboxed frame inside your browser. Nothing is uploaded.'
          : language === 'javascript'
            ? 'Runs locally in a Web Worker with a 5-second limit. It has no access to this page, and top-level await works.'
            : language === 'python'
              ? 'Runs locally with Pyodide (CPython compiled to WebAssembly). The first run downloads about 10 MB, then it is cached. Packages that need the network or files are not available.'
              : 'Runs locally with SQLite compiled to WebAssembly. The database is created fresh from your script on every run, so include your CREATE TABLE and INSERT statements.'}
      </div>
    </section>
  );
}
