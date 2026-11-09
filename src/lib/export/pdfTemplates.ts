import {
  Empresa,
  BalanceGeneral,
  EstadoResultados,
  FilaBalanza,
  CuentaMayorDetalle,
  AsientoContable,
} from '../../types/contabilidad.types';
import { formatCurrency, formatDate } from '../../utils/formatters/currency';
import { Money } from '../math/money';

/**
 * Estilos base CSS para los documentos contables en formato PDF.
 */
const BASE_CSS = `
  @page {
    size: A4;
    margin: 14mm;
  }
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  body {
    font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, Helvetica, Arial, sans-serif;
    color: #1e293b;
    background-color: #ffffff;
    padding: 0;
    font-size: 11pt;
    line-height: 1.4;
  }
  .header {
    text-align: center;
    border-bottom: 2px solid #0f172a;
    padding-bottom: 12px;
    margin-bottom: 20px;
  }
  .company-name {
    font-size: 16pt;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  .company-info {
    font-size: 9.5pt;
    color: #475569;
    margin-top: 3px;
  }
  .doc-title {
    font-size: 13pt;
    font-weight: 700;
    color: #1e3a8a;
    margin-top: 10px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .doc-subtitle {
    font-size: 10pt;
    font-weight: 600;
    color: #334155;
    margin-top: 2px;
  }
  .currency-note {
    font-size: 8.5pt;
    font-style: italic;
    color: #64748b;
    margin-top: 4px;
  }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 18px;
    font-size: 10pt;
  }
  th {
    background-color: #0f172a;
    color: #ffffff;
    font-weight: 600;
    padding: 6px 8px;
    text-align: left;
    font-size: 9pt;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  th.num, td.num {
    text-align: right;
  }
  td {
    padding: 5px 8px;
    border-bottom: 1px solid #e2e8f0;
  }
  tr.section-header td {
    background-color: #f1f5f9;
    font-weight: 700;
    color: #0f172a;
    padding-top: 8px;
    padding-bottom: 8px;
    border-bottom: 1px solid #cbd5e1;
  }
  tr.subtotal td {
    font-weight: 600;
    border-top: 1px solid #475569;
    border-bottom: 1px solid #475569;
    background-color: #fafafa;
  }
  tr.total-row td {
    font-weight: 800;
    font-size: 10.5pt;
    border-top: 1px solid #0f172a;
    border-bottom: 3px double #0f172a;
    background-color: #f8fafc;
  }
  .signatures {
    margin-top: 40px;
    display: flex;
    justify-content: space-between;
    width: 100%;
    page-break-inside: avoid;
  }
  .signature-box {
    width: 30%;
    text-align: center;
  }
  .signature-line {
    border-top: 1px solid #0f172a;
    margin-bottom: 6px;
  }
  .signature-role {
    font-weight: 700;
    font-size: 9pt;
    color: #0f172a;
  }
  .signature-name {
    font-size: 8.5pt;
    color: #475569;
  }
  .page-footer {
    margin-top: 25px;
    font-size: 8pt;
    color: #94a3b8;
    text-align: center;
    border-top: 1px solid #e2e8f0;
    padding-top: 8px;
  }
`;

function buildHeader(empresa: Empresa, titulo: string, subtitulo: string): string {
  return `
    <div class="header">
      <div class="company-name">${empresa.nombre}</div>
      <div class="company-info">RUC: ${empresa.ruc} | ${empresa.direccion}</div>
      <div class="company-info">Giro: ${empresa.actividadEconomica}</div>
      <div class="doc-title">${titulo}</div>
      <div class="doc-subtitle">${subtitulo}</div>
      <div class="currency-note">(Cifras expresadas en ${empresa.moneda === 'C$' ? 'Córdobas - C$' : 'Dólares - $'})</div>
    </div>
  `;
}

function buildSignatures(empresa: Empresa): string {
  return `
    <div class="signatures">
      <div class="signature-box">
        <div class="signature-line"></div>
        <div class="signature-role">Elaborado por</div>
        <div class="signature-name">Contador General</div>
      </div>
      <div class="signature-box">
        <div class="signature-line"></div>
        <div class="signature-role">Revisado por</div>
        <div class="signature-name">Auditor Interno</div>
      </div>
      <div class="signature-box">
        <div class="signature-line"></div>
        <div class="signature-role">Autorizado por</div>
        <div class="signature-name">${empresa.propietario}</div>
      </div>
    </div>
    <div class="page-footer">
      Generado por Sistema Contable Financiero | Fecha de emisión: ${formatDate(
        new Date().toISOString().split('T')[0]
      )}
    </div>
  `;
}

/**
 * Genera el documento HTML completo del Balance General.
 */
export function generarHtmlBalanceGeneral(
  empresa: Empresa,
  balance: BalanceGeneral
): string {
  const m = empresa.moneda;

  const filasActivosCorrientes = balance.activosCorrientes
    .map(
      (a) => `<tr>
        <td style="width: 15%;">${a.codigo}</td>
        <td style="width: 55%;">${a.nombre}</td>
        <td class="num" style="width: 30%;">${formatCurrency(a.monto, m)}</td>
      </tr>`
    )
    .join('');

  const filasActivosNoCorrientes = balance.activosNoCorrientes
    .map(
      (a) => `<tr>
        <td>${a.codigo}</td>
        <td>${a.nombre}</td>
        <td class="num">${formatCurrency(a.monto, m)}</td>
      </tr>`
    )
    .join('');

  const filasPasivosCorrientes = balance.pasivosCorrientes
    .map(
      (p) => `<tr>
        <td>${p.codigo}</td>
        <td>${p.nombre}</td>
        <td class="num">${formatCurrency(p.monto, m)}</td>
      </tr>`
    )
    .join('');

  const filasPasivosNoCorrientes = balance.pasivosNoCorrientes
    .map(
      (p) => `<tr>
        <td>${p.codigo}</td>
        <td>${p.nombre}</td>
        <td class="num">${formatCurrency(p.monto, m)}</td>
      </tr>`
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Balance General - ${empresa.nombre}</title>
      <style>${BASE_CSS}</style>
    </head>
    <body>
      ${buildHeader(empresa, 'Balance General', `Al ${formatDate(balance.fechaCorte)}`)}

      <table>
        <thead>
          <tr>
            <th colspan="2">Cuentas de Activo</th>
            <th class="num">Importe</th>
          </tr>
        </thead>
        <tbody>
          <tr class="section-header"><td colspan="3">ACTIVO CORRIENTE</td></tr>
          ${filasActivosCorrientes}
          <tr class="subtotal">
            <td colspan="2">Total Activo Corriente</td>
            <td class="num">${formatCurrency(balance.totalActivosCorrientes, m)}</td>
          </tr>

          <tr class="section-header"><td colspan="3">ACTIVO NO CORRIENTE</td></tr>
          ${filasActivosNoCorrientes}
          <tr class="subtotal">
            <td colspan="2">Total Activo No Corriente</td>
            <td class="num">${formatCurrency(balance.totalActivosNoCorrientes, m)}</td>
          </tr>

          <tr class="total-row">
            <td colspan="2">TOTAL ACTIVO</td>
            <td class="num">${formatCurrency(balance.totalActivos, m)}</td>
          </tr>
        </tbody>
      </table>

      <table>
        <thead>
          <tr>
            <th colspan="2">Cuentas de Pasivo y Capital Contable</th>
            <th class="num">Importe</th>
          </tr>
        </thead>
        <tbody>
          <tr class="section-header"><td colspan="3">PASIVO CORRIENTE</td></tr>
          ${filasPasivosCorrientes}
          <tr class="subtotal">
            <td colspan="2">Total Pasivo Corriente</td>
            <td class="num">${formatCurrency(balance.totalPasivosCorrientes, m)}</td>
          </tr>

          <tr class="section-header"><td colspan="3">PASIVO NO CORRIENTE</td></tr>
          ${filasPasivosNoCorrientes}
          <tr class="subtotal">
            <td colspan="2">Total Pasivo No Corriente</td>
            <td class="num">${formatCurrency(balance.totalPasivosNoCorrientes, m)}</td>
          </tr>

          <tr class="subtotal" style="background-color: #f1f5f9;">
            <td colspan="2">TOTAL PASIVO</td>
            <td class="num">${formatCurrency(balance.totalPasivos, m)}</td>
          </tr>

          <tr class="section-header"><td colspan="3">CAPITAL CONTABLE</td></tr>
          <tr>
            <td>3.1.01</td>
            <td>Capital Social</td>
            <td class="num">${formatCurrency(balance.capitalSocial, m)}</td>
          </tr>
          <tr>
            <td>3.1.02</td>
            <td>Utilidades Retenidas</td>
            <td class="num">${formatCurrency(balance.utilidadesRetenidas, m)}</td>
          </tr>
          <tr>
            <td>—</td>
            <td>Utilidad Neta del Periodo</td>
            <td class="num">${formatCurrency(balance.utilidadDelPeriodo, m)}</td>
          </tr>
          <tr class="subtotal">
            <td colspan="2">Total Capital Contable</td>
            <td class="num">${formatCurrency(balance.totalCapitalContable, m)}</td>
          </tr>

          <tr class="total-row">
            <td colspan="2">TOTAL PASIVO Y CAPITAL CONTABLE</td>
            <td class="num">${formatCurrency(balance.totalPasivoMasCapital, m)}</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top: 10px; font-size: 9pt; color: ${
        balance.estaBalanceado ? '#15803d' : '#b91c1c'
      }; font-weight: 600;">
        Ecuación Contable: Activo = Pasivo + Capital Contable | Diferencia: ${formatCurrency(
          balance.diferenciaCuadre,
          m
        )} (${balance.estaBalanceado ? 'BALANCEADO CORRECTAMENTE' : 'DESCUADRADO'})
      </div>

      ${buildSignatures(empresa)}
    </body>
    </html>
  `;
}

/**
 * Genera el documento HTML completo del Estado de Resultados.
 */
export function generarHtmlEstadoResultados(
  empresa: Empresa,
  estado: EstadoResultados
): string {
  const m = empresa.moneda;

  const filasIngresos = estado.detalles.ingresos
    .map(
      (i) => `<tr>
        <td style="width: 15%;">${i.codigo}</td>
        <td style="width: 55%;">${i.nombre}</td>
        <td class="num" style="width: 30%;">${formatCurrency(i.monto, m)}</td>
      </tr>`
    )
    .join('');

  const filasCostos = estado.detalles.costos
    .map(
      (c) => `<tr>
        <td>${c.codigo}</td>
        <td>${c.nombre}</td>
        <td class="num">${formatCurrency(c.monto, m)}</td>
      </tr>`
    )
    .join('');

  const filasGastos = estado.detalles.gastos
    .map(
      (g) => `<tr>
        <td>${g.codigo}</td>
        <td>${g.nombre}</td>
        <td class="num">${formatCurrency(g.monto, m)}</td>
      </tr>`
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Estado de Resultados - ${empresa.nombre}</title>
      <style>${BASE_CSS}</style>
    </head>
    <body>
      ${buildHeader(empresa, 'Estado de Resultados', estado.periodo)}

      <table>
        <thead>
          <tr>
            <th colspan="2">Concepto</th>
            <th class="num">Importe</th>
          </tr>
        </thead>
        <tbody>
          <tr class="section-header"><td colspan="3">INGRESOS DE OPERACIÓN</td></tr>
          ${filasIngresos}
          <tr class="subtotal">
            <td colspan="2">Total Ingresos de Ventas y Servicios</td>
            <td class="num">${formatCurrency(estado.ingresosTotales, m)}</td>
          </tr>

          <tr class="section-header"><td colspan="3">COSTOS DE VENTAS</td></tr>
          ${filasCostos}
          <tr class="subtotal">
            <td colspan="2">Menos: Costo de Ventas</td>
            <td class="num">(${formatCurrency(estado.costoVentas, m)})</td>
          </tr>

          <tr class="total-row" style="background-color: #f1f5f9;">
            <td colspan="2">UTILIDAD BRUTA</td>
            <td class="num">${formatCurrency(estado.utilidadBruta, m)}</td>
          </tr>

          <tr class="section-header"><td colspan="3">GASTOS OPERATIVOS</td></tr>
          ${filasGastos}
          <tr class="subtotal">
            <td colspan="2">Menos: Gastos Operativos de Administración y Venta</td>
            <td class="num">(${formatCurrency(estado.gastosOperativos, m)})</td>
          </tr>

          <tr class="total-row">
            <td colspan="2">UTILIDAD NETA DEL EJERCICIO</td>
            <td class="num">${formatCurrency(estado.utilidadNeta, m)}</td>
          </tr>
        </tbody>
      </table>

      ${buildSignatures(empresa)}
    </body>
    </html>
  `;
}

/**
 * Genera el documento HTML completo de la Balanza de Comprobación.
 */
export function generarHtmlBalanza(
  empresa: Empresa,
  balanza: {
    filas: FilaBalanza[];
    totalMovDebe: string;
    totalMovHaber: string;
    totalSaldoDeudor: string;
    totalSaldoAcreedor: string;
    estaCuadrada: boolean;
  }
): string {
  const m = empresa.moneda;

  const filas = balanza.filas
    .map(
      (f) => `<tr>
        <td style="font-weight: 600;">${f.codigo}</td>
        <td>${f.nombre}</td>
        <td class="num">${formatCurrency(f.movimientoDebe, '')}</td>
        <td class="num">${formatCurrency(f.movimientoHaber, '')}</td>
        <td class="num">${formatCurrency(f.saldoDeudor, '')}</td>
        <td class="num">${formatCurrency(f.saldoAcreedor, '')}</td>
      </tr>`
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Balanza de Comprobación - ${empresa.nombre}</title>
      <style>
        ${BASE_CSS}
        @page { size: A4 landscape; margin: 10mm; }
        body { font-size: 9pt; }
        table { font-size: 8.5pt; }
        th { font-size: 8pt; padding: 5px 6px; }
        td { padding: 4px 6px; }
      </style>
    </head>
    <body>
      ${buildHeader(empresa, 'Balanza de Comprobación', empresa.periodoContable)}

      <table>
        <thead>
          <tr>
            <th rowspan="2" style="width: 12%;">Código</th>
            <th rowspan="2" style="width: 38%;">Cuenta</th>
            <th colspan="2" class="num" style="text-align: center; border-left: 1px solid #334155;">Movimientos</th>
            <th colspan="2" class="num" style="text-align: center; border-left: 1px solid #334155;">Saldos</th>
          </tr>
          <tr>
            <th class="num" style="border-left: 1px solid #334155;">Debe</th>
            <th class="num">Haber</th>
            <th class="num" style="border-left: 1px solid #334155;">Deudor</th>
            <th class="num">Acreedor</th>
          </tr>
        </thead>
        <tbody>
          ${filas}
          <tr class="total-row">
            <td colspan="2">SUMAS IGUALES</td>
            <td class="num">${formatCurrency(balanza.totalMovDebe, m)}</td>
            <td class="num">${formatCurrency(balanza.totalMovHaber, m)}</td>
            <td class="num">${formatCurrency(balanza.totalSaldoDeudor, m)}</td>
            <td class="num">${formatCurrency(balanza.totalSaldoAcreedor, m)}</td>
          </tr>
        </tbody>
      </table>

      <div style="margin-top: 10px; font-size: 9pt; color: ${
        balanza.estaCuadrada ? '#15803d' : '#b91c1c'
      }; font-weight: 600;">
        Estado: ${
          balanza.estaCuadrada
            ? '✓ SUMAS Y SALDOS PERFECTAMENTE CUADRADOS'
            : '⚠ DESCUADRE EN BALANZA DE COMPROBACIÓN'
        }
      </div>

      ${buildSignatures(empresa)}
    </body>
    </html>
  `;
}

/**
 * Genera el documento HTML del Libro Mayor (Cuentas T).
 */
export function generarHtmlLibroMayor(
  empresa: Empresa,
  cuentasMayor: CuentaMayorDetalle[]
): string {
  const m = empresa.moneda;

  const bloquesCuentas = cuentasMayor
    .filter((c) => c.movimientos.length > 0)
    .map((cuenta) => {
      const filasMov = cuenta.movimientos
        .map(
          (mov) => `<tr>
            <td style="font-size: 8.5pt;">${formatDate(mov.fecha)}</td>
            <td style="font-size: 8.5pt; text-align: center;">#${mov.asientoNumero}</td>
            <td style="font-size: 8.5pt;">${mov.concepto}</td>
            <td class="num">${Money.from(mov.debe).isPositive() ? formatCurrency(mov.debe, '') : '—'}</td>
            <td class="num">${Money.from(mov.haber).isPositive() ? formatCurrency(mov.haber, '') : '—'}</td>
          </tr>`
        )
        .join('');

      return `
        <div style="margin-bottom: 25px; page-break-inside: avoid; border: 1px solid #cbd5e1; border-radius: 6px; overflow: hidden;">
          <div style="background-color: #0f172a; color: white; padding: 8px 12px; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 700; font-size: 10.5pt;">${cuenta.codigo} - ${cuenta.nombre}</span>
            <span style="font-size: 8.5pt; background: #334155; padding: 2px 8px; border-radius: 4px;">Naturaleza: ${cuenta.naturaleza}</span>
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 14%; background-color: #1e293b;">Fecha</th>
                <th style="width: 10%; text-align: center; background-color: #1e293b;">Asiento</th>
                <th style="width: 44%; background-color: #1e293b;">Concepto</th>
                <th class="num" style="width: 16%; background-color: #1e293b;">Debe (Cargos)</th>
                <th class="num" style="width: 16%; background-color: #1e293b;">Haber (Abonos)</th>
              </tr>
            </thead>
            <tbody>
              ${filasMov}
              <tr class="subtotal">
                <td colspan="3">Movimientos Acumulados</td>
                <td class="num">${formatCurrency(cuenta.totalDebe, m)}</td>
                <td class="num">${formatCurrency(cuenta.totalHaber, m)}</td>
              </tr>
              <tr class="total-row">
                <td colspan="3">SALDO FINAL (${cuenta.esSaldoDeudor ? 'DEUDOR' : 'ACREEDOR'})</td>
                <td colspan="2" class="num" style="color: #0f172a;">${formatCurrency(cuenta.saldo, m)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    })
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Libro Mayor - ${empresa.nombre}</title>
      <style>${BASE_CSS}</style>
    </head>
    <body>
      ${buildHeader(empresa, 'Libro Mayor General', empresa.periodoContable)}
      ${bloquesCuentas}
      ${buildSignatures(empresa)}
    </body>
    </html>
  `;
}

/**
 * Genera el documento HTML completo del Libro Diario.
 */
export function generarHtmlLibroDiario(
  empresa: Empresa,
  asientos: AsientoContable[]
): string {
  const m = empresa.moneda;

  const bloquesAsientos = asientos
    .map((asiento) => {
      const filas = asiento.movimientos
        .map(
          (mov) => `<tr>
            <td style="font-family: monospace; font-size: 9pt;">${mov.codigoCuenta}</td>
            <td style="padding-left: ${Money.from(mov.haber).isPositive() ? '24px' : '8px'};">${mov.nombreCuenta}</td>
            <td class="num">${Money.from(mov.debe).isPositive() ? formatCurrency(mov.debe, '') : '—'}</td>
            <td class="num">${Money.from(mov.haber).isPositive() ? formatCurrency(mov.haber, '') : '—'}</td>
          </tr>`
        )
        .join('');

      return `
        <div style="margin-bottom: 20px; page-break-inside: avoid; border: 1px solid #cbd5e1; border-radius: 6px; overflow: hidden;">
          <div style="background-color: #f1f5f9; padding: 6px 12px; border-bottom: 1px solid #cbd5e1; display: flex; justify-content: space-between; font-weight: 700; font-size: 9.5pt;">
            <span>Asiento #${asiento.numero} | Fecha: ${formatDate(asiento.fecha)}</span>
            <span style="font-weight: normal; color: #475569;">${asiento.concepto}</span>
          </div>
          <table>
            <thead>
              <tr>
                <th style="width: 15%; background: #334155;">Código</th>
                <th style="width: 55%; background: #334155;">Cuenta y Detalle</th>
                <th class="num" style="width: 15%; background: #334155;">Debe</th>
                <th class="num" style="width: 15%; background: #334155;">Haber</th>
              </tr>
            </thead>
            <tbody>
              ${filas}
              <tr class="subtotal">
                <td colspan="2" style="text-align: right; font-weight: 700;">Totales Asiento #${asiento.numero}</td>
                <td class="num" style="font-weight: 700;">${formatCurrency(asiento.totalDebe, m)}</td>
                <td class="num" style="font-weight: 700;">${formatCurrency(asiento.totalHaber, m)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      `;
    })
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <title>Libro Diario - ${empresa.nombre}</title>
      <style>${BASE_CSS}</style>
    </head>
    <body>
      ${buildHeader(empresa, 'Libro Diario General', empresa.periodoContable)}
      ${bloquesAsientos}
      ${buildSignatures(empresa)}
    </body>
    </html>
  `;
}
