import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useWaterTrackerViewModel } from '../../../presentation/viewmodels/useWaterTrackerViewModel';
import { DependencyContainer } from '../../../presentation/di/DependencyContainer';
import { MemoryStorageDataSource } from '../../../data/datasources/MemoryStorageDataSource';
import { MockNotificationScheduler } from '../../../data/services/MockNotificationScheduler';

describe('useWaterTrackerViewModel (Integration Test)', () => {
  let container: DependencyContainer;

  beforeEach(() => {
    container = new DependencyContainer({
      storageDataSource: new MemoryStorageDataSource(),
      notificationScheduler: new MockNotificationScheduler(),
    });
  });

  it('should initialize with default target and zero consumed glasses', async () => {
    const { result } = renderHook(() =>
      useWaterTrackerViewModel({ container })
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.targetGlasses).toBe(8);
    expect(result.current.consumedGlasses).toBe(0);
    expect(result.current.progressPercentage).toBe(0);
    expect(result.current.remainingGlasses).toBe(8);
    expect(result.current.isGoalReached).toBe(false);
  });

  it('should drink a glass and update progress percentage and remaining count', async () => {
    const { result } = renderHook(() =>
      useWaterTrackerViewModel({ container })
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.drinkGlass('08:30');
    });

    expect(result.current.consumedGlasses).toBe(1);
    expect(result.current.remainingGlasses).toBe(7);
    expect(result.current.lastIntakeTime).toBe('08:30');
    expect(result.current.progressPercentage).toBe(13); // 1 / 8 = 12.5% rounded to 13%
  });

  it('should undo last glass and reset intake', async () => {
    const { result } = renderHook(() =>
      useWaterTrackerViewModel({ container })
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    await act(async () => {
      await result.current.drinkGlass('09:00');
      await result.current.drinkGlass('11:00');
    });

    expect(result.current.consumedGlasses).toBe(2);

    await act(async () => {
      await result.current.undoGlass();
    });

    expect(result.current.consumedGlasses).toBe(1);

    await act(async () => {
      await result.current.resetToday();
    });

    expect(result.current.consumedGlasses).toBe(0);
    expect(result.current.remainingGlasses).toBe(8);
  });
});
