# Spec Delta

## Purpose

Proporcionar una presentación tabular financiera uniforme que permita consultar cuentas, movimientos, saldos y totales de forma legible en todas las plataformas compatibles.

## ADDED Requirements

### Requirement: Estructura financiera consistente

El sistema SHALL mostrar las tablas financieras con un encabezado distinguible, filas de datos alineadas por tipo de dato y una fila de totales cuando el reporte incluya acumulados.

#### Scenario: Consulta de una tabla financiera

- **WHEN** el usuario abre una pantalla que presenta cuentas, movimientos o saldos en formato tabular
- **THEN** puede identificar las columnas, leer el valor de cada fila y distinguir los totales del detalle

### Requirement: Importes y saldos legibles

El sistema SHALL alinear los importes monetarios a la derecha y conservar su formato contable, sin alterar los valores calculados ni su naturaleza deudora o acreedora.

#### Scenario: Revisión de saldos contables

- **WHEN** el usuario consulta una tabla que contiene Debe, Haber o saldos
- **THEN** los importes se presentan alineados y los valores conservan el resultado del cálculo contable original

### Requirement: Balanza con encabezados agrupados

El sistema SHALL mostrar la Balanza de Comprobación con grupos visibles para Movimientos y Saldos, cada uno con sus columnas Debe y Haber o Deudor y Acreedor respectivamente.

#### Scenario: Lectura de la Balanza de Comprobación

- **WHEN** el usuario abre la Balanza de Comprobación
- **THEN** puede relacionar cada columna de importe con su grupo de Movimientos o Saldos y verificar la fila de sumas iguales

### Requirement: Adaptación a pantallas estrechas

El sistema SHALL permitir consultar todas las columnas de una tabla financiera en pantallas estrechas mediante desplazamiento contenido, sin abrir una ventana emergente ni ocultar importes.

#### Scenario: Consulta desde un dispositivo móvil

- **WHEN** el ancho disponible no permite mostrar todas las columnas de una tabla
- **THEN** el usuario puede desplazarse dentro del área de la tabla para consultar las columnas restantes

### Requirement: Compatibilidad de tema y accesibilidad visual

El sistema SHALL conservar contraste legible para encabezados, filas, bordes, importes y totales tanto en tema claro como oscuro.

#### Scenario: Cambio de tema mientras se consulta una tabla

- **WHEN** el usuario cambia entre tema claro y oscuro
- **THEN** la tabla actualiza sus colores sin perder legibilidad ni información visible
