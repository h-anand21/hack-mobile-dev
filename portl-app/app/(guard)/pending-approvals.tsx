import React, { useState } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, Alert, RefreshControl 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, Filter, Users, Car, Package, ShieldCheck, 
  X, Check, ChevronRight 
} from 'lucide-react-native';

export type RequestCategory = 'all' | 'visitor' | 'vehicle' | 'delivery';

export interface PendingRequestItem {
  id: string;
  name: string;
  subtitle1: string;
  subtitle2: string;
  category: 'visitor' | 'vehicle' | 'delivery';
  categoryLabel: string;
  extraBadge: string;
  time: string;
  dateGroup: 'Today' | 'Yesterday';
  iconType: 'user' | 'car' | 'package';
  bgColor: string;
  iconColor: string;
  status: 'pending' | 'approved' | 'rejected';
}

export default function PendingApprovalsScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<RequestCategory>('all');
  const [refreshing, setRefreshing] = useState(false);

  const [requests, setRequests] = useState<PendingRequestItem[]>([
    {
      id: 'p1',
      name: 'Amit Verma',
      subtitle1: 'Visiting: Rajesh Kumar',
      subtitle2: 'Flat A-1203, Tower A',
      category: 'visitor',
      categoryLabel: 'Visitor',
      extraBadge: '👥 2',
      time: '10:20 AM',
      dateGroup: 'Today',
      iconType: 'user',
      bgColor: '#ECFCCB',
      iconColor: '#163316',
      status: 'pending'
    },
    {
      id: 'p2',
      name: 'WB 20 AB 1234',
      subtitle1: 'Resident Vehicle',
      subtitle2: 'Amit Verma (A-1203)',
      category: 'vehicle',
      categoryLabel: 'Vehicle',
      extraBadge: '🚘 SUV',
      time: '09:45 AM',
      dateGroup: 'Today',
      iconType: 'car',
      bgColor: '#ECFCCB',
      iconColor: '#163316',
      status: 'pending'
    },
    {
      id: 'p3',
      name: 'Amazon Delivery',
      subtitle1: 'Delivery for: Neha Sharma',
      subtitle2: 'Flat B-902, Tower B',
      category: 'delivery',
      categoryLabel: 'Delivery',
      extraBadge: '📦 1 Item',
      time: '09:30 AM',
      dateGroup: 'Today',
      iconType: 'package',
      bgColor: '#FFEDD5',
      iconColor: '#C2410C',
      status: 'pending'
    },
    {
      id: 'p4',
      name: 'Sanjay Patel',
      subtitle1: 'Visiting: Priya Nair',
      subtitle2: 'Flat A-504, Tower A',
      category: 'visitor',
      categoryLabel: 'Visitor',
      extraBadge: '👥 1',
      time: 'Yesterday, 07:15 PM',
      dateGroup: 'Yesterday',
      iconType: 'user',
      bgColor: '#ECFCCB',
      iconColor: '#163316',
      status: 'pending'
    }
  ]);

  const handleApprove = (item: PendingRequestItem) => {
    Alert.alert(
      'Approve Request',
      `Are you sure you want to APPROVE entry for ${item.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Approve Entry', 
          style: 'default',
          onPress: () => {
            setRequests(prev => prev.filter(r => r.id !== item.id));
            Alert.alert('Approved 🎉', `Entry request for ${item.name} approved successfully!`);
          }
        }
      ]
    );
  };

  const handleReject = (item: PendingRequestItem) => {
    Alert.alert(
      'Reject Request',
      `Are you sure you want to REJECT entry for ${item.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Reject Request', 
          style: 'destructive',
          onPress: () => {
            setRequests(prev => prev.filter(r => r.id !== item.id));
            Alert.alert('Rejected ✕', `Entry request for ${item.name} rejected.`);
          }
        }
      ]
    );
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  // Filter requests
  const filteredRequests = requests.filter(r => {
    if (activeTab === 'visitor') return r.category === 'visitor';
    if (activeTab === 'vehicle') return r.category === 'vehicle';
    if (activeTab === 'delivery') return r.category === 'delivery';
    return true;
  });

  const todayRequests = filteredRequests.filter(r => r.dateGroup === 'Today');
  const yesterdayRequests = filteredRequests.filter(r => r.dateGroup === 'Yesterday');

  const visitorCount = requests.filter(r => r.category === 'visitor').length;
  const vehicleCount = requests.filter(r => r.category === 'vehicle').length;
  const deliveryCount = requests.filter(r => r.category === 'delivery').length;
  const totalCount = requests.length;

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
          <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 18 }}>Pending Approvals</Text>
          <Text style={{ color: '#94A3B8', fontSize: 12, fontWeight: '600', marginTop: 2 }}>
            Review and approve requests
          </Text>
        </View>

        <TouchableOpacity 
          onPress={() => Alert.alert('Filter', 'Filter pending requests by gate or time')}
          style={{ alignItems: 'center' }}
        >
          <View style={{
            width: 36, height: 36, borderRadius: 12, backgroundColor: '#F4FBE4',
            borderWidth: 1, borderColor: '#D2FC52', alignItems: 'center', justifyContent: 'center'
          }}>
            <Filter size={18} color="#163316" />
          </View>
          <Text style={{ color: '#163316', fontWeight: '800', fontSize: 9, marginTop: 2 }}>Filter</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#163316" />}
      >
        {/* TOP STAT CARDS SUMMARY (HORIZONTAL ROW) */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
          {/* Card 1: Visitors Pending */}
          <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#ECFCCB', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Users size={16} color="#163316" />
            </View>
            <Text style={{ color: '#163316', fontSize: 20, fontWeight: '900' }}>02</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2, lineHeight: 12 }}>Visitors Pending</Text>
          </View>

          {/* Card 2: Vehicles Pending */}
          <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#ECFCCB', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Car size={16} color="#163316" />
            </View>
            <Text style={{ color: '#163316', fontSize: 20, fontWeight: '900' }}>01</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2, lineHeight: 12 }}>Vehicles Pending</Text>
          </View>

          {/* Card 3: Deliveries Pending */}
          <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#FFEDD5', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Package size={16} color="#C2410C" />
            </View>
            <Text style={{ color: '#163316', fontSize: 20, fontWeight: '900' }}>03</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2, lineHeight: 12 }}>Deliveries Pending</Text>
          </View>

          {/* Card 4: Total Pending */}
          <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#FFE4E6', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Users size={16} color="#E11D48" />
            </View>
            <Text style={{ color: '#E11D48', fontSize: 20, fontWeight: '900' }}>09</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2, lineHeight: 12 }}>Total Pending</Text>
          </View>
        </View>

        {/* CATEGORY FILTER PILLS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 20 }}>
          {[
            { id: 'all', title: `All (${totalCount})` },
            { id: 'visitor', title: `Visitors (${visitorCount})` },
            { id: 'vehicle', title: `Vehicles (${vehicleCount})` },
            { id: 'delivery', title: `Deliveries (${deliveryCount})` }
          ].map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveTab(tab.id as any)}
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
                  {tab.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* SECTION: TODAY */}
        {todayRequests.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 15, marginBottom: 12 }}>Today</Text>

            <View style={{ gap: 14 }}>
              {todayRequests.map(item => (
                <View 
                  key={item.id}
                  style={{
                    backgroundColor: '#FFFFFF', borderRadius: 24, padding: 16,
                    borderWidth: 1, borderColor: '#F1F5F9',
                    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', flex: 1, paddingRight: 10 }}>
                      <View style={{
                        width: 44, height: 44, borderRadius: 16, backgroundColor: item.bgColor,
                        alignItems: 'center', justifyContent: 'center', marginRight: 12
                      }}>
                        {item.iconType === 'car' ? (
                          <Car size={22} color={item.iconColor} />
                        ) : item.iconType === 'package' ? (
                          <Package size={22} color={item.iconColor} />
                        ) : (
                          <Users size={22} color={item.iconColor} />
                        )}
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 15 }}>{item.name}</Text>
                        <Text style={{ color: '#64748B', fontSize: 12, fontWeight: '600', marginTop: 2 }}>{item.subtitle1}</Text>
                        <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '600', marginTop: 2 }}>{item.subtitle2}</Text>
                        
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                          <View style={{
                            backgroundColor: item.category === 'delivery' ? '#FFEDD5' : '#ECFCCB',
                            paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8
                          }}>
                            <Text style={{
                              color: item.category === 'delivery' ? '#C2410C' : '#163316',
                              fontSize: 10, fontWeight: '800'
                            }}>
                              {item.categoryLabel}
                            </Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '600', marginBottom: 8 }}>{item.time}</Text>
                      <View style={{ backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 }}>
                        <Text style={{ color: '#475569', fontSize: 11, fontWeight: '700' }}>{item.extraBadge}</Text>
                      </View>
                    </View>
                  </View>

                  {/* ACTION BUTTONS (REJECT & APPROVE) */}
                  <View style={{ flexDirection: 'row', gap: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F8FAFC' }}>
                    <TouchableOpacity 
                      onPress={() => handleReject(item)}
                      style={{
                        flex: 1, height: 44, borderRadius: 14, borderWidth: 1.5, borderColor: '#FDA4AF',
                        backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', flexDirection: 'row'
                      }}
                    >
                      <X size={16} color="#E11D48" style={{ marginRight: 6 }} />
                      <Text style={{ color: '#E11D48', fontWeight: '800', fontSize: 13 }}>Reject</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      onPress={() => handleApprove(item)}
                      style={{
                        flex: 1, height: 44, borderRadius: 14, backgroundColor: '#163316',
                        alignItems: 'center', justifyContent: 'center', flexDirection: 'row'
                      }}
                    >
                      <Check size={16} color="#D2FC52" style={{ marginRight: 6 }} />
                      <Text style={{ color: '#D2FC52', fontWeight: '900', fontSize: 13 }}>Approve</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* SECTION: YESTERDAY */}
        {yesterdayRequests.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 15, marginBottom: 12 }}>Yesterday</Text>

            <View style={{ gap: 14 }}>
              {yesterdayRequests.map(item => (
                <View 
                  key={item.id}
                  style={{
                    backgroundColor: '#FFFFFF', borderRadius: 24, padding: 16,
                    borderWidth: 1, borderColor: '#F1F5F9',
                    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.04, shadowRadius: 8, elevation: 2
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', flex: 1, paddingRight: 10 }}>
                      <View style={{
                        width: 44, height: 44, borderRadius: 16, backgroundColor: item.bgColor,
                        alignItems: 'center', justifyContent: 'center', marginRight: 12
                      }}>
                        <Users size={22} color={item.iconColor} />
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 15 }}>{item.name}</Text>
                        <Text style={{ color: '#64748B', fontSize: 12, fontWeight: '600', marginTop: 2 }}>{item.subtitle1}</Text>
                        <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '600', marginTop: 2 }}>{item.subtitle2}</Text>
                        
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                          <View style={{ backgroundColor: '#ECFCCB', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 }}>
                            <Text style={{ color: '#163316', fontSize: 10, fontWeight: '800' }}>{item.categoryLabel}</Text>
                          </View>
                        </View>
                      </View>
                    </View>

                    <View style={{ alignItems: 'flex-end' }}>
                      <Text style={{ color: '#64748B', fontSize: 10, fontWeight: '600', marginBottom: 8 }}>{item.time}</Text>
                      <View style={{ backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 }}>
                        <Text style={{ color: '#475569', fontSize: 11, fontWeight: '700' }}>{item.extraBadge}</Text>
                      </View>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', gap: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F8FAFC' }}>
                    <TouchableOpacity 
                      onPress={() => handleReject(item)}
                      style={{
                        flex: 1, height: 44, borderRadius: 14, borderWidth: 1.5, borderColor: '#FDA4AF',
                        backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', flexDirection: 'row'
                      }}
                    >
                      <X size={16} color="#E11D48" style={{ marginRight: 6 }} />
                      <Text style={{ color: '#E11D48', fontWeight: '800', fontSize: 13 }}>Reject</Text>
                    </TouchableOpacity>

                    <TouchableOpacity 
                      onPress={() => handleApprove(item)}
                      style={{
                        flex: 1, height: 44, borderRadius: 14, backgroundColor: '#163316',
                        alignItems: 'center', justifyContent: 'center', flexDirection: 'row'
                      }}
                    >
                      <Check size={16} color="#D2FC52" style={{ marginRight: 6 }} />
                      <Text style={{ color: '#D2FC52', fontWeight: '900', fontSize: 13 }}>Approve</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* BOTTOM SAFETY NOTICE BANNER CARD */}
        <View style={{
          backgroundColor: '#F8FAFC', borderRadius: 20, padding: 14,
          borderWidth: 1, borderColor: '#E2E8F0', flexDirection: 'row',
          alignItems: 'center'
        }}>
          <View style={{
            width: 36, height: 36, borderRadius: 12, backgroundColor: '#ECFCCB',
            alignItems: 'center', justifyContent: 'center', marginRight: 12
          }}>
            <ShieldCheck size={20} color="#163316" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 12 }}>
              Please verify the details before approving any request.
            </Text>
            <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '500', marginTop: 2 }}>
              Your approval helps keep the community safe.
            </Text>
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
