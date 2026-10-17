'use client';

import { TimerAlarm } from './timer-alarm';
import { TimerFullscreen } from './timer-fullscreen';
import { TimerSettings } from './timer-settings';

export function TimerOverlays() {
  return (
    <>
      <TimerFullscreen />
      <TimerSettings />
      <TimerAlarm />
    </>
  );
}
