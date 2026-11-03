// The memory-diagram engine behind <MemoryDiagram />: every scenario builds and draws, the picture is clean at every step (no
// overlapping boxes or labels, no text wider than its box, no arrow through a box), values are crossed out and never
// erased, and an object nothing points to is drawn as garbage.
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

const { memoryBuilder, finalState } = await import('../../lib/csi247/memory-diagram.ts');
const { drawDiagram, drawStep, drawFinal } = await import('../../lib/csi247/memory-draw.ts');
const { checkDrawing, overlappingArrows } = await import('../../lib/csi247/memory-check.ts');
const { createRouter } = await import('../../lib/csi247/memory-route.ts');
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
const obj = (state, addr) => state.objs.find((o) => o.addr === addr);
const field = (state, addr, name) => obj(state, addr).cells.find((c) => c.n === name).v;
const slots = (state, addr) => obj(state, addr).cells.map((c) => c.v.r ?? c.v.t);
const variable = (state, name) => state.vars.find((v) => v.n === name);
/** Addresses nothing points to (from the stack or from any object). */
const garbage = (state) => {
  const pointed = new Set();
  const seen = new Set();
  const visit = (a) => {
    if (seen.has(a)) return;
    seen.add(a);
    const o = obj(state, a);
    if (o) o.cells.forEach((c) => c.v.r != null && visit(c.v.r));
  };
  state.vars.forEach((v) => v.v.r != null && visit(v.v.r));
  seen.forEach((a) => pointed.add(a));
  return state.objs.filter((o) => !pointed.has(o.addr)).map((o) => o.addr);
};

test('there are fifty scenarios and each one builds and draws every step', () => {
  assert.equal(memoryScenarioIds.length, 50);
  for (const id of memoryScenarioIds) {
    const sc = buildMemoryScenario(id);
    assert.ok(sc.steps.length >= 1, `${id} has steps`);
    for (let i = 0; i < sc.steps.length; i++) {
      const d = drawStep(sc, i);
      assert.ok(Number.isFinite(d.width) && Number.isFinite(d.height) && d.width > 0 && d.height > 0, `${id} has a size`);
      assert.ok(texts(d).includes('Stack') && texts(d).includes('Heap'), `${id} labels the stack and the heap`);
    }
    // a step that mentions a code line points at a line that exists
    if (sc.code.length) for (const step of sc.steps) assert.ok(step.line < sc.code.length, `${id} step line ${step.line} is in the code`);
  }
});

test('every step of every scenario is a clean picture: no overlaps, no clipped text, no arrow through a box', () => {
  const faults = [];
  for (const id of memoryScenarioIds) {
    const sc = buildMemoryScenario(id);
    sc.steps.forEach((_, i) => {
      for (const issue of [...checkDrawing(drawStep(sc, i)), ...overlappingArrows(drawStep(sc, i))]) faults.push(`${id} step ${i}: ${issue}`);
    });
    for (const issue of checkDrawing(drawFinal(sc))) faults.push(`${id} final: ${issue}`);
  }
  assert.deepEqual(faults, []);
});

test('the picture does not move or change size between steps', () => {
  for (const id of memoryScenarioIds) {
    const sc = buildMemoryScenario(id);
    const first = drawStep(sc, 0);
    const boxes = new Map();
    sc.steps.forEach((_, i) => {
      const d = drawStep(sc, i);
      assert.equal(d.width, first.width, `${id} keeps its width`);
      assert.equal(d.height, first.height, `${id} keeps its height`);
      for (const b of d.geom.boxes) {
        const seen = boxes.get(b.id);
        if (seen) assert.deepEqual(b.r, seen, `${id}: ${b.id} stays where it is`);
        else boxes.set(b.id, b.r);
      }
    });
  }
});

test('the checker catches the faults it is there for', () => {
  const B = memoryBuilder();
  B.arr(100, 3, { at: { x: 0, y: 0 } }).obj(200, [['a', 1]], { at: { x: 40, y: 10 } }).v('x', 1).snap(0, '');
  const state = B.done('overlap').steps[0].s;
  const overlapping = checkDrawing(drawDiagram(state));
  assert.ok(overlapping.some((m) => /overlap/.test(m)), 'two boxes on top of each other are reported');

  const clean = drawDiagram(finalState(buildMemoryScenario('student')));
  assert.deepEqual(checkDrawing(clean), []);
  const squeezed = structuredClone(clean);
  squeezed.geom.contents[0].cell.w = 4;
  assert.ok(checkDrawing(squeezed).some((m) => /does not fit/.test(m)), 'text wider than its box is reported');
  const outside = structuredClone(clean);
  outside.geom.boxes[0].r.x = -50;
  assert.ok(checkDrawing(outside).some((m) => /outside the picture/.test(m)), 'a box outside the picture is reported');
  const through = structuredClone(clean);
  through.geom.arrows[0].pts = [{ x: 0, y: 100 }, { x: clean.width, y: 100 }];
  through.geom.boxes.push({ id: 'blocker', r: { x: 150, y: 80, w: 40, h: 40 } });
  assert.ok(checkDrawing(through).some((m) => /runs through blocker/.test(m)), 'an arrow through a box is reported');
});

test('the router goes round a box that is in the way and keeps to elbows', () => {
  const start = { x: 20, y: 100, dir: 'E', pen: 0 };
  const goal = { x: 380, y: 100, dir: 'W', pen: 0 };
  const router = createRouter(400, 200, [{ x: 150, y: 60, w: 100, h: 80 }], [start, goal]);
  const hit = router.route([start], [goal]);
  assert.ok(hit, 'a route exists');
  const crossesBox = hit.path.some((p, i) => i && Math.min(p.y, hit.path[i - 1].y) < 140 && Math.max(p.y, hit.path[i - 1].y) > 60 && Math.min(p.x, hit.path[i - 1].x) < 250 && Math.max(p.x, hit.path[i - 1].x) > 150 && p.x > 150 && p.x < 250);
  assert.ok(!crossesBox, 'the route does not enter the box');
  hit.path.forEach((p, i) => i && assert.ok(Math.abs(p.x - hit.path[i - 1].x) < 1 || Math.abs(p.y - hit.path[i - 1].y) < 1, 'every segment is horizontal or vertical'));
});

test('primitives: the old value is crossed out beside the new one, and the copy keeps its own value', () => {
  const sc = buildMemoryScenario('basics');
  const last = sc.steps[sc.steps.length - 1].s;
  const x = variable(last, 'x');
  const y = variable(last, 'y');
  assert.deepEqual(x.old, ['5']);
  assert.equal(x.v.t, '7');
  assert.equal(y.v.t, '5');
  assert.deepEqual(y.old, []);
});

test('references: arr and other hold the same address, so a change through one is in the one shared array', () => {
  const sc = buildMemoryScenario('basics');
  const last = sc.steps[sc.steps.length - 1].s;
  assert.equal(variable(last, 'arr').v.r, 100);
  assert.equal(variable(last, 'other').v.r, 100);
  assert.deepEqual(slots(last, 100), ['4', '9', '0']);
  assert.equal(last.objs.length, 1);
});

test('student: new Student[3] makes no student, and replacing a name leaves the old String unreachable', () => {
  const sc = buildMemoryScenario('student');
  const afterArray = sc.steps[1].s;
  assert.equal(afterArray.objs.length, 1);
  assert.ok(afterArray.objs[0].cells.every((c) => c.v.t === 'null'));
  const final = finalState(sc);
  const drawing = drawFinal(sc);
  assert.ok(classes(drawing).includes('gone'), 'the "John" String is drawn as garbage');
  assert.ok(texts(drawing).includes('garbage'));
  assert.ok(classes(drawing).includes('ar dead'), 'the old arrow to "John" is drawn grey');
  assert.ok(classes(drawing).includes('xx'), 'and crossed out');
  assert.equal(field(final, 200, 'age').t, '18');
  assert.deepEqual(obj(final, 200).cells.find((c) => c.n === 'age').old, ['67']);
  // the array slot and the variable both hold 200: two boxes, one object
  assert.equal(obj(final, 100).cells[2].v.r, 200);
  assert.equal(variable(final, 'myStudent').v.r, 200);
  assert.deepEqual(garbage(final), [300]);
});

test('book: b = null does not make the Java Book garbage while the shelf still points at it', () => {
  const sc = buildMemoryScenario('book');
  const final = finalState(sc);
  assert.equal(variable(final, 'b').v.t, 'null');
  assert.ok(!classes(drawFinal(sc)).includes('gone'));
  assert.equal(field(final, 200, 'year').t, '2014');
});

test('arrays: creating, copying and aliasing', () => {
  const create = finalState(buildMemoryScenario('arrcreate'));
  assert.deepEqual(slots(create, 100), Array(10).fill('0'));
  assert.deepEqual(slots(create, 200), [300, 400, 'null', 'null', 'null', 'null', 'null']);
  const copy = finalState(buildMemoryScenario('arrcopy'));
  assert.equal(variable(copy, 'a').v.r, 100);
  assert.equal(variable(copy, 'b').v.r, 100, 'b is an alias');
  assert.equal(variable(copy, 'c').v.r, 200, 'c is a separate array');
  assert.deepEqual(slots(copy, 100), ['99', '8', '15']);
  assert.deepEqual(slots(copy, 200), ['4', '8', '15']);
  const names = finalState(buildMemoryScenario('strarray'));
  assert.deepEqual(slots(names, 100), [500, 400, 'null']);
  assert.deepEqual(garbage(names), [300], 'the replaced String is garbage');
  const grid = finalState(buildMemoryScenario('array2d'));
  assert.deepEqual(slots(grid, 100), [200, 300]);
  assert.deepEqual(slots(grid, 300), ['0', '0', '7']);
  const marks = finalState(buildMemoryScenario('marks'));
  assert.deepEqual(slots(marks, 100), [200, 300, 400, 500]);
  assert.equal(obj(marks, 200).cells[0].v.t, '73', 'each mark is an Integer object of its own');
});

test('objects: an alias is one object, a second new is another, a method cannot change the caller\'s variable', () => {
  const alias = finalState(buildMemoryScenario('objalias'));
  assert.equal(variable(alias, 'a').v.r, 200);
  assert.equal(variable(alias, 'b').v.r, 200);
  assert.equal(variable(alias, 'c').v.r, 400);
  assert.equal(field(alias, 200, 'age').t, '20');
  const pass = buildMemoryScenario('objpass');
  const final = finalState(pass);
  assert.ok(!variable(final, 'p'), 'the parameter is gone after the call');
  assert.equal(variable(final, 's').v.r, 200);
  assert.equal(field(final, 200, 'age').t, '20');
  assert.deepEqual(garbage(final).sort(), [400, 500]);
  const strings = finalState(buildMemoryScenario('strings'));
  assert.equal(variable(strings, 'a').v.r, 400);
  assert.equal(variable(strings, 'b').v.r, 300);
  assert.equal(obj(strings, 400).cells[0].v.t, '"Java8"');
});

test('ArrayList: ten slots of addresses, each element an object of its own', () => {
  const added = finalState(buildMemoryScenario('alist'));
  assert.equal(obj(added, 300).cells.length, 10);
  assert.deepEqual(slots(added, 300), [400, 500, 600, 700, 800, 'null', 'null', 'null', 'null', 'null']);
  assert.equal(field(added, 200, 'size').t, '5');
  assert.equal(field(added, 200, 'elementData').r, 300);
  assert.deepEqual([400, 500, 600, 700, 800].map((a) => obj(added, a).cells[0].v.t), ['73', '81', '69', '60', '70']);
  assert.deepEqual(garbage(added), []);
});

test('ArrayList: insert and remove move addresses, not objects', () => {
  const sc = buildMemoryScenario('alistinsert');
  const inserted = sc.steps.find((s) => s.note.startsWith('Slot [1] has been copied'));
  assert.deepEqual(slots(inserted.s, 300).slice(0, 6), [400, 900, 500, 600, 700, 800]);
  assert.equal(field(inserted.s, 200, 'size').t, '6');
  const final = finalState(sc);
  assert.deepEqual(slots(final, 300).slice(0, 6), [900, 500, 600, 700, 800, 'null']);
  assert.equal(field(final, 200, 'size').t, '5');
  assert.deepEqual(garbage(final), [400], 'the removed 73 is garbage');
});

test('ArrayList: growing copies the addresses into a new array and the old one becomes garbage', () => {
  const sc = buildMemoryScenario('alistgrow');
  const grow = sc.steps.findIndex((s) => s.note.startsWith('Step 3'));
  assert.ok(grow > 0);
  const before = drawStep(sc, grow - 1);
  const after = drawStep(sc, grow);
  assert.ok(!classes(before).includes('gone'));
  assert.ok(classes(after).includes('gone'), 'the array at 300 is unreachable after elementData moves to 800');
  const final = finalState(sc);
  assert.equal(obj(final, 800).cells.length, 8, 'twice as long: 4 becomes 8');
  assert.deepEqual(slots(final, 800), [400, 500, 600, 700, 900, 'null', 'null', 'null']);
  assert.equal(field(final, 200, 'elementData').r, 800);
  assert.equal(field(final, 200, 'size').t, '5');
  assert.deepEqual(garbage(final), [300]);
});

test('ArrayList of objects: remove shifts the address left and leaves the first Student as garbage', () => {
  const final = finalState(buildMemoryScenario('alstudents'));
  assert.deepEqual(slots(final, 300).slice(0, 3), [600, 'null', 'null']);
  assert.equal(field(final, 200, 'size').t, '1');
  assert.equal(field(final, 400, 'age').t, '20', 'setAge changed the object, not the list');
  assert.deepEqual(garbage(final).sort(), [400, 500]);
});

test('linked list: the final list is 57 then 41, and the removed nodes are garbage', () => {
  const sc = buildMemoryScenario('llbuild');
  const final = finalState(sc);
  assert.equal(variable(final, 'head').v.r, 450);
  const drawing = drawFinal(sc);
  assert.equal(texts(drawing).filter((t) => t === 'garbage').length, 2, 'the 12 node and the 33 node');
  assert.deepEqual(garbage(final).sort(), [100, 367]);
});

test('traversal draws no dead arrows, so cur only shows the addresses it visited', () => {
  const sc = buildMemoryScenario('lltrav');
  assert.equal(sc.opts.dead, false);
  const final = sc.steps[sc.steps.length - 1].s;
  assert.deepEqual(variable(final, 'cur').old, ['367', '100', '450', '290']);
  assert.ok(!classes(drawStep(sc, sc.steps.length - 1)).includes('ar dead'));
});

test('the linked list scenarios put the list in a LinkedList object that points at the first node', () => {
  for (const id of ['lladdlast', 'lladdfront', 'lladdat', 'llremove', 'llexercise', 'lltail', 'llslide', 'dll']) {
    const final = finalState(buildMemoryScenario(id));
    const wrapper = final.objs.find((o) => o.k === 'obj');
    assert.ok(wrapper, `${id} has a LinkedList object`);
    assert.ok(wrapper.cells.some((c) => c.n === 'head'), `${id}: the object holds head`);
  }
  const dll = finalState(buildMemoryScenario('dll'));
  assert.equal(field(dll, 500, 'tail').r, 367, 'a doubly linked list keeps head and tail');
  assert.equal(field(dll, 290, 'prev').r, 100);
  const added = finalState(buildMemoryScenario('lladdlast'));
  assert.equal(field(added, 300, 'next').r, 400, 'addLast links the old tail to the new node');
  const front = finalState(buildMemoryScenario('lladdfront'));
  assert.equal(field(front, 340, 'head').r, 400);
  assert.equal(field(front, 400, 'next').r, 100);
});

test('the linked list scenarios that unlink a node leave it as garbage', () => {
  for (const id of ['llremove', 'llexercise', 'llpractice', 'stacklinked', 'queuelinked', 'lltail', 'llcourses']) {
    assert.ok(garbage(finalState(buildMemoryScenario(id))).length >= 1, `${id} leaves at least one unreachable node`);
  }
  const tail = finalState(buildMemoryScenario('lltail'));
  assert.equal(field(tail, 340, 'head').r, 200);
  assert.equal(field(tail, 340, 'tail').r, 300);
  assert.equal(field(tail, 340, 'size').t, '2');
  assert.deepEqual(garbage(tail), [100]);
});

test('the array stack leaves the popped address in the array and overwrites it on the next push', () => {
  const sc = buildMemoryScenario('stackarray');
  const popped = sc.steps[5].s;
  assert.equal(field(popped, 200, 'top').t, '1');
  assert.equal(obj(popped, 300).cells[2].v.r, 600, 'pop does not clear the slot');
  const final = finalState(sc);
  assert.equal(obj(final, 300).cells[2].v.r, 700);
  assert.ok(obj(final, 300).cells[2].oldR.includes(600), 'the stale address is crossed out when 46 overwrites it');
  assert.deepEqual(garbage(final), [600], 'nothing points at 92 any more');
  assert.equal(field(final, 200, 'top').t, '2');
});

test('the linked stack: each push puts a node in front, and its data points at a String', () => {
  const sc = buildMemoryScenario('stacklinked');
  const pushed = sc.steps[sc.steps.length - 2].s;
  assert.equal(field(pushed, 340, 'top').r, 300);
  assert.equal(field(pushed, 300, 'next').r, 200);
  assert.equal(obj(pushed, 300).cells[0].v.r, 310, 'the node holds the address of its String');
  assert.equal(obj(pushed, 310).cells[0].v.t, '"CSI141"');
  const final = finalState(sc);
  assert.equal(field(final, 340, 'top').r, 200);
  assert.ok(garbage(final).includes(300), 'the popped node is garbage');
});

test('the linked queue keeps front and tail, and empties to null', () => {
  const sc = buildMemoryScenario('queuelinked');
  const full = sc.steps[4].s;
  assert.equal(field(full, 340, 'front').r, 100);
  assert.equal(field(full, 340, 'tail').r, 300);
  const final = finalState(sc);
  assert.equal(field(final, 340, 'front').t, 'null');
  assert.equal(field(final, 340, 'tail').t, 'null');
});

test('the array queue leaves removed elements in the array and resets front and tail when it empties', () => {
  const sc = buildMemoryScenario('queuearray');
  const afterThreeDequeues = sc.steps[7].s;
  assert.equal(obj(afterThreeDequeues, 300).cells[0].v.r, 400, 'a dequeued element stays in the array');
  assert.equal(field(afterThreeDequeues, 200, 'front').t, '3');
  assert.equal(field(afterThreeDequeues, 200, 'tail').t, '2');
  const last = finalState(sc);
  assert.equal(field(last, 200, 'front').t, '0', 'front is reset by the next enqueue');
  assert.equal(obj(last, 300).cells[0].v.r, 700);
  assert.deepEqual(garbage(last), [400], 'the first element, overwritten, is garbage');
});

test('the generic set reuses the first empty cell after a remove', () => {
  const sc = buildMemoryScenario('genset');
  const final = finalState(sc);
  assert.deepEqual(slots(final, 300).slice(0, 4), [600, 500, 400, 'null']);
  assert.ok(obj(sc.steps[5].s, 300).cells[0].oldR.includes(400), 'the removed 7 is crossed out in the step that removes it');
  assert.equal(obj(final, 400).cells[0].v.t, '7', 'the duplicate 7 is the same cached Integer, and is still there');
  assert.deepEqual(garbage(final), []);
});

test('the iterator scenario moves cursor and lastRet and removes the last element seen', () => {
  const sc = buildMemoryScenario('iterator');
  assert.equal(field(sc.steps[5].s, 1000, 'cursor').t, '3');
  assert.equal(field(sc.steps[5].s, 1000, 'lastRet').t, '2');
  const afterRemove = sc.steps[6].s;
  assert.equal(field(afterRemove, 1000, 'lastRet').t, '-1');
  assert.equal(field(afterRemove, 200, 'size').t, '5');
  const arr = obj(afterRemove, 300);
  assert.equal(arr.cells[2].v.r, 700, 'the address of 81 moved into slot 2');
  assert.ok(arr.cells[2].oldR.includes(600), 'the address of the removed 12 is crossed out');
  assert.equal(arr.cells[5].v.t, 'null');
  assert.ok(garbage(afterRemove).includes(600), 'the removed 12 is garbage');
});

test('the Person list shifts left on remove(2) and leaves Mpho Wangu as garbage', () => {
  const last = finalState(buildMemoryScenario('personlist'));
  assert.deepEqual(slots(last, 300).slice(0, 5), [1000, 1200, 1600, 'null', 'null']);
  assert.equal(field(last, 200, 'size').t, '3');
  assert.deepEqual(garbage(last).sort(), [1400, 1500]);
});

test('the LinkedList scenario keeps both directions of every link consistent', () => {
  const last = finalState(buildMemoryScenario('llcourses'));
  assert.equal(field(last, 200, 'first').r, 600);
  assert.equal(field(last, 200, 'last').r, 400);
  assert.equal(field(last, 600, 'next').r, 700);
  assert.equal(field(last, 700, 'prev').r, 600);
  assert.equal(field(last, 700, 'next').r, 400);
  assert.equal(field(last, 400, 'prev').r, 700);
  assert.equal(field(last, 400, 'next').t, 'null');
  assert.equal(obj(last, 400).cells[1].v.r, 410, 'the data of a node is the address of a String');
  assert.deepEqual(garbage(last).sort(), [500, 510]);
});

test('the account scenario changes two objects in a transfer and shares one object through an alias', () => {
  const last = finalState(buildMemoryScenario('account'));
  assert.equal(field(last, 200, 'balance').t, '37263.87');
  assert.equal(field(last, 400, 'balance').t, '1000.00');
  assert.equal(field(last, 200, 'accNumber').t, '99999');
  assert.equal(variable(last, 'third').v.r, 200);
  assert.equal(variable(last, 'first').v.r, 200);
  assert.ok(obj(last, 200).cells.find((c) => c.n === 'balance').old.includes('37763.87'));
});

test('the polymorphism scenario stores different classes in one Shape array', () => {
  const last = finalState(buildMemoryScenario('polymorph'));
  assert.deepEqual(slots(last, 100), [200, 300]);
  assert.equal(obj(last, 200).t, 'Circle');
  assert.equal(obj(last, 300).t, 'Rectangle');
  assert.equal(variable(last, 'a0').v.t, '28.27');
});

test('the array scenarios of Lecture 5 end with the contents the lecture asks for', () => {
  const dry = finalState(buildMemoryScenario('arrdry'));
  assert.deepEqual(slots(dry, 100), ['5', '6', '9', '19', '23', '37']);
  assert.ok(obj(dry, 100).cells[3].old.includes('14'), 'the first value of numbers[3] is crossed out');
  const loop = finalState(buildMemoryScenario('arrloop'));
  assert.deepEqual(slots(loop, 100), ['0', '2', '0', '4', '0', '6', '0', '8', '0', '10', '0', '12', '0', '14']);
  const init = finalState(buildMemoryScenario('arrinit'));
  assert.equal(obj(init, 100).cells[2].v.t, '-7');
  assert.deepEqual(slots(init, 300), [400, 500, 600]);
});

test('a method receives copies of its arguments and its boxes disappear on return', () => {
  const sc = buildMemoryScenario('callcopy');
  const during = sc.steps[4].s;
  assert.equal(variable(during, 'price').v.t, '10.75');
  assert.equal(variable(during, 'total').v.t, '10.0', 'total is not changed by the method');
  const after = finalState(sc);
  assert.ok(!after.vars.some((v) => v.n === 'price'), 'the parameter boxes are gone');
  assert.equal(variable(after, 't').v.t, '0.75');
  assert.equal(variable(after, 'total').v.t, '10.0');
  // the stack box of a finished call is reused: t sits where price was
  const during2 = drawStep(sc, 4).geom.boxes.find((b) => b.id === 'var price').r;
  const after2 = drawStep(sc, sc.steps.length - 1).geom.boxes.find((b) => b.id === 'var t').r;
  assert.equal(after2.y, during2.y);
});

test('the sorting scenarios end with the sorted array', () => {
  const vals = (id) => slots(finalState(buildMemoryScenario(id)), 100);
  assert.deepEqual(vals('bubblesort'), ['18', '29', '63', '72', '85']);
  assert.deepEqual(vals('selectionsort'), ['18', '29', '63', '72', '85']);
  assert.deepEqual(vals('insertionsort'), ['18', '29', '63', '72', '85']);
  assert.deepEqual(vals('mergearrays'), ['13', '20', '36', '54']);
});

test('binary search narrows low and high and ends with a hit or an empty search space', () => {
  const hit = finalState(buildMemoryScenario('binsearch'));
  assert.equal(variable(hit, 'mid').v.t, '1');
  assert.equal(variable(hit, 'high').v.t, '3');
  const miss = finalState(buildMemoryScenario('binmiss'));
  assert.equal(variable(miss, 'low').v.t, '4');
  assert.equal(variable(miss, 'high').v.t, '3', 'low > high ends the loop');
});

test('merge copies the halves into separate left and right arrays', () => {
  const last = finalState(buildMemoryScenario('mergearrays'));
  assert.deepEqual(slots(last, 200), ['20', '36']);
  assert.deepEqual(slots(last, 300), ['13', '54']);
});

test('an unknown scenario is an error, not an empty picture', () => {
  assert.throws(() => buildMemoryScenario('nope'), /unknown scenario/);
});
