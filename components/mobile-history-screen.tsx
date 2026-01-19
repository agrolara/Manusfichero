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

  const handleEditPress = (uid: string, currentMonto: number) => {
    setEditingUid(uid);
    setEditMonto(currentMonto.toString());
  };

  const handleEditConfirm = () => {
    const nuevoMonto = parseFloat(editMonto);
    if (!isNaN(nuevoMonto) && nuevoMonto > 0 && editingUid) {
      onEdit(editingUid, nuevoMonto);
      setEditingUid(null);
      setEditMonto('');
    } else {
      Alert.alert('Error', 'Ingresa un monto valido');
    }
  };

  const handleDeletePress = (uid: string) => {
    Alert.alert(
      'Eliminar Registro',
      'Estas seguro de que deseas eliminar este registro?',
      [
        { text: 'Cancelar', onPress: () => {} },
        {
          text: 'Eliminar',
          onPress: () => {
            onDelete(uid);
          },
          style: 'destructive',
        },
      ]
    );
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
          Historial de Carreras
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
          mobile.historial.map((record) => (
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
                  <Text style={[styles.recordType, { color: colors.foreground }]}>
                    Tipo: {record.tipo.toUpperCase()}
                  </Text>
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
                    onPress={() => handleDeletePress(record.uid)}
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
            <TextInput
              style={[
                styles.editInput,
                {
                  color: colors.foreground,
                  borderColor: colors.border,
                  backgroundColor: colors.background,
                },
              ]}
              placeholder="Nuevo monto"
              placeholderTextColor={colors.muted}
              keyboardType="decimal-pad"
              value={editMonto}
              onChangeText={setEditMonto}
            />
            <View style={styles.editModalButtons}>
              <Pressable
                style={({ pressed }) => [
                  styles.editButton,
                  {
                    backgroundColor: colors.primary,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
                onPress={handleEditConfirm}
              >
                <Text style={[styles.editButtonText, { color: colors.background }]}>
                  Confirmar
                </Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.editButton,
                  {
                    borderColor: colors.error,
                    borderWidth: 1,
                    opacity: pressed ? 0.8 : 1,
                  },
                ]}
                onPress={() => {
                  setEditingUid(null);
                  setEditMonto('');
                }}
              >
                <Text style={[styles.editButtonText, { color: colors.error }]}>
                  Cancelar
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
    paddingHorizontal: 12,
    paddingVertical: 10,
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
    fontSize: 12,
    fontWeight: '600',
  },
  historyHeader: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '600',
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
  },
  recordType: {
    fontSize: 12,
    fontWeight: '600',
  },
  recordMonto: {
    fontSize: 12,
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
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
  },
  editModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editModalContent: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 20,
    width: '85%',
    maxWidth: 400,
    gap: 12,
  },
  editModalTitle: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  editInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  editModalButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  editButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editButtonText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
