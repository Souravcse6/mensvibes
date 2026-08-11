/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// User's provided Supabase Project Credentials
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://qvsowbbtycnrapxctnuh.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_CrW7m7ykfs2EYuASPp-PfA_mKuzRRug';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
