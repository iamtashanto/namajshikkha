/**
 * Optional Web Notifications for Prayer Times
 * Note: Web notifications on mobile browsers depend on browser process execution
 * and are not as reliable as native alarms. We honestly inform the user.
 */

export function isNotificationSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "Notification" in window;
}

export function getNotificationPermissionStatus(): NotificationPermission {
  if (!isNotificationSupported()) return "denied";
  return Notification.permission;
}

export async function requestNotificationPermission(): Promise<boolean> {
  if (!isNotificationSupported()) return false;
  try {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  } catch {
    return false;
  }
}

export function showPrayerNotification(title: string, body: string): void {
  if (!isNotificationSupported() || Notification.permission !== "granted") {
    return;
  }

  try {
    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.ready.then((reg) => {
        reg.showNotification(title, {
          body,
          icon: "/icons/icon-192.png",
          badge: "/icons/icon-192.png",
          tag: "namaj-waqt-reminder",
        });
      });
    } else {
      new Notification(title, {
        body,
        icon: "/icons/icon-192.png",
      });
    }
  } catch {
    // Ignore notification dispatch errors
  }
}

