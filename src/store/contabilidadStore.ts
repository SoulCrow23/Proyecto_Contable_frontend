import { create } from 'zustand';
import {
  Empresa,
  CuentaContable,
  AsientoContable,
  MovimientoAsiento,
  FilaBalanza,
  CuentaMayorDetalle,
  EstadoResultados,
  BalanceGeneral,
} from '../shared/types/contabilidad.types';
import { initialEmpresa, initialCuentas, initialAsientos } from './initialData';
import { localContabilidadStorage } from '../shared/storage/storage';
import { Money } from '../shared/math/money';

interface ContabilidadState {
  empresa: Empresa;
  cuentas: CuentaContable[];
  asientos: AsientoContable[];
  isLoading: boolean;

  // Acciones
  inicializar: () => Promise<void>;
  actualizarEmpresa: (empresa: Partial<Empresa>) => Promise<void>;
  agregarCuenta: (cuenta: CuentaContable) => Promise<{ success: boolean; error?: string }>;
  eliminarCuenta: (codigo: string) => Promise<{ success: boolean; error?: string }>;
  registrarAsiento: (
    data: Omit<AsientoContable, 'id' | 'numero' | 'estaCuadrado' | 'totalDebe' | 'totalHaber'>
  ) => Promise<{ success: boolean; error?: string; asiento?: AsientoContable }>;
  eliminarAsiento: (id: string) => Promise<void>;
  restablecerDatosDemo: () => Promise<void>;

  // Consultas y Reportes
  obtenerLibroMayor: () => CuentaMayorDetalle[];
  generarBalanzaComprobacion: () => {
    filas: FilaBalanza[];
    totalMovDebe: string;
    totalMovHaber: string;
    totalSaldoDeudor: string;
    totalSaldoAcreedor: string;
    estaCuadrada: boolean;
  };
  generarEstadoResultados: () => EstadoResultados;
  generarBalanceGeneral: () => BalanceGeneral;
}

export const useContabilidadStore = create<ContabilidadState>((set, get) => ({
  empresa: initialEmpresa,
  cuentas: initialCuentas,
  asientos: initialAsientos,
  isLoading: false,

  inicializar: async () => {
    set({ isLoading: true });
    try {
      const [empresa, cuentas, asientos] = await Promise.all([
        localContabilidadStorage.loadEmpresa(),
        localContabilidadStorage.loadCuentas(),
        localContabilidadStorage.loadAsientos(),
      ]);
      set({ empresa, cuentas, asientos, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  actualizarEmpresa: async (datos) => {
    const actualizada = { ...get().empresa, ...datos };
    set({ empresa: actualizada });
    await localContabilidadStorage.saveEmpresa(actualizada);
  },

  agregarCuenta: async (cuenta) => {
    const { cuentas } = get();
    if (cuentas.some((c) => c.codigo.trim() === cuenta.codigo.trim())) {
      return { success: false, error: `Ya existe una cuenta con el código ${cuenta.codigo}` };
    }
    const nuevas = [...cuentas, cuenta].sort((a, b) => a.codigo.localeCompare(b.codigo));
    set({ cuentas: nuevas });
    await localContabilidadStorage.saveCuentas(nuevas);
    return { success: true };
  },

  eliminarCuenta: async (codigo) => {
    const { cuentas, asientos } = get();
    const tieneMovimientos = asientos.some((a) =>
      a.movimientos.some((m) => m.codigoCuenta === codigo)
    );
    if (tieneMovimientos) {
      return {
        success: false,
        error: `No se puede eliminar la cuenta ${codigo} porque tiene movimientos registrados en el Diario.`,
      };
    }
    const nuevas = cuentas.filter((c) => c.codigo !== codigo);
    set({ cuentas: nuevas });
    await localContabilidadStorage.saveCuentas(nuevas);
    return { success: true };
  },

  registrarAsiento: async (data) => {
    let sumDebe = Money.zero();
    let sumHaber = Money.zero();

    data.movimientos.forEach((m) => {
      sumDebe = sumDebe.add(m.debe);
      sumHaber = sumHaber.add(m.haber);
    });

    // Validación rigurosa de Partida Doble
    if (!sumDebe.equals(sumHaber)) {
      return {
        success: false,
        error: `Partida Doble Descuadrada: Debe (${sumDebe.toString()}) != Haber (${sumHaber.toString()}). Diferencia: ${sumDebe.sub(sumHaber).toString()}`,
      };
    }

    if (sumDebe.isZero()) {
      return {
        success: false,
        error: 'El importe total del asiento debe ser mayor a 0.00',
      };
    }

    const { asientos } = get();
    const nuevoNumero = asientos.length > 0 ? Math.max(...asientos.map((a) => a.numero)) + 1 : 1;

    const nuevoAsiento: AsientoContable = {
      id: `asiento-${Date.now()}`,
      numero: nuevoNumero,
      fecha: data.fecha,
      concepto: data.concepto,
      movimientos: data.movimientos,
      totalDebe: sumDebe.toString(),
      totalHaber: sumHaber.toString(),
      estaCuadrado: true,
    };

    const nuevosAsientos = [...asientos, nuevoAsiento];
    set({ asientos: nuevosAsientos });
    await localContabilidadStorage.saveAsientos(nuevosAsientos);

    return { success: true, asiento: nuevoAsiento };
  },

  eliminarAsiento: async (id) => {
    const nuevos = get().asientos.filter((a) => a.id !== id);
    set({ asientos: nuevos });
    await localContabilidadStorage.saveAsientos(nuevos);
  },

  restablecerDatosDemo: async () => {
    await localContabilidadStorage.resetToInitial();
    set({
      empresa: initialEmpresa,
      cuentas: initialCuentas,
      asientos: initialAsientos,
    });
  },

  obtenerLibroMayor: () => {
    const { cuentas, asientos } = get();

    return cuentas.map((cuenta) => {
      let totDebe = Money.zero();
      let totHaber = Money.zero();
      const movs: CuentaMayorDetalle['movimientos'] = [];

      asientos.forEach((asiento) => {
        asiento.movimientos.forEach((m) => {
          if (m.codigoCuenta === cuenta.codigo) {
            const d = Money.from(m.debe);
            const h = Money.from(m.haber);
            totDebe = totDebe.add(d);
            totHaber = totHaber.add(h);

            movs.push({
              asientoNumero: asiento.numero,
              fecha: asiento.fecha,
              concepto: asiento.concepto,
              debe: d.toString(),
              haber: h.toString(),
            });
          }
        });
      });

      const esDeudora = cuenta.naturaleza === 'DEUDORA';
      let saldo = Money.zero();

      if (esDeudora) {
        saldo = totDebe.sub(totHaber);
      } else {
        saldo = totHaber.sub(totDebe);
      }

      return {
        codigo: cuenta.codigo,
        nombre: cuenta.nombre,
        clasificacion: cuenta.clasificacion,
        naturaleza: cuenta.naturaleza,
        movimientos: movs,
        totalDebe: totDebe.toString(),
        totalHaber: totHaber.toString(),
        saldo: saldo.toString(),
        esSaldoDeudor: esDeudora,
      };
    });
  },

  generarBalanzaComprobacion: () => {
    const mayor = get().obtenerLibroMayor();
    let totMovDebe = Money.zero();
    let totMovHaber = Money.zero();
    let totSaldoDeudor = Money.zero();
    let totSaldoAcreedor = Money.zero();

    const filas: FilaBalanza[] = mayor.map((m) => {
      const d = Money.from(m.totalDebe);
      const h = Money.from(m.totalHaber);
      totMovDebe = totMovDebe.add(d);
      totMovHaber = totMovHaber.add(h);

      let sDeudor = Money.zero();
      let sAcreedor = Money.zero();

      if (m.esSaldoDeudor) {
        sDeudor = d.sub(h);
        totSaldoDeudor = totSaldoDeudor.add(sDeudor);
      } else {
        sAcreedor = h.sub(d);
        totSaldoAcreedor = totSaldoAcreedor.add(sAcreedor);
      }

      return {
        codigo: m.codigo,
        nombre: m.nombre,
        clasificacion: m.clasificacion,
        naturaleza: m.naturaleza,
        movimientoDebe: d.toString(),
        movimientoHaber: h.toString(),
        saldoDeudor: sDeudor.toString(),
        saldoAcreedor: sAcreedor.toString(),
      };
    });

    const estaCuadrada =
      totMovDebe.equals(totMovHaber) && totSaldoDeudor.equals(totSaldoAcreedor);

    return {
      filas,
      totalMovDebe: totMovDebe.toString(),
      totalMovHaber: totMovHaber.toString(),
      totalSaldoDeudor: totSaldoDeudor.toString(),
      totalSaldoAcreedor: totSaldoAcreedor.toString(),
      estaCuadrada,
    };
  },

  generarEstadoResultados: () => {
    const mayor = get().obtenerLibroMayor();

    let totIngresos = Money.zero();
    let totCostos = Money.zero();
    let totGastos = Money.zero();

    const ingresosList: { codigo: string; nombre: string; monto: string }[] = [];
    const costosList: { codigo: string; nombre: string; monto: string }[] = [];
    const gastosList: { codigo: string; nombre: string; monto: string }[] = [];

    mayor.forEach((item) => {
      const saldo = Money.from(item.saldo);
      if (item.clasificacion === 'INGRESO') {
        totIngresos = totIngresos.add(saldo);
        ingresosList.push({ codigo: item.codigo, nombre: item.nombre, monto: saldo.toString() });
      } else if (item.clasificacion === 'COSTO') {
        totCostos = totCostos.add(saldo);
        costosList.push({ codigo: item.codigo, nombre: item.nombre, monto: saldo.toString() });
      } else if (item.clasificacion === 'GASTO') {
        totGastos = totGastos.add(saldo);
        gastosList.push({ codigo: item.codigo, nombre: item.nombre, monto: saldo.toString() });
      }
    });

    const utilidadBruta = totIngresos.sub(totCostos);
    const utilidadOperativa = utilidadBruta.sub(totGastos);
    const utilidadNeta = utilidadOperativa; // En modelo base sin impuestos calculados

    return {
      periodo: get().empresa.periodoContable,
      ingresosTotales: totIngresos.toString(),
      costoVentas: totCostos.toString(),
      utilidadBruta: utilidadBruta.toString(),
      gastosOperativos: totGastos.toString(),
      utilidadOperativa: utilidadOperativa.toString(),
      utilidadNeta: utilidadNeta.toString(),
      detalles: {
        ingresos: ingresosList,
        costos: costosList,
        gastos: gastosList,
      },
    };
  },

  generarBalanceGeneral: () => {
    const mayor = get().obtenerLibroMayor();
    const estadoResultados = get().generarEstadoResultados();
    const utilidadPeriodo = Money.from(estadoResultados.utilidadNeta);

    const actCorrientes: { codigo: string; nombre: string; monto: string }[] = [];
    let totActCorrientes = Money.zero();

    const actNoCorrientes: { codigo: string; nombre: string; monto: string }[] = [];
    let totActNoCorrientes = Money.zero();

    const pasCorrientes: { codigo: string; nombre: string; monto: string }[] = [];
    let totPasCorrientes = Money.zero();

    const pasNoCorrientes: { codigo: string; nombre: string; monto: string }[] = [];
    let totPasNoCorrientes = Money.zero();

    let capSocial = Money.zero();
    let utilRetenidas = Money.zero();

    mayor.forEach((item) => {
      const saldo = Money.from(item.saldo);
      switch (item.clasificacion) {
        case 'ACTIVO_CORRIENTE':
          totActCorrientes = totActCorrientes.add(saldo);
          actCorrientes.push({ codigo: item.codigo, nombre: item.nombre, monto: saldo.toString() });
          break;
        case 'ACTIVO_NO_CORRIENTE':
          totActNoCorrientes = totActNoCorrientes.add(saldo);
          actNoCorrientes.push({ codigo: item.codigo, nombre: item.nombre, monto: saldo.toString() });
          break;
        case 'PASIVO_CORRIENTE':
          totPasCorrientes = totPasCorrientes.add(saldo);
          pasCorrientes.push({ codigo: item.codigo, nombre: item.nombre, monto: saldo.toString() });
          break;
        case 'PASIVO_NO_CORRIENTE':
          totPasNoCorrientes = totPasNoCorrientes.add(saldo);
          pasNoCorrientes.push({ codigo: item.codigo, nombre: item.nombre, monto: saldo.toString() });
          break;
        case 'CAPITAL':
          if (item.codigo === '3.1.01') {
            capSocial = capSocial.add(saldo);
          } else {
            utilRetenidas = utilRetenidas.add(saldo);
          }
          break;
      }
    });

    const totActivos = totActCorrientes.add(totActNoCorrientes);
    const totPasivos = totPasCorrientes.add(totPasNoCorrientes);
    const totCapital = capSocial.add(utilRetenidas).add(utilidadPeriodo);
    const totPasivoMasCapital = totPasivos.add(totCapital);
    const diferencia = totActivos.sub(totPasivoMasCapital);

    return {
      fechaCorte: new Date().toISOString().split('T')[0],
      activosCorrientes: actCorrientes,
      totalActivosCorrientes: totActCorrientes.toString(),
      activosNoCorrientes: actNoCorrientes,
      totalActivosNoCorrientes: totActNoCorrientes.toString(),
      totalActivos: totActivos.toString(),

      pasivosCorrientes: pasCorrientes,
      totalPasivosCorrientes: totPasCorrientes.toString(),
      pasivosNoCorrientes: pasNoCorrientes,
      totalPasivosNoCorrientes: totPasNoCorrientes.toString(),
      totalPasivos: totPasivos.toString(),

      capitalSocial: capSocial.toString(),
      utilidadesRetenidas: utilRetenidas.toString(),
      utilidadDelPeriodo: utilidadPeriodo.toString(),
      totalCapitalContable: totCapital.toString(),
      totalPasivoMasCapital: totPasivoMasCapital.toString(),
      diferenciaCuadre: diferencia.toString(),
      estaBalanceado: diferencia.isZero(),
    };
  },
}));
