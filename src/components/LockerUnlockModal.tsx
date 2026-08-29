import React, { useState } from 'react';
import { LockerBooking } from '../types';
import { calculateLockerFee, formatVND } from '../lib/pricing';
import { generateVietQrUrl } from '../lib/vietqr';
import { X, Unlock, Lock, AlertTriangle, CheckCircle2, Volume2, Sparkles, QrCode } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LockerUnlockModalProps {
  booking: LockerBooking;
  onClose: () => void;
  onUpdateBooking: (updated: LockerBooking) => void;
}

export const LockerUnlockModal: React.FC<LockerUnlockModalProps> = ({
  booking,
  onClose,
  onUpdateBooking,
}) => {
  const [isOverdueDemo, setIsOverdueDemo] = useState<boolean>(booking.status === 'overdue');
  const [isPayingSurcharge, setIsPayingSurcharge] = useState<boolean>(false);
  const [isUnlocking, setIsUnlocking] = useState<boolean>(false);
  const [doorOpen, setDoorOpen] = useState<boolean>(booking.isDoorOpen);
  const [pinInput, setPinInput] = useState<string>('');

  // Overdue calculation (2 hours overdue simulation)
  const overdueHours = 2;
  let extraPerHour = 5000;
  if (booking.size === 'M') extraPerHour = 8000;
  if (booking.size === 'L') extraPerHour = 12000;
  const surchargeFee = isOverdueDemo ? overdueHours * extraPerHour : 0;

  const handleUnlock = () => {
    if (isOverdueDemo && surchargeFee > 0 && !isPayingSurcharge) {
      alert('Vui lòng thanh toán phụ phí trễ giờ trước khi mở tủ!');
      return;
    }

    setIsUnlocking(true);
    setTimeout(() => {
      setIsUnlocking(false);
      setDoorOpen(true);

      const updated = {
        ...booking,
        isDoorOpen: true,
        status: 'completed' as const,
        overdueAmount: surchargeFee,
        totalAmount: booking.prepaidAmount + surchargeFee,
      };
      onUpdateBooking(updated);

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.5 },
        colors: ['#f59e0b', '#10b981'],
      });
    }, 1200);
  };

  const handleSurchargePaid = () => {
    setIsPayingSurcharge(true);
    setTimeout(() => {
      setIsOverdueDemo(false);
      setIsPayingSurcharge(false);
      alert('Đã thanh toán phụ phí thành công! Bạn có thể mở tủ.');
    }, 1000);
  };

  const surchargeQr = generateVietQrUrl({
    amount: surchargeFee,
    description: `SURCHARGE ${booking.id} 2H`,
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/75 backdrop-blur-sm animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden my-6">
        
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-950 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-zinc-950 flex items-center justify-center font-bold text-xs">
              IOT
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">Mở Khóa Ngăn Tủ Thông Minh</h3>
              <p className="text-xs text-amber-400">Ô: {booking.lockerNumber} • {booking.stationName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          
          {/* Visual 3D Locker Box Simulation */}
          <div className="p-8 rounded-3xl bg-gradient-to-b from-zinc-900 to-zinc-950 text-white text-center relative overflow-hidden border border-zinc-800">
            {/* Animated Door Graphic */}
            <div className="w-36 h-48 mx-auto relative bg-zinc-800 rounded-2xl border-4 border-zinc-700 shadow-2xl flex flex-col justify-between p-3">
              <div className="flex justify-between items-center text-[10px] font-mono text-zinc-400">
                <span>{booking.size}</span>
                <span className={`w-2 h-2 rounded-full ${doorOpen ? 'bg-emerald-500 animate-ping' : 'bg-red-500'}`} />
              </div>

              <div className="text-xl font-black text-amber-400 tracking-wider">
                {booking.lockerNumber}
              </div>

              <div className="text-center">
                {doorOpen ? (
                  <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center justify-center gap-1">
                    <Unlock className="w-3 h-3" />
                    <span>CỬA ĐÃ MỞ</span>
                  </div>
                ) : (
                  <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center justify-center gap-1">
                    <Lock className="w-3 h-3" />
                    <span>ĐANG KHÓA</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4 text-xs text-zinc-400">
              {doorOpen ? (
                <span className="text-emerald-400 font-semibold">
                  Chốt điện IOT đã bật mở! Vui lòng lấy hành lý và đóng cửa tủ.
                </span>
              ) : (
                <span>Đứng cách tủ dưới 5 mét và bấm mở khóa hoặc nhập mã PIN.</span>
              )}
            </div>
          </div>

          {/* Overdue Warning & Surcharge Settle (If Overdue) */}
          {isOverdueDemo && (
            <div className="p-4 rounded-2xl bg-red-50 border border-red-200 space-y-3">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-red-950">Phát Hiện Quá Hạn Thuê (+2 giờ)</h4>
                  <p className="text-xs text-red-800">
                    Phụ phí phát sinh: <strong className="text-red-950 font-black">{formatVND(surchargeFee)}</strong>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-white p-2.5 rounded-xl border border-red-200">
                <img src={surchargeQr} alt="QR Surcharge" className="w-16 h-16 object-contain rounded-lg border" />
                <div className="flex-1 text-xs">
                  <span className="text-zinc-500 block text-[10px]">Quét mã VietQR để đóng phụ phí:</span>
                  <strong className="text-red-700">{formatVND(surchargeFee)}</strong>
                  <button
                    onClick={handleSurchargePaid}
                    className="mt-1 block px-2.5 py-1 rounded-md bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold"
                  >
                    [Demo] Đã Chuyển Khoản Phụ Phí
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* PIN Display & One-Tap Unlock */}
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-2xl bg-zinc-50 border border-zinc-200">
              <span className="text-xs text-zinc-600 font-medium">Mã PIN của tủ:</span>
              <span className="text-xl font-mono font-black text-zinc-950 tracking-widest">{booking.pinCode}</span>
            </div>

            {!doorOpen ? (
              <button
                disabled={isUnlocking}
                onClick={handleUnlock}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-black text-base shadow-glow-lg flex items-center justify-center gap-2.5 transition-all active:scale-98 disabled:opacity-50"
              >
                {isUnlocking ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang gửi tín hiệu mở chốt IOT...</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-5 h-5" />
                    <span>MỞ KHÓA TỦ 1-CHẠM NGAY</span>
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl bg-zinc-950 text-white font-bold text-sm hover:bg-zinc-800 transition-colors"
              >
                Hoàn Tất & Đóng Cửa Sổ
              </button>
            )}

            {/* Demo Toggle: Simulate Overdue state */}
            <div className="pt-2 text-center">
              <button
                type="button"
                onClick={() => setIsOverdueDemo(!isOverdueDemo)}
                className="text-[11px] text-zinc-400 hover:text-zinc-700 underline font-medium"
              >
                {isOverdueDemo ? '[Demo: Tắt mô phỏng quá hạn]' : '[Demo: Thử kích hoạt kịch bản quá hạn trả tủ]'}
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
