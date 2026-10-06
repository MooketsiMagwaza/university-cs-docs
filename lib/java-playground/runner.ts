export type JavaOutputLine = { stream: 'out' | 'err'; text: string };

export type JavaRunResult = {
  ok: boolean;
  lines: JavaOutputLine[];
  diagnostics: string[];
  error?: string;
  elapsedMs: number;
  timedOut?: boolean;
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

const MAX_OUTPUT_LINES = 500;
const MAX_OUTPUT_CHARACTERS = 64 * 1024;

let compilerWorker: Worker | undefined;
let compilerReady: Promise<Worker> | undefined;
let requestId = 1;
let queue: Promise<unknown> = Promise.resolve();

function resetCompiler() {
  compilerWorker?.terminate();
  compilerWorker = undefined;
  compilerReady = undefined;
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
    const worker = new Worker('/java-playground/executor-worker.js?v=4', { type: 'module' });
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
          finish({ error: 'Output limit exceeded (500 lines or 64 KiB).' });
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

async function runJavaNow(code: string, onStatus?: (status: string) => void): Promise<JavaRunResult> {
  const started = performance.now();
  const diagnostics: string[] = [];

  try {
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
    worker.postMessage({ id, command: 'compile', text: code });
    const response = await completed;

    if (response.command === 'error') {
      return { ok: false, lines: [], diagnostics, error: response.text || 'Compilation failed.', elapsedMs: performance.now() - started };
    }
    if (response.status !== 'successful' || !response.script) {
      return { ok: false, lines: [], diagnostics, error: diagnostics.length ? undefined : 'Compilation failed.', elapsedMs: performance.now() - started };
    }

    const execution = await execute(response.script, onStatus);
    return {
      ok: !execution.error,
      lines: execution.lines,
      diagnostics,
      error: execution.error,
      timedOut: execution.timedOut,
      elapsedMs: performance.now() - started,
    };
  } catch (error) {
    resetCompiler();
    return {
      ok: false,
      lines: [],
      diagnostics,
      error: `Java compiler worker failed: ${error instanceof Error ? error.message : String(error)}`,
      elapsedMs: performance.now() - started,
    };
  }
}

export function runJava(code: string, onStatus?: (status: string) => void) {
  const task = queue.then(() => runJavaNow(code, onStatus), () => runJavaNow(code, onStatus));
  queue = task.then(() => undefined, () => undefined);
  return task;
}
