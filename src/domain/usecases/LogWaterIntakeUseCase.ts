import { WaterIntakeLog } from '../entities/WaterIntakeLog';
import { IWaterLogRepository } from '../repositories/IWaterLogRepository';
import { getTodayDateKey, minutesToTimeString, parseTimeToMinutes } from '../../core/utils/timeUtils';

export type IntakeAction = 'ADD' | 'REMOVE' | 'RESET';

/**
 * Use Case: LogWaterIntakeUseCase
 *
 * Handles recording, undoing, or resetting water consumption for today.
 */
export class LogWaterIntakeUseCase {
  constructor(private readonly waterLogRepository: IWaterLogRepository) {}

  public async execute(action: IntakeAction, customTimestamp?: string): Promise<WaterIntakeLog> {
    const todayKey = getTodayDateKey();
    const currentLog = await this.waterLogRepository.getLogForDate(todayKey);

    let updatedLog: WaterIntakeLog;

    switch (action) {
      case 'ADD': {
        const now = new Date();
        const timeNow = customTimestamp || `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        updatedLog = currentLog.addGlass(timeNow);
        break;
      }
      case 'REMOVE': {
        updatedLog = currentLog.removeGlass();
        break;
      }
      case 'RESET': {
        updatedLog = currentLog.reset();
        break;
      }
      default:
        updatedLog = currentLog;
    }

    await this.waterLogRepository.saveLog(updatedLog);
    return updatedLog;
  }
}
