import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState, QueueType } from '@/lib/types';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://okmzqnjvxrptqphzjnjq.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_jSJKMqyhm_hpZ4O-CnnmWg_8YbHJYU8';
const FIXED_USER_ID = '4c0ed019-874a-4fc4-ad88-7945338dbce8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface QueueRecord {
  id: string;
  user_id: string;
  queue_type: string;
  mobile_id: string;
  position: number;
  total_amount: number;
  cede_count: number;
  created_at: string;
  updated_at: string;
}

interface CarreraRecord {
  id: string;
  user_id: string;
  mobile_id: string;
  queue_type: string;
  amount: number;
  timestamp: string;
  created_at: string;
}

export function useRealtimeStore() {
  const [state, setState] = useState<AppState>({
    colas: { blanca: [], azul: [], roja: [] },
    moviles: {},
    totalCaja: 0,
    correctionMode: false,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar datos iniciales de Supabase
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true);
        console.log('📡 Loading initial data from Supabase...');

        // Cargar colas
        const { data: queuesData, error: queuesError } = await supabase
          .from('queues')
          .select('*')
          .eq('user_id', FIXED_USER_ID)
          .order('position', { ascending: true });

        if (queuesError) throw queuesError;

        // Cargar carreras
        const { data: carrerasData, error: carrerasError } = await supabase
          .from('carreras')
          .select('*')
          .eq('user_id', FIXED_USER_ID);

        if (carrerasError) throw carrerasError;

        // Construir estado desde datos de Supabase
        const newState: AppState = {
          colas: { blanca: [], azul: [], roja: [] },
          moviles: {},
          totalCaja: 0,
          correctionMode: false,
        };

        // Agregar móviles a colas
        if (queuesData) {
          queuesData.forEach((queue: QueueRecord) => {
            const queueType = queue.queue_type as QueueType;
            if (!newState.colas[queueType].includes(queue.mobile_id)) {
              newState.colas[queueType].push(queue.mobile_id);
            }

            // Inicializar móvil si no existe
            if (!newState.moviles[queue.mobile_id]) {
              newState.moviles[queue.mobile_id] = {
                id: queue.mobile_id,
                blancas: 0,
                azules: 0,
                rojas: 0,
                totalMonto: 0,
                historial: [],
                cedeCount: queue.cede_count || 0,
                enColas: true,
              };
            }
          });
        }

        // Agregar carreras al historial
        if (carrerasData) {
          carrerasData.forEach((carrera: CarreraRecord) => {
            const mobile = newState.moviles[carrera.mobile_id];
            if (mobile) {
              mobile.historial.push({
                uid: carrera.id,
                tipo: carrera.queue_type as QueueType,
                monto: Number(carrera.amount),
                hora: new Date(carrera.timestamp).toLocaleTimeString('es-ES'),
              } as any);
              mobile.totalMonto += Number(carrera.amount);
              newState.totalCaja += Number(carrera.amount);

              if (carrera.queue_type === 'blanca') mobile.blancas++;
              else if (carrera.queue_type === 'azul') mobile.azules++;
              else if (carrera.queue_type === 'roja') mobile.rojas++;
            }
          });
        }

        setState(newState);
        console.log('✅ Initial data loaded from Supabase');
      } catch (err) {
        console.error('❌ Error loading initial data:', err);
        setError(err instanceof Error ? err.message : 'Error loading data');
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  // Suscribirse a cambios en tiempo real
  useEffect(() => {
    console.log('🔄 Setting up real-time subscriptions...');

    const queuesSubscription = supabase
      .channel('queues-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'queues',
          filter: `user_id=eq.${FIXED_USER_ID}`,
        },
        (payload: any) => {
          console.log('📡 Queue change received:', payload);
          // Recargar datos cuando hay cambios
          loadInitialData();
        }
      )
      .subscribe();

    const carrerasSubscription = supabase
      .channel('carreras-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'carreras',
          filter: `user_id=eq.${FIXED_USER_ID}`,
        },
        (payload: any) => {
          console.log('📡 Carrera change received:', payload);
          // Recargar datos cuando hay cambios
          loadInitialData();
        }
      )
      .subscribe();

    const loadInitialData = async () => {
      try {
        const { data: queuesData } = await supabase
          .from('queues')
          .select('*')
          .eq('user_id', FIXED_USER_ID)
          .order('position', { ascending: true });

        const { data: carrerasData } = await supabase
          .from('carreras')
          .select('*')
          .eq('user_id', FIXED_USER_ID);

        const newState: AppState = {
          colas: { blanca: [], azul: [], roja: [] },
          moviles: {},
          totalCaja: 0,
          correctionMode: false,
        };

        if (queuesData) {
          queuesData.forEach((queue: QueueRecord) => {
            const queueType = queue.queue_type as QueueType;
            if (!newState.colas[queueType].includes(queue.mobile_id)) {
              newState.colas[queueType].push(queue.mobile_id);
            }

            if (!newState.moviles[queue.mobile_id]) {
              newState.moviles[queue.mobile_id] = {
                id: queue.mobile_id,
                blancas: 0,
                azules: 0,
                rojas: 0,
                totalMonto: 0,
                historial: [],
                cedeCount: queue.cede_count || 0,
                enColas: true,
              };
            }
          });
        }

        if (carrerasData) {
          carrerasData.forEach((carrera: CarreraRecord) => {
            const mobile = newState.moviles[carrera.mobile_id];
            if (mobile) {
              mobile.historial.push({
                uid: carrera.id,
                tipo: carrera.queue_type as QueueType,
                monto: Number(carrera.amount),
                hora: new Date(carrera.timestamp).toLocaleTimeString('es-ES'),
              } as any);
              mobile.totalMonto += Number(carrera.amount);
              newState.totalCaja += Number(carrera.amount);

              if (carrera.queue_type === 'blanca') mobile.blancas++;
              else if (carrera.queue_type === 'azul') mobile.azules++;
              else if (carrera.queue_type === 'roja') mobile.rojas++;
            }
          });
        }

        setState(newState);
      } catch (err) {
        console.error('❌ Error in real-time update:', err);
      }
    };

    return () => {
      queuesSubscription.unsubscribe();
      carrerasSubscription.unsubscribe();
    };
  }, []);

  // Agregar móvil
  const addMobile = useCallback(async (mobileId: string) => {
    try {
      console.log('➕ Adding mobile:', mobileId);

      // Agregar a las tres colas
      for (const queueType of ['blanca', 'azul', 'roja'] as QueueType[]) {
        const { data: existingQueues } = await supabase
          .from('queues')
          .select('position')
          .eq('user_id', FIXED_USER_ID)
          .eq('queue_type', queueType)
          .order('position', { ascending: false })
          .limit(1);

        const nextPosition = (existingQueues?.[0]?.position || 0) + 1;

        await supabase.from('queues').insert({
          user_id: FIXED_USER_ID,
          queue_type: queueType,
          mobile_id: mobileId,
          position: nextPosition,
          total_amount: 0,
          cede_count: 0,
        });
      }

      console.log('✅ Mobile added successfully');
    } catch (err) {
      console.error('❌ Error adding mobile:', err);
      setError(err instanceof Error ? err.message : 'Error adding mobile');
    }
  }, []);

  // Asignar carrera
  const assignCarrera = useCallback(
    async (mobileId: string, queueType: QueueType, monto: number) => {
      try {
        console.log('🚖 Assigning carrera:', { mobileId, queueType, monto });

        // Insertar carrera
        await supabase.from('carreras').insert({
          user_id: FIXED_USER_ID,
          mobile_id: mobileId,
          queue_type: queueType,
          amount: monto,
          timestamp: new Date().toISOString(),
        });

        // Actualizar posición en la cola (mover al final)
        const { data: queues } = await supabase
          .from('queues')
          .select('position')
          .eq('user_id', FIXED_USER_ID)
          .eq('queue_type', queueType)
          .order('position', { ascending: false })
          .limit(1);

        const nextPosition = (queues?.[0]?.position || 0) + 1;

        await supabase
          .from('queues')
          .update({ position: nextPosition })
          .eq('user_id', FIXED_USER_ID)
          .eq('queue_type', queueType)
          .eq('mobile_id', mobileId);

        console.log('✅ Carrera assigned successfully');
      } catch (err) {
        console.error('❌ Error assigning carrera:', err);
        setError(err instanceof Error ? err.message : 'Error assigning carrera');
      }
    },
    []
  );

  // Ceder turno
  const cedeTurno = useCallback(async (mobileId: string, queueType: QueueType) => {
    try {
      console.log('🔄 Ceding turn:', { mobileId, queueType });

      // Incrementar cede_count
      const { data: queue } = await supabase
        .from('queues')
        .select('cede_count')
        .eq('user_id', FIXED_USER_ID)
        .eq('queue_type', queueType)
        .eq('mobile_id', mobileId)
        .single();

      const newCedeCount = (queue?.cede_count || 0) + 1;

      // Mover al final de la cola
      const { data: queues } = await supabase
        .from('queues')
        .select('position')
        .eq('user_id', FIXED_USER_ID)
        .eq('queue_type', queueType)
        .order('position', { ascending: false })
        .limit(1);

      const nextPosition = (queues?.[0]?.position || 0) + 1;

      await supabase
        .from('queues')
        .update({ position: nextPosition, cede_count: newCedeCount })
        .eq('user_id', FIXED_USER_ID)
        .eq('queue_type', queueType)
        .eq('mobile_id', mobileId);

      console.log('✅ Turn ceded successfully');
    } catch (err) {
      console.error('❌ Error ceding turn:', err);
      setError(err instanceof Error ? err.message : 'Error ceding turn');
    }
  }, []);

  // Salir de la cola
  const removeMobileFromQueue = useCallback(
    async (mobileId: string, queueType: QueueType) => {
      try {
        console.log('❌ Removing mobile from queue:', { mobileId, queueType });

        await supabase
          .from('queues')
          .delete()
          .eq('user_id', FIXED_USER_ID)
          .eq('queue_type', queueType)
          .eq('mobile_id', mobileId);

        console.log('✅ Mobile removed from queue');
      } catch (err) {
        console.error('❌ Error removing mobile:', err);
        setError(err instanceof Error ? err.message : 'Error removing mobile');
      }
    },
    []
  );

  return {
    state,
    loading,
    error,
    addMobile,
    assignCarrera,
    cedeTurno,
    removeMobileFromQueue,
  };
}
