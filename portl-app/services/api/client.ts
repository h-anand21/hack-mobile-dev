import axios from 'axios';
import { supabase } from '../supabase/client';
import Constants from 'expo-constants';

// Auto-detect host PC IP address for Expo Go mobile connections
let defaultHost = 'localhost';
const hostUri = Constants.expoConfig?.hostUri || Constants.experienceUrl;
if (hostUri) {
  const ip = hostUri.split(':')[0];
  if (ip && ip !== 'localhost' && ip !== '127.0.0.1') {
    defaultHost = ip;
  }
}

let baseUrl = process.env.EXPO_PUBLIC_API_BASE_URL || process.env.EXPO_PUBLIC_API_URL || `http://${defaultHost}:3000`;
if (defaultHost !== 'localhost' && baseUrl.includes('localhost')) {
  baseUrl = baseUrl.replace('localhost', defaultHost);
}

export const apiClient = axios.create({
  baseURL: baseUrl,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to automatically add Supabase JWT
apiClient.interceptors.request.use(
  async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    } else {
      // Fallback demo header for unauthenticated / hackathon demo mode
      config.headers.Authorization = `Bearer demo-hackathon-token-12345`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling without red overlay spam on demo fallbacks
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Graceful log for demo mode fallbacks (avoid console.error red overlay popup)
    if (__DEV__) {
      console.log('ℹ️ API Notice (using fallback dataset):', error.response?.data?.error || error.message);
    }
    return Promise.reject(error);
  }
);
