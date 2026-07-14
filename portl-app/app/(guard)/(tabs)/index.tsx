import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../../store/authStore';
import { signOut } from '../../../services/supabase/auth';
import { useRouter } from 'expo-router';
import { UserPlus, LogOut, Clock, CheckCircle, XCircle } from 'lucide-react-native';
import { supabase } from '../../../services/supabase/client';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function GuardDashboard() {
  const { user, societyId } = useAuthStore();
  const router = useRouter();
  const [visitors, setVisitors] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRecentVisitors = async () => {
    if (!societyId) return;
    const { data } = await supabase
      .from('visitors')
      .select('*')
      .eq('society_id', societyId)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (data) setVisitors(data);
  };

  useEffect(() => {
    fetchRecentVisitors();
    
    // Subscribe to new visitors
    const subscription = supabase
      .channel('public:visitors')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'visitors', filter: `society_id=eq.${societyId}` }, fetchRecentVisitors)
      .subscribe();

    return () => { subscription.unsubscribe(); };
  }, [societyId]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchRecentVisitors();
    setRefreshing(false);
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'approved': return <CheckCircle size={20} color="#22c55e" />;
      case 'rejected': return <XCircle size={20} color="#ef4444" />;
      default: return <Clock size={20} color="#E7FF45" />;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <View className="px-6 py-4 flex-row justify-between items-center border-b border-white/10">
        <View>
          <Text className="text-white text-xs uppercase tracking-wider text-textSecondary">Gate 1</Text>
          <Text className="text-2xl font-bold text-accent">Guard Panel</Text>
        </View>
        <TouchableOpacity onPress={signOut} className="p-2 bg-white/5 rounded-full">
          <LogOut size={20} color="#ff4444" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1 px-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E7FF45" />}
      >
        <Animated.View entering={FadeInUp.delay(100)} className="my-6">
          <TouchableOpacity 
            onPress={() => router.push('/(guard)/register-visitor')}
            className="bg-accent rounded-3xl p-6 items-center flex-row shadow-card"
          >
            <View className="bg-dark p-4 rounded-full mr-4">
              <UserPlus size={28} color="#E7FF45" />
            </View>
            <View>
              <Text className="text-dark font-bold text-xl">New Visitor</Text>
              <Text className="text-dark/70 font-semibold mt-1">Scan & Notify Resident</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        <Text className="text-white font-bold text-lg mb-4 px-2">Recent Visitors</Text>
        
        {visitors.length === 0 ? (
          <Text className="text-textSecondary text-center mt-10">No recent visitors</Text>
        ) : (
          visitors.map((visitor, idx) => (
            <Animated.View 
              key={visitor.id} 
              entering={FadeInUp.delay(200 + idx * 100)}
              className="bg-white/5 p-4 rounded-2xl mb-3 flex-row items-center justify-between border border-white/5"
            >
              <View className="flex-row items-center flex-1">
                <View className="w-12 h-12 bg-white/10 rounded-full justify-center items-center mr-4">
                  <Text className="text-white font-bold text-lg">{visitor.name.charAt(0)}</Text>
                </View>
                <View>
                  <Text className="text-white font-bold text-base">{visitor.name}</Text>
                  <Text className="text-textSecondary text-xs">Flat {visitor.flat_id} • {visitor.purpose}</Text>
                </View>
              </View>
              <View className="items-end">
                {getStatusIcon(visitor.status)}
                <Text className="text-xs text-textSecondary mt-1 capitalize">{visitor.status}</Text>
              </View>
            </Animated.View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
