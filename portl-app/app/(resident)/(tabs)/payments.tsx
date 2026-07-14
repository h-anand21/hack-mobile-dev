import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiClient } from '../../../services/api/client';
import { IndianRupee, CheckCircle2, AlertCircle } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function PaymentsTab() {
  const [payments, setPayments] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);

  const fetchDues = async () => {
    try {
      const { data } = await apiClient.get('/api/maintenance/dues');
      if (data.success) setPayments(data.payments);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDues();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDues();
    setRefreshing(false);
  };

  const handlePay = async (id: string) => {
    setPayingId(id);
    try {
      const { data } = await apiClient.post('/api/maintenance/pay', { payment_id: id });
      if (data.success) {
        Alert.alert('Payment Successful', 'Your maintenance due has been paid.');
        fetchDues();
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Payment failed');
    } finally {
      setPayingId(null);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <View className="px-6 py-4 border-b border-white/10">
        <Text className="text-2xl font-bold text-white">Maintenance Dues</Text>
      </View>

      <ScrollView 
        className="flex-1 px-4 pt-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E7FF45" />}
      >
        {payments.length === 0 ? (
          <View className="items-center mt-10">
            <CheckCircle2 size={48} color="#22c55e" className="mb-4" />
            <Text className="text-white font-bold text-xl">All Cleared!</Text>
            <Text className="text-textSecondary mt-2">You have no pending maintenance dues.</Text>
          </View>
        ) : (
          payments.map((p, idx) => {
            const isPaid = p.status === 'paid';
            return (
              <Animated.View key={p.id} entering={FadeInUp.delay(idx * 100)} className="bg-white/5 p-5 rounded-3xl mb-4 border border-white/5">
                <View className="flex-row justify-between items-start mb-6">
                  <View>
                    <Text className="text-white font-bold text-lg">{p.month} {p.year}</Text>
                    <Text className="text-textSecondary text-sm">Due by {new Date(p.due_date).toLocaleDateString()}</Text>
                  </View>
                  <View className={`px-3 py-1 rounded-full ${isPaid ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    <Text className={`text-xs font-bold uppercase ${isPaid ? 'text-green-500' : 'text-red-500'}`}>{p.status}</Text>
                  </View>
                </View>

                <View className="flex-row items-center mb-6">
                  <IndianRupee size={28} color={isPaid ? "#22c55e" : "#E7FF45"} />
                  <Text className="text-white font-bold text-4xl">{p.amount}</Text>
                </View>

                {!isPaid ? (
                  <TouchableOpacity 
                    onPress={() => handlePay(p.id)}
                    disabled={payingId === p.id}
                    className="bg-accent py-4 rounded-xl flex-row justify-center items-center shadow-card"
                  >
                    {payingId === p.id ? (
                      <ActivityIndicator color="#171717" />
                    ) : (
                      <>
                        <Text className="text-dark font-bold text-lg mr-2">Pay Now</Text>
                        <ArrowRightIcon />
                      </>
                    )}
                  </TouchableOpacity>
                ) : (
                  <View className="bg-white/5 py-4 rounded-xl flex-row justify-center items-center border border-white/10">
                    <CheckCircle2 size={20} color="#22c55e" className="mr-2" />
                    <Text className="text-white/60 font-bold">Paid on {new Date(p.paid_at).toLocaleDateString()}</Text>
                  </View>
                )}
              </Animated.View>
            );
          })
        )}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}

const ArrowRightIcon = () => (
  <View style={{ width: 16, height: 16, justifyContent: 'center' }}>
    <View style={{ width: 12, height: 2, backgroundColor: '#171717' }} />
    <View style={{ position: 'absolute', right: 2, top: 4, width: 8, height: 2, backgroundColor: '#171717', transform: [{ rotate: '45deg' }] }} />
    <View style={{ position: 'absolute', right: 2, bottom: 4, width: 8, height: 2, backgroundColor: '#171717', transform: [{ rotate: '-45deg' }] }} />
  </View>
);
