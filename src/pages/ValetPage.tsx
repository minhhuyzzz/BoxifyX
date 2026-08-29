import React from 'react';
import { ValetOrder } from '../types';
import { ValetStorageSection } from '../components/ValetStorageSection';
import { Box, Truck, ShieldCheck, ThermometerSnowflake, Sparkles } from 'lucide-react';

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
      
      {/* Header Banner */}
      <div className="text-left space-y-3 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-orange-950 via-zinc-950 to-zinc-950 text-white relative overflow-hidden shadow-xl border border-orange-900/40">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-bold border border-orange-500/30 uppercase tracking-wider">
          <Box className="w-3.5 h-3.5 text-orange-400" />
          <span>Dịch Vụ Valet Storage Theo Tháng</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Lưu Trữ Tận Nhà • Bảo Quản Kho Máy Lạnh 25°C
        </h1>
        <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
          Chúng tôi giao thùng tiêu chuẩn đến tận cửa, nhận đồ niêm phong chốt bảo mật và vận chuyển về Kho Trung Tâm Tân Bình. Quản lý trực quan trên Web App.
        </p>

        {/* Feature Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 text-xs">
          <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center gap-2.5">
            <Truck className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <strong className="block text-white">Miễn Phí 3km Đầu</strong>
              <span className="text-[11px] text-zinc-400">6.000 đ/km từ km thứ 4</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center gap-2.5">
            <ThermometerSnowflake className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <strong className="block text-white">Kho Mát 25°C</strong>
              <span className="text-[11px] text-zinc-400">Độ ẩm &lt; 60% chống mốc</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-900/90 border border-zinc-800 flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-orange-400 shrink-0" />
            <div>
              <strong className="block text-white">Bảo Hiểm 20 Triệu</strong>
              <span className="text-[11px] text-zinc-400">Niêm phong 2 chốt an toàn</span>
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
