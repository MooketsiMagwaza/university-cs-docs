import assert from 'node:assert/strict';
import test from 'node:test';
import { runSession, sessionCommands, transcriptStream } from '../../lib/ghci-session.ts';
import { runHaskellWithInput } from '../../lib/haskell-simulator.ts';

const run = (code) => runHaskellWithInput(code, '');
const text = (result) => result.lines.map((line) => line.text).join('\n');

test('sessionCommands removes prompts and blank lines', () => {
  assert.deepEqual(sessionCommands('ghci> 3 + 4\n\nghci>  let x = 5\nx * 2\n'), ['3 + 4', 'let x = 5', 'x * 2']);
  assert.deepEqual(sessionCommands(''), []);
});

test('a session is rebuilt as commands under their prompts with their results', () => {
  const result = runSession(sessionCommands('ghci> 3 + 4\nghci> let x = 5\nghci> x * 2\nghci> zip [1,2,3] "ab"'), run);
  assert.equal(result.ok, true);
  assert.equal(text(result), "ghci> 3 + 4\n7\nghci> let x = 5\nghci> x * 2\n10\nghci> zip [1,2,3] \"ab\"\n[(1,'a'),(2,'b')]");
  assert.deepEqual(result.lines.map((line) => line.stream), ['in', 'out', 'in', 'in', 'out', 'in', 'out']);
});

test('a command that prints nothing, such as let, adds no result line', () => {
  const result = runSession(['let y = 2'], run);
  assert.equal(text(result), 'ghci> let y = 2');
});

test('a result of several lines stays under its command', () => {
  const result = runSession(['[1,2,3]', 'map (*2) [1,2,3]'], run);
  assert.equal(text(result), 'ghci> [1,2,3]\n[1,2,3]\nghci> map (*2) [1,2,3]\n[2,4,6]');
});

test('a failing command stops the session and reports its message', () => {
  const result = runSession(['1 + 1', 'foo 3', '2 + 2'], run);
  assert.equal(result.ok, false);
  assert.equal(result.failure.command, 'foo 3');
  assert.ok(result.lines.some((line) => line.stream === 'err'));
  assert.ok(!text(result).includes('ghci> 2 + 2'), 'commands after the failure are not run');
  assert.equal(result.lines[1].text, '2');
});

test('the transcript the page shows is coloured by prompt', () => {
  assert.equal(transcriptStream('ghci> 1 + 1'), 'in');
  assert.equal(transcriptStream('2'), 'out');
});

test('earlier definitions are available to later commands', () => {
  const result = runSession(sessionCommands('ghci> let double n = n * 2\nghci> double 21\nghci> map double [1,2,3]'), run);
  assert.equal(result.ok, true);
  assert.equal(text(result), 'ghci> let double n = n * 2\nghci> double 21\n42\nghci> map double [1,2,3]\n[2,4,6]');
});
