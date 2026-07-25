import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  ArrowLeft, MoreHorizontal, Droplets, Clock, Building2, MessageSquare, 
  Phone, Send, Star, CheckCircle2, ChevronRight, UserCheck, Wrench, Check
} from 'lucide-react-native';
import { apiClient } from '../../services/api/client';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function ComplaintDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [commentText, setCommentText] = useState('');
  const [showCommentInput, setShowCommentInput] = useState(false);
  const [comments, setComments] = useState<string[]>([
    'Plumber has inspected the leak and will replace the washer.'
  ]);

  const complaint = {
    id: (params.id as string) || 'c1256',
    ticketNo: (params.ticketNo as string) || '#CMP-1256',
    title: (params.title as string) || 'Water Leakage in Kitchen',
    category: (params.category as string) || 'Plumbing',
    subCategory: (params.subCategory as string) || 'Water Leakage',
    location: (params.location as string) || 'B-302, Tower A',
    dateTime: (params.dateTime as string) || '24 May 2025, 09:30 AM',
    status: (params.status as string) || 'in_progress',
    description: (params.description as string) || 'There is a water leakage under the kitchen sink for the past 2 days.',
    technician: {
      name: 'Ramesh Kumar',
      role: 'Plumbing Technician',
      phone: '98765 43210',
      photo: 'https://images.unsplash.com/photo-1540569014015-19a7be504e3a?auto=format&fit=crop&w=300&q=80'
    },
    photos: [
      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=300&q=80',
      'https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=300&q=80'
    ]
  };

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    setComments(prev => [commentText.trim(), ...prev]);
    setCommentText('');
    setShowCommentInput(false);
    Alert.alert('Comment Added 🎉', 'Your comment has been sent to the technician.');
  };

  const handleRateService = () => {
    Alert.alert(
      'Rate Service ⭐⭐⭐⭐⭐',
      'How was the plumbing technician service?',
      [
        { text: 'Okay', style: 'cancel' },
        { text: '5 Stars ⭐', onPress: () => Alert.alert('Thank You!', 'Your rating has been submitted.') }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FB]">
      {/* HEADER BAR */}
      <View className="flex-row justify-between items-center px-5 pt-3 pb-4 bg-white border-b border-gray-100">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100"
        >
          <ArrowLeft size={20} color="#1E293B" />
        </TouchableOpacity>

        <View className="items-center">
          <Text className="text-gray-900 font-extrabold text-lg">Complaint Details</Text>
          <Text className="text-gray-400 text-xs font-bold">{complaint.ticketNo}</Text>
        </View>

        <TouchableOpacity 
          onPress={() => Alert.alert('Options', 'Ticket Options')}
          className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100"
        >
          <MoreHorizontal size={20} color="#1E293B" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        {/* MAIN DETAILS CARD */}
        <Animated.View entering={FadeInUp.duration(500)} className="bg-white rounded-3xl p-5 mb-5 shadow-sm border border-gray-100">
          <View className="flex-row justify-between items-start mb-3">
            <View className="flex-row items-center flex-1 pr-2">
              <View className="w-14 h-14 bg-[#FFF9EE] rounded-2xl items-center justify-center mr-3.5 border border-amber-100">
                <Droplets size={24} color="#D97706" />
              </View>

              <View className="flex-1">
                <Text className="text-gray-900 font-extrabold text-base leading-snug">{complaint.title}</Text>
                <Text className="text-gray-500 font-semibold text-xs mt-0.5">{complaint.category} • {complaint.subCategory}</Text>
              </View>
            </View>

            {/* Status Badge */}
            <View className="bg-[#FFF5EB] px-3 py-1 rounded-full border border-amber-200">
              <Text className="text-amber-800 font-black text-[10px] uppercase">• In Progress</Text>
            </View>
          </View>

          {/* Location & Time Row */}
          <View className="flex-row items-center flex-wrap gap-x-4 gap-y-1 mb-3 pt-2 border-t border-gray-100">
            <View className="flex-row items-center">
              <Building2 size={13} color="#64748B" className="mr-1.5" />
              <Text className="text-gray-700 text-xs font-semibold">{complaint.location}</Text>
            </View>
            <View className="flex-row items-center">
              <Clock size={13} color="#64748B" className="mr-1.5" />
              <Text className="text-gray-700 text-xs font-semibold">{complaint.dateTime}</Text>
            </View>
          </View>

          {/* Description Text */}
          <Text className="text-gray-600 text-xs font-medium leading-relaxed mb-5">
            {complaint.description}
          </Text>

          {/* HORIZONTAL STEPPER PROGRESS BAR */}
          <View className="flex-row justify-between items-center pt-3 border-t border-gray-100">
            {/* Step 1: Submitted */}
            <View className="items-center flex-1">
              <View className="w-9 h-9 bg-[#E2F898] rounded-full items-center justify-center mb-1 shadow-xs">
                <CheckCircle2 size={16} color="#1E293B" />
              </View>
              <Text className="text-gray-900 font-extrabold text-[10px]">Submitted</Text>
              <Text className="text-gray-400 text-[9px] font-semibold">24 May, 09:30 AM</Text>
            </View>

            <View className="w-6 h-0.5 bg-[#D2FC52]" />

            {/* Step 2: In Progress */}
            <View className="items-center flex-1">
              <View className="w-9 h-9 bg-[#D2FC52] rounded-full items-center justify-center mb-1 shadow-xs">
                <Wrench size={16} color="#1E293B" />
              </View>
              <Text className="text-emerald-700 font-extrabold text-[10px]">In Progress</Text>
              <Text className="text-emerald-600 text-[9px] font-bold">24 May, 11:20 AM</Text>
            </View>

            <View className="w-6 h-0.5 bg-gray-200" />

            {/* Step 3: Resolved */}
            <View className="items-center flex-1">
              <View className="w-9 h-9 bg-gray-100 rounded-full items-center justify-center mb-1">
                <UserCheck size={16} color="#94A3B8" />
              </View>
              <Text className="text-gray-400 font-bold text-[10px]">Resolved</Text>
              <Text className="text-gray-400 text-[9px]">Pending</Text>
            </View>

            <View className="w-6 h-0.5 bg-gray-200" />

            {/* Step 4: Closed */}
            <View className="items-center flex-1">
              <View className="w-9 h-9 bg-gray-100 rounded-full items-center justify-center mb-1">
                <Check size={16} color="#94A3B8" />
              </View>
              <Text className="text-gray-400 font-bold text-[10px]">Closed</Text>
              <Text className="text-gray-400 text-[9px]">Pending</Text>
            </View>
          </View>
        </Animated.View>

        {/* ASSIGNED TO TECHNICIAN CARD */}
        <Animated.View entering={FadeInUp.delay(100)} className="bg-white rounded-3xl p-5 mb-5 shadow-sm border border-gray-100">
          <Text className="text-gray-900 font-extrabold text-base mb-3">Assigned To</Text>

          <View className="flex-row justify-between items-center">
            <View className="flex-row items-center flex-1 pr-2">
              <Image 
                source={{ uri: complaint.technician.photo }} 
                className="w-14 h-14 rounded-full mr-3.5 bg-gray-200 border-2 border-emerald-500" 
              />
              <View className="flex-1">
                <Text className="text-gray-900 font-black text-base">{complaint.technician.name}</Text>
                <Text className="text-gray-500 text-xs font-semibold mt-0.5">{complaint.technician.role}</Text>
                <Text className="text-gray-400 text-xs font-medium mt-1">📞 {complaint.technician.phone}</Text>
              </View>
            </View>

            {/* Chat Action Button */}
            <TouchableOpacity 
              onPress={() => Alert.alert('Chat', `Opening live chat with ${complaint.technician.name}...`)}
              className="bg-[#E2F8EE] px-4 py-2.5 rounded-full flex-row items-center border border-emerald-200 shadow-xs"
            >
              <MessageSquare size={15} color="#047857" className="mr-1.5" />
              <Text className="text-emerald-800 font-extrabold text-xs">Chat</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>

        {/* UPDATES TIMELINE CARD */}
        <Animated.View entering={FadeInUp.delay(200)} className="bg-white rounded-3xl p-5 mb-5 shadow-sm border border-gray-100">
          <Text className="text-gray-900 font-extrabold text-base mb-4">Updates</Text>

          <View className="pl-1 space-y-4 relative">
            {/* Connecting Vertical Line */}
            <View className="absolute top-4 bottom-4 left-4 w-0.5 bg-gray-200 z-0" />

            {/* Event 1 */}
            <View className="flex-row items-start z-10">
              <View className="w-8 h-8 bg-[#E2F898] rounded-full items-center justify-center mr-3 border-2 border-white">
                <CheckCircle2 size={14} color="#1E293B" />
              </View>
              <View className="flex-1 border-b border-gray-100 pb-3">
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-900 font-extrabold text-xs">Complaint Submitted</Text>
                  <Text className="text-gray-400 text-[10px] font-medium">24 May 2025, 09:30 AM</Text>
                </View>
                <Text className="text-gray-500 text-xs font-medium mt-1">Your complaint has been submitted successfully.</Text>
              </View>
            </View>

            {/* Event 2 */}
            <View className="flex-row items-start z-10">
              <View className="w-8 h-8 bg-[#D2FC52] rounded-full items-center justify-center mr-3 border-2 border-white">
                <Wrench size={14} color="#1E293B" />
              </View>
              <View className="flex-1 border-b border-gray-100 pb-3">
                <View className="flex-row justify-between items-center">
                  <Text className="text-gray-900 font-extrabold text-xs">In Progress</Text>
                  <Text className="text-gray-400 text-[10px] font-medium">24 May 2025, 11:20 AM</Text>
                </View>
                <Text className="text-gray-500 text-xs font-medium mt-1">Our technician has been assigned and will resolve the issue soon.</Text>
              </View>
            </View>

            {/* Event 3 */}
            <View className="flex-row items-start z-10">
              <View className="w-8 h-8 bg-gray-100 rounded-full items-center justify-center mr-3 border-2 border-white">
                <MoreHorizontal size={14} color="#94A3B8" />
              </View>
              <View className="flex-1">
                <Text className="text-gray-400 font-bold text-xs">Resolved</Text>
                <Text className="text-gray-400 text-[10px] font-medium">Pending</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* ATTACHED PHOTOS CARD */}
        <Animated.View entering={FadeInUp.delay(300)} className="bg-white rounded-3xl p-5 mb-6 shadow-sm border border-gray-100">
          <Text className="text-gray-900 font-extrabold text-base mb-3">Attached Photos</Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-2">
            <View className="flex-row gap-3">
              {complaint.photos.map((url, pIdx) => (
                <Image key={pIdx} source={{ uri: url }} className="w-24 h-24 rounded-2xl bg-gray-200" />
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity className="flex-row items-center mt-2">
            <Text className="text-emerald-700 font-extrabold text-xs mr-1">View All</Text>
            <ChevronRight size={14} color="#047857" />
          </TouchableOpacity>
        </Animated.View>

        {/* COMMENT INPUT BOX (IF TOGGLED) */}
        {showCommentInput && (
          <View className="bg-white p-4 rounded-3xl mb-5 border border-purple-200 shadow-sm flex-row items-center">
            <TextInput
              placeholder="Add comment for Ramesh..."
              placeholderTextColor="#94A3B8"
              className="flex-1 text-gray-900 font-medium text-xs mr-2"
              value={commentText}
              onChangeText={setCommentText}
            />
            <TouchableOpacity onPress={handleAddComment} className="bg-gray-900 px-4 py-2.5 rounded-xl">
              <Send size={14} color="#D2FC52" />
            </TouchableOpacity>
          </View>
        )}

        <View className="h-28" />
      </ScrollView>

      {/* BOTTOM ACTION FOOTER CARD */}
      <View className="absolute bottom-0 left-0 right-0 bg-white p-5 rounded-t-3xl border-t border-gray-100 shadow-lg flex-row gap-3">
        <TouchableOpacity 
          onPress={() => setShowCommentInput(!showCommentInput)}
          className="flex-1 bg-gray-100 py-3.5 rounded-2xl flex-row items-center justify-center"
        >
          <MessageSquare size={16} color="#1E293B" className="mr-2" />
          <Text className="text-gray-900 font-extrabold text-xs">Add Comment</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          onPress={handleRateService}
          className="flex-1 bg-[#F4FBE4] border border-[#D2FC52] py-3.5 rounded-2xl flex-row items-center justify-center shadow-xs"
        >
          <Star size={16} color="#4D7C0F" className="mr-2" />
          <Text className="text-gray-900 font-extrabold text-xs">Rate Service</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
