import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, RefreshControl, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, Plus, Search, Filter, Megaphone, Send, Calendar, 
  FileText, Archive, PartyPopper, Ban, Wrench, Users, MoreVertical, 
  ChevronLeft, ChevronRight, ShieldCheck 
} from 'lucide-react-native';

export type NoticeFilterType = 'all' | 'published' | 'scheduled' | 'drafts' | 'archived';

export interface NoticeRecord {
  id: string;
  title: string;
  description: string;
  date: string;
  audience: string;
  status: 'Published' | 'Scheduled' | 'Draft' | 'Archived';
  upcomingIn?: string;
  iconType: 'megaphone' | 'party' | 'parking' | 'maintenance' | 'holiday';
  iconBg: string;
  iconColor: string;
}

export default function NoticeManagementScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<NoticeFilterType>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const [notices, setNotices] = useState<NoticeRecord[]>([
    {
      id: 'n1',
      title: 'Water Supply Maintenance',
      description: 'Water supply will be interrupted on 25 May 2024 from 10:00 AM to 12:00 PM for maintenance work.',
      date: '22 May 2024, 09:30 AM',
      audience: 'All Residents',
      status: 'Published',
      iconType: 'megaphone',
      iconBg: '#ECFCCB',
      iconColor: '#163316'
    },
    {
      id: 'n2',
      title: 'Community Diwali Celebration',
      description: 'We are happy to announce a Diwali celebration event for all residents on 28 Oct 2024.',
      date: '28 Oct 2024, 06:00 PM',
      audience: 'All Residents',
      status: 'Scheduled',
      upcomingIn: 'In 10 days',
      iconType: 'party',
      iconBg: '#F3E8FF',
      iconColor: '#7E22CE'
    },
    {
      id: 'n3',
      title: 'Parking Rules Reminder',
      description: 'Please avoid parking in common areas. Unauthorized vehicles will be towed.',
      date: '20 May 2024, 11:15 AM',
      audience: 'All Residents',
      status: 'Published',
      iconType: 'parking',
      iconBg: '#FFEDD5',
      iconColor: '#C2410C'
    },
    {
      id: 'n4',
      title: 'Lift Maintenance',
      description: 'Lift maintenance scheduled next week. Details will be shared soon.',
      date: '--',
      audience: 'All Residents',
      status: 'Draft',
      iconType: 'maintenance',
      iconBg: '#E0F2FE',
      iconColor: '#0284C7'
    },
    {
      id: 'n5',
      title: 'Holiday - Office Closed',
      description: 'The society office will remain closed on 15 Aug 2024 on account of Independence Day.',
      date: '18 May 2024, 04:45 PM',
      audience: 'All Residents',
      status: 'Published',
      iconType: 'holiday',
      iconBg: '#FFE4E6',
      iconColor: '#E11D48'
    }
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const handleCreateNotice = () => {
    Alert.alert(
      'Create New Notice',
      'Select notice type to publish:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Maintenance Alert', onPress: () => Alert.alert('Notice Created 📢', 'Water maintenance notice sent to all residents!') },
        { text: 'Event Announcement', onPress: () => Alert.alert('Notice Scheduled 🎉', 'Event notice scheduled!') }
      ]
    );
  };

  const handleNoticeOptions = (notice: NoticeRecord) => {
    Alert.alert(
      notice.title,
      'Select action:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Edit Notice', onPress: () => Alert.alert('Edit', 'Opening notice editor...') },
        { 
          text: notice.status === 'Archived' ? 'Unarchive Notice' : 'Archive Notice', 
          style: 'destructive',
          onPress: () => {
            setNotices(prev => prev.map(n => n.id === notice.id ? { ...n, status: n.status === 'Archived' ? 'Published' : 'Archived' } : n));
          }
        }
      ]
    );
  };

  const handleNoticeTemplates = () => {
    Alert.alert('Notice Templates 📄', 'Pre-built templates:\n1. Water Maintenance\n2. Power Cut\n3. Society Meeting\n4. Festival Celebration');
  };

  // Filter notices
  const filteredNotices = notices.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q);

    if (activeFilter === 'published') return matchesQuery && item.status === 'Published';
    if (activeFilter === 'scheduled') return matchesQuery && item.status === 'Scheduled';
    if (activeFilter === 'drafts') return matchesQuery && item.status === 'Draft';
    if (activeFilter === 'archived') return matchesQuery && item.status === 'Archived';
    return matchesQuery;
  });

  const getStatusBadge = (status: NoticeRecord['status']) => {
    switch(status) {
      case 'Published': return { bg: '#ECFCCB', color: '#163316' };
      case 'Scheduled': return { bg: '#F3E8FF', color: '#7E22CE' };
      case 'Draft': return { bg: '#E0F2FE', color: '#0284C7' };
      case 'Archived': return { bg: '#FFE4E6', color: '#E11D48' };
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
          <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 18 }}>Notice Management</Text>
          <Text style={{ color: '#94A3B8', fontSize: 12, fontWeight: '600', marginTop: 2 }}>
            Create, manage and publish notices
          </Text>
        </View>

        <TouchableOpacity 
          onPress={handleCreateNotice}
          style={{
            backgroundColor: '#163316', paddingHorizontal: 12, paddingVertical: 8,
            borderRadius: 14, flexDirection: 'row', alignItems: 'center'
          }}
        >
          <Plus size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 11 }}>Create Notice</Text>
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
              placeholder="Search by title or type..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{ flex: 1, color: '#0F172A', fontWeight: '600', fontSize: 13 }}
            />
          </View>

          <TouchableOpacity 
            onPress={() => Alert.alert('Filter', 'Filter by notice category or target audience')}
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
          {/* Card 1: Total Notices */}
          <View style={{ width: 110, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#ECFCCB', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Megaphone size={16} color="#163316" />
            </View>
            <Text style={{ color: '#0F172A', fontSize: 20, fontWeight: '900' }}>36</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2, lineHeight: 12 }}>Total Notices</Text>
            <Text style={{ color: '#163316', fontSize: 8, fontWeight: '800', marginTop: 2 }}>↑ 8 this month</Text>
          </View>

          {/* Card 2: Published */}
          <View style={{ width: 110, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#F3E8FF', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Send size={16} color="#7E22CE" />
            </View>
            <Text style={{ color: '#0F172A', fontSize: 20, fontWeight: '900' }}>12</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2, lineHeight: 12 }}>Published</Text>
            <Text style={{ color: '#7E22CE', fontSize: 8, fontWeight: '800', marginTop: 2 }}>↑ 5 this month</Text>
          </View>

          {/* Card 3: Scheduled */}
          <View style={{ width: 110, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#FFEDD5', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Calendar size={16} color="#C2410C" />
            </View>
            <Text style={{ color: '#0F172A', fontSize: 20, fontWeight: '900' }}>6</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2, lineHeight: 12 }}>Scheduled</Text>
            <Text style={{ color: '#C2410C', fontSize: 8, fontWeight: '800', marginTop: 2 }}>🕒 Upcoming</Text>
          </View>

          {/* Card 4: Drafts */}
          <View style={{ width: 110, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <FileText size={16} color="#0284C7" />
            </View>
            <Text style={{ color: '#0F172A', fontSize: 20, fontWeight: '900' }}>4</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2, lineHeight: 12 }}>Drafts</Text>
            <Text style={{ color: '#0284C7', fontSize: 8, fontWeight: '800', marginTop: 2 }}>✏️ Not published</Text>
          </View>

          {/* Card 5: Archived */}
          <View style={{ width: 110, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#FFE4E6', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Archive size={16} color="#E11D48" />
            </View>
            <Text style={{ color: '#0F172A', fontSize: 20, fontWeight: '900' }}>14</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2, lineHeight: 12 }}>Archived</Text>
            <Text style={{ color: '#E11D48', fontSize: 8, fontWeight: '800', marginTop: 2 }}>📦 Old notices</Text>
          </View>
        </ScrollView>

        {/* CATEGORY FILTER PILLS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 20 }}>
          {[
            { id: 'all', label: 'All Notices (36)' },
            { id: 'published', label: 'Published (12)' },
            { id: 'scheduled', label: 'Scheduled (6)' },
            { id: 'drafts', label: 'Drafts (4)' },
            { id: 'archived', label: 'Archived (14)' }
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

        {/* NOTICE CARDS LIST */}
        <View style={{ gap: 12, marginBottom: 20 }}>
          {filteredNotices.map(item => {
            const badge = getStatusBadge(item.status);

            return (
              <View
                key={item.id}
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
                      {item.iconType === 'megaphone' ? (
                        <Megaphone size={20} color={item.iconColor} />
                      ) : item.iconType === 'party' ? (
                        <PartyPopper size={20} color={item.iconColor} />
                      ) : item.iconType === 'parking' ? (
                        <Ban size={20} color={item.iconColor} />
                      ) : item.iconType === 'maintenance' ? (
                        <Wrench size={20} color={item.iconColor} />
                      ) : (
                        <Calendar size={20} color={item.iconColor} />
                      )}
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 15 }}>{item.title}</Text>
                    </View>
                  </View>

                  {/* Status Badge & 3-Dots Menu */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <View style={{ backgroundColor: badge.bg, paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 }}>
                      <Text style={{ color: badge.color, fontWeight: '800', fontSize: 10 }}>{item.status}</Text>
                    </View>

                    <TouchableOpacity onPress={() => handleNoticeOptions(item)} style={{ padding: 2 }}>
                      <MoreVertical size={18} color="#94A3B8" />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Description Body */}
                <Text style={{ color: '#64748B', fontSize: 12, fontWeight: '500', lineHeight: 17, marginBottom: 12 }}>
                  {item.description}
                </Text>

                {/* Footer Metadata Row */}
                <View style={{
                  flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                  paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F8FAFC'
                }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Calendar size={11} color="#94A3B8" style={{ marginRight: 4 }} />
                      <Text style={{ color: '#94A3B8', fontSize: 10, fontWeight: '600' }}>{item.date}</Text>
                    </View>

                    <Text style={{ color: '#CBD5E1', fontSize: 10 }}>|</Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Users size={11} color="#94A3B8" style={{ marginRight: 4 }} />
                      <Text style={{ color: '#94A3B8', fontSize: 10, fontWeight: '600' }}>{item.audience}</Text>
                    </View>
                  </View>

                  {item.upcomingIn ? (
                    <Text style={{ color: '#7E22CE', fontWeight: '800', fontSize: 10 }}>{item.upcomingIn}</Text>
                  ) : null}
                </View>
              </View>
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
            Page {currentPage} of 8
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

        {/* NOTICE BANNER WITH NOTICE TEMPLATES ACTION */}
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
              Keep your residents informed with timely notices and important updates.
            </Text>
          </View>

          <TouchableOpacity 
            onPress={handleNoticeTemplates}
            style={{
              backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 8,
              borderRadius: 14, borderWidth: 1, borderColor: '#163316',
              flexDirection: 'row', alignItems: 'center'
            }}
          >
            <FileText size={14} color="#163316" style={{ marginRight: 4 }} />
            <Text style={{ color: '#163316', fontWeight: '800', fontSize: 11 }}>Notice Templates</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
