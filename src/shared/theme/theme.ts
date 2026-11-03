export const theme = {
  colors: {
    primary: '#0f2b48',          // Azul marino institucional contable
    primaryLight: '#1e3a5f',
    primaryDark: '#091829',
    accent: '#2563eb',           // Azul de acción
    accentHover: '#1d4ed8',

    // Estados Contables
    debe: '#1e40af',             // Azul contable para Débitos / Debe
    haber: '#065f46',            // Verde contable para Créditos / Haber
    cuadrado: '#059669',         // Verde éxito de balance
    descuadrado: '#dc2626',      // Rojo alerta de partida descuadrada

    // Superficie y fondos
    background: '#f1f5f9',       // Gris pizarra claro
    surface: '#ffffff',
    surfaceVariant: '#f8fafc',
    border: '#cbd5e1',
    borderLight: '#e2e8f0',

    // Textos
    textPrimary: '#0f172a',
    textSecondary: '#475569',
    textMuted: '#94a3b8',
    textInverse: '#ffffff',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 6,
    md: 10,
    lg: 16,
    full: 9999,
  },
  typography: {
    h1: { fontSize: 24, fontWeight: '700' as const },
    h2: { fontSize: 20, fontWeight: '700' as const },
    h3: { fontSize: 16, fontWeight: '600' as const },
    body: { fontSize: 14, fontWeight: '400' as const },
    bodyBold: { fontSize: 14, fontWeight: '600' as const },
    caption: { fontSize: 12, fontWeight: '400' as const },
    mono: { fontFamily: 'monospace', fontSize: 13 },
  },
};
