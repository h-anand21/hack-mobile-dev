import React from 'react';
import { View, Text } from 'react-native';
import { Tabs } from 'expo-router';
import { Home, Users, Wrench, Bell, User } from 'lucide-react-native';

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

      {/* 3. HELPDESK (As shown in reference mock image) */}
      <Tabs.Screen
        name="complaints"
        options={{
          title: 'Helpdesk',
          tabBarIcon: ({ color }) => <Wrench color={color} size={22} />,
        }}
      />

      {/* 4. NOTIFICATIONS */}
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Notifications',
          tabBarIcon: ({ color }) => (
            <View className="relative">
              <Bell color={color} size={22} />
              <View className="absolute -top-1 -right-2 bg-rose-500 w-4 h-4 rounded-full items-center justify-center border-2 border-[#1E293B]">
                <Text className="text-white text-[9px] font-black">3</Text>
              </View>
            </View>
          ),
        }}
      />

      {/* 5. PROFILE */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ color }) => <User color={color} size={22} />,
        }}
      />

      {/* HIDE OTHER PAGES FROM BOTTOM BAR */}
      <Tabs.Screen
        name="community"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="services"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="payments"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
