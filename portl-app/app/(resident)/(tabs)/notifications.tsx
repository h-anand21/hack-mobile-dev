import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Bell, Users, Megaphone, CreditCard, Check, Clock, ChevronRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function NotificationsTab() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<'all' | 'approvals' | 'society'>('all');

  const notifications = [
    {
      id: 'n1',
      title: 'Visitor Waiting for Approval',
      body: 'Rahul Sharma (Amazon Delivery) is waiting at the gate for Flat B-302.',
      time: '2 mins ago',
      type: 'approval',
      read: false,
      icon: Users,
      bgColor: 'bg-[#D2FC52]/20',
      iconColor: '#1E293B'
    },
    {
      id: 'n2',
      title: 'Water Supply Maintenance',
      body: 'Water supply will be interrupted tomorrow from 10 AM to 12 PM.',
      time: '1 hour ago',
      type: 'society',
      read: false,
      icon: Megaphone,
      bgColor: 'bg-blue-100',
      iconColor: '#2563EB'
    },
    {
      id: 'n3',
      title: 'Maintenance Bill Due',
      body: 'Monthly maintenance dues of ₹2,500 generated for August 2025.',
      time: '1 day ago',
      type: 'society',
      read: true,
      icon: CreditCard,
      bgColor: 'bg-rose-100',
      iconColor: '#E11D48'
    }
  ];

  const filtered = notifications.filter(n => {
    if (activeFilter === 'approvals') return n.type === 'approval';
    if (activeFilter === 'society') return n.type === 'society';
    return true;
  });

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FB]">
      {/* HEADER */}
      <View className="px-5 pt-3 pb-4 bg-white border-b border-gray-100 flex-row justify-between items-center">
        <View>
          <Text className="text-gray-900 font-extrabold text-xl">Notifications</Text>
          <Text className="text-gray-400 text-xs font-semibold mt-0.5">Stay alert with real-time updates</Text>
        </View>

        <TouchableOpacity 
          onPress={() => Alert.alert('Notifications', 'All notifications marked as read')}
          className="bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100"
        >
          <Text className="text-gray-700 font-bold text-xs">Mark Read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1 px-5 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {/* FILTER SEGMENTS */}
        <View className="bg-white p-1.5 rounded-2xl flex-row justify-between mb-5 shadow-sm border border-gray-100">
          <TouchableOpacity
            onPress={() => setActiveFilter('all')}
            className={`flex-1 py-2.5 rounded-xl items-center ${activeFilter === 'all' ? 'bg-gray-900 shadow-sm' : ''}`}
          >
            <Text className={`font-bold text-xs ${activeFilter === 'all' ? 'text-white' : 'text-gray-500'}`}>All</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveFilter('approvals')}
            className={`flex-1 py-2.5 rounded-xl items-center ${activeFilter === 'approvals' ? 'bg-gray-900 shadow-sm' : ''}`}
          >
            <Text className={`font-bold text-xs ${activeFilter === 'approvals' ? 'text-white' : 'text-gray-500'}`}>Approvals</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveFilter('society')}
            className={`flex-1 py-2.5 rounded-xl items-center ${activeFilter === 'society' ? 'bg-gray-900 shadow-sm' : ''}`}
          >
            <Text className={`font-bold text-xs ${activeFilter === 'society' ? 'text-white' : 'text-gray-500'}`}>Society</Text>
          </TouchableOpacity>
        </View>

        {/* NOTIFICATIONS LIST */}
        {filtered.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <Animated.View 
              key={item.id}
              entering={FadeInUp.delay(idx * 100)}
              className={`p-4 rounded-3xl mb-3 border shadow-xs flex-row items-start justify-between ${
                item.read ? 'bg-white border-gray-100' : 'bg-white border-lime-200'
              }`}
            >
              <View className="flex-row items-start flex-1 pr-2">
                <View className={`w-11 h-11 rounded-2xl items-center justify-center mr-3.5 ${item.bgColor}`}>
                  <IconComp size={20} color={item.iconColor} />
                </View>

                <View className="flex-1">
                  <View className="flex-row items-center justify-between">
                    <Text className="text-gray-900 font-extrabold text-sm">{item.title}</Text>
                    {!item.read && (
                      <View className="w-2 h-2 bg-rose-500 rounded-full" />
                    )}
                  </View>
                  <Text className="text-gray-600 text-xs font-medium mt-1 leading-relaxed">{item.body}</Text>
                  <Text className="text-gray-400 text-[10px] font-semibold mt-2">{item.time}</Text>
                </View>
              </View>

              <ChevronRight size={16} color="#94A3B8" className="mt-1" />
            </Animated.View>
          );
        })}

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
