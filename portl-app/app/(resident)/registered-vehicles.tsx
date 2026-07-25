import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Car, Plus, ShieldCheck, QrCode } from 'lucide-react-native';

export default function RegisteredVehiclesScreen() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState([
    { id: 'v1', number: 'KA01 AB 1234', type: 'Car (SUV)', sticker: 'STK-8821', slot: 'P-12 (Basement B1)' },
    { id: 'v2', number: 'KA05 CD 5678', type: 'Two Wheeler (Scooter)', sticker: 'STK-8822', slot: 'TW-45 (Ground)' }
  ]);

  const [showAdd, setShowAdd] = useState(false);
  const [vNumber, setVNumber] = useState('');
  const [vType, setVType] = useState('Car (Sedan)');

  const handleAddVehicle = () => {
    if (!vNumber.trim()) return Alert.alert('Required', 'Please enter vehicle number');
    setVehicles(prev => [
      ...prev,
      {
        id: String(Date.now()),
        number: vNumber.toUpperCase().trim(),
        type: vType,
        sticker: `STK-${Math.floor(1000 + Math.random() * 9000)}`,
        slot: 'Visitor / Open Slot'
      }
    ]);
    setVNumber('');
    setShowAdd(false);
    Alert.alert('Vehicle Registered 🎉', `${vNumber} registered for Flat B-302!`);
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FB]">
      <View className="flex-row justify-between items-center px-5 pt-3 pb-4 bg-white border-b border-gray-100">
        <TouchableOpacity onPress={() => router.back()} className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center border border-gray-100">
          <ArrowLeft size={20} color="#1E293B" />
        </TouchableOpacity>
        <View className="items-center">
          <Text className="text-gray-900 font-extrabold text-lg">Registered Vehicles</Text>
          <Text className="text-gray-400 text-xs font-semibold">Flat B-302 • Tower A</Text>
        </View>
        <TouchableOpacity onPress={() => setShowAdd(!showAdd)} className="w-10 h-10 bg-[#F4FBE4] rounded-full items-center justify-center border border-lime-200">
          <Plus size={20} color="#163316" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 px-5 pt-4" showsVerticalScrollIndicator={false}>
        {showAdd && (
          <View className="bg-white p-5 rounded-3xl mb-5 shadow-sm border border-gray-200">
            <Text className="text-gray-900 font-extrabold text-base mb-3">Add New Vehicle</Text>
            <TextInput placeholder="Vehicle Number (e.g. KA01 AB 1234)" placeholderTextColor="#94A3B8" value={vNumber} onChangeText={setVNumber} className="bg-gray-50 p-3.5 rounded-2xl mb-3 border border-gray-200 text-xs text-gray-900 font-medium uppercase" />
            <TextInput placeholder="Type (Car / Bike / SUV)" placeholderTextColor="#94A3B8" value={vType} onChangeText={setVType} className="bg-gray-50 p-3.5 rounded-2xl mb-4 border border-gray-200 text-xs text-gray-900 font-medium" />
            <TouchableOpacity onPress={handleAddVehicle} className="bg-[#D2FC52] py-3.5 rounded-2xl items-center">
              <Text className="text-gray-900 font-extrabold text-xs">Save Vehicle</Text>
            </TouchableOpacity>
          </View>
        )}

        <View className="flex-row justify-between items-center mb-3 px-1">
          <Text className="text-gray-900 font-extrabold text-base">Society Parking Passes</Text>
          <Text className="text-gray-400 text-xs font-semibold">{vehicles.length} Vehicles</Text>
        </View>

        {vehicles.map((v) => (
          <View key={v.id} className="bg-white rounded-3xl p-5 mb-4 shadow-sm border border-gray-100">
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center">
                <View className="w-12 h-12 bg-[#F4FBE4] rounded-2xl items-center justify-center mr-3.5 border border-lime-100">
                  <Car size={22} color="#163316" />
                </View>
                <View>
                  <Text className="text-gray-900 font-black text-lg">{v.number}</Text>
                  <Text className="text-gray-500 font-semibold text-xs mt-0.5">{v.type}</Text>
                </View>
              </View>
              <View className="bg-[#E2F8EE] px-3 py-1 rounded-full border border-emerald-200">
                <Text className="text-emerald-700 font-extrabold text-[10px]">Active Tag</Text>
              </View>
            </View>

            <View className="pt-3 border-t border-gray-100 flex-row justify-between items-center">
              <Text className="text-gray-500 text-xs font-medium">RFID Tag: <Text className="text-gray-900 font-bold">{v.sticker}</Text></Text>
              <Text className="text-gray-500 text-xs font-medium">Slot: <Text className="text-gray-900 font-bold">{v.slot}</Text></Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}
