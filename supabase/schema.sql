-- ====================================================
-- BOXIFYX DATABASE SCHEMA (SUPABASE POSTGRESQL)
-- Version: 1.1.0
-- Created: 2026-08-29
-- ====================================================

-- 1. Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. PROFILES TABLE (Linked with Supabase Auth users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT UNIQUE NOT NULL,
    avatar_url TEXT,
    role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'driver', 'warehouse_staff', 'admin')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. LOCATIONS (Smart Locker Stations & Central Warehouses in TP.HCM)
CREATE TABLE IF NOT EXISTS public.locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    address TEXT NOT NULL,
    district TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    location_type TEXT NOT NULL CHECK (location_type IN ('smart_locker_hub', 'central_warehouse')),
    operating_hours TEXT DEFAULT '24/7',
    total_lockers INT DEFAULT 0,
    image_url TEXT,
    tags TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. LOCKER COMPARTMENTS
CREATE TABLE IF NOT EXISTS public.lockers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID NOT NULL REFERENCES public.locations(id) ON DELETE CASCADE,
    locker_number TEXT NOT NULL,
    size_type TEXT NOT NULL CHECK (size_type IN ('S', 'M', 'L')),
    status TEXT DEFAULT 'available' CHECK (status IN ('available', 'reserved', 'occupied', 'maintenance')),
    is_door_closed BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. LOCKER BOOKINGS
CREATE TABLE IF NOT EXISTS public.locker_bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_code TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES public.profiles(id),
    locker_id UUID NOT NULL REFERENCES public.lockers(id),
    start_time TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    estimated_end_time TIMESTAMPTZ NOT NULL,
    actual_end_time TIMESTAMPTZ,
    pin_code VARCHAR(6) NOT NULL,
    size_type TEXT NOT NULL,
    -- P2P Drop-off sharing
    is_p2p_enabled BOOLEAN DEFAULT FALSE,
    p2p_recipient_phone TEXT,
    p2p_recipient_name TEXT,
    p2p_pass_token TEXT UNIQUE,
    -- Pricing
    prepaid_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    overdue_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('pending_payment', 'active', 'overdue_pending_payment', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. VALET STORAGE ORDERS (2-Step Logistics)
CREATE TABLE IF NOT EXISTS public.valet_orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_code TEXT UNIQUE NOT NULL,
    user_id UUID REFERENCES public.profiles(id),
    warehouse_id UUID NOT NULL REFERENCES public.locations(id),
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    pickup_address TEXT NOT NULL,
    pickup_latitude DOUBLE PRECISION NOT NULL,
    pickup_longitude DOUBLE PRECISION NOT NULL,
    distance_km NUMERIC(6, 2) NOT NULL,
    standard_boxes_count INT DEFAULT 0,
    large_items_count INT DEFAULT 0,
    shipping_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
    monthly_storage_fee NUMERIC(12, 2) NOT NULL DEFAULT 0,
    total_first_month NUMERIC(12, 2) NOT NULL DEFAULT 0,
    step_status TEXT DEFAULT 'empty_box_scheduled' CHECK (step_status IN (
        'empty_box_scheduled',
        'empty_box_delivered',
        'packed_pickup_scheduled',
        'in_warehouse',
        'return_requested',
        'completed'
    )),
    empty_box_delivery_date TIMESTAMPTZ,
    packed_pickup_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. VALET STORAGE ITEMS (Digital Virtual Closet)
CREATE TABLE IF NOT EXISTS public.valet_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES public.valet_orders(id) ON DELETE CASCADE,
    box_code TEXT UNIQUE NOT NULL,
    security_seal_number TEXT NOT NULL,
    item_type TEXT NOT NULL CHECK (item_type IN ('standard_box_60x40x40', 'large_oversized')),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT DEFAULT 'Thời trang',
    warehouse_bin TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'in_storage' CHECK (status IN ('with_customer', 'in_transit', 'in_storage', 'return_requested', 'returned')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. PAYMENTS TABLE (VietQR Napas 247 Logs)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id),
    locker_booking_id UUID REFERENCES public.locker_bookings(id),
    valet_order_id UUID REFERENCES public.valet_orders(id),
    payment_type TEXT NOT NULL CHECK (payment_type IN ('prepaid_locker', 'overdue_locker', 'valet_monthly', 'shipping_fee')),
    amount NUMERIC(12, 2) NOT NULL,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('vietqr', 'momo', 'vnpay', 'wallet')),
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'successful', 'failed')),
    transaction_ref TEXT UNIQUE,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ----------------------------------------------------
-- 9. FUNCTIONS: HAVERSINE & SHIPPING FEE
-- ----------------------------------------------------
CREATE OR REPLACE FUNCTION calculate_haversine_distance(
    lat1 DOUBLE PRECISION,
    lon1 DOUBLE PRECISION,
    lat2 DOUBLE PRECISION,
    lon2 DOUBLE PRECISION
)
RETURNS NUMERIC AS $$
DECLARE
    r NUMERIC := 6371.0;
    dlat NUMERIC;
    dlon NUMERIC;
    a NUMERIC;
    c NUMERIC;
    urban_distance NUMERIC;
BEGIN
    dlat := radians(lat2 - lat1);
    dlon := radians(lon2 - lon1);
    a := sin(dlat / 2)^2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlon / 2)^2;
    c := 2 * atan2(sqrt(a), sqrt(1 - a));
    urban_distance := (r * c) * 1.25; -- Urban routing multiplier for HCMC
    RETURN round(urban_distance::numeric, 2);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION calculate_valet_shipping_fee(dist_km NUMERIC)
RETURNS NUMERIC AS $$
BEGIN
    IF dist_km <= 3.0 THEN
        RETURN 0;
    ELSE
        RETURN ceil(dist_km - 3.0) * 6000;
    END IF;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ----------------------------------------------------
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ----------------------------------------------------
ALTER TABLE public.locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lockers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.locker_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valet_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.valet_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active locations" ON public.locations FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Public read lockers" ON public.lockers FOR SELECT USING (TRUE);
CREATE POLICY "Public insert locker_bookings" ON public.locker_bookings FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Public read locker_bookings" ON public.locker_bookings FOR SELECT USING (TRUE);
CREATE POLICY "Public update locker_bookings" ON public.locker_bookings FOR UPDATE USING (TRUE);
CREATE POLICY "Public insert valet_orders" ON public.valet_orders FOR INSERT WITH CHECK (TRUE);
CREATE POLICY "Public read valet_orders" ON public.valet_orders FOR SELECT USING (TRUE);
CREATE POLICY "Public read valet_items" ON public.valet_items FOR SELECT USING (TRUE);
CREATE POLICY "Public insert valet_items" ON public.valet_items FOR INSERT WITH CHECK (TRUE);
