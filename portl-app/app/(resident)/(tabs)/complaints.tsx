import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, Headset, Filter, Search, Plus, ChevronRight, 
  Wrench, Zap, Trash2, Camera, Clock, CheckCircle2, AlertCircle, Building2, Droplets, ArrowUpCircle
} from 'lucide-react-native';
import { apiClient } from '../../../services/api/client';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

export default function HelpdeskTab() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'all' | 'in_progress' | 'resolved' | 'closed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Plumbing');

  const defaultComplaints = [
    {
      id: 'c1256',
      ticketNo: '#CMP-1256',
      title: 'Water Leakage in Kitchen',
      category: 'Plumbing',
      location: 'B-302 • Tower A',
      dateTime: '24 May 2025 • 09:30 AM',
      status: 'in_progress',
      type: 'plumbing',
      bgColor: 'bg-amber-100',
      iconColor: '#D97706'
    },
    {
      id: 'c1255',
      ticketNo: '#CMP-1255',
      title: 'Common Area Light Not Working',
      category: 'Electrical',
      location: 'B-302 • Tower A',
      dateTime: '22 May 2025 • 08:15 PM',
      status: 'resolved',
      type: 'electrical',
      bgColor: 'bg-purple-100',
      iconColor: '#7C3AED'
    },
    {
      id: 'c1254',
      ticketNo: '#CMP-1254',
      title: 'Lift Not Working',
      category: 'Elevator',
      location: 'B-302 • Tower A',
      dateTime: '20 May 2025 • 11:45 AM',
      status: 'open',
      type: 'elevator',
      bgColor: 'bg-blue-100',
      iconColor: '#2563EB'
    },
    {
      id: 'c1253',
      ticketNo: '#CMP-1253',
      title: 'Garbage Not Collected',
      category: 'Housekeeping',
      location: 'B-302 • Tower A',
      dateTime: '18 May 2025 • 07:10 AM',
      status: 'acknowledged',
      type: 'housekeeping',
      bgColor: 'bg-emerald-100',
      iconColor: '#059669'
    },
    {
      id: 'c1252',
      ticketNo: '#CMP-1252',
      title: 'CCTV Not Working',
      category: 'Security',
      location: 'B-302 • Tower A',
      dateTime: '15 May 2025 • 10:20 PM',
      status: 'closed',
      type: 'security',
      bgColor: 'bg-[#FFE5D9]',
      iconColor: '#EA580C'
    }
  ];

  const [complaints, setComplaints] = useState<any[]>(defaultComplaints);

  const fetchComplaints = async () => {
    try {
      const { data } = await apiClient.get('/api/complaints');
      if (data?.success && data?.complaints?.length > 0) {
        const formatted = data.complaints.map((c: any, idx: number) => ({
          id: c.id,
          ticketNo: `#CMP-${1256 - idx}`,
          title: c.title,
          category: c.category || 'General',
          location: 'B-302 • Tower A',
          dateTime: '24 May 2025 • 09:30 AM',
          status: c.status || 'open',
          type: (c.category || 'general').toLowerCase(),
          bgColor: 'bg-blue-100',
          iconColor: '#2563EB'
        }));
        setComplaints(formatted);
      }
    } catch (error) {
      setComplaints(defaultComplaints);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchComplaints();
    setRefreshing(false);
  };

  const handleSubmit = async () => {
    if (!title || !description) return Alert.alert('Required Fields', 'Please enter title and description');
    
    const newComplaint = {
      id: `c-${Date.now()}`,
      ticketNo: `#CMP-${1257 + complaints.length}`,
      title,
      category,
      location: 'B-302 • Tower A',
      dateTime: 'Just now',
      status: 'open',
      type: category.toLowerCase(),
      bgColor: 'bg-[#FFE5D9]',
      iconColor: '#EA580C'
    };

    setComplaints(prev => [newComplaint, ...prev]);
    setShowForm(false);
    setTitle('');
    setDescription('');

    try {
      await apiClient.post('/api/complaints', { title, description, category });
      Alert.alert('Ticket Created 🎉', 'Helpdesk support team has been assigned.');
    } catch (e) {
      Alert.alert('Ticket Logged', 'Helpdesk complaint logged.');
    }
  };

  const openComplaintDetails = (item: any) => {
    router.push({
      pathname: '/(resident)/complaint-details',
      params: {
        id: item.id,
        ticketNo: item.ticketNo || '#CMP-1256',
        title: item.title,
        category: item.category || 'Plumbing',
        subCategory: 'Water Leakage',
        location: item.location || 'B-302, Tower A',
        dateTime: item.dateTime || '24 May 2025, 09:30 AM',
        status: item.status || 'in_progress',
        description: 'There is a water leakage under the kitchen sink for the past 2 days.'
      }
    });
  };

  const filteredList = complaints.filter(c => {
    if (activeTab === 'in_progress' && c.status !== 'in_progress') return false;
    if (activeTab === 'resolved' && c.status !== 'resolved') return false;
    if (activeTab === 'closed' && c.status !== 'closed' && c.status !== 'acknowledged') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return c.title.toLowerCase().includes(q) || c.category.toLowerCase().includes(q) || c.ticketNo.toLowerCase().includes(q);
    }

    return true;
  });

  const getCategoryIcon = (type: string) => {
    if (type.includes('plumb') || type.includes('water')) return <Droplets size={22} color="#D97706" />;
    if (type.includes('electr') || type.includes('light')) return <Zap size={22} color="#7C3AED" />;
    if (type.includes('lift') || type.includes('elevat')) return <ArrowUpCircle size={22} color="#2563EB" />;
    if (type.includes('house') || type.includes('garbag')) return <Trash2 size={22} color="#059669" />;
    if (type.includes('secur') || type.includes('cctv')) return <Camera size={22} color="#EA580C" />;
    return <Wrench size={22} color="#475569" />;
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

        <View className="items-center">
          <Text className="text-gray-900 font-extrabold text-lg">Helpdesk</Text>
          <Text className="text-gray-400 text-xs font-semibold">Your Complaints</Text>
        </View>

        <TouchableOpacity 
          onPress={() => Alert.alert('Support Helpline', 'Dialing Society Maintenance Helpline...')}
          className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100"
        >
          <Headset size={20} color="#1E293B" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1 px-5 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D2FC52" />}
      >
        {/* TOP SEGMENT FILTER PILLS CONTROL */}
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
                12
              </Text>
            </View>
          </TouchableOpacity>

          {/* In Progress */}
          <TouchableOpacity
            onPress={() => setActiveTab('in_progress')}
            className={`px-3 py-2.5 rounded-xl flex-row items-center justify-center ${
              activeTab === 'in_progress' ? 'bg-gray-900 shadow-sm' : 'bg-transparent'
            }`}
          >
            <View className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-1" />
            <Text className={`font-bold text-xs ${activeTab === 'in_progress' ? 'text-white' : 'text-gray-500'}`}>
              In Progress
            </Text>
            <Text className="text-[11px] font-semibold text-gray-400 ml-1">4</Text>
          </TouchableOpacity>

          {/* Resolved */}
          <TouchableOpacity
            onPress={() => setActiveTab('resolved')}
            className={`px-3 py-2.5 rounded-xl flex-row items-center justify-center ${
              activeTab === 'resolved' ? 'bg-gray-900 shadow-sm' : 'bg-transparent'
            }`}
          >
            <View className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1" />
            <Text className={`font-bold text-xs ${activeTab === 'resolved' ? 'text-white' : 'text-gray-500'}`}>
              Resolved
            </Text>
            <Text className="text-[11px] font-semibold text-gray-400 ml-1">6</Text>
          </TouchableOpacity>

          {/* Closed */}
          <TouchableOpacity
            onPress={() => setActiveTab('closed')}
            className={`px-3 py-2.5 rounded-xl flex-row items-center justify-center ${
              activeTab === 'closed' ? 'bg-gray-900 shadow-sm' : 'bg-transparent'
            }`}
          >
            <View className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-1" />
            <Text className={`font-bold text-xs ${activeTab === 'closed' ? 'text-white' : 'text-gray-500'}`}>
              Closed
            </Text>
            <Text className="text-[11px] font-semibold text-gray-400 ml-1">2</Text>
          </TouchableOpacity>
        </View>

        {/* SEARCH BAR & FILTER ROW */}
        <View className="flex-row gap-2.5 mb-5">
          <View className="flex-1 bg-white px-3.5 py-3 rounded-2xl border border-gray-100 flex-row items-center shadow-xs">
            <Search size={16} color="#94A3B8" className="mr-2" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search complaints..."
              placeholderTextColor="#94A3B8"
              className="flex-1 text-gray-900 font-medium text-xs p-0"
            />
          </View>

          <TouchableOpacity 
            onPress={() => Alert.alert('Filter', 'Filter options')}
            className="bg-white px-4 py-3 rounded-2xl border border-gray-100 flex-row items-center shadow-xs"
          >
            <Filter size={15} color="#475569" className="mr-1.5" />
            <Text className="text-gray-800 font-bold text-xs">Filter</Text>
          </TouchableOpacity>
        </View>

        {/* NEW COMPLAINT FORM MODAL BOX */}
        {showForm && (
          <Animated.View entering={FadeInDown.duration(400)} className="bg-white p-5 rounded-3xl mb-5 shadow-sm border border-gray-200">
            <Text className="text-gray-900 font-extrabold text-base mb-3">Raise New Helpdesk Ticket</Text>

            <Text className="text-gray-500 font-semibold text-xs mb-1">Complaint Title</Text>
            <TextInput
              placeholder="e.g., Water Leakage in Kitchen"
              placeholderTextColor="#94A3B8"
              className="bg-gray-50 p-3.5 rounded-2xl mb-3 border border-gray-200 text-gray-900 font-medium text-xs"
              value={title}
              onChangeText={setTitle}
            />

            <Text className="text-gray-500 font-semibold text-xs mb-1">Category</Text>
            <View className="flex-row gap-2 mb-3 flex-wrap">
              {['Plumbing', 'Electrical', 'Elevator', 'Housekeeping', 'Security'].map(cat => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategory(cat)}
                  className={`px-3 py-2 rounded-xl border ${
                    category === cat 
                      ? 'bg-gray-900 border-gray-900' 
                      : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <Text className={`font-bold text-xs ${category === cat ? 'text-white' : 'text-gray-700'}`}>
                    {cat}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text className="text-gray-500 font-semibold text-xs mb-1">Description</Text>
            <TextInput
              placeholder="Provide details for society maintenance..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              className="bg-gray-50 p-3.5 rounded-2xl mb-4 border border-gray-200 text-gray-900 font-medium text-xs"
              value={description}
              onChangeText={setDescription}
            />

            <TouchableOpacity 
              onPress={handleSubmit}
              className="bg-[#D2FC52] py-3.5 rounded-2xl items-center shadow-xs"
            >
              <Text className="text-gray-900 font-extrabold text-sm">Submit Ticket</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* COMPLAINTS CARDS LIST */}
        {filteredList.map((item, idx) => (
          <Animated.View 
            key={item.id} 
            entering={FadeInUp.delay(idx * 80)}
            className="bg-white rounded-3xl p-5 mb-4 shadow-sm border border-gray-100"
          >
            <View className="flex-row justify-between items-start mb-3">
              {/* Category Icon & Main Title */}
              <View className="flex-row items-center flex-1 pr-2">
                <View className={`w-13 h-13 rounded-2xl items-center justify-center mr-3.5 ${item.bgColor}`}>
                  {getCategoryIcon(item.type)}
                </View>

                <View className="flex-1">
                  <Text className="text-gray-900 font-extrabold text-base leading-snug">{item.title}</Text>
                  <Text className="text-gray-400 font-semibold text-xs mt-0.5">{item.category}</Text>

                  <View className="flex-row items-center mt-2">
                    <Building2 size={12} color="#64748B" className="mr-1" />
                    <Text className="text-gray-500 text-[11px] font-semibold">{item.location}</Text>
                  </View>
                  
                  <View className="flex-row items-center mt-1">
                    <Clock size={12} color="#94A3B8" className="mr-1" />
                    <Text className="text-gray-400 text-[10px] font-medium">{item.dateTime}</Text>
                  </View>
                </View>
              </View>

              {/* Status Pill & Ticket ID */}
              <View className="items-end">
                <View className={`px-3 py-1 rounded-full flex-row items-center mb-3 ${
                  item.status === 'in_progress' 
                    ? 'bg-[#FFF5EB]' 
                    : item.status === 'resolved' 
                      ? 'bg-[#F2FBF7]' 
                      : item.status === 'open'
                        ? 'bg-[#FFF2F2]'
                        : item.status === 'acknowledged'
                          ? 'bg-blue-50'
                          : 'bg-gray-100'
                }`}>
                  <Text className={`font-extrabold text-[10px] capitalize ${
                    item.status === 'in_progress' 
                      ? 'text-amber-700' 
                      : item.status === 'resolved' 
                        ? 'text-emerald-700' 
                        : item.status === 'open'
                          ? 'text-rose-600'
                          : item.status === 'acknowledged'
                            ? 'text-blue-600'
                            : 'text-gray-600'
                  }`}>
                    • {item.status === 'in_progress' ? 'In Progress' : item.status}
                  </Text>
                </View>

                <TouchableOpacity 
                  onPress={() => openComplaintDetails(item)}
                  className="flex-row items-center"
                >
                  <Text className="text-gray-400 text-xs font-semibold mr-1">{item.ticketNo}</Text>
                  <ChevronRight size={14} color="#94A3B8" />
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        ))}

        <View className="h-28" />
      </ScrollView>

      {/* FLOATING LIME NEW COMPLAINT BUTTON (OPENS RAISE COMPLAINT SCREEN) */}
      <TouchableOpacity 
        onPress={() => router.push('/(resident)/raise-complaint')}
        className="absolute bottom-24 right-5 w-16 h-16 bg-[#D2FC52] rounded-full items-center justify-center shadow-lg border-2 border-white"
      >
        <Plus size={24} color="#1E293B" />
        <Text className="text-gray-900 font-black text-[9px] mt-0.5">New</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
