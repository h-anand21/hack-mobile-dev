import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, RefreshControl, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, UserPlus, Search, Filter, Users, UserCheck, 
  Clock, Eye, MoreVertical, ShieldCheck, ChevronLeft, ChevronRight, Phone 
} from 'lucide-react-native';

export type ResidentFilterStatus = 'all' | 'active' | 'inactive' | 'blocked';

export interface ResidentItem {
  id: string;
  name: string;
  initials: string;
  flat: string;
  phone: string;
  status: 'Active' | 'Inactive' | 'Blocked';
}

export default function AdminResidentsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<ResidentFilterStatus>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const [residentList, setResidentList] = useState<ResidentItem[]>([
    {
      id: 'r1',
      name: 'Amit Kumar',
      initials: 'AK',
      flat: 'Flat A-1203, Tower A',
      phone: '98765 43210',
      status: 'Active'
    },
    {
      id: 'r2',
      name: 'Neha Sharma',
      initials: 'NS',
      flat: 'Flat B-902, Tower B',
      phone: '98765 43211',
      status: 'Active'
    },
    {
      id: 'r3',
      name: 'Rakesh Verma',
      initials: 'RK',
      flat: 'Flat C-1101, Tower C',
      phone: '98765 43212',
      status: 'Active'
    },
    {
      id: 'r4',
      name: 'Sunita Patel',
      initials: 'SP',
      flat: 'Flat A-504, Tower A',
      phone: '98765 43213',
      status: 'Inactive'
    },
    {
      id: 'r5',
      name: 'Mohit Jain',
      initials: 'MJ',
      flat: 'Flat D-1402, Tower D',
      phone: '98765 43214',
      status: 'Blocked'
    }
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const handleAddResident = () => {
    Alert.alert('Add Resident', 'Opening new resident registration modal...');
  };

  const handleViewResident = (resident: ResidentItem) => {
    Alert.alert(
      `Resident Details: ${resident.name}`,
      `Flat: ${resident.flat}\nPhone: ${resident.phone}\nStatus: ${resident.status}`
    );
  };

  const handleMoreOptions = (resident: ResidentItem) => {
    Alert.alert(
      `Manage ${resident.name}`,
      'Select action to perform:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Edit Flat Info', onPress: () => Alert.alert('Edit', 'Editing resident info') },
        { 
          text: resident.status === 'Blocked' ? 'Unblock Resident' : 'Block Resident', 
          style: 'destructive',
          onPress: () => {
            setResidentList(prev => prev.map(r => r.id === resident.id ? { ...r, status: r.status === 'Blocked' ? 'Active' : 'Blocked' } : r));
          }
        }
      ]
    );
  };

  // Filtering
  const filteredResidents = residentList.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = item.name.toLowerCase().includes(q) || item.flat.toLowerCase().includes(q) || item.phone.includes(q);
    
    if (activeFilter === 'active') return matchesQuery && item.status === 'Active';
    if (activeFilter === 'inactive') return matchesQuery && item.status === 'Inactive';
    if (activeFilter === 'blocked') return matchesQuery && item.status === 'Blocked';
    return matchesQuery;
  });

  const getBadgeStyle = (status: ResidentItem['status']) => {
    switch(status) {
      case 'Active': return { bg: '#ECFCCB', color: '#163316' };
      case 'Inactive': return { bg: '#FFEDD5', color: '#C2410C' };
      case 'Blocked': return { bg: '#FFE4E6', color: '#E11D48' };
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
          <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 18 }}>Resident Management</Text>
          <Text style={{ color: '#94A3B8', fontSize: 12, fontWeight: '600', marginTop: 2 }}>
            Manage all residents of the society
          </Text>
        </View>

        <TouchableOpacity 
          onPress={handleAddResident}
          style={{
            backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 8,
            borderRadius: 14, borderWidth: 1, borderColor: '#163316',
            flexDirection: 'row', alignItems: 'center'
          }}
        >
          <UserPlus size={14} color="#163316" style={{ marginRight: 6 }} />
          <Text style={{ color: '#163316', fontWeight: '800', fontSize: 11 }}>Add Resident</Text>
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
              placeholder="Search by name, flat no. or phone number..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{ flex: 1, color: '#0F172A', fontWeight: '600', fontSize: 13 }}
            />
          </View>

          <TouchableOpacity 
            onPress={() => Alert.alert('Filter', 'Filter by Tower / Block (Tower A, B, C, D)')}
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

        {/* TOP SUMMARY STAT CARDS (4 METRICS) */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
          {/* Card 1: Total Residents */}
          <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#ECFCCB', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Users size={16} color="#163316" />
            </View>
            <Text style={{ color: '#0F172A', fontSize: 20, fontWeight: '900' }}>256</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2, lineHeight: 12 }}>Total Residents</Text>
            <Text style={{ color: '#163316', fontSize: 8, fontWeight: '800', marginTop: 2 }}>↑ 12 this month</Text>
          </View>

          {/* Card 2: Active Residents */}
          <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <UserCheck size={16} color="#0284C7" />
            </View>
            <Text style={{ color: '#0F172A', fontSize: 20, fontWeight: '900' }}>238</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2, lineHeight: 12 }}>Active Residents</Text>
            <Text style={{ color: '#0284C7', fontSize: 8, fontWeight: '800', marginTop: 2 }}>↑ 10 this month</Text>
          </View>

          {/* Card 3: Inactive */}
          <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#FFEDD5', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Clock size={16} color="#C2410C" />
            </View>
            <Text style={{ color: '#0F172A', fontSize: 20, fontWeight: '900' }}>8</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2, lineHeight: 12 }}>Inactive</Text>
            <Text style={{ color: '#DC2626', fontSize: 8, fontWeight: '800', marginTop: 2 }}>↓ 2 this month</Text>
          </View>

          {/* Card 4: New This Month */}
          <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#F3E8FF', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <UserPlus size={16} color="#7E22CE" />
            </View>
            <Text style={{ color: '#0F172A', fontSize: 20, fontWeight: '900' }}>10</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2, lineHeight: 12 }}>New This Month</Text>
            <Text style={{ color: '#7E22CE', fontSize: 8, fontWeight: '800', marginTop: 2 }}>↑ 3 this month</Text>
          </View>
        </View>

        {/* CATEGORY FILTER PILLS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 20 }}>
          {[
            { id: 'all', label: 'All Residents (256)' },
            { id: 'active', label: 'Active (238)' },
            { id: 'inactive', label: 'Inactive (8)' },
            { id: 'blocked', label: 'Blocked (10)' }
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

        {/* RESIDENT CARDS LIST */}
        <View style={{ gap: 12, marginBottom: 20 }}>
          {filteredResidents.map(item => {
            const badge = getBadgeStyle(item.status);
            return (
              <View
                key={item.id}
                style={{
                  backgroundColor: '#FFFFFF', borderRadius: 24, padding: 14,
                  borderWidth: 1, borderColor: '#F1F5F9', flexDirection: 'row',
                  alignItems: 'center', justifyContent: 'space-between'
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 10 }}>
                  {/* Initials Circle */}
                  <View style={{
                    width: 46, height: 46, borderRadius: 23, backgroundColor: '#ECFCCB',
                    alignItems: 'center', justifyContent: 'center', marginRight: 12
                  }}>
                    <Text style={{ color: '#163316', fontWeight: '900', fontSize: 15 }}>{item.initials}</Text>
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 14 }}>{item.name}</Text>
                      <View style={{ backgroundColor: badge.bg, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 }}>
                        <Text style={{ color: badge.color, fontWeight: '800', fontSize: 10 }}>{item.status}</Text>
                      </View>
                    </View>
                    
                    <Text style={{ color: '#64748B', fontSize: 12, fontWeight: '600', marginTop: 2 }}>{item.flat}</Text>
                    
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                      <Phone size={11} color="#64748B" style={{ marginRight: 4 }} />
                      <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '600' }}>{item.phone}</Text>
                    </View>
                  </View>
                </View>

                {/* Right Actions: Eye View & 3-Dots Menu */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <TouchableOpacity
                    onPress={() => handleViewResident(item)}
                    style={{
                      width: 36, height: 36, borderRadius: 12, backgroundColor: '#F8FAFC',
                      borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    <Eye size={16} color="#163316" />
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleMoreOptions(item)}
                    style={{
                      width: 36, height: 36, borderRadius: 12, backgroundColor: '#F8FAFC',
                      borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    <MoreVertical size={16} color="#64748B" />
                  </TouchableOpacity>
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
            Page {currentPage} of 26
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

        {/* NOTICE BANNER CARD */}
        <View style={{
          backgroundColor: '#F4FBE4', borderRadius: 20, padding: 14,
          borderWidth: 1, borderColor: '#D2FC52', flexDirection: 'row',
          alignItems: 'center'
        }}>
          <View style={{
            width: 36, height: 36, borderRadius: 12, backgroundColor: '#163316',
            alignItems: 'center', justifyContent: 'center', marginRight: 12
          }}>
            <ShieldCheck size={20} color="#D2FC52" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#163316', fontWeight: '800', fontSize: 12 }}>
              Keep resident information updated for better security and communication.
            </Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
