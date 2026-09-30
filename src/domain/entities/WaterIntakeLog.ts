import { getTodayDateKey } from '../../core/utils/timeUtils';

/**
 * Domain Entity: WaterIntakeLog
 *
 * Tracks the user's water consumption for a specific calendar date.
 * Provides pure methods to increment, decrement, and check progress.
 */
export interface WaterIntakeLogProps {
  dateKey: string;             // "YYYY-MM-DD"
  consumedGlasses: number;
  intakeTimestamps: string[];  // e.g. ["08:30", "10:15"]
}

export class WaterIntakeLog {
  public readonly dateKey: string;
  public readonly consumedGlasses: number;
  public readonly intakeTimestamps: string[];

  constructor(props: WaterIntakeLogProps) {
    this.dateKey = props.dateKey;
    this.consumedGlasses = Math.max(0, props.consumedGlasses);
    this.intakeTimestamps = props.intakeTimestamps ?? [];
  }

  /**
   * Factory method to create an empty log for today
   */
  public static createEmpty(dateKey: string = getTodayDateKey()): WaterIntakeLog {
    return new WaterIntakeLog({
      dateKey,
      consumedGlasses: 0,
      intakeTimestamps: [],
    });
  }

  /**
   * Records drinking a new glass of water
   */
  public addGlass(timestamp: string): WaterIntakeLog {
    return new WaterIntakeLog({
      dateKey: this.dateKey,
      consumedGlasses: this.consumedGlasses + 1,
      intakeTimestamps: [...this.intakeTimestamps, timestamp],
    });
  }

  /**
   * Reverts / undoes the last recorded glass
   */
  public removeGlass(): WaterIntakeLog {
    if (this.consumedGlasses <= 0) {
      return this;
    }
    const updatedTimestamps = [...this.intakeTimestamps];
    updatedTimestamps.pop();

    return new WaterIntakeLog({
      dateKey: this.dateKey,
      consumedGlasses: this.consumedGlasses - 1,
      intakeTimestamps: updatedTimestamps,
    });
  }

  /**
   * Resets the intake for this day back to zero
   */
  public reset(): WaterIntakeLog {
    return new WaterIntakeLog({
      dateKey: this.dateKey,
      consumedGlasses: 0,
      intakeTimestamps: [],
    });
  }

  /**
   * Calculates completion percentage against a given target
   */
  public getProgressPercentage(targetGlasses: number): number {
    if (targetGlasses <= 0) return 0;
    const ratio = (this.consumedGlasses / targetGlasses) * 100;
    return Math.min(100, Math.round(ratio));
  }
}
