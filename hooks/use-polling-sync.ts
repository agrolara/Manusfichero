import { useEffect, useRef } from 'react';
import { getDataFromSupabase } from '@/lib/supabase-sync';
import { AppState } from '@/lib/types';

interface UsePollingSync {
  currentDate: string;
  onDataChange?: (remoteData: AppState) => void;
  onConnectionChange?: (connected: boolean) => void;
  enabled?: boolean;
  intervalMs?: number;
}

/**
 * Hook que sincroniza datos desde Supabase usando polling
 * Verifica cambios cada N segundos y actualiza el estado si hay cambios
 */
export function usePollingSync({
  currentDate,
  onDataChange,
  onConnectionChange,
  enabled = true,
  intervalMs = 2000, // Verificar cada 2 segundos
}: UsePollingSync) {
  const pollingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastDataRef = useRef<string>('');
  const isConnectedRef = useRef<boolean>(true);

  useEffect(() => {
    if (!enabled) {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
      return;
    }

    const pollData = async () => {
      try {
        console.log('🔄 Polling Supabase for changes...');
        const remoteData = await getDataFromSupabase(currentDate);

        if (remoteData && remoteData.length > 0) {
          const latestRecord = remoteData[0];
          const remoteState = latestRecord.data;
          const remoteDataString = JSON.stringify(remoteState);

          // Si los datos cambiaron, notificar
          if (remoteDataString !== lastDataRef.current) {
            console.log('📥 Remote data changed, updating local state');
            lastDataRef.current = remoteDataString;
            onDataChange?.(remoteState);
          }

          // Si estábamos desconectados, notificar reconexión
          if (!isConnectedRef.current) {
            console.log('✅ Reconnected to Supabase');
            isConnectedRef.current = true;
            onConnectionChange?.(true);
          }
        }
      } catch (error) {
        console.error('❌ Error polling Supabase:', error);
        
        // Si estábamos conectados, notificar desconexión
        if (isConnectedRef.current) {
          console.log('❌ Disconnected from Supabase');
          isConnectedRef.current = false;
          onConnectionChange?.(false);
        }
      }
    };

    // Hacer polling inmediatamente y luego cada N segundos
    pollData();
    pollingIntervalRef.current = setInterval(pollData, intervalMs);

    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, [currentDate, enabled, intervalMs, onDataChange, onConnectionChange]);
}
