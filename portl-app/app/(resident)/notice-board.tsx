import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, Bell, Search, Filter, Pin, Calendar, ChevronRight, 
  Droplets, ArrowUpCircle, Users, Megaphone, PartyPopper, Trash2, Headset, Info, Sparkles 
} from 'lucide-react-native';
import { apiClient } from '../../services/api/client';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

export default function NoticeBoardScreen() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'all' | 'society' | 'maintenance' | 'events'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const defaultNotices = [
    {
      id: 'n1',
      title: 'Water Supply Interruption',
      category: 'Maintenance',
      body: 'Water supply will be interrupted on 18 May 2025 from 10:00 PM to 6:00 AM due to pipeline repair.',
      date: '18 May 2025',
      unread: true,
      icon: Droplets,
      bgColor: 'bg-blue-100',
      iconColor: '#2563EB',
      pillColor: 'bg-blue-50 text-blue-700'
    },
    {
      id: 'n2',
      title: 'Lift Maintenance Schedule',
      category: 'Maintenance',
      body: 'Lift maintenance will be carried out on 20 May 2025 from 9:00 AM to 1:00 PM.',
      date: '17 May 2025',
      unread: true,
      icon: ArrowUpCircle,
      bgColor: 'bg-amber-100',
      iconColor: '#D97706',
      pillColor: 'bg-amber-50 text-amber-800'
    },
    {
      id: 'n3',
      title: 'Annual General Meeting',
      category: 'Society',
      body: 'All residents are requested to attend the AGM on 25 May 2025 at 6:00 PM in the Community Hall.',
      date: '16 May 2025',
      unread: false,
      icon: Users,
      bgColor: 'bg-purple-100',
      iconColor: '#7C3AED',
      pillColor: 'bg-purple-50 text-purple-700'
    },
    {
      id: 'n4',
      title: 'Parking Rules Reminder',
      category: 'Society',
      body: 'Please park only in the designated areas. Avoid blocking driveways and fire exits.',
      date: '15 May 2025',
      unread: true,
      icon: Megaphone,
      bgColor: 'bg-emerald-100',
      iconColor: '#059669',
      pillColor: 'bg-emerald-50 text-emerald-700'
    },
    {
      id: 'n5',
      title: 'Community Fest – Save the Date!',
      category: 'Events',
      body: 'Our annual community fest will be held on 1 June 2025. More details coming soon!',
      date: '14 May 2025',
      unread: false,
      icon: PartyPopper,
      bgColor: 'bg-pink-100',
      iconColor: '#DB2777',
      pillColor: 'bg-pink-50 text-pink-700'
    },
    {
      id: 'n6',
      title: 'Garbage Collection Update',
      category: 'Maintenance',
      body: 'Dry waste will be collected on alternate days from this week. Please cooperate.',
      date: '13 May 2025',
      unread: false,
      icon: Trash2,
      bgColor: 'bg-emerald-100',
      iconColor: '#059669',
      pillColor: 'bg-emerald-50 text-emerald-700'
    }
  ];

  const [notices, setNotices] = useState<any[]>(defaultNotices);

  const fetchNotices = async () => {
    try {
      const { data } = await apiClient.get('/api/notices');
      if (data?.success && data?.notices?.length > 0) {
        setNotices(data.notices);
      }
    } catch (e) {
      setNotices(defaultNotices);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotices();
    setRefreshing(false);
  };

  const filteredNotices = notices.filter(n => {
    if (activeTab === 'society' && n.category !== 'Society') return false;
    if (activeTab === 'maintenance' && n.category !== 'Maintenance') return false;
    if (activeTab === 'events' && n.category !== 'Events') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q) || n.category.toLowerCase().includes(q);
    }
    return true;
  });

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

        <View className="items-center">
          <Text className="text-gray-900 font-extrabold text-lg">Notice Board</Text>
          <Text className="text-gray-400 text-xs font-semibold">Stay informed about what's happening</Text>
        </View>

        <TouchableOpacity 
          onPress={() => router.push('/(resident)/notifications')}
          className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100 relative"
        >
          <Bell size={18} color="#1E293B" />
          <View className="absolute top-2 right-2 w-4 h-4 bg-rose-500 rounded-full items-center justify-center border-2 border-white">
            <Text className="text-white text-[8px] font-black">3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1 px-5 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D2FC52" />}
      >
        {/* CATEGORY FILTER PILLS CONTROL */}
        <View className="bg-white p-1.5 rounded-2xl flex-row justify-between mb-4 shadow-sm border border-gray-100">
          {/* All Notices */}
          <TouchableOpacity
            onPress={() => setActiveTab('all')}
            className={`px-3 py-2.5 rounded-xl flex-row items-center justify-center ${
              activeTab === 'all' ? 'bg-gray-900 shadow-sm' : 'bg-transparent'
            }`}
          >
            <Text className={`font-bold text-xs ${activeTab === 'all' ? 'text-white' : 'text-gray-500'}`}>
              All Notices
            </Text>
            <View className={`ml-1.5 px-1.5 py-0.5 rounded-full ${activeTab === 'all' ? 'bg-[#D2FC52]' : 'bg-gray-100'}`}>
              <Text className={`text-[10px] font-black ${activeTab === 'all' ? 'text-gray-900' : 'text-gray-600'}`}>
                12
              </Text>
            </View>
          </TouchableOpacity>

          {/* Society */}
          <TouchableOpacity
            onPress={() => setActiveTab('society')}
            className={`px-3 py-2.5 rounded-xl flex-row items-center justify-center ${
              activeTab === 'society' ? 'bg-gray-900 shadow-sm' : 'bg-transparent'
            }`}
          >
            <Text className={`font-bold text-xs ${activeTab === 'society' ? 'text-white' : 'text-gray-500'}`}>
              Society
            </Text>
            <Text className="text-[11px] font-semibold text-gray-400 ml-1">6</Text>
          </TouchableOpacity>

          {/* Maintenance */}
          <TouchableOpacity
            onPress={() => setActiveTab('maintenance')}
            className={`px-3 py-2.5 rounded-xl flex-row items-center justify-center ${
              activeTab === 'maintenance' ? 'bg-gray-900 shadow-sm' : 'bg-transparent'
            }`}
          >
            <Text className={`font-bold text-xs ${activeTab === 'maintenance' ? 'text-white' : 'text-gray-500'}`}>
              Maintenance
            </Text>
            <Text className="text-[11px] font-semibold text-gray-400 ml-1">4</Text>
          </TouchableOpacity>

          {/* Events */}
          <TouchableOpacity
            onPress={() => setActiveTab('events')}
            className={`px-3 py-2.5 rounded-xl flex-row items-center justify-center ${
              activeTab === 'events' ? 'bg-gray-900 shadow-sm' : 'bg-transparent'
            }`}
          >
            <Text className={`font-bold text-xs ${activeTab === 'events' ? 'text-white' : 'text-gray-500'}`}>
              Events
            </Text>
            <Text className="text-[11px] font-semibold text-gray-400 ml-1">2</Text>
          </TouchableOpacity>
        </View>

        {/* SEARCH & FILTER ROW */}
        <View className="flex-row gap-2.5 mb-5">
          <View className="flex-1 bg-white px-3.5 py-3 rounded-2xl border border-gray-100 flex-row items-center shadow-xs">
            <Search size={16} color="#94A3B8" className="mr-2" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search notices..."
              placeholderTextColor="#94A3B8"
              className="flex-1 text-gray-900 font-medium text-xs p-0"
            />
          </View>

          <TouchableOpacity 
            onPress={() => Alert.alert('Filter', 'Filter notices')}
            className="bg-white px-4 py-3 rounded-2xl border border-gray-100 flex-row items-center shadow-xs"
          >
            <Filter size={15} color="#475569" className="mr-1.5" />
            <Text className="text-gray-800 font-bold text-xs">Filter</Text>
          </TouchableOpacity>
        </View>

        {/* PINNED NOTICE HERO CARD */}
        <Animated.View entering={FadeInDown.duration(400)} className="bg-[#F4FBE4] p-5 rounded-3xl mb-6 border border-lime-100 shadow-sm">
          <View className="flex-row items-center mb-2">
            <View className="w-5 h-5 bg-[#D2FC52] rounded-full items-center justify-center mr-1.5 shadow-xs">
              <Pin size={11} color="#1E293B" />
            </View>
            <Text className="text-[#4D7C0F] font-extrabold text-xs">Pinned Notice</Text>
          </View>

          <View className="flex-row justify-between items-start">
            <View className="flex-1 pr-3">
              <Text className="text-gray-900 font-black text-lg mb-1">
                Independence Day Celebration 🇮🇳
              </Text>
              <View className="flex-row items-center mb-2">
                <Calendar size={12} color="#64748B" className="mr-1" />
                <Text className="text-gray-500 text-[11px] font-semibold mr-2">15 Aug 2025</Text>
                <View className="bg-[#E2F8EE] px-2 py-0.5 rounded-full">
                  <Text className="text-emerald-700 text-[9px] font-bold">Community Event</Text>
                </View>
              </View>

              <Text className="text-gray-600 text-xs font-medium leading-relaxed mb-4">
                Join us as we celebrate 79th Independence Day with flag hoisting, cultural programs and snacks.
              </Text>

              <TouchableOpacity 
                onPress={() => Alert.alert('Notice Details', 'Independence Day Celebration 🇮🇳\nDate: 15 Aug 2025\nVenue: Society Clubhouse')}
                className="bg-[#163316] px-4 py-2.5 rounded-full flex-row items-center self-start shadow-xs"
              >
                <Text className="text-white font-extrabold text-xs mr-1">View Details</Text>
                <ChevronRight size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            <View className="w-20 h-20 bg-[#D2FC52]/30 rounded-2xl items-center justify-center">
              <Sparkles size={36} color="#163316" />
            </View>
          </View>
        </Animated.View>

        {/* RECENT NOTICES SECTION */}
        <View className="flex-row justify-between items-center mb-3 px-1">
          <Text className="text-gray-900 font-extrabold text-base">Recent Notices</Text>
          <TouchableOpacity onPress={() => setActiveTab('all')}>
            <Text className="text-gray-400 font-bold text-xs">See All &gt;</Text>
          </TouchableOpacity>
        </View>

        {/* RECENT NOTICES LIST */}
        {filteredNotices.map((item, idx) => {
          const IconComp = item.icon;
          return (
            <Animated.View key={item.id} entering={FadeInUp.delay(idx * 80)}>
              <TouchableOpacity
                onPress={() => Alert.alert(item.title, item.body)}
                className="bg-white rounded-3xl p-4 mb-3 shadow-sm border border-gray-100 flex-row items-start justify-between"
              >
                <View className="flex-row items-start flex-1 pr-2">
                  <View className={`w-13 h-13 rounded-2xl items-center justify-center mr-3.5 ${item.bgColor}`}>
                    <IconComp size={22} color={item.iconColor} />
                  </View>

                  <View className="flex-1">
                    <Text className="text-gray-900 font-extrabold text-base leading-snug">{item.title}</Text>

                    <View className="mt-1 self-start bg-gray-100 px-2.5 py-0.5 rounded-md">
                      <Text className="text-gray-600 text-[10px] font-bold">{item.category}</Text>
                    </View>

                    <Text className="text-gray-500 text-xs font-medium mt-2 leading-relaxed" numberOfLines={2}>
                      {item.body}
                    </Text>
                  </View>
                </View>

                {/* Right Side: Date & Arrow */}
                <View className="items-end">
                  <View className="flex-row items-center mb-1">
                    <Text className="text-gray-400 text-[11px] font-medium mr-1.5">{item.date}</Text>
                    {item.unread && (
                      <View className="w-2 h-2 bg-rose-500 rounded-full" />
                    )}
                  </View>
                  <ChevronRight size={14} color="#94A3B8" className="mt-2" />
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        {/* HAVE A QUERY BANNER CARD */}
        <Animated.View entering={FadeInUp.delay(600)} className="bg-[#F4FBE4] p-4 rounded-2xl mt-2 mb-8 border border-lime-100 flex-row items-center justify-between">
          <View className="flex-row items-center flex-1 mr-2">
            <Info size={16} color="#475569" className="mr-2" />
            <Text className="text-gray-700 text-xs font-semibold flex-1">
              <Text className="font-extrabold">Have a query or suggestion?</Text> Contact the management office.
            </Text>
          </View>

          <TouchableOpacity 
            onPress={() => Alert.alert('Contact Office', 'Dialing management office: 080-4567890')}
            className="bg-white px-3 py-1.5 rounded-full flex-row items-center border border-lime-200 shadow-xs"
          >
            <Headset size={13} color="#1E293B" className="mr-1" />
            <Text className="text-gray-900 font-extrabold text-xs">Contact Us</Text>
          </TouchableOpacity>
        </Animated.View>

        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
