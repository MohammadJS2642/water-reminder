import { IStorageDataSource } from '../../data/datasources/IStorageDataSource';
import { AsyncStorageDataSource } from '../../data/datasources/AsyncStorageDataSource';
import { INotificationScheduler } from '../../domain/repositories/INotificationScheduler';
import { ExpoNotificationScheduler } from '../../data/services/ExpoNotificationScheduler';
import { MockNotificationScheduler } from '../../data/services/MockNotificationScheduler';
import { IWaterReminderRepository } from '../../domain/repositories/IWaterReminderRepository';
import { WaterReminderRepositoryImpl } from '../../data/repositories/WaterReminderRepositoryImpl';
import { IWaterLogRepository } from '../../domain/repositories/IWaterLogRepository';
import { WaterLogRepositoryImpl } from '../../data/repositories/WaterLogRepositoryImpl';
import { CalculateScheduleUseCase } from '../../domain/usecases/CalculateScheduleUseCase';
import { SaveReminderPlanUseCase } from '../../domain/usecases/SaveReminderPlanUseCase';
import { GetReminderPlanUseCase } from '../../domain/usecases/GetReminderPlanUseCase';
import { LogWaterIntakeUseCase } from '../../domain/usecases/LogWaterIntakeUseCase';
import { GetTodayWaterLogUseCase } from '../../domain/usecases/GetTodayWaterLogUseCase';

/**
 * Dependency Injection (DI) Container
 *
 * In Clean Architecture, the Composition Root (Dependency Container)
 * is responsible for instantiating concrete implementations and injecting
 * them into use cases and view models.
 *
 * This makes swapping implementations (e.g., swapping Expo notifications
 * for Mock notifications in unit/integration tests) completely effortless!
 */
export class DependencyContainer {
  public readonly storageDataSource: IStorageDataSource;
  public readonly notificationScheduler: INotificationScheduler;
  public readonly waterReminderRepository: IWaterReminderRepository;
  public readonly waterLogRepository: IWaterLogRepository;

  // Use Cases
  public readonly calculateScheduleUseCase: CalculateScheduleUseCase;
  public readonly saveReminderPlanUseCase: SaveReminderPlanUseCase;
  public readonly getReminderPlanUseCase: GetReminderPlanUseCase;
  public readonly logWaterIntakeUseCase: LogWaterIntakeUseCase;
  public readonly getTodayWaterLogUseCase: GetTodayWaterLogUseCase;

  constructor(options?: {
    storageDataSource?: IStorageDataSource;
    notificationScheduler?: INotificationScheduler;
  }) {
    this.storageDataSource = options?.storageDataSource ?? new AsyncStorageDataSource();
    this.notificationScheduler = options?.notificationScheduler ?? new ExpoNotificationScheduler();

    this.waterReminderRepository = new WaterReminderRepositoryImpl(this.storageDataSource);
    this.waterLogRepository = new WaterLogRepositoryImpl(this.storageDataSource);

    this.calculateScheduleUseCase = new CalculateScheduleUseCase();
    this.saveReminderPlanUseCase = new SaveReminderPlanUseCase(
      this.waterReminderRepository,
      this.notificationScheduler,
      this.calculateScheduleUseCase
    );
    this.getReminderPlanUseCase = new GetReminderPlanUseCase(this.waterReminderRepository);
    this.logWaterIntakeUseCase = new LogWaterIntakeUseCase(this.waterLogRepository);
    this.getTodayWaterLogUseCase = new GetTodayWaterLogUseCase(this.waterLogRepository);
  }
}

// Global default singleton container for the production app
let defaultContainerInstance: DependencyContainer | null = null;

export function getDependencyContainer(): DependencyContainer {
  if (!defaultContainerInstance) {
    defaultContainerInstance = new DependencyContainer();
  }
  return defaultContainerInstance;
}

export function setDependencyContainer(container: DependencyContainer): void {
  defaultContainerInstance = container;
}
