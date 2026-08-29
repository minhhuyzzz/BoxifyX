import React from 'react';
import { PageView } from './Navbar';
import { PolicyTab } from '../pages/PolicyPage';
import {
  Phone,
  Mail,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

// Clean custom pin for Head Office on Mini Map
const hqMiniIcon = L.divIcon({
  className: 'hq-mini-pin',
  html: `
    <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; transform: translate(-16px, -16px);">
      <div style="position: absolute; inset: -2px; border-radius: 9999px; background: rgba(245, 158, 11, 0.5); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
      <div style="position: relative; z-index: 10; display: flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 8px; background: #ea580c; color: white; border: 2px solid white; box-shadow: 0 2px 8px rgba(0,0,0,0.3); font-size: 12px;">
        🏢
      </div>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

interface FooterProps {
  onNavigate?: (page: PageView, policyTab?: PolicyTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const handleNav = (page: PageView, policyTab?: PolicyTab) => {
    if (onNavigate) {
      onNavigate(page, policyTab);
    } else {
      if (page === 'policy' && policyTab) {
        window.location.hash = `#/policy?tab=${policyTab}`;
      } else {
        window.location.hash = `#/${page}`;
      }
    }
  };

  return (
    <footer className="bg-zinc-950 text-white border-t border-zinc-800 pt-12 pb-8 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

        {/* 4-Column Grid Structure */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-10 border-b border-zinc-800/80">

          {/* CỘT 1: THƯƠNG HIỆU & TỔNG ĐÀI (3.5 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <div
              onClick={() => handleNav('home')}
              className="flex items-center gap-3 cursor-pointer select-none group inline-flex"
            >
              <div className="h-10 w-auto flex items-center justify-center p-1 bg-white rounded-xl group-hover:scale-105 transition-transform">
                <img
                  src="/logo.png"
                  alt="BoxifyX Logo"
                  className="h-8 w-auto object-contain"
                />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Boxify<span className="text-amber-500">X</span>
              </span>
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed font-normal">
              Hệ thống lưu trữ thông minh tích hợp Smart Locker theo giờ và Lưu Kho Valet Storage giao nhận tận nơi với 27 trạm phủ khắp TP. Hồ Chí Minh.
            </p>

            <div className="space-y-2 pt-1 text-xs">
              <a
                href="tel:19008899"
                className="flex items-center gap-2 text-zinc-200 hover:text-amber-400 transition-colors"
              >
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Phone className="w-3.5 h-3.5" />
                </div>
                <span className="font-bold text-white">0777 868 762</span>
                <span className="text-zinc-500 text-[11px]">(Miễn cước 24/7)</span>
              </a>

              <a
                href="mailto:hotro@boxifyx.vn"
                className="flex items-center gap-2 text-zinc-400 hover:text-amber-400 transition-colors"
              >
                <div className="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Mail className="w-3.5 h-3.5" />
                </div>
                <span className="text-zinc-300">hotro@boxifyx.vn</span>
              </a>
            </div>
          </div>

          {/* CỘT 2: DỊCH VỤ & GIẢI PHÁP (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-extrabold text-xs text-white uppercase tracking-wider text-amber-400">
              DỊCH VỤ & GIẢI PHÁP
            </h4>
            <ul className="space-y-2.5 text-xs text-zinc-400 font-medium">
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('locker')}
                  className="hover:text-amber-400 hover:translate-x-0.5 transition-all text-left block"
                >
                  Smart Locker Theo Giờ
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('valet')}
                  className="hover:text-amber-400 hover:translate-x-0.5 transition-all text-left block"
                >
                  Lưu Kho Valet Giao Tận Nhà
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('closet')}
                  className="hover:text-amber-400 hover:translate-x-0.5 transition-all text-left block"
                >
                  Tủ Đồ Số Hóa (Digital Closet)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('pricing')}
                  className="hover:text-amber-400 hover:translate-x-0.5 transition-all text-left block"
                >
                  Bảng Giá Dịch Vụ Minh Bạch
                </button>
              </li>
            </ul>
          </div>

          {/* CỘT 3: HỖ TRỢ & THÔNG TIN DOANH NGHIỆP (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-extrabold text-xs text-white uppercase tracking-wider text-amber-400">
              HỖ TRỢ & CHÍNH SÁCH
            </h4>

            <ul className="space-y-2.5 text-xs text-zinc-400 font-medium">
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('faq')}
                  className="hover:text-amber-400 hover:translate-x-0.5 transition-all text-left block"
                >
                  Câu Hỏi Thường Gặp (FAQ)
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('policy')}
                  className="hover:text-amber-400 hover:translate-x-0.5 transition-all text-left block"
                >
                  Trung Tâm Điều Khoản & Chính Sách
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('security')}
                  className="hover:text-amber-400 hover:translate-x-0.5 transition-all text-left block"
                >
                  Tiêu Chuẩn Bảo Mật An Ninh 5 Lớp
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => handleNav('locker')}
                  className="hover:text-amber-400 hover:translate-x-0.5 transition-all text-left block"
                >
                  Mạng Lưới 27 Trạm Tủ TP.HCM
                </button>
              </li>
            </ul>
          </div>

          {/* CỘT 4: TRỤ SỞ CHÍNH & BẢN ĐỒ MINI (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-extrabold text-xs text-white uppercase tracking-wider text-amber-400">
              TRỤ SỞ CHÍNH TẠI TP.HCM
            </h4>

            <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs space-y-1 text-zinc-300">
              <div className="flex items-start gap-1.5 font-semibold text-white">
                <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                <span>12 Nguyễn Văn Bảo, Phường 4, Quận Gò Vấp, TP. Hồ Chí Minh</span>
              </div>
              <p className="text-[11px] text-zinc-500 pl-5">
                (Gần Đại học Công Nghiệp TP.HCM - Mở cửa 24/7)
              </p>
            </div>

            {/* Mini Map Container */}
            <div className="h-32 w-full rounded-2xl overflow-hidden border border-zinc-800 relative z-0">
              <MapContainer
                center={[10.8222, 106.6873]}
                zoom={14}
                scrollWheelZoom={false}
                zoomControl={false}
                attributionControl={false}
                className="h-full w-full"
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Marker position={[10.8222, 106.6873]} icon={hqMiniIcon}>
                  <Popup>
                    <div className="text-xs font-bold text-zinc-950 p-1">
                      🏢 BoxifyX Trụ Sở Chính<br />
                      <span className="text-[10px] font-normal text-zinc-600">12 Nguyễn Văn Bảo, Gò Vấp</span>
                    </div>
                  </Popup>
                </Marker>
              </MapContainer>

              <button
                type="button"
                onClick={() => handleNav('locker')}
                className="absolute bottom-2 right-2 z-[400] px-2.5 py-1 rounded-lg bg-zinc-950/90 hover:bg-amber-500 hover:text-zinc-950 text-white text-[10px] font-bold border border-zinc-700 shadow-md backdrop-blur transition-all flex items-center gap-1"
              >
                <span>Xem 27 Trạm</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Copyright & Guarantee */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <span>© 2026 BoxifyX Corporation. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <span className="text-zinc-400">Nền Tảng Lưu Trữ Cá Nhân Kỹ Thuật Số</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-zinc-400 font-medium">
            <button
              type="button"
              onClick={() => handleNav('policy', 'terms')}
              className="hover:text-white transition-colors"
            >
              Điều khoản
            </button>
            <button
              type="button"
              onClick={() => handleNav('policy', 'privacy')}
              className="hover:text-white transition-colors"
            >
              Bảo mật dữ liệu
            </button>
            <button
              type="button"
              onClick={() => handleNav('faq')}
              className="hover:text-white transition-colors"
            >
              FAQ
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
