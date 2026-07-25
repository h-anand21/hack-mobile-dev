import React from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, Image, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  Menu, Settings, ShieldCheck, Calendar, Clock, CheckCircle2, 
  Star, User, Folder, Lock, Bell, Headphones, LogOut, ChevronRight, Building, IdCard, Phone 
} from 'lucide-react-native';
import { useAuthStore } from '../../../store/authStore';

export default function GuardProfileScreen() {
  const router = useRouter();
  const { signOut } = useAuthStore();

  const handleSignOut = () => {
    Alert.alert(
      'Confirm Logout',
      'Are you sure you want to log out of Guard Duty?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive', 
          onPress: () => {
            signOut();
            router.replace('/(auth)/login');
          }
        }
      ]
    );
  };

  const profileOptions = [
    {
      id: 'p1',
      title: 'Personal Information',
      subtitle: 'View and update your personal details',
      icon: User,
      action: () => Alert.alert('Personal Information', 'Guard Name: Ramesh Kumar\nPhone: 98765 43210\nEmp ID: GRD1024')
    },
    {
      id: 'p2',
      title: 'Duty & Shift Details',
      subtitle: 'View your duty schedule and shift timings',
      icon: Clock,
      action: () => Alert.alert('Duty Schedule', 'Current Shift: Morning Shift (08:00 AM - 08:00 PM)\nGate: Tower A Main Gate')
    },
    {
      id: 'p3',
      title: 'Documents',
      subtitle: 'View your ID proof and related documents',
      icon: Folder,
      action: () => Alert.alert('Guard Documents', 'Aadhaar Verified ✅\nSecurity Clearance Verified ✅')
    },
    {
      id: 'p4',
      title: 'Security & Login',
      subtitle: 'Change password and security settings',
      icon: Lock,
      action: () => Alert.alert('Security Settings', 'Password & Biometric Auth active')
    },
    {
      id: 'p5',
      title: 'Notifications',
      subtitle: 'Manage your notification preferences',
      icon: Bell,
      action: () => Alert.alert('Notification Settings', 'Gate alerts & SOS sounds turned ON')
    },
    {
      id: 'p6',
      title: 'Help & Support',
      subtitle: 'Get help and contact support team',
      icon: Headphones,
      action: () => Alert.alert('Society Help Desk', 'Security Admin Desk: +91 98765 43210\nEmail: support@gately.com')
    }
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FB' }}>
      {/* TOP HEADER BAR */}
      <View style={{
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, backgroundColor: '#FFFFFF',
        borderBottomWidth: 1, borderBottomColor: '#F1F5F9'
      }}>
        <TouchableOpacity 
          onPress={() => Alert.alert('Menu', 'Guard Settings Options')}
          style={{
            width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8FAFC',
            alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F1F5F9'
          }}
        >
          <Menu size={20} color="#1E293B" />
        </TouchableOpacity>

        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 18 }}>Guard Profile</Text>
          <Text style={{ color: '#94A3B8', fontSize: 12, fontWeight: '600', marginTop: 2 }}>
            View and manage your profile
          </Text>
        </View>

        <TouchableOpacity 
          onPress={() => Alert.alert('Settings', 'Guard Panel Preferences')}
          style={{
            width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8FAFC',
            alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F1F5F9'
          }}
        >
          <Settings size={20} color="#1E293B" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* GUARD HERO CARD (DARK GREEN) */}
        <View style={{
          backgroundColor: '#163316', borderRadius: 28, padding: 20,
          marginBottom: 20, shadowColor: '#163316', shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.25, shadowRadius: 12, elevation: 6
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 18 }}>
            {/* AVATAR WITH ONLINE DOT */}
            <View style={{ position: 'relative', marginRight: 16 }}>
              <Image 
                source={{ uri: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80' }} 
                style={{ width: 76, height: 76, borderRadius: 38, borderWidth: 3, borderColor: '#D2FC52' }} 
              />
              <View style={{
                position: 'absolute', bottom: 2, right: 2, width: 16, height: 16,
                borderRadius: 8, backgroundColor: '#22C55E', borderWidth: 3, borderColor: '#163316'
              }} />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 20 }}>Ramesh Kumar</Text>
              
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 8 }}>
                <Text style={{ color: '#BEF264', fontWeight: '800', fontSize: 12 }}>Security Guard</Text>
                <View style={{ backgroundColor: 'rgba(34, 197, 94, 0.25)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 }}>
                  <Text style={{ color: '#BEF264', fontWeight: '900', fontSize: 9 }}>● On Duty</Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                <Building size={12} color="#94A3B8" style={{ marginRight: 4 }} />
                <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '500' }}>Tower A - Main Gate</Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                <IdCard size={12} color="#94A3B8" style={{ marginRight: 4 }} />
                <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '500' }}>EMP ID: GRD1024</Text>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                <Phone size={12} color="#94A3B8" style={{ marginRight: 4 }} />
                <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '500' }}>98765 43210</Text>
              </View>
            </View>
          </View>

          {/* BOTTOM METRICS STRIP (4 METRIC COLUMNS) */}
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 20, padding: 14,
            flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
          }}>
            {/* Col 1: Experience */}
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Calendar size={14} color="#D2FC52" style={{ marginBottom: 4 }} />
              <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 13 }}>1.5 Years</Text>
              <Text style={{ color: '#94A3B8', fontSize: 9, fontWeight: '600', marginTop: 2 }}>Experience</Text>
            </View>

            <View style={{ width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.15)' }} />

            {/* Col 2: Performance */}
            <View style={{ flex: 1, alignItems: 'center' }}>
              <ShieldCheck size={14} color="#D2FC52" style={{ marginBottom: 4 }} />
              <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 13 }}>98%</Text>
              <Text style={{ color: '#94A3B8', fontSize: 9, fontWeight: '600', marginTop: 2 }}>Performance</Text>
            </View>

            <View style={{ width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.15)' }} />

            {/* Col 3: Duties Completed */}
            <View style={{ flex: 1, alignItems: 'center' }}>
              <CheckCircle2 size={14} color="#D2FC52" style={{ marginBottom: 4 }} />
              <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 13 }}>128</Text>
              <Text style={{ color: '#94A3B8', fontSize: 9, fontWeight: '600', marginTop: 2 }}>Duties Completed</Text>
            </View>

            <View style={{ width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.15)' }} />

            {/* Col 4: Rating */}
            <View style={{ flex: 1, alignItems: 'center' }}>
              <Star size={14} color="#D2FC52" style={{ marginBottom: 4 }} />
              <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 13 }}>4.8 ★</Text>
              <Text style={{ color: '#94A3B8', fontSize: 9, fontWeight: '600', marginTop: 2 }}>Rating</Text>
            </View>
          </View>
        </View>

        {/* PROFILE OPTIONS CARD LIST */}
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 8, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 20 }}>
          {profileOptions.map((opt, idx) => {
            const IconComp = opt.icon;
            return (
              <TouchableOpacity
                key={opt.id}
                onPress={opt.action}
                style={{
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                  paddingVertical: 14, paddingHorizontal: 10,
                  borderBottomWidth: idx < profileOptions.length - 1 ? 1 : 0,
                  borderBottomColor: '#F8FAFC'
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 10 }}>
                  <View style={{
                    width: 40, height: 40, borderRadius: 14, backgroundColor: '#ECFCCB',
                    alignItems: 'center', justifyContent: 'center', marginRight: 14
                  }}>
                    <IconComp size={20} color="#163316" />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 13 }}>{opt.title}</Text>
                    <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '500', marginTop: 2 }}>{opt.subtitle}</Text>
                  </View>
                </View>

                <ChevronRight size={16} color="#94A3B8" />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* TODAY'S DUTY CARD */}
        <View style={{
          backgroundColor: '#FFFFFF', borderRadius: 24, padding: 18,
          borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 20
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Calendar size={18} color="#163316" style={{ marginRight: 8 }} />
              <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 15 }}>Today’s Duty</Text>
            </View>

            <View style={{ backgroundColor: '#ECFCCB', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 10 }}>
              <Text style={{ color: '#163316', fontWeight: '800', fontSize: 10 }}>Ongoing</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#64748B', fontSize: 10, fontWeight: '700' }}>Shift Time</Text>
              <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 13, marginTop: 2 }}>08:00 AM - 08:00 PM</Text>
            </View>

            <View style={{ flex: 1, borderLeftWidth: 1, borderLeftColor: '#F1F5F9', paddingLeft: 12 }}>
              <Text style={{ color: '#64748B', fontSize: 10, fontWeight: '700' }}>Post</Text>
              <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 13, marginTop: 2 }}>Main Gate</Text>
            </View>

            <View style={{ flex: 1, borderLeftWidth: 1, borderLeftColor: '#F1F5F9', paddingLeft: 12, alignItems: 'flex-end' }}>
              <Text style={{ color: '#64748B', fontSize: 10, fontWeight: '700' }}>Check-in</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                <Text style={{ color: '#163316', fontWeight: '900', fontSize: 13, marginRight: 4 }}>08:02 AM</Text>
                <CheckCircle2 size={14} color="#22C55E" />
              </View>
            </View>
          </View>
        </View>

        {/* THANK YOU BANNER CARD */}
        <View style={{
          backgroundColor: '#F8FAFC', borderRadius: 20, padding: 14,
          borderWidth: 1, borderColor: '#E2E8F0', flexDirection: 'row',
          alignItems: 'center', marginBottom: 20
        }}>
          <View style={{
            width: 36, height: 36, borderRadius: 12, backgroundColor: '#ECFCCB',
            alignItems: 'center', justifyContent: 'center', marginRight: 12
          }}>
            <ShieldCheck size={20} color="#163316" />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 12 }}>
              Thank you for keeping the community safe and secure.
            </Text>
            <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '500', marginTop: 2 }}>
              Your dedication makes a difference!
            </Text>
          </View>
        </View>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity 
          onPress={handleSignOut}
          style={{
            backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#FECDD3',
            height: 52, borderRadius: 20, alignItems: 'center', justifyContent: 'center',
            flexDirection: 'row', marginBottom: 20
          }}
        >
          <LogOut size={18} color="#E11D48" style={{ marginRight: 8 }} />
          <Text style={{ color: '#E11D48', fontWeight: '900', fontSize: 14 }}>Logout</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}
