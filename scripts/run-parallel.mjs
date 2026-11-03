#!/usr/bin/env node
/**
 * Runs independent package.json scripts (or shell commands) side by side and prints each one's output when it ends.
 *
 *   node scripts/run-parallel.mjs audit:quizzes audit:playgrounds audit:predict
 *   node scripts/run-parallel.mjs --limit 2 "node scripts/check-mdx.mjs --all" test:unit
 *
 * An argument that names a script in package.json runs that script's command directly (no `npm run` start-up, which
 * costs about half a second each); any other argument is run as a shell command. At most --limit tasks run at once
 * (default 4, fewer on a small machine) so a low-memory machine is not flooded. Every task runs to the end, the output
 * of a failed task is shown, and the exit code is 1 if any task failed.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const scripts = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8')).scripts ?? {};

const args = process.argv.slice(2);
let limit = Math.max(1, Math.min(4, os.availableParallelism() - 1));
const tasks = [];
for (let i = 0; i < args.length; i += 1) {
  if (args[i] === '--limit') limit = Math.max(1, Number(args[(i += 1)]) || 1);
  else tasks.push(args[i]);
}
if (!tasks.length) {
  console.error('Usage: node scripts/run-parallel.mjs [--limit N] <npm script or shell command>...');
  process.exit(2);
}

const binDir = path.join(root, 'node_modules', '.bin');
const env = { ...process.env, PATH: `${binDir}${path.delimiter}${process.env.PATH ?? ''}` };

const resolveCommand = (task) => (Object.hasOwn(scripts, task) ? scripts[task] : task);

function run(task) {
  return new Promise((resolve) => {
    const started = Date.now();
    const child = spawn(resolveCommand(task), { cwd: root, env, shell: true, stdio: ['ignore', 'pipe', 'pipe'] });
    let output = '';
    child.stdout.on('data', (chunk) => { output += chunk; });
    child.stderr.on('data', (chunk) => { output += chunk; });
    child.on('error', (error) => { output += `${error.message}\n`; });
    child.on('close', (code) => resolve({ task, code: code ?? 1, seconds: (Date.now() - started) / 1000, output }));
  });
}

const results = [];
let next = 0;
const started = Date.now();

async function worker() {
  while (next < tasks.length) {
    const task = tasks[next];
    next += 1;
    const result = await run(task);
    results.push(result);
    const header = `${result.code === 0 ? 'ok    ' : 'FAILED'} ${task} (${result.seconds.toFixed(1)} s)`;
    // A passing task prints its last line only; a failing one prints everything, so the cause is not lost.
    const lines = result.output.trimEnd().split(/\r?\n/);
    console.log(`\n=== ${header} ===`);
    console.log(result.code === 0 ? lines.slice(-6).join('\n') : lines.join('\n'));
  }
}

await Promise.all(Array.from({ length: Math.min(limit, tasks.length) }, worker));

const failed = results.filter((result) => result.code !== 0);
const total = (Date.now() - started) / 1000;
const sum = results.reduce((acc, result) => acc + result.seconds, 0);
console.log(`\n${results.length - failed.length} of ${results.length} tasks passed in ${total.toFixed(1)} s (${sum.toFixed(1)} s of work, ${limit} at a time).`);
if (failed.length) {
  console.log(`Failed: ${failed.map((result) => result.task).join(', ')}`);
  process.exit(1);
}
