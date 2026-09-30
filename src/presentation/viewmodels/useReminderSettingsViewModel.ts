import { useState, useEffect, useCallback } from 'react';
import { DependencyContainer, getDependencyContainer } from '../di/DependencyContainer';
import { WaterReminderPlan } from '../../domain/entities/WaterReminderPlan';
import { NotificationSlot } from '../../domain/entities/NotificationSlot';

export interface UseReminderSettingsViewModelProps {
  container?: DependencyContainer;
  initialLocale?: 'en' | 'fa';
}

/**
 * ViewModel: useReminderSettingsViewModel (MVVM Pattern)
 *
 * Encapsulates the UI state and user interactions for configuring the reminder schedule.
 * Exposes pure state properties and reactive methods to the Settings View.
 */
export function useReminderSettingsViewModel({
  container = getDependencyContainer(),
  initialLocale = 'fa',
}: UseReminderSettingsViewModelProps = {}) {
  const [targetGlasses, setTargetGlasses] = useState<number>(8);
  const [startTime, setStartTime] = useState<string>('08:00');
  const [endTime, setEndTime] = useState<string>('22:00');
  const [isEnabled, setIsEnabled] = useState<boolean>(true);
  const [previewSlots, setPreviewSlots] = useState<NotificationSlot[]>([]);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Compute live preview whenever inputs change
  const computePreview = useCallback(
    (glasses: number, start: string, end: string, enabled: boolean) => {
      try {
        const tempPlan = new WaterReminderPlan({
          targetGlasses: glasses,
          startTime: start,
          endTime: end,
          isEnabled: enabled,
          glassSizeMl: 250,
        });
        const slots = container.calculateScheduleUseCase.execute(tempPlan);
        setPreviewSlots(slots);
        setErrorMessage(null);
      } catch (err: any) {
        setPreviewSlots([]);
        setErrorMessage(err.message || 'Validation error');
      }
    },
    [container]
  );

  // Load existing plan from repository on mount
  useEffect(() => {
    let isMounted = true;

    async function loadPlan() {
      setIsLoading(true);
      try {
        const plan = await container.getReminderPlanUseCase.execute();
        if (isMounted) {
          setTargetGlasses(plan.targetGlasses);
          setStartTime(plan.startTime);
          setEndTime(plan.endTime);
          setIsEnabled(plan.isEnabled);
          computePreview(plan.targetGlasses, plan.startTime, plan.endTime, plan.isEnabled);
        }
      } catch (error: any) {
        if (isMounted) {
          setErrorMessage(error.message || 'Error loading reminder plan');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadPlan();
    return () => {
      isMounted = false;
    };
  }, [container, computePreview]);

  // Handlers
  const handleSetTargetGlasses = (count: number) => {
    const clamped = Math.max(1, Math.min(count, 24));
    setTargetGlasses(clamped);
    computePreview(clamped, startTime, endTime, isEnabled);
  };

  const handleSetStartTime = (time: string) => {
    setStartTime(time);
    computePreview(targetGlasses, time, endTime, isEnabled);
  };

  const handleSetEndTime = (time: string) => {
    setEndTime(time);
    computePreview(targetGlasses, startTime, time, isEnabled);
  };

  const handleToggleEnabled = (val: boolean) => {
    setIsEnabled(val);
    computePreview(targetGlasses, startTime, endTime, val);
  };

  const handleSave = async (locale: 'en' | 'fa' = initialLocale): Promise<boolean> => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setIsSaving(true);

    try {
      const plan = new WaterReminderPlan({
        targetGlasses,
        startTime,
        endTime,
        isEnabled,
        glassSizeMl: 250,
      });

      await container.saveReminderPlanUseCase.execute(plan, locale);
      setSuccessMessage('SUCCESS');
      return true;
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save settings');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    // State
    targetGlasses,
    startTime,
    endTime,
    isEnabled,
    previewSlots,
    isLoading,
    isSaving,
    errorMessage,
    successMessage,

    // Actions
    setTargetGlasses: handleSetTargetGlasses,
    setStartTime: handleSetStartTime,
    setEndTime: handleSetEndTime,
    setIsEnabled: handleToggleEnabled,
    saveSettings: handleSave,
    clearMessages: () => {
      setErrorMessage(null);
      setSuccessMessage(null);
    },
  };
}
