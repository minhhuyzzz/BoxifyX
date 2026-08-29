import React from 'react';
import { TrustAndSecurity } from '../components/TrustAndSecurity';
import { ShieldCheck, ThermometerSnowflake, Lock, Video, Award, CheckCircle2, MapPin } from 'lucide-react';

export const SecurityPage: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Header Banner */}
      <div className="text-left space-y-3 p-8 sm:p-10 rounded-3xl bg-zinc-950 text-white relative overflow-hidden shadow-2xl border border-zinc-800">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30 uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Hệ Thống Kiểm Soát An Ninh 5 Lớp</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          An Toàn & Tiêu Chuẩn Bảo Quản Kho Bãi
        </h1>
        <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
          Tài sản của bạn tại BoxifyX được bảo vệ bằng công nghệ khóa IOT thời gian thực, chốt niêm phong tamper-evident chống tráo đồ và kho tiêu chuẩn máy lạnh 25°C Tân Bình.
        </p>
      </div>

      {/* Trust & Security Component */}
      <TrustAndSecurity />

      {/* Warehouse Specs Grid */}
      <div className="p-8 sm:p-10 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-6 text-left">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-zinc-950">Thông Số Kỹ Thuật Kho Tổng Tân Bình</h3>
            <p className="text-xs text-zinc-500">Khu Logistics Tân Bình, Đường Trường Chinh, Q. Tân Bình, TP.HCM</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-zinc-100 text-xs">
          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5">
            <span className="font-extrabold text-zinc-950 block text-sm">Kiểm Soát Vi Khí Hậu</span>
            <p className="text-zinc-600">Nhiệt độ ổn định 24-26°C, độ ẩm &lt; 60% quanh năm. Hệ thống lọc bụi không khí khử mùi.</p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5">
            <span className="font-extrabold text-zinc-950 block text-sm">PCCC & Chống Ngập</span>
            <p className="text-zinc-600">Hệ thống chữa cháy tự động Sprinkler FM-200, sàn kho cao ráo cách mặt đất 1.2m chống ngập triều cường.</p>
          </div>

          <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5">
            <span className="font-extrabold text-zinc-950 block text-sm">Giám Sát & Truy Xuất QR</span>
            <p className="text-zinc-600">Mỗi vị trí kệ (Bin Location) gắn mã QR định vị chính xác kiện hàng trong 3 giây.</p>
          </div>
        </div>
      </div>

    </div>
  );
};
