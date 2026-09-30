import { WaterReminderPlan } from '../entities/WaterReminderPlan';
import { IWaterReminderRepository } from '../repositories/IWaterReminderRepository';
import { INotificationScheduler } from '../repositories/INotificationScheduler';
import { CalculateScheduleUseCase } from './CalculateScheduleUseCase';

/**
 * Use Case: SaveReminderPlanUseCase
 *
 * Orchestrates saving the plan and synchronizing with the device notification scheduler.
 * Follows Single Responsibility Principle (SRP).
 */
export class SaveReminderPlanUseCase {
  constructor(
    private readonly reminderRepository: IWaterReminderRepository,
    private readonly notificationScheduler: INotificationScheduler,
    private readonly calculateScheduleUseCase: CalculateScheduleUseCase
  ) {}

  public async execute(plan: WaterReminderPlan, locale: 'en' | 'fa' = 'fa'): Promise<void> {
    // 1. Business validation occurs inside entity
    plan.validate();

    // 2. Persist to storage repository
    await this.reminderRepository.savePlan(plan);

    // 3. Synchronize device notifications
    if (plan.isEnabled) {
      const slots = this.calculateScheduleUseCase.execute(plan);
      await this.notificationScheduler.scheduleReminders(slots, true, locale);
    } else {
      await this.notificationScheduler.cancelAllReminders();
    }
  }
}
