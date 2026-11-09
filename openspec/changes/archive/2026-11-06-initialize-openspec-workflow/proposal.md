# Proposal

## Why

El proyecto necesita un proceso verificable para acordar alcance, diseño y criterios de aceptación antes de modificar el frontend contable. Esto reduce cambios no trazables y preserva las reglas contables, la arquitectura de monolito modular y la calidad visual entre iteraciones.

## What Changes

- Incorporar OpenSpec como flujo de planificación y seguimiento para cambios funcionales, de arquitectura y de interfaz.
- Mantener las propuestas, diseños, tareas y verificaciones dentro del repositorio junto al código que describen.
- Configurar las instrucciones de OpenSpec para Codex y documentar el uso obligatorio del ciclo explorar, proponer, revisar, aplicar, verificar y archivar.
- Establecer que cada cambio futuro tenga una propuesta aprobada antes de iniciar su implementación.

## Capabilities

### New Capabilities

Ninguna. Este cambio incorpora proceso y herramientas de desarrollo, sin alterar una capacidad observable del sistema contable.

### Modified Capabilities

Ninguna.

## Impact

- Se agregan los artefactos de OpenSpec bajo `openspec/` y sus instrucciones para Codex bajo `.agents/`.
- No se modifica código de producción, modelos de datos, cálculos con `decimal.js`, persistencia ni navegación.
- Los cambios siguientes, incluido el estándar de tablas financieras, deberán iniciarse como un cambio OpenSpec independiente.
