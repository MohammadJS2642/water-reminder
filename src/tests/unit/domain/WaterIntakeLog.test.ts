import { WaterIntakeLog } from '../../../domain/entities/WaterIntakeLog';

describe('WaterIntakeLog Entity (Unit Test)', () => {
  it('should initialize empty log with zero intake', () => {
    const log = WaterIntakeLog.createEmpty('2026-09-30');
    expect(log.dateKey).toBe('2026-09-30');
    expect(log.consumedGlasses).toBe(0);
    expect(log.intakeTimestamps).toEqual([]);
    expect(log.getProgressPercentage(8)).toBe(0);
  });

  it('should immutably add glass with timestamp', () => {
    const initial = WaterIntakeLog.createEmpty('2026-09-30');
    const updated = initial.addGlass('09:15');

    expect(initial.consumedGlasses).toBe(0);
    expect(updated.consumedGlasses).toBe(1);
    expect(updated.intakeTimestamps).toEqual(['09:15']);
  });

  it('should calculate percentage correctly up to 100%', () => {
    let log = WaterIntakeLog.createEmpty('2026-09-30');
    expect(log.getProgressPercentage(10)).toBe(0);

    log = log.addGlass('08:00');
    log = log.addGlass('10:00');
    expect(log.getProgressPercentage(10)).toBe(20);

    // Over-achieving target caps at 100%
    for (let i = 0; i < 15; i++) {
      log = log.addGlass('12:00');
    }
    expect(log.getProgressPercentage(10)).toBe(100);
  });

  it('should immutably remove last glass', () => {
    let log = WaterIntakeLog.createEmpty('2026-09-30')
      .addGlass('08:00')
      .addGlass('10:30');

    expect(log.consumedGlasses).toBe(2);
    expect(log.intakeTimestamps).toEqual(['08:00', '10:30']);

    const afterRemove = log.removeGlass();
    expect(afterRemove.consumedGlasses).toBe(1);
    expect(afterRemove.intakeTimestamps).toEqual(['08:00']);

    // Attempting to remove below 0 does not go negative
    const emptyLog = afterRemove.removeGlass().removeGlass();
    expect(emptyLog.consumedGlasses).toBe(0);
  });

  it('should reset log back to zero intake', () => {
    const log = WaterIntakeLog.createEmpty('2026-09-30')
      .addGlass('08:00')
      .addGlass('10:00')
      .addGlass('12:00');

    const resetLog = log.reset();
    expect(resetLog.consumedGlasses).toBe(0);
    expect(resetLog.intakeTimestamps).toEqual([]);
  });
});
