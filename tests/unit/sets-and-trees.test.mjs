// The set algebra behind the Venn diagram, the arithmetic behind the probability tree, and the counting calculator.
// Run with: node --no-warnings --experimental-strip-types --test tests/unit/sets-and-trees.test.mjs

import assert from 'node:assert/strict';
import test from 'node:test';
import * as counting from '../../lib/stats/counting.ts';
import { tree } from '../../lib/stats/bayes.ts';
import * as sets from '../../lib/stats/sets.ts';

const close = (actual, expected, tolerance = 1e-12, message) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${message ?? ''} expected ${expected}, got ${actual}`);
const { A, B, C, and, or, not, minus } = sets;
const backslash = String.fromCharCode(92);

/* ───────── sets ───────── */

test('a diagram of two sets has 4 regions and of three sets 8, each with its own key', () => {
  assert.deepEqual(sets.regionMasks(2), [0, 1, 2, 3]);
  assert.deepEqual(sets.regionMasks(3), [0, 1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(sets.regionMasks(2).map((mask) => sets.regionKey(mask, 2)), ['none', 'A', 'B', 'AB']);
  assert.deepEqual(sets.regionMasks(3).map((mask) => sets.regionKey(mask, 3)), ['none', 'A', 'B', 'AB', 'C', 'AC', 'BC', 'ABC']);
  assert.equal(new Set(sets.regionMasks(3).map((mask) => sets.regionLabel(mask, 3))).size, 8);
  assert.deepEqual(sets.regionMasks(2).map((mask) => sets.regionLabel(mask, 2)), ['Neither A nor B', 'A only', 'B only', 'A and B']);
});

test('every region is assigned to a set of memberships', () => {
  const memberships = (mask) => ['A', 'B', 'C'].filter((name) => sets.isMember(mask, name));
  assert.deepEqual(memberships(0), []);
  assert.deepEqual(memberships(1), ['A']);
  assert.deepEqual(memberships(3), ['A', 'B']);
  assert.deepEqual(memberships(5), ['A', 'C']);
  assert.deepEqual(memberships(7), ['A', 'B', 'C']);
});

test('two sets: which regions each expression shades', () => {
  const shaded = (expr) => sets.regionsOf(expr, 2);
  assert.deepEqual(shaded(A), [1, 3]);
  assert.deepEqual(shaded(B), [2, 3]);
  assert.deepEqual(shaded(and(A, B)), [3]);
  assert.deepEqual(shaded(or(A, B)), [1, 2, 3]);
  assert.deepEqual(shaded(not(A)), [0, 2]);
  assert.deepEqual(shaded(not(B)), [0, 1]);
  assert.deepEqual(shaded(minus(A, B)), [1]);
  assert.deepEqual(shaded(minus(B, A)), [2]);
  assert.deepEqual(shaded(not(or(A, B))), [0]);
  assert.deepEqual(shaded(not(and(A, B))), [0, 1, 2]);
  assert.deepEqual(shaded(and(A, not(B))), [1]);
});

test('three sets: which regions each expression shades', () => {
  const shaded = (expr) => sets.regionsOf(expr, 3);
  assert.deepEqual(shaded(and(A, B, C)), [7]);
  assert.deepEqual(shaded(and(A, B, not(C))), [3]);
  assert.deepEqual(shaded(and(A, not(B), not(C))), [1]);
  assert.deepEqual(shaded(or(A, B, C)), [1, 2, 3, 4, 5, 6, 7]);
  assert.deepEqual(shaded(not(or(A, B, C))), [0]);
  assert.deepEqual(shaded(minus(A, B)), [1, 5]);
  assert.deepEqual(shaded(and(A, or(B, C))), [3, 5, 7]);
  assert.deepEqual(shaded(or(and(A, B), C)), [3, 4, 5, 6, 7]);
  // at least two of the three
  assert.deepEqual(shaded(or(and(A, B), and(A, C), and(B, C))), [3, 5, 6, 7]);
  // exactly one of the three
  assert.deepEqual(shaded(or(and(A, not(B), not(C)), and(not(A), B, not(C)), and(not(A), not(B), C))), [1, 2, 4]);
});

test('De Morgan and the distributive laws hold on every region', () => {
  assert.ok(sets.equivalent(not(or(A, B)), and(not(A), not(B)), 2));
  assert.ok(sets.equivalent(not(and(A, B)), or(not(A), not(B)), 2));
  assert.ok(sets.equivalent(not(or(A, B, C)), and(not(A), not(B), not(C)), 3));
  assert.ok(sets.equivalent(and(A, or(B, C)), or(and(A, B), and(A, C)), 3));
  assert.ok(sets.equivalent(or(A, and(B, C)), and(or(A, B), or(A, C)), 3));
  assert.ok(sets.equivalent(minus(A, B), and(A, not(B)), 2));
  assert.ok(sets.equivalent(not(not(A)), A, 2));
  assert.ok(!sets.equivalent(or(A, B), and(A, B), 2));
  assert.ok(!sets.equivalent(not(and(A, B)), and(not(A), not(B)), 2));
});

test('the count of an expression is the sum of the counts of its regions', () => {
  // masks: 0 neither, 1 A only, 2 B only, 3 both
  const counts = [15, 12, 8, 5];
  assert.equal(sets.totalOf(counts), 40);
  assert.equal(sets.countOf(A, counts), 17);
  assert.equal(sets.countOf(B, counts), 13);
  assert.equal(sets.countOf(and(A, B), counts), 5);
  assert.equal(sets.countOf(or(A, B), counts), 25);
  assert.equal(sets.countOf(not(or(A, B)), counts), 15);
  assert.equal(sets.countOf(minus(A, B), counts), 12);
  assert.equal(sets.setSize('A', counts), 17);
  assert.equal(sets.probabilityOf(or(A, B), counts), 25 / 40);
  assert.equal(sets.probabilityOf(A, [0, 0, 0, 0]), null);
});

test('inclusion and exclusion, the complement rule and De Morgan hold for any counts', () => {
  for (const counts of [[3, 9, 4, 6], [0, 0, 7, 2], [100, 1, 1, 1], [5, 5, 5, 5]]) {
    const total = sets.totalOf(counts);
    assert.equal(sets.countOf(or(A, B), counts), sets.countOf(A, counts) + sets.countOf(B, counts) - sets.countOf(and(A, B), counts));
    assert.equal(sets.countOf(not(A), counts), total - sets.countOf(A, counts));
    assert.equal(sets.countOf(not(or(A, B)), counts), sets.countOf(and(not(A), not(B)), counts));
    assert.equal(sets.countOf(minus(A, B), counts), sets.countOf(A, counts) - sets.countOf(and(A, B), counts));
  }
  for (const counts of [[12, 10, 8, 4, 6, 3, 5, 2], [1, 2, 3, 4, 5, 6, 7, 8]]) {
    const n = (expr) => sets.countOf(expr, counts);
    assert.equal(n(or(A, B, C)), n(A) + n(B) + n(C) - n(and(A, B)) - n(and(A, C)) - n(and(B, C)) + n(and(A, B, C)));
    assert.equal(n(not(or(A, B, C))), sets.totalOf(counts) - n(or(A, B, C)));
  }
});

test('the starting counts cover every region and can be overridden by key', () => {
  assert.equal(sets.defaultCounts(2).length, 4);
  assert.equal(sets.defaultCounts(3).length, 8);
  assert.ok(sets.defaultCounts(3).every((count) => Number.isInteger(count) && count >= 0));
  const changed = sets.countsFromStart(2, { AB: 20, bogus: 3, A: -4 });
  assert.equal(changed[3], 20);
  assert.equal(changed[1], sets.defaultCounts(2)[1]);
  assert.deepEqual(sets.countsFromStart(3), sets.defaultCounts(3));
});

test('an expression is written in words, in symbols and in LaTeX', () => {
  const sample = [A, and(A, B), not(A), minus(A, B), not(or(A, B)), and(A, B, not(C)), and(A, or(B, C)), or(and(A, B), C)];
  assert.deepEqual(sample.map((expr) => sets.describe(expr)), [
    'A', 'A and B', 'not A', 'A minus B', 'not (A or B)', 'A and B and not C', 'A and (B or C)', '(A and B) or C',
  ]);
  assert.deepEqual(sample.map((expr) => sets.symbols(expr)), [
    'A', 'A ∩ B', 'A′', 'A − B', '(A ∪ B)′', 'A ∩ B ∩ C′', 'A ∩ (B ∪ C)', '(A ∩ B) ∪ C',
  ]);
  assert.equal(sets.latex(not(or(A, B))), `${backslash}overline{A ${backslash}cup B}`);
  assert.equal(sets.latex(and(A, not(B))), `A ${backslash}cap ${backslash}overline{B}`);
  assert.equal(sets.latex(not(or(A, B)), 'c'), `(A ${backslash}cup B)^{c}`);
  assert.equal(sets.latex(and(A, not(B)), 'prime'), `A ${backslash}cap B'`);
  assert.equal(sets.latex(minus(A, B)), 'A - B');
});

test('the menu offers the usual expressions, each with a unique id, and an id finds its expression', () => {
  for (const count of [2, 3]) {
    const list = sets.expressionsFor(count);
    assert.equal(new Set(list.map((entry) => entry.id)).size, list.length);
    assert.ok(list.length >= 12);
    for (const entry of list) assert.deepEqual(sets.findExpression(count, entry.id), entry);
  }
  const two = sets.expressionsFor(2).map((entry) => entry.id);
  for (const id of ['A', 'B', 'A and B', 'A or B', 'not A', 'not B', 'A minus B', 'not (A or B)']) assert.ok(two.includes(id), id);
  const three = sets.expressionsFor(3).map((entry) => entry.id);
  for (const id of ['A and B and C', 'A and B and not C', 'A or B or C', 'not (A or B or C)']) assert.ok(three.includes(id), id);
  // The lessons compare the two sides of the distributive law and of De Morgan's law, so both sides are on the menu.
  const side = (id) => sets.findExpression(3, id).expr;
  assert.ok(sets.equivalent(side('A and (B or C)'), side('(A and B) or (A and C)'), 3));
  assert.ok(sets.equivalent(side('not (A or B or C)'), side('not A and not B and not C'), 3));
  assert.equal(sets.findExpression(2, 'not (a or b)').id, 'not (A or B)');
  assert.equal(sets.findExpression(2, 'nonsense').id, 'A and B');
  assert.equal(sets.findExpression(3, undefined).id, 'A and B');
  // Every expression on the menu stays inside the regions of its own diagram.
  for (const count of [2, 3]) {
    for (const entry of sets.expressionsFor(count)) assert.ok(sets.regionsOf(entry.expr, count).every((mask) => mask < 1 << count));
  }
});

/* ───────── the probability tree ───────── */

test('the classic case: P(A) = 0.01, P(B|A) = 0.95, P(B|not A) = 0.1 gives P(A|B) = 0.0876', () => {
  const result = tree({ a: 0.01, bGivenA: 0.95, bGivenNotA: 0.1 });
  close(result.aAndB, 0.0095);
  close(result.aAndNotB, 0.0005);
  close(result.notAAndB, 0.099);
  close(result.notAAndNotB, 0.891);
  close(result.b, 0.1085);
  close(result.aGivenB, 0.0095 / 0.1085);
  assert.equal(Math.round(result.aGivenB * 10000) / 10000, 0.0876);
  close(result.notAGivenB, 1 - result.aGivenB);
  close(result.aGivenNotB, 0.0005 / 0.8915);
});

test('the four joint probabilities add up to 1, and P(B) and P(not B) add up to 1', () => {
  for (const input of [{ a: 0.3, bGivenA: 0.8, bGivenNotA: 0.2 }, { a: 0, bGivenA: 0.5, bGivenNotA: 0.5 }, { a: 1, bGivenA: 0.1, bGivenNotA: 0.9 }, { a: 0.5, bGivenA: 1, bGivenNotA: 0 }]) {
    const t = tree(input);
    close(t.aAndB + t.aAndNotB + t.notAAndB + t.notAAndNotB, 1);
    close(t.b + t.notB, 1);
    close(t.notA, 1 - input.a);
    close(t.aAndB + t.aAndNotB, input.a);
  }
});

test('the law of total probability and Bayes agree with the multiplication rule', () => {
  const t = tree({ a: 0.3, bGivenA: 0.8, bGivenNotA: 0.2 });
  close(t.b, 0.8 * 0.3 + 0.2 * 0.7);
  close(t.aGivenB * t.b, t.aAndB);
  // An independent case: when B is no more likely given A, learning B changes nothing.
  const independent = tree({ a: 0.4, bGivenA: 0.25, bGivenNotA: 0.25 });
  close(independent.aGivenB, 0.4);
  close(independent.aGivenNotB, 0.4);
});

test('P(A | B) has no answer when P(B) is 0, and the inputs are kept between 0 and 1', () => {
  const impossible = tree({ a: 0.5, bGivenA: 0, bGivenNotA: 0 });
  assert.equal(impossible.b, 0);
  assert.equal(impossible.aGivenB, null);
  assert.equal(impossible.notAGivenB, null);
  const clamped = tree({ a: 1.5, bGivenA: -2, bGivenNotA: Number.NaN });
  assert.equal(clamped.notA, 0);
  assert.equal(clamped.aAndB, 0);
  assert.equal(clamped.aGivenNotB, 1);
});

/* ───────── the counting calculator ───────── */

test('factorials are exact beyond the range of a double', () => {
  assert.equal(counting.factorial(0), 1n);
  assert.equal(counting.factorial(5), 120n);
  assert.equal(counting.factorial(20), 2432902008176640000n);
  assert.equal(counting.factorial(30), 265252859812191058636308480000000n);
});

test('permutations nPr', () => {
  assert.equal(counting.permutations(5, 3), 60n);
  assert.equal(counting.permutations(10, 0), 1n);
  assert.equal(counting.permutations(10, 10), counting.factorial(10));
  assert.equal(counting.permutations(52, 5), 311875200n);
  assert.equal(counting.permutations(5, 6), 0n);
  assert.equal(counting.permutations(30, 30), counting.factorial(30));
});

test('combinations nCr, including C(52, 5) = 2598960', () => {
  assert.equal(counting.combinations(52, 5), 2598960n);
  assert.equal(counting.combinations(10, 3), 120n);
  assert.equal(counting.combinations(5, 0), 1n);
  assert.equal(counting.combinations(5, 5), 1n);
  assert.equal(counting.combinations(5, 6), 0n);
  assert.equal(counting.combinations(30, 15), 155117520n);
  assert.equal(counting.combinations(60, 30), 118264581564861424n);
});

test('combinations obey symmetry, Pascal\'s rule, the row sum and nCr = nPr / r!', () => {
  for (let n = 0; n <= 30; n += 1) {
    let row = 0n;
    for (let r = 0; r <= n; r += 1) {
      assert.equal(counting.combinations(n, r), counting.combinations(n, n - r), `C(${n},${r})`);
      if (n > 0 && r > 0 && r < n) assert.equal(counting.combinations(n, r), counting.combinations(n - 1, r - 1) + counting.combinations(n - 1, r), `Pascal ${n},${r}`);
      assert.equal(counting.permutations(n, r), counting.combinations(n, r) * counting.factorial(r), `P(${n},${r})`);
      row += counting.combinations(n, r);
    }
    assert.equal(row, 2n ** BigInt(n), `row ${n}`);
  }
});

test('with repetition: n^r arrangements and C(n + r - 1, r) selections', () => {
  assert.equal(counting.arrangementsWithRepetition(6, 3), 216n);
  assert.equal(counting.arrangementsWithRepetition(2, 10), 1024n);
  assert.equal(counting.arrangementsWithRepetition(7, 0), 1n);
  assert.equal(counting.arrangementsWithRepetition(30, 30), 30n ** 30n);
  assert.equal(counting.selectionsWithRepetition(5, 3), 35n);
  assert.equal(counting.selectionsWithRepetition(3, 2), 6n);
  assert.equal(counting.selectionsWithRepetition(1, 9), 1n);
  assert.equal(counting.selectionsWithRepetition(4, 0), 1n);
  assert.equal(counting.selectionsWithRepetition(52, 5), counting.combinations(56, 5));
});

test('count picks the formula from the two choices', () => {
  assert.equal(counting.count(52, 5, true, false), 311875200n);
  assert.equal(counting.count(52, 5, false, false), 2598960n);
  assert.equal(counting.count(10, 3, true, true), 1000n);
  assert.equal(counting.count(10, 3, false, true), 220n);
  assert.equal(counting.count(3, 5, false, false), 0n);
  assert.ok(counting.count(3, 5, true, true) === 243n);
});

test('digits are grouped by hand', () => {
  assert.equal(counting.groupDigits(0n), '0');
  assert.equal(counting.groupDigits(999n), '999');
  assert.equal(counting.groupDigits(1000n), '1,000');
  assert.equal(counting.groupDigits(2598960n), '2,598,960');
  assert.equal(counting.groupDigits(2598960n, '{,}'), '2{,}598{,}960');
});

test('the working names the formula and ends in the answer', () => {
  const deck = counting.explain(52, 5, false, false);
  assert.equal(deck.value, 2598960n);
  assert.ok(deck.working.endsWith('2{,}598{,}960'), deck.working);
  assert.ok(deck.working.includes(`${backslash}dfrac{52!}{5!${backslash},47!}`), deck.working);
  assert.ok(deck.working.includes(`${backslash}dfrac{52${backslash}times 51${backslash}times 50${backslash}times 49${backslash}times 48}{5${backslash}times 4${backslash}times 3${backslash}times 2${backslash}times 1}`), deck.working);
  assert.ok(deck.working.includes(`52${backslash}times 51${backslash}times 50${backslash}times 49${backslash}times 48`), deck.working);
  assert.ok(deck.formula.includes('binom'));
  const arrangement = counting.explain(5, 3, true, false);
  assert.equal(arrangement.working, `P(5,3)=${backslash}dfrac{5!}{2!}=5${backslash}times 4${backslash}times 3=60`);
  const repeated = counting.explain(10, 3, true, true);
  assert.equal(repeated.working, `10^{3}=10${backslash}times 10${backslash}times 10=1{,}000`);
  const multiset = counting.explain(5, 3, false, true);
  assert.equal(multiset.working, `C(5+3-1,${backslash},3)=${backslash}dbinom{7}{3}=35`);
  const none = counting.explain(3, 5, true, false);
  assert.equal(none.value, 0n);
  assert.ok(none.note);
  assert.equal(counting.explain(5, 1, true, false).working, `P(5,1)=${backslash}dfrac{5!}{4!}=5`);
  assert.equal(counting.explain(9, 0, true, true).working, '9^{0}=1');
  // A long product is shortened, and the answer is still exact.
  const long = counting.explain(30, 12, true, false);
  assert.ok(long.working.includes(`${backslash}cdots`), long.working);
  assert.equal(long.value, counting.permutations(30, 12));
});
