import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, RefreshControl, Image, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, Plus, Search, Filter, LayoutGrid, Calendar, 
  Wrench, PauseCircle, CheckCircle2, Waves, Dumbbell, 
  Users, Trophy, Trees, Leaf, Clock, AlertTriangle, 
  MoreVertical, ShieldCheck, BarChart3 
} from 'lucide-react-native';

export type AmenityFilterType = 'all' | 'bookable' | 'maintenance' | 'out_of_service' | 'active';

export interface AmenityRecord {
  id: string;
  name: string;
  category: string;
  isBookable: boolean;
  timing: string;
  status: 'Active' | 'Maintenance' | 'Out of Service';
  maintenanceNotice?: string;
  closedNotice?: string;
  image: string;
  iconType: 'pool' | 'gym' | 'hall' | 'badminton' | 'play' | 'garden';
  iconBg: string;
  iconColor: string;
}

export default function AmenityManagementScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<AmenityFilterType>('all');
  const [refreshing, setRefreshing] = useState(false);

  const [amenities, setAmenities] = useState<AmenityRecord[]>([
    {
      id: 'am1',
      name: 'Swimming Pool',
      category: 'Leisure',
      isBookable: true,
      timing: '06:00 AM - 10:00 PM',
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=300&q=80',
      iconType: 'pool',
      iconBg: '#E0F2FE',
      iconColor: '#0284C7'
    },
    {
      id: 'am2',
      name: 'Gymnasium',
      category: 'Fitness',
      isBookable: true,
      timing: '05:30 AM - 10:00 PM',
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=300&q=80',
      iconType: 'gym',
      iconBg: '#ECFCCB',
      iconColor: '#163316'
    },
    {
      id: 'am3',
      name: 'Community Hall',
      category: 'Events',
      isBookable: true,
      timing: '08:00 AM - 11:00 PM',
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=300&q=80',
      iconType: 'hall',
      iconBg: '#FFEDD5',
      iconColor: '#C2410C'
    },
    {
      id: 'am4',
      name: 'Indoor Badminton Court',
      category: 'Sports',
      isBookable: true,
      timing: '06:00 AM - 10:00 PM',
      status: 'Maintenance',
      maintenanceNotice: 'Maintenance till 28 May 2024',
      image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=300&q=80',
      iconType: 'badminton',
      iconBg: '#F3E8FF',
      iconColor: '#7E22CE'
    },
    {
      id: 'am5',
      name: 'Children Play Area',
      category: 'Kids',
      isBookable: false,
      timing: 'Open 24 Hours',
      status: 'Active',
      image: 'https://images.unsplash.com/photo-1564429238817-393bd4286b2d?auto=format&fit=crop&w=300&q=80',
      iconType: 'play',
      iconBg: '#FFE4E6',
      iconColor: '#E11D48'
    },
    {
      id: 'am6',
      name: 'Rooftop Garden',
      category: 'Leisure',
      isBookable: false,
      timing: 'Open 24 Hours',
      status: 'Out of Service',
      closedNotice: 'Temporarily Closed',
      image: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=300&q=80',
      iconType: 'garden',
      iconBg: '#FEF3C7',
      iconColor: '#D97706'
    }
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const handleAddAmenity = () => {
    Alert.alert(
      'Add New Amenity',
      'Enter amenity name, timing, and booking rules:',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Add Amenity', 
          onPress: () => {
            const newAmenity: AmenityRecord = {
              id: `am${Date.now()}`,
              name: 'Tennis Court',
              category: 'Sports',
              isBookable: true,
              timing: '06:00 AM - 09:00 PM',
              status: 'Active',
              image: 'https://images.unsplash.com/photo-1595435934249-5df7ed86e1c0?auto=format&fit=crop&w=300&q=80',
              iconType: 'badminton',
              iconBg: '#ECFCCB',
              iconColor: '#163316'
            };
            setAmenities(prev => [...prev, newAmenity]);
            Alert.alert('Amenity Added 🎉', 'Tennis Court added successfully to society!');
          }
        }
      ]
    );
  };

  const handleViewBookings = (amenity: AmenityRecord) => {
    Alert.alert(
      `${amenity.name} Bookings`,
      `Status: ${amenity.status}\nTiming: ${amenity.timing}\nBookable: ${amenity.isBookable ? 'Yes' : 'No'}\nActive Bookings Today: 14 Slots`,
      [
        { text: 'Close', style: 'cancel' },
        { text: 'Reserve Slot', onPress: () => router.push('/(resident)/amenities') }
      ]
    );
  };

  const handleAmenityOptions = (amenity: AmenityRecord) => {
    Alert.alert(
      amenity.name,
      'Select action:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Edit Hours & Rules', onPress: () => Alert.alert('Edit Rules', 'Editing amenity rules...') },
        { 
          text: amenity.status === 'Maintenance' ? 'Set as Active' : 'Mark for Maintenance', 
          onPress: () => {
            setAmenities(prev => prev.map(a => a.id === amenity.id ? { ...a, status: a.status === 'Maintenance' ? 'Active' : 'Maintenance' } : a));
          }
        }
      ]
    );
  };

  const handleAmenityReport = () => {
    Alert.alert('Amenity Report 📊', 'Exporting amenity slot booking & maintenance utilization PDF report...');
  };

  // Filter amenities
  const filteredAmenities = amenities.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);

    if (activeFilter === 'bookable') return matchesQuery && item.isBookable;
    if (activeFilter === 'maintenance') return matchesQuery && item.status === 'Maintenance';
    if (activeFilter === 'out_of_service') return matchesQuery && item.status === 'Out of Service';
    if (activeFilter === 'active') return matchesQuery && item.status === 'Active';
    return matchesQuery;
  });

  const getStatusBadge = (status: AmenityRecord['status']) => {
    switch(status) {
      case 'Active': return { bg: '#ECFCCB', color: '#163316' };
      case 'Maintenance': return { bg: '#FFEDD5', color: '#C2410C' };
      case 'Out of Service': return { bg: '#FFE4E6', color: '#E11D48' };
    }
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
          <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 18 }}>Amenity Management</Text>
          <Text style={{ color: '#94A3B8', fontSize: 12, fontWeight: '600', marginTop: 2 }}>
            Manage and monitor all society amenities
          </Text>
        </View>

        <TouchableOpacity 
          onPress={handleAddAmenity}
          style={{
            backgroundColor: '#163316', paddingHorizontal: 12, paddingVertical: 8,
            borderRadius: 14, flexDirection: 'row', alignItems: 'center'
          }}
        >
          <Plus size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 11 }}>Add Amenity</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#163316" />}
      >
        {/* SEARCH BAR & FILTER DROPDOWN */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
          <View style={{
            flex: 1, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0',
            borderRadius: 20, paddingHorizontal: 14, height: 48, flexDirection: 'row',
            alignItems: 'center'
          }}>
            <Search size={18} color="#163316" style={{ marginRight: 10 }} />
            <TextInput
              placeholder="Search by amenity name or type..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{ flex: 1, color: '#0F172A', fontWeight: '600', fontSize: 13 }}
            />
          </View>

          <TouchableOpacity 
            onPress={() => Alert.alert('Filter', 'Filter by category: Sports, Leisure, Events, Fitness')}
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

        {/* TOP SUMMARY STAT CARDS (5 METRICS) */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 20 }}>
          {/* Card 1: Total Amenities */}
          <View style={{ width: 110, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#ECFCCB', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <LayoutGrid size={16} color="#163316" />
            </View>
            <Text style={{ color: '#0F172A', fontSize: 20, fontWeight: '900' }}>16</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2, lineHeight: 12 }}>Total Amenities</Text>
            <Text style={{ color: '#163316', fontSize: 8, fontWeight: '800', marginTop: 2 }}>↑ 2 this month</Text>
          </View>

          {/* Card 2: Bookable */}
          <View style={{ width: 110, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Calendar size={16} color="#0284C7" />
            </View>
            <Text style={{ color: '#0F172A', fontSize: 20, fontWeight: '900' }}>7</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2, lineHeight: 12 }}>Bookable</Text>
            <Text style={{ color: '#0284C7', fontSize: 8, fontWeight: '800', marginTop: 2 }}>View All</Text>
          </View>

          {/* Card 3: Maintenance */}
          <View style={{ width: 110, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#FFEDD5', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Wrench size={16} color="#C2410C" />
            </View>
            <Text style={{ color: '#0F172A', fontSize: 20, fontWeight: '900' }}>5</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2, lineHeight: 12 }}>Maintenance</Text>
            <Text style={{ color: '#C2410C', fontSize: 8, fontWeight: '800', marginTop: 2 }}>View All</Text>
          </View>

          {/* Card 4: Out of Service */}
          <View style={{ width: 110, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#F3E8FF', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <PauseCircle size={16} color="#7E22CE" />
            </View>
            <Text style={{ color: '#0F172A', fontSize: 20, fontWeight: '900' }}>2</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2, lineHeight: 12 }}>Out of Service</Text>
            <Text style={{ color: '#7E22CE', fontSize: 8, fontWeight: '800', marginTop: 2 }}>View All</Text>
          </View>

          {/* Card 5: Active */}
          <View style={{ width: 110, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#DCFCE7', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <CheckCircle2 size={16} color="#15803D" />
            </View>
            <Text style={{ color: '#0F172A', fontSize: 20, fontWeight: '900' }}>12</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2, lineHeight: 12 }}>Active</Text>
            <Text style={{ color: '#15803D', fontSize: 8, fontWeight: '800', marginTop: 2 }}>View All</Text>
          </View>
        </ScrollView>

        {/* CATEGORY FILTER PILLS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 20 }}>
          {[
            { id: 'all', label: 'All Amenities (16)' },
            { id: 'bookable', label: 'Bookable (7)' },
            { id: 'maintenance', label: 'Maintenance (5)' },
            { id: 'out_of_service', label: 'Out of Service (2)' },
            { id: 'active', label: 'Active (12)' }
          ].map(pill => {
            const isActive = activeFilter === pill.id;
            return (
              <TouchableOpacity
                key={pill.id}
                onPress={() => setActiveFilter(pill.id as any)}
                style={{
                  paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20,
                  backgroundColor: isActive ? '#163316' : '#F1F5F9',
                  borderWidth: 1, borderColor: isActive ? '#163316' : '#E2E8F0'
                }}
              >
                <Text style={{
                  fontWeight: '800', fontSize: 12,
                  color: isActive ? '#FFFFFF' : '#64748B'
                }}>
                  {pill.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* AMENITY CARDS LIST */}
        <View style={{ gap: 14, marginBottom: 20 }}>
          {filteredAmenities.map(item => {
            const badge = getStatusBadge(item.status);

            return (
              <View
                key={item.id}
                style={{
                  backgroundColor: '#FFFFFF', borderRadius: 24, padding: 14,
                  borderWidth: 1, borderColor: '#F1F5F9', flexDirection: 'row',
                  alignItems: 'center'
                }}
              >
                {/* Image Thumbnail */}
                <Image 
                  source={{ uri: item.image }} 
                  style={{ width: 84, height: 84, borderRadius: 18, marginRight: 14, backgroundColor: '#E2E8F0' }} 
                />

                {/* Amenity Info Column */}
                <View style={{ flex: 1, paddingRight: 6 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 4 }}>
                      <View style={{
                        width: 24, height: 24, borderRadius: 8, backgroundColor: item.iconBg,
                        alignItems: 'center', justifyContent: 'center', marginRight: 6
                      }}>
                        {item.iconType === 'pool' ? (
                          <Waves size={14} color={item.iconColor} />
                        ) : item.iconType === 'gym' ? (
                          <Dumbbell size={14} color={item.iconColor} />
                        ) : item.iconType === 'hall' ? (
                          <Users size={14} color={item.iconColor} />
                        ) : item.iconType === 'badminton' ? (
                          <Trophy size={14} color={item.iconColor} />
                        ) : item.iconType === 'play' ? (
                          <Trees size={14} color={item.iconColor} />
                        ) : (
                          <Leaf size={14} color={item.iconColor} />
                        )}
                      </View>

                      <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 14, flex: 1 }}>{item.name}</Text>
                    </View>

                    {/* Status Badge & 3-Dots Menu */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <View style={{ backgroundColor: badge.bg, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 }}>
                        <Text style={{ color: badge.color, fontWeight: '800', fontSize: 9 }}>{item.status}</Text>
                      </View>

                      <TouchableOpacity onPress={() => handleAmenityOptions(item)} style={{ padding: 2 }}>
                        <MoreVertical size={16} color="#94A3B8" />
                      </TouchableOpacity>
                    </View>
                  </View>

                  <Text style={{ color: '#64748B', fontSize: 10, fontWeight: '600', marginTop: 4 }}>
                    {item.category}  |  {item.isBookable ? '📅 Bookable' : '📅 Non-Bookable'}
                  </Text>

                  {/* Notices / Timing Row */}
                  {item.maintenanceNotice ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                      <Wrench size={11} color="#C2410C" style={{ marginRight: 4 }} />
                      <Text style={{ color: '#C2410C', fontSize: 10, fontWeight: '700' }}>{item.maintenanceNotice}</Text>
                    </View>
                  ) : item.closedNotice ? (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                      <AlertTriangle size={11} color="#E11D48" style={{ marginRight: 4 }} />
                      <Text style={{ color: '#E11D48', fontSize: 10, fontWeight: '700' }}>{item.closedNotice}</Text>
                    </View>
                  ) : (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                      <Clock size={11} color="#64748B" style={{ marginRight: 4 }} />
                      <Text style={{ color: '#64748B', fontSize: 10, fontWeight: '600' }}>{item.timing}</Text>
                    </View>
                  )}

                  {/* Action Button Row */}
                  <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 }}>
                    <TouchableOpacity
                      onPress={() => handleViewBookings(item)}
                      style={{
                        paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12,
                        borderWidth: 1, borderColor: item.status === 'Maintenance' ? '#C2410C' : '#163316',
                        backgroundColor: '#FFFFFF'
                      }}
                    >
                      <Text style={{ color: item.status === 'Maintenance' ? '#C2410C' : '#163316', fontWeight: '800', fontSize: 11 }}>
                        {item.status === 'Maintenance' ? 'Maintenance' : item.isBookable ? 'View Bookings' : 'View Details'}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* AMENITY MAINTENANCE NOTICE BANNER WITH AMENITY REPORT ACTION */}
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
            <Text style={{ color: '#163316', fontWeight: '700', fontSize: 10, flex: 1, lineHeight: 14 }}>
              Keep amenities in top condition for a better living experience. Regular maintenance ensures safety and satisfaction.
            </Text>
          </View>

          <TouchableOpacity 
            onPress={handleAmenityReport}
            style={{
              backgroundColor: '#FFFFFF', paddingHorizontal: 10, paddingVertical: 8,
              borderRadius: 14, borderWidth: 1, borderColor: '#163316',
              flexDirection: 'row', alignItems: 'center'
            }}
          >
            <BarChart3 size={14} color="#163316" style={{ marginRight: 4 }} />
            <Text style={{ color: '#163316', fontWeight: '800', fontSize: 10 }}>Amenity Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
