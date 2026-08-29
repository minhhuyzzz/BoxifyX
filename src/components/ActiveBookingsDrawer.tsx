import React, { useState } from 'react';
import { LockerBooking, ValetOrder } from '../types';
import { formatVND } from '../lib/pricing';
import {
  X,
  Lock,
  Box,
  Unlock,
  Clock,
  MapPin,
  Share2,
  AlertCircle,
  CheckCircle,
  CheckCircle2,
  Calendar,
  Truck,
  Phone,
  Layers,
  ChevronRight,
  ShieldCheck,
  Building2,
  CreditCard
} from 'lucide-react';

interface ActiveBookingsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  lockerBookings: LockerBooking[];
  valetOrders: ValetOrder[];
  onOpenUnlockModal: (booking: LockerBooking) => void;
}

export const ActiveBookingsDrawer: React.FC<ActiveBookingsDrawerProps> = ({
  isOpen,
  onClose,
  lockerBookings,
  valetOrders,
  onOpenUnlockModal,
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'lockers' | 'valet'>('all');

  if (!isOpen) return null;

  const totalCount = lockerBookings.length + valetOrders.length;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden text-left">
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-zinc-950/60 backdrop-blur-sm transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl border-l border-zinc-200 flex flex-col justify-between overflow-y-auto">
          
          {/* Drawer Header */}
          <div className="p-6 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white flex items-center justify-between border-b border-zinc-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-zinc-950 flex items-center justify-center font-black text-xs shadow-md">
                BX
              </div>
              <div>
                <h3 className="font-extrabold text-base text-white">Quản Lý Đơn Của Tôi</h3>
                <p className="text-xs text-zinc-400">Đang có {totalCount} dịch vụ hoạt động</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-3 bg-zinc-50 border-b border-zinc-200 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-1.5 rounded-xl transition-all ${
                activeTab === 'all'
                  ? 'bg-zinc-950 text-white shadow-sm'
                  : 'bg-white text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              Tất Cả ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('lockers')}
              className={`flex-1 py-1.5 rounded-xl transition-all ${
                activeTab === 'lockers'
                  ? 'bg-zinc-950 text-white shadow-sm'
                  : 'bg-white text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              Tủ ({lockerBookings.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('valet')}
              className={`flex-1 py-1.5 rounded-xl transition-all ${
                activeTab === 'valet'
                  ? 'bg-zinc-950 text-white shadow-sm'
                  : 'bg-white text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              Valet ({valetOrders.length})
            </button>
          </div>

          {/* Drawer Content */}
          <div className="p-5 space-y-6 flex-1 overflow-y-auto">
            
            {/* 1. Smart Locker Section */}
            {(activeTab === 'all' || activeTab === 'lockers') && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-zinc-700">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-500" />
                    <span>Tủ Thông Minh ({lockerBookings.length})</span>
                  </span>
                </div>

                {lockerBookings.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-dashed border-zinc-300 text-center text-xs text-zinc-500">
                    Bạn chưa có phiên thuê tủ nào.
                  </div>
                ) : (
                  lockerBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="p-4 rounded-2xl bg-amber-50/40 border border-amber-300 shadow-sm space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-base text-zinc-950">
                              Ô: {booking.lockerNumber}
                            </span>
                            <span className="px-2 py-0.5 rounded bg-zinc-950 text-amber-400 text-[10px] font-bold">
                              Size {booking.size}
                            </span>
                          </div>
                          <p className="text-xs text-zinc-600 line-clamp-1 mt-0.5">{booking.stationName}</p>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          booking.status === 'completed' 
                            ? 'bg-emerald-100 text-emerald-800' 
                            : 'bg-amber-100 text-amber-900 animate-pulse'
                        }`}>
                          {booking.status === 'completed' ? 'Đã trả tủ' : 'Đang thuê'}
                        </span>
                      </div>

                      {/* PIN & Duration Info */}
                      <div className="grid grid-cols-2 gap-2 p-2.5 bg-white rounded-xl border border-amber-200 text-xs">
                        <div>
                          <span className="text-[10px] text-zinc-400 block">Mã PIN mở tủ:</span>
                          <strong className="text-sm font-mono text-zinc-950 font-black tracking-wider">{booking.pinCode}</strong>
                        </div>
                        <div>
                          <span className="text-[10px] text-zinc-400 block">Hạn trả tủ:</span>
                          <strong className="text-xs text-amber-700">{booking.estimatedEndTime}</strong>
                        </div>
                      </div>

                      {/* P2P recipient badge if exists */}
                      {booking.isP2PEnabled && (
                        <div className="text-[11px] text-amber-900 bg-amber-100/70 p-2 rounded-xl flex items-center gap-1.5">
                          <Share2 className="w-3.5 h-3.5 shrink-0 text-amber-700" />
                          <span>Người nhận: <strong>{booking.p2pRecipientName}</strong> ({booking.p2pRecipientPhone})</span>
                        </div>
                      )}

                      {/* Open Door Action Button */}
                      <button
                        onClick={() => onOpenUnlockModal(booking)}
                        className="w-full py-2.5 rounded-xl bg-zinc-950 hover:bg-amber-500 hover:text-white text-white text-xs font-bold shadow transition-all flex items-center justify-center gap-2"
                      >
                        <Unlock className="w-3.5 h-3.5 text-amber-400" />
                        <span>Mở Khóa Tủ Ngay</span>
                      </button>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* 2. Valet Orders Section */}
            {(activeTab === 'all' || activeTab === 'valet') && (
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider text-zinc-700">
                  <span className="flex items-center gap-1.5">
                    <Box className="w-3.5 h-3.5 text-orange-500" />
                    <span>Đơn Lưu Kho Valet Storage ({valetOrders.length})</span>
                  </span>
                </div>

                {valetOrders.length === 0 ? (
                  <div className="p-4 rounded-2xl bg-zinc-50 border border-dashed border-zinc-300 text-center text-xs text-zinc-500">
                    Chưa có đơn lưu kho nào.
                  </div>
                ) : (
                  valetOrders.map((order) => (
                    <div
                      key={order.id}
                      className="p-4 rounded-2xl bg-orange-50/40 border border-orange-200 shadow-sm space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-black text-sm text-zinc-950">{order.id}</span>
                            <span className="text-[11px] text-zinc-500">({order.createdAt})</span>
                          </div>
                          <p className="text-xs text-zinc-600 line-clamp-1 mt-0.5 font-medium">{order.pickupAddress}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 text-[10px] font-bold">
                          {order.standardBoxesCount} Thùng Standard
                        </span>
                      </div>

                      {/* Step Status Badge */}
                      <div className="p-3 bg-white rounded-xl border border-orange-200 text-xs space-y-1.5">
                        <div className="flex items-center gap-1.5 text-orange-900 font-bold">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Shipper đang chuẩn bị thùng rỗng</span>
                        </div>
                        <div className="text-[11px] text-zinc-600">
                          Hẹn giao thùng: <strong className="text-zinc-900">{order.emptyBoxDeliveryDate} {order.emptyBoxTimeSlot ? `(${order.emptyBoxTimeSlot})` : ''}</strong>
                        </div>
                        <div className="text-[11px] text-zinc-600">
                          Hẹn lấy đồ: <strong className="text-zinc-900">{order.packedPickupDate} {order.packedPickupTimeSlot ? `(${order.packedPickupTimeSlot})` : ''}</strong>
                        </div>
                        {order.storageItemNotes && (
                          <div className="text-[11px] text-zinc-500 italic pt-1 border-t border-zinc-100">
                            Ghi chú: {order.storageItemNotes}
                          </div>
                        )}
                      </div>

                      <div className="flex justify-between items-center text-xs text-zinc-600 pt-1">
                        <span>Cước tháng đầu: <strong className="text-orange-600 font-bold">{formatVND(order.totalFirstMonth)}</strong></span>
                        <a
                          href="tel:19008888"
                          className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-800 font-bold text-[10px] flex items-center gap-1"
                        >
                          <Phone className="w-3 h-3 text-orange-600" />
                          <span>Hotline Kho</span>
                        </a>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

          </div>

          {/* Drawer Footer */}
          <div className="p-4 bg-zinc-50 border-t border-zinc-200 text-center">
            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold shadow-sm transition-colors"
            >
              Đóng Bảng Quản Lý
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
