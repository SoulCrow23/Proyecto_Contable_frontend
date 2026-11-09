# Design

## Context

La propuesta `estandarizar-tablas-financieras` añade una capacidad transversal a las pantallas contables. Actualmente cada módulo mantiene estilos de filas, encabezados y totales propios. La aplicación usa React Native/Expo y un tema compartido, por lo que la referencia visual de Material UI debe adaptarse sin introducir una dependencia web exclusiva.

## Goals / Non-Goals

**Goals:**

- Definir componentes compartidos para contenedor, encabezado, filas, celdas monetarias y pie de totales.
- Priorizar la Balanza de Comprobación como tabla piloto con agrupación de columnas.
- Mantener compatibilidad con web, Android e iOS, incluyendo tema claro y oscuro.
- Conservar sin cambios las fuentes de datos, cálculos y exportaciones.

**Non-Goals:**

- No incorporar Material UI ni DataGrid como dependencia.
- No agregar paginación, selección masiva o edición en línea mientras no exista una necesidad funcional aprobada.
- No rediseñar las cuentas T del Libro Mayor cuando su representación no sea una tabla convencional.

## Decisions

### Componentes de interfaz compartidos

Se creará un conjunto de componentes en `src/components/ui` con contratos tipados de columnas, alineación y variantes densas. Cada feature conservará la decisión de qué datos presenta, mientras el estilo y la estructura se reutilizan.

Alternativa considerada: copiar el estilo de la Balanza a cada pantalla. Se descarta porque volvería a duplicar estilos y reintroducir diferencias entre módulos.

### Diseño responsive contenido

Las tablas extensas se envolverán en un contenedor con desplazamiento horizontal dentro del área de contenido. En web se habilitará encabezado persistente cuando sea compatible; en móvil se conservará la capacidad de recorrer todas las columnas sin modal ni navegación adicional.

### Jerarquía financiera

Las columnas de texto conservarán prioridad visual a la izquierda. Los importes usarán alineación derecha y fuente monoespaciada. Los encabezados agrupados y pies de doble línea se reservarán para Balanza y reportes que lo requieran.

### Tema y tokens existentes

Los componentes consumirán exclusivamente tokens de `theme.colors`, espaciado y bordes existentes. No se introducirán colores literales en las vistas para evitar regresiones entre tema claro y oscuro.

## Risks / Trade-offs

- [Ancho insuficiente en móviles] → Usar desplazamiento contenido y no reducir texto por debajo de la legibilidad acordada.
- [Regresión visual en reportes existentes] → Migrar una pantalla a la vez y validar ambos temas antes de continuar.
- [Mezclar presentación con cálculos] → Las tablas recibirán datos preparados y no ejecutarán aritmética financiera.
- [Afectar exportaciones] → Mantener las plantillas PDF/CSV fuera del alcance de los componentes de tabla y validarlas después de cada migración relevante.

## Migration Plan

1. Crear el estándar de tabla compartido y su documentación de uso.
2. Migrar Balanza de Comprobación y validar el encabezado agrupado y los totales.
3. Migrar Libro Diario y Catálogo de Cuentas.
4. Aplicar variantes apropiadas a vistas tabulares de Mayor y Estados Financieros.
5. Ejecutar validación visual, typecheck, lint y empaquetado web antes de aprobar el cambio.
