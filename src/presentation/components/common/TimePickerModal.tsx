import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { colors } from '../../../core/theme/colors';
import { spacing, borderRadius, typography } from '../../../core/theme/spacing';
import { useTranslation } from '../../../core/i18n/I18nContext';
import { Button } from './Button';

interface TimePickerModalProps {
  visible: boolean;
  initialTime: string; // "HH:mm"
  title: string;
  onConfirm: (selectedTime: string) => void;
  onCancel: () => void;
}

export const TimePickerModal: React.FC<TimePickerModalProps> = ({
  visible,
  initialTime,
  title,
  onConfirm,
  onCancel,
}) => {
  const { t, formatNumber } = useTranslation();
  const [initialHour, initialMinute] = initialTime.split(':').map((s) => parseInt(s, 10));

  const [selectedHour, setSelectedHour] = useState<number>(isNaN(initialHour) ? 8 : initialHour);
  const [selectedMinute, setSelectedMinute] = useState<number>(
    isNaN(initialMinute) ? 0 : Math.round(initialMinute / 5) * 5
  );

  const hours = Array.from({ length: 24 }, (_, i) => i);
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5); // 00, 05, 10, ... 55

  const handleConfirm = () => {
    const hh = selectedHour.toString().padStart(2, '0');
    const mm = selectedMinute.toString().padStart(2, '0');
    onConfirm(`${hh}:${mm}`);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.preview}>
            {formatNumber(selectedHour.toString().padStart(2, '0'))} :{' '}
            {formatNumber(selectedMinute.toString().padStart(2, '0'))}
          </Text>

          <View style={styles.pickersContainer}>
            {/* Hour Column */}
            <View style={styles.column}>
              <Text style={styles.columnHeader}>ساعت / Hour</Text>
              <ScrollView style={styles.scrollList} showsVerticalScrollIndicator={false}>
                {hours.map((h) => {
                  const isSelected = h === selectedHour;
                  const label = h.toString().padStart(2, '0');
                  return (
                    <TouchableOpacity
                      key={`h-${h}`}
                      style={[styles.item, isSelected && styles.selectedItem]}
                      onPress={() => setSelectedHour(h)}
                    >
                      <Text style={[styles.itemText, isSelected && styles.selectedItemText]}>
                        {formatNumber(label)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>

            {/* Minute Column */}
            <View style={styles.column}>
              <Text style={styles.columnHeader}>دقیقه / Min</Text>
              <ScrollView style={styles.scrollList} showsVerticalScrollIndicator={false}>
                {minutes.map((m) => {
                  const isSelected = m === selectedMinute;
                  const label = m.toString().padStart(2, '0');
                  return (
                    <TouchableOpacity
                      key={`m-${m}`}
                      style={[styles.item, isSelected && styles.selectedItem]}
                      onPress={() => setSelectedMinute(m)}
                    >
                      <Text style={[styles.itemText, isSelected && styles.selectedItemText]}>
                        {formatNumber(label)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </View>

          <View style={styles.actionsRow}>
            <Button
              title={t('cancel')}
              variant="secondary"
              onPress={onCancel}
              style={{ flex: 1, marginRight: spacing.sm }}
            />
            <Button
              title={t('save')}
              variant="primary"
              onPress={handleConfirm}
              style={{ flex: 1 }}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
  },
  dialog: {
    backgroundColor: colors.card,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  title: {
    ...typography.heading3,
    color: colors.textPrimary,
    marginBottom: spacing.xs,
  },
  preview: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: spacing.md,
  },
  pickersContainer: {
    flexDirection: 'row',
    height: 180,
    width: '100%',
    justifyContent: 'space-between',
    marginBottom: spacing.lg,
  },
  column: {
    flex: 1,
    marginHorizontal: spacing.xs,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.xs,
  },
  columnHeader: {
    ...typography.caption,
    textAlign: 'center',
    color: colors.textSecondary,
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.cardBorder,
  },
  scrollList: {
    flex: 1,
  },
  item: {
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
    marginVertical: 2,
  },
  selectedItem: {
    backgroundColor: colors.primary,
  },
  itemText: {
    ...typography.bodyMedium,
    color: colors.textPrimary,
  },
  selectedItemText: {
    color: '#ffffff',
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    width: '100%',
  },
});
