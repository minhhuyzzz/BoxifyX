import { supabase } from '../lib/supabaseClient';
import { LockerStation, LockerBooking, ValetOrder, ValetItem } from '../types';
import { MOCK_STATIONS, MOCK_DEFAULT_VALET_ITEMS } from '../data/mockData';

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

      // If remote has a complete set of >= 27 stations, use it; otherwise use the verified 27 MOCK_STATIONS
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
   * Tạo đơn đặt tủ Smart Locker mới vào Supabase
   */
  async createLockerBooking(booking: LockerBooking): Promise<boolean> {
    try {
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
   * Tạo đơn lưu kho Valet Storage mới
   */
  async createValetOrder(order: ValetOrder): Promise<boolean> {
    try {
      const { error } = await supabase.from('valet_orders').insert({
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

      return !error;
    } catch {
      return false;
    }
  },

  /**
   * Lấy danh sách vật phẩm trong Tủ Đồ Ảo (Valet Items)
   */
  async getValetItems(): Promise<ValetItem[]> {
    try {
      const { data, error } = await supabase
        .from('valet_items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        return MOCK_DEFAULT_VALET_ITEMS;
      }

      return data.map((item) => ({
        id: item.id,
        boxCode: item.box_code,
        title: item.title,
        itemType: item.item_type === 'large_oversized' ? 'large_item' : 'standard_box',
        description: item.description || '',
        sealNumber: item.security_seal_number || 'SEAL-HCM',
        warehouseBin: item.warehouse_bin || 'KHO1-A',
        imageUrl: item.image_url || 'https://images.unsplash.com/photo-1520006403909-838d6b92c22e?w=800&auto=format&fit=crop&q=80',
        storedDate: new Date(item.created_at).toLocaleDateString('vi-VN'),
        category: item.category || 'Thời trang',
      }));
    } catch {
      return MOCK_DEFAULT_VALET_ITEMS;
    }
  },

  /**
   * Lấy danh sách đơn lưu kho Valet Storage
   */
  async getValetOrders(): Promise<ValetOrder[]> {
    try {
      const { data, error } = await supabase
        .from('valet_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        return [];
      }

      return data.map((o) => ({
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
        items: [],
        createdAt: new Date(o.created_at).toLocaleDateString('vi-VN'),
      }));
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
   * Thêm thùng đồ mới vào Tủ Đồ Ảo
   */
  async addValetItem(item: ValetItem): Promise<boolean> {
    try {
      const { error } = await supabase.from('valet_items').insert({
        box_code: item.boxCode,
        security_seal_number: item.sealNumber,
        item_type: item.itemType === 'large_item' ? 'large_oversized' : 'standard_box_60x40x40',
        title: item.title,
        description: item.description,
        category: item.category,
        warehouse_bin: item.warehouseBin,
        image_url: item.imageUrl,
        status: 'in_storage',
      });

      return !error;
    } catch {
      return false;
    }
  }
};
