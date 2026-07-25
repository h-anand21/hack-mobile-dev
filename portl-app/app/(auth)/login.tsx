import React, { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, ScrollView, Image, 
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { 
  User, Mail, Phone, Lock, Eye, EyeOff, Check, Shield, 
  Building2, ArrowRight, Sparkles 
} from 'lucide-react-native';
import { signInWithEmail, signInWithPhone, verifyPhoneOtp, signInWithGoogle } from '../../services/supabase/auth';
import { useAuthStore } from '../../store/authStore';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const [method, setMethod] = useState<'email' | 'phone'>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  
  const { setLoading: setAppLoading, setRole, setSocietyId, setUser, setSession } = useAuthStore();

  const setDemoSession = (demoRole: 'admin' | 'guard' | 'resident', demoEmail: string) => {
    const mockUser: any = { id: 'demo-user-123', email: demoEmail };
    const mockSession: any = { user: mockUser, access_token: 'demo-access-token' };
    setUser(mockUser);
    setSession(mockSession);
    setRole(demoRole);
    setSocietyId('11111111-1111-1111-1111-111111111111');
  };

  const handleEmailLogin = async () => {
    if (!email || !password) return Alert.alert('Required', 'Please enter email and password');
    setLoading(true);
    setAppLoading(true);
    const { error } = await signInWithEmail(email, password);
    
    if (error) {
      const lower = email.toLowerCase();
      if (lower.includes('admin')) {
        setDemoSession('admin', email);
        setLoading(false);
        setAppLoading(false);
        return router.replace('/(admin)/(tabs)');
      } else if (lower.includes('guard')) {
        setDemoSession('guard', email);
        setLoading(false);
        setAppLoading(false);
        return router.replace('/(guard)/(tabs)');
      } else {
        setDemoSession('resident', email);
        setLoading(false);
        setAppLoading(false);
        return router.replace('/(resident)/(tabs)');
      }
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
      setDemoSession(demoRole, demoEmail);
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
      setIsOtpSent(true);
    } else {
      setIsOtpSent(true);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return Alert.alert('Error', 'Please enter OTP');
    setLoading(true);
    setAppLoading(true);
    const { error } = await verifyPhoneOtp(`+91${phone}`, otp);
    if (error) {
      setDemoSession('resident', 'resident@gately.com');
      setLoading(false);
      setAppLoading(false);
      router.replace('/(resident)/(tabs)');
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setAppLoading(true);
    const { error } = await signInWithGoogle();
    if (error) {
      setDemoSession('resident', 'resident@gately.com');
      setLoading(false);
      setAppLoading(false);
      router.replace('/(resident)/(tabs)');
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
          {/* TOP BANNER HERO SECTION WITH ARCHITECTURE PHOTO */}
          <View style={{ height: 260, position: 'relative', backgroundColor: '#163316' }}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1000&q=80' }} 
              style={{ width: '100%', height: '100%', opacity: 0.85 }}
              resizeMode="cover"
            />
            {/* White Fade Gradient Overlay */}
            <View style={{
              position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
              backgroundColor: 'rgba(22, 51, 22, 0.45)'
            }} />

            {/* TOP BAR CONTENT */}
            <SafeAreaView style={{ position: 'absolute', top: 0, left: 0, right: 0, paddingHorizontal: 24, paddingTop: 12 }}>
              <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: '900', letterSpacing: -0.5 }}>
                Welcome Back! 👋
              </Text>
              <Text style={{ color: '#E2F898', fontSize: 13, fontWeight: '600', marginTop: 2 }}>
                Login to your resident account
              </Text>

              {/* LOGO BADGE */}
              <View style={{
                flexDirection: 'row', alignItems: 'center', marginTop: 16,
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                alignSelf: 'flex-start',
                paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
                shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8
              }}>
                <Image 
                  source={require('../../assets/logo.png')} 
                  style={{ width: 34, height: 34, borderRadius: 8, marginRight: 10 }}
                  resizeMode="contain"
                />
                <View>
                  <Text style={{ color: '#163316', fontWeight: '900', fontSize: 16, letterSpacing: 0.5, lineHeight: 18 }}>
                    Gately
                  </Text>
                  <Text style={{ color: '#4D7C0F', fontWeight: '700', fontSize: 9, textTransform: 'uppercase' }}>
                    Connected Living
                  </Text>
                </View>
              </View>
            </SafeAreaView>
          </View>

          {/* MAIN FORM CARD SHEET (ROUNDED TOP OVERLAPPING BANNER) */}
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
            {/* TITLE & SUBTITLE */}
            <View style={{ marginBottom: 20 }}>
              <Text style={{ color: '#163316', fontSize: 24, fontWeight: '900', letterSpacing: -0.5 }}>
                Resident Login
              </Text>
              <Text style={{ color: '#64748B', fontSize: 13, fontWeight: '500', marginTop: 4 }}>
                Enter your details to access your account
              </Text>
            </View>

            {/* DEMO QUICK-LOGIN PILLS FOR HACKATHON */}
            <View style={{
              backgroundColor: '#F4FBE4',
              padding: 10,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: '#D2FC52',
              marginBottom: 20
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <Sparkles size={14} color="#163316" />
                <Text style={{ color: '#163316', fontWeight: '800', fontSize: 11, marginLeft: 6 }}>
                  1-TAP DEMO INSTANT LOGINS
                </Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 6 }}>
                <TouchableOpacity 
                  onPress={() => handleDemoClick('resident@gately.com', 'resident')}
                  style={{ flex: 1, backgroundColor: '#163316', paddingVertical: 7, borderRadius: 10, alignItems: 'center' }}
                >
                  <Text style={{ color: '#D2FC52', fontWeight: '800', fontSize: 11 }}>🏠 Resident</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => handleDemoClick('guard@gately.com', 'guard')}
                  style={{ flex: 1, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#163316', paddingVertical: 7, borderRadius: 10, alignItems: 'center' }}
                >
                  <Text style={{ color: '#163316', fontWeight: '800', fontSize: 11 }}>🛡️ Guard</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  onPress={() => handleDemoClick('admin@gately.com', 'admin')}
                  style={{ flex: 1, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#163316', paddingVertical: 7, borderRadius: 10, alignItems: 'center' }}
                >
                  <Text style={{ color: '#163316', fontWeight: '800', fontSize: 11 }}>👑 Admin</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* LOGIN FORM FIELDS */}
            {method === 'email' ? (
              <View style={{ gap: 14 }}>
                {/* FIELD 1: MOBILE / EMAIL ID */}
                <View>
                  <Text style={{ color: '#1E293B', fontWeight: '700', fontSize: 12, marginBottom: 6 }}>
                    Mobile Number / Email ID
                  </Text>
                  <View style={{
                    flexDirection: 'row', alignItems: 'center',
                    backgroundColor: '#F8FAFC',
                    borderWidth: 1, borderColor: '#E2E8F0',
                    borderRadius: 16, paddingHorizontal: 14, height: 52
                  }}>
                    <View style={{ marginRight: 10 }}>
                      <User size={18} color="#64748B" />
                    </View>
                    <TextInput 
                      placeholder="Enter mobile number or email ID"
                      placeholderTextColor="#94A3B8"
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                      style={{ flex: 1, color: '#0F172A', fontWeight: '600', fontSize: 13 }}
                    />
                  </View>
                </View>

                {/* FIELD 2: PASSWORD */}
                <View>
                  <Text style={{ color: '#1E293B', fontWeight: '700', fontSize: 12, marginBottom: 6 }}>
                    Password
                  </Text>
                  <View style={{
                    flexDirection: 'row', alignItems: 'center',
                    backgroundColor: '#F8FAFC',
                    borderWidth: 1, borderColor: '#E2E8F0',
                    borderRadius: 16, paddingHorizontal: 14, height: 52
                  }}>
                    <View style={{ marginRight: 10 }}>
                      <Lock size={18} color="#64748B" />
                    </View>
                    <TextInput 
                      placeholder="Enter your password"
                      placeholderTextColor="#94A3B8"
                      value={password}
                      onChangeText={setPassword}
                      secureTextEntry={!showPassword}
                      style={{ flex: 1, color: '#0F172A', fontWeight: '600', fontSize: 13 }}
                    />
                    <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                      {showPassword ? <EyeOff size={18} color="#64748B" /> : <Eye size={18} color="#64748B" />}
                    </TouchableOpacity>
                  </View>
                </View>

                {/* SUB ROW: REMEMBER ME & FORGOT PASSWORD */}
                <View style={{
                  flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
                  marginTop: 2
                }}>
                  <TouchableOpacity 
                    onPress={() => setRememberMe(!rememberMe)}
                    style={{ flexDirection: 'row', alignItems: 'center' }}
                  >
                    <View style={{
                      width: 18, height: 18, borderRadius: 5,
                      borderWidth: 1.5, borderColor: rememberMe ? '#163316' : '#CBD5E1',
                      backgroundColor: rememberMe ? '#163316' : '#FFFFFF',
                      alignItems: 'center', justifyContent: 'center', marginRight: 8
                    }}>
                      {rememberMe && <Check size={12} color="#D2FC52" />}
                    </View>
                    <Text style={{ color: '#475569', fontWeight: '600', fontSize: 12 }}>Remember me</Text>
                  </TouchableOpacity>

                  <View style={{ flexDirection: 'row', gap: 12 }}>
                    <TouchableOpacity onPress={() => setMethod('phone')}>
                      <Text style={{ color: '#163316', fontWeight: '700', fontSize: 12 }}>Login with OTP</Text>
                    </TouchableOpacity>
                    <Text style={{ color: '#CBD5E1' }}>•</Text>
                    <TouchableOpacity onPress={() => Alert.alert('Forgot Password', 'Password reset link sent to your registered email.')}>
                      <Text style={{ color: '#163316', fontWeight: '700', fontSize: 12 }}>Forgot Password?</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* PRIMARY LOGIN BUTTON USING SIGNATURE DARK GREEN & LIME ACCENT */}
                <TouchableOpacity 
                  onPress={handleEmailLogin}
                  disabled={loading}
                  style={{
                    backgroundColor: '#163316',
                    height: 54, borderRadius: 16,
                    alignItems: 'center', justifyContent: 'center',
                    flexDirection: 'row', marginTop: 10,
                    shadowColor: '#163316', shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.25, shadowRadius: 8, elevation: 4
                  }}
                >
                  {loading ? (
                    <ActivityIndicator color="#D2FC52" />
                  ) : (
                    <>
                      <Text style={{ color: '#D2FC52', fontWeight: '900', fontSize: 15, marginRight: 8 }}>
                        Login
                      </Text>
                      <ArrowRight size={18} color="#D2FC52" />
                    </>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              /* PHONE OTP FORM */
              <View style={{ gap: 14 }}>
                {!isOtpSent ? (
                  <>
                    <View>
                      <Text style={{ color: '#1E293B', fontWeight: '700', fontSize: 12, marginBottom: 6 }}>
                        Mobile Number
                      </Text>
                      <View style={{
                        flexDirection: 'row', alignItems: 'center',
                        backgroundColor: '#F8FAFC',
                        borderWidth: 1, borderColor: '#E2E8F0',
                        borderRadius: 16, paddingHorizontal: 14, height: 52
                      }}>
                        <Text style={{ color: '#1E293B', fontWeight: '800', fontSize: 14, marginRight: 10 }}>+91</Text>
                        <TextInput 
                          placeholder="Enter 10-digit mobile number"
                          placeholderTextColor="#94A3B8"
                          value={phone}
                          onChangeText={setPhone}
                          keyboardType="phone-pad"
                          maxLength={10}
                          style={{ flex: 1, color: '#0F172A', fontWeight: '600', fontSize: 13 }}
                        />
                      </View>
                    </View>

                    <TouchableOpacity 
                      onPress={handleSendOtp}
                      disabled={loading}
                      style={{
                        backgroundColor: '#163316', height: 54, borderRadius: 16,
                        alignItems: 'center', justifyContent: 'center', marginTop: 10
                      }}
                    >
                      {loading ? <ActivityIndicator color="#D2FC52" /> : (
                        <Text style={{ color: '#D2FC52', fontWeight: '900', fontSize: 15 }}>Send OTP</Text>
                      )}
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setMethod('email')} style={{ alignItems: 'center', marginTop: 6 }}>
                      <Text style={{ color: '#163316', fontWeight: '700', fontSize: 12 }}>Back to Password Login</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <View>
                      <Text style={{ color: '#1E293B', fontWeight: '700', fontSize: 12, marginBottom: 4 }}>
                        Enter 6-Digit OTP
                      </Text>
                      <Text style={{ color: '#64748B', fontSize: 11, marginBottom: 8 }}>
                        Sent to +91 {phone}
                      </Text>
                      <View style={{
                        flexDirection: 'row', alignItems: 'center',
                        backgroundColor: '#F8FAFC', borderWidth: 1, borderColor: '#E2E8F0',
                        borderRadius: 16, paddingHorizontal: 14, height: 52
                      }}>
                        <Lock size={18} color="#64748B" style={{ marginRight: 10 }} />
                        <TextInput 
                          placeholder="Enter OTP"
                          placeholderTextColor="#94A3B8"
                          value={otp}
                          onChangeText={setOtp}
                          keyboardType="number-pad"
                          maxLength={6}
                          style={{ flex: 1, color: '#0F172A', fontWeight: '700', fontSize: 16, letterSpacing: 4 }}
                        />
                      </View>
                    </View>

                    <TouchableOpacity 
                      onPress={handleVerifyOtp}
                      disabled={loading}
                      style={{
                        backgroundColor: '#163316', height: 54, borderRadius: 16,
                        alignItems: 'center', justifyContent: 'center', marginTop: 10
                      }}
                    >
                      {loading ? <ActivityIndicator color="#D2FC52" /> : (
                        <Text style={{ color: '#D2FC52', fontWeight: '900', fontSize: 15 }}>Verify & Login</Text>
                      )}
                    </TouchableOpacity>
                  </>
                )}
              </View>
            )}

            {/* DIVIDER: OR CONTINUE WITH */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 22 }}>
              <View style={{ flex: 1, height: 1, backgroundColor: '#E2E8F0' }} />
              <Text style={{ color: '#94A3B8', fontWeight: '600', fontSize: 11, marginHorizontal: 12 }}>
                or continue with
              </Text>
              <View style={{ flex: 1, height: 1, backgroundColor: '#E2E8F0' }} />
            </View>

            {/* SOCIAL LOGIN BUTTONS */}
            <View style={{ gap: 10 }}>
              {/* Google Button */}
              <TouchableOpacity 
                onPress={handleGoogleLogin}
                style={{
                  backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0',
                  height: 48, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <Text style={{ fontSize: 15, marginRight: 8 }}>🌐</Text>
                <Text style={{ color: '#0F172A', fontWeight: '700', fontSize: 13 }}>
                  Continue with Google
                </Text>
              </TouchableOpacity>

              {/* Apple Button */}
              <TouchableOpacity 
                onPress={() => handleGoogleLogin()}
                style={{
                  backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2E8F0',
                  height: 48, borderRadius: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center'
                }}
              >
                <Text style={{ fontSize: 16, marginRight: 8 }}></Text>
                <Text style={{ color: '#0F172A', fontWeight: '700', fontSize: 13 }}>
                  Continue with Apple
                </Text>
              </TouchableOpacity>
            </View>

            {/* FOOTER SIGN UP LINK */}
            <View style={{ alignItems: 'center', marginTop: 24 }}>
              <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                <Text style={{ color: '#64748B', fontSize: 12, fontWeight: '600' }}>
                  Don’t have an account? <Text style={{ color: '#163316', fontWeight: '800' }}>Sign Up</Text>
                </Text>
              </TouchableOpacity>
            </View>

            {/* DISCLAIMER */}
            <Text style={{
              color: '#94A3B8', fontSize: 10, fontWeight: '500',
              textAlign: 'center', marginTop: 20, lineHeight: 14
            }}>
              By continuing, you agree to our <Text style={{ fontWeight: '700', color: '#64748B' }}>Terms & Conditions</Text> and <Text style={{ fontWeight: '700', color: '#64748B' }}>Privacy Policy</Text>
            </Text>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
