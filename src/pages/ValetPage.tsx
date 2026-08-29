import React from 'react';
import { ValetOrder } from '../types';
import { ValetStorageSection } from '../components/ValetStorageSection';
import { Box, Truck, ShieldCheck, ThermometerSnowflake, Sparkles, Award } from 'lucide-react';

interface ValetPageProps {
  currentUser?: { id: string; email: string; fullName: string; phone: string } | null;
  onRequireAuth?: (notice: string) => void;
  onOrderCreated: (order: ValetOrder) => void;
}

export const ValetPage: React.FC<ValetPageProps> = ({
  currentUser,
  onRequireAuth,
  onOrderCreated,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">

      {/* Header Banner: Thiết kế sáng ấm, thanh lịch & nổi bật */}
      <div className="text-left space-y-3 p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white relative overflow-hidden shadow-glow">
        {/* Subtle decorative pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-950/25 text-white text-xs font-black border border-white/20 uppercase tracking-wider">
            <Box className="w-3.5 h-3.5 text-amber-200" />
            <span>Dịch Vụ Valet Storage Giao Nhận Tận Nhà Theo Tháng</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Lưu Trữ Tận Nhà
          </h1>

          <p className="text-xs sm:text-base text-amber-50/90 max-w-2xl leading-relaxed font-medium">
            Chúng tôi giao thùng tiêu chuẩn đến tận cửa, nhận đồ niêm phong chốt bảo mật và bảo quản tại Kho Trung Tâm Tân Bình. Quản lý ảnh chụp trực quan 24/7 trên Web App.
          </p>

          {/* Feature Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-zinc-950/20 backdrop-blur-md border border-white/20 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold shrink-0">
                <Truck className="w-5 h-5 text-white" />
              </div>
              <div>
                <strong className="block text-white font-extrabold">Miễn Phí 3km Đầu</strong>
                <span className="text-[11px] text-amber-100">6.000 đ/km từ km thứ 4</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-950/20 backdrop-blur-md border border-white/20 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold shrink-0">
                <ThermometerSnowflake className="w-5 h-5 text-white" />
              </div>
              <div>
                <strong className="block text-white font-extrabold">Kho Mát 25°C</strong>
                <span className="text-[11px] text-amber-100">Độ ẩm &lt;50% chống ẩm mốc</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-950/20 backdrop-blur-md border border-white/20 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center font-bold shrink-0">
                <Award className="w-5 h-5 text-white" />
              </div>
              <div>
                <strong className="block text-white font-extrabold">Bảo Hiểm 20 Triệu</strong>
                <span className="text-[11px] text-amber-100">Chốt seal niêm phong độc nhất</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Embedded Valet Storage Configurator */}
      <ValetStorageSection
        currentUser={currentUser}
        onRequireAuth={onRequireAuth}
        onOrderCreated={onOrderCreated}
      />
    </div>
  );
};
