import { NotificationSlot } from '../entities/NotificationSlot';
import { WaterReminderPlan } from '../entities/WaterReminderPlan';
import { parseTimeToMinutes, minutesToTimeString } from '../../core/utils/timeUtils';

/**
 * Use Case: CalculateScheduleUseCase
 *
 * Business logic:
 * Takes a water reminder plan (glasses count, start time, end time) and calculates
 * evenly distributed reminder slots across that time window.
 *
 * Example:
 * Start: "08:00" (480 mins)
 * End:   "22:00" (1320 mins)
 * Target: 8 glasses
 * Total duration: 840 minutes.
 * Interval = 840 / (8 - 1) = 120 minutes (every 2 hours)
 * Slots:
 *  Glass 1: 08:00
 *  Glass 2: 10:00
 *  Glass 3: 12:00
 *  Glass 4: 14:00
 *  Glass 5: 16:00
 *  Glass 6: 18:00
 *  Glass 7: 20:00
 *  Glass 8: 22:00
 */
export class CalculateScheduleUseCase {
  public execute(plan: WaterReminderPlan): NotificationSlot[] {
    plan.validate();

    const startMinutes = parseTimeToMinutes(plan.startTime);
    const endMinutes = parseTimeToMinutes(plan.endTime);
    const target = plan.targetGlasses;

    // Edge case: Only 1 glass requested
    if (target === 1) {
      return [
        {
          glassNumber: 1,
          time: plan.startTime,
          minutesFromMidnight: startMinutes,
        },
      ];
    }

    const totalWindowMinutes = endMinutes - startMinutes;
    // Distribute remaining (target - 1) intervals across the window
    const intervalMinutes = totalWindowMinutes / (target - 1);

    const slots: NotificationSlot[] = [];

    for (let i = 0; i < target; i++) {
      const slotMinutes = Math.round(startMinutes + i * intervalMinutes);
      slots.push({
        glassNumber: i + 1,
        time: minutesToTimeString(slotMinutes),
        minutesFromMidnight: slotMinutes,
      });
    }

    return slots;
  }
}
