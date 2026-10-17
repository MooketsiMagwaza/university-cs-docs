'use client';

import { useEffect, useRef, type Dispatch } from 'react';
import type { ProgressEvent } from '@/features/progress';
import { claimOnce } from './timer-claims';
import { isEscapeForTimer, setScrollLock } from './timer-dom';
import { notifyAccess, showTimerNotification, tabIsHidden } from './timer-notify';
import { playTimerTone, stopTimerTone } from './timer-audio';
import type { TimerAction } from './timer-reducer';
import { afterLostClaim, nextDeadline, planTick } from './timer-schedule';
import { TIMER_STORAGE_KEY, hydrateTimer, parseSavedTimer, serializeTimer, writeSerializedTimer } from './timer-storage';
import { isTimerTitle, timerTitle } from './timer-title';
import { timerPhaseLabels, type TimerPhase, type TimerState } from './timer-types';

const TAB_ID_KEY = 'university-docs-timer-tab';

/** One tab of the site. Its id decides who acts first at the end of a run, and which claims are its own. */
const tab = {
  id: '',
  /** Claims this tab won, so it knows which events are its to act on. */
  won: new Set<string>(),
  /** The ring (`<alarm id>#<number>`) this tab is responsible for playing. */
  ringing: '' as string,
};

/**
 * Kept in sessionStorage, which belongs to one tab and survives a reload, so a tab that is reloaded in the middle of
 * its own run is still the owner of that run.
 */
export function getTabId() {
  if (tab.id) return tab.id;
  try {
    tab.id = sessionStorage.getItem(TAB_ID_KEY) ?? '';
  } catch {
    tab.id = '';
  }
  if (!tab.id) {
    tab.id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
    try {
      sessionStorage.setItem(TAB_ID_KEY, tab.id);
    } catch {
      // The id then lasts only until this page is reloaded.
    }
  }
  return tab.id;
}

/** setTimeout cannot wait longer than this (about 24 days). */
const MAX_TIMEOUT = 2_000_000_000;

/**
 * Keeps time. The time left always comes from the end timestamp, never from counting ticks. An interval refreshes the
 * display, but a background tab throttles it, so the moments that matter (the warning, the end, the end of a snooze)
 * also get a timeout of their own, and the check runs again when the tab becomes visible or focused.
 */
export function useTimerDriver(state: TimerState, dispatch: Dispatch<TimerAction>) {
  const latest = useRef(state);
  useEffect(() => {
    latest.current = state;
  });

  const active = state.ready && (state.endAt !== null || state.alarm?.snoozeUntil != null);

  useEffect(() => {
    if (!active) return;
    const self = getTabId();
    let timeout: number | undefined;

    const act = (claim: string, now: number) => {
      let won = true;
      try {
        won = claimOnce(window.localStorage, claim, self, now);
      } catch {
        // Storage is blocked, so there is no second tab to share with.
      }
      if (won) tab.won.add(claim);
      return won;
    };

    const drive = () => {
      const now = Date.now();
      const current = latest.current;
      const plan = planTick(current, now, self);
      switch (plan.kind) {
        case 'idle':
          return;
        case 'update':
          dispatch({ type: 'tick', now, owner: self });
          return;
        case 'hold':
          dispatch({ type: 'tick', now, owner: self, complete: false });
          return;
        case 'warn':
          if (act(plan.claim, now)) dispatch({ type: 'tick', now, owner: self, warn: true });
          else dispatch({ type: 'tick', now, owner: self });
          return;
        case 'complete': {
          if (act(plan.claim, now)) {
            // Set before the state changes, so the sound effect that follows already knows the ring is this tab's.
            tab.ringing = `${plan.claim}#1`;
            dispatch({ type: 'tick', now, owner: self, complete: true });
          } else {
            dispatch({ type: 'tick', now, owner: self, complete: afterLostClaim(current, now) === 'force' });
          }
          return;
        }
        case 'wake':
          if (act(plan.claim, now)) {
            tab.ringing = plan.claim.replace(/^ring:/, '');
            dispatch({ type: 'wake', now });
          }
          return;
      }
    };

    const arm = () => {
      window.clearTimeout(timeout);
      const due = nextDeadline(latest.current, Date.now());
      if (due === null) return;
      timeout = window.setTimeout(() => {
        drive();
        arm();
      }, Math.min(MAX_TIMEOUT, Math.max(0, due - Date.now()) + 25));
    };

    const catchUp = () => {
      drive();
      arm();
    };

    catchUp();
    const interval = window.setInterval(drive, 250);
    document.addEventListener('visibilitychange', catchUp);
    window.addEventListener('focus', catchUp);
    window.addEventListener('pageshow', catchUp);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(timeout);
      document.removeEventListener('visibilitychange', catchUp);
      window.removeEventListener('focus', catchUp);
      window.removeEventListener('pageshow', catchUp);
    };
  }, [active, state.endAt, state.alarm?.snoozeUntil, state.alarm?.rings, state.settings.warn, state.warned, state.owner, dispatch]);

  // The counters are for one local day; roll them over while the page stays open, even when nothing is running.
  useEffect(() => {
    const roll = () => dispatch({ type: 'day', now: Date.now() });
    const interval = window.setInterval(roll, 60_000);
    document.addEventListener('visibilitychange', roll);
    return () => {
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', roll);
    };
  }, [dispatch]);
}

/**
 * Saves the state, and takes in what another tab saved. The text that was last written or read is remembered, so
 * taking in a save never writes it straight back and two tabs cannot keep answering each other.
 */
export function useTimerSync(state: TimerState, dispatch: Dispatch<TimerAction>) {
  const seen = useRef<string | null>(null);
  const snapshot = state.ready ? serializeTimer(state) : null;

  useEffect(() => {
    if (snapshot === null || snapshot === seen.current) return;
    seen.current = snapshot;
    writeSerializedTimer(snapshot);
  }, [snapshot]);

  useEffect(() => {
    const onStorage = (event: StorageEvent) => {
      if (event.key !== TIMER_STORAGE_KEY || !event.newValue || event.newValue === seen.current) return;
      seen.current = event.newValue;
      dispatch({
        type: 'remote',
        state: hydrateTimer(parseSavedTimer(event.newValue), Date.now(), { keepExpired: true }),
      });
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [dispatch]);
}

function endMessage(finished: TimerPhase, next: TimerPhase, label: string) {
  const title = `${timerPhaseLabels[finished]} finished`;
  const upNext = `${timerPhaseLabels[next]} is next.`;
  return { title, body: label ? `${label}. ${upNext}` : upNext };
}

/**
 * Does what a finished block or a warning calls for, in the one tab that claimed it: credits the minutes to the
 * progress system, plays the tone, shows a notification if the tab is in the background, and keeps a ringing alarm
 * playing until it is dismissed or snoozed.
 */
export function useTimerEffects(state: TimerState, record: (event: ProgressEvent) => void) {
  const handled = useRef(0);
  const { sound, tone, volume, notify } = state.settings;

  useEffect(() => {
    const event = state.event;
    if (!state.ready || !event || event.seq === handled.current) return;
    handled.current = event.seq;
    if (!tab.won.has(event.id)) return;

    if (event.kind === 'complete') {
      if (event.minutes && event.minutes > 0) record({ type: 'focus', minutes: event.minutes });
      if (event.ring === 'once' && sound) playTimerTone(tone, volume, false);
      if (notify && tabIsHidden() && notifyAccess() === 'granted' && event.finished && event.next) {
        const { title, body } = endMessage(event.finished, event.next, event.label ?? '');
        showTimerNotification(title, body, sound);
      }
    } else if (event.kind === 'warn') {
      if (sound) playTimerTone(tone, volume, false);
      if (notify && tabIsHidden() && notifyAccess() === 'granted') {
        showTimerNotification('One minute left', timerPhaseLabels[state.phase], sound);
      }
    }
  }, [state.event, state.ready, state.phase, record, sound, tone, volume, notify]);

  const alarm = state.alarm;
  const ringId = alarm && alarm.snoozeUntil === null ? `${alarm.id}#${alarm.rings}` : '';
  useEffect(() => {
    if (!state.ready || !ringId || tab.ringing !== ringId || !sound) return;
    playTimerTone(tone, volume, true);
    return () => stopTimerTone();
  }, [state.ready, ringId, sound, tone, volume]);
}

/** The tab title shows the time left while a block runs, and puts the page's own title back afterwards. */
export function useTimerTitle(running: boolean, left: number, phase: TimerPhase) {
  const base = useRef('');
  const text = useRef(timerTitle(left, phase));

  useEffect(() => {
    if (!running) return;
    if (!isTimerTitle(document.title)) base.current = document.title;
    const apply = () => {
      if (document.title !== text.current) document.title = text.current;
    };
    // The site changes the title when the reader moves to another page. Take that as the title to put back, and
    // write the timer's title over it again at once.
    const observer = new MutationObserver(() => {
      if (isTimerTitle(document.title)) return;
      base.current = document.title;
      apply();
    });
    observer.observe(document.head, { childList: true, subtree: true, characterData: true });
    apply();
    return () => {
      observer.disconnect();
      if (base.current && isTimerTitle(document.title)) document.title = base.current;
    };
  }, [running]);

  useEffect(() => {
    text.current = timerTitle(left, phase);
    if (running && document.title !== text.current) document.title = text.current;
  }, [running, left, phase]);
}

/** While an overlay is open: the page behind does not scroll, and Escape closes it unless something else took it. */
export function useModalOverlay(open: boolean, close: () => void) {
  useEffect(() => {
    if (!open) return;
    setScrollLock(document.body, true);
    const onKeyDown = (event: KeyboardEvent) => {
      if (!isEscapeForTimer(event)) return;
      event.preventDefault();
      close();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      setScrollLock(document.body, false);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, close]);
}
