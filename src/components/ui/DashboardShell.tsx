import React, { useEffect, useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { ModuloActivo } from './TabBar';
import { applyThemeMode, getStoredThemeMode, theme, ThemeMode } from './theme/theme';

export interface DashboardNavigationItem {
  id: ModuloActivo;
  label: string;
  icon: string;
}

const navigationItems: DashboardNavigationItem[] = [
  { id: 'empresa', label: 'Empresa', icon: '◈' },
  { id: 'catalogo', label: 'Catálogo de cuentas', icon: '▤' },
  { id: 'asientos', label: 'Libro diario', icon: '✎' },
  { id: 'mayor', label: 'Libro mayor', icon: '⊞' },
  { id: 'reportes', label: 'Reportes', icon: '◫' },
];

interface DashboardShellProps {
  activeModule: ModuloActivo;
  onModuleChange: (module: ModuloActivo) => void;
  title: string;
  subtitle: string;
  companyName: string;
  period: string;
  children: React.ReactNode;
}

export function DashboardShell({
  activeModule,
  onModuleChange,
  title,
  subtitle,
  companyName,
  period,
  children,
}: DashboardShellProps) {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 900;
  const [themeMode, setThemeMode] = useState<ThemeMode>(getStoredThemeMode);

  useEffect(() => {
    applyThemeMode(themeMode);
  }, [themeMode]);

  const navigation = (
    <View style={isDesktop ? styles.sidebar : styles.mobileNavigation}>
      {isDesktop && (
        <>
          <View style={styles.brandBlock}>
            <View style={styles.brandMark}><Text style={styles.brandMarkText}>C</Text></View>
            <View>
              <Text style={styles.brandName}>ContaFlow</Text>
              <Text style={styles.brandCaption}>Sistema financiero</Text>
            </View>
          </View>
          <Text style={styles.sectionLabel}>GESTIÓN CONTABLE</Text>
        </>
      )}
      <View style={isDesktop ? styles.navigationList : styles.mobileNavigationList}>
        {navigationItems.map((item) => {
          const selected = item.id === activeModule;
          return (
            <Pressable
              accessibilityRole="tab"
              accessibilityState={{ selected }}
              key={item.id}
              onPress={() => onModuleChange(item.id)}
              style={[styles.navigationItem, selected && (themeMode === 'dark' ? styles.navigationItemSelectedDark : styles.navigationItemSelected)]}
            >
              <Text style={[styles.navigationIcon, selected && styles.navigationTextSelected]}>{item.icon}</Text>
              <Text numberOfLines={1} style={[styles.navigationText, selected && styles.navigationTextSelected]}>
                {item.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
      {isDesktop && (
        <View style={styles.sidebarFooter}>
          <Text style={styles.sidebarFooterTitle}>Ejercicio activo</Text>
          <Text style={styles.sidebarFooterText}>{period}</Text>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.root}>
      {isDesktop && navigation}
      <View style={styles.main}>
        <View style={styles.topbar}>
          <View style={styles.breadcrumbs}>
            <Text style={styles.breadcrumbText}>Sistema contable</Text>
            <Text style={styles.breadcrumbDivider}>/</Text>
            <Text style={styles.breadcrumbActive}>{title}</Text>
          </View>
          <View style={styles.topbarActions}>
            <View style={styles.companyBadge}>
              <Text numberOfLines={1} style={styles.companyBadgeText}>{companyName}</Text>
            </View>
            <Pressable
              accessibilityRole="switch"
              accessibilityState={{ checked: themeMode === 'dark' }}
              onPress={() => setThemeMode((current) => current === 'dark' ? 'light' : 'dark')}
              style={styles.themeToggle}
            >
              <Text style={styles.themeToggleText}>{themeMode === 'dark' ? '☀ Tema claro' : '◐ Tema oscuro'}</Text>
            </Pressable>
          </View>
        </View>
        {!isDesktop && navigation}
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.pageHeading}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
          </View>
          {children}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: theme.colors.background },
  sidebar: { width: 256, backgroundColor: theme.colors.surface, borderRightWidth: 1, borderRightColor: theme.colors.borderLight, padding: 16 },
  brandBlock: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 12, marginBottom: 30 },
  brandMark: { width: 34, height: 34, borderRadius: 10, backgroundColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center' },
  brandMarkText: { color: theme.colors.textInverse, fontSize: 18, fontWeight: '800' },
  brandName: { color: theme.colors.textPrimary, fontSize: 16, fontWeight: '800' },
  brandCaption: { color: theme.colors.textMuted, fontSize: 11, marginTop: 1 },
  sectionLabel: { color: theme.colors.textMuted, fontSize: 10, fontWeight: '700', letterSpacing: 0.8, marginBottom: 8, paddingHorizontal: 10 },
  navigationList: { gap: 4 },
  navigationItem: { flexDirection: 'row', alignItems: 'center', gap: 10, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 11 },
  navigationItemSelected: { backgroundColor: '#eff6ff' },
  navigationItemSelectedDark: { backgroundColor: '#1e3a5f' },
  navigationIcon: { color: theme.colors.textSecondary, fontSize: 17, width: 20, textAlign: 'center' },
  navigationText: { color: theme.colors.textSecondary, fontSize: 14, fontWeight: '600' },
  navigationTextSelected: { color: theme.colors.accent },
  sidebarFooter: { marginTop: 'auto', backgroundColor: theme.colors.surfaceVariant, borderRadius: 10, padding: 12 },
  sidebarFooterTitle: { color: theme.colors.textSecondary, fontSize: 11, fontWeight: '700' },
  sidebarFooterText: { color: theme.colors.textPrimary, fontSize: 12, marginTop: 4 },
  main: { flex: 1, minWidth: 0 },
  topbar: { minHeight: 64, backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24 },
  breadcrumbs: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  breadcrumbText: { color: theme.colors.textMuted, fontSize: 13 },
  breadcrumbDivider: { color: theme.colors.textMuted, fontSize: 13 },
  breadcrumbActive: { color: theme.colors.textSecondary, fontSize: 13, fontWeight: '600' },
  companyBadge: { maxWidth: 260, backgroundColor: theme.colors.surfaceVariant, borderWidth: 1, borderColor: theme.colors.borderLight, borderRadius: 999, paddingHorizontal: 12, paddingVertical: 7 },
  companyBadgeText: { color: theme.colors.textSecondary, fontSize: 12, fontWeight: '600' },
  topbarActions: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  themeToggle: { borderWidth: 1, borderColor: theme.colors.border, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 7 },
  themeToggleText: { color: theme.colors.textSecondary, fontSize: 12, fontWeight: '700' },
  mobileNavigation: { backgroundColor: theme.colors.surface, borderBottomWidth: 1, borderBottomColor: theme.colors.borderLight },
  mobileNavigationList: { flexDirection: 'row', paddingHorizontal: 8, paddingVertical: 7, gap: 3, overflow: 'hidden' },
  content: { flexGrow: 1, alignSelf: 'stretch', paddingHorizontal: 24, paddingVertical: 28 },
  pageHeading: { marginBottom: 18 },
  title: { color: theme.colors.textPrimary, fontSize: 20, lineHeight: 28, fontWeight: '700', letterSpacing: -0.2 },
  subtitle: { color: theme.colors.textSecondary, fontSize: 14, marginTop: 5 },
});
