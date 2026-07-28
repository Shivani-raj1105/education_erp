import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const VARIANT_STYLES = {
  default: { bg: '#334155', text: '#94a3b8' },
  primary: { bg: '#3730a3', text: '#a5b4fc' },
  green: { bg: '#14532d', text: '#86efac' },
  amber: { bg: '#78350f', text: '#fcd34d' },
  red: { bg: '#7f1d1d', text: '#fca5a5' },
  blue: { bg: '#1e3a5f', text: '#93c5fd' },
  purple: { bg: '#4c1d95', text: '#c4b5fd' },
  emerald: { bg: '#064e3b', text: '#6ee7b7' },
  hod: { bg: '#1e3a5f', text: '#93c5fd' },
  active: { bg: '#14532d', text: '#86efac' },
  inactive: { bg: '#374151', text: '#9ca3af' },
  on_leave: { bg: '#78350f', text: '#fcd34d' },
};

function getVariantFromText(label = '') {
  const upper = label.toUpperCase();
  if (upper === 'HOD') return 'hod';
  if (upper === 'ACTIVE') return 'active';
  if (upper === 'INACTIVE') return 'inactive';
  if (upper === 'ON_LEAVE' || upper === 'ON LEAVE') return 'on_leave';
  return 'default';
}

export default function Badge({ label = '', variant, style }) {
  const resolvedVariant = variant || getVariantFromText(label);
  const vs = VARIANT_STYLES[resolvedVariant] || VARIANT_STYLES.default;

  return (
    <View style={[styles.badge, { backgroundColor: vs.bg }, style]}>
      <Text style={[styles.text, { color: vs.text }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
