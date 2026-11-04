#!/usr/bin/env node
/**
 * Runs a command only when its inputs changed since it last passed.
 *
 *   node scripts/run-if-changed.mjs <name> <input file or folder>... -- <command and arguments>
 *   node scripts/run-if-changed.mjs --force <name> ...             (run it whatever the stored result says)
 *
 * The inputs (every file under a folder, in path order) and the command are hashed. If the hash equals the one stored
 * for <name> by the last run that exited with 0, the command is skipped and the script exits 0; otherwise the command
 * runs, and a passing run stores the new hash. Stored in node_modules/.cache/stamps (not in git). List every file the
 * command reads as an input, including the script it runs: a file that is not listed cannot make the command run again.
 */
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const argv = process.argv.slice(2);
const force = argv[0] === '--force';
if (force) argv.shift();
const split = argv.indexOf('--');
const [name, ...inputs] = split < 0 ? argv : argv.slice(0, split);
const command = split < 0 ? [] : argv.slice(split + 1);
if (!name || !command.length) {
  console.error('Usage: node scripts/run-if-changed.mjs [--force] <name> <input>... -- <command> [arguments]');
  process.exit(2);
}

const files = [];
const collect = (target) => {
  const full = path.resolve(root, target);
  if (!fs.existsSync(full)) return;
  if (fs.statSync(full).isFile()) return files.push(full);
  for (const entry of fs.readdirSync(full, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    collect(path.join(full, entry.name));
  }
};
inputs.forEach(collect);

const hash = createHash('sha1');
hash.update(`${command.join('\0')}\0${process.version}\0`);
// The JDK is an input too, when the command uses one.
const jdk = spawnSync('javac', ['-version'], { encoding: 'utf8' });
if (!jdk.error) hash.update((jdk.stdout || jdk.stderr).trim());
for (const file of files) hash.update(`${path.relative(root, file)}\0`).update(fs.readFileSync(file));
const digest = hash.digest('hex');

const stampFile = path.join(root, 'node_modules', '.cache', 'stamps', `${name}.txt`);
let stored = '';
try { stored = fs.readFileSync(stampFile, 'utf8').trim(); } catch { /* never passed */ }

if (!force && stored === digest) {
  console.log(`${name}: inputs unchanged since the last pass (${files.length} files), skipped. Use --force to run it anyway.`);
  process.exit(0);
}

const result = spawnSync(command[0], command.slice(1), { cwd: root, stdio: 'inherit' });
if (result.status === 0) {
  fs.mkdirSync(path.dirname(stampFile), { recursive: true });
  fs.writeFileSync(stampFile, digest);
}
process.exit(result.status ?? 1);
