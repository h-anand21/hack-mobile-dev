import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiClient } from '../../../services/api/client';
import { User, Phone } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function AdminResidents() {
  const [residents, setResidents] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchResidents = async () => {
    try {
      const { data } = await apiClient.get('/api/admin/residents');
      if (data.success) setResidents(data.residents);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchResidents();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchResidents();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <View className="px-6 py-4 border-b border-white/10">
        <Text className="text-2xl font-bold text-white">Resident Directory</Text>
      </View>

      <ScrollView 
        className="flex-1 px-4 pt-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E7FF45" />}
      >
        <Text className="text-white font-bold text-lg mb-4 px-2">All Residents ({residents.length})</Text>
        
        {residents.length === 0 ? (
          <Text className="text-textSecondary text-center mt-10">No residents found</Text>
        ) : (
          residents.map((r, idx) => (
            <Animated.View key={r.id} entering={FadeInUp.delay(idx * 50)} className="bg-white/5 p-4 rounded-2xl mb-3 border border-white/5 flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 bg-white/10 rounded-full justify-center items-center mr-4">
                  <User size={24} color="#fff" />
                </View>
                <View>
                  <Text className="text-white font-bold text-base">{r.name || 'Unnamed'}</Text>
                  <Text className="text-textSecondary text-xs">{r.email}</Text>
                </View>
              </View>
              <View className="items-end bg-white/10 p-2 rounded-full">
                <Phone size={16} color="#E7FF45" />
              </View>
            </Animated.View>
          ))
        )}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
