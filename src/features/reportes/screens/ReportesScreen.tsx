import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { theme } from '../../../components/ui/theme/theme';
import { Card } from '../../../components/ui/Card';
import { useContabilidadStore } from '../../../store/contabilidadStore';
import { formatCurrency } from '../../../utils/formatters/currency';
import { Money } from '../../../lib/math/money';
import {
  generarHtmlBalanceGeneral,
  generarHtmlEstadoResultados,
  generarHtmlBalanza,
} from '../../../lib/export/pdfTemplates';
import { generarCsvBalanza } from '../../../lib/export/csvTemplates';
import { exportarAPdf, exportarACsv } from '../../../lib/export/exportService';

type SubReporte = 'BALANZA' | 'RESULTADOS' | 'BALANCE_GRAL';

export const ReportesScreen: React.FC = () => {
  const [subReporte, setSubReporte] = useState<SubReporte>('BALANZA');
  const [exportando, setExportando] = useState(false);

  const generarBalanzaComprobacion = useContabilidadStore((s) => s.generarBalanzaComprobacion);
  const generarEstadoResultados = useContabilidadStore((s) => s.generarEstadoResultados);
  const generarBalanceGeneral = useContabilidadStore((s) => s.generarBalanceGeneral);
  const cuentas = useContabilidadStore((s) => s.cuentas);
  const asientos = useContabilidadStore((s) => s.asientos);
  const empresa = useContabilidadStore((s) => s.empresa);

  // Las salidas de reportes son objetos nuevos; memorizarlas evita ciclos de suscripción de Zustand.
  const balanza = useMemo(
    () => generarBalanzaComprobacion(),
    [generarBalanzaComprobacion, cuentas, asientos]
  );
  const estadoResultados = useMemo(
    () => generarEstadoResultados(),
    [generarEstadoResultados, cuentas, asientos]
  );
  const balanceGeneral = useMemo(
    () => generarBalanceGeneral(),
    [generarBalanceGeneral, cuentas, asientos]
  );

  const handleExportarBalanzaPdf = async () => {
    setExportando(true);
    try {
      const html = generarHtmlBalanza(empresa, balanza);
      await exportarAPdf({
        html,
        filename: `Balanza_Comprobacion_${empresa.periodoContable.replace(/\s+/g, '_')}.pdf`,
        title: 'Balanza de Comprobación',
      });
    } finally {
      setExportando(false);
    }
  };

  const handleExportarBalanzaCsv = async () => {
    setExportando(true);
    try {
      const csv = generarCsvBalanza(empresa, balanza);
      await exportarACsv({
        csvContent: csv,
        filename: `Balanza_Comprobacion_${empresa.periodoContable.replace(/\s+/g, '_')}.csv`,
        title: 'Balanza de Comprobación CSV',
      });
    } finally {
      setExportando(false);
    }
  };

  const handleExportarResultadosPdf = async () => {
    setExportando(true);
    try {
      const html = generarHtmlEstadoResultados(empresa, estadoResultados);
      await exportarAPdf({
        html,
        filename: `Estado_Resultados_${empresa.periodoContable.replace(/\s+/g, '_')}.pdf`,
        title: 'Estado de Resultados',
      });
    } finally {
      setExportando(false);
    }
  };

  const handleExportarBalanceGeneralPdf = async () => {
    setExportando(true);
    try {
      const html = generarHtmlBalanceGeneral(empresa, balanceGeneral);
      await exportarAPdf({
        html,
        filename: `Balance_General_${balanceGeneral.fechaCorte}.pdf`,
        title: 'Balance General',
      });
    } finally {
      setExportando(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Sub-Tabs de Estados Financieros */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, subReporte === 'BALANZA' && styles.tabActive]}
          onPress={() => setSubReporte('BALANZA')}
        >
          <Text style={[styles.tabText, subReporte === 'BALANZA' && styles.tabTextActive]}>
            Balanza Comprobación
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, subReporte === 'RESULTADOS' && styles.tabActive]}
          onPress={() => setSubReporte('RESULTADOS')}
        >
          <Text style={[styles.tabText, subReporte === 'RESULTADOS' && styles.tabTextActive]}>
            Estado Resultados
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, subReporte === 'BALANCE_GRAL' && styles.tabActive]}
          onPress={() => setSubReporte('BALANCE_GRAL')}
        >
          <Text style={[styles.tabText, subReporte === 'BALANCE_GRAL' && styles.tabTextActive]}>
            Balance General
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {subReporte === 'BALANZA' && (
          <View>
            <View
              style={[
                styles.cuadreBadge,
                balanza.estaCuadrada ? styles.cuadreBadgeOk : styles.cuadreBadgeError,
              ]}
            >
              <Text style={styles.cuadreBadgeText}>
                {balanza.estaCuadrada
                  ? '✅ BALANZA CUADRADA: Sumas de Movimientos y Saldos Iguales'
                  : '⚠️ DESCUADRE DETECTADO EN LA BALANZA'}
              </Text>
            </View>

            <Card variant="elevated">
              <View style={styles.cardHeaderRow}>
                <View>
                  <Text style={styles.reportTitle}>Balanza de Comprobación</Text>
                  <Text style={styles.reportSubtitle}>{empresa.periodoContable}</Text>
                </View>
                <View style={styles.exportButtonsRow}>
                  <TouchableOpacity
                    style={[styles.btnExport, styles.btnExportPdf]}
                    onPress={handleExportarBalanzaPdf}
                    disabled={exportando}
                  >
                    <Text style={styles.btnExportPdfText}>📄 PDF</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.btnExport, styles.btnExportCsv]}
                    onPress={handleExportarBalanzaCsv}
                    disabled={exportando}
                  >
                    <Text style={styles.btnExportCsvText}>📊 Excel/CSV</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Encabezado */}
              <View style={styles.tableHeader}>
                <Text style={[styles.th, { flex: 2 }]}>Cuenta</Text>
                <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>Mov. Debe</Text>
                <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>Mov. Haber</Text>
                <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>Saldo Deudor</Text>
                <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>Saldo Acreedor</Text>
              </View>

              {balanza.filas.map((fila) => {
                const tieneMov =
                  !Money.from(fila.movimientoDebe).isZero() ||
                  !Money.from(fila.movimientoHaber).isZero();
                if (!tieneMov) return null;

                return (
                  <View key={fila.codigo} style={styles.tableRow}>
                    <View style={{ flex: 2 }}>
                      <Text style={styles.tdCode}>{fila.codigo}</Text>
                      <Text style={styles.tdName} numberOfLines={1}>
                        {fila.nombre}
                      </Text>
                    </View>
                    <Text style={[styles.tdMonto, { flex: 1 }]}>
                      {formatCurrency(fila.movimientoDebe, '')}
                    </Text>
                    <Text style={[styles.tdMonto, { flex: 1 }]}>
                      {formatCurrency(fila.movimientoHaber, '')}
                    </Text>
                    <Text style={[styles.tdMonto, { flex: 1, color: theme.colors.debe }]}>
                      {!Money.from(fila.saldoDeudor).isZero()
                        ? formatCurrency(fila.saldoDeudor, '')
                        : '-'}
                    </Text>
                    <Text style={[styles.tdMonto, { flex: 1, color: theme.colors.haber }]}>
                      {!Money.from(fila.saldoAcreedor).isZero()
                        ? formatCurrency(fila.saldoAcreedor, '')
                        : '-'}
                    </Text>
                  </View>
                );
              })}

              {/* Totales */}
              <View style={styles.tableFooter}>
                <Text style={[styles.tdFooterLabel, { flex: 2 }]}>TOTALES:</Text>
                <Text style={[styles.tdFooterMonto, { flex: 1 }]}>
                  {formatCurrency(balanza.totalMovDebe, '')}
                </Text>
                <Text style={[styles.tdFooterMonto, { flex: 1 }]}>
                  {formatCurrency(balanza.totalMovHaber, '')}
                </Text>
                <Text style={[styles.tdFooterMonto, { flex: 1, color: theme.colors.debe }]}>
                  {formatCurrency(balanza.totalSaldoDeudor, '')}
                </Text>
                <Text style={[styles.tdFooterMonto, { flex: 1, color: theme.colors.haber }]}>
                  {formatCurrency(balanza.totalSaldoAcreedor, '')}
                </Text>
              </View>
            </Card>
          </View>
        )}

        {subReporte === 'RESULTADOS' && (
          <Card variant="elevated">
            <View style={styles.cardHeaderRow}>
              <View>
                <Text style={styles.reportTitle}>Estado de Resultados</Text>
                <Text style={styles.reportSubtitle}>{empresa.periodoContable}</Text>
              </View>
              <View style={styles.exportButtonsRow}>
                <TouchableOpacity
                  style={[styles.btnExport, styles.btnExportPdf]}
                  onPress={handleExportarResultadosPdf}
                  disabled={exportando}
                >
                  <Text style={styles.btnExportPdfText}>📄 PDF</Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.seccionResultados}>
              <Text style={styles.seccionHeader}>1. Ingresos Operacionales</Text>
              {estadoResultados.detalles.ingresos.map((ing) => (
                <View key={ing.codigo} style={styles.lineaResultados}>
                  <Text style={styles.lineaLabel}>{ing.codigo} - {ing.nombre}</Text>
                  <Text style={styles.lineaMonto}>{formatCurrency(ing.monto, empresa.moneda)}</Text>
                </View>
              ))}
              <View style={styles.subtotalRow}>
                <Text style={styles.subtotalLabel}>Total Ingresos:</Text>
                <Text style={styles.subtotalMonto}>
                  {formatCurrency(estadoResultados.ingresosTotales, empresa.moneda)}
                </Text>
              </View>
            </View>

            <View style={styles.seccionResultados}>
              <Text style={styles.seccionHeader}>2. Costo de Ventas</Text>
              {estadoResultados.detalles.costos.map((c) => (
                <View key={c.codigo} style={styles.lineaResultados}>
                  <Text style={styles.lineaLabel}>{c.codigo} - {c.nombre}</Text>
                  <Text style={styles.lineaMonto}>{formatCurrency(c.monto, empresa.moneda)}</Text>
                </View>
              ))}
              <View style={styles.subtotalRow}>
                <Text style={styles.subtotalLabel}>Total Costos:</Text>
                <Text style={styles.subtotalMonto}>
                  {formatCurrency(estadoResultados.costoVentas, empresa.moneda)}
                </Text>
              </View>
            </View>

            {/* Utilidad Bruta */}
            <View style={styles.highlightRow}>
              <Text style={styles.highlightLabel}>(=) UTILIDAD BRUTA EN VENTAS</Text>
              <Text style={styles.highlightMonto}>
                {formatCurrency(estadoResultados.utilidadBruta, empresa.moneda)}
              </Text>
            </View>

            <View style={styles.seccionResultados}>
              <Text style={styles.seccionHeader}>3. Gastos de Operación</Text>
              {estadoResultados.detalles.gastos.map((g) => (
                <View key={g.codigo} style={styles.lineaResultados}>
                  <Text style={styles.lineaLabel}>{g.codigo} - {g.nombre}</Text>
                  <Text style={styles.lineaMonto}>{formatCurrency(g.monto, empresa.moneda)}</Text>
                </View>
              ))}
              <View style={styles.subtotalRow}>
                <Text style={styles.subtotalLabel}>Total Gastos Operativos:</Text>
                <Text style={styles.subtotalMonto}>
                  {formatCurrency(estadoResultados.gastosOperativos, empresa.moneda)}
                </Text>
              </View>
            </View>

            {/* Utilidad Neta */}
            <View
              style={[
                styles.totalFinalRow,
                Money.from(estadoResultados.utilidadNeta).isPositive()
                  ? styles.totalFinalPositivo
                  : styles.totalFinalNegativo,
              ]}
            >
              <Text style={styles.totalFinalLabel}>
                (=) {Money.from(estadoResultados.utilidadNeta).isPositive() ? 'UTILIDAD NETA DEL EJERCICIO' : 'PÉRDIDA DEL EJERCICIO'}
              </Text>
              <Text style={styles.totalFinalMonto}>
                {formatCurrency(estadoResultados.utilidadNeta, empresa.moneda)}
              </Text>
            </View>
          </Card>
        )}

        {subReporte === 'BALANCE_GRAL' && (
          <View>
            {/* Banner Ecuación Contable */}
            <View
              style={[
                styles.cuadreBadge,
                balanceGeneral.estaBalanceado ? styles.cuadreBadgeOk : styles.cuadreBadgeError,
              ]}
            >
              <Text style={styles.cuadreBadgeText}>
                {balanceGeneral.estaBalanceado
                  ? '✅ ECUACIÓN CONTABLE COMPROBADA: Activo = Pasivo + Capital (Dif: C$ 0.00)'
                  : `⚠️ DESCUADRE PATRIMONIAL: Diferencia de ${formatCurrency(balanceGeneral.diferenciaCuadre, empresa.moneda)}`}
              </Text>
            </View>

            <Card variant="elevated">
              <View style={styles.cardHeaderRow}>
                <View>
                  <Text style={styles.reportTitle}>Balance General Clasificado</Text>
                  <Text style={styles.reportSubtitle}>Al corte: {balanceGeneral.fechaCorte}</Text>
                </View>
                <View style={styles.exportButtonsRow}>
                  <TouchableOpacity
                    style={[styles.btnExport, styles.btnExportPdf]}
                    onPress={handleExportarBalanceGeneralPdf}
                    disabled={exportando}
                  >
                    <Text style={styles.btnExportPdfText}>📄 PDF</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* ACTIVOS */}
              <View style={styles.balanceSection}>
                <Text style={styles.balanceSectionTitle}>ACTIVO</Text>

                <Text style={styles.rubroTitle}>Activo Corriente</Text>
                {balanceGeneral.activosCorrientes.map((a) => (
                  <View key={a.codigo} style={styles.balanceRow}>
                    <Text style={styles.balanceItemName}>{a.codigo} - {a.nombre}</Text>
                    <Text style={styles.balanceItemMonto}>{formatCurrency(a.monto, empresa.moneda)}</Text>
                  </View>
                ))}
                <View style={styles.subtotalBalanceRow}>
                  <Text style={styles.subtotalBalanceLabel}>Total Activo Corriente:</Text>
                  <Text style={styles.subtotalBalanceMonto}>
                    {formatCurrency(balanceGeneral.totalActivosCorrientes, empresa.moneda)}
                  </Text>
                </View>

                <Text style={[styles.rubroTitle, { marginTop: 10 }]}>Activo No Corriente</Text>
                {balanceGeneral.activosNoCorrientes.map((a) => (
                  <View key={a.codigo} style={styles.balanceRow}>
                    <Text style={styles.balanceItemName}>{a.codigo} - {a.nombre}</Text>
                    <Text style={styles.balanceItemMonto}>{formatCurrency(a.monto, empresa.moneda)}</Text>
                  </View>
                ))}
                <View style={styles.subtotalBalanceRow}>
                  <Text style={styles.subtotalBalanceLabel}>Total Activo No Corriente:</Text>
                  <Text style={styles.subtotalBalanceMonto}>
                    {formatCurrency(balanceGeneral.totalActivosNoCorrientes, empresa.moneda)}
                  </Text>
                </View>

                {/* TOTAL ACTIVO */}
                <View style={styles.totalActivoRow}>
                  <Text style={styles.totalActivoLabel}>TOTAL ACTIVO</Text>
                  <Text style={styles.totalActivoMonto}>
                    {formatCurrency(balanceGeneral.totalActivos, empresa.moneda)}
                  </Text>
                </View>
              </View>

              {/* PASIVOS */}
              <View style={[styles.balanceSection, { marginTop: 16 }]}>
                <Text style={styles.balanceSectionTitle}>PASIVO</Text>

                <Text style={styles.rubroTitle}>Pasivo Corriente</Text>
                {balanceGeneral.pasivosCorrientes.map((p) => (
                  <View key={p.codigo} style={styles.balanceRow}>
                    <Text style={styles.balanceItemName}>{p.codigo} - {p.nombre}</Text>
                    <Text style={styles.balanceItemMonto}>{formatCurrency(p.monto, empresa.moneda)}</Text>
                  </View>
                ))}
                <View style={styles.subtotalBalanceRow}>
                  <Text style={styles.subtotalBalanceLabel}>Total Pasivo Corriente:</Text>
                  <Text style={styles.subtotalBalanceMonto}>
                    {formatCurrency(balanceGeneral.totalPasivosCorrientes, empresa.moneda)}
                  </Text>
                </View>

                <Text style={[styles.rubroTitle, { marginTop: 10 }]}>Pasivo No Corriente</Text>
                {balanceGeneral.pasivosNoCorrientes.map((p) => (
                  <View key={p.codigo} style={styles.balanceRow}>
                    <Text style={styles.balanceItemName}>{p.codigo} - {p.nombre}</Text>
                    <Text style={styles.balanceItemMonto}>{formatCurrency(p.monto, empresa.moneda)}</Text>
                  </View>
                ))}
                <View style={styles.subtotalBalanceRow}>
                  <Text style={styles.subtotalBalanceLabel}>Total Pasivo No Corriente:</Text>
                  <Text style={styles.subtotalBalanceMonto}>
                    {formatCurrency(balanceGeneral.totalPasivosNoCorrientes, empresa.moneda)}
                  </Text>
                </View>

                <View style={styles.subtotalBalanceRow}>
                  <Text style={[styles.subtotalBalanceLabel, { fontWeight: '700' }]}>TOTAL PASIVO:</Text>
                  <Text style={[styles.subtotalBalanceMonto, { fontWeight: '700' }]}>
                    {formatCurrency(balanceGeneral.totalPasivos, empresa.moneda)}
                  </Text>
                </View>
              </View>

              {/* CAPITAL CONTABLE */}
              <View style={[styles.balanceSection, { marginTop: 16 }]}>
                <Text style={styles.balanceSectionTitle}>CAPITAL CONTABLE</Text>

                <View style={styles.balanceRow}>
                  <Text style={styles.balanceItemName}>3.1.01 - Capital Social</Text>
                  <Text style={styles.balanceItemMonto}>
                    {formatCurrency(balanceGeneral.capitalSocial, empresa.moneda)}
                  </Text>
                </View>

                <View style={styles.balanceRow}>
                  <Text style={styles.balanceItemName}>Utilidad Neta del Periodo</Text>
                  <Text style={styles.balanceItemMonto}>
                    {formatCurrency(balanceGeneral.utilidadDelPeriodo, empresa.moneda)}
                  </Text>
                </View>

                <View style={styles.subtotalBalanceRow}>
                  <Text style={styles.subtotalBalanceLabel}>Total Capital Contable:</Text>
                  <Text style={styles.subtotalBalanceMonto}>
                    {formatCurrency(balanceGeneral.totalCapitalContable, empresa.moneda)}
                  </Text>
                </View>

                {/* TOTAL PASIVO + CAPITAL */}
                <View style={styles.totalPasivoCapRow}>
                  <Text style={styles.totalPasivoCapLabel}>TOTAL PASIVO + CAPITAL</Text>
                  <Text style={styles.totalPasivoCapMonto}>
                    {formatCurrency(balanceGeneral.totalPasivoMasCapital, empresa.moneda)}
                  </Text>
                </View>
              </View>
            </Card>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
  },
  tabActive: {
    backgroundColor: theme.colors.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  tabTextActive: {
    color: theme.colors.textInverse,
    fontWeight: '700',
  },
  content: {
    padding: theme.spacing.md,
  },
  cuadreBadge: {
    padding: 10,
    borderRadius: theme.borderRadius.sm,
    marginBottom: 12,
    alignItems: 'center',
  },
  cuadreBadgeOk: {
    backgroundColor: theme.colors.surfaceVariant,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cuadreBadgeError: {
    backgroundColor: theme.colors.surfaceVariant,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cuadreBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.cuadrado,
  },
  reportTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    textAlign: 'center',
  },
  reportSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: 14,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: theme.borderRadius.sm,
    marginBottom: 4,
  },
  th: {
    fontSize: 10,
    fontWeight: '700',
    color: theme.colors.textInverse,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    alignItems: 'center',
  },
  tdCode: {
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  tdName: {
    fontSize: 11,
    color: theme.colors.textPrimary,
  },
  tdMonto: {
    fontFamily: 'monospace',
    fontSize: 11,
    textAlign: 'right',
    color: theme.colors.textPrimary,
  },
  tableFooter: {
    flexDirection: 'row',
    paddingTop: 8,
    paddingHorizontal: 6,
    marginTop: 6,
    borderTopWidth: 2,
    borderTopColor: theme.colors.primary,
  },
  tdFooterLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  tdFooterMonto: {
    fontFamily: 'monospace',
    fontSize: 11,
    fontWeight: '800',
    textAlign: 'right',
    color: theme.colors.textPrimary,
  },
  // Estado Resultados
  seccionResultados: {
    marginVertical: 6,
  },
  seccionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    paddingBottom: 2,
  },
  lineaResultados: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  lineaLabel: {
    fontSize: 12,
    color: theme.colors.textPrimary,
  },
  lineaMonto: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: theme.colors.textPrimary,
  },
  subtotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  subtotalLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  subtotalMonto: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  highlightRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surfaceVariant,
    padding: 10,
    borderRadius: theme.borderRadius.sm,
    marginVertical: 10,
  },
  highlightLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  highlightMonto: {
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.primary,
  },
  totalFinalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    borderRadius: theme.borderRadius.sm,
    marginTop: 14,
  },
  totalFinalPositivo: {
    backgroundColor: theme.colors.surfaceVariant,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  totalFinalNegativo: {
    backgroundColor: theme.colors.surfaceVariant,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  totalFinalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.cuadrado,
  },
  totalFinalMonto: {
    fontFamily: 'monospace',
    fontSize: 15,
    fontWeight: '800',
    color: theme.colors.cuadrado,
  },
  // Balance General
  balanceSection: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    paddingBottom: 10,
  },
  balanceSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.primary,
    marginBottom: 6,
  },
  rubroTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 3,
    paddingHorizontal: 8,
  },
  balanceItemName: {
    fontSize: 12,
    color: theme.colors.textPrimary,
  },
  balanceItemMonto: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: theme.colors.textPrimary,
  },
  subtotalBalanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
    marginTop: 2,
  },
  subtotalBalanceLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  subtotalBalanceMonto: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  totalActivoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surfaceVariant,
    padding: 10,
    borderRadius: theme.borderRadius.sm,
    marginTop: 10,
  },
  totalActivoLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.accent,
  },
  totalActivoMonto: {
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.accent,
  },
  totalPasivoCapRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.surfaceVariant,
    padding: 10,
    borderRadius: theme.borderRadius.sm,
    marginTop: 10,
  },
  totalPasivoCapLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: theme.colors.cuadrado,
  },
  totalPasivoCapMonto: {
    fontFamily: 'monospace',
    fontSize: 14,
    fontWeight: '800',
    color: theme.colors.cuadrado,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
    gap: 8,
  },
  exportButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  btnExport: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
  },
  btnExportPdf: {
    backgroundColor: theme.colors.surfaceVariant,
    borderColor: theme.colors.border,
  },
  btnExportPdfText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.accent,
  },
  btnExportCsv: {
    backgroundColor: theme.colors.surfaceVariant,
    borderColor: theme.colors.border,
  },
  btnExportCsvText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.cuadrado,
  },
});
