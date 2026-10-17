'use client';

import { Pause, Play, RotateCcw, Settings2, SkipForward } from 'lucide-react';
import Link from 'next/link';
import type { CSSProperties, Ref } from 'react';
import { useStudyTimer } from '../timer-provider';
import { formatTimer } from '../timer-types';
import { TimerBlocks } from './timer-blocks';
import { TimerLabel } from './timer-label';

export function TimerPopover({ close, popoverRef, style }: { close(): void; popoverRef: Ref<HTMLElement>; style?: CSSProperties }) {
  const { state, running, phaseLabel, toggle, reset, skip, setSettingsOpen } = useStudyTimer();
  return (
    // data-state="open" is what the page-turning keys look for: while this is open, the arrow keys are left alone.
    <section ref={popoverRef} className="timer-popover" style={style} role="dialog" data-state="open" aria-label="Pomodoro timer controls">
      <div className="timer-popover-head">
        <span>{phaseLabel}</span>
        <small>{state.completedBlocks} {state.completedBlocks === 1 ? 'block' : 'blocks'} today</small>
      </div>
      <strong className="timer-popover-time">{formatTimer(state.left)}</strong>
      <div className="timer-popover-controls">
        <button type="button" className="ui-btn ui-btn-primary ui-btn-sm" onClick={toggle}>
          {running ? <Pause size={16} /> : <Play size={16} />}{running ? 'Pause' : 'Start'}
        </button>
        <button type="button" className="timer-icon-button" aria-label="Reset timer" title="Reset" onClick={reset}><RotateCcw size={17} /></button>
        <button type="button" className="timer-icon-button" aria-label="Skip phase" title="Skip phase" onClick={skip}><SkipForward size={17} /></button>
        <button type="button" className="timer-icon-button" aria-label="Open timer settings" title="Settings" onClick={() => { close(); setSettingsOpen(true); }}><Settings2 size={17} /></button>
      </div>
      <TimerLabel id="timer-popover-label" />
      <TimerBlocks />
      <Link href="/docs/study-tools" onClick={close}>Open the focus workspace</Link>
    </section>
  );
}
