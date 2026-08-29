import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Clock,
  Box,
  Lock,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  Shield,
  ThermometerSnowflake,
  Zap,
  QrCode,
  Truck,
  PackageCheck,
  Building2,
  Award
} from 'lucide-react';
import { LockerSize } from '../types';
import { calculateLockerFee, formatVND } from '../lib/pricing';

interface HeroProps {
  onNavigateToLocker: (stationId?: string) => void;
  onNavigateToValet: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onNavigateToLocker, onNavigateToValet }) => {
  const [heroTab, setHeroTab] = useState<'locker' | 'valet'>('locker');
  const [quickStation, setQuickStation] = useState<string>('sta-govap');
  const [quickSize, setQuickSize] = useState<LockerSize>('S');
  const [quickHours, setQuickHours] = useState<number>(4);

  const priceResult = calculateLockerFee(quickSize, quickHours);

  return (
    <section id="hero-section" className="relative overflow-hidden pt-2 pb-0 bg-transparent">
      {/* Ambient background glows spanning up to the header */}
      <div className="absolute -top-32 left-1/4 w-[750px] h-[500px] bg-gradient-to-tr from-amber-300/30 via-orange-300/20 to-transparent blur-3xl pointer-events-none -z-10 rounded-full" />
      <div className="absolute -top-28 right-10 w-[650px] h-[550px] bg-gradient-to-br from-orange-400/20 to-amber-200/15 blur-3xl pointer-events-none -z-10 rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ======================================================== */}
        {/* TOP ROW: 2-COLUMN HERO (TEXT LEFT | CLEAN HERO IMAGE RIGHT) */}
        {/* ======================================================== */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center pt-2 pb-10">

          {/* Left Column: Heading, Subtitle & Primary Buttons */}
          <div className="lg:col-span-6 space-y-6 text-left">

            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-amber-300 shadow-sm text-zinc-900 text-xs font-black tracking-wide uppercase">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              <span>Nền Tảng Lưu Trữ Kỹ Thuật Số • 27 Trạm Toàn TP.HCM</span>
            </div>

            {/* Main Headline: Giãn cách dòng thoáng đãng, không bị dính dấu tiếng Việt */}
            <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-black text-zinc-950 leading-[1.32] tracking-normal">
              Dịch Vụ Lưu Trữ Valet &{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 inline-block py-0.5">
                Tủ Đồ Thông Minh
              </span>{' '}
              TP.HCM
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-zinc-600 font-normal leading-relaxed">
              Giải pháp kết hợp mạng lưới <strong className="text-zinc-950 font-bold">Smart Locker theo giờ</strong> tại 27 hub trọng điểm và dịch vụ <strong className="text-zinc-950 font-bold">Valet Storage theo tháng</strong> giao nhận thùng tận cửa nhà.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-1">
              <button
                type="button"
                onClick={() => onNavigateToLocker(quickStation)}
                className="flex items-center justify-center gap-3 px-7 py-4 rounded-2xl bg-zinc-950 text-white font-extrabold text-sm sm:text-base hover:bg-zinc-800 transition-all shadow-xl hover:shadow-2xl active:scale-95 group"
              >
                <span>Xem Bản Đồ 27 Trạm Tủ</span>
                <ArrowRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={onNavigateToValet}
                className="flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-extrabold text-sm sm:text-base hover:from-amber-600 hover:to-orange-600 transition-all shadow-glow hover:shadow-glow-lg active:scale-95"
              >
                <Box className="w-5 h-5" />
                <span>Đặt Lưu Kho Valet</span>
              </button>
            </div>

            {/* 3 Key Trust Bullet Points */}
            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-zinc-200">
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Free 3km Ship</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-800">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Kho Mát 25°C</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-bold text-zinc-800">
                <CheckCircle2 className="w-4 h-4 text-orange-600 shrink-0" />
                <span>Bảo Hiểm 20 Triệu</span>
              </div>
            </div>
          </div>

          {/* Right Column: Clean, High-Impact Hero Image Showcase (Tối Giản, Đỡ Rối) */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">

              {/* Main Crisp Hero Image Container */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-zinc-200/80 bg-zinc-900 group">
                <img
                  src="https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&auto=format&fit=crop&q=80"
                  alt="BoxifyX Smart Locker Hub & Valet Storage Warehouse"
                  className="w-full h-[380px] sm:h-[430px] object-cover group-hover:scale-105 transition-transform duration-700 brightness-95"
                />

                {/* Subtle Image Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-zinc-950/20 to-transparent" />

                {/* Top Overlay Badge */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                  <span className="px-3.5 py-1.5 rounded-full bg-zinc-950/80 backdrop-blur-md text-white text-xs font-black border border-zinc-700/80 shadow-md flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>27 Trạm Tủ TP.HCM</span>
                  </span>

                  <span className="px-3.5 py-1.5 rounded-full bg-emerald-500/90 backdrop-blur-md text-white text-xs font-bold shadow-md flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    <span>Mở Tủ 24/7</span>
                  </span>
                </div>

                {/* Bottom Overlay Summary Info Bar */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-zinc-950/85 backdrop-blur-xl border border-zinc-700/80 text-white z-10 space-y-1.5 text-left">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-extrabold text-amber-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>Tiêu Chuẩn Kho Mát 25°C • Niêm Phong Seal</span>
                    </span>
                    <span className="text-[11px] text-zinc-400 font-mono">BoxifyX Hub</span>
                  </div>
                  <p className="text-[11px] text-zinc-300 line-clamp-1">
                    Trụ sở Gò Vấp & Mạng lưới Kiosk tự động tại Ga Metro, Sân bay TSN, TTTM toàn thành phố.
                  </p>
                </div>
              </div>

              {/* Floating Decorative Badge 1: Kho Mát 25°C */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-3 shadow-xl border border-zinc-200 hidden sm:flex items-center gap-2.5 z-20 hover:-translate-y-1 transition-transform">
                <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold">
                  <ThermometerSnowflake className="w-5 h-5 text-orange-600" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-black text-zinc-950">Kho Mát 25°C</h4>
                  <p className="text-[10px] text-zinc-500">Độ ẩm &lt;50% Chống ẩm mốc</p>
                </div>
              </div>

              {/* Floating Decorative Badge 2: Bảo Hiểm 20Tr */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-3 shadow-xl border border-zinc-200 hidden sm:flex items-center gap-2.5 z-20 hover:-translate-y-1 transition-transform">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <Award className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-left">
                  <h4 className="text-xs font-black text-zinc-950">Bảo Hiểm 20.000.000 đ</h4>
                  <p className="text-[10px] text-zinc-500">Bảo hiểm mặc định từng kiện</p>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* BOTTOM ROW: QUICK BOOKING CONSOLE DOCKED AT HERO EDGE   */}
        {/* ======================================================== */}
        <div className="mt-6 pt-4 pb-8 border-t border-zinc-200">
          <div className="p-4 sm:p-6 rounded-3xl bg-white border border-zinc-200/90 shadow-xl space-y-4">

            {/* Header Tabs */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-3">
              <div className="flex p-1 bg-zinc-100 rounded-xl border border-zinc-200 max-w-md">
                <button
                  type="button"
                  onClick={() => setHeroTab('locker')}
                  className={`flex-1 py-2 px-4 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${heroTab === 'locker'
                    ? 'bg-zinc-950 text-white shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-950'
                    }`}
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  <span>Smart Locker (Theo Giờ)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHeroTab('valet')}
                  className={`flex-1 py-2 px-4 rounded-lg text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${heroTab === 'valet'
                    ? 'bg-zinc-950 text-white shadow-sm'
                    : 'text-zinc-600 hover:text-zinc-950'
                    }`}
                >
                  <Box className="w-3.5 h-3.5 text-orange-400" />
                  <span>Valet Storage (Theo Tháng)</span>
                </button>
              </div>

              <div className="text-xs text-zinc-500 font-medium flex items-center gap-2 self-start sm:self-center">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Tự động tính cước chuẩn & áp dụng ưu đãi tức thì</span>
              </div>
            </div>

            {/* Tab 1: Smart Locker Configurator */}
            {heroTab === 'locker' ? (
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end text-left">
                {/* Station Selection */}
                <div className="md:col-span-4">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-500 block mb-1">
                    1. Trạm Tủ Gần Bạn ({quickStation ? '1/27' : ''})
                  </label>
                  <select
                    value={quickStation}
                    onChange={(e) => setQuickStation(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-300 text-xs font-bold bg-zinc-50 text-zinc-900 outline-none focus:bg-white focus:border-amber-500"
                  >
                    <option value="sta-govap">Trụ Sở & Hub Gò Vấp (12 Nguyễn Văn Bảo)</option>
                    <option value="sta-gv-emart">Emart Phan Văn Trị (Gò Vấp)</option>
                    <option value="sta-tsn">Sân Bay Tân Sơn Nhất (Ga T2 Quốc Tế)</option>
                    <option value="sta-tsn-t1">Sân Bay Tân Sơn Nhất (Ga T1 Quốc Nội)</option>
                    <option value="sta-metro-bt">Ga Metro Bến Thành (Quận 1)</option>
                    <option value="sta-buivien">Phố Đi Bộ Bùi Viện (Quận 1)</option>
                    <option value="sta-vincom-dk">Vincom Đồng Khởi (Quận 1)</option>
                    <option value="sta-landmark">Vincom Landmark 81 (Bình Thạnh)</option>
                    <option value="sta-hangxanh">Ngã Tư Hàng Xanh (Bình Thạnh)</option>
                    <option value="sta-thaodien">Thảo Điền Hub (TP. Thủ Đức)</option>
                    <option value="sta-gigamall">Gigamall Phạm Văn Đồng (Thủ Đức)</option>
                    <option value="sta-ga-saigon">Ga Xe Lửa Sài Gòn (Quận 3)</option>
                    <option value="sta-q7">Crescent Mall (Quận 7)</option>
                    <option value="sta-q10">Vạn Hạnh Mall (Quận 10)</option>
                    <option value="sta-tanphu-aeon">Aeon Mall Tân Phú Celadon</option>
                  </select>
                </div>

                {/* Size Selection */}
                <div className="md:col-span-3">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-500 block mb-1">
                    2. Kích Thước Tủ
                  </label>
                  <div className="grid grid-cols-3 gap-1">
                    {(['S', 'M', 'L'] as LockerSize[]).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setQuickSize(s)}
                        className={`py-2 rounded-xl text-xs font-black transition-all ${quickSize === s
                          ? 'bg-amber-500 text-white shadow-sm'
                          : 'bg-zinc-100 text-zinc-700 hover:bg-zinc-200'
                          }`}
                      >
                        Size {s}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hours Selection */}
                <div className="md:col-span-2">
                  <label className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-500 block mb-1">
                    3. Thời Gian: <span className="text-amber-600 font-bold">{quickHours}h</span>
                  </label>
                  <select
                    value={quickHours}
                    onChange={(e) => setQuickHours(parseInt(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-zinc-300 text-xs font-bold bg-zinc-50 text-zinc-900 outline-none focus:bg-white focus:border-amber-500"
                  >
                    <option value={2}>2 Giờ</option>
                    <option value={4}>4 Giờ</option>
                    <option value={8}>8 Giờ</option>
                    <option value={12}>12 Giờ</option>
                    <option value={24}>24 Giờ (-20%)</option>
                    <option value={48}>48 Giờ (-20%)</option>
                  </select>
                </div>

                {/* Price Display & Action */}
                <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-3 bg-zinc-50 p-2 rounded-xl border border-zinc-200">
                  <div className="text-left">
                    <span className="text-[10px] text-zinc-400 block font-medium">Tạm tính:</span>
                    <span className="text-base font-black text-amber-600">{formatVND(priceResult.total)}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onNavigateToLocker(quickStation)}
                    className="px-4 py-2.5 rounded-xl bg-zinc-950 hover:bg-amber-500 hover:text-white text-white font-extrabold text-xs transition-all shadow-sm flex items-center gap-1 active:scale-95"
                  >
                    <span>Đặt Ngay</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              /* Tab 2: Valet Storage Configurator */
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center text-left">
                <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200 flex justify-between items-center text-xs">
                    <div>
                      <strong className="block text-zinc-950">Thùng Standard (60x40x40cm)</strong>
                      <span className="text-[11px] text-zinc-500">Nhựa nguyên sinh niêm phong chốt Seal</span>
                    </div>
                    <span className="text-sm font-black text-amber-600">120k / tháng</span>
                  </div>

                  <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 flex justify-between items-center text-xs">
                    <div>
                      <strong className="block text-zinc-950">Kiện Quá Khổ (Đệm, xe đạp, lều)</strong>
                      <span className="text-[11px] text-zinc-500">Lưu pallet kho máy lạnh 25°C</span>
                    </div>
                    <span className="text-sm font-black text-orange-600">200k / tháng</span>
                  </div>
                </div>

                <div className="md:col-span-4 flex items-center justify-between md:justify-end gap-3 bg-zinc-50 p-2 rounded-xl border border-zinc-200">
                  <div className="text-left text-xs">
                    <span className="text-emerald-600 font-bold block">Free 3km ship</span>
                    <span className="text-[10px] text-zinc-400">Từ km 4: 6k/km</span>
                  </div>
                  <button
                    type="button"
                    onClick={onNavigateToValet}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs transition-all shadow-glow flex items-center gap-1 active:scale-95"
                  >
                    <span>Tính Cước GPS</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </section>
  );
};
