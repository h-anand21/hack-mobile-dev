import { useEffect, useState } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Notifications from 'expo-notifications';
import { useAuthStore } from '../store/authStore';
import { supabase } from '../services/supabase/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import '../app/global.css'; // NativeWind CSS

// Keep splash screen visible while loading resources
SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    // Will add Inter/Outfit fonts later if needed
  });

  const { setSession, setUser, setRole, setSocietyId, setLoading, isLoading, session, role } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  // Handle auth state changes
  useEffect(() => {
    // Initial session fetch
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
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
        
      if (!error && data) {
        setRole(data.role as any);
        setSocietyId(data.society_id);
      }
    } catch (err) {
      console.error('Error fetching role:', err);
    } finally {
      setLoading(false);
    }
  };

  // Handle routing based on auth state
  useEffect(() => {
    if (isLoading || !fontsLoaded) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inResidentGroup = segments[0] === '(resident)';
    const inGuardGroup = segments[0] === '(guard)';
    
    // Default to onboarding/splash if on root
    if (segments.length === 0) return;

    if (!session && !inAuthGroup && segments[0] !== '') {
      // Redirect to login if not authenticated and not in auth/onboarding
      router.replace('/(auth)/login');
    } else if (session && role) {
      // Redirect authenticated users to their respective dashboards
      if (role === 'resident' && !inResidentGroup) {
        router.replace('/(resident)/(tabs)');
      } else if (role === 'guard' && !inGuardGroup) {
        router.replace('/(guard)/(tabs)');
      }
      // TODO: Admin routing
    }
  }, [session, isLoading, segments, fontsLoaded, role]);

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
