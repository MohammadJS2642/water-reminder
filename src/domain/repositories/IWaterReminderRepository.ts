import { WaterReminderPlan } from '../entities/WaterReminderPlan';

/**
 * Interface for Water Reminder Plan Repository
 *
 * In Clean Architecture, repositories are abstract ports defined in the DOMAIN layer.
 * The DATA layer provides the concrete adapter/implementation.
 * This decouples business logic completely from databases, file systems, or AsyncStorage.
 */
export interface IWaterReminderRepository {
  getPlan(): Promise<WaterReminderPlan>;
  savePlan(plan: WaterReminderPlan): Promise<void>;
}
