import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../../store/authStore';
import { signOut } from '../../../services/supabase/auth';

export default function GuardDashboard() {
  const { user } = useAuthStore();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <SafeAreaView className="flex-1 bg-dark justify-center items-center">
      <Text className="text-2xl font-bold text-accent mb-4">Guard Dashboard</Text>
      <Text className="text-white mb-8">Logged in as {user?.email || 'Guard'}</Text>
      
      <TouchableOpacity onPress={handleLogout} className="bg-white/10 px-6 py-3 rounded-full border border-white/20">
        <Text className="text-white font-semibold">Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
