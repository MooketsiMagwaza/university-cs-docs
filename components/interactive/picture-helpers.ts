/**
 * Small helpers shared by the picture components (simulation, Venn diagram, probability tree, counting calculator).
 * They match the ones in distribution-explorer.tsx so the pictures read the same way.
 */

/** Up to four significant figures, with no trailing zeros. */
export function fmt(value: number): string {
  if (!Number.isFinite(value)) return '–';
  if (value === 0) return '0';
  const abs = Math.abs(value);
  if (abs >= 1000 || abs < 0.001) return value.toExponential(2);
  return String(Number(value.toPrecision(4)));
}

/** A number written for LaTeX: the same figures as `fmt`, with a power of ten in place of "e-5". */
export function texNumber(value: number): string {
  const text = fmt(value);
  const match = /^(-?[\d.]+)e([+-]\d+)$/.exec(text);
  return match ? `${match[1]}\\times 10^{${Number(match[2])}}` : text;
}

/** A whole number with commas between the thousands. Written by hand so the server and the browser print the same text. */
export function fmtInt(value: number): string {
  return String(Math.round(value)).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export const clamp = (value: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, value));

/**
 * Two decimals: the server and the browser can differ in the last digits of Math.exp and Math.log, which would break
 * hydration, so every coordinate in an SVG goes through this.
 */
export const r2 = (value: number) => Math.round(value * 100) / 100;

/** Evenly spaced tick values over [lo, hi], whole numbers when the range is a count. */
export function niceTicks(lo: number, hi: number, whole: boolean, target = 6): number[] {
  const span = hi - lo;
  if (span <= 0) return [lo];
  let step = span / target;
  // The power of ten at or below the step, found with plain arithmetic: Math.log10 can differ in the last digit between engines.
  let magnitude = 1;
  while (magnitude <= step / 10) magnitude *= 10;
  while (magnitude > step) magnitude /= 10;
  const norm = step / magnitude;
  step = (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * magnitude;
  if (whole) step = Math.max(1, Math.round(step));
  const ticks: number[] = [];
  for (let t = Math.ceil(lo / step) * step; t <= hi + 1e-9; t += step) ticks.push(Number(t.toFixed(10)));
  return ticks;
}
