import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Money } from '../../../lib/math/money';
import { formatCurrency } from '../../../utils/formatters/currency';
import { theme } from '../../../components/ui/theme/theme';

interface Props {
  totalDebe: Money;
  totalHaber: Money;
  diferencia: Money;
  estaCuadrado: boolean;
  moneda: string;
  onGuardar: () => void;
}

export function BalanceIndicator({ totalDebe, totalHaber, diferencia, estaCuadrado, moneda, onGuardar }: Props) {
  return <View style={styles.container}>
    <View>
      <Text style={styles.totals}>Debe: {formatCurrency(totalDebe, moneda)} | Haber: {formatCurrency(totalHaber, moneda)}</Text>
      <Text style={[styles.status, { color: estaCuadrado ? theme.colors.cuadrado : theme.colors.descuadrado }]}>
        {estaCuadrado ? 'PARTIDA DOBLE CUADRADA' : `DESCUADRADO · Diferencia: ${formatCurrency(diferencia, moneda)}`}
      </Text>
    </View>
    <TouchableOpacity disabled={!estaCuadrado} onPress={onGuardar} style={[styles.button, !estaCuadrado && styles.disabled]}>
      <Text style={styles.buttonText}>Guardar asiento</Text>
    </TouchableOpacity>
  </View>;
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, borderTopWidth: 1, borderTopColor: theme.colors.border, backgroundColor: theme.colors.surfaceVariant },
  totals: { fontSize: 14, fontWeight: '700', color: theme.colors.textPrimary },
  status: { fontSize: 13, fontWeight: '700', marginTop: 3 },
  button: { backgroundColor: theme.colors.primary, paddingHorizontal: 16, paddingVertical: 10, borderRadius: theme.borderRadius.sm },
  disabled: { backgroundColor: theme.colors.textMuted },
  buttonText: { color: theme.colors.textInverse, fontSize: 14, fontWeight: '700' },
});
