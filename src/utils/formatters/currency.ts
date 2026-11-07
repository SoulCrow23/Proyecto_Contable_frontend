import { Money } from '../../lib/math/money';

/**
 * Formateador de moneda contable con precisión a dos decimales y separador de miles.
 * Ejemplo: formatCurrency("15000.5", "C$") => "C$ 15,000.50"
 */
export function formatCurrency(
  amount: string | number | Money,
  currencySymbol: string = 'C$'
): string {
  const m = amount instanceof Money ? amount : new Money(amount);
  const num = m.toNumber();

  const parts = Math.abs(num).toFixed(2).split('.');
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const decPart = parts[1];

  const formatted = `${currencySymbol} ${intPart}.${decPart}`;

  if (num < 0) {
    return `(${formatted})`;
  }
  return formatted;
}

/**
 * Formatea una fecha ISO a legible en español.
 * "2026-11-02" => "02/11/2026"
 */
export function formatDate(isoDate: string): string {
  if (!isoDate) return '';
  const parts = isoDate.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return isoDate;
}
