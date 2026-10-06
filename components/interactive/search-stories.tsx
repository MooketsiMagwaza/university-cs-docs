'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

type LinearStep = { iteration: number; index: number; value: number; condition: string; found: boolean };
type BinaryStep = { iteration: number; low: number; mid: number; high: number; value: number; condition: string; next: string };

const LINEAR_VALUES = [63, 29, 85, 72, 18, 42];
const LINEAR_KEY = 18;
const LINEAR_STEPS: LinearStep[] = LINEAR_VALUES.slice(0, 5).map((value, index) => ({
  iteration: index + 1,
  index,
  value,
  condition: `${value} == ${LINEAR_KEY} → ${value === LINEAR_KEY}`,
  found: value === LINEAR_KEY,
}));

const BINARY_VALUES = [2, 6, 12, 32, 50, 59, 76, 83, 90];
const BINARY_KEY = 88;
const BINARY_STEPS: BinaryStep[] = [
  { iteration: 1, low: 0, mid: 4, high: 8, value: 50, condition: '50 < 88', next: 'Discard indexes 0–4; low = 5' },
  { iteration: 2, low: 5, mid: 6, high: 8, value: 76, condition: '76 < 88', next: 'Discard indexes 5–6; low = 7' },
  { iteration: 3, low: 7, mid: 7, high: 8, value: 83, condition: '83 < 88', next: 'Discard index 7; low = 8' },
  { iteration: 4, low: 8, mid: 8, high: 8, value: 90, condition: '90 > 88', next: 'Discard index 8; high = 7, so low > high' },
];

function Controls({ index, total, onChange }: { index: number; total: number; onChange: (value: number) => void }) {
  return (
    <div className="mt-4 flex flex-wrap items-center gap-2">
      <button type="button" onClick={() => onChange(0)} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-sm text-fd-foreground"><RotateCcw className="h-4 w-4" /> Reset</button>
      <button type="button" disabled={index === 0} onClick={() => onChange(index - 1)} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-sm text-fd-foreground disabled:opacity-40"><ChevronLeft className="h-4 w-4" /> Previous</button>
      <button type="button" disabled={index === total - 1} onClick={() => onChange(index + 1)} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-fd-primary px-4 py-2 text-sm font-semibold text-fd-primary-foreground disabled:opacity-40">Next <ChevronRight className="h-4 w-4" /></button>
      <span className="ml-auto text-xs text-fd-muted-foreground">Iteration {index + 1} of {total}</span>
    </div>
  );
}

export function LinearSearchStory() {
  const [index, setIndex] = useState(0);
  const step = LINEAR_STEPS[index];

  return (
    <section className="not-prose my-10 overflow-hidden rounded-2xl border border-fd-border bg-fd-background shadow-sm">
      <header className="border-b border-fd-border px-4 py-5 sm:px-6">
        <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-fd-muted-foreground">Visual walkthrough</p>
        <h3 className="mb-0 mt-1 text-xl font-semibold text-fd-foreground">Linear search checks one card at a time</h3>
        <p className="mb-0 mt-1 text-sm text-fd-muted-foreground">Target: <strong className="text-fd-foreground">{LINEAR_KEY}</strong>. No position can be skipped because the array is not sorted.</p>
      </header>
      <div className="px-4 py-6 sm:px-6">
        <div className="overflow-x-auto pb-2"><div className="algorithm-card-row" role="img" aria-label={`Search array ${LINEAR_VALUES.join(', ')}`}>
          {LINEAR_VALUES.map((value, cardIndex) => {
            const checked = cardIndex < step.index;
            const active = cardIndex === step.index;
            const found = active && step.found;
            return (
              <div key={cardIndex} className="text-center">
                <div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-xl border-2 font-mono text-lg font-semibold ${found ? 'border-emerald-600 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : active ? 'border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300' : checked ? 'border-red-500/60 bg-red-500/5 text-fd-muted-foreground line-through' : 'border-fd-border bg-fd-background text-fd-foreground'}`}>{value}</div>
                <div className="mt-1 font-mono text-[0.7rem] text-fd-muted-foreground">{cardIndex}</div>
              </div>
            );
          })}
        </div></div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-fd-border bg-fd-muted/15 p-4"><div className="text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">Statement with values</div><div className="mt-2 font-mono text-base font-semibold text-fd-foreground">arr[{step.index}] == key<br />{step.condition}</div></div>
          <div className="rounded-xl border border-fd-border bg-fd-background p-4"><div className="text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">Result</div><p className="mb-0 mt-2 text-sm text-fd-foreground">{step.found ? `Match found. Return index ${step.index}; later cards are not checked.` : `No match at index ${step.index}. Move exactly one position right.`}</p></div>
        </div>
        <Controls index={index} total={LINEAR_STEPS.length} onChange={setIndex} />
      </div>
      <div className="border-t border-fd-border bg-fd-muted/15 px-4 py-5 sm:px-6">
        <h4 className="m-0 text-base font-semibold text-fd-foreground">Dry-run table</h4>
        <div className="mt-3 overflow-x-auto"><table className="trace-table w-full border-collapse text-left text-sm"><thead className="border-b border-fd-border text-xs uppercase tracking-wide text-fd-muted-foreground"><tr><th className="px-3 py-2">Iteration</th><th className="px-3 py-2">i</th><th className="px-3 py-2">arr[i]</th><th className="px-3 py-2">Condition</th><th className="px-3 py-2">Action</th></tr></thead><tbody>{LINEAR_STEPS.map((row, rowIndex) => <tr key={row.iteration} className={rowIndex === index ? 'bg-blue-500/10' : 'border-b border-fd-border/70 last:border-0'}><td data-label="Iteration" className="px-3 py-2">{row.iteration}</td><td data-label="i" className="px-3 py-2 font-mono">{row.index}</td><td data-label="arr[i]" className="px-3 py-2 font-mono">{row.value}</td><td data-label="Condition" data-wide className="px-3 py-2 font-mono">{row.condition}</td><td data-label="Action" data-wide className="px-3 py-2">{row.found ? `return ${row.index}` : 'continue'}</td></tr>)}</tbody></table></div>
      </div>
    </section>
  );
}

export function BinarySearchStory() {
  const [index, setIndex] = useState(0);
  const step = BINARY_STEPS[index];

  return (
    <section className="not-prose my-10 overflow-hidden rounded-2xl border border-fd-border bg-fd-background shadow-sm">
      <header className="border-b border-fd-border px-4 py-5 sm:px-6">
        <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-fd-muted-foreground">Visual walkthrough</p>
        <h3 className="mb-0 mt-1 text-xl font-semibold text-fd-foreground">Binary search keeps only the possible half</h3>
        <p className="mb-0 mt-1 text-sm text-fd-muted-foreground">Target: <strong className="text-fd-foreground">{BINARY_KEY}</strong>. The sorted order is what makes discarding values safe.</p>
      </header>
      <div className="px-4 py-6 sm:px-6">
        <div className="overflow-x-auto pb-2"><div className="algorithm-card-row algorithm-card-row-nine" role="img" aria-label={`Sorted search array ${BINARY_VALUES.join(', ')}`}>
          {BINARY_VALUES.map((value, cardIndex) => {
            const active = cardIndex === step.mid;
            const possible = cardIndex >= step.low && cardIndex <= step.high;
            const bound = cardIndex === step.low || cardIndex === step.high;
            return (
              <div key={cardIndex} className="text-center">
                <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-lg border-2 font-mono font-semibold ${active ? 'border-blue-500 bg-blue-500/10 text-blue-700 ring-4 ring-blue-500/10 dark:text-blue-300' : possible ? bound ? 'border-red-500/70 bg-red-500/5 text-fd-foreground' : 'border-fd-border bg-fd-background text-fd-foreground' : 'border-fd-border/40 bg-fd-muted/30 text-fd-muted-foreground opacity-45'}`}>{value}</div>
                <div className="mt-1 font-mono text-[0.65rem] text-fd-muted-foreground">{cardIndex}{active ? ' mid' : cardIndex === step.low ? ' low' : cardIndex === step.high ? ' high' : ''}</div>
              </div>
            );
          })}
        </div></div>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-fd-border bg-fd-muted/15 p-4"><div className="text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">Bounds and midpoint</div><div className="mt-2 font-mono text-sm text-fd-foreground">low = {step.low}, high = {step.high}<br />mid = {step.low} + ({step.high} - {step.low}) / 2 = {step.mid}<br /><strong>arr[{step.mid}] = {step.value}</strong></div></div>
          <div className="rounded-xl border border-fd-border bg-fd-background p-4"><div className="text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">Decision</div><div className="mt-2 font-mono text-base font-semibold text-fd-foreground">{step.condition}</div><p className="mb-0 mt-2 text-sm text-fd-muted-foreground">{step.next}</p></div>
        </div>
        <Controls index={index} total={BINARY_STEPS.length} onChange={setIndex} />
      </div>
      <div className="border-t border-fd-border bg-fd-muted/15 px-4 py-5 sm:px-6">
        <h4 className="m-0 text-base font-semibold text-fd-foreground">Dry-run table</h4>
        <div className="mt-3 overflow-x-auto"><table className="trace-table w-full border-collapse text-left text-sm"><thead className="border-b border-fd-border text-xs uppercase tracking-wide text-fd-muted-foreground"><tr><th className="px-3 py-2">Iteration</th><th className="px-3 py-2">low</th><th className="px-3 py-2">mid</th><th className="px-3 py-2">high</th><th className="px-3 py-2">arr[mid]</th><th className="px-3 py-2">Decision</th></tr></thead><tbody>{BINARY_STEPS.map((row, rowIndex) => <tr key={row.iteration} className={rowIndex === index ? 'bg-blue-500/10' : 'border-b border-fd-border/70 last:border-0'}><td data-label="Iteration" className="px-3 py-2">{row.iteration}</td><td data-label="low" className="px-3 py-2 font-mono">{row.low}</td><td data-label="mid" className="px-3 py-2 font-mono">{row.mid}</td><td data-label="high" className="px-3 py-2 font-mono">{row.high}</td><td data-label="arr[mid]" className="px-3 py-2 font-mono">{row.value}</td><td data-label="Decision" data-wide className="px-3 py-2">{row.condition}; {row.next}</td></tr>)}</tbody></table></div>
        <p className="mb-0 mt-3 text-sm text-fd-foreground"><strong>Conclusion:</strong> after iteration 4, `low = 8` and `high = 7`. The range is empty, so 88 is absent.</p>
      </div>
    </section>
  );
}
