import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { colors } from '../../core/theme/colors';
import { spacing, typography, borderRadius } from '../../core/theme/spacing';
import { useTranslation } from '../../core/i18n/I18nContext';
import { useReminderSettingsViewModel } from '../viewmodels/useReminderSettingsViewModel';
import { Header } from '../components/common/Header';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { TimePickerModal } from '../components/common/TimePickerModal';
import { ScheduledSlotsPreview } from '../components/settings/ScheduledSlotsPreview';

export const SettingsScreen: React.FC = () => {
  const { t, formatNumber, isRTL, locale } = useTranslation();
  const vm = useReminderSettingsViewModel({ initialLocale: locale });

  // Time picker modal state
  const [activePicker, setActivePicker] = useState<'START' | 'END' | null>(null);

  const handleSave = async () => {
    const success = await vm.saveSettings(locale);
    if (success) {
      Alert.alert(
        locale === 'fa' ? 'ثبت شد' : 'Saved',
        t('saveSuccessMessage')
      );
    }
  };

  const glassOptions = [6, 8, 10, 12];

  return (
    <View style={styles.screen}>
      <Header
        title={t('tabSettings')}
        subtitle={t('planSettingsSubtitle')}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Error message banner */}
        {vm.errorMessage && (
          <View style={styles.errorBanner}>
            <Text style={[styles.errorText, { textAlign: isRTL ? 'right' : 'left' }]}>
              ⚠️ {vm.errorMessage}
            </Text>
          </View>
        )}

        {/* 1. Daily Target Glasses */}
        <Card>
          <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('targetGlassesLabel')}
          </Text>
          <Text style={[styles.sectionHint, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('targetGlassesHint')}
          </Text>

          {/* Stepper Control */}
          <View style={[styles.stepperRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => vm.setTargetGlasses(vm.targetGlasses - 1)}
              activeOpacity={0.7}
            >
              <Text style={styles.stepperBtnText}>−</Text>
            </TouchableOpacity>

            <View style={styles.stepperDisplay}>
              <Text style={styles.stepperValue}>{formatNumber(vm.targetGlasses)}</Text>
              <Text style={styles.stepperUnit}>{t('glassUnit')}</Text>
            </View>

            <TouchableOpacity
              style={styles.stepperBtn}
              onPress={() => vm.setTargetGlasses(vm.targetGlasses + 1)}
              activeOpacity={0.7}
            >
              <Text style={styles.stepperBtnText}>+</Text>
            </TouchableOpacity>
          </View>

          {/* Quick preset chips */}
          <View style={[styles.chipsRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            {glassOptions.map((opt) => (
              <TouchableOpacity
                key={`opt-${opt}`}
                style={[
                  styles.chip,
                  vm.targetGlasses === opt && styles.activeChip,
                ]}
                onPress={() => vm.setTargetGlasses(opt)}
              >
                <Text
                  style={[
                    styles.chipText,
                    vm.targetGlasses === opt && styles.activeChipText,
                  ]}
                >
                  {formatNumber(opt)} {t('glassUnit')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>

        {/* 2. Time Window (Start & End Time) */}
        <Card>
          <Text style={[styles.sectionTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
            {locale === 'fa' ? 'بازه زمانی یادآوری' : 'Reminder Time Window'}
          </Text>

          <View style={[styles.timeRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            {/* Start Time Field */}
            <TouchableOpacity
              style={styles.timeBox}
              onPress={() => setActivePicker('START')}
              activeOpacity={0.7}
            >
              <Text style={styles.timeBoxLabel}>{t('startTimeLabel')}</Text>
              <Text style={styles.timeBoxValue}>⏰ {formatNumber(vm.startTime)}</Text>
            </TouchableOpacity>

            <View style={styles.arrowBox}>
              <Text style={styles.arrowText}>{isRTL ? '←' : '→'}</Text>
            </View>

            {/* End Time Field */}
            <TouchableOpacity
              style={styles.timeBox}
              onPress={() => setActivePicker('END')}
              activeOpacity={0.7}
            >
              <Text style={styles.timeBoxLabel}>{t('endTimeLabel')}</Text>
              <Text style={styles.timeBoxValue}>🌙 {formatNumber(vm.endTime)}</Text>
            </TouchableOpacity>
          </View>
        </Card>

        {/* 3. Notifications Toggle Switch */}
        <Card>
          <View style={[styles.switchRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={styles.switchTextContainer}>
              <Text style={[styles.switchLabel, { textAlign: isRTL ? 'right' : 'left' }]}>
                {t('remindersEnabledLabel')}
              </Text>
              <Text style={[styles.switchHint, { textAlign: isRTL ? 'right' : 'left' }]}>
                {t('remindersEnabledHint')}
              </Text>
            </View>

            <Switch
              value={vm.isEnabled}
              onValueChange={vm.setIsEnabled}
              trackColor={{ false: '#cbd5e1', true: colors.primaryLight }}
              thumbColor={vm.isEnabled ? colors.primary : '#f4f3f4'}
            />
          </View>
        </Card>

        {/* 4. Live Schedule Slots Preview */}
        <Card>
          <ScheduledSlotsPreview
            slots={vm.previewSlots}
            isEnabled={vm.isEnabled}
          />
        </Card>

        {/* Save Button */}
        <View style={styles.saveContainer}>
          <Button
            title={t('save')}
            icon="💾"
            onPress={handleSave}
            loading={vm.isSaving}
            variant="primary"
            style={styles.saveBtn}
          />
        </View>
      </ScrollView>

      {/* Time Picker Modals */}
      <TimePickerModal
        visible={activePicker === 'START'}
        initialTime={vm.startTime}
        title={t('startTimeLabel')}
        onConfirm={(newTime) => {
          vm.setStartTime(newTime);
          setActivePicker(null);
        }}
        onCancel={() => setActivePicker(null)}
      />

      <TimePickerModal
        visible={activePicker === 'END'}
        initialTime={vm.endTime}
        title={t('endTimeLabel')}
        onConfirm={(newTime) => {
          vm.setEndTime(newTime);
          setActivePicker(null);
        }}
        onCancel={() => setActivePicker(null)}
      />
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
  errorBanner: {
    backgroundColor: colors.dangerLight,
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginVertical: spacing.xs,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  errorText: {
    ...typography.bodySmall,
    color: colors.danger,
    fontWeight: '600',
  },
  sectionTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
  },
  sectionHint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.md,
  },
  stepperRow: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.sm,
  },
  stepperBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.waterAccent,
  },
  stepperBtnText: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  stepperDisplay: {
    alignItems: 'center',
    marginHorizontal: spacing.xl,
  },
  stepperValue: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  stepperUnit: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  chipsRow: {
    justifyContent: 'center',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.cardBorder,
  },
  activeChip: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  activeChipText: {
    color: '#ffffff',
  },
  timeRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: spacing.sm,
  },
  timeBox: {
    flex: 1,
    backgroundColor: colors.background,
    borderWidth: 1.5,
    borderColor: colors.cardBorder,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    alignItems: 'center',
  },
  timeBoxLabel: {
    ...typography.caption,
    color: colors.textSecondary,
    marginBottom: 4,
  },
  timeBoxValue: {
    ...typography.bodyLarge,
    fontWeight: '700',
    color: colors.primaryDark,
  },
  arrowBox: {
    paddingHorizontal: spacing.sm,
  },
  arrowText: {
    fontSize: 20,
    color: colors.textSecondary,
  },
  switchRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchTextContainer: {
    flex: 1,
    paddingEnd: spacing.md,
  },
  switchLabel: {
    ...typography.heading3,
    color: colors.textPrimary,
  },
  switchHint: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 2,
  },
  saveContainer: {
    marginTop: spacing.md,
  },
  saveBtn: {
    paddingVertical: spacing.md,
  },
});
