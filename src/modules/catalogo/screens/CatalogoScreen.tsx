import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { theme } from '../../../shared/theme/theme';
import { Card } from '../../../shared/components/Card';
import { Badge } from '../../../shared/components/Badge';
import { useContabilidadStore } from '../../../store/contabilidadStore';
import {
  CuentaContable,
  ClasificacionCuenta,
  NaturalezaCuenta,
} from '../../../shared/types/contabilidad.types';

const CLASIFICACIONES: { id: ClasificacionCuenta; label: string; natDefault: NaturalezaCuenta }[] = [
  { id: 'ACTIVO_CORRIENTE', label: 'Activo Corriente', natDefault: 'DEUDORA' },
  { id: 'ACTIVO_NO_CORRIENTE', label: 'Activo No Corriente', natDefault: 'DEUDORA' },
  { id: 'PASIVO_CORRIENTE', label: 'Pasivo Corriente', natDefault: 'ACREEDORA' },
  { id: 'PASIVO_NO_CORRIENTE', label: 'Pasivo No Corriente', natDefault: 'ACREEDORA' },
  { id: 'CAPITAL', label: 'Capital Contable', natDefault: 'ACREEDORA' },
  { id: 'INGRESO', label: 'Ingresos', natDefault: 'ACREEDORA' },
  { id: 'COSTO', label: 'Costos', natDefault: 'DEUDORA' },
  { id: 'GASTO', label: 'Gastos Operativos', natDefault: 'DEUDORA' },
];

export const CatalogoScreen: React.FC = () => {
  const cuentas = useContabilidadStore((s) => s.cuentas);
  const agregarCuenta = useContabilidadStore((s) => s.agregarCuenta);
  const eliminarCuenta = useContabilidadStore((s) => s.eliminarCuenta);

  const [busqueda, setBusqueda] = useState('');
  const [filtroTipo, setFiltroTipo] = useState<string>('TODAS');
  const [modalVisible, setModalVisible] = useState(false);

  // Form nueva cuenta
  const [nuevoCodigo, setNuevoCodigo] = useState('');
  const [nuevoNombre, setNuevoNombre] = useState('');
  const [nuevaClasif, setNuevaClasif] = useState<ClasificacionCuenta>('ACTIVO_CORRIENTE');
  const [nuevaNat, setNuevaNat] = useState<NaturalezaCuenta>('DEUDORA');
  const [nuevaDesc, setNuevaDesc] = useState('');

  const cuentasFiltradas = cuentas.filter((c) => {
    const matchBusqueda =
      c.codigo.toLowerCase().includes(busqueda.toLowerCase()) ||
      c.nombre.toLowerCase().includes(busqueda.toLowerCase());

    if (!matchBusqueda) return false;

    if (filtroTipo === 'ACTIVO') return c.clasificacion.startsWith('ACTIVO');
    if (filtroTipo === 'PASIVO') return c.clasificacion.startsWith('PASIVO');
    if (filtroTipo === 'CAPITAL') return c.clasificacion === 'CAPITAL';
    if (filtroTipo === 'RESULTADOS') {
      return ['INGRESO', 'COSTO', 'GASTO'].includes(c.clasificacion);
    }
    return true;
  });

  const handleCrearCuenta = async () => {
    if (!nuevoCodigo.trim() || !nuevoNombre.trim()) {
      Alert.alert('Campos Incompletos', 'El código y el nombre de la cuenta son requeridos.');
      return;
    }

    const res = await agregarCuenta({
      codigo: nuevoCodigo.trim(),
      nombre: nuevoNombre.trim(),
      clasificacion: nuevaClasif,
      naturaleza: nuevaNat,
      descripcion: nuevaDesc.trim(),
      esCuentaDeMayor: true,
    });

    if (!res.success) {
      Alert.alert('Error', res.error || 'No se pudo crear la cuenta.');
      return;
    }

    setModalVisible(false);
    setNuevoCodigo('');
    setNuevoNombre('');
    setNuevaDesc('');
    Alert.alert('Éxito', `Cuenta ${nuevoCodigo} creada satisfactoriamente.`);
  };

  const handleEliminar = (cuenta: CuentaContable) => {
    Alert.alert(
      'Confirmar Eliminación',
      `¿Deseas eliminar la cuenta ${cuenta.codigo} - ${cuenta.nombre}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            const res = await eliminarCuenta(cuenta.codigo);
            if (!res.success) {
              Alert.alert('No se puede eliminar', res.error);
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Barra de Búsqueda y Acción */}
      <View style={styles.topActions}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Buscar por código o nombre..."
          placeholderTextColor="#94a3b8"
          value={busqueda}
          onChangeText={setBusqueda}
        />
        <TouchableOpacity style={styles.btnNueva} onPress={() => setModalVisible(true)}>
          <Text style={styles.btnNuevaText}>+ Nueva</Text>
        </TouchableOpacity>
      </View>

      {/* Filtros por Categoría */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterBar}
      >
        {[
          { id: 'TODAS', label: 'Todas' },
          { id: 'ACTIVO', label: 'Activos' },
          { id: 'PASIVO', label: 'Pasivos' },
          { id: 'CAPITAL', label: 'Capital' },
          { id: 'RESULTADOS', label: 'Resultados' },
        ].map((f) => {
          const isSelected = filtroTipo === f.id;
          return (
            <TouchableOpacity
              key={f.id}
              style={[styles.filterChip, isSelected && styles.filterChipSelected]}
              onPress={() => setFiltroTipo(f.id)}
            >
              <Text style={[styles.filterChipText, isSelected && styles.filterChipTextSelected]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Lista de Cuentas */}
      <ScrollView contentContainerStyle={styles.list}>
        {cuentasFiltradas.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No se encontraron cuentas contables.</Text>
          </View>
        ) : (
          cuentasFiltradas.map((cuenta) => (
            <Card key={cuenta.codigo} variant="elevated" style={styles.cuentaCard}>
              <View style={styles.cuentaHeader}>
                <View style={styles.codigoBox}>
                  <Text style={styles.codigoText}>{cuenta.codigo}</Text>
                </View>
                <View style={styles.cuentaTitleBox}>
                  <Text style={styles.cuentaNombre}>{cuenta.nombre}</Text>
                  {cuenta.descripcion ? (
                    <Text style={styles.cuentaDesc}>{cuenta.descripcion}</Text>
                  ) : null}
                </View>
                <TouchableOpacity
                  style={styles.btnDelete}
                  onPress={() => handleEliminar(cuenta)}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Text style={styles.btnDeleteText}>🗑️</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.badgeRow}>
                <Badge
                  label={cuenta.clasificacion.replace('_', ' ')}
                  variant="neutral"
                />
                <Badge
                  label={cuenta.naturaleza}
                  variant={cuenta.naturaleza === 'DEUDORA' ? 'debe' : 'haber'}
                />
              </View>
            </Card>
          ))
        )}
      </ScrollView>

      {/* Modal Nueva Cuenta */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Registrar Nueva Cuenta Contable</Text>
            <Text style={styles.modalSubtitle}>
              Ingresa los datos contables respetando la jerarquía institucional.
            </Text>

            <Text style={styles.inputLabel}>Código Contable (ej: 1.1.05)</Text>
            <TextInput
              style={styles.input}
              placeholder="Código único"
              placeholderTextColor="#94a3b8"
              value={nuevoCodigo}
              onChangeText={setNuevoCodigo}
            />

            <Text style={styles.inputLabel}>Nombre de la Cuenta</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre oficial"
              placeholderTextColor="#94a3b8"
              value={nuevoNombre}
              onChangeText={setNuevoNombre}
            />

            <Text style={styles.inputLabel}>Clasificación Contable</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.radioScroll}>
              {CLASIFICACIONES.map((cl) => {
                const sel = nuevaClasif === cl.id;
                return (
                  <TouchableOpacity
                    key={cl.id}
                    style={[styles.radioChip, sel && styles.radioChipSelected]}
                    onPress={() => {
                      setNuevaClasif(cl.id);
                      setNuevaNat(cl.natDefault);
                    }}
                  >
                    <Text style={[styles.radioChipText, sel && styles.radioChipTextSelected]}>
                      {cl.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <Text style={styles.inputLabel}>Naturaleza de Saldo</Text>
            <View style={styles.natRow}>
              {(['DEUDORA', 'ACREEDORA'] as NaturalezaCuenta[]).map((nat) => {
                const sel = nuevaNat === nat;
                return (
                  <TouchableOpacity
                    key={nat}
                    style={[
                      styles.natBtn,
                      sel && (nat === 'DEUDORA' ? styles.natBtnDebe : styles.natBtnHaber),
                    ]}
                    onPress={() => setNuevaNat(nat)}
                  >
                    <Text style={[styles.natBtnText, sel && styles.natBtnTextSelected]}>
                      {nat === 'DEUDORA' ? '🔵 Deudora (Carga)' : '🟢 Acreedora (Abona)'}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text style={styles.inputLabel}>Descripción / Observaciones</Text>
            <TextInput
              style={[styles.input, styles.inputDesc]}
              placeholder="Descripción opcional"
              placeholderTextColor="#94a3b8"
              value={nuevaDesc}
              onChangeText={setNuevaDesc}
              multiline
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.btnCancelar}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.btnCancelarText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnConfirmar} onPress={handleCrearCuenta}>
                <Text style={styles.btnConfirmarText}>Guardar Cuenta</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  topActions: {
    flexDirection: 'row',
    padding: theme.spacing.md,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: 12,
    fontSize: 13,
    color: theme.colors.textPrimary,
    marginRight: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  btnNueva: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 14,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
  },
  btnNuevaText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  filterBar: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surfaceVariant,
    marginRight: 8,
    borderWidth: 1,
    borderColor: theme.colors.borderLight,
  },
  filterChipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  filterChipTextSelected: {
    color: '#ffffff',
  },
  list: {
    padding: theme.spacing.md,
  },
  cuentaCard: {
    marginBottom: 8,
  },
  cuentaHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  codigoBox: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    marginRight: 10,
  },
  codigoText: {
    fontFamily: 'monospace',
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  cuentaTitleBox: {
    flex: 1,
  },
  cuentaNombre: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  cuentaDesc: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  btnDelete: {
    padding: 4,
  },
  btnDeleteText: {
    fontSize: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: theme.spacing.md,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    maxHeight: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginBottom: 14,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  inputDesc: {
    height: 60,
    textAlignVertical: 'top',
  },
  radioScroll: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  radioChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginRight: 6,
  },
  radioChipSelected: {
    backgroundColor: theme.colors.primary,
    borderColor: theme.colors.primary,
  },
  radioChipText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  radioChipTextSelected: {
    color: '#ffffff',
    fontWeight: '700',
  },
  natRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  natBtn: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  natBtnDebe: {
    backgroundColor: '#dbeafe',
    borderColor: '#93c5fd',
  },
  natBtnHaber: {
    backgroundColor: '#d1fae5',
    borderColor: '#6ee7b7',
  },
  natBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  natBtnTextSelected: {
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 20,
  },
  btnCancelar: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  btnCancelarText: {
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  btnConfirmar: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.sm,
  },
  btnConfirmarText: {
    color: '#ffffff',
    fontWeight: '700',
  },
});
