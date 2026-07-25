import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, RefreshControl, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, Filter, Search, Calendar, ChevronDown, ChevronRight, 
  Check, X, QrCode, Phone, MessageSquare, Clock, CheckCircle2, XCircle
} from 'lucide-react-native';
import { supabase } from '../../services/supabase/client';
import { apiClient } from '../../services/api/client';
import { useAuthStore } from '../../store/authStore';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function VisitorHistoryScreen() {
  const router = useRouter();
  const { user, societyId } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState<'all' | 'approved' | 'rejected' | 'pre-approved'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('17 May – 24 May');
  const [refreshing, setRefreshing] = useState(false);
  const [dbVisitors, setDbVisitors] = useState<any[]>([]);

  // Default demo data matching reference image
  const historyData = [
    {
      group: 'Today',
      count: '3 Visitors',
      items: [
        {
          id: 'h1',
          name: 'Rahul Sharma',
          role: 'Amazon Delivery',
          purpose: 'Handing over a package',
          status: 'approved',
          time: '10:24 AM',
          vehicle: 'KA01 AB 1234',
          phone: '98765 43210',
          photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
          type: 'delivery'
        },
        {
          id: 'h2',
          name: 'Sandeep Kumar',
          role: 'Electrician',
          purpose: 'Electrical repair work',
          status: 'approved',
          time: '09:15 AM',
          vehicle: null,
          phone: '98765 67890',
          photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
          type: 'service'
        },
        {
          id: 'h3',
          name: 'Manoj Verma',
          role: 'Zomato Delivery',
          purpose: 'Food delivery',
          status: 'rejected',
          time: '08:40 AM',
          vehicle: 'KA01 JF 5678',
          phone: '91234 56789',
          photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80',
          type: 'food'
        }
      ]
    },
    {
      group: 'Yesterday',
      count: '2 Visitors',
      items: [
        {
          id: 'h4',
          name: 'Vikas Singh',
          role: 'Courier Service',
          purpose: 'Courier documents',
          status: 'approved',
          time: '06:30 PM',
          vehicle: 'WB02 CD 7890',
          phone: '90000 11122',
          photo_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=300&q=80',
          type: 'delivery'
        },
        {
          id: 'h5',
          name: 'Amit Verma',
          role: 'Pre-approved Guest',
          purpose: 'Visited for personal meeting',
          status: 'pre-approved',
          time: '04:10 PM',
          vehicle: null,
          phone: '98765 43210',
          photo_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80',
          type: 'pre-approved'
        }
      ]
    },
    {
      group: '22 May 2025',
      count: '2 Visitors',
      items: [
        {
          id: 'h6',
          name: 'Neha Joshi',
          role: 'Friends & Family',
          purpose: 'Visiting for dinner',
          status: 'approved',
          time: '08:20 PM',
          vehicle: null,
          phone: '98111 55443',
          photo_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80',
          type: 'guest'
        }
      ]
    }
  ];

  const fetchHistory = async () => {
    try {
      const { data } = await apiClient.get('/api/visitors/history');
      if (data?.success && data?.history?.length > 0) {
        setDbVisitors(data.history);
      }
    } catch (e) {
      console.log('Using history dataset');
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHistory();
    setRefreshing(false);
  };

  const openDetails = (v: any) => {
    router.push({
      pathname: '/(resident)/visitor-details',
      params: {
        id: v.id,
        name: v.name,
        purpose: v.purpose || v.role,
        vehicle_number: v.vehicle || '',
        phone: v.phone || '',
        photo_url: v.photo_url || '',
        timeAgo: `Visited ${v.time}`,
        note: v.purpose,
        visitingFlat: 'Himanshu (B-302) • Tower A',
        status: v.status
      }
    });
  };

  // Filter items based on activeTab & searchQuery
  const filterItem = (item: any) => {
    if (activeTab === 'approved' && item.status !== 'approved') return false;
    if (activeTab === 'rejected' && item.status !== 'rejected') return false;
    if (activeTab === 'pre-approved' && item.status !== 'pre-approved') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = item.name.toLowerCase().includes(q);
      const matchRole = item.role.toLowerCase().includes(q);
      const matchPurpose = item.purpose.toLowerCase().includes(q);
      const matchPhone = (item.phone || '').includes(q);
      return matchName || matchRole || matchPurpose || matchPhone;
    }

    return true;
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FB]">
      {/* HEADER BAR */}
      <View className="flex-row justify-between items-center px-5 pt-3 pb-4 bg-white border-b border-gray-100">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100"
        >
          <ArrowLeft size={20} color="#1E293B" />
        </TouchableOpacity>

        <Text className="text-gray-900 font-extrabold text-lg">Visitor History</Text>

        <TouchableOpacity 
          onPress={() => Alert.alert('Filter', 'Advanced history filter options')}
          className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100"
        >
          <Filter size={18} color="#1E293B" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1 px-5 pt-4" 
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D2FC52" />}
      >
        {/* SEGMENT FILTER PILLS CONTROL */}
        <View className="bg-white p-1.5 rounded-2xl flex-row justify-between mb-4 shadow-sm border border-gray-100">
          {/* All */}
          <TouchableOpacity
            onPress={() => setActiveTab('all')}
            className={`px-4 py-2.5 rounded-xl flex-row items-center justify-center ${
              activeTab === 'all' ? 'bg-gray-900 shadow-sm' : 'bg-transparent'
            }`}
          >
            <Text className={`font-bold text-xs ${activeTab === 'all' ? 'text-white' : 'text-gray-500'}`}>
              All
            </Text>
            <View className={`ml-1.5 px-1.5 py-0.5 rounded-full ${activeTab === 'all' ? 'bg-[#D2FC52]' : 'bg-gray-100'}`}>
              <Text className={`text-[10px] font-black ${activeTab === 'all' ? 'text-gray-900' : 'text-gray-600'}`}>
                28
              </Text>
            </View>
          </TouchableOpacity>

          {/* Approved */}
          <TouchableOpacity
            onPress={() => setActiveTab('approved')}
            className={`px-3 py-2.5 rounded-xl flex-row items-center justify-center ${
              activeTab === 'approved' ? 'bg-gray-900 shadow-sm' : 'bg-transparent'
            }`}
          >
            <Text className={`font-bold text-xs ${activeTab === 'approved' ? 'text-white' : 'text-gray-500'}`}>
              Approved
            </Text>
            <View className="ml-1 px-1.5 py-0.5 rounded-full bg-emerald-100">
              <Text className="text-emerald-700 font-bold text-[10px]">18</Text>
            </View>
          </TouchableOpacity>

          {/* Rejected */}
          <TouchableOpacity
            onPress={() => setActiveTab('rejected')}
            className={`px-3 py-2.5 rounded-xl flex-row items-center justify-center ${
              activeTab === 'rejected' ? 'bg-gray-900 shadow-sm' : 'bg-transparent'
            }`}
          >
            <Text className={`font-bold text-xs ${activeTab === 'rejected' ? 'text-white' : 'text-gray-500'}`}>
              Rejected
            </Text>
            <View className="ml-1 px-1.5 py-0.5 rounded-full bg-rose-100">
              <Text className="text-rose-700 font-bold text-[10px]">5</Text>
            </View>
          </TouchableOpacity>

          {/* Pre-approved */}
          <TouchableOpacity
            onPress={() => setActiveTab('pre-approved')}
            className={`px-3 py-2.5 rounded-xl flex-row items-center justify-center ${
              activeTab === 'pre-approved' ? 'bg-gray-900 shadow-sm' : 'bg-transparent'
            }`}
          >
            <Text className={`font-bold text-xs ${activeTab === 'pre-approved' ? 'text-white' : 'text-gray-500'}`}>
              Pre-approved
            </Text>
            <View className="ml-1 px-1.5 py-0.5 rounded-full bg-blue-100">
              <Text className="text-blue-700 font-bold text-[10px]">5</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* SEARCH BAR & DATE SELECTOR ROW */}
        <View className="flex-row gap-2.5 mb-5">
          {/* Search Input */}
          <View className="flex-1 bg-white px-3.5 py-3 rounded-2xl border border-gray-100 flex-row items-center shadow-xs">
            <Search size={16} color="#94A3B8" className="mr-2" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search by name, purpose..."
              placeholderTextColor="#94A3B8"
              className="flex-1 text-gray-900 font-medium text-xs p-0"
            />
          </View>

          {/* Date Range Dropdown */}
          <TouchableOpacity 
            onPress={() => Alert.alert('Date Range', 'Select date range filter')}
            className="bg-white px-3 py-3 rounded-2xl border border-gray-100 flex-row items-center shadow-xs"
          >
            <Calendar size={15} color="#475569" className="mr-1.5" />
            <Text className="text-gray-800 font-bold text-xs mr-1">{dateRange}</Text>
            <ChevronDown size={14} color="#94A3B8" />
          </TouchableOpacity>
        </View>

        {/* GROUPED VISITOR LIST */}
        {historyData.map((group, gIdx) => {
          const matchingItems = group.items.filter(filterItem);
          if (matchingItems.length === 0) return null;

          return (
            <Animated.View key={gIdx} entering={FadeInUp.delay(gIdx * 100)} className="mb-5">
              {/* Group Title */}
              <View className="flex-row justify-between items-center mb-3 px-1">
                <Text className="text-gray-900 font-extrabold text-base">{group.group}</Text>
                <Text className="text-gray-400 text-xs font-semibold">{matchingItems.length} Visitors</Text>
              </View>

              {/* Group Items */}
              {matchingItems.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => openDetails(item)}
                  className="bg-white rounded-3xl p-4 mb-3 shadow-sm border border-gray-100"
                >
                  <View className="flex-row justify-between items-start mb-2">
                    <View className="flex-row items-center flex-1 pr-2">
                      {/* Photo with Badge */}
                      <View className="relative mr-3.5">
                        <Image 
                          source={{ uri: item.photo_url }} 
                          className="w-14 h-14 rounded-full bg-gray-200" 
                        />
                        <View className={`absolute top-0 left-0 w-5 h-5 rounded-full items-center justify-center border-2 border-white shadow-xs ${
                          item.status === 'approved' 
                            ? 'bg-[#D2FC52]' 
                            : item.status === 'rejected' 
                              ? 'bg-rose-400' 
                              : 'bg-blue-400'
                        }`}>
                          {item.status === 'approved' ? (
                            <Check size={10} color="#1E293B" />
                          ) : item.status === 'rejected' ? (
                            <X size={10} color="#FFFFFF" />
                          ) : (
                            <QrCode size={10} color="#FFFFFF" />
                          )}
                        </View>
                      </View>

                      {/* Info */}
                      <View className="flex-1">
                        <Text className="text-gray-900 font-black text-base">{item.name}</Text>
                        <Text className="text-gray-500 font-semibold text-xs mt-0.5">{item.role}</Text>

                        {item.purpose && (
                          <View className="flex-row items-center mt-1.5">
                            <MessageSquare size={12} color="#64748B" className="mr-1.5" />
                            <Text className="text-gray-700 text-[11px] font-semibold flex-1" numberOfLines={1}>
                              {item.purpose}
                            </Text>
                          </View>
                        )}
                      </View>
                    </View>

                    {/* Status Pill & Time */}
                    <View className="items-end">
                      <View className={`px-2.5 py-1 rounded-full flex-row items-center mb-2 ${
                        item.status === 'approved' 
                          ? 'bg-[#E2F8EE]' 
                          : item.status === 'rejected' 
                            ? 'bg-[#FFF2F2]' 
                            : 'bg-blue-50'
                      }`}>
                        {item.status === 'approved' ? (
                          <>
                            <Check size={11} color="#16A34A" className="mr-1" />
                            <Text className="text-emerald-700 font-extrabold text-[10px]">Approved</Text>
                          </>
                        ) : item.status === 'rejected' ? (
                          <>
                            <X size={11} color="#DC2626" className="mr-1" />
                            <Text className="text-rose-700 font-extrabold text-[10px]">Rejected</Text>
                          </>
                        ) : (
                          <>
                            <QrCode size={11} color="#2563EB" className="mr-1" />
                            <Text className="text-blue-700 font-extrabold text-[10px]">Pre-approved</Text>
                          </>
                        )}
                      </View>

                      <View className="flex-row items-center">
                        <Text className="text-gray-400 text-xs font-semibold mr-1">{item.time}</Text>
                        <ChevronRight size={14} color="#94A3B8" />
                      </View>
                    </View>
                  </View>

                  {/* Vehicle & Phone Footer */}
                  {(item.vehicle || item.phone) && (
                    <View className="pt-2 border-t border-gray-100 flex-row items-center gap-3">
                      {item.vehicle && (
                        <Text className="text-gray-500 text-[11px] font-semibold">🚘 {item.vehicle}</Text>
                      )}
                      {item.phone && (
                        <Text className="text-gray-500 text-[11px] font-semibold">📞 {item.phone}</Text>
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </Animated.View>
          );
        })}

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
