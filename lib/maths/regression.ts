/**
 * Simple linear regression by least squares, for the RegressionPlot component and CSI213 topic 7. For points (x_i, y_i)
 * the fitted line y = b0 + b1 x has
 *
 *   b1 = Sxy / Sxx,  b0 = ybar - b1 xbar,  r = Sxy / sqrt(Sxx Syy),  R^2 = SSR / SST = r^2,
 *
 * where Sxx = sum (x - xbar)^2, Syy = sum (y - ybar)^2 and Sxy = sum (x - xbar)(y - ybar). The residual of a point is
 * e_i = y_i - yhat_i, and SST = SSR + SSE.
 */

export type Point = [number, number];

export type Fit = {
  n: number;
  meanX: number;
  meanY: number;
  sxx: number;
  syy: number;
  sxy: number;
  slope: number;
  intercept: number;
  /** The correlation coefficient. NaN when all the y values are equal (the correlation is not defined). */
  r: number;
  /** The coefficient of determination, SSR / SST. NaN when SST is 0. */
  rSquared: number;
  /** The fitted value for each point. */
  fitted: number[];
  /** y - fitted, for each point. */
  residuals: number[];
  /** The total sum of squares, sum (y - ybar)^2. */
  sst: number;
  /** The regression sum of squares, sum (fitted - ybar)^2. */
  ssr: number;
  /** The error sum of squares, sum of the squared residuals. */
  sse: number;
};

export type FitResult = { ok: true; fit: Fit } | { ok: false; reason: string };

export function mean(values: number[]): number {
  if (values.length === 0) return Number.NaN;
  let total = 0;
  for (const value of values) total += value;
  return total / values.length;
}

/** Fit a least-squares line. Needs two points with different x values; otherwise says why it cannot. */
export function linearRegression(points: Point[]): FitResult {
  const n = points.length;
  if (n < 2) return { ok: false, reason: 'A line needs at least two points.' };
  const meanX = mean(points.map(([x]) => x));
  const meanY = mean(points.map(([, y]) => y));
  let sxx = 0;
  let syy = 0;
  let sxy = 0;
  for (const [x, y] of points) {
    sxx += (x - meanX) * (x - meanX);
    syy += (y - meanY) * (y - meanY);
    sxy += (x - meanX) * (y - meanY);
  }
  if (sxx < 1e-12) return { ok: false, reason: 'All the points have the same x, so the line is vertical and has no slope.' };

  const slope = sxy / sxx;
  const intercept = meanY - slope * meanX;
  const fitted = points.map(([x]) => intercept + slope * x);
  const residuals = points.map(([, y], i) => y - fitted[i]);
  let sse = 0;
  let ssr = 0;
  for (let i = 0; i < n; i += 1) {
    sse += residuals[i] * residuals[i];
    ssr += (fitted[i] - meanY) * (fitted[i] - meanY);
  }
  const defined = syy > 1e-12;
  return {
    ok: true,
    fit: {
      n,
      meanX,
      meanY,
      sxx,
      syy,
      sxy,
      slope,
      intercept,
      r: defined ? sxy / Math.sqrt(sxx * syy) : Number.NaN,
      rSquared: defined ? ssr / syy : Number.NaN,
      fitted,
      residuals,
      sst: syy,
      ssr,
      sse,
    },
  };
}

/** The fitted line's value at x. */
export function predict(fit: Pick<Fit, 'slope' | 'intercept'>, x: number): number {
  return fit.intercept + fit.slope * x;
}
