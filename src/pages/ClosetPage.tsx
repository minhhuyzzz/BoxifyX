import React from 'react';
import { VirtualCloset } from '../components/VirtualCloset';
import { ValetOrder } from '../types';

interface ClosetPageProps {
  valetOrders?: ValetOrder[];
  onNavigateToValet?: () => void;
  currentUser?: { id: string; email: string; fullName: string; phone: string } | null;
  onRequireAuth?: (notice?: string) => void;
}

export const ClosetPage: React.FC<ClosetPageProps> = ({
  valetOrders = [],
  onNavigateToValet,
  currentUser,
  onRequireAuth,
}) => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8 animate-fade-in">
      <VirtualCloset
        valetOrders={valetOrders}
        onNavigateToValet={onNavigateToValet}
        currentUser={currentUser}
        onRequireAuth={onRequireAuth}
      />
    </div>
  );
};
