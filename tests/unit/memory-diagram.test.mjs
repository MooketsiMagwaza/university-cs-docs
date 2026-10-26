// The memory-diagram engine behind <MemoryDiagram />: every scenario builds, every step draws, values are crossed out and
// never erased, and an object nothing points to is drawn as garbage.
// Run with: node --no-warnings --experimental-strip-types --test tests/unit/memory-diagram.test.mjs

import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as nodeModule from 'node:module';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

// The source files import each other without a file extension, as the bundler allows. Node needs the extension.
const addExtension = (specifier, parentURL) => {
  if (!specifier.startsWith('.') || path.extname(specifier) || !parentURL) return null;
  const file = fileURLToPath(new URL(`${specifier}.ts`, parentURL));
  return fs.existsSync(file) ? `${specifier}.ts` : null;
};
if (typeof nodeModule.registerHooks === 'function') {
  nodeModule.registerHooks({
    resolve: (specifier, context, nextResolve) => nextResolve(addExtension(specifier, context.parentURL) ?? specifier, context),
  });
} else {
  nodeModule.register(`data:text/javascript,${encodeURIComponent(`
    import fs from 'node:fs';
    import path from 'node:path';
    import { fileURLToPath } from 'node:url';
    export function resolve(specifier, context, nextResolve) {
      if (specifier.startsWith('.') && !path.extname(specifier) && context.parentURL) {
        const file = fileURLToPath(new URL(specifier + '.ts', context.parentURL));
        if (fs.existsSync(file)) return nextResolve(specifier + '.ts', context);
      }
      return nextResolve(specifier, context);
    }
  `)}`);
}

const { drawDiagram, finalState } = await import('../../lib/csi247/memory-diagram.ts');
const { buildMemoryScenario, memoryScenarioIds } = await import('../../lib/csi247/memory-scenarios.ts');

const walk = (nodes, visit) => nodes.forEach((n) => (visit(n), walk(n.children, visit)));
const classes = (drawing) => {
  const out = [];
  walk(drawing.nodes, (n) => out.push(String(n.attrs.class ?? '')));
  return out;
};
const texts = (drawing) => {
  const out = [];
  walk(drawing.nodes, (n) => n.text != null && out.push(n.text));
  return out;
};

test('there are thirteen scenarios and each one builds and draws every step', () => {
  assert.equal(memoryScenarioIds.length, 13);
  for (const id of memoryScenarioIds) {
    const sc = buildMemoryScenario(id);
    assert.ok(sc.steps.length >= 1, `${id} has steps`);
    for (const step of sc.steps) {
      const d = drawDiagram(step.s, sc.opts);
      assert.ok(Number.isFinite(d.width) && Number.isFinite(d.height) && d.width > 0 && d.height > 0, `${id} has a size`);
      assert.ok(texts(d).includes('STACK') && texts(d).includes('HEAP'), `${id} labels the stack and the heap`);
    }
    // a step that mentions a code line points at a line that exists
    if (sc.code.length) for (const step of sc.steps) assert.ok(step.line < sc.code.length, `${id} step line ${step.line} is in the code`);
  }
});

test('an unknown scenario is an error, not an empty picture', () => {
  assert.throws(() => buildMemoryScenario('nope'), /unknown scenario/);
});

test('primitives: the old value is crossed out beside the new one, and the copy keeps its own value', () => {
  const sc = buildMemoryScenario('basics');
  const last = sc.steps[sc.steps.length - 1].s;
  const x = last.vars.find((v) => v.n === 'x');
  const y = last.vars.find((v) => v.n === 'y');
  assert.deepEqual(x.old, ['5']);
  assert.equal(x.v.t, '7');
  assert.equal(y.v.t, '5');
  assert.deepEqual(y.old, []);
});

test('references: arr and other hold the same address, so a change through one is in the one shared array', () => {
  const sc = buildMemoryScenario('basics');
  const last = sc.steps[sc.steps.length - 1].s;
  assert.equal(last.vars.find((v) => v.n === 'arr').v.r, 100);
  assert.equal(last.vars.find((v) => v.n === 'other').v.r, 100);
  const array = last.objs.find((o) => o.addr === 100);
  assert.deepEqual(array.cells.map((c) => c.v.t), ['4', '9', '0']);
  assert.equal(last.objs.length, 1);
});

test('student: new Student[3] makes no student, and replacing a name leaves the old String unreachable', () => {
  const sc = buildMemoryScenario('student');
  const afterArray = sc.steps[1].s;
  assert.equal(afterArray.objs.length, 1);
  assert.ok(afterArray.objs[0].cells.every((c) => c.v.t === 'null'));
  const final = finalState(sc);
  const drawing = drawDiagram(final, sc.opts);
  assert.ok(classes(drawing).includes('gone'), 'the "John" String is drawn as garbage');
  assert.ok(texts(drawing).includes('unreachable → garbage'));
  assert.ok(classes(drawing).includes('ar dead'), 'the old arrow to "John" is drawn dashed');
  assert.ok(classes(drawing).includes('xx'), 'and crossed out');
  const student = final.objs.find((o) => o.addr === 200);
  assert.equal(student.cells.find((c) => c.n === 'age').v.t, '18');
  assert.deepEqual(student.cells.find((c) => c.n === 'age').old, ['67']);
  // the array slot and the variable both hold 200: two boxes, one object
  assert.equal(final.objs.find((o) => o.addr === 100).cells[2].v.r, 200);
  assert.equal(final.vars.find((v) => v.n === 'myStudent').v.r, 200);
});

test('book: b = null does not make the Java Book garbage while the shelf still points at it', () => {
  const sc = buildMemoryScenario('book');
  const final = finalState(sc);
  const drawing = drawDiagram(final, sc.opts);
  assert.equal(final.vars.find((v) => v.n === 'b').v.t, 'null');
  assert.ok(!classes(drawing).includes('gone'));
  assert.equal(final.objs.find((o) => o.addr === 200).cells.find((c) => c.n === 'year').v.t, '2014');
});

test('ArrayList: growing copies into a new array and the old one becomes garbage', () => {
  const sc = buildMemoryScenario('alist');
  const grow = sc.steps.findIndex((s) => s.note.startsWith('Grow, step 3'));
  assert.ok(grow > 0);
  const before = drawDiagram(sc.steps[grow - 1].s, sc.opts);
  const after = drawDiagram(sc.steps[grow].s, sc.opts);
  assert.ok(!classes(before).includes('gone'));
  assert.ok(classes(after).includes('gone'), 'the array at 300 is unreachable after elementData moves to 400');
  const final = finalState(sc);
  assert.equal(final.objs.find((o) => o.addr === 200).cells.find((c) => c.n === 'size').v.t, '5');
  assert.deepEqual(final.objs.find((o) => o.addr === 400).cells.slice(0, 6).map((c) => c.v.t), ['55', '81', '69', '60', '70', 'null']);
});

test('linked list: the final list is 57 then 41, and the removed nodes are garbage', () => {
  const sc = buildMemoryScenario('llbuild');
  const final = finalState(sc);
  assert.equal(final.vars.find((v) => v.n === 'head').v.r, 450);
  const drawing = drawDiagram(final, sc.opts);
  assert.ok(classes(drawing).includes('gone'));
  const garbage = texts(drawing).filter((t) => t === 'unreachable → garbage').length;
  assert.equal(garbage, 2, 'the 12 node and the 33 node');
});

test('traversal draws no dead arrows, so cur only shows the addresses it visited', () => {
  const sc = buildMemoryScenario('lltrav');
  assert.equal(sc.opts.dead, false);
  const final = sc.steps[sc.steps.length - 1].s;
  assert.deepEqual(final.vars.find((v) => v.n === 'cur').old, ['367', '100', '450', '290']);
  assert.ok(!classes(drawDiagram(final, sc.opts)).includes('ar dead'));
});
