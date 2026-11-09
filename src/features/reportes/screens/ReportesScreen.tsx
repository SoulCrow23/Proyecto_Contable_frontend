import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { theme } from '../../../components/ui/theme/theme';
import { generarCsvBalanza } from '../../../lib/export/csvTemplates';
import { generarHtmlBalanceGeneral, generarHtmlBalanza, generarHtmlEstadoResultados } from '../../../lib/export/pdfTemplates';
import { exportarACsv, exportarAPdf } from '../../../lib/export/exportService';
import { useContabilidadStore } from '../../../store/contabilidadStore';
import { BalanceGeneralReport } from '../components/BalanceGeneralReport';
import { BalanzaComprobacionReport } from '../components/BalanzaComprobacionReport';
import { EstadoResultadosReport } from '../components/EstadoResultadosReport';
import { ReportTabs, SubReporte } from '../components/ReportTabs';

export const ReportesScreen: React.FC = () => {
  const [subReporte, setSubReporte] = useState<SubReporte>('BALANZA');
  const [exportando, setExportando] = useState(false);
  const generarBalanzaComprobacion = useContabilidadStore((s) => s.generarBalanzaComprobacion);
  const generarEstadoResultados = useContabilidadStore((s) => s.generarEstadoResultados);
  const generarBalanceGeneral = useContabilidadStore((s) => s.generarBalanceGeneral);
  const cuentas = useContabilidadStore((s) => s.cuentas);
  const asientos = useContabilidadStore((s) => s.asientos);
  const empresa = useContabilidadStore((s) => s.empresa);

  // El store ya dispara el render cuando cambian cuentas o asientos. Calcular aquí
  // evita suscribirse a objetos derivados nuevos y previene ciclos de actualización.
  void cuentas;
  void asientos;
  const balanza = generarBalanzaComprobacion();
  const estadoResultados = generarEstadoResultados();
  const balanceGeneral = generarBalanceGeneral();

  const exportar = async (operation: () => Promise<void>) => { setExportando(true); try { await operation(); } finally { setExportando(false); } };
  const exportarBalanzaPdf = () => exportar(() => exportarAPdf({ html: generarHtmlBalanza(empresa, balanza), filename: `Balanza_Comprobacion_${empresa.periodoContable.replace(/\s+/g, '_')}.pdf`, title: 'Balanza de Comprobación' }));
  const exportarBalanzaCsv = () => exportar(() => exportarACsv({ csvContent: generarCsvBalanza(empresa, balanza), filename: `Balanza_Comprobacion_${empresa.periodoContable.replace(/\s+/g, '_')}.csv`, title: 'Balanza de Comprobación CSV' }));
  const exportarResultadosPdf = () => exportar(() => exportarAPdf({ html: generarHtmlEstadoResultados(empresa, estadoResultados), filename: `Estado_Resultados_${empresa.periodoContable.replace(/\s+/g, '_')}.pdf`, title: 'Estado de Resultados' }));
  const exportarBalancePdf = () => exportar(() => exportarAPdf({ html: generarHtmlBalanceGeneral(empresa, balanceGeneral), filename: `Balance_General_${balanceGeneral.fechaCorte}.pdf`, title: 'Balance General' }));

  return <View style={styles.container}><ReportTabs activeReport={subReporte} onChange={setSubReporte} /><ScrollView contentContainerStyle={styles.content}>{subReporte === 'BALANZA' && <BalanzaComprobacionReport empresa={empresa} balanza={balanza} exporting={exportando} actions={[{ label: 'PDF', variant: 'pdf', onPress: exportarBalanzaPdf }, { label: 'Excel/CSV', variant: 'csv', onPress: exportarBalanzaCsv }]} />}{subReporte === 'RESULTADOS' && <EstadoResultadosReport empresa={empresa} estado={estadoResultados} exporting={exportando} actions={[{ label: 'PDF', variant: 'pdf', onPress: exportarResultadosPdf }]} />}{subReporte === 'BALANCE_GRAL' && <BalanceGeneralReport empresa={empresa} balance={balanceGeneral} exporting={exportando} actions={[{ label: 'PDF', variant: 'pdf', onPress: exportarBalancePdf }]} />}</ScrollView></View>;
};

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: theme.colors.background }, content: { padding: theme.spacing.md } });
