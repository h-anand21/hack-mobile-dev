import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiClient } from '../../../services/api/client';
import { MessageSquareWarning, Plus, CheckCircle2, Clock } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export default function ComplaintsTab() {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('plumbing');

  const fetchComplaints = async () => {
    try {
      const { data } = await apiClient.get('/api/complaints');
      if (data.success) setComplaints(data.complaints);
    } catch (error) {
      console.error(error);
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
    if (!title || !description) return Alert.alert('Error', 'Please fill all fields');
    try {
      const { data } = await apiClient.post('/api/complaints', { title, description, category, priority: 'medium' });
      if (data.success) {
        Alert.alert('Success', 'Complaint raised successfully');
        setShowForm(false);
        setTitle('');
        setDescription('');
        fetchComplaints();
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to raise complaint');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <View className="px-6 py-4 border-b border-white/10 flex-row justify-between items-center">
        <Text className="text-2xl font-bold text-white">Helpdesk</Text>
        <TouchableOpacity onPress={() => setShowForm(!showForm)} className="bg-accent/20 p-2 rounded-full">
          {showForm ? <Text className="text-accent font-bold px-2">Cancel</Text> : <Plus size={20} color="#E7FF45" />}
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1 px-4 pt-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E7FF45" />}
      >
        {showForm && (
          <Animated.View entering={FadeInDown} className="bg-white/5 p-6 rounded-3xl mb-6 border border-white/10">
            <Text className="text-white font-bold text-lg mb-4">Raise a Complaint</Text>
            
            <TextInput 
              placeholder="Short Title" 
              placeholderTextColor="#666" 
              className="bg-dark text-white p-4 rounded-xl mb-4"
              value={title}
              onChangeText={setTitle}
            />
            
            <TextInput 
              placeholder="Describe the issue in detail" 
              placeholderTextColor="#666" 
              className="bg-dark text-white p-4 rounded-xl mb-4 h-24"
              multiline
              textAlignVertical="top"
              value={description}
              onChangeText={setDescription}
            />

            <View className="flex-row flex-wrap mb-4 space-x-2">
              {['plumbing', 'electrical', 'security', 'general'].map(c => (
                <TouchableOpacity 
                  key={c}
                  onPress={() => setCategory(c)}
                  className={`px-4 py-2 rounded-full border mb-2 ${category === c ? 'bg-accent/20 border-accent' : 'bg-transparent border-white/20'}`}
                >
                  <Text className={`capitalize ${category === c ? 'text-accent' : 'text-white'}`}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity onPress={handleSubmit} className="bg-accent py-4 rounded-xl items-center shadow-card">
              <Text className="text-dark font-bold">Submit Ticket</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        <Text className="text-white font-bold text-lg mb-4 px-2">My Tickets</Text>
        {complaints.length === 0 ? (
          <View className="items-center mt-10">
            <MessageSquareWarning size={40} color="#666" className="mb-4" />
            <Text className="text-textSecondary">No complaints raised yet</Text>
          </View>
        ) : (
          complaints.map((c, idx) => (
            <Animated.View key={c.id} entering={FadeInUp.delay(idx * 100)} className="bg-white/5 p-4 rounded-2xl mb-3 border border-white/5 flex-row justify-between">
              <View className="flex-1 mr-4">
                <Text className="text-white font-bold text-base mb-1">{c.title}</Text>
                <Text className="text-textSecondary text-sm" numberOfLines={2}>{c.description}</Text>
                <View className="flex-row items-center mt-3">
                  <Text className="text-xs text-textSecondary uppercase bg-white/10 px-2 py-1 rounded">{c.category}</Text>
                </View>
              </View>
              <View className="items-end">
                {c.status === 'resolved' ? (
                  <CheckCircle2 color="#22c55e" size={24} />
                ) : (
                  <Clock color="#f59e0b" size={24} />
                )}
                <Text className={`text-xs mt-1 capitalize ${c.status === 'resolved' ? 'text-green-500' : 'text-amber-500'}`}>{c.status}</Text>
              </View>
            </Animated.View>
          ))
        )}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
