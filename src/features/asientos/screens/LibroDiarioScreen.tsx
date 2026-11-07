import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { theme } from '../../../components/ui/theme/theme';
import { useContabilidadStore } from '../../../store/contabilidadStore';
import { AsientoForm } from '../components/AsientoForm';
import { AsientoCard } from '../components/AsientoCard';
import { useAsientoForm } from '../hooks/useAsientoForm';

export const LibroDiarioScreen: React.FC = () => {
  const asientos = useContabilidadStore((state) => state.asientos);
  const cuentas = useContabilidadStore((state) => state.cuentas);
  const empresa = useContabilidadStore((state) => state.empresa);
  const registrarAsiento = useContabilidadStore((state) => state.registrarAsiento);
  const eliminarAsiento = useContabilidadStore((state) => state.eliminarAsiento);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const guardarAsiento = async (form: ReturnType<typeof useAsientoForm>) => {
    if (!form.concepto.trim()) {
      Alert.alert('Concepto requerido', 'Describe el hecho económico antes de guardar el asiento.', [{ text: 'Entendido' }]);
      return;
    }
    if (!form.resumen.estaCuadrado) {
      Alert.alert('Partida descuadrada', `Debe y Haber deben ser iguales antes de guardar. Diferencia: ${form.resumen.diferencia.toString()}.`, [{ text: 'Entendido' }]);
      return;
    }
    const resultado = await registrarAsiento({
      fecha: form.fecha,
      concepto: form.concepto.trim(),
      movimientos: form.movimientos.map(({ ref, ...movimiento }) => ({ ...movimiento, referencia: ref })),
    });
    if (!resultado.success) {
      Alert.alert('No se pudo registrar el asiento', resultado.error, [{ text: 'Entendido' }]);
      return;
    }
    form.resetear();
    setMostrarFormulario(false);
    Alert.alert('Asiento registrado', 'El asiento fue guardado correctamente en el Libro Diario.', [{ text: 'Entendido' }]);
  };

  return <View style={styles.container}>
    <View style={styles.actions}><Text style={styles.heading}>Operaciones registradas</Text><TouchableOpacity style={styles.newButton} onPress={() => setMostrarFormulario(true)}><Text style={styles.newButtonText}>+ Nuevo asiento</Text></TouchableOpacity></View>
    {mostrarFormulario && <AsientoForm cuentas={cuentas} moneda={empresa.moneda} onClose={() => setMostrarFormulario(false)} onSave={guardarAsiento} />}
    <ScrollView contentContainerStyle={styles.list}>
      {asientos.length === 0 ? <View style={styles.empty}><Text style={styles.emptyText}>No hay asientos registrados en el Libro Diario.</Text></View> : asientos.map((asiento) => <AsientoCard key={asiento.id} asiento={asiento} moneda={empresa.moneda} onDelete={eliminarAsiento} />)}
    </ScrollView>
  </View>;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  actions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
  heading: { fontSize: 18, fontWeight: '700', color: theme.colors.textPrimary },
  newButton: { backgroundColor: theme.colors.primary, paddingHorizontal: 14, paddingVertical: 9, borderRadius: theme.borderRadius.sm }, newButtonText: { color: theme.colors.textInverse, fontSize: 14, fontWeight: '700' },
  list: { paddingTop: 16, paddingBottom: 20 }, empty: { padding: 40, alignItems: 'center' }, emptyText: { color: theme.colors.textSecondary, fontSize: 14 },
});
