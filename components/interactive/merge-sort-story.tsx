'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

type RunState = 'active' | 'complete' | 'waiting';
type MergeScene = {
  label: string;
  groups: Array<{ values: number[]; state: RunState }>;
  explanation: string;
};

const MERGES = [
  { step: 1, left: '[63]', right: '[29]', decision: '63 ≤ 29 → false; take 29; copy leftover 63', result: '[29, 63]' },
  { step: 2, left: '[72]', right: '[85]', decision: '72 ≤ 85 → true; take 72; copy leftover 85', result: '[72, 85]' },
  { step: 3, left: '[29, 63]', right: '[72, 85]', decision: '29 ≤ 72 → true; 63 ≤ 72 → true; copy leftovers 72, 85', result: '[29, 63, 72, 85]' },
  { step: 4, left: '[18]', right: '[49]', decision: '18 ≤ 49 → true; take 18; copy leftover 49', result: '[18, 49]' },
  { step: 5, left: '[3]', right: '[54]', decision: '3 ≤ 54 → true; take 3; copy leftover 54', result: '[3, 54]' },
  { step: 6, left: '[18, 49]', right: '[3, 54]', decision: '18 ≤ 3 → false; 18 ≤ 54 → true; 49 ≤ 54 → true; copy leftover 54', result: '[3, 18, 49, 54]' },
  { step: 7, left: '[29, 63, 72, 85]', right: '[3, 18, 49, 54]', decision: '29 ≤ 3 → false; 29 ≤ 18 → false; 29 ≤ 49 → true; 63 ≤ 49 → false; 63 ≤ 54 → false; copy left leftovers', result: '[3, 18, 29, 49, 54, 63, 72, 85]' },
];

const complete = (values: number[]) => ({ values, state: 'complete' as const });
const active = (values: number[]) => ({ values, state: 'active' as const });
const waiting = (values: number[]) => ({ values, state: 'waiting' as const });

const SCENES: MergeScene[] = [
  { label: 'Return 1', groups: [active([29, 63]), waiting([72]), waiting([85]), waiting([18]), waiting([49]), waiting([3]), waiting([54])], explanation: 'The first two one-card calls return as [29, 63]. The untouched cards remain visible to show that Java has not reached them yet.' },
  { label: 'Return 2', groups: [complete([29, 63]), active([72, 85]), waiting([18]), waiting([49]), waiting([3]), waiting([54])], explanation: 'The second pair returns as [72, 85]. These are the two sorted runs needed by the left-half merge.' },
  { label: 'Return 3', groups: [active([29, 63, 72, 85]), waiting([18]), waiting([49]), waiting([3]), waiting([54])], explanation: 'The entire left half is now sorted. Only after this return does recursion work through the right half.' },
  { label: 'Return 4', groups: [complete([29, 63, 72, 85]), active([18, 49]), waiting([3]), waiting([54])], explanation: 'The first pair in the right half returns as [18, 49].' },
  { label: 'Return 5', groups: [complete([29, 63, 72, 85]), complete([18, 49]), active([3, 54])], explanation: 'The second pair in the right half returns as [3, 54].' },
  { label: 'Return 6', groups: [complete([29, 63, 72, 85]), active([3, 18, 49, 54])], explanation: 'The right half is complete. The root call now has the two sorted halves it needs.' },
  { label: 'Return 7', groups: [active([3, 18, 29, 49, 54, 63, 72, 85])], explanation: 'The final call merges both sorted halves and returns the fully sorted array.' },
];

function Run({ values, state }: { values: number[]; state: RunState }) {
  const tone = state === 'active'
    ? 'border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300'
    : state === 'complete'
      ? 'border-emerald-600 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300'
      : 'border-fd-border bg-fd-background text-fd-muted-foreground';
  return (
    <div className="flex flex-wrap justify-center gap-1.5 rounded-xl border border-fd-border bg-fd-background p-2" aria-label={`Run ${values.join(', ')}`}>
      {values.map((value, index) => <div key={`${value}-${index}`} className={`flex h-11 w-11 items-center justify-center rounded-lg border-2 font-mono font-semibold ${tone}`}>{value}</div>)}
    </div>
  );
}

export function MergeSortStory() {
  const [index, setIndex] = useState(0);
  const scene = SCENES[index];
  const goTo = (next: number) => setIndex(Math.max(0, Math.min(SCENES.length - 1, next)));

  return (
    <section className="not-prose my-10 overflow-hidden rounded-2xl border border-fd-border bg-fd-background shadow-sm">
      <header className="border-b border-fd-border px-4 py-5 sm:px-6"><p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-fd-muted-foreground">Visual walkthrough</p><h3 className="mb-0 mt-1 text-xl font-semibold text-fd-foreground">Merge sort: one completed return at a time</h3><p className="mb-0 mt-1 text-sm text-fd-muted-foreground">The split creates one-card ranges. These seven scenes follow the actual depth-first return order.</p></header>
      <div className="border-b border-fd-border px-4 py-3 sm:px-6"><div className="flex flex-wrap gap-2">{SCENES.map((item, sceneIndex) => <button key={item.label} type="button" onClick={() => setIndex(sceneIndex)} aria-pressed={index === sceneIndex} className={`rounded-full px-3 py-1.5 text-sm ${index === sceneIndex ? 'bg-fd-primary text-fd-primary-foreground' : 'bg-fd-muted text-fd-muted-foreground'}`}>{item.label}</button>)}</div></div>
      <div className="px-4 py-6 sm:px-6" aria-live="polite">
        <div className="mb-4 flex items-start justify-between gap-3"><div><p className="m-0 text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">Returning up the call tree</p><h4 className="mb-0 mt-1 text-lg font-semibold text-fd-foreground">{scene.label}</h4></div><span className="rounded-full bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300">current return</span></div>
        <div className="rounded-2xl border border-fd-border bg-fd-muted/15 p-5">
          <div className="merge-runs-grid">{scene.groups.map((group, groupIndex) => <Run key={`${index}-${groupIndex}`} values={group.values} state={group.state} />)}</div>
          <div className="mt-5 flex flex-wrap justify-center gap-4 text-xs text-fd-muted-foreground"><span><strong className="text-blue-700 dark:text-blue-300">Blue</strong> = this return</span><span><strong className="text-emerald-700 dark:text-emerald-300">Green</strong> = completed earlier</span><span>Grey = not reached yet</span></div>
        </div>
        <p className="mb-0 mt-4 rounded-xl border border-fd-border p-4 text-sm leading-6 text-fd-foreground">{scene.explanation}</p>
        <div className="mt-4 flex flex-wrap items-center gap-2"><button type="button" onClick={() => goTo(0)} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-fd-border px-3 py-2 text-sm"><RotateCcw className="h-4 w-4" /> Reset</button><button type="button" disabled={index === 0} onClick={() => goTo(index - 1)} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-fd-border px-3 py-2 text-sm disabled:opacity-40"><ChevronLeft className="h-4 w-4" /> Previous</button><button type="button" disabled={index === SCENES.length - 1} onClick={() => goTo(index + 1)} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-fd-primary px-4 py-2 text-sm font-semibold text-fd-primary-foreground disabled:opacity-40">Next <ChevronRight className="h-4 w-4" /></button><span className="ml-auto text-xs text-fd-muted-foreground">Scene {index + 1} of {SCENES.length}</span></div>
      </div>
      <div className="border-t border-fd-border bg-fd-muted/15 px-4 py-5 sm:px-6"><h4 className="m-0 text-base font-semibold text-fd-foreground">Dry-run return table</h4><p className="mb-0 mt-1 text-sm text-fd-muted-foreground">Use one row per completed merge call. Comparisons are grouped inside the row; individual assignments do not become extra steps.</p><div className="mt-3 overflow-x-auto"><table className="trace-table w-full border-collapse text-left text-sm"><thead className="border-b border-fd-border text-xs uppercase tracking-wide text-fd-muted-foreground"><tr><th className="px-3 py-2">Return</th><th className="px-3 py-2">Input runs</th><th className="px-3 py-2">Evaluated statements</th><th className="px-3 py-2">Merged result</th></tr></thead><tbody>{MERGES.map((row, rowIndex) => <tr key={row.step} className={rowIndex === index ? 'bg-blue-500/10' : 'border-b border-fd-border/70 last:border-0'}><td data-label="Return" className="px-3 py-2">{row.step}</td><td data-label="Input runs" className="px-3 py-2 font-mono">{row.left} + {row.right}</td><td data-label="Evaluated statements" data-wide className="min-w-72 px-3 py-2 text-fd-muted-foreground">{row.decision}</td><td data-label="Merged result" data-wide className="px-3 py-2 font-mono">{row.result}</td></tr>)}</tbody></table></div></div>
    </section>
  );
}
