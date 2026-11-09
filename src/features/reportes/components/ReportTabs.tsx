import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../../components/ui/theme/theme';

export type SubReporte = 'BALANZA' | 'RESULTADOS' | 'BALANCE_GRAL';

interface Props {
  activeReport: SubReporte;
  onChange: (report: SubReporte) => void;
}

const tabs: { id: SubReporte; label: string }[] = [
  { id: 'BALANZA', label: 'Balanza Comprobación' },
  { id: 'RESULTADOS', label: 'Estado Resultados' },
  { id: 'BALANCE_GRAL', label: 'Balance General' },
];

export function ReportTabs({ activeReport, onChange }: Props) {
  return <View style={styles.bar}>{tabs.map((tab) => <TouchableOpacity key={tab.id} style={[styles.tab, activeReport === tab.id && styles.active]} onPress={() => onChange(tab.id)}><Text style={[styles.text, activeReport === tab.id && styles.activeText]}>{tab.label}</Text></TouchableOpacity>)}</View>;
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.border, paddingHorizontal: 8, paddingVertical: 6 },
  tab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: theme.borderRadius.sm },
  active: { backgroundColor: theme.colors.primary },
  text: { fontSize: 12, fontWeight: '600', color: theme.colors.textSecondary },
  activeText: { color: theme.colors.textInverse, fontWeight: '700' },
});
