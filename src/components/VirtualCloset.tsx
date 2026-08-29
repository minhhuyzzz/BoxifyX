import React, { useState, useRef, useEffect } from 'react';
import { ValetItem, ValetOrder } from '../types';
import {
  Sparkles,
  Search,
  Plus,
  Tag,
  ShieldCheck,
  Box,
  Truck,
  Check,
  X,
  Camera,
  ThermometerSnowflake,
  Calendar,
  MapPin,
  Eye,
  Upload,
  Image as ImageIcon,
  Clock,
  ArrowRight,
  Info,
  Layers,
  Edit3,
  CheckCircle2,
  PackageCheck,
  FileText,
  Building2,
  Phone,
  User,
  CreditCard,
  ExternalLink,
  ChevronRight,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface VirtualClosetProps {
  valetOrders?: ValetOrder[];
  onNavigateToValet?: () => void;
  currentUser?: { id: string; email: string; fullName: string; phone: string } | null;
  onRequireAuth?: (notice?: string) => void;
}

export const VirtualCloset: React.FC<VirtualClosetProps> = ({
  valetOrders = [],
  onNavigateToValet,
  currentUser,
  onRequireAuth,
}) => {
  // Active Tab inside Closet: 'items' (Individual boxes) vs 'orders' (Full Valet Orders)
  const [closetViewMode, setClosetViewMode] = useState<'items' | 'orders'>('items');

  // Derive closet items purely from user's live valetOrders (no hardcoded mock items)
  const [closetItems, setClosetItems] = useState<ValetItem[]>(() => {
    return valetOrders.flatMap((order) => order.items || []);
  });

  useEffect(() => {
    const liveItems = valetOrders.flatMap((order) => order.items || []);
    setClosetItems(liveItems);
  }, [valetOrders]);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Return Item Delivery Modal
  const [returnModalItem, setReturnModalItem] = useState<ValetItem | null>(null);
  const [returnDate, setReturnDate] = useState<string>(
    new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [returnTimeSlot, setReturnTimeSlot] = useState<string>('08:00 - 12:00 (Sáng)');
  const [returnAddress, setReturnAddress] = useState<string>(
    'Số 12 Nguyễn Văn Bảo, Phường 4, Quận Gò Vấp, TP.HCM'
  );
  const [returnNote, setReturnNote] = useState<string>('Giao tận cửa hoặc bảo vệ sảnh');
  const [isProcessingReturn, setIsProcessingReturn] = useState<boolean>(false);

  // Edit / Update Photo & Note Modal
  const [editingItem, setEditingItem] = useState<ValetItem | null>(null);
  const [editTitle, setEditTitle] = useState<string>('');
  const [editDescription, setEditDescription] = useState<string>('');
  const [editCategory, setEditCategory] = useState<string>('');
  const [editImagePreview, setEditImagePreview] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Selected Order for Full Order Details Modal
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<ValetOrder | null>(null);

  const predefinedCategories = [
    'all',
    'Thời trang',
    'Sách & Tài liệu',
    'Thể thao & Dã ngoại',
    'Đồ Gia dụng & Thiết bị',
    'Đồ chơi & Sưu tầm',
  ];

  const filteredItems = closetItems.filter((item) => {
    const matchCat =
      selectedCategory === 'all' ||
      item.category.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      selectedCategory.toLowerCase().includes(item.category.toLowerCase());
    const matchQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.boxCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sealNumber.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  // Find parent order for an item
  const findParentOrder = (item: ValetItem): ValetOrder | undefined => {
    // 1. Search in valetOrders for matching item id
    const foundInOrders = valetOrders.find((order) =>
      order.items && order.items.some((i) => i.id === item.id || i.boxCode === item.boxCode)
    );
    if (foundInOrders) return foundInOrders;

    // 2. If not found (e.g. mock default item), return standard reference order
    return {
      id: `VO-${item.boxCode.slice(-4)}`,
      customerName: currentUser?.fullName || 'Khách Hàng BoxifyX',
      customerPhone: currentUser?.phone || '0901234567',
      pickupAddress: 'Số 12 Nguyễn Văn Bảo, P.4, Q. Gò Vấp, TP.HCM',
      pickupLat: 10.8222,
      pickupLng: 106.6873,
      distanceKm: 4.2,
      buildingType: 'Chung cư / Căn hộ (Có thang máy)',
      shipperNote: 'Gọi trước khi đến 15 phút, giao tại sảnh',
      storageItemNotes: item.description,
      standardBoxesCount: 1,
      largeItemsCount: 0,
      monthlyStorageFee: 120000,
      shippingFee: 0,
      totalFirstMonth: 120000,
      paymentMethod: 'cod',
      stepStatus: 'in_warehouse',
      emptyBoxDeliveryDate: item.storedDate,
      packedPickupDate: item.storedDate,
      items: [item],
      createdAt: item.storedDate,
    };
  };

  const handleOpenOrderDetailsFromItem = (item: ValetItem) => {
    const parentOrder = findParentOrder(item);
    if (parentOrder) {
      setSelectedOrderDetails(parentOrder);
    }
  };

  // Handle local image file upload for item update
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setEditImagePreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenEditModal = (item: ValetItem) => {
    setEditingItem(item);
    setEditTitle(item.title);
    setEditDescription(item.description);
    setEditCategory(item.category);
    setEditImagePreview(item.imageUrl);
  };

  const handleSaveItemEdit = () => {
    if (!editingItem) return;
    const updated = closetItems.map((it) => {
      if (it.id === editingItem.id) {
        return {
          ...it,
          title: editTitle.trim() || it.title,
          description: editDescription.trim() || it.description,
          category: editCategory || it.category,
          imageUrl: editImagePreview || it.imageUrl,
        };
      }
      return it;
    });

    setClosetItems(updated);
    setEditingItem(null);
    confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
    alert(`✅ Đã cập nhật thành công ghi chú và hình ảnh cho thùng "${editTitle || editingItem.boxCode}"!`);
  };

  const handleOpenReturnModal = (item: ValetItem) => {
    if (!currentUser && onRequireAuth) {
      onRequireAuth('Vui lòng đăng nhập để tạo yêu cầu shipper giao trả thùng đồ về nhà.');
      return;
    }
    setReturnModalItem(item);
  };

  const handleConfirmReturnDelivery = () => {
    if (!returnModalItem) return;
    setIsProcessingReturn(true);

    setTimeout(() => {
      setIsProcessingReturn(false);
      const trackingCode = `RET-${Date.now().toString().slice(-6)}`;
      alert(
        `🚚 ĐẶT YÊU CẦU LẤY ĐỒ THÀNH CÔNG!\n` +
        `• Mã vận đơn trả đồ: ${trackingCode}\n` +
        `• Thùng đồ: "${returnModalItem.title}" (${returnModalItem.boxCode})\n` +
        `• Hẹn giao trả vào: ${returnDate} (${returnTimeSlot})\n` +
        `• Địa chỉ nhận: ${returnAddress}\n` +
        `• Shipper BoxifyX sẽ gọi điện trước khi đến 15 phút!`
      );
      setReturnModalItem(null);
      confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
    }, 1000);
  };

  return (
    <div className="space-y-8 text-left">
      
      {/* EXPLANATORY HERO GUIDE: HOW DIGITAL CLOSET WORKS */}
      <div className="p-6 sm:p-8 rounded-3xl bg-zinc-950 text-white shadow-xl border border-zinc-800 space-y-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Kho Đồ Trực Tuyến & Quản Lý Đơn Valet</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Tủ Đồ Số Hóa • Quản Lý Thùng Đang Lưu Kho
            </h2>
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
              Mỗi thùng đồ gửi qua dịch vụ <strong>Valet Storage</strong> được bảo quản trong kho mát 25°C, gắn mã chốt niêm phong và tự động số hóa tại đây. Bạn có thể xem ảnh đồ bên trong, kiểm tra mã đơn đặt gốc hoặc gọi shipper mang trả tận nhà!
            </p>
          </div>

          {/* Action CTA: Order More Boxes */}
          <div className="shrink-0 flex flex-col sm:flex-row md:flex-col gap-2.5">
            <button
              type="button"
              onClick={onNavigateToValet}
              className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs sm:text-sm shadow-glow flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Gửi Thêm Thùng Mới Vào Kho</span>
            </button>
            <span className="text-[11px] text-zinc-400 text-center">Shipper giao thùng rỗng tận nhà miễn phí 3km</span>
          </div>
        </div>

        {/* 4-Step Visual Workflow */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-4 border-t border-zinc-800/80 text-xs">
          <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-2.5">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-zinc-950 font-black text-xs flex items-center justify-center shrink-0">1</span>
            <div>
              <strong className="text-white block text-xs">Đặt Thùng Valet</strong>
              <span className="text-zinc-400 text-[11px]">Shipper mang thùng rỗng đến tận nhà</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-2.5">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-zinc-950 font-black text-xs flex items-center justify-center shrink-0">2</span>
            <div>
              <strong className="text-white block text-xs">Đóng Gói & Niêm Phong</strong>
              <span className="text-zinc-400 text-[11px]">Bấm chốt seal có mã vạch chống mở</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-2.5">
            <span className="w-6 h-6 rounded-full bg-amber-500 text-zinc-950 font-black text-xs flex items-center justify-center shrink-0">3</span>
            <div>
              <strong className="text-white block text-xs">Lưu Kho Mát 25°C</strong>
              <span className="text-zinc-400 text-[11px]">Tự động hiển thị và số hóa trong Tủ Đồ</span>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-start gap-2.5">
            <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center shrink-0">4</span>
            <div>
              <strong className="text-emerald-400 block text-xs">Gọi Trả Đồ 24/7</strong>
              <span className="text-zinc-400 text-[11px]">Bấm 1 chạm, shipper giao trả tận cửa</span>
            </div>
          </div>
        </div>
      </div>

      {/* VIEW MODE TOGGLE TABS: ITEMS VS ORDERS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-zinc-200 shadow-sm">
        <div className="flex items-center gap-1.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setClosetViewMode('items')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
              closetViewMode === 'items'
                ? 'bg-zinc-950 text-white shadow-md'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            <Box className="w-4 h-4 text-amber-400" />
            <span>Từng Thùng Đồ Lưu Kho ({closetItems.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setClosetViewMode('orders')}
            className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black transition-all ${
              closetViewMode === 'orders'
                ? 'bg-zinc-950 text-white shadow-md'
                : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            <FileText className="w-4 h-4 text-orange-400" />
            <span>Danh Sách Đơn Valet Đã Đặt ({valetOrders.length})</span>
          </button>
        </div>

        {/* Quick helper tip */}
        <div className="text-[11px] text-zinc-500 flex items-center gap-1.5 self-start sm:self-center">
          <Info className="w-3.5 h-3.5 text-amber-500 shrink-0" />
          <span>Bấm <strong>"Xem Đơn Gốc"</strong> để tra cứu toàn bộ hợp đồng & ngày giờ shipper</span>
        </div>
      </div>

      {/* VIEW MODE 1: INDIVIDUAL ITEMS VIEW */}
      {closetViewMode === 'items' && (
        <div className="space-y-6">
          {/* FILTER & SEARCH BAR */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between bg-white p-3 rounded-2xl border border-zinc-200 shadow-sm">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Tìm theo tên đồ, áo dạ, sách, mã seal..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-zinc-50 border border-zinc-200 text-xs font-medium focus:bg-white focus:ring-1 focus:ring-amber-500 outline-none"
              />
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 max-w-full">
              {predefinedCategories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedCategory(c)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap ${
                    selectedCategory === c
                      ? 'bg-zinc-950 text-white shadow-sm'
                      : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                  }`}
                >
                  {c === 'all' ? `Tất Cả (${closetItems.length})` : c}
                </button>
              ))}
            </div>
          </div>

          {/* CLOSET ITEMS GRID */}
          {filteredItems.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-zinc-200 space-y-4">
              <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                <Box className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-zinc-950">Chưa có thùng đồ nào phù hợp</h3>
                <p className="text-xs text-zinc-500 max-w-md mx-auto">
                  Không tìm thấy thùng đồ nào theo từ khóa hoặc danh mục đã chọn. Hãy gửi thêm đồ mới vào kho!
                </p>
              </div>
              <button
                type="button"
                onClick={onNavigateToValet}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-zinc-950 hover:bg-amber-500 text-white text-xs font-black transition-all shadow-md"
              >
                <Truck className="w-4 h-4" />
                <span>Đặt Gửi Thùng Valet Ngay</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="group bg-white rounded-3xl border border-zinc-200 hover:border-amber-400 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    {/* Photo & Live Warehouse Badges */}
                    <div className="relative h-48 w-full bg-zinc-100 overflow-hidden">
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-zinc-950/80 via-transparent to-transparent" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                        <span className="px-2.5 py-1 rounded-full bg-zinc-950/80 backdrop-blur-md text-white text-[10px] font-mono font-bold border border-zinc-700">
                          📦 {item.boxCode}
                        </span>

                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/90 text-white text-[10px] font-bold shadow flex items-center gap-1">
                          <ThermometerSnowflake className="w-3 h-3" />
                          <span>Kho Mát 25°C</span>
                        </span>
                      </div>

                      {/* Bottom Photo Overlay Info */}
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px]">
                        <span className="font-mono font-bold text-amber-300 flex items-center gap-1">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                          <span>{item.sealNumber}</span>
                        </span>
                        <span className="text-zinc-300 text-[10px]">Vị trí: {item.warehouseBin}</span>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-5 space-y-3">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider">
                            {item.category}
                          </span>
                          <span className="text-[11px] text-zinc-400 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Gửi: {item.storedDate}</span>
                          </span>
                        </div>

                        <h3 className="font-extrabold text-base text-zinc-950 group-hover:text-amber-600 transition-colors">
                          {item.title}
                        </h3>
                      </div>

                      <p className="text-xs text-zinc-600 line-clamp-2 leading-relaxed font-normal">
                        {item.description}
                      </p>

                      {/* Link to Parent Valet Order */}
                      <div className="pt-2 border-t border-zinc-100 flex items-center justify-between text-xs">
                        <button
                          type="button"
                          onClick={() => handleOpenOrderDetailsFromItem(item)}
                          className="text-[11px] text-orange-600 hover:text-orange-700 font-bold flex items-center gap-1"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>Xem Chi Tiết Đơn Đặt Gốc</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Action Button Bar */}
                  <div className="p-4 bg-zinc-50 border-t border-zinc-100 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(item)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-white border border-zinc-300 hover:bg-zinc-100 text-zinc-800 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Sửa Ảnh / Ghi Chú</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenReturnModal(item)}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-zinc-950 hover:bg-orange-600 text-white text-xs font-black transition-all flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                    >
                      <Truck className="w-3.5 h-3.5 text-amber-400" />
                      <span>Yêu Cầu Lấy Đồ</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* VIEW MODE 2: FULL VALET ORDERS VIEW */}
      {closetViewMode === 'orders' && (
        <div className="space-y-4">
          {valetOrders.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-3xl border border-zinc-200 space-y-4">
              <div className="w-16 h-16 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-black text-zinc-950">Chưa có đơn đặt Valet Storage nào</h3>
                <p className="text-xs text-zinc-500 max-w-md mx-auto">
                  Bạn chưa tạo đơn gửi đồ Valet nào. Hãy tạo đơn đầu tiên để shipper giao thùng rỗng đến nhà!
                </p>
              </div>
              <button
                type="button"
                onClick={onNavigateToValet}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-zinc-950 hover:bg-amber-500 text-white text-xs font-black transition-all shadow-md"
              >
                <Truck className="w-4 h-4" />
                <span>Đặt Dịch Vụ Valet Storage Ngay</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {valetOrders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-3xl border border-zinc-200 p-6 shadow-sm hover:shadow-md transition-all space-y-4 text-left flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header */}
                    <div className="flex items-center justify-between border-b border-zinc-100 pb-3">
                      <div>
                        <span className="font-mono font-black text-sm text-orange-700">{order.id}</span>
                        <span className="text-[11px] text-zinc-400 block mt-0.5">Đặt ngày: {order.createdAt}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200">
                        {order.stepStatus === 'empty_box_scheduled' && '📦 Đang hẹn giao thùng rỗng'}
                        {order.stepStatus === 'in_warehouse' && '🏢 Đang lưu kho mát 25°C'}
                        {order.stepStatus === 'return_requested' && '🚚 Đang hẹn giao trả'}
                        {!['empty_box_scheduled', 'in_warehouse', 'return_requested'].includes(order.stepStatus) && 'Đang xử lý'}
                      </span>
                    </div>

                    {/* Customer & Address */}
                    <div className="p-3.5 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <strong className="text-zinc-950 font-bold">{order.customerName}</strong>
                        <span className="text-zinc-500">{order.customerPhone}</span>
                      </div>
                      <div className="text-zinc-600 flex items-start gap-1 text-[11px]">
                        <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0 mt-0.5" />
                        <span className="line-clamp-2">{order.pickupAddress}</span>
                      </div>
                    </div>

                    {/* Two-step Dates */}
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2.5 rounded-xl bg-orange-50/60 border border-orange-200/80">
                        <span className="text-zinc-500 block">1. Giao thùng rỗng:</span>
                        <strong className="text-zinc-950">{order.emptyBoxDeliveryDate}</strong>
                        {order.emptyBoxTimeSlot && (
                          <span className="text-[10px] text-zinc-500 block">{order.emptyBoxTimeSlot}</span>
                        )}
                      </div>

                      <div className="p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/80">
                        <span className="text-zinc-500 block">2. Shipper lấy đồ:</span>
                        <strong className="text-zinc-950">{order.packedPickupDate}</strong>
                        {order.packedPickupTimeSlot && (
                          <span className="text-[10px] text-zinc-500 block">{order.packedPickupTimeSlot}</span>
                        )}
                      </div>
                    </div>

                    {/* Boxes & Price */}
                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-zinc-600">
                        {order.standardBoxesCount} Thùng Standard {order.largeItemsCount > 0 ? `+ ${order.largeItemsCount} Kiện lớn` : ''}
                      </span>
                      <strong className="text-orange-700 font-mono font-black text-sm">
                        {order.totalFirstMonth?.toLocaleString('vi-VN')} đ
                      </strong>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-zinc-100 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedOrderDetails(order)}
                      className="w-full py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                    >
                      <Eye className="w-3.5 h-3.5 text-amber-400" />
                      <span>Xem Toàn Bộ Chi Tiết Hợp Đồng Đơn</span>
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL 1: YÊU CẦU SHIPPER GIAO TRẢ THÙNG VỀ NHÀ */}
      {returnModalItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/80 backdrop-blur-sm animate-fade-in p-4 flex justify-center items-center">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden my-auto p-6 text-left space-y-5">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-md">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-zinc-950">Yêu Cầu Giao Trả Thùng Đồ Tận Nhà</h3>
                  <p className="text-[11px] text-zinc-500">Shipper BoxifyX sẽ xuất kho và mang trả tận cửa</p>
                </div>
              </div>
              <button
                onClick={() => setReturnModalItem(null)}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Target Item Card Recap */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-mono font-bold text-amber-900">📦 {returnModalItem.boxCode}</span>
                <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 text-[10px] font-extrabold">
                  Seal: {returnModalItem.sealNumber}
                </span>
              </div>
              <h4 className="font-black text-sm text-zinc-950">{returnModalItem.title}</h4>
              <p className="text-zinc-600 text-[11px] line-clamp-1">{returnModalItem.description}</p>
            </div>

            {/* Appointment Date & Slot */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Chọn ngày nhận đồ:</label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 font-medium outline-none focus:ring-1 focus:ring-orange-400"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-zinc-700 block mb-1">Khung giờ giao:</label>
                <select
                  value={returnTimeSlot}
                  onChange={(e) => setReturnTimeSlot(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-zinc-300 font-medium outline-none focus:ring-1 focus:ring-orange-400"
                >
                  <option value="08:00 - 12:00 (Sáng)">08:00 - 12:00 (Sáng)</option>
                  <option value="13:00 - 17:00 (Chiều)">13:00 - 17:00 (Chiều)</option>
                  <option value="18:00 - 21:00 (Tối)">18:00 - 21:00 (Tối)</option>
                </select>
              </div>
            </div>

            {/* Delivery Address */}
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">Địa chỉ nhận hàng (TP.HCM):</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
                <input
                  type="text"
                  value={returnAddress}
                  onChange={(e) => setReturnAddress(e.target.value)}
                  placeholder="Số nhà, tên đường, phường, quận..."
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-zinc-300 text-xs font-medium focus:ring-1 focus:ring-orange-400 outline-none"
                />
              </div>
            </div>

            {/* Shipper Note */}
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">Ghi chú cho tài xế giao hàng:</label>
              <input
                type="text"
                value={returnNote}
                onChange={(e) => setReturnNote(e.target.value)}
                placeholder="VD: Gửi lễ tân tòa A, gọi trước khi đến..."
                className="w-full p-2.5 rounded-xl border border-zinc-300 text-xs font-medium focus:ring-1 focus:ring-orange-400 outline-none"
              />
            </div>

            {/* Submit Action */}
            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={handleConfirmReturnDelivery}
                disabled={isProcessingReturn}
                className="w-full py-3.5 rounded-2xl bg-zinc-950 hover:bg-orange-600 text-white font-black text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-98 disabled:opacity-50"
              >
                {isProcessingReturn ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Đang điều phối lệnh xuất kho...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Xác Nhận Đặt Lịch Hoàn Trả Đồ</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setReturnModalItem(null)}
                className="w-full py-1 text-center text-xs text-zinc-500 hover:text-zinc-900 font-semibold"
              >
                Hủy bỏ
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 2: CHỈNH SỬA GHI CHÚ & ẢNH CHỤP THÙNG ĐỒ */}
      {editingItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/80 backdrop-blur-sm animate-fade-in p-4 flex justify-center items-center">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden my-auto p-6 text-left space-y-5">
            
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-amber-500" />
                <h3 className="text-base font-black text-zinc-950">
                  Cập Nhật Ghi Chú & Ảnh Thùng {editingItem.boxCode}
                </h3>
              </div>
              <button
                onClick={() => setEditingItem(null)}
                className="w-8 h-8 rounded-full bg-zinc-100 hover:bg-zinc-200 text-zinc-500 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Photo Upload Simulation */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-700 block">Hình ảnh thực tế đồ đạc bên trong thùng:</label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-2xl bg-zinc-100 border border-zinc-300 overflow-hidden shrink-0 relative">
                  <img src={editImagePreview} alt="Preview" className="w-full h-full object-cover" />
                </div>

                <div className="space-y-1.5 flex-1 text-xs">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-bold flex items-center gap-1.5 text-xs shadow-sm"
                  >
                    <Camera className="w-3.5 h-3.5 text-amber-400" />
                    <span>Tải Ảnh Mới Từ Điện Thoại</span>
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageFileChange}
                  />
                  <p className="text-[11px] text-zinc-400">Hỗ trợ JPG, PNG (Tối đa 10MB)</p>
                </div>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">Tên gợi nhớ thùng đồ:</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-300 text-xs font-medium outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">Phân loại danh mục:</label>
              <select
                value={editCategory}
                onChange={(e) => setEditCategory(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-zinc-300 text-xs font-medium outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="Thời trang">Thời trang & Quần áo</option>
                <option value="Sách & Tài liệu">Sách & Tài liệu</option>
                <option value="Thể thao & Dã ngoại">Thể thao & Dã ngoại</option>
                <option value="Đồ Gia dụng & Thiết bị">Đồ Gia dụng & Thiết bị</option>
                <option value="Đồ chơi & Sưu tầm">Đồ chơi & Sưu tầm</option>
              </select>
            </div>

            {/* Detailed Description */}
            <div>
              <label className="text-xs font-bold text-zinc-700 block mb-1">Kê khai chi tiết các món đồ bên trong:</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={3}
                className="w-full p-2.5 rounded-xl border border-zinc-300 text-xs font-medium outline-none focus:ring-1 focus:ring-amber-500 resize-none"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="flex-1 py-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 text-xs font-bold"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleSaveItemEdit}
                className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-black shadow-md"
              >
                Lưu Thay Đổi
              </button>
            </div>

          </div>
        </div>
      )}

      {/* MODAL 3: XEM CHI TIẾT TOÀN BỘ ĐƠN ĐẶT VALET STORAGE */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-zinc-950/80 backdrop-blur-sm animate-fade-in p-4 flex justify-center items-center">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-zinc-200 overflow-hidden my-auto max-h-[92vh] flex flex-col text-left">
            
            {/* Header */}
            <div className="sticky top-0 z-10 shrink-0 px-6 py-4 bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-800">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-orange-400 bg-orange-500/20 px-2 py-0.5 rounded-full border border-orange-500/30">
                  Hợp Đồng Lưu Kho Valet Storage
                </span>
                <h3 className="text-base font-black text-white mt-1 flex items-center gap-2">
                  <span>Mã Đơn: {selectedOrderDetails.id}</span>
                  <span className="text-xs font-normal text-zinc-400">({selectedOrderDetails.createdAt})</span>
                </h3>
              </div>
              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="w-8 h-8 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-colors shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="overflow-y-auto p-6 space-y-5 flex-1 text-xs">
              
              {/* Status Banner */}
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                <div className="flex items-center gap-2 text-amber-950 font-bold">
                  <PackageCheck className="w-5 h-5 text-orange-600" />
                  <span>Trạng thái đơn:</span>
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-900 text-[11px] font-black">
                    {selectedOrderDetails.stepStatus === 'empty_box_scheduled' && '📦 Đang chuẩn bị giao thùng rỗng'}
                    {selectedOrderDetails.stepStatus === 'in_warehouse' && '🏢 Đã lưu kho an toàn 25°C'}
                    {selectedOrderDetails.stepStatus === 'return_requested' && '🚚 Đang điều phối giao trả tận nhà'}
                    {!['empty_box_scheduled', 'in_warehouse', 'return_requested'].includes(selectedOrderDetails.stepStatus) && 'Đang vận hành'}
                  </span>
                </div>

                <span className="text-zinc-500 text-[11px]">Bảo hiểm 20Tr</span>
              </div>

              {/* Customer & Delivery Address */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                <h4 className="font-extrabold text-zinc-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-zinc-600" />
                  <span>Thông Tin Khách Hàng & Địa Điểm</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-zinc-700">
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Người gửi / nhận:</span>
                    <strong className="text-zinc-950">{selectedOrderDetails.customerName}</strong> ({selectedOrderDetails.customerPhone})
                  </div>
                  <div>
                    <span className="text-zinc-400 block text-[10px]">Loại địa hình:</span>
                    <strong className="text-zinc-950">{selectedOrderDetails.buildingType || 'Nhà riêng / Chung cư'}</strong>
                  </div>
                  <div className="sm:col-span-2">
                    <span className="text-zinc-400 block text-[10px]">Địa chỉ giao nhận tận nơi:</span>
                    <strong className="text-zinc-950 font-medium">{selectedOrderDetails.pickupAddress}</strong>
                  </div>
                  {selectedOrderDetails.shipperNote && (
                    <div className="sm:col-span-2 text-[11px] text-zinc-500">
                      Ghi chú shipper: <em>"{selectedOrderDetails.shipperNote}"</em>
                    </div>
                  )}
                </div>
              </div>

              {/* 2-Step Logistics Timeline */}
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-3">
                <h4 className="font-extrabold text-zinc-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-orange-600" />
                  <span>Lịch Trình Vận Hành 2 Bước Của Shipper</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-white border border-zinc-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-zinc-950 text-[11px]">
                      <Truck className="w-3.5 h-3.5 text-amber-500" />
                      <span>Bước 1: Giao thùng rỗng</span>
                    </div>
                    <p className="text-zinc-700 font-bold">{selectedOrderDetails.emptyBoxDeliveryDate}</p>
                    <p className="text-[10px] text-zinc-400">{selectedOrderDetails.emptyBoxTimeSlot || '08:00 - 12:00 (Sáng)'}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-white border border-zinc-200 space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-zinc-950 text-[11px]">
                      <Calendar className="w-3.5 h-3.5 text-orange-500" />
                      <span>Bước 2: Lấy đồ về kho</span>
                    </div>
                    <p className="text-zinc-700 font-bold">{selectedOrderDetails.packedPickupDate}</p>
                    <p className="text-[10px] text-zinc-400">{selectedOrderDetails.packedPickupTimeSlot || '13:00 - 17:00 (Chiều)'}</p>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="p-4 rounded-2xl bg-zinc-900 text-white space-y-2">
                <h4 className="font-extrabold text-xs uppercase tracking-wider text-amber-400">
                  Cước Phí & Thanh Toán Tháng Đầu
                </h4>
                <div className="space-y-1.5 text-zinc-300 text-xs">
                  <div className="flex justify-between">
                    <span>Thùng Standard ({selectedOrderDetails.standardBoxesCount} thùng x 120k):</span>
                    <strong className="text-white">{(selectedOrderDetails.standardBoxesCount * 120000).toLocaleString('vi-VN')} đ</strong>
                  </div>
                  {selectedOrderDetails.largeItemsCount > 0 && (
                    <div className="flex justify-between">
                      <span>Kiện quá khổ ({selectedOrderDetails.largeItemsCount} kiện x 200k):</span>
                      <strong className="text-white">{(selectedOrderDetails.largeItemsCount * 200000).toLocaleString('vi-VN')} đ</strong>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Phí ship & bốc xếp ({selectedOrderDetails.distanceKm} km):</span>
                    <strong className={selectedOrderDetails.shippingFee === 0 ? 'text-emerald-400' : 'text-white'}>
                      {selectedOrderDetails.shippingFee === 0 ? 'MIỄN PHÍ' : `${selectedOrderDetails.shippingFee?.toLocaleString('vi-VN')} đ`}
                    </strong>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-zinc-800 text-sm font-black">
                    <span className="text-zinc-100">Tổng tháng đầu:</span>
                    <span className="text-amber-400 text-base">{selectedOrderDetails.totalFirstMonth?.toLocaleString('vi-VN')} đ</span>
                  </div>
                </div>
              </div>

              {/* List of Boxes inside this Order */}
              <div className="space-y-2">
                <h4 className="font-extrabold text-zinc-950 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Box className="w-3.5 h-3.5 text-amber-600" />
                  <span>Danh Sách Thùng Đồ Thuộc Đơn Này ({selectedOrderDetails.items?.length || selectedOrderDetails.standardBoxesCount} Thùng)</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(selectedOrderDetails.items && selectedOrderDetails.items.length > 0 ? selectedOrderDetails.items : [
                    {
                      id: 'box-1',
                      boxCode: `BX-STD-${selectedOrderDetails.id.slice(-4)}`,
                      title: `Thùng Standard #${selectedOrderDetails.id}`,
                      itemType: 'standard_box' as const,
                      description: selectedOrderDetails.storageItemNotes || 'Đồ dùng cá nhân',
                      sealNumber: `SEAL-HCM-${selectedOrderDetails.id.slice(-4)}`,
                      warehouseBin: 'KHO1-C-01-S1',
                      imageUrl: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80',
                      storedDate: selectedOrderDetails.createdAt,
                      category: 'Thời trang & Quần áo',
                    }
                  ]).map((box) => (
                    <div key={box.id} className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-zinc-200 overflow-hidden shrink-0">
                        <img src={box.imageUrl} alt={box.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="overflow-hidden">
                        <span className="font-mono font-bold text-amber-900 block text-xs">{box.boxCode}</span>
                        <p className="font-bold text-zinc-950 truncate text-xs">{box.title}</p>
                        <span className="text-[10px] text-zinc-500">Seal: {box.sealNumber}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Footer Close */}
            <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedOrderDetails(null)}
                className="px-6 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-bold text-xs"
              >
                Đóng
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
