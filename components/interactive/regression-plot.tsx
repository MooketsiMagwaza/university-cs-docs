'use client';

import { useEffect, useId, useMemo, useState, type KeyboardEvent, type PointerEvent } from 'react';
import { linearRegression, predict, type Point } from '@/lib/maths/regression';
import { GH, GraphFrame, GW, show, signed, tex, type Scale, type View } from './graph-frame';
import { MathText } from './math-text';
import { r2 } from './picture-helpers';

type Dataset = { label: string; points: Point[] };

type Props = {
  /** The points to start with, as [x, y] pairs. */
  points: Point[];
  /** Other datasets the reader can switch to. The starting points are always the first choice. */
  presets?: Dataset[];
  /** The window as [xmin, xmax, ymin, ymax]. Left out, it is chosen from the data with some room around it. */
  view?: [number, number, number, number];
  /** Names for the two axes, drawn in the corners of the plot. */
  xLabel?: string;
  yLabel?: string;
  /** Start with the residuals drawn. */
  residuals?: boolean;
  title?: string;
};

const MAX_POINTS = 30;
const MIN_POINTS = 2;

/** A window that holds the data with room around it, on whole numbers. */
function autoView(points: Point[]): View {
  const xs = points.map(([x]) => x);
  const ys = points.map(([, y]) => y);
  const spanX = Math.max(...xs) - Math.min(...xs) || 1;
  const spanY = Math.max(...ys) - Math.min(...ys) || 1;
  return {
    xmin: Math.floor(Math.min(...xs) - 0.2 * spanX),
    xmax: Math.ceil(Math.max(...xs) + 0.2 * spanX),
    ymin: Math.floor(Math.min(...ys) - 0.3 * spanY),
    ymax: Math.ceil(Math.max(...ys) + 0.3 * spanY),
  };
}

/** The distance one arrow key press moves a point: about 1/30 of the window, on a round number. */
function keyStep(span: number): number {
  const raw = span / 30;
  return raw < 0.075 ? 0.05 : raw < 0.15 ? 0.1 : raw < 0.375 ? 0.25 : raw < 0.75 ? 0.5 : 1;
}

const round2 = (value: number) => Math.round(value * 100) / 100;
const clamp = (value: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, value));

/**
 * A scatter plot with the least-squares line. Drag a point, or Tab to one and move it with the arrow keys, add or
 * remove points with the buttons, and watch the slope, the intercept, r and R squared change. The fit is computed in
 * lib/maths/regression.ts.
 */
export function RegressionPlot({ points, presets, view: viewProp, xLabel = 'x', yLabel = 'y', residuals: startWithResiduals = false, title }: Props) {
  const id = useId();
  const safe = `rp${id.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const datasets = useMemo<Dataset[]>(() => [{ label: 'Starting data', points }, ...(presets ?? [])], [points, presets]);
  const [choice, setChoice] = useState(0);
  const [data, setData] = useState<{ points: Point[]; view: View }>(() => ({
    points: points.map(([x, y]): Point => [x, y]),
    view: viewProp ? { xmin: viewProp[0], xmax: viewProp[1], ymin: viewProp[2], ymax: viewProp[3] } : autoView(points),
  }));
  const [selected, setSelected] = useState<number | null>(null);
  const [showResiduals, setShowResiduals] = useState(startWithResiduals);
  const [dragging, setDragging] = useState<number | null>(null);
  const [focusNext, setFocusNext] = useState<number | null>(null);
  const { view } = data;
  const pts = data.points;

  // After a point is removed from the keyboard, put the focus on a point that is still there.
  useEffect(() => {
    if (focusNext === null) return;
    document.getElementById(`${safe}-p${focusNext}`)?.focus();
    setFocusNext(null);
  }, [focusNext, safe]);

  const load = (index: number) => {
    const set = datasets[index];
    setChoice(index);
    setSelected(null);
    setData({
      points: set.points.map(([x, y]): Point => [x, y]),
      view: viewProp && index === 0 ? { xmin: viewProp[0], xmax: viewProp[1], ymin: viewProp[2], ymax: viewProp[3] } : autoView(set.points),
    });
  };

  const result = useMemo(() => linearRegression(pts), [pts]);
  const fit = result.ok ? result.fit : null;
  const stepX = keyStep(view.xmax - view.xmin);
  const stepY = keyStep(view.ymax - view.ymin);

  const setPoint = (index: number, x: number, y: number) =>
    setData((previous) => ({
      ...previous,
      points: previous.points.map((point, i): Point => (i === index ? [round2(clamp(x, previous.view.xmin, previous.view.xmax)), round2(clamp(y, previous.view.ymin, previous.view.ymax))] : point)),
    }));

  const onPointerDown = (event: PointerEvent<SVGGElement>, index: number) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    event.currentTarget.focus();
    setDragging(index);
    setSelected(index);
  };
  const onPointerMove = (event: PointerEvent<SVGGElement>, index: number, scale: Scale) => {
    if (dragging !== index) return;
    const svg = event.currentTarget.ownerSVGElement;
    if (!svg) return;
    const box = svg.getBoundingClientRect();
    if (box.width === 0 || box.height === 0) return;
    const px = ((event.clientX - box.left) / box.width) * GW;
    const py = ((event.clientY - box.top) / box.height) * GH;
    setPoint(index, scale.fromX(px), scale.fromY(py));
  };
  const onKeyDown = (event: KeyboardEvent<SVGGElement>, index: number) => {
    const big = event.shiftKey ? 4 : 1;
    const [x, y] = pts[index];
    switch (event.key) {
      case 'ArrowLeft':
        setPoint(index, x - stepX * big, y);
        break;
      case 'ArrowRight':
        setPoint(index, x + stepX * big, y);
        break;
      case 'ArrowUp':
        setPoint(index, x, y + stepY * big);
        break;
      case 'ArrowDown':
        setPoint(index, x, y - stepY * big);
        break;
      case 'Delete':
      case 'Backspace':
        removeAt(index, true);
        break;
      default:
        return;
    }
    event.preventDefault();
  };

  const removeAt = (index: number, keepFocus = false) => {
    if (pts.length <= MIN_POINTS) return;
    setData((previous) => ({ ...previous, points: previous.points.filter((_, i) => i !== index) }));
    setSelected(null);
    if (keepFocus) setFocusNext(Math.max(0, index - 1));
  };

  const addPoint = () => {
    if (pts.length >= MAX_POINTS) return;
    const farthest = Math.max(...pts.map(([x]) => x));
    const x = round2(farthest + 1 <= view.xmax ? farthest + 1 : view.xmax - stepX);
    const onLine = fit ? predict(fit, x) : (view.ymin + view.ymax) / 2;
    // Not exactly on the line: a little above or below it, alternating, so adding points shows some scatter.
    const y = round2(clamp(onLine + (pts.length % 2 === 0 ? 1 : -1) * 0.1 * (view.ymax - view.ymin), view.ymin, view.ymax));
    setData((previous) => ({ ...previous, points: [...previous.points, [x, y]] }));
    setSelected(pts.length);
  };
  const addOutlier = () => {
    if (pts.length >= MAX_POINTS) return;
    const x = round2(view.xmax - stepX * 2);
    const onLine = fit ? predict(fit, x) : (view.ymin + view.ymax) / 2;
    // On the other side of the line from the middle of the window, as far as the window allows.
    const y = round2(onLine > (view.ymin + view.ymax) / 2 ? view.ymin + stepY : view.ymax - stepY);
    setData((previous) => ({ ...previous, points: [...previous.points, [x, y]] }));
    setSelected(pts.length);
  };

  const equation = fit ? `${tex(fit.intercept, 4)} ${fit.slope < 0 ? '-' : '+'} ${tex(Math.abs(fit.slope), 4)}\\,x` : '';
  const label = fit
    ? `Scatter plot of ${pts.length} points with the least-squares line y = ${show(fit.intercept)} ${fit.slope < 0 ? 'minus' : 'plus'} ${show(Math.abs(fit.slope))} x. The correlation r is ${Number.isNaN(fit.r) ? 'not defined' : show(fit.r)} and R squared is ${Number.isNaN(fit.rSquared) ? 'not defined' : show(fit.rSquared)}. Each point can be moved with the arrow keys.`
    : `Scatter plot of ${pts.length} points. ${result.ok ? '' : result.reason}`;

  return (
    <section className="dx pic mv not-prose" aria-labelledby={`${id}-title`}>
      <header className="dx-head">
        <h4 id={`${id}-title`}>{title ?? 'Fit a line by least squares'}</h4>
        {datasets.length > 1 && (
          <label className="dx-pick">
            <span>Data</span>
            <select value={choice} onChange={(event) => load(Number(event.target.value))}>
              {datasets.map((set, index) => <option key={set.label} value={index}>{set.label}</option>)}
            </select>
          </label>
        )}
      </header>
      <p className="pic-what">The line is the one that makes the sum of the squared vertical distances to the points as small as possible. Drag a point, or press Tab to reach one and use the arrow keys (hold Shift for bigger steps), and watch the line and the numbers below follow.</p>

      <div className="pic-run">
        <button type="button" className="ui-btn ui-btn-sm" disabled={pts.length >= MAX_POINTS} onClick={addPoint}>Add a point</button>
        <button type="button" className="ui-btn ui-btn-sm" disabled={pts.length >= MAX_POINTS} onClick={addOutlier}>Add an outlier</button>
        <button type="button" className="ui-btn ui-btn-sm" disabled={pts.length <= MIN_POINTS} onClick={() => removeAt(selected ?? pts.length - 1)}>{selected === null ? 'Remove the last point' : `Remove point ${selected + 1}`}</button>
        <button type="button" className="ui-btn ui-btn-sm" onClick={() => load(choice)}>Reset</button>
        <label className="pic-check">
          <input type="checkbox" checked={showResiduals} onChange={(event) => setShowResiduals(event.target.checked)} />
          <span>Show the residuals</span>
        </label>
      </div>

      <figure className="pic-figure">
        <GraphFrame
          view={view}
          label={label}
          role="group"
          overlay={(s) => (
            <>
              <text className="mv-label" x={s.right - 4} y={s.bottom - 6} textAnchor="end">{xLabel}</text>
              <text className="mv-label" x={s.left + 6} y={s.top + 16}>{yLabel}</text>
            </>
          )}
        >
          {(s) => (
            <>
              {fit && <line className="mv-fitline" x1={s.x(view.xmin)} y1={s.y(predict(fit, view.xmin))} x2={s.x(view.xmax)} y2={s.y(predict(fit, view.xmax))} />}
              {fit && showResiduals && pts.map(([x, y], i) => <line key={`r${i}`} className="mv-residual" x1={s.x(x)} x2={s.x(x)} y1={s.y(y)} y2={s.y(fit.fitted[i])} />)}
              {fit && (
                <path className="mv-centroid" d={`M${r2(s.x(fit.meanX) - 7)} ${s.y(fit.meanY)} L${r2(s.x(fit.meanX) + 7)} ${s.y(fit.meanY)} M${s.x(fit.meanX)} ${r2(s.y(fit.meanY) - 7)} L${s.x(fit.meanX)} ${r2(s.y(fit.meanY) + 7)}`} />
              )}
              {pts.map(([x, y], i) => (
                <g
                  key={i}
                  id={`${safe}-p${i}`}
                  className="mv-point"
                  tabIndex={0}
                  role="button"
                  aria-label={`Point ${i + 1} of ${pts.length}: ${xLabel} ${show(x)}, ${yLabel} ${show(y)}${fit ? `, residual ${show(fit.residuals[i])}` : ''}. Arrow keys move it, Delete removes it.`}
                  data-selected={selected === i ? '' : undefined}
                  onPointerDown={(event) => onPointerDown(event, i)}
                  onPointerMove={(event) => onPointerMove(event, i, s)}
                  onPointerUp={() => setDragging(null)}
                  onPointerCancel={() => setDragging(null)}
                  onKeyDown={(event) => onKeyDown(event, i)}
                  onFocus={() => setSelected(i)}
                >
                  <circle className="mv-hit" cx={s.x(x)} cy={s.y(y)} r={18} />
                  <circle className="mv-dot" cx={s.x(x)} cy={s.y(y)} r={7} />
                </g>
              ))}
            </>
          )}
        </GraphFrame>
        <p className="pic-key"><span className="mv-key-dot">Data point</span> <span className="mv-key-fit">Least-squares line</span> <span className="mv-key-centroid">Centre of the data (the two means)</span> {showResiduals && <span className="mv-key-residual">Residual</span>}</p>
      </figure>

      {fit ? (
        <dl className="dx-readout mv-readout" aria-live="polite">
          <div><dt>Line</dt><dd><MathText text={`$\\hat{y} = ${equation}$`} /></dd></div>
          <div><dt>Slope</dt><dd><MathText text={`$b_1 = \\dfrac{S_{xy}}{S_{xx}} = \\dfrac{${tex(fit.sxy, 5)}}{${tex(fit.sxx, 5)}} = ${tex(fit.slope, 4)}$`} /></dd></div>
          <div><dt>Intercept</dt><dd><MathText text={`$b_0 = \\bar{y} - b_1\\bar{x} = ${tex(fit.meanY, 5)} - (${tex(fit.slope, 4)})(${tex(fit.meanX, 5)}) = ${tex(fit.intercept, 4)}$`} /></dd></div>
          <div><dt>Correlation</dt><dd>{Number.isNaN(fit.r) ? 'r is not defined, because all the y values are equal.' : <MathText text={`$r = ${tex(fit.r, 4)}, \\quad R^2 = r^2 = ${tex(fit.rSquared, 4)}$`} />}</dd></div>
          <div><dt>Sums of squares</dt><dd><MathText text={`$SST = SSR + SSE: \\quad ${tex(fit.sst, 5)} = ${tex(fit.ssr, 5)} + ${tex(fit.sse, 5)}$`} /></dd></div>
          <div><dt>Centre</dt><dd><MathText text={`$\\text{The line passes through } (\\bar{x}, \\bar{y}) = (${tex(fit.meanX, 5)}, ${tex(fit.meanY, 5)})$`} /></dd></div>
        </dl>
      ) : (
        <p className="mv-error" role="status">{result.ok ? '' : result.reason}</p>
      )}

      <div className="pic-table-wrap" tabIndex={0} role="region" aria-label="The points, their fitted values and residuals">
        <table className="pic-table">
          <thead>
            <tr>
              <th scope="col">Point</th>
              <th scope="col" data-num="">{xLabel}</th>
              <th scope="col" data-num="">{yLabel}</th>
              <th scope="col" data-num="">Fitted value</th>
              <th scope="col" data-num="">Residual</th>
            </tr>
          </thead>
          <tbody>
            {pts.map(([x, y], i) => (
              <tr key={i}>
                <th scope="row">{i + 1}</th>
                <td data-num="" data-on={selected === i ? '' : undefined}>{signed(x, 4)}</td>
                <td data-num="" data-on={selected === i ? '' : undefined}>{signed(y, 4)}</td>
                <td data-num="">{fit ? signed(fit.fitted[i], 4) : '–'}</td>
                <td data-num="">{fit ? signed(fit.residuals[i], 4) : '–'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
