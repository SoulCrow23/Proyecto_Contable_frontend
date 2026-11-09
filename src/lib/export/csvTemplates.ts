import {
  Empresa,
  FilaBalanza,
  AsientoContable,
  CuentaContable,
} from '../../types/contabilidad.types';
import { formatDate } from '../../utils/formatters/currency';

// Excel configurado para español utiliza punto y coma como delimitador de listas.
// La primera línea `sep=;` fuerza el reconocimiento, incluso si el equipo usa
// una configuración regional distinta.
const DELIMITADOR_CSV = ';';

function escapeCsv(value: string | number): string {
  const str = String(value ?? '');
  if (str.includes(DELIMITADOR_CSV) || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Genera el archivo CSV para la Balanza de Comprobación.
 */
export function generarCsvBalanza(
  empresa: Empresa,
  balanza: {
    filas: FilaBalanza[];
    totalMovDebe: string;
    totalMovHaber: string;
    totalSaldoDeudor: string;
    totalSaldoAcreedor: string;
  }
): string {
  const lineas: string[] = [];
  // Encabezado institucional
  lineas.push(escapeCsv(empresa.nombre));
  lineas.push(`RUC: ${escapeCsv(empresa.ruc)}`);
  lineas.push('BALANZA DE COMPROBACION');
  lineas.push(`Periodo: ${escapeCsv(empresa.periodoContable)} (Moneda: ${empresa.moneda})`);
  lineas.push('');

  // Encabezados de columnas
  lineas.push(
    [
      'Codigo',
      'Nombre de la Cuenta',
      'Clasificacion',
      'Naturaleza',
      'Movimiento Debe',
      'Movimiento Haber',
      'Saldo Deudor',
      'Saldo Acreedor',
    ].join(DELIMITADOR_CSV)
  );

  // Filas de detalle
  balanza.filas.forEach((f) => {
    lineas.push(
      [
        escapeCsv(f.codigo),
        escapeCsv(f.nombre),
        escapeCsv(f.clasificacion),
        escapeCsv(f.naturaleza),
        escapeCsv(f.movimientoDebe),
        escapeCsv(f.movimientoHaber),
        escapeCsv(f.saldoDeudor),
        escapeCsv(f.saldoAcreedor),
      ].join(DELIMITADOR_CSV)
    );
  });

  // Totales
  lineas.push(
    [
      'TOTALES',
      'SUMAS IGUALES',
      '',
      '',
      escapeCsv(balanza.totalMovDebe),
      escapeCsv(balanza.totalMovHaber),
      escapeCsv(balanza.totalSaldoDeudor),
      escapeCsv(balanza.totalSaldoAcreedor),
    ].join(DELIMITADOR_CSV)
  );

  return `\uFEFFsep=${DELIMITADOR_CSV}\r\n${lineas.join('\r\n')}`;
}

/**
 * Genera el archivo CSV para el Libro Diario.
 */
export function generarCsvLibroDiario(
  empresa: Empresa,
  asientos: AsientoContable[]
): string {
  const lineas: string[] = [];
  lineas.push(escapeCsv(empresa.nombre));
  lineas.push(`RUC: ${escapeCsv(empresa.ruc)}`);
  lineas.push('LIBRO DIARIO GENERAL');
  lineas.push(`Periodo: ${escapeCsv(empresa.periodoContable)} (Moneda: ${empresa.moneda})`);
  lineas.push('');

  lineas.push(
    [
      'Asiento No.',
      'Fecha',
      'Concepto General',
      'Codigo Cuenta',
      'Nombre Cuenta',
      'Debe',
      'Haber',
      'Referencia',
    ].join(DELIMITADOR_CSV)
  );

  asientos.forEach((asiento) => {
    asiento.movimientos.forEach((mov) => {
      lineas.push(
        [
          escapeCsv(asiento.numero),
          escapeCsv(formatDate(asiento.fecha)),
          escapeCsv(asiento.concepto),
          escapeCsv(mov.codigoCuenta),
          escapeCsv(mov.nombreCuenta),
          escapeCsv(mov.debe),
          escapeCsv(mov.haber),
          escapeCsv(mov.referencia || ''),
        ].join(DELIMITADOR_CSV)
      );
    });
  });

  return `\uFEFFsep=${DELIMITADOR_CSV}\r\n${lineas.join('\r\n')}`;
}

/**
 * Genera el archivo CSV del Catálogo de Cuentas.
 */
export function generarCsvCatalogo(cuentas: CuentaContable[]): string {
  const lineas: string[] = [];
  lineas.push('CATALOGO DE CUENTAS');
  lineas.push('');
  lineas.push(
    ['Codigo', 'Nombre de Cuenta', 'Clasificacion', 'Naturaleza', 'Descripcion'].join(
      DELIMITADOR_CSV
    )
  );

  cuentas.forEach((c) => {
    lineas.push(
      [
        escapeCsv(c.codigo),
        escapeCsv(c.nombre),
        escapeCsv(c.clasificacion),
        escapeCsv(c.naturaleza),
        escapeCsv(c.descripcion || ''),
      ].join(DELIMITADOR_CSV)
    );
  });

  return `\uFEFFsep=${DELIMITADOR_CSV}\r\n${lineas.join('\r\n')}`;
}
