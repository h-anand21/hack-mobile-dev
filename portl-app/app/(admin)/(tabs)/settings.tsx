import React from 'react';
import { 
  View, Text, TouchableOpacity, ScrollView, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../../../store/authStore';
import { 
  ArrowLeft, UserCheck, Shield, Bell, Database, FileText, 
  Building, Users, ShieldLock, BellRing, Wallet, CloudUpload, 
  ShieldCheck, FileCode, Sliders, Info, LogOut, ChevronRight 
} from 'lucide-react-native';

export default function AdminSettingsScreen() {
  const router = useRouter();
  const { signOut } = useAuthStore();

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to log out from Admin Panel?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Logout', 
        style: 'destructive',
        onPress: () => {
          signOut();
          router.replace('/(auth)/login');
        }
      }
    ]);
  };

  const quickActions = [
    {
      id: 'qa1',
      title: 'Manage Admins',
      iconBg: '#F3E8FF',
      iconColor: '#7E22CE',
      icon: UserCheck,
      action: () => Alert.alert('Manage Admins', 'Super Admin & Co-Admin role assignments')
    },
    {
      id: 'qa2',
      title: 'Roles &\nPermissions',
      iconBg: '#ECFCCB',
      iconColor: '#163316',
      icon: Shield,
      action: () => Alert.alert('Roles & Permissions', 'Configure Guard, Resident & Admin permissions')
    },
    {
      id: 'qa3',
      title: 'Notification\nSettings',
      iconBg: '#FFEDD5',
      iconColor: '#C2410C',
      icon: Bell,
      action: () => Alert.alert('Notification Settings', 'Push, SMS, and Email alert configurations')
    },
    {
      id: 'qa4',
      title: 'Backup &\nRestore',
      iconBg: '#E0F2FE',
      iconColor: '#0284C7',
      icon: Database,
      action: () => Alert.alert('Backup & Restore', 'Automated cloud database backups')
    },
    {
      id: 'qa5',
      title: 'System Logs',
      iconBg: '#FFE4E6',
      iconColor: '#E11D48',
      icon: FileText,
      action: () => Alert.alert('System Logs', 'View audit logs & error trace logs')
    }
  ];

  const settingsOptions = [
    {
      id: 'so1',
      title: 'Society Information',
      subtitle: 'View and update society details',
      iconBg: '#E0F2FE',
      iconColor: '#0284C7',
      icon: Building,
      action: () => router.push('/(admin)/towers-flats')
    },
    {
      id: 'so2',
      title: 'User Management',
      subtitle: 'Manage residents, staff and service providers',
      iconBg: '#ECFCCB',
      iconColor: '#163316',
      icon: Users,
      action: () => router.push('/(admin)/(tabs)/residents')
    },
    {
      id: 'so3',
      title: 'Roles & Permissions',
      subtitle: 'Manage roles and access permissions',
      iconBg: '#F3E8FF',
      iconColor: '#7E22CE',
      icon: Shield,
      action: () => Alert.alert('Roles & Permissions', 'Access control rules configuration')
    },
    {
      id: 'so4',
      title: 'Notification Settings',
      subtitle: 'Configure email, SMS and push notifications',
      iconBg: '#FFEDD5',
      iconColor: '#C2410C',
      icon: Bell,
      action: () => Alert.alert('Notification Settings', 'Society alert preferences')
    },
    {
      id: 'so5',
      title: 'Financial Settings',
      subtitle: 'Manage dues, late fees and other charges',
      iconBg: '#DCFCE7',
      iconColor: '#15803D',
      icon: Wallet,
      action: () => Alert.alert('Financial Settings', 'Society maintenance fee configuration')
    },
    {
      id: 'so6',
      title: 'Backup & Restore',
      subtitle: 'Backup data and restore when needed',
      iconBg: '#F3E8FF',
      iconColor: '#7E22CE',
      icon: CloudUpload,
      action: () => Alert.alert('Backup & Restore', 'Automated cloud snapshot backups')
    },
    {
      id: 'so7',
      title: 'Security Settings',
      subtitle: 'Password policy, session timeout and more',
      iconBg: '#FFE4E6',
      iconColor: '#E11D48',
      icon: ShieldCheck,
      action: () => Alert.alert('Security Settings', 'Gate security & password policies')
    },
    {
      id: 'so8',
      title: 'System Logs',
      subtitle: 'View system activities and error logs',
      iconBg: '#E0F2FE',
      iconColor: '#0284C7',
      icon: FileCode,
      action: () => Alert.alert('System Logs', 'Real-time server log viewer')
    },
    {
      id: 'so9',
      title: 'General Settings',
      subtitle: 'Language, date format and other preferences',
      iconBg: '#FFEDD5',
      iconColor: '#C2410C',
      icon: Sliders,
      action: () => Alert.alert('General Settings', 'Language: English • Date: DD/MM/YYYY')
    },
    {
      id: 'so10',
      title: 'About Application',
      subtitle: 'App version v1.2.4 and legal information',
      iconBg: '#F1F5F9',
      iconColor: '#64748B',
      icon: Info,
      action: () => Alert.alert('About Gately', 'Gately Smart Society App v1.2.4 (Build 55)')
    }
  ];

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
          <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 18 }}>Admin Settings</Text>
          <Text style={{ color: '#94A3B8', fontSize: 12, fontWeight: '600', marginTop: 2 }}>
            Manage system, preferences and security
          </Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* QUICK ACTIONS SECTION (HORIZONTAL ROW) */}
        <View style={{ marginBottom: 22 }}>
          <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 16, marginBottom: 12 }}>Quick Actions</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {quickActions.map(qa => {
              const QaIcon = qa.icon;

              return (
                <TouchableOpacity
                  key={qa.id}
                  onPress={qa.action}
                  style={{
                    width: 96, backgroundColor: '#FFFFFF', padding: 12, borderRadius: 20,
                    borderWidth: 1, borderColor: '#F1F5F9', alignItems: 'center', justifyContent: 'center'
                  }}
                >
                  <View style={{
                    width: 38, height: 38, borderRadius: 14, backgroundColor: qa.iconBg,
                    alignItems: 'center', justifyContent: 'center', marginBottom: 8
                  }}>
                    <QaIcon size={18} color={qa.iconColor} />
                  </View>
                  <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 10, textAlign: 'center', lineHeight: 13 }}>
                    {qa.title}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* SETTINGS OPTIONS LIST */}
        <View style={{ marginBottom: 22 }}>
          <Text style={{ color: '#0F172A', fontWeight: '900', fontSize: 16, marginBottom: 12 }}>Settings</Text>

          <View style={{ backgroundColor: '#FFFFFF', borderRadius: 24, padding: 8, borderWidth: 1, borderColor: '#F1F5F9', gap: 2 }}>
            {settingsOptions.map((opt, idx) => {
              const OptIcon = opt.icon;

              return (
                <TouchableOpacity
                  key={opt.id}
                  onPress={opt.action}
                  style={{
                    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                    paddingVertical: 12, paddingHorizontal: 10,
                    borderBottomWidth: idx < settingsOptions.length - 1 ? 1 : 0,
                    borderBottomColor: '#F8FAFC'
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1, paddingRight: 10 }}>
                    <View style={{
                      width: 40, height: 40, borderRadius: 14, backgroundColor: opt.iconBg,
                      alignItems: 'center', justifyContent: 'center', marginRight: 12
                    }}>
                      <OptIcon size={18} color={opt.iconColor} />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 14 }}>{opt.title}</Text>
                      <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '500', marginTop: 1 }}>{opt.subtitle}</Text>
                    </View>
                  </View>

                  <ChevronRight size={16} color="#94A3B8" />
                </TouchableOpacity>
              );
            })}

            {/* LOGOUT OPTION */}
            <TouchableOpacity
              onPress={handleLogout}
              style={{
                flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
                paddingVertical: 14, paddingHorizontal: 10, marginTop: 4,
                borderTopWidth: 1, borderTopColor: '#F1F5F9'
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <View style={{
                  width: 40, height: 40, borderRadius: 14, backgroundColor: '#FFE4E6',
                  alignItems: 'center', justifyContent: 'center', marginRight: 12
                }}>
                  <LogOut size={18} color="#EF4444" />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: '#EF4444', fontWeight: '900', fontSize: 14 }}>Logout from Admin Panel</Text>
                  <Text style={{ color: '#64748B', fontSize: 11, fontWeight: '500', marginTop: 1 }}>Sign out of Super Admin session</Text>
                </View>
              </View>

              <ChevronRight size={16} color="#EF4444" />
            </TouchableOpacity>
          </View>
        </View>

        {/* SECURITY CHECKUP BANNER CARD */}
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
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#163316', fontWeight: '900', fontSize: 12 }}>Secure Your System</Text>
              <Text style={{ color: '#163316', fontWeight: '600', fontSize: 10, marginTop: 1, lineHeight: 14 }}>
                Keep your system secure by updating passwords and reviewing access regularly.
              </Text>
            </View>
          </View>

          <TouchableOpacity 
            onPress={() => Alert.alert('Security Checkup 🛡️', 'System Security Audit Passed!\n0 Vulnerabilities Found.')}
            style={{
              backgroundColor: '#FFFFFF', paddingHorizontal: 10, paddingVertical: 8,
              borderRadius: 14, borderWidth: 1, borderColor: '#163316',
              flexDirection: 'row', alignItems: 'center'
            }}
          >
            <ShieldCheck size={14} color="#163316" style={{ marginRight: 4 }} />
            <Text style={{ color: '#163316', fontWeight: '800', fontSize: 10 }}>Security Checkup</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
