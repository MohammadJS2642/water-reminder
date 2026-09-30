import { useState, useEffect, useCallback } from 'react';
import { DependencyContainer, getDependencyContainer } from '../di/DependencyContainer';
import { WaterReminderPlan } from '../../domain/entities/WaterReminderPlan';
import { WaterIntakeLog } from '../../domain/entities/WaterIntakeLog';

export interface UseWaterTrackerViewModelProps {
  container?: DependencyContainer;
}

/**
 * ViewModel: useWaterTrackerViewModel (MVVM Pattern)
 *
 * Encapsulates hydration tracking logic for the Dashboard/Home screen.
 * Observes today's intake log, progress percentage, remaining glasses,
 * and handles drink, undo, and reset actions.
 */
export function useWaterTrackerViewModel({
  container = getDependencyContainer(),
}: UseWaterTrackerViewModelProps = {}) {
  const [plan, setPlan] = useState<WaterReminderPlan>(WaterReminderPlan.createDefault());
  const [todayLog, setTodayLog] = useState<WaterIntakeLog>(WaterIntakeLog.createEmpty());
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Derived state
  const targetGlasses = plan.targetGlasses;
  const consumedGlasses = todayLog.consumedGlasses;
  const progressPercentage = todayLog.getProgressPercentage(targetGlasses);
  const remainingGlasses = Math.max(0, targetGlasses - consumedGlasses);
  const isGoalReached = consumedGlasses >= targetGlasses;
  const lastIntakeTime =
    todayLog.intakeTimestamps.length > 0
      ? todayLog.intakeTimestamps[todayLog.intakeTimestamps.length - 1]
      : null;

  const loadData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [loadedPlan, loadedLog] = await Promise.all([
        container.getReminderPlanUseCase.execute(),
        container.getTodayWaterLogUseCase.execute(),
      ]);
      setPlan(loadedPlan);
      setTodayLog(loadedLog);
    } catch (error) {
      console.error('[useWaterTrackerViewModel] Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, [container]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Actions
  const drinkGlass = async (customTimestamp?: string) => {
    try {
      const updatedLog = await container.logWaterIntakeUseCase.execute('ADD', customTimestamp);
      setTodayLog(updatedLog);
    } catch (error) {
      console.error('[useWaterTrackerViewModel] Error adding water intake:', error);
    }
  };

  const undoGlass = async () => {
    try {
      const updatedLog = await container.logWaterIntakeUseCase.execute('REMOVE');
      setTodayLog(updatedLog);
    } catch (error) {
      console.error('[useWaterTrackerViewModel] Error removing water intake:', error);
    }
  };

  const resetToday = async () => {
    try {
      const updatedLog = await container.logWaterIntakeUseCase.execute('RESET');
      setTodayLog(updatedLog);
    } catch (error) {
      console.error('[useWaterTrackerViewModel] Error resetting water intake:', error);
    }
  };

  return {
    // State
    targetGlasses,
    consumedGlasses,
    progressPercentage,
    remainingGlasses,
    isGoalReached,
    lastIntakeTime,
    intakeTimestamps: todayLog.intakeTimestamps,
    plan,
    isLoading,

    // Actions
    drinkGlass,
    undoGlass,
    resetToday,
    refresh: loadData,
  };
}
