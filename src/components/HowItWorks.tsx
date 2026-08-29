import React, { useState } from 'react';
import { MapPin, QrCode, Unlock, Box, Truck, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  const [activeWorkflow, setActiveWorkflow] = useState<'locker' | 'valet'>('locker');

  return (
    <section className="py-16 bg-gradient-to-b from-white via-zinc-50/70 to-white rounded-3xl border border-zinc-200/80 shadow-sm p-8 sm:p-12">
      <div className="max-w-5xl mx-auto text-center space-y-4">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Quy Trình Hoạt Động Siêu Tốc</span>
        </div>

        <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
          Lưu Trữ Trong 3 Bước Đơn Giản
        </h2>

        <p className="text-sm sm:text-base text-zinc-600 max-w-2xl mx-auto font-normal">
          Không thủ tục rườm rà. Mọi thao tác đều thực hiện trực tiếp trên Web App chỉ trong vài chạm.
        </p>

        {/* Workflow Tab Switcher */}
        <div className="inline-flex p-1.5 bg-zinc-200/80 rounded-2xl border border-zinc-300 max-w-md mx-auto mt-4">
          <button
            onClick={() => setActiveWorkflow('locker')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeWorkflow === 'locker'
                ? 'bg-zinc-950 text-white shadow-md'
                : 'text-zinc-700 hover:text-zinc-950'
            }`}
          >
            ⚡ Quy Trình Smart Locker (Theo Giờ)
          </button>
          <button
            onClick={() => setActiveWorkflow('valet')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeWorkflow === 'valet'
                ? 'bg-zinc-950 text-white shadow-md'
                : 'text-zinc-700 hover:text-zinc-950'
            }`}
          >
            🚚 Quy Trình Valet Storage (Theo Tháng)
          </button>
        </div>

        {/* 3 Step Cards */}
        {activeWorkflow === 'locker' ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 text-left">
            {/* Step 1 */}
            <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm relative group hover:border-amber-400 hover:shadow-glow transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-zinc-950 flex items-center justify-center font-black text-lg mb-4 shadow-sm group-hover:scale-105 transition-transform">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs font-black text-amber-600 uppercase tracking-wider block mb-1">Bước 1</span>
              <h3 className="text-lg font-bold text-zinc-950">Chọn Trạm & Size Tủ</h3>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                Mở bản đồ TP.HCM, chọn trạm gần nhất (Sân bay, Metro, Bùi Viện...) và chọn kích thước tủ S / M / L phù hợp với hành lý.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm relative group hover:border-amber-400 hover:shadow-glow transition-all">
              <div className="w-12 h-12 rounded-2xl bg-zinc-950 text-amber-400 flex items-center justify-center font-black text-lg mb-4 shadow-sm group-hover:scale-105 transition-transform">
                <QrCode className="w-6 h-6" />
              </div>
              <span className="text-xs font-black text-amber-600 uppercase tracking-wider block mb-1">Bước 2</span>
              <h3 className="text-lg font-bold text-zinc-950">Quét VietQR & Nhận PIN</h3>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                Thanh toán trả trước tự động qua mã VietQR Napas 247. Hệ thống cấp ngay mã PIN 6 số và link ủy quyền gửi hộ P2P.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm relative group hover:border-amber-400 hover:shadow-glow transition-all">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-black text-lg mb-4 shadow-sm group-hover:scale-105 transition-transform">
                <Unlock className="w-6 h-6" />
              </div>
              <span className="text-xs font-black text-emerald-600 uppercase tracking-wider block mb-1">Bước 3</span>
              <h3 className="text-lg font-bold text-zinc-950">Mở Khóa Tủ 1-Chạm</h3>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                Đến vị trí tủ, bấm nút "Mở Tủ" trên web hoặc nhập mã PIN trên bàn phím số. Chốt điện tự động nhảy mở tức thì.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-10 text-left">
            {/* Step 1 Valet */}
            <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm relative group hover:border-orange-400 hover:shadow-glow transition-all">
              <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center font-black text-lg mb-4 shadow-sm group-hover:scale-105 transition-transform">
                <Box className="w-6 h-6" />
              </div>
              <span className="text-xs font-black text-orange-600 uppercase tracking-wider block mb-1">Bước 1</span>
              <h3 className="text-lg font-bold text-zinc-950">Đặt Thùng Tận Nhà</h3>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                Chọn số lượng thùng Standard hoặc Kiện Large. Shipper BoxifyX giao thùng rỗng và chốt niêm phong đến tận cửa nhà bạn.
              </p>
            </div>

            {/* Step 2 Valet */}
            <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm relative group hover:border-orange-400 hover:shadow-glow transition-all">
              <div className="w-12 h-12 rounded-2xl bg-zinc-950 text-orange-400 flex items-center justify-center font-black text-lg mb-4 shadow-sm group-hover:scale-105 transition-transform">
                <Truck className="w-6 h-6" />
              </div>
              <span className="text-xs font-black text-orange-600 uppercase tracking-wider block mb-1">Bước 2</span>
              <h3 className="text-lg font-bold text-zinc-950">Đóng Gói & Niêm Phong</h3>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                Bạn thong thả sắp xếp đồ đạc, bấm chốt niêm phong bảo mật có mã vạch riêng. Shipper đến lấy thùng đưa về kho Tân Bình.
              </p>
            </div>

            {/* Step 3 Valet */}
            <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm relative group hover:border-orange-400 hover:shadow-glow transition-all">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black text-lg mb-4 shadow-sm group-hover:scale-105 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <span className="text-xs font-black text-amber-600 uppercase tracking-wider block mb-1">Bước 3</span>
              <h3 className="text-lg font-bold text-zinc-950">Quản Lý & Yêu Cầu Trả</h3>
              <p className="text-xs text-zinc-600 mt-2 leading-relaxed">
                Xem ảnh chụp từng món đồ trong "Tủ Đồ Ảo" trên web app. Khi cần dùng, chỉ cần 1 nút bấm để yêu cầu shipper giao trả tận nhà.
              </p>
            </div>
          </div>
        )}

      </div>
    </section>
  );
};
