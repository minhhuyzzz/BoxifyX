import { createClient } from '@supabase/supabase-js';

// Khởi tạo Supabase client (sử dụng biến môi trường hoặc fallback demo)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo-boxifyx.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-anon-key-placeholder-for-client';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
