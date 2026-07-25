import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Headset, Phone, Mail, Building2, Shield, MessageSquare, ExternalLink } from 'lucide-react-native';

export default function HelpSupportScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FB]">
      <View className="flex-row justify-between items-center px-5 pt-3 pb-4 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100">
          <ArrowLeft size={20} color="#1E293B" />
        </TouchableOpacity>
        <View className="items-center">
          <Text className="text-gray-900 font-extrabold text-lg">Help & Support</Text>
          <Text className="text-gray-400 text-xs font-semibold">Society & App Helpline</Text>
        </View>
        <View className="w-10" />
      </View>

      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        <View className="bg-white rounded-3xl p-5 mb-4 shadow-sm border border-gray-100">
          <Text className="text-gray-900 font-extrabold text-base mb-3">Society Emergency Contacts</Text>
          <TouchableOpacity onPress={() => Alert.alert('Calling', 'Dialing Main Gate Guard: 080-1234567')} className="p-3.5 bg-gray-50 rounded-2xl mb-2.5 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Shield size={18} color="#D97706" className="mr-3" />
              <View>
                <Text className="text-gray-900 font-bold text-xs">Security Gate Desk</Text>
                <Text className="text-gray-400 text-[10px]">080-1234567 • 24/7 Available</Text>
              </View>
            </View>
            <Phone size={16} color="#059669" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => Alert.alert('Calling', 'Dialing Maintenance Office: 080-4567890')} className="p-3.5 bg-gray-50 rounded-2xl mb-2.5 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Building2 size={18} color="#2563EB" className="mr-3" />
              <View>
                <Text className="text-gray-900 font-bold text-xs">Society Management Office</Text>
                <Text className="text-gray-400 text-[10px]">080-4567890 • 9:00 AM - 6:00 PM</Text>
              </View>
            </View>
            <Phone size={16} color="#059669" />
          </TouchableOpacity>
        </View>

        <View className="bg-white rounded-3xl p-5 mb-6 shadow-sm border border-gray-100">
          <Text className="text-gray-900 font-extrabold text-base mb-3">Gately App Technical Support</Text>
          <TouchableOpacity onPress={() => Alert.alert('Support Email', 'Opening support email...')} className="p-3.5 bg-gray-50 rounded-2xl mb-2.5 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Mail size={18} color="#7C3AED" className="mr-3" />
              <View>
                <Text className="text-gray-900 font-bold text-xs">Email Support</Text>
                <Text className="text-gray-400 text-[10px]">support@gately.com</Text>
              </View>
            </View>
            <ExternalLink size={16} color="#94A3B8" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
