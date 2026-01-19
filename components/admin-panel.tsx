import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, Alert, StyleSheet } from 'react-native';
import { useColors } from '@/hooks/use-colors';

interface AdminPanelProps {
  isVisible: boolean;
  onClose: () => void;
  onAddUser: (email: string, password: string) => Promise<void>;
}

export function AdminPanel({ isVisible, onClose, onAddUser }: AdminPanelProps) {
  const colors = useColors();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddUser = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Error', 'La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setLoading(true);
    try {
      await onAddUser(email, password);
      Alert.alert('Éxito', `Usuario ${email} creado correctamente`);
      setEmail('');
      setPassword('');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Error al crear usuario');
    } finally {
      setLoading(false);
    }
  };

  if (!isVisible) return null;

  return (
    <View style={[styles.overlay, { backgroundColor: 'rgba(0,0,0,0.5)' }]}>
      <View style={[styles.modal, { backgroundColor: colors.surface }]}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>Panel de Administrador</Text>
          <Pressable onPress={onClose}>
            <Text style={[styles.closeButton, { color: colors.primary }]}>✕</Text>
          </Pressable>
        </View>

        <ScrollView style={styles.content}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Crear Nuevo Usuario</Text>

          <Text style={[styles.label, { color: colors.muted }]}>Email</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.foreground }]}
            placeholder="usuario@example.com"
            placeholderTextColor={colors.muted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            editable={!loading}
          />

          <Text style={[styles.label, { color: colors.muted }]}>Contraseña</Text>
          <TextInput
            style={[styles.input, { borderColor: colors.border, color: colors.foreground }]}
            placeholder="Mínimo 8 caracteres"
            placeholderTextColor={colors.muted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            editable={!loading}
          />

          <Pressable
            style={[styles.button, { backgroundColor: colors.primary, opacity: loading ? 0.6 : 1 }]}
            onPress={handleAddUser}
            disabled={loading}
          >
            <Text style={[styles.buttonText, { color: colors.background }]}>
              {loading ? 'Creando...' : 'Crear Usuario'}
            </Text>
          </Pressable>

          <View style={[styles.infoBox, { backgroundColor: colors.background, borderColor: colors.border }]}>
            <Text style={[styles.infoTitle, { color: colors.foreground }]}>ℹ️ Información</Text>
            <Text style={[styles.infoText, { color: colors.muted }]}>
              Los nuevos usuarios podrán iniciar sesión con el email y contraseña que especifiques.
            </Text>
            <Text style={[styles.infoText, { color: colors.muted, marginTop: 8 }]}>
              La contraseña debe tener al menos 8 caracteres.
            </Text>
          </View>
        </ScrollView>

        <Pressable
          style={[styles.closeButtonBottom, { backgroundColor: colors.border }]}
          onPress={onClose}
        >
          <Text style={[styles.closeButtonText, { color: colors.foreground }]}>Cerrar</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 12,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  closeButton: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    marginBottom: 6,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
    fontSize: 14,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
  infoBox: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    lineHeight: 18,
  },
  closeButtonBottom: {
    paddingVertical: 12,
    alignItems: 'center',
    borderTopWidth: 1,
  },
  closeButtonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
