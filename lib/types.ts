/**
 * Tipos principales para el sistema Full Express
 */

export type QueueType = 'blanca' | 'azul' | 'roja';

export interface CarreraRecord {
  uid: string; // timestamp único
  tipo: QueueType;
  monto: number;
  hora: string; // formato HH:MM:SS
  timestamp: number; // timestamp en ms para ordenamiento
}

export interface MobileStats {
  id: string;
  blancas: number;
  azules: number;
  rojas: number;
  totalMonto: number;
  historial: CarreraRecord[];
  cedeCount: number; // contador de cedes en la cola actual
  enColas: boolean; // si está actualmente en las colas
}

export interface QueueState {
  blanca: string[]; // array de IDs de móviles
  azul: string[];
  roja: string[];
}

export interface AppState {
  colas: QueueState;
  moviles: Record<string, MobileStats>; // key: ID del móvil
  totalCaja: number;
  correctionMode: boolean;
}

export interface ModalState {
  isOpen: boolean;
  mobileId: string | null;
  queueType: QueueType | null;
}
