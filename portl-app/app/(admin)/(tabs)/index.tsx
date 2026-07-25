import React, { useEffect, useState } from 'react';
import { 
  View, Text, TouchableOpacity, ScrollView, RefreshControl, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../../store/authStore';
import { useRouter } from 'expo-router';
import { 
  Menu, Bell, Shield, Users, User, Car, Package, ClipboardList, 
  AlertTriangle, Video, UserPlus, ShieldCheck, FileText, Megaphone, 
  ChevronRight, Calendar, Clock, ArrowUpRight 
} from 'lucide-react-native';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const recentActivities = [
    {
      id: 'a1',
      title: 'New visitor Amit Verma checked-in',
      subtitle: 'Flat A-1203, Tower A',
      status: 'IN',
      time: '10:20 AM',
      type: 'user',
      badgeBg: '#ECFCCB',
      badgeColor: '#163316'
    },
    {
      id: 'a2',
      title: 'Delivery by Amazon',
      subtitle: 'For Neha Sharma (B-902)',
      status: 'PENDING',
      time: '09:45 AM',
      type: 'package',
      badgeBg: '#FFEDD5',
      badgeColor: '#C2410C'
    },
    {
      id: 'a3',
      title: 'Vehicle WB 20 AB 1234 entered',
      subtitle: 'Resident: Amit Verma (A-1203)',
      status: 'IN',
      time: '09:30 AM',
      type: 'car',
      badgeBg: '#ECFCCB',
      badgeColor: '#163316'
    },
    {
      id: 'a4',
      title: 'Unauthorized entry detected',
      subtitle: 'Gate 2 • 08:15 AM',
      status: 'ALERT',
      time: '08:15 AM',
      type: 'alert',
      badgeBg: '#FFE4E6',
      badgeColor: '#E11D48'
    }
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FB' }}>
      {/* TOP HEADER BAR */}
      <View style={{
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingTop: 8, paddingBottom: 14, backgroundColor: '#FFFFFF',
        borderBottomWidth: 1, borderBottomColor: '#F1F5F9'
      }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity 
            onPress={() => Alert.alert('Menu', 'Admin Navigation Options')}
            style={{
              width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8FAFC',
              alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F1F5F9', marginRight: 12
            }}
          >
            <Menu size={20} color="#1E293B" />
          </TouchableOpacity>

          <View>
            <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '600' }}>Welcome back,</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 1 }}>
              <Text style={{ color: '#0F172A', fontSize: 20, fontWeight: '900', letterSpacing: -0.5 }}>
                Admin
              </Text>
              <View style={{
                backgroundColor: '#ECFCCB', paddingHorizontal: 8, paddingVertical: 2,
                borderRadius: 10, flexDirection: 'row', alignItems: 'center'
              }}>
                <Shield size={10} color="#163316" style={{ marginRight: 3 }} />
                <Text style={{ color: '#163316', fontWeight: '900', fontSize: 9 }}>Super Admin</Text>
              </View>
            </View>
          </View>
        </View>

        <TouchableOpacity 
          onPress={() => Alert.alert('Notifications', '3 Society Alerts Pending')}
          style={{
            width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8FAFC',
            alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F1F5F9',
            position: 'relative'
          }}
        >
          <Bell size={20} color="#1E293B" />
          <View style={{
            position: 'absolute', top: 6, right: 6, width: 16, height: 16,
            borderRadius: 8, backgroundColor: '#163316', alignItems: 'center', justifyContent: 'center'
          }}>
            <Text style={{ color: '#D2FC52', fontSize: 9, fontWeight: '900' }}>3</Text>
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#163316" />}
      >
        {/* HERO DARK GREEN BANNER CARD */}
        <View style={{
          backgroundColor: '#163316', borderRadius: 28, padding: 18,
          marginBottom: 22, shadowColor: '#163316', shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.25, shadowRadius: 12, elevation: 6
        }}>
          {/* Top Banner Row */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 14, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.12)' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 10 }}>
              <View style={{
                width: 44, height: 44, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.15)',
                alignItems: 'center', justifyContent: 'center', marginRight: 12
              }}>
                <Shield size={22} color="#D2FC52" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 16 }}>Good Morning, Admin 👋</Text>
                <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '500', marginTop: 2 }}>
                  Everything looks good in your society.
                </Text>
              </View>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                <Calendar size={11} color="#94A3B8" style={{ marginRight: 4 }} />
                <Text style={{ color: '#94A3B8', fontSize: 10, fontWeight: '600' }}>26 May 2025</Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                <Clock size={11} color="#D2FC52" style={{ marginRight: 4 }} />
                <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 12 }}>08:30 AM</Text>
              </View>
            </View>
          </View>

          {/* Bottom Banner Row: 4 Metric Columns */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 14 }}>
            {/* Col 1: Residents */}
            <View style={{ flex: 1, alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                <Users size={12} color="#D2FC52" style={{ marginRight: 4 }} />
                <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 16 }}>256</Text>
              </View>
              <Text style={{ color: '#94A3B8', fontSize: 9, fontWeight: '700' }}>Residents</Text>
              <Text style={{ color: '#BEF264', fontSize: 8, fontWeight: '800', marginTop: 2 }}>↑ 12 this week</Text>
            </View>

            <View style={{ width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.12)' }} />

            {/* Col 2: Visitors */}
            <View style={{ flex: 1, alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                <User size={12} color="#D2FC52" style={{ marginRight: 4 }} />
                <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 16 }}>48</Text>
              </View>
              <Text style={{ color: '#94A3B8', fontSize: 9, fontWeight: '700' }}>Visitors</Text>
              <Text style={{ color: '#BEF264', fontSize: 8, fontWeight: '800', marginTop: 2 }}>↑ 8 today</Text>
            </View>

            <View style={{ width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.12)' }} />

            {/* Col 3: Vehicles */}
            <View style={{ flex: 1, alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                <Car size={12} color="#D2FC52" style={{ marginRight: 4 }} />
                <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 16 }}>32</Text>
              </View>
              <Text style={{ color: '#94A3B8', fontSize: 9, fontWeight: '700' }}>Vehicles</Text>
              <Text style={{ color: '#BEF264', fontSize: 8, fontWeight: '800', marginTop: 2 }}>↑ 5 today</Text>
            </View>

            <View style={{ width: 1, height: 28, backgroundColor: 'rgba(255,255,255,0.12)' }} />

            {/* Col 4: Deliveries */}
            <View style={{ flex: 1, alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                <Package size={12} color="#D2FC52" style={{ marginRight: 4 }} />
                <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 16 }}>16</Text>
              </View>
              <Text style={{ color: '#94A3B8', fontSize: 9, fontWeight: '700' }}>Deliveries</Text>
              <Text style={{ color: '#BEF264', fontSize: 8, fontWeight: '800', marginTop: 2 }}>↑ 3 today</Text>
            </View>
          </View>
        </View>

        {/* OVERVIEW SECTION (4 STAT CARDS) */}
        <View style={{ marginBottom: 22 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 16 }}>Overview</Text>
            <TouchableOpacity onPress={() => router.push('/(admin)/(tabs)/reports')} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: '#163316', fontWeight: '700', fontSize: 12, marginRight: 2 }}>View All</Text>
              <ChevronRight size={14} color="#163316" />
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            {/* Card 1: Active Guards */}
            <TouchableOpacity 
              onPress={() => router.push('/(admin)/(tabs)/guards')}
              style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 14, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}
            >
              <View style={{ width: 34, height: 34, borderRadius: 12, backgroundColor: '#ECFCCB', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <Shield size={18} color="#163316" />
              </View>
              <Text style={{ color: '#0F172A', fontSize: 22, fontWeight: '900' }}>7</Text>
              <Text style={{ color: '#64748B', fontSize: 10, fontWeight: '700', marginTop: 2 }}>Active Guards</Text>
              <Text style={{ color: '#163316', fontSize: 9, fontWeight: '800', marginTop: 2 }}>All On Duty</Text>
            </TouchableOpacity>

            {/* Card 2: Pending Approvals */}
            <TouchableOpacity 
              onPress={() => router.push('/(guard)/pending-approvals')}
              style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 14, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}
            >
              <View style={{ width: 34, height: 34, borderRadius: 12, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <ClipboardList size={18} color="#0284C7" />
              </View>
              <Text style={{ color: '#0F172A', fontSize: 22, fontWeight: '900' }}>12</Text>
              <Text style={{ color: '#64748B', fontSize: 10, fontWeight: '700', marginTop: 2 }}>Pending Approvals</Text>
              <Text style={{ color: '#0284C7', fontSize: 9, fontWeight: '800', marginTop: 2 }}>Needs Action</Text>
            </TouchableOpacity>

            {/* Card 3: Alerts */}
            <TouchableOpacity 
              onPress={() => Alert.alert('Gate Alerts', '3 High Priority Gate Alerts')}
              style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 14, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}
            >
              <View style={{ width: 34, height: 34, borderRadius: 12, backgroundColor: '#FFE4E6', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <AlertTriangle size={18} color="#E11D48" />
              </View>
              <Text style={{ color: '#0F172A', fontSize: 22, fontWeight: '900' }}>3</Text>
              <Text style={{ color: '#64748B', fontSize: 10, fontWeight: '700', marginTop: 2 }}>Alerts</Text>
              <Text style={{ color: '#E11D48', fontSize: 9, fontWeight: '800', marginTop: 2 }}>High Priority</Text>
            </TouchableOpacity>

            {/* Card 4: CCTV Cameras */}
            <TouchableOpacity 
              onPress={() => Alert.alert('CCTV Live Stream', 'All 28 Cameras Online')}
              style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 14, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}
            >
              <View style={{ width: 34, height: 34, borderRadius: 12, backgroundColor: '#F3E8FF', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <Video size={18} color="#7E22CE" />
              </View>
              <Text style={{ color: '#0F172A', fontSize: 22, fontWeight: '900' }}>28</Text>
              <Text style={{ color: '#64748B', fontSize: 10, fontWeight: '700', marginTop: 2 }}>CCTV Cameras</Text>
              <Text style={{ color: '#7E22CE', fontSize: 9, fontWeight: '800', marginTop: 2 }}>Online</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* QUICK ACTIONS SECTION (2x4 GRID) */}
        <View style={{ marginBottom: 22 }}>
          <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 16, marginBottom: 12 }}>Quick Actions</Text>

          <View style={{ gap: 10 }}>
            {/* Row 1 */}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity 
                onPress={() => router.push('/(admin)/(tabs)/residents')}
                style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 14, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9', alignItems: 'center' }}
              >
                <View style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: '#ECFCCB', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                  <Users size={20} color="#163316" />
                </View>
                <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 11, textAlign: 'center' }}>Manage Residents</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => router.push('/(admin)/(tabs)/guards')}
                style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 14, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9', alignItems: 'center' }}
              >
                <View style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: '#ECFCCB', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                  <Shield size={20} color="#163316" />
                </View>
                <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 11, textAlign: 'center' }}>Manage Guards</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => router.push('/(guard)/(tabs)/visitors')}
                style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 14, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9', alignItems: 'center' }}
              >
                <View style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: '#ECFCCB', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                  <UserPlus size={20} color="#163316" />
                </View>
                <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 11, textAlign: 'center' }}>Manage Visitors</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => Alert.alert('Manage Vehicles', 'Society parking & vehicle registry')}
                style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 14, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9', alignItems: 'center' }}
              >
                <View style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: '#ECFCCB', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                  <Car size={20} color="#163316" />
                </View>
                <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 11, textAlign: 'center' }}>Manage Vehicles</Text>
              </TouchableOpacity>
            </View>

            {/* Row 2 */}
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <TouchableOpacity 
                onPress={() => router.push('/(guard)/pending-approvals')}
                style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 14, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9', alignItems: 'center' }}
              >
                <View style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: '#ECFCCB', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                  <ClipboardList size={20} color="#163316" />
                </View>
                <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 11, textAlign: 'center' }}>Pending Approvals</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => router.push('/(admin)/(tabs)/reports')}
                style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 14, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9', alignItems: 'center' }}
              >
                <View style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: '#ECFCCB', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                  <FileText size={20} color="#163316" />
                </View>
                <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 11, textAlign: 'center' }}>View Reports</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => Alert.alert('CCTV Monitoring', 'Opening live society gate camera stream...')}
                style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 14, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9', alignItems: 'center' }}
              >
                <View style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: '#ECFCCB', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                  <Video size={20} color="#163316" />
                </View>
                <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 11, textAlign: 'center' }}>CCTV Monitoring</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => Alert.alert('Announcement', 'Send broadcast notice to all society residents')}
                style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 14, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9', alignItems: 'center' }}
              >
                <View style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: '#ECFCCB', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
                  <Megaphone size={20} color="#163316" />
                </View>
                <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 11, textAlign: 'center' }}>Announcement</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* RECENT ACTIVITY SECTION */}
        <View style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 16 }}>Recent Activity</Text>
            <TouchableOpacity onPress={() => router.push('/(guard)/(tabs)/history')} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: '#163316', fontWeight: '700', fontSize: 12, marginRight: 2 }}>View All</Text>
              <ChevronRight size={14} color="#163316" />
            </TouchableOpacity>
          </View>

          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 12, borderWidth: 1, borderColor: '#F1F5F9', gap: 4 }}>
            {recentActivities.map((item, idx) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => Alert.alert(item.title, `${item.subtitle}\nTime: ${item.time}`)}
                style={{
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                  paddingVertical: 10, paddingHorizontal: 6,
                  borderBottomWidth: idx < recentActivities.length - 1 ? 1 : 0,
                  borderBottomColor: '#F8FAFC'
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 10 }}>
                  <View style={{
                    width: 40, height: 40, borderRadius: 14, backgroundColor: '#ECFCCB',
                    alignItems: 'center', justifyContent: 'center', marginRight: 12
                  }}>
                    {item.type === 'car' ? (
                      <Car size={18} color="#163316" />
                    ) : item.type === 'package' ? (
                      <Package size={18} color="#163316" />
                    ) : item.type === 'alert' ? (
                      <AlertTriangle size={18} color="#E11D48" />
                    ) : (
                      <UserPlus size={18} color="#163316" />
                    )}
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 13 }}>{item.title}</Text>
                    <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '500', marginTop: 1 }}>{item.subtitle}</Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ alignItems: 'flex-end' }}>
                    <View style={{
                      backgroundColor: item.badgeBg,
                      paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginBottom: 4
                    }}>
                      <Text style={{
                        color: item.badgeColor, fontWeight: '900', fontSize: 10
                      }}>
                        {item.status}
                      </Text>
                    </View>
                    <Text style={{ color: '#64748B', fontSize: 10, fontWeight: '600' }}>{item.time}</Text>
                  </View>
                  <ChevronRight size={16} color="#94A3B8" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
