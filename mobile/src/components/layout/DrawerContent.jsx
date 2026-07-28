import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { DrawerContentScrollView } from '@react-navigation/drawer';
import { useRouter, usePathname } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '../../store/authStore';
import { authService } from '../../services/auth.service';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';

const COLORS = {
  bg: '#0f172a',
  surface: '#1e293b',
  border: '#334155',
  primary: '#6366f1',
  primaryDark: '#4f46e5',
  text: '#f1f5f9',
  textMuted: '#94a3b8',
  textDim: '#64748b',
  red: '#ef4444',
};

const NAV_ITEMS = [
  { label: 'Dashboard', icon: 'grid-outline', href: '/(app)/dashboard' },
  { label: 'Faculty', icon: 'people-outline', href: '/(app)/faculty' },
  { label: 'Students', icon: 'school-outline', href: '/(app)/students' },
  { label: 'Coordinators', icon: 'person-circle-outline', href: '/(app)/coordinators' },
  { label: 'Activities', icon: 'trophy-outline', href: '/(app)/activities' },
];

export default function DrawerContent(props) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            try {
              await authService.logout();
            } catch (_) {
              // ignore server logout errors
            }
            logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const isActive = (href) => {
    if (href === '/(app)/dashboard') return pathname === '/dashboard' || pathname === '/(app)/dashboard';
    if (href === '/(app)/faculty') return pathname.startsWith('/faculty') || pathname.startsWith('/(app)/faculty');
    if (href === '/(app)/activities') return pathname.startsWith('/activities') || pathname.startsWith('/(app)/activities');
    const slug = href.replace('/(app)/', '');
    return pathname.includes(slug);
  };

  const getRoles = () => {
    if (!user?.roles) return [];
    return user.roles.map((r) => (r.role ? r.role.name : r.name)).filter(Boolean);
  };

  return (
    <View style={styles.container}>
      {/* Brand Header */}
      <View style={styles.brandHeader}>
        <View style={styles.brandLogo}>
          <Ionicons name="school" size={24} color="#fff" />
        </View>
        <View style={styles.brandTextWrap}>
          <Text style={styles.brandTitle}>Dept Portal</Text>
          <Text style={styles.brandSub}>HOD Management</Text>
        </View>
      </View>

      {/* User Info */}
      <View style={styles.userCard}>
        <Avatar name={user?.name || 'User'} size={48} />
        <View style={styles.userInfo}>
          <Text style={styles.userName} numberOfLines={1}>{user?.name || 'HOD'}</Text>
          <Text style={styles.userDesignation} numberOfLines={1}>
            {user?.designation || 'Head of Department'}
          </Text>
          <Text style={styles.userDept} numberOfLines={1}>
            {user?.department?.name || user?.department || ''}
          </Text>
        </View>
      </View>

      {/* Role badges */}
      {getRoles().length > 0 && (
        <View style={styles.rolesRow}>
          {getRoles().slice(0, 3).map((role, i) => (
            <Badge key={i} label={role} />
          ))}
        </View>
      )}

      <View style={styles.divider} />

      {/* Navigation */}
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.navContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.navLabel}>NAVIGATION</Text>
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href);
          return (
            <TouchableOpacity
              key={item.href}
              style={[styles.navItem, active && styles.navItemActive]}
              onPress={() => router.push(item.href)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={active ? item.icon.replace('-outline', '') : item.icon}
                size={20}
                color={active ? COLORS.primary : COLORS.textMuted}
              />
              <Text style={[styles.navItemText, active && styles.navItemTextActive]}>
                {item.label}
              </Text>
              {active && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </DrawerContentScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.signOutBtn} onPress={handleLogout} activeOpacity={0.7}>
          <Ionicons name="log-out-outline" size={20} color={COLORS.red} />
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
        <Text style={styles.footerVersion}>Education ERP v1.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  brandLogo: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTextWrap: {
    flex: 1,
  },
  brandTitle: {
    color: COLORS.text,
    fontSize: 17,
    fontWeight: '700',
  },
  brandSub: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 1,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
  },
  userDesignation: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  userDept: {
    color: COLORS.textDim,
    fontSize: 11,
    marginTop: 1,
  },
  rolesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingHorizontal: 20,
    paddingBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: 20,
  },
  navContainer: {
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 8,
  },
  navLabel: {
    color: COLORS.textDim,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginLeft: 12,
    marginBottom: 6,
    marginTop: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 2,
    position: 'relative',
  },
  navItemActive: {
    backgroundColor: '#6366f118',
  },
  navItemText: {
    color: COLORS.textMuted,
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  navItemTextActive: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  activeIndicator: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
  footer: {
    paddingBottom: 32,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  signOutText: {
    color: COLORS.red,
    fontSize: 14,
    fontWeight: '600',
  },
  footerVersion: {
    color: COLORS.textDim,
    fontSize: 11,
    textAlign: 'center',
    paddingBottom: 4,
  },
});
