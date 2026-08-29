import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, Navigation, Loader2, CheckCircle2, Building, Home, Compass } from 'lucide-react';
import { calculateHaversineDistance, calculateValetShippingFee, WAREHOUSE_COORDINATES, formatVND } from '../lib/pricing';

export interface SelectedLocation {
  fullAddress: string;
  streetAndArea: string;
  houseNumber: string;
  district: string;
  lat: number;
  lng: number;
  distanceKm: number;
  shippingFee: number;
}

interface AddressAutocompleteProps {
  initialStreet?: string;
  initialHouseNo?: string;
  onLocationSelect: (location: SelectedLocation) => void;
}

// Curated Popular TP.HCM Hubs & Arterial Roads for instant auto-complete
const POPULAR_HCM_LOCATIONS = [
  { name: 'Đường Nguyễn Văn Bảo, Phường 4, Quận Gò Vấp', district: 'Gò Vấp', lat: 10.8222, lng: 106.6873 },
  { name: 'Đường Hoàng Hoa Thám, Phường 13, Quận Tân Bình', district: 'Tân Bình', lat: 10.8012, lng: 106.6456 },
  { name: 'Đường Trường Chinh, Phường 15, Quận Tân Bình', district: 'Tân Bình', lat: 10.8122, lng: 106.6345 },
  { name: 'Tòa nhà Landmark 81, 720A Điện Biên Phủ, Phường 22, Bình Thạnh', district: 'Bình Thạnh', lat: 10.7951, lng: 106.7218 },
  { name: 'Đường Lê Duẩn, Phường Bến Nghé, Quận 1', district: 'Quận 1', lat: 10.7801, lng: 106.6998 },
  { name: 'Đường Nguyễn Thị Minh Khai, Phường 6, Quận 3', district: 'Quận 3', lat: 10.7785, lng: 106.6912 },
  { name: 'Chung cư Masteri Thảo Điền, 159 Xa Lộ Hà Nội, TP. Thủ Đức', district: 'TP. Thủ Đức', lat: 10.8038, lng: 106.7335 },
  { name: 'Đường Phan Xích Long, Phường 2, Quận Phú Nhuận', district: 'Phú Nhuận', lat: 10.7968, lng: 106.6885 },
  { name: 'TTTM Vạn Hạnh Mall, 11 Sư Vạn Hạnh, Phường 12, Quận 10', district: 'Quận 10', lat: 10.7701, lng: 106.6698 },
  { name: 'TTTM Crescent Mall, 101 Tôn Dật Tiên, Tân Phong, Quận 7', district: 'Quận 7', lat: 10.7295, lng: 106.7198 },
  { name: 'Chung cư Sunrise City, 23 Nguyễn Hữu Thọ, Tân Hưng, Quận 7', district: 'Quận 7', lat: 10.7565, lng: 106.7011 },
  { name: 'Đường Hồng Bàng, Phường 12, Quận 5', district: 'Quận 5', lat: 10.7554, lng: 106.6582 },
  { name: 'Đường Quang Trung, Phường 10, Quận Gò Vấp', district: 'Gò Vấp', lat: 10.8354, lng: 106.6678 },
  { name: 'Đường Phạm Văn Đồng, Phường 1, Quận Gò Vấp', district: 'Gò Vấp', lat: 10.8192, lng: 106.6911 },
];

export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  initialStreet = 'Đường Nguyễn Văn Bảo, Phường 4, Quận Gò Vấp',
  initialHouseNo = 'Số 12',
  onLocationSelect,
}) => {
  const [streetQuery, setStreetQuery] = useState<string>(initialStreet);
  const [houseNumber, setHouseNumber] = useState<string>(initialHouseNo);
  const [suggestions, setSuggestions] = useState<Array<{ display_name: string; lat: number; lng: number; district?: string }>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  
  // Current selected location state
  const [currentLoc, setCurrentLoc] = useState<{
    streetAndArea: string;
    district: string;
    lat: number;
    lng: number;
    distanceKm: number;
    shippingFee: number;
  }>({
    streetAndArea: initialStreet,
    district: 'Gò Vấp',
    lat: 10.8222,
    lng: 106.6873,
    distanceKm: calculateHaversineDistance(WAREHOUSE_COORDINATES.lat, WAREHOUSE_COORDINATES.lng, 10.8222, 106.6873),
    shippingFee: calculateValetShippingFee(calculateHaversineDistance(WAREHOUSE_COORDINATES.lat, WAREHOUSE_COORDINATES.lng, 10.8222, 106.6873)),
  });

  const wrapperRef = useRef<HTMLDivElement>(null);

  // Close suggestions when clicked outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update parent when house number or selected location changes
  const notifyParent = (loc: typeof currentLoc, houseNo: string) => {
    const full = houseNo.trim() ? `${houseNo.trim()}, ${loc.streetAndArea}, TP.HCM` : `${loc.streetAndArea}, TP.HCM`;
    onLocationSelect({
      fullAddress: full,
      streetAndArea: loc.streetAndArea,
      houseNumber: houseNo,
      district: loc.district,
      lat: loc.lat,
      lng: loc.lng,
      distanceKm: loc.distanceKm,
      shippingFee: loc.shippingFee,
    });
  };

  // Debounced Search Engine for Streets & Landmarks in TP.HCM
  useEffect(() => {
    if (!streetQuery || streetQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        // Clean house number prefixes if user typed "12/4 Nguyen Van Bao" -> extract core street
        const cleanQuery = streetQuery
          .replace(/^[0-9\/\-\s,]+/, '') // Remove leading numbers
          .replace(/(số|hẻm|ngõ|nhà|căn hộ|chung cư)\s*[0-9A-Za-z\/\-]+/gi, '')
          .trim();

        const searchQuery = cleanQuery.length >= 2 ? cleanQuery : streetQuery;

        // 1. Query Photon Geocoder (Fast, OpenStreetMap based, Biased to TP.HCM coordinates)
        const photonUrl = `https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}&lat=10.7769&lon=106.7009&limit=6`;
        const res = await fetch(photonUrl);
        const data = await res.json();

        let foundList: Array<{ display_name: string; lat: number; lng: number; district?: string }> = [];

        if (data.features && data.features.length > 0) {
          foundList = data.features.map((f: any) => {
            const p = f.properties;
            const parts = [p.name, p.street, p.district || p.suburb, p.city || 'TP. Hồ Chí Minh'].filter(Boolean);
            return {
              display_name: parts.join(', '),
              lat: f.geometry.coordinates[1],
              lng: f.geometry.coordinates[0],
              district: p.district || p.suburb || 'TP.HCM',
            };
          });
        }

        // 2. Also search local high-accuracy curated TP.HCM locations
        const localMatches = POPULAR_HCM_LOCATIONS.filter((l) =>
          l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.district.toLowerCase().includes(searchQuery.toLowerCase())
        ).map((l) => ({
          display_name: l.name,
          lat: l.lat,
          lng: l.lng,
          district: l.district,
        }));

        const merged = [...localMatches, ...foundList].slice(0, 6);
        setSuggestions(merged);
        if (merged.length > 0) setIsOpen(true);
      } catch {
        // Local Fallback on network timeout
        const localMatches = POPULAR_HCM_LOCATIONS.filter((l) =>
          l.name.toLowerCase().includes(streetQuery.toLowerCase())
        ).map((l) => ({
          display_name: l.name,
          lat: l.lat,
          lng: l.lng,
          district: l.district,
        }));
        setSuggestions(localMatches);
        if (localMatches.length > 0) setIsOpen(true);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [streetQuery]);

  const handleSelectSuggestion = (item: { display_name: string; lat: number; lng: number; district?: string }) => {
    const dist = calculateHaversineDistance(WAREHOUSE_COORDINATES.lat, WAREHOUSE_COORDINATES.lng, item.lat, item.lng);
    const fee = calculateValetShippingFee(dist);

    const newLoc = {
      streetAndArea: item.display_name,
      district: item.district || 'TP.HCM',
      lat: item.lat,
      lng: item.lng,
      distanceKm: dist,
      shippingFee: fee,
    };

    setStreetQuery(item.display_name);
    setCurrentLoc(newLoc);
    setIsOpen(false);
    notifyParent(newLoc, houseNumber);
  };

  const handleHouseNumberChange = (val: string) => {
    setHouseNumber(val);
    notifyParent(currentLoc, val);
  };

  // HTML5 Browser GPS Location
  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Trình duyệt của bạn không hỗ trợ định vị GPS.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
          const data = await res.json();
          const road = data.address?.road || data.address?.suburb || 'Khu vực của bạn';
          const district = data.address?.city_district || data.address?.suburb || 'TP.HCM';
          const house = data.address?.house_number ? `Số ${data.address.house_number}` : houseNumber;

          const streetText = `${road}, ${district}`;
          const dist = calculateHaversineDistance(WAREHOUSE_COORDINATES.lat, WAREHOUSE_COORDINATES.lng, lat, lng);
          const fee = calculateValetShippingFee(dist);

          const newLoc = {
            streetAndArea: streetText,
            district,
            lat,
            lng,
            distanceKm: dist,
            shippingFee: fee,
          };

          setStreetQuery(streetText);
          if (data.address?.house_number) setHouseNumber(house);
          setCurrentLoc(newLoc);
          notifyParent(newLoc, house);
        } catch {
          const dist = calculateHaversineDistance(WAREHOUSE_COORDINATES.lat, WAREHOUSE_COORDINATES.lng, lat, lng);
          const fee = calculateValetShippingFee(dist);
          const newLoc = {
            streetAndArea: `Tọa độ GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
            district: 'TP.HCM',
            lat,
            lng,
            distanceKm: dist,
            shippingFee: fee,
          };
          setStreetQuery(newLoc.streetAndArea);
          setCurrentLoc(newLoc);
          notifyParent(newLoc, houseNumber);
        } finally {
          setIsLocating(false);
        }
      },
      () => {
        setIsLocating(false);
        alert('Vui lòng bật quyền truy cập vị trí GPS trên trình duyệt của bạn.');
      },
      { timeout: 10000 }
    );
  };

  const fullDisplayAddress = houseNumber.trim()
    ? `${houseNumber.trim()}, ${currentLoc.streetAndArea}, TP.HCM`
    : `${currentLoc.streetAndArea}, TP.HCM`;

  return (
    <div ref={wrapperRef} className="space-y-3.5 text-left">
      
      {/* Action Header with GPS */}
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-orange-500" />
          <span>Địa chỉ giao nhận tận nhà tại TP.HCM:</span>
        </label>

        <button
          type="button"
          onClick={handleGetCurrentLocation}
          disabled={isLocating}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-2.5 py-1 rounded-lg transition-colors border border-orange-200/60"
        >
          {isLocating ? (
            <>
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>Đang định vị...</span>
            </>
          ) : (
            <>
              <Navigation className="w-3 h-3" />
              <span>📍 Lấy vị trí GPS của bạn</span>
            </>
          )}
        </button>
      </div>

      {/* 2-Field Address System: 1. House Number / Apartment | 2. Street / Area Geocoder */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5">
        
        {/* Field 1: Số nhà, Căn hộ, Tầng (4 cols) */}
        <div className="sm:col-span-4">
          <div className="relative">
            <Home className="w-4 h-4 text-zinc-400 absolute left-3 top-3.5" />
            <input
              type="text"
              value={houseNumber}
              onChange={(e) => handleHouseNumberChange(e.target.value)}
              placeholder="Số nhà, Căn hộ / Tầng"
              className="w-full pl-9 pr-3 py-2.5 rounded-2xl border border-zinc-300 text-xs font-medium focus:ring-2 focus:ring-orange-400 outline-none bg-white shadow-sm"
            />
          </div>
          <span className="text-[10px] text-zinc-400 pl-1 mt-0.5 block">VD: Số 12, Căn A14.02</span>
        </div>

        {/* Field 2: Tên đường, Tòa nhà, Phường, Quận với Gợi Ý Bản Đồ (8 cols) */}
        <div className="sm:col-span-8 relative">
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={streetQuery}
              onChange={(e) => {
                setStreetQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder="Nhập tên đường, tòa nhà, phường, quận..."
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-zinc-300 text-xs font-medium focus:ring-2 focus:ring-orange-400 outline-none bg-white shadow-sm"
            />
            {isLoading && (
              <Loader2 className="w-4 h-4 text-orange-500 animate-spin absolute right-3 top-3.5" />
            )}
          </div>
          <span className="text-[10px] text-zinc-400 pl-1 mt-0.5 block">VD: Nguyễn Văn Bảo, Gò Vấp hoặc Landmark 81</span>

          {/* Autocomplete Dropdown List */}
          {isOpen && suggestions.length > 0 && (
            <div className="absolute top-full left-0 right-0 z-50 mt-1.5 bg-white rounded-2xl border border-zinc-200 shadow-xl overflow-hidden max-h-60 overflow-y-auto divide-y divide-zinc-100">
              <div className="px-3 py-1.5 bg-zinc-50 text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                Gợi ý tuyến đường / địa điểm khớp trong bản đồ TP.HCM:
              </div>
              {suggestions.map((s, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectSuggestion(s)}
                  className="p-3 hover:bg-orange-50/80 cursor-pointer flex items-start gap-2.5 transition-colors text-xs text-zinc-800"
                >
                  <Building className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-zinc-900 leading-snug">{s.display_name}</p>
                    <span className="text-[10px] text-zinc-400 font-medium">Bản đồ vệ tinh TP.HCM</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Verified Full Address & GPS Shipping Calculation Banner */}
      <div className="p-3.5 rounded-2xl bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50/70 border border-orange-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Địa chỉ shipper sẽ giao đến:</span>
          </div>
          <p className="text-xs font-bold text-zinc-900 leading-snug pl-5">
            {fullDisplayAddress}
          </p>
          <p className="text-[11px] text-zinc-500 font-medium pl-5">
            Đo GPS từ Kho Tổng Tân Bình: <strong>{currentLoc.distanceKm} km</strong>
          </p>
        </div>

        <div className="bg-white px-3.5 py-2 rounded-xl border border-orange-200 shadow-sm shrink-0 flex items-center justify-between sm:justify-end gap-3">
          <span className="text-[11px] text-zinc-500">Cước ship bốc dỡ:</span>
          <strong className="text-sm font-black text-orange-600">
            {currentLoc.shippingFee === 0 ? 'MIỄN PHÍ (0 đ)' : formatVND(currentLoc.shippingFee)}
          </strong>
        </div>
      </div>

    </div>
  );
};
