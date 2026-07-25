import React, { useState } from 'react';
import { 
  View, Text, ScrollView, TouchableOpacity, Image, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { 
  ArrowLeft, SquarePen, User, Building, Phone, Calendar, 
  Clock, Users, IdCard, ShieldCheck, LogIn, LogOut, CheckCircle2, 
  ChevronRight, ArrowRight, ArrowLeftRight 
} from 'lucide-react-native';

export default function EntryExitConfirmationScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  // Status State: 'IN' or 'OUT'
  const [currentStatus, setCurrentStatus] = useState<'IN' | 'OUT'>('IN');
  const [lastEntryTime, setLastEntryTime] = useState('10:20 AM');
  const [lastEntryDate, setLastEntryDate] = useState('26 May 2025');

  // Visitor Details
  const visitor = {
    name: (params.name as string) || 'Amit Verma',
    role: 'Visitor',
    visiting: 'Rajesh Kumar',
    flat: 'Flat A-1203, Tower A',
    phone: '98765 43210',
    date: '26 May 2025',
    time: '10:20 AM',
    persons: '2',
    idProof: 'Aadhar Card',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80'
  };

  const handleConfirmEntry = () => {
    Alert.alert(
      'Confirm Entry 🎉',
      `Mark ${visitor.name} as ENTERED into the society?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm Entry', 
          onPress: () => {
            setCurrentStatus('IN');
            const now = new Date();
            const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            setLastEntryTime(timeStr);
            Alert.alert('Success ✅', `${visitor.name} marked as ENTERED (IN) at Gate 1.`);
          }
        }
      ]
    );
  };

  const handleConfirmExit = () => {
    Alert.alert(
      'Confirm Exit 🚪',
      `Mark ${visitor.name} as EXITED from the society?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Confirm Exit', 
          style: 'destructive',
          onPress: () => {
            setCurrentStatus('OUT');
            Alert.alert('Success 🔴', `${visitor.name} marked as EXITED (OUT) from Gate 1.`);
          }
        }
      ]
    );
  };

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
          <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 18 }}>Entry / Exit Confirmation</Text>
          <Text style={{ color: '#94A3B8', fontSize: 12, fontWeight: '600', marginTop: 2 }}>
            Verify and confirm entry or exit
          </Text>
        </View>

        <TouchableOpacity 
          onPress={() => router.push('/(guard)/register-visitor')}
          style={{ alignItems: 'center' }}
        >
          <View style={{
            width: 36, height: 36, borderRadius: 12, backgroundColor: '#F4FBE4',
            borderWidth: 1, borderColor: '#D2FC52', alignItems: 'center', justifyContent: 'center'
          }}>
            <SquarePen size={18} color="#163316" />
          </View>
          <Text style={{ color: '#163316', fontWeight: '800', fontSize: 9, marginTop: 2 }}>Manual Entry</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* VISITOR PROFILE SUMMARY CARD */}
        <View style={{
          backgroundColor: '#FFFFFF', borderRadius: 24, padding: 18,
          borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 14
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', flex: 1, paddingRight: 10 }}>
              <View style={{
                width: 48, height: 48, borderRadius: 18, backgroundColor: '#ECFCCB',
                alignItems: 'center', justifyContent: 'center', marginRight: 12
              }}>
                <User size={24} color="#163316" />
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 18 }}>{visitor.name}</Text>
                
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, flexWrap: 'wrap', gap: 6 }}>
                  <View style={{ backgroundColor: '#ECFCCB', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 }}>
                    <Text style={{ color: '#163316', fontSize: 10, fontWeight: '800' }}>{visitor.role}</Text>
                  </View>
                  <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '600' }}>
                    • Visiting: {visitor.visiting}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                  <Building size={13} color="#64748B" style={{ marginRight: 6 }} />
                  <Text style={{ color: '#475569', fontSize: 12, fontWeight: '600' }}>{visitor.flat}</Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                  <Phone size={13} color="#64748B" style={{ marginRight: 6 }} />
                  <Text style={{ color: '#475569', fontSize: 12, fontWeight: '600' }}>{visitor.phone}</Text>
                </View>
              </View>
            </View>

            {/* Photo Thumbnail */}
            <Image 
              source={{ uri: visitor.photo }} 
              style={{ width: 64, height: 64, borderRadius: 32, borderWidth: 2, borderColor: '#163316' }} 
            />
          </View>

          {/* DETAILS STRIP GRID (4 METRICS) */}
          <View style={{
            backgroundColor: '#F8FAFC', borderRadius: 18, padding: 12,
            marginTop: 16, flexDirection: 'row', justifyContent: 'space-between',
            borderWidth: 1, borderColor: '#F1F5F9'
          }}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                <Calendar size={12} color="#163316" style={{ marginRight: 4 }} />
                <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700' }}>Date</Text>
              </View>
              <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 11 }}>{visitor.date}</Text>
            </View>

            <View style={{ flex: 1, borderLeftWidth: 1, borderLeftColor: '#E2E8F0', paddingLeft: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                <Clock size={12} color="#163316" style={{ marginRight: 4 }} />
                <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700' }}>Entry Time</Text>
              </View>
              <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 11 }}>{lastEntryTime}</Text>
            </View>

            <View style={{ flex: 1, borderLeftWidth: 1, borderLeftColor: '#E2E8F0', paddingLeft: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                <Users size={12} color="#163316" style={{ marginRight: 4 }} />
                <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700' }}>No. of Persons</Text>
              </View>
              <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 11 }}>{visitor.persons}</Text>
            </View>

            <View style={{ flex: 1, borderLeftWidth: 1, borderLeftColor: '#E2E8F0', paddingLeft: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                <IdCard size={12} color="#163316" style={{ marginRight: 4 }} />
                <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700' }}>ID Proof</Text>
              </View>
              <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 11 }}>{visitor.idProof}</Text>
            </View>
          </View>
        </View>

        {/* VERIFICATION STATUS BANNER */}
        <View style={{
          backgroundColor: '#F4FBE4', borderRadius: 20, padding: 14,
          borderWidth: 1, borderColor: '#D2FC52', marginBottom: 20,
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 10 }}>
            <View style={{
              width: 40, height: 40, borderRadius: 20, backgroundColor: '#163316',
              alignItems: 'center', justifyContent: 'center', marginRight: 12
            }}>
              <ShieldCheck size={20} color="#D2FC52" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#163316', fontWeight: '900', fontSize: 13 }}>All details verified</Text>
              <Text style={{ color: '#475569', fontSize: 11, fontWeight: '600', marginTop: 2 }}>
                Please confirm the entry or exit
              </Text>
            </View>
          </View>
          <CheckCircle2 size={24} color="#163316" />
        </View>

        {/* CURRENT STATUS BANNER */}
        <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 15, marginBottom: 10 }}>
          Current Status
        </Text>

        <View style={{
          backgroundColor: '#FFFFFF', borderRadius: 20, padding: 16,
          borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 20,
          flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{
              width: 44, height: 44, borderRadius: 16,
              backgroundColor: currentStatus === 'IN' ? '#ECFCCB' : '#FEE2E2',
              alignItems: 'center', justifyContent: 'center', marginRight: 12
            }}>
              {currentStatus === 'IN' ? (
                <LogIn size={22} color="#163316" />
              ) : (
                <LogOut size={22} color="#DC2626" />
              )}
            </View>
            <View>
              <Text style={{ color: '#64748B', fontSize: 10, fontWeight: '700' }}>Currently</Text>
              <Text style={{
                color: currentStatus === 'IN' ? '#163316' : '#DC2626',
                fontSize: 20, fontWeight: '900', marginTop: 1
              }}>
                {currentStatus}
              </Text>
            </View>
          </View>

          {/* Dotted Line Progress */}
          <View style={{ alignItems: 'center' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#163316' }} />
              <Text style={{ color: '#CBD5E1', letterSpacing: 2 }}>-----------</Text>
              <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#163316' }} />
            </View>
            <Text style={{ color: '#64748B', fontSize: 10, fontWeight: '600', marginTop: 4 }}>Inside Society</Text>
          </View>

          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ color: '#64748B', fontSize: 10, fontWeight: '700' }}>Entry Time</Text>
            <Text style={{ color: '#0F172A', fontSize: 14, fontWeight: '900', marginTop: 1 }}>{lastEntryTime}</Text>
            <Text style={{ color: '#94A3B8', fontSize: 10, fontWeight: '600', marginTop: 2 }}>{lastEntryDate}</Text>
          </View>
        </View>

        {/* CONFIRM ACTION CARDS (2 COLUMNS - ENTRY & EXIT) */}
        <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 15, marginBottom: 12 }}>
          Confirm Action
        </Text>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 22 }}>
          {/* Card 1: Confirm Entry */}
          <View style={{
            flex: 1, backgroundColor: '#F4FBE4', borderRadius: 20, padding: 14,
            borderWidth: 1, borderColor: '#D2FC52', justifyContent: 'space-between'
          }}>
            <View style={{ marginBottom: 14 }}>
              <View style={{
                width: 44, height: 44, borderRadius: 16, backgroundColor: '#FFFFFF',
                alignItems: 'center', justifyContent: 'center', marginBottom: 10
              }}>
                <LogIn size={22} color="#163316" />
              </View>
              <Text style={{ color: '#163316', fontWeight: '900', fontSize: 14 }}>Confirm Entry</Text>
              <Text style={{ color: '#475569', fontSize: 11, fontWeight: '600', marginTop: 2 }}>
                Mark this person as entered
              </Text>
            </View>

            <TouchableOpacity 
              onPress={handleConfirmEntry}
              style={{
                backgroundColor: '#163316', height: 46, borderRadius: 14,
                flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <Text style={{ color: '#D2FC52', fontWeight: '900', fontSize: 14, marginRight: 6 }}>Entry</Text>
              <ChevronRight size={18} color="#D2FC52" />
            </TouchableOpacity>
          </View>

          {/* Card 2: Confirm Exit */}
          <View style={{
            flex: 1, backgroundColor: '#FFF1F2', borderRadius: 20, padding: 14,
            borderWidth: 1, borderColor: '#FECDD3', justifyContent: 'space-between'
          }}>
            <View style={{ marginBottom: 14 }}>
              <View style={{
                width: 44, height: 44, borderRadius: 16, backgroundColor: '#FFFFFF',
                alignItems: 'center', justifyContent: 'center', marginBottom: 10
              }}>
                <LogOut size={22} color="#DC2626" />
              </View>
              <Text style={{ color: '#991B1B', fontWeight: '900', fontSize: 14 }}>Confirm Exit</Text>
              <Text style={{ color: '#7F1D1D', fontSize: 11, fontWeight: '600', marginTop: 2 }}>
                Mark this person as exited
              </Text>
            </View>

            <TouchableOpacity 
              onPress={handleConfirmExit}
              style={{
                backgroundColor: '#DC2626', height: 46, borderRadius: 14,
                flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
              }}
            >
              <Text style={{ color: '#FFFFFF', fontWeight: '900', fontSize: 14, marginRight: 6 }}>Exit</Text>
              <ChevronRight size={18} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* RECENT VISITS TIMELINE */}
        <View style={{ marginBottom: 20 }}>
          <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 15, marginBottom: 12 }}>
            Recent Visits
          </Text>

          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 16, borderWidth: 1, borderColor: '#F1F5F9' }}>
            {/* Visit 1 */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 34, height: 34, borderRadius: 12, backgroundColor: '#ECFCCB', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <LogIn size={16} color="#163316" />
                </View>
                <View>
                  <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 13 }}>Entry</Text>
                  <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '500', marginTop: 2 }}>26 May 2025, 10:20 AM</Text>
                </View>
              </View>
              <View style={{ backgroundColor: '#ECFCCB', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 }}>
                <Text style={{ color: '#163316', fontWeight: '900', fontSize: 10 }}>IN</Text>
              </View>
            </View>

            <View style={{ height: 1, backgroundColor: '#F1F5F9', marginVertical: 4 }} />

            {/* Visit 2 */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 34, height: 34, borderRadius: 12, backgroundColor: '#FEE2E2', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <LogOut size={16} color="#DC2626" />
                </View>
                <View>
                  <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 13 }}>Exit</Text>
                  <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '500', marginTop: 2 }}>25 May 2025, 06:45 PM</Text>
                </View>
              </View>
              <View style={{ backgroundColor: '#FEE2E2', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 }}>
                <Text style={{ color: '#DC2626', fontWeight: '900', fontSize: 10 }}>OUT</Text>
              </View>
            </View>

            <View style={{ height: 1, backgroundColor: '#F1F5F9', marginVertical: 4 }} />

            {/* Visit 3 */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 34, height: 34, borderRadius: 12, backgroundColor: '#ECFCCB', alignItems: 'center', justifyContent: 'center', marginRight: 12 }}>
                  <LogIn size={16} color="#163316" />
                </View>
                <View>
                  <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 13 }}>Entry</Text>
                  <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '500', marginTop: 2 }}>25 May 2025, 09:15 AM</Text>
                </View>
              </View>
              <View style={{ backgroundColor: '#ECFCCB', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 8 }}>
                <Text style={{ color: '#163316', fontWeight: '900', fontSize: 10 }}>IN</Text>
              </View>
            </View>

            <TouchableOpacity 
              onPress={() => router.push('/(guard)/(tabs)/history')}
              style={{
                flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
                paddingTop: 12, marginTop: 6, borderTopWidth: 1, borderTopColor: '#F8FAFC'
              }}
            >
              <Text style={{ color: '#163316', fontWeight: '800', fontSize: 12, marginRight: 4 }}>View Full History</Text>
              <ChevronRight size={14} color="#163316" />
            </TouchableOpacity>
          </View>
        </View>

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
              Your confirmation is recorded for security and safety.
            </Text>
            <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '500', marginTop: 2 }}>
              Thank you for keeping the community secure.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
