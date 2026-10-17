export type TimerPhase = 'focus' | 'short' | 'long';

export const timerTones = ['chime', 'beep', 'digital', 'soft'] as const;
export type TimerTone = (typeof timerTones)[number];

export const timerToneLabels: Record<TimerTone, string> = {
  chime: 'Chime',
  beep: 'Beep',
  digital: 'Digital',
  soft: 'Soft bells',
};

export type TimerSettings = {
  focus: number;
  short: number;
  long: number;
  rounds: number;
  autoBreak: boolean;
  autoFocus: boolean;
  /** The alarm and the warning tone are heard only while this is on. */
  sound: boolean;
  tone: TimerTone;
  /** 0 to 100. */
  volume: number;
  /** A short tone one minute before a block ends. */
  warn: boolean;
  /** A browser notification when a block ends while the tab is in the background. */
  notify: boolean;
};

/** A finished focus block, kept for the list of today's blocks. */
export type TimerBlock = {
  id: string;
  /** When the block was recorded, in milliseconds. */
  at: number;
  minutes: number;
  label: string;
};

/**
 * An alarm that has not been dismissed. It is shared between tabs through the saved state, so it can be dismissed or
 * snoozed from any of them; only the tab that claimed the ring plays the sound.
 */
export type TimerAlarmState = {
  /** `done:<end time>` of the block that ended. */
  id: string;
  finished: TimerPhase;
  next: TimerPhase;
  /** How many times it has rung: 1 at the end of the block, one more after each snooze. */
  rings: number;
  /** While set, the alarm is silent until this time. */
  snoozeUntil: number | null;
  /** When it last started ringing or was snoozed; an old alarm is dropped when the page loads. */
  at: number;
};

/** Something the tab that claimed it should act on once: record the minutes, play a tone, show a notification. */
export type TimerEvent = {
  seq: number;
  kind: 'complete' | 'warn' | 'wake';
  /** The id of the claim that decides which tab acts on it. */
  id: string;
  /** For `complete`: ring until dismissed, or play once because the next block starts by itself. */
  ring?: 'loop' | 'once';
  finished?: TimerPhase;
  next?: TimerPhase;
  /** Focus minutes to credit; 0 for a finished break. */
  minutes?: number;
  label?: string;
};

export type TimerState = {
  ready: boolean;
  phase: TimerPhase;
  left: number;
  endAt: number | null;
  round: number;
  completedBlocks: number;
  focusedMinutes: number;
  /** The reader's local calendar day that the two counters above belong to. */
  date: string;
  settings: TimerSettings;
  settingsOpen: boolean;
  fullscreenOpen: boolean;
  label: string;
  blocks: TimerBlock[];
  alarm: TimerAlarmState | null;
  /** True once the one-minute warning has been given (or does not apply) in the current run. */
  warned: boolean;
  /** The tab that started the current run. It acts first at the end; the others wait a moment. */
  owner: string | null;
  event: TimerEvent | null;
  eventSeq: number;
};

/** What is written to localStorage. Everything is optional because old versions wrote less. */
export type PersistedTimer = {
  version?: number;
  phase?: TimerPhase;
  left?: number | null;
  endAt?: number | null;
  round?: number;
  completedBlocks?: number;
  focusedMinutes?: number;
  date?: string;
  settings?: Partial<TimerSettings>;
  label?: string;
  blocks?: unknown;
  alarm?: unknown;
  warned?: boolean;
  owner?: string | null;
  /** Written by the first version of the timer. */
  today?: number;
};

export const defaultTimerSettings: TimerSettings = {
  focus: 25,
  short: 5,
  long: 15,
  rounds: 4,
  autoBreak: false,
  autoFocus: false,
  sound: true,
  tone: 'chime',
  volume: 70,
  warn: false,
  notify: false,
};

export const timerPhaseLabels: Record<TimerPhase, string> = {
  focus: 'Focus',
  short: 'Short break',
  long: 'Long break',
};

export const MAX_LABEL_LENGTH = 60;
export const MAX_BLOCKS = 30;

function toDate(value: Date | number) {
  return typeof value === 'number' ? new Date(value) : value;
}

/** The reader's local calendar day, the same day the progress system uses. Never the UTC date. */
export function timerDateKey(date: Date | number = new Date()) {
  const day = toDate(date);
  const month = String(day.getMonth() + 1).padStart(2, '0');
  const dayOfMonth = String(day.getDate()).padStart(2, '0');
  return `${day.getFullYear()}-${month}-${dayOfMonth}`;
}

/** The UTC date, which version 2 of the saved state used by mistake. Only the migration reads it. */
export function utcDateKey(date: Date | number = new Date()) {
  return toDate(date).toISOString().slice(0, 10);
}

export function formatTimer(seconds: number) {
  const safe = Math.max(0, seconds);
  return `${String(Math.floor(safe / 60)).padStart(2, '0')}:${String(safe % 60).padStart(2, '0')}`;
}

function bounded(value: unknown, fallback: number, min: number, max: number) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.max(min, Math.min(max, Math.round(number))) : fallback;
}

/** Clamps one setting to what the timer accepts. The reducer and the loader both use it. */
export function normalizeSetting(key: keyof TimerSettings, value: unknown): TimerSettings[keyof TimerSettings] {
  switch (key) {
    case 'focus':
    case 'short':
    case 'long':
      return bounded(value, defaultTimerSettings[key], 1, 90);
    case 'rounds':
      return bounded(value, defaultTimerSettings.rounds, 1, 8);
    case 'volume':
      return bounded(value, defaultTimerSettings.volume, 0, 100);
    case 'tone':
      return timerTones.includes(value as TimerTone) ? (value as TimerTone) : defaultTimerSettings.tone;
    case 'sound':
      return value !== false;
    default:
      return value === true;
  }
}

/** Fills in anything missing and drops anything unknown, so old and damaged saves load. */
export function normalizeSettings(raw: unknown): TimerSettings {
  const source = typeof raw === 'object' && raw !== null ? (raw as Record<string, unknown>) : {};
  const settings: Record<string, unknown> = { ...defaultTimerSettings };
  for (const key of Object.keys(defaultTimerSettings) as Array<keyof TimerSettings>) {
    if (source[key] !== undefined && source[key] !== null) settings[key] = normalizeSetting(key, source[key]);
  }
  return settings as TimerSettings;
}
