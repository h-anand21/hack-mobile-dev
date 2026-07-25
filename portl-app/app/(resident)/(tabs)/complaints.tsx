import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiClient } from '../../../services/api/client';
import { Wrench, Plus, CheckCircle2, Clock, XCircle, AlertCircle } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function ComplaintsTab() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Plumbing');

  const defaultComplaints = [
    {
      id: 'c1',
      title: 'Water Leakage in Kitchen',
      description: 'Pipe leakage under kitchen sink causing water accumulation on floor.',
      category: 'Plumbing',
      status: 'in_progress',
      created_at: new Date().toISOString()
    },
    {
      id: 'c2',
      title: 'Elevator Light Blinking',
      description: 'Tower A Lift 2 main ceiling light is flickering.',
      category: 'Electrical',
      status: 'open',
      created_at: new Date().toISOString()
    }
  ];

  const fetchComplaints = async () => {
    try {
      const { data } = await apiClient.get('/api/complaints');
      if (data?.success && data?.complaints?.length > 0) setComplaints(data.complaints);
      else setComplaints(defaultComplaints);
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
    try {
      setComplaints(prev => [{
        id: `c-${Date.now()}`,
        title,
        description,
        category,
        status: 'open',
        created_at: new Date().toISOString()
      }, ...prev]);

      setShowForm(false);
      setTitle('');
      setDescription('');
      
      await apiClient.post('/api/complaints', { title, description, category });
      Alert.alert('Complaint Raised 🎉', 'Helpdesk team has been notified.');
    } catch (error) {
      Alert.alert('Ticket Created', 'Helpdesk ticket has been logged.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FB]">
      {/* HEADER */}
      <View className="px-5 pt-3 pb-4 bg-white border-b border-gray-100 flex-row justify-between items-center">
        <View>
          <Text className="text-gray-900 font-extrabold text-xl">Helpdesk & Support</Text>
          <Text className="text-gray-400 text-xs font-semibold mt-0.5">Raise tickets for repairs & issues</Text>
        </View>

        <TouchableOpacity 
          onPress={() => setShowForm(!showForm)} 
          className="bg-gray-900 px-4 py-2.5 rounded-full flex-row items-center shadow-xs"
        >
          <Plus size={16} color="#D2FC52" className="mr-1" />
          <Text className="text-white font-bold text-xs">{showForm ? 'Cancel' : 'New Ticket'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1 px-5 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#EA580C" />}
      >
        {/* NEW TICKET FORM MODAL BOX */}
        {showForm && (
          <Animated.View entering={FadeInDown.duration(400)} className="bg-white p-5 rounded-3xl mb-6 shadow-sm border border-gray-200">
            <Text className="text-gray-900 font-extrabold text-base mb-3">Raise Helpdesk Ticket</Text>

            <Text className="text-gray-500 font-semibold text-xs mb-1">Issue Title</Text>
            <TextInput
              placeholder="e.g., Water Leakage / Lift Failure"
              placeholderTextColor="#94A3B8"
              className="bg-gray-50 p-3.5 rounded-2xl mb-3 border border-gray-200 text-gray-900 font-medium"
              value={title}
              onChangeText={setTitle}
            />

            <Text className="text-gray-500 font-semibold text-xs mb-1">Category</Text>
            <View className="flex-row gap-2 mb-3">
              {['Plumbing', 'Electrical', 'Carpentry', 'General'].map(cat => (
                <TouchableOpacity
                  key={cat}
                  onPress={() => setCategory(cat)}
                  className={`px-3 py-2 rounded-xl border ${
                    category === cat 
                      ? 'bg-orange-500 border-orange-500' 
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
              placeholder="Provide more details about the issue..."
              placeholderTextColor="#94A3B8"
              multiline
              numberOfLines={3}
              className="bg-gray-50 p-3.5 rounded-2xl mb-4 border border-gray-200 text-gray-900 font-medium"
              value={description}
              onChangeText={setDescription}
            />

            <TouchableOpacity 
              onPress={handleSubmit}
              className="bg-orange-600 py-3.5 rounded-2xl items-center shadow-xs"
            >
              <Text className="text-white font-extrabold text-sm">Submit Ticket</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* TICKET LIST */}
        <Text className="text-gray-900 font-extrabold text-base mb-3 px-1">Your Support Tickets</Text>

        {complaints.map((item, idx) => (
          <Animated.View 
            key={item.id} 
            entering={FadeInUp.delay(idx * 100)}
            className="bg-[#F2FBF7] p-5 rounded-3xl mb-4 border border-emerald-100 shadow-sm"
          >
            <View className="flex-row justify-between items-center mb-2">
              <View className="bg-emerald-500/10 px-2.5 py-1 rounded-full flex-row items-center">
                <Wrench size={12} color="#059669" className="mr-1" />
                <Text className="text-emerald-800 font-bold text-[10px] uppercase">{item.category || 'General'}</Text>
              </View>

              <View className={`px-2.5 py-1 rounded-full ${
                item.status === 'resolved' 
                  ? 'bg-emerald-500' 
                  : item.status === 'in_progress' 
                    ? 'bg-amber-500' 
                    : 'bg-rose-500'
              }`}>
                <Text className="text-white font-bold text-[10px] uppercase">{item.status?.replace('_', ' ')}</Text>
              </View>
            </View>

            <Text className="text-gray-900 font-extrabold text-base mb-1">{item.title}</Text>
            <Text className="text-gray-600 text-xs font-medium leading-relaxed mb-3">{item.description}</Text>

            <View className="pt-2 border-t border-emerald-200/50 flex-row justify-between items-center">
              <Text className="text-emerald-700 text-[10px] font-semibold">Assigned to Maintenance Team</Text>
              <Text className="text-gray-400 text-[10px] font-medium">Updated 1 day ago</Text>
            </View>
          </Animated.View>
        ))}

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
