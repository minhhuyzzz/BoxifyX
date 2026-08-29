import { LockerSize, LockerPricingResult } from '../types';

/**
 * Bảng giá Smart Locker theo giờ:
 * - Size S: 10.000 đ cho 2h đầu, 5.000 đ mỗi giờ tiếp theo.
 * - Size M: 18.000 đ cho 2h đầu, 8.000 đ mỗi giờ tiếp theo.
 * - Size L: 25.000 đ cho 2h đầu, 12.000 đ mỗi giờ tiếp theo.
 * - Giảm giá 20% tổng hóa đơn khi thuê từ 24h trở lên.
 */
export function calculateLockerFee(size: LockerSize, hoursInput: number): LockerPricingResult {
  const hours = Math.max(1, Math.ceil(hoursInput));
  
  let first2h = 10000;
  let extraPerHour = 5000;

  if (size === 'M') {
    first2h = 18000;
    extraPerHour = 8000;
  } else if (size === 'L') {
    first2h = 25000;
    extraPerHour = 12000;
  }

  let subtotal = 0;
  if (hours <= 2) {
    subtotal = first2h;
  } else {
    subtotal = first2h + (hours - 2) * extraPerHour;
  }

  const isDiscountApplied = hours >= 24;
  const discount = isDiscountApplied ? Math.round(subtotal * 0.20) : 0;
  const total = subtotal - discount;

  return {
    size,
    hours,
    subtotal,
    discount,
    total,
    isDiscountApplied,
  };
}

/**
 * Tọa độ Kho Tổng Trung Tâm BoxifyX TP.HCM (Tân Bình Logistics Hub)
 */
export const WAREHOUSE_COORDINATES = {
  lat: 10.8231,
  lng: 106.6297,
  name: 'Kho Trung Tâm BoxifyX Tân Bình'
};

/**
 * Tính khoảng cách Haversine giữa 2 tọa độ (có nhân hệ số đường phố TP.HCM = 1.25)
 */
export function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371.0; // Bán kính Trái Đất (km)
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const rawDistance = R * c;
  const urbanDistance = rawDistance * 1.25; // Hệ số uốn khúc giao thông TP.HCM

  return Math.round(urbanDistance * 10) / 10;
}

/**
 * Tính cước vận chuyển giao nhận thùng tận nhà tại TP.HCM:
 * - Miễn phí 3km đầu (0 đ).
 * - Từ km thứ 4 trở đi: 6.000 đ / km (làm tròn lên km kế tiếp).
 */
export function calculateValetShippingFee(distanceKm: number): number {
  if (distanceKm <= 3.0) {
    return 0;
  }
  const billableKm = Math.ceil(distanceKm - 3.0);
  return billableKm * 6000;
}

/**
 * Bảng giá lưu kho Valet Storage theo tháng:
 * - Thùng Standard (60x40x40 cm): 120.000 đ / thùng / tháng
 * - Thùng Large / Đồ quá khổ: 200.000 đ / kiện / tháng
 */
export function calculateValetMonthlyFee(
  standardCount: number,
  largeCount: number
): {
  standardTotal: number;
  largeTotal: number;
  monthlyTotal: number;
} {
  const standardTotal = standardCount * 120000;
  const largeTotal = largeCount * 200000;
  const monthlyTotal = standardTotal + largeTotal;

  return {
    standardTotal,
    largeTotal,
    monthlyTotal,
  };
}

/**
 * Format tiền tệ VND đẹp mắt
 */
export function formatVND(amount: number): string {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(amount);
}
