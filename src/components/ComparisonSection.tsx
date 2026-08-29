import React, { useState } from 'react';
import { Check, X, Sparkles, HelpCircle, ShieldCheck, ArrowRight } from 'lucide-react';

interface ComparisonSectionProps {
  onSelectLocker: () => void;
  onSelectValet: () => void;
}

export const ComparisonSection: React.FC<ComparisonSectionProps> = ({ onSelectLocker, onSelectValet }) => {
  const comparisonRows = [
    {
      feature: 'Vận chuyển hai chiều tận nhà (Giao thùng & nhận đồ)',
      valet: true,
      locker: false,
      traditional: false,
    },
    {
      feature: 'Kho máy lạnh chuẩn 25°C & kiểm soát độ ẩm < 60%',
      valet: true,
      locker: false,
      traditional: true,
    },
    {
      feature: 'Hệ thống camera an ninh & giám sát AI 24/7',
      valet: true,
      locker: true,
      traditional: true,
    },
    {
      feature: 'Chỉ trả tiền đúng theo không gian & số thùng bạn sử dụng',
      valet: true,
      locker: true,
      traditional: false,
    },
    {
      feature: 'Tự phục vụ gửi & lấy đồ tức thì 24/7 qua mã PIN / QR Code',
      valet: false,
      locker: true,
      traditional: false,
    },
    {
      feature: 'Quản lý ảnh chụp từng thùng qua Tủ Đồ Ảo (Digital Closet)',
      valet: true,
      locker: false,
      traditional: false,
    },
    {
      feature: 'Chốt niêm phong Tamper-Evident Seal chống tráo đồ',
      valet: true,
      locker: false,
      traditional: false,
    },
    {
      feature: 'Tự động giảm 20% tổng cước khi thuê dài hạn',
      valet: true,
      locker: true,
      traditional: false,
    },
    {
      feature: 'Bảo hiểm tài sản tự động lên đến 20.000.000 đ / kiện',
      valet: true,
      locker: false,
      traditional: false,
    },
  ];

  return (
    <section className="py-12 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
          <span>So Sánh Chi Tiết Tính Năng</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 tracking-tight">
          Lựa Chọn Giải Pháp Phù Hợp Cho Bạn
        </h2>
        <p className="text-sm text-zinc-600 leading-relaxed font-normal">
          Bảng đối chiếu minh bạch giữa các hình thức lưu trữ tại BoxifyX và kho tự quản truyền thống.
        </p>
      </div>

      {/* Comparison Table Container (Styled like the clean card in the screenshot) */}
      <div className="max-w-5xl mx-auto rounded-3xl border border-blue-100/90 shadow-card bg-white overflow-hidden text-left">
        
        {/* Table Header */}
        <div className="grid grid-cols-12 bg-slate-50/90 border-b border-slate-200/80 px-6 py-4 text-xs font-black text-slate-700 uppercase tracking-wider items-center">
          <div className="col-span-6 sm:col-span-6 text-zinc-900">
            Tính Năng Dịch Vụ
          </div>
          <div className="col-span-3 sm:col-span-3 text-center text-amber-600 font-extrabold flex items-center justify-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>VALET STORAGE</span>
          </div>
          <div className="col-span-3 sm:col-span-3 text-center text-zinc-700 font-extrabold flex items-center justify-center gap-1">
            <span className="w-2 h-2 rounded-full bg-zinc-900" />
            <span>SMART LOCKER</span>
          </div>
        </div>

        {/* Table Body Rows */}
        <div className="divide-y divide-slate-100">
          {comparisonRows.map((row, idx) => (
            <div
              key={idx}
              className={`grid grid-cols-12 px-6 py-4 items-center text-xs sm:text-sm transition-colors ${
                idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'
              } hover:bg-amber-50/30`}
            >
              {/* Feature Name */}
              <div className="col-span-6 sm:col-span-6 font-medium text-zinc-800 pr-3 leading-relaxed">
                {row.feature}
              </div>

              {/* Valet Storage Value */}
              <div className="col-span-3 sm:col-span-3 flex justify-center">
                {row.valet ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                    <X className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>

              {/* Smart Locker Value */}
              <div className="col-span-3 sm:col-span-3 flex justify-center">
                {row.locker ? (
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                ) : (
                  <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center">
                    <X className="w-3.5 h-3.5" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Table Footer Action Bar */}
        <div className="p-5 bg-gradient-to-r from-slate-50 via-amber-50/40 to-slate-50 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-xs text-zinc-600 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Cam kết 100% minh bạch cước phí & bảo vệ quyền lợi khách hàng.</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onSelectLocker}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold text-xs shadow-sm transition-all active:scale-95"
            >
              Đặt Smart Locker
            </button>
            <button
              onClick={onSelectValet}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-xs shadow-glow transition-all active:scale-95"
            >
              Lưu Kho Valet
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};
