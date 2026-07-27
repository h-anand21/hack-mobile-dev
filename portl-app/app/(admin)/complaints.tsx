import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, RefreshControl, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, Plus, Search, Filter, FileText, Hourglass, RefreshCw, 
  CheckCircle2, XCircle, Droplets, Zap, ParkingCircle, Trash2, 
  Volume2, Calendar, ChevronLeft, ChevronRight, ShieldCheck, BarChart3, ChevronRight as ArrowRight 
} from 'lucide-react-native';

export type ComplaintStatusType = 'all' | 'pending' | 'in_progress' | 'resolved' | 'closed';

export interface ComplaintRecord {
  id: string;
  cmpNumber: string;
  title: string;
  locationResident: string;
  date: string;
  urgency: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Resolved' | 'Closed';
  assignedTo?: string;
  resolvedOn?: string;
  closedOn?: string;
  iconType: 'water' | 'tech' | 'parking' | 'garbage' | 'noise';
  iconBg: string;
  iconColor: string;
}

export default function ComplaintManagementScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<ComplaintStatusType>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);

  const [complaints, setComplaints] = useState<ComplaintRecord[]>([
    {
      id: 'c1',
      cmpNumber: '#CMP-072',
      title: 'Water leakage in Kitchen',
      locationResident: 'Flat B-302 • Rahul Sharma',
      date: 'Today, 10:25 AM',
      urgency: 'High',
      status: 'Pending',
      assignedTo: 'Maintenance Team',
      iconType: 'water',
      iconBg: '#FFEDD5',
      iconColor: '#C2410C'
    },
    {
      id: 'c2',
      cmpNumber: '#CMP-071',
      title: 'Lift not working',
      locationResident: 'Tower A • Neha Sharma',
      date: 'Today, 09:40 AM',
      urgency: 'High',
      status: 'In Progress',
      assignedTo: 'Tech Team',
      iconType: 'tech',
      iconBg: '#E0F2FE',
      iconColor: '#0284C7'
    },
    {
      id: 'c3',
      cmpNumber: '#CMP-070',
      title: 'Parking area not clean',
      locationResident: 'Tower B • Amit Kumar',
      date: 'Yesterday, 06:15 PM',
      urgency: 'Medium',
      status: 'In Progress',
      assignedTo: 'Housekeeping Team',
      iconType: 'parking',
      iconBg: '#F3E8FF',
      iconColor: '#7E22CE'
    },
    {
      id: 'c4',
      cmpNumber: '#CMP-069',
      title: 'Garbage not collected',
      locationResident: 'Flat C-1101 • Priya Mehta',
      date: 'Yesterday, 04:30 PM',
      urgency: 'Low',
      status: 'Resolved',
      resolvedOn: '24 May, 02:15 PM',
      iconType: 'garbage',
      iconBg: '#ECFCCB',
      iconColor: '#163316'
    },
    {
      id: 'c5',
      cmpNumber: '#CMP-068',
      title: 'Noise disturbance in night',
      locationResident: 'Flat A-504 • Vikram Singh',
      date: '22 May, 11:20 PM',
      urgency: 'High',
      status: 'Closed',
      closedOn: '23 May, 10:10 AM',
      iconType: 'noise',
      iconBg: '#FFE4E6',
      iconColor: '#E11D48'
    }
  ]);

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const handleNewComplaint = () => {
    router.push('/(resident)/raise-complaint');
  };

  const handleComplaintClick = (complaint: ComplaintRecord) => {
    Alert.alert(
      `${complaint.cmpNumber}: ${complaint.title}`,
      `Resident: ${complaint.locationResident}\nUrgency: ${complaint.urgency}\nStatus: ${complaint.status}\nAssigned: ${complaint.assignedTo || 'N/A'}`,
      [
        { text: 'Close', style: 'cancel' },
        { 
          text: 'Update Status', 
          onPress: () => {
            Alert.alert(
              'Change Status',
              'Select new status for this complaint:',
              [
                { text: 'Pending', onPress: () => updateStatus(complaint.id, 'Pending') },
                { text: 'In Progress', onPress: () => updateStatus(complaint.id, 'In Progress') },
                { text: 'Resolved', onPress: () => updateStatus(complaint.id, 'Resolved') },
                { text: 'Close Complaint', onPress: () => updateStatus(complaint.id, 'Closed') }
              ]
            );
          }
        }
      ]
    );
  };

  const updateStatus = (id: string, newStatus: ComplaintRecord['status']) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: newStatus } : c));
    Alert.alert('Status Updated 🎉', `Complaint status updated to ${newStatus}`);
  };

  const handleGenerateReport = () => {
    Alert.alert('Generate Audit Report', 'Downloading PDF report for all society complaints & resolution times...');
  };

  // Filter complaints
  const filteredComplaints = complaints.filter(item => {
    const q = searchQuery.toLowerCase();
    const matchesQuery = item.cmpNumber.toLowerCase().includes(q) || 
                         item.title.toLowerCase().includes(q) || 
                         item.locationResident.toLowerCase().includes(q);

    if (activeFilter === 'pending') return matchesQuery && item.status === 'Pending';
    if (activeFilter === 'in_progress') return matchesQuery && item.status === 'In Progress';
    if (activeFilter === 'resolved') return matchesQuery && item.status === 'Resolved';
    if (activeFilter === 'closed') return matchesQuery && item.status === 'Closed';
    return matchesQuery;
  });

  const getUrgencyBadge = (urgency: ComplaintRecord['urgency']) => {
    switch(urgency) {
      case 'High': return { bg: '#FFE4E6', color: '#E11D48', label: 'High •' };
      case 'Medium': return { bg: '#FEF3C7', color: '#D97706', label: 'Medium' };
      case 'Low': return { bg: '#DCFCE7', color: '#15803D', label: 'Low •' };
    }
  };

  const getStatusBadge = (status: ComplaintRecord['status']) => {
    switch(status) {
      case 'Pending': return { bg: '#FFEDD5', color: '#C2410C' };
      case 'In Progress': return { bg: '#E0F2FE', color: '#0284C7' };
      case 'Resolved': return { bg: '#ECFCCB', color: '#163316' };
      case 'Closed': return { bg: '#F1F5F9', color: '#64748B' };
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
          <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 18 }}>Complaint Management</Text>
          <Text style={{ color: '#94A3B8', fontSize: 12, fontWeight: '600', marginTop: 2 }}>
            Track and resolve all complaints
          </Text>
        </View>

        <TouchableOpacity 
          onPress={handleNewComplaint}
          style={{
            backgroundColor: '#163316', paddingHorizontal: 12, paddingVertical: 8,
            borderRadius: 14, flexDirection: 'row', alignItems: 'center'
          }}
        >
          <Plus size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 11 }}>New Complaint</Text>
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
              placeholder="Search by complaint ID, title or resident..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{ flex: 1, color: '#0F172A', fontWeight: '600', fontSize: 13 }}
            />
          </View>

          <TouchableOpacity 
            onPress={() => Alert.alert('Filter', 'Filter by category or urgency')}
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
          {/* Card 1: Total Complaints */}
          <View style={{ width: 110, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#ECFCCB', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <FileText size={16} color="#163316" />
            </View>
            <Text style={{ color: '#0F172A', fontSize: 20, fontWeight: '900' }}>72</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2, lineHeight: 12 }}>Total Complaints</Text>
            <Text style={{ color: '#163316', fontSize: 8, fontWeight: '800', marginTop: 2 }}>↑ 8 this week</Text>
          </View>

          {/* Card 2: Pending */}
          <View style={{ width: 110, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#FFEDD5', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Hourglass size={16} color="#C2410C" />
            </View>
            <Text style={{ color: '#0F172A', fontSize: 20, fontWeight: '900' }}>18</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2, lineHeight: 12 }}>Pending</Text>
            <Text style={{ color: '#C2410C', fontSize: 8, fontWeight: '800', marginTop: 2 }}>↓ 3 this week</Text>
          </View>

          {/* Card 3: In Progress */}
          <View style={{ width: 110, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <RefreshCw size={16} color="#0284C7" />
            </View>
            <Text style={{ color: '#0F172A', fontSize: 20, fontWeight: '900' }}>26</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2, lineHeight: 12 }}>In Progress</Text>
            <Text style={{ color: '#0284C7', fontSize: 8, fontWeight: '800', marginTop: 2 }}>↑ 5 this week</Text>
          </View>

          {/* Card 4: Resolved */}
          <View style={{ width: 110, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#F3E8FF', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <CheckCircle2 size={16} color="#7E22CE" />
            </View>
            <Text style={{ color: '#0F172A', fontSize: 20, fontWeight: '900' }}>20</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2, lineHeight: 12 }}>Resolved</Text>
            <Text style={{ color: '#7E22CE', fontSize: 8, fontWeight: '800', marginTop: 2 }}>↑ 7 this week</Text>
          </View>

          {/* Card 5: Closed */}
          <View style={{ width: 110, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#FFE4E6', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <XCircle size={16} color="#E11D48" />
            </View>
            <Text style={{ color: '#0F172A', fontSize: 20, fontWeight: '900' }}>8</Text>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700', marginTop: 2, lineHeight: 12 }}>Closed</Text>
            <Text style={{ color: '#E11D48', fontSize: 8, fontWeight: '800', marginTop: 2 }}>↓ 2 this week</Text>
          </View>
        </ScrollView>

        {/* CATEGORY FILTER PILLS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 20 }}>
          {[
            { id: 'all', label: 'All (72)' },
            { id: 'pending', label: 'Pending (18)' },
            { id: 'in_progress', label: 'In Progress (26)' },
            { id: 'resolved', label: 'Resolved (20)' },
            { id: 'closed', label: 'Closed (8)' }
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

        {/* COMPLAINT CARDS LIST */}
        <View style={{ gap: 12, marginBottom: 20 }}>
          {filteredComplaints.map(item => {
            const urgencyBadge = getUrgencyBadge(item.urgency);
            const statusBadge = getStatusBadge(item.status);

            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleComplaintClick(item)}
                style={{
                  backgroundColor: '#FFFFFF', borderRadius: 24, padding: 14,
                  borderWidth: 1, borderColor: '#F1F5F9', flexDirection: 'row',
                  alignItems: 'center', justifyContent: 'space-between'
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 10 }}>
                  {/* Circular Category Icon */}
                  <View style={{
                    width: 46, height: 46, borderRadius: 23, backgroundColor: item.iconBg,
                    alignItems: 'center', justifyContent: 'center', marginRight: 12
                  }}>
                    {item.iconType === 'water' ? (
                      <Droplets size={22} color={item.iconColor} />
                    ) : item.iconType === 'tech' ? (
                      <Zap size={22} color={item.iconColor} />
                    ) : item.iconType === 'parking' ? (
                      <ParkingCircle size={22} color={item.iconColor} />
                    ) : item.iconType === 'garbage' ? (
                      <Trash2 size={22} color={item.iconColor} />
                    ) : (
                      <Volume2 size={22} color={item.iconColor} />
                    )}
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={{ color: '#94A3B8', fontSize: 10, fontWeight: '700' }}>{item.cmpNumber}</Text>
                    <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 15, marginTop: 1 }}>{item.title}</Text>
                    <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '600', marginTop: 2 }}>{item.locationResident}</Text>
                    
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Calendar size={10} color="#94A3B8" style={{ marginRight: 4 }} />
                        <Text style={{ color: '#94A3B8', fontSize: 10, fontWeight: '500' }}>{item.date}</Text>
                      </View>

                      <View style={{ backgroundColor: urgencyBadge.bg, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 6 }}>
                        <Text style={{ color: urgencyBadge.color, fontWeight: '800', fontSize: 9 }}>{urgencyBadge.label}</Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Right Status Column */}
                <View style={{ alignItems: 'flex-end', justifyContent: 'center' }}>
                  <View style={{ backgroundColor: statusBadge.bg, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, marginBottom: 4 }}>
                    <Text style={{ color: statusBadge.color, fontWeight: '800', fontSize: 10 }}>{item.status}</Text>
                  </View>

                  <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '600', textAlign: 'right' }}>
                    {item.assignedTo ? `Assigned to\n${item.assignedTo}` : item.resolvedOn ? `Resolved on\n${item.resolvedOn}` : `Closed on\n${item.closedOn}`}
                  </Text>
                </View>

                <ArrowRight size={16} color="#94A3B8" style={{ marginLeft: 6 }} />
              </TouchableOpacity>
            );
          })}
        </View>

        {/* PAGINATION CONTROL BAR */}
        <View style={{
          flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
          gap: 16, marginBottom: 20
        }}>
          <TouchableOpacity
            onPress={() => setCurrentPage(Math.max(1, currentPage - 1))}
            style={{
              width: 36, height: 36, borderRadius: 12, backgroundColor: '#FFFFFF',
              borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <ChevronLeft size={18} color="#163316" />
          </TouchableOpacity>

          <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 13 }}>
            Page {currentPage} of 8
          </Text>

          <TouchableOpacity
            onPress={() => setCurrentPage(currentPage + 1)}
            style={{
              width: 36, height: 36, borderRadius: 12, backgroundColor: '#FFFFFF',
              borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center', justifyContent: 'center'
            }}
          >
            <ChevronRight size={18} color="#163316" />
          </TouchableOpacity>
        </View>

        {/* NOTICE BANNER WITH GENERATE REPORT ACTION */}
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
              Quick resolution improves community satisfaction. Keep it up!
            </Text>
          </View>

          <TouchableOpacity 
            onPress={handleGenerateReport}
            style={{
              backgroundColor: '#FFFFFF', paddingHorizontal: 12, paddingVertical: 8,
              borderRadius: 14, borderWidth: 1, borderColor: '#163316',
              flexDirection: 'row', alignItems: 'center'
            }}
          >
            <BarChart3 size={14} color="#163316" style={{ marginRight: 4 }} />
            <Text style={{ color: '#163316', fontWeight: '800', fontSize: 11 }}>Generate Report</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
