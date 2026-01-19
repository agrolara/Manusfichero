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
import { DailyHistory } from '@/lib/types-extended';

interface ReportsScreenProps {
  getAllDailyHistory: () => Promise<DailyHistory>;
  onClose: () => void;
}

interface DailyReport {
  date: string;
  totalMonto: number;
  totalCarreras: number;
  activeMobiles: number;
}

export function ReportsScreen({ getAllDailyHistory, onClose }: ReportsScreenProps) {
  const colors = useColors();
  const [reportType, setReportType] = useState<'daily' | 'monthly'>('daily');
  const [dailyReports, setDailyReports] = useState<DailyReport[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDayData, setSelectedDayData] = useState<any>(null);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      const history = await getAllDailyHistory();
      const reports: DailyReport[] = Object.entries(history)
        .map(([date, data]) => {
          const mobiles = data.state.moviles;
          const totalCarreras = Object.values(mobiles).reduce(
            (sum, m) => sum + (m.blancas + m.azules + m.rojas),
            0
          );
          const activeMobiles = Object.values(mobiles).filter(m => m.enColas).length;

          return {
            date,
            totalMonto: data.state.totalCaja,
            totalCarreras,
            activeMobiles,
          };
        })
        .sort((a, b) => b.date.localeCompare(a.date));

      setDailyReports(reports);
    } catch (error) {
      console.error('Error loading reports:', error);
    }
  };

  const getMonthlyData = () => {
    const monthlyMap: Record<string, DailyReport> = {};

    dailyReports.forEach(report => {
      const [year, month] = report.date.split('-');
      const monthKey = `${year}-${month}`;

      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = {
          date: monthKey,
          totalMonto: 0,
          totalCarreras: 0,
          activeMobiles: 0,
        };
      }

      monthlyMap[monthKey].totalMonto += report.totalMonto;
      monthlyMap[monthKey].totalCarreras += report.totalCarreras;
    });

    return Object.values(monthlyMap).sort((a, b) => b.date.localeCompare(a.date));
  };

  const handleSelectDay = async (date: string) => {
    try {
      const history = await getAllDailyHistory();
      if (history[date]) {
        setSelectedDate(date);
        setSelectedDayData(history[date]);
      }
    } catch (error) {
      console.error('Error loading day data:', error);
    }
  };

  const renderDailyReport = ({ item }: { item: DailyReport }) => (
    <Pressable
      style={({ pressed }) => [
        styles.reportRow,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
      onPress={() => handleSelectDay(item.date)}
    >
      <View style={styles.reportDate}>
        <Text style={[styles.reportDateText, { color: colors.foreground }]}>
          {item.date}
        </Text>
      </View>
      <View style={styles.reportStats}>
        <View style={styles.statCell}>
          <Text style={[styles.statLabel, { color: colors.muted }]}>Carreras</Text>
          <Text style={[styles.statValue, { color: colors.foreground }]}>
            {item.totalCarreras}
          </Text>
        </View>
        <View style={styles.statCell}>
          <Text style={[styles.statLabel, { color: colors.muted }]}>Móviles</Text>
          <Text style={[styles.statValue, { color: colors.foreground }]}>
            {item.activeMobiles}
          </Text>
        </View>
        <View style={styles.statCell}>
          <Text style={[styles.statLabel, { color: colors.muted }]}>Total</Text>
          <Text style={[styles.statValue, { color: colors.primary }]}>
            ${item.totalMonto.toFixed(0)}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  const renderMonthlyReport = ({ item }: { item: DailyReport }) => (
    <View
      style={[
        styles.reportRow,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <View style={styles.reportDate}>
        <Text style={[styles.reportDateText, { color: colors.foreground }]}>
          {item.date}
        </Text>
      </View>
      <View style={styles.reportStats}>
        <View style={styles.statCell}>
          <Text style={[styles.statLabel, { color: colors.muted }]}>Carreras</Text>
          <Text style={[styles.statValue, { color: colors.foreground }]}>
            {item.totalCarreras}
          </Text>
        </View>
        <View style={styles.statCell}>
          <Text style={[styles.statLabel, { color: colors.muted }]}>Total</Text>
          <Text style={[styles.statValue, { color: colors.primary }]}>
            ${item.totalMonto.toFixed(0)}
          </Text>
        </View>
      </View>
    </View>
  );

  // Mostrar detalle de dia seleccionado
  if (selectedDayData && selectedDate) {
    const mobiles = selectedDayData.state.moviles;
    const mobilesList = Object.values(mobiles)
      .filter((m: any) => m.blancas + m.azules + m.rojas > 0)
      .sort((a: any, b: any) => b.totalMonto - a.totalMonto);

    return (
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View
          style={[
            styles.header,
            {
              backgroundColor: colors.surface,
              borderBottomColor: colors.border,
            },
          ]}
        >
          <Pressable onPress={() => setSelectedDayData(null)}>
            <Text style={[styles.backButton, { color: colors.primary }]}>← Volver</Text>
          </Pressable>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            {selectedDate}
          </Text>
          <Pressable onPress={onClose}>
            <Text style={[styles.closeButton, { color: colors.primary }]}>Cerrar</Text>
          </Pressable>
        </View>

        <ScrollView style={styles.scrollView}>
          <View style={styles.detailContent}>
            {mobilesList.map((mobile: any) => (
              <View
                key={mobile.id}
                style={[
                  styles.detailRow,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text style={[styles.detailMobile, { color: colors.foreground }]}>
                  {mobile.id}
                </Text>
                <View style={styles.detailStats}>
                  <Text style={[styles.detailStat, { color: colors.muted }]}>
                    B:{mobile.blancas}
                  </Text>
                  <Text style={[styles.detailStat, { color: colors.muted }]}>
                    A:{mobile.azules}
                  </Text>
                  <Text style={[styles.detailStat, { color: colors.muted }]}>
                    R:{mobile.rojas}
                  </Text>
                </View>
                <Text style={[styles.detailMonto, { color: colors.primary }]}>
                  ${mobile.totalMonto.toFixed(0)}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  const data = reportType === 'daily' ? dailyReports : getMonthlyData();

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
        <Text style={[styles.headerTitle, { color: colors.foreground }]}>Reportes</Text>
        <Pressable onPress={onClose}>
          <Text style={[styles.closeButton, { color: colors.primary }]}>Cerrar</Text>
        </Pressable>
      </View>

      {/* Tabs */}
      <View style={[styles.tabs, { borderBottomColor: colors.border }]}>
        <Pressable
          style={[
            styles.tab,
            reportType === 'daily' && {
              borderBottomColor: colors.primary,
              borderBottomWidth: 2,
            },
          ]}
          onPress={() => setReportType('daily')}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: reportType === 'daily' ? colors.primary : colors.muted,
              },
            ]}
          >
            Diarios
          </Text>
        </Pressable>
        <Pressable
          style={[
            styles.tab,
            reportType === 'monthly' && {
              borderBottomColor: colors.primary,
              borderBottomWidth: 2,
            },
          ]}
          onPress={() => setReportType('monthly')}
        >
          <Text
            style={[
              styles.tabText,
              {
                color: reportType === 'monthly' ? colors.primary : colors.muted,
              },
            ]}
          >
            Mensuales
          </Text>
        </Pressable>
      </View>

      {/* Lista de reportes */}
      <FlatList
        data={data}
        renderItem={reportType === 'daily' ? renderDailyReport : renderMonthlyReport}
        keyExtractor={(item) => item.date}
        contentContainerStyle={styles.listContent}
        scrollEnabled={true}
      />
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
  closeButton: {
    fontSize: 14,
    fontWeight: '600',
  },
  backButton: {
    fontSize: 14,
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 13,
    fontWeight: '600',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  reportRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 12,
  },
  reportDate: {
    minWidth: 90,
  },
  reportDateText: {
    fontSize: 13,
    fontWeight: '700',
  },
  reportStats: {
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  statValue: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  scrollView: {
    flex: 1,
  },
  detailContent: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 10,
  },
  detailMobile: {
    fontSize: 13,
    fontWeight: '700',
    minWidth: 50,
  },
  detailStats: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },
  detailStat: {
    fontSize: 11,
    fontWeight: '500',
  },
  detailMonto: {
    fontSize: 12,
    fontWeight: '700',
  },
});
