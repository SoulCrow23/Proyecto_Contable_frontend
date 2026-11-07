import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { theme } from '../../../components/ui/theme/theme';
import { MovimientoEditable } from '../hooks/useAsientoForm';

interface Props { movimiento: MovimientoEditable; onChange: (changes: Partial<MovimientoEditable>) => void; onSelectAccount: () => void; onRemove: () => void; }

export function MovimientoInputRow({ movimiento, onChange, onSelectAccount, onRemove }: Props) {
  return <Card variant="outlined" style={styles.card}>
    <View style={styles.header}>
      <TouchableOpacity style={styles.account} onPress={onSelectAccount}><Text numberOfLines={1} style={styles.accountText}>{movimiento.codigoCuenta} - {movimiento.nombreCuenta}</Text><Text>▾</Text></TouchableOpacity>
      <TouchableOpacity onPress={onRemove} style={styles.remove}><Text style={styles.removeText}>Eliminar</Text></TouchableOpacity>
    </View>
    <View style={styles.inputs}>
      <View style={styles.column}><Text style={styles.label}>Debe (cargo)</Text><TextInput style={styles.input} value={movimiento.debe} keyboardType="numeric" onChangeText={(debe) => onChange({ debe })} /></View>
      <View style={styles.column}><Text style={styles.label}>Haber (abono)</Text><TextInput style={styles.input} value={movimiento.haber} keyboardType="numeric" onChangeText={(haber) => onChange({ haber })} /></View>
    </View>
  </Card>;
}

const styles = StyleSheet.create({
  card: { marginBottom: 10, padding: 12 }, header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  account: { flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: theme.colors.surfaceVariant, borderWidth: 1, borderColor: theme.colors.border, paddingHorizontal: 10, paddingVertical: 9, borderRadius: theme.borderRadius.sm },
  accountText: { flex: 1, color: theme.colors.textPrimary, fontSize: 14, fontWeight: '600', marginRight: 8 }, remove: { marginLeft: 8, padding: 8 }, removeText: { color: theme.colors.descuadrado, fontWeight: '700' },
  inputs: { flexDirection: 'row', gap: 10 }, column: { flex: 1 }, label: { color: theme.colors.textSecondary, fontSize: 13, marginBottom: 4 },
  input: { backgroundColor: theme.colors.surface, color: theme.colors.textPrimary, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.borderRadius.sm, paddingHorizontal: 10, paddingVertical: 9, fontFamily: 'monospace', fontWeight: '700' },
});
