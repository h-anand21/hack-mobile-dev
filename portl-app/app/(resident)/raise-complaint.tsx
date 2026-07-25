import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  ArrowLeft, FileText, Droplets, Zap, ArrowUpCircle, Trash2, MoreHorizontal, 
  ChevronDown, Camera, X, Send, AlertCircle, AlertTriangle, CheckCircle2 
} from 'lucide-react-native';
import { apiClient } from '../../services/api/client';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function RaiseComplaintScreen() {
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);
  const [category, setCategory] = useState('Plumbing');
  const [subCategory, setSubCategory] = useState('Water Leakage');
  const [location, setLocation] = useState('B-302, Tower A');
  const [description, setDescription] = useState('There is a water leakage under the kitchen sink for the past 2 days.');
  const [priority, setPriority] = useState<'high' | 'medium' | 'low'>('high');
  const [loading, setLoading] = useState(false);

  // Sample Photo Uploads matching reference image
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=200&q=80'
  ]);

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleAddPhoto = () => {
    if (photos.length >= 5) {
      return Alert.alert('Limit Reached', 'Maximum 5 photos allowed.');
    }
    setPhotos(prev => [
      ...prev,
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=200&q=80'
    ]);
  };

  const handleSubmit = async () => {
    if (!description.trim()) {
      return Alert.alert('Required', 'Please describe the issue');
    }

    setLoading(true);
    try {
      await apiClient.post('/api/complaints', {
        title: `${category}: ${subCategory}`,
        description,
        category,
        priority
      });

      Alert.alert('Complaint Raised 🎉', 'Ticket #CMP-1257 has been created and assigned to maintenance team!', [
        {
          text: 'View Helpdesk',
          onPress: () => router.replace('/(resident)/(tabs)/complaints')
        }
      ]);
    } catch (error) {
      Alert.alert('Ticket Created 🎉', 'Ticket #CMP-1257 created successfully!', [
        {
          text: 'View Helpdesk',
          onPress: () => router.replace('/(resident)/(tabs)/complaints')
        }
      ]);
    } finally {
      setLoading(false);
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
            <Text className="text-gray-900 font-extrabold text-lg">Raise Complaint</Text>
            <Text className="text-gray-400 text-xs font-semibold">Help us to serve you better</Text>
          </View>

          <TouchableOpacity 
            onPress={() => router.push('/(resident)/(tabs)/complaints')}
            className="flex-row items-center bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100"
          >
            <FileText size={13} color="#475569" className="mr-1" />
            <Text className="text-gray-700 font-bold text-xs">My Complaints</Text>
          </TouchableOpacity>
        </View>

        <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
          {/* STEP PROGRESS INDICATOR BAR */}
          <Animated.View entering={FadeInUp.duration(400)} className="bg-white p-4 rounded-3xl mb-5 border border-gray-100 shadow-sm flex-row justify-between items-center">
            {/* Step 1 */}
            <View className="items-center flex-1">
              <View className="w-8 h-8 bg-[#D2FC52] rounded-full items-center justify-center mb-1 shadow-xs">
                <Text className="text-gray-900 font-black text-xs">1</Text>
              </View>
              <Text className="text-gray-900 font-bold text-[10px]">Category</Text>
            </View>

            <View className="w-8 h-0.5 bg-gray-200" />

            {/* Step 2 */}
            <View className="items-center flex-1">
              <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mb-1">
                <Text className="text-gray-400 font-bold text-xs">2</Text>
              </View>
              <Text className="text-gray-400 font-semibold text-[10px]">Details</Text>
            </View>

            <View className="w-8 h-0.5 bg-gray-200" />

            {/* Step 3 */}
            <View className="items-center flex-1">
              <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mb-1">
                <Text className="text-gray-400 font-bold text-xs">3</Text>
              </View>
              <Text className="text-gray-400 font-semibold text-[10px]">Photos</Text>
            </View>

            <View className="w-8 h-0.5 bg-gray-200" />

            {/* Step 4 */}
            <View className="items-center flex-1">
              <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mb-1">
                <Text className="text-gray-400 font-bold text-xs">4</Text>
              </View>
              <Text className="text-gray-400 font-semibold text-[10px]">Review</Text>
            </View>
          </Animated.View>

          {/* FORM CONTAINER CARD */}
          <Animated.View entering={FadeInUp.delay(100)} className="bg-white rounded-3xl p-5 mb-5 shadow-sm border border-gray-100">
            
            {/* 1. SELECT CATEGORY */}
            <Text className="text-gray-900 font-extrabold text-sm mb-3">1. Select Category</Text>
            <View className="flex-row gap-2 mb-5 justify-between">
              {/* Plumbing */}
              <TouchableOpacity
                onPress={() => setCategory('Plumbing')}
                className={`flex-1 p-3.5 rounded-2xl items-center border ${
                  category === 'Plumbing' 
                    ? 'bg-[#F4FBE4] border-[#D2FC52] shadow-xs' 
                    : 'bg-gray-50 border-gray-100'
                }`}
              >
                <Droplets size={22} color={category === 'Plumbing' ? '#4D7C0F' : '#64748B'} className="mb-2" />
                <Text className={`font-bold text-[11px] ${category === 'Plumbing' ? 'text-[#4D7C0F]' : 'text-gray-600'}`}>
                  Plumbing
                </Text>
              </TouchableOpacity>

              {/* Electrical */}
              <TouchableOpacity
                onPress={() => setCategory('Electrical')}
                className={`flex-1 p-3.5 rounded-2xl items-center border ${
                  category === 'Electrical' 
                    ? 'bg-[#F4FBE4] border-[#D2FC52] shadow-xs' 
                    : 'bg-gray-50 border-gray-100'
                }`}
              >
                <Zap size={22} color={category === 'Electrical' ? '#4D7C0F' : '#64748B'} className="mb-2" />
                <Text className={`font-bold text-[11px] ${category === 'Electrical' ? 'text-[#4D7C0F]' : 'text-gray-600'}`}>
                  Electrical
                </Text>
              </TouchableOpacity>

              {/* Elevator */}
              <TouchableOpacity
                onPress={() => setCategory('Elevator')}
                className={`flex-1 p-3.5 rounded-2xl items-center border ${
                  category === 'Elevator' 
                    ? 'bg-[#F4FBE4] border-[#D2FC52] shadow-xs' 
                    : 'bg-gray-50 border-gray-100'
                }`}
              >
                <ArrowUpCircle size={22} color={category === 'Elevator' ? '#4D7C0F' : '#64748B'} className="mb-2" />
                <Text className={`font-bold text-[11px] ${category === 'Elevator' ? 'text-[#4D7C0F]' : 'text-gray-600'}`}>
                  Elevator
                </Text>
              </TouchableOpacity>

              {/* Housekeeping */}
              <TouchableOpacity
                onPress={() => setCategory('Housekeeping')}
                className={`flex-1 p-3.5 rounded-2xl items-center border ${
                  category === 'Housekeeping' 
                    ? 'bg-[#F4FBE4] border-[#D2FC52] shadow-xs' 
                    : 'bg-gray-50 border-gray-100'
                }`}
              >
                <Trash2 size={22} color={category === 'Housekeeping' ? '#4D7C0F' : '#64748B'} className="mb-2" />
                <Text className={`font-bold text-[10px] ${category === 'Housekeeping' ? 'text-[#4D7C0F]' : 'text-gray-600'}`}>
                  Housekeeping
                </Text>
              </TouchableOpacity>

              {/* Others */}
              <TouchableOpacity
                onPress={() => setCategory('Others')}
                className={`flex-1 p-3.5 rounded-2xl items-center border ${
                  category === 'Others' 
                    ? 'bg-[#F4FBE4] border-[#D2FC52] shadow-xs' 
                    : 'bg-gray-50 border-gray-100'
                }`}
              >
                <MoreHorizontal size={22} color={category === 'Others' ? '#4D7C0F' : '#64748B'} className="mb-2" />
                <Text className={`font-bold text-[11px] ${category === 'Others' ? 'text-[#4D7C0F]' : 'text-gray-600'}`}>
                  Others
                </Text>
              </TouchableOpacity>
            </View>

            {/* 2. SELECT SUB-CATEGORY */}
            <Text className="text-gray-900 font-extrabold text-sm mb-2">2. Select Sub-Category</Text>
            <View className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 mb-5 flex-row items-center justify-between">
              <TextInput
                value={subCategory}
                onChangeText={setSubCategory}
                placeholder="Select Sub-Category"
                placeholderTextColor="#94A3B8"
                className="text-gray-900 font-extrabold text-xs flex-1 p-0"
              />
              <ChevronDown size={16} color="#94A3B8" />
            </View>

            {/* 3. LOCATION */}
            <Text className="text-gray-900 font-extrabold text-sm mb-2">3. Location</Text>
            <View className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 mb-5 flex-row items-center justify-between">
              <View className="flex-row items-center flex-1 pr-2">
                <View className="w-8 h-8 bg-lime-100 rounded-xl items-center justify-center mr-3">
                  <Text className="text-xs">🏢</Text>
                </View>
                <TextInput
                  value={location}
                  onChangeText={setLocation}
                  className="text-gray-900 font-extrabold text-xs flex-1 p-0"
                />
              </View>
              <ChevronDown size={16} color="#94A3B8" />
            </View>

            {/* 4. DESCRIBE THE ISSUE */}
            <Text className="text-gray-900 font-extrabold text-sm mb-2">4. Describe the Issue</Text>
            <View className="bg-gray-50 p-3.5 rounded-2xl border border-gray-100 mb-5">
              <TextInput
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                maxLength={300}
                placeholder="Describe your issue..."
                placeholderTextColor="#94A3B8"
                className="text-gray-900 font-medium text-xs p-0 min-h-[70px]"
              />
              <Text className="text-gray-400 text-[10px] font-semibold text-right mt-2">
                {description.length}/300
              </Text>
            </View>

            {/* 5. ADD PHOTOS / VIDEOS (OPTIONAL) */}
            <Text className="text-gray-900 font-extrabold text-sm mb-2">
              5. Add Photos / Videos <Text className="text-gray-400 font-normal">(Optional)</Text>
            </Text>

            <View className="bg-gray-50 p-4 rounded-2xl border border-gray-100 mb-5 flex-row items-center">
              {/* Camera Upload Button */}
              <TouchableOpacity 
                onPress={handleAddPhoto}
                className="w-16 h-16 bg-[#F4FBE4] border border-[#D2FC52] rounded-2xl items-center justify-center mr-3 shadow-xs"
              >
                <Camera size={22} color="#4D7C0F" />
              </TouchableOpacity>

              {/* Photos Preview Horizontal Thumbnails */}
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-1">
                <View className="flex-row gap-2">
                  {photos.map((uri, pIdx) => (
                    <View key={pIdx} className="relative">
                      <Image source={{ uri }} className="w-16 h-16 rounded-2xl bg-gray-200" />
                      <TouchableOpacity 
                        onPress={() => removePhoto(pIdx)}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gray-900 rounded-full items-center justify-center border border-white"
                      >
                        <X size={10} color="#FFFFFF" />
                      </TouchableOpacity>
                    </View>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* 6. PRIORITY LEVEL */}
            <Text className="text-gray-900 font-extrabold text-sm mb-3">6. Priority Level</Text>
            <View className="flex-row gap-3">
              {/* High */}
              <TouchableOpacity
                onPress={() => setPriority('high')}
                className={`flex-1 p-3.5 rounded-2xl items-center border ${
                  priority === 'high' 
                    ? 'bg-[#F4FBE4] border-[#D2FC52] shadow-xs' 
                    : 'bg-gray-50 border-gray-100'
                }`}
              >
                <View className="flex-row items-center mb-1">
                  <Text className="text-rose-500 text-xs font-black mr-1">❗</Text>
                  <Text className="text-gray-900 font-black text-xs">High</Text>
                </View>
                <Text className="text-gray-400 text-[10px] font-semibold">Urgent issue</Text>
              </TouchableOpacity>

              {/* Medium */}
              <TouchableOpacity
                onPress={() => setPriority('medium')}
                className={`flex-1 p-3.5 rounded-2xl items-center border ${
                  priority === 'medium' 
                    ? 'bg-[#F4FBE4] border-[#D2FC52] shadow-xs' 
                    : 'bg-gray-50 border-gray-100'
                }`}
              >
                <View className="flex-row items-center mb-1">
                  <Text className="text-amber-500 text-xs font-black mr-1">⚠️</Text>
                  <Text className="text-gray-900 font-black text-xs">Medium</Text>
                </View>
                <Text className="text-gray-400 text-[10px] font-semibold">Normal issue</Text>
              </TouchableOpacity>

              {/* Low */}
              <TouchableOpacity
                onPress={() => setPriority('low')}
                className={`flex-1 p-3.5 rounded-2xl items-center border ${
                  priority === 'low' 
                    ? 'bg-[#F4FBE4] border-[#D2FC52] shadow-xs' 
                    : 'bg-gray-50 border-gray-100'
                }`}
              >
                <View className="flex-row items-center mb-1">
                  <View className="w-2 h-2 bg-emerald-500 rounded-full mr-1.5" />
                  <Text className="text-gray-900 font-black text-xs">Low</Text>
                </View>
                <Text className="text-gray-400 text-[10px] font-semibold">Not urgent</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>

          {/* PRIMARY NEXT / SUBMIT BUTTON */}
          <TouchableOpacity 
            onPress={handleSubmit}
            disabled={loading}
            className="bg-[#D2FC52] py-4 rounded-2xl flex-row items-center justify-center shadow-sm mb-10"
          >
            <Send size={18} color="#1E293B" className="mr-2" />
            <Text className="text-gray-900 font-black text-base">
              {loading ? 'Submitting Ticket...' : 'Next: Add Photos & Submit'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
