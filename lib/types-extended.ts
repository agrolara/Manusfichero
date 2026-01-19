import { AppState } from './types';

export interface DailyData {
  date: string; // formato YYYY-MM-DD
  timestamp: number; // timestamp del día
  state: AppState;
}

export interface DailyHistory {
  [date: string]: DailyData;
}

export interface StatisticsData {
  mobileId: string;
  blancas: number;
  azules: number;
  rojas: number;
  totalMonto: number;
  totalCarreras: number;
}

export interface DailyStatistics {
  date: string;
  mobiles: Record<string, StatisticsData>;
  totalBlancas: number;
  totalAzules: number;
  totalRojas: number;
  totalMonto: number;
  totalCarreras: number;
  activeMobiles: number;
}
