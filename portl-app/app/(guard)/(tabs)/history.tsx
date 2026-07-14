import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../../store/authStore';
import { apiClient } from '../../../services/api/client';
import { CheckCircle, XCircle, LogIn, LogOut, ArrowRight, ArrowLeft } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function GuardHistoryTab() {
  const [history, setHistory] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const { societyId } = useAuthStore();

  const fetchHistory = async () => {
    try {
      const response = await apiClient.get('/api/visitors/history');
      if (response.data.success) {
        setHistory(response.data.history);
      }
    } catch (error) {
      console.error('Failed to fetch history', error);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [societyId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHistory();
    setRefreshing(false);
  };

  const getActionIcon = (action: string) => {
    switch(action) {
      case 'created': return <ArrowRight size={16} color="#3b82f6" />;
      case 'approved': return <CheckCircle size={16} color="#22c55e" />;
      case 'rejected': return <XCircle size={16} color="#ef4444" />;
      case 'entered': return <LogIn size={16} color="#E7FF45" />;
      case 'exited': return <LogOut size={16} color="#a8a29e" />;
      default: return <CheckCircle size={16} color="#666" />;
    }
  };

  const formatDate = (dateString: string) => {
    const d = new Date(dateString);
    return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`;
  };

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <View className="px-6 py-4 border-b border-white/10">
        <Text className="text-2xl font-bold text-white">Visitor Log Book</Text>
      </View>

      <ScrollView 
        className="flex-1 px-4 pt-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E7FF45" />}
      >
        {history.length === 0 ? (
          <Text className="text-textSecondary text-center mt-10">No history available</Text>
        ) : (
          history.map((log, idx) => (
            <Animated.View 
              key={log.id} 
              entering={FadeInUp.delay(idx * 50)}
              className="bg-white/5 p-4 rounded-2xl mb-3 border border-white/5"
            >
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center">
                  <View className="mr-2">
                    {getActionIcon(log.action)}
                  </View>
                  <Text className="text-white font-bold capitalize">{log.action}</Text>
                </View>
                <Text className="text-textSecondary text-xs">{formatDate(log.created_at)}</Text>
              </View>
              
              <View className="bg-dark/50 p-3 rounded-xl flex-row items-center">
                <View className="w-8 h-8 bg-white/10 rounded-full justify-center items-center mr-3">
                  <Text className="text-white font-bold">{log.visitors.name.charAt(0)}</Text>
                </View>
                <View>
                  <Text className="text-white font-bold text-sm">{log.visitors.name}</Text>
                  <Text className="text-textSecondary text-xs">Flat {log.visitors.flat_id} • {log.visitors.purpose}</Text>
                </View>
              </View>
            </Animated.View>
          ))
        )}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
