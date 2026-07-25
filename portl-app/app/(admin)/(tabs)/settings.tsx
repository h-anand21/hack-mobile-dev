import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Shield, Building, Bell, Lock, LogOut, ChevronRight } from 'lucide-react-native';
import { useAuthStore } from '../../../store/authStore';
import { useRouter } from 'expo-router';

export default function AdminSettingsScreen() {
  const router = useRouter();
  const { signOut } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out from Admin Panel?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Logout', 
        style: 'destructive',
        onPress: () => {
          signOut();
          router.replace('/(auth)/login');
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FB' }}>
      <View style={{
        paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, backgroundColor: '#FFFFFF',
        borderBottomWidth: 1, borderBottomColor: '#F1F5F9'
      }}>
        <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 20 }}>Admin Settings</Text>
        <Text style={{ color: '#94A3B8', fontSize: 12, fontWeight: '600', marginTop: 2 }}>
          Gately Grand Residency • Super Admin
        </Text>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 16 }} showsVerticalScrollIndicator={false}>
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 8, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 20 }}>
          <TouchableOpacity 
            onPress={() => Alert.alert('Society Config', 'Gately Grand Residency Config')}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Building size={18} color="#163316" style={{ marginRight: 12 }} />
              <Text style={{ color: '#0F172A', fontWeight: '700', fontSize: 13 }}>Society Profile & Towers</Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => Alert.alert('Security Settings', 'Gate Security Rules')}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Shield size={18} color="#163316" style={{ marginRight: 12 }} />
              <Text style={{ color: '#0F172A', fontWeight: '700', fontSize: 13 }}>Gate Security Rules</Text>
            </View>
            <ChevronRight size={16} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={handleLogout}
            style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 14 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <LogOut size={18} color="#EF4444" style={{ marginRight: 12 }} />
              <Text style={{ color: '#EF4444', fontWeight: '800', fontSize: 13 }}>Logout from Admin Panel</Text>
            </View>
            <ChevronRight size={16} color="#EF4444" />
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
