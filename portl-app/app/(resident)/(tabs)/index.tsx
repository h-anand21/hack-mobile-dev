import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../../../store/authStore';
import { signOut } from '../../../services/supabase/auth';

export default function ResidentDashboard() {
  const { user } = useAuthStore();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <SafeAreaView className="flex-1 bg-background justify-center items-center">
      <Text className="text-2xl font-bold text-dark mb-4">Resident Dashboard</Text>
      <Text className="text-textSecondary mb-8">Logged in as {user?.email || 'Resident'}</Text>
      
      <TouchableOpacity onPress={handleLogout} className="bg-dark px-6 py-3 rounded-full">
        <Text className="text-accent font-semibold">Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
