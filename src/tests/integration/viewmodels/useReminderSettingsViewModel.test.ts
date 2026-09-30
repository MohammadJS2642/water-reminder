import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useReminderSettingsViewModel } from '../../../presentation/viewmodels/useReminderSettingsViewModel';
import { DependencyContainer } from '../../../presentation/di/DependencyContainer';
import { MemoryStorageDataSource } from '../../../data/datasources/MemoryStorageDataSource';
import { MockNotificationScheduler } from '../../../data/services/MockNotificationScheduler';

describe('useReminderSettingsViewModel (Integration Test)', () => {
  let container: DependencyContainer;
  let mockScheduler: MockNotificationScheduler;

  beforeEach(() => {
    mockScheduler = new MockNotificationScheduler();
    container = new DependencyContainer({
      storageDataSource: new MemoryStorageDataSource(),
      notificationScheduler: mockScheduler,
    });
  });

  it('should initialize with default plan and preview slots', async () => {
    const { result } = renderHook(() =>
      useReminderSettingsViewModel({ container, initialLocale: 'fa' })
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    // Initial default state
    expect(result.current.targetGlasses).toBe(8);
    expect(result.current.startTime).toBe('08:00');
    expect(result.current.endTime).toBe('22:00');
    expect(result.current.isEnabled).toBe(true);
    expect(result.current.previewSlots).toHaveLength(8);
  });

  it('should update preview when target glasses change', async () => {
    const { result } = renderHook(() =>
      useReminderSettingsViewModel({ container, initialLocale: 'fa' })
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.setTargetGlasses(6);
    });

    expect(result.current.targetGlasses).toBe(6);
    expect(result.current.previewSlots).toHaveLength(6);
  });

  it('should save settings and schedule notifications through the container', async () => {
    const { result } = renderHook(() =>
      useReminderSettingsViewModel({ container, initialLocale: 'fa' })
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.setTargetGlasses(4);
      result.current.setStartTime('10:00');
      result.current.setEndTime('16:00');
    });

    let success: boolean = false;
    await act(async () => {
      success = await result.current.saveSettings('fa');
    });

    expect(success).toBe(true);
    expect(result.current.successMessage).toBe('SUCCESS');

    // Verify side effects on MockNotificationScheduler
    expect(mockScheduler.scheduledSlots).toHaveLength(4);
    expect(mockScheduler.scheduledSlots.map((s) => s.time)).toEqual([
      '10:00',
      '12:00',
      '14:00',
      '16:00',
    ]);
  });
});
