import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, Calendar, Search, Filter, Dumbbell, Waves, PartyPopper, 
  ChevronRight, Headset, Info, Car, Shield, Activity
} from 'lucide-react-native';
import { apiClient } from '../../../services/api/client';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

export default function ServicesTab() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const amenitiesList = [
    {
      id: 'a1',
      name: 'Gym',
      subtitle: 'Stay fit, stay healthy',
      tag: 'Indoor',
      status: 'Available',
      timing: '6:00 AM - 10:00 PM',
      color: 'emerald',
      icon: Dumbbell
    },
    {
      id: 'a2',
      name: 'Swimming Pool',
      subtitle: 'Relax and unwind',
      tag: 'Outdoor',
      status: 'Available',
      timing: '6:00 AM - 9:00 PM',
      color: 'emerald',
      icon: Waves
    },
    {
      id: 'a3',
      name: 'Badminton Court',
      subtitle: 'Play your best game',
      tag: 'Indoor',
      status: 'Partially Booked',
      timing: '6:00 AM - 10:00 PM',
      color: 'amber',
      icon: Activity
    },
    {
      id: 'a4',
      name: 'Community Hall',
      subtitle: 'Celebrate your occasions',
      tag: 'Indoor',
      status: 'Available',
      timing: '8:00 AM - 11:00 PM',
      color: 'emerald',
      icon: PartyPopper
    },
    {
      id: 'a5',
      name: 'Table Tennis',
      subtitle: 'Fast fun & friendly',
      tag: 'Indoor',
      status: 'Available',
      timing: '6:00 AM - 10:00 PM',
      color: 'emerald',
      icon: Activity
    },
    {
      id: 'a6',
      name: 'Kids Play Area',
      subtitle: 'Safe play for kids',
      tag: 'Outdoor',
      status: 'Available',
      timing: '6:00 AM - 9:00 PM',
      color: 'emerald',
      icon: Shield
    },
    {
      id: 'a7',
      name: 'Guest Parking',
      subtitle: 'Parking for your guests',
      tag: 'Outdoor',
      status: 'Available',
      timing: '24 Hours',
      color: 'emerald',
      icon: Car
    }
  ];

  const handleBookAmenity = (item: any) => {
    Alert.alert(
      `Book ${item.name} 📅`,
      `Select a time slot for ${item.name} (${item.timing}):`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Morning Slot (07:00 AM)', onPress: () => Alert.alert('Booked 🎉', `${item.name} reserved for 07:00 AM today!`) },
        { text: 'Evening Slot (06:00 PM)', onPress: () => Alert.alert('Booked 🎉', `${item.name} reserved for 06:00 PM today!`) }
      ]
    );
  };

  const filtered = amenitiesList.filter(item => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.name.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q) || item.tag.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FB]">
      {/* HEADER BAR */}
      <View className="flex-row justify-between items-center px-5 pt-3 pb-4 bg-white border-b border-gray-100">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100"
        >
          <ArrowLeft size={20} color="#1E293B" />
        </TouchableOpacity>

        <View className="items-center">
          <Text className="text-gray-900 font-extrabold text-lg">Amenities</Text>
          <Text className="text-gray-400 text-xs font-semibold">Book and manage amenities</Text>
        </View>

        <TouchableOpacity 
          onPress={() => Alert.alert('My Bookings', 'View your active amenity bookings')}
          className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100"
        >
          <Calendar size={18} color="#1E293B" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* SEARCH & FILTER ROW */}
        <View className="flex-row gap-2.5 mb-4">
          <View className="flex-1 bg-white px-3.5 py-3 rounded-2xl border border-gray-100 flex-row items-center shadow-xs">
            <Search size={16} color="#94A3B8" className="mr-2" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search amenities..."
              placeholderTextColor="#94A3B8"
              className="flex-1 text-gray-900 font-medium text-xs p-0"
            />
          </View>

          <TouchableOpacity 
            onPress={() => Alert.alert('Filter', 'Filter amenities')}
            className="bg-white px-4 py-3 rounded-2xl border border-gray-100 flex-row items-center shadow-xs"
          >
            <Filter size={15} color="#475569" className="mr-1.5" />
            <Text className="text-gray-800 font-bold text-xs">Filter</Text>
          </TouchableOpacity>
        </View>

        {/* HERO BANNER CARD */}
        <Animated.View entering={FadeInDown.duration(400)} className="bg-[#F4FBE4] p-4.5 rounded-3xl mb-5 border border-lime-100 flex-row justify-between items-center shadow-xs">
          <View className="flex-1 pr-3">
            <View className="flex-row items-center mb-1">
              <View className="w-7 h-7 bg-[#D2FC52] rounded-full items-center justify-center mr-2 shadow-xs">
                <Calendar size={15} color="#1E293B" />
              </View>
              <Text className="text-gray-900 font-extrabold text-sm">Book Your Favorite Amenities</Text>
            </View>
            <Text className="text-gray-600 text-xs font-medium leading-relaxed">
              Select an amenity to view availability and make a booking.
            </Text>
          </View>

          <View className="w-14 h-14 bg-[#D2FC52]/30 rounded-2xl items-center justify-center">
            <Calendar size={28} color="#1E293B" />
          </View>
        </Animated.View>

        {/* AMENITIES LIST */}
        <View className="flex-row justify-between items-center mb-3 px-1">
          <Text className="text-gray-900 font-extrabold text-base">All Amenities</Text>
          <Text className="text-gray-400 text-xs font-semibold">{filtered.length} Amenities</Text>
        </View>

        {filtered.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <Animated.View key={item.id} entering={FadeInUp.delay(idx * 80)}>
              <TouchableOpacity
                onPress={() => handleBookAmenity(item)}
                className="bg-white rounded-3xl p-4 mb-3 shadow-sm border border-gray-100 flex-row items-center justify-between"
              >
                <View className="flex-row items-center flex-1 pr-2">
                  <View className="w-14 h-14 bg-[#F4FBE4] rounded-2xl items-center justify-center mr-3.5 border border-lime-100">
                    <IconComp size={24} color="#1E293B" />
                  </View>

                  <View className="flex-1">
                    <Text className="text-gray-900 font-black text-base">{item.name}</Text>
                    <Text className="text-gray-500 font-semibold text-xs mt-0.5">{item.subtitle}</Text>

                    <View className="mt-2 self-start bg-gray-100 px-2.5 py-0.5 rounded-md">
                      <Text className="text-gray-600 text-[10px] font-bold">{item.tag}</Text>
                    </View>
                  </View>
                </View>

                {/* Right Side: Status & Timing */}
                <View className="items-end">
                  <Text className={`font-extrabold text-xs mb-1 ${
                    item.color === 'emerald' ? 'text-emerald-700' : 'text-amber-600'
                  }`}>
                    {item.status}
                  </Text>
                  <Text className="text-gray-400 text-[10px] font-medium">{item.timing}</Text>
                  <ChevronRight size={14} color="#94A3B8" className="mt-2" />
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        {/* NEED HELP BANNER CARD */}
        <Animated.View entering={FadeInUp.delay(600)} className="bg-[#F4FBE4] p-4 rounded-2xl mt-2 mb-8 border border-lime-100 flex-row items-center justify-between">
          <View className="flex-row items-center flex-1 mr-2">
            <Info size={16} color="#475569" className="mr-2" />
            <Text className="text-gray-700 text-xs font-semibold flex-1">
              <Text className="font-extrabold">Need Help?</Text> Contact the management for any assistance.
            </Text>
          </View>

          <TouchableOpacity 
            onPress={() => Alert.alert('Contact Management', 'Dialing society office: 080-4567890')}
            className="bg-white px-3 py-1.5 rounded-full flex-row items-center border border-lime-200 shadow-xs"
          >
            <Headset size={13} color="#1E293B" className="mr-1" />
            <Text className="text-gray-900 font-extrabold text-xs">Contact</Text>
          </TouchableOpacity>
        </Animated.View>

        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
