import { IWaterReminderRepository } from '../../domain/repositories/IWaterReminderRepository';
import { WaterReminderPlan, WaterReminderPlanProps } from '../../domain/entities/WaterReminderPlan';
import { IStorageDataSource } from '../datasources/IStorageDataSource';

export const REMINDER_PLAN_STORAGE_KEY = '@water_reminder_plan_v1';

/**
 * Repository implementation for Water Reminder Plan.
 * Handles serialization/deserialization between domain entity and raw JSON storage.
 */
export class WaterReminderRepositoryImpl implements IWaterReminderRepository {
  constructor(private readonly storage: IStorageDataSource) {}

  public async getPlan(): Promise<WaterReminderPlan> {
    try {
      const rawJson = await this.storage.getItem(REMINDER_PLAN_STORAGE_KEY);
      if (!rawJson) {
        return WaterReminderPlan.createDefault();
      }

      const parsed: WaterReminderPlanProps = JSON.parse(rawJson);
      return new WaterReminderPlan({
        targetGlasses: parsed.targetGlasses,
        startTime: parsed.startTime,
        endTime: parsed.endTime,
        isEnabled: parsed.isEnabled,
        glassSizeMl: parsed.glassSizeMl ?? 250,
      });
    } catch (error) {
      console.warn('[WaterReminderRepositoryImpl] Failed to load plan, falling back to default:', error);
      return WaterReminderPlan.createDefault();
    }
  }

  public async savePlan(plan: WaterReminderPlan): Promise<void> {
    const rawData: WaterReminderPlanProps = {
      targetGlasses: plan.targetGlasses,
      startTime: plan.startTime,
      endTime: plan.endTime,
      isEnabled: plan.isEnabled,
      glassSizeMl: plan.glassSizeMl,
    };
    await this.storage.setItem(REMINDER_PLAN_STORAGE_KEY, JSON.stringify(rawData));
  }
}
