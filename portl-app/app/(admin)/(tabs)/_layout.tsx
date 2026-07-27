import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Home, Users, Shield, BarChart3, Settings } from 'lucide-react-native';
import { View, TouchableOpacity, Text } from 'react-native';

export default function AdminTabsLayout() {
  const router = useRouter();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#F1F5F9',
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
          height: 68,
          paddingBottom: 10,
          paddingTop: 8,
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          position: 'absolute',
        },
        tabBarActiveTintColor: '#163316',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: {
          fontWeight: '700',
          fontSize: 10,
        }
      }}
    >
      {/* 1. DASHBOARD */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Home color={color} size={22} />,
        }}
      />

      {/* 2. RESIDENTS */}
      <Tabs.Screen
        name="residents"
        options={{
          title: 'Residents',
          tabBarIcon: ({ color }) => <Users color={color} size={22} />,
        }}
      />

      {/* 3. GUARDS (CENTER RAISED BUTTON) */}
      <Tabs.Screen
        name="guards"
        options={{
          title: 'Guards',
          tabBarIcon: () => null,
          tabBarButton: () => (
            <TouchableOpacity
              onPress={() => router.push('/(admin)/(tabs)/guards')}
              style={{
                top: -24,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              activeOpacity={0.85}
            >
              <View style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: '#163316',
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#163316',
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
                borderWidth: 4,
                borderColor: '#FFFFFF'
              }}>
                <Shield color="#D2FC52" size={26} />
              </View>
              <Text style={{ color: '#163316', fontSize: 10, fontWeight: '800', marginTop: 2 }}>Guards</Text>
            </TouchableOpacity>
          ),
        }}
      />

      {/* 4. REPORTS */}
      <Tabs.Screen
        name="reports"
        options={{
          title: 'Reports',
          tabBarIcon: ({ color }) => <BarChart3 color={color} size={22} />,
        }}
      />

      {/* 5. SETTINGS */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Settings color={color} size={22} />,
        }}
      />

      {/* HIDDEN TAB (ANNOUNCEMENTS) */}
      <Tabs.Screen
        name="announcements"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
