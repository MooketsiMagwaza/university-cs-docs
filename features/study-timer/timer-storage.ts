import {
  MAX_BLOCKS,
  MAX_LABEL_LENGTH,
  defaultTimerSettings,
  normalizeSettings,
  timerDateKey,
  utcDateKey,
  type PersistedTimer,
  type TimerAlarmState,
  type TimerBlock,
  type TimerPhase,
  type TimerState,
} from './timer-types';

/**
 * The key keeps its old name so saved timers carry over. The shape is versioned inside the value:
 * 2 (no version field) was the first shape, 3 added the alarm, the label, today's blocks and the tab owner,
 * and counts the day in local time instead of UTC.
 */
export const TIMER_STORAGE_KEY = 'university-docs-pomodoro-v2';
export const TIMER_STORAGE_VERSION = 3;

/** A saved run further away than this is damage, not a run. */
const MAX_RUN_MS = 6 * 60 * 60 * 1000;
/** An alarm nobody dismissed within this time is stale by the time the page loads. */
const ALARM_STALE_MS = 60 * 60 * 1000;

const phases: TimerPhase[] = ['focus', 'short', 'long'];

export function createInitialTimerState(): TimerState {
  return {
    ready: false,
    phase: 'focus',
    left: defaultTimerSettings.focus * 60,
    endAt: null,
    round: 1,
    completedBlocks: 0,
    focusedMinutes: 0,
    date: timerDateKey(),
    settings: defaultTimerSettings,
    settingsOpen: false,
    fullscreenOpen: false,
    label: '',
    blocks: [],
    alarm: null,
    warned: false,
    owner: null,
    event: null,
    eventSeq: 0,
  };
}

/** Parses saved text; anything unreadable is an empty save. */
export function parseSavedTimer(text: string | null): PersistedTimer {
  if (!text) return {};
  try {
    const value: unknown = JSON.parse(text);
    if (typeof value !== 'object' || value === null || Array.isArray(value)) return {};
    const saved = value as PersistedTimer;
    return { ...saved, version: typeof saved.version === 'number' ? saved.version : 2 };
  } catch {
    return {};
  }
}

export function readPersistedTimer(): PersistedTimer {
  try {
    return parseSavedTimer(localStorage.getItem(TIMER_STORAGE_KEY));
  } catch {
    return {};
  }
}

function isPhase(value: unknown): value is TimerPhase {
  return phases.includes(value as TimerPhase);
}

function cleanBlocks(value: unknown, today: string): TimerBlock[] {
  if (!Array.isArray(value)) return [];
  const blocks: TimerBlock[] = [];
  for (const item of value) {
    if (typeof item !== 'object' || item === null) continue;
    const block = item as Record<string, unknown>;
    if (typeof block.id !== 'string' || typeof block.at !== 'number' || !Number.isFinite(block.at)) continue;
    if (timerDateKey(block.at) !== today) continue;
    const minutes = Number(block.minutes);
    blocks.push({
      id: block.id,
      at: block.at,
      minutes: Number.isFinite(minutes) ? Math.max(0, Math.min(180, Math.round(minutes))) : 0,
      label: typeof block.label === 'string' ? block.label.slice(0, MAX_LABEL_LENGTH) : '',
    });
  }
  return blocks.slice(-MAX_BLOCKS);
}

function cleanAlarm(value: unknown, now: number): TimerAlarmState | null {
  if (typeof value !== 'object' || value === null) return null;
  const alarm = value as Record<string, unknown>;
  if (typeof alarm.id !== 'string' || !isPhase(alarm.finished) || !isPhase(alarm.next)) return null;
  const at = typeof alarm.at === 'number' && Number.isFinite(alarm.at) ? alarm.at : 0;
  if (now - at > ALARM_STALE_MS) return null;
  const rings = Number(alarm.rings);
  return {
    id: alarm.id,
    finished: alarm.finished,
    next: alarm.next,
    rings: Number.isFinite(rings) && rings >= 1 ? Math.round(rings) : 1,
    snoozeUntil: typeof alarm.snoozeUntil === 'number' && Number.isFinite(alarm.snoozeUntil) ? alarm.snoozeUntil : null,
    at,
  };
}

/**
 * Turns saved data of any version into a state. `keepExpired` is for state another tab just wrote: a run whose end
 * has passed stays a run, so the tab that should ring can still do it. A page that loads after the end drops it.
 */
export function hydrateTimer(saved: PersistedTimer, now = Date.now(), options: { keepExpired?: boolean } = {}): TimerState {
  const initial = createInitialTimerState();
  const settings = normalizeSettings(saved.settings);
  const phase = isPhase(saved.phase) ? saved.phase : 'focus';
  const today = timerDateKey(now);
  const version = typeof saved.version === 'number' ? saved.version : 2;
  // Version 2 stored the UTC date, so for those saves either way of naming today means the same day.
  const sameDay = saved.date === today || (version < 3 && saved.date === utcDateKey(now));

  const runnable = typeof saved.endAt === 'number' && Number.isFinite(saved.endAt)
    && (options.keepExpired || saved.endAt > now)
    && saved.endAt - now <= MAX_RUN_MS;
  const endAt = runnable ? (saved.endAt as number) : null;
  const left = endAt !== null
    ? Math.max(0, Math.ceil((endAt - now) / 1000))
    : Math.max(0, Number(saved.left) || settings[phase] * 60);

  const completedBlocks = sameDay ? Math.max(0, Number(saved.completedBlocks ?? saved.today ?? 0) || 0) : 0;
  const focusedMinutes = sameDay
    ? Math.max(0, Number(saved.focusedMinutes ?? completedBlocks * settings.focus) || 0)
    : 0;

  return {
    ...initial,
    ready: true,
    phase,
    settings,
    left,
    endAt,
    round: Math.max(1, Math.min(settings.rounds, Number(saved.round) || 1)),
    completedBlocks,
    focusedMinutes,
    date: today,
    label: typeof saved.label === 'string' ? saved.label.slice(0, MAX_LABEL_LENGTH) : '',
    blocks: sameDay ? cleanBlocks(saved.blocks, today) : [],
    alarm: cleanAlarm(saved.alarm, now),
    warned: endAt === null ? false : typeof saved.warned === 'boolean' ? saved.warned : left <= 60,
    owner: typeof saved.owner === 'string' ? saved.owner : null,
  };
}

/**
 * The text that is saved. While a run is going `left` is derived from `endAt`, so it is left out: that keeps the
 * saved text the same from one second to the next and stops open tabs from rewriting each other every second.
 */
export function serializeTimer(state: TimerState): string {
  const persisted: PersistedTimer = {
    version: TIMER_STORAGE_VERSION,
    phase: state.phase,
    left: state.endAt === null ? state.left : null,
    endAt: state.endAt,
    round: state.round,
    completedBlocks: state.completedBlocks,
    focusedMinutes: state.focusedMinutes,
    date: state.date,
    settings: state.settings,
    label: state.label,
    blocks: state.blocks,
    alarm: state.alarm,
    warned: state.endAt === null ? false : state.warned,
    owner: state.owner,
  };
  return JSON.stringify(persisted);
}

export function writeSerializedTimer(text: string) {
  try {
    localStorage.setItem(TIMER_STORAGE_KEY, text);
  } catch {
    // Storage can be full or blocked; the timer still works for this visit.
  }
}
