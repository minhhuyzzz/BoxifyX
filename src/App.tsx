import React, { useState, useEffect } from 'react';
import { Navbar, PageView } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { HomePage } from './pages/HomePage';
import { LockerPage } from './pages/LockerPage';
import { ValetPage } from './pages/ValetPage';
import { ClosetPage } from './pages/ClosetPage';
import { PricingPage } from './pages/PricingPage';
import { SecurityPage } from './pages/SecurityPage';
import { PolicyPage, PolicyTab } from './pages/PolicyPage';
import { FaqPage } from './pages/FaqPage';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { LockerBookingModal } from './components/LockerBookingModal';
import { LockerUnlockModal } from './components/LockerUnlockModal';
import { ActiveBookingsDrawer } from './components/ActiveBookingsDrawer';
import { ChatWidget } from './components/ChatWidget';
import { LockerStation, LockerBooking, ValetOrder } from './types';
import { MOCK_STATIONS } from './data/mockData';
import { supabaseService } from './services/supabaseService';
import { supabase } from './lib/supabaseClient';

const PAGE_TO_PATH: Record<PageView, string> = {
  home: '/',
  locker: '/smart-locker',
  valet: '/valet-storage',
  closet: '/digital-closet',
  pricing: '/pricing',
  security: '/security',
  policy: '/policy',
  faq: '/faq',
};

const parseCurrentRoute = (): { page: PageView; tab?: PolicyTab } => {
  // Lấy đường dẫn từ pathname hoặc fallback sang hash nếu có
  let raw = window.location.pathname || '/';
  if (window.location.hash) {
    raw = window.location.hash.replace(/^#\/?/, '/');
  }

  const [routePath, queryString] = raw.split('?');
  const path = (routePath || '/').toLowerCase().replace(/^\/+|\/+$/g, '').trim();
  const searchParams = new URLSearchParams(queryString || window.location.search || '');
  const tabParam = searchParams.get('tab') as PolicyTab;
  const validTabs: PolicyTab[] = ['terms', 'privacy', 'sealing', 'insurance', 'dispute'];
  const matchedTab = validTabs.includes(tabParam) ? tabParam : undefined;

  if (path === 'smart-locker' || path === 'locker') return { page: 'locker' };
  if (path === 'valet-storage' || path === 'valet') return { page: 'valet' };
  if (path === 'digital-closet' || path === 'closet') return { page: 'closet' };
  if (path === 'pricing' || path === 'bang-gia') return { page: 'pricing' };
  if (path === 'security' || path === 'an-ninh') return { page: 'security' };
  if (path === 'faq' || path === 'cau-hoi-thuong-gap' || path === 'tro-giup') return { page: 'faq' };
  if (
    path === 'policy' ||
    path === 'terms' ||
    path === 'privacy' ||
    path === 'insurance' ||
    path === 'sealing' ||
    path === 'dispute' ||
    path === 'chinh-sach'
  ) {
    let tab = matchedTab;
    if (!tab) {
      if (path === 'privacy') tab = 'privacy';
      else if (path === 'insurance') tab = 'insurance';
      else if (path === 'sealing') tab = 'sealing';
      else if (path === 'dispute') tab = 'dispute';
      else tab = 'terms';
    }
    return { page: 'policy', tab };
  }
  return { page: 'home' };
};

export function App() {
  const initialRoute = parseCurrentRoute();
  const [currentPage, setCurrentPage] = useState<PageView>(initialRoute.page);
  const [policyTab, setPolicyTab] = useState<PolicyTab>(initialRoute.tab || 'terms');
  const [stations, setStations] = useState<LockerStation[]>(MOCK_STATIONS);
  
  // Auth state
  const [currentUser, setCurrentUser] = useState<{
    id: string;
    email: string;
    fullName: string;
    phone: string;
  } | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [authNotice, setAuthNotice] = useState<string>('');

  // Modals & Drawers state
  const [bookingModalStation, setBookingModalStation] = useState<LockerStation | null>(null);
  const [unlockModalBooking, setUnlockModalBooking] = useState<LockerBooking | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);

  // Sync popstate / hashchange (forward / back browser buttons)
  useEffect(() => {
    const handleRouteChange = () => {
      const resolved = parseCurrentRoute();
      setCurrentPage(resolved.page);
      if (resolved.page === 'policy' && resolved.tab) {
        setPolicyTab(resolved.tab);
      }
    };

    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  // Check existing Supabase session and load all customer data on mount
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setCurrentUser({
          id: session.user.id,
          email: session.user.email || '',
          fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
          phone: session.user.user_metadata?.phone || '',
        });
      }
    });

    // Fetch stations from Supabase
    supabaseService.getStations().then((liveStations) => {
      if (liveStations && liveStations.length > 0) {
        setStations(liveStations);
      }
    });

    // Fetch valet orders (Tủ đồ số hóa) from Supabase & LocalStorage
    supabaseService.getValetOrders().then((liveValetOrders) => {
      if (liveValetOrders && liveValetOrders.length > 0) {
        setValetOrders(liveValetOrders);
      }
    });

    // Fetch locker bookings (Đơn Smart Locker) from Supabase & LocalStorage
    supabaseService.getLockerBookings().then((liveBookings) => {
      if (liveBookings && liveBookings.length > 0) {
        setLockerBookings(liveBookings);
      }
    });
  }, []);

  // Re-sync customer orders whenever user logs in
  useEffect(() => {
    if (currentUser) {
      supabaseService.getValetOrders().then((liveValetOrders) => {
        if (liveValetOrders && liveValetOrders.length > 0) {
          setValetOrders(liveValetOrders);
        }
      });
      supabaseService.getLockerBookings().then((liveBookings) => {
        if (liveBookings && liveBookings.length > 0) {
          setLockerBookings(liveBookings);
        }
      });
    }
  }, [currentUser]);

  // Active bookings list (khởi tạo từ LocalStorage để không bao giờ bị mất)
  const [lockerBookings, setLockerBookings] = useState<LockerBooking[]>(() => {
    const local = supabaseService.getLocalLockerBookings();
    if (local.length > 0) return local;
    return [
      {
        id: 'LB-90211',
        stationId: 'sta-tsn',
        stationName: 'BoxifyX Sân Bay Tân Sơn Nhất (Ga Quốc Tế)',
        lockerNumber: 'S-14',
        size: 'S',
        startTime: '08:30',
        estimatedEndTime: '14:30 (Hôm nay)',
        estimatedHours: 6,
        prepaidAmount: 30000,
        overdueAmount: 0,
        totalAmount: 30000,
        pinCode: '852914',
        isP2PEnabled: true,
        p2pRecipientPhone: '0909888777',
        p2pRecipientName: 'Chị Mai Lan',
        status: 'active',
        isDoorOpen: false,
      },
    ];
  });

  // Valet orders list (khởi tạo từ LocalStorage để giữ nguyên Tủ Đồ Số Hóa sau khi reload/login)
  const [valetOrders, setValetOrders] = useState<ValetOrder[]>(() => {
    return supabaseService.getLocalValetOrders();
  });

  const handleConfirmBooking = async (newBooking: LockerBooking) => {
    const updated = [newBooking, ...lockerBookings];
    setLockerBookings(updated);
    await supabaseService.createLockerBooking(newBooking);
  };

  const handleCreateValetOrder = async (newOrder: ValetOrder) => {
    const updated = [newOrder, ...valetOrders];
    setValetOrders(updated);
    await supabaseService.createValetOrder(newOrder);
  };

  const handleUpdateBooking = async (updated: LockerBooking) => {
    const updatedList = lockerBookings.map((b) => (b.id === updated.id ? updated : b));
    setLockerBookings(updatedList);
    await supabaseService.updateLockerBooking(updated.id, updated);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setCurrentUser(null);
    setIsDrawerOpen(false);
  };

  const handleOpenAuthWithNotice = (notice?: string) => {
    setAuthNotice(notice || '');
    setIsAuthOpen(true);
  };

  const handleNavigate = (page: PageView, tab?: PolicyTab) => {
    setCurrentPage(page);
    let targetPath = PAGE_TO_PATH[page] || '/';
    if (page === 'policy') {
      if (tab) {
        setPolicyTab(tab);
        targetPath = `/policy?tab=${tab}`;
      } else {
        targetPath = '/policy';
      }
    }

    if (window.location.pathname !== targetPath || window.location.hash) {
      window.history.pushState({}, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-zinc-900 font-sans selection:bg-amber-500 selection:text-white pb-20 lg:pb-0">
      {/* Navigation Header */}
      <Navbar
        currentPage={currentPage}
        setCurrentPage={handleNavigate}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuthWithNotice}
        onLogout={handleLogout}
        activeBookingsCount={lockerBookings.length + valetOrders.length}
        onOpenBookings={() => setIsDrawerOpen(true)}
      />

      {/* Dedicated Page Router Body */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage onNavigate={handleNavigate} />
        )}

        {currentPage === 'locker' && (
          <LockerPage
            stations={stations}
            onSelectStation={(station) => setBookingModalStation(station)}
          />
        )}

        {currentPage === 'valet' && (
          <ValetPage
            currentUser={currentUser}
            onRequireAuth={handleOpenAuthWithNotice}
            onOrderCreated={handleCreateValetOrder}
          />
        )}

        {currentPage === 'closet' && (
          <ClosetPage
            valetOrders={valetOrders}
            onNavigateToValet={() => handleNavigate('valet')}
            currentUser={currentUser}
            onRequireAuth={handleOpenAuthWithNotice}
          />
        )}

        {currentPage === 'pricing' && (
          <PricingPage onNavigate={handleNavigate} />
        )}

        {currentPage === 'security' && (
          <SecurityPage />
        )}

        {currentPage === 'policy' && (
          <PolicyPage initialTab={policyTab} onNavigate={handleNavigate} />
        )}

        {currentPage === 'faq' && (
          <FaqPage onNavigate={handleNavigate} />
        )}
      </main>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialNotice={authNotice}
        onLoginSuccess={(userData) => {
          setCurrentUser(userData);
          setIsAuthOpen(false);
        }}
      />

      {/* Booking Modal */}
      {bookingModalStation && (
        <LockerBookingModal
          station={bookingModalStation}
          currentUser={currentUser}
          onRequireAuth={handleOpenAuthWithNotice}
          onClose={() => setBookingModalStation(null)}
          onConfirmBooking={handleConfirmBooking}
          onOpenUnlockImmediately={(booking) => {
            setBookingModalStation(null);
            setUnlockModalBooking(booking);
          }}
        />
      )}

      {/* Unlock Simulation Modal */}
      {unlockModalBooking && (
        <LockerUnlockModal
          booking={unlockModalBooking}
          onClose={() => setUnlockModalBooking(null)}
          onUpdateBooking={handleUpdateBooking}
        />
      )}

      {/* Drawer: Active Bookings (Only visible when user is logged in) */}
      <ActiveBookingsDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        lockerBookings={lockerBookings}
        valetOrders={valetOrders}
        onOpenUnlockModal={(booking) => {
          setIsDrawerOpen(false);
          setUnlockModalBooking(booking);
        }}
      />

      {/* Footer with active navigation */}
      <Footer onNavigate={handleNavigate} />

      {/* Floating Smart AI Chat Widget & Thu/Mở Mạng Xã Hội (Bao gồm ScrollToTop đặt trên đầu) */}
      <ChatWidget onNavigate={handleNavigate} />

      {/* Modern iOS / Android Bottom Tab Navigation for Mobile Viewports */}
      <MobileBottomNav
        currentPage={currentPage}
        setCurrentPage={handleNavigate}
        activeBookingsCount={lockerBookings.length + valetOrders.length}
        onOpenBookings={() => setIsDrawerOpen(true)}
        currentUser={currentUser}
        onOpenAuth={handleOpenAuthWithNotice}
      />
    </div>
  );
}

export default App;
