#!/usr/bin/env node
/**
 * Builds the package examples of a lesson in a temporary folder, runs the commands the lesson shows, and checks (or fills)
 * the output shown under each command, so that a terminal session in a lesson can never be guessed.
 *
 * In the MDX:
 *   - a Java file is a java fence whose title is a path with a folder, and a project name:
 *         ```java title="src/pkg/A.java" project="demo"
 *   - a terminal session is a text fence titled "terminal" with the same project; each line that starts with "$ " is a
 *     command (javac, java, mkdir <folder> or ls <folder>) and the lines under it are its output:
 *         ```text title="terminal" project="demo"
 *         $ javac -d classes -sourcepath src src/pkg/A.java
 *         $ java -classpath classes pkgTester
 *         ```
 *   - fences are read in order, so a file fence that repeats a path replaces that file from then on.
 *
 *   node scripts/verify-package-examples.mjs content/docs/sem3/csi247/05-packages/notes/packages-by-example.mdx
 *   node scripts/verify-package-examples.mjs --fill <lesson.mdx>      writes the real output under every command
 *
 * Output is stdout followed by stderr, with line ends and trailing spaces normalised. `ls folder` lists the names in a folder,
 * one per line, sorted. Needs a JDK on the PATH. Commands run from the project folder, so a path in a javac message uses the
 * separator of the machine the script runs on.
 */
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const args = process.argv.slice(2);
const fill = args.includes('--fill');
const files = args.filter((a) => !a.startsWith('--'));
if (!files.length) {
  console.error('Usage: node scripts/verify-package-examples.mjs [--fill] <lesson.mdx>...');
  process.exit(2);
}

const fenceRe = /^(`{3,})(\w+)([^\n]*)\n([\s\S]*?)\n\1[ \t]*$/gm;
const attr = (meta, name) => {
  const m = meta.match(new RegExp(`${name}="([^"]*)"`));
  return m ? m[1] : null;
};
const normalise = (s) =>
  s
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+$/gm, '')
    .trimEnd();

function run(command, cwd) {
  const parts = command.trim().split(/\s+/);
  if (parts[0] === 'mkdir') {
    fs.mkdirSync(path.join(cwd, parts[1]), { recursive: true });
    return '';
  }
  if (parts[0] === 'ls') {
    const dir = path.join(cwd, parts[1] ?? '.');
    if (!fs.existsSync(dir)) return `ls: ${parts[1]}: no such folder`;
    return fs.readdirSync(dir).sort().join('\n');
  }
  if (parts[0] !== 'javac' && parts[0] !== 'java') return `(command not supported: ${parts[0]})`;
  const ran = spawnSync(parts[0], parts.slice(1), { cwd, encoding: 'utf8', timeout: 30000 });
  return normalise((ran.stdout ?? '') + (ran.stderr ?? ''));
}

const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'pkg-'));
let problems = 0;
let commandsRun = 0;

for (const file of files) {
  let text = fs.readFileSync(file, 'utf8');
  const projects = new Map();
  const edits = [];
  for (const m of text.matchAll(fenceRe)) {
    const [whole, , lang, meta, body] = m;
    const title = attr(meta, 'title');
    const project = attr(meta, 'project');
    if (!project) continue;
    const dir = path.join(tmpRoot, path.basename(file, '.mdx'), project);
    if (lang === 'java' && title && title.includes('/')) {
      const target = path.join(dir, title);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, body + '\n');
      projects.set(project, dir);
    } else if (lang === 'text' && title === 'terminal') {
      fs.mkdirSync(dir, { recursive: true });
      const lines = body.split('\n');
      const rebuilt = [];
      let i = 0;
      while (i < lines.length) {
        if (!lines[i].startsWith('$ ')) {
          i++;
          continue;
        }
        const command = lines[i].slice(2);
        i++;
        const expected = [];
        while (i < lines.length && !lines[i].startsWith('$ ')) {
          expected.push(lines[i]);
          i++;
        }
        const actual = run(command, dir);
        commandsRun++;
        rebuilt.push(`$ ${command}`);
        if (actual) rebuilt.push(actual);
        if (!fill && normalise(expected.join('\n')) !== actual) {
          problems++;
          console.log(`${file}: output differs for "${command}"\n  shown:  ${JSON.stringify(normalise(expected.join('\n')))}\n  actual: ${JSON.stringify(actual)}`);
        }
      }
      if (fill) edits.push([whole, whole.replace(body, rebuilt.join('\n'))]);
    }
  }
  if (fill) {
    for (const [before, after] of edits) text = text.replace(before, () => after);
    fs.writeFileSync(file, text);
    console.log(`${file}: filled ${edits.length} sessions`);
  }
}

fs.rmSync(tmpRoot, { recursive: true, force: true });
if (!fill) console.log(`Package sessions: ${commandsRun} commands run, ${problems} differ`);
process.exit(problems ? 1 : 0);
