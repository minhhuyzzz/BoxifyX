import React from 'react';
import { ShieldCheck, ThermometerSnowflake, Lock, Video, Award, CheckCircle2, Zap } from 'lucide-react';

export const TrustAndSecurity: React.FC = () => {
  return (
    <section className="py-16 bg-zinc-950 text-white rounded-3xl p-8 sm:p-14 relative overflow-hidden border border-zinc-800 shadow-2xl">
      {/* Glow Effects */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-500/10 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-6xl mx-auto space-y-12 relative z-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-amber-400" />
            <span>Tiêu Chuẩn An Ninh 5 Sao</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Tài Sản Của Bạn Được Bảo Vệ Tuyệt Đối
          </h2>

          <p className="text-sm sm:text-base text-zinc-400 font-normal">
            Chúng tôi áp dụng các tiêu chuẩn an toàn kho bãi quốc tế kết hợp công nghệ giám sát thời gian thực.
          </p>
        </div>

        {/* 4 Feature Pillars Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Pillar 1: Temperature & Climate */}
          <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/50 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ThermometerSnowflake className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Kho Mát 25°C Chống Ẩm</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Kiểm soát độ ẩm dưới 60%, máy lạnh duy trì 24/7 bảo vệ đồ da, tài liệu và thiết bị điện tử không bị ẩm mốc.
            </p>
          </div>

          {/* Pillar 2: Tamper-Evident Seal */}
          <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 hover:border-orange-500/50 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Niêm Phong Chống Tráo</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Mỗi thùng Standard có 2 chốt khóa nhựa mã số riêng biệt (Barcode/QR). Khách tự tay bấm khóa trước khi giao shipper.
            </p>
          </div>

          {/* Pillar 3: AI Camera 24/7 */}
          <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 hover:border-amber-500/50 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Video className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Camera AI Giám Sát 24/7</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Hệ thống camera hồng ngoại bao phủ 100% không góc chết tại toàn bộ trạm Smart Locker và kho bãi Tân Bình.
            </p>
          </div>

          {/* Pillar 4: Insurance 20M */}
          <div className="p-6 rounded-3xl bg-zinc-900/90 border border-zinc-800 hover:border-emerald-500/50 transition-all space-y-4 group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Bảo Hiểm 20 Triệu/Thùng</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Hợp đồng bảo hiểm tài sản tự động kích hoạt cho mọi đơn lưu kho, cam kết đền bù 100% nếu có sự cố rủi ro.
            </p>
          </div>

        </div>

      </div>
    </section>
  );
};
