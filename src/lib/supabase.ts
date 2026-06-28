import { createClient } from '@supabase/supabase-js';

// Supabase configuration - uses environment variables in production
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://gffzzhbvqorepaycpcqz.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmZnp6aGJ2cW9yZXBheWNwY3F6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI1NTY2NDksImV4cCI6MjA5ODEzMjY0OX0.whvGvJMzJ-JCV0fhE8xfb9mAO4JuWZgMEVydXvpPE7I';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storageKey: 'sellizi-auth',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Helper function to check if user is authenticated
export const isAuthenticated = async () => {
  const { data: { session } } = await supabase.auth.getSession();
  return !!session;
};

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
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
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
    };
  };
}
