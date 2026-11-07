import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Money } from '../../../lib/math/money';
import { formatCurrency } from '../../../utils/formatters/currency';
import { CuentaMayorDetalle } from '../../../types/contabilidad.types';
import { theme } from '../../../components/ui/theme/theme';

interface Props { movimientos: CuentaMayorDetalle['movimientos']; side: 'DEBE' | 'HABER'; moneda: string; }

export function MovimientoMayorColumn({ movimientos, side, moneda }: Props) {
  const amountKey = side === 'DEBE' ? 'debe' : 'haber';
  const color = side === 'DEBE' ? theme.colors.debe : theme.colors.haber;
  return <View style={styles.column}>{movimientos.filter((movimiento) => Money.from(movimiento[amountKey]).isPositive()).map((movimiento) => <View key={`${movimiento.asientoNumero}-${amountKey}`} style={styles.row}><Text style={styles.meta}>A#{movimiento.asientoNumero}</Text><Text style={[styles.amount, { color }]}>{formatCurrency(movimiento[amountKey], moneda)}</Text></View>)}</View>;
}

const styles = StyleSheet.create({ column: { flex: 1, paddingHorizontal: 8, paddingVertical: 6 }, row: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 2 }, meta: { color: theme.colors.textMuted, fontSize: 10 }, amount: { fontFamily: 'monospace', fontSize: 11, fontWeight: '600' } });
