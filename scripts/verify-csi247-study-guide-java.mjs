#!/usr/bin/env node
// Compile and run the actual repo-owned standalone-guide snippets.
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import assert from 'node:assert/strict';
import { JAVA, runnable } from '../features/courses/csi247/study-guides/java.mjs';
const directory = await mkdtemp(join(tmpdir(), 'csi247-guide-java-'));
function command(executable, args, input) {
  const result = spawnSync(executable, args, { cwd: directory, encoding: 'utf8', input });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, `${executable} ${args.join(' ')}\n${result.stdout}\n${result.stderr}`);
  return result.stdout.trim().replaceAll('\r\n', '\n');
}
for (const kind of ['linear', 'binary', 'bubble', 'selection', 'insertion', 'merge']) {
  const input = kind === 'linear' ? [63, 29, 85, 72, 18, 42, 23, 54, 8, 32] : kind === 'binary' ? [8, 18, 23, 29, 34, 42, 54, 63, 72, 85] : kind === 'merge' ? [63, 29, 72, 85, 18, 49, 3, 54] : [4, 2, 5, 1, 3];
  const name = `${kind[0].toUpperCase() + kind.slice(1)}Demo`;
  let source = runnable(kind, input, 18);
  if (kind !== 'merge') source = source.replace('    public static void main', `${JAVA[`${kind}Rec`].split('\n').map((line) => `    ${line}`).join('\n')}\n\n    public static void main`);
  if (kind === 'linear') source = source.replace('    public static void main', `${JAVA.strings.split('\n').map((line) => `    ${line}`).join('\n')}\n\n    public static void main`);
  await writeFile(join(directory, `${name}.java`), source);
  command('javac', ['-encoding', 'UTF-8', `${name}.java`]);
  const expected = kind === 'linear' ? '4' : kind === 'binary' ? '1' : `[${[...input].sort((a, b) => a - b).join(', ')}]`;
  assert.equal(command('java', [name]), expected);
  console.log(`PASS ${name}: primary + recursive snippets compiled, expected output ${expected}`);
}
for (const [file, key] of [['pkg/A', 'packageA'], ['pkg/B', 'packageB'], ['pkg/Tester', 'packageTester'], ['app/Main', 'packageMain'], ['app/ImportDemo', 'imports']]) {
  await mkdir(join(directory, 'src', file.split('/')[0]), { recursive: true });
  await writeFile(join(directory, 'src', `${file}.java`), JAVA[key]);
}
command('javac', ['-encoding', 'UTF-8', '-d', 'classes', '-sourcepath', 'src', 'src/pkg/A.java', 'src/pkg/B.java', 'src/pkg/Tester.java', 'src/app/Main.java', 'src/app/ImportDemo.java']);
assert.equal(command('java', ['-classpath', 'classes', 'pkg.Tester']), 'Hello from pkg.A\n42\npkg only');
assert.equal(command('java', ['-classpath', 'classes', 'app.Main']), 'Hello from pkg.A\n10');
assert.equal(command('java', ['-classpath', 'classes', 'app.ImportDemo'], '5\n'), 'Enter one whole number: [1, 2, 5]');
console.log(`PASS all package/import programs. Verification sources retained at ${directory}`);
