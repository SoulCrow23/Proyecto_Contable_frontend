import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../../components/ui/theme/theme';

export interface ReportAction {
  label: string;
  variant: 'pdf' | 'csv';
  onPress: () => void;
}

interface Props { title: string; subtitle: string; actions: ReportAction[]; disabled?: boolean; }

export function ReportHeader({ title, subtitle, actions, disabled = false }: Props) {
  return <View style={styles.row}><View><Text style={styles.title}>{title}</Text><Text style={styles.subtitle}>{subtitle}</Text></View><View style={styles.actions}>{actions.map((action) => <TouchableOpacity key={action.label} style={[styles.button, action.variant === 'pdf' ? styles.pdf : styles.csv]} onPress={action.onPress} disabled={disabled}><Text style={[styles.buttonText, action.variant === 'pdf' ? styles.pdfText : styles.csvText]}>{action.label}</Text></TouchableOpacity>)}</View></View>;
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8, flexWrap: 'wrap', gap: 8 },
  title: { fontSize: 18, fontWeight: '800', color: theme.colors.textPrimary, textAlign: 'center' },
  subtitle: { fontSize: 12, color: theme.colors.textSecondary, textAlign: 'center', marginBottom: 14 },
  actions: { flexDirection: 'row', gap: 8 },
  button: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: theme.borderRadius.sm, borderWidth: 1, backgroundColor: theme.colors.surfaceVariant, borderColor: theme.colors.border },
  pdf: {}, csv: {}, buttonText: { fontSize: 12, fontWeight: '700' }, pdfText: { color: theme.colors.accent }, csvText: { color: theme.colors.cuadrado },
});
