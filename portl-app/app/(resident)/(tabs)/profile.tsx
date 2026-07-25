import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../../store/authStore';
import { signOut } from '../../../services/supabase/auth';
import { 
  User, Home, Car, CreditCard, Headset, LogOut, ChevronRight, Bell, 
  Clock, Users, Calendar, Megaphone, Globe, Moon, Shield, Check, MapPin, Mail, Phone 
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function ProfileTab() {
  const router = useRouter();
  const { user } = useAuthStore();
  const userName = user?.email ? user.email.split('@')[0].replace('.', ' ') : 'Himanshu Anand';

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FB]">
      {/* HEADER BAR */}
      <View className="px-5 pt-3 pb-4 bg-white border-b border-gray-100 flex-row justify-between items-center z-10">
        <View className="flex-1 pr-2">
          <Text className="text-gray-900 font-black text-2xl" numberOfLines={1}>My Profile</Text>
          <Text className="text-gray-400 text-xs font-semibold mt-0.5" numberOfLines={1}>Manage your account and preferences</Text>
        </View>

        <TouchableOpacity 
          onPress={signOut}
          className="w-10 h-10 bg-rose-50 rounded-full items-center justify-center border border-rose-100 shadow-xs"
        >
          <LogOut size={18} color="#E11D48" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1 px-4 pt-4" 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 130 }}
      >
        {/* HERO USER PROFILE CARD */}
        <Animated.View entering={FadeInUp.duration(400)} className="bg-white rounded-3xl p-4.5 mb-4 shadow-sm border border-gray-100">
          <View className="flex-row items-center mb-4">
            {/* Avatar Photo with Online Badge */}
            <View className="relative mr-3.5">
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80' }} 
                className="w-18 h-18 rounded-full border-2 border-[#D2FC52]"
              />
              <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" />
            </View>

            {/* Profile Info */}
            <View className="flex-1 min-w-0">
              <Text className="text-gray-900 font-black text-lg capitalize" numberOfLines={1}>{userName}</Text>

              {/* Verification Badge */}
              <View className="mt-1 self-start bg-[#E2F8EE] px-2.5 py-0.5 rounded-full flex-row items-center border border-emerald-100">
                <Check size={10} color="#059669" className="mr-1" />
                <Text className="text-emerald-700 font-extrabold text-[10px]">Verified Resident</Text>
              </View>

              {/* Info Items List */}
              <View className="mt-2 space-y-1">
                <View className="flex-row items-center">
                  <Home size={11} color="#64748B" className="mr-1.5" />
                  <Text className="text-gray-700 text-[11px] font-semibold flex-1" numberOfLines={1}>Flat B-302, Tower A</Text>
                </View>
                <View className="flex-row items-center mt-0.5">
                  <Mail size={11} color="#64748B" className="mr-1.5" />
                  <Text className="text-gray-600 text-[11px] font-semibold flex-1" numberOfLines={1}>{user?.email || 'himanshu.anand@email.com'}</Text>
                </View>
                <View className="flex-row items-center mt-0.5">
                  <Phone size={11} color="#64748B" className="mr-1.5" />
                  <Text className="text-gray-700 text-[11px] font-semibold flex-1" numberOfLines={1}>+91 98765 43210</Text>
                </View>
                <View className="flex-row items-center mt-0.5">
                  <MapPin size={11} color="#64748B" className="mr-1.5" />
                  <Text className="text-gray-600 text-[11px] font-semibold flex-1" numberOfLines={1}>Green Meadows Society</Text>
                </View>
              </View>
            </View>
          </View>

          {/* TWO GRID CARDS BELOW HERO */}
          <View className="flex-row gap-2.5 pt-3 border-t border-gray-100">
            {/* MEMBERS */}
            <TouchableOpacity 
              onPress={() => router.push('/(resident)/family-members')}
              className="flex-1 bg-[#F4FBE4] p-3 rounded-2xl border border-lime-100 flex-row items-center justify-between shadow-xs"
            >
              <View className="flex-row items-center flex-1 mr-1">
                <View className="w-7 h-7 bg-[#D2FC52] rounded-full items-center justify-center mr-2 shadow-xs">
                  <Users size={14} color="#163316" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500 text-[8px] font-bold uppercase" numberOfLines={1}>MEMBERS</Text>
                  <Text className="text-gray-900 font-black text-xs" numberOfLines={1}>4 Family</Text>
                  <Text className="text-gray-500 text-[8px] font-medium" numberOfLines={1}>View & Manage</Text>
                </View>
              </View>
              <ChevronRight size={12} color="#64748B" />
            </TouchableOpacity>

            {/* VEHICLES */}
            <TouchableOpacity 
              onPress={() => router.push('/(resident)/registered-vehicles')}
              className="flex-1 bg-[#F4FBE4] p-3 rounded-2xl border border-lime-100 flex-row items-center justify-between shadow-xs"
            >
              <View className="flex-row items-center flex-1 mr-1">
                <View className="w-7 h-7 bg-[#D2FC52] rounded-full items-center justify-center mr-2 shadow-xs">
                  <Car size={14} color="#163316" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500 text-[8px] font-bold uppercase" numberOfLines={1}>VEHICLES</Text>
                  <Text className="text-gray-900 font-black text-xs" numberOfLines={1}>2 Registered</Text>
                  <Text className="text-gray-500 text-[8px] font-medium" numberOfLines={1}>View & Manage</Text>
                </View>
              </View>
              <ChevronRight size={12} color="#64748B" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* ACCOUNT OPTIONS SECTION */}
        <Text className="text-gray-900 font-extrabold text-base mb-2.5 px-1">Account Options</Text>

        <Animated.View entering={FadeInUp.delay(100)} className="bg-white rounded-3xl p-1.5 border border-gray-100 shadow-sm mb-4">
          {/* 1. VISITOR HISTORY & LOGS */}
          <TouchableOpacity 
            onPress={() => router.push('/(resident)/visitor-history')}
            className="p-3 rounded-2xl flex-row items-center justify-between border-b border-gray-50"
          >
            <View className="flex-row items-center flex-1 pr-2">
              <View className="w-8.5 h-8.5 bg-[#F4FBE4] rounded-xl items-center justify-center mr-3 border border-lime-100">
                <Clock size={16} color="#163316" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-xs" numberOfLines={1}>Visitor History & Logs</Text>
                <Text className="text-gray-400 text-[10px] font-medium" numberOfLines={1}>View all past visitor entries</Text>
              </View>
            </View>
            <ChevronRight size={14} color="#94A3B8" />
          </TouchableOpacity>

          {/* 2. FLAT & FAMILY MEMBERS */}
          <TouchableOpacity 
            onPress={() => router.push('/(resident)/family-members')}
            className="p-3 rounded-2xl flex-row items-center justify-between border-b border-gray-50"
          >
            <View className="flex-row items-center flex-1 pr-2">
              <View className="w-8.5 h-8.5 bg-blue-50 rounded-xl items-center justify-center mr-3 border border-blue-100">
                <Home size={16} color="#2563EB" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-xs" numberOfLines={1}>Flat & Family Members</Text>
                <Text className="text-gray-400 text-[10px] font-medium" numberOfLines={1}>Manage flat details and family</Text>
              </View>
            </View>
            <ChevronRight size={14} color="#94A3B8" />
          </TouchableOpacity>

          {/* 3. AMENITY BOOKINGS */}
          <TouchableOpacity 
            onPress={() => router.push('/(resident)/(tabs)/services')}
            className="p-3 rounded-2xl flex-row items-center justify-between border-b border-gray-50"
          >
            <View className="flex-row items-center flex-1 pr-2">
              <View className="w-8.5 h-8.5 bg-amber-50 rounded-xl items-center justify-center mr-3 border border-amber-100">
                <Calendar size={16} color="#D97706" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-xs" numberOfLines={1}>Amenity Bookings</Text>
                <Text className="text-gray-400 text-[10px] font-medium" numberOfLines={1}>View upcoming and past bookings</Text>
              </View>
            </View>
            <ChevronRight size={14} color="#94A3B8" />
          </TouchableOpacity>

          {/* 4. REGISTERED VEHICLES */}
          <TouchableOpacity 
            onPress={() => router.push('/(resident)/registered-vehicles')}
            className="p-3 rounded-2xl flex-row items-center justify-between border-b border-gray-50"
          >
            <View className="flex-row items-center flex-1 pr-2">
              <View className="w-8.5 h-8.5 bg-orange-50 rounded-xl items-center justify-center mr-3 border border-orange-100">
                <Car size={16} color="#EA580C" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-xs" numberOfLines={1}>Registered Vehicles</Text>
                <Text className="text-gray-400 text-[10px] font-medium" numberOfLines={1}>View and manage your vehicles</Text>
              </View>
            </View>
            <ChevronRight size={14} color="#94A3B8" />
          </TouchableOpacity>

          {/* 5. PAYMENT RECEIPTS & DUES */}
          <TouchableOpacity 
            onPress={() => router.push('/(resident)/(tabs)/payments')}
            className="p-3 rounded-2xl flex-row items-center justify-between border-b border-gray-50"
          >
            <View className="flex-row items-center flex-1 pr-2">
              <View className="w-8.5 h-8.5 bg-emerald-50 rounded-xl items-center justify-center mr-3 border border-emerald-100">
                <CreditCard size={16} color="#059669" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-xs" numberOfLines={1}>Payment Receipts & Dues</Text>
                <Text className="text-gray-400 text-[10px] font-medium" numberOfLines={1}>View receipts and maintenance dues</Text>
              </View>
            </View>
            <ChevronRight size={14} color="#94A3B8" />
          </TouchableOpacity>

          {/* 6. HELPDESK TICKETS */}
          <TouchableOpacity 
            onPress={() => router.push('/(resident)/(tabs)/complaints')}
            className="p-3 rounded-2xl flex-row items-center justify-between"
          >
            <View className="flex-row items-center flex-1 pr-2">
              <View className="w-8.5 h-8.5 bg-purple-50 rounded-xl items-center justify-center mr-3 border border-purple-100">
                <Headset size={16} color="#7C3AED" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-xs" numberOfLines={1}>Helpdesk Tickets</Text>
                <Text className="text-gray-400 text-[10px] font-medium" numberOfLines={1}>View your raised complaints</Text>
              </View>
            </View>
            <ChevronRight size={14} color="#94A3B8" />
          </TouchableOpacity>
        </Animated.View>

        {/* QUICK PREFERENCES SECTION */}
        <Animated.View entering={FadeInUp.delay(200)} className="bg-white rounded-3xl p-4 mb-4 shadow-sm border border-gray-100">
          <Text className="text-gray-900 font-extrabold text-base mb-3">Quick Preferences</Text>

          <View className="flex-row justify-between items-center">
            {/* Notifications */}
            <TouchableOpacity 
              onPress={() => router.push('/(resident)/notifications')}
              className="items-center flex-1"
            >
              <View className="w-9 h-9 bg-purple-50 rounded-2xl items-center justify-center mb-1 border border-purple-100">
                <Bell size={16} color="#7C3AED" />
              </View>
              <View className="flex-row items-center">
                <Text className="text-gray-900 font-bold text-[10px] mr-0.5" numberOfLines={1}>Notifications</Text>
                <ChevronRight size={9} color="#94A3B8" />
              </View>
            </TouchableOpacity>

            <View className="w-[1px] h-6 bg-gray-100" />

            {/* Language */}
            <TouchableOpacity 
              onPress={() => Alert.alert('Language', 'Active Language: English (US)')}
              className="items-center flex-1"
            >
              <View className="w-9 h-9 bg-blue-50 rounded-2xl items-center justify-center mb-1 border border-blue-100">
                <Globe size={16} color="#2563EB" />
              </View>
              <View className="flex-row items-center">
                <Text className="text-gray-900 font-bold text-[10px] mr-0.5" numberOfLines={1}>Language</Text>
                <ChevronRight size={9} color="#94A3B8" />
              </View>
              <Text className="text-gray-400 text-[8px] font-semibold" numberOfLines={1}>English</Text>
            </TouchableOpacity>

            <View className="w-[1px] h-6 bg-gray-100" />

            {/* Theme (Light Mode Default) */}
            <TouchableOpacity 
              onPress={() => Alert.alert('Theme Settings', 'Light Theme is active as default.')}
              className="items-center flex-1"
            >
              <View className="w-9 h-9 bg-amber-50 rounded-2xl items-center justify-center mb-1 border border-amber-100">
                <Moon size={16} color="#D97706" />
              </View>
              <View className="flex-row items-center">
                <Text className="text-gray-900 font-bold text-[10px] mr-0.5" numberOfLines={1}>Theme</Text>
                <ChevronRight size={9} color="#94A3B8" />
              </View>
              <Text className="text-gray-400 text-[8px] font-semibold" numberOfLines={1}>Light</Text>
            </TouchableOpacity>

            <View className="w-[1px] h-6 bg-gray-100" />

            {/* Privacy */}
            <TouchableOpacity 
              onPress={() => Alert.alert('Privacy', 'Privacy & Security settings are active.')}
              className="items-center flex-1"
            >
              <View className="w-9 h-9 bg-emerald-50 rounded-2xl items-center justify-center mb-1 border border-emerald-100">
                <Shield size={16} color="#059669" />
              </View>
              <View className="flex-row items-center">
                <Text className="text-gray-900 font-bold text-[10px] mr-0.5" numberOfLines={1}>Privacy</Text>
                <ChevronRight size={9} color="#94A3B8" />
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* HELP & SUPPORT CARD */}
        <Animated.View entering={FadeInUp.delay(300)} className="mb-4">
          <TouchableOpacity 
            onPress={() => router.push('/(resident)/help-support')}
            className="bg-white rounded-3xl p-3.5 shadow-sm border border-gray-100 flex-row items-center justify-between"
          >
            <View className="flex-row items-center flex-1 pr-2">
              <View className="w-10 h-10 bg-purple-50 rounded-2xl items-center justify-center mr-3 border border-purple-100">
                <Headset size={19} color="#7C3AED" />
              </View>

              <View className="flex-1">
                <Text className="text-gray-900 font-black text-sm" numberOfLines={1}>Help & Support</Text>
                <Text className="text-gray-500 font-semibold text-[11px] mt-0.5" numberOfLines={1}>Get help and contact support</Text>
              </View>
            </View>

            <View className="w-7.5 h-7.5 bg-purple-100/60 rounded-full items-center justify-center">
              <ChevronRight size={15} color="#7C3AED" />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}
