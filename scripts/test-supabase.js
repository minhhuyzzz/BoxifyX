import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Đọc file .env nếu có
const envPath = path.resolve(process.cwd(), '.env');
let supabaseUrl = process.env.VITE_SUPABASE_URL;
let supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  for (const line of envContent.split('\n')) {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const val = match[2].trim();
      if (key === 'VITE_SUPABASE_URL') supabaseUrl = val;
      if (key === 'VITE_SUPABASE_ANON_KEY') supabaseKey = val;
    }
  }
}

console.log('🔍 Kiểm tra kết nối Supabase...');
console.log('URL:', supabaseUrl);

if (!supabaseUrl || supabaseUrl.includes('your-project-id')) {
  console.log('⚠️ Chưa cấu hình VITE_SUPABASE_URL thực tế trong file .env');
  console.log('👉 Vui lòng dán Project URL và Anon Key từ Supabase Dashboard vào file .env');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    const { data, error } = await supabase.from('locations').select('*').limit(1);
    if (error) {
      if (error.code === '42P01') {
        console.log('⚠️ Đã kết nối Supabase thành công nhưng bảng "locations" chưa được tạo.');
        console.log('👉 Hãy chạy nội dung file supabase/schema.sql trong SQL Editor của Supabase!');
      } else {
        console.error('❌ Lỗi truy vấn:', error.message);
      }
    } else {
      console.log('✅ Kết nối Supabase thành công! Dữ liệu mẫu:', data);
    }
  } catch (err) {
    console.error('❌ Lỗi kết nối:', err);
  }
}

testConnection();
