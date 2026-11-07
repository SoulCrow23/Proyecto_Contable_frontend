import React, { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { theme } from '../../../components/ui/theme/theme';
import { useContabilidadStore } from '../../../store/contabilidadStore';
import { CuentaTCard } from '../components/CuentaTCard';
import { MayorFilter, MayorFilterBar } from '../components/MayorFilterBar';

export const LibroMayorScreen: React.FC = () => {
  const obtenerLibroMayor = useContabilidadStore((state) => state.obtenerLibroMayor);
  const cuentas = useContabilidadStore((state) => state.cuentas);
  const asientos = useContabilidadStore((state) => state.asientos);
  const empresa = useContabilidadStore((state) => state.empresa);
  const [filtro, setFiltro] = useState<MayorFilter>('CON_MOVIMIENTO');

  // El reporte se recalcula únicamente cuando sus fuentes contables cambian.
  const libroMayor = useMemo(() => obtenerLibroMayor(), [obtenerLibroMayor, cuentas, asientos]);
  const cuentasActivas = useMemo(() => libroMayor.filter((cuenta) => cuenta.movimientos.length > 0), [libroMayor]);
  const cuentasVisibles = filtro === 'CON_MOVIMIENTO' ? cuentasActivas : libroMayor;

  return <View style={styles.container}>
    <MayorFilterBar value={filtro} activeCount={cuentasActivas.length} totalCount={libroMayor.length} onChange={setFiltro} />
    <ScrollView contentContainerStyle={styles.list}>
      {cuentasVisibles.length === 0 ? <View style={styles.empty}><Text style={styles.emptyText}>No hay movimientos registrados para mostrar en el Mayor.</Text></View> : cuentasVisibles.map((cuenta) => <CuentaTCard key={cuenta.codigo} cuenta={cuenta} moneda={empresa.moneda} />)}
    </ScrollView>
  </View>;
};

const styles = StyleSheet.create({ container: { flex: 1, backgroundColor: theme.colors.background }, list: { paddingTop: 16, paddingBottom: 20 }, empty: { padding: 40, alignItems: 'center' }, emptyText: { color: theme.colors.textSecondary, fontSize: 14 } });
