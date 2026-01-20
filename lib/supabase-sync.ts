import { AppState } from '@/lib/types';

const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || 'https://okmzqnjvxrptqphzjnjq.supabase.co';
const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'sb_publishable_jSJKMqyhm_hpZ4O-CnnmWg_8YbHJYU8';

// User ID for the single password authentication
const FIXED_USER_ID = '4c0ed019-874a-4fc4-ad88-7945338dbce8';

interface DailyDataPayload {
  date: string;
  user_id: string;
  total_caja: number;
  total_carreras: number;
  data: any;
  created_at?: string;
  updated_at?: string;
}

/**
 * Sincroniza los datos diarios a Supabase
 * Actualiza si existe un registro para la fecha, crea uno nuevo si no existe
 * NO sobrescribe datos existentes con datos vacios (proteccion contra reset accidental)
 */
export async function syncDataToSupabase(dailyData: any) {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.warn('Supabase credentials not configured');
      return false;
    }

    console.log('Starting sync to Supabase...', { date: dailyData.date });

    const state: AppState = dailyData.state;
    
    // Calculate totals
    const totalCaja = state.totalCaja || 0;
    const totalCarreras = Object.values(state.moviles || {}).reduce((sum: number, mobile: any) => {
      return sum + (mobile.historial?.length || 0);
    }, 0);

    console.log('Calculated totals:', { totalCaja, totalCarreras });

    // PROTECCION: Si los datos estan vacios, NO sincronizar
    // Esto previene que el reset accidental sobrescriba datos en Supabase
    if (totalCaja === 0 && totalCarreras === 0) {
      console.log('Skipping sync: data is empty (likely after reset or new day)');
      return true; // Retornar true para no marcar como error
    }

    // First, check if record exists
    const checkUrl = `${SUPABASE_URL}/rest/v1/daily_data?user_id=eq.${FIXED_USER_ID}&date=eq.${dailyData.date}`;
    const checkResponse = await fetch(checkUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
    });

    const existingRecords = await checkResponse.json();
    console.log('Existing records:', existingRecords);

    const now = new Date().toISOString();

    if (existingRecords && existingRecords.length > 0) {
      // Update existing record
      console.log('Updating existing record...');
      const updateUrl = `${SUPABASE_URL}/rest/v1/daily_data?user_id=eq.${FIXED_USER_ID}&date=eq.${dailyData.date}`;
      const updateResponse = await fetch(updateUrl, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          total_caja: totalCaja,
          total_carreras: totalCarreras,
          data: state,
          updated_at: now,
        }),
      });

      console.log('Update response status:', updateResponse.status);

      if (!updateResponse.ok) {
        const errorText = await updateResponse.text();
        console.error('Error updating in Supabase:', updateResponse.statusText, errorText);
        return false;
      }

      console.log('Data updated in Supabase successfully');
      return true;
    } else {
      // Create new record
      console.log('Creating new record...');
      const payload: DailyDataPayload = {
        date: dailyData.date,
        user_id: FIXED_USER_ID,
        total_caja: totalCaja,
        total_carreras: totalCarreras,
        data: state,
        created_at: now,
        updated_at: now,
      };

      const createUrl = `${SUPABASE_URL}/rest/v1/daily_data`;
      const createResponse = await fetch(createUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      console.log('Create response status:', createResponse.status);

      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        console.error('Error creating in Supabase:', createResponse.statusText, errorText);
        return false;
      }

      console.log('Data created in Supabase successfully');
      return true;
    }
  } catch (error) {
    console.error('Error syncing to Supabase:', error);
    return false;
  }
}

/**
 * Obtiene los datos de un dia especifico desde Supabase
 */
export async function getDataFromSupabase(date?: string) {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.warn('Supabase credentials not configured');
      return null;
    }

    let query = `user_id=eq.${FIXED_USER_ID}`;
    if (date) {
      query += `&date=eq.${date}`;
    }

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/daily_data?${query}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) {
      console.error('Error fetching from Supabase:', response.statusText);
      return null;
    }

    const data = await response.json();
    console.log('Data fetched from Supabase:', data);
    return data;
  } catch (error) {
    console.error('Error fetching from Supabase:', error);
    return null;
  }
}

/**
 * Obtiene todo el historial de datos
 */
export async function getAllDataFromSupabase() {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.warn('Supabase credentials not configured');
      return null;
    }

    const query = `user_id=eq.${FIXED_USER_ID}`;

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/daily_data?${query}&order=date.desc`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      }
    );

    if (!response.ok) {
      console.error('Error fetching all data from Supabase:', response.statusText);
      return null;
    }

    const data = await response.json();
    console.log('All data fetched from Supabase:', data);
    return data;
  } catch (error) {
    console.error('Error fetching all data from Supabase:', error);
    return null;
  }
}
