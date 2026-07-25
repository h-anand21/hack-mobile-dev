import React, { useEffect, useState } from 'react';
import { 
  View, Text, TouchableOpacity, ScrollView, RefreshControl, Image, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../../store/authStore';
import { useRouter } from 'expo-router';
import { 
  Menu, Bell, Shield, Clock, Users, ClipboardList, UserCheck, 
  BellRing, UserPlus, Package, Car, QrCode, ChevronRight, Siren, CheckCircle, ArrowUpRight 
} from 'lucide-react-native';
import { supabase } from '../../../services/supabase/client';

export default function GuardDashboard() {
  const { user, societyId } = useAuthStore();
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const [recentEntries, setRecentEntries] = useState([
    {
      id: 'e1',
      name: 'Amit Verma',
      subtitle: 'Flat A-1203, Tower A',
      note: 'Visiting for: Maintenance',
      status: 'IN',
      time: '10:20 AM',
      type: 'person'
    },
    {
      id: 'e2',
      name: 'WB 20 AB 1234',
      subtitle: 'Resident Vehicle',
      note: 'Tower A Parking',
      status: 'IN',
      time: '09:45 AM',
      type: 'vehicle'
    },
    {
      id: 'e3',
      name: 'Amazon Delivery',
      subtitle: 'Delivery for: Flat B-902',
      note: 'Receiver: Neha Sharma',
      status: 'OUT',
      time: '09:30 AM',
      type: 'parcel'
    }
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const handleSosTrigger = () => {
    Alert.alert(
      '🚨 EMERGENCY SOS ALERT',
      'Are you sure you want to trigger a Gate Emergency Alarm to all society residents and admin?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'TRIGGER SOS', 
          style: 'destructive',
          onPress: () => Alert.alert('🚨 ALARM ACTIVE', 'Emergency alert broadcasted to society admins & residents!')
        }
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FB' }}>
      {/* TOP HEADER BAR */}
      <View style={{
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingTop: 8, paddingBottom: 14, backgroundColor: '#FFFFFF',
        borderBottomWidth: 1, borderBottomColor: '#F1F5F9'
      }}>
        <TouchableOpacity 
          onPress={() => Alert.alert('Menu', 'Guard Panel Options')}
          style={{
            width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8FAFC',
            alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F1F5F9'
          }}
        >
          <Menu size={20} color="#1E293B" />
        </TouchableOpacity>

        {/* CENTER GATELY OFFICIAL LOGO */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Image 
            source={require('../../../assets/logo.png')} 
            style={{ width: 32, height: 32, marginRight: 6 }} 
            resizeMode="contain" 
          />
          <Text style={{ color: '#163316', fontWeight: '900', fontSize: 18, letterSpacing: 0.5 }}>
            Gately
          </Text>
        </View>

        <TouchableOpacity 
          onPress={() => Alert.alert('Notifications', '3 Gate Alerts Pending')}
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
        {/* GUARD PROFILE HEADER */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <View style={{ flex: 1, paddingRight: 10 }}>
            <Text style={{ color: '#64748B', fontSize: 13, fontWeight: '600' }}>Good Morning,</Text>
            <Text style={{ color: '#0F172A', fontSize: 24, fontWeight: '900', letterSpacing: -0.5 }}>
              Rajesh Kumar
            </Text>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 8 }}>
              <View style={{
                backgroundColor: '#ECFCCB', paddingHorizontal: 10, paddingVertical: 4,
                borderRadius: 12, flexDirection: 'row', alignItems: 'center'
              }}>
                <Shield size={12} color="#163316" style={{ marginRight: 4 }} />
                <Text style={{ color: '#163316', fontWeight: '800', fontSize: 11 }}>Security Guard</Text>
              </View>
            </View>

            <Text style={{ color: '#64748B', fontSize: 12, fontWeight: '600', marginTop: 6 }}>
              📍 Tower A Main Gate
            </Text>
          </View>

          {/* GUARD AVATAR WITH ONLINE DOT */}
          <View style={{ position: 'relative' }}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80' }} 
              style={{ width: 68, height: 68, borderRadius: 34, borderWidth: 2, borderColor: '#D2FC52' }} 
            />
            <View style={{
              position: 'absolute', bottom: 2, right: 2, width: 14, height: 14,
              borderRadius: 7, backgroundColor: '#22C55E', borderWidth: 2.5, borderColor: '#FFFFFF'
            }} />
          </View>
        </View>

        {/* STATUS BANNER CARD (DARK GREEN) */}
        <View style={{
          backgroundColor: '#163316', borderRadius: 24, padding: 18,
          marginBottom: 22, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
          shadowColor: '#163316', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 10, elevation: 4
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 12 }}>
            <View style={{
              width: 48, height: 48, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.15)',
              alignItems: 'center', justifyContent: 'center', marginRight: 14
            }}>
              <Shield size={24} color="#D2FC52" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 16 }}>You're On Duty</Text>
              <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '500', marginTop: 2 }}>
                Stay alert & keep the community safe.
              </Text>
            </View>
          </View>

          <View style={{ borderLeftWidth: 1, borderLeftColor: 'rgba(255,255,255,0.15)', paddingLeft: 14, alignItems: 'flex-end' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
              <Clock size={12} color="#94A3B8" style={{ marginRight: 4 }} />
              <Text style={{ color: '#94A3B8', fontSize: 10, fontWeight: '600' }}>Duty Ends At</Text>
            </View>
            <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 18 }}>08:00 PM</Text>
            <View style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginTop: 4 }}>
              <Text style={{ color: '#BEF264', fontWeight: '800', fontSize: 9 }}>● ONLINE</Text>
            </View>
          </View>
        </View>

        {/* LIVE ACTIVITY SECTION (STAT CARDS) */}
        <View style={{ marginBottom: 22 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 16 }}>Live Activity</Text>
            <TouchableOpacity onPress={() => router.push('/(guard)/(tabs)/history')} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: '#163316', fontWeight: '700', fontSize: 12, marginRight: 2 }}>View All</Text>
              <ChevronRight size={14} color="#163316" />
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: 'row', gap: 10 }}>
            {/* Card 1: Waiting Visitors */}
            <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 14, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
              <View style={{ width: 34, height: 34, borderRadius: 12, backgroundColor: '#ECFCCB', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <Users size={18} color="#163316" />
              </View>
              <Text style={{ color: '#64748B', fontSize: 10, fontWeight: '700' }}>Waiting Visitors</Text>
              <Text style={{ color: '#0F172A', fontSize: 22, fontWeight: '900', marginTop: 2 }}>03</Text>
              <Text style={{ color: '#94A3B8', fontSize: 9, fontWeight: '600', marginTop: 2 }}>Today</Text>
            </View>

            {/* Card 2: Pending Approvals */}
            <TouchableOpacity 
              onPress={() => router.push('/(guard)/pending-approvals')}
              style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 14, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}
            >
              <View style={{ width: 34, height: 34, borderRadius: 12, backgroundColor: '#ECFCCB', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <ClipboardList size={18} color="#163316" />
              </View>
              <Text style={{ color: '#64748B', fontSize: 10, fontWeight: '700' }}>Pending Approvals</Text>
              <Text style={{ color: '#0F172A', fontSize: 22, fontWeight: '900', marginTop: 2 }}>02</Text>
              <Text style={{ color: '#94A3B8', fontSize: 9, fontWeight: '600', marginTop: 2 }}>Today</Text>
            </TouchableOpacity>

            {/* Card 3: Expected Guests */}
            <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 14, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
              <View style={{ width: 34, height: 34, borderRadius: 12, backgroundColor: '#ECFCCB', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <UserCheck size={18} color="#163316" />
              </View>
              <Text style={{ color: '#64748B', fontSize: 10, fontWeight: '700' }}>Expected Guests</Text>
              <Text style={{ color: '#0F172A', fontSize: 22, fontWeight: '900', marginTop: 2 }}>09</Text>
              <Text style={{ color: '#94A3B8', fontSize: 9, fontWeight: '600', marginTop: 2 }}>Today</Text>
            </View>

            {/* Card 4: Emergency Alerts */}
            <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 14, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
              <View style={{ width: 34, height: 34, borderRadius: 12, backgroundColor: '#FFE4E6', alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                <BellRing size={18} color="#E11D48" />
              </View>
              <Text style={{ color: '#64748B', fontSize: 10, fontWeight: '700' }}>Emergency Alerts</Text>
              <Text style={{ color: '#E11D48', fontSize: 22, fontWeight: '900', marginTop: 2 }}>01</Text>
              <Text style={{ color: '#94A3B8', fontSize: 9, fontWeight: '600', marginTop: 2 }}>Today</Text>
            </View>
          </View>
        </View>

        {/* QUICK ACTIONS (2x2 GRID) */}
        <View style={{ marginBottom: 22 }}>
          <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 16, marginBottom: 12 }}>Quick Actions</Text>

          <View style={{ gap: 10 }}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {/* Action 1: Register Visitor */}
              <TouchableOpacity 
                onPress={() => router.push('/(guard)/register-visitor')}
                style={{
                  flex: 1, backgroundColor: '#FFFFFF', padding: 14, borderRadius: 20,
                  borderWidth: 1, borderColor: '#F1F5F9', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: '#ECFCCB', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                    <UserPlus size={20} color="#163316" />
                  </View>
                  <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 12, flexShrink: 1 }}>
                    Register Visitor
                  </Text>
                </View>
                <ChevronRight size={16} color="#94A3B8" />
              </TouchableOpacity>

              {/* Action 2: Parcel Entry */}
              <TouchableOpacity 
                onPress={() => Alert.alert('Parcel Entry', 'Logging new courier/parcel entry for flat.')}
                style={{
                  flex: 1, backgroundColor: '#FFFFFF', padding: 14, borderRadius: 20,
                  borderWidth: 1, borderColor: '#F1F5F9', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: '#ECFCCB', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                    <Package size={20} color="#163316" />
                  </View>
                  <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 12, flexShrink: 1 }}>
                    Parcel Entry
                  </Text>
                </View>
                <ChevronRight size={16} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', gap: 10 }}>
              {/* Action 3: Vehicle Entry */}
              <TouchableOpacity 
                onPress={() => Alert.alert('Vehicle Entry', 'Logging new guest or resident vehicle entry.')}
                style={{
                  flex: 1, backgroundColor: '#FFFFFF', padding: 14, borderRadius: 20,
                  borderWidth: 1, borderColor: '#F1F5F9', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: '#ECFCCB', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                    <Car size={20} color="#163316" />
                  </View>
                  <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 12, flexShrink: 1 }}>
                    Vehicle Entry
                  </Text>
                </View>
                <ChevronRight size={16} color="#94A3B8" />
              </TouchableOpacity>

              {/* Action 4: Scan QR Code */}
              <TouchableOpacity 
                onPress={() => router.push('/(guard)/(tabs)/scanner')}
                style={{
                  flex: 1, backgroundColor: '#FFFFFF', padding: 14, borderRadius: 20,
                  borderWidth: 1, borderColor: '#F1F5F9', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: '#ECFCCB', alignItems: 'center', justifyContent: 'center', marginRight: 10 }}>
                    <QrCode size={20} color="#163316" />
                  </View>
                  <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 12, flexShrink: 1 }}>
                    Scan QR Code
                  </Text>
                </View>
                <ChevronRight size={16} color="#94A3B8" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* RECENT ENTRIES TIMELINE SECTION */}
        <View style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 16 }}>Recent Entries</Text>
            <TouchableOpacity onPress={() => router.push('/(guard)/(tabs)/history')} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: '#163316', fontWeight: '700', fontSize: 12, marginRight: 2 }}>View All</Text>
              <ChevronRight size={14} color="#163316" />
            </TouchableOpacity>
          </View>

          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 16, borderWidth: 1, borderColor: '#F1F5F9' }}>
            {recentEntries.map((item, idx) => (
              <View key={item.id} style={{ position: 'relative' }}>
                {/* Vertical Timeline Line */}
                {idx < recentEntries.length - 1 && (
                  <View style={{
                    position: 'absolute', left: 18, top: 40, bottom: -16, width: 2, backgroundColor: '#F1F5F9', zIndex: 1
                  }} />
                )}

                <TouchableOpacity 
                  onPress={() => router.push({ pathname: '/(guard)/entry-exit', params: { name: item.name } })}
                  style={{
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                    paddingVertical: 12, zIndex: 2
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 10 }}>
                    {/* Left Icon Container */}
                    <View style={{
                      width: 38, height: 38, borderRadius: 14, backgroundColor: '#ECFCCB',
                      alignItems: 'center', justifyContent: 'center', marginRight: 12
                    }}>
                      {item.type === 'vehicle' ? (
                        <Car size={18} color="#163316" />
                      ) : item.type === 'parcel' ? (
                        <Package size={18} color="#163316" />
                      ) : (
                        <Users size={18} color="#163316" />
                      )}
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 13 }}>{item.name}</Text>
                      <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '500', marginTop: 1 }}>{item.subtitle}</Text>
                      <Text style={{ color: '#94A3B8', fontSize: 10, fontWeight: '500', marginTop: 2 }}>{item.note}</Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={{
                      backgroundColor: item.status === 'IN' ? '#ECFCCB' : '#FFEDD5',
                      paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8
                    }}>
                      <Text style={{
                        color: item.status === 'IN' ? '#163316' : '#C2410C',
                        fontWeight: '900', fontSize: 10
                      }}>
                        {item.status}
                      </Text>
                    </View>
                    <Text style={{ color: '#64748B', fontSize: 10, fontWeight: '600' }}>{item.time}</Text>
                    <ChevronRight size={14} color="#94A3B8" />
                  </View>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* FLOATING RED EMERGENCY SOS BUTTON (BOTTOM RIGHT) */}
      <TouchableOpacity 
        onPress={handleSosTrigger}
        activeOpacity={0.85}
        style={{
          position: 'absolute', bottom: 84, right: 20,
          width: 58, height: 58, borderRadius: 29,
          backgroundColor: '#EF4444',
          alignItems: 'center', justifyContent: 'center',
          shadowColor: '#EF4444', shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.4, shadowRadius: 10, elevation: 10,
          borderWidth: 3, borderColor: '#FFFFFF'
        }}
      >
        <Siren size={22} color="#FFFFFF" />
        <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 9, marginTop: 1 }}>SOS</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
