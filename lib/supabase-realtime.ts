const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

interface RealtimeMessage {
  type: 'INSERT' | 'UPDATE' | 'DELETE';
  table: string;
  record: any;
  old_record?: any;
}

interface RealtimeSubscription {
  unsubscribe: () => void;
}

let realtimeSocket: WebSocket | null = null;
let subscriptions: Map<string, (message: RealtimeMessage) => void> = new Map();

export function initializeRealtime(accessToken: string): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        throw new Error('Supabase credentials not configured');
      }

      // Convertir URL de HTTPS a WSS
      const wsUrl = SUPABASE_URL.replace('https://', 'wss://').replace('http://', 'ws://');
      const socketUrl = `${wsUrl}/realtime/v1/websocket?apikey=${SUPABASE_ANON_KEY}&access_token=${accessToken}`;

      realtimeSocket = new WebSocket(socketUrl);

      realtimeSocket.onopen = () => {
        console.log('Realtime connection established');
        resolve();
      };

      realtimeSocket.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          // Procesar cambios en la base de datos
          if (message.event === 'database' && message.payload) {
            const payload = message.payload;
            
            subscriptions.forEach((callback) => {
              callback({
                type: payload.type,
                table: payload.schema,
                record: payload.new_record || payload.record,
                old_record: payload.old_record,
              });
            });
          }
        } catch (error) {
          console.error('Error processing realtime message:', error);
        }
      };

      realtimeSocket.onerror = (error) => {
        console.error('Realtime connection error:', error);
        reject(error);
      };

      realtimeSocket.onclose = () => {
        console.log('Realtime connection closed');
        realtimeSocket = null;
      };
    } catch (error) {
      reject(error);
    }
  });
}

export function subscribeToTable(
  table: string,
  callback: (message: RealtimeMessage) => void
): RealtimeSubscription {
  const subscriptionId = `${table}-${Date.now()}`;
  subscriptions.set(subscriptionId, callback);

  // Enviar suscripción al servidor
  if (realtimeSocket && realtimeSocket.readyState === WebSocket.OPEN) {
    realtimeSocket.send(
      JSON.stringify({
        type: 'subscribe',
        event: 'database',
        schema: table,
      })
    );
  }

  return {
    unsubscribe: () => {
      subscriptions.delete(subscriptionId);
    },
  };
}

export function closeRealtime(): void {
  if (realtimeSocket) {
    realtimeSocket.close();
    realtimeSocket = null;
  }
  subscriptions.clear();
}

// Hook para usar en componentes
export function useRealtimeSubscription(
  table: string,
  callback: (message: RealtimeMessage) => void
) {
  const subscription = subscribeToTable(table, callback);

  return () => {
    subscription.unsubscribe();
  };
}
