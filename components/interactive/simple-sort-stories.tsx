'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

type SortKind = 'bubble' | 'selection';
type SortPass = {
  pass: number;
  before: number[];
  after: number[];
  operations: string[];
  summary: string;
  comparisons: number;
  swaps: number;
  selectedIndex?: number;
  minimumIndex?: number;
};

const BUBBLE_PASSES: SortPass[] = [
  { pass: 1, before: [4, 2, 5, 1, 3], after: [2, 4, 1, 3, 5], operations: ['4 > 2 → swap', '4 > 5 → no swap', '5 > 1 → swap', '5 > 3 → swap'], summary: 'The largest unsorted value, 5, has bubbled to the final index.', comparisons: 4, swaps: 3 },
  { pass: 2, before: [2, 4, 1, 3, 5], after: [2, 1, 3, 4, 5], operations: ['2 > 4 → no swap', '4 > 1 → swap', '4 > 3 → swap'], summary: 'The next largest value, 4, is now fixed before 5.', comparisons: 3, swaps: 2 },
  { pass: 3, before: [2, 1, 3, 4, 5], after: [1, 2, 3, 4, 5], operations: ['2 > 1 → swap', '2 > 3 → no swap'], summary: '3 is fixed. The remaining two values also end up ordered.', comparisons: 2, swaps: 1 },
  { pass: 4, before: [1, 2, 3, 4, 5], after: [1, 2, 3, 4, 5], operations: ['1 > 2 → no swap'], summary: 'No swap is needed. The whole array is sorted.', comparisons: 1, swaps: 0 },
];

const SELECTION_PASSES: SortPass[] = [
  { pass: 1, before: [4, 2, 5, 1, 3], after: [1, 2, 5, 4, 3], operations: ['2 < 4 → true; min = 2', '5 < 2 → false', '1 < 2 → true; min = 1', '3 < 1 → false', 'Swap indexes 0 and 3'], summary: 'Index 0 now holds the smallest value in the entire array.', comparisons: 4, swaps: 1, selectedIndex: 0, minimumIndex: 3 },
  { pass: 2, before: [1, 2, 5, 4, 3], after: [1, 2, 5, 4, 3], operations: ['5 < 2 → false', '4 < 2 → false', '3 < 2 → false', 'Minimum is already at index 1; no swap'], summary: 'Index 1 already contains the correct value.', comparisons: 3, swaps: 0, selectedIndex: 1, minimumIndex: 1 },
  { pass: 3, before: [1, 2, 5, 4, 3], after: [1, 2, 3, 4, 5], operations: ['4 < 5 → true; min = 4', '3 < 4 → true; min = 3', 'Swap indexes 2 and 4'], summary: 'Index 2 receives 3; the sorted prefix grows to three values.', comparisons: 2, swaps: 1, selectedIndex: 2, minimumIndex: 4 },
  { pass: 4, before: [1, 2, 3, 4, 5], after: [1, 2, 3, 4, 5], operations: ['5 < 4 → false', 'Minimum is already at index 3; no swap'], summary: 'The last two values are already ordered.', comparisons: 1, swaps: 0, selectedIndex: 3, minimumIndex: 3 },
];

function SortCards({ values, kind, pass, before, selectedIndex, minimumIndex }: { values: number[]; kind: SortKind; pass: number; before: boolean; selectedIndex?: number; minimumIndex?: number }) {
  return (
    <div className="insertion-card-row" role="img" aria-label={`Array ${values.join(', ')}`}>
      {values.map((value, index) => {
        const bubbleSorted = kind === 'bubble' && !before && index >= values.length - pass;
        const selectionSorted = kind === 'selection' && !before && index < pass;
        const selected = before && kind === 'selection' && index === selectedIndex;
        const minimum = before && kind === 'selection' && index === minimumIndex;
        const tone = minimum ? 'border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300' : selected ? 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-300' : bubbleSorted || selectionSorted ? 'border-emerald-600 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'border-fd-border bg-fd-background text-fd-foreground';
        return <div key={`${index}-${value}`} className="text-center"><div className={`mx-auto flex h-14 w-14 items-center justify-center rounded-xl border-2 font-mono text-lg font-semibold ${tone}`}>{value}</div><div className="mt-1 font-mono text-[0.7rem] text-fd-muted-foreground">{index}</div></div>;
      })}
    </div>
  );
}

function SortPassStory({ kind }: { kind: SortKind }) {
  const passes = kind === 'bubble' ? BUBBLE_PASSES : SELECTION_PASSES;
  const [index, setIndex] = useState(0);
  const current = passes[index];
  const title = kind === 'bubble' ? 'Bubble sort pushes the largest value right' : 'Selection sort chooses the smallest remaining value';

  return (
    <section className="not-prose my-10 overflow-hidden rounded-2xl border border-fd-border bg-fd-background shadow-sm">
      <header className="border-b border-fd-border px-4 py-5 sm:px-6"><p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-fd-muted-foreground">Visual walkthrough</p><h3 className="mb-0 mt-1 text-xl font-semibold text-fd-foreground">{title}</h3><p className="mb-0 mt-1 text-sm text-fd-muted-foreground">One scene equals one complete outer-loop pass.</p></header>
      <div className="border-b border-fd-border px-4 py-3 sm:px-6"><div className="flex flex-wrap gap-2">{passes.map((pass, passIndex) => <button key={pass.pass} type="button" onClick={() => setIndex(passIndex)} aria-pressed={index === passIndex} className={`rounded-full px-3 py-1.5 text-sm ${index === passIndex ? 'bg-fd-primary text-fd-primary-foreground' : 'bg-fd-muted text-fd-muted-foreground'}`}>Pass {pass.pass}</button>)}</div></div>
      <div className="px-4 py-6 sm:px-6">
        <div className="mb-4 flex flex-wrap items-start justify-between gap-3"><div><p className="m-0 text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">Pass {current.pass}</p><h4 className="mb-0 mt-1 text-lg font-semibold text-fd-foreground">{kind === 'bubble' ? `Compare neighbours up to index ${current.before.length - current.pass}` : `Fill index ${current.pass - 1}`}</h4></div><div className="flex gap-2 text-xs"><span className="rounded-full bg-blue-500/10 px-3 py-1.5 text-blue-700 dark:text-blue-300">{current.comparisons} comparisons</span><span className="rounded-full bg-red-500/10 px-3 py-1.5 text-red-700 dark:text-red-300">{current.swaps} swaps</span></div></div>
        <div className="insertion-pass-visual rounded-2xl border border-fd-border bg-fd-muted/15 p-4">
          <div><div className="mb-3 text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">Before</div><SortCards values={current.before} kind={kind} pass={current.pass} before selectedIndex={current.selectedIndex} minimumIndex={current.minimumIndex} /></div>
          <div className="rounded-xl border border-fd-border bg-fd-background p-4"><div className="text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">Operations</div><ol className="mb-0 mt-3 space-y-2 pl-5 text-sm text-fd-foreground">{current.operations.map((operation) => <li key={operation}>{operation}</li>)}</ol></div>
          <div><div className="mb-3 text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">After</div><SortCards values={current.after} kind={kind} pass={current.pass} before={false} /></div>
        </div>
        <p className="mb-0 mt-4 rounded-xl border border-fd-border p-4 text-sm text-fd-foreground">{current.summary}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2"><button type="button" onClick={() => setIndex(0)} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-fd-border px-3 py-2 text-sm"><RotateCcw className="h-4 w-4" /> Reset</button><button type="button" disabled={index === 0} onClick={() => setIndex((value) => value - 1)} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-fd-border px-3 py-2 text-sm disabled:opacity-40"><ChevronLeft className="h-4 w-4" /> Previous</button><button type="button" disabled={index === passes.length - 1} onClick={() => setIndex((value) => value + 1)} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-fd-primary px-4 py-2 text-sm font-semibold text-fd-primary-foreground disabled:opacity-40">Next <ChevronRight className="h-4 w-4" /></button><span className="ml-auto text-xs text-fd-muted-foreground">Pass {current.pass} of {passes.length}</span></div>
      </div>
      <div className="border-t border-fd-border bg-fd-muted/15 px-4 py-5 sm:px-6"><h4 className="m-0 text-base font-semibold text-fd-foreground">Dry-run table</h4><div className="mt-3 overflow-x-auto"><table className="trace-table w-full border-collapse text-left text-sm"><thead className="border-b border-fd-border text-xs uppercase tracking-wide text-fd-muted-foreground"><tr><th className="px-3 py-2">Pass</th><th className="px-3 py-2">Array before</th><th className="px-3 py-2">Operation</th><th className="px-3 py-2">Array after</th></tr></thead><tbody>{passes.map((pass, rowIndex) => <tr key={pass.pass} className={rowIndex === index ? 'bg-blue-500/10' : 'border-b border-fd-border/70 last:border-0'}><td data-label="Pass" className="px-3 py-2">{pass.pass}</td><td data-label="Array before" className="px-3 py-2 font-mono">[{pass.before.join(', ')}]</td><td data-label="Operation" data-wide className="min-w-72 px-3 py-2 text-fd-muted-foreground">{pass.operations.join('; ')}</td><td data-label="Array after" data-wide className="px-3 py-2 font-mono">[{pass.after.join(', ')}]</td></tr>)}</tbody></table></div></div>
    </section>
  );
}

export function BubbleSortStory() { return <SortPassStory kind="bubble" />; }
export function SelectionSortStory() { return <SortPassStory kind="selection" />; }
