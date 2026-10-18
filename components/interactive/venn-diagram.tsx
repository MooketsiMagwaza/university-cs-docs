'use client';

import { useId, useMemo, useState, type ReactNode } from 'react';
import {
  countOf,
  countsFromStart,
  describe,
  expressionsFor,
  findExpression,
  isMember,
  latex,
  regionLabel,
  regionMasks,
  regionsOf,
  symbols,
  totalOf,
  type Notation,
  type SetCount,
  type SetName,
} from '@/lib/stats/sets';
import { MathText } from './math-text';
import { NumberField } from './number-field';
import { fmt, fmtInt } from './picture-helpers';

type Props = {
  /** How many sets the diagram has: 2 or 3. */
  sets?: 2 | 3;
  /** The expression shown first, written in words as the menu writes it: 'A and B', 'not (A or B)', 'A and B and not C'. */
  expression?: string;
  /** Starting counts by region key: 'A', 'B', 'AB', 'none' (outside every set), and for three sets 'C', 'AC', 'BC', 'ABC'. */
  start?: Record<string, number>;
  /** How the complement is written in the formula: a bar over the set (CSI213), a superscript c (STA122) or a prime. */
  notation?: Notation;
  title?: string;
};

type Circle = { name: SetName; cx: number; cy: number; r: number; label: [number, number] };
type Layout = { width: number; height: number; circles: Circle[]; text: Record<number, [number, number]>; outside: [number, number] };

// All numbers are whole, so the picture is the same on the server and in the browser.
const LAYOUTS: Record<SetCount, Layout> = {
  2: {
    width: 360,
    height: 240,
    circles: [
      { name: 'A', cx: 130, cy: 120, r: 72, label: [68, 54] },
      { name: 'B', cx: 230, cy: 120, r: 72, label: [292, 54] },
    ],
    // mask -> where its count is written
    text: { 1: [108, 125], 2: [252, 125], 3: [180, 125] },
    outside: [340, 218],
  },
  3: {
    width: 360,
    height: 310,
    circles: [
      { name: 'A', cx: 140, cy: 120, r: 70, label: [78, 56] },
      { name: 'B', cx: 220, cy: 120, r: 70, label: [302, 56] },
      { name: 'C', cx: 180, cy: 188, r: 70, label: [180, 282] },
    ],
    text: { 1: [116, 108], 2: [244, 108], 3: [180, 100], 4: [180, 218], 5: [138, 171], 6: [222, 171], 7: [180, 148] },
    outside: [340, 292],
  },
};

const FRAME = { x: 8, y: 8 };

/** The circle as a closed path made of two arcs, for the clip that keeps everything outside it. */
function circlePath({ cx, cy, r }: Circle): string {
  return `M${cx - r} ${cy} a${r} ${r} 0 1 0 ${2 * r} 0 a${r} ${r} 0 1 0 ${-2 * r} 0Z`;
}

/** The region with this mask, as a rectangle clipped to be inside or outside each circle in turn. */
function Region({ mask, layout, prefix, on }: { mask: number; layout: Layout; prefix: string; on: boolean }) {
  let node: ReactNode = <rect className="pic-region" data-on={on ? '' : undefined} x={FRAME.x} y={FRAME.y} width={layout.width - 2 * FRAME.x} height={layout.height - 2 * FRAME.y} />;
  for (const circle of layout.circles) {
    node = <g clipPath={`url(#${prefix}-${isMember(mask, circle.name) ? 'in' : 'out'}-${circle.name})`}>{node}</g>;
  }
  return <>{node}</>;
}

/**
 * A Venn diagram of two or three sets. Pick an expression and its regions are shaded; type the number of elements in
 * each region and read off the count and the probability of the expression. The set algebra is in lib/stats/sets.ts.
 */
export function VennDiagram({ sets = 2, expression, start, notation = 'bar', title }: Props) {
  const count: SetCount = sets === 3 ? 3 : 2;
  const layout = LAYOUTS[count];
  const id = useId();
  const prefix = `venn${id.replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const menu = useMemo(() => expressionsFor(count), [count]);
  const [counts, setCounts] = useState<number[]>(() => countsFromStart(count, start));
  const [choiceId, setChoiceId] = useState<string>(() => findExpression(count, expression).id);

  const choice = menu.find((entry) => entry.id === choiceId) ?? menu[0];
  const masks = regionMasks(count);
  const shaded = regionsOf(choice.expr, count);
  const inside = countOf(choice.expr, counts);
  const total = totalOf(counts);
  const names = layout.circles.map((circle) => circle.name).join(', ');

  const regionList = masks.map((mask) => `${regionLabel(mask, count)} ${counts[mask]}`).join('; ');
  const shadedList = shaded.length > 0 ? shaded.map((mask) => regionLabel(mask, count)).join('; ') : 'no region';
  const description = `Venn diagram of the sets ${names}. Shaded: ${describe(choice.expr)}, which is ${shadedList}. Counts by region: ${regionList}. The shaded regions hold ${fmtInt(inside)} of ${fmtInt(total)} elements.`;

  const sum = shaded.map((mask) => fmtInt(counts[mask])).join(' + ');

  return (
    <section className="dx pic not-prose" aria-labelledby={`${id}-title`}>
      <header className="dx-head">
        <h4 id={`${id}-title`}>{title ?? `Venn diagram of ${count === 2 ? 'two' : 'three'} sets`}</h4>
        <label className="dx-pick">
          <span>Shade</span>
          <select value={choice.id} onChange={(event) => setChoiceId(event.target.value)}>
            {menu.map((entry) => <option key={entry.id} value={entry.id}>{`${symbols(entry.expr)} (${entry.id})`}</option>)}
          </select>
        </label>
      </header>

      <figure className="pic-figure">
        <svg className="dx-plot pic-venn" viewBox={`0 0 ${layout.width} ${layout.height}`} role="img" aria-label={description}>
          <defs>
            {layout.circles.map((circle) => (
              <g key={circle.name}>
                <clipPath id={`${prefix}-in-${circle.name}`}><circle cx={circle.cx} cy={circle.cy} r={circle.r} /></clipPath>
                <clipPath id={`${prefix}-out-${circle.name}`}>
                  <path clipRule="evenodd" d={`M${FRAME.x} ${FRAME.y}H${layout.width - FRAME.x}V${layout.height - FRAME.y}H${FRAME.x}Z ${circlePath(circle)}`} />
                </clipPath>
              </g>
            ))}
          </defs>
          {masks.map((mask) => <Region key={mask} mask={mask} layout={layout} prefix={prefix} on={shaded.includes(mask)} />)}
          <rect className="pic-universe" x={FRAME.x} y={FRAME.y} width={layout.width - 2 * FRAME.x} height={layout.height - 2 * FRAME.y} />
          {layout.circles.map((circle) => <circle key={circle.name} className="pic-circle" cx={circle.cx} cy={circle.cy} r={circle.r} />)}
          {layout.circles.map((circle) => <text key={circle.name} className="pic-set-label" x={circle.label[0]} y={circle.label[1]} textAnchor="middle">{circle.name}</text>)}
          <text className="dx-tick" x={FRAME.x + 10} y={FRAME.y + 20}>U</text>
          {masks.filter((mask) => mask !== 0).map((mask) => (
            <text key={mask} className="pic-count-text" data-on={shaded.includes(mask) ? '' : undefined} x={layout.text[mask][0]} y={layout.text[mask][1]} textAnchor="middle">{fmtInt(counts[mask])}</text>
          ))}
          <text className="pic-count-text" data-on={shaded.includes(0) ? '' : undefined} x={layout.outside[0]} y={layout.outside[1]} textAnchor="end">{fmtInt(counts[0])}</text>
        </svg>
        <figcaption>The shaded regions are {describe(choice.expr)}. The number in each region is how many elements it holds.</figcaption>
      </figure>

      <div className="pic-counts">
        {masks.map((mask) => (
          <NumberField
            key={mask}
            label={regionLabel(mask, count)}
            value={counts[mask]}
            min={0}
            max={9999}
            integer
            onChange={(next) => setCounts((previous) => previous.map((old, index) => (index === mask ? next : old)))}
          />
        ))}
      </div>

      <dl className="dx-readout" aria-live="polite">
        <div><dt>Shaded</dt><dd><MathText text={`$${latex(choice.expr, notation)}$`} /></dd></div>
        <div><dt>Count</dt><dd>{shaded.length > 1 ? `${sum} = ` : ''}<strong>{fmtInt(inside)}</strong></dd></div>
        <div><dt>Everything</dt><dd>{fmtInt(total)}</dd></div>
        <div><dt>Probability</dt><dd><strong>{total > 0 ? fmt(inside / total) : '–'}</strong>{total > 0 ? ` (${fmtInt(inside)} out of ${fmtInt(total)})` : ''}</dd></div>
      </dl>
      <p className="pic-note">Each element belongs to exactly one region, so the count of an expression is the sum of the regions it shades. The region outside the circles holds the elements that are in none of the sets.</p>
    </section>
  );
}
