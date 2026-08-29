import React, { useState, useEffect } from 'react';
import { LockerStation, LockerSize, LockerBooking } from '../types';
import { calculateLockerFee, formatVND } from '../lib/pricing';
import { generateVietQrUrl } from '../lib/vietqr';
import {
  X,
  Clock,
  ShieldCheck,
  UserCheck,
  QrCode,
  Sparkles,
  Check,
  ArrowRight,
  Share2,
  Copy,
  CheckCircle2,
  Lock,
  Unlock,
  Building,
  Store,
  Timer,
  ChevronRight,
  Phone
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LockerBookingModalProps {
  station: LockerStation;
  currentUser: { id: string; email: string; fullName: string; phone: string } | null;
  onRequireAuth: (notice: string) => void;
  onClose: () => void;
  onConfirmBooking: (booking: LockerBooking) => void;
  onOpenUnlockImmediately?: (booking: LockerBooking) => void;
}

export const LockerBookingModal: React.FC<LockerBookingModalProps> = ({
  station,
  currentUser,
  onRequireAuth,
  onClose,
  onConfirmBooking,
  onOpenUnlockImmediately,
}) => {
  const [selectedSize, setSelectedSize] = useState<LockerSize>('S');
  const [hours, setHours] = useState<number>(4);
  const [isP2P, setIsP2P] = useState<boolean>(false);
  const [p2pPhone, setP2pPhone] = useState<string>('');
  const [p2pName, setP2pName] = useState<string>('');

  const [step, setStep] = useState<'configure' | 'payment' | 'success'>('configure');
  const [paymentMethod, setPaymentMethod] = useState<'vietqr' | 'kiosk'>('vietqr');
  const [isPaying, setIsPaying] = useState<boolean>(false);
  const [createdBooking, setCreatedBooking] = useState<LockerBooking | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Reservation countdown timer (10 mins)
  const [timeLeft, setTimeLeft] = useState<number>(600);

  useEffect(() => {
    if (step !== 'payment') return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [step]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const priceResult = calculateLockerFee(selectedSize, hours);

  const sizeOptions: {
    size: LockerSize;
    label: string;
    dimension: string;
    desc: string;
    first2h: string;
    extra: string;
    icon: string;
  }[] = [
    {
      size: 'S',
      label: 'Size S (Balo / Túi xách)',
      dimension: 'Cao 45 x Rộng 35 x Sâu 50 cm',
      desc: 'Balo laptop, túi xách, mũ bảo hiểm, áo khoác',
      first2h: '10.000 đ / 2h đầu',
      extra: '5.000 đ / h tiếp theo',
      icon: '🎒',
    },
    {
      size: 'M',
      label: 'Size M (Vali Cabin 20")',
      dimension: 'Cao 60 x Rộng 45 x Sâu 60 cm',
      desc: 'Vali cabin, túi du lịch thể thao, 2 balo',
      first2h: '18.000 đ / 2h đầu',
      extra: '8.000 đ / h tiếp theo',
      icon: '🧳',
    },
    {
      size: 'L',
      label: 'Size L (Vali Lớn 24-28")',
      dimension: 'Cao 85 x Rộng 60 x Sâu 70 cm',
      desc: 'Vali cỡ đại, thùng hàng cồng kềnh, kiện đồ',
      first2h: '25.000 đ / 2h đầu',
      extra: '12.000 đ / h tiếp theo',
      icon: '📦',
    },
  ];

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleProceedToPayment = () => {
    if (!currentUser) {
      onRequireAuth('Vui lòng đăng nhập để tiến hành thanh toán và kích hoạt mã mở tủ.');
      return;
    }
    if (isP2P && (!p2pPhone.trim() || !p2pName.trim())) {
      alert('Vui lòng nhập đầy đủ tên và số điện thoại người nhận đồ!');
      return;
    }
    setStep('payment');
  };

  const handleSimulatePaymentSuccess = (method: 'vietqr' | 'kiosk') => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      const pin = Math.floor(100000 + Math.random() * 900000).toString();
      const lockerNum = `${selectedSize}-${Math.floor(10 + Math.random() * 89)}`;

      const now = new Date();
      const endTime = new Date(now.getTime() + hours * 60 * 60 * 1000);

      const booking: LockerBooking = {
        id: `LB-${Date.now().toString().slice(-6)}`,
        stationId: station.id,
        stationName: station.name,
        stationAddress: station.address,
        lockerNumber: lockerNum,
        size: selectedSize,
        startTime: now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        estimatedEndTime: endTime.toLocaleTimeString('vi-VN', {
          hour: '2-digit',
          minute: '2-digit',
          day: '2-digit',
          month: '2-digit',
        }),
        estimatedHours: hours,
        prepaidAmount: priceResult.total,
        overdueAmount: 0,
        totalAmount: priceResult.total,
        pinCode: pin,
        isP2PEnabled: isP2P,
        p2pRecipientPhone: isP2P ? p2pPhone : undefined,
        p2pRecipientName: isP2P ? p2pName : undefined,
        paymentMethod: method,
        status: 'active',
        isDoorOpen: false,
      };

      setCreatedBooking(booking);
      setStep('success');
      onConfirmBooking(booking);

      confetti({
        particleCount: 90,
        spread: 75,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#ea580c', '#10b981'],
      });
    }, 1200);
  };

  const transferContent = `BOXIFYX ${station.id.slice(-4).toUpperCase()} ${selectedSize} ${currentUser?.phone ? currentUser.phone.slice(-4) : 'GUEST'}`;
  const vietQrUrl = generateVietQrUrl({
    amount: priceResult.total,
    description: transferContent,
    accountName: 'CONG TY CP CONG NGHE BOXIFYX',
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/80 backdrop-blur-sm animate-fade-in p-3 sm:p-6 flex justify-center items-start sm:items-center">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 shrink-0 px-5 sm:px-6 py-4 bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500 text-zinc-950 flex items-center justify-center font-black text-sm shrink-0 shadow-md">
              <Lock className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-white truncate">Đặt Tủ Thông Minh BoxifyX</h3>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30 shrink-0">
                  {station.operatingHours}
                </span>
              </div>
              <p className="text-xs text-amber-400 font-medium truncate">{station.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-colors shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-5 text-left flex-1">

          {/* STEP 1: CONFIGURE LOCKER */}
          {step === 'configure' && (
            <div className="space-y-5">
              
              {/* Station Summary Info */}
              <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs text-zinc-600 flex items-center gap-2.5">
                <Building className="w-4 h-4 text-amber-600 shrink-0" />
                <div className="truncate">
                  <strong className="text-zinc-900">Địa chỉ trạm:</strong> {station.address}, {station.district}
                </div>
              </div>

              {/* 1. Choose Size */}
              <div className="space-y-2.5">
                <label className="block text-xs font-black uppercase tracking-wider text-zinc-800">
                  1. Chọn Kích Thước Ngăn Tủ
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {sizeOptions.map((opt) => {
                    const isSelected = selectedSize === opt.size;
                    return (
                      <div
                        key={opt.size}
                        onClick={() => setSelectedSize(opt.size)}
                        className={`p-3.5 rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500 ring-2 ring-amber-500/20 shadow-sm'
                            : 'bg-white border-zinc-200 hover:border-zinc-300'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-black text-sm text-zinc-950 flex items-center gap-1.5">
                              <span>{opt.icon}</span> Size {opt.size}
                            </span>
                            {isSelected ? (
                              <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </span>
                            ) : (
                              <span className="w-5 h-5 rounded-full border-2 border-zinc-200" />
                            )}
                          </div>
                          <p className="text-[10px] text-zinc-500 font-medium">{opt.dimension}</p>
                          <p className="text-[11px] text-zinc-600 mt-1 line-clamp-2">{opt.desc}</p>
                        </div>

                        <div className="mt-2.5 pt-2 border-t border-zinc-200/70 text-[11px] font-bold text-zinc-900">
                          <div className="text-amber-700">{opt.first2h}</div>
                          <div className="text-zinc-500 font-normal text-[10px]">{opt.extra}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 2. Choose Duration */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-wider text-zinc-800">
                    2. Thời Gian Thuê: <span className="text-amber-600 font-extrabold text-sm">{hours} Giờ</span>
                  </label>
                  {priceResult.isDiscountApplied && (
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold border border-emerald-300">
                      🎉 Giảm 20% (≥ 24h)
                    </span>
                  )}
                </div>

                {/* Quick Hours Pills */}
                <div className="flex items-center gap-2">
                  {[2, 4, 8, 12, 24, 48].map((h) => (
                    <button
                      key={h}
                      type="button"
                      onClick={() => setHours(h)}
                      className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                        hours === h
                          ? 'bg-zinc-950 text-white shadow-sm'
                          : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                      }`}
                    >
                      {h}h
                    </button>
                  ))}
                </div>

                <input
                  type="range"
                  min="1"
                  max="72"
                  value={hours}
                  onChange={(e) => setHours(parseInt(e.target.value))}
                  className="w-full h-2 bg-zinc-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <div className="flex justify-between text-[11px] text-zinc-400 font-semibold">
                  <span>1 giờ</span>
                  <span>24h (-20%)</span>
                  <span>48h</span>
                  <span>72h (3 ngày)</span>
                </div>
              </div>

              {/* 3. P2P Sharing Option */}
              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2.5">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsP2P(!isP2P)}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-950">Ủy Quyền Nhận Đồ P2P (Gửi Hộ)</h4>
                      <p className="text-[11px] text-zinc-500">Tạo mã mở tủ chia sẻ cho bạn bè/khách nhận hàng</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isP2P}
                    onChange={(e) => setIsP2P(e.target.checked)}
                    className="w-4 h-4 rounded text-amber-500 focus:ring-amber-400 cursor-pointer"
                  />
                </div>

                {isP2P && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2.5 border-t border-zinc-200 animate-fade-in">
                    <div>
                      <label className="text-[11px] font-bold text-zinc-700 block mb-1">Tên Người Nhận: <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        placeholder="VD: Chị Mai Lan"
                        value={p2pName}
                        onChange={(e) => setP2pName(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl text-xs bg-white border border-zinc-300 focus:ring-1 focus:ring-amber-500 outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-zinc-700 block mb-1">SĐT Người Nhận: <span className="text-red-500">*</span></label>
                      <input
                        type="tel"
                        placeholder="VD: 0909888777"
                        value={p2pPhone}
                        onChange={(e) => setP2pPhone(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl text-xs bg-white border border-zinc-300 focus:ring-1 focus:ring-amber-500 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Price Summary Card */}
              <div className="p-4 rounded-2xl bg-zinc-950 text-white space-y-1.5">
                <div className="flex justify-between text-xs text-zinc-400">
                  <span>Cước tạm tính ({hours} giờ thuê):</span>
                  <span>{formatVND(priceResult.subtotal)}</span>
                </div>
                {priceResult.discount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-400 font-semibold">
                    <span>Ưu đãi thuê dài hạn (-20%):</span>
                    <span>-{formatVND(priceResult.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm font-black text-white pt-1.5 border-t border-zinc-800">
                  <span>Tổng cước trả trước (Prepaid):</span>
                  <span className="text-amber-400 text-base sm:text-lg">{formatVND(priceResult.total)}</span>
                </div>
              </div>

              {/* Proceed CTA */}
              <button
                onClick={handleProceedToPayment}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm shadow-glow flex items-center justify-center gap-2 transition-all active:scale-98"
              >
                <span>Xác Nhận & Đi Đến Thanh Toán</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: PAYMENT SCREEN (VIETQR OR KIOSK - NO MOMO) */}
          {step === 'payment' && (
            <div className="space-y-4">
              
              {/* Header with Timer */}
              <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-extrabold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    Cổng Thanh Toán BoxifyX
                  </span>
                  <h3 className="text-base font-black text-zinc-950 mt-1">Xác Nhận & Thanh Toán Đặt Tủ</h3>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-orange-50 text-orange-700 border border-orange-200 text-xs font-bold shrink-0">
                  <Timer className="w-3.5 h-3.5 text-orange-600 animate-spin" />
                  <span>Giữ chỗ: {formatTimer(timeLeft)}</span>
                </div>
              </div>

              {/* Mini-Invoice Card */}
              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5 text-xs">
                <div className="flex justify-between items-center text-zinc-700">
                  <span>Trạm tủ:</span>
                  <strong className="text-zinc-950 truncate max-w-[60%] text-right">{station.name}</strong>
                </div>
                <div className="flex justify-between items-center text-zinc-700">
                  <span>Kích cỡ & Thời gian:</span>
                  <strong className="text-zinc-950">Size {selectedSize} • {hours} giờ</strong>
                </div>
                {isP2P && (
                  <div className="flex justify-between items-center text-zinc-700">
                    <span>Ủy quyền P2P:</span>
                    <strong className="text-amber-700">{p2pName} ({p2pPhone})</strong>
                  </div>
                )}
                <div className="flex justify-between items-center pt-1.5 border-t border-zinc-200 text-sm font-black">
                  <span className="text-zinc-900">Tổng thanh toán:</span>
                  <span className="text-amber-600 text-base">{formatVND(priceResult.total)}</span>
                </div>
              </div>

              {/* 2 Payment Methods (VietQR & Kiosk) */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-zinc-700 block">
                  Chọn Phương Thức Thanh Toán
                </label>
                
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  
                  {/* 1. VietQR */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('vietqr')}
                    className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-1.5 ${
                      paymentMethod === 'vietqr'
                        ? 'border-amber-500 bg-amber-500/10 font-bold text-zinc-950 shadow-sm'
                        : 'border-zinc-200 hover:border-zinc-300 bg-white text-zinc-600'
                    }`}
                  >
                    <QrCode className="w-5 h-5 text-amber-600" />
                    <span className="text-xs font-bold leading-tight">Chuyển Khoản VietQR 24/7</span>
                    <span className="text-[10px] text-zinc-400 font-normal">Quét mã Napas tự động</span>
                  </button>

                  {/* 2. Pay at Kiosk */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('kiosk')}
                    className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col items-center text-center gap-1.5 ${
                      paymentMethod === 'kiosk'
                        ? 'border-amber-500 bg-amber-500/10 font-bold text-zinc-950 shadow-sm'
                        : 'border-zinc-200 hover:border-zinc-300 bg-white text-zinc-600'
                    }`}
                  >
                    <Store className="w-5 h-5 text-zinc-800" />
                    <span className="text-xs font-bold leading-tight">Tại Kiosk Trạm Tủ</span>
                    <span className="text-[10px] text-zinc-400 font-normal">Thẻ / Tiền mặt khi đến nơi</span>
                  </button>

                </div>
              </div>

              {/* TAB CONTENT: VIETQR */}
              {paymentMethod === 'vietqr' && (
                <div className="space-y-3 animate-fade-in">
                  <div className="flex flex-col sm:flex-row items-center gap-3.5 p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200">
                    <div className="w-36 h-36 bg-white p-2 rounded-2xl border-2 border-amber-400 shadow-sm shrink-0 flex items-center justify-center">
                      <img
                        src={vietQrUrl}
                        alt="VietQR Napas247"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>

                    <div className="flex-1 space-y-2 text-xs w-full">
                      <div>
                        <span className="text-[10px] text-zinc-500 block">Ngân hàng:</span>
                        <strong className="text-zinc-900 font-bold">MBBank (Quân Đội)</strong>
                      </div>

                      <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-zinc-200">
                        <div>
                          <span className="text-[10px] text-zinc-400 block">Số tài khoản:</span>
                          <strong className="text-zinc-950 font-mono font-black text-xs">0388889999</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy('0388889999', 'account')}
                          className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-[10px] flex items-center gap-1 transition-colors"
                        >
                          {copiedField === 'account' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedField === 'account' ? 'Đã chép' : 'Sao chép'}</span>
                        </button>
                      </div>

                      <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-zinc-200">
                        <div>
                          <span className="text-[10px] text-zinc-400 block">Số tiền:</span>
                          <strong className="text-amber-700 font-mono font-black text-xs">{priceResult.total.toLocaleString('vi-VN')} đ</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(priceResult.total.toString(), 'amount')}
                          className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-[10px] flex items-center gap-1 transition-colors"
                        >
                          {copiedField === 'amount' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedField === 'amount' ? 'Đã chép' : 'Sao chép'}</span>
                        </button>
                      </div>

                      <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-zinc-200">
                        <div className="truncate mr-2">
                          <span className="text-[10px] text-zinc-400 block">Nội dung CK:</span>
                          <strong className="text-zinc-950 font-mono font-bold text-[11px] truncate block">{transferContent}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(transferContent, 'content')}
                          className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-[10px] flex items-center gap-1 transition-colors shrink-0"
                        >
                          {copiedField === 'content' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedField === 'content' ? 'Đã chép' : 'Sao chép'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-zinc-500 text-center">
                    Hệ thống tự động kích hoạt mã mở tủ ngay khi nhận được giao dịch.
                  </p>
                </div>
              )}

              {/* TAB CONTENT: KIOSK */}
              {paymentMethod === 'kiosk' && (
                <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2 text-xs text-zinc-700 animate-fade-in">
                  <div className="flex items-center gap-2 font-bold text-zinc-950">
                    <Store className="w-4 h-4 text-amber-600" />
                    <span>Thanh Toán Trực Tiếp Tại Màn Hình Kiosk Trạm Tủ</span>
                  </div>
                  <p className="text-[11px] text-zinc-600 leading-relaxed">
                    Hệ thống sẽ giữ chỗ ngăn tủ cho bạn trong 30 phút. Khi đến trạm <strong>{station.name}</strong>, hãy chạm vào màn hình Kiosk cảm ứng để quét mã hoặc thanh toán bằng Thẻ ATM / Tiền mặt.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <button
                  disabled={isPaying}
                  onClick={() => handleSimulatePaymentSuccess(paymentMethod)}
                  className="w-full py-3.5 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
                >
                  {isPaying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                      <span>Đang xác thực & cấp mã mở tủ IOT...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      <span>
                        {paymentMethod === 'kiosk'
                          ? 'Xác Nhận Giữ Chỗ & Cấp Mã Kiosk'
                          : 'Tôi Đã Chuyển Khoản Xong (Xác Thực Ngay)'}
                      </span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setStep('configure')}
                  className="w-full py-1.5 text-center text-xs text-zinc-500 hover:text-zinc-900 font-semibold"
                >
                  ← Quay lại thay đổi kích thước hoặc thời gian
                </button>
              </div>

            </div>
          )}

          {/* STEP 3: SUCCESS & DIGITAL BOARDING PASS */}
          {step === 'success' && createdBooking && (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-7 h-7 stroke-[2.5]" />
              </div>

              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-0.5 rounded-full">
                  Đặt Tủ Thành Công
                </span>
                <h3 className="text-xl font-black text-zinc-950 mt-1.5">Mã Mở Tủ Đã Kích Hoạt!</h3>
                <p className="text-xs text-zinc-600 truncate">{station.name}</p>
              </div>

              {/* Digital Boarding Pass */}
              <div className="p-4 rounded-3xl bg-gradient-to-tr from-zinc-950 via-zinc-900 to-zinc-950 text-white space-y-3.5 shadow-xl border border-zinc-800 text-left">
                <div className="flex justify-between items-start border-b border-zinc-800 pb-2.5">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-widest block font-bold">VỊ TRÍ NGĂN TỦ</span>
                    <div className="text-2xl font-black text-amber-400 tracking-wider">
                      {createdBooking.lockerNumber}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-black border border-amber-500/30">
                    Size {createdBooking.size}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-zinc-400 uppercase tracking-widest block font-bold mb-1">
                    MÃ PIN 6 SỐ MỞ KHÓA TỦ
                  </span>
                  <div className="text-3xl font-mono font-black text-center tracking-widest text-white bg-zinc-800/90 py-2.5 rounded-2xl border border-zinc-700 shadow-inner">
                    {createdBooking.pinCode}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 text-zinc-400">
                  <div>
                    <span className="text-[10px] block">Bắt đầu:</span>
                    <strong className="text-zinc-200">{createdBooking.startTime}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] block">Hạn trả tủ:</span>
                    <strong className="text-amber-300">{createdBooking.estimatedEndTime}</strong>
                  </div>
                </div>
              </div>

              {/* P2P Share Box */}
              {createdBooking.isP2PEnabled && (
                <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-left text-xs space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-900">
                    <Share2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>Ủy quyền cho người nhận P2P</span>
                  </div>
                  <p className="text-zinc-600 text-[11px]">
                    Người nhận: <strong>{createdBooking.p2pRecipientName}</strong> ({createdBooking.p2pRecipientPhone})
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      readOnly
                      value={`https://boxifyx.vn/p2p/${createdBooking.id}?pin=${createdBooking.pinCode}`}
                      className="flex-1 p-1.5 bg-white rounded-lg border border-amber-200 font-mono text-[10px] text-zinc-600 outline-none truncate"
                    />
                    <button
                      type="button"
                      onClick={() => handleCopy(`https://boxifyx.vn/p2p/${createdBooking.id}?pin=${createdBooking.pinCode}`, 'p2plink')}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shrink-0 shadow-sm"
                    >
                      {copiedField === 'p2plink' ? 'Đã chép!' : 'Copy Link'}
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    if (onOpenUnlockImmediately) {
                      onOpenUnlockImmediately(createdBooking);
                    }
                  }}
                  className="py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs shadow-glow flex items-center justify-center gap-2"
                >
                  <Unlock className="w-4 h-4" />
                  <span>Mở Khóa Tủ Ngay</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="py-3 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2"
                >
                  <span>Xem Trong "Đơn Của Tôi"</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
