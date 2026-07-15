import React from 'react';
import { Tabs } from 'expo-router';
import { BarChart3, Users, Megaphone } from 'lucide-react-native';

export default function AdminTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#171717',
          borderTopColor: '#333',
          paddingTop: 10,
        },
        tabBarActiveTintColor: '#E7FF45',
        tabBarInactiveTintColor: '#666',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <BarChart3 color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="residents"
        options={{
          title: 'Residents',
          tabBarIcon: ({ color }) => <Users color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="announcements"
        options={{
          title: 'Broadcast',
          tabBarIcon: ({ color }) => <Megaphone color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
