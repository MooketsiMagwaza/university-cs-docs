import {
  MAX_BLOCKS,
  MAX_LABEL_LENGTH,
  defaultTimerSettings,
  normalizeSetting,
  timerDateKey,
  type TimerEvent,
  type TimerPhase,
  type TimerSettings,
  type TimerState,
} from './timer-types';

export type TimerAction =
  | { type: 'hydrate'; state: TimerState }
  /** State another tab saved. Keeps this tab's open dialogs and its unhandled event. */
  | { type: 'remote'; state: TimerState }
  /**
   * Time has moved on. `complete: false` is for a tab that must wait for the owner: it only shows 00:00.
   * `warn: true` is sent once by the tab that claimed the one-minute warning. `owner` is this tab, for auto-start.
   */
  | { type: 'tick'; now: number; owner?: string; complete?: boolean; warn?: boolean }
  /** Rolls the counters over when the local day has changed. */
  | { type: 'day'; now: number }
  | { type: 'toggle'; now: number; owner: string }
  | { type: 'reset' }
  | { type: 'skip' }
  | { type: 'select-phase'; phase: TimerPhase }
  | { type: 'change-setting'; key: keyof TimerSettings; value: number | boolean | string }
  | { type: 'restore-defaults' }
  | { type: 'set-label'; label: string }
  | { type: 'dismiss-alarm' }
  | { type: 'snooze'; minutes: number; now: number }
  | { type: 'wake'; now: number }
  | { type: 'open-settings'; open: boolean }
  | { type: 'open-fullscreen'; open: boolean }
  | { type: 'close-overlay' };

function nextPhase(state: TimerState): TimerPhase {
  if (state.phase !== 'focus') return 'focus';
  return state.round >= state.settings.rounds ? 'long' : 'short';
}

/** The counters belong to one local day; a new day starts them again. */
function rollDay(state: TimerState, now: number): TimerState {
  const date = timerDateKey(now);
  return state.date === date ? state : { ...state, date, completedBlocks: 0, focusedMinutes: 0, blocks: [] };
}

function withEvent(state: TimerState, event: Omit<TimerEvent, 'seq'>): TimerState {
  const seq = state.eventSeq + 1;
  return { ...state, eventSeq: seq, event: { ...event, seq } };
}

/** Pausing, resetting or choosing another phase also answers any alarm that is still ringing. */
function stopped(state: TimerState, phase: TimerPhase): TimerState {
  return { ...state, phase, endAt: null, left: state.settings[phase] * 60, alarm: null, warned: false };
}

function complete(state: TimerState, now: number, owner: string | undefined): TimerState {
  const endAt = state.endAt as number;
  const finished = state.phase;
  const completedFocus = finished === 'focus';
  const phase = nextPhase(state);
  const autoStart = completedFocus ? state.settings.autoBreak : state.settings.autoFocus;
  const left = state.settings[phase] * 60;
  const id = `done:${endAt}`;
  const today = rollDay(state, now);
  const minutes = completedFocus ? state.settings.focus : 0;

  const next: TimerState = {
    ...today,
    phase,
    left,
    endAt: autoStart ? now + left * 1000 : null,
    round: completedFocus ? (phase === 'long' ? 1 : state.round + 1) : state.round,
    completedBlocks: today.completedBlocks + (completedFocus ? 1 : 0),
    focusedMinutes: today.focusedMinutes + minutes,
    blocks: completedFocus
      ? [...today.blocks, { id, at: now, minutes, label: state.label }].slice(-MAX_BLOCKS)
      : today.blocks,
    // When the next block starts by itself there is nothing to dismiss: the tone plays once.
    alarm: autoStart ? null : { id, finished, next: phase, rings: 1, snoozeUntil: null, at: now },
    warned: autoStart ? left <= 60 : false,
    owner: autoStart && owner ? owner : state.owner,
  };
  return withEvent(next, { kind: 'complete', id, ring: autoStart ? 'once' : 'loop', finished, next: phase, minutes, label: state.label });
}

export function timerReducer(state: TimerState, action: TimerAction): TimerState {
  switch (action.type) {
    case 'hydrate':
      return action.state;
    case 'remote':
      return {
        ...action.state,
        settingsOpen: state.settingsOpen,
        fullscreenOpen: state.fullscreenOpen,
        event: state.event,
        eventSeq: state.eventSeq,
      };
    case 'tick': {
      if (state.endAt === null) return state;
      const remaining = Math.max(0, Math.ceil((state.endAt - action.now) / 1000));
      if (remaining > 0) {
        let next = rollDay(state, action.now);
        if (remaining !== state.left) next = { ...next, left: remaining };
        if (action.warn && !next.warned) {
          next = withEvent({ ...next, warned: true }, { kind: 'warn', id: `warn:${state.endAt}` });
        }
        return next;
      }
      if (action.complete === false) return state.left === 0 ? state : { ...state, left: 0 };
      return complete(state, action.now, action.owner);
    }
    case 'day':
      return rollDay(state, action.now);
    case 'toggle':
      if (state.endAt !== null) return { ...state, endAt: null, warned: false };
      return {
        ...state,
        endAt: action.now + state.left * 1000,
        alarm: null,
        // A run that starts inside its last minute has no warning to give.
        warned: state.left <= 60,
        owner: action.owner,
      };
    case 'reset':
      return stopped(state, state.phase);
    case 'skip':
      return stopped(state, nextPhase(state));
    case 'select-phase':
      return stopped(state, action.phase);
    case 'change-setting': {
      const settings = { ...state.settings, [action.key]: normalizeSetting(action.key, action.value) } as TimerSettings;
      const changesCurrentDuration = action.key === state.phase && state.endAt === null;
      return {
        ...state,
        settings,
        left: changesCurrentDuration ? settings[state.phase] * 60 : state.left,
        round: action.key === 'rounds' ? Math.min(state.round, settings.rounds) : state.round,
      };
    }
    case 'restore-defaults':
      return {
        ...state,
        settings: defaultTimerSettings,
        endAt: null,
        left: defaultTimerSettings[state.phase] * 60,
        round: Math.min(state.round, defaultTimerSettings.rounds),
        warned: false,
      };
    case 'set-label':
      return { ...state, label: action.label.slice(0, MAX_LABEL_LENGTH) };
    case 'dismiss-alarm':
      return state.alarm === null ? state : { ...state, alarm: null };
    case 'snooze':
      if (state.alarm === null) return state;
      return { ...state, alarm: { ...state.alarm, snoozeUntil: action.now + action.minutes * 60_000, at: action.now } };
    case 'wake': {
      const alarm = state.alarm;
      if (alarm === null || alarm.snoozeUntil === null || action.now < alarm.snoozeUntil) return state;
      const rings = alarm.rings + 1;
      return withEvent(
        { ...state, alarm: { ...alarm, rings, snoozeUntil: null, at: action.now } },
        { kind: 'wake', id: `ring:${alarm.id}#${rings}` },
      );
    }
    case 'open-settings':
      return { ...state, settingsOpen: action.open, fullscreenOpen: action.open ? false : state.fullscreenOpen };
    case 'open-fullscreen':
      return { ...state, fullscreenOpen: action.open, settingsOpen: action.open ? false : state.settingsOpen };
    case 'close-overlay':
      return state.settingsOpen || state.fullscreenOpen ? { ...state, settingsOpen: false, fullscreenOpen: false } : state;
  }
}
