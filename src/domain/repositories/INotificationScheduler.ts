import { NotificationSlot } from '../entities/NotificationSlot';

/**
 * Interface for Device Notification Scheduling
 *
 * Domain layer defines this contract.
 * The Data/Infrastructure layer implements it using Expo Notifications or native platform APIs.
 */
export interface INotificationScheduler {
  /**
   * Request device permission for showing push/local notifications
   */
  requestPermissions(): Promise<boolean>;

  /**
   * Schedules reminders for the specified slots
   */
  scheduleReminders(
    slots: NotificationSlot[],
    isEnabled: boolean,
    locale?: 'en' | 'fa'
  ): Promise<void>;

  /**
   * Cancels all scheduled local notifications
   */
  cancelAllReminders(): Promise<void>;
}
