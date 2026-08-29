import React, { useState } from 'react';
import { Lock, Box, Check, Sparkles, ArrowRight, ShieldCheck, Clock, Truck, Zap, Info } from 'lucide-react';
import { formatVND } from '../lib/pricing';

interface PricingTableProps {
  onSelectLocker: () => void;
  onSelectValet: () => void;
}

export const PricingTable: React.FC<PricingTableProps> = ({ onSelectLocker, onSelectValet }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'locker' | 'valet'>('all');

  return (
    <section id="pricing-section" className="py-12 space-y-10 text-left">
      
      {/* Header & Switcher */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-200/80 pb-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Biểu Phí Niêm Yết Minh Bạch</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
            Bảng Giá Dịch Vụ BoxifyX TP.HCM
          </h2>
          <p className="text-sm text-zinc-600 font-normal">
            Không phụ phí ẩn. Tự động áp dụng mức giá ưu đãi nhất theo thời gian sử dụng thực tế.
          </p>
        </div>

        {/* Tab Filter */}
        <div className="flex p-1 bg-zinc-100 rounded-2xl border border-zinc-200 shrink-0">
          <button
            onClick={() => setActiveTab('all')}
            className={`py-2 px-4 rounded-xl text-xs font-black transition-all ${
              activeTab === 'all'
                ? 'bg-zinc-950 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            Tất Cả Gói
          </button>
          <button
            onClick={() => setActiveTab('locker')}
            className={`py-2 px-4 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === 'locker'
                ? 'bg-zinc-950 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span>Smart Locker</span>
          </button>
          <button
            onClick={() => setActiveTab('valet')}
            className={`py-2 px-4 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
              activeTab === 'valet'
                ? 'bg-zinc-950 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            <Box className="w-3.5 h-3.5 text-orange-400" />
            <span>Valet Storage</span>
          </button>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
        
        {/* Card 1: Smart Locker Size S */}
        {(activeTab === 'all' || activeTab === 'locker') && (
          <div className="p-7 rounded-3xl bg-white border border-zinc-200 shadow-card hover:border-amber-400 hover:shadow-glow transition-all flex flex-col justify-between space-y-6 relative group">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-800 text-[11px] font-extrabold uppercase">
                  Smart Locker
                </span>
                <span className="text-xs font-bold text-amber-600">Size S</span>
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-zinc-950">10.000 đ</span>
                  <span className="text-xs text-zinc-500 font-medium">/ 2h đầu</span>
                </div>
                <p className="text-xs text-zinc-500 font-semibold mt-1">
                  + 5.000 đ / mỗi giờ tiếp theo
                </p>
              </div>

              <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-200/60 text-xs text-amber-900 font-medium">
                🎒 <strong>Phù hợp:</strong> Balo laptop, túi xách, mũ bảo hiểm, đồ dùng cá nhân.
              </div>

              <ul className="space-y-2.5 text-xs text-zinc-600 pt-2 border-t border-zinc-100">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Kích thước: <strong>30 x 40 x 50 cm</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Mở khóa 1-chạm qua mã PIN / QR Code</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>Giảm 20%</strong> khi gửi từ 24h trở lên</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onSelectLocker}
              className="w-full py-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Đặt Tủ Size S</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Card 2: Smart Locker Size M (HOT / POPULAR) */}
        {(activeTab === 'all' || activeTab === 'locker') && (
          <div className="p-7 rounded-3xl bg-zinc-950 text-white border-2 border-amber-400 shadow-xl hover:shadow-glow-lg transition-all flex flex-col justify-between space-y-6 relative group">
            {/* Featured Badge */}
            <div className="absolute -top-3.5 right-6 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[10px] font-black uppercase tracking-wider shadow-md flex items-center gap-1">
              <Zap className="w-3 h-3 fill-white" />
              <span>Phổ Biến Nhất</span>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="px-2.5 py-1 rounded-lg bg-zinc-800 text-amber-400 text-[11px] font-extrabold uppercase">
                  Smart Locker
                </span>
                <span className="text-xs font-bold text-amber-400">Size M</span>
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-amber-400">18.000 đ</span>
                  <span className="text-xs text-zinc-400 font-medium">/ 2h đầu</span>
                </div>
                <p className="text-xs text-zinc-300 font-semibold mt-1">
                  + 8.000 đ / mỗi giờ tiếp theo
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 font-medium">
                🧳 <strong>Phù hợp:</strong> Vali cabin 20 inch, túi du lịch thể thao, 2-3 túi xách.
              </div>

              <ul className="space-y-2.5 text-xs text-zinc-300 pt-2 border-t border-zinc-800">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Kích thước: <strong>45 x 50 x 60 cm</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Hỗ trợ gửi hộ & nhận hàng P2P</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span><strong>Giảm 20%</strong> khi gửi từ 24h trở lên</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onSelectLocker}
              className="w-full py-3.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs shadow-glow flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>Đặt Tủ Size M Ngay</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Card 3: Smart Locker Size L */}
        {(activeTab === 'all' || activeTab === 'locker') && (
          <div className="p-7 rounded-3xl bg-white border border-zinc-200 shadow-card hover:border-amber-400 hover:shadow-glow transition-all flex flex-col justify-between space-y-6 relative group">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-800 text-[11px] font-extrabold uppercase">
                  Smart Locker
                </span>
                <span className="text-xs font-bold text-zinc-900">Size L</span>
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-zinc-950">25.000 đ</span>
                  <span className="text-xs text-zinc-500 font-medium">/ 2h đầu</span>
                </div>
                <p className="text-xs text-zinc-500 font-semibold mt-1">
                  + 12.000 đ / mỗi giờ tiếp theo
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 font-medium">
                📦 <strong>Phù hợp:</strong> Vali cỡ đại 24-28", thùng hàng lớn, thiết bị quay phim.
              </div>

              <ul className="space-y-2.5 text-xs text-zinc-600 pt-2 border-t border-zinc-100">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Kích thước: <strong>90 x 50 x 60 cm</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Sức chứa vali 28 inch siêu to</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-amber-600 shrink-0" />
                  <span><strong>Giảm 20%</strong> khi gửi từ 24h trở lên</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onSelectLocker}
              className="w-full py-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Đặt Tủ Size L</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Card 4: Valet Storage Standard Box */}
        {(activeTab === 'all' || activeTab === 'valet') && (
          <div className="p-7 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50/90 border border-amber-200 shadow-card hover:shadow-glow transition-all flex flex-col justify-between space-y-6 relative group">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="px-2.5 py-1 rounded-lg bg-orange-100 text-orange-800 text-[11px] font-extrabold uppercase">
                  Valet Storage
                </span>
                <span className="text-xs font-bold text-orange-600">Thùng Tiêu Chuẩn</span>
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-zinc-950">120.000 đ</span>
                  <span className="text-xs text-zinc-500 font-medium">/ thùng / tháng</span>
                </div>
                <p className="text-xs text-emerald-700 font-bold mt-1">
                  🎉 Miễn phí 3km giao nhận tận nhà
                </p>
              </div>

              <div className="p-3 rounded-xl bg-white/80 border border-amber-200 text-xs text-zinc-800 font-medium">
                👕 <strong>Chứa được:</strong> 20-30 áo khoác len, 40 cuốn sách, 5 đôi giày.
              </div>

              <ul className="space-y-2.5 text-xs text-zinc-700 pt-2 border-t border-amber-200/80">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Kích thước: <strong>60 x 40 x 40 cm (100L)</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Kho máy lạnh Tân Bình <strong>25°C chống mốc</strong></span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Bảo hiểm tài sản <strong>20.000.000 đ/thùng</strong></span>
                </li>
              </ul>
            </div>

            <button
              onClick={onSelectValet}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs shadow-glow flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>Đặt Lưu Thùng Valet</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Card 5: Valet Storage Large Item */}
        {(activeTab === 'all' || activeTab === 'valet') && (
          <div className="p-7 rounded-3xl bg-white border border-zinc-200 shadow-card hover:border-orange-300 transition-all flex flex-col justify-between space-y-6 relative group">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-800 text-[11px] font-extrabold uppercase">
                  Valet Storage
                </span>
                <span className="text-xs font-bold text-orange-600">Kiện Quá Khổ</span>
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-black text-zinc-950">200.000 đ</span>
                  <span className="text-xs text-zinc-500 font-medium">/ kiện / tháng</span>
                </div>
                <p className="text-xs text-zinc-500 font-semibold mt-1">
                  Kệ pallet chịu tải chuyên dụng
                </p>
              </div>

              <div className="p-3 rounded-xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-800 font-medium">
                🚲 <strong>Phù hợp:</strong> Xe đạp, bộ gậy golf, đệm gấp, quạt sưởi, lều camping.
              </div>

              <ul className="space-y-2.5 text-xs text-zinc-600 pt-2 border-t border-zinc-100">
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Bảo quản pallet kho mát 25°C</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Ghi nhận ảnh chụp vào Tủ Đồ Ảo</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Bảo hiểm tài sản <strong>20.000.000 đ/kiện</strong></span>
                </li>
              </ul>
            </div>

            <button
              onClick={onSelectValet}
              className="w-full py-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <span>Đặt Lưu Kiện Quá Khổ</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

      </div>

      {/* Transparency Guarantee Banner */}
      <div className="p-6 rounded-3xl bg-zinc-900 text-white border border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-white">Chính Sách Thanh Toán & Hoàn Tiền Rõ Ràng</h4>
            <p className="text-xs text-zinc-400">Trả trước 6 tháng giảm 10% • Trả trước 12 tháng tặng 1 tháng miễn phí.</p>
          </div>
        </div>

        <div className="text-xs text-zinc-300 font-bold flex items-center gap-2">
          <span>Phí ship: 0đ cho 3km đầu • 6.000 đ/km từ km 4+</span>
        </div>
      </div>

    </section>
  );
};
