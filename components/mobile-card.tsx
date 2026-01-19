import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { cn } from '@/lib/utils';
import { QueueType, MobileStats } from '@/lib/types';
import { useColors } from '@/hooks/use-colors';

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
  blanca: '#E5E7EB',
  azul: '#0a7ea4',
  roja: '#EF4444',
};

export function MobileCard({
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
          borderColor,
          backgroundColor: colors.surface,
        },
      ]}
    >
      {/* Header con ID y total */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.mobileId, { color: colors.foreground }]}>
            Móvil {mobile.id}
          </Text>
          <Text style={[styles.total, { color: colors.muted }]}>
            ${mobile.totalMonto.toFixed(2)}
          </Text>
        </View>
        <View style={styles.stats}>
          <Text style={[styles.stat, { color: colors.muted }]}>B:{mobile.blancas}</Text>
          <Text style={[styles.stat, { color: colors.muted }]}>A:{mobile.azules}</Text>
          <Text style={[styles.stat, { color: colors.muted }]}>R:{mobile.rojas}</Text>
        </View>
      </View>

      {/* Botones de acción */}
      <View style={styles.buttonRow}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.okButton,
            { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={() => onOK(mobile.id, queueType)}
        >
          <Text style={[styles.buttonText, { color: colors.background }]}>OK</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.cedeButton,
            { borderColor: colors.muted, opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={() => onCede(mobile.id, queueType)}
        >
          <Text style={[styles.buttonText, { color: colors.foreground }]}>
            Cede {mobile.cedeCount}/3
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.removeButton,
            { borderColor: colors.error, opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={() => onRemove(mobile.id)}
        >
          <Text style={[styles.buttonText, { color: colors.error }]}>Salida</Text>
        </Pressable>

        {correctionMode && onViewHistory && (
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.editButton,
              { borderColor: colors.warning, opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={() => onViewHistory(mobile.id)}
          >
            <Text style={[styles.buttonText, { color: colors.warning }]}>H</Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 2,
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    gap: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mobileId: {
    fontSize: 16,
    fontWeight: '600',
  },
  total: {
    fontSize: 12,
    marginTop: 2,
  },
  stats: {
    flexDirection: 'row',
    gap: 8,
  },
  stat: {
    fontSize: 12,
    fontWeight: '500',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 6,
  },
  button: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  okButton: {
    flex: 1.2,
  },
  cedeButton: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  removeButton: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  editButton: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
