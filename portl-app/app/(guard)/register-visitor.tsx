import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Camera as CameraIcon, User, Phone, MapPin, Briefcase, ArrowRight, X } from 'lucide-react-native';
import { apiClient } from '../../services/api/client';
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../services/supabase/client';
import { decode } from 'base64-arraybuffer';

export default function RegisterVisitorScreen() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef<any>(null);

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoBase64, setPhotoBase64] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [purpose, setPurpose] = useState('');
  const [flatId, setFlatId] = useState('');
  const [vehicle, setVehicle] = useState('');
  const [loading, setLoading] = useState(false);

  const { societyId } = useAuthStore();

  if (!permission) {
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-dark justify-center items-center px-6">
        <Text className="text-white text-center mb-6">We need your permission to show the camera to take visitor photos.</Text>
        <TouchableOpacity onPress={requestPermission} className="bg-accent px-6 py-3 rounded-full">
          <Text className="font-bold text-dark">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ base64: true, quality: 0.5 });
        setPhotoUri(photo.uri);
        setPhotoBase64(photo.base64);
        setShowCamera(false);
      } catch (e) {
        Alert.alert('Error', 'Failed to take picture');
      }
    }
  };

  const uploadPhotoToSupabase = async (base64Str: string): Promise<string | null> => {
    try {
      const fileName = `visitor_${Date.now()}.jpg`;
      const filePath = `${societyId}/${fileName}`;
      
      const { data, error } = await supabase.storage
        .from('visitor-photos')
        .upload(filePath, decode(base64Str), {
          contentType: 'image/jpeg',
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('visitor-photos')
        .getPublicUrl(filePath);

      return publicUrl;
    } catch (e) {
      console.error('Upload Error', e);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!name || !phone || !purpose || !flatId || !photoBase64) {
      return Alert.alert('Error', 'Please fill all fields and take a photo');
    }

    setLoading(true);
    try {
      // 1. Upload photo to Supabase Storage
      const photoUrl = await uploadPhotoToSupabase(photoBase64);
      if (!photoUrl) throw new Error('Failed to upload photo');

      // 2. Call backend API to create visitor request
      const response = await apiClient.post('/api/visitors/create', {
        name,
        phone,
        purpose,
        flat_id: flatId,
        vehicle_number: vehicle,
        photo_url: photoUrl
      });

      if (response.data.success) {
        // Redirect to waiting screen
        router.push({
          pathname: '/(guard)/visitor-status',
          params: { id: response.data.visitor.id }
        });
      }
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  if (showCamera) {
    return (
      <View className="flex-1 bg-black">
        <CameraView style={{ flex: 1 }} facing="back" ref={cameraRef}>
          <View className="flex-1 justify-between p-6">
            <TouchableOpacity onPress={() => setShowCamera(false)} className="bg-black/50 p-2 rounded-full self-start mt-10">
              <X color="white" size={24} />
            </TouchableOpacity>
            <TouchableOpacity onPress={takePicture} className="self-center mb-10 w-20 h-20 bg-white rounded-full border-4 border-accent" />
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} className="flex-1">
        <ScrollView className="px-6 py-4">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-3xl text-white font-bold">New Visitor</Text>
            <TouchableOpacity onPress={() => router.back()}>
              <X color="#666" size={28} />
            </TouchableOpacity>
          </View>

          {/* Photo Section */}
          <View className="items-center mb-8">
            <TouchableOpacity 
              onPress={() => setShowCamera(true)}
              className={`w-32 h-32 rounded-full justify-center items-center overflow-hidden border-2 ${photoUri ? 'border-accent' : 'border-white/20 bg-white/5'}`}
            >
              {photoUri ? (
                <Image source={{ uri: photoUri }} className="w-full h-full" />
              ) : (
                <View className="items-center">
                  <CameraIcon color="#666" size={32} />
                  <Text className="text-textSecondary mt-2 text-xs">Tap to snap</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Form Fields */}
          <View className="space-y-4">
            <View className="flex-row items-center bg-white/5 rounded-2xl px-4 py-4 border border-white/10">
              <User size={20} color="#666" />
              <TextInput placeholder="Visitor Name" placeholderTextColor="#666" className="flex-1 ml-3 text-white text-base" value={name} onChangeText={setName} />
            </View>
            <View className="flex-row items-center bg-white/5 rounded-2xl px-4 py-4 border border-white/10 mt-4">
              <Phone size={20} color="#666" />
              <TextInput placeholder="Phone Number" placeholderTextColor="#666" className="flex-1 ml-3 text-white text-base" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
            </View>
            <View className="flex-row items-center bg-white/5 rounded-2xl px-4 py-4 border border-white/10 mt-4">
              <MapPin size={20} color="#666" />
              <TextInput placeholder="Flat ID (e.g. A-101)" placeholderTextColor="#666" className="flex-1 ml-3 text-white text-base" value={flatId} onChangeText={setFlatId} />
            </View>
            <View className="flex-row items-center bg-white/5 rounded-2xl px-4 py-4 border border-white/10 mt-4">
              <Briefcase size={20} color="#666" />
              <TextInput placeholder="Purpose (Delivery, Guest)" placeholderTextColor="#666" className="flex-1 ml-3 text-white text-base" value={purpose} onChangeText={setPurpose} />
            </View>
            
            <TouchableOpacity 
              className="bg-accent py-4 rounded-2xl items-center mt-8 flex-row justify-center shadow-card"
              onPress={handleSubmit}
              disabled={loading}
            >
              <Text className="text-dark font-bold text-lg mr-2">{loading ? 'Sending Request...' : 'Send Approval Request'}</Text>
              {!loading && <ArrowRight size={20} color="#171717" />}
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
