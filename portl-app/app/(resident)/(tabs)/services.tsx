import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiClient } from '../../../services/api/client';
import { Dumbbell, Waves, PartyPopper, Calendar } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function ServicesTab() {
  const [amenities, setAmenities] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchAmenities = async () => {
    try {
      const { data } = await apiClient.get('/api/amenities');
      if (data.success) setAmenities(data.amenities);
      
      const { data: bData } = await apiClient.get('/api/bookings');
      if (bData.success) setBookings(bData.bookings);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAmenities();
  }, []);

  const getIcon = (name: string) => {
    const lName = name.toLowerCase();
    if (lName.includes('gym')) return <Dumbbell size={24} color="#E7FF45" />;
    if (lName.includes('pool')) return <Waves size={24} color="#3b82f6" />;
    if (lName.includes('club') || lName.includes('hall')) return <PartyPopper size={24} color="#f43f5e" />;
    return <Calendar size={24} color="#a8a29e" />;
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchAmenities();
    setRefreshing(false);
  };

  const handleBook = async (amenityId: string) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const res = await apiClient.post('/api/bookings', {
        amenity_id: amenityId,
        booking_date: today,
        start_time: '18:00:00',
        end_time: '19:00:00'
      });
      if (res.data.success) {
        Alert.alert('Success', 'Slot booked for today 6 PM - 7 PM');
        fetchAmenities();
      }
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.error || 'Failed to book');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <View className="px-6 py-4 border-b border-white/10">
        <Text className="text-2xl font-bold text-white">Amenities & Services</Text>
      </View>

      <ScrollView 
        className="flex-1 px-4 pt-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E7FF45" />}
      >
        <Text className="text-white font-bold text-lg mb-4 px-2">Book Amenities</Text>
        <View className="flex-row flex-wrap justify-between">
          {amenities.map((amenity, idx) => (
            <Animated.View 
              key={amenity.id}
              entering={FadeInUp.delay(idx * 100)}
              className="bg-white/5 p-4 rounded-3xl w-[48%] mb-4 border border-white/5 items-center justify-between min-h-[160px]"
            >
              <View className="bg-dark p-4 rounded-full mb-2">
                {getIcon(amenity.name)}
              </View>
              <Text className="text-white font-bold text-center mb-1">{amenity.name}</Text>
              <TouchableOpacity 
                className="bg-accent/20 border border-accent/40 py-2 px-4 rounded-full mt-2 w-full items-center"
                onPress={() => handleBook(amenity.id)}
              >
                <Text className="text-accent font-bold text-xs">Book Slot</Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        <Text className="text-white font-bold text-lg mt-6 mb-4 px-2">My Upcoming Bookings</Text>
        {bookings.length === 0 ? (
          <Text className="text-textSecondary text-center mt-4">No upcoming bookings</Text>
        ) : (
          bookings.map((booking) => (
            <View key={booking.id} className="bg-white/10 p-4 rounded-2xl mb-3 flex-row items-center border border-white/10">
              <View className="w-12 h-12 bg-white/5 rounded-xl justify-center items-center mr-4">
                <Calendar size={20} color="#fff" />
              </View>
              <View>
                <Text className="text-white font-bold">{booking.amenities.name}</Text>
                <Text className="text-textSecondary text-xs">{booking.booking_date} • {booking.start_time.slice(0,5)} - {booking.end_time.slice(0,5)}</Text>
              </View>
            </View>
          ))
        )}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
