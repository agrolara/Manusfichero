import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useColors } from '@/hooks/use-colors';

interface MontoModalProps {
  isOpen: boolean;
  mobileId: string | null;
  onConfirm: (monto: number) => void;
  onCancel: () => void;
}

export function MontoModal({ isOpen, mobileId, onConfirm, onCancel }: MontoModalProps) {
  const colors = useColors();
  const [monto, setMonto] = useState('');
  const inputRef = useRef<TextInput>(null);

  // Enfocar automáticamente el input cuando el modal se abre
  useEffect(() => {
    if (isOpen) {
      setMonto('');
      // Pequeño delay para asegurar que el modal esté renderizado
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleConfirm = () => {
    const parsedMonto = parseFloat(monto);
    if (!isNaN(parsedMonto) && parsedMonto > 0) {
      onConfirm(parsedMonto);
      setMonto('');
    }
  };

  const handleCancel = () => {
    setMonto('');
    onCancel();
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.container, { backgroundColor: 'rgba(0, 0, 0, 0.5)' }]}
      >
        <View style={styles.centeredView}>
          <View
            style={[
              styles.modalView,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.title, { color: colors.foreground }]}>
              Monto de Carrera - Móvil {mobileId}
            </Text>

            <TextInput
              ref={inputRef}
              style={[
                styles.input,
                {
                  color: colors.foreground,
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                },
              ]}
              placeholder="Ingresa el monto"
              placeholderTextColor={colors.muted}
              keyboardType="decimal-pad"
              value={monto}
              onChangeText={setMonto}
              returnKeyType="done"
              onSubmitEditing={handleConfirm}
            />

            <View style={styles.buttonContainer}>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.confirmButton,
                  {
                    backgroundColor: colors.primary,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
                onPress={handleConfirm}
              >
                <Text style={[styles.buttonText, { color: colors.background }]}>
                  Confirmar
                </Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.cancelButton,
                  {
                    borderColor: colors.error,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
                onPress={handleCancel}
              >
                <Text style={[styles.buttonText, { color: colors.error }]}>Cancelar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalView: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 20,
    width: '85%',
    maxWidth: 400,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    flex: 1.5,
  },
  cancelButton: {
    borderWidth: 1,
    backgroundColor: 'transparent',
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
