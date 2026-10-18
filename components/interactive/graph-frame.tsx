'use client';

/**
 * The shared pieces of the maths pictures (function-visual.tsx and regression-plot.tsx): a graph frame with a grid and
 * ticks, a path for a curve that breaks at a pole, a slider row, and the box where a reader types a function.
 * Everything is drawn as SVG from the --ui-* tokens (classes in app/styles/explorer.css and maths-visuals.css), and
 * every coordinate and printed number is rounded so the server and the browser write the same HTML.
 */

import { useId, useState, type ReactNode } from 'react';
import { parseExpression, type Parsed } from '@/lib/maths/expression';
import type { Fn } from '@/lib/maths/calculus';
import { fmt, niceTicks, r2 } from './picture-helpers';

export const GW = 640;
export const GH = 320;
const PAD = { left: 44, right: 14, top: 14, bottom: 30 };

export type View = { xmin: number; xmax: number; ymin: number; ymax: number };

export type Scale = {
  view: View;
  /** The pixel position (in the 640 x 320 drawing) of a value of x. */
  x(value: number): number;
  y(value: number): number;
  /** The value of x or y at a pixel position. */
  fromX(pixel: number): number;
  fromY(pixel: number): number;
  left: number;
  right: number;
  top: number;
  bottom: number;
  height: number;
};

export function makeScale(view: View, height = GH): Scale {
  const innerW = GW - PAD.left - PAD.right;
  const innerH = height - PAD.top - PAD.bottom;
  const spanX = view.xmax - view.xmin || 1;
  const spanY = view.ymax - view.ymin || 1;
  return {
    view,
    x: (value) => r2(PAD.left + ((value - view.xmin) / spanX) * innerW),
    y: (value) => r2(PAD.top + (1 - (value - view.ymin) / spanY) * innerH),
    fromX: (pixel) => view.xmin + ((pixel - PAD.left) / innerW) * spanX,
    fromY: (pixel) => view.ymin + (1 - (pixel - PAD.top) / innerH) * spanY,
    left: PAD.left,
    right: GW - PAD.right,
    top: PAD.top,
    bottom: height - PAD.bottom,
    height,
  };
}

/* ───────── numbers as text ───────── */

/**
 * A number for the reader with up to `digits` significant figures and no trailing zeros. It is rounded to 12 figures
 * first, so a value that differs in its last bits between two JavaScript engines still prints the same text.
 */
export function figures(value: number, digits = 4): string {
  if (Number.isNaN(value)) return 'undefined';
  if (!Number.isFinite(value)) return value > 0 ? 'unbounded' : 'unbounded (negative)';
  const clean = Number(value.toPrecision(12));
  if (clean === 0) return '0';
  const abs = Math.abs(clean);
  if (abs >= 1e7 || abs < 1e-4) return clean.toExponential(Math.max(1, digits - 2)).replace('e+', 'e');
  return String(Number(clean.toPrecision(digits)));
}

/** Four significant figures, the same as the other pictures print. */
export const show = (value: number): string => (Number.isFinite(value) ? fmt(Number(value.toPrecision(10))) : 'undefined');

/** A minus sign that is a real minus sign, for numbers written in running text. */
export const signed = (value: number, digits = 4): string => {
  const text = figures(value, digits);
  return text.startsWith('-') ? `−${text.slice(1)}` : text;
};

/** The same number for LaTeX: a plain hyphen-minus, and a power of ten written out. */
export function tex(value: number, digits = 4): string {
  const text = figures(value, digits);
  const match = /^(-?[\d.]+)e(-?\d+)$/.exec(text);
  return match ? `${match[1]}\\times 10^{${Number(match[2])}}` : text;
}

/* ───────── the frame ───────── */

const clipId = (raw: string) => `mv${raw.replace(/[^a-zA-Z0-9_-]/g, '')}`;

/**
 * A graph with a grid, tick numbers on the left and bottom edges, and the axes through (0, 0) when they are in view.
 * `children` is a function that gets the scale and returns what to draw; it is clipped to the plotting area.
 */
export function GraphFrame({
  view,
  label,
  height = GH,
  className = 'dx-plot',
  tickTarget = 8,
  role = 'img',
  children,
  overlay,
}: {
  view: View;
  label: string;
  height?: number;
  className?: string;
  tickTarget?: number;
  /** 'group' when the picture has controls inside it (the points of a scatter plot), so a screen reader can reach them. */
  role?: 'img' | 'group';
  children: (scale: Scale) => ReactNode;
  /** Drawn on top of everything and not clipped (labels near the edge). */
  overlay?: (scale: Scale) => ReactNode;
}) {
  const id = clipId(useId());
  const scale = makeScale(view, height);
  const xTicks = niceTicks(view.xmin, view.xmax, false, tickTarget);
  const yTicks = niceTicks(view.ymin, view.ymax, false, Math.max(3, Math.round(tickTarget / 2)));
  return (
    <svg className={className} viewBox={`0 0 ${GW} ${height}`} role={role} aria-label={label}>
      <defs>
        <clipPath id={`${id}-clip`}>
          <rect x={scale.left} y={scale.top} width={scale.right - scale.left} height={scale.bottom - scale.top} />
        </clipPath>
      </defs>
      {yTicks.map((tick) => (
        <g key={`y${tick}`}>
          <line className="dx-grid" x1={scale.left} x2={scale.right} y1={scale.y(tick)} y2={scale.y(tick)} />
          <text className="dx-tick" x={scale.left - 6} y={r2(scale.y(tick) + 4)} textAnchor="end">{fmt(tick)}</text>
        </g>
      ))}
      {xTicks.map((tick) => (
        <g key={`x${tick}`}>
          <line className="dx-grid" x1={scale.x(tick)} x2={scale.x(tick)} y1={scale.top} y2={scale.bottom} />
          <text className="dx-tick" x={scale.x(tick)} y={scale.bottom + 16} textAnchor="middle">{fmt(tick)}</text>
        </g>
      ))}
      <g clipPath={`url(#${id}-clip)`}>
        {view.ymin < 0 && view.ymax > 0 && <line className="mv-axis0" x1={scale.left} x2={scale.right} y1={scale.y(0)} y2={scale.y(0)} />}
        {view.xmin < 0 && view.xmax > 0 && <line className="mv-axis0" x1={scale.x(0)} x2={scale.x(0)} y1={scale.top} y2={scale.bottom} />}
        {children(scale)}
      </g>
      <rect className="mv-frame" x={scale.left} y={scale.top} width={scale.right - scale.left} height={scale.bottom - scale.top} />
      {overlay?.(scale)}
    </svg>
  );
}

/* ───────── curves ───────── */

/**
 * An SVG path for y = f(x) from `from` to `to`. A value that is not a number, or is far outside the view, lifts the
 * pen, and so does a jump that is bigger than the view is tall, so a curve with a vertical asymptote (1/x, tan x) is
 * drawn in separate pieces and not joined across the gap.
 */
export function curvePath(f: Fn, scale: Scale, from: number, to: number, samples = 320): string {
  const { ymin, ymax } = scale.view;
  const span = ymax - ymin;
  const parts: string[] = [];
  let pen = false;
  let previous = 0;
  for (let i = 0; i <= samples; i += 1) {
    const xv = from + ((to - from) * i) / samples;
    const yv = f(xv);
    if (!Number.isFinite(yv) || yv > ymax + 3 * span || yv < ymin - 3 * span) {
      pen = false;
      continue;
    }
    if (pen && Math.abs(yv - previous) > 1.5 * span) pen = false;
    parts.push(`${pen ? 'L' : 'M'}${scale.x(xv)} ${scale.y(yv)}`);
    pen = true;
    previous = yv;
  }
  return parts.join(' ');
}

/** A closed polygon under (or between) curves, as a path: along `top` from `from` to `to`, then back along `bottom`. */
export function bandPath(top: Fn, bottom: Fn, scale: Scale, from: number, to: number, samples = 160): string {
  const limit = 1e5;
  const clampY = (v: number) => Math.max(-limit, Math.min(limit, Number.isFinite(v) ? v : 0));
  const forward: string[] = [];
  const back: string[] = [];
  for (let i = 0; i <= samples; i += 1) {
    const xv = from + ((to - from) * i) / samples;
    forward.push(`${i === 0 ? 'M' : 'L'}${scale.x(xv)} ${scale.y(clampY(top(xv)))}`);
    back.push(`L${scale.x(to - ((to - from) * i) / samples)} ${scale.y(clampY(bottom(to - ((to - from) * i) / samples)))}`);
  }
  return `${forward.join(' ')} ${back.join(' ')} Z`;
}

/* ───────── controls ───────── */

export function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
  display,
  hint,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange(value: number): void;
  /** How the value is written beside the slider; defaults to four figures. */
  display?: (value: number) => string;
  hint?: string;
}) {
  return (
    <label className="dx-slider" title={hint}>
      <span>{label}</span>
      <input type="range" min={min} max={max} step={step} value={Math.min(max, Math.max(min, value))} onChange={(event) => onChange(Number(event.target.value))} />
      <output>{display ? display(value) : show(value)}</output>
    </label>
  );
}

/** What the reader types into a function box: it keeps the last expression that parsed, so the picture never goes blank. */
export function useFunction(initial: string, fallback = 'x') {
  const [text, setText] = useState(initial);
  const [applied, setApplied] = useState<Parsed>(() => {
    const first = parseExpression(initial);
    return first.ok ? first : (parseExpression(fallback) as Parsed);
  });
  const [error, setError] = useState<string | null>(null);
  const change = (value: string) => {
    setText(value);
    const result = parseExpression(value);
    if (result.ok) {
      setApplied(result);
      setError(null);
    } else {
      setError(result.error);
    }
  };
  return { text, applied, error, change };
}

export type Preset = { source: string; label?: string };

/** The text box for a function, with a menu of examples and the error message when the text cannot be read. */
export function FunctionField({
  name,
  value,
  error,
  onChange,
  presets,
  allowEmpty = false,
}: {
  /** The label in front of the box, for example "f(x) =". */
  name: string;
  value: string;
  error: string | null;
  onChange(value: string): void;
  presets?: Preset[];
  allowEmpty?: boolean;
}) {
  const id = useId();
  const match = presets?.find((preset) => preset.source === value);
  return (
    <div className="mv-fn">
      <label className="mv-fn-field">
        <span>{name}</span>
        <input
          type="text"
          value={value}
          spellCheck={false}
          autoCapitalize="off"
          autoComplete="off"
          autoCorrect="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          placeholder={allowEmpty ? 'leave empty for none' : undefined}
          onChange={(event) => onChange(event.target.value)}
        />
      </label>
      {presets && presets.length > 0 && (
        <label className="dx-pick">
          <span>Examples</span>
          <select value={match ? match.source : ''} onChange={(event) => event.target.value !== '' && onChange(event.target.value)}>
            <option value="">Your own</option>
            {presets.map((preset) => <option key={preset.source} value={preset.source}>{preset.label ?? preset.source}</option>)}
          </select>
        </label>
      )}
      {error && <p id={`${id}-error`} className="mv-error" role="alert">{error} The picture still shows the last function that could be read.</p>}
    </div>
  );
}
