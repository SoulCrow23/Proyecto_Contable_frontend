import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../theme/theme';

export type ModuloActivo = 'empresa' | 'catalogo' | 'asientos' | 'mayor' | 'reportes';

interface TabBarProps {
  activo: ModuloActivo;
  onCambiar: (modulo: ModuloActivo) => void;
}

const TABS: { id: ModuloActivo; label: string; icon: string }[] = [
  { id: 'empresa', label: 'Empresa', icon: '🏢' },
  { id: 'catalogo', label: 'Catálogo', icon: '📋' },
  { id: 'asientos', label: 'Libro Diario', icon: '📝' },
  { id: 'mayor', label: 'Libro Mayor', icon: '⚖️' },
  { id: 'reportes', label: 'Estados Fin.', icon: '📊' },
];

export const TabBar: React.FC<TabBarProps> = ({ activo, onCambiar }) => {
  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {TABS.map((tab) => {
          const isSelected = activo === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              style={[styles.tab, isSelected && styles.tabSelected]}
              onPress={() => onCambiar(tab.id)}
              activeOpacity={0.7}
            >
              <Text style={styles.icon}>{tab.icon}</Text>
              <Text style={[styles.label, isSelected && styles.labelSelected]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  container: {
    flexDirection: 'row',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 8,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: theme.borderRadius.full,
    marginHorizontal: 4,
    backgroundColor: theme.colors.surfaceVariant,
  },
  tabSelected: {
    backgroundColor: theme.colors.primary,
  },
  icon: {
    fontSize: 14,
    marginRight: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  labelSelected: {
    color: '#ffffff',
  },
});
