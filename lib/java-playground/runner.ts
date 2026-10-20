import { explainJavaFailure, prepareJava, topLevelTypeNames } from './compat';

export type JavaOutputLine = { stream: 'out' | 'err'; text: string };

export type JavaRunResult = {
  ok: boolean;
  lines: JavaOutputLine[];
  diagnostics: string[];
  /** Plain-language explanations: what was changed to make the program run, and why it failed. */
  notes?: string[];
  error?: string;
  elapsedMs: number;
  timedOut?: boolean;
};

export type JavaRunOptions = {
  /** What the program reads from System.in (the Input box). */
  stdin?: string;
};

type CompilerMessage = {
  id?: string;
  command: string;
  status?: string;
  script?: Int8Array | ArrayBuffer;
  severity?: string;
  fileName?: string;
  lineNumber?: number;
  columnNumber?: number;
  message?: string;
  text?: string;
};

const MAX_OUTPUT_LINES = 2000;
const MAX_OUTPUT_CHARACTERS = 256 * 1024;

let compilerWorker: Worker | undefined;
let compilerReady: Promise<Worker> | undefined;
let requestId = 1;
let queue: Promise<unknown> = Promise.resolve();
/** The types the last program declared. The compiler keeps the classes of earlier programs. */
let previousTypes: string[] = [];

function resetCompiler() {
  compilerWorker?.terminate();
  compilerWorker = undefined;
  compilerReady = undefined;
  previousTypes = [];
}

function waitForMessage(
  worker: Worker,
  matches: (message: CompilerMessage) => boolean,
  onMessage: (message: CompilerMessage) => void,
  timeoutMs: number,
) {
  return new Promise<CompilerMessage>((resolve, reject) => {
    const timer = window.setTimeout(() => {
      cleanup();
      reject(new Error('The Java compiler did not respond in time.'));
    }, timeoutMs);

    const handleMessage = (event: MessageEvent<CompilerMessage>) => {
      const message = event.data;
      onMessage(message);
      if (matches(message)) {
        cleanup();
        resolve(message);
      }
    };
    const handleError = (event: ErrorEvent) => {
      cleanup();
      reject(new Error(event.message || 'The Java compiler worker crashed.'));
    };
    const cleanup = () => {
      window.clearTimeout(timer);
      worker.removeEventListener('message', handleMessage);
      worker.removeEventListener('error', handleError);
    };

    worker.addEventListener('message', handleMessage);
    worker.addEventListener('error', handleError);
  });
}

async function getCompiler(onStatus?: (status: string) => void) {
  if (compilerReady) return compilerReady;

  compilerReady = (async () => {
    onStatus?.('Loading the Java compiler (first run is about 6.7 MB)…');
    const worker = new Worker('/java-playground/compiler-worker.js', { type: 'module' });
    compilerWorker = worker;

    await waitForMessage(worker, (message) => message.command === 'initialized', () => {}, 45_000);

    const id = String(requestId++);
    const loaded = waitForMessage(
      worker,
      (message) => message.id === id && (message.command === 'ok' || message.command === 'error'),
      () => {},
      60_000,
    );
    worker.postMessage({
      id,
      command: 'load-classlib',
      url: '/java-playground/compile-classlib-teavm.bin',
      runtimeUrl: '/java-playground/runtime-classlib-teavm.bin',
    });
    const response = await loaded;
    if (response.command !== 'ok') {
      throw new Error(response.text || 'The Java standard library could not be loaded.');
    }
    return worker;
  })().catch((error) => {
    resetCompiler();
    throw error;
  });

  return compilerReady;
}

function formatDiagnostic(message: CompilerMessage) {
  // TeaVM forwards javax.tools.Diagnostic positions, which are already 1-based.
  const location = message.lineNumber !== undefined && message.lineNumber > 0
    ? `line ${message.lineNumber}${message.columnNumber !== undefined && message.columnNumber > 0 ? `:${message.columnNumber}` : ''}`
    : message.fileName || 'compiler';
  const detail = message.message || message.text || 'Compilation diagnostic';
  return `${(message.severity || 'error').toUpperCase()} ${location}: ${detail}`;
}

function execute(script: Int8Array | ArrayBuffer, onStatus?: (status: string) => void) {
  return new Promise<{ lines: JavaOutputLine[]; error?: string; timedOut?: boolean }>((resolve) => {
    onStatus?.('Running in the browser…');
    const worker = new Worker('/java-playground/executor-worker.js?v=5', { type: 'module' });
    const lines: JavaOutputLine[] = [];
    let outputCharacters = 0;
    let settled = false;
    const finish = (result: { error?: string; timedOut?: boolean }) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timer);
      worker.terminate();
      resolve({ lines, ...result });
    };
    const timer = window.setTimeout(() => {
      finish({ error: 'Stopped after 5 seconds. The program may contain an infinite loop.', timedOut: true });
    }, 5_000);

    worker.addEventListener('message', (event: MessageEvent<{ type: string; stream?: 'out' | 'err'; text?: string; error?: string }>) => {
      const message = event.data;
      if (message.type === 'line' && message.stream) {
        const text = message.text || '';
        outputCharacters += text.length + 1;
        if (lines.length >= MAX_OUTPUT_LINES || outputCharacters > MAX_OUTPUT_CHARACTERS) {
          finish({ error: `Output limit exceeded (${MAX_OUTPUT_LINES} lines or ${MAX_OUTPUT_CHARACTERS / 1024} KiB).` });
          return;
        }
        lines.push({ stream: message.stream, text });
      } else if (message.type === 'done') {
        finish({ error: message.error });
      }
    });
    worker.addEventListener('error', (event) => finish({ error: `Java runtime worker crashed: ${event.message || 'unknown error'}` }));

    const bytes = script instanceof ArrayBuffer ? new Uint8Array(script) : new Uint8Array(script);
    const copy = bytes.slice();
    worker.postMessage({ code: copy }, [copy.buffer]);
  });
}

type Compiled = { script?: Int8Array | ArrayBuffer; diagnostics: string[]; error?: string };

async function compile(source: string, onStatus?: (status: string) => void): Promise<Compiled> {
  const diagnostics: string[] = [];
  const worker = await getCompiler(onStatus);
  onStatus?.('Compiling Main.java…');
  const id = String(requestId++);
  const completed = waitForMessage(
    worker,
    (message) => message.id === id && (message.command === 'compilation-complete' || message.command === 'error'),
    (message) => {
      if (message.id === id && (message.command === 'compiler-diagnostic' || message.command === 'diagnostic')) {
        diagnostics.push(formatDiagnostic(message));
      }
    },
    60_000,
  );
  worker.postMessage({ id, command: 'compile', text: source });
  const response = await completed;

  if (response.command === 'error') return { diagnostics, error: response.text || 'Compilation failed.' };
  if (response.status !== 'successful' || !response.script) {
    return { diagnostics, error: diagnostics.length ? undefined : 'Compilation failed.' };
  }
  return { script: response.script, diagnostics };
}

async function runJavaNow(code: string, onStatus?: (status: string) => void, options: JavaRunOptions = {}): Promise<JavaRunResult> {
  const started = performance.now();
  const prepared = prepareJava(code, options.stdin ?? '');
  const notes = [...prepared.notes];

  try {
    // The compiler keeps the classes of earlier programs. A type the last program had and this one lacks would stay
    // behind and could clash (two classes with a main method), so start from a fresh compiler when that happens.
    const types = topLevelTypeNames(prepared.code);
    if (previousTypes.some((name) => !types.includes(name))) resetCompiler();

    let compiled = await compile(prepared.code, onStatus);
    const clash = (result: Compiled) => /Multiple main methods found/.test(`${result.diagnostics.join('\n')}\n${result.error ?? ''}`);
    if (!compiled.script && clash(compiled)) {
      resetCompiler();
      compiled = await compile(prepared.code, onStatus);
    }
    previousTypes = types;

    if (!compiled.script) {
      const hints = explainJavaFailure(compiled.diagnostics, compiled.error, prepared.code);
      return {
        ok: false,
        lines: [],
        diagnostics: compiled.diagnostics,
        notes: [...notes, ...hints],
        error: compiled.error,
        elapsedMs: performance.now() - started,
      };
    }

    const execution = await execute(compiled.script, onStatus);
    let error = execution.error;
    if (error) {
      const hints = explainJavaFailure([], error, prepared.code);
      // A JavaScript stack trace means nothing to a student; the explanation replaces it.
      if (hints.length && /RangeError|RuntimeError|WebAssembly|at .*\(.*:\d+:\d+\)/.test(error)) error = hints.join('\n');
      else notes.push(...hints);
    }
    return {
      ok: !error,
      lines: execution.lines,
      diagnostics: compiled.diagnostics,
      notes,
      error,
      timedOut: execution.timedOut,
      elapsedMs: performance.now() - started,
    };
  } catch (error) {
    resetCompiler();
    return {
      ok: false,
      lines: [],
      diagnostics: [],
      notes,
      error: `Java compiler worker failed: ${error instanceof Error ? error.message : String(error)}`,
      elapsedMs: performance.now() - started,
    };
  }
}

export function runJava(code: string, onStatus?: (status: string) => void, options?: JavaRunOptions) {
  const task = queue.then(() => runJavaNow(code, onStatus, options), () => runJavaNow(code, onStatus, options));
  queue = task.then(() => undefined, () => undefined);
  return task;
}
