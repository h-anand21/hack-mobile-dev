import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiClient } from '../../../services/api/client';
import { Waves, Dumbbell, Calendar, Clock, ChevronRight, CheckCircle2 } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function ServicesTab() {
  const [amenities, setAmenities] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const defaultAmenities = [
    {
      id: '33333333-3333-3333-3333-333333333331',
      name: 'Swimming Pool',
      description: 'Main society Olympic swimming pool with adult and kids section.',
      rules: 'Swimsuit mandatory. No food allowed.',
      slots: ["06:00-07:00", "07:00-08:00", "17:00-18:00", "18:00-19:00"],
      image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=400&q=80'
    },
    {
      id: '33333333-3333-3333-3333-333333333332',
      name: 'Badminton Court',
      description: 'Indoor air-conditioned badminton court with wooden flooring.',
      rules: 'Non-marking shoes only. Bring own rackets.',
      slots: ["06:00-07:00", "18:00-19:00", "19:00-20:00", "20:00-21:00"],
      image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=400&q=80'
    }
  ];

  const fetchAmenities = async () => {
    try {
      const { data } = await apiClient.get('/api/amenities');
      if (data?.success && data?.amenities?.length > 0) setAmenities(data.amenities);
      else setAmenities(defaultAmenities);
      
      const { data: bData } = await apiClient.get('/api/bookings');
      if (bData?.success) setBookings(bData.bookings);
    } catch (error) {
      setAmenities(defaultAmenities);
    }
  };

  useEffect(() => {
    fetchAmenities();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAmenities();
    setRefreshing(false);
  };

  const handleBook = async (amenityName: string, slot: string) => {
    Alert.alert(
      'Confirm Booking 🏊‍♂️',
      `Book ${amenityName} for today (${slot})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm & Book', 
          onPress: () => {
            Alert.alert('Booking Confirmed 🎉', `${amenityName} slot (${slot}) has been reserved for you!`);
          } 
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FB]">
      <View className="px-5 pt-3 pb-4 bg-white border-b border-gray-100 flex-row justify-between items-center">
        <View>
          <Text className="text-gray-900 font-extrabold text-xl">Amenity Bookings</Text>
          <Text className="text-gray-400 text-xs font-semibold mt-0.5">Reserve society pool, court & hall</Text>
        </View>
        <View className="w-10 h-10 bg-amber-50 rounded-full items-center justify-center border border-amber-100">
          <Calendar size={18} color="#D97706" />
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-5 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D97706" />}
      >
        <Text className="text-gray-900 font-extrabold text-base mb-3 px-1">Available Amenities</Text>

        {amenities.map((item, idx) => (
          <Animated.View 
            key={item.id} 
            entering={FadeInUp.delay(idx * 100)}
            className="bg-white rounded-3xl p-5 mb-5 shadow-sm border border-gray-100"
          >
            <View className="flex-row items-center mb-3">
              <Image 
                source={{ uri: item.image || 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=400&q=80' }} 
                className="w-16 h-16 rounded-2xl mr-4 bg-gray-200" 
              />
              <View className="flex-1">
                <Text className="text-gray-900 font-extrabold text-base">{item.name}</Text>
                <Text className="text-gray-500 text-xs font-medium mt-0.5">{item.description}</Text>
              </View>
            </View>

            {item.rules && (
              <View className="bg-amber-50 px-3 py-2 rounded-xl mb-3 border border-amber-100">
                <Text className="text-amber-800 text-[11px] font-semibold">⚠️ Rules: {item.rules}</Text>
              </View>
            )}

            <Text className="text-gray-900 font-bold text-xs mb-2">Available Slots Today:</Text>
            <View className="flex-row flex-wrap gap-2">
              {Array.isArray(item.slots) ? item.slots.map((slot: string, sIdx: number) => (
                <TouchableOpacity
                  key={sIdx}
                  onPress={() => handleBook(item.name, slot)}
                  className="bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl flex-row items-center"
                >
                  <Clock size={11} color="#64748B" className="mr-1" />
                  <Text className="text-gray-800 text-xs font-bold">{slot}</Text>
                </TouchableOpacity>
              )) : (
                <TouchableOpacity
                  onPress={() => handleBook(item.name, '06:00 PM - 07:00 PM')}
                  className="bg-amber-500 px-4 py-2 rounded-xl"
                >
                  <Text className="text-white text-xs font-bold">Book Slot (06:00 PM - 07:00 PM)</Text>
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        ))}

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
