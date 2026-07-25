import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Phone, Lock, User, Shield, Home, KeyRound, ArrowRight } from 'lucide-react-native';
import { signUpWithEmail, signInWithGoogle } from '../../services/supabase/auth';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function RegisterScreen() {
  const router = useRouter();
  const [role, setRole] = useState<'resident' | 'guard' | 'admin'>('resident');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { setLoading: setAppLoading, setRole: setAppRole } = useAuthStore();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      return Alert.alert('Required Fields', 'Please fill in your name, email, and password');
    }
    if (password.length < 6) {
      return Alert.alert('Weak Password', 'Password must be at least 6 characters long');
    }

    setLoading(true);
    setAppLoading(true);

    const { data, error } = await signUpWithEmail(email, password, name, role, phone);

    setLoading(false);
    if (error) {
      setAppLoading(false);
      Alert.alert('Registration Failed', error.message);
    } else {
      setAppRole(role);
      Alert.alert('Registration Successful 🎉', `Welcome to Portl as ${role.toUpperCase()}!`, [
        {
          text: 'Continue',
          onPress: () => {
            setAppLoading(false);
            if (role === 'resident') router.replace('/(resident)/(tabs)');
            else if (role === 'guard') router.replace('/(guard)/(tabs)');
            else router.replace('/(admin)/(tabs)');
          }
        }
      ]);
    }
  };

  const handleGoogleSignUp = async () => {
    setLoading(true);
    setAppLoading(true);
    const { error } = await signInWithGoogle();
    setLoading(false);
    if (error) {
      setAppLoading(false);
      Alert.alert('Google Sign-In Failed', error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 px-6 justify-center"
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <Animated.View entering={FadeInDown.duration(600)} className="py-6">
            
            <Text className="text-4xl text-white font-bold mb-2">Create Account</Text>
            <Text className="text-textSecondary text-base mb-6">Join your smart society on Portl</Text>

            {/* STEP 1: SELECT YOUR ROLE FIRST */}
            <Text className="text-white font-semibold mb-3 text-base">Select Your Role First:</Text>
            <View className="flex-row gap-3 mb-6">
              <TouchableOpacity
                onPress={() => setRole('resident')}
                className={`flex-1 p-4 rounded-2xl border items-center justify-center ${
                  role === 'resident'
                    ? 'bg-accent/20 border-accent'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <Home size={24} color={role === 'resident' ? '#E7FF45' : '#888'} />
                <Text className={`font-bold mt-2 text-sm ${role === 'resident' ? 'text-accent' : 'text-textSecondary'}`}>
                  Resident
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setRole('guard')}
                className={`flex-1 p-4 rounded-2xl border items-center justify-center ${
                  role === 'guard'
                    ? 'bg-accent/20 border-accent'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <Shield size={24} color={role === 'guard' ? '#E7FF45' : '#888'} />
                <Text className={`font-bold mt-2 text-sm ${role === 'guard' ? 'text-accent' : 'text-textSecondary'}`}>
                  Guard
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setRole('admin')}
                className={`flex-1 p-4 rounded-2xl border items-center justify-center ${
                  role === 'admin'
                    ? 'bg-accent/20 border-accent'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                <KeyRound size={24} color={role === 'admin' ? '#E7FF45' : '#888'} />
                <Text className={`font-bold mt-2 text-sm ${role === 'admin' ? 'text-accent' : 'text-textSecondary'}`}>
                  Admin
                </Text>
              </TouchableOpacity>
            </View>

            {/* FORM INPUTS */}
            <View className="space-y-4">
              {/* Full Name */}
              <View className="flex-row items-center bg-white/5 rounded-2xl px-4 py-4 border border-white/10">
                <User size={20} color="#666" />
                <TextInput
                  placeholder="Full Name"
                  placeholderTextColor="#666"
                  className="flex-1 ml-3 text-white text-base"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              {/* Email */}
              <View className="flex-row items-center bg-white/5 rounded-2xl px-4 py-4 border border-white/10 mt-4">
                <Mail size={20} color="#666" />
                <TextInput
                  placeholder="Email Address"
                  placeholderTextColor="#666"
                  className="flex-1 ml-3 text-white text-base"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              {/* Phone */}
              <View className="flex-row items-center bg-white/5 rounded-2xl px-4 py-4 border border-white/10 mt-4">
                <Phone size={20} color="#666" />
                <TextInput
                  placeholder="Phone Number (+91)"
                  placeholderTextColor="#666"
                  className="flex-1 ml-3 text-white text-base"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>

              {/* Password */}
              <View className="flex-row items-center bg-white/5 rounded-2xl px-4 py-4 border border-white/10 mt-4">
                <Lock size={20} color="#666" />
                <TextInput
                  placeholder="Password (min 6 characters)"
                  placeholderTextColor="#666"
                  className="flex-1 ml-3 text-white text-base"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              {/* Register Button */}
              <TouchableOpacity
                className="bg-accent py-4 rounded-2xl items-center mt-6 flex-row justify-center shadow-card"
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#171717" />
                ) : (
                  <>
                    <Text className="text-dark font-bold text-lg mr-2">Register as {role.toUpperCase()}</Text>
                    <ArrowRight size={20} color="#171717" />
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Google Registration */}
            <TouchableOpacity
              onPress={handleGoogleSignUp}
              disabled={loading}
              className="bg-white/10 border border-white/20 py-4 rounded-2xl flex-row items-center justify-center mt-4"
            >
              <Text className="text-white font-bold text-base">Sign Up with Google 🚀</Text>
            </TouchableOpacity>

            {/* Back to Login Link */}
            <TouchableOpacity
              onPress={() => router.push('/(auth)/login')}
              className="mt-6 items-center py-2"
            >
              <Text className="text-textSecondary text-sm">
                Already have an account? <Text className="text-accent font-bold">Sign In</Text>
              </Text>
            </TouchableOpacity>

          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
