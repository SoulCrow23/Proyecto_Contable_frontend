import React from 'react';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '../../../components/ui/Card';
import { theme } from '../../../components/ui/theme/theme';
import { Money } from '../../../lib/math/money';
import { AsientoContable } from '../../../types/contabilidad.types';
import { formatCurrency, formatDate } from '../../../utils/formatters/currency';

interface Props { asiento: AsientoContable; moneda: string; onDelete: (id: string) => void; }

export function AsientoCard({ asiento, moneda, onDelete }: Props) {
  const confirmarEliminacion = () => Alert.alert('Eliminar asiento', `¿Deseas eliminar el asiento #${asiento.numero}? Esta acción actualizará el Mayor y la Balanza.`, [
    { text: 'Cancelar', style: 'cancel' }, { text: 'Eliminar definitivamente', style: 'destructive', onPress: () => onDelete(asiento.id) },
  ]);
  return <Card variant="elevated" style={styles.card}>
    <View style={styles.header}><View style={styles.number}><Text style={styles.numberText}>Asiento #{asiento.numero}</Text></View><Text style={styles.date}>{formatDate(asiento.fecha)}</Text><TouchableOpacity onPress={confirmarEliminacion} style={styles.delete}><Text style={styles.deleteText}>Eliminar</Text></TouchableOpacity></View>
    <Text style={styles.concept}>{asiento.concepto}</Text>
    <View style={styles.tableHeader}><Text style={[styles.headerCell, styles.accountCell]}>Cuenta</Text><Text style={styles.headerCell}>Debe</Text><Text style={styles.headerCell}>Haber</Text></View>
    {asiento.movimientos.map((movimiento) => { const tieneDebe = Money.from(movimiento.debe).isPositive(); return <View key={movimiento.id} style={styles.row}>
      <View style={styles.accountCell}><Text style={[styles.account, !tieneDebe && styles.indent]}>{movimiento.codigoCuenta} - {movimiento.nombreCuenta}</Text>{movimiento.referencia ? <Text style={styles.reference}>Ref: {movimiento.referencia}</Text> : null}</View>
      <Text style={[styles.amount, { color: theme.colors.debe }]}>{tieneDebe ? formatCurrency(movimiento.debe, moneda) : '—'}</Text><Text style={[styles.amount, { color: theme.colors.haber }]}>{!tieneDebe ? formatCurrency(movimiento.haber, moneda) : '—'}</Text>
    </View>; })}
    <View style={styles.footer}><Text style={styles.footerLabel}>Sumas iguales:</Text><Text style={[styles.footerAmount, { color: theme.colors.debe }]}>{formatCurrency(asiento.totalDebe, moneda)}</Text><Text style={[styles.footerAmount, { color: theme.colors.haber }]}>{formatCurrency(asiento.totalHaber, moneda)}</Text></View>
  </Card>;
}

const styles = StyleSheet.create({
  card: { marginBottom: 12 }, header: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 }, number: { backgroundColor: theme.colors.primary, paddingHorizontal: 8, paddingVertical: 4, borderRadius: theme.borderRadius.sm, marginRight: 8 }, numberText: { color: theme.colors.textInverse, fontSize: 13, fontWeight: '700' }, date: { flex: 1, color: theme.colors.textSecondary, fontSize: 13 }, delete: { padding: 4 }, deleteText: { color: theme.colors.descuadrado, fontSize: 12, fontWeight: '700' },
  concept: { fontSize: 15, lineHeight: 21, color: theme.colors.textPrimary, fontWeight: '600', marginBottom: 10 }, tableHeader: { flexDirection: 'row', backgroundColor: theme.colors.surfaceVariant, paddingVertical: 7, paddingHorizontal: 8, borderRadius: theme.borderRadius.sm }, headerCell: { flex: 1, textAlign: 'right', color: theme.colors.textSecondary, fontSize: 13, fontWeight: '700' }, accountCell: { flex: 2, textAlign: 'left' },
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 9, paddingHorizontal: 8, borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight }, account: { fontSize: 14, color: theme.colors.textPrimary, fontWeight: '500' }, indent: { paddingLeft: 12, color: theme.colors.textSecondary }, reference: { fontSize: 12, color: theme.colors.textMuted }, amount: { flex: 1, textAlign: 'right', fontFamily: 'monospace', fontWeight: '600', fontSize: 14 },
  footer: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingTop: 9, borderTopWidth: 1, borderTopColor: theme.colors.border }, footerLabel: { fontSize: 13, color: theme.colors.textSecondary, fontWeight: '700', marginRight: 10 }, footerAmount: { fontFamily: 'monospace', fontSize: 14, fontWeight: '700', marginLeft: 12 },
});
