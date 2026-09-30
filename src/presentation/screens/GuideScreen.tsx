import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { colors } from '../../core/theme/colors';
import { spacing, typography, borderRadius } from '../../core/theme/spacing';
import { useTranslation } from '../../core/i18n/I18nContext';
import { Header } from '../components/common/Header';
import { Card } from '../components/common/Card';

export const GuideScreen: React.FC = () => {
  const { isRTL, locale } = useTranslation();

  return (
    <View style={styles.screen}>
      <Header
        title={locale === 'fa' ? 'راهنمای یادگیری' : 'Learning Guide'}
        subtitle={
          locale === 'fa'
            ? 'آموزش مفاهیم معماری تمیز و MVVM برای تازه‌کارها'
            : 'Clean Architecture & MVVM tutorial for beginners'
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Layer 1: Domain */}
        <Card style={styles.guideCard}>
          <Text style={styles.stepBadge}>۱. Domain Layer (لایه دامنه)</Text>
          <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
            {locale === 'fa' ? 'مغز متفکر و منطق خالص برنامه' : 'Pure Business Core'}
          </Text>
          <Text style={[styles.guideBody, { textAlign: isRTL ? 'right' : 'left' }]}>
            {locale === 'fa'
              ? 'در این لایه هیچ کدی وابسته به ری‌اکت، ظاهر (UI) یا کتابخانه‌های جانبی نیست. فقط آبجکت‌ها و قوانین بیزینس هستند:\n\n' +
                '• Entities: مثل WaterReminderPlan (محاسبه لیتر و اعتبارسنجی ساعت شروع و پایان).\n' +
                '• Use Cases: مثل CalculateScheduleUseCase که بر اساس تعداد لیوان و بازه زمانی، ساعات دقیق یادآورها را تقسیم‌بندی می‌کند.'
              : 'Zero external dependencies. Contains pure TypeScript business logic:\n\n' +
                '• Entities: WaterReminderPlan encapsulates core validation and domain invariants.\n' +
                '• Use Cases: CalculateScheduleUseCase computes evenly spaced reminder slots.'}
          </Text>
        </Card>

        {/* Layer 2: Data */}
        <Card style={styles.guideCard}>
          <Text style={styles.stepBadge}>۲. Data Layer (لایه داده‌ها)</Text>
          <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
            {locale === 'fa' ? 'منبع داده‌ها و ابزارهای بیرونی' : 'Data Sources & Adapters'}
          </Text>
          <Text style={[styles.guideBody, { textAlign: isRTL ? 'right' : 'left' }]}>
            {locale === 'fa'
              ? 'این لایه قراردادهای لایه دامنه را پیاده‌سازی می‌کند:\n\n' +
                '• Repositories: مثل WaterReminderRepositoryImpl که داده‌ها را با فرمت JSON در حافظه یا AsyncStorage ذخیره می‌کند.\n' +
                '• Services: مثل ExpoNotificationScheduler که نوتیفیکیشن‌های سیستم‌عامل را تنظیم می‌کند.'
              : 'Implements the interfaces defined by the Domain layer:\n\n' +
                '• Repositories: Implements persistence in AsyncStorage or In-Memory.\n' +
                '• Services: ExpoNotificationScheduler talks to native OS push/local notifications.'}
          </Text>
        </Card>

        {/* Layer 3: Presentation & MVVM */}
        <Card style={styles.guideCard}>
          <Text style={styles.stepBadge}>۳. Presentation & MVVM (لایه نمایش)</Text>
          <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
            {locale === 'fa' ? 'الگوی طراحی MVVM' : 'MVVM Pattern'}
          </Text>
          <Text style={[styles.guideBody, { textAlign: isRTL ? 'right' : 'left' }]}>
            {locale === 'fa'
              ? '• Model: همان Entityها و Use Caseهای لایه دامنه.\n\n' +
                '• ViewModel: هوک‌های سفارشی مانند useReminderSettingsViewModel که وظیفه مدیریت State، اعتبارسنجی مقادیر فرم و فراخوانی Use Caseها را دارند.\n\n' +
                '• View: کامپوننت‌های خالص UI (مثل HomeScreen و SettingsScreen) که فقط داده‌های ViewModel را رندر کرده و با کلیک کاربر، متدهای آن را فراخوانی می‌کنند.'
              : '• Model: Domain entities and use cases.\n\n' +
                '• ViewModel: Custom React hooks (e.g. useReminderSettingsViewModel) orchestrating UI state.\n\n' +
                '• View: Pure visual components bound to ViewModel state and actions.'}
          </Text>
        </Card>

        {/* Testing Strategy */}
        <Card style={styles.guideCard}>
          <Text style={styles.stepBadge}>۴. Testing (هرم تست‌ها)</Text>
          <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
            {locale === 'fa' ? 'تست‌های واحد، یکپارچگی و BDD' : 'Unit, Integration & BDD'}
          </Text>
          <Text style={[styles.guideBody, { textAlign: isRTL ? 'right' : 'left' }]}>
            {locale === 'fa'
              ? '• Unit Tests: تست ریاضی تقسیم ساعات و اعتبارسنجی موجودیت‌ها.\n' +
                '• Integration Tests: تست هماهنگی ریپازیتوری با منبع داده و ویومدل.\n' +
                '• BDD Tests: سناریوهای رفتاری شفاف با استاندارد Gherkin (Given-When-Then).'
              : '• Unit Tests: Validate calculations and isolated domain invariants.\n' +
                '• Integration Tests: Test repository serialization and ViewModel binding.\n' +
                '• BDD Tests: Executable Gherkin scenarios (Given / When / Then).'}
          </Text>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  guideCard: {
    padding: spacing.lg,
    marginVertical: spacing.xs + 2,
  },
  stepBadge: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: '700',
    backgroundColor: colors.primaryLight,
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
  },
  sectionTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  guideBody: {
    ...typography.bodyMedium,
    color: colors.textSecondary,
    lineHeight: 22,
  },
});
