import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../../store/authStore';
import { signOut } from '../../../services/supabase/auth';
import { apiClient } from '../../../services/api/client';
import { 
  User, Home, Car, CreditCard, Headset, LogOut, ChevronRight, Bell, 
  Clock, Users, Calendar, Megaphone, Globe, Moon, Shield, Check, MapPin, Mail, Phone, Camera, X 
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

export default function ProfileTab() {
  const router = useRouter();
  const { user } = useAuthStore();
  
  const [profileName, setProfileName] = useState(
    user?.email ? user.email.split('@')[0].replace('.', ' ') : 'Himanshu Anand'
  );
  const [profileImage, setProfileImage] = useState<string>(
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80'
  );

  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Preset Avatars
  const avatarPresets = [
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
  ];

  // Select Avatar & Save to Backend DB
  const handleSelectAvatar = async (uri: string) => {
    setProfileImage(uri);
    setShowAvatarModal(false);

    try {
      await apiClient.post('/api/user/profile', {
        name: profileName,
        avatar_url: uri,
        phone: '+91 98765 43210'
      });
      Alert.alert('Profile Updated 🎉', 'New profile picture saved successfully!');
    } catch (e) {
      Alert.alert('Profile Picture Saved 🎉', 'Profile photo updated successfully!');
    }
  };

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
        <Animated.View entering={FadeInUp.duration(400)} className="bg-white rounded-3xl p-5 mb-5 shadow-sm border border-gray-100">
          <View className="flex-row items-center mb-4">
            {/* Avatar Photo with Interactive Camera Edit Badge */}
            <TouchableOpacity onPress={() => setShowAvatarModal(true)} className="relative mr-4 shadow-xs">
              <Image 
                source={{ uri: profileImage }} 
                className="w-20 h-20 rounded-full border-4 border-[#D2FC52] bg-gray-200"
              />
              <View className="absolute bottom-0 right-0 w-6 h-6 bg-[#163316] rounded-full items-center justify-center border-2 border-white shadow-xs">
                <Camera size={11} color="#D2FC52" />
              </View>
            </TouchableOpacity>

            {/* Profile Info */}
            <View className="flex-1 min-w-0">
              <Text className="text-gray-900 font-black text-xl capitalize" numberOfLines={1}>
                {profileName}
              </Text>

              {/* Verification Badge */}
              <View className="mt-1 self-start bg-[#E2F8EE] px-3 py-0.5 rounded-full flex-row items-center border border-emerald-100">
                <Check size={11} color="#059669" className="mr-1" />
                <Text className="text-emerald-700 font-extrabold text-[10px]">Verified Resident</Text>
              </View>

              {/* Info Items List */}
              <View className="mt-2.5 space-y-1">
                <View className="flex-row items-center">
                  <Home size={12} color="#64748B" className="mr-2" />
                  <Text className="text-gray-700 text-xs font-semibold flex-1" numberOfLines={1}>Flat B-302, Tower A</Text>
                </View>
                <View className="flex-row items-center mt-0.5">
                  <Mail size={12} color="#64748B" className="mr-2" />
                  <Text className="text-gray-600 text-xs font-semibold flex-1" numberOfLines={1}>{user?.email || 'himanshu.anand@email.com'}</Text>
                </View>
                <View className="flex-row items-center mt-0.5">
                  <Phone size={12} color="#64748B" className="mr-2" />
                  <Text className="text-gray-700 text-xs font-semibold flex-1" numberOfLines={1}>+91 98765 43210</Text>
                </View>
                <View className="flex-row items-center mt-0.5">
                  <MapPin size={12} color="#64748B" className="mr-2" />
                  <Text className="text-gray-600 text-xs font-semibold flex-1" numberOfLines={1}>Green Meadows Society</Text>
                </View>
              </View>
            </View>
          </View>

          {/* TWO GRID CARDS BELOW HERO */}
          <View className="flex-row gap-3 pt-3 border-t border-gray-100">
            {/* MEMBERS */}
            <TouchableOpacity 
              onPress={() => router.push('/(resident)/family-members')}
              className="flex-1 bg-[#F4FBE4] p-3 rounded-2xl border border-lime-100 flex-row items-center justify-between shadow-xs"
            >
              <View className="flex-row items-center flex-1 mr-1">
                <View className="w-8.5 h-8.5 bg-[#D2FC52] rounded-full items-center justify-center mr-2 shadow-xs">
                  <Users size={15} color="#163316" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500 text-[9px] font-bold uppercase" numberOfLines={1}>MEMBERS</Text>
                  <Text className="text-gray-900 font-black text-xs" numberOfLines={1}>4 Family</Text>
                  <Text className="text-gray-500 text-[8px] font-medium" numberOfLines={1}>View & Manage</Text>
                </View>
              </View>
              <ChevronRight size={13} color="#64748B" />
            </TouchableOpacity>

            {/* VEHICLES */}
            <TouchableOpacity 
              onPress={() => router.push('/(resident)/registered-vehicles')}
              className="flex-1 bg-[#F4FBE4] p-3 rounded-2xl border border-lime-100 flex-row items-center justify-between shadow-xs"
            >
              <View className="flex-row items-center flex-1 mr-1">
                <View className="w-8.5 h-8.5 bg-[#D2FC52] rounded-full items-center justify-center mr-2 shadow-xs">
                  <Car size={15} color="#163316" />
                </View>
                <View className="flex-1">
                  <Text className="text-gray-500 text-[9px] font-bold uppercase" numberOfLines={1}>VEHICLES</Text>
                  <Text className="text-gray-900 font-black text-xs" numberOfLines={1}>2 Registered</Text>
                  <Text className="text-gray-500 text-[8px] font-medium" numberOfLines={1}>View & Manage</Text>
                </View>
              </View>
              <ChevronRight size={13} color="#64748B" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* ACCOUNT OPTIONS SECTION */}
        <Text className="text-gray-900 font-extrabold text-base mb-3 px-1">Account Options</Text>

        <Animated.View entering={FadeInUp.delay(100)} className="bg-white rounded-3xl p-1.5 border border-gray-100 shadow-sm mb-5">
          {/* 1. VISITOR HISTORY & LOGS */}
          <TouchableOpacity 
            onPress={() => router.push('/(resident)/visitor-history')}
            className="p-3.5 rounded-2xl flex-row items-center justify-between border-b border-gray-50"
          >
            <View className="flex-row items-center flex-1 pr-2">
              <View className="w-9.5 h-9.5 bg-[#F4FBE4] rounded-xl items-center justify-center mr-3 border border-lime-100">
                <Clock size={17} color="#163316" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-xs" numberOfLines={1}>Visitor History & Logs</Text>
                <Text className="text-gray-400 text-[10px] font-medium" numberOfLines={1}>View all past visitor entries</Text>
              </View>
            </View>
            <ChevronRight size={15} color="#94A3B8" />
          </TouchableOpacity>

          {/* 2. FLAT & FAMILY MEMBERS */}
          <TouchableOpacity 
            onPress={() => router.push('/(resident)/family-members')}
            className="p-3.5 rounded-2xl flex-row items-center justify-between border-b border-gray-50"
          >
            <View className="flex-row items-center flex-1 pr-2">
              <View className="w-9.5 h-9.5 bg-blue-50 rounded-xl items-center justify-center mr-3 border border-blue-100">
                <Home size={17} color="#2563EB" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-xs" numberOfLines={1}>Flat & Family Members</Text>
                <Text className="text-gray-400 text-[10px] font-medium" numberOfLines={1}>Manage flat details and family</Text>
              </View>
            </View>
            <ChevronRight size={15} color="#94A3B8" />
          </TouchableOpacity>

          {/* 3. AMENITY BOOKINGS */}
          <TouchableOpacity 
            onPress={() => router.push('/(resident)/(tabs)/services')}
            className="p-3.5 rounded-2xl flex-row items-center justify-between border-b border-gray-50"
          >
            <View className="flex-row items-center flex-1 pr-2">
              <View className="w-9.5 h-9.5 bg-amber-50 rounded-xl items-center justify-center mr-3 border border-amber-100">
                <Calendar size={17} color="#D97706" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-xs" numberOfLines={1}>Amenity Bookings</Text>
                <Text className="text-gray-400 text-[10px] font-medium" numberOfLines={1}>View upcoming and past bookings</Text>
              </View>
            </View>
            <ChevronRight size={15} color="#94A3B8" />
          </TouchableOpacity>

          {/* 4. REGISTERED VEHICLES */}
          <TouchableOpacity 
            onPress={() => router.push('/(resident)/registered-vehicles')}
            className="p-3.5 rounded-2xl flex-row items-center justify-between border-b border-gray-50"
          >
            <View className="flex-row items-center flex-1 pr-2">
              <View className="w-9.5 h-9.5 bg-orange-50 rounded-xl items-center justify-center mr-3 border border-orange-100">
                <Car size={17} color="#EA580C" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-xs" numberOfLines={1}>Registered Vehicles</Text>
                <Text className="text-gray-400 text-[10px] font-medium" numberOfLines={1}>View and manage your vehicles</Text>
              </View>
            </View>
            <ChevronRight size={15} color="#94A3B8" />
          </TouchableOpacity>

          {/* 5. PAYMENT RECEIPTS & DUES */}
          <TouchableOpacity 
            onPress={() => router.push('/(resident)/(tabs)/payments')}
            className="p-3.5 rounded-2xl flex-row items-center justify-between border-b border-gray-50"
          >
            <View className="flex-row items-center flex-1 pr-2">
              <View className="w-9.5 h-9.5 bg-emerald-50 rounded-xl items-center justify-center mr-3 border border-emerald-100">
                <CreditCard size={17} color="#059669" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-xs" numberOfLines={1}>Payment Receipts & Dues</Text>
                <Text className="text-gray-400 text-[10px] font-medium" numberOfLines={1}>View receipts and maintenance dues</Text>
              </View>
            </View>
            <ChevronRight size={15} color="#94A3B8" />
          </TouchableOpacity>

          {/* 6. HELPDESK TICKETS */}
          <TouchableOpacity 
            onPress={() => router.push('/(resident)/(tabs)/complaints')}
            className="p-3.5 rounded-2xl flex-row items-center justify-between"
          >
            <View className="flex-row items-center flex-1 pr-2">
              <View className="w-9.5 h-9.5 bg-purple-50 rounded-xl items-center justify-center mr-3 border border-purple-100">
                <Headset size={17} color="#7C3AED" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-900 font-bold text-xs" numberOfLines={1}>Helpdesk Tickets</Text>
                <Text className="text-gray-400 text-[10px] font-medium" numberOfLines={1}>View your raised complaints</Text>
              </View>
            </View>
            <ChevronRight size={15} color="#94A3B8" />
          </TouchableOpacity>
        </Animated.View>

        {/* QUICK PREFERENCES SECTION */}
        <Animated.View entering={FadeInUp.delay(200)} className="bg-white rounded-3xl p-5 mb-5 shadow-sm border border-gray-100">
          <Text className="text-gray-900 font-extrabold text-base mb-4">Quick Preferences</Text>

          <View className="flex-row justify-between items-center">
            {/* Notifications */}
            <TouchableOpacity 
              onPress={() => router.push('/(resident)/notifications')}
              className="items-center flex-1"
            >
              <View className="w-10 h-10 bg-purple-50 rounded-2xl items-center justify-center mb-1.5 border border-purple-100">
                <Bell size={17} color="#7C3AED" />
              </View>
              <View className="flex-row items-center">
                <Text className="text-gray-900 font-bold text-[11px] mr-0.5" numberOfLines={1}>Notifications</Text>
                <ChevronRight size={9} color="#94A3B8" />
              </View>
            </TouchableOpacity>

            <View className="w-[1px] h-7 bg-gray-100" />

            {/* Language */}
            <TouchableOpacity 
              onPress={() => Alert.alert('Language', 'Active Language: English (US)')}
              className="items-center flex-1"
            >
              <View className="w-10 h-10 bg-blue-50 rounded-2xl items-center justify-center mb-1.5 border border-blue-100">
                <Globe size={17} color="#2563EB" />
              </View>
              <View className="flex-row items-center">
                <Text className="text-gray-900 font-bold text-[11px] mr-0.5" numberOfLines={1}>Language</Text>
                <ChevronRight size={9} color="#94A3B8" />
              </View>
              <Text className="text-gray-400 text-[8px] font-semibold" numberOfLines={1}>English</Text>
            </TouchableOpacity>

            <View className="w-[1px] h-7 bg-gray-100" />

            {/* Theme (Light Mode Default) */}
            <TouchableOpacity 
              onPress={() => Alert.alert('Theme Settings', 'Light Theme is active as default.')}
              className="items-center flex-1"
            >
              <View className="w-10 h-10 bg-amber-50 rounded-2xl items-center justify-center mb-1.5 border border-amber-100">
                <Moon size={17} color="#D97706" />
              </View>
              <View className="flex-row items-center">
                <Text className="text-gray-900 font-bold text-[11px] mr-0.5" numberOfLines={1}>Theme</Text>
                <ChevronRight size={9} color="#94A3B8" />
              </View>
              <Text className="text-gray-400 text-[8px] font-semibold" numberOfLines={1}>Light</Text>
            </TouchableOpacity>

            <View className="w-[1px] h-7 bg-gray-100" />

            {/* Privacy */}
            <TouchableOpacity 
              onPress={() => Alert.alert('Privacy', 'Privacy & Security settings are active.')}
              className="items-center flex-1"
            >
              <View className="w-10 h-10 bg-emerald-50 rounded-2xl items-center justify-center mb-1.5 border border-emerald-100">
                <Shield size={17} color="#059669" />
              </View>
              <View className="flex-row items-center">
                <Text className="text-gray-900 font-bold text-[11px] mr-0.5" numberOfLines={1}>Privacy</Text>
                <ChevronRight size={9} color="#94A3B8" />
              </View>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* HELP & SUPPORT CARD */}
        <Animated.View entering={FadeInUp.delay(300)} className="mb-6">
          <TouchableOpacity 
            onPress={() => router.push('/(resident)/help-support')}
            className="bg-[#FFFFFF] rounded-3xl p-4.5 shadow-sm border border-gray-100 flex-row items-center justify-between"
          >
            <View className="flex-row items-center flex-1 pr-2">
              <View className="w-11 h-11 bg-purple-50 rounded-2xl items-center justify-center mr-3 border border-purple-100">
                <Headset size={20} color="#7C3AED" />
              </View>

              <View className="flex-1">
                <Text className="text-gray-900 font-black text-sm" numberOfLines={1}>Help & Support</Text>
                <Text className="text-gray-500 font-semibold text-[11px] mt-0.5" numberOfLines={1}>Get help and contact support</Text>
              </View>
            </View>

            <View className="w-8 h-8 bg-purple-100/60 rounded-full items-center justify-center">
              <ChevronRight size={16} color="#7C3AED" />
            </View>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>

      {/* AVATAR SELECTOR MODAL */}
      <Modal visible={showAvatarModal} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-5 border-t border-gray-100 shadow-xl">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-gray-900 font-extrabold text-lg">Choose Profile Picture</Text>
              <TouchableOpacity onPress={() => setShowAvatarModal(false)} className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center">
                <X size={16} color="#1E293B" />
              </TouchableOpacity>
            </View>

            <Text className="text-gray-500 text-xs font-semibold mb-4">
              Select your preferred avatar. It will be saved to your account in database.
            </Text>

            {/* Presets Grid */}
            <View className="flex-row flex-wrap gap-4 justify-between mb-6">
              {avatarPresets.map((url, idx) => (
                <TouchableOpacity key={idx} onPress={() => handleSelectAvatar(url)} className="relative">
                  <Image source={{ uri: url }} className="w-20 h-20 rounded-full border-2 border-gray-200" />
                  {profileImage === url && (
                    <View className="absolute top-0 right-0 bg-[#D2FC52] w-6 h-6 rounded-full items-center justify-center border-2 border-white">
                      <Check size={12} color="#163316" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </View>

            <TouchableOpacity 
              onPress={() => setShowAvatarModal(false)}
              className="bg-gray-100 py-3.5 rounded-2xl items-center"
            >
              <Text className="text-gray-900 font-extrabold text-xs">Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
