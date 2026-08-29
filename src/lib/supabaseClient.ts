import { createClient } from '@supabase/supabase-js';

// Khởi tạo Supabase client với endpoint chính thức của BoxifyX
const DEFAULT_SUPABASE_URL = 'https://mwoukwlfbbelsubebnrt.supabase.co';
const DEFAULT_SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13b3Vrd2xmYmJlbHN1YmVibnJ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc5NzE5MjYsImV4cCI6MjEwMzU0NzkyNn0.idtPp2FVkyjdc6SIYhrmb6m6j0BvjEZmLTW-N4xAil0';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || DEFAULT_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || DEFAULT_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
