import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Users, Plus, Phone, Mail, Shield, Check, Trash2 } from 'lucide-react-native';

export default function FamilyMembersScreen() {
  const router = useRouter();
  const [members, setMembers] = useState([
    { id: '1', name: 'Himanshu Anand', relation: 'Owner / Primary', phone: '+91 98765 43210', status: 'Approved', photo: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80' },
    { id: '2', name: 'Priya Anand', relation: 'Spouse', phone: '+91 98765 11111', status: 'Approved', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80' },
    { id: '3', name: 'Aarav Anand', relation: 'Son', phone: '+91 98765 22222', status: 'Approved', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80' },
    { id: '4', name: 'Savitri Anand', relation: 'Mother', phone: '+91 98765 33333', status: 'Approved', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80' }
  ]);

  const [showAdd, setShowAdd] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRelation, setNewRelation] = useState('Family');
  const [newPhone, setNewPhone] = useState('');

  const handleAddMember = () => {
    if (!newName.trim() || !newPhone.trim()) return Alert.alert('Required', 'Please enter name and phone');
    setMembers(prev => [
      ...prev,
      {
        id: String(Date.now()),
        name: newName.trim(),
        relation: newRelation,
        phone: newPhone.trim(),
        status: 'Approved',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'
      }
    ]);
    setNewName('');
    setNewPhone('');
    setShowAdd(false);
    Alert.alert('Member Added 🎉', `${newName} added to Flat B-302!`);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FB]">
      <View className="flex-row justify-between items-center px-5 pt-3 pb-4 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100">
          <ArrowLeft size={20} color="#1E293B" />
        </TouchableOpacity>
        <View className="items-center">
          <Text className="text-gray-900 font-extrabold text-lg">Flat & Family Members</Text>
          <Text className="text-gray-400 text-xs font-semibold">Flat B-302 • Tower A</Text>
        </View>
        <TouchableOpacity onPress={() => setShowAdd(!showAdd)} className="w-10 h-10 bg-[#F4FBE4] rounded-full items-center justify-center border border-lime-200">
          <Plus size={20} color="#163316" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        {showAdd && (
          <View className="bg-white p-5 rounded-3xl mb-5 shadow-sm border border-gray-200">
            <Text className="text-gray-900 font-extrabold text-base mb-3">Add New Family Member</Text>
            <TextInput placeholder="Full Name" placeholderTextColor="#94A3B8" value={newName} onChangeText={setNewName} className="bg-gray-50 p-3.5 rounded-2xl mb-3 border border-gray-200 text-xs text-gray-900 font-medium" />
            <TextInput placeholder="Relation (e.g. Spouse, Child)" placeholderTextColor="#94A3B8" value={newRelation} onChangeText={setNewRelation} className="bg-gray-50 p-3.5 rounded-2xl mb-3 border border-gray-200 text-xs text-gray-900 font-medium" />
            <TextInput placeholder="Mobile Number" placeholderTextColor="#94A3B8" keyboardType="phone-pad" value={newPhone} onChangeText={setNewPhone} className="bg-gray-50 p-3.5 rounded-2xl mb-4 border border-gray-200 text-xs text-gray-900 font-medium" />
            <TouchableOpacity onPress={handleAddMember} className="bg-[#D2FC52] py-3.5 rounded-2xl items-center">
              <Text className="text-gray-900 font-extrabold text-xs">Save Member</Text>
            </TouchableOpacity>
          </View>
        )}

        <View className="flex-row justify-between items-center mb-3 px-1">
          <Text className="text-gray-900 font-extrabold text-base">Registered Members</Text>
          <Text className="text-gray-400 text-xs font-semibold">{members.length} Members</Text>
        </View>

        {members.map((m) => (
          <View key={m.id} className="bg-white rounded-3xl p-4 mb-3 shadow-sm border border-gray-100 flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 pr-2">
              <Image source={{ uri: m.photo }} className="w-14 h-14 rounded-full mr-3.5 bg-gray-200" />
              <View className="flex-1">
                <Text className="text-gray-900 font-black text-base">{m.name}</Text>
                <Text className="text-gray-500 font-semibold text-xs mt-0.5">{m.relation}</Text>
                <Text className="text-gray-400 text-[11px] font-medium mt-1">📞 {m.phone}</Text>
              </View>
            </View>
            <View className="bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              <Text className="text-emerald-700 font-extrabold text-[10px]">Verified ✔️</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
