#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const contentRoots = [
  join(root, 'content', 'docs', 'sem3', 'csi247', 'sorting-and-searching'),
  join(root, 'content', 'docs', 'sem3', 'csi247', 'packages'),
];
const work = mkdtempSync(join(tmpdir(), 'csi247-java-audit-'));
const sourceRoot = join(work, 'src');
const classRoot = join(work, 'classes');
mkdirSync(sourceRoot, { recursive: true });
mkdirSync(classRoot, { recursive: true });

function walk(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const full = join(directory, entry.name);
    return entry.isDirectory() ? walk(full) : entry.name.endsWith('.mdx') ? [full] : [];
  });
}

try {
  const programs = [];
  for (const file of contentRoots.flatMap(walk)) {
    const source = readFileSync(file, 'utf8');
    for (const match of source.matchAll(/```java\n([\s\S]*?)```/g)) {
      const code = match[1];
      const className = code.match(/public class\s+([A-Za-z_$][\w$]*)/)?.[1];
      if (!className) continue;
      const packageName = code.match(/^package\s+([\w.]+);/m)?.[1] ?? '';
      const target = join(sourceRoot, ...packageName.split('.').filter(Boolean), `${className}.java`);
      mkdirSync(dirname(target), { recursive: true });
      writeFileSync(target, code, 'utf8');
      programs.push({ className, packageName, target });
    }
  }

  if (programs.length < 12) throw new Error(`Expected at least 12 complete Java examples, found ${programs.length}.`);
  execFileSync('javac', ['--release', '8', '-d', classRoot, ...programs.map(({ target }) => target)], { stdio: 'inherit' });

  const expected = new Map([
    ['LinearSearchDemo', '[63, 29, 85, 72, 18, 42, 23, 54, 8, 32]\n18 -> 4\n31 -> -1'],
    ['BinarySearchDemo', '18 -> 1\n31 -> -1\n85 -> 9'],
    ['SimpleSortsDemo', 'bubble:    [1, 2, 3, 4, 5]\nselection: [1, 2, 3, 4, 5]'],
    ['InsertionSortDemo', '[1, 3, 5, 8]'],
    ['MergeSortDemo', '[3, 18, 29, 49, 54, 63, 72, 85]'],
    ['DistanceDemo', '9.0'],
    ['app.Tester', '42\nclass B'],
  ]);

  for (const [name, wanted] of expected) {
    const actual = execFileSync('java', ['-cp', classRoot, name], { encoding: 'utf8' }).trim().replaceAll('\r\n', '\n');
    if (actual !== wanted) throw new Error(`${name} output mismatch\nExpected:\n${wanted}\nActual:\n${actual}`);
  }

  console.log(`CSI247 Java audit passed: ${programs.length} examples compile with --release 8; ${expected.size} outputs verified.`);
} finally {
  const resolvedWork = resolve(work);
  const resolvedTemp = resolve(tmpdir());
  if (!resolvedWork.startsWith(`${resolvedTemp}\\`) && !resolvedWork.startsWith(`${resolvedTemp}/`)) {
    throw new Error(`Refusing to remove unexpected audit directory: ${resolvedWork}`);
  }
  rmSync(resolvedWork, { recursive: true, force: true });
}
