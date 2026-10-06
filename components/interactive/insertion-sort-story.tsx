'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';

type Pass = {
  number: number;
  key: number;
  before: number[];
  after: number[];
  comparisons: Array<{ expression: string; result: boolean }>;
  shifts: number[];
  explanation: string;
  operation: string;
};

const START = [4, 2, 5, 1, 3];

const PASSES: Pass[] = [
  {
    number: 1,
    key: 2,
    before: [4, 2, 5, 1, 3],
    after: [2, 4, 5, 1, 3],
    comparisons: [{ expression: '4 > 2', result: true }],
    shifts: [4],
    explanation: '2 belongs before 4. Hold 2, shift 4 one place right, then place 2 in the open cell.',
    operation: '4 > 2: shift 4 right; insert 2 at index 0',
  },
  {
    number: 2,
    key: 5,
    before: [2, 4, 5, 1, 3],
    after: [2, 4, 5, 1, 3],
    comparisons: [{ expression: '4 > 5', result: false }],
    shifts: [],
    explanation: '4 is already smaller than 5. No card moves; 5 is already in the correct place.',
    operation: '4 > 5 is false: no shift; 5 stays at index 2',
  },
  {
    number: 3,
    key: 1,
    before: [2, 4, 5, 1, 3],
    after: [1, 2, 4, 5, 3],
    comparisons: [
      { expression: '5 > 1', result: true },
      { expression: '4 > 1', result: true },
      { expression: '2 > 1', result: true },
    ],
    shifts: [5, 4, 2],
    explanation: '1 is smaller than the whole sorted section. Shift 5, 4, and 2 right, then insert 1 at the front.',
    operation: '5 > 1, 4 > 1, 2 > 1: shift each right; insert 1 at index 0',
  },
  {
    number: 4,
    key: 3,
    before: [1, 2, 4, 5, 3],
    after: [1, 2, 3, 4, 5],
    comparisons: [
      { expression: '5 > 3', result: true },
      { expression: '4 > 3', result: true },
      { expression: '2 > 3', result: false },
    ],
    shifts: [5, 4],
    explanation: '5 and 4 move right. The first false comparison, 2 > 3, tells us to insert 3 immediately after 2.',
    operation: 'Shift 5 and 4; 2 > 3 is false; insert 3 at index 2',
  },
];

function ArrayCards({ values, sortedThrough, keyIndex }: { values: number[]; sortedThrough: number; keyIndex?: number }) {
  return (
    <div className="insertion-card-row" role="img" aria-label={`Array ${values.join(', ')}`}>
      {values.map((value, index) => {
        const isKey = index === keyIndex;
        const isSorted = index <= sortedThrough;
        return (
          <div key={`${index}-${value}`} className="text-center">
            <motion.div
              layout
              className={`mx-auto flex h-14 w-14 items-center justify-center rounded-xl border-2 font-mono text-lg font-semibold shadow-sm ${isKey ? 'border-red-500 bg-red-500/10 text-red-700 dark:text-red-300' : isSorted ? 'border-emerald-600 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'border-fd-border bg-fd-background text-fd-foreground'}`}
            >
              {value}
            </motion.div>
            <div className="mt-1 font-mono text-[0.7rem] text-fd-muted-foreground">{index}</div>
          </div>
        );
      })}
    </div>
  );
}

export function InsertionSortStory() {
  const reduceMotion = useReducedMotion();
  const [scene, setScene] = useState(0);
  const [playing, setPlaying] = useState(false);
  const current = scene === 0 ? undefined : PASSES[scene - 1];

  useEffect(() => {
    if (!playing) return;
    if (scene >= PASSES.length) {
      setPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => setScene((value) => value + 1), 2200);
    return () => window.clearTimeout(timer);
  }, [playing, scene]);

  const goTo = (next: number) => {
    setPlaying(false);
    setScene(Math.max(0, Math.min(PASSES.length, next)));
  };

  return (
    <section className="not-prose my-10 overflow-hidden rounded-2xl border border-fd-border bg-fd-background shadow-sm">
      <header className="border-b border-fd-border px-4 py-5 sm:px-6">
        <p className="m-0 text-xs font-semibold uppercase tracking-[0.16em] text-fd-muted-foreground">Visual walkthrough</p>
        <div className="mt-1 flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h3 className="m-0 text-xl font-semibold text-fd-foreground">Insertion sort in four passes</h3>
            <p className="mb-0 mt-1 max-w-2xl text-sm leading-6 text-fd-muted-foreground">One scene equals one pass, matching the pass table used in a dry-run answer.</p>
          </div>
          <div className="font-mono text-sm text-fd-muted-foreground">[4, 2, 5, 1, 3] <span aria-hidden="true">→</span> <strong className="text-fd-foreground">[1, 2, 3, 4, 5]</strong></div>
        </div>
      </header>

      <nav className="border-b border-fd-border px-4 py-3 sm:px-6" aria-label="Insertion-sort passes">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => goTo(0)} aria-pressed={scene === 0} className={`rounded-full px-3 py-1.5 text-sm ${scene === 0 ? 'bg-fd-primary text-fd-primary-foreground' : 'bg-fd-muted text-fd-muted-foreground'}`}>Start</button>
          {PASSES.map((pass) => (
            <button key={pass.number} type="button" onClick={() => goTo(pass.number)} aria-pressed={scene === pass.number} className={`rounded-full px-3 py-1.5 text-sm ${scene === pass.number ? 'bg-fd-primary text-fd-primary-foreground' : 'bg-fd-muted text-fd-muted-foreground'}`}>Pass {pass.number}</button>
          ))}
        </div>
      </nav>

      <div className="px-4 py-6 sm:px-6" aria-live="polite">
        {current ? (
          <>
            <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="m-0 text-xs font-semibold uppercase tracking-[0.14em] text-fd-muted-foreground">Pass {current.number}</p>
                <h4 className="mb-0 mt-1 text-lg font-semibold text-fd-foreground">Insert the key {current.key}</h4>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="rounded-full bg-blue-500/10 px-3 py-1.5 font-medium text-blue-700 dark:text-blue-300">{current.comparisons.length} comparison{current.comparisons.length === 1 ? '' : 's'}</span>
                <span className="rounded-full bg-red-500/10 px-3 py-1.5 font-medium text-red-700 dark:text-red-300">{current.shifts.length} shift{current.shifts.length === 1 ? '' : 's'}</span>
              </div>
            </div>

            <div className="insertion-pass-visual rounded-2xl border border-fd-border bg-fd-muted/15 p-4">
              <div>
                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-fd-muted-foreground">Before this pass</div>
                <ArrayCards values={current.before} sortedThrough={current.number - 1} keyIndex={current.number} />
                <div className="mt-3 text-center text-xs text-red-700 dark:text-red-300">Pick up key {current.key}</div>
              </div>

              <div className="rounded-xl border border-fd-border bg-fd-background p-4">
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-fd-muted-foreground">Check from right to left</div>
                <div className="mt-3 space-y-2">
                  {current.comparisons.map((comparison) => (
                    <div key={comparison.expression} className="flex items-center justify-between gap-3 border-b border-fd-border/60 pb-2 font-mono text-sm last:border-0 last:pb-0">
                      <span className="text-fd-foreground">{comparison.expression}</span>
                      <span className={comparison.result ? 'font-semibold text-emerald-700 dark:text-emerald-300' : 'font-semibold text-red-700 dark:text-red-300'}>{String(comparison.result)}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 border-t border-fd-border pt-3 text-sm text-fd-foreground">
                  {current.shifts.length > 0 ? <><strong>Shift right:</strong> {current.shifts.join(', ')}</> : <strong>No shift is needed.</strong>}
                </div>
              </div>

              <div>
                <div className="mb-3 text-xs font-semibold uppercase tracking-[0.14em] text-fd-muted-foreground">After this pass</div>
                <ArrayCards values={current.after} sortedThrough={current.number} />
                <div className="mt-3 text-center text-xs text-emerald-700 dark:text-emerald-300">Indexes 0 to {current.number} are sorted</div>
              </div>
            </div>

            <p className="mb-0 mt-4 rounded-xl border border-fd-border bg-fd-background p-4 text-sm leading-6 text-fd-foreground">{current.explanation}</p>
          </>
        ) : (
          <div className="rounded-2xl border border-fd-border bg-fd-muted/15 p-5">
            <h4 className="m-0 text-lg font-semibold text-fd-foreground">The whole idea before any code</h4>
            <div className="mt-5"><ArrayCards values={START} sortedThrough={0} /></div>
            <div className="mx-auto mt-6 grid max-w-2xl gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-red-500/50 bg-red-500/5 p-3 text-sm"><strong className="block text-red-700 dark:text-red-300">1. Pick up</strong><span className="text-fd-muted-foreground">Save the next card as the key.</span></div>
              <div className="rounded-xl border border-blue-500/50 bg-blue-500/5 p-3 text-sm"><strong className="block text-blue-700 dark:text-blue-300">2. Shift</strong><span className="text-fd-muted-foreground">Move larger cards one cell right.</span></div>
              <div className="rounded-xl border border-emerald-500/50 bg-emerald-500/5 p-3 text-sm"><strong className="block text-emerald-700 dark:text-emerald-300">3. Insert</strong><span className="text-fd-muted-foreground">Place the key in the gap.</span></div>
            </div>
          </div>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button type="button" onClick={() => goTo(0)} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-sm text-fd-foreground"><RotateCcw className="h-4 w-4" /> Reset</button>
          <button type="button" disabled={scene === 0} onClick={() => goTo(scene - 1)} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-sm text-fd-foreground disabled:opacity-40"><ChevronLeft className="h-4 w-4" /> Previous</button>
          <button type="button" onClick={() => setPlaying((value) => !value)} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-fd-primary px-4 py-2 text-sm font-semibold text-fd-primary-foreground">{playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" fill="currentColor" />}{playing ? 'Pause' : 'Play'}</button>
          <button type="button" disabled={scene === PASSES.length} onClick={() => goTo(scene + 1)} className="inline-flex min-h-11 items-center gap-1.5 rounded-lg border border-fd-border bg-fd-background px-3 py-2 text-sm text-fd-foreground disabled:opacity-40">Next <ChevronRight className="h-4 w-4" /></button>
          <span className="ml-auto text-xs text-fd-muted-foreground">{scene === 0 ? 'Overview' : `Pass ${scene} of ${PASSES.length}`}</span>
        </div>
      </div>

      <div className="border-t border-fd-border bg-fd-muted/15 px-4 py-5 sm:px-6">
        <h4 className="m-0 text-base font-semibold text-fd-foreground">Dry-run table</h4>
        <p className="mb-0 mt-1 text-sm text-fd-muted-foreground">This is the compact format to reproduce when a question asks for the array at the end of each pass.</p>
        <div className="mt-3 overflow-x-auto">
          <table className="trace-table w-full border-collapse text-left text-sm">
            <thead className="border-b border-fd-border text-xs uppercase tracking-wide text-fd-muted-foreground">
              <tr><th className="px-3 py-2">Pass</th><th className="px-3 py-2">Array before</th><th className="px-3 py-2">Operation</th><th className="px-3 py-2">Array after</th></tr>
            </thead>
            <tbody>
              <tr className={scene === 0 ? 'bg-blue-500/10' : 'border-b border-fd-border/70'}><td data-label="Pass" className="px-3 py-2 font-medium">Start</td><td data-label="Array before" className="px-3 py-2 font-mono">[4, 2, 5, 1, 3]</td><td data-label="Operation" data-wide className="px-3 py-2 text-fd-muted-foreground">The first value forms a sorted section of one.</td><td data-label="Array after" data-wide className="px-3 py-2 font-mono">[4, 2, 5, 1, 3]</td></tr>
              {PASSES.map((pass) => (
                <tr key={pass.number} className={scene === pass.number ? 'bg-blue-500/10' : 'border-b border-fd-border/70 last:border-0'}>
                  <td data-label="Pass" className="px-3 py-2 font-medium text-fd-foreground">{pass.number}</td>
                  <td data-label="Array before" className="px-3 py-2 font-mono text-fd-foreground">[{pass.before.join(', ')}]</td>
                  <td data-label="Operation" data-wide className="min-w-72 px-3 py-2 text-fd-muted-foreground">{pass.operation}</td>
                  <td data-label="Array after" data-wide className="px-3 py-2 font-mono text-fd-foreground">[{pass.after.join(', ')}]</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
