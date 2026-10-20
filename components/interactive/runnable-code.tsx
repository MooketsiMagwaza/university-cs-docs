'use client';

import { Play, RotateCcw } from 'lucide-react';
import { Children, isValidElement, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { runSession, sessionCommands, transcriptStream } from '@/lib/ghci-session';
import { runJava } from '@/lib/java-playground/runner';
import { getPlaygroundData } from '@/lib/playground/data';
import { runInWorker, type SqlTable } from '@/lib/playground/runners';
import { CodeWindow, nodeText } from './code-window';

export type RunnableLanguage = 'haskell' | 'java' | 'javascript' | 'python' | 'sql';

/** `in` is a GHCi prompt line (`ghci> 3 + 4`); `out` is what the program printed. */
type Line = { stream: 'in' | 'out' | 'err' | 'info'; text: string };
type Outcome = { ok: boolean; lines: Line[]; tables: SqlTable[]; elapsedMs: number };

const LABELS: Record<RunnableLanguage, string> = {
  haskell: 'Haskell (course subset)',
  java: 'Java',
  javascript: 'JavaScript',
  python: 'Python',
  sql: 'SQL',
};

const err = (text: string): Line => ({ stream: 'err', text });
const info = (text: string): Line => ({ stream: 'info', text });

/** Runs the code with the runner for its language and puts the answer in one shape. */
async function execute(
  language: RunnableLanguage,
  code: string,
  options: { stdin?: string; prelude?: string; session?: boolean },
  onStatus: (text: string) => void,
): Promise<Outcome> {
  if (language === 'haskell' && options.session) {
    const { runHaskellWithInput } = await import('@/lib/haskell-simulator');
    const result = runSession(sessionCommands(code), (source) => runHaskellWithInput(source, ''));
    const lines: Line[] = result.lines.map((line) => ({ stream: line.stream, text: line.text }));
    if (result.failure?.hint) lines.push(info(`Hint: ${result.failure.hint}`));
    return { ok: result.ok, lines, tables: [], elapsedMs: result.elapsedMs };
  }

  if (language === 'haskell') {
    // The interpreter is a large module, so it is fetched when someone first presses Run, not with every page.
    const { runHaskellWithInput } = await import('@/lib/haskell-simulator');
    const result = runHaskellWithInput(code, options.stdin ?? '');
    if (result.ok) {
      const lines: Line[] = result.output === '' ? [info('The program ran and printed nothing.')] : result.output.split('\n').map((text) => ({ stream: 'out', text }));
      return { ok: true, lines, tables: [], elapsedMs: result.elapsedMs };
    }
    const diagnostic = result.diagnostic;
    const where = diagnostic?.line ? ` at line ${diagnostic.line}${diagnostic.column ? `, column ${diagnostic.column}` : ''}` : '';
    const lines = [err(`${diagnostic?.kind ?? 'Error'}${where}`), ...(diagnostic ? diagnostic.message.split('\n').map(err) : [])];
    if (diagnostic?.hint) lines.push(info(`Hint: ${diagnostic.hint}`));
    return { ok: false, lines, tables: [], elapsedMs: result.elapsedMs };
  }

  if (language === 'java') {
    const result = await runJava(code, onStatus, { stdin: options.stdin });
    const lines: Line[] = [...result.lines.map((line) => ({ stream: line.stream, text: line.text })), ...result.diagnostics.map(err)];
    if (result.error) lines.push(err(result.error));
    for (const note of result.notes ?? []) lines.push(info(note));
    if (result.timedOut) lines.push(info('Stopped: the program ran for too long.'));
    return { ok: result.ok, lines, tables: [], elapsedMs: result.elapsedMs };
  }

  const result = await runInWorker(language, { code, stdin: options.stdin, prelude: options.prelude }, onStatus);
  const lines: Line[] = result.lines.map((line) => ({ stream: line.stream, text: line.text }));
  if (result.error) lines.push(err(result.error));
  if (result.timedOut) lines.push(info('Stopped: the program ran for too long.'));
  return { ok: result.ok, lines, tables: result.tables, elapsedMs: result.elapsedMs };
}

/** Programs that read what the reader types: Haskell's getLine and friends, Python's input(), Java's Scanner. */
function readsInput(language: RunnableLanguage, code: string): boolean {
  if (language === 'haskell') return /\b(getLine|readLn|getContents|interact)\b/.test(code);
  if (language === 'python') return /\binput\s*\(/.test(code);
  if (language === 'java') return /\b(Scanner|BufferedReader)\b|\bSystem\.in\b/.test(code);
  return false;
}

/**
 * The parts of a Try it yourself tag written with fenced children: the first fence is the program, and an optional
 * second fence is the output the page shows for it, which stays visible until the reader runs the program.
 */
export function tryItParts(children: ReactNode): { code: string; output?: string } {
  const blocks = Children.toArray(children).filter(isValidElement);
  if (blocks.length >= 2) return { code: nodeText(blocks[0]).replace(/\n$/, ''), output: nodeText(blocks[1]).replace(/\n$/, '') };
  return { code: nodeText(children).replace(/\n$/, '') };
}

type RunnableCodeProps = {
  language: RunnableLanguage;
  code: string;
  /** The output the page shows for this program; it appears in the Output window until the first run. */
  expected?: string;
  /** Haskell only: the code is a GHCi session (one command per line), and the output is the transcript. */
  session?: boolean;
  /** Input the program reads (Python input(), for example). */
  stdin?: string;
  /** Id of a seed dataset (content/playground-data) that runs first, for the SQL, Python and JavaScript examples. */
  seed?: string;
};

/**
 * A "Try it yourself" example that runs where it stands: a code window with an editable program, Run and Reset
 * buttons, and the Output panel joined beneath it. Ctrl or Cmd + Enter runs it.
 */
export function RunnableCode({ language, code, expected, session, stdin, seed }: RunnableCodeProps) {
  const label = session && language === 'haskell' ? 'GHCi session' : LABELS[language];
  const [text, setText] = useState(code);
  const [input, setInput] = useState(stdin ?? '');
  const [outcome, setOutcome] = useState<Outcome | null>(null);
  const [running, setRunning] = useState(false);
  const [status, setStatus] = useState('');
  const leaveEditor = useRef(false);
  const latestRun = useRef(0);

  const prelude = seed && language !== 'haskell' && language !== 'java' ? getPlaygroundData(language).seeds.find((item) => item.id === seed)?.code : undefined;
  const lineCount = text.split('\n').length;
  const outputText = outcome ? outcome.lines.map((line) => line.text).join('\n') : expected ?? '';

  const run = async () => {
    if (running) return;
    const id = ++latestRun.current;
    setRunning(true);
    setStatus('');
    try {
      const result = await execute(language, text, { stdin: input, prelude, session }, setStatus);
      if (id === latestRun.current) setOutcome(result);
    } finally {
      if (id === latestRun.current) {
        setRunning(false);
        setStatus('');
      }
    }
  };

  const reset = () => {
    latestRun.current += 1;
    setText(code);
    setInput(stdin ?? '');
    setOutcome(null);
    setRunning(false);
    setStatus('');
  };

  const onKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
      event.preventDefault();
      void run();
      return;
    }
    if (event.key === 'Escape') {
      // Esc then Tab moves focus on, as in the playgrounds.
      leaveEditor.current = true;
      return;
    }
    if (event.key === 'Tab' && !event.shiftKey && !leaveEditor.current) {
      event.preventDefault();
      const field = event.currentTarget;
      const { selectionStart, selectionEnd } = field;
      const next = `${text.slice(0, selectionStart)}  ${text.slice(selectionEnd)}`;
      setText(next);
      requestAnimationFrame(() => field.setSelectionRange(selectionStart + 2, selectionStart + 2));
      return;
    }
    leaveEditor.current = false;
  };

  return (
    <>
      <CodeWindow
        kind="code"
        language={language}
        name={label}
        tag="Try it yourself"
        text={text}
        bare
        editor
        copyText={() => text}
        actions={
          <>
            <button type="button" className="ui-btn ui-btn-primary ui-btn-sm" onClick={() => void run()} disabled={running}>
              <Play size={13} aria-hidden="true" /> {running ? 'Running' : 'Run'}
            </button>
            <button type="button" className="ui-btn ui-btn-sm" onClick={reset}>
              <RotateCcw size={13} aria-hidden="true" /> Reset
            </button>
          </>
        }
      >
        <div className="cw-editor">
          <div className="cw-gutter" aria-hidden="true">
            {Array.from({ length: Math.max(lineCount, 3) }, (_, index) => index + 1).join('\n')}
          </div>
          <textarea
            className="cw-textarea"
            value={text}
            rows={Math.max(lineCount, 3)}
            wrap="off"
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            aria-label={`${label} code you can change and run`}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={onKeyDown}
          />
        </div>
        {!session && readsInput(language, text) && (
          <label className="cw-stdin">
            <span>Input</span>
            <textarea
              rows={2}
              value={input}
              wrap="off"
              spellCheck={false}
              placeholder="What the program reads, one line per line"
              aria-label="Text the program reads as input, one line per line"
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
                  event.preventDefault();
                  void run();
                }
              }}
            />
          </label>
        )}
      </CodeWindow>
      <CodeWindow kind="output" name={session ? 'GHCi' : 'Output'} tag={outcome && !running ? `${outcome.elapsedMs < 10 ? outcome.elapsedMs.toFixed(1) : Math.round(outcome.elapsedMs)} ms` : undefined} text={outputText} bare live copyText={() => outputText}>
        <div className="cw-out">
          {running ? (
            <p className="cw-out-note">{status || 'Running…'}</p>
          ) : !outcome && expected !== undefined ? (
            <>
              {expected.split('\n').map((line, index) => (
                <div key={index} className="cw-ln" data-stream={session ? transcriptStream(line) : 'out'}>
                  {line}
                </div>
              ))}
              <p className="cw-out-note">{session ? 'This is the session as the page shows it. Change a command and press Run, or Ctrl + Enter, to see yours.' : 'This is the output shown for the program as written. Change the code and press Run, or Ctrl + Enter, to see yours.'}</p>
            </>
          ) : !outcome ? (
            <p className="cw-out-note">Press Run, or Ctrl + Enter, to see the output here. Tab adds spaces; press Esc and then Tab to leave the editor.</p>
          ) : (
            <>
              {outcome.lines.map((line, index) => (
                <div key={index} className="cw-ln" data-stream={line.stream}>
                  {line.text}
                </div>
              ))}
              {outcome.tables.map((table, index) => (
                <div key={index} className="cw-table-wrap">
                  <table>
                    <thead>
                      <tr>{table.columns.map((column) => <th key={column}>{column}</th>)}</tr>
                    </thead>
                    <tbody>
                      {table.rows.map((row, rowIndex) => (
                        <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{cell === null ? 'NULL' : String(cell)}</td>)}</tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </>
          )}
        </div>
      </CodeWindow>
    </>
  );
}
