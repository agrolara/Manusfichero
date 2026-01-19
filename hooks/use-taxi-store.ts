import { useCallback, useEffect, useReducer } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, MobileStats, QueueType, CarreraRecord } from '@/lib/types';

const STORAGE_KEY = 'full_express_state';

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

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'LOAD_STATE':
      return action.payload;

    case 'ADD_MOBILE': {
      const mobileId = action.payload;
      const newState = { ...state };

      // Crear stats del móvil si no existen
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

      // Agregar al final de las tres colas
      newState.colas.blanca.push(mobileId);
      newState.colas.azul.push(mobileId);
      newState.colas.roja.push(mobileId);

      return newState;
    }

    case 'ASSIGN_CARRERA': {
      const { mobileId, queueType, monto } = action.payload;
      const newState = { ...state };

      // Registrar carrera en historial
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

        // Incrementar contador por tipo
        if (queueType === 'blanca') newState.moviles[mobileId].blancas++;
        else if (queueType === 'azul') newState.moviles[mobileId].azules++;
        else if (queueType === 'roja') newState.moviles[mobileId].rojas++;

        // Actualizar total de caja
        newState.totalCaja += monto;

        // Resetear contador de cedes
        newState.moviles[mobileId].cedeCount = 0;

        // Reinsert al final de la cola
        const queue = newState.colas[queueType];
        const index = queue.indexOf(mobileId);
        if (index !== -1) {
          queue.splice(index, 1);
          queue.push(mobileId);
        }
      }

      return newState;
    }

    case 'CEDE_TURNO': {
      const { mobileId, queueType } = action.payload;
      const newState = { ...state };

      if (newState.moviles[mobileId]) {
        newState.moviles[mobileId].cedeCount++;

        if (newState.moviles[mobileId].cedeCount >= 3) {
          // Al tercer cede, enviar al final automáticamente
          const queue = newState.colas[queueType];
          const index = queue.indexOf(mobileId);
          if (index !== -1) {
            queue.splice(index, 1);
            queue.push(mobileId);
          }
          // Resetear contador para permitir cedes futuros
          newState.moviles[mobileId].cedeCount = 0;
        } else {
          // Reinsert al final
          const queue = newState.colas[queueType];
          const index = queue.indexOf(mobileId);
          if (index !== -1) {
            queue.splice(index, 1);
            queue.push(mobileId);
          }
        }
      }

      return newState;
    }

    case 'REMOVE_MOBILE': {
      const { mobileId } = action.payload;
      const newState = { ...state };

      // Remover de todas las colas
      newState.colas.blanca = newState.colas.blanca.filter(id => id !== mobileId);
      newState.colas.azul = newState.colas.azul.filter(id => id !== mobileId);
      newState.colas.roja = newState.colas.roja.filter(id => id !== mobileId);

      // Marcar como no en colas pero conservar stats
      if (newState.moviles[mobileId]) {
        newState.moviles[mobileId].enColas = false;
      }

      return newState;
    }

    case 'TOGGLE_CORRECTION_MODE': {
      return {
        ...state,
        correctionMode: !state.correctionMode,
      };
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
        const index = newState.moviles[mobileId].historial.findIndex(c => c.uid === uid);
        if (index !== -1) {
          const carrera = newState.moviles[mobileId].historial[index];
          newState.moviles[mobileId].totalMonto -= carrera.monto;
          newState.totalCaja -= carrera.monto;
          newState.moviles[mobileId].historial.splice(index, 1);

          // Decrementar contador por tipo
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

export function useTaxiStore() {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Cargar estado desde AsyncStorage al montar
  useEffect(() => {
    const loadState = async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          dispatch({ type: 'LOAD_STATE', payload: parsed });
        }
      } catch (error) {
        console.error('Error loading state:', error);
      }
    };

    loadState();
  }, []);

  // Guardar estado en AsyncStorage cuando cambia
  useEffect(() => {
    const saveState = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error('Error saving state:', error);
      }
    };

    saveState();
  }, [state]);

  const addMobile = useCallback((mobileId: string) => {
    dispatch({ type: 'ADD_MOBILE', payload: mobileId });
  }, []);

  const assignCarrera = useCallback((mobileId: string, queueType: QueueType, monto: number) => {
    dispatch({ type: 'ASSIGN_CARRERA', payload: { mobileId, queueType, monto } });
  }, []);

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

  const resetState = useCallback(() => {
    dispatch({ type: 'RESET_STATE' });
  }, []);

  return {
    state,
    addMobile,
    assignCarrera,
    cedeTurno,
    removeMobile,
    toggleCorrectionMode,
    editCarrera,
    deleteCarrera,
    resetState,
  };
}
