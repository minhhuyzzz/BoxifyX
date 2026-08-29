import React from 'react';
import { Hero } from '../components/Hero';
import { HowItWorks } from '../components/HowItWorks';
import { ComparisonSection } from '../components/ComparisonSection';
import { PricingTable } from '../components/PricingTable';
import { ClosetShowcaseSection } from '../components/ClosetShowcaseSection';
import { TrustAndSecurity } from '../components/TrustAndSecurity';
import { Testimonials } from '../components/Testimonials';
import { FAQSection } from '../components/FAQSection';
import { CtaBanner } from '../components/CtaBanner';
import { PageView } from '../components/Navbar';
import { ArrowRight, MapPin, Box, Lock, Sparkles, CheckCircle2 } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageView) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-16">
      {/* 1. Hero Section */}
      <Hero
        onNavigateToLocker={() => onNavigate('locker')}
        onNavigateToValet={() => onNavigate('valet')}
      />

      {/* 2. Main Service Split Teaser */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Smart Locker Card Teaser */}
          <div className="p-8 rounded-3xl bg-zinc-950 text-white shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden border border-zinc-800">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                <Lock className="w-3.5 h-3.5" />
                <span>Gửi Đồ Theo Giờ</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white">
                Mạng Lưới Smart Locker Phủ Khắp TP.HCM
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed font-normal">
                Tủ tự động tại Sân bay Tân Sơn Nhất, Ga Metro Bến Thành, Landmark 81 và Phố Bùi Viện. Đặt tủ, mở khóa 1-chạm qua web hoặc gửi hộ P2P.
              </p>
              <ul className="text-xs text-zinc-300 space-y-2 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Size S chỉ từ <strong>10.000 đ</strong> / 2 giờ đầu</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  <span>Tự động <strong>giảm 20%</strong> khi thuê liên tục từ 24h</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onNavigate('locker')}
              className="py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-extrabold text-xs shadow-glow flex items-center justify-center gap-2 transition-all"
            >
              <span>Xem Bản Đồ & Đặt Smart Locker</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Valet Storage Card Teaser */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 shadow-card flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-900 text-xs font-bold border border-orange-200">
                <Box className="w-3.5 h-3.5 text-orange-600" />
                <span>Lưu Kho Theo Tháng</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-zinc-950">
                Dịch Vụ Valet Storage Giao Thùng Tận Nhà
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed font-normal">
                Chúng tôi mang thùng tiêu chuẩn đến tận cửa, nhận đồ niêm phong và bảo quản trong kho trung tâm Tân Bình nhiệt độ 25°C quanh năm.
              </p>
              <ul className="text-xs text-zinc-700 space-y-2 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Thùng Standard <strong>120.000 đ</strong> / tháng • Miễn phí 3km ship</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-orange-600" />
                  <span>Quản lý ảnh chụp đồ qua <strong>Tủ Đồ Ảo (Digital Closet)</strong></span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => onNavigate('valet')}
              className="py-3.5 px-6 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white font-extrabold text-xs shadow-md flex items-center justify-center gap-2 transition-all"
            >
              <span>Tính Cước Ship GPS & Đặt Thùng</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>

        </div>
      </section>

      {/* 3. Comparison Section (Screenshot-matching Matrix) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ComparisonSection
          onSelectLocker={() => onNavigate('locker')}
          onSelectValet={() => onNavigate('valet')}
        />
      </div>

      {/* 4. Professional Pricing Matrix on HomePage */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <PricingTable
          onSelectLocker={() => onNavigate('locker')}
          onSelectValet={() => onNavigate('valet')}
        />
      </div>

      {/* 5. Tủ Đồ Ảo Showcase on HomePage */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <ClosetShowcaseSection
          onNavigateToCloset={() => onNavigate('closet')}
        />
      </div>

      {/* 6. How It Works */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HowItWorks />
      </div>

      {/* 7. Trust & Security */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TrustAndSecurity />
      </div>

      {/* 8. Customer Reviews */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Testimonials />
      </div>

      {/* 9. FAQ Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FAQSection onNavigateToFaq={() => onNavigate('faq')} />
      </div>

      {/* 10. CTA Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CtaBanner
          onSelectLocker={() => onNavigate('locker')}
          onSelectValet={() => onNavigate('valet')}
        />
      </div>
    </div>
  );
};
