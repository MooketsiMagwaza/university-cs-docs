#!/usr/bin/env node
/**
 * Fills the output of Java examples in a lesson from a real run, so a shown output can never be guessed.
 *
 * In the MDX, write the program as a titled fence and put the text `@@OUTPUT@@` in the `text` fence right below it:
 *
 *     ```java title="Name.java"
 *     public class Name { public static void main(String[] args) { System.out.println(6 * 7); } }
 *     ```
 *
 *     ```text
 *     @@OUTPUT@@
 *     ```
 *
 *   node scripts/fill-java-outputs.mjs content/docs/sem3/csi247/02-recursion/notes/some-lesson.mdx
 *
 * Every complete program (a class named like its title, with a `main` method) is compiled with `javac --release 8` together
 * with the classes declared earlier on the same page, run with `java`, and its output replaces the placeholder. A program
 * that does not compile is reported and skipped. Afterwards run `node scripts/verify-csi247-listings.mjs <file>` to check
 * every shown output against a fresh run, and `node scripts/check-mdx.mjs <file>` to check that the page compiles.
 * Needs a JDK on the PATH. Only text fences that hold exactly the placeholder are changed.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const fenceRe = /^(`{3,})java[^\n]*?title="([^"]+)"[^\n]*\n([\s\S]*?)\n\1[ \t]*(?:\n\n?(`{3,})text[^\n]*\n([\s\S]*?)\n\4)?/gm;
const files = process.argv.slice(2).filter((a) => !a.startsWith('--'));
if (!files.length) {
  console.error('Usage: node scripts/fill-java-outputs.mjs <lesson.mdx>...');
  process.exit(2);
}
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'fill-'));
let bad = 0;
for (const file of files) {
  let text = fs.readFileSync(file, 'utf8');
  const known = new Map(); // classes declared so far on this page, by file name
  const replacements = [];
  for (const m of text.matchAll(fenceRe)) {
    const [, , title, code, , shown] = m;
    const name = title.replace(/\.java$/, '');
    const declares = /^[A-Za-z_]\w*$/.test(name) && new RegExp(`\\b(class|interface|enum)\\s+${name}\\b`).test(code);
    if (declares) known.set(name, code);
    if (!declares || !/static\s+void\s+main\s*\(/.test(code)) continue;
    const dir = fs.mkdtempSync(path.join(tmp, 'p-'));
    for (const [n, c] of known) fs.writeFileSync(path.join(dir, `${n}.java`), c);
    const compiled = spawnSync('javac', ['--release', '8', '-Xlint:-options', '-d', dir, ...[...known.keys()].map((n) => path.join(dir, `${n}.java`))], { encoding: 'utf8' });
    if (compiled.status !== 0) {
      console.log(`${file}: ${title} does not compile\n${compiled.stderr.split('\n').slice(0, 6).join('\n')}`);
      bad++;
      continue;
    }
    const ran = spawnSync('java', ['-cp', dir, name], { encoding: 'utf8', timeout: 20000 });
    const out = (ran.stdout ?? '').replace(/\r\n/g, '\n').replace(/[ \t]+$/gm, '').trimEnd();
    if (shown !== undefined && shown.trim() === '@@OUTPUT@@') replacements.push([shown, out]);
    if (ran.status !== 0) console.log(`${file}: ${title} exited with ${ran.status}: ${(ran.stderr ?? '').split('\n')[0]}`);
  }
  for (const [placeholder, out] of replacements) text = text.replace(placeholder, out);
  fs.writeFileSync(file, text);
  console.log(`${file}: filled ${replacements.length}`);
}
fs.rmSync(tmp, { recursive: true, force: true });
process.exit(bad ? 1 : 0);
