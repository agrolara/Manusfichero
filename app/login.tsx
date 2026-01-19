import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { ScreenContainer } from '@/components/screen-container';
import { useSupabaseAuth } from '@/hooks/use-supabase-auth';
import { useColors } from '@/hooks/use-colors';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const colors = useColors();
  const router = useRouter();
  const { login, loading, error } = useSupabaseAuth();

  const [email, setEmail] = useState('agro_lara@yahoo.com');
  const [password, setPassword] = useState('12345678');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    try {
      await login(email, password);
      // Navegar a la pantalla principal
      router.replace('/(tabs)');
    } catch (err) {
      Alert.alert('Error de Autenticación', error || 'No se pudo iniciar sesión');
    }
  };

  return (
    <ScreenContainer className="flex-1">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.container, { backgroundColor: colors.background }]}>
          {/* Header */}
          <View style={styles.headerSection}>
            <Text style={[styles.title, { color: colors.foreground }]}>
              Full Express
            </Text>
            <Text style={[styles.subtitle, { color: colors.muted }]}>
              Sistema de Gestión de Taxis
            </Text>
          </View>

          {/* Formulario */}
          <View style={[styles.formSection, { backgroundColor: colors.surface }]}>
            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.foreground }]}>
                Correo Electrónico
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    color: colors.foreground,
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                  },
                ]}
                placeholder="agro_lara@yahoo.com"
                placeholderTextColor={colors.muted}
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                editable={!loading}
              />
            </View>

            {/* Contraseña */}
            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.foreground }]}>
                Contraseña
              </Text>
              <View style={[styles.passwordContainer, { borderColor: colors.border }]}>
                <TextInput
                  style={[
                    styles.passwordInput,
                    {
                      color: colors.foreground,
                      backgroundColor: colors.background,
                    },
                  ]}
                  placeholder="••••••••"
                  placeholderTextColor={colors.muted}
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                  editable={!loading}
                />
                <Pressable
                  style={({ pressed }) => [
                    styles.eyeButton,
                    { opacity: pressed ? 0.6 : 1 },
                  ]}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={[styles.eyeText, { color: colors.primary }]}>
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </Text>
                </Pressable>
              </View>
            </View>

            {/* Mensaje de error */}
            {error && (
              <View style={[styles.errorBox, { backgroundColor: '#FEE2E2' }]}>
                <Text style={[styles.errorText, { color: '#DC2626' }]}>
                  {error}
                </Text>
              </View>
            )}

            {/* Botón de Login */}
            <Pressable
              style={({ pressed }) => [
                styles.loginButton,
                {
                  backgroundColor: colors.primary,
                  opacity: pressed || loading ? 0.8 : 1,
                },
              ]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.background} size="small" />
              ) : (
                <Text style={[styles.loginButtonText, { color: colors.background }]}>
                  Iniciar Sesión
                </Text>
              )}
            </Pressable>

            {/* Información de prueba */}
            <View style={[styles.infoBox, { backgroundColor: '#DBEAFE' }]}>
              <Text style={[styles.infoTitle, { color: '#1E40AF' }]}>
                Credenciales de Prueba
              </Text>
              <Text style={[styles.infoText, { color: '#1E40AF' }]}>
                Email: agro_lara@yahoo.com
              </Text>
              <Text style={[styles.infoText, { color: '#1E40AF' }]}>
                Contraseña: 12345678
              </Text>
            </View>
          </View>

          {/* Footer */}
          <View style={styles.footerSection}>
            <Text style={[styles.footerText, { color: colors.muted }]}>
              © 2026 Full Express. Todos los derechos reservados.
            </Text>
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 24,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  formSection: {
    borderRadius: 12,
    padding: 20,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
  },
  eyeButton: {
    padding: 8,
  },
  eyeText: {
    fontSize: 18,
  },
  errorBox: {
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '500',
  },
  loginButton: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  loginButtonText: {
    fontSize: 16,
    fontWeight: '700',
  },
  infoBox: {
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  footerSection: {
    alignItems: 'center',
    marginTop: 20,
  },
  footerText: {
    fontSize: 11,
    fontWeight: '500',
  },
});
