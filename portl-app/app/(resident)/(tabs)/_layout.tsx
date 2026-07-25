import React from 'react';
import { Tabs } from 'expo-router';
import { Home, Users, Megaphone, Calendar, Wrench } from 'lucide-react-native';

export default function ResidentTabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopColor: '#F1F5F9',
          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          height: 65,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#0F172A',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarLabelStyle: {
          fontWeight: '700',
          fontSize: 10,
        }
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <Home color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="visitors"
        options={{
          title: 'Visitors',
          tabBarIcon: ({ color }) => <Users color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: 'Notice',
          tabBarIcon: ({ color }) => <Megaphone color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color }) => <Calendar color={color} size={22} />,
        }}
      />
      <Tabs.Screen
        name="complaints"
        options={{
          title: 'Helpdesk',
          tabBarIcon: ({ color }) => <Wrench color={color} size={22} />,
        }}
      />
    </Tabs>
  );
}
