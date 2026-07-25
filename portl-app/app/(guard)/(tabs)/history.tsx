import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, RefreshControl, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  Search, Calendar, Filter, Users, LogIn, LogOut, 
  Car, Package, ArrowUpRight, ShieldCheck, Download, ChevronRight, ArrowUpDown, ChevronDown 
} from 'lucide-react-native';

export type TimeFilter = 'all' | 'today' | 'week' | 'month';

export default function GuardHistoryTab() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState<TimeFilter>('all');
  const [sortOrder, setSortOrder] = useState('Newest First');
  const [refreshing, setRefreshing] = useState(false);

  const [historyItems, setHistoryItems] = useState([
    {
      id: 'h1',
      name: 'Amit Verma',
      subtitle: 'Visiting: Rajesh Kumar',
      address: 'A-1203, Tower A',
      phone: '98765 43210',
      status: 'IN',
      time: '10:20 AM',
      dateGroup: 'Today - 26 May 2025',
      type: 'person',
      bgColor: '#ECFCCB',
      iconColor: '#163316'
    },
    {
      id: 'h2',
      name: 'WB 20 AB 1234',
      subtitle: 'Resident Vehicle',
      address: 'Amit Verma (A-1203)',
      phone: '',
      status: 'IN',
      time: '09:45 AM',
      dateGroup: 'Today - 26 May 2025',
      type: 'vehicle',
      bgColor: '#ECFCCB',
      iconColor: '#163316'
    },
    {
      id: 'h3',
      name: 'Amazon Delivery',
      subtitle: 'Delivery for: Neha Sharma',
      address: 'B-902, Tower B',
      phone: '',
      status: 'OUT',
      time: '09:30 AM',
      dateGroup: 'Today - 26 May 2025',
      type: 'parcel',
      bgColor: '#FFEDD5',
      iconColor: '#C2410C'
    },
    {
      id: 'h4',
      name: 'Sanjay Patel',
      subtitle: 'Visiting: Priya Nair',
      address: 'A-504, Tower A',
      phone: '',
      status: 'OUT',
      time: '07:15 PM',
      dateGroup: 'Today - 26 May 2025',
      type: 'person',
      bgColor: '#FFE4E6',
      iconColor: '#E11D48'
    },
    {
      id: 'h5',
      name: 'Neha Sharma',
      subtitle: 'Visiting: Amit Verma',
      address: 'B-902, Tower B',
      phone: '',
      status: 'IN',
      time: '06:40 PM',
      dateGroup: 'Yesterday - 25 May 2025',
      type: 'person',
      bgColor: '#ECFCCB',
      iconColor: '#163316'
    },
    {
      id: 'h6',
      name: 'Rohan Mehta',
      subtitle: 'Visiting: Rakesh Mehta',
      address: 'C-1101, Tower C',
      phone: '',
      status: 'OUT',
      time: '05:55 PM',
      dateGroup: 'Yesterday - 25 May 2025',
      type: 'person',
      bgColor: '#FFE4E6',
      iconColor: '#E11D48'
    },
    {
      id: 'h7',
      name: 'KA 01 CD 5678',
      subtitle: 'Resident Vehicle',
      address: 'Arjun Singh (B-201)',
      phone: '',
      status: 'IN',
      time: '04:30 PM',
      dateGroup: 'Yesterday - 25 May 2025',
      type: 'vehicle',
      bgColor: '#ECFCCB',
      iconColor: '#163316'
    }
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const handleExportHistory = () => {
    Alert.alert(
      'Export Visitor Log',
      'Download complete visitor entry & exit log PDF / Excel report for society records?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Download Report', 
          onPress: () => Alert.alert('Report Exported 📄', 'Visitor log history saved to downloads!')
        }
      ]
    );
  };

  // Filter History Items
  const filteredItems = historyItems.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = item.name.toLowerCase().includes(q) || item.address.toLowerCase().includes(q) || item.subtitle.toLowerCase().includes(q);
    
    if (timeFilter === 'today') return matchesSearch && item.dateGroup.includes('Today');
    return matchesSearch;
  });

  const todayList = filteredItems.filter(item => item.dateGroup.includes('Today'));
  const yesterdayList = filteredItems.filter(item => item.dateGroup.includes('Yesterday'));

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FB' }}>
      {/* TOP HEADER BAR */}
      <View style={{
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16, backgroundColor: '#FFFFFF',
        borderBottomWidth: 1, borderBottomColor: '#F1F5F9'
      }}>
        <View>
          <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 20 }}>Visitor History</Text>
          <Text style={{ color: '#94A3B8', fontSize: 12, fontWeight: '600', marginTop: 2 }}>
            View all visitor entries and exits
          </Text>
        </View>

        <TouchableOpacity 
          onPress={() => Alert.alert('Filter', 'Filter history by gate or vehicle type')}
          style={{ alignItems: 'center' }}
        >
          <View style={{
            width: 36, height: 36, borderRadius: 12, backgroundColor: '#F4FBE4',
            borderWidth: 1, borderColor: '#D2FC52', alignItems: 'center', justifyContent: 'center'
          }}>
            <Filter size={18} color="#163316" />
          </View>
          <Text style={{ color: '#163316', fontWeight: '800', fontSize: 9, marginTop: 2 }}>Filter</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#163316" />}
      >
        {/* SEARCH BAR & DATE PICKER */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
          <View style={{
            flex: 1, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0',
            borderRadius: 20, paddingHorizontal: 14, height: 48, flexDirection: 'row',
            alignItems: 'center'
          }}>
            <Search size={18} color="#163316" style={{ marginRight: 10 }} />
            <TextInput
              placeholder="Search by name, phone or flat number..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{ flex: 1, color: '#0F172A', fontWeight: '600', fontSize: 13 }}
            />
          </View>

          <TouchableOpacity 
            onPress={() => Alert.alert('Date Range', 'Select custom date range')}
            style={{
              width: 48, height: 48, borderRadius: 20, backgroundColor: '#FFFFFF',
              borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <Calendar size={20} color="#163316" />
          </TouchableOpacity>
        </View>

        {/* TOP SUMMARY STAT CARDS (4 METRICS) */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
          {/* Card 1: Total Visitors */}
          <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#ECFCCB', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Users size={16} color="#163316" />
            </View>
            <Text style={{ color: '#0F172A', fontSize: 20, fontWeight: '900' }}>128</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2 }}>Total Visitors</Text>
            <Text style={{ color: '#163316', fontSize: 8, fontWeight: '800', marginTop: 2 }}>↑ 18% this week</Text>
          </View>

          {/* Card 2: Entries */}
          <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#ECFCCB', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <LogIn size={16} color="#163316" />
            </View>
            <Text style={{ color: '#0F172A', fontSize: 20, fontWeight: '900' }}>96</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2 }}>Entries</Text>
            <Text style={{ color: '#94A3B8', fontSize: 8, fontWeight: '600', marginTop: 2 }}>This week</Text>
          </View>

          {/* Card 3: Exits */}
          <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#FFE4E6', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <LogOut size={16} color="#E11D48" />
            </View>
            <Text style={{ color: '#0F172A', fontSize: 20, fontWeight: '900' }}>82</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2 }}>Exits</Text>
            <Text style={{ color: '#94A3B8', fontSize: 8, fontWeight: '600', marginTop: 2 }}>This week</Text>
          </View>

          {/* Card 4: Unique Visitors */}
          <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Users size={16} color="#0284C7" />
            </View>
            <Text style={{ color: '#0F172A', fontSize: 20, fontWeight: '900' }}>46</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2 }}>Unique Visitors</Text>
            <Text style={{ color: '#94A3B8', fontSize: 8, fontWeight: '600', marginTop: 2 }}>This week</Text>
          </View>
        </View>

        {/* TIME FILTER PILLS & SORTING BAR */}
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
            {[
              { id: 'all', label: 'All' },
              { id: 'today', label: 'Today' },
              { id: 'week', label: 'This Week' },
              { id: 'month', label: 'This Month' }
            ].map(pill => {
              const isActive = timeFilter === pill.id;
              return (
                <TouchableOpacity
                  key={pill.id}
                  onPress={() => setTimeFilter(pill.id as any)}
                  style={{
                    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 18,
                    backgroundColor: isActive ? '#163316' : '#F1F5F9',
                    borderWidth: 1, borderColor: isActive ? '#163316' : '#E2E8F0'
                  }}
                >
                  <Text style={{
                    fontWeight: '800', fontSize: 11,
                    color: isActive ? '#FFFFFF' : '#64748B'
                  }}>
                    {pill.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          <TouchableOpacity 
            onPress={() => Alert.alert('Sort', 'Sorting by Newest First')}
            style={{ flexDirection: 'row', alignItems: 'center', paddingLeft: 6 }}
          >
            <ArrowUpDown size={14} color="#163316" style={{ marginRight: 4 }} />
            <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 11 }}>{sortOrder}</Text>
            <ChevronDown size={12} color="#0F172A" />
          </TouchableOpacity>
        </View>

        {/* SECTION: TODAY */}
        {todayList.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 15, marginBottom: 12 }}>
              Today - 26 May 2025
            </Text>

            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 12, borderWidth: 1, borderColor: '#F1F5F9', gap: 4 }}>
              {todayList.map((item, idx) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => router.push({ pathname: '/(guard)/entry-exit', params: { name: item.name } })}
                  style={{
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                    paddingVertical: 10, paddingHorizontal: 6,
                    borderBottomWidth: idx < todayList.length - 1 ? 1 : 0,
                    borderBottomColor: '#F8FAFC'
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 10 }}>
                    <View style={{
                      width: 42, height: 42, borderRadius: 16, backgroundColor: item.bgColor,
                      alignItems: 'center', justifyContent: 'center', marginRight: 12
                    }}>
                      {item.type === 'vehicle' ? (
                        <Car size={20} color={item.iconColor} />
                      ) : item.type === 'parcel' ? (
                        <Package size={20} color={item.iconColor} />
                      ) : (
                        <Users size={20} color={item.iconColor} />
                      )}
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 14 }}>{item.name}</Text>
                      <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '600', marginTop: 1 }}>{item.subtitle}</Text>
                      <Text style={{ color: '#94A3B8', fontSize: 10, fontWeight: '500', marginTop: 2 }}>
                        🏢 {item.address} {item.phone ? `• 📞 ${item.phone}` : ''}
                      </Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={{ alignItems: 'flex-end' }}>
                      <View style={{
                        backgroundColor: item.status === 'IN' ? '#ECFCCB' : '#FFE4E6',
                        paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginBottom: 4
                      }}>
                        <Text style={{
                          color: item.status === 'IN' ? '#163316' : '#E11D48',
                          fontWeight: '900', fontSize: 10
                        }}>
                          {item.status}
                        </Text>
                      </View>
                      <Text style={{ color: '#64748B', fontSize: 10, fontWeight: '600' }}>{item.time}</Text>
                    </View>
                    <ChevronRight size={16} color="#94A3B8" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* SECTION: YESTERDAY */}
        {yesterdayList.length > 0 && (
          <View style={{ marginBottom: 20 }}>
            <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 15, marginBottom: 12 }}>
              Yesterday - 25 May 2025
            </Text>

            <View style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 12, borderWidth: 1, borderColor: '#F1F5F9', gap: 4 }}>
              {yesterdayList.map((item, idx) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => router.push({ pathname: '/(guard)/entry-exit', params: { name: item.name } })}
                  style={{
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                    paddingVertical: 10, paddingHorizontal: 6,
                    borderBottomWidth: idx < yesterdayList.length - 1 ? 1 : 0,
                    borderBottomColor: '#F8FAFC'
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 10 }}>
                    <View style={{
                      width: 42, height: 42, borderRadius: 16, backgroundColor: item.bgColor,
                      alignItems: 'center', justifyContent: 'center', marginRight: 12
                    }}>
                      {item.type === 'vehicle' ? (
                        <Car size={20} color={item.iconColor} />
                      ) : (
                        <Users size={20} color={item.iconColor} />
                      )}
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 14 }}>{item.name}</Text>
                      <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '600', marginTop: 1 }}>{item.subtitle}</Text>
                      <Text style={{ color: '#94A3B8', fontSize: 10, fontWeight: '500', marginTop: 2 }}>{item.address}</Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View style={{ alignItems: 'flex-end' }}>
                      <View style={{
                        backgroundColor: item.status === 'IN' ? '#ECFCCB' : '#FFE4E6',
                        paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, marginBottom: 4
                      }}>
                        <Text style={{
                          color: item.status === 'IN' ? '#163316' : '#E11D48',
                          fontWeight: '900', fontSize: 10
                        }}>
                          {item.status}
                        </Text>
                      </View>
                      <Text style={{ color: '#64748B', fontSize: 10, fontWeight: '600' }}>{item.time}</Text>
                    </View>
                    <ChevronRight size={16} color="#94A3B8" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* BOTTOM BANNER WITH EXPORT ACTION */}
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
              All visitor movements are recorded for security and safety.
            </Text>
          </View>

          <TouchableOpacity 
            onPress={handleExportHistory}
            style={{
              backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 8,
              borderRadius: 14, borderWidth: 1, borderColor: '#163316',
              flexDirection: 'row', alignItems: 'center'
            }}
          >
            <Download size={14} color="#163316" style={{ marginRight: 4 }} />
            <Text style={{ color: '#163316', fontWeight: '800', fontSize: 11 }}>Export History</Text>
          </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}
