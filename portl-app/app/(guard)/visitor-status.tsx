import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../services/supabase/client';
import { CheckCircle2, XCircle, Clock, ArrowLeft, ShieldCheck } from 'lucide-react-native';

export default function VisitorStatusScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [visitorName, setVisitorName] = useState('Visitor');

  useEffect(() => {
    // Initial fetch
    const fetchVisitor = async () => {
      if (!id) return;
      try {
        const { data } = await supabase.from('visitors').select('status, name').eq('id', id).single();
        if (data) {
          setStatus(data.status);
          if (data.name) setVisitorName(data.name);
        }
      } catch (e) {
        console.log('Visitor fetch error:', e);
      }
    };
    fetchVisitor();

    // Subscribe to realtime updates
    if (id) {
      const subscription = supabase
        .channel(`visitor_status_${id}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'visitors', filter: `id=eq.${id}` },
          (payload) => {
            if (payload?.new?.status) setStatus(payload.new.status);
          }
        )
        .subscribe();

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [id]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FB' }}>
      {/* TOP HEADER */}
      <View style={{
        paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, backgroundColor: '#FFFFFF',
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        borderBottomWidth: 1, borderBottomColor: '#F1F5F9'
      }}>
        <TouchableOpacity
          onPress={() => router.replace('/(guard)/(tabs)')}
          style={{
            width: 40, height: 40, borderRadius: 20, backgroundColor: '#F8FAFC',
            alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#F1F5F9'
          }}
        >
          <ArrowLeft size={20} color="#1E293B" />
        </TouchableOpacity>

        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 18 }}>Visitor Approval Status</Text>
          <Text style={{ color: '#94A3B8', fontSize: 12, fontWeight: '600', marginTop: 2 }}>Gate Approval Tracker</Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
        {status === 'approved' ? (
          <View style={{ alignItems: 'center', width: '100%' }}>
            <View style={{
              width: 96, height: 96, borderRadius: 48, backgroundColor: '#ECFCCB',
              alignItems: 'center', justifyContent: 'center', marginBottom: 20,
              borderWidth: 3, borderColor: '#163316'
            }}>
              <CheckCircle2 size={54} color="#163316" />
            </View>
            <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 26, textAlign: 'center' }}>
              Entry Approved! 🎉
            </Text>
            <Text style={{ color: '#64748B', fontSize: 14, fontWeight: '600', textAlign: 'center', marginTop: 8, lineHeight: 22 }}>
              Resident has approved gate entry for <Text style={{ color: '#163316', fontWeight: '800' }}>{visitorName}</Text>.
            </Text>
          </View>
        ) : status === 'rejected' ? (
          <View style={{ alignItems: 'center', width: '100%' }}>
            <View style={{
              width: 96, height: 96, borderRadius: 48, backgroundColor: '#FFE4E6',
              alignItems: 'center', justifyContent: 'center', marginBottom: 20,
              borderWidth: 3, borderColor: '#E11D48'
            }}>
              <XCircle size={54} color="#E11D48" />
            </View>
            <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 26, textAlign: 'center' }}>
              Entry Denied ❌
            </Text>
            <Text style={{ color: '#64748B', fontSize: 14, fontWeight: '600', textAlign: 'center', marginTop: 8, lineHeight: 22 }}>
              Resident has rejected gate entry for <Text style={{ color: '#E11D48', fontWeight: '800' }}>{visitorName}</Text>.
            </Text>
          </View>
        ) : (
          <View style={{ alignItems: 'center', width: '100%' }}>
            <View style={{
              width: 96, height: 96, borderRadius: 48, backgroundColor: '#F4FBE4',
              alignItems: 'center', justifyContent: 'center', marginBottom: 20,
              borderWidth: 3, borderColor: '#D2FC52', position: 'relative'
            }}>
              <ActivityIndicator size="large" color="#163316" style={{ position: 'absolute' }} />
              <Clock size={36} color="#163316" />
            </View>
            <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 26, textAlign: 'center' }}>
              Waiting for Resident... ⏳
            </Text>
            <Text style={{ color: '#64748B', fontSize: 14, fontWeight: '600', textAlign: 'center', marginTop: 8, lineHeight: 22 }}>
              Notification sent to flat resident. Real-time gate status will update automatically.
            </Text>
          </View>
        )}
      </View>

      {/* FOOTER BUTTON */}
      <View style={{ paddingHorizontal: 24, paddingBottom: 32 }}>
        <TouchableOpacity 
          onPress={() => router.replace('/(guard)/(tabs)')}
          style={{
            backgroundColor: '#163316', paddingVertical: 16, borderRadius: 20,
            alignItems: 'center', justifyContent: 'center',
            shadowColor: '#163316', shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2, shadowRadius: 8, elevation: 4
          }}
        >
          <Text style={{ color: '#D2FC52', fontWeight: '900', fontSize: 16 }}>Back to Guard Dashboard</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
