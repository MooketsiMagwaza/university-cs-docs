import assert from 'node:assert/strict';
import test from 'node:test';
import {
  binomial,
  choose,
  defaultValues,
  exponential,
  families,
  geometric,
  hypergeometric,
  negativeBinomial,
  normal,
  poisson,
  probabilityBetween,
  standardNormalCdf,
  uniform,
} from '../../lib/stats/distributions.ts';

const close = (actual, expected, tolerance = 1e-9, message) =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${message ?? ''} expected ${expected}, got ${actual}`);

/** Sum of the pmf over the whole support, and the mean and variance computed from the pmf. */
function moments(distribution) {
  const [lo, hi] = distribution.support;
  let total = 0;
  let mean = 0;
  let second = 0;
  for (let k = lo; k <= hi; k += 1) {
    const p = distribution.pmf(k);
    total += p;
    mean += k * p;
    second += k * k * p;
  }
  return { total, mean, variance: second - mean * mean };
}

test('choose gives exact binomial coefficients', () => {
  assert.equal(choose(10, 5), 252);
  assert.equal(choose(5, 0), 1);
  assert.equal(choose(5, 6), 0);
  assert.equal(choose(30, 15), 155117520);
});

test('binomial(10, 0.5): P(X=5) = 252/1024', () => {
  const d = binomial(10, 0.5);
  close(d.pmf(5), 0.24609375);
  close(d.cdf(5), 638 / 1024);
  assert.equal(d.pmf(11), 0);
  assert.equal(d.pmf(2.5), 0);
});

test('binomial handles p near 0 and 1 without NaN', () => {
  const low = binomial(10, 0.01);
  close(low.pmf(0), Math.pow(0.99, 10));
  assert.ok(Number.isFinite(low.pmf(10)));
});

test('poisson(3): P(X=2) and the cdf at 2', () => {
  const d = poisson(3);
  close(d.pmf(2), (Math.exp(-3) * 9) / 2);
  close(d.cdf(2), Math.exp(-3) * (1 + 3 + 4.5));
});

test('geometric counting trials: P(X=3) = 0.8^2 * 0.2 and the mean is 1/p', () => {
  const d = geometric(0.2);
  close(d.pmf(3), 0.128);
  close(d.pmf(0), 0);
  close(d.cdf(3), 1 - Math.pow(0.8, 3));
  close(d.mean, 5);
});

test('geometric counting failures starts at 0 and has mean (1-p)/p', () => {
  const d = geometric(0.2, 'failures');
  close(d.pmf(0), 0.2);
  close(d.pmf(2), 0.8 * 0.8 * 0.2);
  close(d.cdf(2), 1 - Math.pow(0.8, 3));
  close(d.mean, 4);
  assert.deepEqual(d.support[0], 0);
});

test('negative binomial: trials and failures describe the same experiment', () => {
  const trials = negativeBinomial(2, 0.5);
  close(trials.pmf(3), 0.25); // C(2,1) * 0.5^2 * 0.5
  close(trials.mean, 4);
  const failures = negativeBinomial(2, 0.5, 'failures');
  close(failures.pmf(1), 0.25); // one failure before the 2nd success is three trials in all
  close(failures.mean, 2);
  for (let failuresCount = 0; failuresCount < 8; failuresCount += 1) {
    close(failures.pmf(failuresCount), trials.pmf(failuresCount + 2), 1e-12);
  }
});

test('hypergeometric(N=10, K=4, n=3): P(X=2) = 36/120 and the mean is nK/N', () => {
  const d = hypergeometric(10, 4, 3);
  close(d.pmf(2), 0.3);
  close(d.mean, 1.2);
  assert.deepEqual(d.support, [0, 3]);
});

test('every discrete pmf sums to 1 and its mean and variance match the formulas', () => {
  const cases = [
    binomial(10, 0.5),
    binomial(40, 0.13),
    poisson(0.4),
    poisson(12),
    geometric(0.3),
    geometric(0.3, 'failures'),
    negativeBinomial(3, 0.4),
    negativeBinomial(3, 0.4, 'failures'),
    hypergeometric(20, 8, 5),
    hypergeometric(12, 12, 4),
  ];
  for (const d of cases) {
    const found = moments(d);
    close(found.total, 1, 1e-5, `${d.title} total`);
    close(found.mean, d.mean, 1e-3, `${d.title} mean`);
    close(found.variance, d.variance, 1e-2, `${d.title} variance`);
  }
});

test('the standard normal cdf at known points', () => {
  close(standardNormalCdf(0), 0.5, 1e-14);
  close(standardNormalCdf(1), 0.8413447460685429, 1e-12);
  close(standardNormalCdf(1.96), 0.9750021048517795, 1e-12);
  close(standardNormalCdf(-1.96), 0.0249978951482205, 1e-12);
  close(standardNormalCdf(3), 0.9986501019683699, 1e-12);
  assert.equal(standardNormalCdf(-9), 0);
  assert.equal(standardNormalCdf(9), 1);
});

test('normal(mu, sigma) standardises: P(a <= X <= b)', () => {
  const d = normal(100, 15);
  close(d.cdf(100), 0.5, 1e-14);
  close(probabilityBetween(d, 85, 115), 0.6826894921370859, 1e-12);
  close(d.pdf(100), 1 / (15 * Math.sqrt(2 * Math.PI)));
});

test('exponential(2): P(X <= 1) = 1 - e^-2, and it forgets the past', () => {
  const d = exponential(2);
  close(d.cdf(1), 1 - Math.exp(-2));
  close(d.mean, 0.5);
  close(d.variance, 0.25);
  // P(X > 1.5 | X > 1) = P(X > 0.5)
  const survive = (x) => 1 - d.cdf(x);
  close(survive(1.5) / survive(1), survive(0.5), 1e-12);
});

test('uniform(1, 5)', () => {
  const d = uniform(1, 5);
  close(d.pdf(3), 0.25);
  close(d.pdf(6), 0);
  close(d.cdf(2), 0.25);
  close(d.mean, 3);
  close(d.variance, 16 / 12);
  close(probabilityBetween(d, 2, 4), 0.5);
});

test('probabilityBetween adds the mass for a discrete variable and includes both ends', () => {
  const d = binomial(10, 0.5);
  close(probabilityBetween(d, 3, 5), (120 + 210 + 252) / 1024);
  close(probabilityBetween(d, 2.5, 5.5), (120 + 210 + 252) / 1024);
  close(probabilityBetween(d, -5, 100), 1);
  assert.equal(probabilityBetween(d, 6, 5), 0);
});

test('every family the explorer offers builds from its default values', () => {
  for (const [name, definition] of Object.entries(families)) {
    const { distribution } = definition.build(defaultValues(name));
    assert.ok(Number.isFinite(distribution.mean), `${name} mean`);
    assert.ok(distribution.variance > 0, `${name} variance`);
  }
});

test('hypergeometric parameters that depend on each other are corrected', () => {
  const { distribution, values } = families.hypergeometric.build({ N: 10, K: 40, n: 30 });
  assert.equal(values.K, 10);
  assert.equal(values.n, 10);
  assert.ok(Number.isFinite(distribution.mean));
});

test('uniform keeps b above a', () => {
  const { values } = families.uniform.build({ a: 3, b: 1 });
  assert.ok(values.b > values.a);
});
