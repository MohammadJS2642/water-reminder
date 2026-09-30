import { SaveReminderPlanUseCase } from '../../../domain/usecases/SaveReminderPlanUseCase';
import { CalculateScheduleUseCase } from '../../../domain/usecases/CalculateScheduleUseCase';
import { WaterReminderRepositoryImpl } from '../../../data/repositories/WaterReminderRepositoryImpl';
import { MemoryStorageDataSource } from '../../../data/datasources/MemoryStorageDataSource';
import { MockNotificationScheduler } from '../../../data/services/MockNotificationScheduler';
import { WaterReminderPlan } from '../../../domain/entities/WaterReminderPlan';

describe('SaveReminderPlanUseCase (Integration Test)', () => {
  let useCase: SaveReminderPlanUseCase;
  let repository: WaterReminderRepositoryImpl;
  let scheduler: MockNotificationScheduler;
  let calculateUseCase: CalculateScheduleUseCase;

  beforeEach(() => {
    const storage = new MemoryStorageDataSource();
    repository = new WaterReminderRepositoryImpl(storage);
    scheduler = new MockNotificationScheduler();
    calculateUseCase = new CalculateScheduleUseCase();

    useCase = new SaveReminderPlanUseCase(repository, scheduler, calculateUseCase);
  });

  it('should persist plan and schedule calculated notifications when enabled', async () => {
    const plan = new WaterReminderPlan({
      targetGlasses: 6,
      startTime: '08:00',
      endTime: '18:00',
      isEnabled: true,
      glassSizeMl: 250,
    });

    await useCase.execute(plan, 'fa');

    // 1. Verify repository has saved the plan
    const savedPlan = await repository.getPlan();
    expect(savedPlan.targetGlasses).toBe(6);

    // 2. Verify scheduler received 6 evenly distributed slots
    expect(scheduler.isEnabled).toBe(true);
    expect(scheduler.scheduledSlots).toHaveLength(6);
    expect(scheduler.scheduledSlots[0].time).toBe('08:00');
    expect(scheduler.scheduledSlots[5].time).toBe('18:00');
    expect(scheduler.lastLocale).toBe('fa');
  });

  it('should cancel all notifications when plan is saved with isEnabled = false', async () => {
    const plan = new WaterReminderPlan({
      targetGlasses: 8,
      startTime: '08:00',
      endTime: '22:00',
      isEnabled: false,
      glassSizeMl: 250,
    });

    await useCase.execute(plan, 'en');

    expect(scheduler.isEnabled).toBe(false);
    expect(scheduler.scheduledSlots).toEqual([]);
  });
});
