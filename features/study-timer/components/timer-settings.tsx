'use client';

import { Check, Volume2, X } from 'lucide-react';
import { useState } from 'react';
import { askNotifyPermission, notifyAccess } from '../timer-notify';
import { useStudyTimer } from '../timer-provider';
import { timerToneLabels, timerTones, type TimerTone } from '../timer-types';

export function TimerSettings() {
  const { state, changeSetting, restoreDefaults, setSettingsOpen, testSound } = useStudyTimer();
  const [notifyNote, setNotifyNote] = useState('');
  if (!state.settingsOpen) return null;

  // Permission is asked for only here, when the reader turns the option on.
  const setNotify = async (on: boolean) => {
    setNotifyNote('');
    if (!on) {
      changeSetting('notify', false);
      return;
    }
    const access = await askNotifyPermission();
    changeSetting('notify', access === 'granted');
    if (access === 'unsupported') setNotifyNote('This browser cannot show notifications.');
    else if (access === 'denied') setNotifyNote('Notifications are blocked for this site. Allow them in your browser settings.');
    else if (access !== 'granted') setNotifyNote('Permission was not given, so notifications stay off.');
  };

  return (
    <div
      className="study-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) setSettingsOpen(false);
      }}
    >
      <section className="study-modal" role="dialog" aria-modal="true" aria-labelledby="timer-settings-title">
        <header className="study-modal-header">
          <div>
            <span>Personalize your cycle</span>
            <h2 id="timer-settings-title">Edit Pomodoro timer</h2>
            <p>Choose session lengths, the alarm and automatic transitions. Changes save on this device.</p>
          </div>
          <button autoFocus type="button" className="timer-icon-button" aria-label="Close timer settings" onClick={() => setSettingsOpen(false)}><X size={19} /></button>
        </header>

        <div className="timer-settings">
          <div className="duration-grid">
            {([
              ['focus', 'Focus'],
              ['short', 'Short break'],
              ['long', 'Long break'],
              ['rounds', 'Rounds'],
            ] as const).map(([key, label]) => (
              <label key={key}>
                <span>{label}</span>
                <div>
                  <input
                    type="number"
                    min="1"
                    max={key === 'rounds' ? 8 : 90}
                    value={state.settings[key]}
                    onChange={(event) => changeSetting(key, Number(event.target.value))}
                  />
                  <small>{key === 'rounds' ? 'cycles' : 'min'}</small>
                </div>
              </label>
            ))}
          </div>
          <div className="settings-toggle-list">
            <label className="setting-toggle">
              <span><strong>Auto-start breaks</strong><small>Begin the next break immediately.</small></span>
              <input type="checkbox" checked={state.settings.autoBreak} onChange={(event) => changeSetting('autoBreak', event.target.checked)} />
            </label>
            <label className="setting-toggle">
              <span><strong>Auto-start focus</strong><small>Begin focus when a break ends.</small></span>
              <input type="checkbox" checked={state.settings.autoFocus} onChange={(event) => changeSetting('autoFocus', event.target.checked)} />
            </label>
            <label className="setting-toggle">
              <span><strong>Alarm sound</strong><small>Ring when a block ends, until you dismiss it. When the next block starts by itself it plays once.</small></span>
              <input type="checkbox" checked={state.settings.sound} onChange={(event) => changeSetting('sound', event.target.checked)} />
            </label>
          </div>

          <div className="timer-alarm-settings">
            <label>
              <span>Sound</span>
              <select
                className="timer-select"
                value={state.settings.tone}
                onChange={(event) => changeSetting('tone', event.target.value as TimerTone)}
              >
                {timerTones.map((tone) => <option key={tone} value={tone}>{timerToneLabels[tone]}</option>)}
              </select>
            </label>
            <label>
              <span>Volume <output>{state.settings.volume}%</output></span>
              <input
                className="timer-range"
                type="range"
                min="0"
                max="100"
                step="5"
                value={state.settings.volume}
                onChange={(event) => changeSetting('volume', Number(event.target.value))}
              />
            </label>
            <button type="button" className="ui-btn ui-btn-sm" onClick={testSound}><Volume2 size={15} /> Test sound</button>
          </div>

          <div className="settings-toggle-list">
            <label className="setting-toggle">
              <span><strong>One-minute warning</strong><small>Play the sound once when one minute is left. Needs the alarm sound on.</small></span>
              <input type="checkbox" checked={state.settings.warn} onChange={(event) => changeSetting('warn', event.target.checked)} />
            </label>
            <label className="setting-toggle">
              <span>
                <strong>Notifications</strong>
                <small>Show a notification when a block ends while this tab is in the background.</small>
                {notifyNote && <small role="status">{notifyNote}</small>}
              </span>
              <input
                type="checkbox"
                checked={state.settings.notify && notifyAccess() === 'granted'}
                onChange={(event) => void setNotify(event.target.checked)}
              />
            </label>
          </div>
        </div>

        <footer className="study-modal-footer">
          <button type="button" className="ui-btn" onClick={restoreDefaults}>Restore defaults</button>
          <button type="button" className="ui-btn ui-btn-primary" onClick={() => setSettingsOpen(false)}><Check size={17} /> Done</button>
        </footer>
      </section>
    </div>
  );
}
