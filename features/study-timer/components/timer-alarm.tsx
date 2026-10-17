'use client';

import { useEffect, useRef } from 'react';
import { useStudyTimer } from '../timer-provider';
import { timerPhaseLabels } from '../timer-types';

/**
 * Shown while an alarm has not been dismissed, on any page and in any tab. The sound itself is played by the tab
 * that claimed the ring; this panel only lets the reader stop or postpone it.
 */
export function TimerAlarm() {
  const { state, dismissAlarm, snooze } = useStudyTimer();
  const dismissRef = useRef<HTMLButtonElement>(null);
  const alarm = state.alarm;
  const ring = alarm ? `${alarm.id}#${alarm.rings}` : null;

  // Bring the Dismiss button into reach, but never take the focus away from something the reader is using.
  useEffect(() => {
    if (!ring) return;
    const active = document.activeElement;
    if (!active || active === document.body) dismissRef.current?.focus();
  }, [ring]);

  if (!state.ready || !alarm) return null;
  const snoozed = alarm.snoozeUntil !== null;
  const until = alarm.snoozeUntil === null
    ? ''
    : new Date(alarm.snoozeUntil).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <section className="timer-alarm" role="alert" aria-label="Timer alarm">
      <p>
        <strong>{timerPhaseLabels[alarm.finished]} finished</strong>
        <span>{snoozed ? `Snoozed until ${until}.` : `${timerPhaseLabels[alarm.next]} is next.`}</span>
      </p>
      <div className="timer-alarm-actions">
        {!snoozed && (
          <>
            <button type="button" className="ui-btn ui-btn-sm" onClick={() => snooze(1)}>Snooze 1 min</button>
            <button type="button" className="ui-btn ui-btn-sm" onClick={() => snooze(5)}>Snooze 5 min</button>
          </>
        )}
        <button ref={dismissRef} type="button" className="ui-btn ui-btn-primary ui-btn-sm" onClick={dismissAlarm}>Dismiss</button>
      </div>
    </section>
  );
}
