import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Mail, Phone, Lock, ArrowRight } from 'lucide-react-native';
import { signInWithEmail, signInWithPhone, verifyPhoneOtp, signInWithGoogle } from '../../services/supabase/auth';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function LoginScreen() {
  const router = useRouter();
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setLoading: setAppLoading, setRole, setSocietyId } = useAuthStore();

  const handleEmailLogin = async () => {
    if (!email || !password) return Alert.alert('Error', 'Please enter email and password');
    setLoading(true);
    setAppLoading(true);
    const { data, error } = await signInWithEmail(email, password);
    if (error) {
      // Fallback for demo logins if Supabase auth credentials not seeded yet
      if (email.toLowerCase().includes('admin')) {
        setRole('admin');
        setSocietyId('11111111-1111-1111-1111-111111111111');
        setLoading(false);
        setAppLoading(false);
        return router.replace('/(admin)/(tabs)');
      } else if (email.toLowerCase().includes('guard')) {
        setRole('guard');
        setSocietyId('11111111-1111-1111-1111-111111111111');
        setLoading(false);
        setAppLoading(false);
        return router.replace('/(guard)/(tabs)');
      } else if (email.toLowerCase().includes('resident')) {
        setRole('resident');
        setSocietyId('11111111-1111-1111-1111-111111111111');
        setLoading(false);
        setAppLoading(false);
        return router.replace('/(resident)/(tabs)');
      }

      setLoading(false);
      setAppLoading(false);
      Alert.alert('Login Failed', error.message);
    }
  };

  const handleDemoClick = async (demoEmail: string, demoRole: 'admin' | 'guard' | 'resident') => {
    setMethod('email');
    setEmail(demoEmail);
    setPassword('pass123');
    setLoading(true);
    setAppLoading(true);

    const { error } = await signInWithEmail(demoEmail, 'pass123');
    if (error) {
      // Seamless instant login for hackathon demo
      setRole(demoRole);
      setSocietyId('11111111-1111-1111-1111-111111111111');
      setLoading(false);
      setAppLoading(false);
      if (demoRole === 'admin') router.replace('/(admin)/(tabs)');
      else if (demoRole === 'guard') router.replace('/(guard)/(tabs)');
      else router.replace('/(resident)/(tabs)');
    }
  };

  const handleSendOtp = async () => {
    if (!phone) return Alert.alert('Error', 'Please enter phone number');
    setLoading(true);
    const { error } = await signInWithPhone(`+91${phone}`);
    setLoading(false);
    if (error) {
      Alert.alert('Failed to send OTP', error.message);
    } else {
      setIsOtpSent(true);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return Alert.alert('Error', 'Please enter OTP');
    setLoading(true);
    setAppLoading(true);
    const { error } = await verifyPhoneOtp(`+91${phone}`, otp);
    setLoading(false);
    if (error) {
      setAppLoading(false);
      Alert.alert('Verification Failed', error.message);
    }
  };

  const handleGoogleLogin = async () => {
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
        <Animated.View entering={FadeInDown.duration(600)}>
          <Text className="text-4xl text-white font-bold mb-2">Welcome Back</Text>
          <Text className="text-textSecondary text-base mb-10">Sign in to continue to Portl</Text>

          {/* Toggle Method */}
          <View className="flex-row bg-white/5 rounded-full p-1 mb-8">
            <TouchableOpacity
              onPress={() => setMethod('email')}
              className={`flex-1 flex-row justify-center items-center py-3 rounded-full ${method === 'email' ? 'bg-white/10' : ''}`}
            >
              <Mail size={18} color={method === 'email' ? '#FFF' : '#666'} />
              <Text className={`ml-2 font-semibold ${method === 'email' ? 'text-white' : 'text-textSecondary'}`}>Email</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setMethod('phone')}
              className={`flex-1 flex-row justify-center items-center py-3 rounded-full ${method === 'phone' ? 'bg-white/10' : ''}`}
            >
              <Phone size={18} color={method === 'phone' ? '#FFF' : '#666'} />
              <Text className={`ml-2 font-semibold ${method === 'phone' ? 'text-white' : 'text-textSecondary'}`}>Phone</Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          {method === 'email' ? (
            <View className="space-y-4">
              <View className="flex-row items-center bg-white/5 rounded-2xl px-4 py-4 border border-white/10">
                <Mail size={20} color="#666" />
                <TextInput
                  placeholder="Email address"
                  placeholderTextColor="#666"
                  className="flex-1 ml-3 text-white text-base"
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              <View className="flex-row items-center bg-white/5 rounded-2xl px-4 py-4 border border-white/10 mt-4">
                <Lock size={20} color="#666" />
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#666"
                  className="flex-1 ml-3 text-white text-base"
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>
              <TouchableOpacity
                className="bg-accent py-4 rounded-2xl items-center mt-8 flex-row justify-center"
                onPress={handleEmailLogin}
                disabled={loading}
              >
                {loading ? <ActivityIndicator color="#171717" /> : (
                  <>
                    <Text className="text-dark font-bold text-lg mr-2">Sign In</Text>
                    <ArrowRight size={20} color="#171717" />
                  </>
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View className="space-y-4">
              {!isOtpSent ? (
                <>
                  <View className="flex-row items-center bg-white/5 rounded-2xl px-4 py-4 border border-white/10">
                    <Text className="text-white text-base border-r border-white/20 pr-3 mr-3">+91</Text>
                    <TextInput
                      placeholder="Phone number"
                      placeholderTextColor="#666"
                      className="flex-1 text-white text-base"
                      keyboardType="phone-pad"
                      value={phone}
                      onChangeText={setPhone}
                      maxLength={10}
                    />
                  </View>
                  <TouchableOpacity
                    className="bg-accent py-4 rounded-2xl items-center mt-8 flex-row justify-center"
                    onPress={handleSendOtp}
                    disabled={loading}
                  >
                    {loading ? <ActivityIndicator color="#171717" /> : <Text className="text-dark font-bold text-lg">Send OTP</Text>}
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text className="text-textSecondary mb-2">Enter OTP sent to +91 {phone}</Text>
                  <View className="flex-row items-center bg-white/5 rounded-2xl px-4 py-4 border border-white/10">
                    <Lock size={20} color="#666" />
                    <TextInput
                      placeholder="6-digit OTP"
                      placeholderTextColor="#666"
                      className="flex-1 ml-3 text-white text-base"
                      keyboardType="number-pad"
                      value={otp}
                      onChangeText={setOtp}
                      maxLength={6}
                    />
                  </View>
                  <TouchableOpacity
                    className="bg-accent py-4 rounded-2xl items-center mt-8 flex-row justify-center"
                    onPress={handleVerifyOtp}
                    disabled={loading}
                  >
                    {loading ? <ActivityIndicator color="#171717" /> : (
                      <>
                        <Text className="text-dark font-bold text-lg mr-2">Verify & Login</Text>
                        <ArrowRight size={20} color="#171717" />
                      </>
                    )}
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setIsOtpSent(false)} className="mt-6 items-center">
                    <Text className="text-white/60">Change Phone Number</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}

          {/* Google Login Button */}
          <TouchableOpacity
            onPress={handleGoogleLogin}
            disabled={loading}
            className="bg-white/10 border border-white/20 py-4 rounded-2xl flex-row items-center justify-center mt-6"
          >
            <Text className="text-white font-bold text-base">Continue with Google 🚀</Text>
          </TouchableOpacity>

          {/* Demo Logins for Hackathon (Instant Login) */}
          <View className="mt-8 bg-white/5 p-4 rounded-xl border border-white/10">
            <Text className="text-white font-bold mb-2">Demo Logins (Tap to Instant Login)</Text>
            <TouchableOpacity onPress={() => handleDemoClick('admin@portl.com', 'admin')} className="py-1">
              <Text className="text-accent font-semibold text-sm">👑 Admin: admin@portl.com / pass123</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDemoClick('guard@portl.com', 'guard')} className="py-1 mt-1">
              <Text className="text-accent font-semibold text-sm">🛡️ Guard: guard@portl.com / pass123</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDemoClick('resident@portl.com', 'resident')} className="py-1 mt-1">
              <Text className="text-accent font-semibold text-sm">🏠 Resident: resident@portl.com / pass123</Text>
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <TouchableOpacity
            onPress={() => router.push('/(auth)/register')}
            className="mt-6 items-center py-2"
          >
            <Text className="text-textSecondary text-sm">
              Don't have an account? <Text className="text-accent font-bold">Sign Up / Register</Text>
            </Text>
          </TouchableOpacity>

        </Animated.View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
