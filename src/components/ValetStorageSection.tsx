import React, { useState, useEffect } from 'react';
import { ValetOrder, ValetItem } from '../types';
import {
  calculateValetMonthlyFee,
  calculateHaversineDistance,
  calculateValetShippingFee,
  WAREHOUSE_COORDINATES,
  formatVND,
} from '../lib/pricing';
import { generateVietQrUrl } from '../lib/vietqr';
import { AddressAutocomplete, SelectedLocation } from './AddressAutocomplete';
import {
  Box,
  Truck,
  Calendar,
  MapPin,
  ShieldCheck,
  Sparkles,
  Plus,
  Minus,
  ArrowRight,
  CheckCircle2,
  PackageCheck,
  QrCode,
  X,
  User,
  Phone,
  Mail,
  FileText,
  Building,
  Building2,
  Home,
  Bike,
  Banknote,
  Clock,
  Check,
  Copy,
  Info,
  ChevronRight,
  Shield,
  Layers
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ValetStorageSectionProps {
  currentUser?: { id: string; email: string; fullName: string; phone: string } | null;
  onRequireAuth?: (notice: string) => void;
  onOrderCreated: (order: ValetOrder) => void;
}

export const ValetStorageSection: React.FC<ValetStorageSectionProps> = ({
  currentUser,
  onRequireAuth,
  onOrderCreated,
}) => {
  const [standardBoxes, setStandardBoxes] = useState<number>(2);
  const [largeItems, setLargeItems] = useState<number>(0);

  // Address & Geocoding State
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation>({
    fullAddress: 'Số 12, Đường Nguyễn Văn Bảo, Phường 4, Quận Gò Vấp, TP.HCM',
    streetAndArea: 'Đường Nguyễn Văn Bảo, Phường 4, Quận Gò Vấp',
    houseNumber: 'Số 12',
    district: 'Gò Vấp',
    lat: 10.8222,
    lng: 106.6873,
    distanceKm: calculateHaversineDistance(WAREHOUSE_COORDINATES.lat, WAREHOUSE_COORDINATES.lng, 10.8222, 106.6873),
    shippingFee: calculateValetShippingFee(calculateHaversineDistance(WAREHOUSE_COORDINATES.lat, WAREHOUSE_COORDINATES.lng, 10.8222, 106.6873)),
  });

  const [customerName, setCustomerName] = useState<string>(currentUser?.fullName || 'Khách Hàng BoxifyX');
  const [customerPhone, setCustomerPhone] = useState<string>(currentUser?.phone || '0901234567');
  const [customerEmail, setCustomerEmail] = useState<string>(currentUser?.email || '');
  const [buildingType, setBuildingType] = useState<string>('Chung cư / Căn hộ (Có thang máy)');
  const [shipperNote, setShipperNote] = useState<string>('Gọi trước khi đến 15 phút, giao tại sảnh hoặc cửa nhà');
  const [storageItemNotes, setStorageItemNotes] = useState<string>('Áo khoác len mùa đông, sách vở giáo trình, đồ gia dụng nhỏ');

  // Dates & Time Slots
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const nextThreeDays = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  const [emptyBoxDate, setEmptyBoxDate] = useState<string>(tomorrow);
  const [emptyBoxTimeSlot, setEmptyBoxTimeSlot] = useState<string>('08:00 - 12:00 (Sáng)');
  const [packedPickupDate, setPackedPickupDate] = useState<string>(nextThreeDays);
  const [packedPickupTimeSlot, setPackedPickupTimeSlot] = useState<string>('13:00 - 17:00 (Chiều)');

  // Payment State (COD or VietQR only)
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'vietqr'>('cod');
  const [showPaymentModal, setShowPaymentModal] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // Sync state if currentUser logs in
  useEffect(() => {
    if (currentUser) {
      if (currentUser.fullName) setCustomerName(currentUser.fullName);
      if (currentUser.phone) setCustomerPhone(currentUser.phone);
      if (currentUser.email) setCustomerEmail(currentUser.email);
    }
  }, [currentUser]);

  // Calculations
  const distanceKm = selectedLocation.distanceKm;
  const shippingFee = selectedLocation.shippingFee;
  const { standardTotal, largeTotal, monthlyTotal } = calculateValetMonthlyFee(standardBoxes, largeItems);
  const totalFirstMonth = monthlyTotal + shippingFee;

  const timeSlotOptions = [
    '08:00 - 12:00 (Sáng)',
    '13:00 - 17:00 (Chiều)',
    '18:00 - 21:00 (Tối)',
  ];

  const buildingOptions = [
    { label: 'Chung cư / Căn hộ (Có thang máy)', icon: Building2 },
    { label: 'Nhà phố / Mặt tiền', icon: Home },
    { label: 'Nhà trong hẻm / Thang bộ', icon: Bike },
  ];

  const handleLocationSelect = (loc: SelectedLocation) => {
    setSelectedLocation(loc);
  };

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleValidateAndOpenCheckout = () => {
    if (standardBoxes === 0 && largeItems === 0) {
      alert('Vui lòng chọn ít nhất 1 thùng tiêu chuẩn hoặc 1 kiện hàng lưu trữ!');
      return;
    }
    if (!selectedLocation.fullAddress.trim()) {
      alert('Vui lòng chọn hoặc nhập địa chỉ giao nhận tại TP.HCM!');
      return;
    }
    if (!customerName.trim()) {
      alert('Vui lòng nhập họ tên người liên hệ nhận thùng!');
      return;
    }
    if (!customerPhone.trim()) {
      alert('Vui lòng nhập số điện thoại để shipper liên hệ!');
      return;
    }
    if (!currentUser && onRequireAuth) {
      onRequireAuth('Vui lòng đăng nhập hoặc tạo tài khoản để xác nhận đơn Valet và lưu thông tin vào Tủ Đồ Số Hóa.');
      return;
    }
    setShowPaymentModal(true);
  };

  const handleConfirmOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setShowPaymentModal(false);

      const orderCode = `VO-${Date.now().toString().slice(-6)}`;

      // Automatically generate items for both Standard Boxes and Large Items for Digital Closet
      const initialValetItems: ValetItem[] = [];

      // 1. Standard Boxes ($120k/month)
      for (let i = 1; i <= standardBoxes; i++) {
        initialValetItems.push({
          id: `item-${Date.now()}-std-${i}`,
          boxCode: `BX-STD-${Math.floor(1000 + Math.random() * 8999)}`,
          title: `Thùng Standard #${i} (60x40x40cm) - ${customerName}`,
          itemType: 'standard_box',
          description: storageItemNotes.trim() || 'Đang chuẩn bị giao thùng rỗng tiêu chuẩn & chốt niêm phong',
          sealNumber: `SEAL-HCM-${Math.floor(1000 + Math.random() * 8999)}`,
          warehouseBin: `KHO1-C-0${i}-S1`,
          imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80',
          storedDate: new Date().toLocaleDateString('vi-VN'),
          category: 'Thùng Tiêu Chuẩn',
        });
      }

      // 2. Large Items / Oversized Pallet ($200k/month)
      for (let j = 1; j <= largeItems; j++) {
        initialValetItems.push({
          id: `item-${Date.now()}-lrg-${j}`,
          boxCode: `BX-LRG-${Math.floor(1000 + Math.random() * 8999)}`,
          title: `Kiện Quá Khổ #${j} (Pallet/Thiết Bị) - ${customerName}`,
          itemType: 'large_item',
          description: storageItemNotes.trim() || 'Lưu trữ pallet bảo quản nhiệt độ 25°C, độ ẩm <50%',
          sealNumber: `SEAL-HCM-${Math.floor(1000 + Math.random() * 8999)}`,
          warehouseBin: `KHO1-ZONE-LARGE-0${j}`,
          imageUrl: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&auto=format&fit=crop&q=80',
          storedDate: new Date().toLocaleDateString('vi-VN'),
          category: 'Kiện Quá Khổ',
        });
      }

      const newOrder: ValetOrder = {
        id: orderCode,
        customerName,
        customerPhone,
        customerEmail: customerEmail || undefined,
        pickupAddress: selectedLocation.fullAddress,
        pickupLat: selectedLocation.lat,
        pickupLng: selectedLocation.lng,
        distanceKm,
        buildingType,
        shipperNote,
        storageItemNotes,
        standardBoxesCount: standardBoxes,
        largeItemsCount: largeItems,
        monthlyStorageFee: monthlyTotal,
        shippingFee,
        totalFirstMonth,
        paymentMethod,
        stepStatus: 'empty_box_scheduled',
        emptyBoxDeliveryDate: emptyBoxDate,
        emptyBoxTimeSlot,
        packedPickupDate: packedPickupDate,
        packedPickupTimeSlot,
        items: initialValetItems,
        createdAt: new Date().toLocaleDateString('vi-VN'),
      };

      onOrderCreated(newOrder);

      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ea580c', '#f59e0b', '#10b981'],
      });

      alert(
        `🎉 Đặt dịch vụ Valet Storage thành công! Mã đơn: ${newOrder.id}.\n` +
        `📦 Shipper sẽ mang ${standardBoxes} thùng rỗng đến "${selectedLocation.fullAddress}" vào ngày ${emptyBoxDate} (${emptyBoxTimeSlot}).\n` +
        `📱 Bạn có thể theo dõi đơn trong mục "Đơn Của Tôi" hoặc xem Tủ Đồ!`
      );
    }, 1200);
  };

  const transferContent = `BOXIFYX VALET ${customerPhone.slice(-4)} ${new Date().getDate()}${new Date().getMonth() + 1}`;
  const qrUrl = generateVietQrUrl({
    amount: totalFirstMonth,
    description: transferContent,
    accountName: 'CONG TY CP CONG NGHE BOXIFYX',
  });

  return (
    <div className="space-y-8 text-left">
      
      {/* Section Sub-Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-900 text-xs font-black uppercase tracking-wider">
          <Truck className="w-3.5 h-3.5 text-orange-600" />
          <span>Dịch Vụ Giao Nhận Thùng Tận Cửa Tại TP.HCM</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-zinc-950 tracking-tight">
          Cấu Hình Lưu Kho Valet Storage Theo Tháng
        </h2>
        <p className="text-xs sm:text-sm text-zinc-600">
          Chọn số lượng thùng, nhập địa chỉ thực tế để hệ thống tự động đo khoảng cách GPS & tính cước ship minh bạch.
        </p>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: FORM STEPS */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* STEP 1: CHỌN SỐ LƯỢNG THÙNG & KÊ KHAI ĐỒ ĐẠC */}
          <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-5">
            <h3 className="font-extrabold text-base text-zinc-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-black">1</span>
              <span>Chọn Số Lượng Thùng & Kiện Lưu Trữ</span>
            </h3>

            {/* Standard Box Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Box className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-zinc-950">Thùng Tiêu Chuẩn BoxifyX</h4>
                    <span className="px-2 py-0.5 rounded-full bg-orange-200 text-orange-900 text-[10px] font-bold">
                      60 x 40 x 40 cm (100L)
                    </span>
                  </div>
                  <p className="text-xs text-zinc-600 mt-0.5">Nhựa nguyên sinh chịu tải 50kg, chốt niêm phong bảo mật chống mở trộm.</p>
                  <div className="text-sm font-black text-orange-600 mt-1.5">
                    120.000 đ <span className="text-xs font-normal text-zinc-500">/ thùng / tháng</span>
                  </div>
                </div>
              </div>

              {/* Counter */}
              <div className="flex items-center gap-3 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => setStandardBoxes(Math.max(0, standardBoxes - 1))}
                  className="w-9 h-9 rounded-xl bg-white border border-zinc-300 hover:bg-zinc-100 flex items-center justify-center font-bold text-zinc-700 transition-colors shadow-sm"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-6 text-center font-black text-base text-zinc-950">{standardBoxes}</span>
                <button
                  type="button"
                  onClick={() => setStandardBoxes(standardBoxes + 1)}
                  className="w-9 h-9 rounded-xl bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center font-bold transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Large Oversized Item Card */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-zinc-50 border border-zinc-200 gap-4">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-zinc-900 text-white flex items-center justify-center shrink-0 shadow-md">
                  <PackageCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-sm text-zinc-950">Kiện Quá Khổ / Đồ Lớn</h4>
                    <span className="px-2 py-0.5 rounded-full bg-zinc-200 text-zinc-800 text-[10px] font-bold">
                      Vali Lớn, Đệm, Xe đạp
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">Bọc màng co PE bảo vệ, lưu trữ kệ pallet chuyên dụng trong kho mát.</p>
                  <div className="text-sm font-black text-zinc-900 mt-1.5">
                    200.000 đ <span className="text-xs font-normal text-zinc-500">/ kiện / tháng</span>
                  </div>
                </div>
              </div>

              {/* Counter */}
              <div className="flex items-center gap-3 self-end sm:self-center">
                <button
                  type="button"
                  onClick={() => setLargeItems(Math.max(0, largeItems - 1))}
                  className="w-9 h-9 rounded-xl bg-white border border-zinc-300 hover:bg-zinc-100 flex items-center justify-center font-bold text-zinc-700 transition-colors shadow-sm"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-6 text-center font-black text-base text-zinc-950">{largeItems}</span>
                <button
                  type="button"
                  onClick={() => setLargeItems(largeItems + 1)}
                  className="w-9 h-9 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white flex items-center justify-center font-bold transition-colors shadow-sm"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Storage Item Declaration Note */}
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1.5 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-amber-600" />
                <span>Kê khai loại đồ dự kiến lưu kho (Giúp kho chuẩn bị tem nhãn & phân loại):</span>
              </label>
              <textarea
                value={storageItemNotes}
                onChange={(e) => setStorageItemNotes(e.target.value)}
                placeholder="VD: 5 áo khoác dạ len, 2 chăn lông vũ, sách giáo trình, 1 máy hút ẩm..."
                rows={2}
                className="w-full p-3 rounded-2xl border border-zinc-300 text-xs font-medium focus:ring-2 focus:ring-orange-400 outline-none resize-none"
              />
            </div>
          </div>

          {/* STEP 2: ĐỊA CHỈ, TÒA NHÀ & THÔNG TIN LIÊN HỆ */}
          <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-base text-zinc-950 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-black">2</span>
                <span>Địa Chỉ Nhận & Giao Thùng Tận Nơi (TP.HCM)</span>
              </h3>
              <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                GPS Tự Động Đo Km
              </span>
            </div>

            {/* Live 2-Field OpenStreetMap Autocomplete */}
            <AddressAutocomplete
              initialStreet={selectedLocation.streetAndArea}
              initialHouseNo={selectedLocation.houseNumber}
              onLocationSelect={handleLocationSelect}
            />

            {/* Building Type Selector */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-zinc-700 block">
                Loại Bất Động Sản / Địa Hình Giao Hàng:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {buildingOptions.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = buildingType === opt.label;
                  return (
                    <button
                      key={opt.label}
                      type="button"
                      onClick={() => setBuildingType(opt.label)}
                      className={`p-3 rounded-2xl border text-left transition-all flex items-center gap-2 text-xs ${
                        isSelected
                          ? 'border-orange-500 bg-orange-50/70 font-bold text-zinc-950 shadow-sm'
                          : 'border-zinc-200 hover:border-zinc-300 bg-white text-zinc-600'
                      }`}
                    >
                      <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-orange-600' : 'text-zinc-400'}`} />
                      <span className="text-[11px] leading-tight">{opt.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Contact Name, Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  Họ tên người gửi: <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Nguyễn Văn An"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-300 text-xs font-medium focus:ring-2 focus:ring-orange-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  Số điện thoại nhận: <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="0912345678"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-300 text-xs font-medium focus:ring-2 focus:ring-orange-400 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">
                  Email nhận hóa đơn:
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="an.nguyen@email.com"
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-300 text-xs font-medium focus:ring-2 focus:ring-orange-400 outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Note for Shipper */}
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">
                Ghi chú riêng cho tài xế giao nhận:
              </label>
              <div className="relative">
                <FileText className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={shipperNote}
                  onChange={(e) => setShipperNote(e.target.value)}
                  placeholder="VD: Gửi bảo vệ lễ tân tòa A, gọi trước 15 phút..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-zinc-300 text-xs font-medium focus:ring-2 focus:ring-orange-400 outline-none"
                />
              </div>
            </div>
          </div>

          {/* STEP 3: LỊCH HẸN 2 BƯỚC VỚI KHUNG GIỜ CHI TIẾT */}
          <div className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-sm space-y-4">
            <h3 className="font-extrabold text-base text-zinc-950 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-orange-500 text-white text-xs flex items-center justify-center font-black">3</span>
              <span>Lịch Hẹn Giao Nhận 2 Bước Tiện Lợi</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Step 1: Empty box delivery */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-black text-zinc-950">
                  <Truck className="w-4 h-4 text-amber-500" />
                  <span>Bước 1: Shipper giao thùng rỗng</span>
                </div>
                <div>
                  <label className="text-[11px] text-zinc-500 block mb-1 font-semibold">Chọn ngày giao thùng:</label>
                  <input
                    type="date"
                    value={emptyBoxDate}
                    onChange={(e) => setEmptyBoxDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-300 text-xs bg-white font-medium outline-none focus:ring-1 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-500 block mb-1 font-semibold">Khung giờ giao:</label>
                  <select
                    value={emptyBoxTimeSlot}
                    onChange={(e) => setEmptyBoxTimeSlot(e.target.value)}
                    className="w-full p-2 rounded-xl border border-zinc-300 text-xs bg-white font-medium outline-none focus:ring-1 focus:ring-orange-400"
                  >
                    {timeSlotOptions.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Step 2: Packed pickup */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2.5">
                <div className="flex items-center gap-2 text-xs font-black text-zinc-950">
                  <Calendar className="w-4 h-4 text-orange-500" />
                  <span>Bước 2: Hẹn lấy thùng đã đóng</span>
                </div>
                <div>
                  <label className="text-[11px] text-zinc-500 block mb-1 font-semibold">Chọn ngày lấy đồ về kho:</label>
                  <input
                    type="date"
                    value={packedPickupDate}
                    onChange={(e) => setPackedPickupDate(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-zinc-300 text-xs bg-white font-medium outline-none focus:ring-1 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] text-zinc-500 block mb-1 font-semibold">Khung giờ lấy:</label>
                  <select
                    value={packedPickupTimeSlot}
                    onChange={(e) => setPackedPickupTimeSlot(e.target.value)}
                    className="w-full p-2 rounded-xl border border-zinc-300 text-xs bg-white font-medium outline-none focus:ring-1 focus:ring-orange-400"
                  >
                    {timeSlotOptions.map((slot) => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </select>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: STICKY INVOICE SUMMARY & CHECKOUT BUTTON */}
        <div className="lg:col-span-5 sticky top-24 space-y-4">
          <div className="p-6 rounded-3xl bg-zinc-950 text-white shadow-xl border border-zinc-800 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
              <div>
                <h3 className="font-black text-base text-white">Tóm Tắt Đơn Valet Storage</h3>
                <span className="text-[11px] text-zinc-400">Giao nhận tận nơi & bảo quản kho 25°C</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                1 Tháng Đầu
              </span>
            </div>

            {/* Destination Summary Card */}
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1.5 text-xs">
              <div className="text-zinc-400 flex items-center gap-1.5 text-[11px]">
                <MapPin className="w-3.5 h-3.5 text-orange-400 shrink-0" />
                <span>Địa chỉ giao nhận & bốc dỡ:</span>
              </div>
              <div className="font-bold text-white pl-5 text-xs break-words">
                {selectedLocation.fullAddress}
              </div>
              <div className="text-zinc-400 pl-5 text-[11px] flex items-center gap-2">
                <span>{customerName}</span> • <span>{customerPhone}</span>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-zinc-300">
                <span>Thùng Standard ({standardBoxes} thùng x 120k):</span>
                <strong className="text-white">{formatVND(standardTotal)}</strong>
              </div>
              {largeItems > 0 && (
                <div className="flex justify-between text-zinc-300">
                  <span>Kiện quá khổ ({largeItems} kiện x 200k):</span>
                  <strong className="text-white">{formatVND(largeTotal)}</strong>
                </div>
              )}
              <div className="flex justify-between text-zinc-300">
                <span>Phí lưu kho định kỳ / tháng:</span>
                <strong className="text-amber-400 font-bold">{formatVND(monthlyTotal)}</strong>
              </div>
              <div className="flex justify-between text-zinc-300 pt-2 border-t border-zinc-800">
                <span className="flex items-center gap-1">
                  <span>Phí ship & bốc xếp ({distanceKm} km):</span>
                </span>
                <strong className={shippingFee === 0 ? 'text-emerald-400 font-bold' : 'text-white'}>
                  {shippingFee === 0 ? 'MIỄN PHÍ (3km đầu)' : formatVND(shippingFee)}
                </strong>
              </div>
            </div>

            {/* Total Highlight */}
            <div className="p-4 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-1">
              <div className="text-xs text-zinc-400">Tổng thanh toán cước tháng đầu:</div>
              <div className="text-3xl font-black text-amber-400">
                {formatVND(totalFirstMonth)}
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="button"
              onClick={handleValidateAndOpenCheckout}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm shadow-glow-lg flex items-center justify-center gap-2 transition-all active:scale-98"
            >
              <span>Xác Nhận & Đi Đến Thanh Toán</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-zinc-400">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>Bảo hiểm rủi ro hàng hóa lên tới 20.000.000 đ</span>
            </div>
          </div>
        </div>

      </div>

      {/* COMPREHENSIVE VALET PAYMENT & CHECKOUT MODAL (COD & VIETQR ONLY) */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/80 backdrop-blur-sm animate-fade-in p-3 sm:p-6 flex justify-center items-start sm:items-center">
          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden my-auto max-h-[92vh] flex flex-col text-left">
            
            {/* Modal Sticky Header */}
            <div className="sticky top-0 z-10 shrink-0 px-5 sm:px-6 py-4 bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-800">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-orange-400 bg-orange-500/20 px-2 py-0.5 rounded-full border border-orange-500/30">
                  Thanh Toán Valet Storage
                </span>
                <h3 className="text-base font-black text-white mt-1 truncate">Xác Nhận Đơn & Phương Thức</h3>
              </div>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-8 h-8 rounded-full bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto p-5 sm:p-6 space-y-4 flex-1">

              {/* Order Mini-Invoice Recap */}
              <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5 text-xs">
                <div className="flex justify-between text-zinc-700">
                  <span>Khách hàng:</span>
                  <strong className="text-zinc-950">{customerName} • {customerPhone}</strong>
                </div>
                <div className="flex justify-between text-zinc-700">
                  <span>Địa chỉ giao nhận:</span>
                  <strong className="text-zinc-950 line-clamp-1 max-w-[60%] text-right">{selectedLocation.fullAddress}</strong>
                </div>
                <div className="flex justify-between text-zinc-700">
                  <span>Lịch hẹn:</span>
                  <strong className="text-zinc-950">Giao thùng {emptyBoxDate} ({emptyBoxTimeSlot})</strong>
                </div>
                <div className="flex justify-between text-zinc-700">
                  <span>Số lượng:</span>
                  <strong className="text-orange-700">{standardBoxes} Thùng Standard {largeItems > 0 ? `+ ${largeItems} Kiện lớn` : ''}</strong>
                </div>
                <div className="flex justify-between pt-1.5 border-t border-zinc-200 text-sm font-black">
                  <span className="text-zinc-900">Tổng thanh toán tháng 1:</span>
                  <span className="text-orange-600 text-base">{formatVND(totalFirstMonth)}</span>
                </div>
              </div>

              {/* 2 Payment Methods: COD vs VietQR */}
              <div className="space-y-1.5">
                <label className="text-xs font-black uppercase tracking-wider text-zinc-700 block">
                  Chọn Phương Thức Thanh Toán
                </label>

                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  
                  {/* 1. COD */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                      paymentMethod === 'cod'
                        ? 'border-orange-500 bg-orange-50/60 shadow-sm'
                        : 'border-zinc-200 hover:border-zinc-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Banknote className="w-4 h-4" />
                      </div>
                      {paymentMethod === 'cod' ? (
                        <span className="w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="w-4 h-4 rounded-full border-2 border-zinc-200" />
                      )}
                    </div>
                    <div>
                      <strong className="block text-zinc-950 font-bold text-xs">Tiền Mặt Khi Nhận (COD)</strong>
                      <span className="text-[10px] text-zinc-500">Trả cho shipper khi lấy đồ</span>
                    </div>
                  </div>

                  {/* 2. VietQR */}
                  <div
                    onClick={() => setPaymentMethod('vietqr')}
                    className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between space-y-2 ${
                      paymentMethod === 'vietqr'
                        ? 'border-orange-500 bg-orange-50/60 shadow-sm'
                        : 'border-zinc-200 hover:border-zinc-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
                        <QrCode className="w-4 h-4" />
                      </div>
                      {paymentMethod === 'vietqr' ? (
                        <span className="w-4 h-4 rounded-full bg-orange-500 text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      ) : (
                        <span className="w-4 h-4 rounded-full border-2 border-zinc-200" />
                      )}
                    </div>
                    <div>
                      <strong className="block text-zinc-950 font-bold text-xs">Chuyển Khoản VietQR</strong>
                      <span className="text-[10px] text-zinc-500">Napas247 tự động 24/7</span>
                    </div>
                  </div>

                </div>
              </div>

              {/* TAB CONTENT: COD */}
              {paymentMethod === 'cod' && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-1.5 animate-fade-in">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Thanh toán trực tiếp cho Shipper (COD)</span>
                  </div>
                  <p className="text-[11px] text-emerald-800 leading-relaxed font-normal">
                    Bạn không cần chuyển khoản trước. BoxifyX sẽ giao thùng rỗng đến vào ngày <strong>{emptyBoxDate}</strong> để bạn đóng gói. Shipper sẽ thu tiền mặt hoặc đưa máy POS quẹt thẻ khi đến lấy đồ đã đóng gói vào ngày <strong>{packedPickupDate}</strong>.
                  </p>
                </div>
              )}

              {/* TAB CONTENT: VIETQR */}
              {paymentMethod === 'vietqr' && (
                <div className="space-y-3 animate-fade-in">
                  <div className="flex flex-col sm:flex-row items-center gap-3.5 p-3.5 rounded-2xl bg-orange-50/60 border border-orange-200">
                    <div className="w-36 h-36 bg-white p-2 rounded-2xl border-2 border-orange-400 shadow-sm shrink-0 flex items-center justify-center">
                      <img
                        src={qrUrl}
                        alt="VietQR Valet"
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </div>

                    <div className="flex-1 space-y-2 text-xs w-full">
                      <div>
                        <span className="text-[10px] text-zinc-500 block">Ngân hàng:</span>
                        <strong className="text-zinc-900 font-bold">BIDV (Đầu Tư & Phát Triển VN)</strong>
                      </div>

                      <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-zinc-200">
                        <div>
                          <span className="text-[10px] text-zinc-400 block">Số tài khoản:</span>
                          <strong className="text-zinc-950 font-mono font-black text-xs">7302168136</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy('7302168136', 'acc')}
                          className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-[10px] flex items-center gap-1 transition-colors"
                        >
                          {copiedField === 'acc' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedField === 'acc' ? 'Đã chép' : 'Sao chép'}</span>
                        </button>
                      </div>

                      <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-zinc-200">
                        <div>
                          <span className="text-[10px] text-zinc-400 block">Số tiền:</span>
                          <strong className="text-orange-700 font-mono font-black text-xs">{totalFirstMonth.toLocaleString('vi-VN')} đ</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(totalFirstMonth.toString(), 'amt')}
                          className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-[10px] flex items-center gap-1 transition-colors"
                        >
                          {copiedField === 'amt' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedField === 'amt' ? 'Đã chép' : 'Sao chép'}</span>
                        </button>
                      </div>

                      <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-zinc-200">
                        <div className="truncate mr-2">
                          <span className="text-[10px] text-zinc-400 block">Nội dung CK:</span>
                          <strong className="text-zinc-950 font-mono font-bold text-[11px] truncate block">{transferContent}</strong>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(transferContent, 'cnt')}
                          className="px-2.5 py-1 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-bold text-[10px] flex items-center gap-1 transition-colors shrink-0"
                        >
                          {copiedField === 'cnt' ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                          <span>{copiedField === 'cnt' ? 'Đã chép' : 'Sao chép'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Confirm CTA */}
              <div className="space-y-2 pt-1">
                <button
                  type="button"
                  onClick={handleConfirmOrder}
                  disabled={isProcessing}
                  className="w-full py-3.5 rounded-2xl bg-zinc-950 hover:bg-zinc-800 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Đang xử lý đơn hàng...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>
                        {paymentMethod === 'cod'
                          ? 'Xác Nhận Đặt Lịch (Thanh Toán Khi Shipper Tới)'
                          : 'Tôi Đã Chuyển Khoản Xong'}
                      </span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setShowPaymentModal(false)}
                  className="w-full py-1.5 text-center text-xs text-zinc-500 hover:text-zinc-900 font-semibold"
                >
                  ← Quay lại kiểm tra thông tin
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
