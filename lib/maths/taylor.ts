/**
 * Taylor polynomials for the five series every first calculus course meets: sin x, cos x, e^x, ln(1 + x) and 1/(1 - x).
 * The polynomial of degree n about the centre a is  T_n(x) = c_0 + c_1 (x - a) + ... + c_n (x - a)^n  with
 * c_k = f^(k)(a) / k!. Here the coefficients are worked out in closed form, so no numerical differentiation is used.
 */

export type SeriesName = 'sin' | 'cos' | 'exp' | 'ln1p' | 'geometric';

export type SeriesInfo = {
  name: SeriesName;
  /** What the reader sees: "sin(x)". */
  label: string;
  /** The function as LaTeX. */
  tex: string;
  /** The function itself. */
  value(x: number): number;
  /** The coefficient of (x - a)^k, which is f^(k)(a) / k!. */
  coefficient(k: number, a: number): number;
  /** The Maclaurin term of degree k (centre 0) as LaTeX, or null when the term is zero. */
  termTex(k: number): string | null;
  /** The radius of convergence of the series about 0: Infinity for sin, cos and exp, 1 for the other two. */
  radius: number;
  /** The smallest allowed centre (the function must be defined and smooth there). */
  centreMin: number;
  /** The largest allowed centre. */
  centreMax: number;
};

const sign = (k: number) => (k % 2 === 0 ? 1 : -1);

/** x^k as LaTeX, with 1 and x for the first two. */
const power = (k: number) => (k === 0 ? '1' : k === 1 ? 'x' : `x^{${k}}`);
/** x^k / k! as LaTeX. */
const overFactorial = (k: number) => (k <= 1 ? power(k) : `\\frac{x^{${k}}}{${k}!}`);

/** The k-th derivative of sin at a divided by k!, with the pattern sin, cos, -sin, -cos. */
function circular(k: number, a: number, start: 'sin' | 'cos'): number {
  const phase = (k + (start === 'sin' ? 0 : 1)) % 4; // 0: sin, 1: cos, 2: -sin, 3: -cos
  const base = phase === 0 ? Math.sin(a) : phase === 1 ? Math.cos(a) : phase === 2 ? -Math.sin(a) : -Math.cos(a);
  return base / factorial(k);
}

export function factorial(n: number): number {
  let result = 1;
  for (let i = 2; i <= n; i += 1) result *= i;
  return result;
}

export const series: Record<SeriesName, SeriesInfo> = {
  sin: {
    name: 'sin',
    label: 'sin(x)',
    tex: '\\sin x',
    value: (x) => Math.sin(x),
    coefficient: (k, a) => circular(k, a, 'sin'),
    termTex: (k) => (k % 2 === 0 ? null : `${((k - 1) / 2) % 2 === 0 ? '' : '-'}${overFactorial(k)}`),
    radius: Infinity,
    centreMin: -6,
    centreMax: 6,
  },
  cos: {
    name: 'cos',
    label: 'cos(x)',
    tex: '\\cos x',
    value: (x) => Math.cos(x),
    coefficient: (k, a) => circular(k, a, 'cos'),
    termTex: (k) => (k % 2 === 1 ? null : `${(k / 2) % 2 === 0 ? '' : '-'}${overFactorial(k)}`),
    radius: Infinity,
    centreMin: -6,
    centreMax: 6,
  },
  exp: {
    name: 'exp',
    label: 'exp(x)',
    tex: 'e^{x}',
    value: (x) => Math.exp(x),
    coefficient: (k, a) => Math.exp(a) / factorial(k),
    termTex: (k) => overFactorial(k),
    radius: Infinity,
    centreMin: -4,
    centreMax: 4,
  },
  ln1p: {
    name: 'ln1p',
    label: 'ln(1 + x)',
    tex: '\\ln(1 + x)',
    value: (x) => (x > -1 ? Math.log(1 + x) : Number.NaN),
    coefficient: (k, a) => (k === 0 ? Math.log(1 + a) : sign(k - 1) / (k * Math.pow(1 + a, k))),
    termTex: (k) => (k === 0 ? null : `${sign(k - 1) === 1 ? '' : '-'}${k === 1 ? 'x' : `\\frac{x^{${k}}}{${k}}`}`),
    radius: 1,
    centreMin: -0.8,
    centreMax: 3,
  },
  geometric: {
    name: 'geometric',
    label: '1/(1 - x)',
    tex: '\\frac{1}{1 - x}',
    value: (x) => 1 / (1 - x),
    coefficient: (k, a) => 1 / Math.pow(1 - a, k + 1),
    termTex: (k) => power(k),
    radius: 1,
    centreMin: -3,
    centreMax: 0.8,
  },
};

export const seriesNames: SeriesName[] = ['sin', 'cos', 'exp', 'ln1p', 'geometric'];

/** The coefficients c_0 ... c_n of the Taylor polynomial of degree n about the centre a. */
export function taylorCoefficients(name: SeriesName, degree: number, centre = 0): number[] {
  const info = series[name];
  const n = Math.max(0, Math.round(degree));
  return Array.from({ length: n + 1 }, (_, k) => info.coefficient(k, centre));
}

/** T_n(x) from its coefficients, by Horner's method. */
export function taylorValue(coefficients: number[], centre: number, x: number): number {
  let result = 0;
  for (let k = coefficients.length - 1; k >= 0; k -= 1) result = result * (x - centre) + coefficients[k];
  return result;
}

/** The Taylor polynomial of degree n about a, evaluated at x. */
export function taylorPolynomial(name: SeriesName, degree: number, x: number, centre = 0): number {
  return taylorValue(taylorCoefficients(name, degree, centre), centre, x);
}

/** The Maclaurin polynomial of degree n as LaTeX: the non-zero terms up to degree n, joined with + and -. */
export function maclaurinTex(name: SeriesName, degree: number): string {
  const info = series[name];
  const terms: string[] = [];
  for (let k = 0; k <= Math.max(0, Math.round(degree)); k += 1) {
    const term = info.termTex(k);
    if (term !== null) terms.push(term);
  }
  if (terms.length === 0) return '0';
  return terms.map((term, i) => (i === 0 ? term : term.startsWith('-') ? ` - ${term.slice(1)}` : ` + ${term}`)).join('');
}
