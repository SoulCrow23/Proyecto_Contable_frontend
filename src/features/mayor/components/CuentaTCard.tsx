import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Badge } from '../../../components/ui/Badge';
import { Card } from '../../../components/ui/Card';
import { theme } from '../../../components/ui/theme/theme';
import { formatCurrency } from '../../../utils/formatters/currency';
import { CuentaMayorDetalle } from '../../../types/contabilidad.types';
import { MovimientoMayorColumn } from './MovimientoMayorColumn';
import { SaldoCuenta } from './SaldoCuenta';

interface Props { cuenta: CuentaMayorDetalle; moneda: string; }
export function CuentaTCard({ cuenta, moneda }: Props) {
  const divider = <View style={styles.divider} />;
  return <Card variant="elevated" style={styles.card}>
    <View style={styles.header}><View style={styles.titleBox}><Text style={styles.code}>{cuenta.codigo}</Text><Text style={styles.name}>{cuenta.nombre}</Text></View><Badge label={cuenta.naturaleza} variant={cuenta.esSaldoDeudor ? 'debe' : 'haber'} /></View>
    <View style={styles.columnHeaders}><Text style={[styles.columnTitle, { color: theme.colors.debe }]}>DEBE (Cargos)</Text>{divider}<Text style={[styles.columnTitle, { color: theme.colors.haber }]}>HABER (Abonos)</Text></View>
    <View style={styles.body}><MovimientoMayorColumn movimientos={cuenta.movimientos} side="DEBE" moneda={moneda} />{divider}<MovimientoMayorColumn movimientos={cuenta.movimientos} side="HABER" moneda={moneda} /></View>
    <View style={styles.subtotals}><Text style={[styles.total, { color: theme.colors.debe }]}>{formatCurrency(cuenta.totalDebe, moneda)}</Text>{divider}<Text style={[styles.total, { color: theme.colors.haber }]}>{formatCurrency(cuenta.totalHaber, moneda)}</Text></View>
    <View style={styles.balance}><View style={styles.half}>{cuenta.esSaldoDeudor && <SaldoCuenta saldo={cuenta.saldo} esDeudor moneda={moneda} />}</View>{divider}<View style={styles.half}>{!cuenta.esSaldoDeudor && <SaldoCuenta saldo={cuenta.saldo} esDeudor={false} moneda={moneda} />}</View></View>
  </Card>;
}
const styles = StyleSheet.create({ card: { marginBottom: 16, padding: 12 }, header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 8, borderBottomWidth: 2, borderBottomColor: theme.colors.primary }, titleBox: { flex: 1, flexDirection: 'row', alignItems: 'center' }, code: { color: theme.colors.primary, fontFamily: 'monospace', fontWeight: '700', fontSize: 14, marginRight: 8 }, name: { color: theme.colors.textPrimary, fontSize: 14, fontWeight: '700' }, columnHeaders: { flexDirection: 'row', paddingVertical: 5, borderBottomWidth: 1, borderBottomColor: theme.colors.border }, columnTitle: { flex: 1, textAlign: 'center', fontSize: 11, fontWeight: '700' }, divider: { width: 1, backgroundColor: theme.colors.border }, body: { flexDirection: 'row', minHeight: 50 }, subtotals: { flexDirection: 'row', backgroundColor: theme.colors.surfaceVariant, borderTopWidth: 1, borderTopColor: theme.colors.border }, total: { flex: 1, padding: 8, textAlign: 'right', fontFamily: 'monospace', fontSize: 12, fontWeight: '700' }, balance: { flexDirection: 'row', borderTopWidth: 2, borderTopColor: theme.colors.primary, paddingTop: 7 }, half: { flex: 1, paddingHorizontal: 8 }, });
