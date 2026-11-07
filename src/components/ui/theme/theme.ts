import { Platform } from 'react-native';

export type ThemeMode = 'light' | 'dark';

const cssColor = (name: string, fallback: string) =>
  Platform.OS === 'web' ? `var(--conta-${name}, ${fallback})` : fallback;

const palettes: Record<ThemeMode, Record<string, string>> = {
  light: {
    primary: '#0f172a', primaryLight: '#1e293b', primaryDark: '#020617', accent: '#2563eb', accentHover: '#1d4ed8',
    debe: '#1e40af', haber: '#065f46', cuadrado: '#059669', descuadrado: '#dc2626',
    background: '#f8fafc', surface: '#ffffff', surfaceVariant: '#f8fafc', border: '#dbe3ef', borderLight: '#e7edf5',
    textPrimary: '#0f172a', textSecondary: '#475569', textMuted: '#94a3b8', textInverse: '#ffffff',
  },
  dark: {
    primary: '#2563eb', primaryLight: '#3b82f6', primaryDark: '#1d4ed8', accent: '#60a5fa', accentHover: '#93c5fd',
    debe: '#93c5fd', haber: '#6ee7b7', cuadrado: '#34d399', descuadrado: '#f87171',
    background: '#0b0f16', surface: '#111827', surfaceVariant: '#161f2d', border: '#263244', borderLight: '#1e293b',
    textPrimary: '#f8fafc', textSecondary: '#cbd5e1', textMuted: '#94a3b8', textInverse: '#f8fafc',
  },
};

export function applyThemeMode(mode: ThemeMode): void {
  if (Platform.OS !== 'web' || typeof document === 'undefined') return;
  const root = document.documentElement;
  Object.entries(palettes[mode]).forEach(([name, color]) => root.style.setProperty(`--conta-${name}`, color));
  root.style.colorScheme = mode;
  localStorage.setItem('contaflow-theme', mode);
}

export function getStoredThemeMode(): ThemeMode {
  if (Platform.OS !== 'web' || typeof localStorage === 'undefined') return 'light';
  return localStorage.getItem('contaflow-theme') === 'dark' ? 'dark' : 'light';
}

export const theme = {
  colors: {
    primary: cssColor('primary', palettes.light.primary),
    primaryLight: cssColor('primaryLight', palettes.light.primaryLight),
    primaryDark: cssColor('primaryDark', palettes.light.primaryDark),
    accent: cssColor('accent', palettes.light.accent),
    accentHover: cssColor('accentHover', palettes.light.accentHover),

    // Estados Contables
    debe: cssColor('debe', palettes.light.debe),
    haber: cssColor('haber', palettes.light.haber),
    cuadrado: cssColor('cuadrado', palettes.light.cuadrado),
    descuadrado: cssColor('descuadrado', palettes.light.descuadrado),

    // Superficie y fondos
    background: cssColor('background', palettes.light.background),
    surface: cssColor('surface', palettes.light.surface),
    surfaceVariant: cssColor('surfaceVariant', palettes.light.surfaceVariant),
    border: cssColor('border', palettes.light.border),
    borderLight: cssColor('borderLight', palettes.light.borderLight),

    // Textos
    textPrimary: cssColor('textPrimary', palettes.light.textPrimary),
    textSecondary: cssColor('textSecondary', palettes.light.textSecondary),
    textMuted: cssColor('textMuted', palettes.light.textMuted),
    textInverse: cssColor('textInverse', palettes.light.textInverse),
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
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
