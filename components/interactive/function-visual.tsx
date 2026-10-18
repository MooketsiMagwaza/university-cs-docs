'use client';

import { useId, useMemo, useState, type ReactNode } from 'react';
import {
  areaBetween,
  derivativeAt,
  findRoots,
  integrate,
  isFiniteOn,
  riemannPieces,
  riemannSum,
  rules,
  sameSideOfAxis,
  sampleRange,
  secantSlope,
  volumeByDiscs,
  volumeOfRevolution,
  type Fn,
  type Rule,
} from '@/lib/maths/calculus';
import { differentiate } from '@/lib/maths/derivative';
import { parseExpression, type Parsed } from '@/lib/maths/expression';
import { maclaurinTex, series, seriesNames, taylorCoefficients, taylorValue, type SeriesName } from '@/lib/maths/taylor';
import { transformed } from '@/lib/maths/transform';
import { bandPath, curvePath, figures, FunctionField, GraphFrame, Slider, show, signed, tex, useFunction, type Preset, type Scale, type View } from './graph-frame';
import { MathText } from './math-text';
import { NumberField } from './number-field';
import { r2 } from './picture-helpers';

export type VisualiseKind = 'graph' | 'limit' | 'tangent' | 'riemann' | 'area-between' | 'revolution' | 'taylor';

export type VisualiseProps = {
  /** Which picture: graph, limit, tangent, riemann, area-between, revolution or taylor. */
  kind: VisualiseKind;
  /** The function, written in x: "x^3 - 2*x". For `taylor` it names the series: "sin(x)", "cos(x)", "exp(x)", "ln(1 + x)" or "1/(1 - x)". */
  fn?: string;
  /** A second function: the lower curve for `area-between`, the inner curve (the hole) for `revolution`. */
  fn2?: string;
  /** The interval [a, b] for `riemann`, `area-between`, `revolution`, and the x range of `tangent`. */
  interval?: [number, number];
  /** The starting point: where a limit is taken, where the tangent touches, where a series is evaluated, where a graph is tracked. */
  point?: number;
  /** Starting values: a, b, c, d (graph); n (riemann, revolution); h (tangent); degree, centre (taylor). */
  params?: Record<string, number>;
  /** The Riemann rule to start with: left, right, midpoint or trapezoid. */
  rule?: Rule;
  /** The window to draw, as [xmin, xmax, ymin, ymax]. */
  view?: [number, number, number, number];
  title?: string;
};

const KINDS: VisualiseKind[] = ['graph', 'limit', 'tangent', 'riemann', 'area-between', 'revolution', 'taylor'];

/* ───────── pieces shared by every kind ───────── */

function Card({ title, what, children }: { title: string; what: string; children: ReactNode }) {
  const id = useId();
  return (
    <section className="dx pic mv not-prose" aria-labelledby={`${id}-title`}>
      <header className="dx-head">
        <h4 id={`${id}-title`}>{title}</h4>
      </header>
      <p className="pic-what">{what}</p>
      {children}
    </section>
  );
}

const Row = ({ children }: { children: ReactNode }) => <div className="mv-row">{children}</div>;
const Readout = ({ children }: { children: ReactNode }) => <dl className="dx-readout mv-readout" aria-live="polite">{children}</dl>;
const Item = ({ term, children }: { term: string; children: ReactNode }) => <div><dt>{term}</dt><dd>{children}</dd></div>;
const Maths = ({ children }: { children: string }) => <MathText text={`$${children}$`} />;

const asPresets = (sources: string[], page?: string): Preset[] => {
  const list = sources.map((source) => ({ source }));
  return page && !sources.includes(page) ? [{ source: page }, ...list] : list;
};

const num = (value: number | undefined, fallback: number) => (typeof value === 'number' && Number.isFinite(value) ? value : fallback);

/** The window to draw: the author's, or a default. */
function windowFrom(view: VisualiseProps['view'], fallback: View): View {
  return view ? { xmin: view[0], xmax: view[1], ymin: view[2], ymax: view[3] } : fallback;
}

/** A y window that holds 0 and the values, with a margin. */
function holdZero(lo: number, hi: number): [number, number] {
  const low = Math.min(lo, 0);
  const high = Math.max(hi, 0);
  const pad = (high - low || 1) * 0.07;
  return [low - pad, high + pad];
}

/** Largest absolute value of the functions on [a, b], for sizing a symmetrical window. */
function largest(fns: Fn[], a: number, b: number): number {
  let best = 0;
  for (const f of fns) {
    for (let i = 0; i <= 200; i += 1) {
      const y = Math.abs(f(a + ((b - a) * i) / 200));
      if (Number.isFinite(y) && y > best) best = y;
    }
  }
  return best > 0 ? best : 1;
}

/** Two bounds that stay in order. */
function Bounds({ a, b, onA, onB, labelA = 'From a', labelB = 'To b' }: { a: number; b: number; onA(v: number): void; onB(v: number): void; labelA?: string; labelB?: string }) {
  return (
    <>
      <NumberField label={labelA} value={a} min={-50} max={50} step={0.5} onChange={(value) => onA(Math.min(value, b - 0.1))} />
      <NumberField label={labelB} value={b} min={-50} max={50} step={0.5} onChange={(value) => onB(Math.max(value, a + 0.1))} />
    </>
  );
}

/** A number in LaTeX, in brackets when it is negative, so that a - (-b) does not print as a - -b. */
const bracket = (value: number) => (value < 0 ? `(${tex(value)})` : tex(value));

const pointText = (x: number, y: number) => `(${signed(x)}, ${signed(y)})`;

/* ───────── graph: y = a f(b(x - c)) + d ───────── */

const GRAPH_PRESETS = ['x^2', 'x^3', 'sqrt(x)', 'abs(x)', '1/x', 'sin(x)', 'cos(x)', '2^x', 'exp(x)', 'ln(x)'];

function describeTransform(a: number, b: number, c: number, d: number): string {
  const steps: string[] = [];
  if (a === 0) {
    steps.push('flattened onto a horizontal line, because a = 0');
  } else {
    if (Math.abs(a) > 1) steps.push(`stretched vertically by a factor of ${show(Math.abs(a))}`);
    if (Math.abs(a) < 1) steps.push(`squashed vertically to ${show(Math.abs(a))} of its height`);
    if (a < 0) steps.push('reflected in the x-axis');
  }
  if (b === 0) {
    steps.push('made constant, because b = 0 turns b(x − c) into 0');
  } else {
    if (Math.abs(b) > 1) steps.push(`squeezed horizontally by a factor of ${show(Math.abs(b))}`);
    if (Math.abs(b) < 1) steps.push(`stretched horizontally by a factor of ${show(1 / Math.abs(b))}`);
    if (b < 0) steps.push('reflected in the y-axis');
  }
  if (c !== 0) steps.push(`shifted ${show(Math.abs(c))} to the ${c > 0 ? 'right' : 'left'}`);
  if (d !== 0) steps.push(`shifted ${show(Math.abs(d))} ${d > 0 ? 'up' : 'down'}`);
  if (steps.length === 0) return 'No change: the graph is the graph of f itself.';
  const last = steps[steps.length - 1];
  const head = steps.slice(0, -1);
  return `The graph of f is ${head.length > 0 ? `${head.join(', ')} and ${last}` : last}.`;
}

/** Features of the moved graph that the course notes name, for the functions they use. */
function graphFeatures(source: string, a: number, b: number, c: number, d: number): { text: string; vertical?: number; horizontal?: number } | null {
  if (a === 0 || b === 0) return null;
  switch (source.replace(/\s+/g, '')) {
    case 'sin(x)':
    case 'cos(x)':
      return { text: `Amplitude |a| = ${show(Math.abs(a))}, period 2π/|b| = ${show((2 * Math.PI) / Math.abs(b))}, midline y = ${signed(d)}, shift c = ${signed(c)}.`, horizontal: d };
    case '1/x':
      return { text: `Vertical asymptote x = ${signed(c)}, horizontal asymptote y = ${signed(d)}.`, vertical: c, horizontal: d };
    case '2^x':
    case 'exp(x)':
      return { text: `Horizontal asymptote y = ${signed(d)}. The graph stays on one side of it.`, horizontal: d };
    case 'ln(x)':
      return { text: `Vertical asymptote x = ${signed(c)}. The graph exists only ${b > 0 ? 'to the right' : 'to the left'} of it.`, vertical: c };
    case 'sqrt(x)':
      return { text: `The graph starts at ${pointText(c, d)} and extends to the ${b > 0 ? 'right' : 'left'}.` };
    case 'abs(x)':
    case 'x^2':
      return { text: `Vertex at ${pointText(c, d)}.` };
    case 'x^3':
      return { text: `Centre of symmetry (the point of inflection) at ${pointText(c, d)}.` };
    default:
      return null;
  }
}

function GraphView({ fn = 'x^2', params, view: viewProp, point }: VisualiseProps) {
  const { text, applied, error, change } = useFunction(fn);
  const [a, setA] = useState(num(params?.a, 1));
  const [b, setB] = useState(num(params?.b, 1));
  const [c, setC] = useState(num(params?.c, 0));
  const [d, setD] = useState(num(params?.d, 0));
  const [u, setU] = useState(num(point, 1));

  const view = windowFrom(viewProp, { xmin: -6.5, xmax: 6.5, ymin: -5, ymax: 5 });
  const f = applied.evaluate;
  const g: Fn = (x) => a * f(b * (x - c)) + d;
  const moved = useMemo(() => transformed(applied, a, b, c, d), [applied, a, b, c, d]);
  const zeros = findRoots(g, view.xmin, view.xmax);
  const features = graphFeatures(text, a, b, c, d);
  const fu = f(u);
  const image: [number, number] | null = b !== 0 && Number.isFinite(fu) ? [c + u / b, a * fu + d] : null;
  const reset = () => {
    setA(1);
    setB(1);
    setC(0);
    setD(0);
  };

  const label = `Graph of f(x) = ${applied.text} drawn dashed, and of y = ${moved.text} drawn solid. a = ${show(a)}, b = ${show(b)}, c = ${show(c)}, d = ${show(d)}. ${describeTransform(a, b, c, d)}`;

  return (
    <Card title="Transform a graph" what="The dashed curve is the graph of f. The solid curve is y = a f(b(x − c)) + d. Move the four sliders and watch what each one does.">
      <FunctionField name="f(x) =" value={text} error={error} onChange={change} presets={asPresets(GRAPH_PRESETS, fn)} />
      <div className="dx-controls">
        <Slider label="a (vertical stretch)" value={a} min={-3} max={3} step={0.1} onChange={setA} />
        <Slider label="b (horizontal)" value={b} min={-3} max={3} step={0.1} onChange={setB} />
        <Slider label="c (shift right)" value={c} min={-5} max={5} step={0.1} onChange={setC} />
        <Slider label="d (shift up)" value={d} min={-4} max={4} step={0.1} onChange={setD} />
        <Slider label="Track x =" value={u} min={-4} max={4} step={0.1} onChange={setU} hint="A point on the graph of f, and where it goes" />
      </div>
      <Row>
        <button type="button" className="ui-btn ui-btn-sm" onClick={reset}>Reset the sliders</button>
      </Row>

      <figure className="pic-figure">
        <GraphFrame view={view} label={label}>
          {(s) => (
            <>
              {features?.vertical !== undefined && <line className="mv-asymptote" x1={s.x(features.vertical)} x2={s.x(features.vertical)} y1={s.top} y2={s.bottom} />}
              {features?.horizontal !== undefined && <line className="mv-asymptote" x1={s.left} x2={s.right} y1={s.y(features.horizontal)} y2={s.y(features.horizontal)} />}
              <path className="mv-base" d={curvePath(f, s, view.xmin, view.xmax)} />
              <path className="dx-curve" d={curvePath(g, s, view.xmin, view.xmax)} />
              {Number.isFinite(fu) && image && (
                <>
                  <line className="mv-link" x1={s.x(u)} y1={s.y(fu)} x2={s.x(image[0])} y2={s.y(image[1])} />
                  <circle className="mv-dot-open" cx={s.x(u)} cy={s.y(fu)} r={5} />
                  <circle className="mv-dot" cx={s.x(image[0])} cy={s.y(image[1])} r={5} />
                </>
              )}
            </>
          )}
        </GraphFrame>
        <p className="pic-key"><span className="mv-key-base">Graph of f</span> <span className="mv-key-f">Transformed graph</span></p>
      </figure>

      <Readout>
        <Item term="Formula"><Maths>{`y = ${moved.tex}`}</Maths></Item>
        <Item term="What changed">{describeTransform(a, b, c, d)}</Item>
        {features && <Item term="Features">{features.text}</Item>}
        <Item term="Crossing the x-axis">{zeros.length === 0 ? 'The graph does not cross the x-axis in this window.' : zeros.length > 6 ? 'At many places in this window.' : `At x = ${zeros.map((root) => signed(root)).join(', ')}.`}</Item>
        <Item term="Tracked point">
          {image ? `The point ${pointText(u, fu)} on the graph of f moves to ${pointText(image[0], image[1])}.` : Number.isFinite(fu) ? 'With b = 0 every point lands on one height.' : `f is not defined at x = ${signed(u)}.`}
        </Item>
      </Readout>
    </Card>
  );
}

/* ───────── limit ───────── */

const LIMIT_PRESETS: { source: string; point: number }[] = [
  { source: '(x^2 - 4)/(x - 2)', point: 2 },
  { source: 'sin(x)/x', point: 0 },
  { source: 'abs(x)/x', point: 0 },
  { source: '1/x', point: 0 },
  { source: '1/x^2', point: 0 },
  { source: '(sqrt(x + 1) - 1)/x', point: 0 },
  { source: 'x^2', point: 3 },
];

const H_STEPS = [1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01, 0.005, 0.002, 0.001, 0.0005, 0.0002, 0.0001];

type LimitVerdict = { kind: 'agree' | 'differ' | 'unbounded' | 'one-sided' | 'undefined'; value?: number; left: number; right: number };

/** What f does very close to a on each side, with a step so small that the table cannot show it all. */
function judgeLimit(f: Fn, a: number): LimitVerdict {
  const e = 1e-6 * Math.max(1, Math.abs(a));
  const left = f(a - e);
  const right = f(a + e);
  const big = (v: number) => Math.abs(v) > 1e4 && !Number.isNaN(v);
  if (big(left) || big(right)) return { kind: 'unbounded', left, right };
  const okLeft = Number.isFinite(left);
  const okRight = Number.isFinite(right);
  if (okLeft && okRight) {
    const agree = Math.abs(left - right) <= 1e-3 * Math.max(1, Math.abs(left), Math.abs(right));
    return agree ? { kind: 'agree', value: (left + right) / 2, left, right } : { kind: 'differ', left, right };
  }
  if (okLeft || okRight) return { kind: 'one-sided', value: okLeft ? left : right, left, right };
  return { kind: 'undefined', left, right };
}

function LimitView({ fn = '(x^2 - 4)/(x - 2)', point, params, view: viewProp }: VisualiseProps) {
  const { text, applied, error, change } = useFunction(fn);
  const [a, setA] = useState(num(point, 2));
  const [step, setStep] = useState(() => {
    const start = num(params?.h, 0.1);
    const index = H_STEPS.findIndex((h) => h <= start * 1.0001);
    return index < 0 ? 3 : index;
  });
  const f = applied.evaluate;
  const h = H_STEPS[step];
  const pick = (value: string) => {
    change(value);
    const preset = LIMIT_PRESETS.find((entry) => entry.source === value);
    if (preset) setA(preset.point);
  };

  const view: View = useMemo(() => {
    if (viewProp) return { xmin: viewProp[0], xmax: viewProp[1], ymin: viewProp[2], ymax: viewProp[3] };
    const [lo, hi] = sampleRange(f, a - 2, a + 2);
    return { xmin: a - 2, xmax: a + 2, ymin: lo, ymax: hi };
  }, [viewProp, f, a]);

  const verdict = judgeLimit(f, a);
  const atA = f(a);
  const leftX = a - h;
  const rightX = a + h;
  const leftY = f(leftX);
  const rightY = f(rightX);
  const settled = step >= 8;
  const rows = H_STEPS.slice(0, step + 1);

  const conclusion = (() => {
    if (!settled) return 'Keep shrinking h and watch the two columns.';
    switch (verdict.kind) {
      case 'agree': {
        const value = verdict.value as number;
        const here = Number.isFinite(atA) ? (Math.abs(atA - value) <= 1e-6 * Math.max(1, Math.abs(value)) ? ` f(${signed(a)}) is that value, so f is continuous here.` : ` But f(${signed(a)}) = ${signed(atA)}, a different number.`) : ` But f is not defined at x = ${signed(a)}, so the graph has a hole there.`;
        return `Both sides head to ${signed(value)}, so the limit is ${signed(value)}.${here}`;
      }
      case 'differ':
        return `From the left the values head to ${signed(verdict.left)} and from the right to ${signed(verdict.right)}. They are different, so the limit does not exist.`;
      case 'unbounded':
        return 'The values grow without bound, so there is no finite limit.';
      case 'one-sided':
        return `f has values on only one side of x = ${signed(a)}. A two-sided limit needs values on both sides, so there is none here.`;
      default:
        return `f has no values near x = ${signed(a)}.`;
    }
  })();

  const label = `Graph of f(x) = ${applied.text} near x = ${show(a)}. With h = ${figures(h)}, f(${figures(leftX, 6)}) is ${figures(leftY, 6)} from the left and f(${figures(rightX, 6)}) is ${figures(rightY, 6)} from the right. ${conclusion}`;

  return (
    <Card title="Approach a point from both sides" what="Pick the point a, then shrink h. The table shows f(a − h) from the left and f(a + h) from the right. A limit exists when both columns head to the same number.">
      <FunctionField name="f(x) =" value={text} error={error} onChange={pick} presets={asPresets(LIMIT_PRESETS.map((entry) => entry.source), fn)} />
      <Row>
        <NumberField label="Approach x =" value={a} min={-20} max={20} step={0.5} onChange={setA} />
      </Row>
      <div className="dx-controls">
        <Slider label="Step h" value={step} min={0} max={H_STEPS.length - 1} step={1} onChange={setStep} display={() => figures(h, 4)} hint="Move right for a smaller h" />
      </div>

      <figure className="pic-figure">
        <GraphFrame view={view} label={label}>
          {(s) => (
            <>
              <line className="mv-asymptote" x1={s.x(a)} x2={s.x(a)} y1={s.top} y2={s.bottom} />
              <path className="dx-curve" d={curvePath(f, s, view.xmin, view.xmax)} />
              {Number.isFinite(leftY) && (
                <>
                  <line className="mv-guide" x1={s.left} x2={s.x(leftX)} y1={s.y(leftY)} y2={s.y(leftY)} />
                  <circle className="mv-dot" cx={s.x(leftX)} cy={s.y(leftY)} r={5} />
                </>
              )}
              {Number.isFinite(rightY) && (
                <>
                  <line className="mv-guide" x1={s.right} x2={s.x(rightX)} y1={s.y(rightY)} y2={s.y(rightY)} />
                  <rect className="mv-square" x={r2(s.x(rightX) - 5)} y={r2(s.y(rightY) - 5)} width={10} height={10} />
                </>
              )}
              {settled && verdict.kind === 'agree' && !(Number.isFinite(atA) && Math.abs(atA - (verdict.value as number)) <= 1e-6 * Math.max(1, Math.abs(verdict.value as number))) && (
                <circle className="mv-hole-dot" cx={s.x(a)} cy={s.y(verdict.value as number)} r={5} />
              )}
            </>
          )}
        </GraphFrame>
        <p className="pic-key"><span className="mv-key-left">From the left</span> <span className="mv-key-right">From the right</span> {settled && verdict.kind === 'agree' && <span className="mv-key-hole">The limit, if f has a hole there</span>}</p>
      </figure>

      <Readout>
        <Item term="Left">f({signed(leftX, 6)}) = <strong>{signed(leftY, 6)}</strong></Item>
        <Item term="Right">f({signed(rightX, 6)}) = <strong>{signed(rightY, 6)}</strong></Item>
        <Item term={`At x = ${signed(a)}`}>{Number.isFinite(atA) ? `f(${signed(a)}) = ${signed(atA, 6)}` : 'f is not defined here'}</Item>
        <Item term="So far">{conclusion}</Item>
      </Readout>

      <div className="pic-table-wrap" tabIndex={0} role="region" aria-label="Values of f on each side of the point">
        <table className="pic-table">
          <thead>
            <tr>
              <th scope="col">h</th>
              <th scope="col" data-num="">x = a − h</th>
              <th scope="col" data-num="">f(x)</th>
              <th scope="col" data-num="">x = a + h</th>
              <th scope="col" data-num="">f(x)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((value, index) => (
              <tr key={value}>
                <th scope="row">{figures(value, 4)}</th>
                <td data-num="" data-on={index === step ? '' : undefined}>{signed(a - value, 7)}</td>
                <td data-num="" data-on={index === step ? '' : undefined}>{signed(f(a - value), 7)}</td>
                <td data-num="" data-on={index === step ? '' : undefined}>{signed(a + value, 7)}</td>
                <td data-num="" data-on={index === step ? '' : undefined}>{signed(f(a + value), 7)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

/* ───────── tangent ───────── */

const TANGENT_PRESETS = ['x^2', 'x^3 - 2*x', 'sin(x)', 'exp(x)', 'sqrt(x)', '1/x', 'ln(x)', 'abs(x)'];
const SECANT_STEPS = [2, 1.5, 1, 0.75, 0.5, 0.3, 0.2, 0.1, 0.05, 0.02, 0.01, 0.001];

function TangentView({ fn = 'x^2', interval, point, params, view: viewProp }: VisualiseProps) {
  const { text, applied, error, change } = useFunction(fn);
  const [lo, hi] = interval ?? [-3, 3];
  const [a, setA] = useState(Math.min(hi, Math.max(lo, num(point, 1))));
  const [step, setStep] = useState(() => {
    const start = num(params?.h, 1);
    const index = SECANT_STEPS.findIndex((h) => h <= start * 1.0001);
    return index < 0 ? 2 : index;
  });
  const [side, setSide] = useState<'right' | 'left'>('right');
  const f = applied.evaluate;
  const derivative = useMemo(() => differentiate(applied), [applied]);

  const h = SECANT_STEPS[step] * (side === 'right' ? 1 : -1);
  const fa = f(a);
  const slope = derivativeAt(f, a);
  const exact = derivative.evaluate(a);
  const q = a + h;
  const fq = f(q);
  const secant = secantSlope(f, a, h);
  const ahead = (f(a + 1e-5) - fa) / 1e-5;
  const behind = (fa - f(a - 1e-5)) / 1e-5;
  const corner = Number.isFinite(ahead) && Number.isFinite(behind) && Math.abs(ahead - behind) > 1e-2 * Math.max(1, Math.abs(ahead), Math.abs(behind));
  const defined = Number.isFinite(fa) && Number.isFinite(slope) && !corner;

  const view: View = useMemo(() => {
    if (viewProp) return { xmin: viewProp[0], xmax: viewProp[1], ymin: viewProp[2], ymax: viewProp[3] };
    const [ymin, ymax] = sampleRange(f, lo, hi);
    return { xmin: lo, xmax: hi, ymin, ymax };
  }, [viewProp, f, lo, hi]);

  const lineAt = (s: Scale, m: number) => {
    const y = (x: number) => fa + m * (x - a);
    return `M${s.x(view.xmin)} ${s.y(Math.max(-1e5, Math.min(1e5, y(view.xmin))))} L${s.x(view.xmax)} ${s.y(Math.max(-1e5, Math.min(1e5, y(view.xmax))))}`;
  };

  const trend = !defined ? '' : Math.abs(slope) < 1e-6 ? 'The tangent is horizontal.' : slope > 0 ? 'The slope is positive, so f is increasing here.' : 'The slope is negative, so f is decreasing here.';
  const approx = fa + slope * h;
  const label = `Graph of f(x) = ${applied.text} with the tangent at x = ${show(a)} and the secant to x = ${show(q)}. ${defined ? `The secant slope is ${figures(secant, 5)} and the tangent slope is ${figures(slope, 5)}. ${trend}` : 'There is no tangent at this point.'}`;

  return (
    <Card title="From secant to tangent" what="Choose the point a, then shrink h. The dashed secant joins (a, f(a)) to (a + h, f(a + h)); its slope approaches the slope of the red tangent, which is the derivative f′(a).">
      <FunctionField name="f(x) =" value={text} error={error} onChange={change} presets={asPresets(TANGENT_PRESETS, fn)} />
      <div className="dx-controls">
        <Slider label="Point a" value={a} min={lo} max={hi} step={(hi - lo) / 200} onChange={setA} />
        <Slider label="Step h" value={step} min={0} max={SECANT_STEPS.length - 1} step={1} onChange={setStep} display={() => figures(SECANT_STEPS[step], 4)} hint="Move right for a smaller h" />
      </div>
      <Row>
        <label className="dx-pick">
          <span>The second point is</span>
          <select value={side} onChange={(event) => setSide(event.target.value as 'right' | 'left')}>
            <option value="right">to the right of a</option>
            <option value="left">to the left of a</option>
          </select>
        </label>
      </Row>

      <figure className="pic-figure">
        <GraphFrame view={view} label={label}>
          {(s) => (
            <>
              <path className="dx-curve" d={curvePath(f, s, view.xmin, view.xmax)} />
              {defined && Number.isFinite(fq) && Number.isFinite(secant) && <path className="mv-secant" d={lineAt(s, secant)} />}
              {defined && <path className="mv-tangent" d={lineAt(s, slope)} />}
              {Number.isFinite(fa) && <circle className="mv-dot" cx={s.x(a)} cy={s.y(fa)} r={5} />}
              {Number.isFinite(fq) && <circle className="mv-dot-open" cx={s.x(q)} cy={s.y(fq)} r={5} />}
            </>
          )}
        </GraphFrame>
        <p className="pic-key"><span className="mv-key-f">Curve</span> <span className="mv-key-secant">Secant</span> <span className="mv-key-tangent">Tangent</span></p>
      </figure>

      {!Number.isFinite(fa) ? (
        <p className="mv-error" role="status">f is not defined at x = {signed(a)}, so there is no point to draw a tangent through.</p>
      ) : corner ? (
        <p className="mv-error" role="status">The slope from the left is {signed(behind, 3)} and from the right is {signed(ahead, 3)}, so there is a corner here and no tangent.</p>
      ) : null}

      <Readout>
        <Item term="Secant slope">
          {Number.isFinite(secant) ? <><Maths>{`\\dfrac{f(a+h)-f(a)}{h} = \\dfrac{${bracket(fq)} - ${bracket(fa)}}{${tex(h)}}`}</Maths> = <strong>{signed(secant, 5)}</strong></> : 'not defined at this h'}
        </Item>
        <Item term="Tangent slope">{defined ? <>f{'′'}({signed(a)}) = <strong>{signed(slope, 5)}</strong> (from the formula: {signed(exact, 5)})</> : 'none'}</Item>
        <Item term="Derivative"><Maths>{`f'(x) = ${derivative.tex}`}</Maths></Item>
        {defined && <Item term="Tangent line"><Maths>{`y = ${tex(fa)} ${slope < 0 ? '-' : '+'} ${tex(Math.abs(slope))}\\,(x ${a < 0 ? '+' : '-'} ${tex(Math.abs(a))})`}</Maths></Item>}
        {defined && Number.isFinite(fq) && <Item term={`At x = ${signed(q)}`}>f = {signed(fq, 5)}, tangent line = {signed(approx, 5)}, difference {signed(fq - approx, 3)}</Item>}
        {defined && <Item term="Reading">{trend}</Item>}
      </Readout>
    </Card>
  );
}

/* ───────── Riemann sums ───────── */

const RIEMANN_PRESETS = ['x^2', 'x^3', 'sin(x)', 'exp(x)', 'sqrt(x)', '1/x', '4 - x^2'];
const RULE_NAMES: Record<Rule, string> = { left: 'Left endpoints', right: 'Right endpoints', midpoint: 'Midpoints', trapezoid: 'Trapezoids' };
const TABLE_N = [4, 10, 100, 1000];

function RiemannView({ fn = 'x^2', interval, params, rule: ruleProp = 'left', view: viewProp }: VisualiseProps) {
  const { text, applied, error, change } = useFunction(fn);
  const [a, setA] = useState((interval ?? [0, 2])[0]);
  const [b, setB] = useState((interval ?? [0, 2])[1]);
  const [n, setN] = useState(Math.max(1, Math.min(200, Math.round(num(params?.n, 4)))));
  const [rule, setRule] = useState<Rule>(rules.includes(ruleProp) ? ruleProp : 'left');
  const f = applied.evaluate;

  const exact = integrate(f, a, b);
  const pieces = riemannPieces(f, a, b, n, rule);
  const sum = riemannSum(f, a, b, n, rule);
  const error_ = sum - exact;
  const width = (b - a) / n;
  const finite = Number.isFinite(exact);

  const view: View = useMemo(() => {
    if (viewProp) return { xmin: viewProp[0], xmax: viewProp[1], ymin: viewProp[2], ymax: viewProp[3] };
    const [lo, hi] = sampleRange(f, a, b);
    const [ymin, ymax] = holdZero(lo, hi);
    const pad = (b - a) * 0.08;
    return { xmin: a - pad, xmax: b + pad, ymin, ymax };
  }, [viewProp, f, a, b]);

  const label = `Graph of f(x) = ${applied.text} on [${show(a)}, ${show(b)}] with ${n} pieces using ${RULE_NAMES[rule].toLowerCase()}. The sum is ${figures(sum, 6)}${finite ? ` and the exact integral is ${figures(exact, 6)}, so the error is ${figures(error_, 3)}` : ''}.`;
  const clampY = (v: number) => Math.max(-1e5, Math.min(1e5, Number.isFinite(v) ? v : 0));

  return (
    <Card title="Riemann sums" what="The shaded pieces approximate the area under the curve. Add pieces and the sum closes in on the exact integral. Change the rule to see which ones get there faster.">
      <FunctionField name="f(x) =" value={text} error={error} onChange={change} presets={asPresets(RIEMANN_PRESETS, fn)} />
      <Row>
        <Bounds a={a} b={b} onA={setA} onB={setB} />
        <label className="dx-pick">
          <span>Rule</span>
          <select value={rule} onChange={(event) => setRule(event.target.value as Rule)}>
            {rules.map((name) => <option key={name} value={name}>{RULE_NAMES[name]}</option>)}
          </select>
        </label>
      </Row>
      <div className="dx-controls">
        <Slider label="Pieces n" value={n} min={1} max={200} step={1} onChange={setN} display={(v) => String(v)} />
      </div>

      <figure className="pic-figure">
        <GraphFrame view={view} label={label}>
          {(s) => (
            <>
              {pieces.map((piece, index) => {
                const y0 = clampY(piece.y0);
                const y1 = clampY(piece.y1);
                const d = `M${s.x(piece.x0)} ${s.y(0)} L${s.x(piece.x0)} ${s.y(y0)} L${s.x(piece.x1)} ${s.y(y1)} L${s.x(piece.x1)} ${s.y(0)} Z`;
                return <path key={index} className="mv-piece" data-neg={piece.area < 0 ? '' : undefined} data-dense={n > 50 ? '' : undefined} d={d} />;
              })}
              <path className="dx-curve" d={curvePath(f, s, view.xmin, view.xmax)} />
            </>
          )}
        </GraphFrame>
        <p className="pic-key"><span className="mv-key-area">Area counted as positive</span> <span className="mv-key-neg">Area below the axis counts as negative</span></p>
      </figure>

      <Readout>
        <Item term="Width">{'Δ'}x = (b {'−'} a)/n = {signed(width, 5)}</Item>
        <Item term={`${RULE_NAMES[rule]} sum`}><strong>{signed(sum, 6)}</strong></Item>
        <Item term="Exact integral">{finite ? <strong>{signed(exact, 6)}</strong> : 'f is not finite on this interval, so there is no ordinary integral here.'}</Item>
        {finite && <Item term="Error">sum {'−'} exact = <strong>{signed(error_, 3)}</strong> ({error_ < 0 ? 'the sum is too small' : error_ > 0 ? 'the sum is too big' : 'exact'})</Item>}
      </Readout>

      {finite && (
        <div className="pic-table-wrap" tabIndex={0} role="region" aria-label="The sum for different numbers of pieces">
          <table className="pic-table">
            <thead>
              <tr>
                <th scope="col">Pieces n</th>
                <th scope="col" data-num="">{RULE_NAMES[rule]} sum</th>
                <th scope="col" data-num="">Error</th>
              </tr>
            </thead>
            <tbody>
              {TABLE_N.map((count) => {
                const value = riemannSum(f, a, b, count, rule);
                return (
                  <tr key={count}>
                    <th scope="row">{count}</th>
                    <td data-num="">{signed(value, 6)}</td>
                    <td data-num="">{signed(value - exact, 3)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

/* ───────── area between two curves ───────── */

const AREA_PRESETS: { label: string; f: string; g: string; a: number; b: number }[] = [
  { label: 'y = x and y = x^2', f: 'x', g: 'x^2', a: 0, b: 1 },
  { label: 'y = 2x and y = x^2', f: '2*x', g: 'x^2', a: 0, b: 2 },
  { label: 'y = x and y = x^3', f: 'x', g: 'x^3', a: -1, b: 1 },
  { label: 'y = x^2 and y = 4 - x^2', f: '4 - x^2', g: 'x^2', a: -1.414, b: 1.414 },
  { label: 'y = sin(x) and y = cos(x)', f: 'sin(x)', g: 'cos(x)', a: 0, b: 6.283 },
];

function AreaView({ fn = '2*x', fn2 = 'x^2', interval, view: viewProp }: VisualiseProps) {
  const top = useFunction(fn);
  const bottom = useFunction(fn2, '0');
  const [a, setA] = useState((interval ?? [0, 2])[0]);
  const [b, setB] = useState((interval ?? [0, 2])[1]);
  const f = top.applied.evaluate;
  const g = bottom.applied.evaluate;

  const choose = (index: number) => {
    const preset = AREA_PRESETS[index];
    top.change(preset.f);
    bottom.change(preset.g);
    setA(preset.a);
    setB(preset.b);
  };

  const result = areaBetween(f, g, a, b);
  const finite = Number.isFinite(result.area);
  const w = Math.max(b - a, 0.5);
  const view: View = useMemo(() => {
    if (viewProp) return { xmin: viewProp[0], xmax: viewProp[1], ymin: viewProp[2], ymax: viewProp[3] };
    const xmin = a - 0.35 * w;
    const xmax = b + 0.35 * w;
    const [ymin, ymax] = sampleRange(f, xmin, xmax, [g]);
    return { xmin, xmax, ymin, ymax };
  }, [viewProp, f, g, a, b, w]);

  // Where the curves meet, looking a little beyond the interval so that the next meeting point can be found.
  const meetings = findRoots((x) => f(x) - g(x), Math.min(a, b) - 2 * w, Math.max(a, b) + 2 * w);
  const nearest = (target: number, not?: number) =>
    meetings.filter((x) => x !== not).reduce((best, x) => (Math.abs(x - target) < Math.abs(best - target) ? x : best), Number.POSITIVE_INFINITY);
  const snap = () => {
    const first = nearest(a);
    const second = nearest(b, first);
    if (Number.isFinite(first) && Number.isFinite(second)) {
      setA(Number(Math.min(first, second).toFixed(6)));
      setB(Number(Math.max(first, second).toFixed(6)));
    }
  };

  const label = `Graph of f(x) = ${top.applied.text} and g(x) = ${bottom.applied.text} from x = ${show(a)} to x = ${show(b)}, with the region between them shaded. The area between the curves is ${finite ? figures(result.area, 6) : 'not defined'}.`;
  const single = result.pieces.length === 1 ? result.pieces[0] : null;
  const upper = single ? (single.top === 'f' ? top.applied : bottom.applied) : null;
  const lower = single ? (single.top === 'f' ? bottom.applied : top.applied) : null;

  return (
    <Card title="Area between two curves" what="The shaded region lies between the two curves from a to b. Where the curves cross, the top and bottom swap, so the area is found one piece at a time.">
      <label className="dx-pick mv-example">
        <span>Examples</span>
        <select value="" onChange={(event) => event.target.value !== '' && choose(Number(event.target.value))}>
          <option value="">Choose a pair</option>
          {AREA_PRESETS.map((preset, index) => <option key={preset.label} value={index}>{preset.label}</option>)}
        </select>
      </label>
      <FunctionField name="f(x) =" value={top.text} error={top.error} onChange={top.change} />
      <FunctionField name="g(x) =" value={bottom.text} error={bottom.error} onChange={bottom.change} />
      <Row>
        <Bounds a={a} b={b} onA={setA} onB={setB} />
        {meetings.length >= 2 && <button type="button" className="ui-btn ui-btn-sm" onClick={snap}>Snap a and b to the nearest meeting points</button>}
      </Row>

      <figure className="pic-figure">
        <GraphFrame view={view} label={label}>
          {(s) => (
            <>
              {result.pieces.map((piece) => (
                <path key={piece.from} className="mv-region" d={bandPath(piece.top === 'f' ? f : g, piece.top === 'f' ? g : f, s, piece.from, piece.to)} />
              ))}
              <line className="mv-asymptote" x1={s.x(a)} x2={s.x(a)} y1={s.top} y2={s.bottom} />
              <line className="mv-asymptote" x1={s.x(b)} x2={s.x(b)} y1={s.top} y2={s.bottom} />
              <path className="dx-curve" d={curvePath(f, s, view.xmin, view.xmax)} />
              <path className="mv-curve-2" d={curvePath(g, s, view.xmin, view.xmax)} />
              {meetings.map((x) => Number.isFinite(f(x)) && <circle key={x} className="mv-dot-open" cx={s.x(x)} cy={s.y(f(x))} r={4.5} />)}
            </>
          )}
        </GraphFrame>
        <p className="pic-key"><span className="mv-key-f">f(x)</span> <span className="mv-key-g">g(x)</span> <span className="mv-key-area">Region between</span></p>
      </figure>

      <Readout>
        <Item term="Area">{finite ? <strong>{signed(result.area, 6)}</strong> : 'f or g is not finite on this interval, so there is no ordinary area here.'}</Item>
        {finite && single && upper && lower && <Item term="Integral"><Maths>{`A = \\int_{${tex(a)}}^{${tex(b)}} \\left(${upper.tex} - ${lower.tex}\\right) dx = ${tex(result.area, 6)}`}</Maths></Item>}
        {finite && !single && (
          <Item term="Pieces">{result.pieces.map((piece) => `from ${signed(piece.from)} to ${signed(piece.to)}, ${piece.top === 'f' ? 'f' : 'g'} is on top: ${signed(piece.area, 5)}`).join('; ')}</Item>
        )}
        {finite && !single && <Item term="Signed integral">{signed(result.signed, 5)} (the pieces cancel, so this is not the area)</Item>}
        <Item term="The curves meet at">{meetings.length === 0 ? 'nowhere near this interval' : `x = ${meetings.slice(0, 6).map((x) => signed(x)).join(', ')}${meetings.length > 6 ? ', and more' : ''}`}</Item>
      </Readout>
    </Card>
  );
}

/* ───────── solid of revolution ───────── */

const SOLID_PRESETS: { label: string; f: string; g: string; a: number; b: number }[] = [
  { label: 'y = x on [0, 3] (a cone)', f: 'x', g: '', a: 0, b: 3 },
  { label: 'y = sqrt(x) on [0, 4]', f: 'sqrt(x)', g: '', a: 0, b: 4 },
  { label: 'y = x^2 on [0, 2]', f: 'x^2', g: '', a: 0, b: 2 },
  { label: 'y = sqrt(1 - x^2) on [-1, 1] (a ball)', f: 'sqrt(1 - x^2)', g: '', a: -1, b: 1 },
  { label: 'y = 2x and y = x^2 on [0, 2] (washers)', f: '2*x', g: 'x^2', a: 0, b: 2 },
];

function RevolutionView({ fn = 'x', fn2 = '', interval, params, view: viewProp }: VisualiseProps) {
  const outer = useFunction(fn);
  const [innerText, setInnerText] = useState(fn2);
  const inner = useMemo(() => (innerText.trim() === '' ? null : parseExpression(innerText)), [innerText]);
  const [innerLast, setInnerLast] = useState<Parsed | null>(() => {
    const first = fn2.trim() === '' ? null : parseExpression(fn2);
    return first && first.ok ? first : null;
  });
  const innerError = inner && !inner.ok ? inner.error : null;
  const g: Fn = innerText.trim() === '' ? () => 0 : innerLast ? innerLast.evaluate : () => 0;
  const changeInner = (value: string) => {
    setInnerText(value);
    if (value.trim() === '') {
      setInnerLast(null);
      return;
    }
    const parsed = parseExpression(value);
    if (parsed.ok) setInnerLast(parsed);
  };

  const [a, setA] = useState((interval ?? [0, 3])[0]);
  const [b, setB] = useState((interval ?? [0, 3])[1]);
  const [n, setN] = useState(Math.max(1, Math.min(40, Math.round(num(params?.n, 8)))));
  const [at, setAt] = useState<number | null>(null);
  const f = outer.applied.evaluate;
  const washer = innerText.trim() !== '' && innerLast !== null;

  const choose = (index: number) => {
    const preset = SOLID_PRESETS[index];
    outer.change(preset.f);
    changeInner(preset.g);
    setA(preset.a);
    setB(preset.b);
    setAt(null);
  };

  const x0 = Math.min(b, Math.max(a, at ?? (a + b) / 2));
  const exact = volumeOfRevolution(f, a, b, g);
  const approx = volumeByDiscs(f, a, b, n, g);
  const finite = Number.isFinite(exact) && isFiniteOn(f, a, b) && isFiniteOn(g, a, b);
  const sameSide = !washer || sameSideOfAxis(f, g, a, b);
  const R = Math.abs(f(x0));
  const r = Math.abs(g(x0));
  const faceArea = Math.PI * Math.abs(R * R - r * r);
  const peak = largest(washer ? [f, g] : [f], a, b) * 1.15;
  const w = Math.max(b - a, 0.5);
  const view: View = useMemo(() => {
    if (viewProp) return { xmin: viewProp[0], xmax: viewProp[1], ymin: viewProp[2], ymax: viewProp[3] };
    return { xmin: a - 0.12 * w, xmax: b + 0.12 * w, ymin: -peak, ymax: peak };
  }, [viewProp, a, b, w, peak]);

  const dx = (b - a) / n;
  const label = `Side view of the solid made by turning y = ${outer.applied.text}${washer && innerLast ? ` with the hole y = ${innerLast.text}` : ''} about the x-axis from x = ${show(a)} to x = ${show(b)}, cut into ${n} discs. The volume is ${finite ? `${figures(exact, 6)}, which is ${figures(exact / Math.PI, 6)} times pi` : 'not defined'}.`;

  const SIZE = 320;
  const face = peak > 0 ? 140 / peak : 1;

  return (
    <Card title="Solid of revolution" what="Turn the region under the curve about the x-axis. Cutting the solid into thin discs gives the volume as a sum of circle areas, and the sum becomes the integral. Add a second curve for a hole through the middle (washers).">
      <label className="dx-pick mv-example">
        <span>Examples</span>
        <select value="" onChange={(event) => event.target.value !== '' && choose(Number(event.target.value))}>
          <option value="">Choose a solid</option>
          {SOLID_PRESETS.map((preset, index) => <option key={preset.label} value={index}>{preset.label}</option>)}
        </select>
      </label>
      <FunctionField name="Outer radius f(x) =" value={outer.text} error={outer.error} onChange={outer.change} />
      <FunctionField name="Inner radius g(x) =" value={innerText} error={innerError} onChange={changeInner} allowEmpty />
      <Row>
        <Bounds a={a} b={b} onA={setA} onB={setB} />
      </Row>
      <div className="dx-controls">
        <Slider label="Discs n" value={n} min={1} max={40} step={1} onChange={setN} display={(v) => String(v)} />
        <Slider label="Look at x =" value={x0} min={a} max={b} step={(b - a) / 100} onChange={setAt} />
      </div>

      <div className="dx-plots">
        <figure className="pic-figure">
          <figcaption>Side view: the solid cut into discs</figcaption>
          <GraphFrame view={view} label={label}>
            {(s) => (
              <>
                <path className="mv-region" d={bandPath(f, (x) => -f(x), s, a, b)} />
                {washer && <path className="mv-hole" d={bandPath(g, (x) => -g(x), s, a, b)} />}
                {Array.from({ length: n }, (_, i) => {
                  const left = a + i * dx;
                  const mid = left + dx / 2;
                  const radius = Math.abs(f(mid));
                  if (!Number.isFinite(radius)) return null;
                  return <rect key={i} className="mv-slice" x={s.x(left)} y={s.y(radius)} width={r2(s.x(left + dx) - s.x(left))} height={r2(s.y(-radius) - s.y(radius))} />;
                })}
                <path className="dx-curve" d={curvePath(f, s, a, b)} />
                <path className="dx-curve" d={curvePath((x) => -f(x), s, a, b)} />
                {washer && <path className="mv-curve-2" d={curvePath(g, s, a, b)} />}
                {washer && <path className="mv-curve-2" d={curvePath((x) => -g(x), s, a, b)} />}
                {Number.isFinite(R) && <line className="mv-cut" x1={s.x(x0)} x2={s.x(x0)} y1={s.y(R)} y2={s.y(-R)} />}
              </>
            )}
          </GraphFrame>
        </figure>
        <figure className="pic-figure">
          <figcaption>End view at x = {signed(x0)}: one disc face</figcaption>
          <svg className="dx-plot pic-square" viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-label={`Face of the disc at x = ${show(x0)}: a circle of radius ${figures(R, 4)}${washer ? ` with a hole of radius ${figures(r, 4)}` : ''}. Its area is ${figures(faceArea, 5)}.`}>
            <line className="mv-axis0" x1={10} x2={SIZE - 10} y1={SIZE / 2} y2={SIZE / 2} />
            <line className="mv-axis0" x1={SIZE / 2} x2={SIZE / 2} y1={10} y2={SIZE - 10} />
            {Number.isFinite(R) && <circle className="mv-region mv-outline" cx={SIZE / 2} cy={SIZE / 2} r={r2(Math.min(R * face, 150))} />}
            {washer && Number.isFinite(r) && <circle className="mv-hole mv-outline" cx={SIZE / 2} cy={SIZE / 2} r={r2(Math.min(r * face, 150))} />}
            {Number.isFinite(R) && <line className="mv-cut" x1={SIZE / 2} x2={r2(SIZE / 2 + Math.min(R * face, 150))} y1={SIZE / 2} y2={SIZE / 2} />}
          </svg>
        </figure>
      </div>

      <Readout>
        <Item term="Volume">
          <Maths>{washer ? `V = \\pi \\int_{${tex(a)}}^{${tex(b)}} \\left[ \\left(${outer.applied.tex}\\right)^{2} - \\left(${innerLast ? innerLast.tex : '0'}\\right)^{2} \\right] dx` : `V = \\pi \\int_{${tex(a)}}^{${tex(b)}} \\left(${outer.applied.tex}\\right)^{2} dx`}</Maths>
          {finite ? <> = <strong>{signed(exact, 6)}</strong> ({signed(exact / Math.PI, 6)}{'π'})</> : ' is not defined: f or g is not finite on this interval.'}
        </Item>
        {finite && <Item term={`${n} discs`}>{signed(approx, 6)} (difference from the exact volume: {signed(approx - exact, 3)})</Item>}
        <Item term={`Disc at x = ${signed(x0)}`}>{Number.isFinite(R) ? (washer ? <>radius {signed(R, 4)}, hole {signed(r, 4)}, area {'π'}({signed(R, 4)}{'²'} {'−'} {signed(r, 4)}{'²'}) = {signed(faceArea, 5)}</> : <>radius {signed(R, 4)}, area π × {signed(R, 4)}² = {signed(faceArea, 5)}</>) : 'f is not defined here'}</Item>
        {!sameSide && <Item term="Note">The two curves are on opposite sides of the x-axis somewhere here, so the washer formula does not describe this solid.</Item>}
      </Readout>
    </Card>
  );
}

/* ───────── Taylor polynomials ───────── */

const SERIES_ALIASES: Record<string, SeriesName> = {
  'sin(x)': 'sin',
  sin: 'sin',
  'cos(x)': 'cos',
  cos: 'cos',
  'exp(x)': 'exp',
  'e^x': 'exp',
  exp: 'exp',
  'ln(1+x)': 'ln1p',
  ln1p: 'ln1p',
  '1/(1-x)': 'geometric',
  geometric: 'geometric',
};

const TAYLOR_VIEWS: Record<SeriesName, View> = {
  sin: { xmin: -7, xmax: 7, ymin: -3, ymax: 3 },
  cos: { xmin: -7, xmax: 7, ymin: -3, ymax: 3 },
  exp: { xmin: -3, xmax: 3, ymin: -3, ymax: 12 },
  ln1p: { xmin: -0.95, xmax: 3.5, ymin: -3, ymax: 2.5 },
  geometric: { xmin: -2.5, xmax: 2.5, ymin: -5, ymax: 8 },
};

function seriesFor(fn: string | undefined): SeriesName {
  if (fn === undefined) return 'sin';
  const key = fn.replace(/\s+/g, '').toLowerCase();
  const found = SERIES_ALIASES[key];
  if (!found) throw new Error(`Visualise kind="taylor": fn="${fn}" is not one of sin(x), cos(x), exp(x), ln(1 + x) or 1/(1 - x).`);
  return found;
}

function TaylorView({ fn, point, params, view: viewProp }: VisualiseProps) {
  const first = seriesFor(fn);
  const [name, setName] = useState<SeriesName>(first);
  const info = series[name];
  const [degree, setDegree] = useState(Math.max(0, Math.min(12, Math.round(num(params?.degree, 3)))));
  const [centre, setCentre] = useState(Math.max(series[first].centreMin, Math.min(series[first].centreMax, num(params?.centre, 0))));
  const [x0, setX0] = useState(num(point, 1));

  const view = viewProp ? { xmin: viewProp[0], xmax: viewProp[1], ymin: viewProp[2], ymax: viewProp[3] } : TAYLOR_VIEWS[name];
  const coefficients = taylorCoefficients(name, degree, centre);
  const poly: Fn = (x) => taylorValue(coefficients, centre, x);
  const f = info.value;
  const inView = Math.max(view.xmin, Math.min(view.xmax, x0));
  const fx = f(inView);
  const tx = poly(inView);
  const gap = fx - tx;

  const pick = (next: SeriesName) => {
    setName(next);
    setCentre((value) => Math.max(series[next].centreMin, Math.min(series[next].centreMax, next === name ? value : 0)));
    setX0((value) => Math.max(TAYLOR_VIEWS[next].xmin + 0.05, Math.min(TAYLOR_VIEWS[next].xmax - 0.05, value)));
  };

  const atCentre = Math.abs(centre) < 1e-9;
  const convergence = !Number.isFinite(info.radius)
    ? 'This series converges for every x, so a higher degree always gets closer.'
    : atCentre
      ? `This series converges only for |x| < ${info.radius}. Outside that range a higher degree gets worse, not better.`
      : `About a centre other than 0 the series converges only within a distance of ${info.name === 'ln1p' ? signed(1 + centre) : signed(1 - centre)} of the centre.`;
  const label = `Graph of ${info.label} and its Taylor polynomial of degree ${degree} about x = ${show(centre)}. At x = ${show(inView)} the function is ${figures(fx, 6)} and the polynomial is ${figures(tx, 6)}, a difference of ${figures(gap, 3)}.`;

  return (
    <Card title="A function and its Taylor polynomial" what="The red curve is the Taylor polynomial of the chosen degree. Raise the degree and watch it hug the function near the centre, and see how far from the centre it stays close.">
      <Row>
        <label className="dx-pick">
          <span>Function</span>
          <select value={name} onChange={(event) => pick(event.target.value as SeriesName)}>
            {seriesNames.map((option) => <option key={option} value={option}>{series[option].label}</option>)}
          </select>
        </label>
      </Row>
      <div className="dx-controls">
        <Slider label="Degree n" value={degree} min={0} max={12} step={1} onChange={setDegree} display={(v) => String(v)} />
        <Slider label="Centre a" value={centre} min={info.centreMin} max={info.centreMax} step={0.1} onChange={setCentre} />
        <Slider label="Evaluate at x =" value={inView} min={view.xmin} max={view.xmax} step={(view.xmax - view.xmin) / 200} onChange={setX0} />
      </div>

      <figure className="pic-figure">
        <GraphFrame view={view} label={label}>
          {(s) => (
            <>
              <line className="mv-asymptote" x1={s.x(centre)} x2={s.x(centre)} y1={s.top} y2={s.bottom} />
              <path className="dx-curve" d={curvePath(f, s, view.xmin, view.xmax)} />
              <path className="mv-curve-2" d={curvePath(poly, s, view.xmin, view.xmax)} />
              {Number.isFinite(fx) && Number.isFinite(tx) && (
                <>
                  <line className="mv-link" x1={s.x(inView)} x2={s.x(inView)} y1={s.y(Math.max(-1e5, Math.min(1e5, fx)))} y2={s.y(Math.max(-1e5, Math.min(1e5, tx)))} />
                  <circle className="mv-dot" cx={s.x(inView)} cy={s.y(Math.max(-1e5, Math.min(1e5, fx)))} r={5} />
                  <circle className="mv-dot-open" cx={s.x(inView)} cy={s.y(Math.max(-1e5, Math.min(1e5, tx)))} r={5} />
                </>
              )}
            </>
          )}
        </GraphFrame>
        <p className="pic-key"><span className="mv-key-f">{info.label}</span> <span className="mv-key-g">Taylor polynomial</span> <span className="mv-key-centre">The centre a</span></p>
      </figure>

      <Readout>
        <Item term="Polynomial">
          {atCentre
            ? <Maths>{`T_{${degree}}(x) = ${maclaurinTex(name, degree)}`}</Maths>
            : <Maths>{`T_{${degree}}(x) = ${coefficients.map((c, k) => `${k === 0 ? '' : c < 0 ? ' - ' : ' + '}${tex(k === 0 ? c : Math.abs(c), 4)}${k === 0 ? '' : k === 1 ? `(x ${centre < 0 ? '+' : '-'} ${tex(Math.abs(centre))})` : `(x ${centre < 0 ? '+' : '-'} ${tex(Math.abs(centre))})^{${k}}`}`).join('')}`}</Maths>}
        </Item>
        <Item term="Coefficients"><Maths>{'c_k = \\dfrac{f^{(k)}(a)}{k!}'}</Maths>: {coefficients.map((c) => signed(c, 4)).join(', ')}</Item>
        <Item term={`At x = ${signed(inView)}`}>{info.label} = {signed(fx, 6)}, polynomial = {signed(tx, 6)}, difference <strong>{signed(gap, 3)}</strong></Item>
        <Item term="Convergence">{convergence}</Item>
      </Readout>
    </Card>
  );
}

/* ───────── the entry point ───────── */

/**
 * Pictures for the maths courses. `kind` picks one of seven: graph transformations, a limit from both sides, a secant
 * becoming a tangent, Riemann sums, the area between two curves, a solid of revolution, and Taylor polynomials. The
 * function comes from the `fn` prop and the reader can type another; it is read by a safe parser (lib/maths), never
 * evaluated as code.
 */
export function Visualise(props: VisualiseProps) {
  switch (props.kind) {
    case 'graph':
      return <GraphView {...props} />;
    case 'limit':
      return <LimitView {...props} />;
    case 'tangent':
      return <TangentView {...props} />;
    case 'riemann':
      return <RiemannView {...props} />;
    case 'area-between':
      return <AreaView {...props} />;
    case 'revolution':
      return <RevolutionView {...props} />;
    case 'taylor':
      return <TaylorView {...props} />;
    default:
      throw new Error(`Visualise: unknown kind "${String((props as { kind?: unknown }).kind)}". Use one of: ${KINDS.join(', ')}.`);
  }
}
