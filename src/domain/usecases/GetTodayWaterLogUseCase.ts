import { WaterIntakeLog } from '../entities/WaterIntakeLog';
import { IWaterLogRepository } from '../repositories/IWaterLogRepository';
import { getTodayDateKey } from '../../core/utils/timeUtils';

/**
 * Use Case: GetTodayWaterLogUseCase
 *
 * Retrieves today's hydration log from repository.
 * If no record exists for today, creates and returns an empty log.
 */
export class GetTodayWaterLogUseCase {
  constructor(private readonly waterLogRepository: IWaterLogRepository) {}

  public async execute(dateKey: string = getTodayDateKey()): Promise<WaterIntakeLog> {
    return this.waterLogRepository.getLogForDate(dateKey);
  }
}
