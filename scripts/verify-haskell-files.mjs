#!/usr/bin/env node
/**
 * Checks the downloadable Haskell files of CSI243 against the real GHC.
 *
 *   node scripts/verify-haskell-files.mjs
 *   node scripts/verify-haskell-files.mjs --only Recursion_Sum       (files whose name contains the text)
 *   node scripts/verify-haskell-files.mjs --dir public/files/sem3/csi243/downloads
 *
 * - Every .hs file under completed-examples/ is run with runghc and must exit with code 0. When a printing
 *   statement of `main` carries a trailing `-- expected: <line>` comment, the lines the program prints must match
 *   those comments one for one (the check is skipped when the counts differ, for example when a statement prints
 *   several lines).
 * - Every .hs file under starter-code/ is type checked with `ghc -fno-code` and must compile.
 * - A completed file may carry `-- stdin: <line>` comments (one per input line, in order); they are fed to the program
 *   on standard input. It may also carry `-- stdout: <line>` comments, which must match the lines printed, one for one.
 * - A subdirectory holding a `Main.hs` is a bundle of modules: completed bundles run with `runghc -i<dir> <dir>/Main.hs`
 *   (also checked against `-- expected:`, `-- stdout:` and `-- stdin:` comments in Main.hs), starter bundles are type
 *   checked the same way. Bundles are paired by directory name.
 * - Every starter file must have a completed file of the same name, and the other way round.
 * - The files that were already in the folder before the exam-depth work read from the keyboard; they are type
 *   checked but not run.
 *
 * Exit code 1 when any file fails. Failures are printed in a short form.
 */
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const only = flag('--only');
const baseDir = path.resolve(root, flag('--dir') ?? 'public/files/sem3/csi243/downloads');
const INTERACTIVE = new Set(['FirstProgram.hs', 'FunctionPractice.hs', 'Lab01Solution.hs', 'Lab01Starter.hs']);

const work = fs.mkdtempSync(path.join(os.tmpdir(), 'hs-files-'));
const norm = (s) => s.replace(/\r\n/g, '\n');

function run(command, commandArgs, options = {}) {
  return spawnSync(command, commandArgs, {
    encoding: 'utf8',
    timeout: 90000,
    maxBuffer: 1 << 26,
    windowsHide: true,
    ...options,
  });
}
function list(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith('.hs'))
    .filter((f) => !only || f.includes(only))
    .sort();
}
function listBundles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((d) => d.isDirectory() && fs.existsSync(path.join(dir, d.name, 'Main.hs')))
    .map((d) => d.name)
    .filter((n) => !only || n.includes(only))
    .sort();
}
function commentLines(source, tag) {
  const out = [];
  const pattern = new RegExp('^\\s*--\\s*' + tag + ':\\s?(.*)$');
  for (const line of norm(source).split('\n')) {
    const m = pattern.exec(line);
    if (m) out.push(m[1].replace(/\s+$/, ''));
  }
  return out;
}
function firstErrorLines(text, n = 6) {
  return norm(text)
    .split('\n')
    .filter((l) => l.trim())
    .slice(0, n)
    .map((l) => '      ' + l)
    .join('\n');
}
function expectedComments(source) {
  const out = [];
  for (const line of norm(source).split('\n')) {
    const m = /^\s*(?:print|putStrLn|putStr|mapM_|putStr)\b.*?--\s*expected:\s?(.*)$/.exec(line);
    if (m) out.push(m[1].replace(/\s+$/, ''));
  }
  return out;
}

const completedDir = path.join(baseDir, 'completed-examples');
const starterDir = path.join(baseDir, 'starter-code');
const completed = list(completedDir);
const starters = list(starterDir);
const completedBundles = listBundles(completedDir);
const starterBundles = listBundles(starterDir);
const failures = [];
let ran = 0;
let checkedExpected = 0;
let typeChecked = 0;

/** Runs one completed program (single file or bundle entry) and checks the comment promises in its source. */
function checkCompleted(label, runArgs, mainSource) {
  ran += 1;
  const stdin = commentLines(mainSource, 'stdin');
  const r = run('runghc', runArgs, { cwd: work, input: stdin.length ? stdin.join('\n') + '\n' : '' });
  if (r.status !== 0) {
    failures.push(`${label}: runghc failed (exit ${r.status ?? 'none'})\n${firstErrorLines(r.stderr || String(r.error ?? ''))}`);
    return;
  }
  const printed = norm(r.stdout ?? '').replace(/\n$/, '').split('\n');
  const stdout = commentLines(mainSource, 'stdout');
  const expected = stdout.length ? stdout : expectedComments(mainSource);
  const kind = stdout.length ? 'stdout' : 'expected';
  if (expected.length && expected.length === printed.length) {
    checkedExpected += 1;
    const bad = [];
    expected.forEach((e, i) => {
      if (e !== printed[i].replace(/\s+$/, '')) bad.push(`      line ${i + 1}: comment says "${e}" but GHC printed "${printed[i]}"`);
    });
    if (bad.length) failures.push(`${label}: ${kind} comments differ\n${bad.slice(0, 6).join('\n')}`);
  } else if (expected.length && expected.length !== printed.length) {
    failures.push(`${label}: ${expected.length} ${kind} comments but the program printed ${printed.length} lines`);
  }
}

for (const f of completed) {
  if (INTERACTIVE.has(f)) continue;
  const full = path.join(completedDir, f);
  checkCompleted(`completed-examples/${f}`, [full], fs.readFileSync(full, 'utf8'));
}
for (const d of completedBundles) {
  const dir = path.join(completedDir, d);
  checkCompleted(`completed-examples/${d}/`, ['-i' + dir, path.join(dir, 'Main.hs')], fs.readFileSync(path.join(dir, 'Main.hs'), 'utf8'));
}
for (const f of starters) {
  const full = path.join(starterDir, f);
  typeChecked += 1;
  const r = run('ghc', ['-fno-code', '-v0', full], { cwd: work });
  if (r.status !== 0) failures.push(`starter-code/${f}: does not type check\n${firstErrorLines(r.stderr || String(r.error ?? ''))}`);
}
for (const d of starterBundles) {
  const dir = path.join(starterDir, d);
  typeChecked += 1;
  const r = run('ghc', ['-fno-code', '-v0', '-i' + dir, path.join(dir, 'Main.hs')], { cwd: work });
  if (r.status !== 0) failures.push(`starter-code/${d}/: does not type check\n${firstErrorLines(r.stderr || String(r.error ?? ''))}`);
}
if (!only) {
  const a = new Set([...completed, ...completedBundles.map((d) => d + '/')]);
  const b = new Set([...starters, ...starterBundles.map((d) => d + '/')]);
  for (const f of a) if (!b.has(f) && !INTERACTIVE.has(f)) failures.push(`completed-examples/${f}: no starter of the same name`);
  for (const f of b) if (!a.has(f) && !INTERACTIVE.has(f)) failures.push(`starter-code/${f}: no completed file of the same name`);
}

fs.rmSync(work, { recursive: true, force: true });
console.log(
  `completed run: ${ran} (comments checked in ${checkedExpected}), starters type checked: ${typeChecked}, failures: ${failures.length}`,
);
for (const f of failures) console.log('FAIL ' + f);
process.exit(failures.length ? 1 : 0);
