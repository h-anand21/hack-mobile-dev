import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Shield, Plus, Phone, MapPin, CheckCircle, Clock } from 'lucide-react-native';

export default function AdminGuardsScreen() {
  const guards = [
    {
      id: 'g1',
      name: 'Rajesh Kumar',
      gate: 'Tower A - Main Gate',
      empId: 'GRD1024',
      phone: '98765 43210',
      status: 'On Duty',
      shift: '08:00 AM - 08:00 PM',
      photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 'g2',
      name: 'Suresh Verma',
      gate: 'Gate 2 - Rear Entrance',
      empId: 'GRD1025',
      phone: '91234 56789',
      status: 'On Duty',
      shift: '08:00 AM - 08:00 PM',
      photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
    },
    {
      id: 'g3',
      name: 'Ramesh Patel',
      gate: 'Clubhouse Gate',
      empId: 'GRD1026',
      phone: '99887 76655',
      status: 'On Duty',
      shift: '08:00 AM - 08:00 PM',
      photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80'
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
          <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 20 }}>Manage Guards</Text>
          <Text style={{ color: '#94A3B8', fontSize: 12, fontWeight: '600', marginTop: 2 }}>
            7 Active Guards • All On Duty
          </Text>
        </View>

        <TouchableOpacity 
          onPress={() => Alert.alert('Add Guard', 'Open new guard onboarding form')}
          style={{
            backgroundColor: '#163316', paddingHorizontal: 14, paddingVertical: 8,
            borderRadius: 20, flexDirection: 'row', alignItems: 'center'
          }}
        >
          <Plus size={16} color="#D2FC52" style={{ marginRight: 4 }} />
          <Text style={{ color: '#D2FC52', fontWeight: '800', fontSize: 12 }}>Add Guard</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 16 }} showsVerticalScrollIndicator={false}>
        {guards.map(g => (
          <TouchableOpacity 
            key={g.id}
            onPress={() => Alert.alert(g.name, `${g.gate}\nEMP ID: ${g.empId}\nPhone: ${g.phone}\nShift: ${g.shift}`)}
            style={{
              backgroundColor: '#FFFFFF', borderRadius: 24, padding: 16,
              marginBottom: 12, borderWidth: 1, borderColor: '#F1F5F9',
              flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 10 }}>
              <View style={{ position: 'relative', marginRight: 12 }}>
                <Image 
                  source={{ uri: g.photo }} 
                  style={{ width: 54, height: 54, borderRadius: 27, borderWidth: 2, borderColor: '#163316' }} 
                />
                <View style={{
                  position: 'absolute', bottom: 0, right: 0, width: 14, height: 14,
                  borderRadius: 7, backgroundColor: '#22C55E', borderWidth: 2, borderColor: '#FFFFFF'
                }} />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 15 }}>{g.name}</Text>
                <Text style={{ color: '#64748B', fontSize: 12, fontWeight: '600', marginTop: 2 }}>📍 {g.gate}</Text>
                <Text style={{ color: '#94A3B8', fontSize: 11, fontWeight: '500', marginTop: 2 }}>🪪 {g.empId} • 📞 {g.phone}</Text>
              </View>
            </View>

            <View style={{ alignItems: 'flex-end' }}>
              <View style={{ backgroundColor: '#ECFCCB', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginBottom: 4 }}>
                <Text style={{ color: '#163316', fontSize: 10, fontWeight: '900' }}>● {g.status}</Text>
              </View>
              <Text style={{ color: '#64748B', fontSize: 10, fontWeight: '600' }}>{g.shift}</Text>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
