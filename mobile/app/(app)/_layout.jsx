import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { Drawer } from 'expo-router/drawer';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import DrawerContent from '../../src/components/layout/DrawerContent';

export default function AppLayout() {
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useAuthStore();

  useEffect(() => {
    if (isHydrated && !isAuthenticated) {
      router.replace('/(auth)/login');
    }
  }, [isAuthenticated, isHydrated]);

  if (!isHydrated) return null;
  if (!isAuthenticated) return null;

  return (
    <Drawer
      drawerContent={(props) => <DrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: '#0f172a' },
        headerTintColor: '#f1f5f9',
        headerTitleStyle: { fontWeight: '700', fontSize: 17 },
        headerShadowVisible: false,
        drawerStyle: { backgroundColor: '#0f172a', width: 280 },
        drawerActiveTintColor: '#6366f1',
        drawerInactiveTintColor: '#94a3b8',
        sceneContainerStyle: { backgroundColor: '#0f172a' },
      }}
    >
      <Drawer.Screen
        name="dashboard"
        options={{ title: 'Dashboard', drawerLabel: 'Dashboard' }}
      />
      <Drawer.Screen
        name="faculty/index"
        options={{ title: 'Faculty', drawerLabel: 'Faculty' }}
      />
      <Drawer.Screen
        name="faculty/[id]"
        options={{ title: 'Faculty Profile', drawerItemStyle: { display: 'none' } }}
      />
      <Drawer.Screen
        name="students"
        options={{ title: 'Students', drawerLabel: 'Students' }}
      />
      <Drawer.Screen
        name="coordinators"
        options={{ title: 'Coordinators', drawerLabel: 'Coordinators' }}
      />
      <Drawer.Screen
        name="activities/index"
        options={{ title: 'Activities', drawerLabel: 'Activities' }}
      />
      <Drawer.Screen
        name="activities/industry-projects"
        options={{ title: 'Industry Projects', drawerItemStyle: { display: 'none' } }}
      />
      <Drawer.Screen
        name="activities/hackathons"
        options={{ title: 'Hackathons', drawerItemStyle: { display: 'none' } }}
      />
      <Drawer.Screen
        name="activities/sports"
        options={{ title: 'Sports', drawerItemStyle: { display: 'none' } }}
      />
      <Drawer.Screen
        name="activities/other-curricular"
        options={{ title: 'Other Curricular', drawerItemStyle: { display: 'none' } }}
      />
    </Drawer>
  );
}
