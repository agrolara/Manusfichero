import { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
} from 'react-native';
import { useColors } from '@/hooks/use-colors';
import { DailyHistory } from '@/lib/types-extended';

interface MonthlyStatisticsScreenProps {
  getAllDailyHistory: () => Promise<DailyHistory>;
  onClose: () => void;
}

interface MonthlyData {
  date: string;
  totalCaja: number;
  totalCarreras: number;
}

export function MonthlyStatisticsScreen({
  getAllDailyHistory,
  onClose,
}: MonthlyStatisticsScreenProps) {
  const colors = useColors();
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [currentMonth, setCurrentMonth] = useState('');

  useEffect(() => {
    loadMonthlyData();
  }, []);

  const loadMonthlyData = async () => {
    try {
      const history = await getAllDailyHistory();
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      setCurrentMonth(`${year}-${month}`);

      const monthData: MonthlyData[] = [];

      Object.entries(history).forEach(([date, data]) => {
        if (date.startsWith(`${year}-${month}`)) {
          const totalCarreras = Object.values(data.state.moviles).reduce(
            (acc: number, m: any) => acc + m.blancas + m.azules + m.rojas,
            0
          );

          monthData.push({
            date,
            totalCaja: data.state.totalCaja,
            totalCarreras,
          });
        }
      });

      // Ordenar por fecha descendente
      monthData.sort((a, b) => b.date.localeCompare(a.date));
      setMonthlyData(monthData);
    } catch (error) {
      console.error('Error loading monthly data:', error);
    }
  };

  const totalMensual = monthlyData.reduce((sum, day) => sum + day.totalCaja, 0);
  const totalCarrerasMensual = monthlyData.reduce((sum, day) => sum + day.totalCarreras, 0);

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
            Estadísticas Mensuales
          </Text>
          <Text style={[styles.headerDate, { color: colors.muted }]}>
            {currentMonth}
          </Text>
        </View>
        <Pressable
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          onPress={onClose}
        >
          <Text style={[styles.closeButton, { color: colors.primary }]}>Cerrar</Text>
        </Pressable>
      </View>

      {/* Resumen Mensual */}
      <View style={[styles.summaryCard, { backgroundColor: colors.surface }]}>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.muted }]}>
            Total Caja Mensual:
          </Text>
          <Text style={[styles.summaryValue, { color: colors.primary }]}>
            ${totalMensual.toFixed(2)}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.muted }]}>
            Total Carreras:
          </Text>
          <Text style={[styles.summaryValue, { color: colors.foreground }]}>
            {totalCarrerasMensual}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.muted }]}>
            Días Trabajados:
          </Text>
          <Text style={[styles.summaryValue, { color: colors.foreground }]}>
            {monthlyData.length}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.muted }]}>
            Promedio Diario:
          </Text>
          <Text style={[styles.summaryValue, { color: colors.success }]}>
            ${monthlyData.length > 0 ? (totalMensual / monthlyData.length).toFixed(2) : '0.00'}
          </Text>
        </View>
      </View>

      {/* Tabla de Días */}
      <ScrollView style={styles.tableContainer}>
        <View
          style={[
            styles.tableHeader,
            {
              backgroundColor: colors.primary,
            },
          ]}
        >
          <Text style={[styles.headerCell, { color: colors.background, flex: 2 }]}>
            Fecha
          </Text>
          <Text style={[styles.headerCell, { color: colors.background, flex: 1 }]}>
            Carreras
          </Text>
          <Text style={[styles.headerCell, { color: colors.background, flex: 1 }]}>
            Caja
          </Text>
        </View>

        {monthlyData.map((day) => (
          <View
            key={day.date}
            style={[
              styles.tableRow,
              {
                backgroundColor: colors.surface,
                borderBottomColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.cellDate, { color: colors.foreground }]}>
              {day.date}
            </Text>
            <Text style={[styles.cellNumber, { color: colors.muted }]}>
              {day.totalCarreras}
            </Text>
            <Text style={[styles.cellMonto, { color: colors.primary }]}>
              ${day.totalCaja.toFixed(2)}
            </Text>
          </View>
        ))}
      </ScrollView>
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
    padding: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerDate: {
    fontSize: 14,
    marginTop: 4,
  },
  closeButton: {
    fontSize: 16,
    fontWeight: '600',
  },
  summaryCard: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  tableContainer: {
    flex: 1,
    margin: 16,
    marginTop: 0,
  },
  tableHeader: {
    flexDirection: 'row',
    padding: 12,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  headerCell: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
  },
  cellDate: {
    flex: 2,
    fontSize: 14,
  },
  cellNumber: {
    flex: 1,
    fontSize: 14,
    textAlign: 'center',
  },
  cellMonto: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'right',
  },
});
