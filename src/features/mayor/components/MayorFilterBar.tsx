import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../../components/ui/theme/theme';

export type MayorFilter = 'TODAS' | 'CON_MOVIMIENTO';

interface Props { value: MayorFilter; activeCount: number; totalCount: number; onChange: (value: MayorFilter) => void; }

export function MayorFilterBar({ value, activeCount, totalCount, onChange }: Props) {
  const option = (id: MayorFilter, label: string) => <TouchableOpacity onPress={() => onChange(id)} style={[styles.chip, value === id && styles.active]}><Text style={[styles.text, value === id && styles.activeText]}>{label}</Text></TouchableOpacity>;
  return <View style={styles.container}>{option('CON_MOVIMIENTO', `Cuentas activas (${activeCount})`)}{option('TODAS', `Todas las cuentas (${totalCount})`)}</View>;
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 8, padding: theme.spacing.md, backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
  chip: { borderWidth: 1, borderColor: theme.colors.borderLight, borderRadius: theme.borderRadius.full, backgroundColor: theme.colors.surfaceVariant, paddingHorizontal: 14, paddingVertical: 7 },
  active: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary }, text: { color: theme.colors.textSecondary, fontSize: 13, fontWeight: '600' }, activeText: { color: theme.colors.textInverse },
});
