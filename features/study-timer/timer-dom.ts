/**
 * The timer's full screen and settings dialog stop the page behind them from scrolling. They do it with an attribute
 * that the timer's own style sheet turns into `overflow: hidden` on the body, and never by writing the body's inline
 * `overflow` style. Another dialog (the diagram viewer) saves and restores that inline style, and two parties doing
 * that in an overlapping order leave the page locked for good.
 */
export const SCROLL_LOCK_ATTRIBUTE = 'data-timer-scroll-lock';

export function setScrollLock(
  body: { setAttribute(name: string, value: string): void; removeAttribute(name: string): void },
  locked: boolean,
) {
  if (locked) body.setAttribute(SCROLL_LOCK_ATTRIBUTE, '');
  else body.removeAttribute(SCROLL_LOCK_ATTRIBUTE);
}

/**
 * Whether an Escape key press is the timer's to handle. A press that something else already handled (a search dialog
 * or menu closing itself calls preventDefault) or that is confirming text in an input method is left alone, so one
 * press closes one thing.
 */
export function isEscapeForTimer(event: { key: string; defaultPrevented: boolean; isComposing?: boolean }) {
  return event.key === 'Escape' && !event.defaultPrevented && !event.isComposing;
}
