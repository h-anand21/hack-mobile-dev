import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Home, Users, Wrench, User, Bell } from 'lucide-react-native';
import { View, TouchableOpacity } from 'react-native';

export default function ResidentTabsLayout() {
  const router = useRouter();

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

      {/* 4. ALERTS — Uses tabBarButton to push without changing tab state (avoids redirect loop) */}
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Alerts',
          tabBarIcon: () => (
            <View style={{ position: 'relative' }}>
              <Bell color="#94A3B8" size={22} />
              <View style={{
                position: 'absolute',
                top: -2,
                right: -4,
                width: 8,
                height: 8,
                backgroundColor: '#F43F5E',
                borderRadius: 4,
                borderWidth: 1.5,
                borderColor: '#1E293B',
              }} />
            </View>
          ),
          // Custom button → push to /(resident)/notifications instead of switching tab
          tabBarButton: (props) => (
            <TouchableOpacity
              style={props.style}
              onPress={() => router.push('/(resident)/notifications')}
              accessibilityLabel="Alerts"
              activeOpacity={0.7}
            >
              {props.children}
            </TouchableOpacity>
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
      <Tabs.Screen name="community" options={{ href: null }} />
      <Tabs.Screen name="services" options={{ href: null }} />
      <Tabs.Screen name="payments" options={{ href: null }} />
    </Tabs>
  );
}
