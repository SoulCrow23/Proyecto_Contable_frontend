---
name: sistema-contable-modular
description: >-
  Especificación técnica, arquitectura de monolito modular y catálogo de reglas contables para el
  desarrollo del Sistema Contable Financiero en React Native (Expo SDK 52+, TypeScript) con
  compatibilidad futura con backend en .NET 10. Incluye modelos de datos, validación de partida doble,
  mayorización, estados financieros, precisión decimal y persistencia offline-first.
---

# Skill: Sistema Contable Financiero (Monolito Modular Frontend)

Esta Skill documenta todo el contexto, reglas contables, especificaciones técnicas, arquitectura y procedimientos de desarrollo del **Sistema Contable Financiero**.

---

## 1. Contexto y Origen del Proyecto

* **Origen:** Sistema Contable Financiero en Consola (Java 25 LTS con `BigDecimal` y almacenamiento CSV).
* **Institución:** Universidad Nacional de Ingeniería (UNI) - Managua, Nicaragua.
* **Cátedra:** Contabilidad Financiera (Carrera de Ingeniería de Sistemas).
* **Autor / Equipo:** Ing. Lawrence y Equipo de Desarrollo.
* **Empresa Modelo Oficial:**
  * **Razón Social:** *Corporación Multiservicios Global, S.A.*
  * **RUC:** `J0310000123456`
  * **Giro:** Comercialización General y Prestación de Servicios Empresariales
  * **Moneda Funcional:** Córdobas (`C$`) con precisión exacta a dos decimales
  * **Periodo:** Ejercicio Fiscal 2026
* **Ubicación del proyecto original:** [`C:/Users/Jean/Documents/ProyectoContabilidadDe Lawrence/sistema-contable`](file:///C:/Users/Jean/Documents/ProyectoContabilidadDe%20Lawrence/sistema-contable)

---

## 2. Reglas del Dominio Contable (No Negociables)

Toda implementación en el frontend debe cumplir rigurosamente con los postulados de la contabilidad financiera y NIIF para PYMES:

### 2.1 Principio de la Partida Doble (Fray Luca Pacioli)
Todo hecho económico genera al menos un cargo y un abono:
$$\sum \text{Debe} = \sum \text{Haber}$$
* **Regla del Sistema:** La interfaz debe **bloquear el registro** de cualquier asiento si la diferencia entre la sumatoria del Debe y la sumatoria del Haber es distinta de $0.00$.

### 2.2 Ecuación Fundamental de la Contabilidad
$$\text{Activo} = \text{Pasivo} + \text{Capital Contable}$$
Donde:
$$\text{Capital Contable Final} = \text{Capital Social} + \text{Utilidad del Periodo} - \text{Pérdida del Periodo}$$

### 2.3 Clasificación de Cuentas y Naturaleza Contable

| Clasificación | Tipo | Naturaleza | Aumenta con | Disminuye con | Saldo Normal |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Activo Corriente** | Balance | Deudora | Debe | Haber | Deudor |
| **Activo No Corriente** | Balance | Deudora | Debe | Haber | Deudor |
| **Pasivo Corriente** | Balance | Acreedora | Haber | Debe | Acreedor |
| **Pasivo No Corriente** | Balance | Acreedora | Haber | Debe | Acreedor |
| **Capital Contable** | Balance | Acreedora | Haber | Debe | Acreedor |
| **Ingresos** | Resultados | Acreedora | Haber | Debe | Acreedor |
| **Costos** | Resultados | Deudora | Debe | Haber | Deudor |
| **Gastos Operativos** | Resultados | Deudora | Debe | Haber | Deudor |

### 2.4 Precisión Financiera en JavaScript / TypeScript
> [!CAUTION]
> **Prohibido el uso de operaciones nativas con `number` de JavaScript para montos (`0.1 + 0.2 = 0.30000000000000004`).**  
> Todo cálculo aritmético de montos debe realizarse utilizando una librería de punto fijo de alta precisión como **`decimal.js`** o **`big.js`**, emulando el comportamiento de `BigDecimal` (Java) y `decimal` (.NET).

---

## 3. Arquitectura del Monolito Modular Frontend

### 3.1 Stack Tecnológico
* **Framework:** React Native (última versión compatible con .NET 10 / Expo SDK 52+).
* **Plataformas Soportadas:** Web (`npx expo start --web`), Android e iOS (mediante Expo Go o builds nativas).
* **Tipado:** TypeScript en modo estricto (`strict: true`).
* **Gestión de Estado:** **Zustand** (modularizado por slices o stores por módulo).
* **Persistencia Local:** **AsyncStorage** (abstraído mediante el patrón repositorio para permitir cambio a API REST sin modificar los componentes).
* **Compatibilidad Futura:** Diseñado para conectarse directamente a una API en **.NET 10** (ASP.NET Core Web API) sin reescribir la UI.

### 3.2 Estructura de Directorios (Vertical Slice por Módulos)

```text
Proyecto_Contable_frontend/
├── .agents/
│   └── skills/
│       └── sistema-contable-modular/
│           └── SKILL.md
├── app/ o src/
│   ├── modules/
│   │   ├── empresa/                   # Módulo 1: Perfil institucional y parámetros
│   │   │   ├── types/
│   │   │   ├── screens/               # EmpresaConfigScreen
│   │   │   └── components/
│   │   │
│   │   ├── catalogo/                  # Módulo 2: Catálogo de cuentas
│   │   │   ├── types/                 # CuentaContable, Clasificacion, Naturaleza
│   │   │   ├── screens/               # CatalogoScreen, NuevaCuentaModal
│   │   │   └── components/            # ArbolCuentas, BadgeNaturaleza
│   │   │
│   │   ├── asientos/                  # Módulo 3: Registro y Libro Diario
│   │   │   ├── types/                 # AsientoContable, MovimientoAsiento
│   │   │   ├── screens/               # LibroDiarioScreen, RegistrarAsientoScreen
│   │   │   └── components/            # FilaMovimientoInput, BalanceIndicatorBar
│   │   │
│   │   ├── mayor/                     # Módulo 4: Libro Mayor (Cuentas T)
│   │   │   ├── types/                 # CuentaMayor, MovimientoMayor
│   │   │   ├── screens/               # LibroMayorScreen
│   │   │   └── components/            # TarjetaCuentaT, SaldoBadge
│   │   │
│   │   └── reportes/                  # Módulo 5: Estados Financieros
│   │       ├── types/                 # BalanzaComprobacion, BalanceGeneral, EstadoResultados
│   │       ├── screens/               # BalanzaScreen, BalanceGeneralScreen, EstadoResultadosScreen
│   │       └── components/            # TablaFinanciera, SeccionPatrimonial, TotalesDobleRaya
│   │
│   ├── shared/                        # Núcleo compartido / Shared Kernel
│   │   ├── math/                      # MoneyCalculator (envoltura de decimal.js)
│   │   ├── formatters/                # Formateo contable C$ #,##0.00
│   │   ├── components/                # Button, Input, Card, Modal, ScreenContainer
│   │   ├── theme/                     # Paleta de colores contables, tipografía
│   │   └── storage/                   # IContabilidadRepository e implementación local
│   │
│   └── store/                         # Store unificado de Zustand
│       ├── contabilidadStore.ts
│       └── initialData.ts             # Datos iniciales precargados de la empresa
```

---

## 4. Modelos de Datos en TypeScript

### 4.1 Cuenta Contable
```typescript
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
  esCuentaDeMayor: boolean;
}
```

### 4.2 Asiento y Movimientos
```typescript
export interface MovimientoAsiento {
  id: string;
  codigoCuenta: string;
  nombreCuenta: string;
  debe: string;            // Almacenado como string decimal: "15000.00"
  haber: string;           // Almacenado como string decimal: "0.00"
  referencia?: string;
}

export interface AsientoContable {
  id: string;
  numero: number;
  fecha: string;           // Formato ISO: "YYYY-MM-DD"
  concepto: string;
  movimientos: MovimientoAsiento[];
  totalDebe: string;
  totalHaber: string;
  estaCuadrado: boolean;
}
```

### 4.3 Estados Financieros
```typescript
export interface FilaBalanza {
  codigo: string;
  nombre: string;
  movimientoDebe: string;
  movimientoHaber: string;
  saldoDeudor: string;
  saldoAcreedor: string;
}

export interface EstadoResultados {
  periodo: string;
  ingresosTotales: string;
  costoVentas: string;
  utilidadBruta: string;
  gastosOperativos: string;
  utilidadOperativa: string;
  utilidadNeta: string;
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
  utilidadDelPeriodo: string;
  totalCapitalContable: string;
  totalPasivoMasCapital: string;
  diferenciaCuadre: string; // Debe ser siempre "0.00"
}
```

---

## 5. Datos Iniciales de Demostración (Seed Data)

### 5.1 Catálogo Base Oficial
* `1.1.01` - Caja General (Activo Corriente, Deudora)
* `1.1.02` - Bancos (Activo Corriente, Deudora)
* `1.1.03` - Clientes / Cuentas por Cobrar (Activo Corriente, Deudora)
* `1.1.04` - Inventario de Mercancías (Activo Corriente, Deudora)
* `1.2.01` - Mobiliario y Equipo de Oficina (Activo No Corriente, Deudora)
* `1.2.02` - Equipo de Cómputo (Activo No Corriente, Deudora)
* `2.1.01` - Proveedores / Cuentas por Pagar (Pasivo Corriente, Acreedora)
* `2.1.02` - Documentos por Pagar a Corto Plazo (Pasivo Corriente, Acreedora)
* `2.2.01` - Préstamos Bancarios a Largo Plazo (Pasivo No Corriente, Acreedora)
* `3.1.01` - Capital Social (Capital Contable, Acreedora)
* `3.1.02` - Utilidades Retenidas (Capital Contable, Acreedora)
* `4.1.01` - Ventas / Ingresos por Servicios (Ingreso, Acreedora)
* `5.1.01` - Costo de Ventas (Costo, Deudora)
* `6.1.01` - Gastos de Administración (Gasto, Deudora)
* `6.1.02` - Gastos de Venta (Gasto, Deudora)

---

## 6. Procedimientos de Desarrollo y Ejecución

### 6.1 Inicialización del Proyecto
```bash
# Crear proyecto Expo con plantilla TypeScript
npx create-expo-app@latest . --template blank-typescript

# Dependencias clave
npm install zustand decimal.js @react-native-async-storage/async-storage
```

### 6.2 Comandos de Ejecución
* **Modo Web:** `npx expo start --web`
* **Modo Dispositivo / Expo Go:** `npx expo start` (Escanear código QR con la app Expo Go)
* **Verificación de tipos TypeScript:** `npx tsc --noEmit`

### 6.3 Checklist de Verificación de Calidad
- [ ] Partida Doble: ¿El botón de "Guardar Asiento" se deshabilita si $\sum Debe \neq \sum Haber$?
- [ ] Formateo: ¿Los números se presentan siempre con separador de miles y dos decimales (`C$ 15,000.00`)?
- [ ] Signos y Naturalezas: ¿Las cuentas de balance reflejan su saldo según su naturaleza sin saldos negativos espurios?
- [ ] Ecuación Contable: ¿El Balance General muestra diferencia $0.00$ entre Activo y Pasivo + Capital?
- [ ] Persistencia: Al recargar la página o reiniciar la app, ¿los asientos registrados se conservan en el almacenamiento local?
