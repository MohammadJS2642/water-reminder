import { TranslationKey } from './en';

export const fa: Record<TranslationKey, string> = {
  // Common
  appName: 'هایدروفلو | یادآور آب',
  appSubtitle: 'یادآور هوشمند و پایش مصرف روزانه آب',
  save: 'ذخیره تنظیمات',
  cancel: 'انصراف',
  reset: 'بازنشانی',
  close: 'بستن',
  today: 'امروز',
  glasses: 'لیوان',
  glassUnit: 'لیوان',
  milliliters: 'میلی‌لیتر',

  // Navigation / Tabs
  tabHome: 'وضعیت روزانه',
  tabSettings: 'تنظیم یادآور',
  tabGuide: 'راهنمای یادگیری',

  // Home Screen (Tracker)
  dailyProgress: 'پیشرفت امروز',
  goalReachedTitle: '🎉 آفرین به شما!',
  goalReachedDesc: 'هدف هیدراتاسیون امروز خود را با موفقیت کامل کردید!',
  consumedSoFar: 'نوشیده شده: {count} از {total} لیوان',
  remainingGlasses: '{count} لیوان باقی مانده است',
  drinkOneGlass: 'نوشیدن یک لیوان آب (+۲۵۰ میلی‌لیتر)',
  undoLastGlass: 'حذف آخرین لیوان',
  resetTodayPrompt: 'آیا مایل به بازنشانی گزارش امروز هستید؟',
  resetConfirm: 'بله، بازنشانی شود',
  resetCancel: 'خیر، انصراف',
  quickLogTitle: 'ثبت سریع مصرف آب',
  streakDays: '{days} روز متوالی پیوسته',
  lastIntakeAt: 'آخرین لیوان در ساعت {time}',
  noIntakeYet: 'هنوز آبی برای امروز ثبت نشده است. همین حالا شروع کنید!',

  // Settings Screen (Reminder Schedule)
  planSettingsTitle: 'برنامه‌ریزی و زمان‌بندی یادآور',
  planSettingsSubtitle: 'تعداد لیوان مورد نظرتان و بازه ساعات بیداری را تعیین کنید',
  targetGlassesLabel: 'تعداد لیوان آب در روز',
  targetGlassesHint: 'میزان پیشنهادی: بین ۶ تا ۱۲ لیوان در روز (حدود ۱.۵ تا ۳ لیتر)',
  startTimeLabel: 'ساعت شروع یادآوری (بیدارباش)',
  endTimeLabel: 'ساعت پایان یادآوری (خواب)',
  intervalPreviewTitle: 'پیش‌نمایش زمان‌بندی یادآورها',
  intervalPreviewDesc: 'اعلان‌های شما به صورت خودکار در این ساعات پخش می‌شوند:',
  remindersEnabledLabel: 'فعال‌سازی ارسال نوتیفیکیشن',
  remindersEnabledHint: 'دریافت یادآورهای منظم در طول ساعات بیداری روی دستگاه شما',
  timeWindowError: 'ساعت پایان باید بعد از ساعت شروع باشد!',
  minGlassesError: 'تعداد لیوان روزانه باید حداقل ۱ لیوان باشد.',
  saveSuccessMessage: 'برنامه یادآوری و نوتیفیکیشن‌ها با موفقیت ذخیره و تنظیم شدند!',

  // Notification content
  notificationTitle: '💧 وقت آب خوردنه!',
  notificationBody: 'فرصتی برای سلامتی؛ لیوان شماره {glassNumber} را نوش جان کنید.',

  // Architecture badge & Educational notes
  cleanArchBanner: 'پیاده‌سازی به سبک Clean Architecture و MVVM',
  languageSwitchPrompt: 'English Language',
};
