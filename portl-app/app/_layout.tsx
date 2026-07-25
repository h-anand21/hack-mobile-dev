import { useEffect, useState } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../services/supabase/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Constants from 'expo-constants';
import '../app/global.css';

SplashScreen.preventAutoHideAsync();

const isExpoGo = Constants.appOwnership === 'expo';
if (!isExpoGo) {
  const Notifications = require('expo-notifications');
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

const queryClient = new QueryClient();

export default function RootLayout() {
  const [isMounted, setIsMounted] = useState(false);
  const [fontsLoaded] = useFonts({
    // Add custom fonts here if needed
  });

  const { setSession, setUser, setRole, setSocietyId, setLoading, isLoading, session, role } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  // Track component mount status
  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  // Handle auth state changes
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setRole(null);
        setSocietyId(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('role, society_id')
        .eq('id', userId)
        .single();
        
      if (!error && data?.role) {
        setRole(data.role as any);
        setSocietyId(data.society_id);
      } else {
        const { data: userData } = await supabase.auth.getUser();
        const email = userData?.user?.email?.toLowerCase() || '';
        if (email.includes('admin')) setRole('admin');
        else if (email.includes('guard')) setRole('guard');
        else setRole('resident');
        setSocietyId('11111111-1111-1111-1111-111111111111');
      }
    } catch (err) {
      console.error('Error fetching role:', err);
      setRole('resident');
    } finally {
      setLoading(false);
    }
  };

  // Safe router navigation only after component is fully mounted
  useEffect(() => {
    if (!isMounted || isLoading || !fontsLoaded) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inResidentGroup = segments[0] === '(resident)';
    const inGuardGroup = segments[0] === '(guard)';
    const inAdminGroup = segments[0] === '(admin)';
    
    if (!segments || segments.length === 0) return;

    const isAuthenticated = !!(session || role);

    const timer = setTimeout(() => {
      if (!isAuthenticated && !inAuthGroup && segments[0] !== '') {
        router.replace('/(auth)/login');
      } else if (isAuthenticated && role) {
        if (role === 'resident' && !inResidentGroup) {
          router.replace('/(resident)/(tabs)');
        } else if (role === 'guard' && !inGuardGroup) {
          router.replace('/(guard)/(tabs)');
        } else if (role === 'admin' && !inAdminGroup) {
          router.replace('/(admin)/(tabs)');
        }
      }
    }, 0);

    return () => clearTimeout(timer);
  }, [isMounted, session, isLoading, segments, fontsLoaded, role]);

  useEffect(() => {
    if (fontsLoaded && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isLoading]);

  if (!fontsLoaded) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <StatusBar style="auto" />
        <Slot />
      </GestureHandlerRootView>
    </QueryClientProvider>
  );
}
