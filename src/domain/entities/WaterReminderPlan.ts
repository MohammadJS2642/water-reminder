import { parseTimeToMinutes } from '../../core/utils/timeUtils';

/**
 * Domain Entity: WaterReminderPlan
 *
 * In Clean Architecture, Entities encapsulate enterprise-wide critical business rules.
 * An Entity can be an object with methods, or a set of data structures and functions.
 *
 * This entity represents the user's hydration schedule configuration:
 * - How many glasses they aim to drink daily
 * - The active time window (wake-up time to sleep time)
 * - Whether reminders are toggled on
 */
export interface WaterReminderPlanProps {
  targetGlasses: number;
  startTime: string; // "HH:mm" (e.g. "08:00")
  endTime: string;   // "HH:mm" (e.g. "22:00")
  isEnabled: boolean;
  glassSizeMl: number; // e.g. 250 ml
}

export class WaterReminderPlan {
  public readonly targetGlasses: number;
  public readonly startTime: string;
  public readonly endTime: string;
  public readonly isEnabled: boolean;
  public readonly glassSizeMl: number;

  constructor(props: WaterReminderPlanProps) {
    this.targetGlasses = props.targetGlasses;
    this.startTime = props.startTime;
    this.endTime = props.endTime;
    this.isEnabled = props.isEnabled;
    this.glassSizeMl = props.glassSizeMl ?? 250;

    this.validate();
  }

  /**
   * Business rule validation:
   * 1. Target glasses must be at least 1 and reasonable (e.g. <= 30)
   * 2. Start time and end time must be valid format
   * 3. End time must be strictly after start time
   */
  public validate(): void {
    if (this.targetGlasses < 1) {
      throw new Error('Target glasses must be at least 1.');
    }
    if (this.targetGlasses > 30) {
      throw new Error('Target glasses cannot exceed 30 glasses per day.');
    }

    const startMinutes = parseTimeToMinutes(this.startTime);
    const endMinutes = parseTimeToMinutes(this.endTime);

    if (endMinutes <= startMinutes) {
      throw new Error('End time must be after start time.');
    }
  }

  /**
   * Total target volume in milliliters (ml)
   */
  public get totalTargetMl(): number {
    return this.targetGlasses * this.glassSizeMl;
  }

  /**
   * Returns a default sensible plan for new users (8 glasses from 08:00 to 22:00)
   */
  public static createDefault(): WaterReminderPlan {
    return new WaterReminderPlan({
      targetGlasses: 8,
      startTime: '08:00',
      endTime: '22:00',
      isEnabled: true,
      glassSizeMl: 250,
    });
  }

  /**
   * Immutably creates a copy with updated properties
   */
  public copyWith(partial: Partial<WaterReminderPlanProps>): WaterReminderPlan {
    return new WaterReminderPlan({
      targetGlasses: partial.targetGlasses ?? this.targetGlasses,
      startTime: partial.startTime ?? this.startTime,
      endTime: partial.endTime ?? this.endTime,
      isEnabled: partial.isEnabled ?? this.isEnabled,
      glassSizeMl: partial.glassSizeMl ?? this.glassSizeMl,
    });
  }
}
