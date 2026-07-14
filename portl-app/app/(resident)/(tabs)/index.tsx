import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../../store/authStore';
import { signOut } from '../../../services/supabase/auth';
import { LogOut, CheckCircle, XCircle, Clock, Bell, QrCode } from 'lucide-react-native';
import { supabase } from '../../../services/supabase/client';
import { apiClient } from '../../../services/api/client';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';

export default function ResidentDashboard() {
  const router = useRouter();
  const { user, societyId } = useAuthStore();
  const [requests, setRequests] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [flatId, setFlatId] = useState<string | null>(null);

  const fetchUserFlat = async () => {
    if (!user?.id) return;
    const { data } = await supabase
      .from('flat_members')
      .select('flat_id')
      .eq('user_id', user.id)
      .single();
    if (data) {
      setFlatId(data.flat_id);
      fetchRequests(data.flat_id);
    }
  };

  const fetchRequests = async (fId: string) => {
    if (!societyId || !fId) return;
    const { data } = await supabase
      .from('visitors')
      .select('*')
      .eq('flat_id', fId)
      .order('created_at', { ascending: false })
      .limit(20);
    
    if (data) setRequests(data);
  };

  useEffect(() => {
    fetchUserFlat();
    
    if (flatId) {
      const subscription = supabase
        .channel(`public:visitors:${flatId}`)
        .on('postgres_changes', { event: '*', schema: 'public', table: 'visitors', filter: `flat_id=eq.${flatId}` }, () => fetchRequests(flatId))
        .subscribe();
      return () => { subscription.unsubscribe(); };
    }
  }, [flatId, user?.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (flatId) await fetchRequests(flatId);
    setRefreshing(false);
  };

  const handleAction = async (visitorId: string, action: 'approve' | 'reject') => {
    try {
      // Optimistic update
      setRequests(prev => prev.map(req => req.id === visitorId ? { ...req, status: action === 'approve' ? 'approved' : 'rejected' } : req));
      
      const payload = action === 'reject' ? { reason: 'Denied by resident' } : {};
      await apiClient.post(`/api/visitors/${visitorId}/${action}`, payload);
      
    } catch (error) {
      Alert.alert('Error', 'Failed to process request');
      if (flatId) fetchRequests(flatId); // revert on failure
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const pastRequests = requests.filter(r => r.status !== 'pending');

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <View className="px-6 py-4 flex-row justify-between items-center border-b border-white/10">
        <View>
          <Text className="text-white text-xs uppercase tracking-wider text-textSecondary">Flat {flatId}</Text>
          <Text className="text-2xl font-bold text-white">Hello, {user?.email?.split('@')[0] || 'Resident'}</Text>
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
            onPress={() => router.push('/(resident)/generate-pass')}
            className="bg-accent rounded-3xl p-6 items-center flex-row shadow-card"
          >
            <View className="bg-dark p-4 rounded-full mr-4">
              <QrCode size={28} color="#E7FF45" />
            </View>
            <View>
              <Text className="text-dark font-bold text-xl">Guest Pass</Text>
              <Text className="text-dark/70 font-semibold mt-1">Generate QR for quick entry</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        <Text className="text-white font-bold text-lg mb-4 px-2">Action Required</Text>
        
        {pendingRequests.length === 0 ? (
          <View className="bg-white/5 p-8 rounded-3xl items-center border border-white/5 mb-6">
            <Bell size={40} color="#666" className="mb-4" />
            <Text className="text-white font-bold text-lg">All caught up!</Text>
            <Text className="text-textSecondary text-center mt-2">No pending visitor approvals.</Text>
          </View>
        ) : (
          pendingRequests.map((visitor, idx) => (
            <Animated.View 
              key={visitor.id}
              entering={FadeInUp.delay(idx * 100)}
              exiting={FadeOutDown}
              className="bg-white/10 rounded-3xl p-4 mb-4 border border-accent/30 shadow-card"
            >
              <View className="flex-row mb-4">
                {visitor.photo_url ? (
                  <Image source={{ uri: visitor.photo_url }} className="w-16 h-16 rounded-2xl mr-4 bg-black" />
                ) : (
                  <View className="w-16 h-16 bg-white/10 rounded-2xl mr-4 justify-center items-center">
                    <Text className="text-white font-bold text-xl">{visitor.name.charAt(0)}</Text>
                  </View>
                )}
                <View className="flex-1 justify-center">
                  <Text className="text-white font-bold text-lg">{visitor.name}</Text>
                  <Text className="text-textSecondary text-sm">{visitor.purpose} • {visitor.phone}</Text>
                </View>
              </View>
              
              <View className="flex-row space-x-3">
                <TouchableOpacity 
                  onPress={() => handleAction(visitor.id, 'reject')}
                  className="flex-1 bg-red-500/20 py-3 rounded-xl items-center border border-red-500/30"
                >
                  <Text className="text-red-400 font-bold">Deny</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => handleAction(visitor.id, 'approve')}
                  className="flex-1 bg-accent py-3 rounded-xl items-center shadow-card"
                >
                  <Text className="text-dark font-bold">Approve</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          ))
        )}

        <Text className="text-white font-bold text-lg mt-4 mb-4 px-2">Past Visitors</Text>
        {pastRequests.length === 0 ? (
          <Text className="text-textSecondary text-center mt-4 mb-10">No past visitors found</Text>
        ) : (
          pastRequests.map((visitor) => (
            <View key={visitor.id} className="bg-white/5 p-4 rounded-2xl mb-3 flex-row items-center justify-between border border-white/5">
              <View className="flex-row items-center flex-1">
                <View className="w-10 h-10 bg-white/10 rounded-full justify-center items-center mr-4">
                  {visitor.photo_url ? (
                    <Image source={{ uri: visitor.photo_url }} className="w-10 h-10 rounded-full" />
                  ) : (
                    <Text className="text-white font-bold">{visitor.name.charAt(0)}</Text>
                  )}
                </View>
                <View>
                  <Text className="text-white font-bold">{visitor.name}</Text>
                  <Text className="text-textSecondary text-xs">{visitor.purpose}</Text>
                </View>
              </View>
              <View className="items-end">
                {visitor.status === 'approved' ? (
                  <CheckCircle size={20} color="#22c55e" />
                ) : (
                  <XCircle size={20} color="#ef4444" />
                )}
                <Text className="text-xs text-textSecondary mt-1 capitalize">{visitor.status}</Text>
              </View>
            </View>
          ))
        )}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
