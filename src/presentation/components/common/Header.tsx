import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../../core/theme/colors';
import { spacing, borderRadius, typography } from '../../../core/theme/spacing';
import { useTranslation } from '../../../core/i18n/I18nContext';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showLanguageToggle?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showLanguageToggle = true,
}) => {
  const { t, locale, toggleLocale, isRTL } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={[styles.topRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        <View style={styles.titleContainer}>
          <Text style={[styles.title, { textAlign: isRTL ? 'right' : 'left' }]}>
            {title || t('appName')}
          </Text>
          <Text style={[styles.subtitle, { textAlign: isRTL ? 'right' : 'left' }]}>
            {subtitle || t('appSubtitle')}
          </Text>
        </View>

        {showLanguageToggle && (
          <TouchableOpacity
            style={styles.langButton}
            onPress={toggleLocale}
            activeOpacity={0.8}
            accessibilityLabel="Toggle Language"
          >
            <Text style={styles.langButtonFlag}>
              {locale === 'fa' ? '🇺🇸 EN' : '🇮🇷 فا'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={[styles.badgeContainer, { alignSelf: isRTL ? 'flex-end' : 'flex-start' }]}>
        <Text style={styles.badgeText}>📐 MVVM & Clean Architecture</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.sm,
    backgroundColor: colors.background,
  },
  topRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    ...typography.heading2,
    color: colors.primaryDark,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: 2,
  },
  langButton: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.waterAccent,
  },
  langButtonFlag: {
    ...typography.caption,
    color: colors.primaryDark,
    fontWeight: '700',
  },
  badgeContainer: {
    marginTop: spacing.sm,
    backgroundColor: '#ecfdf5',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs - 2,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    borderColor: '#a7f3d0',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#065f46',
  },
});
