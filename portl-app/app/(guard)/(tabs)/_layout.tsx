import React from 'react';
import { Tabs, useRouter } from 'expo-router';
import { Home, Users, QrCode, Clock, User } from 'lucide-react-native';
import { View, TouchableOpacity, Text } from 'react-native';

export default function GuardTabsLayout() {
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

      {/* 3. SCANNER (CENTER RAISED BUTTON) */}
      <Tabs.Screen
        name="scanner"
        options={{
          title: 'Scanner',
          tabBarIcon: () => null,
          tabBarButton: (props) => (
            <TouchableOpacity
              onPress={() => router.push('/(guard)/(tabs)/scanner')}
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
                <QrCode color="#D2FC52" size={26} />
              </View>
              <Text style={{ color: '#163316', fontSize: 10, fontWeight: '800', marginTop: 2 }}>Scanner</Text>
            </TouchableOpacity>
          ),
        }}
      />

      {/* 4. HISTORY */}
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarIcon: ({ color }) => <Clock color={color} size={22} />,
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
    </Tabs>
  );
}
