import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../services/supabase/client';
import { CheckCircle, XCircle, Clock, ArrowLeft } from 'lucide-react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function VisitorStatusScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [visitorName, setVisitorName] = useState('');

  useEffect(() => {
    // Initial fetch
    const fetchVisitor = async () => {
      const { data } = await supabase.from('visitors').select('status, name').eq('id', id).single();
      if (data) {
        setStatus(data.status);
        setVisitorName(data.name);
      }
    };
    fetchVisitor();

    // Subscribe to realtime updates
    const subscription = supabase
      .channel(`visitor_status_${id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'visitors', filter: `id=eq.${id}` },
        (payload) => {
          setStatus(payload.new.status);
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [id]);

  const getStatusContent = () => {
    switch (status) {
      case 'approved':
        return (
          <Animated.View entering={FadeInDown} className="items-center">
            <View className="w-32 h-32 bg-green-500/20 rounded-full justify-center items-center mb-6">
              <CheckCircle size={64} color="#22c55e" />
            </View>
            <Text className="text-3xl text-white font-bold mb-2">Approved!</Text>
            <Text className="text-textSecondary text-center">Resident has approved entry for {visitorName}.</Text>
          </Animated.View>
        );
      case 'rejected':
        return (
          <Animated.View entering={FadeInDown} className="items-center">
            <View className="w-32 h-32 bg-red-500/20 rounded-full justify-center items-center mb-6">
              <XCircle size={64} color="#ef4444" />
            </View>
            <Text className="text-3xl text-white font-bold mb-2">Entry Denied</Text>
            <Text className="text-textSecondary text-center">Resident has rejected entry for {visitorName}.</Text>
          </Animated.View>
        );
      case 'pending':
      default:
        return (
          <Animated.View entering={FadeIn} className="items-center">
            <View className="w-32 h-32 bg-accent/20 rounded-full justify-center items-center mb-6 relative">
              <ActivityIndicator size="large" color="#E7FF45" className="absolute" />
              <Clock size={40} color="#E7FF45" />
            </View>
            <Text className="text-3xl text-white font-bold mb-2">Waiting...</Text>
            <Text className="text-textSecondary text-center">Notifying resident. Please wait for approval.</Text>
          </Animated.View>
        );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <View className="p-4">
        <TouchableOpacity onPress={() => router.replace('/(guard)/(tabs)')} className="p-2 bg-white/10 self-start rounded-full">
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
      </View>
      <View className="flex-1 justify-center items-center px-6">
        {getStatusContent()}
      </View>
      {status !== 'pending' && (
        <View className="px-6 pb-10">
          <TouchableOpacity 
            onPress={() => router.replace('/(guard)/(tabs)')}
            className="bg-accent py-4 rounded-full items-center shadow-card"
          >
            <Text className="text-dark font-bold text-lg">Back to Dashboard</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}
