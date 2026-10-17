import { formatTimer, timerPhaseLabels, type TimerPhase } from './timer-types';

const TIMER_TITLE = /^\d{2}:\d{2} · (Focus|Short break|Long break)$/;

/** The tab title while a block runs, for example "24:59 · Focus". */
export function timerTitle(left: number, phase: TimerPhase) {
  return `${formatTimer(left)} · ${timerPhaseLabels[phase]}`;
}

/** True for a title the timer wrote, so the timer never mistakes it for the page's own title. */
export function isTimerTitle(title: string) {
  return TIMER_TITLE.test(title);
}
