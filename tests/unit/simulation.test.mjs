// The seeded generator and the experiments behind the Simulation component: the same seed gives the same run, the
// counts add up, and the theoretical probabilities are right.
// Run with: node --no-warnings --experimental-strip-types --test tests/unit/simulation.test.mjs

import assert from 'node:assert/strict';
import fs from 'node:fs';
import * as nodeModule from 'node:module';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

// The source files import each other without a file extension, as the bundler allows. Node needs the extension, so
// resolve those imports to the .ts files here instead of changing the source.
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

const random = await import('../../lib/stats/random.ts');
const sim = await import('../../lib/stats/simulate.ts');
const { binomial, exponential, geometric } = await import('../../lib/stats/distributions.ts');

const { createRng, nextInt, nextFloat, nextBernoulli, nextExponential, drawFrom, toSeed } = random;
const { emptyRun, extendRun, rows, measures, outcomes, cltBins, cltTheory, conditionalTheory, diceSumProbability, MAX_TRIALS, POINTS_KEPT } = sim;

const close = (actual, expected, tolerance = 1e-9, message) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${message ?? ''} expected ${expected}, got ${actual}`);
const total = (list) => list.reduce((sum, value) => sum + value, 0);
const sequence = (rng, length) => Array.from({ length }, () => rng.next());

/** A generator that returns a fixed list of numbers, then repeats it. */
const fixed = (values) => {
  let i = 0;
  return { next: () => values[i++ % values.length] };
};

/* ───────── the generator ───────── */

test('the same seed gives the same sequence, and a different seed gives a different one', () => {
  assert.deepEqual(sequence(createRng(42), 50), sequence(createRng(42), 50));
  assert.notDeepEqual(sequence(createRng(42), 50), sequence(createRng(43), 50));
});

test('mulberry32 with seed 1 starts with its known values', () => {
  const [first, second] = sequence(createRng(1), 2);
  close(first, 0.6270739405881613, 1e-15);
  close(second, 0.002735721180215478, 1e-15);
});

test('every float is in [0, 1) and the mean of many is about one half', () => {
  const values = sequence(createRng(7), 20000);
  assert.ok(values.every((value) => value >= 0 && value < 1));
  close(total(values) / values.length, 0.5, 0.01);
});

test('nextInt stays in its range, reaches both ends, and is roughly uniform', () => {
  const rng = createRng(3);
  const counts = new Array(6).fill(0);
  for (let i = 0; i < 6000; i += 1) {
    const value = nextInt(rng, 1, 6);
    assert.ok(Number.isInteger(value) && value >= 1 && value <= 6);
    counts[value - 1] += 1;
  }
  assert.ok(counts.every((count) => count > 850 && count < 1150), String(counts));
  assert.equal(nextInt(createRng(1), 5, 5), 5);
  assert.equal(nextFloat(fixed([0.25])), 0.25);
  assert.equal(nextBernoulli(fixed([0.3]), 0.5), true);
  assert.equal(nextBernoulli(fixed([0.7]), 0.5), false);
});

test('seeds are turned into whole numbers', () => {
  assert.equal(toSeed(12.9), 12);
  assert.equal(toSeed(-5), 5);
  assert.equal(toSeed(Number.NaN), 0);
  assert.deepEqual(sequence(createRng(12.9), 5), sequence(createRng(12), 5));
});

test('draws from a distribution follow its mean', () => {
  const rng = createRng(11);
  const mean = (distribution, n) => total(Array.from({ length: n }, () => drawFrom(rng, distribution))) / n;
  close(mean(binomial(10, 0.3), 5000), 3, 0.1);
  close(mean(geometric(0.25, 'trials'), 5000), 4, 0.2);
  close(mean(exponential(2), 5000), 0.5, 0.03);
  close(total(Array.from({ length: 5000 }, () => nextExponential(rng, 2))) / 5000, 0.5, 0.03);
});

test('a draw from a discrete distribution inverts its cdf', () => {
  const coin = binomial(1, 0.5);
  assert.equal(drawFrom(fixed([0.1]), coin), 0);
  assert.equal(drawFrom(fixed([0.9]), coin), 1);
});

/* ───────── the experiments ───────── */

const everySetting = [
  { kind: 'coins', coins: 4 },
  { kind: 'dice' },
  { kind: 'binomial', n: 12, p: 0.3 },
  { kind: 'lln', source: 'coin' },
  { kind: 'lln', source: 'die' },
  { kind: 'clt', sampleSize: 5 },
  { kind: 'pi' },
  { kind: 'conditional', threshold: 8 },
];

test('an empty run has no trials and no counts, so a page can render it before anything is drawn', () => {
  for (const settings of everySetting) {
    const run = emptyRun(settings);
    assert.equal(run.trials, 0);
    assert.ok(run.counts.every((count) => count === 0));
    assert.equal(run.series.length, 0);
    assert.equal(run.points.length, 0);
    for (const row of rows(run, settings)) assert.ok(row.observed === null || row.count === 0);
  }
});

test('the same seed gives the same run, however the trials are grouped', () => {
  for (const settings of everySetting) {
    const once = extendRun(emptyRun(settings), settings, createRng(5), 100);
    const rng = createRng(5);
    let split = emptyRun(settings);
    for (const steps of [1, 10, 29, 60]) split = extendRun(split, settings, rng, steps);
    assert.deepEqual(split, once, settings.kind);
    const again = extendRun(emptyRun(settings), settings, createRng(5), 100);
    assert.deepEqual(again, once, settings.kind);
  }
});

test('extending a run does not change the run it started from', () => {
  const settings = { kind: 'dice' };
  const start = emptyRun(settings);
  extendRun(start, settings, createRng(1), 50);
  assert.equal(start.trials, 0);
  assert.ok(start.counts.every((count) => count === 0));
});

test('the counts of every histogram experiment add up to the number of trials', () => {
  for (const settings of everySetting.filter((s) => ['coins', 'dice', 'binomial', 'clt', 'pi'].includes(s.kind))) {
    const run = extendRun(emptyRun(settings), settings, createRng(9), 1000);
    assert.equal(run.trials, 1000, settings.kind);
    assert.equal(total(run.counts), 1000, settings.kind);
    close(total(rows(run, settings).map((row) => row.observed)), 1, 1e-12, settings.kind);
    close(total(rows(run, settings).map((row) => row.theory)), 1, 1e-9, settings.kind);
  }
});

test('the theoretical probabilities of each experiment add up to 1', () => {
  for (const settings of everySetting.filter((s) => ['coins', 'dice', 'binomial', 'clt', 'pi'].includes(s.kind))) {
    close(total(outcomes(settings).map((outcome) => outcome.theory)), 1, 1e-9, settings.kind);
  }
  for (const sampleSize of [1, 2, 5, 10, 30, 50]) close(total(cltTheory(sampleSize)), 1, 1e-12, `clt ${sampleSize}`);
});

test('coins: the theory is the binomial with p = 1/2', () => {
  const list = outcomes({ kind: 'coins', coins: 4 });
  [1, 4, 6, 4, 1].forEach((ways, k) => close(list[k].theory, ways / 16, 1e-12, `${k} heads`));
  assert.deepEqual(list.map((outcome) => outcome.label), ['0 heads', '1 head', '2 heads', '3 heads', '4 heads']);
});

test('coins: the mean number of heads of 4000 runs is close to half the coins', () => {
  const settings = { kind: 'coins', coins: 6 };
  const run = extendRun(emptyRun(settings), settings, createRng(2), 4000);
  const [measure] = measures(run, settings);
  assert.equal(measure.theory, 3);
  close(measure.observed, 3, 0.1);
  assert.equal(run.counts.length, 7);
});

test('dice: the theory is 1/36 to 6/36 to 1/36 and the mean sum is 7', () => {
  const list = outcomes({ kind: 'dice' });
  assert.equal(list.length, 11);
  assert.deepEqual(list.map((outcome) => outcome.theory * 36), [1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 1]);
  assert.equal(diceSumProbability(7), 6 / 36);
  assert.equal(diceSumProbability(1), 0);
  assert.equal(diceSumProbability(13), 0);
  const settings = { kind: 'dice' };
  const run = extendRun(emptyRun(settings), settings, createRng(4), 5000);
  close(measures(run, settings)[0].observed, 7, 0.15);
  assert.equal(run.counts[0] + run.counts[10] < run.counts[5], true);
});

test('dice: a fixed generator gives a known tally', () => {
  // 0.0 is a one and 0.99 is a six, so these four draws roll (1,1) then (6,6).
  const settings = { kind: 'dice' };
  const run = extendRun(emptyRun(settings), settings, fixed([0, 0, 0.99, 0.99]), 2);
  assert.equal(run.counts[0], 1);
  assert.equal(run.counts[10], 1);
  assert.equal(total(run.counts), 2);
});

test('binomial: counts successes, and the mean is np', () => {
  const settings = { kind: 'binomial', n: 20, p: 0.25 };
  const list = outcomes(settings);
  assert.equal(list.length, 21);
  close(list[5].theory, binomial(20, 0.25).pmf(5));
  const run = extendRun(emptyRun(settings), settings, createRng(6), 3000);
  const [measure] = measures(run, settings);
  assert.equal(measure.theory, 5);
  close(measure.observed, 5, 0.15);
});

test('law of large numbers: the running frequency of heads settles near 1/2', () => {
  const settings = { kind: 'lln', source: 'coin' };
  const run = extendRun(emptyRun(settings), settings, createRng(8), 10000);
  assert.equal(run.series.length, 10000);
  assert.equal(run.trials, 10000);
  assert.equal(run.sum, Math.round(run.series[9999] * 10000));
  close(run.series[9999], 0.5, 0.02);
  const checkpoints = rows(run, settings);
  assert.deepEqual(checkpoints.map((row) => row.short), ['1', '10', '100', '1000', '10000']);
  assert.ok(checkpoints.every((row) => row.theory === 0.5));
  close(checkpoints[4].observed, run.series[9999]);
  assert.equal(checkpoints[4].count, run.sum);
});

test('law of large numbers: the running mean of a die settles near 3.5', () => {
  const settings = { kind: 'lln', source: 'die' };
  const run = extendRun(emptyRun(settings), settings, createRng(8), 10000);
  close(run.series[9999], 3.5, 0.1);
  assert.equal(measures(run, settings)[0].theory, 3.5);
  assert.ok(run.series.every((mean) => mean >= 1 && mean <= 6));
});

test('central limit theorem: the sample means centre on 1 with spread 1 over the root of the sample size', () => {
  for (const sampleSize of [1, 4, 25]) {
    const settings = { kind: 'clt', sampleSize };
    const run = extendRun(emptyRun(settings), settings, createRng(10), 4000);
    const [centre, spread] = measures(run, settings);
    close(centre.observed, 1, 0.1, `mean, n = ${sampleSize}`);
    close(spread.theory, 1 / Math.sqrt(sampleSize));
    close(spread.observed, spread.theory, 0.12 * spread.theory + 0.02, `spread, n = ${sampleSize}`);
  }
});

test('central limit theorem: the bars are 20 in number, cover the window, and the normal curve fits better as n grows', () => {
  for (const sampleSize of [1, 5, 50]) {
    const { start, width, count } = cltBins(sampleSize);
    assert.equal(count, 20);
    assert.ok(start >= 0 && width > 0);
    const sd = 1 / Math.sqrt(sampleSize);
    assert.ok(start <= Math.max(0, 1 - 2.5 * sd) + 1e-9, `starts early enough, n = ${sampleSize}`);
    assert.ok(start + count * width >= 1 + 3 * sd, `ends late enough, n = ${sampleSize}`);
  }
  // The distance between the histogram and the normal curve (half the sum of the absolute differences) shrinks.
  const gap = (sampleSize) => {
    const settings = { kind: 'clt', sampleSize };
    const run = extendRun(emptyRun(settings), settings, createRng(10), 20000);
    return total(rows(run, settings).map((row) => Math.abs(row.observed - row.theory))) / 2;
  };
  assert.ok(gap(30) < gap(1), `${gap(30)} < ${gap(1)}`);
});

test('pi: a point is inside when x squared plus y squared is at most 1', () => {
  const settings = { kind: 'pi' };
  const run = extendRun(emptyRun(settings), settings, fixed([0.1, 0.1, 0.9, 0.9, 0.6, 0.8]), 3);
  assert.deepEqual(run.counts, [2, 1]);
  assert.deepEqual(run.points.map((point) => point[2]), [true, false, true]);
});

test('pi: the estimate of pi from 20000 points is close to pi, and the picture keeps only the latest points', () => {
  const settings = { kind: 'pi' };
  let run = emptyRun(settings);
  const rng = createRng(12);
  for (let i = 0; i < 20; i += 1) run = extendRun(run, settings, rng, 1000);
  assert.equal(run.trials, 20000);
  assert.equal(run.points.length, POINTS_KEPT);
  close(measures(run, settings)[0].observed, Math.PI, 0.05);
  assert.equal(rows(run, settings)[0].theory, Math.PI / 4);
  assert.equal(total(run.counts), 20000);
});

test('conditional probability: two dice, B is a sum of at least 8, A is a six on the first die', () => {
  const eight = conditionalTheory(8);
  assert.equal(eight.b, 15 / 36);
  assert.equal(eight.ab, 5 / 36);
  close(eight.aGivenB, 1 / 3);
  close(eight.ab / eight.b, eight.aGivenB);
  assert.equal(conditionalTheory(2).b, 1);
  close(conditionalTheory(2).aGivenB, 1 / 6);
  assert.equal(conditionalTheory(12).b, 1 / 36);
  assert.equal(conditionalTheory(12).aGivenB, 1);
  const settings = { kind: 'conditional', threshold: 8 };
  const run = extendRun(emptyRun(settings), settings, createRng(13), 6000);
  assert.ok(run.counts[1] <= run.counts[0] && run.counts[0] <= run.trials);
  const [b, ab, aGivenB] = rows(run, settings);
  close(b.observed, 15 / 36, 0.03);
  close(ab.observed, 5 / 36, 0.02);
  close(aGivenB.observed, 1 / 3, 0.04);
  close(aGivenB.observed, ab.count / b.count);
  close(measures(run, settings)[0].observed, aGivenB.observed);
});

test('a fixed generator gives a known conditional tally', () => {
  // Rolls (6,2) sum 8 with a six first, (3,5) sum 8 without, (1,1) sum 2.
  const settings = { kind: 'conditional', threshold: 8 };
  const run = extendRun(emptyRun(settings), settings, fixed([0.99, 0.2, 0.4, 0.7, 0, 0]), 3);
  assert.deepEqual(run.counts, [2, 1]);
});

test('a run stops at the limit and ignores further requests', () => {
  const settings = { kind: 'coins', coins: 3 };
  const rng = createRng(1);
  let run = emptyRun(settings);
  for (let i = 0; i < 25; i += 1) run = extendRun(run, settings, rng, 1000);
  assert.equal(run.trials, MAX_TRIALS);
  assert.equal(total(run.counts), MAX_TRIALS);
  const state = rng.next();
  const again = extendRun(run, settings, createRng(1), 1000);
  assert.equal(again.trials, MAX_TRIALS);
  assert.ok(typeof state === 'number');
});
