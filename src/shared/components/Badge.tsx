import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme/theme';

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
    backgroundColor: '#dbeafe',
  },
  text_debe: {
    color: '#1e40af',
  },
  haber: {
    backgroundColor: '#d1fae5',
  },
  text_haber: {
    color: '#065f46',
  },
  success: {
    backgroundColor: '#dcfce7',
  },
  text_success: {
    color: '#15803d',
  },
  danger: {
    backgroundColor: '#fee2e2',
  },
  text_danger: {
    color: '#b91c1c',
  },
  info: {
    backgroundColor: '#e0f2fe',
  },
  text_info: {
    color: '#0369a1',
  },
  neutral: {
    backgroundColor: '#f1f5f9',
  },
  text_neutral: {
    color: '#475569',
  },
});
