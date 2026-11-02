#!/usr/bin/env node
/**
 * Compiles and runs the complete Java programs in the CSI247 lessons and compares what they print with the Output block
 * shown beneath them.
 *
 *   node scripts/verify-csi247-listings.mjs [folder-or-file ...]      (default: content/docs/sem3/csi247)
 *   node scripts/verify-csi247-listings.mjs --verbose                 (print every program, not only the problems)
 *
 * A listing is a ```java fence with a `title="Name.java"`. It is run when it declares `class Name` and a `main` method;
 * every other listing (a fragment, a class without `main`, several files) is counted and skipped. The classes declared by the
 * earlier listings on the same page are compiled with it (a later listing of the same file replaces the earlier one). The program is compiled
 * with `javac --release 8`, as the course targets Java 8. The output block is the ```text fence that follows the listing
 * directly. Needs a JDK on the PATH.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const verbose = process.argv.includes('--verbose');
const targets = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (!targets.length) targets.push('content/docs/sem3/csi247');

try {
  execFileSync('javac', ['-version'], { stdio: 'ignore' });
} catch {
  console.error('javac was not found on the PATH.');
  process.exit(2);
}

const files = [];
const collect = (p) => {
  if (fs.statSync(p).isFile()) return p.endsWith('.mdx') && files.push(p);
  for (const e of fs.readdirSync(p, { withFileTypes: true })) collect(path.join(p, e.name));
};
targets.forEach(collect);

const fenceRe = /^(`{3,})java[^\n]*?title="([^"]+)"[^\n]*\n([\s\S]*?)\n\1[ \t]*(?:\n\n?(`{3,})text[^\n]*\n([\s\S]*?)\n\4)?/gm;
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'csi247-listings-'));
const tally = { run: 0, matched: 0, noOutputShown: 0, mismatch: 0, compileError: 0, runtimeError: 0, skipped: 0 };
const problems = [];

for (const file of files.sort()) {
  const text = fs.readFileSync(file, 'utf8');
  const known = new Map(); // the classes declared so far on this page, by file name
  for (const m of text.matchAll(fenceRe)) {
    const [, , title, code, , shown] = m;
    const name = title.replace(/\.java$/, '');
    const declares = /^[A-Za-z_]\w*$/.test(name) && new RegExp(`\\b(class|interface|enum)\\s+${name}\\b`).test(code);
    if (declares) known.set(name, code);
    if (!declares || !/static\s+void\s+main\s*\(/.test(code)) {
      tally.skipped++;
      continue;
    }
    const dir = fs.mkdtempSync(path.join(tmp, 'p-'));
    for (const [n, c] of known) fs.writeFileSync(path.join(dir, `${n}.java`), c);
    const sources = [...known.keys()].map((n) => path.join(dir, `${n}.java`));
    const compiled = spawnSync('javac', ['--release', '8', '-Xlint:-options', '-d', dir, ...sources], { encoding: 'utf8' });
    const label = `${path.relative(process.cwd(), file)}: ${title}`;
    if (compiled.status !== 0) {
      tally.compileError++;
      problems.push(`${label}\n    does not compile: ${compiled.stderr.split('\n').slice(0, 3).join(' | ')}`);
      continue;
    }
    const ran = spawnSync('java', ['-cp', dir, name], { encoding: 'utf8', timeout: 20000 });
    tally.run++;
    const out = (ran.stdout ?? '').replace(/\r\n/g, '\n').replace(/[ \t]+$/gm, '').trimEnd();
    if (ran.status !== 0 && shown === undefined) {
      tally.runtimeError++;
      problems.push(`${label}\n    exits with ${ran.status}: ${(ran.stderr ?? '').split('\n')[0]}`);
      continue;
    }
    if (shown === undefined) {
      tally.noOutputShown++;
      if (verbose) console.log(`ran, no output shown: ${label}`);
      continue;
    }
    const expected = shown.replace(/\r\n/g, '\n').replace(/[ \t]+$/gm, '').trimEnd();
    if (out === expected) {
      tally.matched++;
      if (verbose) console.log(`ok: ${label}`);
    } else {
      tally.mismatch++;
      problems.push(`${label}\n    shown:  ${JSON.stringify(expected.slice(0, 160))}\n    actual: ${JSON.stringify(out.slice(0, 160))}`);
    }
  }
}
fs.rmSync(tmp, { recursive: true, force: true });

for (const p of problems) console.log(p);
console.log(`\nJava listings: ${tally.run} ran (${tally.matched} match the shown output, ${tally.noOutputShown} show no output, ${tally.mismatch} differ, ${tally.runtimeError} fail at run time), ${tally.compileError} do not compile, ${tally.skipped} skipped as fragments or multi-file.`);
process.exit(tally.compileError || tally.mismatch || tally.runtimeError ? 1 : 0);
