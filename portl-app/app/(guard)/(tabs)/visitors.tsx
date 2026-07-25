import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, UserCheck, Clock, Phone, ChevronRight, UserPlus } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export default function GuardVisitorsScreen() {
  const router = useRouter();
  const [search, setSearch] = useState('');

  const waitingVisitors = [
    {
      id: 'v1',
      name: 'Amit Verma',
      flat: 'Flat A-1203 • Tower A',
      purpose: 'Maintenance Work',
      time: 'Arrived 10:20 AM',
      status: 'Waiting',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 'v2',
      name: 'Rahul Sharma',
      flat: 'Flat B-302 • Tower B',
      purpose: 'Amazon Delivery',
      time: 'Arrived 10:28 AM',
      status: 'Waiting',
      photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
    },
    {
      id: 'v3',
      name: 'Priya Verma',
      flat: 'Flat C-501 • Tower C',
      purpose: 'Guest Visit',
      time: 'Arrived 10:35 AM',
      status: 'Waiting',
      photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80'
    }
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FB' }}>
      {/* HEADER */}
      <View style={{
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, backgroundColor: '#FFFFFF',
        borderBottomWidth: 1, borderBottomColor: '#F1F5F9'
      }}>
        <View>
          <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 20 }}>Gate Visitors</Text>
          <Text style={{ color: '#94A3B8', fontSize: 12, fontWeight: '600', marginTop: 2 }}>
            Manage waiting visitors & entries
          </Text>
        </View>

        <TouchableOpacity 
          onPress={() => router.push('/(guard)/register-visitor')}
          style={{
            backgroundColor: '#163316', paddingHorizontal: 14, paddingVertical: 8,
            borderRadius: 20, flexDirection: 'row', alignItems: 'center'
          }}
        >
          <UserPlus size={14} color="#D2FC52" style={{ marginRight: 6 }} />
          <Text style={{ color: '#D2FC52', fontWeight: '800', fontSize: 12 }}>New Entry</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 16 }} showsVerticalScrollIndicator={false}>
        {/* SEARCH */}
        <View style={{
          backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#F1F5F9',
          borderRadius: 16, paddingHorizontal: 14, height: 48, flexDirection: 'row',
          alignItems: 'center', marginBottom: 16
        }}>
          <Search size={18} color="#94A3B8" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Search visitor name or flat number..."
            placeholderTextColor="#94A3B8"
            value={search}
            onChangeText={setSearch}
            style={{ flex: 1, color: '#0F172A', fontWeight: '600', fontSize: 13 }}
          />
        </View>

        {/* LIST */}
        {waitingVisitors.map(v => (
          <TouchableOpacity
            key={v.id}
            onPress={() => Alert.alert('Visitor Entry', `Verifying entry for ${v.name}`)}
            style={{
              backgroundColor: '#FFFFFF', borderRadius: 20, padding: 14,
              marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9',
              flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 10 }}>
              <Image 
                source={{ uri: v.photo }} 
                style={{ width: 48, height: 48, borderRadius: 16, marginRight: 12, backgroundColor: '#E2E8F0' }} 
              />
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 14 }}>{v.name}</Text>
                <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '600', marginTop: 2 }}>{v.flat}</Text>
                <Text style={{ color: '#163316', fontSize: 11, fontWeight: '700', marginTop: 4 }}>{v.purpose}</Text>
              </View>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <View style={{ backgroundColor: '#ECFCCB', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginBottom: 6 }}>
                <Text style={{ color: '#163316', fontSize: 10, fontWeight: '800' }}>{v.status}</Text>
              </View>
              <Text style={{ color: '#94A3B8', fontSize: 10, fontWeight: '600' }}>{v.time}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
