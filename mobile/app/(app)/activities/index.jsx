import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const COLORS = {
  bg: '#0f172a',
  surface: '#1e293b',
  border: '#334155',
  primary: '#6366f1',
  text: '#f1f5f9',
  textMuted: '#94a3b8',
  green: '#22c55e',
  amber: '#f59e0b',
};

const CATEGORIES = [
  { label: 'Hackathons', icon: 'trophy-outline', href: '/(app)/activities/hackathons', color: COLORS.primary },
  { label: 'Sports', icon: 'basketball-outline', href: '/(app)/activities/sports', color: COLORS.green },
  { label: 'Industry Projects', icon: 'briefcase-outline', href: '/(app)/activities/industry-projects', color: COLORS.amber },
  { label: 'Other Curricular', icon: 'sparkles-outline', href: '/(app)/activities/other-curricular', color: '#8b5cf6' },
];

export default function ActivitiesHomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Activities</Text>
        <Text style={styles.subtitle}>Track department activities and event categories</Text>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Sub-navigation</Text>
          <View style={styles.grid}>
            {CATEGORIES.map((item) => (
              <TouchableOpacity
                key={item.href}
                style={styles.categoryCard}
                activeOpacity={0.8}
                onPress={() => router.push(item.href)}
              >
                <View style={[styles.iconWrap, { backgroundColor: item.color + '22' }]}>
                  <Ionicons name={item.icon} size={22} color={item.color} />
                </View>
                <Text style={styles.categoryLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <Text style={styles.bodyText}>Use the activity modules below to manage hackathons, sports, industry projects, and other extracurricular events.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  scroll: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
    gap: 12,
  },
  title: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    gap: 12,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryCard: {
    width: '47%',
    backgroundColor: COLORS.bg,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
    alignItems: 'center',
    gap: 8,
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryLabel: {
    color: COLORS.text,
    fontSize: 13,
    fontWeight: '600',
  },
  bodyText: {
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 19,
  },
});
