import { INotificationScheduler } from '../../domain/repositories/INotificationScheduler';
import { NotificationSlot } from '../../domain/entities/NotificationSlot';

/**
 * Mock Notification Scheduler
 *
 * Keeps scheduled notifications in memory.
 * Useful for automated tests and platforms where Expo Notifications are unavailable.
 */
export class MockNotificationScheduler implements INotificationScheduler {
  public scheduledSlots: NotificationSlot[] = [];
  public isEnabled: boolean = false;
  public lastLocale?: 'en' | 'fa';

  public async requestPermissions(): Promise<boolean> {
    return true;
  }

  public async scheduleReminders(
    slots: NotificationSlot[],
    isEnabled: boolean,
    locale: 'en' | 'fa' = 'fa'
  ): Promise<void> {
    this.isEnabled = isEnabled;
    this.lastLocale = locale;
    this.scheduledSlots = isEnabled ? [...slots] : [];
  }

  public async cancelAllReminders(): Promise<void> {
    this.scheduledSlots = [];
    this.isEnabled = false;
  }
}
