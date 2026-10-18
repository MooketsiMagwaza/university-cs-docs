// The safe expression parser, derivatives, Riemann sums, integrals, area and volume, and Taylor polynomials behind the
// Visualise component, checked against values worked out by hand.
// Run with: node --no-warnings --experimental-strip-types --test tests/unit/maths.test.mjs

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

const { parseExpression, toText, toTex, dependsOnX } = await import('../../lib/maths/expression.ts');
const { differentiate } = await import('../../lib/maths/derivative.ts');
const calc = await import('../../lib/maths/calculus.ts');
const taylor = await import('../../lib/maths/taylor.ts');

const close = (actual, expected, tolerance = 1e-9, message = '') =>
  assert.ok(Math.abs(actual - expected) <= tolerance, `${message} expected ${expected}, got ${actual}`);

/** Parse an expression that must be valid. */
const fn = (source) => {
  const parsed = parseExpression(source);
  assert.ok(parsed.ok, `"${source}" should parse: ${parsed.error}`);
  return parsed;
};

/* ───────── the parser ───────── */

test('the parser evaluates the operators with the usual precedence', () => {
  close(fn('x^3 - 2*x').evaluate(2), 4);
  close(fn('2 + 3*4').evaluate(0), 14);
  close(fn('(2 + 3)*4').evaluate(0), 20);
  close(fn('10 - 4 - 3').evaluate(0), 3, 1e-12, 'subtraction goes left to right');
  close(fn('24/4/3').evaluate(0), 2, 1e-12, 'division goes left to right');
  close(fn('2^3^2').evaluate(0), 512, 1e-12, 'a power goes right to left');
  close(fn('-x^2').evaluate(3), -9, 1e-12, 'a minus sign binds more loosely than a power');
  close(fn('(-x)^2').evaluate(3), 9);
  close(fn('2^-x').evaluate(1), 0.5);
  close(fn('--x').evaluate(4), 4);
  close(fn('+x').evaluate(4), 4);
  close(fn('.5 + 1.25').evaluate(0), 1.75);
});

test('the constants and functions', () => {
  close(fn('sin(pi/2)').evaluate(0), 1);
  close(fn('cos(0)').evaluate(0), 1);
  close(fn('tan(pi/4)').evaluate(0), 1, 1e-12);
  close(fn('exp(1)').evaluate(0), Math.E);
  close(fn('e^x').evaluate(2), Math.exp(2));
  close(fn('ln(e)').evaluate(0), 1);
  close(fn('sqrt(16) + abs(-3)').evaluate(0), 7);
  close(fn('π').evaluate(0), Math.PI);
  close(fn('X^2').evaluate(3), 9, 1e-12, 'capital letters are accepted');
  close(fn('sin(x)^2 + cos(x)^2').evaluate(1.234), 1, 1e-12);
  close(fn('2×3−1').evaluate(0), 5, 1e-12, 'the multiplication and minus signs a keyboard can produce');
});

test('a product can be written by putting things side by side', () => {
  close(fn('2x').evaluate(3), 6);
  close(fn('3(x+1)').evaluate(1), 6);
  close(fn('(x+1)(x-1)').evaluate(3), 8);
  close(fn('x sin(x)').evaluate(Math.PI / 2), Math.PI / 2);
  close(fn('2x^2').evaluate(3), 18, 1e-12, '2x^2 is 2*(x^2)');
  close(fn('2pi').evaluate(0), 2 * Math.PI);
  close(fn('xe').evaluate(2), 2 * Math.E);
  close(fn('x2').evaluate(5), 10);
});

test('values outside the domain are NaN or infinite, not errors', () => {
  assert.equal(fn('1/x').evaluate(0), Infinity);
  assert.ok(Number.isNaN(fn('ln(-1)').evaluate(0)));
  assert.equal(fn('ln(0)').evaluate(0), -Infinity);
  assert.ok(Number.isNaN(fn('sqrt(x)').evaluate(-4)));
  assert.ok(Number.isNaN(fn('x^0.5').evaluate(-4)));
  assert.ok(Number.isNaN(fn('0/0').evaluate(0)));
});

test('a bad expression gives an error message and never throws', () => {
  const bad = ['', '   ', '2 +', '+', '*3', '(', ')', '(1 + 2', '1 + 2)', '()', 'x +* 2', 'foo(x)', 'abc', 'log(x)', 'sin x', 'sin', '2 3', 'x ^', 'x $ 2', '1.2.3', '.', 'x = 2', 'x; 2', '1e-3 +'];
  for (const source of bad) {
    const parsed = parseExpression(source);
    // "1e-3 +" ends in a plus sign; the rest are all invalid for their own reasons.
    assert.equal(parsed.ok, false, `"${source}" should not parse`);
    assert.ok(typeof parsed.error === 'string' && parsed.error.length > 0, `"${source}" needs an error message`);
  }
  assert.match(parseExpression('log(x)').error, /ln/);
  assert.match(parseExpression('(1 + 2').error, /closed/);
  assert.match(parseExpression('sin x').error, /brackets/);
  assert.match(parseExpression('').error, /Type a function/);
});

test('nothing in the text is run as code', () => {
  const attacks = ['process.exit()', 'constructor', 'this', '__proto__', 'alert(1)', 'x; alert(1)', '`${1}`', '[]', '{}', 'Math.sin(x)', 'globalThis', 'import("fs")', 'x//2', "'a'", 'sin(x) => 1'];
  for (const source of attacks) {
    const parsed = parseExpression(source);
    assert.equal(parsed.ok, false, `"${source}" must not be accepted`);
  }
});

test('long and deeply nested expressions are refused or handled without crashing', () => {
  assert.equal(parseExpression('x+'.repeat(150)).ok, false);
  assert.equal(parseExpression('('.repeat(100) + 'x' + ')'.repeat(100)).ok, false, 'too deep');
  assert.equal(parseExpression('('.repeat(30) + 'x' + ')'.repeat(30)).ok, true);
  assert.equal(parseExpression('-'.repeat(150) + 'x').ok, true);
  assert.equal(parseExpression(Array.from({ length: 90 }, () => 'x').join('+')).ok, true);
});

test('written back, an expression means the same thing', () => {
  const sources = ['x^3 - 2*x', '-x^2', '(-x)^2', '2^-x', '2^3^2', '(2^3)^2', 'a', 'x/(x-2)', '(x^2-4)/(x-2)', 'x - (x - 1)', 'x - (-x)', '1/(2*x)', '-(x+1)*2', 'e^(-x^2)', 'sin(x)^2', 'exp(x)^2', 'sqrt(x)/x', '3*(x+1)^2', '2*-x', 'x^-1'];
  for (const source of sources) {
    const parsed = parseExpression(source);
    if (!parsed.ok) continue;
    const again = parseExpression(parsed.text);
    assert.ok(again.ok, `"${parsed.text}" (from "${source}") should parse again`);
    for (const x of [-2.5, -1, 0.5, 1.5, 3]) {
      const a = parsed.evaluate(x);
      const b = again.evaluate(x);
      assert.ok((Number.isNaN(a) && Number.isNaN(b)) || Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a)), `"${source}" vs "${parsed.text}" at ${x}: ${a} vs ${b}`);
    }
  }
  assert.equal(fn('x^3 - 2*x').text, 'x^3 - 2*x');
  assert.equal(fn('x - (x - 1)').text, 'x - (x - 1)');
  assert.equal(fn('-(x+1)').text, '-(x + 1)');
  assert.equal(fn('2^3^2').text, '2^3^2');
  assert.equal(fn('(2^3)^2').text, '(2^3)^2');
  assert.equal(fn('0.1+0.2').text, '0.1 + 0.2');
});

test('the LaTeX form', () => {
  assert.equal(fn('x^3 - 2*x').tex, 'x^{3} - 2 x');
  assert.equal(fn('1/x').tex, '\\frac{1}{x}');
  assert.equal(fn('sqrt(x)').tex, '\\sqrt{x}');
  assert.equal(fn('sin(x)').tex, '\\sin\\left(x\\right)');
  assert.equal(fn('exp(x)^2').tex, '\\left(e^{x}\\right)^{2}');
  assert.equal(fn('abs(x)').tex, '\\left|x\\right|');
  assert.equal(fn('pi*x').tex, '\\pi \\cdot x');
  assert.equal(fn('2^3').tex, '2^{3}');
  assert.equal(fn('2*3').tex, '2 \\cdot 3');
});

test('dependsOnX tells constants from functions', () => {
  assert.equal(dependsOnX(fn('2 + pi').node), false);
  assert.equal(dependsOnX(fn('sin(x)').node), true);
});

/* ───────── derivatives ───────── */

test('the numerical derivative', () => {
  close(calc.derivativeAt(Math.sin, 0), 1, 1e-9, 'd/dx sin at 0');
  close(calc.derivativeAt((x) => x ** 3, 2), 12, 1e-8);
  close(calc.derivativeAt(Math.exp, 1), Math.E, 1e-8);
  close(calc.derivativeAt(Math.log, 2), 0.5, 1e-8);
  close(calc.derivativeAt((x) => x ** 2, -3), -6, 1e-8);
  close(calc.derivativeAt((x) => x ** 2, 1000), 2000, 1e-4, 'far from 0 the step grows with x');
});

test('a secant slope approaches the tangent slope as h shrinks', () => {
  const f = (x) => x * x;
  close(calc.secantSlope(f, 3, 1), 7, 1e-12, 'x^2 at 3 with h = 1 gives 2a + h');
  close(calc.secantSlope(f, 3, 0.1), 6.1, 1e-9);
  close(calc.secantSlope(f, 3, -0.1), 5.9, 1e-9, 'a negative h looks to the left');
  close(calc.secantSlope(f, 3, 1e-6), 6, 1e-5);
});

test('the symbolic derivative', () => {
  assert.equal(differentiate(fn('x^3 - 2*x')).text, '3*x^2 - 2');
  assert.equal(differentiate(fn('x^2')).text, '2*x');
  assert.equal(differentiate(fn('5')).text, '0');
  assert.equal(differentiate(fn('sin(x)')).text, 'cos(x)');
  assert.equal(differentiate(fn('cos(x)')).text, '-sin(x)');
  assert.equal(differentiate(fn('e^x')).text, 'e^x');
  assert.equal(differentiate(fn('ln(x)')).text, '1/x');
  assert.equal(differentiate(fn('sin(2*x)')).text, '2*cos(2*x)');
  assert.equal(differentiate(fn('1/x')).text, '-1/x^2');
});

test('the symbolic derivative agrees with the numerical one on many functions', () => {
  const sources = ['x^3 - 2*x', 'x^2 + 3x - 1', 'sin(x)', 'cos(2x)', 'exp(x)', 'e^(-x^2)', 'ln(x)', 'sqrt(x)', '1/x', '(x^2 - 4)/(x - 2)', 'x*sin(x)', 'x^x', '2^x', 'tan(x)', 'abs(x)', 'sin(x)/x', '(x+1)^3', 'x^-2', 'ln(x^2 + 1)', 'sqrt(1 + x^2)', 'x^0.5', 'x*exp(-x)', 'sin(x)^2'];
  for (const source of sources) {
    const f = fn(source);
    const df = differentiate(f);
    assert.ok(parseExpression(df.text).ok, `"${df.text}" (the derivative of "${source}") should parse`);
    for (const x of [0.7, 1.3, 2.1, 3.4]) {
      const exact = df.evaluate(x);
      const numeric = calc.derivativeAt(f.evaluate, x);
      assert.ok(Math.abs(exact - numeric) <= 1e-6 * Math.max(1, Math.abs(exact)), `d/dx ${source} at ${x}: symbolic ${exact}, numeric ${numeric}`);
    }
  }
});

/* ───────── Riemann sums ───────── */

test('Riemann sums of x^2 on [0, 2] with 4 rectangles', () => {
  const f = (x) => x * x;
  close(calc.riemannSum(f, 0, 2, 4, 'left'), 1.75, 1e-12, 'left');
  close(calc.riemannSum(f, 0, 2, 4, 'right'), 3.75, 1e-12, 'right');
  close(calc.riemannSum(f, 0, 2, 4, 'midpoint'), 2.625, 1e-12, 'midpoint');
  close(calc.riemannSum(f, 0, 2, 4, 'trapezoid'), 2.75, 1e-12, 'trapezoid is the mean of left and right');
});

test('Riemann sums close in on the integral as n grows', () => {
  const f = (x) => x * x;
  for (const rule of calc.rules) {
    const coarse = Math.abs(calc.riemannSum(f, 0, 2, 10, rule) - 8 / 3);
    const fine = Math.abs(calc.riemannSum(f, 0, 2, 1000, rule) - 8 / 3);
    assert.ok(fine < coarse / 20, `${rule}: ${fine} should be far below ${coarse}`);
    assert.ok(fine < 0.01, `${rule} with 1000 pieces`);
  }
  // Increasing function: left is below, right is above.
  assert.ok(calc.riemannSum(f, 0, 2, 50, 'left') < 8 / 3);
  assert.ok(calc.riemannSum(f, 0, 2, 50, 'right') > 8 / 3);
});

test('the pieces of a Riemann sum add up to the sum and cover the interval', () => {
  const pieces = calc.riemannPieces(Math.sin, 1, 4, 7, 'trapezoid');
  assert.equal(pieces.length, 7);
  assert.equal(pieces[0].x0, 1);
  assert.equal(pieces[6].x1, 4);
  close(pieces.reduce((total, piece) => total + piece.area, 0), calc.riemannSum(Math.sin, 1, 4, 7, 'trapezoid'), 1e-12);
  const rectangles = calc.riemannPieces((x) => x, 0, 1, 4, 'left');
  assert.deepEqual(rectangles.map((piece) => piece.y0 === piece.y1), [true, true, true, true]);
  close(calc.riemannSum((x) => 3, 2, 5, 6, 'left'), 9, 1e-12, 'a constant function');
  close(calc.riemannSum((x) => x, 0, 4, 4, 'trapezoid'), 8, 1e-12, 'the trapezoid rule is exact for a line');
});

/* ───────── integrals ───────── */

test('definite integrals by adaptive Simpson', () => {
  close(calc.integrate((x) => x * x, 0, 3), 9, 1e-9);
  close(calc.integrate(Math.sin, 0, Math.PI), 2, 1e-9);
  close(calc.integrate(Math.sin, 0, 2 * Math.PI), 0, 1e-9, 'sin over a full period');
  close(calc.integrate(Math.exp, 0, 1), Math.E - 1, 1e-9);
  close(calc.integrate((x) => 1 / x, 1, Math.E), 1, 1e-9);
  close(calc.integrate((x) => Math.sqrt(x), 0, 4), 16 / 3, 1e-6, 'sqrt has an infinite slope at 0');
  close(calc.integrate(Math.abs, -1, 1), 1, 1e-9, 'a corner');
  close(calc.integrate((x) => Math.sin(40 * x), 0, Math.PI), 0, 1e-8, 'an oscillating function');
  close(calc.integrate((x) => Math.sqrt(1 - x * x), -1, 1), Math.PI / 2, 1e-6, 'a half disc');
  close(calc.integrate((x) => x * x, 3, 0), -9, 1e-9, 'reversed limits change the sign');
  assert.equal(calc.integrate((x) => x, 2, 2), 0);
  close(calc.integrate((x) => 2 * x - x * x, 0, 2), 4 / 3, 1e-10);
});

test('an integral of a function that is not finite on the interval is NaN, not a wrong number', () => {
  assert.ok(Number.isNaN(calc.integrate((x) => 1 / x, -1, 1)));
  assert.ok(Number.isNaN(calc.integrate(Math.log, 0, 1)));
  assert.ok(Number.isNaN(calc.integrate((x) => 1 / (x - 1), 0, 2)));
  assert.equal(calc.isFiniteOn((x) => 1 / x, 1, 2), true);
});

/* ───────── roots, area and volume ───────── */

test('findRoots finds sign changes and ignores poles', () => {
  const roots = calc.findRoots((x) => x ** 3 - 2 * x, -3, 3);
  assert.equal(roots.length, 3);
  close(roots[0], -Math.SQRT2, 1e-9);
  close(roots[1], 0, 1e-9);
  close(roots[2], Math.SQRT2, 1e-9);
  assert.deepEqual(calc.findRoots((x) => 1 / x, -2, 2), [], 'the sign change at a pole is not a root');
  assert.deepEqual(calc.findRoots((x) => Math.tan(x), 1, 2), [], 'tan has a pole at pi/2 and no root between 1 and 2');
  const sine = calc.findRoots(Math.sin, 0.5, 10);
  assert.equal(sine.length, 3);
  close(sine[0], Math.PI, 1e-9);
  close(sine[2], 3 * Math.PI, 1e-9);
  assert.equal(calc.findRoots((x) => x * x + 1, -5, 5).length, 0);
  assert.ok(calc.findRoots(() => 0, -1, 1).length <= 100, 'a function that is always zero does not flood the list');
});

test('area between curves', () => {
  const between = calc.areaBetween((x) => x, (x) => x * x, 0, 1);
  close(between.area, 1 / 6, 1e-10);
  assert.equal(between.pieces[0].top, 'f');
  const swapped = calc.areaBetween((x) => x * x, (x) => x, 0, 1);
  close(swapped.area, 1 / 6, 1e-10, 'the order of the curves does not change the area');
  close(swapped.signed, -1 / 6, 1e-10, 'but it changes the signed integral');
  const crossing = calc.areaBetween((x) => x, (x) => x ** 3, -1, 1);
  close(crossing.area, 0.5, 1e-9);
  close(crossing.signed, 0, 1e-9, 'the two lobes cancel in the signed integral');
  assert.equal(crossing.crossings.length, 1);
  close(crossing.crossings[0], 0, 1e-9);
  assert.equal(crossing.pieces.length, 2);
  close(calc.areaBetween((x) => 2 * x, (x) => x * x, 0, 2).area, 4 / 3, 1e-10, 'the MAT221 example');
  close(calc.areaBetween(Math.sin, () => 0, 0, 2 * Math.PI).area, 4, 1e-8, 'total area of one sine period');
  close(calc.areaBetween(Math.sin, () => 0, 0, 2 * Math.PI).signed, 0, 1e-8);
});

test('volumes of revolution about the x-axis', () => {
  close(calc.volumeOfRevolution((x) => x, 0, 3), 9 * Math.PI, 1e-8, 'the cone from y = x on [0, 3]');
  close(calc.volumeOfRevolution(Math.sqrt, 0, 4), 8 * Math.PI, 1e-6, 'y = sqrt(x) on [0, 4]');
  close(calc.volumeOfRevolution((x) => Math.sqrt(1 - x * x), -1, 1), (4 * Math.PI) / 3, 1e-6, 'the unit sphere');
  close(calc.volumeOfRevolution((x) => 5, 0, 2), 50 * Math.PI, 1e-9, 'a cylinder of radius 5 and length 2');
  close(calc.volumeOfRevolution((x) => 2 * x, 0, 2, (x) => x * x), (64 * Math.PI) / 15, 1e-8, 'washers: outer 2x, inner x^2');
  close(calc.volumeByDiscs((x) => x, 0, 3, 1000), 9 * Math.PI, 1e-3, 'many discs');
  const few = Math.abs(calc.volumeByDiscs((x) => x * x, 0, 2, 4) - calc.volumeOfRevolution((x) => x * x, 0, 2));
  const many = Math.abs(calc.volumeByDiscs((x) => x * x, 0, 2, 400) - calc.volumeOfRevolution((x) => x * x, 0, 2));
  assert.ok(many < few / 100, 'more discs, a better volume');
  assert.equal(calc.sameSideOfAxis((x) => x + 1, (x) => 0, 0, 2), true);
  assert.equal(calc.sameSideOfAxis((x) => x, (x) => -x, 1, 2), false);
});

test('sampleRange keeps a pole from flattening the picture', () => {
  const [lo, hi] = calc.sampleRange((x) => 1 / x, -3, 3);
  assert.ok(hi - lo < 60, `the range for 1/x on [-3, 3] was ${lo} to ${hi}`);
  const [low, high] = calc.sampleRange((x) => x * x, -2, 2);
  assert.ok(low < 0.01 && high > 4, 'a parabola keeps its true extremes');
  const [flat1, flat2] = calc.sampleRange(() => 3, 0, 1);
  assert.ok(flat1 < 3 && flat2 > 3, 'a constant function still gets a window');
});

/* ───────── Taylor polynomials ───────── */

test('Taylor polynomial of e^x of degree 3 about 0, evaluated at 1', () => {
  assert.deepEqual(taylor.taylorCoefficients('exp', 3), [1, 1, 1 / 2, 1 / 6]);
  close(taylor.taylorPolynomial('exp', 3, 1), 1 + 1 + 1 / 2 + 1 / 6, 1e-12);
  close(taylor.taylorPolynomial('exp', 3, 1), 8 / 3, 1e-12);
});

test('Taylor polynomial of e^x about 1', () => {
  const coefficients = taylor.taylorCoefficients('exp', 3, 1);
  close(coefficients[0], Math.E, 1e-12);
  close(coefficients[3], Math.E / 6, 1e-12);
  close(taylor.taylorValue(coefficients, 1, 1), Math.E, 1e-12, 'at the centre the polynomial equals the function');
  close(taylor.taylorValue(coefficients, 1, 2), Math.E * (1 + 1 + 1 / 2 + 1 / 6), 1e-12);
});

test('the Maclaurin coefficients of sin, cos, ln(1 + x) and 1/(1 - x)', () => {
  const same = (actual, expected) => {
    assert.equal(actual.length, expected.length);
    expected.forEach((value, i) => close(actual[i], value, 1e-12, `coefficient ${i}`));
  };
  same(taylor.taylorCoefficients('sin', 5), [0, 1, 0, -1 / 6, 0, 1 / 120]);
  same(taylor.taylorCoefficients('cos', 4), [1, 0, -1 / 2, 0, 1 / 24]);
  same(taylor.taylorCoefficients('ln1p', 4), [0, 1, -1 / 2, 1 / 3, -1 / 4]);
  same(taylor.taylorCoefficients('geometric', 3), [1, 1, 1, 1]);
  close(taylor.taylorPolynomial('sin', 5, 1), 1 - 1 / 6 + 1 / 120, 1e-12);
  close(taylor.taylorPolynomial('geometric', 20, 0.5), 2, 1e-5);
  close(taylor.taylorPolynomial('ln1p', 4, 0.5), 0.5 - 0.125 + 0.5 ** 3 / 3 - 0.5 ** 4 / 4, 1e-12);
});

test('the coefficients about any centre match the derivatives', () => {
  for (const name of taylor.seriesNames) {
    const info = taylor.series[name];
    for (const centre of [0, 0.5, -0.3, 1.2].filter((a) => a >= info.centreMin && a <= info.centreMax)) {
      const c = taylor.taylorCoefficients(name, 2, centre);
      close(c[0], info.value(centre), 1e-12, `${name} c0 at ${centre}`);
      close(c[1], (info.value(centre + 1e-5) - info.value(centre - 1e-5)) / 2e-5, 1e-6, `${name} c1 at ${centre}`);
      close(c[2], (info.value(centre + 1e-3) - 2 * info.value(centre) + info.value(centre - 1e-3)) / 2e-6, 1e-4, `${name} c2 at ${centre}`);
    }
  }
});

test('a higher degree is closer inside the radius of convergence and worse outside it', () => {
  const error = (name, degree, x) => Math.abs(taylor.taylorPolynomial(name, degree, x) - taylor.series[name].value(x));
  assert.ok(error('sin', 11, 2) < 1e-5);
  assert.ok(error('sin', 5, 2) > error('sin', 11, 2));
  assert.ok(error('exp', 15, 3) < 1e-4);
  assert.ok(error('ln1p', 10, 0.5) < error('ln1p', 4, 0.5));
  assert.ok(error('ln1p', 10, 1.5) > error('ln1p', 4, 1.5), 'outside |x| < 1 more terms do worse');
  assert.ok(error('geometric', 10, 2) > error('geometric', 4, 2));
  assert.equal(taylor.series.ln1p.radius, 1);
  assert.equal(taylor.series.sin.radius, Infinity);
});

test('Maclaurin polynomials written in LaTeX', () => {
  assert.equal(taylor.maclaurinTex('sin', 5), 'x - \\frac{x^{3}}{3!} + \\frac{x^{5}}{5!}');
  assert.equal(taylor.maclaurinTex('cos', 4), '1 - \\frac{x^{2}}{2!} + \\frac{x^{4}}{4!}');
  assert.equal(taylor.maclaurinTex('exp', 2), '1 + x + \\frac{x^{2}}{2!}');
  assert.equal(taylor.maclaurinTex('ln1p', 3), 'x - \\frac{x^{2}}{2} + \\frac{x^{3}}{3}');
  assert.equal(taylor.maclaurinTex('geometric', 3), '1 + x + x^{2} + x^{3}');
  assert.equal(taylor.maclaurinTex('sin', 0), '0');
});

test('the text and LaTeX forms are strings the page can print', () => {
  assert.equal(typeof toText(fn('x^2').node), 'string');
  assert.equal(typeof toTex(fn('x^2').node), 'string');
});

/* ───────── transformations ───────── */

test('the transformation y = a f(b(x - c)) + d is written out with the numbers put in', async () => {
  const { transformed } = await import('../../lib/maths/transform.ts');
  const text = (source, a, b, c, d) => transformed(fn(source), a, b, c, d).text;
  assert.equal(text('x^2', 1, 1, 0, 0), 'x^2');
  assert.equal(text('x^2', 2, 1, 1, 3), '2*(x - 1)^2 + 3');
  assert.equal(text('x^2', 1, 1, -2, 0), '(x + 2)^2');
  assert.equal(text('sqrt(x)', -1, 1, 0, 0), '-sqrt(x)');
  assert.equal(text('sqrt(x)', 1, -1, 0, 0), 'sqrt(-x)');
  assert.equal(text('1/x', 1, 1, 2, 0), '1/(x - 2)');
  assert.equal(text('sin(x)', 3, 2, 0, -1), '3*sin(2*x) - 1');
  // The formula means what the sliders mean.
  const f = fn('x^3 - 2*x');
  for (const [a, b, c, d] of [[2, 1, 1, 0], [-1.5, 0.5, -2, 3], [1, -2, 0.5, -1]]) {
    const g = transformed(f, a, b, c, d);
    for (const x of [-2, -0.5, 0.7, 3]) close(g.evaluate(x), a * f.evaluate(b * (x - c)) + d, 1e-9, `at ${x}`);
  }
});

/* ───────── the predict-and-reveal answers ───────── */

test('every predict-and-reveal question is valid and its answer is right', async () => {
  const { problemWith } = await import('../../lib/predict-data.ts');
  const { linearRegression } = await import('../../lib/maths/regression.ts');
  const dataRoot = new URL('../../content/predict-data/', import.meta.url);
  const walk = (dir) => fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => (entry.isDirectory() ? walk(new URL(`${entry.name}/`, dir)) : [new URL(entry.name, dir)]));
  const f = (source) => fn(source).evaluate;
  const FIVE = [[1, 2], [2, 4], [3, 5], [4, 4], [5, 5]];
  const fit = (points) => linearRegression(points).fit;

  // For each question: the true number, or the text of the option that is true. Worked out from the library, not from the data.
  const truth = {
    'sem1/mat111/01-functions/notes': {
      // g(x) = f(x - 3) takes the value f(0) at x = 3: the minimum of x^2 moves from 0 to 3.
      'shift-direction': () => (f('(x - 3)^2')(3) < f('(x - 3)^2')(2.9) && f('(x - 3)^2')(3) < f('(x - 3)^2')(3.1) ? '3 units to the right' : 'wrong'),
      'shifted-value': () => {
        const base = (x) => x + 3; // any function with base(2) = 5
        return base(5 - 3);
      },
      // f(-x) is f reflected in the y-axis: the value at -x is the old value at x, which is not minus the old value.
      'reflect-inside': () => {
        const base = f('x^3 + x^2');
        const g = (x) => base(-x);
        return [-2, 0.5, 3].every((x) => Math.abs(g(-x) - base(x)) < 1e-12) && Math.abs(g(2) - -base(2)) > 1 ? 'It is reflected in the $y$-axis' : 'wrong';
      },
    },
    'sem1/mat111/02-polynomials-rational/notes': {
      'roots-after-shift': () => ({ 0: 'Never', 1: 'Once', 2: 'Twice', 3: 'Three times' })[calc.findRoots(f('x^3 - 2*x + 2'), -6, 6).length],
      'hole-height': () => (f('(x^2 - 4)/(x - 2)')(2 - 1e-7) + f('(x^2 - 4)/(x - 2)')(2 + 1e-7)) / 2,
    },
    'sem1/mat111/03-exponential-logarithmic/notes': {
      'exp-asymptote': () => f('2^x + 3')(-60),
      'log-asymptote': () => (Number.isNaN(f('ln(x - 2)')(1.99)) && f('ln(x - 2)')(2.0000001) < -10 ? '$x=2$' : 'wrong'),
    },
    'sem1/mat111/04-trigonometry/notes': {
      'period': () => {
        const g = f('3*sin(2*x)');
        const repeats = (p) => [0.1, 0.7, 1.9].every((x) => Math.abs(g(x + p) - g(x)) < 1e-9);
        return repeats(Math.PI) && !repeats(Math.PI / 2) ? Math.PI : Number.NaN;
      },
      'sine-range': () => {
        const g = f('2*sin(x) + 1');
        const values = Array.from({ length: 6284 }, (_, i) => g(i / 1000));
        return Math.abs(Math.min(...values) + 1) < 1e-4 && Math.abs(Math.max(...values) - 3) < 1e-4 ? '$[-1,3]$' : 'wrong';
      },
    },
    'sem2/mat122/01-limits-continuity/notes': {
      'limit-sinc': () => (f('sin(x)/x')(-1e-5) + f('sin(x)/x')(1e-5)) / 2,
      'limit-abs': () => (f('abs(x)/x')(-1e-9) === -1 && f('abs(x)/x')(1e-9) === 1 ? 'The limit does not exist' : 'wrong'),
    },
    'sem2/mat122/02-differentiation/notes': {
      'slope-negative': () => calc.derivativeAt(f('x^2'), -1.5),
      'corner': () => {
        const g = f('abs(x)');
        const left = calc.secantSlope(g, 0, -1e-6);
        const right = calc.secantSlope(g, 0, 1e-6);
        return Math.abs(left - -1) < 1e-9 && Math.abs(right - 1) < 1e-9 ? 'No: the slope from the left is $-1$ and from the right is $1$' : 'wrong';
      },
    },
    'sem2/mat122/03-applications-differentiation/notes': {
      'linear-estimate': () => f('sqrt(x)')(4) + calc.derivativeAt(f('sqrt(x)'), 4) * 0.4,
    },
    'sem2/mat122/04-integration/notes': {
      'left-below': () => (calc.riemannSum(f('x^2'), 0, 2, 4, 'left') < calc.integrate(f('x^2'), 0, 2) && calc.riemannSum(f('x^2'), 0, 2, 40, 'left') < calc.integrate(f('x^2'), 0, 2) ? 'Smaller' : 'wrong'),
      'left-sum': () => calc.riemannSum(f('x^2'), 0, 2, 4, 'left'),
    },
    'sem2/mat122/05-applications-integration/notes': {
      'area-between': () => calc.areaBetween(f('2*x'), f('x^2'), 0, 2).area,
      'disc-volume': () => calc.volumeOfRevolution(f('sqrt(x)'), 0, 4),
    },
    'sem3/csi213/07-regression-analysis/notes/MLS-OLS': {
      'middle-point': () => {
        const before = fit(FIVE);
        const after = fit(FIVE.map(([x, y]) => (x === 3 ? [3, 7] : [x, y])));
        const same = Math.abs(before.slope - 0.6) < 1e-12 && Math.abs(after.slope - 0.6) < 1e-12;
        const lifted = Math.abs(before.intercept - 2.2) < 1e-12 && Math.abs(after.intercept - 2.6) < 1e-12;
        return same && lifted ? 'The slope stays at 0.6 and the intercept rises to 2.6' : 'wrong';
      },
    },
    'sem3/csi213/07-regression-analysis/notes/ANOVA': {
      'outlier': () => {
        const base = fit(FIVE);
        const after = fit([...FIVE, [6, 0]]);
        const ok = Math.abs(base.rSquared - 0.6) < 1e-12 && after.slope < 0 && Math.abs(after.slope + 0.23) < 0.005 && after.rSquared < 0.1 && Math.abs(after.rSquared - 0.047) < 0.001;
        return ok ? 'The slope turns negative and $R^2$ falls below $0.1$' : 'wrong';
      },
      // For a fit with a negative correlation R squared is r squared, so r = -0.8 gives 0.64.
      'r-squared-from-r': () => {
        const falling = fit(FIVE.map(([x, y]) => [x, 10 - y]));
        return falling.r < 0 && Math.abs(falling.rSquared - falling.r * falling.r) < 1e-12 ? (-0.8) ** 2 : Number.NaN;
      },
    },
    'sem3/mat221/01-foundations/notes': {
      'ftc-value': () => (Math.abs(calc.riemannSum(f('x^2'), 0, 3, 6, 'left') - 6.875) < 1e-12 ? calc.integrate(f('x^2'), 0, 3) : Number.NaN),
    },
    'sem3/mat221/10-numerical-integration/notes': {
      'trapezoid-direction': () => {
        const t = calc.riemannSum(f('x^2'), 0, 2, 4, 'trapezoid');
        const m = calc.riemannSum(f('x^2'), 0, 2, 4, 'midpoint');
        return Math.abs(t - 2.75) < 1e-12 && Math.abs(m - 2.625) < 1e-12 && t > 8 / 3 && m < 8 / 3 ? 'It is too big' : 'wrong';
      },
    },
    'sem3/mat221/11-applications/notes': {
      'area-between': () => calc.areaBetween(f('2*x'), f('x^2'), 0, 2).area,
      'washer-volume': () => calc.volumeOfRevolution(f('2*x'), 0, 2, f('x^2')),
    },
    'sem3/mat221/15-taylor-series/notes': {
      'estimate-e': () => taylor.taylorPolynomial('exp', 3, 1),
    },
  };

  let checked = 0;
  for (const url of walk(dataRoot).filter((file) => file.pathname.endsWith('.json'))) {
    const rel = decodeURIComponent(url.pathname.slice(dataRoot.pathname.length)).replace('.json', '');
    const file = JSON.parse(fs.readFileSync(url, 'utf8'));
    for (const [id, question] of Object.entries(file.predictions)) {
      assert.equal(problemWith(question), null, `${rel} / ${id} is not valid`);
      const check = truth[rel]?.[id];
      assert.ok(check, `${rel} / ${id} has no independent check in this test`);
      const expected = check();
      if (question.type === 'number') {
        assert.ok(typeof expected === 'number' && Number.isFinite(expected), `${rel} / ${id}: the check did not give a number (${expected})`);
        close(question.answer, expected, 1e-6, `${rel} / ${id}: the stored answer`);
      } else {
        assert.equal(question.options[question.correctIndex], expected, `${rel} / ${id}: the option marked right`);
        assert.equal(new Set(question.options).size, question.options.length, `${rel} / ${id}: two options are the same`);
      }
      checked += 1;
    }
  }
  assert.ok(checked >= 26, `only ${checked} questions were checked`);
});

test('the checker for a prediction names what is wrong with it', async () => {
  const { problemWith } = await import('../../lib/predict-data.ts');
  assert.equal(problemWith(null), 'it is not an object');
  assert.match(problemWith({ type: 'choice', question: 'q', explanation: 'e', options: ['a'], correctIndex: 0 }), /at least two/);
  assert.match(problemWith({ type: 'choice', question: 'q', explanation: 'e', options: ['a', 'b'], correctIndex: 2 }), /correctIndex/);
  assert.match(problemWith({ type: 'choice', question: 'q', explanation: 'e', options: ['a', 'b'], correctIndex: 1, optionFeedback: ['x'] }), /optionFeedback/);
  assert.match(problemWith({ type: 'number', question: 'q', explanation: 'e', answer: 'four', tolerance: 0 }), /answer/);
  assert.match(problemWith({ type: 'number', question: 'q', explanation: 'e', answer: 4, tolerance: -1 }), /tolerance/);
  assert.match(problemWith({ type: 'essay', question: 'q', explanation: 'e' }), /type/);
  assert.match(problemWith({ type: 'number', question: '', explanation: 'e', answer: 4, tolerance: 0 }), /question/);
  assert.equal(problemWith({ type: 'number', question: 'q', explanation: 'e', answer: 4, tolerance: 0 }), null);
});
