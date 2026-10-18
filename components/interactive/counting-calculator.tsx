'use client';

import { useId, useMemo, useState } from 'react';
import { count, explain, groupDigits } from '@/lib/stats/counting';
import { MathText } from './math-text';
import { clamp } from './picture-helpers';

type Props = {
  /** Starting values: n objects to choose from and r of them chosen. */
  start?: { n?: number; r?: number };
  /** Start with "order matters" ticked. */
  ordered?: boolean;
  /** Start with "repetition allowed" ticked. */
  repetition?: boolean;
  title?: string;
};

const N_MAX = 60;
const R_MAX = 30;

/**
 * Permutations and combinations, with or without repetition. Choose n and r, tick whether order matters and whether
 * a thing can be used more than once, and read the count with its formula and working. The numbers are BigInts
 * (lib/stats/counting.ts), so they stay exact however large they get.
 */
export function CountingCalculator({ start, ordered: startOrdered = false, repetition: startRepetition = false, title }: Props) {
  const id = useId();
  const [n, setN] = useState(() => clamp(Math.round(start?.n ?? 10), 1, N_MAX));
  const [r, setR] = useState(() => clamp(Math.round(start?.r ?? 3), 0, R_MAX));
  const [ordered, setOrdered] = useState(startOrdered);
  const [repetition, setRepetition] = useState(startRepetition);

  const result = useMemo(() => explain(n, r, ordered, repetition), [n, r, ordered, repetition]);
  const grid = useMemo(() => [false, true].map((byOrder) => [false, true].map((repeat) => count(n, r, byOrder, repeat))), [n, r]);
  const answer = groupDigits(result.value);

  return (
    <section className="dx pic not-prose" aria-labelledby={`${id}-title`}>
      <header className="dx-head">
        <h4 id={`${id}-title`}>{title ?? 'Counting calculator'}</h4>
      </header>

      <div className="dx-controls">
        <label className="dx-slider">
          <span>n (objects)</span>
          <input type="range" min={1} max={N_MAX} step={1} value={n} onChange={(event) => setN(Number(event.target.value))} />
          <output>{n}</output>
        </label>
        <label className="dx-slider">
          <span>r (chosen)</span>
          <input type="range" min={0} max={R_MAX} step={1} value={r} onChange={(event) => setR(Number(event.target.value))} />
          <output>{r}</output>
        </label>
      </div>
      <div className="pic-checks">
        <label className="pic-check">
          <input type="checkbox" checked={ordered} onChange={(event) => setOrdered(event.target.checked)} />
          <span>Order matters</span>
        </label>
        <label className="pic-check">
          <input type="checkbox" checked={repetition} onChange={(event) => setRepetition(event.target.checked)} />
          <span>Repetition allowed</span>
        </label>
      </div>

      <dl className="dx-readout" aria-live="polite">
        <div><dt>Case</dt><dd>{result.name}</dd></div>
        <div><dt>Count</dt><dd className="pic-answer"><strong>{answer}</strong></dd></div>
      </dl>
      <div className="dx-formula"><MathText text={`$$${result.formula}$$`} /></div>
      <div className="dx-formula"><MathText text={`$$${result.working}$$`} /></div>
      {result.note && <p className="pic-note">{result.note}</p>}

      <div className="pic-table-wrap" tabIndex={0} role="region" aria-label={`All four counts for n = ${n} and r = ${r}`}>
        <table className="pic-table">
          <thead>
            <tr>
              <th scope="col">n = {n}, r = {r}</th>
              <th scope="col" data-num="">No repetition</th>
              <th scope="col" data-num="">Repetition allowed</th>
            </tr>
          </thead>
          <tbody>
            {[false, true].map((byOrder, row) => (
              <tr key={String(byOrder)}>
                <th scope="row">{byOrder ? 'Order matters' : 'Order does not matter'}</th>
                {[false, true].map((repeat, column) => (
                  <td key={String(repeat)} data-num="" data-on={byOrder === ordered && repeat === repetition ? '' : undefined}>{groupDigits(grid[row][column])}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
