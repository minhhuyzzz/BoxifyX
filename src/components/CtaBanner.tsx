import React from 'react';
import { Sparkles, ArrowRight, Gift, ShieldCheck } from 'lucide-react';

interface CtaBannerProps {
  onSelectLocker: () => void;
  onSelectValet: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onSelectLocker, onSelectValet }) => {
  return (
    <section className="py-12">
      <div className="rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-8 sm:p-14 text-white shadow-glow-lg relative overflow-hidden text-center space-y-6">
        
        {/* Background decorative rings */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full border-8 border-white/10 pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full border-8 border-white/10 pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-950/30 backdrop-blur-md text-amber-200 text-xs font-black uppercase tracking-wider border border-white/20">
          <Gift className="w-4 h-4 text-amber-300" />
          <span>Ưu Đãi Đặc Biệt Cho Người Dùng Mới</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white max-w-2xl mx-auto leading-tight">
          Sẵn Sàng Giải Phóng Không Gian Sống Của Bạn?
        </h2>

        <p className="text-sm sm:text-base text-amber-100 max-w-xl mx-auto font-medium">
          Nhập mã voucher <span className="bg-zinc-950 px-2.5 py-1 rounded-lg text-amber-300 font-mono font-black tracking-wider">BOXIFYSAIGON</span> để nhận ngay ưu đãi giảm 50.000 đ cho đơn gửi đồ hoặc lưu kho đầu tiên.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={onSelectLocker}
            className="px-7 py-4 rounded-2xl bg-zinc-950 text-white font-bold text-sm hover:bg-zinc-900 transition-all shadow-xl active:scale-95 flex items-center gap-2"
          >
            <span>Đặt Smart Locker Theo Giờ</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>

          <button
            onClick={onSelectValet}
            className="px-7 py-4 rounded-2xl bg-white text-zinc-950 font-bold text-sm hover:bg-amber-50 transition-all shadow-xl active:scale-95 flex items-center gap-2"
          >
            <span>Lưu Kho Valet Storage Theo Tháng</span>
          </button>
        </div>

      </div>
    </section>
  );
};
