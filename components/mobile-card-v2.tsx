import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import { MobileStats, QueueType } from '@/lib/types';

interface MobileCardProps {
  mobile: MobileStats;
  queueType: QueueType;
  onOK: (mobileId: string, queueType: QueueType) => void;
  onCede: (mobileId: string, queueType: QueueType) => void;
  onRemove: (mobileId: string) => void;
  onViewHistory?: (mobileId: string) => void;
  correctionMode?: boolean;
}

const queueColors = {
  blanca: '#9CA3AF',
  azul: '#0a7ea4',
  roja: '#EF4444',
};

export function MobileCardV2({
  mobile,
  queueType,
  onOK,
  onCede,
  onRemove,
  onViewHistory,
  correctionMode = false,
}: MobileCardProps) {
  const colors = useColors();
  const borderColor = queueColors[queueType];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: borderColor,
          borderLeftWidth: 4,
        },
      ]}
    >
      {/* Header: ID y Monto */}
      <View style={styles.cardHeader}>
        <Text style={[styles.mobileId, { color: colors.foreground }]}>
          {mobile.id}
        </Text>
        <Text style={[styles.monto, { color: colors.primary }]}>
          ${mobile.totalMonto.toFixed(0)}
        </Text>
      </View>

      {/* Stats: B/A/R */}
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: colors.muted }]}>B</Text>
          <Text style={[styles.statValue, { color: colors.foreground }]}>
            {mobile.blancas}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: colors.muted }]}>A</Text>
          <Text style={[styles.statValue, { color: colors.foreground }]}>
            {mobile.azules}
          </Text>
        </View>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: colors.muted }]}>R</Text>
          <Text style={[styles.statValue, { color: colors.foreground }]}>
            {mobile.rojas}
          </Text>
        </View>
        {mobile.cedeCount > 0 && (
          <View style={[styles.cedeIndicator, { backgroundColor: colors.warning }]}>
            <Text style={[styles.cedeText, { color: colors.background }]}>
              {mobile.cedeCount}/3
            </Text>
          </View>
        )}
      </View>

      {/* Botones */}
      <View style={styles.buttonsRow}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.okButton,
            { backgroundColor: colors.success, opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={() => onOK(mobile.id, queueType)}
        >
          <Text style={[styles.buttonText, { color: colors.background }]}>OK</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.cedeButton,
            { backgroundColor: colors.warning, opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={() => onCede(mobile.id, queueType)}
        >
          <Text style={[styles.buttonText, { color: colors.background }]}>Cede</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.removeButton,
            { borderColor: colors.error, opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={() => onRemove(mobile.id)}
        >
          <Text style={[styles.buttonText, { color: colors.error }]}>Sal</Text>
        </Pressable>

        {correctionMode && onViewHistory && (
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.historyButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={() => onViewHistory(mobile.id)}
          >
            <Text style={[styles.buttonText, { color: colors.background }]}>H</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginBottom: 8,
    gap: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mobileId: {
    fontSize: 14,
    fontWeight: '700',
  },
  monto: {
    fontSize: 13,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
  },
  statValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  cedeIndicator: {
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  cedeText: {
    fontSize: 9,
    fontWeight: '700',
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  button: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0,
  },
  okButton: {},
  cedeButton: {},
  removeButton: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  historyButton: {},
  buttonText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
