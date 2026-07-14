import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { apiClient } from '../../../services/api/client';
import { Megaphone, Vote, CheckCircle2 } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function CommunityTab() {
  const [notices, setNotices] = useState<any[]>([]);
  const [polls, setPolls] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCommunityData = async () => {
    try {
      const { data: nData } = await apiClient.get('/api/notices');
      if (nData.success) setNotices(nData.notices);

      const { data: pData } = await apiClient.get('/api/polls');
      if (pData.success) setPolls(pData.polls);
    } catch (error) {
      console.error(error);
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

  const handleVote = async (pollId: string, index: number) => {
    try {
      await apiClient.post(`/api/polls/${pollId}/vote`, { option_index: index });
      fetchCommunityData();
    } catch (e) {
      // ignore or alert
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <View className="px-6 py-4 border-b border-white/10">
        <Text className="text-2xl font-bold text-white">Community</Text>
      </View>

      <ScrollView 
        className="flex-1 px-4 pt-4"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#E7FF45" />}
      >
        <Text className="text-white font-bold text-lg mb-4 px-2">Notice Board</Text>
        {notices.length === 0 ? (
          <Text className="text-textSecondary text-center my-4">No active notices</Text>
        ) : (
          notices.map((n, idx) => (
            <Animated.View key={n.id} entering={FadeInUp.delay(idx * 100)} className="bg-white/5 p-4 rounded-2xl mb-4 border border-white/5">
              <View className="flex-row items-center mb-2">
                <Megaphone size={16} color="#3b82f6" />
                <Text className="text-blue-400 font-bold ml-2 text-xs uppercase tracking-wider">{n.category}</Text>
              </View>
              <Text className="text-white font-bold text-lg mb-2">{n.title}</Text>
              <Text className="text-white/80 leading-5">{n.content}</Text>
              <Text className="text-textSecondary text-xs mt-3">{new Date(n.created_at).toLocaleDateString()}</Text>
            </Animated.View>
          ))
        )}

        <Text className="text-white font-bold text-lg mt-6 mb-4 px-2">Active Polls</Text>
        {polls.length === 0 ? (
          <Text className="text-textSecondary text-center my-4">No active polls</Text>
        ) : (
          polls.map((p, idx) => {
            const totalVotes = p.options.reduce((acc: number, opt: any) => acc + (opt.votes || 0), 0) || 1; // avoid /0
            return (
              <Animated.View key={p.id} entering={FadeInUp.delay((notices.length + idx) * 100)} className="bg-white/5 p-5 rounded-3xl mb-4 border border-white/5">
                <View className="flex-row items-center mb-4">
                  <Vote size={20} color="#E7FF45" />
                  <Text className="text-white font-bold text-lg ml-3 flex-1">{p.question}</Text>
                </View>
                
                {p.options.map((opt: any, oIdx: number) => {
                  const hasVotedThis = p.my_vote === oIdx;
                  const percent = p.my_vote !== null ? Math.round(((opt.votes || 0) / totalVotes) * 100) : 0;
                  
                  return (
                    <TouchableOpacity 
                      key={oIdx}
                      disabled={p.my_vote !== null}
                      onPress={() => handleVote(p.id, oIdx)}
                      className={`mb-3 p-4 rounded-xl border relative overflow-hidden ${hasVotedThis ? 'border-accent' : 'border-white/10'}`}
                    >
                      {p.my_vote !== null && (
                        <View style={{ width: `${percent}%` }} className="absolute left-0 top-0 bottom-0 bg-accent/20" />
                      )}
                      <View className="flex-row justify-between items-center relative z-10">
                        <View className="flex-row items-center">
                          {hasVotedThis && <CheckCircle2 size={16} color="#E7FF45" className="mr-2" />}
                          <Text className={`font-medium ${hasVotedThis ? 'text-accent' : 'text-white'}`}>{opt.text}</Text>
                        </View>
                        {p.my_vote !== null && (
                          <Text className="text-white/60 font-bold">{percent}%</Text>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </Animated.View>
            );
          })
        )}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}
