/*
 * TeaVM javac worker bootstrap.
 * Upstream: https://github.com/konsoletyper/teavm-javac
 * License: Apache-2.0 (see NOTICE.md in this directory).
 */
Error.stackTraceLimit = 50;

(async function startCompiler() {
  const teavmSupport = await import('./compiler.wasm-runtime.js');
  const teavm = await teavmSupport.load('./compiler.wasm', {
    stackDeobfuscator: { enabled: false },
  });

  teavm.exports.installWorker();
})();
