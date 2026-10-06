/**
 * Browser-side runners for the interactive playgrounds.
 *
 * JavaScript, Python and SQL all execute inside a Web Worker created from a Blob.
 * A worker has no access to the page, cookies or storage, and it can be terminated
 * when a program never finishes, so a runaway `while (true)` cannot freeze the site.
 * Python (Pyodide) and SQL (sql.js) are downloaded from a CDN the first time they run
 * and then cached by the browser.
 */

export type PlaygroundLanguage = 'html' | 'javascript' | 'python' | 'sql';

export type OutputLine = { stream: 'out' | 'err' | 'info'; text: string };
export type SqlTable = { columns: string[]; rows: (string | number | null)[][] };

export type RunResult = {
  ok: boolean;
  lines: OutputLine[];
  tables: SqlTable[];
  error?: string;
  elapsedMs: number;
  timedOut?: boolean;
};

type WorkerReply =
  | { id: number; type: 'status'; text: string }
  | { id: number; type: 'line'; stream: OutputLine['stream']; text: string }
  | { id: number; type: 'done'; tables?: SqlTable[]; error?: string };

type Job = {
  code: string;
  stdin?: string;
  /** Seed dataset code that runs first, in the same scope, so the learner's code can use what it defines. */
  prelude?: string;
};

const PYODIDE_VERSION = '0.27.2';
const PYODIDE_BASE = `https://cdn.jsdelivr.net/pyodide/v${PYODIDE_VERSION}/full/`;
const SQLJS_BASE = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.12.0/';

const JAVASCRIPT_WORKER = String.raw`
const format = (value, depth = 0) => {
  if (typeof value === 'string') return depth === 0 ? value : JSON.stringify(value);
  if (typeof value === 'function') return '[Function' + (value.name ? ': ' + value.name : '') + ']';
  if (typeof value === 'bigint') return value + 'n';
  if (typeof value === 'symbol') return value.toString();
  if (value === undefined) return 'undefined';
  if (value instanceof Error) return value.name + ': ' + value.message;
  if (value === null || typeof value !== 'object') return String(value);
  if (depth > 3) return Array.isArray(value) ? '[Array]' : '[Object]';
  if (value instanceof Map) return 'Map(' + value.size + ') {' + [...value].map(([k, v]) => format(k, depth + 1) + ' => ' + format(v, depth + 1)).join(', ') + '}';
  if (value instanceof Set) return 'Set(' + value.size + ') {' + [...value].map((v) => format(v, depth + 1)).join(', ') + '}';
  if (Array.isArray(value)) return '[' + value.map((v) => format(v, depth + 1)).join(', ') + ']';
  const entries = Object.keys(value).map((key) => key + ': ' + format(value[key], depth + 1));
  return '{' + (entries.length ? ' ' + entries.join(', ') + ' ' : '') + '}';
};

self.onmessage = async (event) => {
  const { id, code, prelude } = event.data;
  const post = (stream, text) => self.postMessage({ id, type: 'line', stream, text });
  const log = (stream) => (...args) => post(stream, args.map((arg) => format(arg)).join(' '));
  console.log = log('out');
  console.info = log('out');
  console.debug = log('out');
  console.warn = log('err');
  console.error = log('err');
  self.alert = (message) => post('out', String(message));
  try {
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    const result = await new AsyncFunction(prelude ? prelude + '\n' + code : code)();
    if (result !== undefined) post('info', '= ' + format(result, 1));
    self.postMessage({ id, type: 'done' });
  } catch (error) {
    const message = error && error.stack ? String(error.stack).split('\n')[0] : String(error);
    self.postMessage({ id, type: 'done', error: error instanceof Error ? error.name + ': ' + error.message : message });
  }
};
`;

const PYTHON_WORKER = String.raw`
let pyodide;
let loading;
// A failed download must not be cached, otherwise one network blip breaks every later run.
const ready = () => {
  if (!loading) {
    loading = (async () => {
      importScripts(${JSON.stringify(PYODIDE_BASE + 'pyodide.js')});
      pyodide = await loadPyodide({ indexURL: ${JSON.stringify(PYODIDE_BASE)} });
    })().catch((error) => { loading = undefined; throw error; });
  }
  return loading;
};

const cleanTraceback = (message) => {
  const lines = String(message).split('\n');
  const start = lines.findIndex((line) => line.startsWith('Traceback'));
  const body = start >= 0 ? lines.slice(start) : lines;
  const kept = [];
  for (let i = 0; i < body.length; i++) {
    const line = body[i];
    const internal = /File "(\/lib\/python|\/home\/pyodide|<frozen)/.test(line) || line.includes('_pyodide');
    if (internal) {
      // Drop the frame header and the indented source/caret lines that belong to it.
      while (i + 1 < body.length && /^\s/.test(body[i + 1]) && !/^\s*File /.test(body[i + 1])) i += 1;
      continue;
    }
    kept.push(line);
  }
  return kept.join('\n').trim();
};

self.onmessage = async (event) => {
  const { id, code, stdin, prelude } = event.data;
  self.postMessage({ id, type: 'status', text: pyodide ? 'Running…' : 'Loading Python (first run only)…' });
  try {
    await ready();
    const input = (stdin || '').split('\n');
    let cursor = 0;
    const post = (stream, text) => self.postMessage({ id, type: 'line', stream, text });
    // stdout is collected byte by byte so a prompt such as input("Name? ") can be shown
    // together with the line that answers it, like a terminal would.
    const decoder = new TextDecoder();
    let pending = '';
    const flushLine = () => { post('out', pending); pending = ''; };
    pyodide.setStdout({
      raw: (byte) => {
        const text = decoder.decode(Uint8Array.of(byte), { stream: true });
        if (text === '\n') flushLine();
        else pending += text;
      },
    });
    pyodide.setStderr({ batched: (text) => post('err', text) });
    pyodide.setStdin({
      stdin: () => {
        if (cursor >= input.length) return null;
        const line = input[cursor++];
        post('out', pending + line);
        pending = '';
        return line;
      },
    });
    const globals = pyodide.globals.get('dict')();
    try {
      // The seed runs first in the same globals, so tracebacks from the learner's code keep their own line numbers.
      if (prelude) await pyodide.runPythonAsync(prelude, { globals });
      await pyodide.runPythonAsync(code, { globals });
    } finally {
      globals.destroy();
      if (pending) flushLine();
    }
    self.postMessage({ id, type: 'done' });
  } catch (error) {
    self.postMessage({ id, type: 'done', error: cleanTraceback(error && error.message ? error.message : error) });
  }
};
`;

const SQL_WORKER = String.raw`
let SQL;
let loading;
const ready = () => {
  if (!loading) {
    loading = (async () => {
      importScripts(${JSON.stringify(SQLJS_BASE + 'sql-wasm.js')});
      SQL = await initSqlJs({ locateFile: (file) => ${JSON.stringify(SQLJS_BASE)} + file });
    })().catch((error) => { loading = undefined; throw error; });
  }
  return loading;
};

self.onmessage = async (event) => {
  const { id, code, prelude } = event.data;
  self.postMessage({ id, type: 'status', text: SQL ? 'Running…' : 'Loading SQLite (first run only)…' });
  try {
    await ready();
    const db = new SQL.Database();
    try {
      if (prelude) db.exec(prelude);
      const results = db.exec(code);
      const tables = results.map((table) => ({ columns: table.columns, rows: table.values }));
      self.postMessage({ id, type: 'done', tables });
    } finally {
      db.close();
    }
  } catch (error) {
    self.postMessage({ id, type: 'done', error: error && error.message ? error.message : String(error) });
  }
};
`;

const WORKER_SOURCES: Record<Exclude<PlaygroundLanguage, 'html'>, string> = {
  javascript: JAVASCRIPT_WORKER,
  python: PYTHON_WORKER,
  sql: SQL_WORKER,
};

// Python and SQL keep their worker alive between runs so the runtime is only downloaded once.
// JavaScript gets a fresh worker per run so one run can never leak state into the next.
const PERSISTENT: Record<Exclude<PlaygroundLanguage, 'html'>, boolean> = {
  javascript: false,
  python: true,
  sql: true,
};

const TIMEOUT_MS: Record<Exclude<PlaygroundLanguage, 'html'>, number> = {
  javascript: 5_000,
  python: 15_000,
  sql: 10_000,
};
// The first Python/SQL run also has to download the runtime, so it gets extra time.
const FIRST_RUN_EXTRA_MS = 45_000;

const sharedWorkers = new Map<string, Worker>();
const warmedUp = new Set<string>();
let nextJobId = 1;

function createWorker(language: keyof typeof WORKER_SOURCES): Worker {
  const blob = new Blob([WORKER_SOURCES[language]], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  const worker = new Worker(url);
  URL.revokeObjectURL(url);
  return worker;
}

function discardPersistentWorker(language: keyof typeof WORKER_SOURCES, worker: Worker) {
  worker.terminate();
  if (sharedWorkers.get(language) === worker) sharedWorkers.delete(language);
  warmedUp.delete(language);
}

export function runInWorker(
  language: Exclude<PlaygroundLanguage, 'html'>,
  job: Job,
  onStatus?: (text: string) => void,
): Promise<RunResult> {
  return new Promise((resolve) => {
    const started = performance.now();
    const id = nextJobId++;
    const persistent = PERSISTENT[language];
    const worker = persistent ? sharedWorkers.get(language) ?? createWorker(language) : createWorker(language);
    if (persistent) sharedWorkers.set(language, worker);

    const lines: OutputLine[] = [];
    let settled = false;
    const budget = TIMEOUT_MS[language] + (persistent && !warmedUp.has(language) ? FIRST_RUN_EXTRA_MS : 0);

    const finish = (result: Partial<RunResult>) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      worker.removeEventListener('message', onMessage);
      worker.removeEventListener('error', onError);
      if (!persistent) worker.terminate();
      resolve({
        ok: !result.error && !result.timedOut,
        lines,
        tables: result.tables ?? [],
        error: result.error,
        timedOut: result.timedOut,
        elapsedMs: performance.now() - started,
      });
    };

    const onMessage = (event: MessageEvent<WorkerReply>) => {
      const message = event.data;
      if (message.id !== id) return;
      if (message.type === 'status') onStatus?.(message.text);
      else if (message.type === 'line') lines.push({ stream: message.stream, text: message.text });
      else {
        warmedUp.add(language);
        finish({ tables: message.tables, error: message.error });
      }
    };
    const onError = (event: ErrorEvent) => {
      if (persistent) discardPersistentWorker(language, worker);
      finish({ error: event.message || 'The runner crashed.' });
    };

    const timer = setTimeout(() => {
      if (persistent) discardPersistentWorker(language, worker);
      else worker.terminate();
      finish({
        timedOut: true,
        error: `Stopped after ${Math.round(budget / 1000)} seconds. The program may contain an infinite loop.`,
      });
    }, budget);

    worker.addEventListener('message', onMessage);
    worker.addEventListener('error', onError);
    try {
      worker.postMessage({ id, ...job });
    } catch (error) {
      if (persistent) discardPersistentWorker(language, worker);
      finish({ error: error instanceof Error ? error.message : 'The runner could not start.' });
    }
  });
}
