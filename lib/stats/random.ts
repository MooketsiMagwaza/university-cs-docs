/**
 * A small seeded random number generator for the simulations in components/interactive/simulation.tsx.
 *
 * A simulation must be repeatable (the same seed gives the same run) and it must never draw a number while a page is
 * being rendered, because the server and the browser would then disagree. So nothing here uses Math.random: the
 * generator is mulberry32, a few lines of integer arithmetic, and a page asks it for numbers only in a click handler.
 */

import type { Distribution } from './distributions';

/** A generator: `next()` returns the next float in [0, 1). It keeps its own state, so pass the same object around. */
export type Rng = { next(): number };

/** Turn whatever was typed into a seed: a whole number from 0 to 4294967295. */
export function toSeed(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Math.abs(Math.trunc(value)) % 4294967296;
}

/** A generator with the given seed (mulberry32). The same seed always gives the same sequence. */
export function createRng(seed: number): Rng {
  let state = toSeed(seed) >>> 0;
  return {
    next() {
      state = (state + 0x6d2b79f5) >>> 0;
      let t = state;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    },
  };
}

/** The next float in [0, 1). */
export function nextFloat(rng: Rng): number {
  return rng.next();
}

/** A whole number from lo to hi, both included, each equally likely. */
export function nextInt(rng: Rng, lo: number, hi: number): number {
  return lo + Math.floor(rng.next() * (hi - lo + 1));
}

/** True with probability p. */
export function nextBernoulli(rng: Rng, p: number): boolean {
  return rng.next() < p;
}

/** An exponential draw with the given rate, by inverting the cdf: -ln(1 - U) / rate. */
export function nextExponential(rng: Rng, rate: number): number {
  return -Math.log(1 - rng.next()) / rate;
}

/**
 * One draw from any distribution in lib/stats/distributions.ts, by inverting its cdf. A discrete variable walks along
 * the mass until the running total passes U; a continuous one is found by bisection on the cdf.
 */
export function drawFrom(rng: Rng, distribution: Distribution): number {
  const u = rng.next();
  if (distribution.kind === 'discrete') {
    const [lo, hi] = distribution.support;
    let total = 0;
    for (let k = lo; k < hi; k += 1) {
      total += distribution.pmf(k);
      if (u < total) return k;
    }
    return hi;
  }
  let [lo, hi] = distribution.range;
  // The plotted range can stop short of the far tail, so widen it until it holds U.
  for (let i = 0; i < 60 && distribution.cdf(hi) < u; i += 1) hi += hi - lo;
  for (let i = 0; i < 60 && distribution.cdf(lo) > u; i += 1) lo -= hi - lo;
  for (let i = 0; i < 80; i += 1) {
    const middle = (lo + hi) / 2;
    if (distribution.cdf(middle) < u) lo = middle;
    else hi = middle;
  }
  return (lo + hi) / 2;
}
