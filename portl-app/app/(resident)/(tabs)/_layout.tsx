import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Headset, CalendarDays, Megaphone, IndianRupee } from 'lucide-react-native';

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
      <Tabs.Screen
        name="services"
        options={{
          title: 'Book',
          tabBarIcon: ({ color }) => <CalendarDays color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="complaints"
        options={{
          title: 'Help',
          tabBarIcon: ({ color }) => <Headset color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Notice',
          tabBarIcon: ({ color }) => <Megaphone color={color} size={24} />,
        }}
      />
      <Tabs.Screen
        name="payments"
        options={{
          title: 'Dues',
          tabBarIcon: ({ color }) => <IndianRupee color={color} size={24} />,
        }}
      />
    </Tabs>
  );
}
