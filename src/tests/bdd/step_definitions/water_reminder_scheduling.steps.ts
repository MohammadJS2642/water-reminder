import { loadFeature, defineFeature } from 'jest-cucumber';
import { WaterReminderPlan } from '../../../domain/entities/WaterReminderPlan';
import { CalculateScheduleUseCase } from '../../../domain/usecases/CalculateScheduleUseCase';
import { SaveReminderPlanUseCase } from '../../../domain/usecases/SaveReminderPlanUseCase';
import { WaterReminderRepositoryImpl } from '../../../data/repositories/WaterReminderRepositoryImpl';
import { MemoryStorageDataSource } from '../../../data/datasources/MemoryStorageDataSource';
import { MockNotificationScheduler } from '../../../data/services/MockNotificationScheduler';

const feature = loadFeature('src/tests/bdd/features/water_reminder_scheduling.feature');

defineFeature(feature, (test) => {
  let storage: MemoryStorageDataSource;
  let repository: WaterReminderRepositoryImpl;
  let scheduler: MockNotificationScheduler;
  let calculateUseCase: CalculateScheduleUseCase;
  let saveUseCase: SaveReminderPlanUseCase;

  let targetGlasses: number;
  let startTime: string;
  let endTime: string;
  let isEnabled: boolean;
  let capturedError: Error | null;

  beforeEach(() => {
    storage = new MemoryStorageDataSource();
    repository = new WaterReminderRepositoryImpl(storage);
    scheduler = new MockNotificationScheduler();
    calculateUseCase = new CalculateScheduleUseCase();
    saveUseCase = new SaveReminderPlanUseCase(repository, scheduler, calculateUseCase);

    targetGlasses = 8;
    startTime = '08:00';
    endTime = '22:00';
    isEnabled = true;
    capturedError = null;
  });

  test('Schedule 8 glasses between 08:00 and 22:00', ({ given, and, when, then }) => {
    given(/^I want to drink (\d+) glasses of water daily$/, (glassesStr: string) => {
      targetGlasses = parseInt(glassesStr, 10);
    });

    and(/^my waking hours are from "(.*)" to "(.*)"$/, (start: string, end: string) => {
      startTime = start;
      endTime = end;
    });

    when('I save my reminder schedule', async () => {
      const plan = new WaterReminderPlan({
        targetGlasses,
        startTime,
        endTime,
        isEnabled,
        glassSizeMl: 250,
      });
      await saveUseCase.execute(plan);
    });

    then(/^(\d+) reminder notifications should be scheduled$/, (countStr: string) => {
      const expectedCount = parseInt(countStr, 10);
      expect(scheduler.scheduledSlots).toHaveLength(expectedCount);
    });

    and(
      /^the reminders should occur at intervals of (\d+) minutes starting at "(.*)" and ending at "(.*)"$/,
      (intervalStr: string, expectedStart: string, expectedEnd: string) => {
        expect(scheduler.scheduledSlots[0].time).toBe(expectedStart);
        expect(scheduler.scheduledSlots[scheduler.scheduledSlots.length - 1].time).toBe(
          expectedEnd
        );

        // Check 120-minute gap between consecutive slots
        const firstSlot = scheduler.scheduledSlots[0].minutesFromMidnight;
        const secondSlot = scheduler.scheduledSlots[1].minutesFromMidnight;
        expect(secondSlot - firstSlot).toBe(parseInt(intervalStr, 10));
      }
    );
  });

  test('User disables water reminder notifications', ({ given, when, then }) => {
    given(/^I have a daily target of (\d+) glasses between "(.*)" and "(.*)"$/, (glassesStr: string, start: string, end: string) => {
      targetGlasses = parseInt(glassesStr, 10);
      startTime = start;
      endTime = end;
    });

    when('I disable notifications and save my schedule', async () => {
      isEnabled = false;
      const plan = new WaterReminderPlan({
        targetGlasses,
        startTime,
        endTime,
        isEnabled,
        glassSizeMl: 250,
      });
      await saveUseCase.execute(plan);
    });

    then('no reminder notifications should be active on my device', () => {
      expect(scheduler.isEnabled).toBe(false);
      expect(scheduler.scheduledSlots).toHaveLength(0);
    });
  });

  test('Prevent invalid time window where end time precedes start time', ({ given, and, when, then }) => {
    given(/^my start time is "(.*)"$/, (start: string) => {
      startTime = start;
    });

    and(/^my end time is "(.*)"$/, (end: string) => {
      endTime = end;
    });

    when('I attempt to calculate or save the schedule', async () => {
      try {
        const plan = new WaterReminderPlan({
          targetGlasses: 6,
          startTime,
          endTime,
          isEnabled: true,
          glassSizeMl: 250,
        });
        await saveUseCase.execute(plan);
      } catch (err: any) {
        capturedError = err;
      }
    });

    then('the app should reject the schedule with a validation error', () => {
      expect(capturedError).not.toBeNull();
      expect(capturedError?.message).toContain('End time must be after start time');
    });
  });
});
