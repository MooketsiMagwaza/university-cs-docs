# Browser Java runtime notice

The files in this directory support the CSI247 Java playground.

- `compiler.wasm`, `compiler.wasm-runtime.js`, `compile-classlib-teavm.bin`, and
  `runtime-classlib-teavm.bin` are unmodified build artifacts downloaded from
  the corresponding `https://teavm.org/playground/<filename>` URLs on
  2026-10-06. The server reports `Last-Modified: Sun, 15 Jun 2025` for all four
  files. Their exact byte sizes and SHA-256 hashes are recorded below.
- The compiler project is [konsoletyper/teavm-javac](https://github.com/konsoletyper/teavm-javac),
  licensed under the Apache License 2.0. The source snapshot immediately
  preceding the deployment timestamp is commit
  `b414fa1fa7601ac21c593893a0a3f45607061698`; its configured OpenJDK source is
  `openjdk/jdk25u` commit `890adb6410dab4606a4f26a942aed02fb2f55387`.
- The project includes OpenJDK components licensed under GPL v2 with the
  Classpath Exception.
- `compiler-worker.js` is a small adaptation of the upstream worker bootstrap.
  `executor-worker.js` uses the documented TeaVM WebAssembly runtime API.

Complete license texts are included alongside the artifacts:

- [`LICENSE-APACHE-2.0.txt`](./LICENSE-APACHE-2.0.txt)
- [`LICENSE-GPL-2.0-WITH-CLASSPATH-EXCEPTION.txt`](./LICENSE-GPL-2.0-WITH-CLASSPATH-EXCEPTION.txt)

Reproduction sources:

- TeaVM javac: `https://github.com/konsoletyper/teavm-javac/tree/b414fa1fa7601ac21c593893a0a3f45607061698`
- OpenJDK: `https://github.com/openjdk/jdk25u/tree/890adb6410dab4606a4f26a942aed02fb2f55387`

The vendored files have these SHA-256 hashes:

```text
compiler.wasm                 4126432 bytes  a79245353ac623df4fde5740bb2bedacedc9c98544253f01aa4b63268f9cb8ba
compiler.wasm-runtime.js        11642 bytes  75b2b94394f162c384d42d540836375cdbb0207e6e5605b92a18ce56eb158741
compile-classlib-teavm.bin     199668 bytes  4ed72de9e6ea1b58adfaa1b75c30379d7bccde71c529f795df383d62045367d9
runtime-classlib-teavm.bin    2377497 bytes  e62ab99ce291a3379abc0756a1e80f4796f00c60fee655e488b82e37b469d5b7
```
