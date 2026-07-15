import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiClient } from '../../../services/api/client';
import { useAuthStore } from '../../../store/authStore';
import { signOut } from '../../../services/supabase/auth';
import { LogOut, Users, AlertTriangle, IndianRupee } from 'lucide-react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuthStore();

  const fetchStats = async () => {
    try {
      const { data } = await apiClient.get('/api/admin/analytics');
      if (data.success) setStats(data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <View className="px-6 py-4 flex-row justify-between items-center border-b border-white/10">
        <View>
          <Text className="text-white text-xs uppercase tracking-wider text-textSecondary">Admin Panel</Text>
          <Text className="text-2xl font-bold text-accent">Society Overview</Text>
        </View>
        <TouchableOpacity onPress={signOut} className="p-2 bg-white/5 rounded-full">
          <LogOut size={20} color="#ff4444" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1 px-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E7FF45" />}
      >
        <Text className="text-white font-bold text-lg mt-6 mb-4 px-2">Key Metrics</Text>
        
        {stats && (
          <View className="flex-row flex-wrap justify-between">
            {/* Visitors Card */}
            <Animated.View entering={FadeInUp.delay(100)} className="bg-white/5 p-4 rounded-3xl w-[48%] mb-4 border border-white/5">
              <View className="bg-blue-500/20 w-10 h-10 rounded-full justify-center items-center mb-3">
                <Users size={20} color="#3b82f6" />
              </View>
              <Text className="text-textSecondary text-xs">Total Visitors</Text>
              <Text className="text-white font-bold text-2xl mt-1">{stats.visitors.total}</Text>
              <View className="mt-2 flex-row">
                <Text className="text-green-400 text-xs">{stats.visitors.approved} Approved</Text>
              </View>
            </Animated.View>

            {/* Complaints Card */}
            <Animated.View entering={FadeInUp.delay(200)} className="bg-white/5 p-4 rounded-3xl w-[48%] mb-4 border border-white/5">
              <View className="bg-amber-500/20 w-10 h-10 rounded-full justify-center items-center mb-3">
                <AlertTriangle size={20} color="#f59e0b" />
              </View>
              <Text className="text-textSecondary text-xs">Open Complaints</Text>
              <Text className="text-white font-bold text-2xl mt-1">{stats.complaints.open}</Text>
              <View className="mt-2 flex-row">
                <Text className="text-green-400 text-xs">{stats.complaints.resolved} Resolved</Text>
              </View>
            </Animated.View>

            {/* Revenue Card */}
            <Animated.View entering={FadeInUp.delay(300)} className="bg-white/5 p-4 rounded-3xl w-full mb-4 border border-white/5 flex-row items-center justify-between">
              <View>
                <View className="bg-green-500/20 w-10 h-10 rounded-full justify-center items-center mb-3">
                  <IndianRupee size={20} color="#22c55e" />
                </View>
                <Text className="text-textSecondary text-xs">Maintenance Collected</Text>
                <Text className="text-white font-bold text-3xl mt-1">₹{stats.revenue.collected}</Text>
              </View>
              <View className="items-end justify-end h-full pb-2">
                <Text className="text-red-400 text-sm">₹{stats.revenue.pending} Due</Text>
              </View>
            </Animated.View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
