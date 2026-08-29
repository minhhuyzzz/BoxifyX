export type LockerSize = 'S' | 'M' | 'L';

export interface LockerStation {
  id: string;
  name: string;
  address: string;
  district: string;
  latitude: number;
  longitude: number;
  operatingHours: string;
  totalLockers: number;
  availableSizes: {
    S: number;
    M: number;
    L: number;
  };
  tags: string[];
  imageUrl: string;
}

export interface LockerPricingResult {
  size: LockerSize;
  hours: number;
  subtotal: number;
  discount: number;
  total: number;
  isDiscountApplied: boolean;
}

export interface LockerBooking {
  id: string;
  stationId: string;
  stationName: string;
  stationAddress?: string;
  lockerNumber: string;
  size: LockerSize;
  startTime: string;
  estimatedEndTime: string;
  actualEndTime?: string;
  estimatedHours: number;
  prepaidAmount: number;
  overdueAmount: number;
  totalAmount: number;
  pinCode: string;
  isP2PEnabled: boolean;
  p2pRecipientPhone?: string;
  p2pRecipientName?: string;
  paymentMethod?: 'vietqr' | 'kiosk' | 'momo' | 'card';
  status: 'active' | 'overdue' | 'completed' | 'cancelled';
  isDoorOpen: boolean;
}

export type ValetItemType = 'standard_box' | 'large_item';

export interface ValetItem {
  id: string;
  boxCode: string;
  title: string;
  itemType: ValetItemType;
  description: string;
  sealNumber: string;
  warehouseBin: string;
  imageUrl: string;
  storedDate: string;
  category: string;
}

export interface ValetOrder {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  pickupAddress: string;
  pickupLat: number;
  pickupLng: number;
  distanceKm: number;
  buildingType?: string;
  shipperNote?: string;
  storageItemNotes?: string;
  standardBoxesCount: number;
  largeItemsCount: number;
  monthlyStorageFee: number;
  shippingFee: number;
  totalFirstMonth: number;
  paymentMethod?: 'cod' | 'vietqr' | 'momo' | 'card';
  stepStatus: 'empty_box_scheduled' | 'empty_box_delivered' | 'packed_pickup_scheduled' | 'in_warehouse' | 'return_requested' | 'completed';
  emptyBoxDeliveryDate: string;
  emptyBoxTimeSlot?: string;
  packedPickupDate: string;
  packedPickupTimeSlot?: string;
  items: ValetItem[];
  createdAt: string;
}

export interface PaymentDetails {
  bookingId?: string;
  orderId?: string;
  amount: number;
  description: string;
  accountNo: string;
  accountName: string;
  bankCode: string;
  qrUrl: string;
}

