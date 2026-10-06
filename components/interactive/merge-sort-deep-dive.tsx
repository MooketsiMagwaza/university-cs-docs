'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

type Tone = 'waiting' | 'active' | 'complete' | 'consumed';

const toneClass: Record<Tone, string> = {
  waiting: 'border-fd-border bg-fd-background text-fd-foreground',
  active: 'border-blue-500 bg-blue-500/10 text-blue-700 ring-2 ring-blue-500/20 dark:text-blue-300',
  complete: 'border-emerald-600 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  consumed: 'border-fd-border bg-fd-muted/30 text-fd-muted-foreground line-through opacity-55',
};

function ValueCard({ value, tone = 'waiting', label }: { value: number | string; tone?: Tone; label?: string }) {
  return (
    <div className="text-center">
      <div className={`grid h-12 min-w-12 place-items-center rounded-lg border-2 px-2 font-mono font-semibold ${toneClass[tone]}`}>{value}</div>
      {label && <div className="mt-1 text-[0.65rem] font-semibold uppercase tracking-wide text-fd-muted-foreground">{label}</div>}
    </div>
  );
}

const MERGE_CHOICES = [
  { left: 0, right: 0, output: [2], condition: '2 <= 4 → true', action: 'Take 2 from the left; i becomes 1.', codeLine: 4 },
  { left: 1, right: 0, output: [2, 4], condition: '9 <= 4 → false', action: 'Take 4 from the right; j becomes 1.', codeLine: 6 },
  { left: 1, right: 1, output: [2, 4, 5], condition: '9 <= 5 → false', action: 'Take 5 from the right; j becomes 2.', codeLine: 6 },
  { left: 1, right: 2, output: [2, 4, 5, 8], condition: '9 <= 8 → false', action: 'Take 8 from the right; j becomes 3.', codeLine: 6 },
  { left: 1, right: 3, output: [2, 4, 5, 8, 9], condition: 'j == right.length → 3 == 3', action: 'The right run is empty. Copy leftover 9 without another key comparison.', codeLine: 9 },
] as const;

const MERGE_CODE = [
  'while (i < left.length && j < right.length) {',
  '    // Only the two front values can be next.',
  '    if (left[i] <= right[j]) {',
  '        temp[out++] = left[i++];',
  '    } else {',
  '        temp[out++] = right[j++];',
  '    }',
  '}',
  'while (i < left.length) temp[out++] = left[i++];',
  'while (j < right.length) temp[out++] = right[j++];',
];

function PointerRun({ title, values, pointer }: { title: string; values: number[]; pointer: number }) {
  return (
    <div>
      <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">{title}</div>
      <div className="flex flex-wrap gap-2">
        {values.map((value, index) => (
          <ValueCard key={`${title}-${value}-${index}`} value={value} tone={index < pointer ? 'consumed' : index === pointer ? 'active' : 'waiting'} label={index === pointer ? 'front' : `${index}`} />
        ))}
      </div>
    </div>
  );
}

export function MergeFrontWorkbench() {
  const [index, setIndex] = useState(0);
  const rowRefs = useRef<Array<HTMLTableRowElement | null>>([]);
  const step = MERGE_CHOICES[index];

  useEffect(() => {
    rowRefs.current[index]?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }, [index]);

  return (
    <section className="not-prose my-10 overflow-hidden rounded-2xl border border-fd-border bg-fd-background shadow-sm">
      <header className="border-b border-fd-border px-4 py-5 sm:px-6">
        <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-fd-muted-foreground">Plain-language diagram</p>
        <h3 className="mb-0 mt-1 text-xl font-semibold text-fd-foreground">Merge means: compare the two front cards</h3>
        <p className="mb-0 mt-2 max-w-3xl text-sm leading-6 text-fd-muted-foreground">Both input runs are already sorted. Therefore the smallest remaining value must be at one of their fronts. Choose it, append it to the output, and advance only that pointer.</p>
      </header>

      <div className="grid gap-5 px-4 py-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(18rem,.85fr)] sm:px-6">
        <div className="space-y-5 rounded-2xl border border-fd-border bg-fd-muted/15 p-4 sm:p-5" aria-live="polite">
          <PointerRun title="Left sorted run" values={[2, 9]} pointer={step.left} />
          <PointerRun title="Right sorted run" values={[4, 5, 8]} pointer={step.right} />
          <div>
            <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">Temporary output</div>
            <div className="flex flex-wrap gap-2">
              {[0, 1, 2, 3, 4].map((slot) => <ValueCard key={slot} value={step.output[slot] ?? '·'} tone={slot < step.output.length ? 'complete' : 'waiting'} label={`out ${slot}`} />)}
            </div>
          </div>
          <div className="rounded-xl border-l-4 border-blue-500 bg-fd-background p-4">
            <div className="font-mono text-sm font-semibold text-blue-700 dark:text-blue-300">{step.condition}</div>
            <p className="mb-0 mt-2 text-sm text-fd-foreground"><strong>Therefore:</strong> {step.action}</p>
          </div>
        </div>

        <div className="overflow-hidden rounded-xl border border-zinc-700 bg-zinc-950 text-zinc-100">
          <div className="flex items-center gap-1.5 border-b border-zinc-800 px-4 py-3 text-xs text-zinc-400">
            <i className="h-2.5 w-2.5 rounded-full bg-red-400" /><i className="h-2.5 w-2.5 rounded-full bg-amber-300" /><i className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
            <span className="ml-2">merge.java · synchronized line</span>
          </div>
          <ol className="m-0 list-none py-3 font-mono text-[12px] leading-6">
            {MERGE_CODE.map((line, lineIndex) => {
              const number = lineIndex + 1;
              const selected = number === step.codeLine;
              return <li key={number} className={`grid grid-cols-[2.25rem_1fr] px-3 ${selected ? 'bg-blue-500/25 text-white' : 'text-zinc-300'}`}><span className="select-none text-right text-zinc-600">{number}</span><code className="whitespace-pre pl-3">{line}</code></li>;
            })}
          </ol>
        </div>
      </div>

      <div className="border-t border-fd-border px-4 py-4 sm:px-6">
        <div className="mb-4 rounded-xl border-2 border-blue-500 bg-blue-500/5 p-4">
          <div className="text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">Current trace row · choice {index + 1}</div>
          <div className="mt-2 grid gap-2 text-sm sm:grid-cols-[1fr_1.5fr]"><code>{step.condition}</code><span>{step.action}</span></div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => setIndex(0)} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-fd-border px-3 py-2 text-sm"><RotateCcw className="h-4 w-4" /> Reset</button>
          <button type="button" disabled={index === 0} onClick={() => setIndex((value) => value - 1)} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-fd-border px-3 py-2 text-sm disabled:opacity-40"><ChevronLeft className="h-4 w-4" /> Previous</button>
          <button type="button" disabled={index === MERGE_CHOICES.length - 1} onClick={() => setIndex((value) => value + 1)} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-fd-primary px-4 py-2 text-sm font-semibold text-fd-primary-foreground disabled:opacity-40">Next <ChevronRight className="h-4 w-4" /></button>
          <span className="ml-auto text-xs text-fd-muted-foreground">Choice {index + 1} of {MERGE_CHOICES.length}</span>
        </div>
      </div>

      <div className="border-t border-fd-border bg-fd-muted/15 px-4 py-5 sm:px-6">
        <h4 className="m-0 text-base font-semibold text-fd-foreground">Reference-style trace table</h4>
        <p className="mb-3 mt-1 text-sm text-fd-muted-foreground">The player, highlighted code line, current-row card, and table row all use the same step.</p>
        <div className="max-h-[28rem] overflow-auto rounded-xl border border-fd-border">
          <table className="trace-table w-full border-collapse text-left text-sm">
            <thead className="sticky top-0 bg-fd-background text-xs uppercase tracking-wide text-fd-muted-foreground"><tr><th className="px-3 py-2">Choice</th><th className="px-3 py-2">Statement with values</th><th className="px-3 py-2">Output</th><th className="px-3 py-2">Consequence</th></tr></thead>
            <tbody>{MERGE_CHOICES.map((row, rowIndex) => <tr ref={(node) => { rowRefs.current[rowIndex] = node; }} key={rowIndex} aria-current={rowIndex === index ? 'step' : undefined} onClick={() => setIndex(rowIndex)} className={`cursor-pointer border-b border-fd-border/70 last:border-0 ${rowIndex === index ? 'border-l-4 border-l-blue-500 bg-blue-500/15 font-medium' : 'hover:bg-fd-muted/40'}`}><td data-label="Choice" className="px-3 py-3">{rowIndex + 1}{rowIndex === index && <span className="ml-2 rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">Current</span>}</td><td data-label="Statement" data-wide className="px-3 py-3 font-mono">{row.condition}</td><td data-label="Output" className="px-3 py-3 font-mono">[{row.output.join(', ')}]</td><td data-label="Consequence" data-wide className="px-3 py-3">{row.action}</td></tr>)}</tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

type CallScene = { label: string; active: string[]; complete: string[]; stack: string[]; note: string };

const CALL_SCENES: CallScene[] = [
  { label: 'Call 0..7', active: ['0-7'], complete: [], stack: ['sort(0, 7)'], note: 'The first frame splits at mid = 3, then pauses while its left child runs.' },
  { label: 'Call 0..3', active: ['0-3'], complete: [], stack: ['sort(0, 7) · waiting for left', 'sort(0, 3)'], note: 'Java always enters the left recursive call before the right recursive call.' },
  { label: 'Call 0..1', active: ['0-1'], complete: [], stack: ['sort(0, 7) · waiting', 'sort(0, 3) · waiting', 'sort(0, 1)'], note: 'The active range keeps halving. No cards move during these calls.' },
  { label: 'Base cases 0 and 1', active: ['0', '1'], complete: [], stack: ['sort(0, 7) · waiting', 'sort(0, 3) · waiting', 'sort(0, 1) · children return'], note: 'One-card ranges satisfy start >= end and return immediately.' },
  { label: 'Merge 0..1', active: ['0-1'], complete: ['0', '1'], stack: ['sort(0, 7) · waiting', 'sort(0, 3) · waiting', 'merge(0, 0, 1)'], note: 'Both children are sorted, so the suspended parent may now merge them.' },
  { label: 'Finish 2..3', active: ['2-3'], complete: ['0-1', '0', '1', '2', '3'], stack: ['sort(0, 7) · waiting', 'sort(0, 3) · waiting', 'merge(2, 2, 3)'], note: 'The second pair of the left half is completed next.' },
  { label: 'Merge 0..3', active: ['0-3'], complete: ['0-1', '2-3', '0', '1', '2', '3'], stack: ['sort(0, 7) · waiting', 'merge(0, 1, 3)'], note: 'The whole left half finishes before Java starts the right half.' },
  { label: 'Finish 4..5', active: ['4-5'], complete: ['0-3', '0-1', '2-3', '0', '1', '2', '3', '4', '5'], stack: ['sort(0, 7) · waiting for right', 'sort(4, 7) · waiting', 'merge(4, 4, 5)'], note: 'Only now does the root work through the right subtree.' },
  { label: 'Finish 6..7', active: ['6-7'], complete: ['0-3', '0-1', '2-3', '4-5', '0', '1', '2', '3', '4', '5', '6', '7'], stack: ['sort(0, 7) · waiting for right', 'sort(4, 7) · waiting', 'merge(6, 6, 7)'], note: 'The last pair returns, allowing the right-half parent to merge.' },
  { label: 'Merge 4..7', active: ['4-7'], complete: ['0-3', '4-5', '6-7', '0-1', '2-3', '0', '1', '2', '3', '4', '5', '6', '7'], stack: ['sort(0, 7) · children ready', 'merge(4, 5, 7)'], note: 'The right half becomes one sorted run.' },
  { label: 'Final merge 0..7', active: ['0-7'], complete: ['0-3', '4-7', '0-1', '2-3', '4-5', '6-7', '0', '1', '2', '3', '4', '5', '6', '7'], stack: ['merge(0, 3, 7)'], note: 'The root combines its two sorted halves. When this merge returns, the call stack is empty.' },
];

const NODES = [
  { id: '0-7', x: 400, y: 35, label: '0..7' },
  { id: '0-3', x: 205, y: 125, label: '0..3' }, { id: '4-7', x: 595, y: 125, label: '4..7' },
  { id: '0-1', x: 110, y: 215, label: '0..1' }, { id: '2-3', x: 300, y: 215, label: '2..3' }, { id: '4-5', x: 500, y: 215, label: '4..5' }, { id: '6-7', x: 690, y: 215, label: '6..7' },
  { id: '0', x: 65, y: 305, label: '0' }, { id: '1', x: 155, y: 305, label: '1' }, { id: '2', x: 255, y: 305, label: '2' }, { id: '3', x: 345, y: 305, label: '3' },
  { id: '4', x: 455, y: 305, label: '4' }, { id: '5', x: 545, y: 305, label: '5' }, { id: '6', x: 645, y: 305, label: '6' }, { id: '7', x: 735, y: 305, label: '7' },
];

const EDGES = [['0-7', '0-3'], ['0-7', '4-7'], ['0-3', '0-1'], ['0-3', '2-3'], ['4-7', '4-5'], ['4-7', '6-7'], ['0-1', '0'], ['0-1', '1'], ['2-3', '2'], ['2-3', '3'], ['4-5', '4'], ['4-5', '5'], ['6-7', '6'], ['6-7', '7']] as const;

export function MergeRecursionExplorer() {
  const [index, setIndex] = useState(0);
  const scene = CALL_SCENES[index];
  const nodeById = Object.fromEntries(NODES.map((node) => [node.id, node]));

  return (
    <section className="not-prose my-10 overflow-hidden rounded-2xl border border-fd-border bg-fd-background shadow-sm">
      <header className="border-b border-fd-border px-4 py-5 sm:px-6"><p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-fd-muted-foreground">Recursion diagram</p><h3 className="mb-0 mt-1 text-xl font-semibold text-fd-foreground">The tree and call stack move together</h3><p className="mb-0 mt-2 text-sm leading-6 text-fd-muted-foreground">Blue is executing now. Green has returned. Grey is still waiting. Parent frames remain on the stack while a child call runs.</p></header>
      <div className="grid gap-5 px-4 py-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(16rem,.7fr)] sm:px-6">
        <div className="overflow-x-auto rounded-2xl border border-fd-border bg-fd-muted/15 p-3">
          <svg viewBox="0 0 800 355" role="img" aria-labelledby="merge-tree-title merge-tree-desc" className="min-w-[42rem]">
            <title id="merge-tree-title">Merge sort recursion tree for index range zero through seven</title>
            <desc id="merge-tree-desc">The active ranges are blue, completed ranges green, and ranges not yet visited grey.</desc>
            {EDGES.map(([from, to]) => <line key={`${from}-${to}`} x1={nodeById[from].x} y1={nodeById[from].y + 24} x2={nodeById[to].x} y2={nodeById[to].y - 24} stroke="currentColor" className="text-fd-border" strokeWidth="2" />)}
            {NODES.map((node) => {
              const activeNode = scene.active.includes(node.id);
              const completeNode = scene.complete.includes(node.id);
              const fill = activeNode ? '#2563eb' : completeNode ? '#059669' : 'var(--color-fd-background)';
              const text = activeNode || completeNode ? '#ffffff' : 'currentColor';
              return <g key={node.id}><rect x={node.x - 34} y={node.y - 22} width="68" height="44" rx="10" fill={fill} stroke={activeNode ? '#1d4ed8' : completeNode ? '#047857' : 'currentColor'} strokeWidth={activeNode ? 4 : 2} className={!activeNode && !completeNode ? 'text-fd-border' : undefined} /><text x={node.x} y={node.y + 5} textAnchor="middle" fill={text} fontFamily="ui-monospace, monospace" fontSize="15" fontWeight="700">{node.label}</text></g>;
            })}
          </svg>
        </div>
        <div>
          <div className="text-xs font-semibold uppercase tracking-wide text-fd-muted-foreground">Call stack · bottom to top</div>
          <div className="mt-3 flex flex-col-reverse gap-2">
            {scene.stack.map((frame, frameIndex) => <div key={frame} className={`rounded-xl border-2 p-3 font-mono text-sm ${frameIndex === scene.stack.length - 1 ? 'border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-300' : 'border-fd-border bg-fd-muted/20 text-fd-muted-foreground'}`}>{frame}{frameIndex === scene.stack.length - 1 && <span className="ml-2 text-[10px] font-bold uppercase">active</span>}</div>)}
          </div>
          <div className="mt-4 rounded-xl border-l-4 border-blue-500 bg-fd-muted/20 p-4"><div className="text-xs font-bold uppercase tracking-wide text-blue-700 dark:text-blue-300">{scene.label}</div><p className="mb-0 mt-2 text-sm leading-6">{scene.note}</p></div>
        </div>
      </div>
      <div className="border-t border-fd-border px-4 py-4 sm:px-6"><div className="flex flex-wrap items-center gap-2"><button type="button" onClick={() => setIndex(0)} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-fd-border px-3 py-2 text-sm"><RotateCcw className="h-4 w-4" /> Reset</button><button type="button" disabled={index === 0} onClick={() => setIndex((value) => value - 1)} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-fd-border px-3 py-2 text-sm disabled:opacity-40"><ChevronLeft className="h-4 w-4" /> Previous</button><button type="button" disabled={index === CALL_SCENES.length - 1} onClick={() => setIndex((value) => value + 1)} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-fd-primary px-4 py-2 text-sm font-semibold text-fd-primary-foreground disabled:opacity-40">Next <ChevronRight className="h-4 w-4" /></button><span className="ml-auto text-xs text-fd-muted-foreground">Scene {index + 1} of {CALL_SCENES.length}</span></div></div>
    </section>
  );
}

export function MergeComplexityFigure() {
  const levels = [
    [[63, 29, 72, 85, 18, 49, 3, 54]],
    [[63, 29, 72, 85], [18, 49, 3, 54]],
    [[63, 29], [72, 85], [18, 49], [3, 54]],
    [[63], [29], [72], [85], [18], [49], [3], [54]],
  ];
  return (
    <figure className="not-prose my-8 overflow-hidden rounded-2xl border border-fd-border bg-fd-background p-4 sm:p-6">
      <figcaption><p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-fd-muted-foreground">Complexity diagram</p><h3 className="mb-0 mt-1 text-xl font-semibold">Why the time is O(n log n)</h3><p className="mb-0 mt-2 text-sm text-fd-muted-foreground">Eight cards create log₂8 = 3 merge levels. Across each level, all eight cards are copied once: n work × log n levels.</p></figcaption>
      <div className="mt-6 space-y-5">
        {levels.map((runs, level) => <div key={level} className="grid gap-3 sm:grid-cols-[7rem_1fr_6rem] sm:items-center"><div className="text-sm font-semibold">{level === levels.length - 1 ? 'Base cases' : `Level ${level}`}</div><div className="flex flex-wrap gap-2">{runs.map((run, runIndex) => <div key={runIndex} className="flex gap-1 rounded-lg border border-fd-border bg-fd-muted/20 p-1.5">{run.map((value, valueIndex) => <span key={`${value}-${valueIndex}`} className="grid h-8 min-w-8 place-items-center rounded border border-blue-500/50 bg-blue-500/5 px-1 font-mono text-xs">{value}</span>)}</div>)}</div><div className="rounded-full bg-emerald-500/10 px-3 py-1 text-center text-xs font-bold text-emerald-700 dark:text-emerald-300">8 cards</div></div>)}
      </div>
      <div className="mt-6 grid gap-3 sm:grid-cols-3"><div className="rounded-xl border border-fd-border p-4"><strong>3 merge levels</strong><p className="mb-0 mt-1 text-sm text-fd-muted-foreground">That is log₂8.</p></div><div className="rounded-xl border border-fd-border p-4"><strong>8 copied positions per level</strong><p className="mb-0 mt-1 text-sm text-fd-muted-foreground">That is n.</p></div><div className="rounded-xl border-2 border-blue-500 bg-blue-500/5 p-4"><strong>8 × 3 = 24</strong><p className="mb-0 mt-1 text-sm text-fd-muted-foreground">So growth is n log n.</p></div></div>
    </figure>
  );
}
