import React from 'react';
import { LockerStation } from '../types';
import { LockerMap } from '../components/LockerMap';
import { Lock, Sparkles, Shield, Clock, Smartphone, CheckCircle2 } from 'lucide-react';

interface LockerPageProps {
  stations: LockerStation[];
  onSelectStation: (station: LockerStation) => void;
}

export const LockerPage: React.FC<LockerPageProps> = ({ stations, onSelectStation }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* Header Banner */}
      <div className="text-left space-y-3 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white relative overflow-hidden shadow-xl border border-zinc-800">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 uppercase tracking-wider">
          <Lock className="w-3.5 h-3.5 text-amber-400" />
          <span>Mạng Lưới Smart Locker Phủ Khắp TP.HCM</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
          Gửi Đồ Tự Động 24/7 • Mở Tủ 1-Chạm
        </h1>
        <p className="text-xs sm:text-sm text-zinc-300 max-w-2xl leading-relaxed">
          Tủ khóa thông minh tích hợp chốt IOT, mở khóa bằng mã PIN 6 số hoặc quét mã QR. Hỗ trợ tính năng gửi hộ & nhận hàng P2P an toàn.
        </p>

        {/* Quick Pricing Pill */}
        <div className="flex flex-wrap gap-4 pt-4 text-xs">
          <div className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center gap-2">
            <span className="text-zinc-400">Size S:</span>
            <strong className="text-amber-400 font-black">10k / 2h</strong>
            <span className="text-zinc-500">(+5k/h tiếp)</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center gap-2">
            <span className="text-zinc-400">Size M:</span>
            <strong className="text-orange-400 font-black">18k / 2h</strong>
            <span className="text-zinc-500">(+8k/h tiếp)</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center gap-2">
            <span className="text-zinc-400">Size L:</span>
            <strong className="text-white font-black">25k / 2h</strong>
            <span className="text-zinc-500">(+12k/h tiếp)</span>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Giảm 20% khi thuê ≥ 24h</span>
          </div>
        </div>
      </div>

      {/* Embedded Map & Stations Grid */}
      <LockerMap
        stations={stations}
        onSelectStation={onSelectStation}
      />
    </div>
  );
};
