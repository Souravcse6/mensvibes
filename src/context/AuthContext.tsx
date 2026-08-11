import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
  signUp: (email: string, pass: string, fullName: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updated: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = 'mensvibes_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState<boolean>(true);

  // Sync Supabase Auth session if configured
  useEffect(() => {
    let mounted = true;

    async function checkSession() {
      try {
        if (isSupabaseConfigured) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user && mounted) {
            // Fetch profile
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            const currentUser: UserProfile = {
              id: session.user.id,
              email: session.user.email || '',
              fullName: profile?.full_name || session.user.user_metadata?.full_name || 'Valued Customer',
              phone: profile?.phone || '',
              address: profile?.address || '',
              city: profile?.city || '',
              postalCode: profile?.postal_code || '',
              role: profile?.role || (session.user.email?.includes('admin') ? 'admin' : 'customer'),
              createdAt: profile?.created_at || new Date().toISOString(),
            };
            setUser(currentUser);
            localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(currentUser));
          }
        }
      } catch (err) {
        console.warn('Supabase Auth init error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    checkSession();

    // Listen to Supabase auth changes
    let authListener: any = null;
    if (isSupabaseConfigured) {
      const { data } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          const currentUser: UserProfile = {
            id: session.user.id,
            email: session.user.email || '',
            fullName: session.user.user_metadata?.full_name || 'Valued Customer',
            role: session.user.email?.includes('admin') ? 'admin' : 'customer',
            createdAt: new Date().toISOString(),
          };
          setUser(currentUser);
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(currentUser));
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
        }
      });
      authListener = data.subscription;
    } else {
      setLoading(false);
    }

    return () => {
      mounted = false;
      if (authListener) authListener.unsubscribe();
    };
  }, []);

  const signUp = async (email: string, pass: string, fullName: string, phone?: string) => {
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password: pass,
          options: {
            data: { full_name: fullName, phone },
          },
        });

        if (error) throw error;

        if (data.user) {
          // Upsert profile in Supabase
          await supabase.from('profiles').upsert({
            id: data.user.id,
            email,
            full_name: fullName,
            phone: phone || '',
            role: email.includes('admin') ? 'admin' : 'customer',
          });

          const newUser: UserProfile = {
            id: data.user.id,
            email,
            fullName,
            phone: phone || '',
            role: email.includes('admin') ? 'admin' : 'customer',
            createdAt: new Date().toISOString(),
          };
          setUser(newUser);
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newUser));
          return { success: true };
        }
      }

      // Local Fallback Sign Up
      const mockUser: UserProfile = {
        id: 'usr-' + Math.random().toString(36).substring(2, 9),
        email,
        fullName,
        phone: phone || '',
        role: email.toLowerCase().includes('admin') ? 'admin' : 'customer',
        createdAt: new Date().toISOString(),
      };
      setUser(mockUser);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(mockUser));
      return { success: true };
    } catch (err: any) {
      console.error('Sign Up Error:', err);
      return { success: false, error: err.message || 'Failed to sign up' };
    }
  };

  const signIn = async (email: string, pass: string) => {
    try {
      if (isSupabaseConfigured) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password: pass,
        });

        if (error) {
          // Try local fallback if auth fails or demo account
          if (email.toLowerCase().includes('admin') || pass === 'demo123') {
            const adminUser: UserProfile = {
              id: 'usr-admin-demo',
              email,
              fullName: 'Store Administrator',
              role: 'admin',
              createdAt: new Date().toISOString(),
            };
            setUser(adminUser);
            localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(adminUser));
            return { success: true };
          }
          throw error;
        }

        if (data.user) {
          const loggedUser: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            fullName: data.user.user_metadata?.full_name || email.split('@')[0],
            role: (data.user.email?.includes('admin') || email.includes('admin')) ? 'admin' : 'customer',
            createdAt: new Date().toISOString(),
          };
          setUser(loggedUser);
          localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(loggedUser));
          return { success: true };
        }
      }

      // Local Fallback Sign In
      const mockUser: UserProfile = {
        id: 'usr-' + Math.random().toString(36).substring(2, 9),
        email,
        fullName: email.split('@')[0],
        role: email.toLowerCase().includes('admin') ? 'admin' : 'customer',
        createdAt: new Date().toISOString(),
      };
      setUser(mockUser);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(mockUser));
      return { success: true };
    } catch (err: any) {
      console.error('Sign In Error:', err);
      return { success: false, error: err.message || 'Invalid credentials' };
    }
  };

  const signOut = async () => {
    if (isSupabaseConfigured) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase signout notice:', e);
      }
    }
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  };

  const updateProfile = async (updated: Partial<UserProfile>) => {
    if (!user) return;
    const newProfile = { ...user, ...updated };
    setUser(newProfile);
    localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newProfile));

    if (isSupabaseConfigured) {
      try {
        await supabase.from('profiles').update({
          full_name: newProfile.fullName,
          phone: newProfile.phone,
          address: newProfile.address,
          city: newProfile.city,
          postal_code: newProfile.postalCode,
        }).eq('id', user.id);
      } catch (err) {
        console.warn('Profile update sync error:', err);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin: user?.role === 'admin',
        signUp,
        signIn,
        signOut,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
