import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../core/theme/colors';
import { spacing, borderRadius, typography } from '../../../core/theme/spacing';
import { useTranslation } from '../../../core/i18n/I18nContext';
import { NotificationSlot } from '../../../domain/entities/NotificationSlot';

interface ScheduledSlotsPreviewProps {
  slots: NotificationSlot[];
  isEnabled: boolean;
}

export const ScheduledSlotsPreview: React.FC<ScheduledSlotsPreviewProps> = ({
  slots,
  isEnabled,
}) => {
  const { t, formatNumber, isRTL } = useTranslation();

  if (!isEnabled) {
    return (
      <View style={styles.disabledContainer}>
        <Text style={styles.disabledText}>
          {isRTL
            ? 'یادآورها غیرفعال هستند. برای ایجاد زمان‌بندی، دکمه فعال‌سازی را روشن کنید.'
            : 'Reminders are disabled. Toggle them on to activate notifications.'}
        </Text>
      </View>
    );
  }

  if (slots.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { textAlign: isRTL ? 'right' : 'left' }]}>
        {t('intervalPreviewTitle')}
      </Text>
      <Text style={[styles.subtitle, { textAlign: isRTL ? 'right' : 'left' }]}>
        {t('intervalPreviewDesc')}
      </Text>

      <View style={[styles.slotsGrid, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        {slots.map((slot) => (
          <View key={`slot-${slot.glassNumber}`} style={styles.slotChip}>
            <Text style={styles.slotGlassLabel}>
              {t('glasses')} #{formatNumber(slot.glassNumber)}
            </Text>
            <Text style={styles.slotTimeText}>⏰ {formatNumber(slot.time)}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  title: {
    ...typography.heading3,
    color: colors.textPrimary,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: spacing.sm,
  },
  slotsGrid: {
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  slotChip: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderWidth: 1,
    borderColor: colors.waterAccent,
    alignItems: 'center',
    minWidth: 95,
  },
  slotGlassLabel: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  slotTimeText: {
    ...typography.bodyMedium,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  disabledContainer: {
    backgroundColor: '#f1f5f9',
    padding: spacing.md,
    borderRadius: borderRadius.md,
    marginVertical: spacing.sm,
  },
  disabledText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    textAlign: 'center',
  },
});
