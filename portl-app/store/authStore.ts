import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';

type Role = 'admin' | 'guard' | 'resident' | null;

interface AuthState {
  user: User | null;
  session: Session | null;
  role: Role;
  societyId: string | null;
  isLoading: boolean;
  
  // Actions
  setSession: (session: Session | null) => void;
  setUser: (user: User | null) => void;
  setRole: (role: Role) => void;
  setSocietyId: (societyId: string | null) => void;
  setLoading: (isLoading: boolean) => void;
  signOut: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  session: null,
  role: null,
  societyId: null,
  isLoading: true,
  
  setSession: (session) => set({ session }),
  setUser: (user) => set({ user }),
  setRole: (role) => set({ role }),
  setSocietyId: (societyId) => set({ societyId }),
  setLoading: (isLoading) => set({ isLoading }),
  
  signOut: () => set({ 
    user: null, 
    session: null, 
    role: null, 
    societyId: null 
  }),
}));
