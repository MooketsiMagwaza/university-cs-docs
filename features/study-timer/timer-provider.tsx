'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  type ReactNode,
} from 'react';
import { useRecord } from '@/features/progress';
import { playTimerTone, stopTimerTone, unlockTimerAudio } from './timer-audio';
import {
  getTabId,
  useModalOverlay,
  useTimerDriver,
  useTimerEffects,
  useTimerSync,
  useTimerTitle,
} from './timer-hooks';
import { timerReducer } from './timer-reducer';
import { createInitialTimerState, hydrateTimer, readPersistedTimer } from './timer-storage';
import { timerPhaseLabels, type TimerPhase, type TimerSettings } from './timer-types';

type TimerContextValue = {
  state: ReturnType<typeof createInitialTimerState>;
  running: boolean;
  progress: number;
  phaseLabel: string;
  toggle(): void;
  reset(): void;
  skip(): void;
  selectPhase(phase: TimerPhase): void;
  changeSetting(key: keyof TimerSettings, value: number | boolean | string): void;
  restoreDefaults(): void;
  setLabel(label: string): void;
  dismissAlarm(): void;
  snooze(minutes: number): void;
  testSound(): void;
  setSettingsOpen(open: boolean): void;
  setFullscreenOpen(open: boolean): void;
};

const TimerContext = createContext<TimerContextValue | null>(null);

export function StudyTimerProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(timerReducer, undefined, createInitialTimerState);
  const record = useRecord();

  useEffect(() => {
    dispatch({ type: 'hydrate', state: hydrateTimer(readPersistedTimer()) });
  }, []);

  useTimerSync(state, dispatch);
  useTimerDriver(state, dispatch);
  useTimerEffects(state, record);
  useTimerTitle(state.endAt !== null, state.left, state.phase);

  const closeOverlay = useCallback(() => dispatch({ type: 'close-overlay' }), []);
  useModalOverlay(state.settingsOpen || state.fullscreenOpen, closeOverlay);

  const totalSeconds = state.settings[state.phase] * 60;
  const value = useMemo<TimerContextValue>(() => ({
    state,
    running: state.endAt !== null,
    progress: Math.min(100, Math.max(0, (totalSeconds - state.left) / totalSeconds * 100)),
    phaseLabel: timerPhaseLabels[state.phase],
    toggle: () => {
      // The Start click is the reader's gesture; it is what lets the alarm be heard when the block ends.
      unlockTimerAudio();
      dispatch({ type: 'toggle', now: Date.now(), owner: getTabId() });
    },
    reset: () => dispatch({ type: 'reset' }),
    skip: () => dispatch({ type: 'skip' }),
    selectPhase: (phase) => dispatch({ type: 'select-phase', phase }),
    changeSetting: (key, rawValue) => dispatch({ type: 'change-setting', key, value: rawValue }),
    restoreDefaults: () => dispatch({ type: 'restore-defaults' }),
    setLabel: (label) => dispatch({ type: 'set-label', label }),
    dismissAlarm: () => {
      stopTimerTone();
      dispatch({ type: 'dismiss-alarm' });
    },
    snooze: (minutes) => {
      stopTimerTone();
      dispatch({ type: 'snooze', minutes, now: Date.now() });
    },
    testSound: () => {
      unlockTimerAudio();
      playTimerTone(state.settings.tone, state.settings.volume, false);
    },
    setSettingsOpen: (open) => dispatch({ type: 'open-settings', open }),
    setFullscreenOpen: (open) => dispatch({ type: 'open-fullscreen', open }),
  }), [state, totalSeconds]);

  return <TimerContext.Provider value={value}>{children}</TimerContext.Provider>;
}

export function useStudyTimer() {
  const value = useContext(TimerContext);
  if (!value) throw new Error('useStudyTimer must be used inside StudyTimerProvider');
  return value;
}
