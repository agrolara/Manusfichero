import { useEffect, useRef, useCallback } from 'react';
import { createClient } from '@supabase/supabase-js';
import { AppState } from '@/lib/types';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://okmzqnjvxrptqphzjnjq.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_jSJKMqyhm_hpZ4O-CnnmWg_8YbHJYU8';
const FIXED_USER_ID = '4c0ed019-874a-4fc4-ad88-7945338dbce8';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

interface RealtimeListenerOptions {
  onDataChange?: (data: AppState) => void;
  onConnectionChange?: (connected: boolean) => void;
  enabled?: boolean;
}

/**
 * Hook para escuchar cambios en tiempo real desde Supabase
 * Notifica cuando hay cambios en daily_data para sincronización instantánea
 */
export function useRealtimeListeners(options: RealtimeListenerOptions = {}) {
  const { onDataChange, onConnectionChange, enabled = true } = options;
  const subscriptionRef = useRef<any>(null);
  const isConnectedRef = useRef(true);

  // Función para procesar cambios
  const handleDataChange = useCallback(
    (payload: any) => {
      try {
        console.log('🔄 Real-time change received:', payload);

        if (payload.new) {
          const data = payload.new.data;
          if (data && onDataChange) {
            console.log('📥 Updating state from real-time listener');
            onDataChange(data);
          }
        }
      } catch (error) {
        console.error('❌ Error processing real-time change:', error);
      }
    },
    [onDataChange]
  );

  // Configurar listeners en tiempo real
  useEffect(() => {
    if (!enabled) {
      console.log('⏸️ Real-time listeners disabled');
      return;
    }

    console.log('🔌 Setting up real-time listeners...');

    // Crear canal para escuchar cambios
    const channel = supabase.channel(`daily_data_${FIXED_USER_ID}`, {
      config: {
        broadcast: { self: true },
      },
    });

    // Suscribirse a cambios en la tabla daily_data
    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'daily_data',
          filter: `user_id=eq.${FIXED_USER_ID}`,
        },
        handleDataChange
      )
      .subscribe((status: string) => {
        console.log('📡 Subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to real-time updates');
          isConnectedRef.current = true;
          if (onConnectionChange) {
            onConnectionChange(true);
          }
        } else if (status === 'CLOSED') {
          console.log('❌ Subscription closed');
          isConnectedRef.current = false;
          if (onConnectionChange) {
            onConnectionChange(false);
          }
        }
      });

    subscriptionRef.current = channel;

    // Limpiar al desmontar
    return () => {
      console.log('🧹 Cleaning up real-time listeners');
      if (subscriptionRef.current) {
        supabase.removeChannel(subscriptionRef.current);
      }
    };
  }, [enabled, handleDataChange, onConnectionChange]);

  // Función para verificar conexión
  const checkConnection = useCallback(async () => {
    try {
      const { error } = await supabase
        .from('daily_data')
        .select('*')
        .eq('user_id', FIXED_USER_ID)
        .limit(1);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('❌ Connection check failed:', error);
      return false;
    }
  }, []);

  // Función para forzar reconexión
  const reconnect = useCallback(async () => {
    console.log('🔄 Forcing reconnection...');
    if (subscriptionRef.current) {
      await supabase.removeChannel(subscriptionRef.current);
    }

    const channel = supabase.channel(`daily_data_${FIXED_USER_ID}`, {
      config: {
        broadcast: { self: true },
      },
    });

    channel
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'daily_data',
          filter: `user_id=eq.${FIXED_USER_ID}`,
        },
        handleDataChange
      )
      .subscribe();

    subscriptionRef.current = channel;
    console.log('✅ Reconnected to real-time updates');
  }, [handleDataChange]);

  return {
    isConnected: isConnectedRef.current,
    checkConnection,
    reconnect,
  };
}
