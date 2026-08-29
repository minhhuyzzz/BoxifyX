import React, { useState, useEffect } from 'react';
import { Package, Lock, Box, ShieldCheck, Sparkles, User, LogOut, ChevronDown, Shield } from 'lucide-react';

export type PageView = 'home' | 'locker' | 'valet' | 'closet' | 'pricing' | 'security' | 'policy' | 'faq';

interface NavbarProps {
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  currentUser: { id: string; email: string; fullName: string; phone: string } | null;
  onOpenAuth: (notice?: string) => void;
  onLogout: () => void;
  activeBookingsCount: number;
  onOpenBookings: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  setCurrentPage,
  currentUser,
  onOpenAuth,
  onLogout,
  activeBookingsCount,
  onOpenBookings,
}) => {
  const [showUserMenu, setShowUserMenu] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleBookingsClick = () => {
    if (!currentUser) {
      onOpenAuth('Vui lòng đăng nhập tài khoản để xem đơn thuê tủ & đơn lưu kho của bạn.');
      return;
    }
    onOpenBookings();
  };

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled
        ? 'bg-white/85 backdrop-blur-xl border-b border-zinc-200/80 shadow-sm py-3'
        : 'bg-transparent border-b border-transparent py-5'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">

          {/* Brand Logo & Name */}
          <div
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-3 cursor-pointer group select-none shrink-0"
          >
            <div className="h-14 w-auto flex items-center justify-center group-hover:scale-105 transition-transform">
              <img
                src="/logo.png"
                alt="BoxifyX Logo"
                className="h-14 w-auto object-contain"
              />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-2xl font-black tracking-tight text-zinc-950">
                  Boxify<span className="text-amber-500">X</span>
                </span>

              </div>
              <p className="text-[11px] text-zinc-500 font-semibold tracking-tight">Smart Locker & Valet Storage</p>
            </div>
          </div>

          {/* Navigation Links - Pill Container */}
          <nav className="hidden lg:flex items-center gap-1 bg-white/90 backdrop-blur-md p-1.5 rounded-2xl border border-zinc-200/90 shadow-sm">
            <button
              onClick={() => setCurrentPage('home')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${currentPage === 'home'
                ? 'bg-zinc-950 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80'
                }`}
            >
              Trang Chủ
            </button>

            <button
              onClick={() => setCurrentPage('locker')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${currentPage === 'locker'
                ? 'bg-zinc-950 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80'
                }`}
            >

              <span>Trạm tủ</span>
            </button>

            <button
              onClick={() => setCurrentPage('valet')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${currentPage === 'valet'
                ? 'bg-zinc-950 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80'
                }`}
            >

              <span>Lưu Kho Valet</span>
            </button>

            <button
              onClick={() => setCurrentPage('closet')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${currentPage === 'closet'
                ? 'bg-zinc-950 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80'
                }`}
            >

              <span>Tủ Đồ</span>
            </button>

            <button
              onClick={() => setCurrentPage('pricing')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${currentPage === 'pricing'
                ? 'bg-zinc-950 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80'
                }`}
            >
              Bảng Giá
            </button>



            <button
              onClick={() => setCurrentPage('policy')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${currentPage === 'policy'
                ? 'bg-zinc-950 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80'
                }`}
            >
              <span>Chính Sách</span>
            </button>

            <button
              onClick={() => setCurrentPage('faq')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${currentPage === 'faq'
                ? 'bg-zinc-950 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100/80'
                }`}
            >
              <span>FAQ</span>
            </button>
          </nav>

          {/* Right Action Buttons Area with Zero-Shift Rigid Dimensions */}
          <div className="flex items-center gap-3 shrink-0">

            {/* 'Đơn Của Tôi' (Fixed 115px Width + Floating Absolute Badge to prevent shift) */}
            <div className="relative w-[115px] h-10 shrink-0">
              <button
                onClick={handleBookingsClick}
                className="w-full h-full flex items-center justify-center gap-1.5 rounded-xl bg-white/90 hover:bg-amber-50 text-zinc-900 border border-amber-300/80 font-bold text-xs transition-all shadow-sm active:scale-95 select-none"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span>Đơn Của Tôi</span>
              </button>

              {/* Absolute Positioned Badge (Zero Width Impact) */}
              {currentUser && activeBookingsCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 px-1.5 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-black shadow pointer-events-none">
                  {activeBookingsCount}
                </span>
              )}
            </div>

            {/* Auth Slot: Fixed Exactly 120px Width in ALL States */}
            <div className="relative w-[120px] h-10 shrink-0">
              {currentUser ? (
                <>
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="w-full h-full flex items-center justify-between px-2.5 rounded-xl bg-zinc-950 text-white text-xs font-bold hover:bg-zinc-800 transition-colors shadow-md border border-zinc-800 select-none"
                  >
                    <div className="w-5 h-5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-center font-black text-[10px] shrink-0">
                      {currentUser.email.charAt(0).toUpperCase()}
                    </div>
                    {/* Fixed-length truncated user identifier */}
                    <span className="truncate text-amber-300 font-mono text-[11px] font-bold max-w-[60px]">
                      {currentUser.email.split('@')[0]}
                    </span>
                    <ChevronDown className="w-3 h-3 text-zinc-400 shrink-0" />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-zinc-200 py-3 z-50 animate-fade-in text-left text-xs">
                      <div className="px-4 pb-3 border-b border-zinc-100 space-y-1">
                        <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Tài khoản đăng nhập:</p>
                        <p className="font-mono font-bold text-zinc-950 break-all text-xs text-amber-600">{currentUser.email}</p>
                        {currentUser.fullName && (
                          <p className="text-zinc-600 font-semibold">{currentUser.fullName} ({currentUser.phone || 'SĐT'})</p>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onOpenBookings();
                        }}
                        className="w-full px-4 py-2.5 text-left text-zinc-700 hover:bg-amber-50 hover:text-zinc-950 font-bold flex items-center gap-2 mt-1"
                      >
                        <Package className="w-4 h-4 text-amber-500" />
                        <span>Xem danh sách đơn ({activeBookingsCount})</span>
                      </button>

                      <button
                        onClick={() => {
                          setShowUserMenu(false);
                          onLogout();
                        }}
                        className="w-full px-4 py-2.5 text-left text-red-600 hover:bg-red-50 font-bold flex items-center gap-2 border-t border-zinc-100 mt-2"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Đăng xuất tài khoản</span>
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => onOpenAuth()}
                  className="w-full h-full flex items-center justify-center gap-1.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-extrabold text-xs transition-all shadow-md active:scale-95 border border-zinc-800 select-none"
                >
                  <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>Đăng Nhập</span>
                </button>
              )}
            </div>

          </div>
        </div>
      </div>
    </header>
  );
};
