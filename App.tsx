import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  ActivityIndicator,
  Text,
  Platform,
  StatusBar as NativeStatusBar,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { theme } from './src/shared/theme/theme';
import { Header } from './src/shared/components/Header';
import { TabBar, ModuloActivo } from './src/shared/components/TabBar';
import { useContabilidadStore } from './src/store/contabilidadStore';

// Módulos
import { EmpresaScreen } from './src/modules/empresa/screens/EmpresaScreen';
import { CatalogoScreen } from './src/modules/catalogo/screens/CatalogoScreen';
import { LibroDiarioScreen } from './src/modules/asientos/screens/LibroDiarioScreen';
import { LibroMayorScreen } from './src/modules/mayor/screens/LibroMayorScreen';
import { ReportesScreen } from './src/modules/reportes/screens/ReportesScreen';

export default function App() {
  const [moduloActivo, setModuloActivo] = useState<ModuloActivo>('asientos');
  const inicializar = useContabilidadStore((s) => s.inicializar);
  const isLoading = useContabilidadStore((s) => s.isLoading);

  useEffect(() => {
    inicializar();
  }, [inicializar]);

  const getModuloInfo = () => {
    switch (moduloActivo) {
      case 'empresa':
        return {
          title: 'Configuración de Empresa',
          subtitle: 'Razón social, RUC, periodos y moneda funcional',
        };
      case 'catalogo':
        return {
          title: 'Catálogo de Cuentas',
          subtitle: 'Plan contable jerárquico y naturalezas de saldo',
        };
      case 'asientos':
        return {
          title: 'Libro Diario',
          subtitle: 'Registro cronológico con validación de Partida Doble',
        };
      case 'mayor':
        return {
          title: 'Libro Mayor',
          subtitle: 'Esquemas de mayorización y Cuentas T',
        };
      case 'reportes':
        return {
          title: 'Estados Financieros',
          subtitle: 'Balanza de Comprobación, Balance General y Resultados',
        };
    }
  };

  const info = getModuloInfo();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      {/* Header Institucional */}
      <Header title={info.title} subtitle={info.subtitle} />

      {/* Barra de Navegación Modular */}
      <TabBar activo={moduloActivo} onCambiar={setModuloActivo} />

      {/* Contenido Modular */}
      <View style={styles.content}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={styles.loadingText}>Cargando sistema contable...</Text>
          </View>
        ) : (
          <>
            {moduloActivo === 'empresa' && <EmpresaScreen />}
            {moduloActivo === 'catalogo' && <CatalogoScreen />}
            {moduloActivo === 'asientos' && <LibroDiarioScreen />}
            {moduloActivo === 'mayor' && <LibroMayorScreen />}
            {moduloActivo === 'reportes' && <ReportesScreen />}
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    paddingTop: Platform.OS === 'android' ? NativeStatusBar.currentHeight : 0,
  },
  content: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 13,
    color: theme.colors.textSecondary,
  },
});
