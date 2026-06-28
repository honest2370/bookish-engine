import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { supabase } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface Profile {
  id: string;
  email: string;
  full_name: string;
  username: string;
  phone: string;
  country: string;
  avatar_url: string | null;
  bio: string | null;
  whatsapp: string | null;
  role: 'buyer' | 'seller' | 'admin';
}

interface AuthState {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  initialized: boolean;
  setUser: (user: User | null) => void;
  setProfile: (profile: Profile | null) => void;
  signOut: () => Promise<void>;
  initialize: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      profile: null,
      loading: true,
      initialized: false,

      setUser: (user) => set({ user }),
      
      setProfile: (profile) => set({ profile }),

      signOut: async () => {
        try {
          await supabase.auth.signOut();
          set({ user: null, profile: null });
          // Clear persisted state
          localStorage.removeItem('sellizi-auth');
          // Redirect to home
          window.location.href = '/';
        } catch (error) {
          console.error('Sign out error:', error);
        }
      },

      refreshProfile: async () => {
        const { user } = get();
        if (!user) return;

        try {
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .maybeSingle();

          if (error) {
            console.error('Error fetching profile:', error);
            return;
          }

          if (profile) {
            set({ profile });
          }
        } catch (error) {
          console.error('Profile refresh error:', error);
        }
      },

      initialize: async () => {
        try {
          // Get current session
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
          if (sessionError) {
            console.error('Session error:', sessionError);
            set({ loading: false, initialized: true });
            return;
          }

          if (session?.user) {
            set({ user: session.user });
            
            // Fetch or create profile
            let { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();

            // If profile doesn't exist, create it
            if (!profile && !profileError) {
              const emailPrefix = session.user.email?.split('@')[0] || 'user';
              const username = emailPrefix + Math.floor(Math.random() * 1000);

              const { data: newProfile, error: createError } = await supabase
                .from('profiles')
                .insert({
                  id: session.user.id,
                  email: session.user.email || '',
                  full_name: session.user.user_metadata?.full_name || emailPrefix,
                  username: username,
                  phone: session.user.user_metadata?.phone || '',
                  country: session.user.user_metadata?.country || '',
                  role: 'buyer',
                })
                .select()
                .single();

              if (!createError) {
                profile = newProfile;
              } else {
                console.error('Profile creation error:', createError);
              }
            }
            
            if (profile) {
              set({ profile });
            }
          }

          // Listen for auth changes
          supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state changed:', event);
            
            if (event === 'SIGNED_IN' && session?.user) {
              set({ user: session.user });
              get().refreshProfile();
            } else if (event === 'SIGNED_OUT') {
              set({ user: null, profile: null });
            }
          });

        } catch (error) {
          console.error('Auth initialization error:', error);
        } finally {
          set({ loading: false, initialized: true });
        }
      },
    }),
    {
      name: 'sellizi-auth',
      partialize: (state) => ({
        user: state.user,
        profile: state.profile,
      }),
    }
  )
);
