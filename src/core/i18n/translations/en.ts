export const en = {
  // Common
  appName: 'HydroFlow',
  appSubtitle: 'Daily Water Intake & Reminder',
  save: 'Save Changes',
  cancel: 'Cancel',
  reset: 'Reset',
  close: 'Close',
  today: 'Today',
  glasses: 'Glasses',
  glassUnit: 'glasses',
  milliliters: 'ml',

  // Navigation / Tabs
  tabHome: 'Hydration',
  tabSettings: 'Reminder Plan',
  tabGuide: 'Learning Guide',

  // Home Screen (Tracker)
  dailyProgress: 'Daily Progress',
  goalReachedTitle: '🎉 Congratulations!',
  goalReachedDesc: 'You reached your hydration goal for today!',
  consumedSoFar: 'Drank {count} of {total} glasses',
  remainingGlasses: '{count} glasses remaining',
  drinkOneGlass: 'Drink a Glass (+250 ml)',
  undoLastGlass: 'Undo Last Glass',
  resetTodayPrompt: 'Reset today’s progress?',
  resetConfirm: 'Yes, Reset',
  resetCancel: 'No, Keep',
  quickLogTitle: 'Quick Water Intake Log',
  streakDays: '{days} days streak',
  lastIntakeAt: 'Last glass at {time}',
  noIntakeYet: 'No water logged yet today. Start now!',

  // Settings Screen (Reminder Schedule)
  planSettingsTitle: 'Hydration Schedule',
  planSettingsSubtitle: 'Configure your daily water target and reminder hours',
  targetGlassesLabel: 'Daily Target (Glasses)',
  targetGlassesHint: 'Recommended: 6 to 12 glasses per day (approx. 1.5L - 3L)',
  startTimeLabel: 'Wake-up / Start Time',
  endTimeLabel: 'Bedtime / End Time',
  intervalPreviewTitle: 'Generated Schedule Preview',
  intervalPreviewDesc: 'Your reminders will automatically ring at these times:',
  remindersEnabledLabel: 'Enable Notifications',
  remindersEnabledHint: 'Receive smart reminders on this device throughout the day',
  timeWindowError: 'End time must be after start time!',
  minGlassesError: 'Daily target must be at least 1 glass.',
  saveSuccessMessage: 'Reminder plan and notifications updated successfully!',

  // Notification content
  notificationTitle: '💧 Time to drink water!',
  notificationBody: 'Stay hydrated! Take a moment to drink glass #{glassNumber}.',

  // Architecture badge & Educational notes
  cleanArchBanner: 'Clean Architecture + MVVM Pattern in Action',
  languageSwitchPrompt: 'زبان فارسی',
};

export type TranslationKey = keyof typeof en;
