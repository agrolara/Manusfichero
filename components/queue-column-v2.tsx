import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { MobileCardV2 } from './mobile-card-v2';
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
  blanca: 'Blanca',
  azul: 'Azul',
  roja: 'Roja',
};

const queueColors = {
  blanca: '#9CA3AF',
  azul: '#0a7ea4',
  roja: '#EF4444',
};

export function QueueColumnV2({
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
    <View style={[styles.container, { flex: 1 }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: borderColor,
          },
        ]}
      >
        <Text style={[styles.title, { color: colors.background }]}>
          {queueTitles[queueType]}
        </Text>
        <Text style={[styles.count, { color: colors.background }]}>
          ({mobileIds.length})
        </Text>
      </View>

      {/* Lista de móviles */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
      >
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
              <MobileCardV2
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
  container: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 4,
  },
  title: {
    fontSize: 12,
    fontWeight: '700',
  },
  count: {
    fontSize: 11,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
});
