import { loadFeature, defineFeature } from 'jest-cucumber';
import { WaterIntakeLog } from '../../../domain/entities/WaterIntakeLog';
import { LogWaterIntakeUseCase } from '../../../domain/usecases/LogWaterIntakeUseCase';
import { WaterLogRepositoryImpl } from '../../../data/repositories/WaterLogRepositoryImpl';
import { MemoryStorageDataSource } from '../../../data/datasources/MemoryStorageDataSource';

const feature = loadFeature('src/tests/bdd/features/water_intake_tracking.feature');

defineFeature(feature, (test) => {
  let storage: MemoryStorageDataSource;
  let repository: WaterLogRepositoryImpl;
  let logUseCase: LogWaterIntakeUseCase;

  let dailyGoal: number;
  let currentLog: WaterIntakeLog;

  beforeEach(() => {
    storage = new MemoryStorageDataSource();
    repository = new WaterLogRepositoryImpl(storage);
    logUseCase = new LogWaterIntakeUseCase(repository);

    dailyGoal = 8;
    currentLog = WaterIntakeLog.createEmpty();
  });

  test('Logging glasses updates consumption and progress', ({ given, and, when, then }) => {
    given(/^my daily goal is (\d+) glasses of water$/, (goalStr: string) => {
      dailyGoal = parseInt(goalStr, 10);
    });

    and(/^I have drunk (\d+) glasses today$/, (drunkStr: string) => {
      expect(currentLog.consumedGlasses).toBe(parseInt(drunkStr, 10));
    });

    when(/^I log drinking (\d+) glass of water at "(.*)"$/, async (countStr: string, timeStr: string) => {
      currentLog = await logUseCase.execute('ADD', timeStr);
    });

    then(/^my total consumed water today should be (\d+) glass$/, (expectedStr: string) => {
      expect(currentLog.consumedGlasses).toBe(parseInt(expectedStr, 10));
    });

    and(/^my daily hydration progress should be (\d+) percent$/, (expectedPercentStr: string) => {
      const percentage = currentLog.getProgressPercentage(dailyGoal);
      expect(percentage).toBe(parseInt(expectedPercentStr, 10));
    });
  });

  test('Reaching daily hydration goal', ({ given, when, then, and }) => {
    given(/^my daily goal is (\d+) glasses of water$/, (goalStr: string) => {
      dailyGoal = parseInt(goalStr, 10);
    });

    when(/^I drink (\d+) glasses throughout the day$/, async (countStr: string) => {
      const count = parseInt(countStr, 10);
      for (let i = 0; i < count; i++) {
        currentLog = await logUseCase.execute('ADD', `1${i}:00`);
      }
    });

    then('my daily goal should be marked as reached', () => {
      expect(currentLog.consumedGlasses >= dailyGoal).toBe(true);
    });

    and(/^my progress should be (\d+) percent$/, (expectedPercentStr: string) => {
      expect(currentLog.getProgressPercentage(dailyGoal)).toBe(parseInt(expectedPercentStr, 10));
    });
  });
});
