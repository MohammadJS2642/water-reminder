import { WaterReminderRepositoryImpl } from '../../../data/repositories/WaterReminderRepositoryImpl';
import { MemoryStorageDataSource } from '../../../data/datasources/MemoryStorageDataSource';
import { WaterReminderPlan } from '../../../domain/entities/WaterReminderPlan';

describe('WaterReminderRepositoryImpl (Integration Test)', () => {
  let repository: WaterReminderRepositoryImpl;
  let storage: MemoryStorageDataSource;

  beforeEach(() => {
    storage = new MemoryStorageDataSource();
    repository = new WaterReminderRepositoryImpl(storage);
  });

  it('should return default plan when storage is empty', async () => {
    const plan = await repository.getPlan();

    expect(plan.targetGlasses).toBe(8);
    expect(plan.startTime).toBe('08:00');
    expect(plan.endTime).toBe('22:00');
    expect(plan.isEnabled).toBe(true);
  });

  it('should save plan to storage and accurately retrieve it', async () => {
    const customPlan = new WaterReminderPlan({
      targetGlasses: 10,
      startTime: '07:00',
      endTime: '21:00',
      isEnabled: true,
      glassSizeMl: 250,
    });

    await repository.savePlan(customPlan);

    const retrieved = await repository.getPlan();
    expect(retrieved.targetGlasses).toBe(10);
    expect(retrieved.startTime).toBe('07:00');
    expect(retrieved.endTime).toBe('21:00');
    expect(retrieved.isEnabled).toBe(true);
    expect(retrieved.totalTargetMl).toBe(2500);
  });
});
