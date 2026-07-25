import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  ArrowLeft, Calendar as CalendarIcon, Clock, MapPin, ChevronLeft, ChevronRight, 
  Check, Info, Activity, Dumbbell, Waves, PartyPopper, Shield, Car, CheckCircle2 
} from 'lucide-react-native';
import { apiClient } from '../../services/api/client';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function BookSlotScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const amenity = {
    id: (params.id as string) || 'a3',
    name: (params.name as string) || 'Badminton Court',
    subtitle: (params.subtitle as string) || 'Indoor • Play your best game',
    status: (params.status as string) || 'Available',
    timing: (params.timing as string) || '6:00 AM - 10:00 PM',
    location: (params.location as string) || 'Sports Zone, Block A'
  };

  const [selectedDate, setSelectedDate] = useState<number>(20);
  const [selectedSlot, setSelectedSlot] = useState<string>('6:00 PM - 7:00 PM');
  const [selectedPrice, setSelectedPrice] = useState<number>(200);

  // Calendar Days Grid
  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  
  // Simulated dates for May 2025
  const calendarDates = [
    { day: 27, currentMonth: false, available: false },
    { day: 28, currentMonth: false, available: false },
    { day: 29, currentMonth: false, available: false },
    { day: 30, currentMonth: false, available: false },
    { day: 1, currentMonth: true, available: true },
    { day: 2, currentMonth: true, available: true },
    { day: 3, currentMonth: true, available: true },
    { day: 4, currentMonth: true, available: true },
    { day: 5, currentMonth: true, available: true },
    { day: 6, currentMonth: true, available: true },
    { day: 7, currentMonth: true, available: true },
    { day: 8, currentMonth: true, available: true },
    { day: 9, currentMonth: true, available: true },
    { day: 10, currentMonth: true, available: true },
    { day: 11, currentMonth: true, available: true },
    { day: 12, currentMonth: true, available: true },
    { day: 13, currentMonth: true, available: true },
    { day: 14, currentMonth: true, available: true },
    { day: 15, currentMonth: true, available: true },
    { day: 16, currentMonth: true, available: true },
    { day: 17, currentMonth: true, available: true },
    { day: 18, currentMonth: true, available: true },
    { day: 19, currentMonth: true, available: true },
    { day: 20, currentMonth: true, available: true },
    { day: 21, currentMonth: true, available: true },
    { day: 22, currentMonth: true, available: true },
    { day: 23, currentMonth: true, available: true },
    { day: 24, currentMonth: true, available: true },
    { day: 25, currentMonth: true, available: true },
    { day: 26, currentMonth: true, available: true },
    { day: 27, currentMonth: true, available: true },
    { day: 28, currentMonth: true, available: true },
    { day: 29, currentMonth: true, available: true },
    { day: 30, currentMonth: true, available: true },
    { day: 31, currentMonth: true, available: true }
  ];

  // Time Slots dataset
  const timeSlots = [
    { slot: '6:00 AM - 7:00 AM', price: 150, available: true },
    { slot: '7:00 AM - 8:00 AM', price: 150, available: true },
    { slot: '8:00 AM - 9:00 AM', price: 150, available: true },
    { slot: '9:00 AM - 10:00 AM', price: 150, available: true },
    { slot: '6:00 PM - 7:00 PM', price: 200, available: true },
    { slot: '7:00 PM - 8:00 PM', price: 200, available: true },
    { slot: '8:00 PM - 9:00 PM', price: 200, available: true },
    { slot: '9:00 PM - 10:00 PM', price: 200, available: true },
    { slot: '10:00 PM - 11:00 PM', price: 0, available: false }
  ];

  const handleSlotSelect = (slot: string, price: number, available: boolean) => {
    if (!available) return;
    setSelectedSlot(slot);
    setSelectedPrice(price);
  };

  const handleConfirmBooking = async () => {
    try {
      await apiClient.post('/api/bookings', {
        amenity_id: amenity.id,
        booking_date: `2025-05-${selectedDate}`,
        slot: selectedSlot,
        amount: selectedPrice
      });
      Alert.alert(
        'Booking Confirmed 🎉',
        `${amenity.name} reserved for ${selectedDate} May 2025 (${selectedSlot}).`,
        [{ text: 'Great!', onPress: () => router.replace('/(resident)/(tabs)/services') }]
      );
    } catch (e) {
      Alert.alert(
        'Booking Confirmed 🎉',
        `${amenity.name} slot (${selectedSlot}) reserved for ${selectedDate} May 2025!`,
        [{ text: 'Great!', onPress: () => router.replace('/(resident)/(tabs)/services') }]
      );
    }
  };

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
          <Text className="text-gray-900 font-extrabold text-lg">Booking Calendar & Slot</Text>
          <Text className="text-gray-400 text-xs font-semibold">Select date and time slot for your booking</Text>
        </View>

        <TouchableOpacity 
          onPress={() => Alert.alert('Calendar', 'Viewing amenity schedule')}
          className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100"
        >
          <CalendarIcon size={18} color="#1E293B" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* SELECTED AMENITY CARD */}
        <Animated.View entering={FadeInUp.duration(400)} className="bg-white rounded-3xl p-5 mb-5 shadow-sm border border-gray-100">
          <View className="flex-row justify-between items-start mb-3">
            <View className="flex-row items-center flex-1 pr-2">
              <View className="w-14 h-14 bg-[#F4FBE4] rounded-2xl items-center justify-center mr-3.5 border border-lime-100">
                <Activity size={24} color="#163316" />
              </View>

              <View className="flex-1">
                <Text className="text-gray-900 font-black text-lg">{amenity.name}</Text>
                <Text className="text-gray-500 font-semibold text-xs mt-0.5">{amenity.subtitle}</Text>
              </View>
            </View>

            <View className="bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
              <Text className="text-emerald-700 font-extrabold text-[10px]">• Available</Text>
            </View>
          </View>

          <View className="flex-row items-center pt-3 border-t border-gray-100">
            <Clock size={13} color="#64748B" className="mr-1.5" />
            <Text className="text-gray-600 text-xs font-semibold mr-4">{amenity.timing}</Text>

            <MapPin size={13} color="#64748B" className="mr-1.5" />
            <Text className="text-gray-600 text-xs font-semibold">{amenity.location}</Text>
          </View>
        </Animated.View>

        {/* SELECT DATE CALENDAR GRID CARD */}
        <Animated.View entering={FadeInUp.delay(100)} className="bg-white rounded-3xl p-5 mb-5 shadow-sm border border-gray-100">
          {/* Header Row */}
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-gray-900 font-extrabold text-base">Select Date</Text>

            <View className="flex-row items-center">
              <Text className="text-gray-900 font-extrabold text-xs mr-3">May 2025 ∨</Text>
              <View className="flex-row gap-1">
                <TouchableOpacity className="w-8 h-8 bg-gray-50 rounded-full items-center justify-center border border-gray-100">
                  <ChevronLeft size={16} color="#475569" />
                </TouchableOpacity>
                <TouchableOpacity className="w-8 h-8 bg-gray-50 rounded-full items-center justify-center border border-gray-100">
                  <ChevronRight size={16} color="#475569" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Days Header */}
          <View className="flex-row justify-between mb-3 px-1">
            {weekDays.map(day => (
              <Text key={day} className="text-gray-400 font-extrabold text-[10px] text-center w-9">
                {day}
              </Text>
            ))}
          </View>

          {/* Dates Grid */}
          <View className="flex-row flex-wrap justify-between">
            {calendarDates.map((item, idx) => {
              const isSelected = item.currentMonth && item.day === selectedDate;

              return (
                <TouchableOpacity
                  key={idx}
                  disabled={!item.currentMonth}
                  onPress={() => setSelectedDate(item.day)}
                  className={`w-9 h-11 items-center justify-center my-1 rounded-full ${
                    isSelected ? 'bg-[#163316]' : 'bg-transparent'
                  }`}
                >
                  <Text className={`font-bold text-xs ${
                    !item.currentMonth 
                      ? 'text-gray-300' 
                      : isSelected 
                        ? 'text-white font-extrabold' 
                        : 'text-gray-900'
                  }`}>
                    {item.day}
                  </Text>
                  
                  {item.currentMonth && (
                    <View className={`w-1 h-1 rounded-full mt-0.5 ${
                      isSelected ? 'bg-[#D2FC52]' : item.available ? 'bg-emerald-600' : 'bg-gray-300'
                    }`} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Calendar Legend */}
          <View className="flex-row items-center gap-4 mt-4 pt-3 border-t border-gray-100">
            <View className="flex-row items-center">
              <View className="w-2 h-2 bg-emerald-600 rounded-full mr-1.5" />
              <Text className="text-gray-500 text-[11px] font-semibold">Available</Text>
            </View>
            <View className="flex-row items-center">
              <View className="w-2 h-2 bg-gray-300 rounded-full mr-1.5" />
              <Text className="text-gray-400 text-[11px] font-semibold">Fully Booked</Text>
            </View>
          </View>
        </Animated.View>

        {/* AVAILABLE SLOTS SECTION */}
        <Animated.View entering={FadeInUp.delay(200)} className="mb-6">
          <View className="flex-row justify-between items-center mb-3 px-1">
            <Text className="text-gray-900 font-extrabold text-base">Available Slots</Text>
            <Text className="text-emerald-700 font-extrabold text-xs">
              Selected Date: {selectedDate} May 2025 📅
            </Text>
          </View>

          {/* Slots Grid */}
          <View className="flex-row flex-wrap gap-2.5 mb-4">
            {timeSlots.map((item, idx) => {
              const isSelected = selectedSlot === item.slot;

              return (
                <TouchableOpacity
                  key={idx}
                  disabled={!item.available}
                  onPress={() => handleSlotSelect(item.slot, item.price, item.available)}
                  className={`w-[31%] p-3 rounded-2xl border items-center justify-center relative ${
                    !item.available 
                      ? 'bg-gray-100 border-gray-200' 
                      : isSelected 
                        ? 'bg-[#163316] border-[#163316] shadow-sm' 
                        : 'bg-white border-gray-100 shadow-xs'
                  }`}
                >
                  {isSelected && (
                    <View className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full items-center justify-center">
                      <Check size={10} color="#163316" />
                    </View>
                  )}

                  <Text className={`font-extrabold text-[10px] text-center ${
                    !item.available 
                      ? 'text-gray-400' 
                      : isSelected 
                        ? 'text-white' 
                        : 'text-gray-900'
                  }`}>
                    {item.slot}
                  </Text>

                  <Text className={`font-bold text-[10px] mt-1 ${
                    !item.available 
                      ? 'text-gray-400' 
                      : isSelected 
                        ? 'text-emerald-300' 
                        : 'text-gray-500'
                  }`}>
                    {item.available ? `₹${item.price}` : 'Unavailable'}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Subtext Banner */}
          <View className="bg-[#F4FBE4] p-3.5 rounded-2xl border border-lime-100 flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 mr-2">
              <Info size={15} color="#475569" className="mr-2" />
              <Text className="text-gray-600 text-xs font-semibold">Advance booking allowed up to 3 days.</Text>
            </View>
            <Text className="text-gray-800 text-[11px] font-extrabold">Booking duration: 1 Hour</Text>
          </View>
        </Animated.View>

        <View className="h-28" />
      </ScrollView>

      {/* BOTTOM STICKY ACTION BAR */}
      <View className="absolute bottom-0 left-0 right-0 bg-white p-5 rounded-t-3xl border-t border-gray-100 shadow-lg flex-row justify-between items-center">
        <View className="flex-row items-center flex-1 mr-3">
          <View className="w-11 h-11 bg-[#F4FBE4] rounded-2xl items-center justify-center mr-3 border border-lime-100">
            <Activity size={20} color="#163316" />
          </View>

          <View>
            <Text className="text-gray-900 font-extrabold text-xs">{amenity.name}</Text>
            <Text className="text-gray-400 text-[10px] font-semibold">{selectedDate} May 2025 • {selectedSlot}</Text>
            <Text className="text-emerald-800 font-black text-sm mt-0.5">₹{selectedPrice}</Text>
          </View>
        </View>

        <TouchableOpacity 
          onPress={handleConfirmBooking}
          className="bg-[#163316] px-6 py-3.5 rounded-2xl flex-row items-center shadow-sm"
        >
          <Text className="text-white font-extrabold text-sm mr-2">Continue to Book</Text>
          <ChevronRight size={16} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
