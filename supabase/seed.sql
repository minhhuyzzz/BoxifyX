-- ====================================================
-- BOXIFYX SEED DATA (TP.HCM STATIONS & INITIAL ITEMS)
-- ====================================================

-- 1. Insert Central Warehouse & Smart Locker Hubs
INSERT INTO public.locations (code, name, address, district, latitude, longitude, location_type, operating_hours, total_lockers, tags, image_url)
VALUES
  (
    'LOC-WAREHOUSE-TB',
    'Kho Trung Tâm BoxifyX Tân Bình',
    'Khu Logistics Tân Bình, Đường Trường Chinh, Q. Tân Bình, TP.HCM',
    'Tân Bình',
    10.8231,
    106.6297,
    'central_warehouse',
    '24/7',
    0,
    ARRAY['Kho Tổng', 'Nhiệt độ 25°C', 'Bảo hiểm 100%'],
    'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80'
  ),
  (
    'LOC-TSN',
    'BoxifyX Sân Bay Tân Sơn Nhất (Ga Quốc Tế)',
    'Cổng đến Quốc Tế T2, Đường Trường Sơn, P.2, Q. Tân Bình',
    'Tân Bình',
    10.8174,
    106.6608,
    'smart_locker_hub',
    '24/7 (Cả ngày & đêm)',
    48,
    ARRAY['Sân bay', 'Có sạc điện thoại', 'Camera 24/7', 'Hỗ trợ P2P'],
    'https://images.unsplash.com/photo-1542296332-2e4473faf563?w=800&auto=format&fit=crop&q=80'
  ),
  (
    'LOC-METRO-BT',
    'BoxifyX Ga Metro Bến Thành',
    'Khu thương mại ngầm Bến Thành, Đường Lê Lợi, P. Bến Thành, Quận 1',
    'Quận 1',
    10.7719,
    106.6983,
    'smart_locker_hub',
    '05:00 - 23:30',
    36,
    ARRAY['Tuyến Metro Số 1', 'Trung tâm Q1', 'Mở bằng QR Code'],
    'https://images.unsplash.com/photo-1578575437130-527eed3abbec?w=800&auto=format&fit=crop&q=80'
  ),
  (
    'LOC-BUIVIEN',
    'BoxifyX Phố Đi Bộ Bùi Viện',
    '185 Bùi Viện, P. Phạm Ngũ Lão, Quận 1',
    'Quận 1',
    10.7674,
    106.6934,
    'smart_locker_hub',
    '24/7 (Phục vụ khách du lịch)',
    30,
    ARRAY['Phố Tây', 'Gần khách sạn', 'Thanh toán VietQR'],
    'https://images.unsplash.com/photo-1517404215738-15263e9f9178?w=800&auto=format&fit=crop&q=80'
  ),
  (
    'LOC-LANDMARK',
    'BoxifyX Landmark 81',
    'Tầng B1, TTTM Vincom Landmark 81, 720A Điện Biên Phủ, P.22, Bình Thạnh',
    'Bình Thạnh',
    10.7951,
    106.7218,
    'smart_locker_hub',
    '09:00 - 22:30',
    24,
    ARRAY['TTTM Cao cấp', 'Máy lạnh 24/7', 'Bảo hiểm đồ'],
    'https://images.unsplash.com/photo-1582650625119-3a31f8418ab9?w=800&auto=format&fit=crop&q=80'
  )
ON CONFLICT (code) DO NOTHING;

-- 2. Insert Sample Valet Storage Items (Digital Closet)
INSERT INTO public.valet_items (box_code, security_seal_number, item_type, title, description, category, warehouse_bin, image_url, status)
VALUES
  (
    'BX-STD-8891',
    'SEAL-HCM-9021',
    'standard_box_60x40x40',
    'Thùng Quần Áo Mùa Đông & Áo Dạ',
    '4 áo khoác dạ len, 2 khăn cashmere, giày boots cổ cao. Đã bọc túi hút chân không.',
    'Thời trang',
    'KHO1-A-03-S2',
    'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?w=800&auto=format&fit=crop&q=80',
    'in_storage'
  ),
  (
    'BX-STD-8892',
    'SEAL-HCM-9022',
    'standard_box_60x40x40',
    'Thùng Sách Quý & Hồ Sơ Đại Học',
    'Giáo trình tài chính, bộ truyện tranh sưu tầm bìa cứng, hồ sơ văn bằng.',
    'Sách & Tài liệu',
    'KHO1-B-01-S4',
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    'in_storage'
  ),
  (
    'BX-LRG-1044',
    'SEAL-HCM-9044',
    'large_oversized',
    'Bộ Dụng Cụ Cắm Trại & Lều 4 Người',
    'Lều Glamping chống nước, 2 ghế xếp dã ngoại, bàn nhôm du lịch, bếp ga mini.',
    'Thể thao & Du lịch',
    'KHO1-PALLET-08',
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=80',
    'in_storage'
  )
ON CONFLICT (box_code) DO NOTHING;
