import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from './theme/theme';

interface BadgeProps {
  label: string;
  variant?: 'debe' | 'haber' | 'success' | 'danger' | 'info' | 'neutral';
  size?: 'sm' | 'md';
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'neutral', size = 'sm' }) => {
  return (
    <View style={[styles.badge, styles[variant], size === 'md' && styles.badgeMd]}>
      <Text style={[styles.text, styles[`text_${variant}`], size === 'md' && styles.textMd]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.full,
    alignSelf: 'flex-start',
  },
  badgeMd: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
  },
  textMd: {
    fontSize: 13,
  },
  debe: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  text_debe: {
    color: theme.colors.debe,
  },
  haber: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  text_haber: {
    color: theme.colors.haber,
  },
  success: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  text_success: {
    color: theme.colors.cuadrado,
  },
  danger: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  text_danger: {
    color: theme.colors.descuadrado,
  },
  info: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  text_info: {
    color: theme.colors.accent,
  },
  neutral: {
    backgroundColor: theme.colors.surfaceVariant,
  },
  text_neutral: {
    color: theme.colors.textSecondary,
  },
});
