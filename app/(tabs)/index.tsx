import React, { useRef, useState } from 'react';
import {
  ScrollView,
  Text,
  View,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  Switch,
  Dimensions,
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useTaxiStoreV2 } from '@/hooks/use-taxi-store-v2';
import { QueueColumnV2 } from '@/components/queue-column-v2';
import { MontoModal } from '@/components/monto-modal';
import { MobileHistoryScreen } from '@/components/mobile-history-screen';
import { StatisticsScreen } from '@/components/statistics-screen';
import { ReportsScreen } from '@/components/reports-screen';
import { useColors } from '@/hooks/use-colors';
import { QueueType, ModalState } from '@/lib/types';

export default function HomeScreen() {
  const colors = useColors();
  const screenWidth = Dimensions.get('window').width;
  const isMobile = screenWidth < 600;

  const {
    state,
    currentDate,
    addMobile,
    assignCarrera,
    cedeTurno,
    removeMobile,
    toggleCorrectionMode,
    editCarrera,
    deleteCarrera,
    resetDay,
    getAllDailyHistory,
  } = useTaxiStoreV2();

  const inputRef = useRef<TextInput>(null);
  const [mobileInput, setMobileInput] = useState('');
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    mobileId: null,
    queueType: null,
  });
  const [historyMobileId, setHistoryMobileId] = useState<string | null>(null);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showReports, setShowReports] = useState(false);

  const handleAddMobile = () => {
    const id = mobileInput.trim();
    if (id && /^\d+$/.test(id)) {
      const yaExiste =
        state.colas.blanca.includes(id) ||
        state.colas.azul.includes(id) ||
        state.colas.roja.includes(id);

      if (yaExiste) {
        Alert.alert('Aviso', 'Este movil ya esta en las colas');
      } else {
        addMobile(id);
      }
      setMobileInput('');
      inputRef.current?.focus();
    } else {
      Alert.alert('Error', 'Ingresa un ID numerico valido');
    }
  };

  const handleOK = (mobileId: string, queueType: QueueType) => {
    setModalState({
      isOpen: true,
      mobileId,
      queueType,
    });
  };

  const handleMontoConfirm = (monto: number) => {
    if (modalState.mobileId && modalState.queueType) {
      assignCarrera(modalState.mobileId, modalState.queueType, monto);
      setModalState({ isOpen: false, mobileId: null, queueType: null });
      inputRef.current?.focus();
    }
  };

  const handleMontoCancel = () => {
    setModalState({ isOpen: false, mobileId: null, queueType: null });
    inputRef.current?.focus();
  };

  const handleCede = (mobileId: string, queueType: QueueType) => {
    cedeTurno(mobileId, queueType);
    inputRef.current?.focus();
  };

  const handleRemove = (mobileId: string) => {
    removeMobile(mobileId);
    inputRef.current?.focus();
  };

  const handleViewHistory = (mobileId: string) => {
    setHistoryMobileId(mobileId);
  };

  const handleEditCarrera = (uid: string, nuevoMonto: number) => {
    if (historyMobileId) {
      editCarrera(historyMobileId, uid, nuevoMonto);
    }
  };

  const handleDeleteCarrera = (uid: string) => {
    if (historyMobileId) {
      deleteCarrera(historyMobileId, uid);
    }
  };

  const handleResetDay = () => {
    Alert.alert(
      'Reiniciar Dia',
      'Estas seguro de que deseas reiniciar el dia? Se guardaran los datos actuales.',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Reiniciar',
          onPress: () => {
            resetDay();
            setMobileInput('');
            inputRef.current?.focus();
          },
          style: 'destructive',
        },
      ]
    );
  };

  if (showReports) {
    return (
      <ReportsScreen
        getAllDailyHistory={getAllDailyHistory}
        onClose={() => setShowReports(false)}
      />
    );
  }

  if (showStatistics) {
    return (
      <StatisticsScreen
        mobiles={state.moviles}
        totalCaja={state.totalCaja}
        currentDate={currentDate}
        onClose={() => setShowStatistics(false)}
      />
    );
  }

  if (historyMobileId && state.moviles[historyMobileId]) {
    return (
      <MobileHistoryScreen
        mobile={state.moviles[historyMobileId]}
        onEdit={handleEditCarrera}
        onDelete={handleDeleteCarrera}
        correctionMode={state.correctionMode}
        onClose={() => setHistoryMobileId(null)}
      />
    );
  }

  return (
    <ScreenContainer className="flex-1">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: colors.surface }]}>
            <View>
              <Text style={[styles.title, { color: colors.foreground }]}>
                Full Express
              </Text>
              <Text style={[styles.subtitle, { color: colors.muted }]}>
                {currentDate}
              </Text>
            </View>
            <View style={styles.headerButtons}>
              <Pressable
                style={({ pressed }) => [
                  styles.headerButton,
                  { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
                ]}
                onPress={() => setShowStatistics(true)}
              >
                <Text style={[styles.headerButtonText, { color: colors.background }]}>
                  Stat
                </Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.headerButton,
                  { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
                ]}
                onPress={() => setShowReports(true)}
              >
                <Text style={[styles.headerButtonText, { color: colors.background }]}>
                  Rep
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Input y Controles */}
          <View style={styles.inputSection}>
            <View style={styles.inputRow}>
              <TextInput
                ref={inputRef}
                style={[
                  styles.input,
                  {
                    color: colors.foreground,
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                  },
                ]}
                placeholder="ID movil"
                placeholderTextColor={colors.muted}
                keyboardType="numeric"
                value={mobileInput}
                onChangeText={setMobileInput}
                returnKeyType="done"
                onSubmitEditing={handleAddMobile}
              />
              <Pressable
                style={({ pressed }) => [
                  styles.addButton,
                  {
                    backgroundColor: colors.primary,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
                onPress={handleAddMobile}
              >
                <Text style={[styles.addButtonText, { color: colors.background }]}>
                  +
                </Text>
              </Pressable>
            </View>

            {/* Controles */}
            <View style={styles.controlsRow}>
              <View style={styles.correctionToggle}>
                <Text style={[styles.toggleLabel, { color: colors.foreground }]}>
                  Corr
                </Text>
                <Switch
                  value={state.correctionMode}
                  onValueChange={toggleCorrectionMode}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor={state.correctionMode ? colors.primary : colors.muted}
                />
              </View>
              <Pressable
                style={({ pressed }) => [
                  styles.resetButton,
                  {
                    borderColor: colors.error,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
                onPress={handleResetDay}
              >
                <Text style={[styles.resetButtonText, { color: colors.error }]}>
                  Reset
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Colas - Expandidas */}
          <View style={styles.queuesContainer}>
            <QueueColumnV2
              key="blanca"
              queueType="blanca"
              mobileIds={state.colas.blanca}
              mobiles={state.moviles}
              onOK={handleOK}
              onCede={handleCede}
              onRemove={handleRemove}
              onViewHistory={handleViewHistory}
              correctionMode={state.correctionMode}
            />
            <QueueColumnV2
              key="azul"
              queueType="azul"
              mobileIds={state.colas.azul}
              mobiles={state.moviles}
              onOK={handleOK}
              onCede={handleCede}
              onRemove={handleRemove}
              onViewHistory={handleViewHistory}
              correctionMode={state.correctionMode}
            />
            <QueueColumnV2
              key="roja"
              queueType="roja"
              mobileIds={state.colas.roja}
              mobiles={state.moviles}
              onOK={handleOK}
              onCede={handleCede}
              onRemove={handleRemove}
              onViewHistory={handleViewHistory}
              correctionMode={state.correctionMode}
            />
          </View>

          {/* Resumen en footer */}
          <View
            style={[
              styles.footerSummary,
              {
                backgroundColor: colors.surface,
                borderTopColor: colors.border,
              },
            ]}
          >
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: colors.muted }]}>
                Caja
              </Text>
              <Text style={[styles.summaryValue, { color: colors.primary }]}>
                ${state.totalCaja.toFixed(0)}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={[styles.summaryLabel, { color: colors.muted }]}>
                Moviles
              </Text>
              <Text style={[styles.summaryValue, { color: colors.foreground }]}>
                {Object.keys(state.moviles).length}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Modal de Monto */}
      <MontoModal
        isOpen={modalState.isOpen}
        mobileId={modalState.mobileId}
        onConfirm={handleMontoConfirm}
        onCancel={handleMontoCancel}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 8,
  },
  header: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  headerButton: {
    width: 38,
    height: 38,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerButtonText: {
    fontSize: 10,
    fontWeight: '700',
  },
  inputSection: {
    gap: 8,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 6,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    fontWeight: '500',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 18,
    fontWeight: '700',
  },
  controlsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  correctionToggle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  toggleLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  resetButton: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetButtonText: {
    fontSize: 11,
    fontWeight: '600',
  },
  queuesContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 6,
    minHeight: 300,
  },
  footerSummary: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 10,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 2,
  },
  summaryDivider: {
    width: 1,
    height: 30,
  },
});
