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

test('there are thirty-four scenarios and each one builds and draws every step', () => {
  assert.equal(memoryScenarioIds.length, 34);
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

test('the Lecture 14 linked list scenarios leave the nodes they unlink as garbage', () => {
  for (const id of ['llremove', 'llexercise', 'llpractice', 'stacklinked', 'queuelinked']) {
    const sc = buildMemoryScenario(id);
    const last = finalState(sc);
    const pointedAt = new Set();
    for (const o of last.objs) o.cells.forEach((c) => c.v.r != null && pointedAt.add(c.v.r));
    last.vars.forEach((v) => v.v.r != null && pointedAt.add(v.v.r));
    const garbage = last.objs.filter((o) => !pointedAt.has(o.addr)).map((o) => o.addr);
    assert.ok(garbage.length >= 1, `${id} leaves at least one unreachable node`);
  }
  const added = finalState(buildMemoryScenario('lladdlast'));
  const tail = added.objs.find((o) => o.addr === 300);
  assert.equal(tail.cells.find((c) => c.n === 'next').v.r, 400, 'addLast links the old tail to the new node');
});

test('the array queue leaves removed elements in the array and resets front and tail when it empties', () => {
  const sc = buildMemoryScenario('queuearray');
  const afterThreeDequeues = sc.steps[7].s;
  const arr = afterThreeDequeues.objs.find((o) => o.addr === 300);
  assert.equal(arr.cells[0].v.t, '26', 'a dequeued element stays in the array');
  const q = afterThreeDequeues.objs.find((o) => o.addr === 200);
  assert.equal(q.cells.find((c) => c.n === 'front').v.t, '3');
  assert.equal(q.cells.find((c) => c.n === 'tail').v.t, '2');
  const last = finalState(sc).objs.find((o) => o.addr === 200);
  assert.equal(last.cells.find((c) => c.n === 'front').v.t, '0', 'front is reset by the next enqueue');
  const stack = finalState(buildMemoryScenario('stackarray')).objs.find((o) => o.addr === 300);
  assert.equal(stack.cells[2].v.t, '46');
  assert.ok(stack.cells[2].old.includes('92'), 'the stale 92 is crossed out when 46 overwrites it');
});

test('the generic set reuses the first empty cell after a remove', () => {
  const arr = finalState(buildMemoryScenario('genset')).objs.find((o) => o.addr === 300);
  assert.equal(arr.cells[0].v.t, '5');
  assert.ok(arr.cells[0].old.includes('7'), 'the removed 7 is crossed out before 5 takes the cell');
  assert.equal(arr.cells[1].v.t, '12');
  assert.equal(arr.cells[2].v.t, '7', 'the duplicate 7 is still there');
  assert.equal(arr.cells[3].v.t, 'null');
});

test('the iterator scenario moves cursor and lastRet and removes the last element seen', () => {
  const sc = buildMemoryScenario('iterator');
  const itOf = (state) => state.objs.find((o) => o.addr === 400);
  const field = (o, n) => o.cells.find((c) => c.n === n).v.t;
  assert.equal(field(itOf(sc.steps[5].s), 'cursor'), '3');
  assert.equal(field(itOf(sc.steps[5].s), 'lastRet'), '2');
  const afterRemove = sc.steps[6].s;
  assert.equal(field(itOf(afterRemove), 'lastRet'), '-1');
  assert.equal(field(afterRemove.objs.find((o) => o.addr === 200), 'size'), '5');
  const arr = afterRemove.objs.find((o) => o.addr === 300);
  assert.equal(arr.cells[2].v.t, '81');
  assert.ok(arr.cells[2].old.includes('12'), 'the removed 12 is crossed out');
  assert.equal(arr.cells[5].v.t, 'null');
});

test('the Person list shifts left on remove(2) and leaves Mpho Wangu as garbage', () => {
  const last = finalState(buildMemoryScenario('personlist'));
  const arr = last.objs.find((o) => o.addr === 300);
  assert.equal(arr.cells[2].v.r, 1300);
  assert.equal(arr.cells[4].v.r, 1500);
  assert.equal(arr.cells[5].v.t, 'null');
  assert.equal(last.objs.find((o) => o.addr === 200).cells.find((c) => c.n === 'size').v.t, '5');
  const pointedAt = new Set();
  for (const o of last.objs) o.cells.forEach((c) => c.v.r != null && pointedAt.add(c.v.r));
  last.vars.forEach((v) => v.v.r != null && pointedAt.add(v.v.r));
  assert.ok(!pointedAt.has(1200), 'nothing points at the removed Person');
});

test('the LinkedList scenario keeps both directions of every link consistent', () => {
  const last = finalState(buildMemoryScenario('llcourses'));
  const node = (a) => last.objs.find((o) => o.addr === a);
  const f = (a, n) => node(a).cells.find((c) => c.n === n).v;
  assert.equal(f(200, 'first').r, 600);
  assert.equal(f(200, 'last').r, 400);
  assert.equal(f(600, 'next').r, 700);
  assert.equal(f(700, 'prev').r, 600);
  assert.equal(f(700, 'next').r, 400);
  assert.equal(f(400, 'prev').r, 700);
  assert.equal(f(400, 'next').t, 'null');
});

test('the account scenario changes two objects in a transfer and shares one object through an alias', () => {
  const last = finalState(buildMemoryScenario('account'));
  const field = (a, n) => last.objs.find((o) => o.addr === a).cells.find((c) => c.n === n).v;
  assert.equal(field(200, 'balance').t, '37263.87');
  assert.equal(field(400, 'balance').t, '1000.00');
  assert.equal(field(200, 'accNumber').t, '99999');
  assert.equal(last.vars.find((v) => v.n === 'third').v.r, 200);
  assert.equal(last.vars.find((v) => v.n === 'first').v.r, 200);
  assert.ok(last.objs.find((o) => o.addr === 200).cells.find((c) => c.n === 'balance').old.includes('37763.87'));
});

test('the polymorphism scenario stores different classes in one Shape array', () => {
  const last = finalState(buildMemoryScenario('polymorph'));
  const arr = last.objs.find((o) => o.addr === 100);
  assert.equal(arr.cells[0].v.r, 200);
  assert.equal(arr.cells[1].v.r, 300);
  assert.equal(last.objs.find((o) => o.addr === 200).t, 'Circle');
  assert.equal(last.objs.find((o) => o.addr === 300).t, 'Rectangle');
  assert.equal(last.vars.find((v) => v.n === 'a0').v.t, '28.27');
});

test('the array scenarios of Lecture 5 end with the contents the lecture asks for', () => {
  const dry = finalState(buildMemoryScenario('arrdry')).objs.find((o) => o.addr === 100);
  assert.deepEqual(dry.cells.map((c) => c.v.t), ['5', '6', '9', '19', '23', '37']);
  assert.ok(dry.cells[3].old.includes('14'), 'the first value of numbers[3] is crossed out');
  const loop = finalState(buildMemoryScenario('arrloop')).objs.find((o) => o.addr === 100);
  assert.equal(loop.cells.length, 14);
  assert.deepEqual(loop.cells.map((c) => c.v.t), ['0', '2', '0', '4', '0', '6', '0', '8', '0', '10', '0', '12', '0', '14']);
  const init = finalState(buildMemoryScenario('arrinit'));
  assert.equal(init.objs.find((o) => o.addr === 100).cells[2].v.t, '-7');
  assert.equal(init.objs.find((o) => o.addr === 300).cells[1].v.r, 500);
});

test('a method receives copies of its arguments and its boxes disappear on return', () => {
  const sc = buildMemoryScenario('callcopy');
  const during = sc.steps[4].s;
  assert.equal(during.vars.find((v) => v.n === 'price').v.t, '10.75');
  assert.equal(during.vars.find((v) => v.n === 'total').v.t, '10.0', 'total is not changed by the method');
  const after = finalState(sc);
  assert.ok(!after.vars.some((v) => v.n === 'price'), 'the parameter boxes are gone');
  assert.equal(after.vars.find((v) => v.n === 't').v.t, '0.75');
  assert.equal(after.vars.find((v) => v.n === 'total').v.t, '10.0');
});
