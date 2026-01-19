import React, { useState, useRef, useEffect } from 'react';
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
import { SimplePasswordModal } from '@/components/simple-password-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AdminPanel } from '@/components/admin-panel';
import { createUser } from '@/lib/supabase-users';

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
  const [refreshKey, setRefreshKey] = useState(0);
  const [showLoginModal, setShowLoginModal] = useState(true);
    const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  // Forzar re-render cuando cambia el estado
  useEffect(() => {
    setRefreshKey(prev => prev + 1);
  }, [state]);

  useEffect(() => {
    const loadUser = async () => {
      const user = await AsyncStorage.getItem('current_user');
      if (user) {
        setCurrentUser(user);
      } else {
        setShowLoginModal(true);
      }
    };
    loadUser();
  }, []);

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
      // Forzar actualización
      setRefreshKey(prev => prev + 1);
    }
  };

  const handleMontoCancel = () => {
    setModalState({ isOpen: false, mobileId: null, queueType: null });
    inputRef.current?.focus();
  };

  const handleCede = (mobileId: string, queueType: QueueType) => {
    cedeTurno(mobileId, queueType);
    inputRef.current?.focus();
    // Forzar actualización
    setRefreshKey(prev => prev + 1);
  };

  const handleRemove = (mobileId: string) => {
    removeMobile(mobileId);
    inputRef.current?.focus();
    // Forzar actualización
    setRefreshKey(prev => prev + 1);
  };

  const handleViewHistory = (mobileId: string) => {
    setHistoryMobileId(mobileId);
  };

  const handleEditCarrera = (uid: string, nuevoMonto: number) => {
    if (historyMobileId) {
      try {
        editCarrera(historyMobileId, uid, nuevoMonto);
        // Forzar actualización
        setRefreshKey(prev => prev + 1);
      } catch (error) {
        Alert.alert('Error', 'No se pudo editar el registro');
      }
    }
  };

  const handleDeleteCarrera = (uid: string) => {
    if (historyMobileId) {
      try {
        deleteCarrera(historyMobileId, uid);
        // Forzar actualización
        setRefreshKey(prev => prev + 1);
      } catch (error) {
        Alert.alert('Error', 'No se pudo eliminar el registro');
      }
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
            setRefreshKey(prev => prev + 1);
            inputRef.current?.focus();
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleLogin = async (password: string) => {
    await AsyncStorage.setItem('current_user', 'logged_in');
    setCurrentUser('logged_in');
    setShowLoginModal(false);
  };

  const handleLogout = async () => {
    Alert.alert('Cerrar Sesion', 'Deseas cerrar sesion?', [
      { text: 'Cancelar', onPress: () => {} },
      {
        text: 'Cerrar',
        onPress: async () => {
          try {
            await AsyncStorage.removeItem('current_user');
            setCurrentUser(null);
            setShowLoginModal(true);
            setRefreshKey(prev => prev + 1);
          } catch (error) {
            console.error('Error al cerrar sesion:', error);
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const handleAddUser = async (email: string, password: string) => {
    try {
      await createUser(email, password);
    } catch (error) {
      throw error;
    }
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
        key={`history-${historyMobileId}-${refreshKey}`}
        mobile={state.moviles[historyMobileId]}
        onEdit={handleEditCarrera}
        onDelete={handleDeleteCarrera}
        correctionMode={state.correctionMode}
        onClose={() => {
          setHistoryMobileId(null);
          setRefreshKey(prev => prev + 1);
        }}
      />
    );
  }

  return (
    <ScreenContainer className="flex-1">
      <ScrollView
        key={`main-${refreshKey}`}
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
              <Pressable
                style={({ pressed }) => [
                  styles.headerButton,
                  { backgroundColor: currentUser ? '#ef4444' : colors.primary, opacity: pressed ? 0.8 : 1 },
                ]}
                onPress={currentUser ? handleLogout : () => setShowLoginModal(true)}
              >
                <Text style={[styles.headerButtonText, { color: colors.background }]}>
                  {currentUser ? 'Salir' : 'Login'}
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Input y Controles */}
          <View style={[styles.inputSection, { backgroundColor: colors.surface }]}>
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
              onSubmitEditing={handleAddMobile}
              returnKeyType="done"
            />
            <Pressable
              style={({ pressed }) => [
                styles.addButton,
                { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
              ]}
              onPress={handleAddMobile}
            >
              <Text style={[styles.addButtonText, { color: colors.background }]}>+</Text>
            </Pressable>
          </View>

          {/* Controles */}
          <View style={[styles.controlsSection, { backgroundColor: colors.surface }]}>
            <View style={styles.controlRow}>
              <Text style={[styles.controlLabel, { color: colors.foreground }]}>
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
                { opacity: pressed ? 0.8 : 1 },
              ]}
              onPress={handleResetDay}
            >
              <Text style={[styles.resetButtonText, { color: colors.error }]}>Reset</Text>
            </Pressable>
          </View>

          {/* Colas */}
          <View style={styles.queuesContainer}>
            <QueueColumnV2
              key={`blanca-${refreshKey}`}
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
              key={`azul-${refreshKey}`}
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
              key={`roja-${refreshKey}`}
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

          {/* Footer */}
          <View style={[styles.footer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
            <View style={styles.footerItem}>
              <Text style={[styles.footerLabel, { color: colors.muted }]}>Caja</Text>
              <Text style={[styles.footerValue, { color: colors.primary }]}>
                ${state.totalCaja.toFixed(2)}
              </Text>
            </View>
            <View style={styles.footerItem}>
              <Text style={[styles.footerLabel, { color: colors.muted }]}>Moviles</Text>
              <Text style={[styles.footerValue, { color: colors.foreground }]}>
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
    
      <SimplePasswordModal
        isVisible={showLoginModal}
        onLogin={handleLogin}
      />

      <AdminPanel
        isVisible={showAdminPanel}
        onClose={() => setShowAdminPanel(false)}
        onAddUser={handleAddUser}
      />
</ScreenContainer>
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
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 11,
    marginTop: 2,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  headerButtonText: {
    fontSize: 12,
    fontWeight: '700',
  },
  inputSection: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    fontSize: 20,
    fontWeight: '700',
  },
  controlsSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlLabel: {
    fontSize: 12,
    fontWeight: '600',
  },
  resetButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#EF4444',
  },
  resetButtonText: {
    fontSize: 11,
    fontWeight: '700',
  },
  queuesContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  footerItem: {
    alignItems: 'center',
  },
  footerLabel: {
    fontSize: 11,
    fontWeight: '500',
  },
  footerValue: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
});
