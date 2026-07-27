import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, RefreshControl, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, Building2, Plus, Search, Filter, DoorClosed, 
  Home, Building, UserPlus, CloudDownload, ChevronRight, Edit3, ShieldCheck 
} from 'lucide-react-native';

export interface TowerItem {
  id: string;
  name: string;
  flatsCount: number;
  wing: string;
  floorsCount: number;
  occupied: number;
  vacant: number;
}

export default function TowersAndFlatsScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const [towers, setTowers] = useState<TowerItem[]>([
    {
      id: 't1',
      name: 'Tower A',
      flatsCount: 120,
      wing: 'A wing',
      floorsCount: 12,
      occupied: 115,
      vacant: 5
    },
    {
      id: 't2',
      name: 'Tower B',
      flatsCount: 112,
      wing: 'B wing',
      floorsCount: 14,
      occupied: 110,
      vacant: 2
    },
    {
      id: 't3',
      name: 'Tower C',
      flatsCount: 104,
      wing: 'C wing',
      floorsCount: 13,
      occupied: 102,
      vacant: 2
    },
    {
      id: 't4',
      name: 'Tower D',
      flatsCount: 96,
      wing: 'D wing',
      floorsCount: 12,
      occupied: 94,
      vacant: 2
    },
    {
      id: 't5',
      name: 'Tower E',
      flatsCount: 56,
      wing: 'E wing',
      floorsCount: 10,
      occupied: 55,
      vacant: 1
    },
    {
      id: 't6',
      name: 'Tower F',
      flatsCount: 40,
      wing: 'F wing',
      floorsCount: 8,
      occupied: 36,
      vacant: 4
    }
  ]);

  const recentFlatActivities = [
    {
      id: 'fa1',
      title: 'New flat added: A-1203',
      subtitle: 'Tower A • 12th Floor • 3 BHK',
      time: 'Today, 10:30 AM',
      iconType: 'add_flat',
      bgColor: '#ECFCCB',
      iconColor: '#163316'
    },
    {
      id: 'fa2',
      title: 'Flat status updated: B-502',
      subtitle: 'Now Marked as Vacant',
      time: 'Today, 09:15 AM',
      iconType: 'status_update',
      bgColor: '#E0F2FE',
      iconColor: '#0284C7'
    },
    {
      id: 'fa3',
      title: 'New tower added: Tower F',
      subtitle: '8 Floors • 40 Flats',
      time: 'Yesterday, 04:45 PM',
      iconType: 'add_tower',
      bgColor: '#FFEDD5',
      iconColor: '#C2410C'
    },
    {
      id: 'fa4',
      title: 'Flat details updated: C-1001',
      subtitle: 'Owner information updated',
      time: 'Yesterday, 02:20 PM',
      iconType: 'edit_flat',
      bgColor: '#F3E8FF',
      iconColor: '#7E22CE'
    }
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const handleAddTower = () => {
    Alert.alert(
      'Add New Tower',
      'Enter Tower Name, Number of Floors, and Flats per floor:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add Tower', 
          onPress: () => {
            const newTower: TowerItem = {
              id: `t${Date.now()}`,
              name: `Tower G`,
              flatsCount: 30,
              wing: 'G wing',
              floorsCount: 6,
              occupied: 28,
              vacant: 2
            };
            setTowers(prev => [...prev, newTower]);
            Alert.alert('Tower Added 🎉', 'Tower G added successfully to society!');
          }
        }
      ]
    );
  };

  const handleTowerClick = (tower: TowerItem) => {
    Alert.alert(
      `${tower.name} Details`,
      `Wing: ${tower.wing}\nFloors: ${tower.floorsCount}\nTotal Flats: ${tower.flatsCount}\nOccupied: ${tower.occupied}\nVacant: ${tower.vacant}`,
      [
        { text: 'Close', style: 'cancel' },
        { text: 'View All Flats', onPress: () => Alert.alert('Flats Directory', `Listing all ${tower.flatsCount} flats in ${tower.name}`) }
      ]
    );
  };

  const handleImportFlats = () => {
    Alert.alert(
      'Import Flats CSV',
      'Upload Excel or CSV file to bulk import society flats and wings?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Select File', onPress: () => Alert.alert('Imported 📄', '528 Flats imported successfully!') }
      ]
    );
  };

  // Filter towers
  const filteredTowers = towers.filter(t => {
    const q = searchQuery.toLowerCase();
    return t.name.toLowerCase().includes(q) || t.wing.toLowerCase().includes(q);
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
          <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 18 }}>Towers & Flats</Text>
          <Text style={{ color: '#94A3B8', fontSize: 12, fontWeight: '600', marginTop: 2 }}>
            Manage towers and flats in the society
          </Text>
        </View>

        <TouchableOpacity 
          onPress={handleAddTower}
          style={{
            backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 8,
            borderRadius: 14, borderWidth: 1, borderColor: '#163316',
            flexDirection: 'row', alignItems: 'center'
          }}
        >
          <Building2 size={14} color="#163316" style={{ marginRight: 6 }} />
          <Text style={{ color: '#163316', fontWeight: '800', fontSize: 11 }}>Add Tower</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#163316" />}
      >
        {/* TOP SUMMARY STAT CARDS (4 METRICS) */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
          {/* Card 1: Total Towers */}
          <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#ECFCCB', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Building size={16} color="#163316" />
            </View>
            <Text style={{ color: '#0F172A', fontSize: 20, fontWeight: '900' }}>{towers.length}</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2, lineHeight: 12 }}>Total Towers</Text>
            <Text style={{ color: '#163316', fontSize: 8, fontWeight: '800', marginTop: 2 }}>Active</Text>
          </View>

          {/* Card 2: Total Flats */}
          <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <DoorClosed size={16} color="#0284C7" />
            </View>
            <Text style={{ color: '#0F172A', fontSize: 20, fontWeight: '900' }}>528</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2, lineHeight: 12 }}>Total Flats</Text>
            <Text style={{ color: '#0284C7', fontSize: 8, fontWeight: '800', marginTop: 2 }}>All Towers</Text>
          </View>

          {/* Card 3: Occupied */}
          <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#FFEDD5', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Home size={16} color="#C2410C" />
            </View>
            <Text style={{ color: '#0F172A', fontSize: 20, fontWeight: '900' }}>512</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2, lineHeight: 12 }}>Occupied</Text>
            <Text style={{ color: '#C2410C', fontSize: 8, fontWeight: '800', marginTop: 2 }}>97.0%</Text>
          </View>

          {/* Card 4: Vacant */}
          <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#F3E8FF', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <DoorClosed size={16} color="#7E22CE" />
            </View>
            <Text style={{ color: '#0F172A', fontSize: 20, fontWeight: '900' }}>16</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2, lineHeight: 12 }}>Vacant</Text>
            <Text style={{ color: '#7E22CE', fontSize: 8, fontWeight: '800', marginTop: 2 }}>3.0%</Text>
          </View>
        </View>

        {/* SEARCH BAR & FILTER DROPDOWN */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
          <View style={{
            flex: 1, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0',
            borderRadius: 20, paddingHorizontal: 14, height: 48, flexDirection: 'row',
            alignItems: 'center'
          }}>
            <Search size={18} color="#163316" style={{ marginRight: 10 }} />
            <TextInput
              placeholder="Search tower or flat number..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{ flex: 1, color: '#0F172A', fontWeight: '600', fontSize: 13 }}
            />
          </View>

          <TouchableOpacity 
            onPress={() => Alert.alert('Filter', 'Filter by Occupied / Vacant status')}
            style={{
              backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0',
              borderRadius: 20, paddingHorizontal: 14, height: 48, flexDirection: 'row',
              alignItems: 'center', justifyContent: 'center'
            }}
          >
            <Filter size={16} color="#163316" style={{ marginRight: 6 }} />
            <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 12 }}>Filter ▾</Text>
          </TouchableOpacity>
        </View>

        {/* TOWERS SECTION */}
        <View style={{ marginBottom: 22 }}>
          <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 16, marginBottom: 12 }}>Towers</Text>

          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 12, borderWidth: 1, borderColor: '#F1F5F9', gap: 4 }}>
            {filteredTowers.map((tower, idx) => (
              <TouchableOpacity
                key={tower.id}
                onPress={() => handleTowerClick(tower)}
                style={{
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                  paddingVertical: 12, paddingHorizontal: 8,
                  borderBottomWidth: idx < filteredTowers.length - 1 ? 1 : 0,
                  borderBottomColor: '#F8FAFC'
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 10 }}>
                  <View style={{
                    width: 44, height: 44, borderRadius: 16, backgroundColor: '#ECFCCB',
                    alignItems: 'center', justifyContent: 'center', marginRight: 12
                  }}>
                    <Building size={20} color="#163316" />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 15 }}>{tower.name}</Text>
                    <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '600', marginTop: 2 }}>
                      {tower.flatsCount} Flats
                    </Text>
                    <Text style={{ color: '#94A3B8', fontSize: 10, fontWeight: '500', marginTop: 2 }}>
                      {tower.wing} • {tower.floorsCount} Floors
                    </Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ color: '#163316', fontWeight: '900', fontSize: 14 }}>{tower.occupied}</Text>
                    <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '600' }}>Occupied</Text>
                  </View>

                  <View style={{ width: 1, height: 20, backgroundColor: '#F1F5F9' }} />

                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ color: '#7E22CE', fontWeight: '900', fontSize: 14 }}>{tower.vacant}</Text>
                    <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '600' }}>Vacant</Text>
                  </View>

                  <ChevronRight size={16} color="#94A3B8" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* RECENT FLAT ACTIVITY TIMELINE */}
        <View style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 16 }}>Recent Flat Activity</Text>
            <TouchableOpacity onPress={() => Alert.alert('Flat Activity', 'Showing full flat activity log')} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: '#163316', fontWeight: '700', fontSize: 12, marginRight: 2 }}>View All</Text>
              <ChevronRight size={14} color="#163316" />
            </TouchableOpacity>
          </View>

          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 12, borderWidth: 1, borderColor: '#F1F5F9', gap: 4 }}>
            {recentFlatActivities.map((item, idx) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => Alert.alert(item.title, item.subtitle)}
                style={{
                  flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                  paddingVertical: 10, paddingHorizontal: 6,
                  borderBottomWidth: idx < recentFlatActivities.length - 1 ? 1 : 0,
                  borderBottomColor: '#F8FAFC'
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 10 }}>
                  <View style={{
                    width: 40, height: 40, borderRadius: 14, backgroundColor: item.bgColor,
                    alignItems: 'center', justifyContent: 'center', marginRight: 12
                  }}>
                    {item.iconType === 'add_flat' ? (
                      <UserPlus size={18} color={item.iconColor} />
                    ) : item.iconType === 'status_update' ? (
                      <DoorClosed size={18} color={item.iconColor} />
                    ) : item.iconType === 'add_tower' ? (
                      <Building size={18} color={item.iconColor} />
                    ) : (
                      <Edit3 size={18} color={item.iconColor} />
                    )}
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 13 }}>{item.title}</Text>
                    <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '500', marginTop: 1 }}>{item.subtitle}</Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ color: '#64748B', fontSize: 10, fontWeight: '600' }}>{item.time}</Text>
                  <ChevronRight size={16} color="#94A3B8" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* BOTTOM BANNER WITH IMPORT FLATS ACTION */}
        <View style={{
          backgroundColor: '#F4FBE4', borderRadius: 20, padding: 14,
          borderWidth: 1, borderColor: '#D2FC52', flexDirection: 'row',
          alignItems: 'center', justifyContent: 'space-between', marginBottom: 20
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 10 }}>
            <View style={{
              width: 36, height: 36, borderRadius: 12, backgroundColor: '#163316',
              alignItems: 'center', justifyContent: 'center', marginRight: 10
            }}>
              <ShieldCheck size={20} color="#D2FC52" />
            </View>
            <Text style={{ color: '#163316', fontWeight: '700', fontSize: 11, flex: 1, lineHeight: 15 }}>
              Keep your society structure updated for better management and security.
            </Text>
          </View>

          <TouchableOpacity 
            onPress={handleImportFlats}
            style={{
              backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 8,
              borderRadius: 14, borderWidth: 1, borderColor: '#163316',
              flexDirection: 'row', alignItems: 'center'
            }}
          >
            <CloudDownload size={14} color="#163316" style={{ marginRight: 4 }} />
            <Text style={{ color: '#163316', fontWeight: '800', fontSize: 11 }}>Import Flats</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
