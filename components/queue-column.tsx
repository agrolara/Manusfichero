import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { MobileCard } from './mobile-card';
import { QueueType, MobileStats } from '@/lib/types';
import { useColors } from '@/hooks/use-colors';

interface QueueColumnProps {
  queueType: QueueType;
  mobileIds: string[];
  mobiles: Record<string, MobileStats>;
  onOK: (mobileId: string, queueType: QueueType) => void;
  onCede: (mobileId: string, queueType: QueueType) => void;
  onRemove: (mobileId: string) => void;
  onViewHistory?: (mobileId: string) => void;
  correctionMode?: boolean;
}

const queueTitles = {
  blanca: 'Cola Blanca (Local)',
  azul: 'Cola Azul (Media)',
  roja: 'Cola Roja (Larga)',
};

const queueColors = {
  blanca: '#E5E7EB',
  azul: '#0a7ea4',
  roja: '#EF4444',
};

export function QueueColumn({
  queueType,
  mobileIds,
  mobiles,
  onOK,
  onCede,
  onRemove,
  onViewHistory,
  correctionMode = false,
}: QueueColumnProps) {
  const colors = useColors();
  const borderColor = queueColors[queueType];

  return (
    <View style={styles.column}>
      <View
        style={[
          styles.header,
          {
            borderBottomColor: borderColor,
            backgroundColor: colors.surface,
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.foreground }]}>
          {queueTitles[queueType]}
        </Text>
        <Text style={[styles.count, { color: colors.muted }]}>
          ({mobileIds.length})
        </Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {mobileIds.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              Vacío
            </Text>
          </View>
        ) : (
          mobileIds.map((mobileId) => {
            const mobile = mobiles[mobileId];
            if (!mobile) return null;

            return (
              <MobileCard
                key={`${queueType}-${mobileId}`}
                mobile={mobile}
                queueType={queueType}
                onOK={onOK}
                onCede={onCede}
                onRemove={onRemove}
                onViewHistory={onViewHistory}
                correctionMode={correctionMode}
              />
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  column: {
    flex: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    borderBottomWidth: 2,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
  },
  count: {
    fontSize: 12,
    fontWeight: '500',
  },
  content: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
});
