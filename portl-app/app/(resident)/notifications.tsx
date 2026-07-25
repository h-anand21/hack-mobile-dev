import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Bell, Users, Megaphone, Vote, ChevronRight, Check } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export type NotificationType = 'visitor' | 'poll' | 'notice';

export interface NotificationItem {
  id: string;
  title: string;
  body: string;
  time: string;
  type: NotificationType;
  read: boolean;
  targetRoute?: string;
  routeParams?: any;
}

export default function NotificationsScreen() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<'all' | 'visitor' | 'poll' | 'notice'>('all');

  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'n1',
      title: 'Visitor Waiting for Approval 🚘',
      body: 'Rahul Sharma (Amazon Delivery) is waiting at the main gate for Flat B-302.',
      time: '2 mins ago',
      type: 'visitor',
      read: false,
      targetRoute: '/(resident)/visitor-details',
      routeParams: {
        id: 'demo-visitor-1',
        name: 'Rahul Sharma',
        purpose: 'Amazon Delivery',
        vehicle_number: 'KA01 AB 1234',
        phone: '98765 43210',
        photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
        timeAgo: 'Arrived 2 mins ago',
        note: 'Handing over a package to Himanshu (B-302)',
        visitingFlat: 'Himanshu (B-302) • Tower A',
        status: 'pending'
      }
    },
    {
      id: 'n2',
      title: 'New Community Poll Live 📊',
      body: 'Poll: "Should we organize a Community Clean-up Drive this month?" - Cast your vote now!',
      time: '30 mins ago',
      type: 'poll',
      read: false,
      targetRoute: '/(resident)/community-polls'
    },
    {
      id: 'n3',
      title: 'Water Supply Maintenance 🚰',
      body: 'Water supply will be interrupted tomorrow from 10:00 AM to 12:00 PM for tank cleaning.',
      time: '1 hour ago',
      type: 'notice',
      read: false,
      targetRoute: '/(resident)/notice-board'
    },
    {
      id: 'n4',
      title: 'Visitor Approved & Checked In 🚪',
      body: 'Priya Verma (Guest) has entered Tower A at 11:30 AM.',
      time: '3 hours ago',
      type: 'visitor',
      read: true,
      targetRoute: '/(resident)/(tabs)/visitors'
    },
    {
      id: 'n5',
      title: 'Poll Ending Soon ⏳',
      body: 'Poll: "Preferred Location for Additional Visitor Parking" ends in 2 days.',
      time: '1 day ago',
      type: 'poll',
      read: true,
      targetRoute: '/(resident)/community-polls'
    },
    {
      id: 'n6',
      title: 'Diwali Celebration Announcement 🎉',
      body: 'Join us for Diwali grand celebration in central park on Friday evening!',
      time: '2 days ago',
      type: 'notice',
      read: true,
      targetRoute: '/(resident)/notice-board'
    }
  ]);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    Alert.alert('Notifications', 'All notifications marked as read');
  };

  const handleItemPress = (item: NotificationItem) => {
    setNotifications(prev => prev.map(n => n.id === item.id ? { ...n, read: true } : n));

    if (item.targetRoute) {
      if (item.routeParams) {
        router.push({ pathname: item.targetRoute as any, params: item.routeParams });
      } else {
        router.push(item.targetRoute as any);
      }
    } else {
      Alert.alert(item.title, item.body);
    }
  };

  const filtered = notifications.filter(n => {
    if (activeFilter === 'visitor') return n.type === 'visitor';
    if (activeFilter === 'poll') return n.type === 'poll';
    if (activeFilter === 'notice') return n.type === 'notice';
    return true;
  });

  const getCategoryConfig = (type: NotificationType) => {
    switch (type) {
      case 'visitor':
        return {
          bgColor: '#ECFCCB',
          iconColor: '#163316',
          label: 'Visitor',
          IconComponent: Users
        };
      case 'poll':
        return {
          bgColor: '#EDE9FE',
          iconColor: '#7C3AED',
          label: 'Poll',
          IconComponent: Vote
        };
      case 'notice':
        return {
          bgColor: '#DBEAFE',
          iconColor: '#2563EB',
          label: 'Notice',
          IconComponent: Megaphone
        };
      default:
        return {
          bgColor: '#F1F5F9',
          iconColor: '#475569',
          label: 'Alert',
          IconComponent: Bell
        };
    }
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FB' }}>
      {/* HEADER BAR */}
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 12,
        paddingBottom: 16,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9'
      }}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 40, height: 40,
            backgroundColor: '#F8FAFC',
            borderRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: '#F1F5F9'
          }}
        >
          <ArrowLeft size={20} color="#1E293B" />
        </TouchableOpacity>

        <View style={{ alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 18 }}>Notifications</Text>
            {unreadCount > 0 && (
              <View style={{
                backgroundColor: '#F43F5E',
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 10,
                marginLeft: 6
              }}>
                <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '900' }}>{unreadCount}</Text>
              </View>
            )}
          </View>
          <Text style={{ color: '#94A3B8', fontSize: 12, fontWeight: '600', marginTop: 2 }}>Stay updated with real-time alerts</Text>
        </View>

        <TouchableOpacity
          onPress={handleMarkAllRead}
          style={{
            backgroundColor: '#F8FAFC',
            paddingHorizontal: 10,
            paddingVertical: 6,
            borderRadius: 20,
            borderWidth: 1,
            borderColor: '#F1F5F9',
            flexDirection: 'row',
            alignItems: 'center'
          }}
        >
          <View style={{ marginRight: 4 }}>
            <Check size={12} color="#475569" />
          </View>
          <Text style={{ color: '#475569', fontWeight: '700', fontSize: 11 }}>Mark Read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1, paddingHorizontal: 20, paddingTop: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* CATEGORY FILTER TAB PILLS */}
        <View style={{
          backgroundColor: '#FFFFFF',
          padding: 5,
          borderRadius: 16,
          flexDirection: 'row',
          marginBottom: 18,
          borderWidth: 1,
          borderColor: '#F1F5F9',
          justifyContent: 'space-between'
        }}>
          {[
            { id: 'all', title: 'All' },
            { id: 'visitor', title: 'Visitors' },
            { id: 'poll', title: 'Polls' },
            { id: 'notice', title: 'Notices' }
          ].map(tab => {
            const isActive = activeFilter === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                onPress={() => setActiveFilter(tab.id as any)}
                style={{
                  flex: 1,
                  paddingVertical: 9,
                  borderRadius: 12,
                  alignItems: 'center',
                  backgroundColor: isActive ? '#0F172A' : 'transparent'
                }}
              >
                <Text style={{
                  fontWeight: '700',
                  fontSize: 11,
                  color: isActive ? '#FFFFFF' : '#64748B'
                }}>
                  {tab.title}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* NOTIFICATIONS LIST */}
        {filtered.length === 0 ? (
          <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
            <Text style={{ color: '#94A3B8', fontWeight: '600', fontSize: 13 }}>No notifications in this category</Text>
          </View>
        ) : (
          filtered.map((item) => {
            const config = getCategoryConfig(item.type);
            const IconComp = config.IconComponent;

            return (
              <TouchableOpacity
                key={item.id}
                onPress={() => handleItemPress(item)}
                style={{
                  padding: 16,
                  borderRadius: 24,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: item.read ? '#F1F5F9' : '#BEF264',
                  backgroundColor: '#FFFFFF',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between'
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', flex: 1, paddingRight: 8 }}>
                  <View style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    backgroundColor: config.bgColor,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 14
                  }}>
                    <IconComp size={20} color={config.iconColor} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{
                        color: '#0F172A',
                        fontWeight: '800',
                        fontSize: 14,
                        flex: 1,
                        paddingRight: 8
                      }}>{item.title}</Text>

                      {!item.read && (
                        <View style={{
                          width: 8, height: 8,
                          backgroundColor: '#F43F5E',
                          borderRadius: 4
                        }} />
                      )}
                    </View>

                    <Text style={{
                      color: '#64748B',
                      fontSize: 12,
                      fontWeight: '500',
                      marginTop: 4,
                      lineHeight: 18
                    }}>{item.body}</Text>

                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
                      <View style={{
                        backgroundColor: '#F1F5F9',
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: 6,
                        marginRight: 8
                      }}>
                        <Text style={{ color: '#475569', fontSize: 9, fontWeight: '700' }}>
                          {config.label}
                        </Text>
                      </View>
                      <Text style={{ color: '#94A3B8', fontSize: 10, fontWeight: '600' }}>
                        {item.time}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={{ marginTop: 2 }}>
                  <ChevronRight size={16} color="#94A3B8" />
                </View>
              </TouchableOpacity>
            );
          })
        )}

        <View style={{ height: 80 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
