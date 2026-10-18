'use client';

import {
  Check,
  Clock3,
  Flame,
  Maximize2,
  Minimize2,
  Pause,
  Play,
  RotateCcw,
  Settings2,
  SkipForward,
} from 'lucide-react';
import { useMemo } from 'react';
import { useStudyTimer } from '../timer-provider';
import { formatTimer, type TimerPhase } from '../timer-types';
import { TimerLabel } from './timer-label';

const phases: Array<[TimerPhase, string]> = [
  ['focus', 'Focus'],
  ['short', 'Short break'],
  ['long', 'Long break'],
];

export function TimerPanel({ fullscreen = false }: { fullscreen?: boolean }) {
  const {
    state,
    running,
    progress,
    phaseLabel,
    toggle,
    reset,
    skip,
    selectPhase,
    setSettingsOpen,
    setFullscreenOpen,
  } = useStudyTimer();
  const totalSeconds = state.settings[state.phase] * 60;
  const roundDots = useMemo(
    () => Array.from({ length: state.settings.rounds }, (_, index) => index < state.round - 1),
    [state.round, state.settings.rounds],
  );

  if (!state.ready) {
    return <section className="study-panel timer-loading" aria-live="polite">Loading timer…</section>;
  }

  return (
    <section
      className={`study-panel pomodoro-panel phase-${state.phase} ${fullscreen ? 'pomodoro-fullscreen' : ''}`}
      aria-labelledby={fullscreen ? 'fullscreen-timer-heading' : 'pomodoro-heading'}
      // Full screen covers the page, so it is a dialog: the page-turning keys then leave the arrow keys alone.
      role={fullscreen ? 'dialog' : undefined}
      aria-modal={fullscreen ? true : undefined}
      data-state={fullscreen ? 'open' : undefined}
    >
      <div className="study-panel-header">
        <h2 className="study-panel-title" id={fullscreen ? 'fullscreen-timer-heading' : 'pomodoro-heading'}>Pomodoro timer</h2>
        <span className="study-panel-stats">{state.completedBlocks} {state.completedBlocks === 1 ? 'block' : 'blocks'} · {state.focusedMinutes} min today</span>
      </div>

      <div className="pomodoro-stage">
        <div className="pomodoro-tabs" role="tablist" aria-label="Timer phase">
          {phases.map(([key, label]) => (
            <button
              type="button"
              role="tab"
              aria-selected={state.phase === key}
              className={state.phase === key ? 'active' : ''}
              key={key}
              onClick={() => selectPhase(key)}
            >
              {label} <small>{state.settings[key]} min</small>
            </button>
          ))}
        </div>

        <div className="pomodoro-clock-wrap">
          <div className="pomodoro-ring" style={{ background: `conic-gradient(var(--study-accent) ${progress}%, var(--study-track) 0)` }}>
            <div className="pomodoro-face">
              <span>{phaseLabel}</span>
              <strong aria-live="off">{formatTimer(state.left)}</strong>
              <small>{running ? 'Stay with the task' : state.left < totalSeconds ? 'Paused' : 'Ready when you are'}</small>
            </div>
          </div>
        </div>
        <TimerLabel id={fullscreen ? 'timer-fullscreen-label' : 'timer-panel-label'} />
      </div>

      <div className="pomodoro-controls">
        <button type="button" className="ui-btn ui-btn-primary timer-start" onClick={toggle}>
          {running ? <Pause size={17} /> : <Play size={17} />}
          {running ? 'Pause' : state.left < totalSeconds ? 'Resume' : state.phase === 'focus' ? 'Start focus' : 'Start break'}
        </button>
        <button type="button" className="ui-btn" onClick={reset}><RotateCcw size={16} /><span>Reset</span></button>
        <button type="button" className="ui-btn" onClick={skip}><SkipForward size={16} /><span>Skip</span></button>
        <div className="pomodoro-tools">
          <button
            type="button"
            className="timer-icon-button"
            title={fullscreen ? 'Exit full screen' : 'Full screen'}
            aria-label={fullscreen ? 'Exit full screen timer' : 'Open full screen timer'}
            aria-pressed={fullscreen}
            onClick={() => setFullscreenOpen(!fullscreen)}
          >
            {fullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
          <button
            type="button"
            className="timer-icon-button"
            title="Timer settings"
            aria-label="Edit timer settings"
            aria-haspopup="dialog"
            aria-expanded={state.settingsOpen}
            onClick={() => setSettingsOpen(true)}
          >
            <Settings2 size={18} />
          </button>
        </div>
      </div>

      <div className="pomodoro-footer">
        <span>Round {state.round} of {state.settings.rounds}</span>
        <div className="round-dots" aria-hidden="true">
          {roundDots.map((complete, index) => <i key={index} className={complete ? 'complete' : index === state.round - 1 ? 'current' : ''} />)}
        </div>
      </div>
    </section>
  );
}

export function TimerSummary() {
  const { state } = useStudyTimer();
  return (
    <div className="timer-summary-grid">
      <div><Check size={17} /><strong>{state.completedBlocks}</strong><span>completed focus blocks</span></div>
      <div><Clock3 size={17} /><strong>{state.focusedMinutes}</strong><span>focused minutes today</span></div>
      <div><Flame size={17} /><strong>{state.settings.rounds}</strong><span>focus blocks per cycle</span></div>
    </div>
  );
}
