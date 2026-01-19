import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useColors } from '@/hooks/use-colors';
import { MobileStats } from '@/lib/types';

interface SummaryTableProps {
  mobiles: Record<string, MobileStats>;
  totalCaja: number;
}

export function SummaryTable({ mobiles, totalCaja }: SummaryTableProps) {
  const colors = useColors();

  const totalBlancas = Object.values(mobiles).reduce((sum, m) => sum + m.blancas, 0);
  const totalAzules = Object.values(mobiles).reduce((sum, m) => sum + m.azules, 0);
  const totalRojas = Object.values(mobiles).reduce((sum, m) => sum + m.rojas, 0);
  const totalCarreras = totalBlancas + totalAzules + totalRojas;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <Text style={[styles.title, { color: colors.foreground }]}>Resumen de Producción</Text>

      <View style={styles.table}>
        {/* Header */}
        <View
          style={[
            styles.row,
            styles.headerRow,
            {
              borderBottomColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.headerCell, { color: colors.foreground, flex: 1 }]}>
            Tipo
          </Text>
          <Text style={[styles.headerCell, { color: colors.foreground, flex: 1 }]}>
            Carreras
          </Text>
          <Text style={[styles.headerCell, { color: colors.foreground, flex: 1 }]}>
            Monto
          </Text>
        </View>

        {/* Blanca */}
        <View
          style={[
            styles.row,
            {
              borderBottomColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.cell, { color: colors.foreground, flex: 1 }]}>
            Blanca
          </Text>
          <Text style={[styles.cell, { color: colors.muted, flex: 1 }]}>
            {totalBlancas}
          </Text>
          <Text style={[styles.cell, { color: colors.muted, flex: 1 }]}>
            $
            {Object.values(mobiles)
              .reduce((sum, m) => {
                const blancasTotal = m.historial
                  .filter(h => h.tipo === 'blanca')
                  .reduce((s, h) => s + h.monto, 0);
                return sum + blancasTotal;
              }, 0)
              .toFixed(2)}
          </Text>
        </View>

        {/* Azul */}
        <View
          style={[
            styles.row,
            {
              borderBottomColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.cell, { color: colors.foreground, flex: 1 }]}>
            Azul
          </Text>
          <Text style={[styles.cell, { color: colors.muted, flex: 1 }]}>
            {totalAzules}
          </Text>
          <Text style={[styles.cell, { color: colors.muted, flex: 1 }]}>
            $
            {Object.values(mobiles)
              .reduce((sum, m) => {
                const azulesTotal = m.historial
                  .filter(h => h.tipo === 'azul')
                  .reduce((s, h) => s + h.monto, 0);
                return sum + azulesTotal;
              }, 0)
              .toFixed(2)}
          </Text>
        </View>

        {/* Roja */}
        <View
          style={[
            styles.row,
            {
              borderBottomColor: colors.border,
            },
          ]}
        >
          <Text style={[styles.cell, { color: colors.foreground, flex: 1 }]}>
            Roja
          </Text>
          <Text style={[styles.cell, { color: colors.muted, flex: 1 }]}>
            {totalRojas}
          </Text>
          <Text style={[styles.cell, { color: colors.muted, flex: 1 }]}>
            $
            {Object.values(mobiles)
              .reduce((sum, m) => {
                const rojasTotal = m.historial
                  .filter(h => h.tipo === 'roja')
                  .reduce((s, h) => s + h.monto, 0);
                return sum + rojasTotal;
              }, 0)
              .toFixed(2)}
          </Text>
        </View>

        {/* Total */}
        <View style={styles.row}>
          <Text style={[styles.totalCell, { color: colors.foreground, flex: 1 }]}>
            TOTAL
          </Text>
          <Text style={[styles.totalCell, { color: colors.foreground, flex: 1 }]}>
            {totalCarreras}
          </Text>
          <Text style={[styles.totalCell, { color: colors.foreground, flex: 1 }]}>
            ${totalCaja.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  table: {
    gap: 0,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  headerRow: {
    borderBottomWidth: 2,
    paddingVertical: 10,
  },
  headerCell: {
    fontWeight: '600',
    fontSize: 12,
  },
  cell: {
    fontSize: 12,
    fontWeight: '500',
  },
  totalCell: {
    fontSize: 12,
    fontWeight: '700',
  },
});
