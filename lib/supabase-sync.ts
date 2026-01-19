import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

interface DailyData {
  date: string;
  user_email: string;
  data: any;
  created_at: string;
}

export async function syncDataToSupabase(userEmail: string, dailyData: any) {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.warn('Supabase credentials not configured');
      return false;
    }

    const response = await fetch(`${SUPABASE_URL}/rest/v1/daily_data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({
        date: dailyData.date,
        user_email: userEmail,
        data: JSON.stringify(dailyData.state),
        created_at: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.error('Error syncing to Supabase:', response.statusText);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error syncing to Supabase:', error);
    return false;
  }
}

export async function getDataFromSupabase(userEmail: string, date?: string) {
  try {
    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
      console.warn('Supabase credentials not configured');
      return null;
    }

    let query = `user_email=eq.${userEmail}`;
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
    return data;
  } catch (error) {
    console.error('Error fetching from Supabase:', error);
    return null;
  }
}
