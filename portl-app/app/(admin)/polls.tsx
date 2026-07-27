import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, RefreshControl, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, Plus, Search, Filter, BarChart3, Send, Calendar, 
  CheckCircle2, Archive, PartyPopper, Car, Building, ShieldCheck, 
  Dog, Users, MoreVertical, ChevronLeft, ChevronRight 
} from 'lucide-react-native';

export type PollFilterType = 'all' | 'active' | 'scheduled' | 'completed' | 'archived';

export interface PollRecord {
  id: string;
  title: string;
  category: string;
  audience: string;
  createdDate: string;
  status: 'Active' | 'Scheduled' | 'Completed' | 'Archived';
  endsIn?: string;
  startsOn?: string;
  endedOn?: string;
  totalVotes?: number;
  iconType: 'party' | 'car' | 'building' | 'security' | 'pet';
  iconBg: string;
  iconColor: string;
}

export default function PollManagementScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<PollFilterType>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const [polls, setPolls] = useState<PollRecord[]>([
    {
      id: 'p1',
      title: 'Should we organize a Diwali Event this year?',
      category: 'Community Event',
      audience: 'All Residents',
      createdDate: 'Created: 20 May 2024, 10:30 AM',
      status: 'Active',
      endsIn: 'Ends in 5 days',
      totalVotes: 156,
      iconType: 'party',
      iconBg: '#E0F2FE',
      iconColor: '#0284C7'
    },
    {
      id: 'p2',
      title: 'Preferred Parking System',
      category: 'Parking & Transport',
      audience: 'Tower A, Tower B',
      createdDate: 'Created: 18 May 2024, 04:15 PM',
      status: 'Scheduled',
      startsOn: '25 May 2024',
      iconType: 'car',
      iconBg: '#FFEDD5',
      iconColor: '#C2410C'
    },
    {
      id: 'p3',
      title: 'Choose next amenity for our society',
      category: 'Amenities',
      audience: 'All Residents',
      createdDate: 'Created: 15 May 2024, 11:20 AM',
      status: 'Active',
      endsIn: 'Ends in 2 days',
      totalVotes: 243,
      iconType: 'building',
      iconBg: '#ECFCCB',
      iconColor: '#163316'
    },
    {
      id: 'p4',
      title: 'Should we install CCTV in all common areas?',
      category: 'Safety & Security',
      audience: 'All Residents',
      createdDate: 'Created: 10 May 2024, 09:00 AM',
      status: 'Completed',
      endedOn: 'Ended on 18 May 2024',
      totalVotes: 189,
      iconType: 'security',
      iconBg: '#F3E8FF',
      iconColor: '#7E22CE'
    },
    {
      id: 'p5',
      title: 'Pet Policy in the Society',
      category: 'Rules & Regulations',
      audience: 'All Residents',
      createdDate: 'Created: 05 May 2024, 06:45 PM',
      status: 'Archived',
      endedOn: 'Ended on 12 May 2024',
      totalVotes: 112,
      iconType: 'pet',
      iconBg: '#FFE4E6',
      iconColor: '#E11D48'
    }
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const handleCreatePoll = () => {
    Alert.alert(
      'Create New Poll',
      'Enter poll question and choices for society residents:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Create Poll', 
          onPress: () => {
            const newPoll: PollRecord = {
              id: `p${Date.now()}`,
              title: 'Should we add a new gym trainer?',
              category: 'Amenities & Health',
              audience: 'All Residents',
              createdDate: 'Created: Today, 03:30 PM',
              status: 'Active',
              endsIn: 'Ends in 7 days',
              totalVotes: 0,
              iconType: 'building',
              iconBg: '#ECFCCB',
              iconColor: '#163316'
            };
            setPolls(prev => [newPoll, ...prev]);
            Alert.alert('Poll Created 🎉', 'New community poll published live!');
          }
        }
      ]
    );
  };

  const handlePollOptions = (poll: PollRecord) => {
    Alert.alert(
      poll.title,
      'Select action:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'View Detailed Votes', onPress: () => Alert.alert('Vote Distribution', `Total Votes: ${poll.totalVotes || 0}\nOption A: 65%\nOption B: 35%`) },
        { 
          text: poll.status === 'Archived' ? 'Unarchive Poll' : 'Archive Poll', 
          style: 'destructive',
          onPress: () => {
            setPolls(prev => prev.map(p => p.id === poll.id ? { ...p, status: p.status === 'Archived' ? 'Completed' : 'Archived' } : p));
          }
        }
      ]
    );
  };

  const handlePollAnalytics = () => {
    Alert.alert('Poll Analytics 📊', '94% Resident Participation Rate across all 24 society polls!');
  };

  // Filter polls
  const filteredPolls = polls.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = item.title.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);

    if (activeFilter === 'active') return matchesQuery && item.status === 'Active';
    if (activeFilter === 'scheduled') return matchesQuery && item.status === 'Scheduled';
    if (activeFilter === 'completed') return matchesQuery && item.status === 'Completed';
    if (activeFilter === 'archived') return matchesQuery && item.status === 'Archived';
    return matchesQuery;
  });

  const getStatusBadge = (status: PollRecord['status']) => {
    switch(status) {
      case 'Active': return { bg: '#ECFCCB', color: '#163316' };
      case 'Scheduled': return { bg: '#F3E8FF', color: '#7E22CE' };
      case 'Completed': return { bg: '#E0F2FE', color: '#0284C7' };
      case 'Archived': return { bg: '#F1F5F9', color: '#64748B' };
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FB' }}>
      {/* TOP HEADER BAR */}
      <View style={{
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, backgroundColor: '#FFFFFF',
        borderBottomWidth: 1, borderBottomColor: '#F1F5F9'
      }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8FAFC',
            alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F1F5F9'
          }}
        >
          <ArrowLeft size={20} color="#1E293B" />
        </TouchableOpacity>

        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 18 }}>Poll Management</Text>
          <Text style={{ color: '#94A3B8', fontSize: 12, fontWeight: '600', marginTop: 2 }}>
            Create, manage and review community polls
          </Text>
        </View>

        <TouchableOpacity 
          onPress={handleCreatePoll}
          style={{
            backgroundColor: '#163316', paddingHorizontal: 12, paddingVertical: 8,
            borderRadius: 14, flexDirection: 'row', alignItems: 'center'
          }}
        >
          <Plus size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 11 }}>Create Poll</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#163316" />}
      >
        {/* SEARCH BAR & FILTER DROPDOWN */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
          <View style={{
            flex: 1, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0',
            borderRadius: 20, paddingHorizontal: 14, height: 48, flexDirection: 'row',
            alignItems: 'center'
          }}>
            <Search size={18} color="#163316" style={{ marginRight: 10 }} />
            <TextInput
              placeholder="Search by poll title or type..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{ flex: 1, color: '#0F172A', fontWeight: '600', fontSize: 13 }}
            />
          </View>

          <TouchableOpacity 
            onPress={() => Alert.alert('Filter', 'Filter by category or target audience')}
            style={{
              backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0',
              borderRadius: 20, paddingHorizontal: 14, height: 48, flexDirection: 'row',
              alignItems: 'center', justifyContent: 'center'
            }}
          >
            <Filter size={16} color="#163316" style={{ marginRight: 6 }} />
            <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 12 }}>Filter ▾</Text>
          </TouchableOpacity>
        </View>

        {/* TOP SUMMARY STAT CARDS (5 METRICS) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 20 }}>
          {/* Card 1: Total Polls */}
          <View style={{ width: 110, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#ECFCCB', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <BarChart3 size={16} color="#163316" />
            </View>
            <Text style={{ color: '#0F172A', fontSize: 20, fontWeight: '900' }}>24</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2, lineHeight: 12 }}>Total Polls</Text>
            <Text style={{ color: '#163316', fontSize: 8, fontWeight: '800', marginTop: 2 }}>↑ 6 this month</Text>
          </View>

          {/* Card 2: Active */}
          <View style={{ width: 110, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#F3E8FF', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Send size={16} color="#7E22CE" />
            </View>
            <Text style={{ color: '#0F172A', fontSize: 20, fontWeight: '900' }}>12</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2, lineHeight: 12 }}>Active</Text>
            <Text style={{ color: '#7E22CE', fontSize: 8, fontWeight: '800', marginTop: 2 }}>↑ 4 this month</Text>
          </View>

          {/* Card 3: Scheduled */}
          <View style={{ width: 110, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#FFEDD5', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Calendar size={16} color="#C2410C" />
            </View>
            <Text style={{ color: '#0F172A', fontSize: 20, fontWeight: '900' }}>5</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2, lineHeight: 12 }}>Scheduled</Text>
            <Text style={{ color: '#C2410C', fontSize: 8, fontWeight: '800', marginTop: 2 }}>🕒 Upcoming</Text>
          </View>

          {/* Card 4: Completed */}
          <View style={{ width: 110, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <CheckCircle2 size={16} color="#0284C7" />
            </View>
            <Text style={{ color: '#0F172A', fontSize: 20, fontWeight: '900' }}>7</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2, lineHeight: 12 }}>Completed</Text>
            <Text style={{ color: '#0284C7', fontSize: 8, fontWeight: '800', marginTop: 2 }}>↑ 2 this month</Text>
          </View>

          {/* Card 5: Archived */}
          <View style={{ width: 110, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#FFE4E6', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Archive size={16} color="#E11D48" />
            </View>
            <Text style={{ color: '#0F172A', fontSize: 20, fontWeight: '900' }}>3</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2, lineHeight: 12 }}>Archived</Text>
            <Text style={{ color: '#64748B', fontSize: 8, fontWeight: '800', marginTop: 2 }}>📦 No change</Text>
          </View>
        </ScrollView>

        {/* CATEGORY FILTER PILLS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 20 }}>
          {[
            { id: 'all', label: 'All Polls (24)' },
            { id: 'active', label: 'Active (12)' },
            { id: 'scheduled', label: 'Scheduled (5)' },
            { id: 'completed', label: 'Completed (7)' },
            { id: 'archived', label: 'Archived (3)' }
          ].map(pill => {
            const isActive = activeFilter === pill.id;
            return (
              <TouchableOpacity
                key={pill.id}
                onPress={() => setActiveFilter(pill.id as any)}
                style={{
                  paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
                  backgroundColor: isActive ? '#163316' : '#F1F5F9',
                  borderWidth: 1, borderColor: isActive ? '#163316' : '#E2E8F0'
                }}
              >
                <Text style={{
                  fontWeight: '800', fontSize: 12,
                  color: isActive ? '#FFFFFF' : '#64748B'
                }}>
                  {pill.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* POLL CARDS LIST */}
        <View style={{ gap: 12, marginBottom: 20 }}>
          {filteredPolls.map(item => {
            const badge = getStatusBadge(item.status);

            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => handlePollOptions(item)}
                style={{
                  backgroundColor: '#FFFFFF', borderRadius: 24, padding: 16,
                  borderWidth: 1, borderColor: '#F1F5F9'
                }}
              >
                {/* Top Card Row */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 10 }}>
                    <View style={{
                      width: 44, height: 44, borderRadius: 22, backgroundColor: item.iconBg,
                      alignItems: 'center', justifyContent: 'center', marginRight: 12
                    }}>
                      {item.iconType === 'party' ? (
                        <PartyPopper size={20} color={item.iconColor} />
                      ) : item.iconType === 'car' ? (
                        <Car size={20} color={item.iconColor} />
                      ) : item.iconType === 'building' ? (
                        <Building size={20} color={item.iconColor} />
                      ) : item.iconType === 'security' ? (
                        <ShieldCheck size={20} color={item.iconColor} />
                      ) : (
                        <Dog size={20} color={item.iconColor} />
                      )}
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 15, lineHeight: 20 }}>{item.title}</Text>
                      <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '600', marginTop: 2 }}>{item.category}</Text>
                    </View>
                  </View>

                  {/* Status Badge & 3-Dots Menu */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <View style={{ backgroundColor: badge.bg, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 }}>
                      <Text style={{ color: badge.color, fontWeight: '800', fontSize: 10 }}>{item.status}</Text>
                    </View>

                    <TouchableOpacity onPress={() => handlePollOptions(item)} style={{ padding: 2 }}>
                      <MoreVertical size={18} color="#94A3B8" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Audience & Date Info */}
                <View style={{ gap: 4, marginVertical: 6 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Users size={12} color="#64748B" style={{ marginRight: 6 }} />
                    <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '600' }}>{item.audience}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Calendar size={12} color="#94A3B8" style={{ marginRight: 6 }} />
                    <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '500' }}>{item.createdDate}</Text>
                  </View>
                </View>

                {/* Right Status Column Details */}
                <View style={{
                  flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center',
                  paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F8FAFC'
                }}>
                  {item.status === 'Active' ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <Text style={{ color: '#163316', fontWeight: '900', fontSize: 12 }}>{item.endsIn}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <BarChart3 size={12} color="#0284C7" style={{ marginRight: 4 }} />
                        <Text style={{ color: '#0284C7', fontWeight: '800', fontSize: 11 }}>{item.totalVotes} Votes</Text>
                      </View>
                    </View>
                  ) : item.status === 'Scheduled' ? (
                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ color: '#7E22CE', fontWeight: '900', fontSize: 12 }}>Starts on {item.startsOn}</Text>
                      <Text style={{ color: '#0284C7', fontWeight: '800', fontSize: 11, marginTop: 2 }}>View Details</Text>
                    </View>
                  ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <Text style={{ color: '#64748B', fontWeight: '600', fontSize: 11 }}>{item.endedOn}</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <BarChart3 size={12} color="#0284C7" style={{ marginRight: 4 }} />
                        <Text style={{ color: '#0284C7', fontWeight: '800', fontSize: 11 }}>{item.totalVotes} Votes</Text>
                      </View>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* PAGINATION CONTROL BAR */}
        <View style={{
          flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
          gap: 16, marginBottom: 20
        }}>
          <TouchableOpacity
            onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
            style={{
              width: 36, height: 36, borderRadius: 12, backgroundColor: '#FFFFFF',
              borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <ChevronLeft size={18} color="#163316" />
          </TouchableOpacity>

          <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 13 }}>
            Page {currentPage} of 5
          </Text>

          <TouchableOpacity
            onPress={() => setCurrentPage(currentPage + 1)}
            style={{
              width: 36, height: 36, borderRadius: 12, backgroundColor: '#FFFFFF',
              borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <ChevronRight size={18} color="#163316" />
          </TouchableOpacity>
        </View>

        {/* NOTICE BANNER WITH POLL ANALYTICS ACTION */}
        <View style={{
          backgroundColor: '#F4FBE4', borderRadius: 20, padding: 14,
          borderWidth: 1, borderColor: '#D2FC52', flexDirection: 'row',
          alignItems: 'center', justifyContent: 'space-between', marginBottom: 20
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 10 }}>
            <View style={{
              width: 36, height: 36, borderRadius: 12, backgroundColor: '#163316',
              alignItems: 'center', justifyContent: 'center', marginRight: 10
            }}>
              <ShieldCheck size={20} color="#D2FC52" />
            </View>
            <Text style={{ color: '#163316', fontWeight: '700', fontSize: 11, flex: 1, lineHeight: 15 }}>
              Polls help improve community engagement. Create polls and get valuable feedback.
            </Text>
          </View>

          <TouchableOpacity 
            onPress={handlePollAnalytics}
            style={{
              backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 8,
              borderRadius: 14, borderWidth: 1, borderColor: '#163316',
              flexDirection: 'row', alignItems: 'center'
            }}
          >
            <BarChart3 size={14} color="#163316" style={{ marginRight: 4 }} />
            <Text style={{ color: '#163316', fontWeight: '800', fontSize: 11 }}>Poll Analytics</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
