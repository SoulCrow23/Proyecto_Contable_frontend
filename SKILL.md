# Sistema Contable Financiero (Monolito Modular Frontend)

> **Documento Maestro / Skill del Proyecto**  
> Proyecto: Sistema Contable Financiero (React Native + TypeScript)  
> Origen: Universidad Nacional de Ingeniería (UNI) - Tarea de Curso de Contabilidad Financiera

Para consultar la especificación completa registrada como Skill de Antigravity, dirígete a:  
📂 [`.agents/skills/sistema-contable-modular/SKILL.md`](file:///c:/Users/Jean/Documents/Proyecto_Contable_frontend/.agents/skills/sistema-contable-modular/SKILL.md)

---

## Resumen Ejecutivo

### 1. Visión y Alcance
Desarrollo de un frontend moderno en **React Native (Expo SDK 52+, TypeScript)** estructurado como un **Monolito Modular** por dominios de negocio (Empresa, Catálogo, Asientos/Diario, Mayor/Cuentas T, y Reportes/Estados Financieros). El sistema opera en modo **offline-first** mediante almacenamiento local con **AsyncStorage y Zustand**, pero con una capa de abstracción desacoplada lista para conectarse a un backend en **.NET 10** en fases posteriores.

### 2. Principios Contables Obligatorios
* **Partida Doble:** Bloqueo estricto si $\sum \text{Debe} \neq \sum \text{Haber}$.
* **Ecuación Contable:** $\text{Activo} = \text{Pasivo} + \text{Capital Contable}$ comprobado con diferencia $0.00$.
* **Cálculo de Utilidad:** Los ingresos y egresos del Estado de Resultados se transfieren automáticamente al patrimonio en el Balance General.
* **Precisión Numérica:** Prohibido el uso de operaciones `number` con coma flotante IEEE-754 para dinero; uso mandatorio de aritmética decimal de alta precisión (`decimal.js` / `big.js`).

### 3. Módulos del Sistema
1. **Módulo Empresa:** Configuración de razón social (*Corporación Multiservicios Global, S.A.*), RUC, moneda (`C$`), periodo fiscal 2026.
2. **Módulo Catálogo:** Cuentas organizadas por Activo, Pasivo, Capital, Ingreso, Costo y Gasto; naturalezas deudora y acreedora.
3. **Módulo Asientos (Libro Diario):** Registro dinámico de cargos y abonos con validador en tiempo real.
4. **Módulo Mayor (Cuentas T):** Agrupación y saldo de cuentas.
5. **Módulo Reportes:** Balanza de Comprobación, Balance General clasificado y Estado de Resultados.
