import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { dashboardService } from '../../src/services/faculty.service';
import { useAuthStore } from '../../src/store/authStore';
import LoadingSpinner from '../../src/components/ui/LoadingSpinner';
import ErrorBox from '../../src/components/ui/ErrorBox';
import Avatar from '../../src/components/ui/Avatar';
import StatCard from '../../src/components/ui/StatCard';

const COLORS = {
  bg: '#0f172a',
  surface: '#1e293b',
  border: '#334155',
  primary: '#6366f1',
  text: '#f1f5f9',
  textMuted: '#94a3b8',
  textDim: '#64748b',
  green: '#22c55e',
  amber: '#f59e0b',
  red: '#ef4444',
  blue: '#3b82f6',
};

const MGMT_CARDS = [
  {
    title: 'Faculty Management',
    desc: 'View faculty profiles, designations, and qualifications',
    icon: 'people',
    color: '#6366f1',
    href: '/(app)/faculty',
  },
  {
    title: 'Student Management',
    desc: 'Browse students by semester, section, attendance & performance',
    icon: 'school',
    color: '#10b981',
    href: '/(app)/students',
  },
  {
    title: 'Activities & Events',
    desc: 'Track hackathons, sports, industry projects and more',
    icon: 'trophy',
    color: '#f59e0b',
    href: '/(app)/activities',
  },
];

function formatTimestamp(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function getActionLabel(action) {
  const map = {
    ASSIGN_ROLE: 'Assigned role',
    REMOVE_ROLE: 'Removed role',
    CREATE_FACULTY: 'Added faculty',
    UPDATE_FACULTY: 'Updated faculty',
    DELETE_FACULTY: 'Removed faculty',
  };
  return map[action] || action;
}

export default function DashboardScreen() {
  const router = useRouter();
  const { user } = useAuthStore();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['dashboard'],
    queryFn: () => dashboardService.get(),
  });

  const stats = data?.data?.stats;
  const dept = data?.data?.department;
  const recentActivity = data?.data?.recentActivity || [];
  const roleDistribution = data?.data?.roleDistribution || [];

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
        {/* Welcome Banner */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeLeft}>
            <Text style={styles.welcomeGreeting}>Good day,</Text>
            <Text style={styles.welcomeName} numberOfLines={2}>
              {user?.name || 'HOD'}
            </Text>
            <Text style={styles.welcomeRole}>
              {dept?.name || user?.department?.name || 'Department'}
            </Text>
          </View>
          <Avatar name={user?.name || 'HOD'} size={60} />
        </View>

        {/* Stats */}
        {isLoading && <LoadingSpinner message="Loading dashboard..." />}
        {isError && (
          <ErrorBox
            message={error?.response?.data?.message || 'Failed to load dashboard data'}
            onRetry={refetch}
          />
        )}

        {stats && (
          <>
            <Text style={styles.sectionTitle}>Department Overview</Text>
            <View style={styles.statsRow}>
              <StatCard
                label="Total Faculty"
                value={stats.totalFaculty}
                icon="people-outline"
                color={COLORS.primary}
              />
              <StatCard
                label="Active"
                value={stats.activeFaculty}
                icon="checkmark-circle-outline"
                color={COLORS.green}
              />
            </View>
            <View style={styles.statsRow}>
              <StatCard
                label="On Leave"
                value={stats.onLeave}
                icon="time-outline"
                color={COLORS.amber}
              />
              <StatCard
                label="Coordinators"
                value={stats.coordinatorCount}
                icon="person-circle-outline"
                color={COLORS.blue}
              />
            </View>
            {stats.totalStudents > 0 && (
              <View style={styles.statsRow}>
                <StatCard
                  label="Total Students"
                  value={stats.totalStudents}
                  icon="school-outline"
                  color={COLORS.green}
                />
                <StatCard
                  label="Semesters"
                  value={stats.totalSemesters}
                  icon="calendar-outline"
                  color={COLORS.primary}
                />
              </View>
            )}
          </>
        )}

        {/* Management Cards */}
        <Text style={styles.sectionTitle}>Quick Access</Text>
        {MGMT_CARDS.map((card) => (
          <TouchableOpacity
            key={card.href}
            style={styles.mgmtCard}
            onPress={() => router.push(card.href)}
            activeOpacity={0.75}
          >
            <View style={[styles.mgmtIconWrap, { backgroundColor: card.color + '22' }]}>
              <Ionicons name={card.icon} size={26} color={card.color} />
            </View>
            <View style={styles.mgmtInfo}>
              <Text style={styles.mgmtTitle}>{card.title}</Text>
              <Text style={styles.mgmtDesc}>{card.desc}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={COLORS.textDim} />
          </TouchableOpacity>
        ))}

        {/* Role Distribution */}
        {roleDistribution.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Role Distribution</Text>
            <View style={styles.roleCard}>
              {roleDistribution.map((item, i) => (
                <View key={i} style={[styles.roleRow, i < roleDistribution.length - 1 && styles.roleRowBorder]}>
                  <Text style={styles.roleName}>{item.role?.name || item.role?.slug}</Text>
                  <View style={styles.roleCountWrap}>
                    <Text style={styles.roleCount}>{item.count}</Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {/* Recent Activity */}
        {recentActivity.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <View style={styles.activityCard}>
              {recentActivity.slice(0, 5).map((activity, i) => (
                <View
                  key={activity.id || i}
                  style={[styles.activityRow, i < recentActivity.length - 1 && styles.activityBorder]}
                >
                  <View style={styles.activityDot} />
                  <View style={styles.activityInfo}>
                    <Text style={styles.activityText}>
                      <Text style={styles.activityActor}>{activity.performer?.name} </Text>
                      {getActionLabel(activity.action)}
                      {activity.details?.roleName ? (
                        <Text style={styles.activityHighlight}> "{activity.details.roleName}"</Text>
                      ) : null}
                      {activity.target?.name ? (
                        <Text> to {activity.target.name}</Text>
                      ) : null}
                    </Text>
                    <Text style={styles.activityTime}>{formatTimestamp(activity.timestamp)}</Text>
                  </View>
                </View>
              ))}
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
    gap: 0,
  },
  welcomeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 20,
    marginBottom: 20,
  },
  welcomeLeft: {
    flex: 1,
    marginRight: 12,
  },
  welcomeGreeting: {
    color: COLORS.textMuted,
    fontSize: 13,
  },
  welcomeName: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '700',
    marginTop: 2,
    marginBottom: 4,
  },
  welcomeRole: {
    color: COLORS.textDim,
    fontSize: 12,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  mgmtCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 10,
    gap: 14,
  },
  mgmtIconWrap: {
    width: 52,
    height: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mgmtInfo: {
    flex: 1,
  },
  mgmtTitle: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
  },
  mgmtDesc: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
    lineHeight: 17,
  },
  roleCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  roleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  roleRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  roleName: {
    color: COLORS.text,
    fontSize: 13,
  },
  roleCountWrap: {
    backgroundColor: COLORS.primary + '22',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 20,
  },
  roleCount: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '700',
  },
  activityCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 14,
    gap: 12,
  },
  activityBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginTop: 5,
  },
  activityInfo: {
    flex: 1,
    gap: 3,
  },
  activityText: {
    color: COLORS.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  activityActor: {
    color: COLORS.text,
    fontWeight: '600',
  },
  activityHighlight: {
    color: COLORS.primary,
  },
  activityTime: {
    color: COLORS.textDim,
    fontSize: 11,
  },
});
