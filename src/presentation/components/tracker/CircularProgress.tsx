import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../core/theme/colors';
import { borderRadius, typography, spacing } from '../../../core/theme/spacing';
import { useTranslation } from '../../../core/i18n/I18nContext';

interface CircularProgressProps {
  percentage: number;
  consumedGlasses: number;
  targetGlasses: number;
  isGoalReached: boolean;
}

export const CircularProgress: React.FC<CircularProgressProps> = ({
  percentage,
  consumedGlasses,
  targetGlasses,
  isGoalReached,
}) => {
  const { t, formatNumber } = useTranslation();

  return (
    <View style={styles.container}>
      <View style={[styles.outerCircle, isGoalReached && styles.outerCircleGoal]}>
        <View style={styles.innerCircle}>
          <Text style={styles.percentageText}>{formatNumber(percentage)}%</Text>
          <Text style={styles.counterText}>
            {formatNumber(consumedGlasses)} / {formatNumber(targetGlasses)} {t('glassUnit')}
          </Text>
          <Text style={styles.volumeText}>
            {formatNumber(consumedGlasses * 250)} / {formatNumber(targetGlasses * 250)} {t('milliliters')}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: spacing.md,
  },
  outerCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 10,
    borderColor: colors.waterAccent,
    backgroundColor: colors.primaryLight,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  outerCircleGoal: {
    borderColor: colors.success,
    backgroundColor: colors.successLight,
  },
  innerCircle: {
    width: 170,
    height: 170,
    borderRadius: 85,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.sm,
  },
  percentageText: {
    fontSize: 38,
    fontWeight: '800',
    color: colors.primaryDark,
  },
  counterText: {
    ...typography.heading3,
    color: colors.textPrimary,
    marginTop: 2,
  },
  volumeText: {
    ...typography.caption,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
