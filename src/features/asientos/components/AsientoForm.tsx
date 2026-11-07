import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { theme } from '../../../components/ui/theme/theme';
import { CuentaContable } from '../../../types/contabilidad.types';
import { useAsientoForm } from '../hooks/useAsientoForm';
import { AccountPicker } from './AccountPicker';
import { BalanceIndicator } from './BalanceIndicator';
import { MovimientoInputRow } from './MovimientoInputRow';

interface Props { cuentas: CuentaContable[]; moneda: string; onClose: () => void; onSave: (data: ReturnType<typeof useAsientoForm>) => void; }

export function AsientoForm({ cuentas, moneda, onClose, onSave }: Props) {
  const form = useAsientoForm(cuentas);
  const [accountIndex, setAccountIndex] = useState<number | null>(null);
  return <View style={styles.container}>
    <View style={styles.top}><Text style={styles.title}>Registrar asiento contable</Text><TouchableOpacity onPress={onClose}><Text style={styles.close}>Cerrar</Text></TouchableOpacity></View>
    <View style={styles.body}>
      <Text style={styles.label}>Fecha de la operación</Text><TextInput value={form.fecha} onChangeText={form.setFecha} placeholder="YYYY-MM-DD" style={styles.input} />
      <Text style={styles.label}>Concepto / descripción del hecho económico</Text><TextInput value={form.concepto} onChangeText={form.setConcepto} placeholder="Ej: Venta de mercancías al contado" multiline style={[styles.input, styles.conceptInput]} />
      <View style={styles.movementsHeader}><Text style={styles.subtitle}>Movimientos contables</Text><TouchableOpacity style={styles.add} onPress={form.agregarMovimiento}><Text style={styles.addText}>+ Agregar cuenta</Text></TouchableOpacity></View>
      {form.movimientos.map((movimiento, index) => <MovimientoInputRow key={movimiento.id} movimiento={movimiento} onChange={(changes) => form.actualizarMovimiento(index, changes)} onSelectAccount={() => setAccountIndex(index)} onRemove={() => {
        if (!form.eliminarMovimiento(index)) Alert.alert('Movimientos requeridos', 'Un asiento contable necesita al menos dos movimientos: un cargo y un abono.', [{ text: 'Entendido' }]);
      }} />)}
      {accountIndex !== null && <AccountPicker cuentas={cuentas} onSelect={(cuenta) => { form.seleccionarCuenta(accountIndex, cuenta); setAccountIndex(null); }} onClose={() => setAccountIndex(null)} />}
    </View>
    <BalanceIndicator {...form.resumen} moneda={moneda} onGuardar={() => onSave(form)} />
  </View>;
}

const styles = StyleSheet.create({
  container: { marginTop: 16, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.borderRadius.md, overflow: 'hidden' }, top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight }, title: { color: theme.colors.textPrimary, fontSize: 20, fontWeight: '700' }, close: { color: theme.colors.accent, fontWeight: '700' }, body: { padding: 20 }, label: { fontSize: 14, fontWeight: '700', color: theme.colors.textSecondary, marginTop: 10, marginBottom: 5 }, input: { borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.borderRadius.sm, paddingHorizontal: 10, paddingVertical: 9, color: theme.colors.textPrimary, backgroundColor: theme.colors.surface, fontSize: 14 }, conceptInput: { minHeight: 72, textAlignVertical: 'top' }, movementsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 10 }, subtitle: { color: theme.colors.textPrimary, fontSize: 16, fontWeight: '700' }, add: { backgroundColor: theme.colors.surfaceVariant, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.borderRadius.sm, paddingHorizontal: 10, paddingVertical: 7 }, addText: { color: theme.colors.primary, fontWeight: '700', fontSize: 13 },
});
