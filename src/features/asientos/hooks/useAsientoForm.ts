import { useMemo, useState } from 'react';
import { Money } from '../../../lib/math/money';
import { CuentaContable, MovimientoAsiento } from '../../../types/contabilidad.types';

export interface MovimientoEditable extends Omit<MovimientoAsiento, 'referencia'> {
  ref: string;
}

const createMovement = (cuenta?: CuentaContable, id = `mov-${Date.now()}`): MovimientoEditable => ({
  id,
  codigoCuenta: cuenta?.codigo ?? '',
  nombreCuenta: cuenta?.nombre ?? '',
  debe: '0.00',
  haber: '0.00',
  ref: '',
});

export function useAsientoForm(cuentas: CuentaContable[]) {
  const [fecha, setFecha] = useState(new Date().toISOString().split('T')[0]);
  const [concepto, setConcepto] = useState('');
  const [movimientos, setMovimientos] = useState<MovimientoEditable[]>(() => [
    createMovement(cuentas[0], '1'),
    createMovement(cuentas[1] ?? cuentas[0], '2'),
  ]);

  const resumen = useMemo(() => {
    const totalDebe = movimientos.reduce((total, movimiento) => total.add(movimiento.debe), Money.zero());
    const totalHaber = movimientos.reduce((total, movimiento) => total.add(movimiento.haber), Money.zero());
    const diferencia = totalDebe.sub(totalHaber);
    return {
      totalDebe,
      totalHaber,
      diferencia,
      estaCuadrado: totalDebe.equals(totalHaber) && !totalDebe.isZero(),
    };
  }, [movimientos]);

  const agregarMovimiento = () => setMovimientos((actuales) => [...actuales, createMovement(cuentas[0])]);

  const eliminarMovimiento = (index: number) => {
    if (movimientos.length <= 2) return false;
    setMovimientos((actuales) => actuales.filter((_, currentIndex) => currentIndex !== index));
    return true;
  };

  const actualizarMovimiento = (index: number, cambios: Partial<MovimientoEditable>) => {
    setMovimientos((actuales) => actuales.map((movimiento, currentIndex) => {
      if (currentIndex !== index) return movimiento;
      const actualizado = { ...movimiento, ...cambios };
      if ('debe' in cambios && Money.from(cambios.debe ?? '0').isPositive()) actualizado.haber = '0.00';
      if ('haber' in cambios && Money.from(cambios.haber ?? '0').isPositive()) actualizado.debe = '0.00';
      return actualizado;
    }));
  };

  const seleccionarCuenta = (index: number, cuenta: CuentaContable) => {
    actualizarMovimiento(index, { codigoCuenta: cuenta.codigo, nombreCuenta: cuenta.nombre });
  };

  const resetear = () => {
    setFecha(new Date().toISOString().split('T')[0]);
    setConcepto('');
    setMovimientos([createMovement(cuentas[0], '1'), createMovement(cuentas[1] ?? cuentas[0], '2')]);
  };

  return {
    fecha, setFecha, concepto, setConcepto, movimientos, resumen,
    agregarMovimiento, eliminarMovimiento, actualizarMovimiento, seleccionarCuenta, resetear,
  };
}
