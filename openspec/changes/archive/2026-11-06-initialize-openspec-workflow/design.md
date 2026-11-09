# Design

## Context

La propuesta `initialize-openspec-workflow` define la adopción de planificación guiada por especificaciones. El repositorio es un frontend Expo/React Native con arquitectura de monolito modular y una skill contable existente. El cambio debe convivir con esas reglas sin alterar código de producción.

## Goals / Non-Goals

**Goals:**

- Conservar los artefactos de planificación dentro del repositorio bajo `openspec/`.
- Integrar las habilidades de OpenSpec con Codex mediante `.agents/`.
- Establecer un ciclo trazable para que cada cambio futuro se planifique, apruebe, implemente, verifique y archive.
- Mantener las decisiones del proyecto y las reglas contables como contexto de planificación, no como reemplazo de las validaciones de código.

**Non-Goals:**

- No sustituir la skill `sistema-contable-modular` ni las reglas de `AGENTS.md`.
- No modificar pantallas, cálculos, dependencias de producción ni la estructura de datos.
- No convertir propuestas históricas en especificaciones retrospectivas durante este cambio.

## Decisions

### Repositorio como fuente de planificación

Los directorios `openspec/specs/` y `openspec/changes/` vivirán junto al código. Esto mantiene las decisiones revisables en Git y vinculadas a la rama donde se implementan.

Alternativa considerada: almacenar las especificaciones en un repositorio externo. Se descarta porque el proyecto actual es un monolito modular único y no requiere coordinación entre repositorios.

### Esquema `spec-driven`

Se utilizará el esquema predeterminado: propuesta, especificación, diseño y tareas. Los cambios sin comportamiento observable, como ajustes de herramientas o documentación, declararán `skip_specs: true` y conservarán propuesta, diseño y tareas.

### Aprobación antes de aplicar

La propuesta se revisará con el usuario antes de ejecutar tareas de implementación. `tasks.md` será el registro visible de avance y solo se marcarán tareas cuando estén verificadas.

### Contexto de dominio

Los cambios que afecten contabilidad deberán consultar la skill local y conservar la partida doble, el cálculo decimal, la ecuación contable y la compatibilidad Expo. Las especificaciones describirán comportamiento observable; los detalles de componentes y carpetas se mantendrán en diseño y tareas.

## Risks / Trade-offs

- [Artefactos de planificación desactualizados] → Cada cambio se verificará antes de archivarse y el archivo conservará el historial de decisiones.
- [Sobrecarga para ajustes mínimos] → Los cambios de proceso o refactorización pura usarán `skip_specs: true`, sin inventar requisitos funcionales.
- [Conflicto entre reglas existentes] → `AGENTS.md` y la skill contable siguen siendo restricciones obligatorias; OpenSpec organiza el cambio, no las reemplaza.

## Migration Plan

1. Mantener la estructura y habilidades creadas por `openspec init`.
2. Revisar y aprobar esta propuesta antes de aplicar sus tareas.
3. Configurar el contexto de proyecto de OpenSpec y documentar el ciclo de trabajo.
4. Crear el siguiente cambio de tablas financieras con OpenSpec antes de modificar sus componentes.
5. Verificar y archivar esta iniciativa cuando todas las tareas estén completadas.
