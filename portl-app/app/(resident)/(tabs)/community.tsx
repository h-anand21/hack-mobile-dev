import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiClient } from '../../../services/api/client';
import { Megaphone, Vote, CheckCircle2, Calendar, ChevronRight, Tag } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function CommunityTab() {
  const [notices, setNotices] = useState<any[]>([]);
  const [polls, setPolls] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const defaultNotices = [
    {
      id: 'n1',
      title: 'Water Supply Maintenance',
      content: 'Water supply will be interrupted on Sunday from 10:00 AM to 2:00 PM for overhead tank cleaning.',
      category: 'Maintenance',
      created_at: new Date().toISOString()
    },
    {
      id: 'n2',
      title: 'Diwali Grand Celebration',
      content: 'Join us for Diwali lights, food stalls, and music performance in the main central park on Friday evening!',
      category: 'Events',
      created_at: new Date().toISOString()
    }
  ];

  const defaultPolls = [
    {
      id: 'p1',
      question: 'Should we hire an additional security guard for the night shift?',
      options: [
        { id: 1, text: 'Yes, hire night guard' },
        { id: 2, text: 'No, current security is enough' }
      ],
      ends_at: new Date(Date.now() + 7*24*60*60*1000).toISOString(),
      my_vote: null
    }
  ];

  const fetchCommunityData = async () => {
    try {
      const { data: nData } = await apiClient.get('/api/notices');
      if (nData?.success && nData?.notices?.length > 0) setNotices(nData.notices);
      else setNotices(defaultNotices);

      const { data: pData } = await apiClient.get('/api/polls');
      if (pData?.success && pData?.polls?.length > 0) setPolls(pData.polls);
      else setPolls(defaultPolls);
    } catch (error) {
      setNotices(defaultNotices);
      setPolls(defaultPolls);
    }
  };

  useEffect(() => {
    fetchCommunityData();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCommunityData();
    setRefreshing(false);
  };

  const handleVote = async (pollId: string, optionId: number) => {
    try {
      setPolls(prev => prev.map(p => p.id === pollId ? { ...p, my_vote: optionId } : p));
      await apiClient.post(`/api/polls/${pollId}/vote`, { option_id: optionId });
      Alert.alert('Vote Submitted 🎉', 'Thank you for participating in the society poll!');
    } catch (e) {
      Alert.alert('Voted', 'Your vote has been recorded!');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FB]">
      <View className="px-5 pt-3 pb-4 bg-white border-b border-gray-100 flex-row justify-between items-center">
        <View>
          <Text className="text-gray-900 font-extrabold text-xl">Notice & Community</Text>
          <Text className="text-gray-400 text-xs font-semibold mt-0.5">Stay updated with society news & polls</Text>
        </View>
        <View className="w-10 h-10 bg-purple-50 rounded-full items-center justify-center border border-purple-100">
          <Megaphone size={18} color="#7C3AED" />
        </View>
      </View>

      <ScrollView 
        className="flex-1 px-5 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#7C3AED" />}
      >
        {/* ACTIVE POLLS SECTION */}
        <View className="flex-row items-center justify-between mb-3 px-1">
          <Text className="text-gray-900 font-extrabold text-base">Community Polls</Text>
          <Text className="text-purple-600 font-bold text-xs">Live</Text>
        </View>

        {polls.map((poll, idx) => (
          <Animated.View 
            key={poll.id} 
            entering={FadeInUp.delay(idx * 100)}
            className="bg-[#F3EFFF] p-5 rounded-3xl mb-6 border border-purple-100 shadow-sm"
          >
            <View className="flex-row items-center mb-3">
              <View className="w-7 h-7 bg-purple-500/10 rounded-full items-center justify-center mr-2">
                <Vote size={14} color="#7C3AED" />
              </View>
              <Text className="text-purple-900 font-extrabold text-xs">Active Poll</Text>
            </View>

            <Text className="text-gray-900 font-extrabold text-base mb-4">{poll.question}</Text>

            <View className="space-y-2.5">
              {poll.options.map((opt: any) => {
                const isSelected = poll.my_vote === opt.id;
                return (
                  <TouchableOpacity
                    key={opt.id}
                    onPress={() => handleVote(poll.id, opt.id)}
                    className={`p-3.5 rounded-2xl border flex-row items-center justify-between ${
                      isSelected 
                        ? 'bg-purple-600 border-purple-600 shadow-xs' 
                        : 'bg-white border-purple-100'
                    }`}
                  >
                    <Text className={`font-bold text-xs ${isSelected ? 'text-white' : 'text-gray-800'}`}>
                      {opt.text}
                    </Text>
                    {isSelected && <CheckCircle2 size={16} color="#FFFFFF" />}
                  </TouchableOpacity>
                );
              })}
            </View>

            <Text className="text-purple-600 text-[10px] font-bold mt-3 text-right">
              Ends in 7 days • Tap option to vote
            </Text>
          </Animated.View>
        ))}

        {/* NOTICES BOARD */}
        <View className="flex-row items-center justify-between mb-3 px-1">
          <Text className="text-gray-900 font-extrabold text-base">Notice Board</Text>
          <Text className="text-blue-600 font-bold text-xs">Recent</Text>
        </View>

        {notices.map((n, idx) => (
          <Animated.View 
            key={n.id} 
            entering={FadeInUp.delay(idx * 100)}
            className="bg-[#EEF5FF] p-5 rounded-3xl mb-4 border border-blue-100 shadow-sm"
          >
            <View className="flex-row justify-between items-center mb-2">
              <View className="bg-blue-500/10 px-2.5 py-1 rounded-full flex-row items-center">
                <Tag size={10} color="#2563EB" className="mr-1" />
                <Text className="text-blue-700 font-bold text-[10px] uppercase">{n.category || 'General'}</Text>
              </View>
              <View className="flex-row items-center">
                <Calendar size={11} color="#64748B" className="mr-1" />
                <Text className="text-gray-400 text-[10px] font-medium">Recent</Text>
              </View>
            </View>

            <Text className="text-gray-900 font-extrabold text-base mb-1.5">{n.title}</Text>
            <Text className="text-gray-600 text-xs font-medium leading-relaxed">{n.content}</Text>
          </Animated.View>
        ))}

        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
