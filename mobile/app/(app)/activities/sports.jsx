import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  bg: '#0f172a',
  surface: '#1e293b',
  border: '#334155',
  primary: '#22c55e',
  text: '#f1f5f9',
  textMuted: '#94a3b8',
};

export default function SportsScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Ionicons name="basketball-outline" size={24} color={COLORS.primary} />
          <Text style={styles.title}>Sports</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.bodyText}>This page is ready for sports activity records using the existing activities API service.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: COLORS.bg },
  scroll: { flex: 1 },
  content: { padding: 16, gap: 12 },
  headerRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  title: { color: COLORS.text, fontSize: 20, fontWeight: '700' },
  card: { backgroundColor: COLORS.surface, borderColor: COLORS.border, borderWidth: 1, borderRadius: 14, padding: 16 },
  bodyText: { color: COLORS.textMuted, fontSize: 13, lineHeight: 20 },
});
