import { supabase } from './client';
import * as Linking from 'expo-linking';

// Initiate OTP sign in
export const signInWithPhone = async (phone: string) => {
  const { data, error } = await supabase.auth.signInWithOtp({
    phone,
  });
  return { data, error };
};

// Verify OTP
export const verifyPhoneOtp = async (phone: string, token: string) => {
  const { data, error } = await supabase.auth.verifyOtp({
    phone,
    token,
    type: 'sms',
  });
  return { data, error };
};

// Sign Up with Email and create user profile record
export const signUpWithEmail = async (
  email: string,
  password: string,
  name: string,
  role: 'resident' | 'guard' | 'admin',
  phone?: string
) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, role }
    }
  });

  if (error) return { data: null, error };

  if (data?.user) {
    const { error: profileErr } = await supabase
      .from('users')
      .upsert({
        id: data.user.id,
        name,
        role,
        phone: phone || null,
        society_id: '11111111-1111-1111-1111-111111111111'
      });
    if (profileErr) console.error('Profile creation error:', profileErr.message);
  }

  return { data, error: null };
};

// Initiate email sign in (for admin/demo purposes if needed)
export const signInWithEmail = async (email: string, password?: string) => {
  if (password) {
    return supabase.auth.signInWithPassword({ email, password });
  }
  return supabase.auth.signInWithOtp({ email });
};

// Verify Email OTP
export const verifyEmailOtp = async (email: string, token: string) => {
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  });
  return { data, error };
};

import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

// Sign in with Google (OAuth)
export const signInWithGoogle = async () => {
  try {
    const redirectUrl = Linking.createURL('/(auth)/callback');
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        skipBrowserRedirect: true,
      },
    });

    if (error) return { data: null, error };

    if (data?.url) {
      const res = await WebBrowser.openAuthSessionAsync(data.url, redirectUrl);
      if (res.type === 'success' && res.url) {
        const createSessionFromUrl = async (url: string) => {
          const { params, errorCode } = Linking.parse(url);
          if (errorCode) throw new Error(errorCode);
          const { access_token, refresh_token } = params;
          if (access_token && refresh_token) {
            return await supabase.auth.setSession({
              access_token: access_token as string,
              refresh_token: refresh_token as string,
            });
          }
        };
        await createSessionFromUrl(res.url);
      }
    }
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err };
  }
};

// Logout
export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};
