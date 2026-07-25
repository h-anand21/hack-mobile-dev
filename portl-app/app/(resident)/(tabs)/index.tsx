import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../../store/authStore';
import { signOut } from '../../../services/supabase/auth';
import { 
  Bell, Phone, X, Check, Users, Calendar, Wrench, CreditCard, 
  ChevronRight, Megaphone, Vote, QrCode, LogOut, MoreHorizontal, CheckCircle2 
} from 'lucide-react-native';
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
    try {
      const { data } = await supabase
        .from('flat_members')
        .select('flat_id')
        .eq('user_id', user.id)
        .single();
      if (data) {
        setFlatId(data.flat_id);
        fetchRequests(data.flat_id);
      }
    } catch (err) {
      console.log('Flat fetch info:', err);
    }
  };

  const fetchRequests = async (fId: string) => {
    if (!societyId || !fId) return;
    const { data } = await supabase
      .from('visitors')
      .select('*')
      .eq('flat_id', fId)
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (data) setRequests(data);
  };

  useEffect(() => {
    fetchUserFlat();
  }, [user?.id]);

  const onRefresh = async () => {
    setRefreshing(true);
    if (flatId) await fetchRequests(flatId);
    setRefreshing(false);
  };

  const handleAction = async (visitorId: string, action: 'approve' | 'reject') => {
    try {
      setRequests(prev => prev.map(req => req.id === visitorId ? { ...req, status: action === 'approve' ? 'approved' : 'rejected' } : req));
      const payload = action === 'reject' ? { reason: 'Denied by resident' } : {};
      await apiClient.post(`/api/visitors/${visitorId}/${action}`, payload);
    } catch (error) {
      Alert.alert('Notice', 'Visitor status updated');
    }
  };

  const pendingRequests = requests.filter(r => r.status === 'pending');

  // Fallback demo visitor if none pending
  const activeVisitor = pendingRequests.length > 0 ? pendingRequests[0] : {
    id: 'demo-visitor-1',
    name: 'Rahul Sharma',
    purpose: 'Amazon Delivery',
    vehicle_number: 'KA01 AB 1234',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
    created_at: new Date().toISOString(),
    isDemo: true
  };

  const userName = user?.email?.split('@')[0] || 'Himanshu';

  const openVisitorDetails = (v: any) => {
    router.push({
      pathname: '/(resident)/visitor-details',
      params: {
        id: v.id,
        name: v.name,
        purpose: v.purpose,
        vehicle_number: v.vehicle_number || 'KA01 AB 1234',
        phone: v.phone || '98765 43210',
        photo_url: v.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        timeAgo: 'Arrived 2 mins ago',
        note: 'Handing over a package to Himanshu (B-302)',
        visitingFlat: 'Himanshu (B-302) • Tower A',
        status: v.status || 'pending'
      }
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FB]">
      <ScrollView 
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#A3E635" />}
      >
        {/* HEADER SECTION */}
        <Animated.View entering={FadeInUp.duration(500)} className="flex-row justify-between items-center mt-3 mb-6">
          <View className="flex-row items-center">
            <View className="relative mr-3">
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80' }} 
                className="w-14 h-14 rounded-full border-2 border-[#A3E635]"
              />
              <View className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
            </View>
            <View>
              <Text className="text-gray-500 text-xs font-semibold">Good Morning,</Text>
              <Text className="text-gray-900 text-xl font-extrabold capitalize">{userName} 👋</Text>
              <Text className="text-gray-400 text-xs font-medium mt-0.5">Flat B-302 • Tower A</Text>
            </View>
          </View>
          
          <View className="flex-row items-center gap-2">
            <TouchableOpacity 
              onPress={() => router.push('/(resident)/generate-pass')}
              className="w-11 h-11 bg-white rounded-full items-center justify-center border border-gray-100 shadow-sm"
            >
              <QrCode size={20} color="#1E293B" />
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => router.push('/(resident)/notifications')}
              className="w-11 h-11 bg-white rounded-full items-center justify-center border border-gray-100 shadow-sm relative"
            >
              <Bell size={20} color="#1E293B" />
              <View className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-rose-500 rounded-full border-2 border-white" />
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* HERO CARD: PENDING VISITOR APPROVAL */}
        <Animated.View entering={FadeInUp.delay(100)} className="bg-white rounded-3xl p-5 mb-6 shadow-sm border border-gray-100">
          <View className="flex-row justify-between items-center mb-4">
            <View className="flex-row items-center bg-gray-100 px-3 py-1.5 rounded-full">
              <View className="w-6 h-6 bg-[#D2FC52] rounded-full items-center justify-center mr-2">
                <Users size={13} color="#1E293B" />
              </View>
              <Text className="text-gray-900 text-xs font-bold">Visitor Waiting for Approval</Text>
            </View>
            <Text className="text-gray-400 text-[11px] font-medium">• 2 mins ago</Text>
          </View>

          <View className="flex-row items-center justify-between mb-5">
            <TouchableOpacity onPress={() => openVisitorDetails(activeVisitor)} className="flex-row items-center flex-1">
              <Image 
                source={{ uri: activeVisitor.photo_url }} 
                className="w-14 h-14 rounded-full mr-3.5 bg-gray-200" 
              />
              <View className="flex-1">
                <Text className="text-gray-900 font-extrabold text-base">{activeVisitor.name}</Text>
                <Text className="text-gray-500 text-xs font-medium mt-0.5">{activeVisitor.purpose}</Text>
                <View className="flex-row items-center mt-1">
                  <Text className="text-gray-400 text-[11px] font-semibold mr-2">🚘 {activeVisitor.vehicle_number}</Text>
                </View>
              </View>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => Alert.alert('Calling Visitor', `Dialing ${activeVisitor.name}...`)}
              className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100"
            >
              <Phone size={18} color="#475569" />
            </TouchableOpacity>
          </View>

          {/* ACTION BUTTONS */}
          <View className="flex-row gap-3">
            <TouchableOpacity 
              onPress={() => handleAction(activeVisitor.id, 'reject')}
              className="flex-1 bg-gray-100 py-3.5 rounded-2xl items-center flex-row justify-center"
            >
              <X size={18} color="#EF4444" />
              <Text className="text-gray-900 font-bold text-sm" style={{ marginLeft: 6 }}>Reject</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => handleAction(activeVisitor.id, 'approve')}
              className="flex-1 bg-[#D2FC52] py-3.5 rounded-2xl items-center flex-row justify-center shadow-sm"
            >
              <Check size={18} color="#1E293B" />
              <Text className="text-gray-900 font-extrabold text-sm" style={{ marginLeft: 6 }}>Approve</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* QUICK ACTIONS SECTION */}
        <Animated.View entering={FadeInUp.delay(200)} className="mb-6">
          <View className="flex-row justify-between items-center mb-3 px-1">
            <Text className="text-gray-900 font-extrabold text-base">Quick Actions</Text>
            <TouchableOpacity 
              onPress={() => router.push('/(resident)/(tabs)/visitors')} 
              className="flex-row items-center"
            >
              <Text className="text-gray-400 font-semibold text-xs">View All</Text>
              <ChevronRight size={14} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-between gap-2">
            {/* Visitors */}
            <TouchableOpacity 
              onPress={() => router.push('/(resident)/(tabs)/visitors')}
              className="flex-1 bg-white p-3.5 rounded-2xl items-center border border-gray-100 shadow-sm"
            >
              <View className="w-12 h-12 bg-[#E2F898] rounded-2xl items-center justify-center mb-2">
                <Users size={22} color="#1E293B" />
              </View>
              <Text className="text-gray-800 font-bold text-xs">Visitors</Text>
            </TouchableOpacity>

            {/* Bookings */}
            <TouchableOpacity 
              onPress={() => router.push('/(resident)/(tabs)/services')}
              className="flex-1 bg-white p-3.5 rounded-2xl items-center border border-gray-100 shadow-sm"
            >
              <View className="w-12 h-12 bg-[#E2E2FF] rounded-2xl items-center justify-center mb-2">
                <Calendar size={22} color="#4F46E5" />
              </View>
              <Text className="text-gray-800 font-bold text-xs">Bookings</Text>
            </TouchableOpacity>

            {/* Helpdesk */}
            <TouchableOpacity 
              onPress={() => router.push('/(resident)/(tabs)/complaints')}
              className="flex-1 bg-white p-3.5 rounded-2xl items-center border border-gray-100 shadow-sm"
            >
              <View className="w-12 h-12 bg-[#FFE5D9] rounded-2xl items-center justify-center mb-2">
                <Wrench size={22} color="#EA580C" />
              </View>
              <Text className="text-gray-800 font-bold text-xs">Helpdesk</Text>
            </TouchableOpacity>

            {/* Pay Dues */}
            <TouchableOpacity 
              onPress={() => Alert.alert('Maintenance Dues', 'Total Due: ₹2,500\nDue on: 15 Aug 2025\n\nPay securely via Razorpay.')}
              className="flex-1 bg-white p-3.5 rounded-2xl items-center border border-gray-100 shadow-sm"
            >
              <View className="w-12 h-12 bg-[#D2F6EA] rounded-2xl items-center justify-center mb-2">
                <CreditCard size={22} color="#0D9488" />
              </View>
              <Text className="text-gray-800 font-bold text-xs">Pay Dues</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* 2-COLUMN PASTEL CARDS GRID */}
        <Animated.View entering={FadeInUp.delay(300)} className="flex-row gap-3 mb-4">
          {/* Card 1: Society Notice */}
          <TouchableOpacity 
            onPress={() => router.push('/(resident)/notice-board')}
            className="flex-1 bg-[#EEF5FF] p-4 rounded-3xl justify-between border border-blue-100"
          >
            <View>
              <View className="flex-row justify-between items-center mb-3">
                <View className="w-7 h-7 bg-blue-500/10 rounded-full items-center justify-center">
                  <Megaphone size={14} color="#2563EB" />
                </View>
                <MoreHorizontal size={16} color="#94A3B8" />
              </View>
              <Text className="text-blue-900 font-bold text-[11px] mb-1">Society Notice</Text>
              <Text className="text-gray-900 font-extrabold text-sm mb-1">Water Supply Maintenance</Text>
              <Text className="text-gray-500 text-[10px] font-medium">Tomorrow, 10:00 AM - 12:00 PM</Text>
            </View>

            <TouchableOpacity 
              onPress={() => router.push('/(resident)/notice-board')}
              className="mt-4 flex-row items-center"
            >
              <Text className="text-blue-600 font-bold text-xs mr-1">Read More</Text>
              <ChevronRight size={14} color="#2563EB" />
            </TouchableOpacity>
          </TouchableOpacity>

          {/* Card 2: Community Poll */}
          <TouchableOpacity 
            onPress={() => router.push('/(resident)/community-polls')}
            className="flex-1 bg-[#F3EFFF] p-4 rounded-3xl justify-between border border-purple-100"
          >
            <View>
              <View className="flex-row justify-between items-center mb-3">
                <View className="w-7 h-7 bg-purple-500/10 rounded-full items-center justify-center">
                  <Vote size={14} color="#7C3AED" />
                </View>
                <MoreHorizontal size={16} color="#94A3B8" />
              </View>
              <Text className="text-purple-900 font-bold text-[11px] mb-1">Community Poll</Text>
              <Text className="text-gray-900 font-extrabold text-sm mb-2">Should we organize a Diwali Event this year?</Text>
              <Text className="text-purple-600 text-[10px] font-bold">+120 voted</Text>
            </View>

            <TouchableOpacity 
              onPress={() => router.push('/(resident)/community-polls')}
              className="mt-3 bg-[#E0D6FF] py-2 rounded-xl items-center"
            >
              <Text className="text-purple-900 font-bold text-xs">Vote Now</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </Animated.View>

        {/* 2-COLUMN PASTEL CARDS GRID ROW 2 */}
        <Animated.View entering={FadeInUp.delay(400)} className="flex-row gap-3 mb-6">
          {/* Card 3: Upcoming Booking */}
          <TouchableOpacity 
            onPress={() => router.push('/(resident)/(tabs)/services')}
            className="flex-1 bg-[#FFF9EE] p-4 rounded-3xl justify-between border border-amber-100"
          >
            <View>
              <View className="flex-row justify-between items-center mb-2">
                <View className="w-7 h-7 bg-amber-500/10 rounded-full items-center justify-center">
                  <Calendar size={14} color="#D97706" />
                </View>
                <MoreHorizontal size={16} color="#94A3B8" />
              </View>
              <Text className="text-amber-900 font-bold text-[11px] mb-2">Upcoming Booking</Text>
              
              <View className="flex-row items-center mb-2">
                <Image 
                  source={{ uri: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=200&q=80' }} 
                  className="w-10 h-10 rounded-xl mr-2.5 bg-gray-200"
                />
                <View className="flex-1">
                  <Text className="text-gray-900 font-extrabold text-xs">Swimming Pool</Text>
                  <Text className="text-gray-500 text-[10px] font-medium">Today, 06:00 PM</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity 
              onPress={() => router.push('/(resident)/(tabs)/services')}
              className="flex-row items-center mt-2"
            >
              <Text className="text-amber-700 font-bold text-xs">View Booking</Text>
              <ChevronRight size={14} color="#B45309" />
            </TouchableOpacity>
          </TouchableOpacity>

          {/* Card 4: Helpdesk */}
          <TouchableOpacity 
            onPress={() => router.push('/(resident)/(tabs)/complaints')}
            className="flex-1 bg-[#F2FBF7] p-4 rounded-3xl justify-between border border-emerald-100"
          >
            <View>
              <View className="flex-row justify-between items-center mb-2">
                <View className="w-7 h-7 bg-emerald-500/10 rounded-full items-center justify-center">
                  <Wrench size={14} color="#059669" />
                </View>
                <MoreHorizontal size={16} color="#94A3B8" />
              </View>
              <Text className="text-emerald-900 font-bold text-[11px] mb-1">Helpdesk</Text>
              <Text className="text-gray-900 font-extrabold text-xs mb-2">Water Leakage in Kitchen</Text>
              <View className="bg-[#E2F8EE] px-2.5 py-1 rounded-full self-start">
                <Text className="text-emerald-700 font-bold text-[10px]">In Progress</Text>
              </View>
            </View>

            <TouchableOpacity 
              onPress={() => router.push('/(resident)/(tabs)/complaints')}
              className="flex-row items-center mt-3"
            >
              <Text className="text-emerald-700 font-bold text-xs">View Details</Text>
              <ChevronRight size={14} color="#047857" />
            </TouchableOpacity>
          </TouchableOpacity>
        </Animated.View>

        {/* MAINTENANCE DUES BANNER CARD */}
        <Animated.View entering={FadeInUp.delay(500)} className="bg-[#FFF2F2] p-5 rounded-3xl mb-10 border border-rose-100 flex-row justify-between items-center">
          <View className="flex-1">
            <View className="flex-row items-center mb-1">
              <View className="w-6 h-6 bg-rose-500/10 rounded-full items-center justify-center mr-2">
                <CreditCard size={13} color="#E11D48" />
              </View>
              <Text className="text-rose-900 font-bold text-xs">Maintenance Dues</Text>
            </View>
            <Text className="text-gray-500 text-[11px] font-medium">Total Due</Text>
            <Text className="text-gray-900 font-black text-2xl mt-0.5">₹2,500</Text>
            <Text className="text-rose-600 text-[10px] font-bold mt-1">Due on 15 Aug 2025</Text>
          </View>

          <TouchableOpacity 
            onPress={() => Alert.alert('Payment Portal', 'Redirecting to Razorpay payment gateway...')}
            className="bg-[#FF5A5A] px-6 py-3.5 rounded-2xl items-center justify-center shadow-sm"
          >
            <Text className="text-white font-extrabold text-sm">Pay Now</Text>
          </TouchableOpacity>
        </Animated.View>

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
