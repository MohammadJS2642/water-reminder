import { WaterReminderPlan } from '../entities/WaterReminderPlan';
import { IWaterReminderRepository } from '../repositories/IWaterReminderRepository';

/**
 * Use Case: GetReminderPlanUseCase
 *
 * Retrieves the currently active water reminder plan from repository.
 */
export class GetReminderPlanUseCase {
  constructor(private readonly reminderRepository: IWaterReminderRepository) {}

  public async execute(): Promise<WaterReminderPlan> {
    return this.reminderRepository.getPlan();
  }
}
