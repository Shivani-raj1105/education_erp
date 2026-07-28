import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { facultyService } from '../../../src/services/faculty.service';
import LoadingSpinner from '../../../src/components/ui/LoadingSpinner';
import ErrorBox from '../../../src/components/ui/ErrorBox';

const COLORS = {
  bg: '#0f172a',
  surface: '#1e293b',
  border: '#334155',
  primary: '#6366f1',
  text: '#f1f5f9',
  textMuted: '#94a3b8',
  textDim: '#64748b',
  green: '#22c55e',
};

function getInitials(name) {
  if (!name) return 'U';
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();
}

export default function FacultyScreen() {
  const router = useRouter();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['faculty-mobile-list'],
    queryFn: () => facultyService.getAll({ page: 1, limit: 25 }),
  });

  const faculty = data?.data || [];
  const total = data?.pagination?.total || faculty.length;

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
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Faculty</Text>
            <Text style={styles.subtitle}>{total} faculty members in your department</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>Active</Text>
          </View>
        </View>

        {isLoading && <LoadingSpinner message="Loading faculty..." />}
        {isError && (
          <ErrorBox message={error?.response?.data?.message || 'Failed to load faculty'} onRetry={refetch} />
        )}

        {!isLoading && !isError && faculty.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons name="people-outline" size={32} color={COLORS.textMuted} />
            <Text style={styles.emptyTitle}>No faculty found</Text>
            <Text style={styles.emptyText}>Your department has no faculty records yet.</Text>
          </View>
        )}

        {faculty.map((person) => {
          const roles = person.roles || [];
          const primaryRole = roles[0]?.role?.name || roles[0]?.name || person.designation || 'Faculty';
          return (
            <TouchableOpacity
              key={person.id}
              style={styles.card}
              activeOpacity={0.8}
              onPress={() =>
                router.push({ pathname: '/(app)/faculty/[id]', params: { id: person.id } })
              }
            >
              <View style={styles.avatarWrap}>
                <Text style={styles.avatarText}>{getInitials(person.name)}</Text>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.name}>{person.name}</Text>
                <Text style={styles.meta}>{primaryRole}</Text>
                <Text style={styles.metaMuted}>
                  {person.department?.name || person.department || 'Department'}
                </Text>
                {roles.length > 0 && (
                  <View style={styles.rolesRow}>
                    {roles.slice(0, 3).map((role, index) => (
                      <View key={`${role.role?.slug || role.slug || index}`} style={styles.roleChip}>
                        <Text style={styles.roleText}>{role.role?.name || role.name}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
              <Ionicons name="chevron-forward" size={18} color={COLORS.textDim} />
            </TouchableOpacity>
          );
        })}
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '700',
  },
  subtitle: {
    color: COLORS.textMuted,
    fontSize: 13,
    marginTop: 4,
  },
  badge: {
    backgroundColor: COLORS.green + '22',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  badgeText: {
    color: COLORS.green,
    fontSize: 12,
    fontWeight: '700',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 14,
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
    fontSize: 16,
    fontWeight: '700',
  },
  cardBody: {
    flex: 1,
    gap: 3,
  },
  name: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
  },
  meta: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  metaMuted: {
    color: COLORS.textDim,
    fontSize: 12,
  },
  rolesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
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
