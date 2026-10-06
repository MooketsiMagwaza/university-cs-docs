#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const assetRoot = resolve(root, 'public', 'java-playground');
const expected = new Map([
  ['compiler.wasm', ['4126432', 'a79245353ac623df4fde5740bb2bedacedc9c98544253f01aa4b63268f9cb8ba']],
  ['compiler.wasm-runtime.js', ['11642', '75b2b94394f162c384d42d540836375cdbb0207e6e5605b92a18ce56eb158741']],
  ['compile-classlib-teavm.bin', ['199668', '4ed72de9e6ea1b58adfaa1b75c30379d7bccde71c529f795df383d62045367d9']],
  ['runtime-classlib-teavm.bin', ['2377497', 'e62ab99ce291a3379abc0756a1e80f4796f00c60fee655e488b82e37b469d5b7']],
]);

for (const [name, [size, hash]] of expected) {
  const bytes = readFileSync(resolve(assetRoot, name));
  const actualHash = createHash('sha256').update(bytes).digest('hex');
  if (String(bytes.byteLength) !== size) throw new Error(`${name}: expected ${size} bytes, found ${bytes.byteLength}.`);
  if (actualHash !== hash) throw new Error(`${name}: SHA-256 mismatch.`);
}

const apache = readFileSync(resolve(assetRoot, 'LICENSE-APACHE-2.0.txt'), 'utf8');
const openJdk = readFileSync(resolve(assetRoot, 'LICENSE-GPL-2.0-WITH-CLASSPATH-EXCEPTION.txt'), 'utf8');
const notice = readFileSync(resolve(assetRoot, 'NOTICE.md'), 'utf8');
if (!apache.includes('Apache License') || !apache.includes('Version 2.0')) throw new Error('Apache 2.0 license text is incomplete.');
const openJdkLower = openJdk.toLowerCase();
if (!openJdkLower.includes('gnu general public license') || !openJdkLower.includes('"classpath" exception')) throw new Error('OpenJDK GPLv2 + Classpath Exception text is incomplete.');
for (const marker of ['b414fa1fa7601ac21c593893a0a3f45607061698', '890adb6410dab4606a4f26a942aed02fb2f55387', ...[...expected.values()].map(([, hash]) => hash)]) {
  if (!notice.includes(marker)) throw new Error(`NOTICE.md is missing provenance marker ${marker}.`);
}

console.log('Java playground asset audit passed: 4 artifacts, hashes, licenses, and source provenance verified.');
