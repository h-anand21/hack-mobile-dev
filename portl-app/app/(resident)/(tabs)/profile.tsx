import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../../store/authStore';
import { signOut } from '../../../services/supabase/auth';
import { 
  User, Home, Car, CreditCard, Wrench, Shield, LogOut, ChevronRight, Bell, Settings, Clock, Users, Calendar, Megaphone 
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function ProfileTab() {
  const router = useRouter();
  const { user } = useAuthStore();
  const userName = user?.email?.split('@')[0] || 'Himanshu';

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FB]">
      {/* HEADER */}
      <View className="px-5 pt-3 pb-4 bg-white border-b border-gray-100 flex-row justify-between items-center">
        <Text className="text-gray-900 font-extrabold text-xl">My Profile</Text>
        <TouchableOpacity 
          onPress={signOut}
          className="w-10 h-10 bg-rose-50 rounded-full items-center justify-center border border-rose-100"
        >
          <LogOut size={18} color="#E11D48" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* PROFILE HERO CARD */}
        <Animated.View entering={FadeInUp.duration(500)} className="bg-white p-6 rounded-3xl mb-5 shadow-sm border border-gray-100 items-center">
          <View className="relative mb-3">
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80' }} 
              className="w-24 h-24 rounded-full border-4 border-[#D2FC52]"
            />
            <View className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white" />
          </View>

          <Text className="text-gray-900 font-black text-2xl capitalize">{userName}</Text>
          <Text className="text-gray-500 text-xs font-semibold mt-0.5">Flat B-302 • Tower A</Text>
          <Text className="text-gray-400 text-xs mt-1">{user?.email || 'himanshu@portl.com'}</Text>

          <View className="flex-row gap-3 mt-5 w-full">
            <View className="flex-1 bg-gray-50 p-3 rounded-2xl items-center border border-gray-100">
              <Text className="text-gray-400 text-[10px] font-bold uppercase">Members</Text>
              <Text className="text-gray-900 font-black text-base mt-0.5">4 Family</Text>
            </View>
            <View className="flex-1 bg-gray-50 p-3 rounded-2xl items-center border border-gray-100">
              <Text className="text-gray-400 text-[10px] font-bold uppercase">Vehicles</Text>
              <Text className="text-gray-900 font-black text-base mt-0.5">2 Registered</Text>
            </View>
          </View>
        </Animated.View>

        {/* MENU OPTIONS */}
        <Text className="text-gray-900 font-extrabold text-base mb-3 px-1">Account Options</Text>

        <View className="bg-white rounded-3xl p-2 border border-gray-100 shadow-sm mb-6 space-y-1">
          {/* VISITOR HISTORY (Direct Access as shown in mock) */}
          <TouchableOpacity 
            onPress={() => router.push('/(resident)/visitor-history')}
            className="p-3.5 rounded-2xl flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-[#E2F898] rounded-2xl items-center justify-center mr-3">
                <Clock size={18} color="#1E293B" />
              </View>
              <View>
                <Text className="text-gray-900 font-bold text-sm">Visitor History & Logs</Text>
                <Text className="text-gray-400 text-[10px] font-medium">View all 28 past visitor entries</Text>
              </View>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('/(resident)/notice-board')}
            className="p-3.5 rounded-2xl flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-[#E2F8EE] rounded-2xl items-center justify-center mr-3">
                <Megaphone size={18} color="#059669" />
              </View>
              <View>
                <Text className="text-gray-900 font-bold text-sm">Notice Board & Updates</Text>
                <Text className="text-gray-400 text-[10px] font-medium">View society circulars & announcements</Text>
              </View>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('/(resident)/(tabs)/community')}
            className="p-3.5 rounded-2xl flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-blue-50 rounded-2xl items-center justify-center mr-3">
                <Home size={18} color="#2563EB" />
              </View>
              <Text className="text-gray-900 font-bold text-sm">Flat & Family Members</Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('/(resident)/(tabs)/services')}
            className="p-3.5 rounded-2xl flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-[#E2F898] rounded-2xl items-center justify-center mr-3">
                <Calendar size={18} color="#1E293B" />
              </View>
              <View>
                <Text className="text-gray-900 font-bold text-sm">Amenity Bookings</Text>
                <Text className="text-gray-400 text-[10px] font-medium">Book Gym, Pool, Badminton & Hall</Text>
              </View>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('/(resident)/(tabs)/services')}
            className="p-3.5 rounded-2xl flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-amber-50 rounded-2xl items-center justify-center mr-3">
                <Car size={18} color="#D97706" />
              </View>
              <Text className="text-gray-900 font-bold text-sm">Registered Vehicles</Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('/(resident)/(tabs)/payments')}
            className="p-3.5 rounded-2xl flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-emerald-50 rounded-2xl items-center justify-center mr-3">
                <CreditCard size={18} color="#059669" />
              </View>
              <Text className="text-gray-900 font-bold text-sm">Payment Receipts & Dues</Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => router.push('/(resident)/(tabs)/complaints')}
            className="p-3.5 rounded-2xl flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-purple-50 rounded-2xl items-center justify-center mr-3">
                <Wrench size={18} color="#7C3AED" />
              </View>
              <Text className="text-gray-900 font-bold text-sm">Helpdesk Tickets</Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={signOut}
            className="p-3.5 rounded-2xl flex-row items-center justify-between"
          >
            <View className="flex-row items-center">
              <View className="w-10 h-10 bg-rose-50 rounded-2xl items-center justify-center mr-3">
                <LogOut size={18} color="#E11D48" />
              </View>
              <Text className="text-rose-600 font-bold text-sm">Sign Out</Text>
            </View>
            <ChevronRight size={16} color="#E11D48" />
          </TouchableOpacity>
        </View>

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
