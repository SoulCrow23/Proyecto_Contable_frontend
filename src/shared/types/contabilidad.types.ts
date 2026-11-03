/**
 * Tipos fundamentales del Dominio Contable.
 * Adaptados del modelo de dominio de Java (com.contabilidad.model).
 */

export type ClasificacionCuenta =
  | 'ACTIVO_CORRIENTE'
  | 'ACTIVO_NO_CORRIENTE'
  | 'PASIVO_CORRIENTE'
  | 'PASIVO_NO_CORRIENTE'
  | 'CAPITAL'
  | 'INGRESO'
  | 'COSTO'
  | 'GASTO';

export type NaturalezaCuenta = 'DEUDORA' | 'ACREEDORA';

export interface CuentaContable {
  codigo: string;          // Ej: "1.1.01"
  nombre: string;          // Ej: "Caja General"
  clasificacion: ClasificacionCuenta;
  naturaleza: NaturalezaCuenta;
  descripcion?: string;
  esCuentaDeMayor?: boolean;
}

export interface MovimientoAsiento {
  id: string;
  codigoCuenta: string;
  nombreCuenta: string;
  debe: string;            // Formato decimal string "15000.00"
  haber: string;           // Formato decimal string "0.00"
  referencia?: string;
}

export interface AsientoContable {
  id: string;
  numero: number;
  fecha: string;           // YYYY-MM-DD
  concepto: string;
  movimientos: MovimientoAsiento[];
  totalDebe: string;
  totalHaber: string;
  estaCuadrado: boolean;
}

export interface Empresa {
  nombre: string;
  actividadEconomica: string;
  propietario: string;
  ruc: string;
  direccion: string;
  periodoContable: string;
  moneda: string;          // "C$" o "$"
}

export interface FilaBalanza {
  codigo: string;
  nombre: string;
  clasificacion: ClasificacionCuenta;
  naturaleza: NaturalezaCuenta;
  movimientoDebe: string;
  movimientoHaber: string;
  saldoDeudor: string;
  saldoAcreedor: string;
}

export interface CuentaMayorDetalle {
  codigo: string;
  nombre: string;
  clasificacion: ClasificacionCuenta;
  naturaleza: NaturalezaCuenta;
  movimientos: {
    asientoNumero: number;
    fecha: string;
    concepto: string;
    debe: string;
    haber: string;
  }[];
  totalDebe: string;
  totalHaber: string;
  saldo: string;
  esSaldoDeudor: boolean;
}

export interface EstadoResultados {
  periodo: string;
  ingresosTotales: string;
  costoVentas: string;
  utilidadBruta: string;
  gastosOperativos: string;
  utilidadOperativa: string;
  utilidadNeta: string;
  detalles: {
    ingresos: { codigo: string; nombre: string; monto: string }[];
    costos: { codigo: string; nombre: string; monto: string }[];
    gastos: { codigo: string; nombre: string; monto: string }[];
  };
}

export interface BalanceGeneral {
  fechaCorte: string;
  activosCorrientes: { codigo: string; nombre: string; monto: string }[];
  totalActivosCorrientes: string;
  activosNoCorrientes: { codigo: string; nombre: string; monto: string }[];
  totalActivosNoCorrientes: string;
  totalActivos: string;

  pasivosCorrientes: { codigo: string; nombre: string; monto: string }[];
  totalPasivosCorrientes: string;
  pasivosNoCorrientes: { codigo: string; nombre: string; monto: string }[];
  totalPasivosNoCorrientes: string;
  totalPasivos: string;

  capitalSocial: string;
  utilidadesRetenidas: string;
  utilidadDelPeriodo: string;
  totalCapitalContable: string;
  totalPasivoMasCapital: string;
  diferenciaCuadre: string; // Debe ser siempre "0.00"
  estaBalanceado: boolean;
}
