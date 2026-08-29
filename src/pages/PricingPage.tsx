import React from 'react';
import { PricingTable } from '../components/PricingTable';
import { FAQSection } from '../components/FAQSection';
import { PageView } from '../components/Navbar';
import { ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

interface PricingPageProps {
  onNavigate: (page: PageView) => void;
}

export const PricingPage: React.FC<PricingPageProps> = ({ onNavigate }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      
      {/* Header Banner */}
      <div className="text-center space-y-3 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white relative overflow-hidden shadow-glow">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-950/30 text-white text-xs font-bold border border-white/20 uppercase tracking-wider">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Biểu Phí Niêm Yết Minh Bạch</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Bảng Giá Dịch Vụ BoxifyX
        </h1>
        <p className="text-xs sm:text-sm text-amber-100 max-w-xl mx-auto font-medium">
          Không phụ phí ẩn. Tự động áp dụng các ưu đãi giảm giá tốt nhất khi gửi đồ dài hạn tại TP.HCM.
        </p>
      </div>

      {/* Pricing Matrix */}
      <PricingTable
        onSelectLocker={() => onNavigate('locker')}
        onSelectValet={() => onNavigate('valet')}
      />

      {/* FAQ Accordion */}
      <FAQSection />
    </div>
  );
};
