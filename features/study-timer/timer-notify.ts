export type NotifyAccess = NotificationPermission | 'unsupported';

export function notifyAccess(): NotifyAccess {
  return typeof Notification === 'undefined' ? 'unsupported' : Notification.permission;
}

/** Asks the browser for permission. Call it only from the reader's click on the notifications option. */
export async function askNotifyPermission(): Promise<NotifyAccess> {
  if (typeof Notification === 'undefined') return 'unsupported';
  if (Notification.permission !== 'default') return Notification.permission;
  try {
    return await Notification.requestPermission();
  } catch {
    return Notification.permission;
  }
}

/** True when the tab cannot be seen, which is when a notification is worth showing. */
export function tabIsHidden() {
  return document.visibilityState !== 'visible';
}

/** One notification at a time: a new one replaces the last. Clicking it brings the tab forward. */
export function showTimerNotification(title: string, body: string, silent: boolean) {
  if (notifyAccess() !== 'granted') return;
  try {
    const notification = new Notification(title, { body, tag: 'university-docs-timer', silent });
    notification.onclick = () => {
      window.focus();
      notification.close();
    };
  } catch {
    // Some mobile browsers only allow notifications from a service worker.
  }
}
