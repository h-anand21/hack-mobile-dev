import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BarChart3, Download, Users, ShieldCheck, FileText, TrendingUp } from 'lucide-react-native';

export default function AdminReportsScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FB' }}>
      <View style={{
        paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, backgroundColor: '#FFFFFF',
        borderBottomWidth: 1, borderBottomColor: '#F1F5F9'
      }}>
        <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 20 }}>Society Analytics & Reports</Text>
        <Text style={{ color: '#94A3B8', fontSize: 12, fontWeight: '600', marginTop: 2 }}>
          System activity & entry/exit logs
        </Text>
      </View>

      <ScrollView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 16 }} showsVerticalScrollIndicator={false}>
        {/* STATS OVERVIEW */}
        <View style={{ backgroundColor: '#163316', borderRadius: 24, padding: 18, marginBottom: 20 }}>
          <Text style={{ color: '#BEF264', fontWeight: '800', fontSize: 11 }}>WEEKLY AUDIT SUMMARY</Text>
          <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 22, marginTop: 4 }}>1,420 Entries Processed</Text>
          <Text style={{ color: '#94A3B8', fontSize: 12, fontWeight: '500', marginTop: 4 }}>
            99.8% Verified Entry Rate across all gates.
          </Text>
        </View>

        {/* REPORT TYPES */}
        <TouchableOpacity 
          onPress={() => Alert.alert('Export Report', 'Downloading Visitor Entry Log PDF...')}
          style={{
            backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 12,
            borderWidth: 1, borderColor: '#F1F5F9', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 42, height: 42, borderRadius: 14, backgroundColor: '#ECFCCB', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <FileText size={20} color="#163316" />
            </View>
            <View>
              <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 14 }}>Visitor Entry Report</Text>
              <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '500', marginTop: 2 }}>Full weekly & monthly visitor logs</Text>
            </View>
          </View>
          <Download size={18} color="#163316" />
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={() => Alert.alert('Export Report', 'Downloading Guard Shift Audit PDF...')}
          style={{
            backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16, marginBottom: 12,
            borderWidth: 1, borderColor: '#F1F5F9', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 42, height: 42, borderRadius: 14, backgroundColor: '#ECFCCB', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
              <ShieldCheck size={20} color="#163316" />
            </View>
            <View>
              <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 14 }}>Guard Duty Shift Audit</Text>
              <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '500', marginTop: 2 }}>Check-in & duty logs</Text>
            </View>
          </View>
          <Download size={18} color="#163316" />
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
