import React from 'react';
import { Tabs } from 'expo-router';
import { Home, User, Bell } from 'lucide-react-native';

export default function ResidentTabsLayout() {
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
      {/* 
        Other tabs will be added in Phase 4 (Amenities, Services, etc)
      */}
    </Tabs>
  );
}
