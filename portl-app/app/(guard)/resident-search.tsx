import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, Alert, FlatList 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, Search, QrCode, SlidersHorizontal, Lightbulb, X, 
  Clock, User, Phone, ShieldCheck, ChevronRight, ChevronDown, Check 
} from 'lucide-react-native';

export default function ResidentSearchScreen() {
  const router = useRouter();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [showTip, setShowTip] = useState(true);
  const [recentSearches, setRecentSearches] = useState([
    'Amit Verma', 'Neha Sharma', 'B-1203', 'Rohan Mehta'
  ]);
  const [sortOrder, setSortOrder] = useState<'A-Z' | 'Z-A' | 'Flat'>('A-Z');
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  // Directory Data
  const [residents, setResidents] = useState([
    {
      id: 'r1',
      name: 'Amit Verma',
      flat: 'Flat A-1203, Tower A',
      phone: '98765 43210',
      status: 'Active',
      tower: 'Tower A'
    },
    {
      id: 'r2',
      name: 'Neha Sharma',
      flat: 'Flat B-902, Tower B',
      phone: '91234 56789',
      status: 'Active',
      tower: 'Tower B'
    },
    {
      id: 'r3',
      name: 'Rohan Mehta',
      flat: 'Flat C-1101, Tower C',
      phone: '99887 76655',
      status: 'Active',
      tower: 'Tower C'
    },
    {
      id: 'r4',
      name: 'Priya Nair',
      flat: 'Flat A-504, Tower A',
      phone: '90909 11223',
      status: 'Active',
      tower: 'Tower A'
    },
    {
      id: 'r5',
      name: 'Arjun Singh',
      flat: 'Flat B-201, Tower B',
      phone: '87654 32109',
      status: 'Active',
      tower: 'Tower B'
    },
    {
      id: 'r6',
      name: 'Rajesh Gupta',
      flat: 'Flat C-104, Tower C',
      phone: '97112 33445',
      status: 'Active',
      tower: 'Tower C'
    }
  ]);

  const handleRemoveRecent = (term: string) => {
    setRecentSearches(prev => prev.filter(t => t !== term));
  };

  const handleClearAllRecent = () => {
    setRecentSearches([]);
  };

  const handleSelectResident = (resident: any) => {
    Alert.alert(
      `Resident Selected: ${resident.name}`,
      `${resident.flat}\nPhone: ${resident.phone}\nStatus: ${resident.status}`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Register Visitor for Flat', 
          onPress: () => router.push('/(guard)/register-visitor')
        }
      ]
    );
  };

  // Filter residents
  const filteredResidents = residents.filter(r => {
    const q = searchQuery.toLowerCase();
    return (
      r.name.toLowerCase().includes(q) ||
      r.flat.toLowerCase().includes(q) ||
      r.phone.includes(q)
    );
  });

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
          <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 18 }}>Resident Search</Text>
          <Text style={{ color: '#94A3B8', fontSize: 12, fontWeight: '600', marginTop: 2 }}>
            Search and verify residents
          </Text>
        </View>

        <TouchableOpacity 
          onPress={() => router.push('/(guard)/(tabs)/scanner')}
          style={{ alignItems: 'center' }}
        >
          <View style={{
            width: 36, height: 36, borderRadius: 12, backgroundColor: '#F4FBE4',
            borderWidth: 1, borderColor: '#D2FC52', alignItems: 'center', justifyContent: 'center'
          }}>
            <QrCode size={18} color="#163316" />
          </View>
          <Text style={{ color: '#163316', fontWeight: '800', fontSize: 9, marginTop: 2 }}>Scan QR</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* SEARCH & FILTER INPUT BAR */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
          <View style={{
            flex: 1, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0',
            borderRadius: 20, paddingHorizontal: 14, height: 50, flexDirection: 'row',
            alignItems: 'center'
          }}>
            <Search size={18} color="#163316" style={{ marginRight: 10 }} />
            <TextInput
              placeholder="Search by name, flat no., or phone number..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{ flex: 1, color: '#0F172A', fontWeight: '600', fontSize: 13 }}
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={16} color="#94A3B8" />
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity 
            onPress={() => Alert.alert('Filter', 'Filter by Tower / Block (Tower A, B, C)')}
            style={{
              width: 50, height: 50, borderRadius: 20, backgroundColor: '#FFFFFF',
              borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <SlidersHorizontal size={20} color="#163316" />
          </TouchableOpacity>
        </View>

        {/* TIP BANNER CARD */}
        {showTip && (
          <View style={{
            backgroundColor: '#F4FBE4', borderRadius: 20, padding: 14,
            borderWidth: 1, borderColor: '#D2FC52', marginBottom: 18,
            flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 10 }}>
              <View style={{
                width: 36, height: 36, borderRadius: 18, backgroundColor: '#163316',
                alignItems: 'center', justifyContent: 'center', marginRight: 12
              }}>
                <Lightbulb size={18} color="#D2FC52" />
              </View>
              <Text style={{ color: '#163316', fontWeight: '700', fontSize: 12, flex: 1, lineHeight: 16 }}>
                Search using resident name, flat number or registered mobile number
              </Text>
            </View>
            <TouchableOpacity onPress={() => setShowTip(false)}>
              <X size={18} color="#163316" />
            </TouchableOpacity>
          </View>
        )}

        {/* RECENT SEARCHES CHIPS */}
        {recentSearches.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 14 }}>Recent Searches</Text>
              <TouchableOpacity onPress={handleClearAllRecent}>
                <Text style={{ color: '#163316', fontWeight: '800', fontSize: 12 }}>Clear All</Text>
              </TouchableOpacity>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {recentSearches.map(term => (
                <View 
                  key={term}
                  style={{
                    backgroundColor: '#F4FBE4', borderWidth: 1, borderColor: '#D2FC52',
                    borderRadius: 20, paddingHorizontal: 12, paddingVertical: 6,
                    flexDirection: 'row', alignItems: 'center'
                  }}
                >
                  <Clock size={12} color="#163316" style={{ marginRight: 6 }} />
                  <TouchableOpacity onPress={() => setSearchQuery(term)}>
                    <Text style={{ color: '#163316', fontWeight: '700', fontSize: 12, marginRight: 6 }}>
                      {term}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleRemoveRecent(term)}>
                    <X size={14} color="#163316" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* RESIDENTS LIST HEADER */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 16 }}>
            Residents ({filteredResidents.length})
          </Text>

          <TouchableOpacity 
            onPress={() => setShowSortDropdown(!showSortDropdown)}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Text style={{ color: '#64748B', fontWeight: '700', fontSize: 12, marginRight: 4 }}>
              Sort: <Text style={{ color: '#0F172A', fontWeight: '800' }}>{sortOrder}</Text>
            </Text>
            <ChevronDown size={14} color="#0F172A" />
          </TouchableOpacity>
        </View>

        {/* RESIDENTS LIST */}
        <View style={{ gap: 10, marginBottom: 20 }}>
          {filteredResidents.length === 0 ? (
            <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
              <Text style={{ color: '#94A3B8', fontWeight: '600', fontSize: 13 }}>No residents found matching "{searchQuery}"</Text>
            </View>
          ) : (
            filteredResidents.map(item => (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleSelectResident(item)}
                style={{
                  backgroundColor: '#FFFFFF', borderRadius: 20, padding: 14,
                  borderWidth: 1, borderColor: '#F1F5F9', flexDirection: 'row',
                  alignItems: 'center', justifyContent: 'space-between'
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 10 }}>
                  <View style={{
                    width: 44, height: 44, borderRadius: 16, backgroundColor: '#ECFCCB',
                    alignItems: 'center', justifyContent: 'center', marginRight: 12
                  }}>
                    <User size={20} color="#163316" />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 14 }}>{item.name}</Text>
                    <Text style={{ color: '#64748B', fontSize: 12, fontWeight: '600', marginTop: 2 }}>{item.flat}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                      <Phone size={11} color="#64748B" style={{ marginRight: 4 }} />
                      <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '600' }}>{item.phone}</Text>
                    </View>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <View style={{ backgroundColor: '#ECFCCB', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 }}>
                    <Text style={{ color: '#163316', fontSize: 10, fontWeight: '800' }}>{item.status}</Text>
                  </View>
                  <ChevronRight size={16} color="#94A3B8" />
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        {/* BOTTOM FALLBACK BANNER CARD */}
        <View style={{
          backgroundColor: '#F4FBE4', borderRadius: 20, padding: 16,
          borderWidth: 1, borderColor: '#D2FC52', flexDirection: 'row',
          alignItems: 'center', justifyContent: 'space-between', marginBottom: 20
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 12 }}>
            <View style={{
              width: 40, height: 40, borderRadius: 14, backgroundColor: '#163316',
              alignItems: 'center', justifyContent: 'center', marginRight: 12
            }}>
              <ShieldCheck size={20} color="#D2FC52" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#163316', fontWeight: '900', fontSize: 13 }}>Can’t find the resident?</Text>
              <Text style={{ color: '#475569', fontSize: 11, fontWeight: '600', marginTop: 2 }}>
                They might not be registered yet.
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            onPress={() => router.push('/(guard)/register-visitor')}
            style={{
              backgroundColor: '#163316', paddingHorizontal: 14, paddingVertical: 10,
              borderRadius: 14
            }}
          >
            <Text style={{ color: '#D2FC52', fontWeight: '800', fontSize: 11 }}>Add Temporary Visitor</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
