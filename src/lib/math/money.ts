import { Decimal } from 'decimal.js';

// Configuración de precisión financiera
Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP });

export class Money {
  private val: Decimal;

  constructor(value: string | number | Decimal = 0) {
    if (typeof value === 'string') {
      const clean = value.replace(/[^0-9.-]+/g, '');
      this.val = new Decimal(clean === '' || isNaN(Number(clean)) ? 0 : clean);
    } else {
      this.val = new Decimal(value || 0);
    }
  }

  static from(value: string | number | Decimal): Money {
    return new Money(value);
  }

  static zero(): Money {
    return new Money(0);
  }

  add(other: Money | string | number): Money {
    const o = other instanceof Money ? other.val : new Decimal(other || 0);
    return new Money(this.val.plus(o));
  }

  sub(other: Money | string | number): Money {
    const o = other instanceof Money ? other.val : new Decimal(other || 0);
    return new Money(this.val.minus(o));
  }

  mul(factor: number | string): Money {
    return new Money(this.val.times(new Decimal(factor)));
  }

  equals(other: Money | string | number): boolean {
    const o = other instanceof Money ? other.val : new Decimal(other || 0);
    return this.val.toDecimalPlaces(2).equals(o.toDecimalPlaces(2));
  }

  isZero(): boolean {
    return this.val.toDecimalPlaces(2).isZero();
  }

  isPositive(): boolean {
    return this.val.toDecimalPlaces(2).isPositive() && !this.isZero();
  }

  isNegative(): boolean {
    return this.val.toDecimalPlaces(2).isNegative();
  }

  toDecimal(): Decimal {
    return this.val;
  }

  toString(): string {
    return this.val.toFixed(2);
  }

  toNumber(): number {
    return this.val.toDecimalPlaces(2).toNumber();
  }
}
