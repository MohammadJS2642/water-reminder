# 🏛️ Architecture Documentation (Clean Architecture + MVVM)

## 1. Architectural Layers & Separation of Concerns

```mermaid
flowchart TD
    subgraph Presentation ["Presentation Layer (MVVM)"]
        UI["Views / Screens\n(HomeScreen, SettingsScreen)"]
        VM["ViewModels\n(useWaterTrackerViewModel, useReminderSettingsViewModel)"]
        UI -->|Observes State & Triggers Actions| VM
    end

    subgraph DI ["Composition Root / DI"]
        Container["DependencyContainer\n(Wires Interfaces to Implementations)"]
    end

    subgraph Domain ["Domain Layer (Pure Business Core)"]
        UC["Use Cases\n(CalculateScheduleUseCase, SaveReminderPlanUseCase,\nLogWaterIntakeUseCase, GetReminderPlanUseCase)"]
        Entities["Entities & Value Objects\n(WaterReminderPlan, WaterIntakeLog, NotificationSlot)"]
        RepoInterfaces["Repository & Service Interfaces\n(IWaterReminderRepository, IWaterLogRepository, INotificationScheduler)"]
        UC --> Entities
        UC --> RepoInterfaces
    end

    subgraph Data ["Data Layer (Infrastructure & Adapters)"]
        Repos["Repository Implementations\n(WaterReminderRepositoryImpl, WaterLogRepositoryImpl)"]
        Services["Service Implementations\n(ExpoNotificationScheduler, MockNotificationScheduler)"]
        DataSources["Storage DataSources\n(AsyncStorageDataSource, MemoryStorageDataSource)"]
        Repos --> DataSources
        Repos -.->|Implements| RepoInterfaces
        Services -.->|Implements| RepoInterfaces
    end

    VM -->|Executes| UC
    Container --> Repos
    Container --> Services
    Container --> UC
```

---

## 2. Sequence Diagram: Configuring Reminders Flow

```mermaid
sequenceDiagram
    autonumber
    actor User as User (کاربر)
    participant View as SettingsScreen (View)
    participant VM as useReminderSettingsViewModel (ViewModel)
    participant UC as SaveReminderPlanUseCase
    participant Calc as CalculateScheduleUseCase
    participant Repo as WaterReminderRepositoryImpl
    participant Notif as ExpoNotificationScheduler

    User->>View: Selects 8 glasses, 08:00 to 22:00
    View->>VM: setTargetGlasses(8), setTimes("08:00", "22:00")
    VM->>Calc: execute(plan)
    Calc-->>VM: Returns 8 slots (08:00, 10:00, ..., 22:00)
    VM-->>View: Live update slots preview on screen

    User->>View: Taps "Save Settings"
    View->>VM: saveSettings('fa')
    VM->>UC: execute(plan, 'fa')
    UC->>Repo: savePlan(plan)
    Repo-->>UC: Plan persisted to storage
    UC->>Calc: execute(plan)
    UC->>Notif: scheduleReminders(slots, isEnabled, 'fa')
    Notif-->>UC: Notifications scheduled with OS
    UC-->>VM: Success confirmation
    VM-->>View: Show success alert & update UI
```

---

## 3. Directory Layout and File Responsibilities

| Path | Responsibility | Layer |
| :--- | :--- | :--- |
| `src/domain/entities/` | Enterprise rules, invariants, validation (`WaterReminderPlan`, `WaterIntakeLog`) | **Domain** |
| `src/domain/repositories/` | Pure abstract contracts (Interfaces) | **Domain** |
| `src/domain/usecases/` | Business action workflows (`CalculateScheduleUseCase`, etc.) | **Domain** |
| `src/data/datasources/` | Storage access abstractions (`AsyncStorageDataSource`, `MemoryStorageDataSource`) | **Data** |
| `src/data/services/` | Platform capabilities (`ExpoNotificationScheduler`, `MockNotificationScheduler`) | **Data** |
| `src/data/repositories/` | Concrete serialization & data mapping | **Data** |
| `src/presentation/di/` | Dependency Injection container (Composition Root) | **Presentation** |
| `src/presentation/viewmodels/`| UI state management hooks (MVVM ViewModel) | **Presentation** |
| `src/presentation/components/`| Reusable visual building blocks (Cups, progress meter, buttons) | **Presentation** |
| `src/presentation/screens/` | Top-level screen views (Home, Settings, Guide) | **Presentation** |
| `src/core/i18n/` | Bilingual dictionaries (`fa.ts`, `en.ts`) and RTL provider | **Core** |
| `src/tests/` | Unit, Integration, and BDD test suites | **Tests** |
