#!/usr/bin/env node
// Verifies every <JavaTryIt> example in the CSI141 and CSI142 notes with the local JDK.
//
// For each tag it takes the program (the first fenced block) and the output the page shows
// (the second fenced block, a `text` fence), compiles the program with `javac --release 8`
// (the in-browser compiler is Java 8 level), runs it, and checks that the output equals the
// shown text exactly, ignoring only one trailing newline. It also rejects a few things the
// teaching runner cannot do: keyboard input, files, packages, random numbers, the clock,
// threads, and an exception that escapes `main`.
//
// Usage:
//   node scripts/verify-java-notes-examples.mjs                 verify every example
//   node scripts/verify-java-notes-examples.mjs --only csi142   only pages whose path contains the text
//   node scripts/verify-java-notes-examples.mjs --show          also print the actual output of a failing example
//   node scripts/verify-java-notes-examples.mjs --list          list the examples per page and stop
//
// The programs are written outside the repository: JAVA_VERIFY_DIR if it is set, otherwise
// a "java-notes-verify" folder in the system temporary folder. Programs run one at a time.

import { spawnSync } from 'node:child_process';
import { mkdirSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(fileURLToPath(new URL('..', import.meta.url)));
const courses = [
  { name: 'csi141', dir: join(root, 'content', 'docs', 'sem1', 'csi141') },
  { name: 'csi142', dir: join(root, 'content', 'docs', 'sem2', 'csi142') },
];
const workRoot = process.env.JAVA_VERIFY_DIR ? resolve(process.env.JAVA_VERIFY_DIR) : join(tmpdir(), 'java-notes-verify');

const args = process.argv.slice(2);
const show = args.includes('--show');
const listOnly = args.includes('--list');
const onlyIndex = args.indexOf('--only');
const only = onlyIndex >= 0 ? (args[onlyIndex + 1] ?? '').toLowerCase() : '';

// Things the in-browser teaching runner does not support, or that would make the output change between runs.
const forbidden = [
  [/System\.in\b/, 'reads keyboard input (System.in)'],
  [/\bnew\s+Scanner\s*\(/, 'uses Scanner'],
  [/\bjava\.io\.(File|FileReader|FileWriter|FileInputStream|FileOutputStream|PrintWriter)\b|\bnew\s+File\w*\s*\(|\bPaths?\.(of|get)\s*\(/, 'uses files'],
  [/^\s*package\s/m, 'declares a package'],
  [/Math\.random|\bnew\s+Random\s*\(|\bThreadLocalRandom\b/, 'uses random numbers'],
  [/currentTimeMillis|nanoTime|\bLocalDate|\bLocalTime|\bnew\s+Date\s*\(|\bInstant\b/, 'reads the clock'],
  [/\bThread\b|\bExecutor/, 'uses threads'],
  [/\bvar\s+\w+\s*=/, 'uses var (Java 10)'],
  [/"""/, 'uses a text block (Java 15)'],
  [/\bList\.of\s*\(|\bSet\.of\s*\(|\bMap\.of\s*\(/, 'uses a Java 9 factory method'],
  [/System\.exit/, 'calls System.exit'],
];

function walk(dir) {
  const files = [];
  for (const name of readdirSync(dir).sort()) {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) files.push(...walk(path));
    else if (name === 'notes.mdx') files.push(path);
  }
  return files;
}

// <JavaTryIt>, a blank line, a java fence, a blank line, a text fence, a blank line, </JavaTryIt>
const tag = /<JavaTryIt>\n\n```java\n([\s\S]*?)\n```\n\n```text\n([\s\S]*?)\n```\n\n<\/JavaTryIt>/g;

function parsePage(file) {
  const text = readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const opened = (text.match(/<JavaTryIt\b/g) ?? []).length;
  const examples = [];
  for (const match of text.matchAll(tag)) {
    examples.push({ code: match[1], shown: match[2], line: text.slice(0, match.index).split('\n').length });
  }
  return { opened, examples };
}

function run(command, commandArgs, options = {}) {
  return spawnSync(command, commandArgs, { encoding: 'utf8', timeout: 30000, windowsHide: true, ...options });
}

const trimOne = (value) => value.replace(/\r\n/g, '\n').replace(/\n$/, '');

function check(example, folder) {
  const problems = [];
  for (const [pattern, reason] of forbidden) if (pattern.test(example.code)) problems.push(`the runner cannot do this: ${reason}`);
  const publicClasses = example.code.match(/^public\s+(?:final\s+)?class\s+(\w+)/gm) ?? [];
  if (publicClasses.length !== 1 || !/class\s+Main\b/.test(publicClasses[0])) problems.push('needs exactly one public class, named Main');
  if (!/public\s+static\s+void\s+main\s*\(\s*String\s*\[\]\s*\w+\s*\)/.test(example.code)) problems.push('has no public static void main(String[] args)');
  const lines = example.code.split('\n').length;
  if (lines < 5 || lines > 25) problems.push(`is ${lines} lines (the target is 5 to 25)`);
  if (problems.length) return { ok: false, problems };

  rmSync(folder, { recursive: true, force: true });
  mkdirSync(join(folder, 'out'), { recursive: true });
  writeFileSync(join(folder, 'Main.java'), example.code + '\n');

  const compiled = run('javac', ['--release', '8', '-Xlint:-options', '-encoding', 'UTF-8', '-d', 'out', 'Main.java'], { cwd: folder });
  if (compiled.error || compiled.status !== 0) {
    return { ok: false, problems: ['does not compile with javac --release 8', (compiled.stderr || compiled.error?.message || '').trim()] };
  }
  const ran = run('java', ['-Xmx64m', '-cp', 'out', 'Main'], { cwd: folder });
  if (ran.error) return { ok: false, problems: [`did not finish: ${ran.error.message}`] };
  if (ran.status !== 0 || ran.stderr.trim()) {
    return { ok: false, problems: [`exited with status ${ran.status} and printed to the error stream (an exception must not escape main)`, ran.stderr.trim()] };
  }
  const actual = trimOne(ran.stdout);
  if (actual !== trimOne(example.shown)) {
    return { ok: false, problems: ['the shown output differs from the real output'], actual };
  }
  return { ok: true };
}

const files = courses.flatMap((course) => walk(course.dir)).filter((file) => !only || relative(root, file).toLowerCase().includes(only));
let total = 0;
let passed = 0;
let untagged = 0;
const failures = [];

for (const file of files) {
  const page = relative(root, file).replace(/\\/g, '/');
  const { opened, examples } = parsePage(file);
  if (opened !== examples.length) {
    untagged += opened - examples.length;
    failures.push(`${page}: ${opened} <JavaTryIt> tags but ${examples.length} in the required form (a java fence, then a text fence, each with a blank line around it)`);
  }
  if (listOnly) {
    console.log(`${String(examples.length).padStart(2)}  ${page}`);
    total += examples.length;
    continue;
  }
  examples.forEach((example, index) => {
    total += 1;
    const label = `${page} example ${index + 1} (line ${example.line})`;
    const folder = join(workRoot, relative(root, file).replace(/[\\/]/g, '_').replace(/\.mdx$/, ''), String(index + 1));
    const result = check(example, folder);
    if (result.ok) {
      passed += 1;
      console.log(`ok    ${label}`);
    } else {
      console.log(`FAIL  ${label}`);
      for (const problem of result.problems) console.log(`        ${problem.split('\n').join('\n        ')}`);
      if (show && result.actual !== undefined) console.log(`        actual output:\n${result.actual.split('\n').map((l) => `          | ${l}`).join('\n')}`);
      failures.push(label);
    }
  });
}

if (listOnly) {
  console.log(`${total} examples in ${files.length} pages`);
  process.exit(0);
}
console.log(`\n${passed} of ${total} examples compile with javac --release 8, run cleanly and match the shown output (${files.length} pages checked).`);
if (failures.length) {
  console.log(`${failures.length} problem${failures.length === 1 ? '' : 's'}${untagged ? ` (${untagged} tag${untagged === 1 ? '' : 's'} not in the required form)` : ''}.`);
  process.exit(1);
}
