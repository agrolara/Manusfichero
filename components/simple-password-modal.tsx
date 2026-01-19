import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useColors } from '@/hooks/use-colors';

interface SimplePasswordModalProps {
  isVisible: boolean;
  onLogin: (password: string) => Promise<void>;
  loading?: boolean;
}

const CORRECT_PASSWORD = 'full-express';

export function SimplePasswordModal({ isVisible, onLogin, loading = false }: SimplePasswordModalProps) {
  const colors = useColors();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!password) {
      Alert.alert('Error', 'Por favor ingresa la contraseña');
      return;
    }

    if (password !== CORRECT_PASSWORD) {
      Alert.alert('Error', 'Contraseña incorrecta');
      setPassword('');
      return;
    }

    try {
      await onLogin(password);
      setPassword('');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Error al iniciar sesión');
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={() => {}}
    >
      <View style={[styles.overlay, { backgroundColor: 'rgba(0, 0, 0, 0.7)' }]}>
        <View style={[styles.container, { backgroundColor: colors.surface }]}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: colors.foreground }]}>
              🚕 Full Express
            </Text>
          </View>

          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Sistema de Gestión de Taxis
          </Text>

          {/* Password */}
          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.foreground }]}>Contraseña</Text>
            <View style={[styles.passwordContainer, { borderColor: colors.border }]}>
              <TextInput
                style={[
                  styles.passwordInput,
                  {
                    color: colors.foreground,
                    backgroundColor: colors.background,
                  },
                ]}
                placeholder="Ingresa la contraseña"
                placeholderTextColor={colors.muted}
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                editable={!loading}
                autoFocus
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeButton}
              >
                <Text style={styles.eyeText}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </Pressable>
            </View>
          </View>

          {/* Button */}
          <Pressable
            style={[
              styles.button,
              { backgroundColor: colors.primary, opacity: loading ? 0.7 : 1 },
            ]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={colors.background} size="small" />
            ) : (
              <Text style={[styles.buttonText, { color: colors.background }]}>
                Acceder
              </Text>
            )}
          </Pressable>

          <Text style={[styles.info, { color: colors.muted }]}>
            Los datos se guardan en la nube automáticamente
          </Text>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '85%',
    maxWidth: 400,
    borderRadius: 12,
    padding: 24,
    gap: 16,
  },
  header: {
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
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
    fontSize: 16,
  },
  button: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  info: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
});
