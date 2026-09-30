import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../../core/theme/colors';
import { spacing, borderRadius, typography } from '../../../core/theme/spacing';
import { useTranslation } from '../../../core/i18n/I18nContext';

interface GlassGridProps {
  totalTarget: number;
  consumedCount: number;
  timestamps: string[];
  onGlassPress?: (glassIndex: number) => void;
}

export const GlassGrid: React.FC<GlassGridProps> = ({
  totalTarget,
  consumedCount,
  timestamps,
  onGlassPress,
}) => {
  const { formatNumber, isRTL } = useTranslation();
  const glasses = Array.from({ length: totalTarget }, (_, i) => i + 1);

  return (
    <View style={styles.gridContainer}>
      <View style={[styles.grid, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        {glasses.map((glassNum, index) => {
          const isFilled = index < consumedCount;
          const time = timestamps[index];

          return (
            <TouchableOpacity
              key={`glass-${glassNum}`}
              style={[styles.glassCard, isFilled ? styles.glassFilled : styles.glassEmpty]}
              onPress={() => onGlassPress?.(index)}
              activeOpacity={0.7}
            >
              <Text style={styles.glassIcon}>{isFilled ? '💧' : '🥛'}</Text>
              <Text
                style={[
                  styles.glassNumber,
                  isFilled ? styles.glassNumberFilled : styles.glassNumberEmpty,
                ]}
              >
                #{formatNumber(glassNum)}
              </Text>
              {time && (
                <Text style={styles.timestampText}>
                  {formatNumber(time)}
                </Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  gridContainer: {
    marginVertical: spacing.md,
  },
  grid: {
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  glassCard: {
    width: 72,
    height: 82,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xs,
    borderWidth: 1.5,
  },
  glassFilled: {
    backgroundColor: colors.primaryLight,
    borderColor: colors.primary,
  },
  glassEmpty: {
    backgroundColor: '#ffffff',
    borderColor: colors.cardBorder,
  },
  glassIcon: {
    fontSize: 22,
    marginBottom: 2,
  },
  glassNumber: {
    ...typography.caption,
    fontWeight: '700',
  },
  glassNumberFilled: {
    color: colors.primaryDark,
  },
  glassNumberEmpty: {
    color: colors.textMuted,
  },
  timestampText: {
    fontSize: 9,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
