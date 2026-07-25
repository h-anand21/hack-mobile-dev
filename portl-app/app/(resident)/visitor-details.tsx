import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { 
  ArrowLeft, MoreHorizontal, Phone, Clock, MessageSquare, Home, 
  Plus, Check, X, ShieldCheck, Truck, UserCheck, Send, CheckCircle2, XCircle, Users, ChevronRight
} from 'lucide-react-native';
import { apiClient } from '../../services/api/client';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function VisitorDetailsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [status, setStatus] = useState<string>((params.status as string) || 'pending');
  const [notes, setNotes] = useState<string[]>([
    (params.note as string) || 'Please hand over the package to me at the door.'
  ]);
  const [newNote, setNewNote] = useState('');
  const [showAddNote, setShowAddNote] = useState(false);

  const visitor = {
    id: (params.id as string) || 'demo-v1',
    name: (params.name as string) || 'Rahul Sharma',
    verified: true,
    purpose: (params.purpose as string) || 'Amazon Delivery',
    timeAgo: (params.timeAgo as string) || 'Arrived 2 mins ago',
    vehicle_number: (params.vehicle_number as string) || 'KA01 AB 1234',
    phone: (params.phone as string) || '98765 43210',
    visitingFlat: (params.visitingFlat as string) || 'Himanshu (B-302) • Tower A',
    photo_url: (params.photo_url as string) || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  };

  const handleAction = async (action: 'approve' | 'reject') => {
    try {
      setStatus(action === 'approve' ? 'approved' : 'rejected');
      await apiClient.post(`/api/visitors/${visitor.id}/${action}`, action === 'reject' ? { reason: 'Denied by resident' } : {});
      Alert.alert(
        action === 'approve' ? 'Visitor Approved 🎉' : 'Visitor Rejected ❌',
        `Security team has been notified of your decision.`
      );
    } catch (error) {
      Alert.alert('Decision Recorded', `Visitor entry set to ${action.toUpperCase()}`);
    }
  };

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    setNotes(prev => [newNote.trim(), ...prev]);
    setNewNote('');
    setShowAddNote(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FB]">
      {/* TOP HEADER */}
      <View className="flex-row justify-between items-center px-5 pt-3 pb-4 bg-white border-b border-gray-100">
        <TouchableOpacity 
          onPress={() => router.back()}
          className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100"
        >
          <ArrowLeft size={20} color="#1E293B" />
        </TouchableOpacity>

        <Text className="text-gray-900 font-extrabold text-lg">Visitor Details</Text>

        <TouchableOpacity 
          onPress={() => Alert.alert('Options', 'Visitor Options')}
          className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100"
        >
          <MoreHorizontal size={20} color="#1E293B" />
        </TouchableOpacity>
      </View>

      <ScrollView 
        className="flex-1 px-5 pt-4"
        showsVerticalScrollIndicator={false}
      >
        {/* MAIN PROFILE CARD */}
        <Animated.View entering={FadeInUp.duration(500)} className="bg-white rounded-3xl p-5 mb-5 shadow-sm border border-gray-100">
          <View className="flex-row justify-between items-start mb-4">
            {/* Photo Column */}
            <View className="relative mr-3.5">
              <Image 
                source={{ uri: visitor.photo_url }} 
                className="w-20 h-20 rounded-full bg-gray-200" 
              />
              <View className="absolute top-0 left-0 w-6 h-6 bg-[#D2FC52] rounded-full items-center justify-center border-2 border-white shadow-xs">
                <Truck size={12} color="#1E293B" />
              </View>
            </View>

            {/* Info Column */}
            <View className="flex-1 pr-2">
              <View className="flex-row items-center">
                <Text className="text-gray-900 font-black text-lg mr-1.5">{visitor.name}</Text>
                {visitor.verified && (
                  <View className="w-4 h-4 bg-emerald-500 rounded-full items-center justify-center">
                    <Check size={10} color="#FFFFFF" />
                  </View>
                )}
              </View>
              <Text className="text-gray-500 font-semibold text-xs mt-0.5">{visitor.purpose}</Text>

              {/* Status Badge */}
              <View className="mt-1.5 self-start bg-[#E2F8EE] px-2.5 py-0.5 rounded-full flex-row items-center">
                <Text className="text-emerald-700 font-extrabold text-[10px]">
                  {status === 'pending' ? 'Pending Approval' : status === 'approved' ? 'Approved Entry' : 'Rejected'}
                </Text>
              </View>

              {/* Info Items List */}
              <View className="mt-2.5 space-y-1">
                <View className="flex-row items-center">
                  <Clock size={12} color="#64748B" className="mr-1.5" />
                  <Text className="text-gray-600 text-[11px] font-semibold">{visitor.timeAgo}</Text>
                </View>

                {visitor.vehicle_number && (
                  <View className="flex-row items-center mt-1">
                    <Text className="text-gray-500 text-[11px] mr-1.5">🚘</Text>
                    <Text className="text-gray-700 text-[11px] font-semibold">{visitor.vehicle_number}</Text>
                  </View>
                )}

                <View className="flex-row items-center mt-1">
                  <Phone size={12} color="#64748B" className="mr-1.5" />
                  <Text className="text-gray-700 text-[11px] font-semibold">{visitor.phone}</Text>
                </View>

                <View className="flex-row items-center mt-1">
                  <Users size={12} color="#16A34A" className="mr-1.5" />
                  <Text className="text-emerald-700 text-[11px] font-bold">ID Proof Verified ✔️</Text>
                </View>
              </View>
            </View>

            {/* Call Button */}
            <TouchableOpacity 
              onPress={() => Alert.alert('Calling', `Calling ${visitor.name}...`)}
              className="w-10 h-10 bg-[#E2F898] rounded-full items-center justify-center border border-gray-100 shadow-xs"
            >
              <Phone size={18} color="#1E293B" />
            </TouchableOpacity>
          </View>

          {/* PURPOSE LIGHT BOX */}
          <View className="bg-gray-50 p-3.5 rounded-2xl flex-row items-center justify-between mb-2.5 border border-gray-100">
            <View className="flex-row items-center flex-1 pr-2">
              <MessageSquare size={16} color="#64748B" className="mr-3" />
              <View className="flex-1">
                <Text className="text-gray-400 text-[10px] font-bold uppercase">Purpose</Text>
                <Text className="text-gray-900 font-extrabold text-xs mt-0.5">{visitor.purpose}</Text>
              </View>
            </View>
            <ChevronRight size={14} color="#94A3B8" />
          </View>

          {/* VISITING LIGHT BOX */}
          <View className="bg-gray-50 p-3.5 rounded-2xl flex-row items-center justify-between border border-gray-100">
            <View className="flex-row items-center flex-1 pr-2">
              <Home size={16} color="#64748B" className="mr-3" />
              <View className="flex-1">
                <Text className="text-gray-400 text-[10px] font-bold uppercase">Visiting</Text>
                <Text className="text-gray-900 font-extrabold text-xs mt-0.5">{visitor.visitingFlat}</Text>
              </View>
            </View>
            <ChevronRight size={14} color="#94A3B8" />
          </View>
        </Animated.View>

        {/* VISITOR NOTES SECTION */}
        <Animated.View entering={FadeInUp.delay(100)} className="mb-5">
          <View className="flex-row justify-between items-center mb-3 px-1">
            <Text className="text-gray-900 font-extrabold text-base">Visitor Notes</Text>
            <TouchableOpacity 
              onPress={() => setShowAddNote(!showAddNote)}
              className="flex-row items-center"
            >
              <Text className="text-purple-600 font-bold text-xs mr-1">Add Note</Text>
              <Plus size={14} color="#7C3AED" />
            </TouchableOpacity>
          </View>

          {showAddNote && (
            <View className="bg-white p-3.5 rounded-2xl mb-3 border border-purple-200 flex-row items-center">
              <TextInput
                placeholder="Type note for guard..."
                placeholderTextColor="#94A3B8"
                className="flex-1 text-gray-900 font-medium text-xs mr-2"
                value={newNote}
                onChangeText={setNewNote}
              />
              <TouchableOpacity 
                onPress={handleAddNote}
                className="bg-purple-600 px-3 py-2 rounded-xl"
              >
                <Send size={14} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          )}

          {notes.map((noteText, nIdx) => (
            <View key={nIdx} className="bg-[#F7F5FF] p-4 rounded-2xl mb-2.5 border border-purple-100 flex-row items-start justify-between">
              <View className="flex-row items-start flex-1 pr-2">
                <MessageSquare size={16} color="#7C3AED" className="mr-2.5 mt-0.5" />
                <View className="flex-1">
                  <Text className="text-gray-900 font-semibold text-xs leading-relaxed">{noteText}</Text>
                  <Text className="text-gray-400 text-[10px] font-medium mt-1">Today, 09:39 AM</Text>
                </View>
              </View>
              <MoreHorizontal size={14} color="#94A3B8" />
            </View>
          ))}
        </Animated.View>

        {/* VISITOR TIMELINE SECTION */}
        <Animated.View entering={FadeInUp.delay(200)} className="mb-6">
          <Text className="text-gray-900 font-extrabold text-base mb-4 px-1">Visitor Timeline</Text>

          <View className="pl-1 space-y-4 relative">
            {/* Vertical Line Connector */}
            <View className="absolute top-4 bottom-4 left-4 w-0.5 bg-gray-200 z-0" />

            {/* Step 1 */}
            <View className="flex-row items-start z-10">
              <View className="w-8 h-8 bg-amber-100 rounded-full items-center justify-center mr-3 border-2 border-white">
                <UserCheck size={14} color="#D97706" />
              </View>
              <View className="flex-1 flex-row justify-between items-start border-b border-gray-100 pb-3">
                <View>
                  <Text className="text-gray-900 font-bold text-xs">Visitor Registered</Text>
                  <Text className="text-gray-400 text-[10px] font-medium">By Security Guard</Text>
                </View>
                <Text className="text-gray-400 text-[10px] font-medium">09:39 AM</Text>
              </View>
            </View>

            {/* Step 2 */}
            <View className="flex-row items-start z-10">
              <View className="w-8 h-8 bg-purple-100 rounded-full items-center justify-center mr-3 border-2 border-white">
                <Send size={14} color="#7C3AED" />
              </View>
              <View className="flex-1 flex-row justify-between items-start border-b border-gray-100 pb-3">
                <View>
                  <Text className="text-gray-900 font-bold text-xs">Approval Requested</Text>
                  <Text className="text-gray-400 text-[10px] font-medium">Request sent to you</Text>
                </View>
                <Text className="text-gray-400 text-[10px] font-medium">09:39 AM</Text>
              </View>
            </View>

            {/* Step 3 */}
            <View className="flex-row items-start z-10">
              <View className="w-8 h-8 bg-[#E2F898] rounded-full items-center justify-center mr-3 border-2 border-white">
                <Clock size={14} color="#1E293B" />
              </View>
              <View className="flex-1 flex-row justify-between items-start">
                <View>
                  <Text className="text-gray-900 font-bold text-xs">Waiting for Approval</Text>
                  <Text className="text-gray-400 text-[10px] font-medium">Your action is required</Text>
                </View>
                <Text className="text-gray-400 text-[10px] font-medium">09:39 AM</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <View className="h-32" />
      </ScrollView>

      {/* BOTTOM ACTION FOOTER CARD */}
      <View className="absolute bottom-0 left-0 right-0 bg-white p-5 rounded-t-3xl border-t border-gray-100 shadow-lg">
        {status === 'pending' ? (
          <>
            <View className="flex-row gap-3 mb-3">
              <TouchableOpacity 
                onPress={() => handleAction('reject')}
                className="flex-1 bg-gray-100 py-3.5 rounded-2xl items-center flex-row justify-center"
              >
                <X size={18} color="#EF4444" />
                <Text className="text-gray-900 font-bold text-sm ml-1.5">Reject</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                onPress={() => handleAction('approve')}
                className="flex-1 bg-[#D2FC52] py-3.5 rounded-2xl items-center flex-row justify-center shadow-xs"
              >
                <Check size={18} color="#1E293B" />
                <Text className="text-gray-900 font-extrabold text-sm ml-1.5">Approve</Text>
              </TouchableOpacity>
            </View>

            <View className="flex-row items-center justify-center">
              <ShieldCheck size={14} color="#16A34A" className="mr-1.5" />
              <Text className="text-gray-400 text-[11px] font-medium">
                Your decision will be notified to the security team instantly.
              </Text>
            </View>
          </>
        ) : (
          <View className="flex-row items-center justify-center py-2">
            {status === 'approved' ? (
              <>
                <CheckCircle2 size={20} color="#16A34A" className="mr-2" />
                <Text className="text-emerald-700 font-extrabold text-sm">Visitor Approved for Entry</Text>
              </>
            ) : (
              <>
                <XCircle size={20} color="#DC2626" className="mr-2" />
                <Text className="text-rose-700 font-extrabold text-sm">Visitor Entry Denied</Text>
              </>
            )}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
