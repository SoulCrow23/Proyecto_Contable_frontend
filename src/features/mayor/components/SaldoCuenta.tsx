import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Money } from '../../../lib/math/money';
import { formatCurrency } from '../../../utils/formatters/currency';
import { theme } from '../../../components/ui/theme/theme';

interface Props { saldo: string; esDeudor: boolean; moneda: string; }
export function SaldoCuenta({ saldo, esDeudor, moneda }: Props) {
  return <View style={styles.container}><Text style={styles.label}>Saldo {esDeudor ? 'Deudor' : 'Acreedor'}:</Text><Text style={styles.amount}>{formatCurrency(Money.from(saldo), moneda)}</Text></View>;
}
const styles = StyleSheet.create({ container: { alignItems: 'flex-end' }, label: { color: theme.colors.textSecondary, fontSize: 11, fontWeight: '700' }, amount: { color: theme.colors.primary, fontFamily: 'monospace', fontSize: 13, fontWeight: '800', textDecorationLine: 'underline' } });
