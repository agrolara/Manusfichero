import { describe, it, expect } from 'vitest';

describe('Supabase Configuration', () => {
  it('should have SUPABASE_URL environment variable', () => {
    const url = process.env.SUPABASE_URL;
    expect(url).toBeDefined();
    expect(url).toMatch(/^https:\/\/.*\.supabase\.co$/);
  });

  it('should have SUPABASE_ANON_KEY environment variable', () => {
    const key = process.env.SUPABASE_ANON_KEY;
    expect(key).toBeDefined();
    expect(key?.length).toBeGreaterThan(0);
  });

  it('should be able to connect to Supabase', async () => {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;

    if (!url || !key) {
      throw new Error('Supabase credentials not configured');
    }

    // Intentar conectar a la API de Supabase
    try {
      const response = await fetch(`${url}/rest/v1/`, {
        headers: {
          'apikey': key,
          'Authorization': `Bearer ${key}`,
        },
      });

      // Esperamos un 404, 200, 405 o 401 (credenciales inválidas es OK, significa que Supabase está accesible)
      expect([200, 404, 405, 401]).toContain(response.status);
    } catch (error) {
      throw new Error(`Failed to connect to Supabase: ${error}`);
    }
  });
});
