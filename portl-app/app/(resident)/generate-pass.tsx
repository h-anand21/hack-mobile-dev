import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import QRCode from 'react-native-qrcode-svg';
import { User, Phone, Briefcase, Calendar, ArrowRight, X, Share2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as Sharing from 'expo-sharing';
import { apiClient } from '../../services/api/client';
import Animated, { FadeIn, FadeInDown, FadeOutDown } from 'react-native-reanimated';

export default function GeneratePassScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);
  const [qrToken, setQrToken] = useState<string | null>(null);
  const qrRef = React.useRef<any>(null);

  const handleGenerate = async () => {
    if (!name || !phone) return Alert.alert('Error', 'Name and Phone are required');
    
    setLoading(true);
    try {
      const response = await apiClient.post('/api/qr/generate', {
        name,
        phone,
        purpose: purpose || 'Guest',
        valid_until: '24h' // 24 hours validity
      });

      if (response.data.success) {
        setQrToken(response.data.token);
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || 'Failed to generate pass');
    } finally {
      setLoading(false);
    }
  };

  const shareQR = () => {
    if (qrRef.current) {
      qrRef.current.toDataURL(async (dataURL: string) => {
        try {
          const fs = await import('expo-file-system');
          const uri = fs.FileSystem.cacheDirectory + 'guest_pass.png';
          await fs.FileSystem.writeAsStringAsync(uri, dataURL, { encoding: fs.FileSystem.EncodingType.Base64 });
          await Sharing.shareAsync(uri, { dialogTitle: `Guest Pass for ${name}` });
        } catch (e) {
          Alert.alert('Error', 'Failed to share QR');
        }
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView className="flex-1 px-6 py-4">
          <View className="flex-row justify-between items-center mb-8">
            <Text className="text-3xl text-white font-bold">Guest Pass</Text>
            <TouchableOpacity onPress={() => router.back()} className="p-2 bg-white/10 rounded-full">
              <X color="#fff" size={24} />
            </TouchableOpacity>
          </View>

          {!qrToken ? (
            <Animated.View entering={FadeInDown} exiting={FadeOutDown} className="space-y-4 mt-4">
              <Text className="text-textSecondary mb-4 text-base">Generate a 24-hour validity QR pass for your guest to ensure quick entry at the gate.</Text>
              
              <View className="flex-row items-center bg-white/5 rounded-2xl px-4 py-4 border border-white/10">
                <User size={20} color="#666" />
                <TextInput placeholder="Guest Name" placeholderTextColor="#666" className="flex-1 ml-3 text-white text-base" value={name} onChangeText={setName} />
              </View>
              <View className="flex-row items-center bg-white/5 rounded-2xl px-4 py-4 border border-white/10 mt-4">
                <Phone size={20} color="#666" />
                <TextInput placeholder="Guest Phone" placeholderTextColor="#666" className="flex-1 ml-3 text-white text-base" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
              </View>
              <View className="flex-row items-center bg-white/5 rounded-2xl px-4 py-4 border border-white/10 mt-4">
                <Briefcase size={20} color="#666" />
                <TextInput placeholder="Purpose (e.g., Party, Relative)" placeholderTextColor="#666" className="flex-1 ml-3 text-white text-base" value={purpose} onChangeText={setPurpose} />
              </View>
              
              <TouchableOpacity 
                className="bg-accent py-4 rounded-2xl items-center mt-8 flex-row justify-center shadow-card"
                onPress={handleGenerate}
                disabled={loading}
              >
                <Text className="text-dark font-bold text-lg mr-2">{loading ? 'Generating...' : 'Generate Pass'}</Text>
                {!loading && <ArrowRight size={20} color="#171717" />}
              </TouchableOpacity>
            </Animated.View>
          ) : (
            <Animated.View entering={FadeIn} className="items-center justify-center mt-10">
              <View className="bg-white p-8 rounded-3xl items-center shadow-card w-full max-w-sm">
                <Text className="text-dark font-bold text-2xl mb-1">{name}</Text>
                <Text className="text-gray-500 mb-8">{purpose || 'Guest'}</Text>
                
                <View className="p-4 border-2 border-gray-100 rounded-3xl">
                  <QRCode
                    value={qrToken}
                    size={200}
                    color="#171717"
                    backgroundColor="#FFFFFF"
                    getRef={(c) => (qrRef.current = c)}
                  />
                </View>
                
                <View className="flex-row items-center mt-8 bg-gray-50 px-4 py-2 rounded-full">
                  <Calendar size={16} color="#666" />
                  <Text className="text-gray-600 ml-2 font-medium">Valid for 24 hours</Text>
                </View>
              </View>

              <TouchableOpacity 
                onPress={shareQR}
                className="mt-8 bg-white/10 border border-white/20 py-4 px-8 rounded-full flex-row items-center"
              >
                <Share2 color="#fff" size={20} />
                <Text className="text-white font-bold text-lg ml-3">Share Pass</Text>
              </TouchableOpacity>
            </Animated.View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
