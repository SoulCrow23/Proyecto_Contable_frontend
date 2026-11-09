# Tasks

## 1. Estándar compartido de tablas

- [ ] 1.1 Crear los componentes tipados de contenedor, encabezado, fila, celda y pie de tabla en `src/components/ui`, y verificar que expongan alineación de texto, monto y variante densa.
- [ ] 1.2 Integrar tokens de tema para encabezados, bordes, filas, importes y totales, y verificar visualmente contraste en tema claro y oscuro sin colores literales en vistas migradas.
- [ ] 1.3 Implementar desplazamiento horizontal contenido para tablas extensas, y verificar en una pantalla estrecha que todas las columnas se puedan consultar sin modal ni pérdida de importes.

## 2. Migración de reportes y registros

- [ ] 2.1 Migrar la Balanza de Comprobación al estándar compartido con grupos Movimientos y Saldos, y verificar encabezados, sumas iguales y montos originales.
- [ ] 2.2 Migrar la tabla de movimientos del Libro Diario y verificar que las cuentas, referencias, Debe, Haber y totales por asiento conserven su contenido.
- [ ] 2.3 Migrar el Catálogo de Cuentas y verificar código, nombre, clasificación, naturaleza y acciones sin alterar la gestión de cuentas.
- [ ] 2.4 Aplicar variantes apropiadas a las vistas tabulares de Libro Mayor y Estados Financieros, y verificar que no se alteren cuentas T, subtotales ni saldos calculados.

## 3. Validación integral

- [ ] 3.1 Verificar en web y móvil que las tablas migradas mantienen legibilidad, desplazamiento contenido y tema claro/oscuro.
- [ ] 3.2 Ejecutar `npx tsc --noEmit`, `npx expo lint`, `npx expo-doctor` y el empaquetado web, y corregir errores introducidos por el cambio.
- [ ] 3.3 Comprobar que la Balanza permanezca cuadrada, el Balance General permanezca balanceado y las exportaciones PDF/CSV sigan generando los mismos datos.

## Workflow follow-up

- Revisar los artefactos y aprobar este cambio antes de aplicar tareas de implementación.
- Archivar el cambio una vez completadas y verificadas todas las tareas.
