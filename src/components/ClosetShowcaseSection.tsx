import React from 'react';
import {
  Sparkles,
  Camera,
  ShieldCheck,
  ThermometerSnowflake,
  Truck,
  ArrowRight,
  CheckCircle2,
  Box,
  Layers,
  Smartphone,
  Eye,
  Lock,
  Award
} from 'lucide-react';

interface ClosetShowcaseSectionProps {
  onNavigateToCloset: () => void;
}

export const ClosetShowcaseSection: React.FC<ClosetShowcaseSectionProps> = ({ onNavigateToCloset }) => {
  return (
    <section className="py-12 space-y-8 text-left">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Công Nghệ Quản Lý Kho Kỹ Thuật Số</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
            Tủ Đồ Số Hóa (Digital Closet) Trực Quan
          </h2>
          <p className="text-sm text-zinc-600 font-normal max-w-2xl">
            Không cần tự nhớ đồ gửi những gì. Toàn bộ thùng đồ trong kho được chụp ảnh, gắn mã chốt niêm phong và quản lý trực tiếp qua Web App.
          </p>
        </div>

        <button
          type="button"
          onClick={onNavigateToCloset}
          className="px-6 py-3.5 rounded-2xl bg-zinc-950 hover:bg-amber-500 hover:text-zinc-950 text-white font-extrabold text-xs sm:text-sm shadow-md flex items-center gap-2 transition-all active:scale-95 shrink-0 self-start md:self-auto"
        >
          <span>Khám Phá Tủ Đồ Số Hóa</span>
          <ArrowRight className="w-4 h-4 text-amber-400" />
        </button>
      </div>

      {/* 4 Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
        <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-2.5 hover:border-amber-400 transition-colors">
          <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center font-bold">
            <Camera className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-zinc-950 text-sm">Ảnh Chụp Thực Tế</h4>
          <p className="text-zinc-500 text-[11px] leading-relaxed">
            Xem hình ảnh chi tiết đồ đạc bên trong từng thùng để không bao giờ quên sau nhiều tháng lưu kho.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-2.5 hover:border-amber-400 transition-colors">
          <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-zinc-950 text-sm">Chốt Seal Bảo Mật</h4>
          <p className="text-zinc-500 text-[11px] leading-relaxed">
            Khách tự tay bấm chốt seal mã vạch độc nhất, cam kết chống mở trộm và bảo hiểm 20.000.000 đ.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-2.5 hover:border-amber-400 transition-colors">
          <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
            <ThermometerSnowflake className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-zinc-950 text-sm">Kho Mát 25°C</h4>
          <p className="text-zinc-500 text-[11px] leading-relaxed">
            Cảm biến IoT kiểm soát liên tục 25°C, độ ẩm &lt;50% chống mốc tối ưu cho quần áo dạ, sách vở và đồ điện tử.
          </p>
        </div>

        <div className="p-5 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-2.5 hover:border-amber-400 transition-colors">
          <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
            <Truck className="w-5 h-5" />
          </div>
          <h4 className="font-extrabold text-zinc-950 text-sm">Giao Trả Tận Cửa 24/7</h4>
          <p className="text-zinc-500 text-[11px] leading-relaxed">
            Cần dùng đồ nào chỉ cần bấm 1 nút trên web, shipper BoxifyX sẽ xuất kho và mang trả tận cửa nhà bạn.
          </p>
        </div>
      </div>

      {/* Visual Showcase Banner: Clean Marketing Preview (Không dính nút bấm chức năng ảo) */}
      <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white shadow-2xl border border-zinc-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Key Values */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-bold border border-amber-500/30 uppercase">
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              <span>Giao Diện Quản Lý Thông Minh</span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Biến Kho Bãi Thành Tủ Đồ Số Ngay Trong Điện Thoại Của Bạn
            </h3>

            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
              Khi gửi đồ qua dịch vụ <strong>Valet Storage</strong>, toàn bộ thông tin về mã thùng (`BX-STD-...`), chốt niêm phong (`SEAL-HCM-...`), vị trí kệ kho mát và danh sách ảnh chụp sẽ hiển thị tức thì trong Tủ Đồ Số Hóa.
            </p>

            {/* Feature Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 text-xs text-zinc-200">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Cập nhật ảnh chụp đồ từ điện thoại</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Xem chi tiết hợp đồng đơn đặt gốc</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Theo dõi nhiệt độ kho mát 25°C</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Yêu cầu shipper hoàn trả từng món</span>
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-3 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onNavigateToCloset}
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs sm:text-sm shadow-glow flex items-center gap-2 transition-all active:scale-95"
              >
                <span>Vào Tủ Đồ Số Hóa Của Bạn</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: 3 Clean Preview Mini Cards */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3">
            
            {/* Mini Box 1 */}
            <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center gap-3.5 shadow-md">
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-zinc-700 bg-zinc-800">
                <img
                  src="https://images.unsplash.com/photo-1520006403909-838d6b92c22e?w=400&auto=format&fit=crop&q=80"
                  alt="Thùng quần áo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="overflow-hidden flex-1 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-amber-400 text-xs">BX-STD-8891</span>
                  <span className="text-[10px] text-emerald-400 font-bold">25°C Mát</span>
                </div>
                <h5 className="font-extrabold text-xs text-white truncate">Quần Áo Mùa Đông & Áo Dạ Len</h5>
                <span className="text-[10px] text-zinc-400 block truncate">Seal: SEAL-HCM-9021 • Kệ KHO1-A</span>
              </div>
            </div>

            {/* Mini Box 2 */}
            <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center gap-3.5 shadow-md">
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-zinc-700 bg-zinc-800">
                <img
                  src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80"
                  alt="Thùng tài liệu"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="overflow-hidden flex-1 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-amber-400 text-xs">BX-STD-8892</span>
                  <span className="text-[10px] text-emerald-400 font-bold">54% RH</span>
                </div>
                <h5 className="font-extrabold text-xs text-white truncate">Giáo Trình & Tài Liệu Nghiên Cứu</h5>
                <span className="text-[10px] text-zinc-400 block truncate">Seal: SEAL-HCM-9022 • Kệ KHO1-B</span>
              </div>
            </div>

            {/* Mini Box 3 */}
            <div className="p-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center gap-3.5 shadow-md">
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 border border-zinc-700 bg-zinc-800">
                <img
                  src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=400&auto=format&fit=crop&q=80"
                  alt="Dụng cụ cắm trại"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="overflow-hidden flex-1 text-left">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-orange-400 text-xs">BX-LRG-4011</span>
                  <span className="text-[10px] text-emerald-400 font-bold">Pallet 25°C</span>
                </div>
                <h5 className="font-extrabold text-xs text-white truncate">Dụng Cụ Cắm Trại & Lều Glamping</h5>
                <span className="text-[10px] text-zinc-400 block truncate">Seal: SEAL-HCM-9045 • Khu Quá Khổ</span>
              </div>
            </div>

          </div>

        </div>
      </div>

    </section>
  );
};
