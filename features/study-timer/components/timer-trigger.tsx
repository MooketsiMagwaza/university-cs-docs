'use client';

import { Pause, TimerReset } from 'lucide-react';
import { type CSSProperties, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { isEscapeForTimer } from '../timer-dom';
import { useStudyTimer } from '../timer-provider';
import { formatTimer } from '../timer-types';
import { TimerPopover } from './timer-popover';

const GAP = 8;
const EDGE = 12;

/**
 * Places the popover under its button and keeps it inside the viewport, so it
 * opens beside the trigger whether that sits in the header or in the mobile drawer.
 */
function anchorStyle(button: HTMLElement): CSSProperties {
  const rect = button.getBoundingClientRect();
  const width = Math.min(320, window.innerWidth - EDGE * 2);
  const preferredLeft = rect.right - width;
  const left = Math.min(Math.max(EDGE, preferredLeft), window.innerWidth - width - EDGE);
  const top = rect.bottom + GAP;
  // A tall popover (label, list of blocks) must not run off the bottom of a short screen; it scrolls instead.
  return { top, left, width, maxHeight: Math.max(160, window.innerHeight - top - EDGE) };
}

export function TimerTrigger() {
  const { state, running, phaseLabel } = useStudyTimer();
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<CSSProperties>();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLElement>(null);

  const place = useCallback(() => {
    if (buttonRef.current) setPosition(anchorStyle(buttonRef.current));
  }, []);

  useLayoutEffect(() => {
    if (open) place();
  }, [open, place]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!rootRef.current?.contains(target) && !popoverRef.current?.contains(target)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      // Leave the key alone when something else already used it (a search dialog closing itself).
      if (!isEscapeForTimer(event)) return;
      event.preventDefault();
      setOpen(false);
      buttonRef.current?.focus();
    };
    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', place);
    window.addEventListener('scroll', place, { passive: true });
    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', place);
    };
  }, [open, place]);

  return (
    <div className="timer-trigger-root" ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        className={`timer-trigger ${running ? 'timer-trigger-running' : ''}`}
        aria-label={running ? `${phaseLabel}, ${formatTimer(state.left)} remaining` : 'Open focus timer'}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => setOpen((value) => !value)}
      >
        {running ? <Pause size={15} /> : <TimerReset size={16} />}
        <span>{running ? formatTimer(state.left) : 'Focus'}</span>
      </button>
      {open && position && typeof document !== 'undefined'
        ? createPortal(<TimerPopover close={() => setOpen(false)} popoverRef={popoverRef} style={position} />, document.body)
        : null}
    </div>
  );
}
