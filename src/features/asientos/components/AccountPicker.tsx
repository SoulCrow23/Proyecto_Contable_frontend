import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Badge } from '../../../components/ui/Badge';
import { theme } from '../../../components/ui/theme/theme';
import { CuentaContable } from '../../../types/contabilidad.types';

interface Props { cuentas: CuentaContable[]; onSelect: (cuenta: CuentaContable) => void; onClose: () => void; }

export function AccountPicker({ cuentas, onSelect, onClose }: Props) {
  return <View style={styles.container}>
    <Text style={styles.title}>Selecciona una cuenta contable</Text>
    <ScrollView style={styles.list} nestedScrollEnabled>
      {cuentas.map((cuenta) => <TouchableOpacity key={cuenta.codigo} style={styles.item} onPress={() => onSelect(cuenta)}>
        <Text style={styles.code}>{cuenta.codigo}</Text><Text style={styles.name}>{cuenta.nombre}</Text>
        <Badge label={cuenta.naturaleza} variant={cuenta.naturaleza === 'DEUDORA' ? 'debe' : 'haber'} />
      </TouchableOpacity>)}
    </ScrollView>
    <TouchableOpacity style={styles.close} onPress={onClose}><Text style={styles.closeText}>Cancelar</Text></TouchableOpacity>
  </View>;
}

const styles = StyleSheet.create({
  container: { marginTop: 12, borderWidth: 1, borderColor: theme.colors.border, borderRadius: theme.borderRadius.md, padding: 16, backgroundColor: theme.colors.surface },
  title: { fontSize: 16, fontWeight: '700', color: theme.colors.textPrimary, marginBottom: 10 },
  list: { maxHeight: 320 }, item: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
  code: { width: 64, fontFamily: 'monospace', fontWeight: '700', color: theme.colors.primary }, name: { flex: 1, color: theme.colors.textPrimary, fontSize: 14 },
  close: { alignSelf: 'flex-end', paddingTop: 12 }, closeText: { color: theme.colors.accent, fontWeight: '700' },
});
