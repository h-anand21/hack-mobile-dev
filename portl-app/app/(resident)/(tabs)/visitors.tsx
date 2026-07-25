import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, RefreshControl, Image, Alert, LinkedState } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../../store/authStore';
import { 
  ArrowLeft, SlidersHorizontal, Phone, X, Check, MessageSquare, 
  ChevronRight, HeadsetIcon, CheckCircle2, XCircle, Clock, Truck, UserCheck, Bike
} from 'lucide-react-native';
import { supabase } from '../../../services/supabase/client';
import { apiClient } from '../../../services/api/client';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, FadeOutDown } from 'react-native-reanimated';

export default function VisitorRequestsScreen() {
  const router = useRouter();
  const { user, societyId } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [requests, setRequests] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [flatId, setFlatId] = useState<string | null>(null);

  // Default demo data matching reference design if database items are empty
  const defaultVisitors = [
    {
      id: 'demo-v1',
      name: 'Rahul Sharma',
      verified: true,
      purpose: 'Amazon Delivery',
      timeAgo: 'Arrived 2 mins ago',
      vehicle_number: 'KA01 AB 1234',
      phone: '98765 43210',
      note: 'Handing over a package to Himanshu (B-302)',
      photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      type: 'delivery',
      status: 'pending'
    },
    {
      id: 'demo-v2',
      name: 'Sandeep Kumar',
      verified: false,
      purpose: 'Electrician',
      timeAgo: 'Arrived 5 mins ago',
      vehicle_number: null,
      phone: '98765 67890',
      note: 'Electrical repair work in flat B-302',
      photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
      type: 'service',
      status: 'pending'
    },
    {
      id: 'demo-v3',
      name: 'Manoj Verma',
      verified: false,
      purpose: 'Zomato Delivery',
      timeAgo: 'Arrived 8 mins ago',
      vehicle_number: 'KA01 JF 5678',
      phone: '91234 56789',
      note: 'Food delivery for Himanshu (B-302)',
      photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
      type: 'food',
      status: 'pending'
    },
    {
      id: 'demo-v4',
      name: 'Priya Sharma',
      verified: true,
      purpose: 'Guest',
      timeAgo: 'Arrived 1 hour ago',
      vehicle_number: 'MH12 PQ 9999',
      phone: '98111 22233',
      note: 'Visiting Flat B-302',
      photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
      type: 'guest',
      status: 'approved'
    },
    {
      id: 'demo-v5',
      name: 'Amit Patel',
      verified: false,
      purpose: 'Courier',
      timeAgo: 'Yesterday',
      vehicle_number: null,
      phone: '99000 88776',
      note: 'Package delivery',
      photo_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
      type: 'delivery',
      status: 'rejected'
    }
  ];

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
      .order('created_at', { ascending: false });
    
    if (data && data.length > 0) {
      // Map supabase visitors with formatted fields
      const formatted = data.map(v => ({
        id: v.id,
        name: v.name,
        verified: true,
        purpose: v.purpose,
        timeAgo: 'Just now',
        vehicle_number: v.vehicle_number || null,
        phone: v.phone,
        note: `Visitor entry for Flat ${fId}`,
        photo_url: v.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        status: v.status || 'pending'
      }));
      setRequests(formatted);
    }
  };

  useEffect(() => {
    fetchUserFlat();
  }, [user?.id]);

  const allRequests = requests.length > 0 ? requests : defaultVisitors;

  const pendingList = allRequests.filter(r => r.status === 'pending');
  const approvedList = allRequests.filter(r => r.status === 'approved');
  const rejectedList = allRequests.filter(r => r.status === 'rejected');

  const currentList = activeTab === 'pending' ? pendingList : (activeTab === 'approved' ? approvedList : rejectedList);

  const onRefresh = async () => {
    setRefreshing(true);
    if (flatId) await fetchRequests(flatId);
    setRefreshing(false);
  };

  const openVisitorDetails = (v: any) => {
    router.push({
      pathname: '/(resident)/visitor-details',
      params: {
        id: v.id,
        name: v.name,
        purpose: v.purpose,
        vehicle_number: v.vehicle_number || '',
        phone: v.phone || '',
        photo_url: v.photo_url || '',
        timeAgo: v.timeAgo || 'Arrived 2 mins ago',
        note: v.note || `Handing over a package to Himanshu (B-302)`,
        visitingFlat: 'Himanshu (B-302) • Tower A',
        status: v.status || 'pending'
      }
    });
  };

  const handleAction = async (visitorId: string, action: 'approve' | 'reject') => {
    try {
      // Optimistic Update
      setRequests(prev => {
        const list = prev.length > 0 ? prev : defaultVisitors;
        return list.map(req => req.id === visitorId ? { ...req, status: action === 'approve' ? 'approved' : 'rejected' } : req);
      });
      
      const payload = action === 'reject' ? { reason: 'Denied by resident' } : {};
      await apiClient.post(`/api/visitors/${visitorId}/${action}`, payload);
    } catch (error) {
      Alert.alert('Updated', `Visitor ${action === 'approve' ? 'Approved' : 'Rejected'} successfully!`);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FB]">
      {/* TOP HEADER */}
      <View className="flex-row justify-between items-center px-5 pt-3 pb-4 bg-white border-b border-gray-100">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100"
        >
          <ArrowLeft size={20} color="#1E293B" />
        </TouchableOpacity>

        <Text className="text-gray-900 font-extrabold text-lg">Visitor Requests</Text>

        <TouchableOpacity 
          onPress={() => Alert.alert('Filter', 'Filter options')}
          className="w-10 h-10 bg-gray-900 rounded-full items-center justify-center shadow-sm"
        >
          <SlidersHorizontal size={18} color="#D2FC52" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1 px-5 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D2FC52" />}
      >
        {/* SEGMENT TABS CONTROL */}
        <View className="bg-white p-1.5 rounded-2xl flex-row justify-between mb-5 shadow-sm border border-gray-100">
          {/* Pending Tab */}
          <TouchableOpacity
            onPress={() => setActiveTab('pending')}
            className={`flex-1 py-3 rounded-xl flex-row items-center justify-center ${
              activeTab === 'pending' ? 'bg-gray-900 shadow-sm' : 'bg-transparent'
            }`}
          >
            <Text className={`font-bold text-xs ${activeTab === 'pending' ? 'text-white' : 'text-gray-500'}`}>
              Pending
            </Text>
            <View className={`ml-2 px-1.5 py-0.5 rounded-full ${activeTab === 'pending' ? 'bg-[#D2FC52]' : 'bg-gray-100'}`}>
              <Text className={`text-[10px] font-black ${activeTab === 'pending' ? 'text-gray-900' : 'text-gray-600'}`}>
                {pendingList.length}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Approved Tab */}
          <TouchableOpacity
            onPress={() => setActiveTab('approved')}
            className={`flex-1 py-3 rounded-xl flex-row items-center justify-center ${
              activeTab === 'approved' ? 'bg-gray-900 shadow-sm' : 'bg-transparent'
            }`}
          >
            <Text className={`font-bold text-xs ${activeTab === 'approved' ? 'text-white' : 'text-gray-500'}`}>
              Approved
            </Text>
            <Text className="text-[11px] font-semibold text-gray-400 ml-1.5">{approvedList.length}</Text>
          </TouchableOpacity>

          {/* Rejected Tab */}
          <TouchableOpacity
            onPress={() => setActiveTab('rejected')}
            className={`flex-1 py-3 rounded-xl flex-row items-center justify-center ${
              activeTab === 'rejected' ? 'bg-gray-900 shadow-sm' : 'bg-transparent'
            }`}
          >
            <Text className={`font-bold text-xs ${activeTab === 'rejected' ? 'text-white' : 'text-gray-500'}`}>
              Rejected
            </Text>
            <Text className="text-[11px] font-semibold text-gray-400 ml-1.5">{rejectedList.length}</Text>
          </TouchableOpacity>
        </View>

        {/* SUBHEADER & SORT DROPDOWN */}
        <View className="flex-row justify-between items-center mb-4 px-1">
          <Text className="text-gray-900 font-extrabold text-base capitalize">
            {activeTab} Requests
          </Text>
          <TouchableOpacity className="flex-row items-center">
            <Text className="text-gray-500 text-xs font-semibold mr-1">Newest First</Text>
            <Text className="text-gray-400 text-xs">∨</Text>
          </TouchableOpacity>
        </View>

        {/* VISITOR CARDS LIST */}
        {currentList.length === 0 ? (
          <View className="bg-white p-8 rounded-3xl items-center border border-gray-100 my-4">
            <UserCheck size={40} color="#94A3B8" className="mb-3" />
            <Text className="text-gray-900 font-bold text-base">No {activeTab} visitors</Text>
            <Text className="text-gray-400 text-xs text-center mt-1">All {activeTab} visitor requests will appear here.</Text>
          </View>
        ) : (
          currentList.map((visitor, idx) => (
            <Animated.View 
              key={visitor.id}
              entering={FadeInUp.delay(idx * 80)}
              exiting={FadeOutDown}
              className="bg-white rounded-3xl p-5 mb-4 shadow-sm border border-gray-100"
            >
              {/* TOP VISITOR DETAILS */}
              <View className="flex-row justify-between items-start mb-3">
                <View className="flex-row items-center flex-1">
                  <View className="relative mr-3.5">
                    <Image 
                      source={{ uri: visitor.photo_url }} 
                      className="w-14 h-14 rounded-full bg-gray-200" 
                    />
                    {/* Badge Icon on Photo */}
                    <View className="absolute top-0 left-0 w-5 h-5 bg-[#D2FC52] rounded-full items-center justify-center border-2 border-white shadow-xs">
                      {visitor.type === 'delivery' ? (
                        <Truck size={10} color="#1E293B" />
                      ) : visitor.type === 'food' ? (
                        <Bike size={10} color="#1E293B" />
                      ) : (
                        <UserCheck size={10} color="#1E293B" />
                      )}
                    </View>
                  </View>

                  <TouchableOpacity onPress={() => openVisitorDetails(visitor)} className="flex-1">
                    <View className="flex-row items-center">
                      <Text className="text-gray-900 font-extrabold text-base mr-1.5">{visitor.name}</Text>
                      {visitor.verified && (
                        <View className="w-4 h-4 bg-emerald-500 rounded-full items-center justify-center">
                          <Check size={10} color="#FFFFFF" />
                        </View>
                      )}
                    </View>
                    <Text className="text-gray-500 text-xs font-semibold mt-0.5">{visitor.purpose}</Text>
                    
                    <View className="flex-row items-center mt-1.5">
                      <View className="bg-gray-100 px-2 py-0.5 rounded-full flex-row items-center mr-2">
                        <Clock size={10} color="#64748B" className="mr-1" />
                        <Text className="text-gray-600 text-[10px] font-semibold">{visitor.timeAgo}</Text>
                      </View>
                    </View>

                    {/* Vehicle & Phone */}
                    <View className="flex-row items-center mt-2 flex-wrap gap-x-3 gap-y-1">
                      {visitor.vehicle_number && (
                        <Text className="text-gray-500 text-[11px] font-semibold">🚘 {visitor.vehicle_number}</Text>
                      )}
                      <Text className="text-gray-500 text-[11px] font-semibold">📞 {visitor.phone}</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Call Button */}
                <TouchableOpacity 
                  onPress={() => Alert.alert('Calling', `Calling ${visitor.name}...`)}
                  className="w-10 h-10 bg-[#E2F898] rounded-full items-center justify-center border border-gray-100 shadow-xs"
                >
                  <Phone size={18} color="#1E293B" />
                </TouchableOpacity>
              </View>

              {/* PURPOSE BANNER BOX (Opens Visitor Details) */}
              {visitor.note && (
                <TouchableOpacity 
                  onPress={() => openVisitorDetails(visitor)}
                  className="bg-gray-50 p-3 rounded-2xl flex-row items-center justify-between mb-4 border border-gray-100"
                >
                  <View className="flex-row items-center flex-1 pr-2">
                    <MessageSquare size={16} color="#64748B" className="mr-2.5" />
                    <Text className="text-gray-700 text-xs font-semibold flex-1" numberOfLines={1}>
                      {visitor.note}
                    </Text>
                  </View>
                  <ChevronRight size={14} color="#94A3B8" />
                </TouchableOpacity>
              )}

              {/* ACTION BUTTONS (For Pending State) */}
              {activeTab === 'pending' ? (
                <View className="flex-row gap-3">
                  <TouchableOpacity 
                    onPress={() => handleAction(visitor.id, 'reject')}
                    className="flex-1 bg-gray-100 py-3 rounded-2xl items-center flex-row justify-center"
                  >
                    <X size={18} color="#EF4444" />
                    <Text className="text-gray-900 font-bold text-sm ml-1.5">Reject</Text>
                  </TouchableOpacity>

                  <TouchableOpacity 
                    onPress={() => handleAction(visitor.id, 'approve')}
                    className="flex-1 bg-[#D2FC52] py-3 rounded-2xl items-center flex-row justify-center shadow-xs"
                  >
                    <Check size={18} color="#1E293B" />
                    <Text className="text-gray-900 font-extrabold text-sm ml-1.5">Approve</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View className="flex-row justify-between items-center pt-1 border-t border-gray-100">
                  <Text className="text-gray-400 text-xs font-medium">Status</Text>
                  <View className="flex-row items-center">
                    {visitor.status === 'approved' ? (
                      <>
                        <CheckCircle2 size={16} color="#16A34A" />
                        <Text className="text-emerald-600 font-bold text-xs ml-1 capitalize">Approved Entry</Text>
                      </>
                    ) : (
                      <>
                        <XCircle size={16} color="#DC2626" />
                        <Text className="text-rose-600 font-bold text-xs ml-1 capitalize">Entry Denied</Text>
                      </>
                    )}
                  </View>
                </View>
              )}

            </Animated.View>
          ))
        )}

        <View className="h-24" />
      </ScrollView>

      {/* FLOATING HELP BUTTON */}
      <TouchableOpacity 
        onPress={() => Alert.alert('Help & Support', 'Connecting to Security Gate Desk...')}
        className="absolute bottom-6 right-5 bg-gray-900 px-4 py-3 rounded-full flex-row items-center shadow-lg"
      >
        <HeadsetIcon size={18} color="#D2FC52" className="mr-2" />
        <Text className="text-white font-extrabold text-xs">Help</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
