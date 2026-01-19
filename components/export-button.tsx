import React from 'react';
import { Pressable, Text, StyleSheet, Alert } from 'react-native';
import { useColors } from '@/hooks/use-colors';

interface ExportButtonProps {
  onPress: () => Promise<void>;
  label?: string;
  disabled?: boolean;
}

export function ExportButton({ onPress, label = 'Exportar PDF', disabled = false }: ExportButtonProps) {
  const colors = useColors();
  const [loading, setLoading] = React.useState(false);

  const handlePress = async () => {
    setLoading(true);
    try {
      await onPress();
      Alert.alert('Éxito', 'Reporte exportado correctamente');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Error al exportar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      style={[
        styles.button,
        {
          backgroundColor: disabled || loading ? colors.muted : colors.primary,
          opacity: disabled ? 0.5 : 1,
        },
      ]}
      onPress={handlePress}
      disabled={disabled || loading}
    >
      <Text style={[styles.buttonText, { color: colors.background }]}>
        {loading ? 'Exportando...' : label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
