#!/usr/bin/env node
/**
 * Runs scripts/verify-csi247-listings.mjs only on the lessons that changed since they last passed.
 *
 *   node scripts/verify-listings-changed.mjs            (npm run verify:csi247-listings)
 *   node scripts/verify-listings-changed.mjs --force    (ignore the stored results and check every lesson)
 *   node scripts/verify-listings-changed.mjs --verbose  (passed on to the verifier)
 *
 * The verifier compiles and runs every complete program in a lesson with `javac --release 8` and compares the output with
 * the block shown beneath it. A lesson is checked on its own, so a lesson whose text has not changed since it passed, with
 * the same verifier and the same JDK, would pass again; this script remembers those and skips them. The remembered
 * results are in node_modules/.cache/verify-csi247-listings.json (not in git). A batch of lessons that fails is not
 * stored, so those lessons are checked again next time.
 */
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const verifier = path.join(root, 'scripts', 'verify-csi247-listings.mjs');
const cacheFile = path.join(root, 'node_modules', '.cache', 'verify-csi247-listings.json');
const lessonsRoot = path.join(root, 'content', 'docs', 'sem3', 'csi247');
const args = process.argv.slice(2);
const force = args.includes('--force');
const passThrough = args.filter((arg) => arg !== '--force');

const sha = (value) => createHash('sha1').update(value).digest('hex');

let jdk;
try {
  jdk = spawnSync('javac', ['-version'], { encoding: 'utf8' });
  if (jdk.error || jdk.status !== 0) throw new Error('no javac');
} catch {
  console.error('javac was not found on the PATH.');
  process.exit(2);
}
const environment = sha(`${(jdk.stdout || jdk.stderr).trim()}|${fs.readFileSync(verifier, 'utf8')}`);

const lessons = [];
const walk = (directory) => {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith('.mdx')) lessons.push(full);
  }
};
walk(lessonsRoot);

let stored = { environment, passed: {} };
if (!force) {
  try {
    const loaded = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
    if (loaded.environment === environment) stored = loaded;
  } catch { /* no stored results yet */ }
}

const hashes = new Map(lessons.map((file) => [file, sha(fs.readFileSync(file))]));
const key = (file) => path.relative(root, file).replace(/\\/g, '/');
// Only a lesson with a runnable listing is worth running; the rest cost nothing, but they are cheap to skip too.
const pending = lessons.filter((file) => stored.passed[key(file)] !== hashes.get(file));
console.log(`CSI247 listings: ${lessons.length - pending.length} of ${lessons.length} lessons unchanged since they passed, ${pending.length} to check.`);

let failed = false;
const BATCH = 20; // keeps the command line short on Windows
for (let i = 0; i < pending.length; i += BATCH) {
  const batch = pending.slice(i, i + BATCH);
  try {
    execFileSync(process.execPath, [verifier, ...passThrough, ...batch.map(key)], { cwd: root, stdio: 'inherit' });
    for (const file of batch) stored.passed[key(file)] = hashes.get(file);
  } catch {
    failed = true;
  }
}

// Store the batches that passed even when a later batch failed; the failing batch is checked again next time.
fs.mkdirSync(path.dirname(cacheFile), { recursive: true });
const present = new Set(lessons.map(key));
stored.passed = Object.fromEntries(Object.entries(stored.passed).filter(([name]) => present.has(name)));
fs.writeFileSync(cacheFile, JSON.stringify(stored));
process.exit(failed ? 1 : 0);
