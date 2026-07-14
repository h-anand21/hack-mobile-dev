import React from 'react';
import { Tabs } from 'expo-router';
import { Home, QrCode, ScrollText } from 'lucide-react-native';

export default function GuardTabsLayout() {
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
          title: 'Home',
          tabBarIcon: ({ color }) => <Home color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="scanner"
        options={{
          title: 'Scanner',
          tabBarIcon: ({ color }) => <QrCode color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <ScrollText color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
