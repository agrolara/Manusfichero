import { useEffect, useReducer, useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, MobileStats, QueueType, CarreraRecord } from '@/lib/types';
import { DailyData, DailyHistory } from '@/lib/types-extended';
import { syncDataToSupabase } from '@/lib/supabase-sync';
import { usePollingSync } from '@/hooks/use-polling-sync';

const STORAGE_KEY_DAILY = 'full_express_daily';
const STORAGE_KEY_CURRENT_DATE = 'full_express_current_date';

const initialState: AppState = {
  colas: {
    blanca: [],
    azul: [],
    roja: [],
  },
  moviles: {},
  totalCaja: 0,
  correctionMode: false,
};

type Action =
  | { type: 'LOAD_STATE'; payload: AppState }
  | { type: 'ADD_MOBILE'; payload: string }
  | { type: 'ASSIGN_CARRERA'; payload: { mobileId: string; queueType: QueueType; monto: number } }
  | { type: 'CEDE_TURNO'; payload: { mobileId: string; queueType: QueueType } }
  | { type: 'REMOVE_MOBILE'; payload: { mobileId: string } }
  | { type: 'TOGGLE_CORRECTION_MODE' }
  | { type: 'EDIT_CARRERA'; payload: { mobileId: string; uid: string; nuevoMonto: number } }
  | { type: 'DELETE_CARRERA'; payload: { mobileId: string; uid: string } }
  | { type: 'RESET_STATE' };

function generateUID(): string {
  return Date.now().toString();
}

function getCurrentTime(): string {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${seconds}`;
}

function getCurrentDate(): string {
  // Usar zona horaria de Santiago de Chile (GMT-3)
  const now = new Date();
  // Usar Intl.DateTimeFormat para obtener la fecha en zona horaria de Chile
  const formatter = new Intl.DateTimeFormat('es-CL', {
    timeZone: 'America/Santiago',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const parts = formatter.formatToParts(now);
  const year = parts.find(p => p.type === 'year')?.value || '2026';
  const month = parts.find(p => p.type === 'month')?.value || '01';
  const day = parts.find(p => p.type === 'day')?.value || '01';
  return `${year}-${month}-${day}`;
}

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload;

    case 'ADD_MOBILE': {
      const mobileId = action.payload;
      const newState = { ...state };

      const isDuplicate =
        newState.colas.blanca.includes(mobileId) ||
        newState.colas.azul.includes(mobileId) ||
        newState.colas.roja.includes(mobileId);

      if (isDuplicate) {
        return state;
      }

      if (!newState.moviles[mobileId]) {
        newState.moviles[mobileId] = {
          id: mobileId,
          blancas: 0,
          azules: 0,
          rojas: 0,
          totalMonto: 0,
          historial: [],
          cedeCount: 0,
          enColas: true,
        };
      }

      newState.colas.blanca.push(mobileId);
      newState.colas.azul.push(mobileId);
      newState.colas.roja.push(mobileId);

      return newState;
    }

    case 'ASSIGN_CARRERA': {
      const { mobileId, queueType, monto } = action.payload;
      const newState = { ...state };

      const uid = generateUID();
      const record: CarreraRecord = {
        uid,
        tipo: queueType,
        monto,
        hora: getCurrentTime(),
        timestamp: Date.now(),
      };

      if (newState.moviles[mobileId]) {
        newState.moviles[mobileId].historial.push(record);
        newState.moviles[mobileId].totalMonto += monto;
        newState.totalCaja += monto;

        if (queueType === 'blanca') newState.moviles[mobileId].blancas++;
        else if (queueType === 'azul') newState.moviles[mobileId].azules++;
        else if (queueType === 'roja') newState.moviles[mobileId].rojas++;

        const queueArray = newState.colas[queueType];
        const index = queueArray.indexOf(mobileId);
        if (index !== -1) {
          queueArray.splice(index, 1);
          queueArray.push(mobileId);
        }
      }

      return newState;
    }

    case 'CEDE_TURNO': {
      const { mobileId, queueType } = action.payload;
      const newState = { ...state };

      if (newState.moviles[mobileId]) {
        newState.moviles[mobileId].cedeCount++;

        const queueArray = newState.colas[queueType];
        const index = queueArray.indexOf(mobileId);
        if (index !== -1) {
          queueArray.splice(index, 1);
          queueArray.push(mobileId);
        }
      }

      return newState;
    }

    case 'REMOVE_MOBILE': {
      const mobileId = action.payload.mobileId;
      const newState = { ...state };

      newState.colas.blanca = newState.colas.blanca.filter(id => id !== mobileId);
      newState.colas.azul = newState.colas.azul.filter(id => id !== mobileId);
      newState.colas.roja = newState.colas.roja.filter(id => id !== mobileId);

      return newState;
    }

    case 'TOGGLE_CORRECTION_MODE': {
      const newState = { ...state };
      newState.correctionMode = !newState.correctionMode;
      return newState;
    }

    case 'EDIT_CARRERA': {
      const { mobileId, uid, nuevoMonto } = action.payload;
      const newState = { ...state };

      if (newState.moviles[mobileId]) {
        const carrera = newState.moviles[mobileId].historial.find(c => c.uid === uid);
        if (carrera) {
          const diferencia = nuevoMonto - carrera.monto;
          carrera.monto = nuevoMonto;
          newState.moviles[mobileId].totalMonto += diferencia;
          newState.totalCaja += diferencia;
        }
      }

      return newState;
    }

    case 'DELETE_CARRERA': {
      const { mobileId, uid } = action.payload;
      const newState = { ...state };

      if (newState.moviles[mobileId]) {
        const carreraIndex = newState.moviles[mobileId].historial.findIndex(c => c.uid === uid);
        if (carreraIndex !== -1) {
          const carrera = newState.moviles[mobileId].historial[carreraIndex];
          newState.moviles[mobileId].historial.splice(carreraIndex, 1);
          newState.moviles[mobileId].totalMonto -= carrera.monto;
          newState.totalCaja -= carrera.monto;

          if (carrera.tipo === 'blanca') newState.moviles[mobileId].blancas--;
          else if (carrera.tipo === 'azul') newState.moviles[mobileId].azules--;
          else if (carrera.tipo === 'roja') newState.moviles[mobileId].rojas--;
        }
      }

      return newState;
    }

    case 'RESET_STATE':
      return initialState;

    default:
      return state;
  }
}

/**
 * Hook híbrido que combina AsyncStorage (local) con sincronización a Supabase
 * - Los datos se guardan localmente en AsyncStorage para velocidad
 * - Se sincronizan automáticamente a Supabase en la nube
 * - Funciona offline y sincroniza cuando hay conexión
 */
export function useTaxiStoreHybrid() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [currentDate, setCurrentDate] = useState(getCurrentDate());
  const [syncing, setSyncing] = useState(false);
  const [realtimeConnected, setRealtimeConnected] = useState(false);

  // Configurar polling para sincronización desde Supabase
  usePollingSync({
    currentDate,
    onDataChange: (remoteData: AppState) => {
      console.log('🔄 Remote data received from Supabase');
      dispatch({ type: 'LOAD_STATE', payload: remoteData });
    },
    onConnectionChange: (connected: boolean) => {
      console.log('📡 Supabase connection:', connected ? 'Connected' : 'Disconnected');
      setRealtimeConnected(connected);
    },
    enabled: true,
    intervalMs: 2000, // Verificar cambios cada 2 segundos
  });

  // Cargar estado del día actual al montar
  useEffect(() => {
    const loadDailyState = async () => {
      try {
        const today = getCurrentDate();
        const dailyHistory = await AsyncStorage.getItem(STORAGE_KEY_DAILY);
        const lastDate = await AsyncStorage.getItem(STORAGE_KEY_CURRENT_DATE);

        // Si cambió el día, guardar el anterior y limpiar
        if (lastDate && lastDate !== today) {
          if (dailyHistory) {
            const history: DailyHistory = JSON.parse(dailyHistory);
            // Limpiar datos mayores a 30 días
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            const cutoffDate = thirtyDaysAgo.toISOString().split('T')[0];

            Object.keys(history).forEach(date => {
              if (date < cutoffDate) {
                delete history[date];
              }
            });

            await AsyncStorage.setItem(STORAGE_KEY_DAILY, JSON.stringify(history));
          }
          // Reiniciar estado para nuevo día
          dispatch({ type: 'RESET_STATE' });
        } else if (dailyHistory) {
          // Cargar estado del día actual
          const history: DailyHistory = JSON.parse(dailyHistory);
          if (history[today]) {
            dispatch({ type: 'LOAD_STATE', payload: history[today].state });
          }
        }

        await AsyncStorage.setItem(STORAGE_KEY_CURRENT_DATE, today);
        setCurrentDate(today);
      } catch (error) {
        console.error('Error loading daily state:', error);
      }
    };

    loadDailyState();
  }, []);

  // Guardar estado en AsyncStorage cuando cambia y sincronizar a Supabase
  useEffect(() => {
    const saveDailyState = async () => {
      try {
        const today = getCurrentDate();
        const dailyHistory = await AsyncStorage.getItem(STORAGE_KEY_DAILY);
        const history: DailyHistory = dailyHistory ? JSON.parse(dailyHistory) : {};

        history[today] = {
          date: today,
          timestamp: Date.now(),
          state: state,
        };

        await AsyncStorage.setItem(STORAGE_KEY_DAILY, JSON.stringify(history));
        console.log('✅ Daily state saved to AsyncStorage');

        // Sincronizar a Supabase en background
        setSyncing(true);
        try {
          console.log('🔄 Syncing to Supabase...');
          await syncDataToSupabase({
            date: today,
            state: state,
          });
          console.log('✅ Synced to Supabase');
        } catch (error) {
          console.warn('⚠️ Error syncing to Supabase (will retry):', error);
        } finally {
          setSyncing(false);
        }
      } catch (error) {
        console.error('Error saving daily state:', error);
      }
    };

    saveDailyState();
  }, [state]);

  const addMobile = useCallback((mobileId: string) => {
    if (!mobileId || !/^\d+$/.test(mobileId)) {
      console.warn('Invalid mobile ID');
      return;
    }
    dispatch({ type: 'ADD_MOBILE', payload: mobileId });
  }, []);

  const assignCarrera = useCallback(
    (mobileId: string, queueType: QueueType, monto: number) => {
      dispatch({ type: 'ASSIGN_CARRERA', payload: { mobileId, queueType, monto } });
    },
    []
  );

  const cedeTurno = useCallback((mobileId: string, queueType: QueueType) => {
    dispatch({ type: 'CEDE_TURNO', payload: { mobileId, queueType } });
  }, []);

  const removeMobile = useCallback((mobileId: string) => {
    dispatch({ type: 'REMOVE_MOBILE', payload: { mobileId } });
  }, []);

  const toggleCorrectionMode = useCallback(() => {
    dispatch({ type: 'TOGGLE_CORRECTION_MODE' });
  }, []);

  const editCarrera = useCallback((mobileId: string, uid: string, nuevoMonto: number) => {
    dispatch({ type: 'EDIT_CARRERA', payload: { mobileId, uid, nuevoMonto } });
  }, []);

  const deleteCarrera = useCallback((mobileId: string, uid: string) => {
    dispatch({ type: 'DELETE_CARRERA', payload: { mobileId, uid } });
  }, []);

  const resetDay = useCallback(() => {
    dispatch({ type: 'RESET_STATE' });
  }, []);

  const getAllDailyHistory = useCallback(async () => {
    try {
      const dailyHistory = await AsyncStorage.getItem(STORAGE_KEY_DAILY);
      return dailyHistory ? JSON.parse(dailyHistory) : {};
    } catch (error) {
      console.error('Error getting daily history:', error);
      return {};
    }
  }, []);

  return {
    state,
    currentDate,
    syncing,
    realtimeConnected,
    addMobile,
    assignCarrera,
    cedeTurno,
    removeMobile,
    toggleCorrectionMode,
    editCarrera,
    deleteCarrera,
    resetDay,
    getAllDailyHistory,
  };
}
