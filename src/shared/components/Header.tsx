import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';
import { useContabilidadStore } from '../../store/contabilidadStore';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  const empresa = useContabilidadStore((s) => s.empresa);
  const cuentasCount = useContabilidadStore((s) => s.cuentas.length);
  const asientosCount = useContabilidadStore((s) => s.asientos.length);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <View style={styles.companyInfo}>
          <Text style={styles.companyName} numberOfLines={1}>
            {empresa.nombre}
          </Text>
          <Text style={styles.companyMeta}>
            RUC: {empresa.ruc} | Moneda: {empresa.moneda} | {empresa.periodoContable}
          </Text>
        </View>
        <View style={styles.statsPill}>
          <Text style={styles.statsText}>
            {cuentasCount} Cuentas • {asientosCount} Asientos
          </Text>
        </View>
      </View>
      <View style={styles.titleSection}>
        <Text style={styles.title}>{title}</Text>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary,
    paddingTop: 12,
    paddingBottom: 16,
    paddingHorizontal: theme.spacing.md,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.15)',
  },
  companyInfo: {
    flex: 1,
    marginRight: 8,
  },
  companyName: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  companyMeta: {
    color: '#94a3b8',
    fontSize: 11,
    marginTop: 2,
  },
  statsPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  statsText: {
    color: '#e2e8f0',
    fontSize: 10,
    fontWeight: '600',
  },
  titleSection: {
    marginTop: 12,
  },
  title: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    color: '#cbd5e1',
    fontSize: 13,
    marginTop: 2,
  },
});
