import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Users, Wrench, User } from 'lucide-react-native';

export default function ResidentTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1E293B',
          borderTopColor: 'transparent',
          elevation: 12,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.1,
          shadowRadius: 12,
          height: 68,
          paddingBottom: 10,
          paddingTop: 10,
          marginHorizontal: 16,
          marginBottom: 16,
          borderRadius: 32,
          position: 'absolute',
        },
        tabBarActiveTintColor: '#D2FC52',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: {
          fontWeight: '700',
          fontSize: 10,
        }
      }}
    >
      {/* 1. HOME */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home color={color} size={22} />,
        }}
      />

      {/* 2. VISITORS */}
      <Tabs.Screen
        name="visitors"
        options={{
          title: 'Visitors',
          tabBarIcon: ({ color }) => <Users color={color} size={22} />,
        }}
      />

      {/* 3. HELPDESK */}
      <Tabs.Screen
        name="complaints"
        options={{
          title: 'Helpdesk',
          tabBarIcon: ({ color }) => <Wrench color={color} size={22} />,
        }}
      />

      {/* 4. PROFILE */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User color={color} size={22} />,
        }}
      />

      {/* HIDE ALL OTHER SCREENS FROM BOTTOM BAR */}
      <Tabs.Screen name="notifications" options={{ href: null }} />
      <Tabs.Screen name="community" options={{ href: null }} />
      <Tabs.Screen name="services" options={{ href: null }} />
      <Tabs.Screen name="payments" options={{ href: null }} />
    </Tabs>
  );
}
