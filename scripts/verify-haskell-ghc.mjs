#!/usr/bin/env node
/**
 * Runs the Haskell examples in CSI243 lessons through the real GHC and compares what GHC prints with the
 * output printed beside each example. It needs `runghc` and `ghc` on the PATH (GHC 9.10 was used).
 *
 *   npm run verify:haskell -- content/docs/sem3/csi243/07-higher-order
 *   npm run verify:haskell -- content/docs/sem3/csi243/10-reasoning-revision/notes/proofs-by-induction.mdx --verbose
 *
 * An example is the Haskell fence inside a <HaskellTryIt> tag, with the `text` fence after it as the expected output.
 *   - A program with a `main` runs with runghc and its output must match.
 *   - A program without `main` is type checked only.
 *   - With `session`, the fence holds GHCi commands and the `text` fence is the transcript (lines starting `ghci>` are
 *     inputs, the rest is output); the commands run in ghci and the output must match.
 * An example that uses a name defined in an earlier example on the page is retried with the page's earlier
 * definitions in front of it, which is how a reader meets it. Output that GHC prints to stderr is not compared.
 *
 * Exit code 1 when an example fails to compile or prints something other than the shown output.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const verbose = args.includes('--verbose');
const targets = args.filter((a) => !a.startsWith('--'));
if (!targets.length) {
  console.error('Usage: node scripts/verify-haskell-ghc.mjs <file or folder>... [--verbose]');
  process.exit(2);
}

const work = fs.mkdtempSync(path.join(os.tmpdir(), 'ghc-verify-'));
const FENCE = '`'.repeat(3);

function listFiles(target) {
  const full = path.resolve(root, target);
  if (fs.statSync(full).isFile()) return [full];
  const out = [];
  const walk = (dir) => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(p);
      else if (entry.name.endsWith('.mdx')) out.push(p);
    }
  };
  walk(full);
  return out.sort();
}

/** The Haskell examples of one page, in order. */
function readExamples(text) {
  const examples = [];
  const tag = /<HaskellTryIt([^>]*)>([\s\S]*?)<\/HaskellTryIt>/g;
  for (const match of text.matchAll(tag)) {
    const session = /\bsession\b/.test(match[1]);
    const fences = [...match[2].matchAll(new RegExp(FENCE + '(\\w*)\\n([\\s\\S]*?)\\n' + FENCE, 'g'))];
    if (!fences.length) continue;
    const code = fences[0][2];
    const expected = fences[1] ? fences[1][2] : undefined;
    const line = text.slice(0, match.index).split('\n').length;
    const inputMatch = /\binput="([^"]*)"/.exec(match[1]);
    const stdin = inputMatch ? inputMatch[1] : '';
    examples.push({ code, expected, session, line, stdin });
  }
  return examples;
}

const run = (command, commandArgs, options = {}) =>
  spawnSync(command, commandArgs, { encoding: 'utf8', timeout: 60000, maxBuffer: 1 << 26, windowsHide: true, ...options });
const clean = (s) => s.replace(/\r/g, '').replace(/[ \t]+$/gm, '').trim();
const hasMain = (code) => /^main\s*(::|=)/m.test(code);

function typecheck(source, name) {
  const file = path.join(work, `${name}.hs`);
  fs.writeFileSync(file, `module Check where\n${source}\n`);
  const r = run('ghc', ['-fno-code', '-v0', '-fno-warn-tabs', file], { cwd: work });
  return { ok: r.status === 0, message: clean(r.stderr || r.stdout || String(r.error ?? '')) };
}

function runProgram(source, name, stdin = '') {
  const file = path.join(work, `${name}.hs`);
  fs.writeFileSync(file, source + '\n');
  const r = run('runghc', [file], { cwd: work, input: stdin });
  return { ok: r.status === 0, out: clean(r.stdout ?? ''), message: clean(r.stderr ?? String(r.error ?? '')) };
}

function runSession(context, commands, name) {
  const file = path.join(work, `${name}.hs`);
  fs.writeFileSync(file, `${context}\n`);
  const loaded = context.trim() ? file : path.join(work, 'Empty.hs');
  const r = run('ghc', ['--interactive', '-v0', '-ignore-dot-ghci', loaded], {
    cwd: work,
    input: commands.join('\n') + '\n',
  });
  return { ok: r.status === 0, out: clean(r.stdout ?? ''), message: clean(r.stderr ?? String(r.error ?? '')) };
}
fs.writeFileSync(path.join(work, 'Empty.hs'), 'module Empty where\n');

/** The commands and the expected output lines of a GHCi transcript. */
function parseTranscript(shown, code) {
  const lines = shown.split('\n');
  const inputs = [];
  const outputs = [];
  for (const line of lines) {
    if (/^ghci>/.test(line)) inputs.push(line.replace(/^ghci>\s?/, ''));
    else outputs.push(line);
  }
  const commands = inputs.length ? inputs : code.split('\n').filter((l) => l.trim());
  return { commands, expected: clean(outputs.join('\n')) };
}

const wrongScope = /not in scope|Variable not in scope|Data constructor not in scope|Not in scope: (type|data)/i;
let total = 0;
let passed = 0;
let skipped = 0;
const failures = [];

for (const file of targets.flatMap(listFiles)) {
  const rel = path.relative(root, file).replace(/\\/g, '/');
  const examples = readExamples(fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n'));
  const earlier = [];
  examples.forEach((example, index) => {
    total += 1;
    const id = `${rel}:${example.line}`;
    const name = `ex${index}`;
    const context = () => earlier.join('\n\n');
    const compare = (got, label) => {
      if (example.expected === undefined) return true;
      const shown = clean(example.session ? parseTranscript(example.expected, example.code).expected : example.expected);
      if (/error|warning/i.test(shown) && !/^\[|^\(|^\d/.test(shown)) return null; // the page shows a GHC error; not compared
      if (got === shown) return true;
      failures.push(`${id}: ${label}\n      GHC printed: ${JSON.stringify(got.slice(0, 220))}\n      page shows : ${JSON.stringify(shown.slice(0, 220))}`);
      return false;
    };

    let ok;
    if (example.session) {
      const { commands } = parseTranscript(example.expected ?? '', example.code);
      let result = runSession('', commands, name);
      if (!result.ok || wrongScope.test(result.message)) result = runSession(context(), commands, name);
      if (/error/i.test(result.message) && !result.out) {
        failures.push(`${id}: the session did not run\n      ${result.message.split('\n').slice(0, 3).join('\n      ')}`);
        ok = false;
      } else ok = compare(result.out, 'session output differs');
    } else if (hasMain(example.code)) {
      let result = runProgram(example.code, name, example.stdin);
      if (!result.ok && wrongScope.test(result.message)) result = runProgram(`${context()}\n\n${example.code}`, name, example.stdin);
      if (!result.ok) {
        const shownError = example.expected && /error/i.test(example.expected);
        if (shownError) ok = null;
        else {
          failures.push(`${id}: does not run\n      ${result.message.split('\n').slice(0, 4).join('\n      ')}`);
          ok = false;
        }
      } else ok = compare(result.out, 'output differs');
    } else {
      let result = typecheck(example.code, name);
      if (!result.ok && wrongScope.test(result.message)) result = typecheck(`${context()}\n\n${example.code}`, name);
      const marksWrong = /--\s*(Incorrect|Wrong|Error|Bad|Does not|Fault)/i.test(example.code) || (example.expected && /error/i.test(example.expected));
      if (!result.ok && !marksWrong) {
        failures.push(`${id}: does not type check\n      ${result.message.split('\n').slice(0, 4).join('\n      ')}`);
        ok = false;
      } else ok = result.ok ? true : null;
      if (result.ok) earlier.push(example.code);
    }

    if (ok === true) passed += 1;
    else if (ok === null) skipped += 1;
    if (verbose) console.log(`${ok === true ? 'ok     ' : ok === null ? 'skipped' : 'FAILED '} ${id}`);
  });
}

fs.rmSync(work, { recursive: true, force: true });
console.log(`\nGHC checked ${total} examples: ${passed} match, ${skipped} show a GHC error or were not compared, ${failures.length} fail.`);
if (failures.length) {
  console.log('\n' + failures.join('\n') + '\n');
  process.exit(1);
}
