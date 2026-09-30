import { WaterReminderPlan } from '../../../domain/entities/WaterReminderPlan';

describe('WaterReminderPlan Entity (Unit Test)', () => {
  it('should initialize successfully with valid properties', () => {
    const plan = new WaterReminderPlan({
      targetGlasses: 10,
      startTime: '07:30',
      endTime: '23:00',
      isEnabled: true,
      glassSizeMl: 250,
    });

    expect(plan.targetGlasses).toBe(10);
    expect(plan.startTime).toBe('07:30');
    expect(plan.endTime).toBe('23:00');
    expect(plan.isEnabled).toBe(true);
    expect(plan.totalTargetMl).toBe(2500);
  });

  it('should reject target glasses less than 1', () => {
    expect(() => {
      new WaterReminderPlan({
        targetGlasses: 0,
        startTime: '08:00',
        endTime: '20:00',
        isEnabled: true,
        glassSizeMl: 250,
      });
    }).toThrow('Target glasses must be at least 1.');
  });

  it('should reject target glasses greater than 30', () => {
    expect(() => {
      new WaterReminderPlan({
        targetGlasses: 35,
        startTime: '08:00',
        endTime: '20:00',
        isEnabled: true,
        glassSizeMl: 250,
      });
    }).toThrow('Target glasses cannot exceed 30 glasses per day.');
  });

  it('should immutably copy with updated properties using copyWith', () => {
    const original = WaterReminderPlan.createDefault();
    const updated = original.copyWith({ targetGlasses: 12, isEnabled: false });

    expect(original.targetGlasses).toBe(8);
    expect(original.isEnabled).toBe(true);

    expect(updated.targetGlasses).toBe(12);
    expect(updated.isEnabled).toBe(false);
    expect(updated.startTime).toBe('08:00');
  });
});
