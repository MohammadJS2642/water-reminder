import { CalculateScheduleUseCase } from '../../../domain/usecases/CalculateScheduleUseCase';
import { WaterReminderPlan } from '../../../domain/entities/WaterReminderPlan';

describe('CalculateScheduleUseCase (Unit Test)', () => {
  let useCase: CalculateScheduleUseCase;

  beforeEach(() => {
    useCase = new CalculateScheduleUseCase();
  });

  it('should evenly distribute 8 glasses between 08:00 and 22:00 (every 2 hours)', () => {
    const plan = new WaterReminderPlan({
      targetGlasses: 8,
      startTime: '08:00',
      endTime: '22:00',
      isEnabled: true,
      glassSizeMl: 250,
    });

    const slots = useCase.execute(plan);

    expect(slots).toHaveLength(8);
    expect(slots[0]).toEqual({ glassNumber: 1, time: '08:00', minutesFromMidnight: 480 });
    expect(slots[1]).toEqual({ glassNumber: 2, time: '10:00', minutesFromMidnight: 600 });
    expect(slots[2]).toEqual({ glassNumber: 3, time: '12:00', minutesFromMidnight: 720 });
    expect(slots[3]).toEqual({ glassNumber: 4, time: '14:00', minutesFromMidnight: 840 });
    expect(slots[4]).toEqual({ glassNumber: 5, time: '16:00', minutesFromMidnight: 960 });
    expect(slots[5]).toEqual({ glassNumber: 6, time: '18:00', minutesFromMidnight: 1080 });
    expect(slots[6]).toEqual({ glassNumber: 7, time: '20:00', minutesFromMidnight: 1200 });
    expect(slots[7]).toEqual({ glassNumber: 8, time: '22:00', minutesFromMidnight: 1320 });
  });

  it('should return a single slot at startTime if targetGlasses is 1', () => {
    const plan = new WaterReminderPlan({
      targetGlasses: 1,
      startTime: '09:00',
      endTime: '17:00',
      isEnabled: true,
      glassSizeMl: 250,
    });

    const slots = useCase.execute(plan);

    expect(slots).toHaveLength(1);
    expect(slots[0].time).toBe('09:00');
    expect(slots[0].glassNumber).toBe(1);
  });

  it('should evenly distribute 4 glasses between 09:00 and 12:00 (hourly intervals)', () => {
    const plan = new WaterReminderPlan({
      targetGlasses: 4,
      startTime: '09:00',
      endTime: '12:00',
      isEnabled: true,
      glassSizeMl: 250,
    });

    const slots = useCase.execute(plan);

    expect(slots).toHaveLength(4);
    expect(slots.map((s) => s.time)).toEqual(['09:00', '10:00', '11:00', '12:00']);
  });

  it('should throw an error if endTime is equal to or before startTime', () => {
    expect(() => {
      new WaterReminderPlan({
        targetGlasses: 5,
        startTime: '14:00',
        endTime: '10:00',
        isEnabled: true,
        glassSizeMl: 250,
      });
    }).toThrow('End time must be after start time.');
  });
});
