import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { colors } from '../../core/theme/colors';
import { spacing, typography, borderRadius } from '../../core/theme/spacing';
import { useTranslation } from '../../core/i18n/I18nContext';
import { useWaterTrackerViewModel } from '../viewmodels/useWaterTrackerViewModel';
import { Header } from '../components/common/Header';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { CircularProgress } from '../components/tracker/CircularProgress';
import { GlassGrid } from '../components/tracker/GlassGrid';

interface HomeScreenProps {
  onNavigateToSettings?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ onNavigateToSettings }) => {
  const { t, formatNumber, isRTL } = useTranslation();
  const vm = useWaterTrackerViewModel();

  const handleDrink = () => {
    vm.drinkGlass();
  };

  const handleReset = () => {
    Alert.alert(
      t('reset'),
      t('resetTodayPrompt'),
      [
        { text: t('resetCancel'), style: 'cancel' },
        { text: t('resetConfirm'), style: 'destructive', onPress: () => vm.resetToday() },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.screen}>
      <Header />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Goal Reached Celebration Banner */}
        {vm.isGoalReached && (
          <View style={styles.celebrationCard}>
            <Text style={styles.celebrationEmoji}>🏆</Text>
            <View style={styles.celebrationTextWrapper}>
              <Text style={[styles.celebrationTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
                {t('goalReachedTitle')}
              </Text>
              <Text style={[styles.celebrationSubtitle, { textAlign: isRTL ? 'right' : 'left' }]}>
                {t('goalReachedDesc')}
              </Text>
            </View>
          </View>
        )}

        {/* Circular Hydration Meter */}
        <Card style={styles.trackerCard}>
          <Text style={[styles.cardTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('dailyProgress')}
          </Text>

          <CircularProgress
            percentage={vm.progressPercentage}
            consumedGlasses={vm.consumedGlasses}
            targetGlasses={vm.targetGlasses}
            isGoalReached={vm.isGoalReached}
          />

          <View style={[styles.statsRow, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>{t('today')}</Text>
              <Text style={styles.statValue}>
                {formatNumber(vm.consumedGlasses * 250)} {t('milliliters')}
              </Text>
            </View>

            <View style={styles.statDivider} />

            <View style={styles.statBox}>
              <Text style={styles.statLabel}>{t('glasses')}</Text>
              <Text style={styles.statValue}>
                {t('consumedSoFar', {
                  count: vm.consumedGlasses,
                  total: vm.targetGlasses,
                })}
              </Text>
            </View>
          </View>

          {vm.lastIntakeTime ? (
            <Text style={[styles.lastIntakeText, { textAlign: 'center' }]}>
              {t('lastIntakeAt', { time: vm.lastIntakeTime })}
            </Text>
          ) : (
            <Text style={[styles.lastIntakeText, { textAlign: 'center' }]}>
              {t('noIntakeYet')}
            </Text>
          )}
        </Card>

        {/* Action Buttons */}
        <View style={styles.actionsContainer}>
          <Button
            title={t('drinkOneGlass')}
            icon="💧"
            onPress={handleDrink}
            variant="primary"
            style={styles.drinkButton}
          />

          <View style={[styles.secondaryActions, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Button
              title={t('undoLastGlass')}
              onPress={vm.undoGlass}
              variant="outline"
              disabled={vm.consumedGlasses === 0}
              style={{ flex: 1, marginEnd: spacing.xs }}
            />
            <Button
              title={t('reset')}
              onPress={handleReset}
              variant="danger"
              disabled={vm.consumedGlasses === 0}
              style={{ flex: 1, marginStart: spacing.xs }}
            />
          </View>
        </View>

        {/* Visual Cups Grid */}
        <Card>
          <Text style={[styles.cardTitle, { textAlign: isRTL ? 'right' : 'left' }]}>
            {t('quickLogTitle')}
          </Text>
          <GlassGrid
            totalTarget={vm.targetGlasses}
            consumedCount={vm.consumedGlasses}
            timestamps={vm.intakeTimestamps}
            onGlassPress={(index) => {
              if (index >= vm.consumedGlasses) {
                vm.drinkGlass();
              }
            }}
          />
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
  celebrationCard: {
    backgroundColor: '#ecfdf5',
    borderWidth: 1.5,
    borderColor: '#34d399',
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: spacing.sm,
  },
  celebrationEmoji: {
    fontSize: 32,
    marginHorizontal: spacing.sm,
  },
  celebrationTextWrapper: {
    flex: 1,
  },
  celebrationTitle: {
    ...typography.heading3,
    color: '#065f46',
  },
  celebrationSubtitle: {
    ...typography.bodySmall,
    color: '#047857',
  },
  trackerCard: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
  },
  cardTitle: {
    ...typography.heading3,
    color: colors.textPrimary,
    alignSelf: 'stretch',
    marginBottom: spacing.xs,
  },
  statsRow: {
    width: '100%',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginTop: spacing.md,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  statValue: {
    ...typography.bodyMedium,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: colors.cardBorder,
  },
  lastIntakeText: {
    ...typography.bodySmall,
    color: colors.textSecondary,
    marginTop: spacing.sm,
  },
  actionsContainer: {
    marginVertical: spacing.sm,
    gap: spacing.sm,
  },
  drinkButton: {
    paddingVertical: spacing.md,
    elevation: 3,
  },
  secondaryActions: {
    justifyContent: 'space-between',
  },
});
