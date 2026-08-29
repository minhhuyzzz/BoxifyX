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
import { ScrollToTop } from './components/ScrollToTop';
import { LockerStation, LockerBooking, ValetOrder } from './types';
import { MOCK_STATIONS } from './data/mockData';
import { supabaseService } from './services/supabaseService';
import { supabase } from './lib/supabaseClient';

const PAGE_TO_HASH: Record<PageView, string> = {
  home: '#/',
  locker: '#/smart-locker',
  valet: '#/valet-storage',
  closet: '#/digital-closet',
  pricing: '#/pricing',
  security: '#/security',
  policy: '#/policy',
  faq: '#/faq',
};

const parseHashRoute = (rawHash: string): { page: PageView; tab?: PolicyTab } => {
  const clean = (rawHash || '').replace(/^#\/?/, '');
  const [routePath, queryString] = clean.split('?');
  const path = (routePath || '').toLowerCase().trim();
  const searchParams = new URLSearchParams(queryString || '');
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
  const initialRoute = parseHashRoute(window.location.hash || '#/');
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

  // Sync window hash changes (forward / back button support)
  useEffect(() => {
    const handleHashChange = () => {
      const resolved = parseHashRoute(window.location.hash || '#/');
      setCurrentPage(resolved.page);
      if (resolved.page === 'policy' && resolved.tab) {
        setPolicyTab(resolved.tab);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Check existing Supabase session on mount
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
  }, []);

  // Active bookings list
  const [lockerBookings, setLockerBookings] = useState<LockerBooking[]>([
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
  ]);

  // Valet orders list (empty initial state, populated upon live customer booking or Supabase sync)
  const [valetOrders, setValetOrders] = useState<ValetOrder[]>([]);

  const handleConfirmBooking = async (newBooking: LockerBooking) => {
    setLockerBookings([newBooking, ...lockerBookings]);
    await supabaseService.createLockerBooking(newBooking);
  };

  const handleCreateValetOrder = async (newOrder: ValetOrder) => {
    setValetOrders([newOrder, ...valetOrders]);
    await supabaseService.createValetOrder(newOrder);
  };

  const handleUpdateBooking = async (updated: LockerBooking) => {
    setLockerBookings(lockerBookings.map((b) => (b.id === updated.id ? updated : b)));
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
    if (page === 'policy') {
      if (tab) {
        setPolicyTab(tab);
        window.location.hash = `#/policy?tab=${tab}`;
      } else {
        window.location.hash = '#/policy';
      }
    } else {
      window.location.hash = PAGE_TO_HASH[page] || '#/';
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

      {/* Floating Scroll To Top Button (Vị trí gốc độc lập) */}
      <ScrollToTop />

      {/* Floating Smart AI Chat Widget & Thu/Mở Mạng Xã Hội */}
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
