import React from 'react';
import { PageView } from './Navbar';
import { Home, Lock, Box, Sparkles, Package } from 'lucide-react';

interface MobileBottomNavProps {
  currentPage: PageView;
  setCurrentPage: (page: PageView) => void;
  activeBookingsCount: number;
  onOpenBookings: () => void;
  currentUser: { id: string; email: string; fullName: string; phone: string } | null;
  onOpenAuth: (notice?: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentPage,
  setCurrentPage,
  activeBookingsCount,
  onOpenBookings,
  currentUser,
  onOpenAuth,
}) => {
  const handleOrdersClick = () => {
    if (!currentUser) {
      onOpenAuth('Vui lòng đăng nhập tài khoản để xem các đơn hàng đang hoạt động.');
      return;
    }
    onOpenBookings();
  };

  const navItems = [
    {
      id: 'home' as PageView,
      label: 'Trang Chủ',
      icon: Home,
      action: () => setCurrentPage('home'),
      isActive: currentPage === 'home',
    },
    {
      id: 'locker' as PageView,
      label: 'Smart Locker',
      icon: Lock,
      action: () => setCurrentPage('locker'),
      isActive: currentPage === 'locker',
    },
    {
      id: 'valet' as PageView,
      label: 'Lưu Kho',
      icon: Box,
      action: () => setCurrentPage('valet'),
      isActive: currentPage === 'valet',
    },
    {
      id: 'closet' as PageView,
      label: 'Tủ Đồ',
      icon: Sparkles,
      action: () => setCurrentPage('closet'),
      isActive: currentPage === 'closet',
    },
    {
      id: 'orders' as const,
      label: 'Đơn Hàng',
      icon: Package,
      action: handleOrdersClick,
      isActive: false,
      badge: currentUser && activeBookingsCount > 0 ? activeBookingsCount : undefined,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-zinc-950/95 backdrop-blur-2xl border-t border-zinc-800/90 shadow-2xl px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] select-none"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.isActive;
          return (
            <button
              key={item.label}
              type="button"
              onClick={item.action}
              className={`relative flex flex-col items-center justify-center flex-1 py-1 px-1 rounded-2xl transition-all duration-200 active:scale-90 touch-manipulation min-h-[48px] ${
                active ? 'text-amber-400' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              {/* Active glow background pill */}
              {active && (
                <span className="absolute inset-x-2 -top-0.5 h-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_0_8px_rgba(245,158,11,0.8)]" />
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform ${
                    active ? 'scale-110 stroke-[2.5]' : 'scale-100 stroke-[1.8]'
                  }`}
                />
                {item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 px-1.5 py-0.2 min-w-[16px] h-4 rounded-full bg-orange-500 text-white text-[9px] font-black flex items-center justify-center shadow-md animate-pulse">
                    {item.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] tracking-tight mt-1 truncate max-w-full ${
                  active ? 'font-black text-amber-300' : 'font-semibold text-zinc-400'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
