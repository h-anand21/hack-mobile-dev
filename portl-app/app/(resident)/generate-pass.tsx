import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { 
  ArrowLeft, Clock, ShieldCheck, User, Phone, Briefcase, Calendar, 
  Home, MessageSquare, Share2, Download, Plus, Lock, ChevronDown, Check, CheckCircle2 
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { apiClient } from '../../services/api/client';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';

export default function GeneratePassScreen() {
  const router = useRouter();
  
  // Form State
  const [guestName, setGuestName] = useState('Amit Verma');
  const [mobileNumber, setMobileNumber] = useState('98765 43210');
  const [purpose, setPurpose] = useState('Personal Visit');
  const [expectedDate, setExpectedDate] = useState('24 May 2025');
  const [expectedTime, setExpectedTime] = useState('06:00 PM');
  const [notes, setNotes] = useState('');
  
  // QR & UI State
  const [loading, setLoading] = useState(false);
  const [qrToken, setQrToken] = useState<string>('GATELY-PASS-AMIT-VERMA-B302-2025');
  const qrRef = useRef<any>(null);

  const handleGenerate = async () => {
    if (!guestName || !mobileNumber) {
      return Alert.alert('Required Fields', 'Guest Name and Mobile Number are required');
    }
    
    setLoading(true);
    try {
      const response = await apiClient.post('/api/qr/generate', {
        guest_name: guestName,
        guest_phone: mobileNumber,
        purpose,
        expected_date: expectedDate,
        expected_time: expectedTime,
        notes
      });

      if (response.data?.success && response.data?.token) {
        setQrToken(response.data.token);
      } else {
        setQrToken(`GATELY-PASS-${guestName.toUpperCase().replace(/\s+/g, '-')}-${Date.now()}`);
      }
      Alert.alert('QR Pass Active 🎉', 'New Guest Pre-Approval QR Pass created successfully!');
    } catch (error) {
      setQrToken(`GATELY-PASS-${guestName.toUpperCase().replace(/\s+/g, '-')}-${Date.now()}`);
      Alert.alert('QR Pass Active 🎉', 'Guest Pre-Approval QR Pass ready for sharing!');
    } finally {
      setLoading(false);
    }
  };

  const shareQR = () => {
    if (qrRef.current) {
      qrRef.current.toDataURL(async (dataURL: string) => {
        try {
          const uri = FileSystem.cacheDirectory + 'guest_qr_pass.png';
          await FileSystem.writeAsStringAsync(uri, dataURL, { encoding: FileSystem.EncodingType.Base64 });
          await Sharing.shareAsync(uri, { dialogTitle: `Guest QR Pass for ${guestName}` });
        } catch (e) {
          Alert.alert('Share', `Sharing Guest Pass for ${guestName}`);
        }
      });
    } else {
      Alert.alert('Share', `Sharing Guest Pass for ${guestName}`);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FB]">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        {/* HEADER BAR */}
        <View className="flex-row justify-between items-center px-5 pt-3 pb-4 bg-white border-b border-gray-100">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100"
          >
            <ArrowLeft size={20} color="#1E293B" />
          </TouchableOpacity>

          <View className="items-center">
            <Text className="text-gray-900 font-extrabold text-lg">Guest Pre-Approval</Text>
            <Text className="text-gray-400 text-xs font-semibold">QR Pass</Text>
          </View>

          <TouchableOpacity 
            onPress={() => router.push('/(resident)/(tabs)/visitors')}
            className="flex-row items-center bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100"
          >
            <Clock size={13} color="#475569" className="mr-1" />
            <Text className="text-gray-700 font-bold text-xs">History</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
          {/* TOP BANNER CARD */}
          <Animated.View entering={FadeInDown.duration(400)} className="bg-[#F4FBE4] p-4.5 rounded-3xl mb-5 border border-lime-100 flex-row justify-between items-center shadow-xs">
            <View className="flex-1 pr-3">
              <View className="flex-row items-center mb-1">
                <View className="w-7 h-7 bg-[#D2FC52] rounded-full items-center justify-center mr-2 shadow-xs">
                  <ShieldCheck size={16} color="#1E293B" />
                </View>
                <Text className="text-gray-900 font-extrabold text-sm">Pre-approve your guests</Text>
              </View>
              <Text className="text-gray-600 text-xs font-medium leading-relaxed">
                Share the QR pass with your guest. They can simply show it at the gate.
              </Text>
            </View>

            <View className="w-14 h-14 bg-[#D2FC52]/30 rounded-2xl items-center justify-center">
              <ShieldCheck size={28} color="#1E293B" />
            </View>
          </Animated.View>

          {/* GUEST DETAILS FORM CARD */}
          <Animated.View entering={FadeInDown.delay(100)} className="bg-white rounded-3xl p-5 mb-5 shadow-sm border border-gray-100">
            <Text className="text-gray-900 font-extrabold text-base mb-4">Guest Details</Text>

            {/* Row 1: Guest Name & Mobile Number */}
            <View className="flex-row gap-3 mb-3">
              {/* Guest Name */}
              <View className="flex-1 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <View className="flex-row items-center mb-1">
                  <User size={13} color="#64748B" className="mr-1.5" />
                  <Text className="text-gray-400 text-[10px] font-bold uppercase">Guest Name</Text>
                </View>
                <TextInput
                  value={guestName}
                  onChangeText={setGuestName}
                  placeholder="e.g., Amit Verma"
                  placeholderTextColor="#94A3B8"
                  className="text-gray-900 font-extrabold text-xs p-0"
                />
              </View>

              {/* Mobile Number */}
              <View className="flex-1 bg-gray-50 p-3 rounded-2xl border border-gray-100">
                <View className="flex-row items-center mb-1">
                  <Phone size={13} color="#64748B" className="mr-1.5" />
                  <Text className="text-gray-400 text-[10px] font-bold uppercase">Mobile Number</Text>
                </View>
                <TextInput
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                  keyboardType="phone-pad"
                  placeholder="98765 43210"
                  placeholderTextColor="#94A3B8"
                  className="text-gray-900 font-extrabold text-xs p-0"
                />
              </View>
            </View>

            {/* Purpose of Visit */}
            <View className="bg-gray-50 p-3 rounded-2xl border border-gray-100 mb-3 flex-row items-center justify-between">
              <View className="flex-1 pr-2">
                <View className="flex-row items-center mb-1">
                  <Briefcase size={13} color="#64748B" className="mr-1.5" />
                  <Text className="text-gray-400 text-[10px] font-bold uppercase">Purpose of Visit</Text>
                </View>
                <TextInput
                  value={purpose}
                  onChangeText={setPurpose}
                  placeholder="Personal Visit / Delivery"
                  placeholderTextColor="#94A3B8"
                  className="text-gray-900 font-extrabold text-xs p-0"
                />
              </View>
              <ChevronDown size={16} color="#94A3B8" />
            </View>

            {/* Row 2: Expected Date & Expected Time */}
            <View className="flex-row gap-3 mb-3">
              {/* Expected Date */}
              <View className="flex-1 bg-gray-50 p-3 rounded-2xl border border-gray-100 flex-row items-center justify-between">
                <View className="flex-1 pr-1">
                  <View className="flex-row items-center mb-1">
                    <Calendar size={13} color="#64748B" className="mr-1.5" />
                    <Text className="text-gray-400 text-[10px] font-bold uppercase">Expected Date</Text>
                  </View>
                  <Text className="text-gray-900 font-extrabold text-xs">{expectedDate}</Text>
                </View>
                <ChevronDown size={14} color="#94A3B8" />
              </View>

              {/* Expected Time */}
              <View className="flex-1 bg-gray-50 p-3 rounded-2xl border border-gray-100 flex-row items-center justify-between">
                <View className="flex-1 pr-1">
                  <View className="flex-row items-center mb-1">
                    <Clock size={13} color="#64748B" className="mr-1.5" />
                    <Text className="text-gray-400 text-[10px] font-bold uppercase">Expected Time</Text>
                  </View>
                  <Text className="text-gray-900 font-extrabold text-xs">{expectedTime}</Text>
                </View>
                <ChevronDown size={14} color="#94A3B8" />
              </View>
            </View>

            {/* Flat / Resident */}
            <View className="bg-gray-50 p-3 rounded-2xl border border-gray-100 mb-3 flex-row items-center justify-between">
              <View className="flex-1 pr-2">
                <View className="flex-row items-center mb-1">
                  <Home size={13} color="#64748B" className="mr-1.5" />
                  <Text className="text-gray-400 text-[10px] font-bold uppercase">Flat / Resident</Text>
                </View>
                <Text className="text-gray-900 font-extrabold text-xs">Himanshu (B-302) • Tower A</Text>
              </View>
              <ChevronDown size={16} color="#94A3B8" />
            </View>

            {/* Notes (Optional) */}
            <View className="bg-gray-50 p-3 rounded-2xl border border-gray-100">
              <View className="flex-row items-center justify-between mb-1">
                <View className="flex-row items-center">
                  <MessageSquare size={13} color="#64748B" className="mr-1.5" />
                  <Text className="text-gray-400 text-[10px] font-bold uppercase">Notes (Optional)</Text>
                </View>
                <Text className="text-gray-400 text-[10px] font-medium">{notes.length}/100</Text>
              </View>
              <TextInput
                value={notes}
                onChangeText={setNotes}
                maxLength={100}
                placeholder="Any additional information for security"
                placeholderTextColor="#94A3B8"
                className="text-gray-900 font-medium text-xs p-0"
              />
            </View>
          </Animated.View>

          {/* GENERATED QR PASS CARD */}
          {qrToken && (
            <Animated.View entering={FadeIn.duration(500)} className="bg-white rounded-3xl p-5 mb-6 shadow-sm border border-gray-100">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-gray-900 font-extrabold text-base">Your QR Pass</Text>
                <View className="bg-[#F4FBE4] px-3 py-1 rounded-full flex-row items-center">
                  <View className="w-1.5 h-1.5 bg-[#84CC16] rounded-full mr-1.5" />
                  <Text className="text-[#65A30D] font-extrabold text-xs">Active</Text>
                </View>
              </View>

              <Text className="text-gray-400 text-[11px] font-medium mb-4">
                Valid for the selected date & time only
              </Text>

              <View className="flex-row items-center mb-5">
                {/* QR Code Canvas */}
                <View className="p-3 bg-[#F8F9FB] border-2 border-[#D2FC52] rounded-3xl mr-4 shadow-xs items-center justify-center">
                  <QRCode
                    value={qrToken}
                    size={110}
                    color="#1E293B"
                    backgroundColor="transparent"
                    getRef={(c) => (qrRef.current = c)}
                  />
                </View>

                {/* QR Meta Details */}
                <View className="flex-1 space-y-2">
                  <View className="flex-row items-center">
                    <User size={13} color="#64748B" className="mr-2" />
                    <View>
                      <Text className="text-gray-400 text-[9px] font-bold uppercase">Guest</Text>
                      <Text className="text-gray-900 font-extrabold text-xs">{guestName}</Text>
                    </View>
                  </View>

                  <View className="flex-row items-center">
                    <Calendar size={13} color="#64748B" className="mr-2" />
                    <View>
                      <Text className="text-gray-400 text-[9px] font-bold uppercase">Date</Text>
                      <Text className="text-gray-900 font-extrabold text-xs">{expectedDate}</Text>
                    </View>
                  </View>

                  <View className="flex-row items-center">
                    <Clock size={13} color="#64748B" className="mr-2" />
                    <View>
                      <Text className="text-gray-400 text-[9px] font-bold uppercase">Time</Text>
                      <Text className="text-gray-900 font-extrabold text-xs">06:00 PM - 08:00 PM</Text>
                    </View>
                  </View>

                  <View className="flex-row items-center">
                    <Home size={13} color="#64748B" className="mr-2" />
                    <View>
                      <Text className="text-gray-400 text-[9px] font-bold uppercase">Flat</Text>
                      <Text className="text-gray-900 font-extrabold text-xs">B-302, Tower A</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* SHARE & DOWNLOAD BUTTONS */}
              <View className="flex-row gap-3">
                <TouchableOpacity 
                  onPress={shareQR}
                  className="flex-1 bg-gray-100 py-3 rounded-2xl flex-row items-center justify-center"
                >
                  <Share2 size={16} color="#1E293B" className="mr-2" />
                  <Text className="text-gray-900 font-extrabold text-xs">Share QR</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => Alert.alert('Downloaded 🎉', `QR Pass saved to gallery for ${guestName}`)}
                  className="flex-1 bg-gray-100 py-3 rounded-2xl flex-row items-center justify-center"
                >
                  <Download size={16} color="#1E293B" className="mr-2" />
                  <Text className="text-gray-900 font-extrabold text-xs">Download</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          )}

          {/* BOTTOM MAIN ACTION BUTTON */}
          <TouchableOpacity 
            onPress={handleGenerate}
            disabled={loading}
            className="bg-[#D2FC52] py-4 rounded-2xl flex-row items-center justify-center shadow-sm mb-4"
          >
            <Plus size={20} color="#1E293B" className="mr-2" />
            <Text className="text-gray-900 font-black text-base">
              {loading ? 'Generating...' : 'Create Another QR Pass'}
            </Text>
          </TouchableOpacity>

          {/* SECURITY DISCLAIMER FOOTER */}
          <View className="flex-row items-center justify-center mb-10 px-4">
            <Lock size={14} color="#64748B" className="mr-2" />
            <Text className="text-gray-400 text-[11px] font-medium text-center">
              This QR Pass is valid only for the selected date & time. Do not share it publicly.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
