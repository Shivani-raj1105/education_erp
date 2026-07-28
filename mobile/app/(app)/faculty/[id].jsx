import React from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
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

export default function FacultyProfileScreen() {
  const { id } = useLocalSearchParams();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['faculty-mobile-detail', id],
    queryFn: () => facultyService.getById(id),
    enabled: !!id,
  });

  const faculty = data?.data;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={refetch}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
      >
        {isLoading && <LoadingSpinner message="Loading profile..." />}
        {isError && (
          <ErrorBox message={error?.response?.data?.message || 'Unable to load faculty profile'} onRetry={refetch} />
        )}

        {faculty && (
          <>
            <View style={styles.headerCard}>
              <View style={styles.avatarWrap}>
                <Text style={styles.avatarText}>{faculty.name?.slice(0, 2).toUpperCase()}</Text>
              </View>
              <View style={styles.headerInfo}>
                <Text style={styles.name}>{faculty.name}</Text>
                <Text style={styles.designation}>{faculty.designation || 'Faculty Member'}</Text>
                <Text style={styles.department}>{faculty.department?.name || faculty.department || 'Department'}</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Ionicons name="mail-outline" size={18} color={COLORS.primary} />
                <Text style={styles.infoText}>{faculty.email || 'Email unavailable'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="call-outline" size={18} color={COLORS.primary} />
                <Text style={styles.infoText}>{faculty.phone || 'Phone unavailable'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="school-outline" size={18} color={COLORS.primary} />
                <Text style={styles.infoText}>{faculty.qualification || 'Qualification not listed'}</Text>
              </View>
            </View>

            <View style={styles.infoCard}>
              <Text style={styles.sectionTitle}>Roles</Text>
              {faculty.roles?.length > 0 ? (
                faculty.roles.map((role, index) => (
                  <View key={`${role.role?.slug || role.slug || index}`} style={styles.roleItem}>
                    <View style={styles.roleDot} />
                    <Text style={styles.roleText}>{role.role?.name || role.name}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.emptyText}>No roles assigned</Text>
              )}
            </View>
          </>
        )}
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
  headerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    gap: 14,
  },
  avatarWrap: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: COLORS.primary + '22',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '700',
  },
  headerInfo: {
    flex: 1,
    gap: 3,
  },
  name: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
  },
  designation: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  department: {
    color: COLORS.textDim,
    fontSize: 12,
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    color: COLORS.text,
    fontSize: 14,
    flex: 1,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },
  roleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 4,
  },
  roleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.green,
  },
  roleText: {
    color: COLORS.textMuted,
    fontSize: 14,
  },
  emptyText: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
});
