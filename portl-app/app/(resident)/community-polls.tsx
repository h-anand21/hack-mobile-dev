import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  ArrowLeft, BarChart3, Search, Filter,
  Calendar, ChevronRight, CheckCircle2, Circle, Clock, Users, Megaphone, Send 
} from 'lucide-react-native';
import { apiClient } from '../../services/api/client';
import { useRouter } from 'expo-router';
import Animated, { FadeInUp, FadeInDown } from 'react-native-reanimated';

export default function CommunityPollsScreen() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'upcoming' | 'closed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [votedOption, setVotedOption] = useState<number>(0); // 0 = Yes I'm in!

  const defaultPolls = [
    {
      id: 'p1',
      title: 'Should we organize a Community Clean-up Drive this month?',
      subtitle: 'Help us keep our society clean and green!',
      status: 'active',
      timeLeft: '2 days left',
      votedCount: 128,
      bgColor: '#D1FAE5',
      iconColor: '#059669',
      options: [
        { id: 0, text: "Yes, I'm In!", percent: 72 },
        { id: 1, text: 'Maybe, depends on the date', percent: 18 },
        { id: 2, text: 'No, not interested', percent: 10 }
      ]
    },
    {
      id: 'p2',
      title: 'Preferred Location for Additional Visitor Parking',
      subtitle: 'Select your preferred zone for guest cars',
      status: 'active',
      timeLeft: '5 days left',
      votedCount: 96,
      bgColor: '#DBEAFE',
      iconColor: '#2563EB'
    },
    {
      id: 'p3',
      title: 'Which Amenity Would You Like to See Next?',
      subtitle: 'Vote for new equipment in society gym or clubhouse',
      status: 'active',
      timeLeft: '1 week left',
      votedCount: 143,
      bgColor: '#EDE9FE',
      iconColor: '#7C3AED'
    },
    {
      id: 'p4',
      title: 'Feedback on Recent Maintenance Services',
      subtitle: 'Starts on 25 May 2025',
      status: 'upcoming',
      timeLeft: 'Starts in 3 days',
      startDate: '25 May 2025',
      votedCount: 0,
      bgColor: '#FEF3C7',
      iconColor: '#D97706'
    },
    {
      id: 'p5',
      title: 'New Security Features – Your Opinion',
      subtitle: 'Poll closed on 15 May 2025',
      status: 'closed',
      timeLeft: 'Closed',
      closeDate: '15 May 2025',
      votedCount: 210,
      bgColor: '#F3F4F6',
      iconColor: '#64748B'
    }
  ];

  const [polls, setPolls] = useState<any[]>(defaultPolls);

  const fetchPolls = async () => {
    try {
      const { data } = await apiClient.get('/api/polls');
      if (data?.success && Array.isArray(data?.polls) && data.polls.length > 0) {
        const normalized = data.polls.map((p: any) => ({
          id: p.id || String(Math.random()),
          title: p.title || p.question || 'Community Poll',
          subtitle: p.description || p.subtitle || '',
          status: p.status || p.is_active ? 'active' : 'closed',
          timeLeft: p.ends_at ? 'Ends soon' : (p.timeLeft || ''),
          votedCount: p.vote_count || p.votedCount || 0,
          bgColor: '#D1FAE5',
          iconColor: '#059669',
          options: Array.isArray(p.options) ? p.options : []
        }));
        setPolls(normalized);
      }
    } catch (e) {
      setPolls(defaultPolls);
    }
  };

  useEffect(() => {
    fetchPolls();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPolls();
    setRefreshing(false);
  };

  const handleVote = (optionIdx: number) => {
    setVotedOption(optionIdx);
    Alert.alert('Vote Recorded 🎉', 'Thank you for building a better community!');
  };

  const filteredPolls = (Array.isArray(polls) ? polls : []).filter(p => {
    if (activeTab === 'active' && p.status !== 'active') return false;
    if (activeTab === 'upcoming' && p.status !== 'upcoming') return false;
    if (activeTab === 'closed' && p.status !== 'closed') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (p.title || '').toLowerCase().includes(q) || ((p.subtitle || '').toLowerCase().includes(q));
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
          <Text className="text-gray-900 font-extrabold text-lg">Community Polls</Text>
          <Text className="text-gray-400 text-xs font-semibold">Your opinion helps build a better community</Text>
        </View>

        <TouchableOpacity 
          onPress={() => Alert.alert('Poll Results', 'Viewing all society survey results')}
          className="w-10 h-10 bg-[#F4FBE4] rounded-full items-center justify-center border border-lime-200"
        >
          <BarChart3 size={18} color="#163316" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1 px-5 pt-4"
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#D2FC52" />}
      >
        {/* TAB FILTER PILLS CONTROL */}
        <View className="bg-white p-1.5 rounded-2xl flex-row justify-between mb-4 shadow-sm border border-gray-100">
          {/* All Polls */}
          <TouchableOpacity
            onPress={() => setActiveTab('all')}
            className={`px-3 py-2.5 rounded-xl flex-row items-center justify-center ${
              activeTab === 'all' ? 'bg-[#F4FBE4] border border-[#D2FC52]' : 'bg-transparent'
            }`}
          >
            <Text className={`font-bold text-xs ${activeTab === 'all' ? 'text-[#163316]' : 'text-gray-500'}`}>
              All Polls
            </Text>
            <View className={`ml-1.5 px-1.5 py-0.5 rounded-full ${activeTab === 'all' ? 'bg-[#163316]' : 'bg-gray-100'}`}>
              <Text className={`text-[10px] font-black ${activeTab === 'all' ? 'text-white' : 'text-gray-600'}`}>
                5
              </Text>
            </View>
          </TouchableOpacity>

          {/* Active */}
          <TouchableOpacity
            onPress={() => setActiveTab('active')}
            className={`px-3 py-2.5 rounded-xl flex-row items-center justify-center ${
              activeTab === 'active' ? 'bg-[#F4FBE4] border border-[#D2FC52]' : 'bg-transparent'
            }`}
          >
            <Text className={`font-bold text-xs ${activeTab === 'active' ? 'text-[#163316]' : 'text-gray-500'}`}>
              Active
            </Text>
            <Text className="text-[11px] font-semibold text-gray-400 ml-1">3</Text>
          </TouchableOpacity>

          {/* Upcoming */}
          <TouchableOpacity
            onPress={() => setActiveTab('upcoming')}
            className={`px-3 py-2.5 rounded-xl flex-row items-center justify-center ${
              activeTab === 'upcoming' ? 'bg-[#F4FBE4] border border-[#D2FC52]' : 'bg-transparent'
            }`}
          >
            <Text className={`font-bold text-xs ${activeTab === 'upcoming' ? 'text-[#163316]' : 'text-gray-500'}`}>
              Upcoming
            </Text>
            <Text className="text-[11px] font-semibold text-gray-400 ml-1">1</Text>
          </TouchableOpacity>

          {/* Closed */}
          <TouchableOpacity
            onPress={() => setActiveTab('closed')}
            className={`px-3 py-2.5 rounded-xl flex-row items-center justify-center ${
              activeTab === 'closed' ? 'bg-[#F4FBE4] border border-[#D2FC52]' : 'bg-transparent'
            }`}
          >
            <Text className={`font-bold text-xs ${activeTab === 'closed' ? 'text-[#163316]' : 'text-gray-500'}`}>
              Closed
            </Text>
            <Text className="text-[11px] font-semibold text-gray-400 ml-1">1</Text>
          </TouchableOpacity>
        </View>

        {/* SEARCH & FILTER ROW */}
        <View className="flex-row gap-2.5 mb-5">
          <View className="flex-1 bg-white px-3.5 py-3 rounded-2xl border border-gray-100 flex-row items-center shadow-xs">
            <Search size={16} color="#94A3B8" className="mr-2" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search polls..."
              placeholderTextColor="#94A3B8"
              className="flex-1 text-gray-900 font-medium text-xs p-0"
            />
          </View>

          <TouchableOpacity 
            onPress={() => Alert.alert('Filter', 'Filter polls')}
            className="bg-white px-4 py-3 rounded-2xl border border-gray-100 flex-row items-center shadow-xs"
          >
            <Filter size={15} color="#475569" className="mr-1.5" />
            <Text className="text-gray-800 font-bold text-xs">Filter</Text>
          </TouchableOpacity>
        </View>

        {/* ACTIVE HERO FEATURED POLL CARD */}
        {(activeTab === 'all' || activeTab === 'active') && (
          <Animated.View entering={FadeInDown.duration(400)} className="bg-[#F4FBE4] p-5 rounded-3xl mb-5 border border-lime-100 shadow-sm">
            <View className="flex-row justify-between items-start mb-3">
              <View className="w-14 h-14 bg-white/80 rounded-2xl items-center justify-center mr-3 border border-lime-200">
                <Trees size={26} color="#163316" />
              </View>

              <View className="flex-1">
                <View className="flex-row justify-between items-center mb-1">
                  <View className="bg-[#E2F8EE] px-2.5 py-0.5 rounded-full">
                    <Text className="text-emerald-700 font-extrabold text-[10px]">Active •</Text>
                  </View>
                  <View className="flex-row items-center">
                    <Clock size={12} color="#64748B" className="mr-1" />
                    <Text className="text-gray-500 text-[11px] font-semibold">2 days left</Text>
                  </View>
                </View>

                <Text className="text-gray-900 font-black text-base leading-snug">
                  Should we organize a Community Clean-up Drive this month?
                </Text>
                <Text className="text-gray-600 text-xs font-medium mt-1">
                  Help us keep our society clean and green!
                </Text>

                <View className="flex-row items-center mt-2">
                  <Users size={13} color="#475569" className="mr-1.5" />
                  <Text className="text-gray-700 text-xs font-bold">128 residents voted</Text>
                </View>
              </View>
            </View>

            {/* VOTING OPTIONS LIST */}
            <View className="space-y-2.5 my-3">
              {defaultPolls[0].options?.map((opt) => {
                const isSelected = votedOption === opt.id;

                return (
                  <TouchableOpacity
                    key={opt.id}
                    onPress={() => handleVote(opt.id)}
                    className={`p-3.5 rounded-2xl border flex-row items-center justify-between relative overflow-hidden ${
                      isSelected ? 'bg-white border-[#163316] shadow-xs' : 'bg-white/90 border-gray-200'
                    }`}
                  >
                    {/* Background Progress Fill */}
                    <View 
                      style={{ width: `${opt.percent}%` }} 
                      className={`absolute top-0 bottom-0 left-0 ${isSelected ? 'bg-[#E2F8EE]' : 'bg-gray-100'}`} 
                    />

                    <View className="flex-row items-center z-10 flex-1 pr-2">
                      {isSelected ? (
                        <CheckCircle2 size={18} color="#163316" className="mr-2.5" />
                      ) : (
                        <Circle size={18} color="#94A3B8" className="mr-2.5" />
                      )}
                      <Text className={`font-extrabold text-xs flex-1 ${isSelected ? 'text-[#163316]' : 'text-gray-800'}`}>
                        {opt.text}
                      </Text>
                    </View>

                    <Text className={`font-black text-xs z-10 ${isSelected ? 'text-[#163316]' : 'text-gray-600'}`}>
                      {opt.percent}%
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            <TouchableOpacity 
              onPress={() => Alert.alert('Poll Details', 'Voting recorded! View breakdown of 128 resident responses.')}
              className="bg-[#163316] py-3.5 rounded-2xl items-center shadow-xs mt-2"
            >
              <Text className="text-white font-extrabold text-xs">View Details & Vote</Text>
            </TouchableOpacity>
          </Animated.View>
        )}

        {/* LIST OF OTHER POLLS */}
        {filteredPolls.slice(1).map((item, idx) => {
          const bgColor = item.bgColor || '#F3F4F6';
          const iconColor = item.iconColor || '#475569';

          return (
            <Animated.View key={item.id || idx} entering={FadeInUp.delay(idx * 80)}>
              <TouchableOpacity
                onPress={() => Alert.alert(item.title, `Status: ${item.status || ''}\n${item.subtitle || ''}`)}
                className="bg-white rounded-3xl p-4 mb-3 shadow-sm border border-gray-100 flex-row items-start justify-between"
              >
                <View className="flex-row items-start flex-1 pr-2">
                  <View
                    style={{ backgroundColor: bgColor, width: 48, height: 48, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginRight: 14 }}
                  >
                    <BarChart3 size={22} color={iconColor} />
                  </View>

                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                      <View className={`px-2 py-0.5 rounded-full ${
                        item.status === 'active' 
                          ? 'bg-blue-50' 
                          : item.status === 'upcoming' 
                            ? 'bg-amber-50' 
                            : 'bg-gray-100'
                      }`}>
                        <Text className={`font-bold text-[10px] capitalize ${
                          item.status === 'active' 
                            ? 'text-blue-700' 
                            : item.status === 'upcoming' 
                              ? 'text-amber-700' 
                              : 'text-gray-600'
                        }`}>
                          {item.status}
                        </Text>
                      </View>
                    </View>

                    <Text className="text-gray-900 font-extrabold text-sm leading-snug">{item.title}</Text>

                    <View className="flex-row items-center mt-2">
                      <Users size={12} color="#64748B" />
                      <Text className="text-gray-500 text-[11px] font-semibold ml-1.5">
                        {item.votedCount > 0 ? `${item.votedCount} residents voted` : (item.subtitle || '')}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Right Side: Time & Arrow */}
                <View className="items-end">
                  <View className="flex-row items-center mb-1">
                    <Clock size={11} color="#94A3B8" />
                    <Text className="text-gray-400 text-[10px] font-medium ml-1">{item.timeLeft || ''}</Text>
                  </View>
                  {item.status === 'closed' ? (
                    <TouchableOpacity 
                      onPress={() => Alert.alert('Results', 'Viewing closed poll results')}
                      className="mt-2 flex-row items-center"
                    >
                      <Text className="text-emerald-700 font-bold text-xs mr-1">View Results</Text>
                      <ChevronRight size={14} color="#047857" />
                    </TouchableOpacity>
                  ) : (
                    <ChevronRight size={14} color="#94A3B8" />
                  )}
                </View>
              </TouchableOpacity>
            </Animated.View>
          );
        })}

        {/* HAVE A SUGGESTION BANNER CARD */}
        <Animated.View entering={FadeInUp.delay(600)} className="bg-[#F4FBE4] p-4 rounded-2xl mt-2 mb-8 border border-lime-100 flex-row items-center justify-between">
          <View className="flex-row items-center flex-1 mr-2">
            <Megaphone size={16} color="#475569" className="mr-2" />
            <Text className="text-gray-700 text-xs font-semibold flex-1">
              <Text className="font-extrabold">Have a suggestion for a poll?</Text> Let the management know what you'd like us to ask.
            </Text>
          </View>

          <TouchableOpacity 
            onPress={() => Alert.alert('Submit Suggestion', 'Type your poll idea for management review')}
            className="bg-white px-3 py-1.5 rounded-full flex-row items-center border border-lime-200 shadow-xs"
          >
            <Send size={12} color="#1E293B" className="mr-1" />
            <Text className="text-gray-900 font-extrabold text-xs">Submit Suggestion</Text>
          </TouchableOpacity>
        </Animated.View>

        <View className="h-24" />
      </ScrollView>
    </SafeAreaView>
  );
}
