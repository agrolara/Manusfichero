import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  FlatList,
} from 'react-native';
import { useColors } from '@/hooks/use-colors';
import { MobileStats } from '@/lib/types';

interface StatisticsScreenProps {
  mobiles: Record<string, MobileStats>;
  totalCaja: number;
  currentDate: string;
  onClose: () => void;
}

interface MobileStatRow {
  id: string;
  mobileId: string;
  blancas: number;
  azules: number;
  rojas: number;
  totalCarreras: number;
  totalMonto: number;
}

export function StatisticsScreen({
  mobiles,
  totalCaja,
  currentDate,
  onClose,
}: StatisticsScreenProps) {
  const colors = useColors();
  const [statRows, setStatRows] = useState<MobileStatRow[]>([]);

  useEffect(() => {
    const rows = Object.values(mobiles).map((mobile) => ({
      id: mobile.id,
      mobileId: mobile.id,
      blancas: mobile.blancas,
      azules: mobile.azules,
      rojas: mobile.rojas,
      totalCarreras: mobile.blancas + mobile.azules + mobile.rojas,
      totalMonto: mobile.totalMonto,
    }));
    setStatRows(rows);
  }, [mobiles]);

  const totals = {
    blancas: statRows.reduce((sum, row) => sum + row.blancas, 0),
    azules: statRows.reduce((sum, row) => sum + row.azules, 0),
    rojas: statRows.reduce((sum, row) => sum + row.rojas, 0),
    totalCarreras: statRows.reduce((sum, row) => sum + row.totalCarreras, 0),
  };

  const renderRow = ({ item }: { item: MobileStatRow }) => (
    <View
      style={[
        styles.tableRow,
        {
          backgroundColor: colors.surface,
          borderBottomColor: colors.border,
        },
      ]}
    >
      <Text style={[styles.cellMobile, { color: colors.foreground }]}>
        {item.mobileId}
      </Text>
      <Text style={[styles.cellNumber, { color: colors.muted }]}>
        {item.blancas}
      </Text>
      <Text style={[styles.cellNumber, { color: colors.muted }]}>
        {item.azules}
      </Text>
      <Text style={[styles.cellNumber, { color: colors.muted }]}>
        {item.rojas}
      </Text>
      <Text style={[styles.cellNumber, { color: colors.muted }]}>
        {item.totalCarreras}
      </Text>
      <Text style={[styles.cellMonto, { color: colors.primary }]}>
        ${item.totalMonto.toFixed(2)}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            Estadísticas del Día
          </Text>
          <Text style={[styles.headerDate, { color: colors.muted }]}>
            {currentDate}
          </Text>
        </View>
        <Pressable
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          onPress={onClose}
        >
          <Text style={[styles.closeButton, { color: colors.primary }]}>Cerrar</Text>
        </Pressable>
      </View>

      {/* Tabla */}
      <View style={styles.tableContainer}>
        {/* Header de tabla */}
        <View
          style={[
            styles.tableHeader,
            {
              backgroundColor: colors.primary,
            },
          ]}
        >
          <Text style={[styles.headerCell, { color: colors.background }]}>
            Móvil
          </Text>
          <Text style={[styles.headerCell, { color: colors.background }]}>
            B
          </Text>
          <Text style={[styles.headerCell, { color: colors.background }]}>
            A
          </Text>
          <Text style={[styles.headerCell, { color: colors.background }]}>
            R
          </Text>
          <Text style={[styles.headerCell, { color: colors.background }]}>
            Total
          </Text>
          <Text style={[styles.headerCell, { color: colors.background }]}>
            Monto
          </Text>
        </View>

        {/* Filas de datos */}
        <FlatList
          data={statRows}
          renderItem={renderRow}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={[styles.emptyText, { color: colors.muted }]}>
                Sin datos
              </Text>
            </View>
          }
        />

        {/* Fila de totales */}
        <View
          style={[
            styles.totalRow,
            {
              backgroundColor: colors.primary,
            },
          ]}
        >
          <Text style={[styles.totalCell, { color: colors.background }]}>
            TOTAL
          </Text>
          <Text style={[styles.totalCell, { color: colors.background }]}>
            {totals.blancas}
          </Text>
          <Text style={[styles.totalCell, { color: colors.background }]}>
            {totals.azules}
          </Text>
          <Text style={[styles.totalCell, { color: colors.background }]}>
            {totals.rojas}
          </Text>
          <Text style={[styles.totalCell, { color: colors.background }]}>
            {totals.totalCarreras}
          </Text>
          <Text style={[styles.totalCell, { color: colors.background }]}>
            ${totalCaja.toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Resumen */}
      <View
        style={[
          styles.summaryBox,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.muted }]}>
            Móviles Activos:
          </Text>
          <Text style={[styles.summaryValue, { color: colors.foreground }]}>
            {statRows.length}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.muted }]}>
            Total Carreras:
          </Text>
          <Text style={[styles.summaryValue, { color: colors.foreground }]}>
            {totals.totalCarreras}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.muted }]}>
            Caja Total:
          </Text>
          <Text style={[styles.summaryValue, { color: colors.primary }]}>
            ${totalCaja.toFixed(2)}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerDate: {
    fontSize: 12,
    marginTop: 4,
  },
  closeButton: {
    fontSize: 14,
    fontWeight: '600',
  },
  tableContainer: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 6,
    marginBottom: 4,
  },
  headerCell: {
    flex: 1,
    fontWeight: '600',
    fontSize: 11,
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  cellMobile: {
    flex: 1,
    fontWeight: '600',
    fontSize: 12,
  },
  cellNumber: {
    flex: 1,
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '500',
  },
  cellMonto: {
    flex: 1,
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '600',
  },
  emptyState: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    fontStyle: 'italic',
  },
  totalRow: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 10,
    borderRadius: 6,
    marginTop: 4,
  },
  totalCell: {
    flex: 1,
    fontWeight: '700',
    fontSize: 11,
    textAlign: 'center',
  },
  summaryBox: {
    marginHorizontal: 8,
    marginVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '600',
  },
});
