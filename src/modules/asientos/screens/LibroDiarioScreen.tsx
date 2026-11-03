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
import { formatCurrency, formatDate } from '../../../shared/formatters/currency';
import { Money } from '../../../shared/math/money';
import { MovimientoAsiento, CuentaContable } from '../../../shared/types/contabilidad.types';

export const LibroDiarioScreen: React.FC = () => {
  const asientos = useContabilidadStore((s) => s.asientos);
  const cuentas = useContabilidadStore((s) => s.cuentas);
  const registrarAsiento = useContabilidadStore((s) => s.registrarAsiento);
  const eliminarAsiento = useContabilidadStore((s) => s.eliminarAsiento);
  const empresa = useContabilidadStore((s) => s.empresa);

  const [modalVisible, setModalVisible] = useState(false);
  const [concepto, setConcepto] = useState('');
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);

  // Movimientos dinámicos en nuevo asiento
  const [movimientos, setMovimientos] = useState<
    { id: string; codigoCuenta: string; nombreCuenta: string; debe: string; haber: string; ref: string }[]
  >([
    { id: '1', codigoCuenta: cuentas[0]?.codigo || '', nombreCuenta: cuentas[0]?.nombre || '', debe: '0.00', haber: '0.00', ref: '' },
    { id: '2', codigoCuenta: cuentas[1]?.codigo || '', nombreCuenta: cuentas[1]?.nombre || '', debe: '0.00', haber: '0.00', ref: '' },
  ]);

  // Selector de cuenta en modal
  const [selectorCuentaVisible, setSelectorCuentaVisible] = useState(false);
  const [movimientoActivoIndex, setMovimientoActivoIndex] = useState<number | null>(null);

  // Calcular sumas y diferencia en tiempo real
  let sumDebe = Money.zero();
  let sumHaber = Money.zero();
  movimientos.forEach((m) => {
    sumDebe = sumDebe.add(m.debe);
    sumHaber = sumHaber.add(m.haber);
  });
  const diferencia = sumDebe.sub(sumHaber);
  const estaCuadrado = sumDebe.equals(sumHaber) && !sumDebe.isZero();

  const handleAgregarFila = () => {
    const primera = cuentas[0];
    setMovimientos([
      ...movimientos,
      {
        id: `mov-${Date.now()}`,
        codigoCuenta: primera ? primera.codigo : '',
        nombreCuenta: primera ? primera.nombre : '',
        debe: '0.00',
        haber: '0.00',
        ref: '',
      },
    ]);
  };

  const handleEliminarFila = (index: number) => {
    if (movimientos.length <= 2) {
      Alert.alert('Partida Doble', 'Un asiento contable requiere al menos 2 movimientos (un cargo y un abono).');
      return;
    }
    const nuevas = movimientos.filter((_, i) => i !== index);
    setMovimientos(nuevas);
  };

  const handleSeleccionarCuenta = (cuenta: CuentaContable) => {
    if (movimientoActivoIndex !== null) {
      const nuevas = [...movimientos];
      nuevas[movimientoActivoIndex].codigoCuenta = cuenta.codigo;
      nuevas[movimientoActivoIndex].nombreCuenta = cuenta.nombre;
      setMovimientos(nuevas);
    }
    setSelectorCuentaVisible(false);
    setMovimientoActivoIndex(null);
  };

  const handleGuardarAsiento = async () => {
    if (!concepto.trim()) {
      Alert.alert('Concepto Requerido', 'Por favor ingresa la descripción o concepto de la operación.');
      return;
    }

    if (!estaCuadrado) {
      Alert.alert(
        'Partida Descuadrada',
        `La suma del Debe (${formatCurrency(sumDebe, empresa.moneda)}) no coincide con el Haber (${formatCurrency(sumHaber, empresa.moneda)}).`
      );
      return;
    }

    const res = await registrarAsiento({
      fecha,
      concepto: concepto.trim(),
      movimientos: movimientos.map((m) => ({
        id: m.id,
        codigoCuenta: m.codigoCuenta,
        nombreCuenta: m.nombreCuenta,
        debe: m.debe,
        haber: m.haber,
        referencia: m.ref,
      })),
    });

    if (!res.success) {
      Alert.alert('Error Contable', res.error);
      return;
    }

    setModalVisible(false);
    setConcepto('');
    Alert.alert('Éxito', 'Asiento contable registrado en el Libro Diario.');
  };

  return (
    <View style={styles.container}>
      {/* Botón de Nuevo Asiento */}
      <View style={styles.topActions}>
        <Text style={styles.diarioHeaderTitle}>Operaciones Registradas</Text>
        <TouchableOpacity style={styles.btnNuevoAsiento} onPress={() => setModalVisible(true)}>
          <Text style={styles.btnNuevoAsientoText}>+ Nuevo Asiento</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de Asientos */}
      <ScrollView contentContainerStyle={styles.list}>
        {asientos.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No hay asientos registrados en el Libro Diario.</Text>
          </View>
        ) : (
          asientos.map((asiento) => (
            <Card key={asiento.id} variant="elevated" style={styles.asientoCard}>
              <View style={styles.asientoHeader}>
                <View style={styles.asientoPill}>
                  <Text style={styles.asientoNumero}>Asiento #{asiento.numero}</Text>
                </View>
                <Text style={styles.asientoFecha}>{formatDate(asiento.fecha)}</Text>
                <TouchableOpacity
                  style={styles.btnDelete}
                  onPress={() => {
                    Alert.alert(
                      'Eliminar Asiento',
                      `¿Deseas eliminar el asiento #${asiento.numero}? Esta acción afectará el Mayor y Balanza.`,
                      [
                        { text: 'Cancelar', style: 'cancel' },
                        {
                          text: 'Eliminar',
                          style: 'destructive',
                          onPress: () => eliminarAsiento(asiento.id),
                        },
                      ]
                    );
                  }}
                >
                  <Text style={styles.btnDeleteText}>🗑️</Text>
                </TouchableOpacity>
              </View>

              <Text style={styles.asientoConcepto}>{asiento.concepto}</Text>

              {/* Tabla de movimientos */}
              <View style={styles.tableHeader}>
                <Text style={[styles.th, { flex: 2 }]}>Cuenta</Text>
                <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>Debe</Text>
                <Text style={[styles.th, { flex: 1, textAlign: 'right' }]}>Haber</Text>
              </View>

              {asiento.movimientos.map((mov) => {
                const tieneDebe = Money.from(mov.debe).isPositive();
                return (
                  <View key={mov.id} style={styles.tableRow}>
                    <View style={{ flex: 2 }}>
                      <Text style={[styles.cuentaText, !tieneDebe && styles.cuentaIndent]}>
                        {mov.codigoCuenta} - {mov.nombreCuenta}
                      </Text>
                      {mov.referencia ? (
                        <Text style={styles.refText}>Ref: {mov.referencia}</Text>
                      ) : null}
                    </View>
                    <Text style={[styles.montoText, { flex: 1, textAlign: 'right', color: theme.colors.debe }]}>
                      {tieneDebe ? formatCurrency(mov.debe, empresa.moneda) : '-'}
                    </Text>
                    <Text style={[styles.montoText, { flex: 1, textAlign: 'right', color: theme.colors.haber }]}>
                      {!tieneDebe ? formatCurrency(mov.haber, empresa.moneda) : '-'}
                    </Text>
                  </View>
                );
              })}

              {/* Totales */}
              <View style={styles.tableFooter}>
                <Text style={styles.footerLabel}>Sumas Iguales:</Text>
                <Text style={[styles.footerMonto, { color: theme.colors.debe }]}>
                  {formatCurrency(asiento.totalDebe, empresa.moneda)}
                </Text>
                <Text style={[styles.footerMonto, { color: theme.colors.haber }]}>
                  {formatCurrency(asiento.totalHaber, empresa.moneda)}
                </Text>
              </View>
            </Card>
          ))
        )}
      </ScrollView>

      {/* Modal Registrar Asiento */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={false}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalFull}>
          <View style={styles.modalTopBar}>
            <Text style={styles.modalTopTitle}>Registrar Asiento Contable</Text>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseBtn}>Cerrar ✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll} contentContainerStyle={{ padding: 16 }}>
            <Text style={styles.formLabel}>Fecha de la Operación</Text>
            <TextInput
              style={styles.formInput}
              value={fecha}
              onChangeText={setFecha}
              placeholder="YYYY-MM-DD"
            />

            <Text style={styles.formLabel}>Concepto / Descripción del Hecho Económico</Text>
            <TextInput
              style={[styles.formInput, { height: 60, textAlignVertical: 'top' }]}
              value={concepto}
              onChangeText={setConcepto}
              placeholder="Ej: Venta de mercancías al contado según factura..."
              multiline
            />

            <View style={styles.movimientosHeader}>
              <Text style={styles.movimientosTitle}>Movimientos Contables (Partida Doble)</Text>
              <TouchableOpacity style={styles.btnAddRow} onPress={handleAgregarFila}>
                <Text style={styles.btnAddRowText}>+ Agregar Cuenta</Text>
              </TouchableOpacity>
            </View>

            {movimientos.map((m, idx) => (
              <Card key={m.id} variant="outlined" style={styles.movCard}>
                <View style={styles.movCardHeader}>
                  <TouchableOpacity
                    style={styles.accountSelector}
                    onPress={() => {
                      setMovimientoActivoIndex(idx);
                      setSelectorCuentaVisible(true);
                    }}
                  >
                    <Text style={styles.accountSelectorText}>
                      {m.codigoCuenta} - {m.nombreCuenta}
                    </Text>
                    <Text style={styles.accountSelectorArrow}>▾</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.btnRemoveRow}
                    onPress={() => handleEliminarFila(idx)}
                  >
                    <Text style={styles.btnRemoveRowText}>✕</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.row}>
                  <View style={styles.halfCol}>
                    <Text style={styles.inputSubLabel}>Debe (Cargo)</Text>
                    <TextInput
                      style={[styles.formInput, styles.monoInput]}
                      value={m.debe}
                      keyboardType="numeric"
                      onChangeText={(val) => {
                        const nuevas = [...movimientos];
                        nuevas[idx].debe = val;
                        if (Money.from(val).isPositive()) {
                          nuevas[idx].haber = '0.00';
                        }
                        setMovimientos(nuevas);
                      }}
                    />
                  </View>
                  <View style={styles.halfCol}>
                    <Text style={styles.inputSubLabel}>Haber (Abono)</Text>
                    <TextInput
                      style={[styles.formInput, styles.monoInput]}
                      value={m.haber}
                      keyboardType="numeric"
                      onChangeText={(val) => {
                        const nuevas = [...movimientos];
                        nuevas[idx].haber = val;
                        if (Money.from(val).isPositive()) {
                          nuevas[idx].debe = '0.00';
                        }
                        setMovimientos(nuevas);
                      }}
                    />
                  </View>
                </View>
              </Card>
            ))}
          </ScrollView>

          {/* Barra de Cuadre en Tiempo Real */}
          <View style={[styles.cuadreBar, estaCuadrado ? styles.cuadreOk : styles.cuadreError]}>
            <View>
              <Text style={styles.cuadreTotals}>
                Debe: {formatCurrency(sumDebe, empresa.moneda)} | Haber: {formatCurrency(sumHaber, empresa.moneda)}
              </Text>
              <Text style={styles.cuadreStatus}>
                {estaCuadrado
                  ? '✅ PARTIDA DOBLE CUADRADA'
                  : `⚠️ DESCUADRADO (Dif: ${formatCurrency(diferencia, empresa.moneda)})`}
              </Text>
            </View>
            <TouchableOpacity
              style={[styles.btnGuardarAsiento, !estaCuadrado && styles.btnGuardarDisabled]}
              disabled={!estaCuadrado}
              onPress={handleGuardarAsiento}
            >
              <Text style={styles.btnGuardarText}>Guardar Asiento</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Selector de Cuentas Modal */}
      <Modal visible={selectorCuentaVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.selectorContent}>
            <Text style={styles.selectorTitle}>Selecciona una Cuenta Contable</Text>
            <ScrollView style={{ maxHeight: 400 }}>
              {cuentas.map((c) => (
                <TouchableOpacity
                  key={c.codigo}
                  style={styles.selectorItem}
                  onPress={() => handleSeleccionarCuenta(c)}
                >
                  <Text style={styles.selectorItemCode}>{c.codigo}</Text>
                  <Text style={styles.selectorItemName}>{c.nombre}</Text>
                  <Badge label={c.naturaleza} variant={c.naturaleza === 'DEUDORA' ? 'debe' : 'haber'} />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.selectorClose}
              onPress={() => setSelectorCuentaVisible(false)}
            >
              <Text style={styles.selectorCloseText}>Cancelar</Text>
            </TouchableOpacity>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
  },
  diarioHeaderTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  btnNuevoAsiento: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.sm,
  },
  btnNuevoAsientoText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
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
  asientoCard: {
    marginBottom: 12,
  },
  asientoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  asientoPill: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    marginRight: 8,
  },
  asientoNumero: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  asientoFecha: {
    flex: 1,
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  btnDelete: {
    padding: 4,
  },
  btnDeleteText: {
    fontSize: 16,
  },
  asientoConcepto: {
    fontSize: 13,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    marginBottom: 10,
    lineHeight: 18,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surfaceVariant,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderRadius: theme.borderRadius.sm,
    marginBottom: 4,
  },
  th: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textSecondary,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    alignItems: 'center',
  },
  cuentaText: {
    fontSize: 12,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  cuentaIndent: {
    paddingLeft: 12,
    color: '#334155',
  },
  refText: {
    fontSize: 10,
    color: theme.colors.textMuted,
  },
  montoText: {
    fontSize: 12,
    fontFamily: 'monospace',
    fontWeight: '600',
  },
  tableFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 8,
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  footerLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    marginRight: 10,
  },
  footerMonto: {
    fontFamily: 'monospace',
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 12,
  },
  // Modal Asiento
  modalFull: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.primary,
  },
  modalTopTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  modalCloseBtn: {
    color: '#ffffff',
    fontWeight: '700',
  },
  modalScroll: {
    flex: 1,
  },
  formLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    marginTop: 10,
    marginBottom: 4,
  },
  formInput: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: theme.colors.textPrimary,
    backgroundColor: '#ffffff',
  },
  monoInput: {
    fontFamily: 'monospace',
    fontWeight: '700',
  },
  movimientosHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  movimientosTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  btnAddRow: {
    backgroundColor: theme.colors.surfaceVariant,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  btnAddRowText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  movCard: {
    marginBottom: 10,
    padding: 10,
  },
  movCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  accountSelector: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.sm,
  },
  accountSelectorText: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  accountSelectorArrow: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  btnRemoveRow: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginLeft: 6,
  },
  btnRemoveRowText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  halfCol: {
    flex: 1,
  },
  inputSubLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  // Barra de cuadre
  cuadreBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.md,
    borderTopWidth: 1,
  },
  cuadreOk: {
    backgroundColor: '#f0fdf4',
    borderTopColor: '#bbf7d0',
  },
  cuadreError: {
    backgroundColor: '#fef2f2',
    borderTopColor: '#fecaca',
  },
  cuadreTotals: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  cuadreStatus: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
    color: '#15803d',
  },
  btnGuardarAsiento: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: theme.borderRadius.sm,
  },
  btnGuardarDisabled: {
    backgroundColor: '#94a3b8',
  },
  btnGuardarText: {
    color: '#ffffff',
    fontWeight: '700',
    fontSize: 13,
  },
  // Modal selector
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 16,
  },
  selectorContent: {
    backgroundColor: '#ffffff',
    borderRadius: theme.borderRadius.lg,
    padding: 16,
  },
  selectorTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
    color: theme.colors.textPrimary,
  },
  selectorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  selectorItemCode: {
    fontFamily: 'monospace',
    fontWeight: '700',
    color: theme.colors.primary,
    width: 60,
  },
  selectorItemName: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.textPrimary,
  },
  selectorClose: {
    marginTop: 12,
    alignItems: 'center',
    paddingVertical: 10,
  },
  selectorCloseText: {
    fontWeight: '700',
    color: theme.colors.primary,
  },
});
