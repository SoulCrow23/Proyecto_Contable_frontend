# Proposal

## Why

Las tablas actuales resuelven la visualización de datos contables, pero presentan estilos y estructuras repetidos entre módulos. Un estándar inspirado en las tablas personalizables de Material UI permitirá que los registros financieros se lean de forma consistente, responsive y accesible en web y dispositivos móviles.

## What Changes

- Incorporar una capacidad de tablas financieras reutilizables para encabezados, filas, celdas numéricas y pies de totales.
- Aplicar el estándar visual a Balanza de Comprobación, Libro Diario, Catálogo de Cuentas y las vistas tabulares de Libro Mayor y Estados Financieros.
- Incluir encabezados agrupados para la Balanza, desplazamiento horizontal contenido en pantallas estrechas y soporte completo para tema claro y oscuro.
- Mantener los montos, saldos, cálculos, exportaciones y reglas de partida doble sin cambios funcionales.

## Capabilities

### New Capabilities

- `financial-tables`: Presentación consistente, responsive y accesible de información contable tabular con encabezados, importes y totales.

### Modified Capabilities

Ninguna. No existen especificaciones base de tablas financieras que modificar.

## Impact

- Afecta componentes de interfaz compartidos y presentaciones dentro de `src/features/`.
- No agrega Material UI como dependencia; la referencia guía el diseño y se implementa con React Native/Expo y el sistema de tema existente.
- No cambia esquemas de datos, persistencia, rutas ni lógica contable.
