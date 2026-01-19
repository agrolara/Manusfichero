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
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useTaxiStore } from '@/hooks/use-taxi-store';
import { QueueColumn } from '@/components/queue-column';
import { MontoModal } from '@/components/monto-modal';
import { SummaryTable } from '@/components/summary-table';
import { MobileHistoryScreen } from '@/components/mobile-history-screen';
import { useColors } from '@/hooks/use-colors';
import { QueueType, ModalState } from '@/lib/types';

export default function HomeScreen() {
  const colors = useColors();
  const {
    state,
    addMobile,
    assignCarrera,
    cedeTurno,
    removeMobile,
    toggleCorrectionMode,
    editCarrera,
    deleteCarrera,
  } = useTaxiStore();

  const inputRef = useRef<TextInput>(null);
  const [mobileInput, setMobileInput] = useState('');
  const [modalState, setModalState] = useState<ModalState>({
    isOpen: false,
    mobileId: null,
    queueType: null,
  });
  const [historyMobileId, setHistoryMobileId] = useState<string | null>(null);

  const handleAddMobile = () => {
    const id = mobileInput.trim();
    if (id && /^\d+$/.test(id)) {
      addMobile(id);
      setMobileInput('');
      inputRef.current?.focus();
    } else {
      Alert.alert('Error', 'Ingresa un ID numérico válido');
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
        <View style={styles.container}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: colors.surface }]}>
            <Text style={[styles.title, { color: colors.foreground }]}>
              Full Express
            </Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>
              Sistema de Gestión de Taxis
            </Text>
          </View>

          {/* Input y Toggle */}
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
                placeholder="Ingresa ID de móvil"
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

            {/* Toggle Correction Mode */}
            <View style={styles.correctionToggle}>
              <Text style={[styles.toggleLabel, { color: colors.foreground }]}>
                Modo Corrección
              </Text>
              <Switch
                value={state.correctionMode}
                onValueChange={toggleCorrectionMode}
                trackColor={{ false: colors.border, true: colors.primary }}
                thumbColor={state.correctionMode ? colors.primary : colors.muted}
              />
            </View>
          </View>

          {/* Colas */}
          <View style={styles.queuesContainer}>
            <QueueColumn
              queueType="blanca"
              mobileIds={state.colas.blanca}
              mobiles={state.moviles}
              onOK={handleOK}
              onCede={handleCede}
              onRemove={handleRemove}
              onViewHistory={handleViewHistory}
              correctionMode={state.correctionMode}
            />
            <QueueColumn
              queueType="azul"
              mobileIds={state.colas.azul}
              mobiles={state.moviles}
              onOK={handleOK}
              onCede={handleCede}
              onRemove={handleRemove}
              onViewHistory={handleViewHistory}
              correctionMode={state.correctionMode}
            />
            <QueueColumn
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

          {/* Resumen */}
          <View style={styles.summaryContainer}>
            <SummaryTable mobiles={state.moviles} totalCaja={state.totalCaja} />
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
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 12,
  },
  header: {
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  inputSection: {
    gap: 12,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 20,
    fontWeight: '700',
  },
  correctionToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  toggleLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  queuesContainer: {
    flexDirection: 'row',
    gap: 8,
    height: 300,
  },
  summaryContainer: {
    marginTop: 8,
    marginBottom: 12,
  },
});
