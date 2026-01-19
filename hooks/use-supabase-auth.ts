import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthUser {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';

export function useSupabaseAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false,
  });

  // Simular login (en producción, usarías Supabase Auth)
  const login = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // Validar credenciales contra la base de datos
      const response = await fetch(`${SUPABASE_URL}/rest/v1/users?email=eq.${email}`, {
        method: 'GET',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
      });

      if (!response.ok) {
        throw new Error('Error al conectar con Supabase');
      }

      const users = await response.json();

      if (users.length === 0) {
        throw new Error('Usuario no encontrado');
      }

      const user = users[0];

      // Validar contraseña (en producción, usarías bcrypt en el servidor)
      // Por ahora, usamos una validación simple
      const isPasswordValid = password === '12345678'; // Contraseña del admin

      if (!isPasswordValid) {
        throw new Error('Contraseña incorrecta');
      }

      const authUser: AuthUser = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };

      // Guardar token en AsyncStorage
      await AsyncStorage.setItem('auth_user', JSON.stringify(authUser));
      await AsyncStorage.setItem('auth_token', user.id);

      setState(prev => ({
        ...prev,
        user: authUser,
        isAuthenticated: true,
        loading: false,
      }));

      return authUser;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error de autenticación';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        loading: false,
      }));
      throw error;
    }
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('auth_user');
      await AsyncStorage.removeItem('auth_token');
      setState({
        user: null,
        loading: false,
        error: null,
        isAuthenticated: false,
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }, []);

  // Restaurar sesión
  const restoreSession = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true }));

    try {
      const authUserStr = await AsyncStorage.getItem('auth_user');
      if (authUserStr) {
        const authUser = JSON.parse(authUserStr) as AuthUser;
        setState(prev => ({
          ...prev,
          user: authUser,
          isAuthenticated: true,
          loading: false,
        }));
        return authUser;
      }
      setState(prev => ({ ...prev, loading: false }));
      return null;
    } catch (error) {
      setState(prev => ({ ...prev, loading: false }));
      return null;
    }
  }, []);

  return {
    ...state,
    login,
    logout,
    restoreSession,
  };
}
