import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { useColors } from '@/hooks/use-colors';
import { MobileStats } from '@/lib/types';

interface MobileHistoryScreenProps {
  mobile: MobileStats;
  onEdit: (uid: string, nuevoMonto: number) => void;
  onDelete: (uid: string) => void;
  correctionMode: boolean;
  onClose: () => void;
}

export function MobileHistoryScreen({
  mobile,
  onEdit,
  onDelete,
  correctionMode,
  onClose,
}: MobileHistoryScreenProps) {
  const colors = useColors();
  const [editingUid, setEditingUid] = useState<string | null>(null);
  const [editMonto, setEditMonto] = useState('');
  const [editError, setEditError] = useState('');

  const validateMonto = (value: string): { valid: boolean; error: string } => {
    if (!value || value.trim() === '') {
      return { valid: false, error: 'El monto no puede estar vacio' };
    }

    const numValue = parseFloat(value);

    if (isNaN(numValue)) {
      return { valid: false, error: 'Ingresa un numero valido' };
    }

    if (numValue <= 0) {
      return { valid: false, error: 'El monto debe ser mayor a 0' };
    }

    if (numValue > 999999) {
      return { valid: false, error: 'El monto es demasiado grande' };
    }

    return { valid: true, error: '' };
  };

  const handleEditPress = (uid: string, currentMonto: number) => {
    setEditingUid(uid);
    setEditMonto(currentMonto.toString());
    setEditError('');
  };

  const handleEditConfirm = () => {
    const validation = validateMonto(editMonto);

    if (!validation.valid) {
      setEditError(validation.error);
      return;
    }

    if (!editingUid) {
      setEditError('Error: UID no encontrado');
      return;
    }

    try {
      const nuevoMonto = parseFloat(editMonto);
      onEdit(editingUid, nuevoMonto);
      setEditingUid(null);
      setEditMonto('');
      setEditError('');
      Alert.alert('Exito', 'Monto actualizado correctamente');
    } catch (error) {
      setEditError('Error al actualizar el monto');
    }
  };

  const handleDeletePress = (uid: string, monto: number, tipo: string) => {
    Alert.alert(
      'Eliminar Registro',
      `Estas seguro de que deseas eliminar este registro?\n\nTipo: ${tipo.toUpperCase()}\nMonto: $${monto.toFixed(2)}`,
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Eliminar',
          onPress: () => {
            try {
              onDelete(uid);
              Alert.alert('Exito', 'Registro eliminado correctamente');
            } catch (error) {
              Alert.alert('Error', 'No se pudo eliminar el registro');
            }
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleEditCancel = () => {
    setEditingUid(null);
    setEditMonto('');
    setEditError('');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: colors.surface,
            borderBottomColor: colors.border,
          },
        ]}
      >
        <View>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>
            Movil {mobile.id}
          </Text>
          <Text style={[styles.headerSubtitle, { color: colors.muted }]}>
            Total: ${mobile.totalMonto.toFixed(2)}
          </Text>
        </View>
        <Pressable
          style={({ pressed }) => [{ opacity: pressed ? 0.6 : 1 }]}
          onPress={onClose}
        >
          <Text style={[styles.closeButton, { color: colors.primary }]}>Cerrar</Text>
        </Pressable>
      </View>

      {/* Resumen */}
      <View
        style={[
          styles.summaryBox,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
          },
        ]}
      >
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.muted }]}>Blancas:</Text>
          <Text style={[styles.summaryValue, { color: colors.foreground }]}>
            {mobile.blancas}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.muted }]}>Azules:</Text>
          <Text style={[styles.summaryValue, { color: colors.foreground }]}>
            {mobile.azules}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={[styles.summaryLabel, { color: colors.muted }]}>Rojas:</Text>
          <Text style={[styles.summaryValue, { color: colors.foreground }]}>
            {mobile.rojas}
          </Text>
        </View>
      </View>

      {/* Historial */}
      <View style={styles.historyHeader}>
        <Text style={[styles.historyTitle, { color: colors.foreground }]}>
          Historial de Carreras ({mobile.historial.length})
        </Text>
      </View>

      <ScrollView style={styles.historyList} showsVerticalScrollIndicator={false}>
        {mobile.historial.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              Sin registros
            </Text>
          </View>
        ) : (
          mobile.historial.map((record, index) => (
            <View
              key={record.uid}
              style={[
                styles.recordCard,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.recordContent}>
                <View style={styles.recordRow}>
                  <View style={styles.recordInfo}>
                    <Text style={[styles.recordNumber, { color: colors.muted }]}>
                      #{index + 1}
                    </Text>
                    <Text style={[styles.recordType, { color: colors.foreground }]}>
                      {record.tipo.toUpperCase()}
                    </Text>
                  </View>
                  <Text style={[styles.recordMonto, { color: colors.primary }]}>
                    ${record.monto.toFixed(2)}
                  </Text>
                </View>
                <Text style={[styles.recordTime, { color: colors.muted }]}>
                  {record.hora}
                </Text>
              </View>

              {correctionMode && (
                <View style={styles.recordActions}>
                  <Pressable
                    style={({ pressed }) => [
                      styles.actionButton,
                      {
                        borderColor: colors.warning,
                        opacity: pressed ? 0.6 : 1,
                      },
                    ]}
                    onPress={() => handleEditPress(record.uid, record.monto)}
                  >
                    <Text style={[styles.actionText, { color: colors.warning }]}>E</Text>
                  </Pressable>
                  <Pressable
                    style={({ pressed }) => [
                      styles.actionButton,
                      {
                        borderColor: colors.error,
                        opacity: pressed ? 0.6 : 1,
                      },
                    ]}
                    onPress={() =>
                      handleDeletePress(record.uid, record.monto, record.tipo)
                    }
                  >
                    <Text style={[styles.actionText, { color: colors.error }]}>X</Text>
                  </Pressable>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Modal de edicion */}
      <Modal visible={editingUid !== null} transparent animationType="fade">
        <View
          style={[
            styles.editModalContainer,
            { backgroundColor: 'rgba(0, 0, 0, 0.5)' },
          ]}
        >
          <View
            style={[
              styles.editModalContent,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
              },
            ]}
          >
            <Text style={[styles.editModalTitle, { color: colors.foreground }]}>
              Editar Monto
            </Text>

            <Text style={[styles.editModalLabel, { color: colors.muted }]}>
              Ingresa el nuevo monto
            </Text>

            <TextInput
              style={[
                styles.editInput,
                {
                  color: colors.foreground,
                  borderColor: editError ? colors.error : colors.border,
                  backgroundColor: colors.background,
                  borderWidth: editError ? 2 : 1,
                },
              ]}
              keyboardType="decimal-pad"
              placeholder="0.00"
              placeholderTextColor={colors.muted}
              value={editMonto}
              onChangeText={(text) => {
                setEditMonto(text);
                setEditError('');
              }}
              returnKeyType="done"
              onSubmitEditing={handleEditConfirm}
            />

            {editError && (
              <Text style={[styles.errorText, { color: colors.error }]}>
                {editError}
              </Text>
            )}

            <View style={styles.editModalButtons}>
              <Pressable
                style={({ pressed }) => [
                  styles.editModalButton,
                  {
                    backgroundColor: colors.muted,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
                onPress={handleEditCancel}
              >
                <Text style={[styles.editModalButtonText, { color: colors.background }]}>
                  Cancelar
                </Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.editModalButton,
                  {
                    backgroundColor: colors.primary,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
                onPress={handleEditConfirm}
              >
                <Text style={[styles.editModalButtonText, { color: colors.background }]}>
                  Guardar
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  closeButton: {
    fontSize: 14,
    fontWeight: '600',
  },
  summaryBox: {
    marginHorizontal: 12,
    marginVertical: 12,
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '700',
  },
  historyHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  historyList: {
    flex: 1,
    paddingHorizontal: 12,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 14,
    fontStyle: 'italic',
  },
  recordCard: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordContent: {
    flex: 1,
    gap: 4,
  },
  recordRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordInfo: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  recordNumber: {
    fontSize: 10,
    fontWeight: '600',
  },
  recordType: {
    fontSize: 12,
    fontWeight: '600',
  },
  recordMonto: {
    fontSize: 13,
    fontWeight: '700',
  },
  recordTime: {
    fontSize: 11,
  },
  recordActions: {
    flexDirection: 'row',
    gap: 6,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '700',
  },
  editModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editModalContent: {
    width: '85%',
    borderRadius: 12,
    borderWidth: 1,
    padding: 20,
    gap: 12,
  },
  editModalTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  editModalLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  editInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 12,
    fontWeight: '500',
    marginTop: -8,
  },
  editModalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  editModalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editModalButtonText: {
    fontSize: 13,
    fontWeight: '700',
  },
});
