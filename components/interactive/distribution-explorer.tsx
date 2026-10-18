'use client';

import { useId, useMemo, useState, type ReactNode } from 'react';
import {
  defaultValues,
  families,
  probabilityBetween,
  type Convention,
  type Distribution,
  type FamilyName,
  type ParamSpec,
} from '@/lib/stats/distributions';
import { MathText } from './math-text';

type Props = {
  /** The families the reader can switch between. The first one is shown first. */
  families?: FamilyName[];
  /** A single family, when the lesson is about one distribution. */
  family?: FamilyName;
  /** What a geometric or negative binomial variable counts: 'failures' (CSI213) or 'trials' (STA122). */
  convention?: Convention;
  /** Starting parameter values by key, for example `{ n: 12, p: 0.3 }`. */
  start?: Record<string, number>;
  title?: string;
};

const W = 640;
const H = 240;
const PAD = { left: 44, right: 14, top: 14, bottom: 30 };

/** Up to four significant figures, with no trailing zeros. */
function fmt(value: number): string {
  if (!Number.isFinite(value)) return '–';
  if (value === 0) return '0';
  const abs = Math.abs(value);
  if (abs >= 1000 || abs < 0.001) return value.toExponential(2);
  return String(Number(value.toPrecision(4)));
}

const clamp = (value: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, value));

/** Two decimals: the server and the browser can differ in the last digits of Math.exp and Math.log, which would break hydration. */
const r2 = (value: number) => Math.round(value * 100) / 100;

/** The slider limits for a parameter, which can depend on the other parameters. */
function limits(spec: ParamSpec, values: Record<string, number>, family: FamilyName): [number, number] {
  if (family === 'hypergeometric' && (spec.key === 'K' || spec.key === 'n')) return [spec.key === 'n' ? 1 : 0, values.N];
  if (family === 'uniform' && spec.key === 'b') return [values.a + 0.5, spec.max];
  return [spec.min, spec.max];
}

/** The points of a curve, as an SVG path. */
function linePath(points: [number, number][]): string {
  return points.map(([x, y], i) => `${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`).join(' ');
}

type Axes = { x(value: number): number; y(value: number): number };

function Plot({ label, axes, ticks, yTicks, children }: { label: string; axes: Axes; ticks: number[]; yTicks: number[]; children: ReactNode }) {
  return (
    <svg className="dx-plot" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
      {yTicks.map((tick) => (
        <g key={`y${tick}`}>
          <line className="dx-grid" x1={PAD.left} x2={W - PAD.right} y1={axes.y(tick)} y2={axes.y(tick)} />
          <text className="dx-tick" x={PAD.left - 6} y={axes.y(tick) + 4} textAnchor="end">{fmt(tick)}</text>
        </g>
      ))}
      {children}
      <line className="dx-axis" x1={PAD.left} x2={W - PAD.right} y1={H - PAD.bottom} y2={H - PAD.bottom} />
      {ticks.map((tick) => (
        <text key={`x${tick}`} className="dx-tick" x={axes.x(tick)} y={H - PAD.bottom + 16} textAnchor="middle">{fmt(tick)}</text>
      ))}
    </svg>
  );
}

/** Evenly spaced tick values over [lo, hi], whole numbers when the range is a count. */
function niceTicks(lo: number, hi: number, whole: boolean, target = 6): number[] {
  const span = hi - lo;
  if (span <= 0) return [lo];
  let step = span / target;
  const magnitude = Math.pow(10, Math.floor(Math.log10(step)));
  const norm = step / magnitude;
  step = (norm < 1.5 ? 1 : norm < 3 ? 2 : norm < 7 ? 5 : 10) * magnitude;
  if (whole) step = Math.max(1, Math.round(step));
  const ticks: number[] = [];
  for (let t = Math.ceil(lo / step) * step; t <= hi + 1e-9; t += step) ticks.push(Number(t.toFixed(10)));
  return ticks;
}

/**
 * Pick a distribution, move its parameters, and see its mass or density and its cumulative curve with the chosen
 * probability shaded. Everything is computed in lib/stats/distributions.ts and drawn as SVG from the --ui-* tokens.
 */
export function DistributionExplorer({ families: offered, family, convention = 'trials', start, title }: Props) {
  const options: FamilyName[] = offered ?? (family ? [family] : ['binomial']);
  const id = useId();
  const [name, setName] = useState<FamilyName>(options[0]);
  const [stored, setStored] = useState<Record<string, number>>(() => ({ ...defaultValues(options[0]), ...start }));
  const [range, setRange] = useState<{ a?: number; b?: number }>({});

  const { distribution, values } = useMemo(() => families[name].build(stored, convention), [name, stored, convention]);
  const model: Distribution = distribution;
  const discrete = model.kind === 'discrete';
  const [lo, hi] = discrete ? model.support : model.range;

  // The shaded interval, kept inside the picture whatever the parameters do.
  const a = clamp(range.a ?? lo, lo, hi);
  const b = clamp(range.b ?? (discrete ? Math.max(lo, Math.floor(model.mean)) : model.mean), a, hi);
  const probability = probabilityBetween(model, a, b);

  const choose = (next: FamilyName) => {
    setName(next);
    setStored({ ...defaultValues(next), ...(next === options[0] ? start : undefined) });
    setRange({});
  };

  const sliderStep = discrete ? 1 : (hi - lo) / 200;

  // Plot geometry.
  const xPad = discrete ? 0.5 : 0;
  const x = (value: number) => r2(PAD.left + ((value - (lo - xPad)) / (hi + xPad - (lo - xPad))) * (W - PAD.left - PAD.right));
  const heights = discrete
    ? Array.from({ length: hi - lo + 1 }, (_, i) => model.pmf(lo + i))
    : Array.from({ length: 201 }, (_, i) => model.pdf(lo + ((hi - lo) * i) / 200));
  const top = Math.max(...heights) * 1.12 || 1;
  const densityAxes: Axes = { x, y: (value) => r2(H - PAD.bottom - (value / top) * (H - PAD.top - PAD.bottom)) };
  const cumulativeAxes: Axes = { x, y: (value) => r2(H - PAD.bottom - value * (H - PAD.top - PAD.bottom)) };
  const xTicks = niceTicks(lo, hi, discrete);

  const description = `${families[name].title}${Object.entries(values).map(([key, value]) => `, ${key} = ${fmt(value)}`).join('')}. Mean ${fmt(model.mean)}, variance ${fmt(model.variance)}. The probability that X is between ${fmt(a)} and ${fmt(b)} is ${fmt(probability)}.`;

  // The shaded area and the cumulative curve.
  let density: ReactNode;
  let cumulative: ReactNode;
  if (model.kind === 'discrete') {
    const barWidth = r2(Math.max(1, (x(lo + 1) - x(lo)) * 0.78));
    density = heights.map((height, i) => {
      const k = lo + i;
      return <rect key={k} className="dx-bar" data-in={k >= a && k <= b ? '' : undefined} x={r2(x(k) - barWidth / 2)} width={barWidth} y={densityAxes.y(height)} height={r2(H - PAD.bottom - densityAxes.y(height))} />;
    });
    const steps: [number, number][] = [[x(lo - 0.5), cumulativeAxes.y(0)]];
    for (let k = lo; k <= hi; k += 1) {
      steps.push([x(k), cumulativeAxes.y(model.cdf(k - 1))], [x(k), cumulativeAxes.y(model.cdf(k))]);
    }
    steps.push([x(hi + 0.5), cumulativeAxes.y(model.cdf(hi))]);
    cumulative = <path className="dx-curve" d={linePath(steps)} />;
  } else {
    const points: [number, number][] = heights.map((height, i) => [x(lo + ((hi - lo) * i) / 200), densityAxes.y(height)]);
    const inside = heights.map((height, i) => ({ value: lo + ((hi - lo) * i) / 200, height })).filter(({ value }) => value >= a && value <= b);
    const area = inside.length > 1
      ? `${linePath(inside.map(({ value, height }) => [x(value), densityAxes.y(height)]))} L${x(inside[inside.length - 1].value).toFixed(1)} ${H - PAD.bottom} L${x(inside[0].value).toFixed(1)} ${H - PAD.bottom} Z`
      : '';
    density = (
      <>
        {area && <path className="dx-area" d={area} />}
        <path className="dx-curve" d={linePath(points)} />
      </>
    );
    cumulative = <path className="dx-curve" d={linePath(Array.from({ length: 201 }, (_, i): [number, number] => [x(lo + ((hi - lo) * i) / 200), cumulativeAxes.y(model.cdf(lo + ((hi - lo) * i) / 200))]))} />;
  }

  const marker = (value: number) => (
    <g>
      <line className="dx-marker" x1={x(value)} x2={x(value)} y1={PAD.top} y2={H - PAD.bottom} />
      <circle className="dx-dot" cx={x(value)} cy={cumulativeAxes.y(model.cdf(value))} r={4} />
    </g>
  );

  return (
    <section className="dx not-prose" aria-labelledby={`${id}-title`}>
      <header className="dx-head">
        <h4 id={`${id}-title`}>{title ?? `${families[name].title} distribution`}</h4>
        {options.length > 1 && (
          <label className="dx-pick">
            <span>Distribution</span>
            <select value={name} onChange={(event) => choose(event.target.value as FamilyName)}>
              {options.map((option) => <option key={option} value={option}>{families[option].title}</option>)}
            </select>
          </label>
        )}
      </header>

      <div className="dx-controls">
        {families[name].params.map((spec) => {
          const [min, max] = limits(spec, values, name);
          return (
            <label key={spec.key} className="dx-slider">
              <span>{spec.label}</span>
              <input type="range" min={min} max={max} step={spec.step} value={clamp(values[spec.key], min, max)} onChange={(event) => setStored({ ...values, [spec.key]: Number(event.target.value) })} />
              <output>{fmt(values[spec.key])}</output>
            </label>
          );
        })}
        <label className="dx-slider">
          <span>From a</span>
          <input type="range" min={lo} max={hi} step={sliderStep} value={a} onChange={(event) => setRange({ a: Number(event.target.value), b: Math.max(b, Number(event.target.value)) })} />
          <output>{fmt(a)}</output>
        </label>
        <label className="dx-slider">
          <span>To b</span>
          <input type="range" min={lo} max={hi} step={sliderStep} value={b} onChange={(event) => setRange({ a: Math.min(a, Number(event.target.value)), b: Number(event.target.value) })} />
          <output>{fmt(b)}</output>
        </label>
      </div>

      <div className="dx-plots">
        <figure>
          <figcaption>{discrete ? 'Probability of each value' : 'Density'}</figcaption>
          <Plot label={`${description} Plot of the ${discrete ? 'probability of each value' : 'density'}, with the chosen interval shaded.`} axes={densityAxes} ticks={xTicks} yTicks={niceTicks(0, top, false, 4)}>
            {density}
          </Plot>
        </figure>
        <figure>
          <figcaption>Cumulative probability, P(X ≤ x)</figcaption>
          <Plot label={`Plot of the cumulative probability, rising from 0 to 1, with the interval ends ${fmt(a)} and ${fmt(b)} marked.`} axes={cumulativeAxes} ticks={xTicks} yTicks={[0, 0.25, 0.5, 0.75, 1]}>
            {cumulative}
            {marker(a)}
            {marker(b)}
          </Plot>
        </figure>
      </div>

      <dl className="dx-readout" aria-live="polite">
        <div><dt>Probability</dt><dd>P({fmt(a)} ≤ X ≤ {fmt(b)}) = <strong>{fmt(probability)}</strong></dd></div>
        <div><dt>Mean</dt><dd>{fmt(model.mean)}</dd></div>
        <div><dt>Variance</dt><dd>{fmt(model.variance)}</dd></div>
      </dl>
      <p className="dx-formula"><MathText text={`$${model.formula}$`} /></p>
    </section>
  );
}
