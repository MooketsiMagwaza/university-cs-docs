/**
 * The probability distributions taught in CSI213 and STA122, with the formulas written out so a lesson can show them.
 * Pure functions with no dependencies: the explorer in components/interactive/distribution-explorer.tsx draws from
 * these, and tests/unit/distributions.test.mjs checks them against known values.
 */

export type FamilyName =
  | 'binomial'
  | 'poisson'
  | 'geometric'
  | 'negative-binomial'
  | 'hypergeometric'
  | 'uniform'
  | 'exponential'
  | 'normal';

export type ParamSpec = {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  /** A parameter that must be a whole number. */
  integer?: boolean;
};

type Common = {
  family: FamilyName;
  /** The family's name as a lesson says it. */
  title: string;
  mean: number;
  variance: number;
  /** The formula for the mass or density, in LaTeX for KaTeX. */
  formula: string;
};

export type DiscreteDistribution = Common & {
  kind: 'discrete';
  /** The smallest and largest value with a non-zero probability (the largest may be unbounded in theory; this is where the plot stops). */
  support: [number, number];
  pmf(k: number): number;
  cdf(k: number): number;
};

export type ContinuousDistribution = Common & {
  kind: 'continuous';
  /** The part of the line worth drawing. */
  range: [number, number];
  pdf(x: number): number;
  cdf(x: number): number;
};

export type Distribution = DiscreteDistribution | ContinuousDistribution;

/* ───────── helpers ───────── */

const logFactorials: number[] = [0, 0];

/** ln(n!) for a whole number n, from a cached running sum of logarithms. */
export function logFactorial(n: number): number {
  for (let i = logFactorials.length; i <= n; i += 1) logFactorials[i] = logFactorials[i - 1] + Math.log(i);
  return logFactorials[n];
}

/** ln of "n choose k"; minus infinity when k is outside 0..n. */
export function logChoose(n: number, k: number): number {
  if (k < 0 || k > n) return Number.NEGATIVE_INFINITY;
  return logFactorial(n) - logFactorial(k) - logFactorial(n - k);
}

/** "n choose k" as a number (rounded, so it is exact while it fits in a double). */
export function choose(n: number, k: number): number {
  return k < 0 || k > n ? 0 : Math.round(Math.exp(logChoose(n, k)));
}

/** Probabilities such as p^0 when p is 0 must be 1, and 0 ln 0 must be 0, so write the log of a power carefully. */
function logPow(base: number, exponent: number): number {
  return exponent === 0 ? 0 : exponent * Math.log(base);
}

/**
 * The standard normal cdf. Uses the series Phi(z) = 1/2 + phi(z) (z + z^3/3 + z^5/(3*5) + ...), which converges for
 * every z and is accurate to about 1e-15 for |z| up to 8, and is 0 or 1 beyond that.
 */
export function standardNormalCdf(z: number): number {
  if (z <= -8) return 0;
  if (z >= 8) return 1;
  const phi = Math.exp(-0.5 * z * z) / Math.sqrt(2 * Math.PI);
  let term = z;
  let sum = z;
  for (let n = 1; n < 400; n += 1) {
    term *= (z * z) / (2 * n + 1);
    sum += term;
    if (Math.abs(term) < 1e-17 * Math.abs(sum)) break;
  }
  return Math.min(1, Math.max(0, 0.5 + phi * sum));
}

/** Sum of f(k) for k from lo to hi inclusive. */
function sumRange(f: (k: number) => number, lo: number, hi: number): number {
  let total = 0;
  for (let k = lo; k <= hi; k += 1) total += f(k);
  return total;
}

/* ───────── the families ───────── */

const clamp = (value: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, value));

export function binomial(n: number, p: number): DiscreteDistribution {
  const pmf = (k: number) => (Number.isInteger(k) && k >= 0 && k <= n ? Math.exp(logChoose(n, k) + logPow(p, k) + logPow(1 - p, n - k)) : 0);
  return {
    kind: 'discrete', family: 'binomial', title: 'Binomial', formula: String.raw`P(X=k)=\binom{n}{k}p^k(1-p)^{n-k}`,
    mean: n * p, variance: n * p * (1 - p), support: [0, n],
    pmf, cdf: (k) => (k < 0 ? 0 : clamp(sumRange(pmf, 0, Math.min(n, Math.floor(k))), 0, 1)),
  };
}

export function poisson(lambda: number): DiscreteDistribution {
  const pmf = (k: number) => (Number.isInteger(k) && k >= 0 ? Math.exp(-lambda + logPow(lambda, k) - logFactorial(k)) : 0);
  // Stop the plot where the remaining probability is negligible.
  let top = Math.max(5, Math.ceil(lambda));
  while (top < 400 && sumRange(pmf, 0, top) < 1 - 1e-6) top += 1;
  return {
    kind: 'discrete', family: 'poisson', title: 'Poisson', formula: String.raw`P(X=k)=\dfrac{e^{-\lambda}\lambda^k}{k!}`,
    mean: lambda, variance: lambda, support: [0, top],
    pmf, cdf: (k) => (k < 0 ? 0 : clamp(sumRange(pmf, 0, Math.floor(k)), 0, 1)),
  };
}

/**
 * What a geometric or negative binomial variable counts. Courses differ and the lessons say which they use: CSI213
 * counts the failures before the success ('failures', support starts at 0), STA122 and many textbooks count the
 * trials up to and including it ('trials', support starts at 1 for the geometric and at r for the negative binomial).
 */
export type Convention = 'trials' | 'failures';

/** The geometric distribution: the first success, counted in trials (from 1) or in failures before it (from 0). */
export function geometric(p: number, convention: Convention = 'trials'): DiscreteDistribution {
  const shift = convention === 'trials' ? 1 : 0;
  const pmf = (k: number) => (Number.isInteger(k) && k >= shift ? Math.exp(logPow(1 - p, k - shift) + Math.log(p)) : 0);
  let top = shift + 5;
  while (top < 400 && 1 - Math.pow(1 - p, top - shift + 1) < 1 - 1e-6) top += 1;
  return {
    kind: 'discrete', family: 'geometric', title: 'Geometric',
    formula: convention === 'trials' ? String.raw`P(X=k)=(1-p)^{k-1}p,\quad k=1,2,\dots` : String.raw`P(X=x)=(1-p)^{x}p,\quad x=0,1,2,\dots`,
    mean: convention === 'trials' ? 1 / p : (1 - p) / p, variance: (1 - p) / (p * p), support: [shift, top],
    pmf, cdf: (k) => (k < shift ? 0 : 1 - Math.pow(1 - p, Math.floor(k) - shift + 1)),
  };
}

/** The negative binomial distribution: the r-th success, counted in trials (from r) or in failures before it (from 0). */
export function negativeBinomial(r: number, p: number, convention: Convention = 'trials'): DiscreteDistribution {
  const shift = convention === 'trials' ? r : 0;
  // With k trials in all, k - r of them are failures.
  const pmf = (k: number) => (Number.isInteger(k) && k >= shift ? Math.exp(logChoose(k - shift + r - 1, r - 1) + logPow(p, r) + logPow(1 - p, k - shift)) : 0);
  let top = shift + 5;
  while (top < 600 && sumRange(pmf, shift, top) < 1 - 1e-6) top += 1;
  return {
    kind: 'discrete', family: 'negative-binomial', title: 'Negative binomial',
    formula: convention === 'trials' ? String.raw`P(X=k)=\binom{k-1}{r-1}p^r(1-p)^{k-r},\quad k=r,r+1,\dots` : String.raw`P(X=x)=\binom{x+r-1}{r-1}p^r(1-p)^{x},\quad x=0,1,2,\dots`,
    mean: convention === 'trials' ? r / p : (r * (1 - p)) / p, variance: (r * (1 - p)) / (p * p), support: [shift, top],
    pmf, cdf: (k) => (k < shift ? 0 : clamp(sumRange(pmf, shift, Math.floor(k)), 0, 1)),
  };
}

/** Drawing n items without replacement from N items of which K are successes. */
export function hypergeometric(N: number, K: number, n: number): DiscreteDistribution {
  const lo = Math.max(0, n - (N - K));
  const hi = Math.min(n, K);
  const logTotal = logChoose(N, n);
  const pmf = (k: number) => (Number.isInteger(k) && k >= lo && k <= hi ? Math.exp(logChoose(K, k) + logChoose(N - K, n - k) - logTotal) : 0);
  return {
    kind: 'discrete', family: 'hypergeometric', title: 'Hypergeometric', formula: String.raw`P(X=k)=\dfrac{\binom{K}{k}\binom{N-K}{n-k}}{\binom{N}{n}}`,
    mean: (n * K) / N, variance: N > 1 ? n * (K / N) * (1 - K / N) * ((N - n) / (N - 1)) : 0, support: [lo, hi],
    pmf, cdf: (k) => (k < lo ? 0 : clamp(sumRange(pmf, lo, Math.min(hi, Math.floor(k))), 0, 1)),
  };
}

export function uniform(a: number, b: number): ContinuousDistribution {
  const width = b - a;
  return {
    kind: 'continuous', family: 'uniform', title: 'Uniform', formula: String.raw`f(x)=\dfrac{1}{b-a},\quad a\le x\le b`,
    mean: (a + b) / 2, variance: (width * width) / 12, range: [a - width * 0.25, b + width * 0.25],
    pdf: (x) => (x >= a && x <= b ? 1 / width : 0),
    cdf: (x) => clamp((x - a) / width, 0, 1),
  };
}

export function exponential(lambda: number): ContinuousDistribution {
  return {
    kind: 'continuous', family: 'exponential', title: 'Exponential', formula: String.raw`f(x)=\lambda e^{-\lambda x},\quad x\ge 0`,
    mean: 1 / lambda, variance: 1 / (lambda * lambda), range: [0, -Math.log(0.001) / lambda],
    pdf: (x) => (x >= 0 ? lambda * Math.exp(-lambda * x) : 0),
    cdf: (x) => (x >= 0 ? 1 - Math.exp(-lambda * x) : 0),
  };
}

export function normal(mu: number, sigma: number): ContinuousDistribution {
  return {
    kind: 'continuous', family: 'normal', title: 'Normal', formula: String.raw`f(x)=\dfrac{1}{\sigma\sqrt{2\pi}}e^{-\frac{(x-\mu)^2}{2\sigma^2}}`,
    mean: mu, variance: sigma * sigma, range: [mu - 4 * sigma, mu + 4 * sigma],
    pdf: (x) => Math.exp(-0.5 * ((x - mu) / sigma) ** 2) / (sigma * Math.sqrt(2 * Math.PI)),
    cdf: (x) => standardNormalCdf((x - mu) / sigma),
  };
}

/* ───────── what the explorer offers ───────── */

type FamilyDefinition = {
  title: string;
  params: ParamSpec[];
  /** Fix up parameters that depend on each other (K cannot exceed N), then build the distribution. */
  build(values: Record<string, number>, convention?: Convention): { distribution: Distribution; values: Record<string, number> };
};

const param = (key: string, label: string, min: number, max: number, step: number, value: number, integer = false): ParamSpec => ({ key, label, min, max, step, value, integer });

export const families: Record<FamilyName, FamilyDefinition> = {
  binomial: {
    title: 'Binomial',
    params: [param('n', 'n (trials)', 1, 50, 1, 10, true), param('p', 'p (success)', 0.01, 0.99, 0.01, 0.5)],
    build: (v) => ({ distribution: binomial(v.n, v.p), values: v }),
  },
  poisson: {
    title: 'Poisson',
    params: [param('lambda', 'λ (rate)', 0.1, 20, 0.1, 3)],
    build: (v) => ({ distribution: poisson(v.lambda), values: v }),
  },
  geometric: {
    title: 'Geometric',
    params: [param('p', 'p (success)', 0.05, 0.95, 0.01, 0.3)],
    build: (v, convention) => ({ distribution: geometric(v.p, convention), values: v }),
  },
  'negative-binomial': {
    title: 'Negative binomial',
    params: [param('r', 'r (successes)', 1, 10, 1, 3, true), param('p', 'p (success)', 0.05, 0.95, 0.01, 0.5)],
    build: (v, convention) => ({ distribution: negativeBinomial(v.r, v.p, convention), values: v }),
  },
  hypergeometric: {
    title: 'Hypergeometric',
    params: [param('N', 'N (population)', 5, 60, 1, 20, true), param('K', 'K (successes in it)', 0, 60, 1, 8, true), param('n', 'n (drawn)', 1, 60, 1, 5, true)],
    build: (v) => {
      const N = v.N;
      const K = Math.min(v.K, N);
      const n = Math.min(v.n, N);
      return { distribution: hypergeometric(N, K, n), values: { ...v, K, n } };
    },
  },
  uniform: {
    title: 'Uniform',
    params: [param('a', 'a (lower)', -5, 5, 0.5, 0), param('b', 'b (upper)', -4.5, 10, 0.5, 4)],
    build: (v) => {
      const b = Math.max(v.b, v.a + 0.5);
      return { distribution: uniform(v.a, b), values: { ...v, b } };
    },
  },
  exponential: {
    title: 'Exponential',
    params: [param('lambda', 'λ (rate)', 0.1, 5, 0.1, 1)],
    build: (v) => ({ distribution: exponential(v.lambda), values: v }),
  },
  normal: {
    title: 'Normal',
    params: [param('mu', 'μ (mean)', -5, 5, 0.1, 0), param('sigma', 'σ (spread)', 0.3, 4, 0.1, 1)],
    build: (v) => ({ distribution: normal(v.mu, v.sigma), values: v }),
  },
};

/** The starting values of a family. */
export function defaultValues(family: FamilyName): Record<string, number> {
  return Object.fromEntries(families[family].params.map((spec) => [spec.key, spec.value]));
}

/** P(a <= X <= b): a sum of the mass for a discrete variable, a difference of the cdf for a continuous one. */
export function probabilityBetween(distribution: Distribution, a: number, b: number): number {
  if (b < a) return 0;
  if (distribution.kind === 'continuous') return clamp(distribution.cdf(b) - distribution.cdf(a), 0, 1);
  const [lo, hi] = distribution.support;
  const from = Math.max(lo, Math.ceil(a));
  const to = Math.min(hi, Math.floor(b));
  return clamp(sumRange(distribution.pmf, from, to), 0, 1);
}
