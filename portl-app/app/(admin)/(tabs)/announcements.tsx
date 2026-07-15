import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiClient } from '../../../services/api/client';
import { Megaphone, Vote, Plus } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function AdminAnnouncements() {
  const [activeTab, setActiveTab] = useState<'notice' | 'poll'>('notice');
  const [loading, setLoading] = useState(false);

  // Notice State
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('general');

  // Poll State
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);

  const handlePostNotice = async () => {
    if (!title || !content) return Alert.alert('Error', 'Please fill title and content');
    setLoading(true);
    try {
      const { data } = await apiClient.post('/api/admin/notices', { title, content, category });
      if (data.success) {
        Alert.alert('Success', 'Notice broadcasted to all residents!');
        setTitle('');
        setContent('');
      }
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.error || 'Failed to post notice');
    } finally {
      setLoading(false);
    }
  };

  const handlePostPoll = async () => {
    if (!question || options.some(o => !o.trim())) return Alert.alert('Error', 'Please fill question and all options');
    setLoading(true);
    try {
      // Set end date to 7 days from now
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + 7);
      
      const { data } = await apiClient.post('/api/admin/polls', { 
        question, 
        options: options.filter(o => o.trim()),
        end_date: endDate.toISOString()
      });
      if (data.success) {
        Alert.alert('Success', 'Poll broadcasted to all residents!');
        setQuestion('');
        setOptions(['', '']);
      }
    } catch (e: any) {
      Alert.alert('Error', e.response?.data?.error || 'Failed to post poll');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <View className="px-6 py-4 border-b border-white/10">
        <Text className="text-2xl font-bold text-white">Broadcast Center</Text>
      </View>

      <View className="flex-row p-4 space-x-4">
        <TouchableOpacity 
          onPress={() => setActiveTab('notice')}
          className={`flex-1 py-3 rounded-full items-center flex-row justify-center ${activeTab === 'notice' ? 'bg-accent' : 'bg-white/10'}`}
        >
          <Megaphone size={18} color={activeTab === 'notice' ? '#171717' : '#fff'} className="mr-2" />
          <Text className={`font-bold ${activeTab === 'notice' ? 'text-dark' : 'text-white'}`}>Notice</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => setActiveTab('poll')}
          className={`flex-1 py-3 rounded-full items-center flex-row justify-center ${activeTab === 'poll' ? 'bg-accent' : 'bg-white/10'}`}
        >
          <Vote size={18} color={activeTab === 'poll' ? '#171717' : '#fff'} className="mr-2" />
          <Text className={`font-bold ${activeTab === 'poll' ? 'text-dark' : 'text-white'}`}>Poll</Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-4 pt-4">
        {activeTab === 'notice' ? (
          <Animated.View entering={FadeInDown} className="bg-white/5 p-6 rounded-3xl mb-6 border border-white/10">
            <Text className="text-white font-bold text-lg mb-4">Create Notice</Text>
            
            <TextInput 
              placeholder="Notice Title" 
              placeholderTextColor="#666" 
              className="bg-dark text-white p-4 rounded-xl mb-4"
              value={title}
              onChangeText={setTitle}
            />
            
            <TextInput 
              placeholder="Full announcement content..." 
              placeholderTextColor="#666" 
              className="bg-dark text-white p-4 rounded-xl mb-4 h-32"
              multiline
              textAlignVertical="top"
              value={content}
              onChangeText={setContent}
            />

            <View className="flex-row flex-wrap mb-6 space-x-2">
              {['general', 'event', 'maintenance', 'urgent'].map(c => (
                <TouchableOpacity 
                  key={c}
                  onPress={() => setCategory(c)}
                  className={`px-4 py-2 rounded-full border mb-2 ${category === c ? 'bg-accent/20 border-accent' : 'bg-transparent border-white/20'}`}
                >
                  <Text className={`capitalize ${category === c ? 'text-accent' : 'text-white'}`}>{c}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity 
              onPress={handlePostNotice} 
              disabled={loading}
              className="bg-accent py-4 rounded-xl items-center shadow-card"
            >
              <Text className="text-dark font-bold text-lg">{loading ? 'Publishing...' : 'Publish Notice'}</Text>
            </TouchableOpacity>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeInDown} className="bg-white/5 p-6 rounded-3xl mb-6 border border-white/10">
            <Text className="text-white font-bold text-lg mb-4">Create Poll</Text>
            
            <TextInput 
              placeholder="What do you want to ask?" 
              placeholderTextColor="#666" 
              className="bg-dark text-white p-4 rounded-xl mb-6"
              value={question}
              onChangeText={setQuestion}
            />
            
            <Text className="text-white font-bold mb-3">Options</Text>
            {options.map((opt, idx) => (
              <TextInput 
                key={idx}
                placeholder={`Option ${idx + 1}`} 
                placeholderTextColor="#666" 
                className="bg-dark text-white p-4 rounded-xl mb-3"
                value={opt}
                onChangeText={(text) => {
                  const newOpts = [...options];
                  newOpts[idx] = text;
                  setOptions(newOpts);
                }}
              />
            ))}
            
            <TouchableOpacity 
              onPress={() => setOptions([...options, ''])}
              className="bg-white/10 py-3 rounded-xl items-center flex-row justify-center mb-6 border border-white/20"
            >
              <Plus size={16} color="#fff" className="mr-2" />
              <Text className="text-white font-bold">Add Option</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={handlePostPoll} 
              disabled={loading}
              className="bg-accent py-4 rounded-xl items-center shadow-card"
            >
              <Text className="text-dark font-bold text-lg">{loading ? 'Publishing...' : 'Publish Poll'}</Text>
            </TouchableOpacity>
          </Animated.View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
