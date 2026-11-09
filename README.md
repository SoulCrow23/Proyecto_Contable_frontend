# Proyecto_Contable_frontend

Frontend del sistema contable, desarrollado con Expo, React Native y TypeScript.

## Flujo de cambios con OpenSpec

Todo cambio funcional, de arquitectura o de interfaz se gestiona con OpenSpec antes de modificar código de producción.

1. **Explorar:** delimitar el problema y revisar el módulo afectado.
2. **Proponer:** crear propuesta, especificación, diseño y tareas en `openspec/changes/<cambio>/`.
3. **Revisar:** aprobar los artefactos antes de implementar.
4. **Aplicar:** ejecutar tareas aprobadas y marcarlas al completarlas.
5. **Verificar:** validar requisitos, typecheck, lint y pruebas aplicables.
6. **Archivar:** integrar la especificación vigente y conservar el historial del cambio.

Comandos útiles:

```bash
npx @fission-ai/openspec@latest list
npx @fission-ai/openspec@latest list --specs
npx @fission-ai/openspec@latest status --change <nombre-del-cambio>
npx @fission-ai/openspec@latest validate <nombre-del-cambio> --strict
```

Las habilidades de OpenSpec para Codex están en `.agents/skills/`. Las reglas de dominio contable de `.agents/skills/sistema-contable-modular/` continúan siendo obligatorias para cualquier cambio que afecte datos, cálculos o reportes financieros.
