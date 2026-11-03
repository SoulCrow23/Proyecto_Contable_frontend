import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '../../../shared/theme/theme';
import { Card } from '../../../shared/components/Card';
import { Badge } from '../../../shared/components/Badge';
import { useContabilidadStore } from '../../../store/contabilidadStore';
import { formatCurrency, formatDate } from '../../../shared/formatters/currency';
import { Money } from '../../../shared/math/money';
import { CuentaMayorDetalle } from '../../../shared/types/contabilidad.types';

export const LibroMayorScreen: React.FC = () => {
  const libroMayor = useContabilidadStore((s) => s.obtenerLibroMayor());
  const empresa = useContabilidadStore((s) => s.empresa);

  const [filtro, setFiltro] = useState<'TODAS' | 'CON_MOVIMIENTO'>('CON_MOVIMIENTO');

  const cuentasFiltradas = libroMayor.filter((cuenta) => {
    if (filtro === 'CON_MOVIMIENTO') {
      return cuenta.movimientos.length > 0;
    }
    return true;
  });

  return (
    <View style={styles.container}>
      {/* Barra de Filtros */}
      <View style={styles.filterBar}>
        <TouchableOpacity
          style={[styles.chip, filtro === 'CON_MOVIMIENTO' && styles.chipActive]}
          onPress={() => setFiltro('CON_MOVIMIENTO')}
        >
          <Text style={[styles.chipText, filtro === 'CON_MOVIMIENTO' && styles.chipTextActive]}>
            Cuentas Activas ({libroMayor.filter((c) => c.movimientos.length > 0).length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.chip, filtro === 'TODAS' && styles.chipActive]}
          onPress={() => setFiltro('TODAS')}
        >
          <Text style={[styles.chipText, filtro === 'TODAS' && styles.chipTextActive]}>
            Todas las Cuentas ({libroMayor.length})
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {cuentasFiltradas.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay movimientos registrados para mostrar en el Mayor.</Text>
          </View>
        ) : (
          cuentasFiltradas.map((cuenta) => (
            <TarjetaCuentaT key={cuenta.codigo} cuenta={cuenta} moneda={empresa.moneda} />
          ))
        )}
      </ScrollView>
    </View>
  );
};

interface TarjetaCuentaTProps {
  cuenta: CuentaMayorDetalle;
  moneda: string;
}

const TarjetaCuentaT: React.FC<TarjetaCuentaTProps> = ({ cuenta, moneda }) => {
  const saldoMoney = Money.from(cuenta.saldo);
  const esDeudora = cuenta.esSaldoDeudor;

  return (
    <Card variant="elevated" style={styles.tCard}>
      {/* Título de la Cuenta T */}
      <View style={styles.tHeader}>
        <View style={styles.tTitleBox}>
          <Text style={styles.tCodigo}>{cuenta.codigo}</Text>
          <Text style={styles.tNombre}>{cuenta.nombre}</Text>
        </View>
        <Badge
          label={cuenta.naturaleza}
          variant={esDeudora ? 'debe' : 'haber'}
        />
      </View>

      {/* Estructura Visual de la Cuenta T */}
      <View style={styles.tStructure}>
        {/* Cabecera DEBE / HABER */}
        <View style={styles.tColHeader}>
          <Text style={[styles.tColTitle, { color: theme.colors.debe }]}>DEBE (Cargos)</Text>
          <View style={styles.verticalDivider} />
          <Text style={[styles.tColTitle, { color: theme.colors.haber }]}>HABER (Abonos)</Text>
        </View>

        {/* Movimientos */}
        <View style={styles.tBody}>
          {/* Columna Debe */}
          <View style={styles.tHalfCol}>
            {cuenta.movimientos
              .filter((m) => Money.from(m.debe).isPositive())
              .map((m, idx) => (
                <View key={idx} style={styles.movRow}>
                  <Text style={styles.movMeta}>A#{m.asientoNumero}</Text>
                  <Text style={[styles.movMonto, { color: theme.colors.debe }]}>
                    {formatCurrency(m.debe, moneda)}
                  </Text>
                </View>
              ))}
          </View>

          {/* Línea divisoria central de la T */}
          <View style={styles.verticalDividerBody} />

          {/* Columna Haber */}
          <View style={styles.tHalfCol}>
            {cuenta.movimientos
              .filter((m) => Money.from(m.haber).isPositive())
              .map((m, idx) => (
                <View key={idx} style={styles.movRow}>
                  <Text style={styles.movMeta}>A#{m.asientoNumero}</Text>
                  <Text style={[styles.movMonto, { color: theme.colors.haber }]}>
                    {formatCurrency(m.haber, moneda)}
                  </Text>
                </View>
              ))}
          </View>
        </View>

        {/* Sumas de Movimientos */}
        <View style={styles.tSubtotals}>
          <View style={styles.tHalfCol}>
            <Text style={[styles.totalMovText, { color: theme.colors.debe }]}>
              {formatCurrency(cuenta.totalDebe, moneda)}
            </Text>
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.tHalfCol}>
            <Text style={[styles.totalMovText, { color: theme.colors.haber }]}>
              {formatCurrency(cuenta.totalHaber, moneda)}
            </Text>
          </View>
        </View>

        {/* Saldo Final de la Cuenta */}
        <View style={styles.tSaldoBox}>
          <View style={styles.tHalfCol}>
            {esDeudora && (
              <View style={styles.saldoContainer}>
                <Text style={styles.saldoLabel}>Saldo Deudor:</Text>
                <Text style={styles.saldoMonto}>{formatCurrency(saldoMoney, moneda)}</Text>
              </View>
            )}
          </View>
          <View style={styles.verticalDivider} />
          <View style={styles.tHalfCol}>
            {!esDeudora && (
              <View style={styles.saldoContainer}>
                <Text style={styles.saldoLabel}>Saldo Acreedor:</Text>
                <Text style={styles.saldoMonto}>{formatCurrency(saldoMoney, moneda)}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  filterBar: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surfaceVariant,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  chipActive: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  chipTextActive: {
    color: '#ffffff',
  },
  list: {
    padding: theme.spacing.md,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  tCard: {
    marginBottom: 16,
    padding: 12,
  },
  tHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 8,
    borderBottomWidth: 2,
    borderBottomColor: theme.colors.primary,
  },
  tTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  tCodigo: {
    fontFamily: 'monospace',
    fontWeight: '700',
    fontSize: 14,
    color: theme.colors.primary,
    marginRight: 8,
  },
  tNombre: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  tStructure: {
    marginTop: 6,
  },
  tColHeader: {
    flexDirection: 'row',
    paddingVertical: 4,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tColTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 11,
    fontWeight: '700',
  },
  verticalDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
  },
  verticalDividerBody: {
    width: 1,
    backgroundColor: theme.colors.border,
  },
  tBody: {
    flexDirection: 'row',
    minHeight: 50,
  },
  tHalfCol: {
    flex: 1,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  movRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  movMeta: {
    fontSize: 10,
    color: theme.colors.textMuted,
  },
  movMonto: {
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: '600',
  },
  tSubtotals: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingVertical: 4,
    backgroundColor: '#f8fafc',
  },
  totalMovText: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'right',
  },
  tSaldoBox: {
    flexDirection: 'row',
    borderTopWidth: 2,
    borderTopColor: theme.colors.primary,
    paddingTop: 6,
  },
  saldoContainer: {
    alignItems: 'flex-end',
  },
  saldoLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  saldoMonto: {
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
});
