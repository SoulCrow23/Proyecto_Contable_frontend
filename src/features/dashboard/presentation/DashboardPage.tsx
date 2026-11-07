import React, { useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { DashboardShell } from '../../../components/ui/DashboardShell';
import { ModuloActivo } from '../../../components/ui/TabBar';
import { theme } from '../../../components/ui/theme/theme';
import { useContabilidadStore } from '../../../store/contabilidadStore';
import { EmpresaScreen } from '../../empresa';
import { CatalogoScreen } from '../../catalogo';
import { LibroDiarioScreen } from '../../asientos';
import { LibroMayorScreen } from '../../mayor';
import { ReportesScreen } from '../../reportes';

const moduleInfo: Record<ModuloActivo, { title: string; subtitle: string }> = {
  empresa: { title: 'Empresa', subtitle: 'Razón social, RUC, períodos y moneda funcional.' },
  catalogo: { title: 'Catálogo de cuentas', subtitle: 'Plan contable jerárquico y naturalezas de saldo.' },
  asientos: { title: 'Libro diario', subtitle: 'Registro cronológico con validación de partida doble.' },
  mayor: { title: 'Libro mayor', subtitle: 'Mayorización y movimientos por cuenta.' },
  reportes: { title: 'Estados financieros', subtitle: 'Balanza, resultados y balance general.' },
};

export function DashboardPage() {
  const [activeModule, setActiveModule] = useState<ModuloActivo>('asientos');
  const empresa = useContabilidadStore((state) => state.empresa);
  const isLoading = useContabilidadStore((state) => state.isLoading);
  const info = moduleInfo[activeModule];

  return (
    <DashboardShell
      activeModule={activeModule}
      onModuleChange={setActiveModule}
      title={info.title}
      subtitle={info.subtitle}
      companyName={empresa.nombre}
      period={empresa.periodoContable}
    >
      {isLoading ? (
        <View style={styles.loading}><ActivityIndicator size="large" color={theme.colors.accent} /><Text style={styles.loadingText}>Cargando información contable…</Text></View>
      ) : (
        <>
          {activeModule === 'empresa' && <EmpresaScreen />}
          {activeModule === 'catalogo' && <CatalogoScreen />}
          {activeModule === 'asientos' && <LibroDiarioScreen />}
          {activeModule === 'mayor' && <LibroMayorScreen />}
          {activeModule === 'reportes' && <ReportesScreen />}
        </>
      )}
    </DashboardShell>
  );
}

const styles = StyleSheet.create({
  loading: { minHeight: 360, alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: theme.colors.textSecondary, fontSize: 14, marginTop: 12 },
});
