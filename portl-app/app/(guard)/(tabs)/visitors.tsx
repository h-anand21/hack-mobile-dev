import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, RefreshControl, Image, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, UserPlus, Search, Filter, Users, Clock, 
  Hourglass, CheckCircle2, Phone, Car, X, Check, ChevronLeft, ChevronRight, ShieldCheck, BarChart3 
} from 'lucide-react-native';

export type VisitorFilterType = 'all' | 'inside' | 'pending' | 'checkout';

export interface VisitorRecord {
  id: string;
  name: string;
  purpose: string;
  vehicle?: string;
  phone?: string;
  time: string;
  status: 'Waiting Approval' | 'Inside' | 'Checked Out';
  photo: string;
  expectedCheckout?: string;
  actualCheckout?: string;
}

export default function VisitorManagementScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<VisitorFilterType>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const [visitors, setVisitors] = useState<VisitorRecord[]>([
    {
      id: 'v1',
      name: 'Rahul Sharma',
      purpose: 'Amazon Delivery',
      vehicle: 'KA01 AB 1234',
      time: 'Today, 10:25 AM',
      status: 'Waiting Approval',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 'v2',
      name: 'Priya Mehta',
      purpose: 'Friend of Neha Sharma (B-902)',
      phone: '98765 43210',
      time: 'Today, 09:45 AM',
      status: 'Inside',
      expectedCheckout: 'Today, 11:30 AM',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 'v3',
      name: 'Vikram Singh',
      purpose: 'Maintenance Staff',
      phone: '98765 67890',
      time: 'Today, 09:20 AM',
      status: 'Inside',
      expectedCheckout: 'Today, 12:00 PM',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 'v4',
      name: 'Anjali Verma',
      purpose: 'Tutor',
      vehicle: 'DL 3C AB 5678',
      time: 'Yesterday, 07:15 PM',
      status: 'Checked Out',
      actualCheckout: 'Yesterday, 08:30 PM',
      photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 'v5',
      name: 'Rohit Kumar',
      purpose: 'Swiggy Delivery',
      vehicle: 'KA05 JK 7890',
      time: 'Yesterday, 06:40 PM',
      status: 'Checked Out',
      actualCheckout: 'Yesterday, 07:05 PM',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80'
    }
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const handleAddVisitor = () => {
    router.push('/(guard)/register-visitor');
  };

  const handleApprove = (visitor: VisitorRecord) => {
    setVisitors(prev => prev.map(v => v.id === visitor.id ? { ...v, status: 'Inside', expectedCheckout: 'Today, 02:00 PM' } : v));
    Alert.alert('Approved ✅', `${visitor.name} has been approved for gate entry!`);
  };

  const handleReject = (visitor: VisitorRecord) => {
    Alert.alert(
      `Reject ${visitor.name}?`,
      'Are you sure you want to reject entry for this visitor?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reject', 
          style: 'destructive',
          onPress: () => {
            setVisitors(prev => prev.filter(v => v.id !== visitor.id));
            Alert.alert('Entry Rejected ❌', `${visitor.name} entry request was rejected.`);
          }
        }
      ]
    );
  };

  const handleCall = (visitor: VisitorRecord) => {
    Alert.alert('Calling Visitor', `Dialing ${visitor.phone || visitor.name}...`);
  };

  const handleVisitorReport = () => {
    Alert.alert('Visitor Report', 'Exporting daily visitor entry/exit log report...');
  };

  // Filter visitors
  const filteredVisitors = visitors.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = item.name.toLowerCase().includes(q) || 
                         item.purpose.toLowerCase().includes(q) || 
                         (item.vehicle && item.vehicle.toLowerCase().includes(q)) ||
                         (item.phone && item.phone.includes(q));

    if (activeFilter === 'inside') return matchesQuery && item.status === 'Inside';
    if (activeFilter === 'pending') return matchesQuery && item.status === 'Waiting Approval';
    if (activeFilter === 'checkout') return matchesQuery && item.status === 'Checked Out';
    return matchesQuery;
  });

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
          <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 18 }}>Visitor Management</Text>
          <Text style={{ color: '#94A3B8', fontSize: 12, fontWeight: '600', marginTop: 2 }}>
            Monitor and manage all visitors
          </Text>
        </View>

        <TouchableOpacity 
          onPress={handleAddVisitor}
          style={{
            backgroundColor: '#163316', paddingHorizontal: 12, paddingVertical: 8,
            borderRadius: 14, flexDirection: 'row', alignItems: 'center'
          }}
        >
          <UserPlus size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 11 }}>Add Visitor</Text>
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
              placeholder="Search by name, phone, purpose or vehicle..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{ flex: 1, color: '#0F172A', fontWeight: '600', fontSize: 13 }}
            />
          </View>

          <TouchableOpacity 
            onPress={() => Alert.alert('Filter', 'Filter by visitor type: Guest, Delivery, Staff')}
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
          {/* Card 1: Total Visitors */}
          <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#ECFCCB', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Users size={16} color="#163316" />
            </View>
            <Text style={{ color: '#0F172A', fontSize: 20, fontWeight: '900' }}>48</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2, lineHeight: 12 }}>Total Visitors</Text>
            <Text style={{ color: '#163316', fontSize: 8, fontWeight: '800', marginTop: 2 }}>↑ 12 this week</Text>
          </View>

          {/* Card 2: Currently Inside */}
          <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Clock size={16} color="#0284C7" />
            </View>
            <Text style={{ color: '#0F172A', fontSize: 20, fontWeight: '900' }}>18</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2, lineHeight: 12 }}>Currently Inside</Text>
            <Text style={{ color: '#0284C7', fontSize: 8, fontWeight: '800', marginTop: 2 }}>Live Now</Text>
          </View>

          {/* Card 3: Waiting Approval */}
          <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#FFEDD5', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Hourglass size={16} color="#C2410C" />
            </View>
            <Text style={{ color: '#0F172A', fontSize: 20, fontWeight: '900' }}>12</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2, lineHeight: 12 }}>Waiting Approval</Text>
            <Text style={{ color: '#C2410C', fontSize: 8, fontWeight: '800', marginTop: 2 }}>Pending</Text>
          </View>

          {/* Card 4: Checked Out */}
          <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#F3E8FF', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <CheckCircle2 size={16} color="#7E22CE" />
            </View>
            <Text style={{ color: '#0F172A', fontSize: 20, fontWeight: '900' }}>186</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2, lineHeight: 12 }}>Checked Out</Text>
            <Text style={{ color: '#7E22CE', fontSize: 8, fontWeight: '800', marginTop: 2 }}>This month</Text>
          </View>
        </View>

        {/* CATEGORY FILTER PILLS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 20 }}>
          {[
            { id: 'all', label: 'All Visitors (48)' },
            { id: 'inside', label: 'Inside (18)' },
            { id: 'pending', label: 'Pending (12)' },
            { id: 'checkout', label: 'Checked Out (186)' }
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

        {/* VISITOR CARDS LIST */}
        <View style={{ gap: 12, marginBottom: 20 }}>
          {filteredVisitors.map(item => (
            <View
              key={item.id}
              style={{
                backgroundColor: '#FFFFFF', borderRadius: 24, padding: 14,
                borderWidth: 1, borderColor: '#F1F5F9'
              }}
            >
              {/* Top Card Row */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 10 }}>
                  <Image 
                    source={{ uri: item.photo }} 
                    style={{ width: 50, height: 50, borderRadius: 25, marginRight: 12, backgroundColor: '#E2E8F0' }} 
                  />
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 15 }}>{item.name}</Text>
                    <Text style={{ color: '#64748B', fontSize: 12, fontWeight: '600', marginTop: 1 }}>{item.purpose}</Text>
                    
                    {item.vehicle ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                        <Car size={12} color="#64748B" style={{ marginRight: 4 }} />
                        <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '600' }}>{item.vehicle}</Text>
                      </View>
                    ) : item.phone ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                        <Phone size={12} color="#64748B" style={{ marginRight: 4 }} />
                        <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '600' }}>{item.phone}</Text>
                      </View>
                    ) : null}

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 3 }}>
                      <Clock size={11} color="#94A3B8" style={{ marginRight: 4 }} />
                      <Text style={{ color: '#94A3B8', fontSize: 10, fontWeight: '500' }}>{item.time}</Text>
                    </View>
                  </View>
                </View>

                {/* Status Badge */}
                <View style={{
                  backgroundColor: item.status === 'Waiting Approval' ? '#FFEDD5' : item.status === 'Inside' ? '#ECFCCB' : '#F1F5F9',
                  paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10
                }}>
                  <Text style={{
                    color: item.status === 'Waiting Approval' ? '#C2410C' : item.status === 'Inside' ? '#163316' : '#64748B',
                    fontWeight: '800', fontSize: 10
                  }}>
                    {item.status}
                  </Text>
                </View>
              </View>

              {/* Bottom Actions / Extra Info Row */}
              {item.status === 'Waiting Approval' ? (
                <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 10, marginTop: 8, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F8FAFC' }}>
                  <TouchableOpacity
                    onPress={() => handleReject(item)}
                    style={{
                      paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14,
                      borderWidth: 1, borderColor: '#EF4444', flexDirection: 'row', alignItems: 'center'
                    }}
                  >
                    <X size={14} color="#EF4444" style={{ marginRight: 4 }} />
                    <Text style={{ color: '#EF4444', fontWeight: '800', fontSize: 12 }}>Reject</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => handleApprove(item)}
                    style={{
                      paddingHorizontal: 14, paddingVertical: 8, borderRadius: 14,
                      borderWidth: 1, borderColor: '#22C55E', backgroundColor: '#F0FDF4',
                      flexDirection: 'row', alignItems: 'center'
                    }}
                  >
                    <Check size={14} color="#15803D" style={{ marginRight: 4 }} />
                    <Text style={{ color: '#15803D', fontWeight: '800', fontSize: 12 }}>Approve</Text>
                  </TouchableOpacity>
                </View>
              ) : item.status === 'Inside' ? (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F8FAFC' }}>
                  <View>
                    <Text style={{ color: '#94A3B8', fontSize: 10, fontWeight: '600' }}>Expected Checkout</Text>
                    <Text style={{ color: '#0F172A', fontSize: 11, fontWeight: '700', marginTop: 1 }}>{item.expectedCheckout}</Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => handleCall(item)}
                    style={{
                      width: 36, height: 36, borderRadius: 18, backgroundColor: '#F8FAFC',
                      borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    <Phone size={16} color="#163316" />
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F8FAFC' }}>
                  <View>
                    <Text style={{ color: '#94A3B8', fontSize: 10, fontWeight: '600' }}>Checkout Time</Text>
                    <Text style={{ color: '#0F172A', fontSize: 11, fontWeight: '700', marginTop: 1 }}>{item.actualCheckout}</Text>
                  </View>

                  <ChevronRight size={16} color="#94A3B8" />
                </View>
              )}
            </View>
          ))}
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
            Page {currentPage} of 6
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

        {/* SAFETY NOTICE BANNER WITH VISITOR REPORT ACTION */}
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
              Keep your society safe by verifying and managing every visitor.
            </Text>
          </View>

          <TouchableOpacity 
            onPress={handleVisitorReport}
            style={{
              backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 8,
              borderRadius: 14, borderWidth: 1, borderColor: '#163316',
              flexDirection: 'row', alignItems: 'center'
            }}
          >
            <BarChart3 size={14} color="#163316" style={{ marginRight: 4 }} />
            <Text style={{ color: '#163316', fontWeight: '800', fontSize: 11 }}>Visitor Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
