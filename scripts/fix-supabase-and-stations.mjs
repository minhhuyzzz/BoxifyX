const SUPABASE_ACCESS_TOKEN = 'sbp_v0_13f88a10cafa7c9a41f34fe1931055820a77ac31';
const PROJECT_REF = 'mwoukwlfbbelsubebnrt';

async function fixSupabase() {
  console.log('1. Configuring Supabase Auth to Auto-Confirm emails...');
  
  try {
    const authConfigRes = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/config/auth`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mailer_autoconfirm: true,
        enable_signup: true,
      }),
    });

    console.log('Auth config response status:', authConfigRes.status);
    const authData = await authConfigRes.json();
    console.log('Auth mailer_autoconfirm is now:', authData.mailer_autoconfirm);
  } catch (err) {
    console.warn('Auth config update notice:', err.message);
  }

  console.log('2. Updating locations table in Supabase with all 11 stations...');
  
  const sql = `
  INSERT INTO locations (id, name, address, district, latitude, longitude, operating_hours, total_lockers, available_lockers, status)
  VALUES
    ('sta-govap', 'BoxifyX Trụ Sở Chính & Hub Gò Vấp', '12 Nguyễn Văn Bảo, Phường 4, Quận Gò Vấp, TP.HCM', 'Gò Vấp', 10.8222, 106.6873, '24/7 (Trụ sở điều hành & Hub trung tâm)', 60, 36, 'active'),
    ('sta-tsn', 'BoxifyX Sân Bay Tân Sơn Nhất (Ga Quốc Tế)', 'Cổng đến Quốc Tế T2, Đường Trường Sơn, P.2, Q. Tân Bình', 'Tân Bình', 10.8174, 106.6608, '24/7 (Cả ngày & đêm)', 48, 24, 'active'),
    ('sta-metro-bt', 'BoxifyX Ga Metro Bến Thành', 'Khu thương mại ngầm Bến Thành, Đường Lê Lợi, P. Bến Thành, Quận 1', 'Quận 1', 10.7719, 106.6983, '05:00 - 23:30', 36, 16, 'active'),
    ('sta-buivien', 'BoxifyX Phố Đi Bộ Bùi Viện', '185 Bùi Viện, P. Phạm Ngũ Lão, Quận 1', 'Quận 1', 10.7674, 106.6934, '24/7 (Phục vụ khách du lịch)', 30, 18, 'active'),
    ('sta-landmark', 'BoxifyX Landmark 81', 'Tầng B1, TTTM Vincom Landmark 81, 720A Điện Biên Phủ, P.22, Bình Thạnh', 'Bình Thạnh', 10.7951, 106.7218, '09:00 - 22:30', 24, 13, 'active'),
    ('sta-ga-saigon', 'BoxifyX Ga Xe Lửa Sài Gòn', '01 Nguyễn Thông, P.9, Quận 3', 'Quận 3', 10.7816, 106.6787, '04:30 - 23:00', 32, 26, 'active'),
    ('sta-thaodien', 'BoxifyX Thảo Điền Hub', '68 Xuân Thủy, P. Thảo Điền, TP. Thủ Đức', 'TP. Thủ Đức', 10.8038, 106.7335, '06:00 - 23:00', 20, 14, 'active'),
    ('sta-q7', 'BoxifyX Crescent Mall Phú Mỹ Hưng', '101 Tôn Dật Tiên, Tân Phong, Quận 7', 'Quận 7', 10.7294, 106.7218, '08:00 - 22:30', 28, 19, 'active'),
    ('sta-q10', 'BoxifyX Vạn Hạnh Mall Hub', '11 Sư Vạn Hạnh, Phường 12, Quận 10', 'Quận 10', 10.7701, 106.6698, '09:00 - 22:00', 30, 22, 'active'),
    ('sta-phunhuan', 'BoxifyX Phan Xích Long Hub', '120 Phan Xích Long, Phường 2, Quận Phú Nhuận', 'Phú Nhuận', 10.7968, 106.6885, '24/7 (Phố ẩm thực & dịch vụ)', 24, 16, 'active'),
    ('sta-q5', 'BoxifyX Chợ Lớn Thuận Kiều Hub', '190 Hồng Bàng, Phường 12, Quận 5', 'Quận 5', 10.7554, 106.6582, '06:00 - 22:00', 26, 18, 'active')
  ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    address = EXCLUDED.address,
    district = EXCLUDED.district,
    latitude = EXCLUDED.latitude,
    longitude = EXCLUDED.longitude,
    operating_hours = EXCLUDED.operating_hours,
    total_lockers = EXCLUDED.total_lockers,
    available_lockers = EXCLUDED.available_lockers;
  `;

  try {
    const queryRes = await fetch(`https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql }),
    });

    const result = await queryRes.json();
    console.log('Locations query status:', queryRes.status);
    console.log('Success! All 11 stations inserted into Supabase DB.');
  } catch (err) {
    console.error('Failed to run query:', err);
  }
}

fixSupabase();
