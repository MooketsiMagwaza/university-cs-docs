'use client';

import { useId, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle2, Database, Loader2, Play, RotateCcw, TerminalSquare } from 'lucide-react';
import { LANGUAGE_META } from '@/lib/playground/examples';
import { getPlaygroundData } from '@/lib/playground/data';
import { runInWorker, type PlaygroundLanguage, type RunResult } from '@/lib/playground/runners';

type CodePlaygroundProps = {
  language: PlaygroundLanguage;
  /** Starting code. When omitted, the chosen example (or the first one for the language) is used. */
  code?: string;
  /** Id of an example from content/playground-data to start with. */
  example?: string;
  /** Id of a seed dataset to run before the learner's code. */
  seed?: string;
  title?: string;
  description?: string;
  showExamplePicker?: boolean;
  /** Pre-filled text for Python's input() calls, one line per call. */
  stdin?: string;
};

export function CodePlayground({
  language,
  code: initialCode,
  example: initialExampleId,
  seed: initialSeedId,
  title,
  description,
  showExamplePicker = true,
  stdin: initialStdin,
}: CodePlaygroundProps) {
  const meta = LANGUAGE_META[language];
  const { examples, seeds } = getPlaygroundData(language);
  const exampleSelectId = useId();
  const seedSelectId = useId();
  const stdinId = useId();
  const escapedTab = useRef(false);

  const startingExample = examples.find((item) => item.id === initialExampleId) ?? (initialCode === undefined ? examples[0] : undefined);
  const startingCode = initialCode ?? startingExample?.code ?? examples[0].code;
  const startingSeed = initialSeedId ?? startingExample?.seed ?? '';
  const startingStdin = initialStdin ?? startingExample?.stdin ?? '';

  const [selected, setSelected] = useState(startingExample?.id ?? 'lesson');
  const [seedId, setSeedId] = useState(startingSeed);
  const [code, setCode] = useState(startingCode);
  const [stdin, setStdin] = useState(startingStdin);
  const [result, setResult] = useState<RunResult | null>(null);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState('');
  // The preview only changes when Run is pressed, never on every keystroke.
  const [previewDoc, setPreviewDoc] = useState(startingCode);
  const [previewRuns, setPreviewRuns] = useState(0);

  const isHtml = language === 'html';
  const activeSeed = seeds.find((item) => item.id === seedId);

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
      setResult(await runInWorker(language, { code, stdin, prelude: activeSeed?.code }, setStatus));
    } finally {
      setRunning(false);
      setStatus('');
    }
  };

  const loadExample = (id: string) => {
    const example = examples.find((item) => item.id === id);
    const nextCode = example?.code ?? startingCode;
    setSelected(example ? example.id : 'lesson');
    setSeedId(example ? example.seed ?? '' : startingSeed);
    setStdin(example ? example.stdin ?? '' : startingStdin);
    setCode(nextCode);
    setResult(null);
    if (isHtml) {
      setPreviewDoc(nextCode);
      setPreviewRuns((count) => count + 1);
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
      field.setRangeText('  ', field.selectionStart, field.selectionEnd, 'end');
      setCode(field.value);
      return;
    }
    if (event.key !== 'Tab') escapedTab.current = false;
  };

  const hasOutput = result && (result.lines.length > 0 || result.tables.length > 0);
  const selectClass = 'rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-sm text-fd-foreground';

  return (
    <section className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-card shadow-sm">
      <div className="border-b border-fd-border bg-fd-muted/40 px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
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
            <div className="flex shrink-0 flex-wrap items-center gap-x-4 gap-y-2">
              <label htmlFor={exampleSelectId} className="flex items-center gap-2 text-sm text-fd-muted-foreground">
                Example
                <select
                  id={exampleSelectId}
                  value={selected}
                  onChange={(event) => loadExample(event.target.value)}
                  className={selectClass}
                >
                  {selected === 'lesson' && <option value="lesson">This lesson</option>}
                  {examples.map((example) => (
                    <option key={example.id} value={example.id}>{example.label}</option>
                  ))}
                </select>
              </label>
              {seeds.length > 0 && (
                <label htmlFor={seedSelectId} className="flex items-center gap-2 text-sm text-fd-muted-foreground">
                  Dataset
                  <select
                    id={seedSelectId}
                    value={seedId}
                    onChange={(event) => { setSeedId(event.target.value); setResult(null); }}
                    className={selectClass}
                  >
                    <option value="">None</option>
                    {seeds.map((seed) => (
                      <option key={seed.id} value={seed.id}>{seed.label}</option>
                    ))}
                  </select>
                </label>
              )}
            </div>
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
          {activeSeed && (
            <details className="border-t border-zinc-800 bg-zinc-900 text-zinc-300">
              <summary className="flex cursor-pointer items-center gap-2 px-4 py-2 text-xs font-semibold uppercase tracking-wide text-zinc-400">
                <Database className="h-3.5 w-3.5" aria-hidden="true" />
                Dataset loaded: {activeSeed.label}
              </summary>
              <p className="m-0 px-4 pb-2 text-sm leading-5 text-zinc-400">
                {activeSeed.description} It runs before your code on every run, so you do not need to write it yourself.
              </p>
              <pre className="m-0 max-h-60 overflow-auto border-t border-zinc-800 p-4 font-mono text-[12px] leading-5 text-zinc-300">{activeSeed.code}</pre>
            </details>
          )}
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
              onClick={() => loadExample(selected)}
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
              : 'Runs locally with SQLite compiled to WebAssembly. The database is created fresh on every run: pick a dataset to start with ready-made tables, or write your own CREATE TABLE and INSERT statements.'}
      </div>
    </section>
  );
}
