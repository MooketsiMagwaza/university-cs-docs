'use client';

import { useId, useMemo, useState, type ReactNode } from 'react';
import { createRng, toSeed, type Rng } from '@/lib/stats/random';
import { MAX_TRIALS, POINTS_KEPT, emptyRun, extendRun, measures, rows, type Row, type Run, type Settings } from '@/lib/stats/simulate';
import { NumberField } from './number-field';
import { clamp, fmt, fmtInt, niceTicks, r2 } from './picture-helpers';

export type Experiment = 'coins' | 'dice' | 'binomial' | 'lln' | 'clt' | 'monte-carlo';
type Mode = 'coin' | 'die' | 'pi' | 'conditional';

type Params = { coins: number; n: number; p: number; sampleSize: number; threshold: number };

type Props = {
  /** What to simulate. */
  experiment: Experiment;
  /** Fix the version of `lln` ('coin' or 'die') or `monte-carlo` ('pi' or 'conditional'). Leave it out to let the reader choose. */
  mode?: Mode;
  /** The seed the run starts with. The same seed always gives the same run. */
  seed?: number;
  /** Starting values: `coins`, `n`, `p`, `sampleSize` (central limit theorem) and `threshold` (the conditional probability). */
  start?: Partial<Params>;
  title?: string;
};

const DEFAULTS: Params = { coins: 4, n: 10, p: 0.3, sampleSize: 1, threshold: 8 };

/** The versions the reader can switch between, for the experiments that have more than one. */
const CHOICES: Partial<Record<Experiment, [Mode, string][]>> = {
  lln: [['coin', 'Coin flips'], ['die', 'Rolls of a die']],
  'monte-carlo': [['pi', 'Estimate π'], ['conditional', 'A conditional probability']],
};

const RUNS = [1, 10, 100, 1000];

/** Keep every starting value inside its slider. */
function normalise(params: Params): Params {
  return {
    coins: clamp(Math.round(params.coins), 1, 10),
    n: clamp(Math.round(params.n), 1, 30),
    p: clamp(Math.round(params.p * 100) / 100, 0.01, 0.99),
    sampleSize: clamp(Math.round(params.sampleSize), 1, 50),
    threshold: clamp(Math.round(params.threshold), 2, 12),
  };
}

function makeSettings(experiment: Experiment, choice: Mode | undefined, params: Params): Settings {
  switch (experiment) {
    case 'coins':
      return { kind: 'coins', coins: params.coins };
    case 'dice':
      return { kind: 'dice' };
    case 'binomial':
      return { kind: 'binomial', n: params.n, p: params.p };
    case 'lln':
      return { kind: 'lln', source: choice === 'die' ? 'die' : 'coin' };
    case 'clt':
      return { kind: 'clt', sampleSize: params.sampleSize };
    default:
      return choice === 'conditional' ? { kind: 'conditional', threshold: params.threshold } : { kind: 'pi' };
  }
}

/** The heading and the one-sentence description of a single trial. */
function describeExperiment(settings: Settings): { title: string; trial: string } {
  switch (settings.kind) {
    case 'coins':
      return { title: 'Flip coins and count the heads', trial: `One trial flips ${settings.coins} fair ${settings.coins === 1 ? 'coin' : 'coins'} and counts the heads.` };
    case 'dice':
      return { title: 'Roll two dice and add them', trial: 'One trial rolls two fair dice and adds the spots.' };
    case 'binomial':
      return { title: 'Count the successes in n trials', trial: `One trial makes ${settings.n} independent attempts that each succeed with probability ${fmt(settings.p)}, and counts the successes.` };
    case 'lln':
      return settings.source === 'coin'
        ? { title: 'The running frequency of heads', trial: 'Each trial flips one fair coin. The line is the fraction of heads so far.' }
        : { title: 'The running mean of a die', trial: 'Each trial rolls one fair die. The line is the mean of the rolls so far.' };
    case 'clt':
      return {
        title: 'Means of samples from a skewed source',
        trial: `One trial draws ${settings.sampleSize} ${settings.sampleSize === 1 ? 'value' : 'values'} from a skewed source (an exponential distribution with mean 1 and standard deviation 1) and records their mean. The markers are the normal curve with mean 1 and standard deviation ${settings.sampleSize === 1 ? '1' : `1/√${settings.sampleSize}`} that the central limit theorem promises.`,
      };
    case 'pi':
      return { title: 'Estimate π with random points', trial: 'One trial picks a random point in the unit square. A point is inside the quarter circle when x² + y² ≤ 1, and the fraction inside estimates π/4.' };
    case 'conditional':
      return {
        title: 'A conditional probability by simulation',
        trial: `One trial rolls two dice. B is "the sum is at least ${settings.threshold}" and A is "the first die shows a 6". P(A | B) is estimated from the trials where B happened.`,
      };
  }
}

/* ───────── the pictures ───────── */

const W = 520;
const H = 240;
const PAD = { left: 44, right: 12, top: 14, bottom: 32 };
const INNER_W = W - PAD.left - PAD.right;
const INNER_H = H - PAD.top - PAD.bottom;

function Frame({ label, yTicks, yAt, children }: { label: string; yTicks: number[]; yAt(value: number): number; children: ReactNode }) {
  return (
    <svg className="dx-plot" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
      {yTicks.map((tick) => (
        <g key={tick}>
          <line className="dx-grid" x1={PAD.left} x2={W - PAD.right} y1={yAt(tick)} y2={yAt(tick)} />
          <text className="dx-tick" x={PAD.left - 6} y={r2(yAt(tick) + 4)} textAnchor="end">{fmt(tick)}</text>
        </g>
      ))}
      {children}
      <line className="dx-axis" x1={PAD.left} x2={W - PAD.right} y1={H - PAD.bottom} y2={H - PAD.bottom} />
    </svg>
  );
}

/** Bars for what happened, a marker for what theory says. */
function BarPlot({ label, items }: { label: string; items: Row[] }) {
  const peak = Math.max(0.05, ...items.map((row) => row.observed ?? 0), ...items.map((row) => row.theory));
  const top = peak * 1.12;
  const slot = INNER_W / items.length;
  const barWidth = r2(Math.max(2, slot * 0.72));
  const x = (i: number) => r2(PAD.left + (i + 0.5) * slot);
  const y = (value: number) => r2(H - PAD.bottom - (value / top) * INNER_H);
  const every = Math.ceil(items.length / 12);

  return (
    <Frame label={label} yTicks={niceTicks(0, top, false, 4)} yAt={y}>
      {items.map((row, i) => (
        <g key={row.short}>
          {row.observed !== null && row.observed > 0 && (
            <rect className="pic-bar" x={r2(x(i) - barWidth / 2)} width={barWidth} y={y(row.observed)} height={r2(H - PAD.bottom - y(row.observed))} />
          )}
          <line className="pic-theory" x1={r2(x(i) - barWidth / 2 - 2)} x2={r2(x(i) + barWidth / 2 + 2)} y1={y(row.theory)} y2={y(row.theory)} />
          <circle className="pic-theory-dot" cx={x(i)} cy={y(row.theory)} r={3} />
          {i % every === 0 && <text className="dx-tick" x={x(i)} y={H - PAD.bottom + 16} textAnchor="middle">{row.short}</text>}
        </g>
      ))}
    </Frame>
  );
}

/** The running mean after each trial, with its limit as a dashed line. */
function LinePlot({ label, run, source }: { label: string; run: Run; source: 'coin' | 'die' }) {
  const coin = source === 'coin';
  const lo = coin ? 0 : 1;
  const hi = coin ? 1 : 6;
  const limit = coin ? 0.5 : 3.5;
  const last = Math.max(10, run.trials);
  const x = (trial: number) => r2(PAD.left + (trial / last) * INNER_W);
  const y = (value: number) => r2(H - PAD.bottom - ((value - lo) / (hi - lo)) * INNER_H);

  // Draw at most about 400 points, however long the run is.
  const stride = Math.max(1, Math.ceil(run.series.length / 400));
  const drawn: number[] = [];
  for (let i = 0; i < run.series.length; i += stride) drawn.push(i);
  if (run.series.length > 0 && drawn[drawn.length - 1] !== run.series.length - 1) drawn.push(run.series.length - 1);
  const path = drawn.map((i, k) => `${k === 0 ? 'M' : 'L'}${x(i + 1)} ${y(run.series[i])}`).join(' ');

  return (
    <Frame label={label} yTicks={coin ? [0, 0.25, 0.5, 0.75, 1] : [1, 2, 3, 4, 5, 6]} yAt={y}>
      <line className="dx-marker" x1={PAD.left} x2={W - PAD.right} y1={y(limit)} y2={y(limit)} />
      <text className="dx-tick" x={W - PAD.right} y={r2(y(limit) - 5)} textAnchor="end">{coin ? 'limit 1/2' : 'limit 3.5'}</text>
      {path && <path className="pic-series" d={path} />}
      {niceTicks(0, last, true, 5).map((tick) => (
        <text key={tick} className="dx-tick" x={x(tick)} y={H - PAD.bottom + 16} textAnchor="middle">{fmtInt(tick)}</text>
      ))}
    </Frame>
  );
}

const SQUARE = 270;
const SQUARE_AT = { x: 34, y: 14 };

/** The unit square, the quarter circle, and the random points. */
function PointsPlot({ label, run }: { label: string; run: Run }) {
  const x = (u: number) => r2(SQUARE_AT.x + u * SQUARE);
  const y = (v: number) => r2(SQUARE_AT.y + (1 - v) * SQUARE);
  return (
    <svg className="dx-plot pic-square" viewBox="0 0 320 316" role="img" aria-label={label}>
      <rect className="pic-universe" x={SQUARE_AT.x} y={SQUARE_AT.y} width={SQUARE} height={SQUARE} />
      {run.points.map(([u, v, inside], i) => (
        <circle key={i} className={inside ? 'pic-in' : 'pic-out'} cx={x(u)} cy={y(v)} r={2.2} />
      ))}
      <path className="pic-arc" d={`M${x(1)} ${y(0)} A${SQUARE} ${SQUARE} 0 0 0 ${x(0)} ${y(1)}`} />
      {[0, 0.5, 1].map((tick) => (
        <g key={tick}>
          <text className="dx-tick" x={x(tick)} y={SQUARE_AT.y + SQUARE + 16} textAnchor="middle">{fmt(tick)}</text>
          <text className="dx-tick" x={SQUARE_AT.x - 6} y={r2(y(tick) + 4)} textAnchor="end">{fmt(tick)}</text>
        </g>
      ))}
    </svg>
  );
}

/* ───────── what is said about the picture ───────── */

function describePlot(settings: Settings, run: Run, items: Row[]): string {
  const { title } = describeExperiment(settings);
  if (run.trials === 0) return `${title}. Nothing has been run yet. The markers show the theoretical probabilities; press a Run button to add trials.`;
  const trials = `${fmtInt(run.trials)} ${run.trials === 1 ? 'trial' : 'trials'}`;
  if (settings.kind === 'lln') {
    const mean = run.series[run.series.length - 1];
    return `${title}. Line chart of the running ${settings.source === 'coin' ? 'relative frequency of heads' : 'mean of the rolls'} over ${trials}. It now stands at ${fmt(mean)}; the limit is ${settings.source === 'coin' ? '0.5' : '3.5'}.`;
  }
  if (settings.kind === 'pi') {
    return `${title}. Scatter plot of the latest ${fmtInt(run.points.length)} of ${trials}: ${fmtInt(run.counts[0])} points fell inside the quarter circle, which gives an estimate of π of ${fmt((4 * run.counts[0]) / run.trials)}.`;
  }
  if (settings.kind === 'conditional') {
    return `${title}. Bar chart over ${trials}. ${items.map((row) => `${row.short}: ${row.observed === null ? 'no value yet' : fmt(row.observed)}, theory ${fmt(row.theory)}`).join('. ')}.`;
  }
  const best = items.reduce((a, b) => ((b.observed ?? 0) > (a.observed ?? 0) ? b : a), items[0]);
  return `${title}. Bar chart of the relative frequency of each outcome over ${trials}, with the theoretical probability of each marked. The most frequent outcome was ${best.label.toLowerCase()} at ${fmt(best.observed ?? 0)}; theory gives ${fmt(best.theory)}.`;
}

function tableHeads(settings: Settings): [string, string, string, string] {
  switch (settings.kind) {
    case 'lln':
      return ['Checkpoint', settings.source === 'coin' ? 'Heads' : 'Total of the rolls', settings.source === 'coin' ? 'Relative frequency' : 'Mean so far', 'Limit'];
    case 'conditional':
      return ['Event', 'Count', 'Relative frequency', 'Theory'];
    default:
      return ['Outcome', 'Times', 'Relative frequency', 'Theory'];
  }
}

/**
 * Run an experiment 1, 10, 100 or 1000 trials at a time and watch the relative frequencies settle towards the
 * theoretical probabilities. The generator is seeded, so the same seed gives the same run. Nothing random happens
 * while the page renders: it starts as an empty run, and numbers are drawn only when a button is pressed.
 */
export function Simulation({ experiment, mode, seed = 2024, start, title }: Props) {
  const id = useId();
  const choices = CHOICES[experiment];
  const [choice, setChoice] = useState<Mode | undefined>(mode ?? choices?.[0][0]);
  const [params, setParams] = useState<Params>(() => normalise({ ...DEFAULTS, ...start }));
  const settings = useMemo(() => makeSettings(experiment, choice, params), [experiment, choice, params]);
  const [session, setSession] = useState<{ seed: number; rng: Rng; run: Run }>(() => ({
    seed: toSeed(seed),
    rng: createRng(seed),
    run: emptyRun(makeSettings(experiment, mode ?? choices?.[0][0], normalise({ ...DEFAULTS, ...start }))),
  }));

  const restart = (next: Settings, nextSeed = session.seed) => setSession({ seed: nextSeed, rng: createRng(nextSeed), run: emptyRun(next) });
  const change = (patch: Partial<Params>) => {
    const next = normalise({ ...params, ...patch });
    setParams(next);
    restart(makeSettings(experiment, choice, next));
  };
  const pick = (next: Mode) => {
    setChoice(next);
    restart(makeSettings(experiment, next, params));
  };
  // Drawing numbers happens here, in a click handler, and nowhere else.
  const go = (steps: number) => setSession({ ...session, run: extendRun(session.run, settings, session.rng, steps) });

  const { run } = session;
  const items = useMemo(() => rows(run, settings), [run, settings]);
  const summary = useMemo(() => measures(run, settings), [run, settings]);
  const { title: heading, trial } = describeExperiment(settings);
  const label = describePlot(settings, run, items);
  const heads = tableHeads(settings);
  const full = run.trials >= MAX_TRIALS;

  let plot: ReactNode;
  let caption: string;
  if (settings.kind === 'lln') {
    plot = <LinePlot label={label} run={run} source={settings.source} />;
    caption = `Running ${settings.source === 'coin' ? 'relative frequency of heads' : 'mean'} against the number of trials`;
  } else if (settings.kind === 'pi') {
    plot = <PointsPlot label={label} run={run} />;
    caption = `Random points in the unit square (the latest ${fmtInt(POINTS_KEPT)} are drawn)`;
  } else {
    plot = <BarPlot label={label} items={items} />;
    caption = settings.kind === 'conditional' ? 'Relative frequency of each event' : 'Relative frequency of each outcome';
  }

  return (
    <section className="dx pic not-prose" aria-labelledby={`${id}-title`}>
      <header className="dx-head">
        <h4 id={`${id}-title`}>{title ?? heading}</h4>
        {choices && mode === undefined && (
          <label className="dx-pick">
            <span>Version</span>
            <select value={choice} onChange={(event) => pick(event.target.value as Mode)}>
              {choices.map(([value, name]) => <option key={value} value={value}>{name}</option>)}
            </select>
          </label>
        )}
      </header>
      <p className="pic-what">{trial}</p>

      <div className="dx-controls">
        {settings.kind === 'coins' && (
          <label className="dx-slider">
            <span>Coins per trial</span>
            <input type="range" min={1} max={10} step={1} value={params.coins} onChange={(event) => change({ coins: Number(event.target.value) })} />
            <output>{params.coins}</output>
          </label>
        )}
        {settings.kind === 'binomial' && (
          <>
            <label className="dx-slider">
              <span>n (attempts)</span>
              <input type="range" min={1} max={30} step={1} value={params.n} onChange={(event) => change({ n: Number(event.target.value) })} />
              <output>{params.n}</output>
            </label>
            <label className="dx-slider">
              <span>p (success)</span>
              <input type="range" min={0.01} max={0.99} step={0.01} value={params.p} onChange={(event) => change({ p: Number(event.target.value) })} />
              <output>{fmt(params.p)}</output>
            </label>
          </>
        )}
        {settings.kind === 'clt' && (
          <label className="dx-slider">
            <span>Sample size</span>
            <input type="range" min={1} max={50} step={1} value={params.sampleSize} onChange={(event) => change({ sampleSize: Number(event.target.value) })} />
            <output>{params.sampleSize}</output>
          </label>
        )}
        {settings.kind === 'conditional' && (
          <label className="dx-slider">
            <span>Sum at least</span>
            <input type="range" min={2} max={12} step={1} value={params.threshold} onChange={(event) => change({ threshold: Number(event.target.value) })} />
            <output>{params.threshold}</output>
          </label>
        )}
      </div>

      <div className="pic-run">
        {RUNS.map((steps) => (
          <button key={steps} type="button" className="ui-btn ui-btn-sm" disabled={full} onClick={() => go(steps)}>Run {steps}</button>
        ))}
        <button type="button" className="ui-btn ui-btn-sm" onClick={() => restart(settings)}>Reset</button>
        <NumberField label="Seed" value={session.seed} min={0} max={999999} integer onChange={(next) => restart(settings, next)} />
      </div>

      <figure className="pic-figure">
        <figcaption>{caption}</figcaption>
        {plot}
        {settings.kind !== 'lln' && settings.kind !== 'pi' && (
          <p className="pic-key"><span className="pic-key-bar">Simulated</span> <span className="pic-key-theory">Theory</span></p>
        )}
        {settings.kind === 'pi' && (
          <p className="pic-key"><span className="pic-key-in">Inside</span> <span className="pic-key-out">Outside</span></p>
        )}
      </figure>

      <dl className="dx-readout" aria-live="polite">
        <div><dt>Trials</dt><dd><strong>{fmtInt(run.trials)}</strong></dd></div>
        {summary.map((measure) => (
          <div key={measure.name}>
            <dt>{measure.name}</dt>
            <dd><strong>{measure.observed === null ? '–' : fmt(measure.observed)}</strong> (theory {fmt(measure.theory)})</dd>
          </div>
        ))}
      </dl>
      {full && <p className="pic-note">This run has reached {fmtInt(MAX_TRIALS)} trials. Press Reset to start again.</p>}

      <div className="pic-table-wrap" tabIndex={0} role="region" aria-label="Counts, relative frequencies and theory">
        <table className="pic-table">
          <thead>
            <tr>{heads.map((head, i) => <th key={head} scope="col" data-num={i > 0 ? '' : undefined}>{head}</th>)}</tr>
          </thead>
          <tbody>
            {items.length === 0 && <tr><td colSpan={4}>Run at least one trial to fill this table.</td></tr>}
            {items.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                <td data-num="">{fmtInt(row.count)}</td>
                <td data-num="">{row.observed === null ? '–' : fmt(row.observed)}</td>
                <td data-num="">{fmt(row.theory)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
