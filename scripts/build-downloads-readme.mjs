#!/usr/bin/env node
/**
 * Writes public/files/sem3/csi243/downloads/README.md from the `-- Title:` line of every Haskell file in
 * completed-examples/ and starter-code/. Run it after adding or renaming a file.
 *
 *   node scripts/build-downloads-readme.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const base = path.join(root, 'public/files/sem3/csi243/downloads');
const completedDir = path.join(base, 'completed-examples');
const starterDir = path.join(base, 'starter-code');

const PREFIX_TITLES = {
  Lab1: 'Lab 1: recursion',
  Lab2: 'Lab 2: recursion on lists and functions',
  Lab3: 'Lab 3: recursion continued',
  Lab4: 'Lab 4: pattern matching',
  Lab5: 'Lab 5: list comprehensions',
  Lab6: 'Lab 6: polymorphism and overloading',
  Rec: 'Recursion on numbers',
  List: 'Recursion on lists',
  Guard: 'Guards and pattern matching',
  Comp: 'List comprehensions',
  Hof: 'Higher-order functions',
  Data: 'Custom data types',
  Poly: 'Polymorphism and type classes',
  Lazy: 'Lazy evaluation and infinite data',
  Proof: 'Proofs about programs',
  Arith: 'Arithmetic and numeric operators',
  Alias: 'Type synonyms and aliases',
  Char: 'Characters and Data.Char',
  TextList: 'Text and list library functions',
  Sort: 'Sorting and merging',
  Collections: 'Maps and sets',
  IO: 'Input and output',
  Context: 'Functor, Applicative and dependent computation',
  Cost: 'Complexity and recurrences',
  Spec: 'Contracts and specifications',
  Class: 'Standard type classes',
  Operator: 'Operators and lexical rules',
  Module: 'Modules and abstraction',
  Capstone: 'Integrated capstone programs',
};

function titleOf(file) {
  const text = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const m = /^--\s*Title:\s*(.+)$/m.exec(text);
  return m ? m[1].trim() : '';
}
const entries = fs
  .readdirSync(completedDir, { withFileTypes: true })
  .filter((entry) => entry.name.endsWith('.hs') || (entry.isDirectory() && fs.existsSync(path.join(completedDir, entry.name, 'Main.hs'))))
  .map((entry) => ({ name: entry.name, bundle: entry.isDirectory() }))
  .sort((a, b) => a.name.localeCompare(b.name));
const groups = new Map();
const legacy = [];
for (const entry of entries) {
  const m = /^([A-Za-z0-9]+)_/.exec(entry.name);
  if (!m || !PREFIX_TITLES[m[1]]) {
    legacy.push(entry);
    continue;
  }
  if (!groups.has(m[1])) groups.set(m[1], []);
  groups.get(m[1]).push(entry);
}

const lines = [];
lines.push('# CSI243 Haskell files', '');
lines.push(
  'Every question is a pair of files with the same name. The file in `completed-examples/` holds the question at the top, the solution with the thinking in comments, and a `main` that prints the results with the expected output in a comment after each call. The file in `starter-code/` holds the same question, the type signatures with `undefined` bodies, and the same `main`, so you can write the answer yourself and compare.',
  '',
  'Files ending in `V2` or `V3` are variations: the same kind of question with different data, a different condition or a different type.',
  '',
  'Run a file with `runghc FileName.hs`, or load it in GHCi with `ghci FileName.hs`.',
  'For a bundle directory, run `runghc -iBundleName BundleName/Main.hs` from its parent folder.',
  '',
);
for (const [prefix, list] of [...groups.entries()].sort((a, b) => Object.keys(PREFIX_TITLES).indexOf(a[0]) - Object.keys(PREFIX_TITLES).indexOf(b[0]))) {
  lines.push(`## ${PREFIX_TITLES[prefix]}`, '', '| File | Question |', '| --- | --- |');
  for (const entry of list) {
    const completedPath = entry.bundle ? path.join(completedDir, entry.name, 'Main.hs') : path.join(completedDir, entry.name);
    const starterPath = entry.bundle ? path.join(starterDir, entry.name, 'Main.hs') : path.join(starterDir, entry.name);
    const title = titleOf(completedPath).replace(/\|/g, '\\|');
    const hasStarter = fs.existsSync(starterPath);
    const label = entry.bundle ? `${entry.name}/` : entry.name;
    lines.push(`| \`${label}\`${hasStarter ? '' : ' (no starter)'} | ${title} |`);
  }
  lines.push('');
}
if (legacy.length) {
  lines.push('## First programs and the first lab', '', '| File | Note |', '| --- | --- |');
  for (const entry of legacy) lines.push(`| \`${entry.bundle ? `${entry.name}/` : entry.name}\` | Introductory file; it may read from the keyboard, so run it in a terminal. |`);
  lines.push('');
}
fs.writeFileSync(path.join(base, 'README.md'), lines.join('\n'));
console.log(`README.md written: ${entries.length} completed files or bundles in ${groups.size} groups`);
