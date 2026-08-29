import https from 'https';
import fs from 'fs';
import path from 'path';

const PROJECT_REF = 'mwoukwlfbbelsubebnrt';
const ACCESS_TOKEN = 'sbp_v0_13f88a10cafa7c9a41f34fe1931055820a77ac31';

function apiRequest(endpoint, method = 'GET', body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.supabase.com',
      path: endpoint,
      method: method,
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'BoxifyX-Setup/1.0',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function main() {
  console.log('🚀 Bắt đầu tự động cấu hình Supabase cho BoxifyX (Project:', PROJECT_REF, ')...');

  // 1. Fetch API Keys
  console.log('🔑 Đang lấy API Keys (Anon Key)...');
  const apiKeysRes = await apiRequest(`/v1/projects/${PROJECT_REF}/api-keys`);
  
  let anonKey = '';
  let serviceRoleKey = '';

  if (apiKeysRes.status === 200 && Array.isArray(apiKeysRes.data)) {
    for (const key of apiKeysRes.data) {
      if (key.name === 'anon') anonKey = key.api_key;
      if (key.name === 'service_role') serviceRoleKey = key.api_key;
    }
  }

  if (anonKey) {
    console.log('✅ Đã lấy được Anon Key thành công!');
    const envContent = `VITE_SUPABASE_URL=https://${PROJECT_REF}.supabase.co\nVITE_SUPABASE_ANON_KEY=${anonKey}\n`;
    fs.writeFileSync(path.resolve(process.cwd(), '.env'), envContent, 'utf8');
    console.log('✅ Đã cập nhật file .env với Anon Key thực tế.');
  } else {
    console.log('⚠️ Không tìm thấy Anon key tự động, kết quả:', apiKeysRes);
  }

  // 2. Execute SQL Schema & Seed
  console.log('📦 Đang tự động chạy SQL Schema và khởi tạo bảng...');
  const schemaSql = fs.readFileSync(path.resolve(process.cwd(), 'supabase/schema.sql'), 'utf8');
  const seedSql = fs.readFileSync(path.resolve(process.cwd(), 'supabase/seed.sql'), 'utf8');
  const fullSql = `${schemaSql}\n\n${seedSql}`;

  const queryRes = await apiRequest(`/v1/projects/${PROJECT_REF}/database/query`, 'POST', {
    query: fullSql,
  });

  if (queryRes.status === 200 || queryRes.status === 201) {
    console.log('🎉 TẠO BẢNG & NẠP DỮ LIỆU THÀNH CÔNG VÀO SUPABASE!');
  } else {
    console.log('Query Status:', queryRes.status, queryRes.data || queryRes.raw);
  }
}

main().catch(console.error);
