import * as Notifications from 'expo-notifications';
import { INotificationScheduler } from '../../domain/repositories/INotificationScheduler';
import { NotificationSlot } from '../../domain/entities/NotificationSlot';
import { parseTimeToMinutes, toPersianDigits } from '../../core/utils/timeUtils';
import { en } from '../../core/i18n/translations/en';
import { fa } from '../../core/i18n/translations/fa';

// Configure default notification handler for foreground notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

/**
 * Expo Notification Scheduler
 *
 * Implements the domain INotificationScheduler interface using Expo's notification module.
 */
export class ExpoNotificationScheduler implements INotificationScheduler {
  public async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      return finalStatus === 'granted';
    } catch (error) {
      console.warn('[ExpoNotificationScheduler] Failed to get notification permissions:', error);
      return false;
    }
  }

  public async scheduleReminders(
    slots: NotificationSlot[],
    isEnabled: boolean,
    locale: 'en' | 'fa' = 'fa'
  ): Promise<void> {
    try {
      // 1. Clear previously scheduled notifications to avoid duplicates
      await this.cancelAllReminders();

      if (!isEnabled || slots.length === 0) {
        return;
      }

      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.warn('[ExpoNotificationScheduler] Notification permissions not granted.');
        return;
      }

      const dict = locale === 'fa' ? fa : en;

      // 2. Schedule each slot with a daily repeating trigger
      for (const slot of slots) {
        const totalMinutes = parseTimeToMinutes(slot.time);
        const hour = Math.floor(totalMinutes / 60);
        const minute = totalMinutes % 60;

        const glassDisplay = locale === 'fa' ? toPersianDigits(slot.glassNumber) : String(slot.glassNumber);
        const bodyText = dict.notificationBody.replace('{glassNumber}', glassDisplay);

        await Notifications.scheduleNotificationAsync({
          content: {
            title: dict.notificationTitle,
            body: bodyText,
            sound: true,
            data: { glassNumber: slot.glassNumber, time: slot.time },
          },
          trigger: {
            type: Notifications.SchedulableTriggerInputTypes.DAILY,
            hour,
            minute,
          },
        });
      }
    } catch (error) {
      console.error('[ExpoNotificationScheduler] Error scheduling reminders:', error);
    }
  }

  public async cancelAllReminders(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.warn('[ExpoNotificationScheduler] Error canceling notifications:', error);
    }
  }
}
