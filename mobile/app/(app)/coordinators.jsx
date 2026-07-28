import React from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { facultyService } from '../../src/services/faculty.service';
import LoadingSpinner from '../../src/components/ui/LoadingSpinner';
import ErrorBox from '../../src/components/ui/ErrorBox';

const COLORS = {
  bg: '#0f172a',
  surface: '#1e293b',
  border: '#334155',
  primary: '#6366f1',
  text: '#f1f5f9',
  textMuted: '#94a3b8',
  green: '#22c55e',
};

const COORDINATOR_SLUGS = [
  'TIMETABLE_COORDINATOR',
  'EXAM_COORDINATOR',
  'CULTURAL_COORDINATOR',
  'PLACEMENT_COORDINATOR',
];

export default function CoordinatorsScreen() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['coordinators-mobile'],
    queryFn: () => facultyService.getAll({ page: 1, limit: 100 }),
  });

  const faculty = (data?.data || []).filter((person) =>
    person.roles?.some((role) => COORDINATOR_SLUGS.includes(role.role?.slug || role.slug))
  );

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        <Text style={styles.title}>Coordinators</Text>
        <Text style={styles.subtitle}>Department coordinators and their assigned responsibilities</Text>

        {isLoading && <LoadingSpinner message="Loading coordinators..." />}
        {isError && (
          <ErrorBox message={error?.response?.data?.message || 'Failed to load coordinators'} onRetry={refetch} />
        )}

        {!isLoading && faculty.length === 0 && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No coordinators assigned</Text>
            <Text style={styles.emptyText}>Your department has no coordinator roles yet.</Text>
          </View>
        )}

        {faculty.map((person) => (
          <View key={person.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.avatarWrap}>
                <Text style={styles.avatarText}>{person.name?.slice(0, 2).toUpperCase()}</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.name}>{person.name}</Text>
                <Text style={styles.meta}>{person.designation || 'Faculty Member'}</Text>
              </View>
              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>Active</Text>
              </View>
            </View>
            <View style={styles.rolesWrap}>
              {person.roles?.map((role, index) => {
                const roleName = role.role?.name || role.name;
                return (
                  <View key={`${roleName}-${index}`} style={styles.roleChip}>
                    <Text style={styles.roleText}>{roleName}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        ))}
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
    padding: 14,
    gap: 10,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarWrap: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: COLORS.primary + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: COLORS.primary,
    fontSize: 15,
    fontWeight: '700',
  },
  cardBody: {
    flex: 1,
  },
  name: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
  },
  meta: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: COLORS.green + '22',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  statusText: {
    color: COLORS.green,
    fontSize: 11,
    fontWeight: '700',
  },
  rolesWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleChip: {
    backgroundColor: COLORS.primary + '15',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  roleText: {
    color: COLORS.primary,
    fontSize: 11,
    fontWeight: '600',
  },
  emptyState: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 24,
    alignItems: 'center',
    gap: 8,
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 13,
    textAlign: 'center',
  },
});
