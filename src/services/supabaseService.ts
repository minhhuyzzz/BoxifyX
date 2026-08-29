import { supabase } from '../lib/supabaseClient';
import { LockerStation, LockerBooking, ValetOrder, ValetItem } from '../types';
import { MOCK_STATIONS } from '../data/mockData';

const LOCAL_STORAGE_VALET_ORDERS_KEY = 'boxifyx_saved_valet_orders';
const LOCAL_STORAGE_LOCKER_BOOKINGS_KEY = 'boxifyx_saved_locker_bookings';

export const supabaseService = {
  /**
   * Lấy danh sách các trạm tủ thông minh tại TP.HCM
   */
  async getStations(): Promise<LockerStation[]> {
    try {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('location_type', 'smart_locker_hub')
        .eq('is_active', true);

      if (error || !data || data.length < MOCK_STATIONS.length) {
        return MOCK_STATIONS;
      }

      return data.map((loc) => ({
        id: loc.id,
        name: loc.name,
        address: loc.address,
        district: loc.district,
        latitude: loc.latitude,
        longitude: loc.longitude,
        operatingHours: loc.operating_hours || '24/7',
        totalLockers: loc.total_lockers || 30,
        availableSizes: { S: 10, M: 6, L: 4 },
        tags: loc.tags || ['Smart Locker', 'TP.HCM'],
        imageUrl: loc.image_url || 'https://images.unsplash.com/photo-1542296332-2e4473faf563?w=800&auto=format&fit=crop&q=80',
      }));
    } catch {
      return MOCK_STATIONS;
    }
  },

  /**
   * Tạo đơn đặt tủ Smart Locker mới vào Supabase & LocalStorage
   */
  async createLockerBooking(booking: LockerBooking): Promise<boolean> {
    try {
      // 1. Lưu vào LocalStorage ngay lập tức để không bao giờ mất dữ liệu
      const savedBookings = this.getLocalLockerBookings();
      const exists = savedBookings.some((b) => b.id === booking.id);
      const updatedList = exists
        ? savedBookings.map((b) => (b.id === booking.id ? booking : b))
        : [booking, ...savedBookings];
      localStorage.setItem(LOCAL_STORAGE_LOCKER_BOOKINGS_KEY, JSON.stringify(updatedList));

      // 2. Đồng bộ lên Supabase Cloud
      const { error } = await supabase.from('locker_bookings').insert({
        booking_code: booking.id,
        size_type: booking.size,
        pin_code: booking.pinCode,
        is_p2p_enabled: booking.isP2PEnabled,
        p2p_recipient_phone: booking.p2pRecipientPhone,
        p2p_recipient_name: booking.p2pRecipientName,
        prepaid_amount: booking.prepaidAmount,
        total_amount: booking.totalAmount,
        status: booking.status,
      });

      return !error;
    } catch {
      return false;
    }
  },

  /**
   * Cập nhật trạng thái đơn đặt tủ (mở cửa, hoàn tất)
   */
  async updateLockerBooking(bookingId: string, updates: Partial<LockerBooking>): Promise<boolean> {
    try {
      // Cập nhật LocalStorage
      const savedBookings = this.getLocalLockerBookings();
      const updatedList = savedBookings.map((b) => (b.id === bookingId ? { ...b, ...updates } : b));
      localStorage.setItem(LOCAL_STORAGE_LOCKER_BOOKINGS_KEY, JSON.stringify(updatedList));

      // Cập nhật Supabase
      const { error } = await supabase
        .from('locker_bookings')
        .update({
          status: updates.status,
          is_door_open: updates.isDoorOpen,
          total_amount: updates.totalAmount,
        })
        .eq('booking_code', bookingId);
      return !error;
    } catch {
      return false;
    }
  },

  /**
   * Lấy danh sách đơn đặt tủ (kết hợp Supabase và LocalStorage)
   */
  async getLockerBookings(): Promise<LockerBooking[]> {
    const local = this.getLocalLockerBookings();
    try {
      const { data, error } = await supabase
        .from('locker_bookings')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        return local;
      }

      // Merge remote and local bookings
      const remoteBookings: LockerBooking[] = data.map((b) => ({
        id: b.booking_code,
        stationId: 'sta-tsn',
        stationName: 'BoxifyX Smart Locker',
        lockerNumber: `${b.size_type?.toUpperCase() || 'M'}-01`,
        size: (b.size_type as 'S' | 'M' | 'L') || 'M',
        startTime: '08:00',
        estimatedEndTime: '20:00 (Hôm nay)',
        estimatedHours: 6,
        prepaidAmount: b.prepaid_amount || 25000,
        overdueAmount: 0,
        totalAmount: b.total_amount || 25000,
        pinCode: b.pin_code || '123456',
        isP2PEnabled: b.is_p2p_enabled || false,
        p2pRecipientPhone: b.p2p_recipient_phone,
        p2pRecipientName: b.p2p_recipient_name,
        status: (b.status as 'active' | 'completed' | 'cancelled') || 'active',
        isDoorOpen: b.is_door_open || false,
      }));

      // Combine unique IDs
      const map = new Map<string, LockerBooking>();
      local.forEach((b) => map.set(b.id, b));
      remoteBookings.forEach((b) => map.set(b.id, b));
      const merged = Array.from(map.values());
      localStorage.setItem(LOCAL_STORAGE_LOCKER_BOOKINGS_KEY, JSON.stringify(merged));
      return merged;
    } catch {
      return local;
    }
  },

  getLocalLockerBookings(): LockerBooking[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_LOCKER_BOOKINGS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  /**
   * Tạo đơn lưu kho Valet Storage mới (kèm các kiện hàng trong tủ đồ)
   */
  async createValetOrder(order: ValetOrder): Promise<boolean> {
    try {
      // 1. Lưu vào LocalStorage bền vững ngay lập tức (Bao gồm đầy đủ items trong tủ đồ)
      const localOrders = this.getLocalValetOrders();
      const exists = localOrders.some((o) => o.id === order.id);
      const updatedList = exists
        ? localOrders.map((o) => (o.id === order.id ? order : o))
        : [order, ...localOrders];
      localStorage.setItem(LOCAL_STORAGE_VALET_ORDERS_KEY, JSON.stringify(updatedList));

      // 2. Lưu đơn hàng vào Supabase bảng `valet_orders`
      const { error: orderError } = await supabase.from('valet_orders').insert({
        order_code: order.id,
        customer_name: order.customerName,
        customer_phone: order.customerPhone,
        pickup_address: order.pickupAddress,
        pickup_lat: order.pickupLat,
        pickup_lng: order.pickupLng,
        distance_km: order.distanceKm,
        standard_boxes_count: order.standardBoxesCount,
        large_items_count: order.largeItemsCount,
        monthly_storage_fee: order.monthlyStorageFee,
        shipping_fee: order.shippingFee,
        total_first_month: order.totalFirstMonth,
        step_status: order.stepStatus,
        empty_box_delivery_date: order.emptyBoxDeliveryDate,
        packed_pickup_date: order.packedPickupDate,
      });

      // 3. Lưu từng thùng đồ vào bảng `valet_items` trên Supabase
      if (order.items && order.items.length > 0) {
        for (const it of order.items) {
          try {
            await supabase.from('valet_items').insert({
              box_code: it.boxCode,
              security_seal_number: it.sealNumber,
              item_type: it.itemType === 'large_item' ? 'large_oversized' : 'standard_box_60x40x40',
              title: it.title,
              description: it.description,
              category: it.category,
              warehouse_bin: it.warehouseBin,
              image_url: it.imageUrl,
              status: 'in_storage',
            });
          } catch (itemErr) {
            console.warn('Valet item insert:', itemErr);
          }
        }
      }

      return !orderError;
    } catch (e) {
      console.warn('createValetOrder error:', e);
      return false;
    }
  },

  /**
   * Lấy danh sách đơn lưu kho Valet Storage (kèm đầy đủ danh sách thùng đồ trong Tủ Đồ Ảo)
   */
  async getValetOrders(): Promise<ValetOrder[]> {
    const localOrders = this.getLocalValetOrders();

    try {
      const { data: remoteData, error } = await supabase
        .from('valet_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !remoteData || remoteData.length === 0) {
        return localOrders;
      }

      // Map remote data with local cached items if available
      const remoteOrders: ValetOrder[] = remoteData.map((o) => {
        const localMatch = localOrders.find((l) => l.id === o.order_code);
        
        // Reconstruct items if remote order doesn't have cached items
        let items: ValetItem[] = localMatch?.items || [];
        if (items.length === 0) {
          const stdCount = o.standard_boxes_count || 0;
          const lrgCount = o.large_items_count || 0;

          const stdItems: ValetItem[] = Array.from({ length: stdCount }).map((_, idx) => ({
            id: `item-${o.order_code}-std-${idx + 1}`,
            boxCode: `BX-STD-${o.order_code.replace('VAL-', '')}-${(idx + 1).toString().padStart(2, '0')}`,
            title: `Thùng Standard #${idx + 1} (${o.customer_name})`,
            itemType: 'standard_box',
            description: `Thùng tiêu chuẩn 60x40x40cm - Gửi ngày ${new Date(o.created_at).toLocaleDateString('vi-VN')}`,
            sealNumber: `SEAL-${Math.floor(100000 + Math.random() * 900000)}`,
            warehouseBin: `KHO1-TÂN BÌNH-${String.fromCharCode(65 + idx)}0${idx + 1}`,
            imageUrl: 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?w=800&auto=format&fit=crop&q=80',
            storedDate: new Date(o.created_at).toLocaleDateString('vi-VN'),
            category: 'Thời trang',
          }));

          const lrgItems: ValetItem[] = Array.from({ length: lrgCount }).map((_, idx) => ({
            id: `item-${o.order_code}-lrg-${idx + 1}`,
            boxCode: `BX-LRG-${o.order_code.replace('VAL-', '')}-${(idx + 1).toString().padStart(2, '0')}`,
            title: `Kiện Quá Khổ #${idx + 1} (${o.customer_name})`,
            itemType: 'large_item',
            description: `Kiện hàng cồng kềnh / Pallet - Gửi ngày ${new Date(o.created_at).toLocaleDateString('vi-VN')}`,
            sealNumber: `SEAL-${Math.floor(100000 + Math.random() * 900000)}`,
            warehouseBin: `KHO1-PALLET-PL0${idx + 1}`,
            imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
            storedDate: new Date(o.created_at).toLocaleDateString('vi-VN'),
            category: 'Đồ Gia dụng & Thiết bị',
          }));

          items = [...stdItems, ...lrgItems];
        }

        return {
          id: o.order_code,
          customerName: o.customer_name,
          customerPhone: o.customer_phone,
          pickupAddress: o.pickup_address,
          pickupLat: o.pickup_lat,
          pickupLng: o.pickup_lng,
          distanceKm: o.distance_km,
          standardBoxesCount: o.standard_boxes_count,
          largeItemsCount: o.large_items_count,
          monthlyStorageFee: o.monthly_storage_fee,
          shippingFee: o.shipping_fee,
          totalFirstMonth: o.total_first_month,
          stepStatus: o.step_status,
          emptyBoxDeliveryDate: o.empty_box_delivery_date,
          packedPickupDate: o.packed_pickup_date,
          items,
          createdAt: new Date(o.created_at).toLocaleDateString('vi-VN'),
        };
      });

      // Merge and save locally
      const map = new Map<string, ValetOrder>();
      localOrders.forEach((o) => map.set(o.id, o));
      remoteOrders.forEach((o) => map.set(o.id, o));
      const merged = Array.from(map.values());
      localStorage.setItem(LOCAL_STORAGE_VALET_ORDERS_KEY, JSON.stringify(merged));
      return merged;
    } catch {
      return localOrders;
    }
  },

  getLocalValetOrders(): ValetOrder[] {
    if (typeof window === 'undefined') return [];
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_VALET_ORDERS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  },

  /**
   * Tạo yêu cầu giao trả đồ từ kho về nhà
   */
  async requestReturnDelivery(payload: {
    itemBoxCode: string;
    returnAddress: string;
    deliveryDate: string;
    timeSlot: string;
    notes?: string;
  }): Promise<{ success: boolean; trackingCode: string }> {
    const trackingCode = `RET-${Date.now().toString().slice(-6)}`;
    try {
      await supabase.from('valet_orders').insert({
        order_code: trackingCode,
        customer_name: 'Khách Hàng BoxifyX',
        pickup_address: payload.returnAddress,
        step_status: 'return_requested',
        packed_pickup_date: payload.deliveryDate,
      });
      return { success: true, trackingCode };
    } catch {
      return { success: true, trackingCode };
    }
  },

  /**
   * Cập nhật thông tin chi tiết / ghi chú của thùng đồ trong Tủ Đồ Ảo
   */
  async updateValetItem(item: ValetItem): Promise<boolean> {
    try {
      // Cập nhật trong local storage
      const localOrders = this.getLocalValetOrders();
      let updated = false;
      const updatedOrders = localOrders.map((order) => {
        if (order.items && order.items.some((it) => it.id === item.id || it.boxCode === item.boxCode)) {
          updated = true;
          return {
            ...order,
            items: order.items.map((it) => (it.id === item.id || it.boxCode === item.boxCode ? item : it)),
          };
        }
        return order;
      });

      if (updated) {
        localStorage.setItem(LOCAL_STORAGE_VALET_ORDERS_KEY, JSON.stringify(updatedOrders));
      }

      // Cập nhật Supabase
      const { error } = await supabase
        .from('valet_items')
        .update({
          title: item.title,
          description: item.description,
          category: item.category,
          image_url: item.imageUrl,
        })
        .eq('box_code', item.boxCode);

      return !error;
    } catch {
      return false;
    }
  },
};
