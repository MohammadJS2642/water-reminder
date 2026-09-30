import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Platform,
} from 'react-native';
import { I18nProvider, useTranslation } from './src/core/i18n/I18nContext';
import { colors } from './src/core/theme/colors';
import { typography, spacing, borderRadius } from './src/core/theme/spacing';
import { HomeScreen } from './src/presentation/screens/HomeScreen';
import { SettingsScreen } from './src/presentation/screens/SettingsScreen';
import { GuideScreen } from './src/presentation/screens/GuideScreen';

type TabKey = 'home' | 'settings' | 'guide';

const MainNavigation: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const { t, isRTL } = useTranslation();

  const tabs: { key: TabKey; label: string; icon: string }[] = [
    { key: 'home', label: t('tabHome'), icon: '💧' },
    { key: 'settings', label: t('tabSettings'), icon: '⏰' },
    { key: 'guide', label: t('tabGuide'), icon: '📚' },
  ];

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'settings':
        return <SettingsScreen />;
      case 'guide':
        return <GuideScreen />;
      case 'home':
      default:
        return <HomeScreen onNavigateToSettings={() => setActiveTab('settings')} />;
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.background}
      />

      {/* Screen Body */}
      <View style={styles.body}>{renderActiveScreen()}</View>

      {/* Bottom Navigation Bar */}
      <View style={[styles.bottomBar, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabButton, isActive && styles.activeTabButton]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.8}
            >
              <Text style={styles.tabIcon}>{tab.icon}</Text>
              <Text
                style={[
                  styles.tabLabel,
                  isActive ? styles.activeTabLabel : styles.inactiveTabLabel,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

export default function App() {
  return (
    <I18nProvider initialLocale="fa">
      <MainNavigation />
    </I18nProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  body: {
    flex: 1,
  },
  bottomBar: {
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.cardBorder,
    paddingVertical: spacing.xs + 2,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    minWidth: 80,
  },
  activeTabButton: {
    backgroundColor: colors.primaryLight,
  },
  tabIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  tabLabel: {
    ...typography.caption,
    fontWeight: '600',
  },
  activeTabLabel: {
    color: colors.primaryDark,
    fontWeight: '700',
  },
  inactiveTabLabel: {
    color: colors.textSecondary,
  },
});
