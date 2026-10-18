import type { TimerState } from './timer-types';

/** The tab that started a run acts at once; any other tab waits this long, in case the first one is gone. */
export const CLAIM_GRACE_MS = 2000;
/** If the claiming tab has still not saved the result this long after the end, a waiting tab finishes the block itself. */
export const FORCE_AFTER_MS = 8000;
export const WARN_BEFORE_MS = 60_000;

export type TickPlan =
  | { kind: 'idle' }
  /** Not due: refresh the time left. */
  | { kind: 'update' }
  /** Due, but another tab should act first: show 00:00 and wait for its saved state. */
  | { kind: 'hold' }
  | { kind: 'warn'; claim: string }
  | { kind: 'complete'; claim: string }
  | { kind: 'wake'; claim: string };

/** The owner acts at the due time, everyone else after the grace period. A run with no owner is open to all. */
function mayAct(state: TimerState, self: string, due: number, now: number) {
  return state.owner === null || state.owner === self || now >= due + CLAIM_GRACE_MS;
}

/**
 * What this tab should do at `now`. It depends only on the state and the clock, never on how often it is called,
 * so a late call (a background tab, a laptop that slept) reaches the same answer as an on-time one.
 */
export function planTick(state: TimerState, now: number, self: string): TickPlan {
  if (state.endAt !== null) {
    const { endAt } = state;
    if (now < endAt) {
      const warnAt = endAt - WARN_BEFORE_MS;
      if (state.settings.warn && !state.warned && now >= warnAt && mayAct(state, self, warnAt, now)) {
        return { kind: 'warn', claim: `warn:${endAt}` };
      }
      return { kind: 'update' };
    }
    if (mayAct(state, self, endAt, now)) return { kind: 'complete', claim: `done:${endAt}` };
    return { kind: 'hold' };
  }

  const alarm = state.alarm;
  if (alarm && alarm.snoozeUntil !== null && now >= alarm.snoozeUntil && mayAct(state, self, alarm.snoozeUntil, now)) {
    return { kind: 'wake', claim: `ring:${alarm.id}#${alarm.rings + 1}` };
  }
  return { kind: 'idle' };
}

/**
 * After this tab lost the claim: keep waiting for the winning tab's saved state, or, if that never comes, finish the
 * block here without ringing or recording (the winner already did, or died trying).
 */
export function afterLostClaim(state: TimerState, now: number): 'hold' | 'force' {
  return state.endAt !== null && now - state.endAt >= FORCE_AFTER_MS ? 'force' : 'hold';
}

/**
 * The next moment worth waking for, so a timeout can be set for it instead of relying on a ticking interval that a
 * background tab throttles. Several candidates are listed (the owner's time and the others') and the planner decides
 * on arrival which of them is really due.
 */
export function nextDeadline(state: TimerState, now: number): number | null {
  const times: number[] = [];
  const add = (due: number) => times.push(due, due + CLAIM_GRACE_MS);
  if (state.endAt !== null) {
    add(state.endAt);
    times.push(state.endAt + FORCE_AFTER_MS);
    if (state.settings.warn && !state.warned) add(state.endAt - WARN_BEFORE_MS);
  } else if (state.alarm && state.alarm.snoozeUntil !== null) {
    add(state.alarm.snoozeUntil);
  }
  const future = times.filter((time) => time > now);
  return future.length > 0 ? Math.min(...future) : null;
}
