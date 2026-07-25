import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Shield, Clock, Phone, MapPin, LogOut, ChevronRight, Bell, HelpCircle } from 'lucide-react-native';
import { useAuthStore } from '../../../store/authStore';
import { useRouter } from 'expo-router';

export default function GuardProfileScreen() {
  const router = useRouter();
  const { signOut } = useAuthStore();

  const handleSignOut = () => {
    Alert.alert('Logout', 'Are you sure you want to log out of Guard Duty?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: () => {
        signOut();
        router.replace('/(auth)/login');
      }}
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FB' }}>
      <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 16 }} showsVerticalScrollIndicator={false}>
        {/* PROFILE HEADER */}
        <View style={{
          backgroundColor: '#FFFFFF', borderRadius: 28, padding: 20,
          alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 20
        }}>
          <View style={{ position: 'relative', marginBottom: 12 }}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=400&q=80' }} 
              style={{ width: 84, height: 84, borderRadius: 42, borderWidth: 3, borderColor: '#163316' }} 
            />
            <View style={{
              position: 'absolute', bottom: 2, right: 2, width: 18, height: 18,
              borderRadius: 9, backgroundColor: '#22C55E', borderWidth: 3, borderColor: '#FFFFFF'
            }} />
          </View>

          <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 22 }}>Rajesh Kumar</Text>
          
          <View style={{
            backgroundColor: '#ECFCCB', paddingHorizontal: 12, paddingVertical: 4,
            borderRadius: 12, marginTop: 6, flexDirection: 'row', alignItems: 'center'
          }}>
            <Shield size={12} color="#163316" style={{ marginRight: 4 }} />
            <Text style={{ color: '#163316', fontWeight: '800', fontSize: 11 }}>Security Guard</Text>
          </View>

          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <MapPin size={14} color="#64748B" style={{ marginRight: 4 }} />
            <Text style={{ color: '#64748B', fontWeight: '600', fontSize: 12 }}>Tower A Main Gate</Text>
          </View>
        </View>

        {/* SHIFT INFO CARD */}
        <View style={{
          backgroundColor: '#163316', borderRadius: 24, padding: 18,
          marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <View>
            <Text style={{ color: '#E2F898', fontWeight: '700', fontSize: 11 }}>CURRENT SHIFT</Text>
            <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 18, marginTop: 2 }}>Morning Shift</Text>
            <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '600', marginTop: 4 }}>08:00 AM – 08:00 PM</Text>
          </View>
          <View style={{
            backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: 12,
            paddingVertical: 6, borderRadius: 12
          }}>
            <Text style={{ color: '#BEF264', fontWeight: '800', fontSize: 11 }}>● ON DUTY</Text>
          </View>
        </View>

        {/* OPTIONS */}
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 8, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 20 }}>
          <TouchableOpacity 
            onPress={() => Alert.alert('Gate Roster', 'Shift Schedule: Mon-Fri Main Gate')}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Clock size={18} color="#163316" style={{ marginRight: 12 }} />
              <Text style={{ color: '#0F172A', fontWeight: '700', fontSize: 13 }}>Shift Roster & Schedule</Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => Alert.alert('Gate Contacts', 'Admin Desk: 9876543210')}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Phone size={18} color="#163316" style={{ marginRight: 12 }} />
              <Text style={{ color: '#0F172A', fontWeight: '700', fontSize: 13 }}>Gate Emergency Contacts</Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleSignOut}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <LogOut size={18} color="#EF4444" style={{ marginRight: 12 }} />
              <Text style={{ color: '#EF4444', fontWeight: '800', fontSize: 13 }}>Logout from Guard Duty</Text>
            </View>
            <ChevronRight size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
