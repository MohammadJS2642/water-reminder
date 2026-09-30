import { WaterIntakeLog } from '../entities/WaterIntakeLog';

/**
 * Interface for Water Intake Daily Log Repository
 */
export interface IWaterLogRepository {
  getLogForDate(dateKey: string): Promise<WaterIntakeLog>;
  saveLog(log: WaterIntakeLog): Promise<void>;
}
