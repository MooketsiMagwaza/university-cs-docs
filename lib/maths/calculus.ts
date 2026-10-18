/**
 * The numerical calculus behind the Visualise component: derivatives, Riemann sums, definite integrals, the area between
 * two curves and the volume of a solid of revolution. Every function takes a plain function of x, so it works with a
 * parsed expression (`parsed.evaluate`) or with any JavaScript function. Nothing here is random and nothing reads the
 * clock, so a page that uses it renders the same on the server and in the browser.
 */

export type Fn = (x: number) => number;

/* ───────── derivatives ───────── */

/**
 * The derivative at x by central differences, improved once by Richardson extrapolation. The error is about h^4, so the
 * default step gives ten or more correct digits for a smooth function.
 */
export function derivativeAt(f: Fn, x: number, h = 1e-3): number {
  const step = h * Math.max(1, Math.abs(x));
  const central = (s: number) => (f(x + s) - f(x - s)) / (2 * s);
  return (4 * central(step / 2) - central(step)) / 3;
}

/** The slope of the secant through (a, f(a)) and (a + h, f(a + h)). As h shrinks it approaches derivativeAt(f, a). */
export function secantSlope(f: Fn, a: number, h: number): number {
  return (f(a + h) - f(a)) / h;
}

/* ───────── Riemann sums ───────── */

export type Rule = 'left' | 'right' | 'midpoint' | 'trapezoid';
export const rules: readonly Rule[] = ['left', 'right', 'midpoint', 'trapezoid'];

/** One piece of a Riemann sum, for drawing: the rectangle (or trapezoid) over [x0, x1]. */
export type Piece = { x0: number; x1: number; y0: number; y1: number; area: number };

/**
 * The n pieces of a Riemann sum of f on [a, b]. A rectangle has the same height at both ends (y0 = y1); a trapezoid has
 * the heights at its two ends.
 */
export function riemannPieces(f: Fn, a: number, b: number, n: number, rule: Rule): Piece[] {
  const count = Math.max(1, Math.round(n));
  const dx = (b - a) / count;
  const pieces: Piece[] = [];
  for (let i = 0; i < count; i += 1) {
    const x0 = a + i * dx;
    const x1 = i === count - 1 ? b : a + (i + 1) * dx;
    let y0: number;
    let y1: number;
    let area: number;
    if (rule === 'left') {
      y0 = y1 = f(x0);
      area = y0 * dx;
    } else if (rule === 'right') {
      y0 = y1 = f(x1);
      area = y0 * dx;
    } else if (rule === 'midpoint') {
      y0 = y1 = f((x0 + x1) / 2);
      area = y0 * dx;
    } else {
      y0 = f(x0);
      y1 = f(x1);
      area = ((y0 + y1) / 2) * dx;
    }
    pieces.push({ x0, x1, y0, y1, area });
  }
  return pieces;
}

/** The Riemann sum of f on [a, b] with n pieces. */
export function riemannSum(f: Fn, a: number, b: number, n: number, rule: Rule): number {
  let total = 0;
  for (const piece of riemannPieces(f, a, b, n, rule)) total += piece.area;
  return total;
}

/* ───────── definite integrals ───────── */

function simpson(fa: number, fm: number, fb: number, width: number): number {
  return (width / 6) * (fa + 4 * fm + fb);
}

function adaptive(f: Fn, a: number, b: number, fa: number, fm: number, fb: number, whole: number, tolerance: number, depth: number): number {
  const m = (a + b) / 2;
  const lm = (a + m) / 2;
  const rm = (m + b) / 2;
  const flm = f(lm);
  const frm = f(rm);
  const left = simpson(fa, flm, fm, m - a);
  const right = simpson(fm, frm, fb, b - m);
  const delta = left + right - whole;
  if (depth <= 0 || Math.abs(delta) <= 15 * tolerance) return left + right + delta / 15;
  return (
    adaptive(f, a, m, fa, flm, fm, left, tolerance / 2, depth - 1) +
    adaptive(f, m, b, fm, frm, fb, right, tolerance / 2, depth - 1)
  );
}

/**
 * True when f gives a finite number at 200 evenly spaced points of [a, b] and at both ends. An integral of a function
 * that blows up inside the interval (1/x on [-1, 1], ln(x) from 0) is an improper integral, which this does not do.
 */
export function isFiniteOn(f: Fn, a: number, b: number): boolean {
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  for (let i = 0; i <= 200; i += 1) if (!Number.isFinite(f(lo + ((hi - lo) * i) / 200))) return false;
  return true;
}

/**
 * The definite integral of f from a to b by adaptive Simpson's rule, accurate to about 1e-10 for a smooth function. The
 * interval is first cut into 32 pieces so that an oscillating function cannot fool the first estimate. Returns NaN
 * when f is not finite on the interval. If a is greater than b the sign is reversed, as the integral requires.
 */
export function integrate(f: Fn, a: number, b: number, tolerance = 1e-10): number {
  if (a === b) return 0;
  if (a > b) return -integrate(f, b, a, tolerance);
  if (!isFiniteOn(f, a, b)) return Number.NaN;
  const pieces = 32;
  const width = (b - a) / pieces;
  let total = 0;
  for (let i = 0; i < pieces; i += 1) {
    const lo = a + i * width;
    const hi = i === pieces - 1 ? b : lo + width;
    const mid = (lo + hi) / 2;
    const fa = f(lo);
    const fm = f(mid);
    const fb = f(hi);
    total += adaptive(f, lo, hi, fa, fm, fb, simpson(fa, fm, fb, hi - lo), tolerance / pieces, 24);
  }
  return total;
}

/* ───────── roots and crossings ───────── */

/**
 * The places in [a, b] where f changes sign (or is exactly zero), found by scanning 600 steps and then bisecting. A
 * curve that only touches zero without crossing (x^2 at 0) can be missed.
 */
export function findRoots(f: Fn, a: number, b: number): number[] {
  const steps = 600;
  const roots: number[] = [];
  let x0 = a;
  let y0 = f(x0);
  for (let i = 1; i <= steps && roots.length < 100; i += 1) {
    const x1 = a + ((b - a) * i) / steps;
    const y1 = f(x1);
    if (Number.isFinite(y0) && Number.isFinite(y1)) {
      if (y0 === 0) {
        if (roots.length === 0 || Math.abs(roots[roots.length - 1] - x0) > 1e-9) roots.push(x0);
      } else if (y0 * y1 < 0) {
        // A sign change can also be a jump across a pole (1/x), so check that the value at the root is small.
        let lo = x0;
        let hi = x1;
        let flo = y0;
        for (let k = 0; k < 60; k += 1) {
          const mid = (lo + hi) / 2;
          const fm = f(mid);
          if (flo * fm <= 0) hi = mid;
          else {
            lo = mid;
            flo = fm;
          }
        }
        // Snap a root that is zero to rounding error (-2.6e-22) to a clean number.
        const root = Number(((lo + hi) / 2).toFixed(12));
        if (Math.abs(f(root)) < 1e-6 * Math.max(1, Math.abs(y0), Math.abs(y1))) roots.push(root);
      }
    }
    x0 = x1;
    y0 = y1;
  }
  const last = f(b);
  if (last === 0 && (roots.length === 0 || Math.abs(roots[roots.length - 1] - b) > 1e-9)) roots.push(b);
  return roots.slice(0, 100);
}

/** The x values in [a, b] where f(x) = g(x), crossings only. */
export function crossings(f: Fn, g: Fn, a: number, b: number): number[] {
  return findRoots((x) => f(x) - g(x), a, b);
}

/* ───────── area and volume ───────── */

export type AreaBetween = {
  /** The total (geometric) area between the curves: always at least 0. */
  area: number;
  /** The signed integral of f - g, which cancels where the curves swap places. */
  signed: number;
  /** The x values inside (a, b) where the curves cross, which cut the interval into pieces. */
  crossings: number[];
  /** The pieces, each with the curve that is on top there. */
  pieces: { from: number; to: number; top: 'f' | 'g'; area: number }[];
};

/**
 * The area between the graphs of f and g from a to b. The curves are compared piece by piece between their crossings,
 * so the answer is the total area (top minus bottom on each piece), not the signed integral.
 */
export function areaBetween(f: Fn, g: Fn, a: number, b: number): AreaBetween {
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  const inner = crossings(f, g, lo, hi).filter((x) => x > lo + 1e-9 && x < hi - 1e-9);
  const cuts = [lo, ...inner, hi];
  const difference: Fn = (x) => f(x) - g(x);
  const pieces: AreaBetween['pieces'] = [];
  let area = 0;
  for (let i = 0; i < cuts.length - 1; i += 1) {
    const value = integrate(difference, cuts[i], cuts[i + 1]);
    area += Math.abs(value);
    pieces.push({ from: cuts[i], to: cuts[i + 1], top: value >= 0 ? 'f' : 'g', area: Math.abs(value) });
  }
  return { area, signed: integrate(difference, lo, hi), crossings: inner, pieces };
}

/**
 * The volume of the solid made by turning the region between y = f(x) and y = g(x) about the x-axis, from a to b, using
 * discs (washers when g is not zero): V = pi * integral of |f(x)^2 - g(x)^2| dx. This is right when both curves are on
 * the same side of the axis; with g = 0 it is the plain disc formula V = pi * integral of f(x)^2 dx.
 */
export function volumeOfRevolution(f: Fn, a: number, b: number, g: Fn = () => 0): number {
  return Math.PI * integrate((x) => Math.abs(f(x) * f(x) - g(x) * g(x)), a, b);
}

/** The same volume approximated with n discs (the midpoint rule on pi * |f^2 - g^2|), for showing how slicing converges. */
export function volumeByDiscs(f: Fn, a: number, b: number, n: number, g: Fn = () => 0): number {
  return Math.PI * riemannSum((x) => Math.abs(f(x) * f(x) - g(x) * g(x)), a, b, n, 'midpoint');
}

/** True when f and g are never on opposite sides of the axis (the washer formula needs that). */
export function sameSideOfAxis(f: Fn, g: Fn, a: number, b: number): boolean {
  for (let i = 0; i <= 200; i += 1) {
    const x = a + ((b - a) * i) / 200;
    if (f(x) * g(x) < -1e-12) return false;
  }
  return true;
}

/* ───────── drawing helpers ───────── */

/**
 * The range of values f takes on [a, b], ignoring the few extreme samples near a pole so that 1/x does not flatten
 * the picture. Returns [min, max] of the central part of 400 samples (the 2nd to the 98th percentile) widened a little.
 */
export function sampleRange(f: Fn, a: number, b: number, extra: Fn[] = []): [number, number] {
  const values: number[] = [];
  for (const g of [f, ...extra]) {
    for (let i = 0; i <= 400; i += 1) {
      const y = g(a + ((b - a) * i) / 400);
      if (Number.isFinite(y)) values.push(y);
    }
  }
  if (values.length === 0) return [-1, 1];
  values.sort((p, q) => p - q);
  const at = (fraction: number) => values[Math.min(values.length - 1, Math.max(0, Math.round(fraction * (values.length - 1))))];
  let lo = at(0.02);
  let hi = at(0.98);
  // If the whole range is small (no pole), use the true extremes.
  if (values[values.length - 1] - values[0] < 3 * (hi - lo) + 1e-9) {
    lo = values[0];
    hi = values[values.length - 1];
  }
  if (hi - lo < 1e-9) {
    lo -= 1;
    hi += 1;
  }
  const pad = (hi - lo) * 0.1;
  return [lo - pad, hi + pad];
}
