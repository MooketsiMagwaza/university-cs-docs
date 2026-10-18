// Least-squares regression behind the RegressionPlot component, checked against numbers worked out by hand.
// Run with: node --no-warnings --experimental-strip-types --test tests/unit/regression.test.mjs

import assert from 'node:assert/strict';
import test from 'node:test';

const { linearRegression, mean, predict } = await import('../../lib/maths/regression.ts');

const close = (actual, expected, tolerance = 1e-9, message = '') =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${message} expected ${expected}, got ${actual}`);

const FIVE = [[1, 2], [2, 4], [3, 5], [4, 4], [5, 5]];

const fitOf = (points) => {
  const result = linearRegression(points);
  assert.ok(result.ok, result.reason);
  return result.fit;
};

test('the five-point example: slope 0.6 and intercept 2.2', () => {
  const fit = fitOf(FIVE);
  // xbar = 3, ybar = 4, Sxx = 10, Sxy = 6, Syy = 6
  close(fit.meanX, 3);
  close(fit.meanY, 4);
  close(fit.sxx, 10);
  close(fit.sxy, 6);
  close(fit.syy, 6);
  close(fit.slope, 0.6);
  close(fit.intercept, 2.2);
  close(fit.r, 6 / Math.sqrt(60));
  close(fit.rSquared, 0.6);
  close(fit.r * fit.r, fit.rSquared, 1e-12, 'R squared is r squared');
  assert.equal(fit.n, 5);
});

test('the five-point example: fitted values and residuals', () => {
  const fit = fitOf(FIVE);
  const expectedFitted = [2.8, 3.4, 4.0, 4.6, 5.2];
  const expectedResiduals = [-0.8, 0.6, 1.0, -0.6, -0.2];
  expectedFitted.forEach((value, i) => close(fit.fitted[i], value, 1e-12, `fitted ${i}`));
  expectedResiduals.forEach((value, i) => close(fit.residuals[i], value, 1e-12, `residual ${i}`));
  close(fit.sse, 2.4, 1e-12);
  close(fit.sst, 6, 1e-12);
  close(fit.ssr, 3.6, 1e-12);
  close(predict(fit, 6), 5.8, 1e-12);
});

test('the residuals sum to zero and are orthogonal to x; SST = SSR + SSE', () => {
  const sets = [FIVE, [[0, 1], [1, 3], [2, 2], [3, 8], [4, 5], [10, 9]], [[-2, 5.5], [-1, 4.1], [0, 4.4], [3, -1.2], [7, -6]], [[1.5, 2.5], [2.5, 2.9], [9.5, 12]]];
  for (const points of sets) {
    const fit = fitOf(points);
    close(fit.residuals.reduce((a, b) => a + b, 0), 0, 1e-9, 'sum of residuals');
    close(fit.residuals.reduce((total, e, i) => total + e * points[i][0], 0), 0, 1e-9, 'sum of e * x');
    close(fit.sst, fit.ssr + fit.sse, 1e-9, 'the ANOVA identity');
    close(fit.rSquared, 1 - fit.sse / fit.sst, 1e-12, 'R squared = 1 - SSE/SST');
    close(predict(fit, fit.meanX), fit.meanY, 1e-9, 'the line passes through the centroid');
    assert.equal(Math.sign(fit.r), Math.sign(fit.slope));
    assert.ok(fit.r >= -1 && fit.r <= 1);
  }
});

test('points on a line give r = 1 or -1 and no residual', () => {
  const rising = fitOf([[0, 1], [1, 3], [2, 5], [3, 7]]);
  close(rising.slope, 2, 1e-12);
  close(rising.intercept, 1, 1e-12);
  close(rising.r, 1, 1e-12);
  close(rising.sse, 0, 1e-20);
  const falling = fitOf([[1, 10], [2, 7], [4, 1]]);
  close(falling.slope, -3, 1e-12);
  close(falling.r, -1, 1e-12);
  close(falling.rSquared, 1, 1e-12);
});

test('two points always fit exactly', () => {
  const fit = fitOf([[1, 1], [3, 7]]);
  close(fit.slope, 3);
  close(fit.intercept, -2);
  close(fit.rSquared, 1);
});

test('not enough information is explained, not a NaN line', () => {
  const none = linearRegression([]);
  assert.equal(none.ok, false);
  assert.match(none.reason, /two points/);
  assert.equal(linearRegression([[1, 1]]).ok, false);
  const vertical = linearRegression([[2, 1], [2, 5], [2, 9]]);
  assert.equal(vertical.ok, false);
  assert.match(vertical.reason, /same x/);
});

test('all y equal: a flat line, and the correlation is not defined', () => {
  const fit = fitOf([[1, 4], [2, 4], [5, 4]]);
  close(fit.slope, 0);
  close(fit.intercept, 4);
  assert.ok(Number.isNaN(fit.r));
  assert.ok(Number.isNaN(fit.rSquared));
});

test('an outlier lowers r squared a lot; a point on the line does not', () => {
  const base = fitOf(FIVE);
  const withOutlier = fitOf([...FIVE, [6, 0]]);
  assert.ok(withOutlier.rSquared < base.rSquared - 0.2, `${withOutlier.rSquared} vs ${base.rSquared}`);
  assert.ok(withOutlier.slope < base.slope);
  const onTheLine = fitOf([...FIVE, [6, 5.8]]);
  assert.ok(onTheLine.rSquared > base.rSquared, 'a point on the old line makes the fit better');
  close(onTheLine.slope, 0.6, 0.05);
});

test('moving one point changes the fit continuously', () => {
  const moved = FIVE.map(([x, y], i) => (i === 2 ? [x, y + 1] : [x, y]));
  const fit = fitOf(moved);
  // Raising the middle y by 1 raises ybar by 0.2 and leaves Sxy unchanged because x - xbar = 0 for that point.
  close(fit.slope, 0.6, 1e-12);
  close(fit.intercept, 2.4, 1e-12);
});

test('mean', () => {
  close(mean([1, 2, 3, 4]), 2.5);
  assert.ok(Number.isNaN(mean([])));
});
