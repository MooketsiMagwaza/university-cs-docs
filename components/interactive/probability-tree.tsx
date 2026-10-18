'use client';

import { useId, useState } from 'react';
import { tree, type TreeInput } from '@/lib/stats/bayes';
import type { Notation } from '@/lib/stats/sets';
import { MathText } from './math-text';
import { NumberField } from './number-field';
import { clamp, fmt, texNumber } from './picture-helpers';

type Props = {
  /** The first event, named as the lesson names it, for example "Disease". */
  eventA?: string;
  /** The second event, for example "Positive test". */
  eventB?: string;
  /** The starting branch probabilities: P(A), P(B | A) and P(B | not A). */
  start?: { a?: number; bGivenA?: number; bGivenNotA?: number };
  /** How the complement is written in the formula: a bar over the event (CSI213), a superscript c (STA122) or a prime. */
  notation?: Notation;
  title?: string;
};

// The picture is drawn on a fixed grid of whole numbers, so the server and the browser agree.
const WIDTH = 420;
const HEIGHT = 290;
const ROOT = { x: 12, y: 145 };
const FIRST = { x: 120, width: 56, height: 28, ys: [75, 215] };
const SECOND = { x: 290, width: 56, height: 28, ys: [40, 110, 180, 250] };
const JOINT_X = 358;

const unit = (value: number | undefined, fallback: number) => (typeof value === 'number' && Number.isFinite(value) ? clamp(value, 0, 1) : fallback);

/**
 * A two-stage probability tree. Type the three branch probabilities and read off the four joint probabilities, P(B)
 * by the law of total probability, and P(A | B) by Bayes' theorem with the formula and the numbers shown. The
 * arithmetic is in lib/stats/bayes.ts.
 */
export function ProbabilityTree({ eventA = 'A', eventB = 'B', start, notation = 'bar', title }: Props) {
  const id = useId();
  const [input, setInput] = useState<TreeInput>(() => ({
    a: unit(start?.a, 0.01),
    bGivenA: unit(start?.bGivenA, 0.95),
    bGivenNotA: unit(start?.bGivenNotA, 0.1),
  }));
  const t = tree(input);
  const named = eventA !== 'A' || eventB !== 'B';

  const complement = (name: string) => (notation === 'bar' ? `\\overline{${name}}` : notation === 'c' ? `${name}^{c}` : `${name}'`);
  const notA = complement('A');
  const times = (x: number, y: number) => `${texNumber(x)}\\times ${texNumber(y)}`;
  const top = `P(B\\mid A)\\,P(A)`;
  const bayes = `P(A\\mid B)=\\dfrac{${top}}{${top}+P(B\\mid ${notA})\\,P(${notA})}`;
  const worked = t.aGivenB === null
    ? `\\quad\\text{which is undefined here, because }P(B)=0`
    : `=\\dfrac{${times(input.bGivenA, input.a)}}{${times(input.bGivenA, input.a)}+${times(input.bGivenNotA, t.notA)}}=\\dfrac{${texNumber(t.aAndB)}}{${texNumber(t.b)}}=${texNumber(t.aGivenB)}`;

  const leaves = [
    { y: SECOND.ys[0], value: t.aAndB },
    { y: SECOND.ys[1], value: t.aAndNotB },
    { y: SECOND.ys[2], value: t.notAAndB },
    { y: SECOND.ys[3], value: t.notAAndNotB },
  ];
  const description = `Probability tree. First stage: A, ${eventA}, with probability ${fmt(input.a)}, or not A with probability ${fmt(t.notA)}. Second stage after A: B, ${eventB}, with probability ${fmt(input.bGivenA)}, or not B with probability ${fmt(t.notBGivenA)}. Second stage after not A: B with probability ${fmt(input.bGivenNotA)}, or not B with probability ${fmt(t.notBGivenNotA)}. The four joint probabilities are: A and B ${fmt(t.aAndB)}; A and not B ${fmt(t.aAndNotB)}; not A and B ${fmt(t.notAAndB)}; not A and not B ${fmt(t.notAAndNotB)}.`;

  // Each branch: where it starts, where it ends, and the probability written on it.
  const branches = [
    { from: [ROOT.x + 4, ROOT.y], to: [FIRST.x, FIRST.ys[0]], text: fmt(input.a) },
    { from: [ROOT.x + 4, ROOT.y], to: [FIRST.x, FIRST.ys[1]], text: fmt(t.notA) },
    { from: [FIRST.x + FIRST.width, FIRST.ys[0]], to: [SECOND.x, SECOND.ys[0]], text: fmt(input.bGivenA) },
    { from: [FIRST.x + FIRST.width, FIRST.ys[0]], to: [SECOND.x, SECOND.ys[1]], text: fmt(t.notBGivenA) },
    { from: [FIRST.x + FIRST.width, FIRST.ys[1]], to: [SECOND.x, SECOND.ys[2]], text: fmt(input.bGivenNotA) },
    { from: [FIRST.x + FIRST.width, FIRST.ys[1]], to: [SECOND.x, SECOND.ys[3]], text: fmt(t.notBGivenNotA) },
  ];
  const nodes = [
    { x: FIRST.x, y: FIRST.ys[0], width: FIRST.width, height: FIRST.height, text: 'A' },
    { x: FIRST.x, y: FIRST.ys[1], width: FIRST.width, height: FIRST.height, text: 'not A' },
    { x: SECOND.x, y: SECOND.ys[0], width: SECOND.width, height: SECOND.height, text: 'B' },
    { x: SECOND.x, y: SECOND.ys[1], width: SECOND.width, height: SECOND.height, text: 'not B' },
    { x: SECOND.x, y: SECOND.ys[2], width: SECOND.width, height: SECOND.height, text: 'B' },
    { x: SECOND.x, y: SECOND.ys[3], width: SECOND.width, height: SECOND.height, text: 'not B' },
  ];

  return (
    <section className="dx pic not-prose" aria-labelledby={`${id}-title`}>
      <header className="dx-head">
        <h4 id={`${id}-title`}>{title ?? 'Probability tree'}</h4>
      </header>
      {named && <p className="pic-what">A is {eventA}. B is {eventB}.</p>}

      <div className="pic-counts">
        <NumberField label={`P(A)`} value={input.a} min={0} max={1} step={0.01} onChange={(a) => setInput((previous) => ({ ...previous, a }))} />
        <NumberField label={`P(B | A)`} value={input.bGivenA} min={0} max={1} step={0.01} onChange={(bGivenA) => setInput((previous) => ({ ...previous, bGivenA }))} />
        <NumberField label={`P(B | not A)`} value={input.bGivenNotA} min={0} max={1} step={0.01} onChange={(bGivenNotA) => setInput((previous) => ({ ...previous, bGivenNotA }))} />
      </div>

      <figure className="pic-figure">
        <div className="pic-tree-scroll">
          <svg className="dx-plot pic-tree" viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-label={description}>
            <text className="dx-tick" x={JOINT_X} y={18}>joint</text>
            {branches.map((branch, i) => (
              <line key={i} className="pic-branch" x1={branch.from[0]} y1={branch.from[1]} x2={branch.to[0]} y2={branch.to[1]} />
            ))}
            <circle className="pic-root" cx={ROOT.x} cy={ROOT.y} r={4} />
            {nodes.map((node, i) => (
              <g key={i}>
                <rect className="pic-node" x={node.x} y={node.y - node.height / 2} width={node.width} height={node.height} rx={6} />
                <text className="pic-node-text" x={node.x + node.width / 2} y={node.y + 4} textAnchor="middle">{node.text}</text>
              </g>
            ))}
            {branches.map((branch, i) => (
              <text key={i} className="pic-branch-label" x={Math.round((branch.from[0] + branch.to[0]) / 2)} y={Math.round((branch.from[1] + branch.to[1]) / 2) + 4} textAnchor="middle">{branch.text}</text>
            ))}
            {leaves.map((leaf, i) => (
              <text key={i} className="pic-leaf" x={JOINT_X} y={leaf.y + 4}>{fmt(leaf.value)}</text>
            ))}
          </svg>
        </div>
        <figcaption>Multiply along a branch to get the joint probability at its end.</figcaption>
      </figure>

      <dl className="dx-readout" aria-live="polite">
        <div><dt>P(A and B)</dt><dd>{fmt(t.aAndB)}</dd></div>
        <div><dt>P(A and not B)</dt><dd>{fmt(t.aAndNotB)}</dd></div>
        <div><dt>P(not A and B)</dt><dd>{fmt(t.notAAndB)}</dd></div>
        <div><dt>P(not A and not B)</dt><dd>{fmt(t.notAAndNotB)}</dd></div>
        <div><dt>P(B)</dt><dd>{fmt(t.aAndB)} + {fmt(t.notAAndB)} = <strong>{fmt(t.b)}</strong></dd></div>
        <div><dt>P(A | B)</dt><dd><strong>{t.aGivenB === null ? 'undefined, since P(B) = 0' : fmt(t.aGivenB)}</strong></dd></div>
      </dl>
      <div className="dx-formula"><MathText text={`$$${bayes}${worked}$$`} /></div>
      {t.aGivenB !== null && (
        <p className="pic-note">In words: once {named ? eventB : 'B'} is known to have happened, the probability of {named ? eventA : 'A'} is {fmt(t.aGivenB)}, compared with {fmt(input.a)} before.</p>
      )}
    </section>
  );
}
