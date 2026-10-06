/*
 * Runs TeaVM-produced WebAssembly away from the page in a dedicated worker.
 * Upstream runtime: https://github.com/konsoletyper/teavm-javac
 */
import { load } from './compiler.wasm-runtime.js';

const MAX_OUTPUT_LINES = 500;
const MAX_OUTPUT_CHARACTERS = 64 * 1024;
let outputLines = 0;
let outputCharacters = 0;
let outputLimited = false;

const stopForOutputLimit = () => {
  if (outputLimited) return;
  outputLimited = true;
  self.postMessage({ type: 'done', error: 'Output limit exceeded (500 lines or 64 KiB).' });
  self.close();
};

const postLine = (stream, text) => {
  if (outputLimited) return;
  outputLines += 1;
  if (outputLines > MAX_OUTPUT_LINES || outputCharacters > MAX_OUTPUT_CHARACTERS) {
    stopForOutputLimit();
    return;
  }
  self.postMessage({ type: 'line', stream, text });
};

self.onmessage = async (event) => {
  let stdout = '';
  let stderr = '';

  const write = (stream, character) => {
    if (outputLimited) return;
    outputCharacters += 1;
    if (outputCharacters > MAX_OUTPUT_CHARACTERS) {
      stopForOutputLimit();
      return;
    }
    if (character === 10) {
      postLine(stream, stream === 'out' ? stdout : stderr);
      if (stream === 'out') stdout = '';
      else stderr = '';
      return;
    }

    if (stream === 'out') stdout += String.fromCharCode(character);
    else stderr += String.fromCharCode(character);
  };

  try {
    const module = await load(event.data.code, {
      stackDeobfuscator: { enabled: false },
      installImports(imports) {
        imports.teavmConsole.putcharStdout = (character) => write('out', character);
        imports.teavmConsole.putcharStderr = (character) => write('err', character);
      },
    });

    module.exports.main([]);
    if (outputLimited) return;
    if (stdout) postLine('out', stdout);
    if (stderr) postLine('err', stderr);
    self.postMessage({ type: 'done' });
  } catch (error) {
    if (stdout) postLine('out', stdout);
    if (stderr) postLine('err', stderr);
    self.postMessage({
      type: 'done',
      error: error instanceof Error ? (error.stack || `${error.name}: ${error.message}`) : String(error),
    });
  }
};
