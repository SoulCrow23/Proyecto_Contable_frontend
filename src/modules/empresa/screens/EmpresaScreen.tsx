import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { theme } from '../../../shared/theme/theme';
import { Card } from '../../../shared/components/Card';
import { useContabilidadStore } from '../../../store/contabilidadStore';
import { Empresa } from '../../../shared/types/contabilidad.types';

export const EmpresaScreen: React.FC = () => {
  const empresa = useContabilidadStore((s) => s.empresa);
  const actualizarEmpresa = useContabilidadStore((s) => s.actualizarEmpresa);
  const restablecerDatosDemo = useContabilidadStore((s) => s.restablecerDatosDemo);

  const [editando, setEditando] = useState(false);
  const [formData, setFormData] = useState<Empresa>(empresa);

  const handleGuardar = async () => {
    if (!formData.nombre.trim()) {
      Alert.alert('Error', 'La razón social de la empresa es obligatoria.');
      return;
    }
    await actualizarEmpresa(formData);
    setEditando(false);
    Alert.alert('Éxito', 'Los datos de la empresa han sido actualizados.');
  };

  const handleRestablecer = () => {
    Alert.alert(
      'Restablecer Demostración',
      '¿Deseas recargar los datos demo oficiales de la UNI (Corporación Multiservicios Global, S.A., 15 cuentas y 4 asientos cuadrados)?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Restablecer',
          style: 'destructive',
          onPress: async () => {
            await restablecerDatosDemo();
            setFormData(useContabilidadStore.getState().empresa);
            Alert.alert('Listo', 'Datos de demostración restablecidos con éxito.');
          },
        },
      ]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card variant="elevated">
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Parámetros Institucionales</Text>
          <TouchableOpacity
            style={[styles.btnEdit, editando && styles.btnEditActive]}
            onPress={() => {
              if (editando) {
                setFormData(empresa);
              }
              setEditando(!editando);
            }}
          >
            <Text style={styles.btnEditText}>{editando ? 'Cancelar' : '✏️ Editar'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        <Campo
          label="Razón Social / Nombre"
          value={formData.nombre}
          editando={editando}
          onChangeText={(v) => setFormData({ ...formData, nombre: v })}
        />

        <Campo
          label="Giro o Actividad Económica"
          value={formData.actividadEconomica}
          editando={editando}
          onChangeText={(v) => setFormData({ ...formData, actividadEconomica: v })}
        />

        <Campo
          label="Representante Legal / Propietario"
          value={formData.propietario}
          editando={editando}
          onChangeText={(v) => setFormData({ ...formData, propietario: v })}
        />

        <Campo
          label="Número RUC de Identificación"
          value={formData.ruc}
          editando={editando}
          onChangeText={(v) => setFormData({ ...formData, ruc: v })}
        />

        <Campo
          label="Dirección Comercial"
          value={formData.direccion}
          editando={editando}
          onChangeText={(v) => setFormData({ ...formData, direccion: v })}
        />

        <View style={styles.row}>
          <View style={styles.halfCol}>
            <Campo
              label="Periodo Contable"
              value={formData.periodoContable}
              editando={editando}
              onChangeText={(v) => setFormData({ ...formData, periodoContable: v })}
            />
          </View>
          <View style={styles.halfCol}>
            <Campo
              label="Moneda Funcional"
              value={formData.moneda}
              editando={editando}
              onChangeText={(v) => setFormData({ ...formData, moneda: v })}
            />
          </View>
        </View>

        {editando && (
          <TouchableOpacity style={styles.btnGuardar} onPress={handleGuardar}>
            <Text style={styles.btnGuardarText}>💾 Guardar Cambios</Text>
          </TouchableOpacity>
        )}
      </Card>

      <Card variant="outlined" style={styles.infoCard}>
        <Text style={styles.infoTitle}>ℹ️ Modelo Paramétrico Universal</Text>
        <Text style={styles.infoText}>
          Este sistema contable fue concebido bajo una arquitectura universal adaptable a cualquier
          empresa comercial, de servicios o mixta en Nicaragua. Toda transacción económica registrada
          en el Diario y Mayor tomará automáticamente la moneda y el periodo fiscal aquí configurados.
        </Text>
      </Card>

      <TouchableOpacity style={styles.btnReset} onPress={handleRestablecer}>
        <Text style={styles.btnResetText}>🔄 Restablecer Datos Oficiales de Demostración</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

interface CampoProps {
  label: string;
  value: string;
  editando: boolean;
  onChangeText: (text: string) => void;
}

const Campo: React.FC<CampoProps> = ({ label, value, editando, onChangeText }) => (
  <View style={styles.campoContainer}>
    <Text style={styles.campoLabel}>{label}</Text>
    {editando ? (
      <TextInput
        style={styles.campoInput}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor="#94a3b8"
      />
    ) : (
      <Text style={styles.campoValor}>{value || '-'}</Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  btnEdit: {
    backgroundColor: theme.colors.surfaceVariant,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  btnEditActive: {
    backgroundColor: '#fee2e2',
    borderColor: '#fca5a5',
  },
  btnEditText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.borderLight,
    marginVertical: 10,
  },
  campoContainer: {
    marginVertical: 6,
  },
  campoLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  campoValor: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  campoInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 14,
    color: theme.colors.textPrimary,
    backgroundColor: '#ffffff',
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: -6,
  },
  halfCol: {
    flex: 1,
    paddingHorizontal: 6,
  },
  btnGuardar: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginTop: 16,
  },
  btnGuardarText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  infoCard: {
    marginTop: 16,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  btnReset: {
    marginVertical: 20,
    paddingVertical: 12,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  btnResetText: {
    color: '#64748b',
    fontSize: 13,
    fontWeight: '600',
  },
});
