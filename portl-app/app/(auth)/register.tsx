import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, Image, 
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  Mail, Phone, Lock, User, Shield, Home, KeyRound, ArrowRight, Building2, ArrowLeft 
} from 'lucide-react-native';
import { signUpWithEmail, signInWithGoogle } from '../../services/supabase/auth';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'expo-router';

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

    const { error } = await signUpWithEmail(email, password, name, role, phone);

    setLoading(false);
    if (error) {
      setAppLoading(false);
      Alert.alert('Registration Failed', error.message);
    } else {
      setAppRole(role);
      Alert.alert('Registration Successful 🎉', `Welcome to Gately as ${role.toUpperCase()}!`, [
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
    <View style={{ flex: 1, backgroundColor: '#F8F9FB' }}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView 
          style={{ flex: 1 }} 
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* TOP BANNER HERO SECTION */}
          <View style={{ height: 220, position: 'relative', backgroundColor: '#163316' }}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80' }} 
              style={{ width: '100%', height: '100%', opacity: 0.85 }}
              resizeMode="cover"
            />
            <View style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(22, 51, 22, 0.45)'
            }} />

            <SafeAreaView style={{ position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: 24, paddingTop: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <TouchableOpacity 
                  onPress={() => router.back()}
                  style={{
                    width: 36, height: 36, borderRadius: 18,
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    alignItems: 'center', justifyContent: 'center', marginBottom: 8
                  }}
                >
                  <ArrowLeft size={20} color="#FFFFFF" />
                </TouchableOpacity>

                <Image 
                  source={require('../../assets/logo.png')} 
                  style={{ width: 36, height: 36, borderRadius: 8 }}
                  resizeMode="contain"
                />
              </View>

              <Text style={{ color: '#FFFFFF', fontSize: 26, fontWeight: '900', letterSpacing: -0.5 }}>
                Create Account
              </Text>
              <Text style={{ color: '#E2F898', fontSize: 13, fontWeight: '600', marginTop: 2 }}>
                Join your smart society on Gately
              </Text>
            </SafeAreaView>
          </View>

          {/* MAIN FORM CARD SHEET */}
          <View style={{
            flex: 1,
            backgroundColor: '#FFFFFF',
            borderTopLeftRadius: 36,
            borderTopRightRadius: 36,
            marginTop: -28,
            paddingHorizontal: 24,
            paddingTop: 28,
            paddingBottom: 36,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: -6 },
            shadowOpacity: 0.08,
            shadowRadius: 16,
            elevation: 10
          }}>
            {/* ROLE SELECTOR */}
            <Text style={{ color: '#1E293B', fontWeight: '800', fontSize: 13, marginBottom: 10 }}>
              Select Your Account Type:
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 20 }}>
              <TouchableOpacity
                onPress={() => setRole('resident')}
                style={{
                  flex: 1, paddingVertical: 14, borderRadius: 16, borderWidth: 1.5,
                  borderColor: role === 'resident' ? '#163316' : '#E2E8F0',
                  backgroundColor: role === 'resident' ? '#F4FBE4' : '#F8FAFC',
                  alignItems: 'center'
                }}
              >
                <Home size={22} color={role === 'resident' ? '#163316' : '#64748B'} />
                <Text style={{ fontWeight: '800', fontSize: 12, marginTop: 4, color: role === 'resident' ? '#163316' : '#64748B' }}>
                  Resident
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setRole('guard')}
                style={{
                  flex: 1, paddingVertical: 14, borderRadius: 16, borderWidth: 1.5,
                  borderColor: role === 'guard' ? '#163316' : '#E2E8F0',
                  backgroundColor: role === 'guard' ? '#F4FBE4' : '#F8FAFC',
                  alignItems: 'center'
                }}
              >
                <Shield size={22} color={role === 'guard' ? '#163316' : '#64748B'} />
                <Text style={{ fontWeight: '800', fontSize: 12, marginTop: 4, color: role === 'guard' ? '#163316' : '#64748B' }}>
                  Guard
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setRole('admin')}
                style={{
                  flex: 1, paddingVertical: 14, borderRadius: 16, borderWidth: 1.5,
                  borderColor: role === 'admin' ? '#163316' : '#E2E8F0',
                  backgroundColor: role === 'admin' ? '#F4FBE4' : '#F8FAFC',
                  alignItems: 'center'
                }}
              >
                <KeyRound size={22} color={role === 'admin' ? '#163316' : '#64748B'} />
                <Text style={{ fontWeight: '800', fontSize: 12, marginTop: 4, color: role === 'admin' ? '#163316' : '#64748B' }}>
                  Admin
                </Text>
              </TouchableOpacity>
            </View>

            {/* FORM INPUTS */}
            <View style={{ gap: 14 }}>
              {/* Full Name */}
              <View>
                <Text style={{ color: '#1E293B', fontWeight: '700', fontSize: 12, marginBottom: 6 }}>Full Name</Text>
                <View style={{
                  flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC',
                  borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, paddingHorizontal: 14, height: 50
                }}>
                  <User size={18} color="#64748B" style={{ marginRight: 10 }} />
                  <TextInput
                    placeholder="Enter your full name"
                    placeholderTextColor="#94A3B8"
                    value={name}
                    onChangeText={setName}
                    style={{ flex: 1, color: '#0F172A', fontWeight: '600', fontSize: 13 }}
                  />
                </View>
              </View>

              {/* Email */}
              <View>
                <Text style={{ color: '#1E293B', fontWeight: '700', fontSize: 12, marginBottom: 6 }}>Email Address</Text>
                <View style={{
                  flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC',
                  borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, paddingHorizontal: 14, height: 50
                }}>
                  <Mail size={18} color="#64748B" style={{ marginRight: 10 }} />
                  <TextInput
                    placeholder="Enter your email address"
                    placeholderTextColor="#94A3B8"
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                    style={{ flex: 1, color: '#0F172A', fontWeight: '600', fontSize: 13 }}
                  />
                </View>
              </View>

              {/* Phone */}
              <View>
                <Text style={{ color: '#1E293B', fontWeight: '700', fontSize: 12, marginBottom: 6 }}>Phone Number</Text>
                <View style={{
                  flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC',
                  borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, paddingHorizontal: 14, height: 50
                }}>
                  <Phone size={18} color="#64748B" style={{ marginRight: 10 }} />
                  <TextInput
                    placeholder="+91 Mobile number"
                    placeholderTextColor="#94A3B8"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                    style={{ flex: 1, color: '#0F172A', fontWeight: '600', fontSize: 13 }}
                  />
                </View>
              </View>

              {/* Password */}
              <View>
                <Text style={{ color: '#1E293B', fontWeight: '700', fontSize: 12, marginBottom: 6 }}>Password</Text>
                <View style={{
                  flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC',
                  borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 16, paddingHorizontal: 14, height: 50
                }}>
                  <Lock size={18} color="#64748B" style={{ marginRight: 10 }} />
                  <TextInput
                    placeholder="Min 6 characters password"
                    placeholderTextColor="#94A3B8"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    style={{ flex: 1, color: '#0F172A', fontWeight: '600', fontSize: 13 }}
                  />
                </View>
              </View>

              {/* Register Button */}
              <TouchableOpacity
                onPress={handleRegister}
                disabled={loading}
                style={{
                  backgroundColor: '#163316', height: 54, borderRadius: 16,
                  alignItems: 'center', justifyContent: 'center', flexDirection: 'row', marginTop: 10
                }}
              >
                {loading ? (
                  <ActivityIndicator color="#D2FC52" />
                ) : (
                  <>
                    <Text style={{ color: '#D2FC52', fontWeight: '900', fontSize: 15, marginRight: 8 }}>
                      Register as {role.toUpperCase()}
                    </Text>
                    <ArrowRight size={18} color="#D2FC52" />
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Google Registration */}
            <TouchableOpacity
              onPress={handleGoogleSignUp}
              disabled={loading}
              style={{
                backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0',
                height: 48, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 14
              }}
            >
              <Text style={{ fontSize: 15, marginRight: 8 }}>🌐</Text>
              <Text style={{ color: '#0F172A', fontWeight: '700', fontSize: 13 }}>
                Sign Up with Google
              </Text>
            </TouchableOpacity>

            {/* Back to Login Link */}
            <View style={{ alignItems: 'center', marginTop: 22 }}>
              <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                <Text style={{ color: '#64748B', fontSize: 12, fontWeight: '600' }}>
                  Already have an account? <Text style={{ color: '#163316', fontWeight: '800' }}>Sign In</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
