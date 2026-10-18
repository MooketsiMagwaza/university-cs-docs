/**
 * The experiments behind components/interactive/simulation.tsx, as pure functions. Each one takes a seeded generator
 * (lib/stats/random.ts), so the same seed gives the same run, and each has its theoretical probabilities beside it so
 * the page can draw the two together. tests/unit/simulation.test.mjs checks the counts and the theory.
 *
 * A "run" is everything the page needs to draw so far: how many trials, how many times each outcome came up, and a few
 * running totals. extendRun adds trials to a run and returns a new one; it never touches a generator unless it is
 * called, which is why the page can start from an empty run and stay identical on the server and in the browser.
 */

import { binomial, standardNormalCdf } from './distributions';
import { nextBernoulli, nextExponential, nextInt, type Rng } from './random';

/** The most trials one run keeps, so a page stays quick. The reader presses Reset to start again. */
export const MAX_TRIALS = 20000;
/** The most recent random points the pi picture keeps (the counts keep every point). */
export const POINTS_KEPT = 1500;
/** The central limit histogram always has this many bars. */
export const CLT_BINS = 20;

export type Settings =
  | { kind: 'coins'; coins: number }
  | { kind: 'dice' }
  | { kind: 'binomial'; n: number; p: number }
  | { kind: 'lln'; source: 'coin' | 'die' }
  | { kind: 'clt'; sampleSize: number }
  | { kind: 'pi' }
  | { kind: 'conditional'; threshold: number };

/** A random point in the unit square, and whether it fell inside the quarter circle x^2 + y^2 <= 1. */
export type Point = [x: number, y: number, inside: boolean];

export type Run = {
  trials: number;
  /**
   * coins, dice, binomial, clt: how many trials gave each outcome (see `outcomes`).
   * pi: [inside, outside]. conditional: [trials where B happened, trials where A and B happened].
   */
  counts: number[];
  /** lln and clt: the total of the values drawn, and of their squares. */
  sum: number;
  sumSquares: number;
  /** lln: the running mean after each trial. */
  series: number[];
  /** pi: the most recent points. */
  points: Point[];
};

/* ───────── one trial of each experiment ───────── */

/** The number of successes in n independent trials that each succeed with probability p. */
export function countSuccesses(rng: Rng, n: number, p: number): number {
  let successes = 0;
  for (let i = 0; i < n; i += 1) if (nextBernoulli(rng, p)) successes += 1;
  return successes;
}

/** The number of heads when `coins` fair coins are flipped. */
export function flipCoins(rng: Rng, coins: number): number {
  return countSuccesses(rng, coins, 0.5);
}

/** One fair die: 1 to 6. */
export function rollDie(rng: Rng): number {
  return nextInt(rng, 1, 6);
}

/** The sum of two fair dice: 2 to 12. */
export function rollTwoDice(rng: Rng): number {
  const first = rollDie(rng);
  return first + rollDie(rng);
}

/** The mean of `size` draws from the exponential distribution with rate 1 (mean 1, standard deviation 1: a skewed source). */
export function sampleMean(rng: Rng, size: number): number {
  let total = 0;
  for (let i = 0; i < size; i += 1) total += nextExponential(rng, 1);
  return total / size;
}

/** A random point in the unit square. */
export function randomPoint(rng: Rng): Point {
  const x = rng.next();
  const y = rng.next();
  return [x, y, x * x + y * y <= 1];
}

/* ───────── the theory ───────── */

/** P(the sum of two dice is `sum`). */
export function diceSumProbability(sum: number): number {
  return sum < 2 || sum > 12 ? 0 : (6 - Math.abs(sum - 7)) / 36;
}

/**
 * Two dice, B = "the sum is at least `threshold`", A = "the first die shows a 6". Counted over the 36 equally likely
 * pairs, so the probabilities are exact fractions.
 */
export function conditionalTheory(threshold: number): { b: number; ab: number; aGivenB: number | null } {
  let b = 0;
  let ab = 0;
  for (let first = 1; first <= 6; first += 1) {
    for (let second = 1; second <= 6; second += 1) {
      if (first + second >= threshold) {
        b += 1;
        if (first === 6) ab += 1;
      }
    }
  }
  return { b: b / 36, ab: ab / 36, aGivenB: b > 0 ? ab / b : null };
}

/** P(a random point of the unit square falls inside the quarter circle) = pi / 4. */
export const insideQuarterCircle = Math.PI / 4;

/** The histogram of sample means: the first edge, the width of a bar, and how many bars. The window follows the sample size. */
export function cltBins(sampleSize: number): { start: number; width: number; count: number } {
  const sd = 1 / Math.sqrt(sampleSize);
  const lo = Math.max(0, 1 - 3.5 * sd);
  const hi = 1 + 5 * sd;
  const raw = (hi - lo) / CLT_BINS;
  const widths = [0.01, 0.02, 0.025, 0.05, 0.1, 0.2, 0.25, 0.5, 1];
  let width = widths[0];
  for (const candidate of widths) {
    if (Math.abs(Math.log(candidate / raw)) < Math.abs(Math.log(width / raw))) width = candidate;
  }
  const start = Math.round(Math.floor(lo / width + 1e-9) * width * 10000) / 10000;
  return { start, width, count: CLT_BINS };
}

/**
 * What the central limit theorem predicts for each bar: the probability that a Normal(1, 1/sampleSize) variable lands
 * in it. The first and last bars take the tails, so the list adds up to 1.
 */
export function cltTheory(sampleSize: number): number[] {
  const { start, width, count } = cltBins(sampleSize);
  const sd = 1 / Math.sqrt(sampleSize);
  const cdf = (x: number) => standardNormalCdf((x - 1) / sd);
  return Array.from({ length: count }, (_, i) => {
    const below = i === 0 ? 0 : cdf(start + i * width);
    const above = i === count - 1 ? 1 : cdf(start + (i + 1) * width);
    return above - below;
  });
}

/* ───────── what the page draws and lists ───────── */

export type Outcome = {
  /** The row label in the table. */
  label: string;
  /** The short label under a bar. */
  short: string;
  /** The theoretical probability. */
  theory: number;
};

const trim = (value: number) => String(Number(value.toFixed(4)));

/** The outcomes of an experiment, each with its theoretical probability. Empty for the law of large numbers, which draws a line instead. */
export function outcomes(settings: Settings): Outcome[] {
  switch (settings.kind) {
    case 'coins': {
      const model = binomial(settings.coins, 0.5);
      return Array.from({ length: settings.coins + 1 }, (_, k) => ({ label: `${k} ${k === 1 ? 'head' : 'heads'}`, short: String(k), theory: model.pmf(k) }));
    }
    case 'dice':
      return Array.from({ length: 11 }, (_, i) => ({ label: `Sum ${i + 2}`, short: String(i + 2), theory: diceSumProbability(i + 2) }));
    case 'binomial': {
      const model = binomial(settings.n, settings.p);
      return Array.from({ length: settings.n + 1 }, (_, k) => ({ label: `${k} ${k === 1 ? 'success' : 'successes'}`, short: String(k), theory: model.pmf(k) }));
    }
    case 'clt': {
      const { start, width, count } = cltBins(settings.sampleSize);
      const theory = cltTheory(settings.sampleSize);
      return theory.map((probability, i) => {
        const lo = start + i * width;
        const hi = lo + width;
        const label = i === 0 ? `Below ${trim(hi)}` : i === count - 1 ? `${trim(lo)} or more` : `${trim(lo)} to ${trim(hi)}`;
        return { label, short: trim(lo + width / 2), theory: probability };
      });
    }
    case 'pi':
      return [
        { label: 'Inside the quarter circle', short: 'inside', theory: insideQuarterCircle },
        { label: 'Outside it', short: 'outside', theory: 1 - insideQuarterCircle },
      ];
    default:
      return [];
  }
}

/** A run with no trials yet. This is what the page shows when it first renders. */
export function emptyRun(settings: Settings): Run {
  const length = settings.kind === 'pi' || settings.kind === 'conditional' ? 2 : outcomes(settings).length;
  return { trials: 0, counts: new Array<number>(length).fill(0), sum: 0, sumSquares: 0, series: [], points: [] };
}

/** Add `steps` trials (at most MAX_TRIALS in all) and return the new run. This is the only function here that uses the generator. */
export function extendRun(run: Run, settings: Settings, rng: Rng, steps: number): Run {
  const added = Math.max(0, Math.min(Math.floor(steps), MAX_TRIALS - run.trials));
  const counts = run.counts.slice();
  let sum = run.sum;
  let sumSquares = run.sumSquares;
  const series = settings.kind === 'lln' ? run.series.slice() : run.series;
  const points = settings.kind === 'pi' ? run.points.slice() : run.points;
  const bins = settings.kind === 'clt' ? cltBins(settings.sampleSize) : null;

  for (let i = 0; i < added; i += 1) {
    const trial = run.trials + i + 1;
    switch (settings.kind) {
      case 'coins':
        counts[flipCoins(rng, settings.coins)] += 1;
        break;
      case 'dice':
        counts[rollTwoDice(rng) - 2] += 1;
        break;
      case 'binomial':
        counts[countSuccesses(rng, settings.n, settings.p)] += 1;
        break;
      case 'lln': {
        const value = settings.source === 'coin' ? (nextBernoulli(rng, 0.5) ? 1 : 0) : rollDie(rng);
        sum += value;
        series.push(sum / trial);
        break;
      }
      case 'clt': {
        const mean = sampleMean(rng, settings.sampleSize);
        sum += mean;
        sumSquares += mean * mean;
        const bar = Math.floor((mean - bins!.start) / bins!.width);
        counts[Math.min(bins!.count - 1, Math.max(0, bar))] += 1;
        break;
      }
      case 'pi': {
        const point = randomPoint(rng);
        counts[point[2] ? 0 : 1] += 1;
        points.push(point);
        break;
      }
      case 'conditional': {
        const first = rollDie(rng);
        const second = rollDie(rng);
        if (first + second >= settings.threshold) {
          counts[0] += 1;
          if (first === 6) counts[1] += 1;
        }
        break;
      }
    }
  }
  if (settings.kind === 'pi' && points.length > POINTS_KEPT) points.splice(0, points.length - POINTS_KEPT);
  return { trials: run.trials + added, counts, sum, sumSquares, series, points };
}

export type Row = {
  label: string;
  short: string;
  /** How many times. */
  count: number;
  /** The relative frequency, or null when there is nothing to divide by yet. */
  observed: number | null;
  /** The theoretical probability (or, for the law of large numbers, the limit). */
  theory: number;
};

const ratio = (count: number, total: number) => (total > 0 ? count / total : null);

/** The checkpoints the law of large numbers table lists, once the run has reached them. */
export const CHECKPOINTS = [1, 10, 100, 1000, 10000];

/** The table of a run: one row per outcome with its count, relative frequency and theoretical probability. */
export function rows(run: Run, settings: Settings): Row[] {
  switch (settings.kind) {
    case 'lln': {
      const limit = settings.source === 'coin' ? 0.5 : 3.5;
      return CHECKPOINTS.filter((checkpoint) => checkpoint <= run.trials).map((checkpoint) => {
        const mean = run.series[checkpoint - 1];
        return { label: `After ${checkpoint} ${checkpoint === 1 ? 'trial' : 'trials'}`, short: String(checkpoint), count: Math.round(mean * checkpoint), observed: mean, theory: limit };
      });
    }
    case 'conditional': {
      const theory = conditionalTheory(settings.threshold);
      return [
        { label: `B: the sum is at least ${settings.threshold}`, short: 'B', count: run.counts[0], observed: ratio(run.counts[0], run.trials), theory: theory.b },
        { label: 'A and B: the first die is a 6 and B happens', short: 'A and B', count: run.counts[1], observed: ratio(run.counts[1], run.trials), theory: theory.ab },
        { label: 'A given B: among the trials where B happened', short: 'A given B', count: run.counts[1], observed: ratio(run.counts[1], run.counts[0]), theory: theory.aGivenB ?? 0 },
      ];
    }
    default:
      return outcomes(settings).map((outcome, i) => ({ ...outcome, count: run.counts[i], observed: ratio(run.counts[i], run.trials), theory: outcome.theory }));
  }
}

export type Measure = { name: string; observed: number | null; theory: number };

/** The summary numbers of a run beside their theoretical values (a mean, an estimate of pi, and so on). */
export function measures(run: Run, settings: Settings): Measure[] {
  const trials = run.trials;
  switch (settings.kind) {
    case 'coins':
    case 'binomial': {
      const total = run.counts.reduce((sum, count, k) => sum + k * count, 0);
      const theory = settings.kind === 'coins' ? settings.coins / 2 : settings.n * settings.p;
      return [{ name: 'Mean number of heads or successes', observed: ratio(total, trials), theory }];
    }
    case 'dice': {
      const total = run.counts.reduce((sum, count, i) => sum + (i + 2) * count, 0);
      return [{ name: 'Mean of the sum', observed: ratio(total, trials), theory: 7 }];
    }
    case 'lln':
      return [settings.source === 'coin'
        ? { name: 'Relative frequency of heads', observed: ratio(run.sum, trials), theory: 0.5 }
        : { name: 'Mean of the rolls', observed: ratio(run.sum, trials), theory: 3.5 }];
    case 'clt': {
      const mean = ratio(run.sum, trials);
      const variance = trials > 1 ? Math.max(0, (run.sumSquares - (run.sum * run.sum) / trials) / (trials - 1)) : null;
      return [
        { name: 'Mean of the sample means', observed: mean, theory: 1 },
        { name: 'Spread (standard deviation) of the sample means', observed: variance === null ? null : Math.sqrt(variance), theory: 1 / Math.sqrt(settings.sampleSize) },
      ];
    }
    case 'pi': {
      const inside = run.counts[0];
      return [{ name: 'Estimate of π (4 × inside ÷ trials)', observed: trials > 0 ? (4 * inside) / trials : null, theory: Math.PI }];
    }
    case 'conditional': {
      const theory = conditionalTheory(settings.threshold);
      return [{ name: 'Estimate of P(A | B)', observed: ratio(run.counts[1], run.counts[0]), theory: theory.aGivenB ?? 0 }];
    }
  }
}
