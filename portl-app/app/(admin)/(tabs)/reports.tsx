import React, { useState } from 'react';
import { 
  View, Text, TouchableOpacity, ScrollView, RefreshControl, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, Download, Calendar, Filter, Users, User, 
  Wallet, Shield, Megaphone, BarChart3, Building, UserCheck, 
  FileText, MoreVertical, ChevronRight, TrendingUp, TrendingDown, ChevronDown 
} from 'lucide-react-native';

export default function AnalyticsAndReportsScreen() {
  const router = useRouter();
  const [dateRange, setDateRange] = useState('01 May 2024 - 31 May 2024');
  const [timeFilter, setTimeFilter] = useState('This Month');
  const [refreshing, setRefreshing] = useState(false);

  const analyticsBreakdown = [
    {
      id: 'ab1',
      title: 'Visitor Analytics',
      metric: 'Total 236 visitors',
      trend: '↑ 18 this month',
      isUp: true,
      iconBg: '#ECFCCB',
      iconColor: '#163316',
      sparklineColor: '#163316',
      icon: User
    },
    {
      id: 'ab2',
      title: 'Booking Analytics',
      metric: 'Total 128 bookings',
      trend: '↑ 10 this month',
      isUp: true,
      iconBg: '#E0F2FE',
      iconColor: '#0284C7',
      sparklineColor: '#0284C7',
      icon: Calendar
    },
    {
      id: 'ab3',
      title: 'Dues Analytics',
      metric: 'Total ₹ 1,24,560',
      trend: '↑ 15% this month',
      isUp: true,
      iconBg: '#FFEDD5',
      iconColor: '#C2410C',
      sparklineColor: '#C2410C',
      icon: Wallet
    },
    {
      id: 'ab4',
      title: 'Complaint Analytics',
      metric: 'Total 72 complaints',
      trend: '↓ 8 this month',
      isUp: false,
      iconBg: '#F3E8FF',
      iconColor: '#7E22CE',
      sparklineColor: '#7E22CE',
      icon: Shield
    },
    {
      id: 'ab5',
      title: 'Notice Analytics',
      metric: 'Total 36 notices',
      trend: '↑ 6 this month',
      isUp: true,
      iconBg: '#F3E8FF',
      iconColor: '#7E22CE',
      sparklineColor: '#7E22CE',
      icon: Megaphone
    },
    {
      id: 'ab6',
      title: 'Poll Analytics',
      metric: 'Total 12 polls',
      trend: '↑ 4 this month',
      isUp: true,
      iconBg: '#E0F2FE',
      iconColor: '#0284C7',
      sparklineColor: '#0284C7',
      icon: BarChart3
    },
    {
      id: 'ab7',
      title: 'Amenity Analytics',
      metric: 'Total 16 amenities',
      trend: '↑ 3 this month',
      isUp: true,
      iconBg: '#ECFCCB',
      iconColor: '#163316',
      sparklineColor: '#163316',
      icon: Building
    },
    {
      id: 'ab8',
      title: 'Staff Analytics',
      metric: 'Total 32 members',
      trend: '↑ 2 this month',
      isUp: true,
      iconBg: '#FFEDD5',
      iconColor: '#C2410C',
      sparklineColor: '#C2410C',
      icon: UserCheck
    }
  ];

  const recentReports = [
    {
      id: 'r1',
      title: 'Monthly Summary Report - May 2024',
      subtitle: 'Generated on 01 Jun 2024, 09:30 AM',
      iconBg: '#ECFCCB',
      iconColor: '#163316',
      icon: FileText
    },
    {
      id: 'r2',
      title: 'Visitor Report - May 2024',
      subtitle: 'Generated on 01 Jun 2024, 09:15 AM',
      iconBg: '#E0F2FE',
      iconColor: '#0284C7',
      icon: Users
    },
    {
      id: 'r3',
      title: 'Dues Collection Report - May 2024',
      subtitle: 'Generated on 01 Jun 2024, 09:10 AM',
      iconBg: '#FFEDD5',
      iconColor: '#C2410C',
      icon: Wallet
    },
    {
      id: 'r4',
      title: 'Complaint Report - May 2024',
      subtitle: 'Generated on 01 Jun 2024, 09:05 AM',
      iconBg: '#F3E8FF',
      iconColor: '#7E22CE',
      icon: Shield
    }
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 800);
  };

  const handleExportReport = () => {
    Alert.alert(
      'Export Society Report',
      'Select export format:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'PDF Format', onPress: () => Alert.alert('Exporting PDF 📄', 'Society Monthly Report PDF downloaded!') },
        { text: 'Excel CSV', onPress: () => Alert.alert('Exporting CSV 📊', 'Society Monthly Data CSV exported!') }
      ]
    );
  };

  const handleDownloadReport = (reportTitle: string) => {
    Alert.alert('Downloading Report 📥', `Downloading ${reportTitle}...`);
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
          <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 18 }}>Analytics & Reports</Text>
          <Text style={{ color: '#94A3B8', fontSize: 12, fontWeight: '600', marginTop: 2 }}>
            Track insights and make data-driven decisions
          </Text>
        </View>

        <TouchableOpacity 
          onPress={handleExportReport}
          style={{
            backgroundColor: '#163316', paddingHorizontal: 12, paddingVertical: 8,
            borderRadius: 14, flexDirection: 'row', alignItems: 'center'
          }}
        >
          <Download size={14} color="#FFFFFF" style={{ marginRight: 6 }} />
          <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 11 }}>Export Report</Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#163316" />}
      >
        {/* DATE RANGE SELECTOR & FILTER DROPDOWN */}
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
          <TouchableOpacity 
            onPress={() => Alert.alert('Select Date Range', '01 May 2024 - 31 May 2024')}
            style={{
              flex: 1, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0',
              borderRadius: 20, paddingHorizontal: 14, height: 48, flexDirection: 'row',
              alignItems: 'center', justifyContent: 'space-between'
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Calendar size={16} color="#163316" style={{ marginRight: 8 }} />
              <Text style={{ color: '#0F172A', fontWeight: '700', fontSize: 12 }}>{dateRange}</Text>
            </View>
            <ChevronDown size={16} color="#94A3B8" />
          </TouchableOpacity>

          <TouchableOpacity 
            onPress={() => Alert.alert('Filter', 'Filter analytics by Tower / Block')}
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

        {/* TOP SUMMARY STAT CARDS (4 METRICS) */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
          {/* Card 1: Total Residents */}
          <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#ECFCCB', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Users size={16} color="#163316" />
            </View>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700' }}>Total Residents</Text>
            <Text style={{ color: '#0F172A', fontSize: 18, fontWeight: '900', marginTop: 2 }}>482</Text>
            <Text style={{ color: '#163316', fontSize: 8, fontWeight: '800', marginTop: 2 }}>↑ 12 this month</Text>
          </View>

          {/* Card 2: Visitors */}
          <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#E0F2FE', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <User size={16} color="#0284C7" />
            </View>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700' }}>Visitors</Text>
            <Text style={{ color: '#0F172A', fontSize: 18, fontWeight: '900', marginTop: 2 }}>236</Text>
            <Text style={{ color: '#0284C7', fontSize: 8, fontWeight: '800', marginTop: 2 }}>↑ 18 this month</Text>
          </View>

          {/* Card 3: Bookings */}
          <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#FFEDD5', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Calendar size={16} color="#C2410C" />
            </View>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700' }}>Bookings</Text>
            <Text style={{ color: '#0F172A', fontSize: 18, fontWeight: '900', marginTop: 2 }}>128</Text>
            <Text style={{ color: '#C2410C', fontSize: 8, fontWeight: '800', marginTop: 2 }}>↑ 10 this month</Text>
          </View>

          {/* Card 4: Collection */}
          <View style={{ flex: 1, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9' }}>
            <View style={{ width: 32, height: 32, borderRadius: 12, backgroundColor: '#F3E8FF', alignItems: 'center', justifyContent: 'center', marginBottom: 8 }}>
              <Wallet size={16} color="#7E22CE" />
            </View>
            <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '700' }}>Collection (Dues)</Text>
            <Text style={{ color: '#0F172A', fontSize: 14, fontWeight: '900', marginTop: 2 }}>₹ 1,24,560</Text>
            <Text style={{ color: '#7E22CE', fontSize: 8, fontWeight: '800', marginTop: 2 }}>↑ 15% this month</Text>
          </View>
        </View>

        {/* OVERVIEW CHART SECTION */}
        <View style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 18, borderWidth: 1, borderColor: '#F1F5F9', marginBottom: 22 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 16 }}>Overview</Text>
            <TouchableOpacity onPress={() => Alert.alert('Timeframe', 'Switch timeframe')} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: '#64748B', fontWeight: '700', fontSize: 11, marginRight: 4 }}>This Month</Text>
              <ChevronDown size={14} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* Visual Trend Chart Container */}
          <View style={{ height: 160, backgroundColor: '#F8FBEF', borderRadius: 16, padding: 12, justifyContent: 'space-between', marginBottom: 14 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 110, alignItems: 'flex-end' }}>
              {[
                { date: '01 May', val: 50 },
                { date: '06 May', val: 90 },
                { date: '11 May', val: 140 },
                { date: '16 May', val: 80 },
                { date: '21 May', val: 160 },
                { date: '26 May', val: 190 },
                { date: '31 May', val: 130 }
              ].map((pt, idx) => (
                <View key={idx} style={{ alignItems: 'center', flex: 1 }}>
                  <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: '#163316', marginBottom: 4 }} />
                  <View style={{ width: 2, height: pt.val, backgroundColor: '#163316', borderRadius: 1 }} />
                  <Text style={{ color: '#64748B', fontSize: 8, fontWeight: '600', marginTop: 6 }}>{pt.date}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Metrics Summary Strip (4 Columns) */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTopWidth: 1, borderTopColor: '#F8FAFC' }}>
            <View style={{ flex: 1, alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#163316', marginRight: 4 }} />
                <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '600' }}>Residents</Text>
              </View>
              <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 13 }}>482</Text>
            </View>

            <View style={{ width: 1, height: 20, backgroundColor: '#F1F5F9' }} />

            <View style={{ flex: 1, alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#0284C7', marginRight: 4 }} />
                <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '600' }}>Visitors</Text>
              </View>
              <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 13 }}>236</Text>
            </View>

            <View style={{ width: 1, height: 20, backgroundColor: '#F1F5F9' }} />

            <View style={{ flex: 1, alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#C2410C', marginRight: 4 }} />
                <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '600' }}>Bookings</Text>
              </View>
              <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 13 }}>128</Text>
            </View>

            <View style={{ width: 1, height: 20, backgroundColor: '#F1F5F9' }} />

            <View style={{ flex: 1, alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#7E22CE', marginRight: 4 }} />
                <Text style={{ color: '#64748B', fontSize: 9, fontWeight: '600' }}>Dues Collected</Text>
              </View>
              <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 12 }}>₹ 1,24,560</Text>
            </View>
          </View>
        </View>

        {/* ANALYTICS BREAKDOWN SECTION (2x4 GRID = 8 CARDS) */}
        <View style={{ marginBottom: 22 }}>
          <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 16, marginBottom: 12 }}>Analytics Breakdown</Text>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {analyticsBreakdown.map(item => {
              const IconComp = item.icon;

              return (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => Alert.alert(item.title, `${item.metric}\nTrend: ${item.trend}`)}
                  style={{
                    width: '48%', backgroundColor: '#FFFFFF', padding: 14,
                    borderRadius: 20, borderWidth: 1, borderColor: '#F1F5F9'
                  }}
                >
                  <View style={{ width: 34, height: 34, borderRadius: 12, backgroundColor: item.iconBg, alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
                    <IconComp size={18} color={item.iconColor} />
                  </View>

                  <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 13 }}>{item.title}</Text>
                  <Text style={{ color: '#64748B', fontSize: 10, fontWeight: '600', marginTop: 2 }}>{item.metric}</Text>

                  {/* Sparkline trend visual */}
                  <View style={{ height: 16, flexDirection: 'row', alignItems: 'flex-end', gap: 3, marginVertical: 8 }}>
                    {[8, 12, 10, 15, 14, 18, 16].map((h, i) => (
                      <View key={i} style={{ flex: 1, height: h, backgroundColor: item.sparklineColor, opacity: 0.2 + (i * 0.12), borderRadius: 2 }} />
                    ))}
                  </View>

                  <Text style={{ color: item.isUp ? '#163316' : '#E11D48', fontSize: 9, fontWeight: '800' }}>
                    {item.trend}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* RECENT REPORTS DOWNLOAD SECTION */}
        <View style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 16 }}>Recent Reports</Text>
            <TouchableOpacity onPress={() => Alert.alert('All Reports', 'Showing all generated society reports')} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: '#163316', fontWeight: '700', fontSize: 12, marginRight: 2 }}>View All</Text>
              <ChevronRight size={14} color="#163316" />
            </TouchableOpacity>
          </View>

          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 12, borderWidth: 1, borderColor: '#F1F5F9', gap: 4 }}>
            {recentReports.map((report, idx) => {
              const ReportIcon = report.icon;

              return (
                <View
                  key={report.id}
                  style={{
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                    paddingVertical: 10, paddingHorizontal: 6,
                    borderBottomWidth: idx < recentReports.length - 1 ? 1 : 0,
                    borderBottomColor: '#F8FAFC'
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 10 }}>
                    <View style={{
                      width: 40, height: 40, borderRadius: 14, backgroundColor: report.iconBg,
                      alignItems: 'center', justifyContent: 'center', marginRight: 12
                    }}>
                      <ReportIcon size={18} color={report.iconColor} />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 13 }}>{report.title}</Text>
                      <Text style={{ color: '#64748B', fontSize: 10, fontWeight: '500', marginTop: 2 }}>{report.subtitle}</Text>
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <TouchableOpacity
                      onPress={() => handleDownloadReport(report.title)}
                      style={{ flexDirection: 'row', alignItems: 'center' }}
                    >
                      <Download size={14} color="#163316" style={{ marginRight: 4 }} />
                      <Text style={{ color: '#163316', fontWeight: '800', fontSize: 11 }}>Download</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => Alert.alert(report.title, 'Report Options')} style={{ padding: 2 }}>
                      <MoreVertical size={16} color="#94A3B8" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
