import { IWaterLogRepository } from '../../domain/repositories/IWaterLogRepository';
import { WaterIntakeLog, WaterIntakeLogProps } from '../../domain/entities/WaterIntakeLog';
import { IStorageDataSource } from '../datasources/IStorageDataSource';

export const WATER_LOG_STORAGE_PREFIX = '@water_log_date_';

/**
 * Repository implementation for Daily Water Logs.
 * Stores logs keyed by date (e.g. "@water_log_date_2026-09-30").
 */
export class WaterLogRepositoryImpl implements IWaterLogRepository {
  constructor(private readonly storage: IStorageDataSource) {}

  public async getLogForDate(dateKey: string): Promise<WaterIntakeLog> {
    try {
      const storageKey = `${WATER_LOG_STORAGE_PREFIX}${dateKey}`;
      const rawJson = await this.storage.getItem(storageKey);
      if (!rawJson) {
        return WaterIntakeLog.createEmpty(dateKey);
      }

      const parsed: WaterIntakeLogProps = JSON.parse(rawJson);
      return new WaterIntakeLog({
        dateKey: parsed.dateKey,
        consumedGlasses: parsed.consumedGlasses,
        intakeTimestamps: parsed.intakeTimestamps ?? [],
      });
    } catch (error) {
      console.warn(`[WaterLogRepositoryImpl] Error reading log for ${dateKey}:`, error);
      return WaterIntakeLog.createEmpty(dateKey);
    }
  }

  public async saveLog(log: WaterIntakeLog): Promise<void> {
    const storageKey = `${WATER_LOG_STORAGE_PREFIX}${log.dateKey}`;
    const rawData: WaterIntakeLogProps = {
      dateKey: log.dateKey,
      consumedGlasses: log.consumedGlasses,
      intakeTimestamps: log.intakeTimestamps,
    };
    await this.storage.setItem(storageKey, JSON.stringify(rawData));
  }
}
