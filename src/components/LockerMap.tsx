import React, { useState, useEffect, useMemo } from 'react';
import { LockerStation } from '../types';
import { MOCK_STATIONS } from '../data/mockData';
import {
  MapPin,
  Navigation,
  Clock,
  Shield,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Zap,
  Building2,
  Compass,
  Search,
  X,
  SlidersHorizontal,
  List,
  Map as MapIcon,
  ExternalLink,
  PhoneCall,
  Check,
  BatteryCharging
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

// Bespoke High-Contrast Pin for TP.HCM Stations
const createLockerMarker = (isSelected: boolean, isHQ: boolean) => {
  return L.divIcon({
    className: 'custom-station-pin',
    html: `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 44px; height: 44px; transform: translate(-22px, -22px); cursor: pointer;">
        ${isSelected ? '<div style="position: absolute; inset: -4px; border-radius: 9999px; background: rgba(245, 158, 11, 0.45); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>' : ''}
        <div style="position: relative; z-index: 10; display: flex; flex-direction: column; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 12px; background: ${isHQ ? '#ea580c' : isSelected ? '#f59e0b' : '#09090b'}; color: white; border: 2.5px solid #ffffff; box-shadow: 0 4px 14px rgba(0,0,0,0.35); font-family: sans-serif; font-weight: 800;">
          <span style="font-size: 15px; line-height: 1;">${isHQ ? '🏢' : '⚡'}</span>
        </div>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
  });
};

// Map controller to invalidate size on mount and flyTo active station
const MapController: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 250);
    return () => clearTimeout(timer);
  }, [map]);

  useEffect(() => {
    map.flyTo([lat, lng], 13.5, { duration: 1.0 });
  }, [lat, lng, map]);

  return null;
};

interface LockerMapProps {
  stations?: LockerStation[];
  onSelectStation: (station: LockerStation) => void;
}

export const LockerMap: React.FC<LockerMapProps> = ({ stations = MOCK_STATIONS, onSelectStation }) => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeStationId, setActiveStationId] = useState<string>(stations[0]?.id || MOCK_STATIONS[0].id);

  // All 16 districts/areas in TP.HCM guaranteed to have stations
  const districts = [
    'all',
    'Gò Vấp',
    'Quận 1',
    'Tân Bình',
    'Bình Thạnh',
    'TP. Thủ Đức',
    'Quận 3',
    'Quận 5',
    'Quận 6',
    'Quận 7',
    'Quận 4',
    'Quận 10',
    'Quận 11',
    'Phú Nhuận',
    'Tân Phú',
    'Bình Tân',
    'Quận 12',
    'Hóc Môn',
  ];

  // Search & District Filtering
  const filteredStations = useMemo(() => {
    return stations.filter((s) => {
      const matchDistrict = selectedDistrict === 'all' || s.district === selectedDistrict;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        s.name.toLowerCase().includes(q) ||
        s.address.toLowerCase().includes(q) ||
        s.district.toLowerCase().includes(q) ||
        (s.tags && s.tags.some((t) => t.toLowerCase().includes(q)));
      return matchDistrict && matchQuery;
    });
  }, [stations, selectedDistrict, searchQuery]);

  // Keep activeStation in sync if filtered out
  useEffect(() => {
    if (filteredStations.length > 0) {
      const exists = filteredStations.some((s) => s.id === activeStationId);
      if (!exists) {
        setActiveStationId(filteredStations[0].id);
      }
    }
  }, [filteredStations, activeStationId]);

  const activeStation = stations.find((s) => s.id === activeStationId) || filteredStations[0] || stations[0];

  const handleFocusStationOnMap = (station: LockerStation) => {
    setActiveStationId(station.id);
    setViewMode('map');
  };

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-left">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5 text-amber-600" />
            <span>Mạng Lưới Smart Locker Phủ Khắp TP.HCM ({stations.length} Trạm Tủ)</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-zinc-950 tracking-tight">
            Chọn Trạm Tủ Gần Bạn Nhất
          </h2>
          <p className="text-xs sm:text-sm text-zinc-600 mt-1">
            Trụ sở chính tại Gò Vấp cùng <strong>{stations.length} trạm tủ phủ sóng 16 quận huyện</strong>: Sân bay TSN (T1 & T2), Tuyến Metro 1, Quận 1, 3, 4, 5, 6, 7, 10, 11, 12, Bình Thạnh, Phú Nhuận, Tân Phú, Bình Tân, Thủ Đức...
          </p>
        </div>

        {/* View Mode Switcher: Map vs Detailed List */}
        <div className="flex items-center gap-1.5 p-1 bg-zinc-100 rounded-2xl border border-zinc-200 shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              viewMode === 'map'
                ? 'bg-zinc-950 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>Bản Đồ Trực Quan</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black transition-all ${
              viewMode === 'list'
                ? 'bg-zinc-950 text-white shadow-sm'
                : 'text-zinc-600 hover:text-zinc-950'
            }`}
          >
            <List className="w-3.5 h-3.5 text-orange-400" />
            <span>Danh Sách Địa Chỉ ({stations.length})</span>
          </button>
        </div>
      </div>

      {/* SEARCH INPUT & DISTRICT FILTERS BAR */}
      <div className="bg-white p-4 rounded-3xl border border-zinc-200 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          {/* Live Search Bar */}
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm theo tên trạm (Sân Bay, Vincom, Bùi Viện, Metro, Emart...), tên đường, quận..."
              className="w-full pl-10 pr-9 py-2.5 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs sm:text-sm font-medium focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="w-5 h-5 rounded-full bg-zinc-200 hover:bg-zinc-300 text-zinc-600 absolute right-3 top-3 flex items-center justify-center text-xs"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Search Result Stats Counter */}
          <div className="shrink-0 flex items-center gap-2 text-xs font-bold text-zinc-600 self-end sm:self-center">
            <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-200">
              Tìm thấy <strong>{filteredStations.length}</strong> / {stations.length} trạm tủ
            </span>
          </div>
        </div>

        {/* District Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 pb-1 max-w-full no-scrollbar scroll-smooth">
          <span className="text-[11px] font-extrabold text-zinc-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3" />
            <span>Quận / Huyện:</span>
          </span>
          {districts.map((d) => {
            const countInDistrict = d === 'all'
              ? stations.length
              : stations.filter((s) => s.district === d).length;

            return (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDistrict(d)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1 ${
                  selectedDistrict === d
                    ? 'bg-zinc-950 text-white shadow-md'
                    : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                }`}
              >
                <span>{d === 'all' ? 'Tất Cả TP.HCM' : d}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                  selectedDistrict === d ? 'bg-amber-500 text-zinc-950 font-black' : 'bg-zinc-200 text-zinc-600'
                }`}>
                  {countInDistrict}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* VIEW MODE 1: INTERACTIVE MAP & COMPACT SIDEBAR */}
      {viewMode === 'map' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Side: Map View Container with Ultra-Sharp Map Tiles */}
          <div className="lg:col-span-7 h-[460px] sm:h-[580px] rounded-3xl overflow-hidden border border-zinc-300 shadow-xl relative z-0">
            <MapContainer
              center={[activeStation?.latitude || 10.8222, activeStation?.longitude || 106.6873]}
              zoom={13}
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              {activeStation && (
                <MapController lat={activeStation.latitude} lng={activeStation.longitude} />
              )}

              {/* Ultra-Sharp High-DPI OpenStreetMap Map Tiles - 100% Free & No Watermark */}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                maxZoom={19}
              />
              
              {filteredStations.map((station) => {
                const isSelected = station.id === activeStationId;
                const isHQ = station.id === 'sta-govap';
                const availableCount = (station.availableSizes?.S || 0) + (station.availableSizes?.M || 0) + (station.availableSizes?.L || 0);
                
                return (
                  <Marker
                    key={station.id}
                    position={[station.latitude, station.longitude]}
                    icon={createLockerMarker(isSelected, isHQ)}
                    eventHandlers={{
                      click: () => setActiveStationId(station.id),
                    }}
                  >
                    <Popup className="custom-leaflet-popup">
                      <div className="p-1 space-y-1.5 text-zinc-950 text-left">
                        <div className="flex items-center gap-1 flex-wrap">
                          {isHQ && <span className="px-1.5 py-0.5 rounded bg-orange-600 text-white text-[9px] font-black">TRỤ SỞ</span>}
                          <span className="px-1.5 py-0.5 rounded bg-zinc-200 text-zinc-800 text-[9px] font-bold uppercase">{station.district}</span>
                        </div>
                        <h4 className="font-extrabold text-xs text-zinc-950">{station.name}</h4>
                        <p className="text-[11px] text-zinc-600 leading-tight">{station.address}</p>
                        <div className="text-[11px] text-emerald-600 font-bold">
                          Còn {availableCount} / {station.totalLockers} ô trống
                        </div>
                        <button
                          onClick={() => onSelectStation(station)}
                          className="w-full mt-1.5 py-1.5 px-2.5 rounded-lg bg-zinc-950 text-white font-bold text-[11px] hover:bg-amber-500 hover:text-zinc-950 transition-colors"
                        >
                          Đặt Tủ Tại Trạm Này
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>

            {/* Map Overlay Badge */}
            <div className="absolute top-4 left-4 z-[400] bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-zinc-200 shadow-md text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <span className="font-bold text-zinc-900">Bản Đồ {filteredStations.length} Điểm Toàn TP.HCM</span>
              </div>
            </div>
          </div>

          {/* Right Side: Station Cards List */}
          <div className="lg:col-span-5 space-y-3 max-h-[580px] overflow-y-auto pr-1">
            {filteredStations.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-2xl border border-zinc-200 space-y-2">
                <p className="font-bold text-sm text-zinc-900">Không tìm thấy trạm tủ phù hợp</p>
                <p className="text-xs text-zinc-500">Hãy thử xóa từ khóa tìm kiếm hoặc chọn "Tất Cả" quận.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedDistrict('all');
                  }}
                  className="mt-2 px-4 py-2 rounded-xl bg-zinc-950 text-white text-xs font-bold"
                >
                  Đặt lại bộ lọc
                </button>
              </div>
            ) : (
              filteredStations.map((station) => {
                const isSelected = station.id === activeStationId;
                const isHQ = station.id === 'sta-govap';
                const availableCount = (station.availableSizes?.S || 0) + (station.availableSizes?.M || 0) + (station.availableSizes?.L || 0);

                return (
                  <div
                    key={station.id}
                    onClick={() => setActiveStationId(station.id)}
                    className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer text-left ${
                      isSelected
                        ? 'bg-amber-50/70 border-amber-400 shadow-md ring-1 ring-amber-400'
                        : 'bg-white border-zinc-200 hover:border-zinc-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {isHQ && (
                            <span className="px-2 py-0.5 rounded-md bg-orange-600 text-white text-[10px] font-black uppercase">
                              🏢 Trụ Sở Chính
                            </span>
                          )}
                          <span className="px-2 py-0.5 rounded-md bg-zinc-100 text-zinc-800 text-[10px] font-extrabold uppercase">
                            {station.district}
                          </span>
                          <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                            ● Còn {availableCount} ô trống
                          </span>
                        </div>
                        <h3 className="text-sm sm:text-base font-extrabold text-zinc-950">
                          {station.name}
                        </h3>
                        <p className="text-xs text-zinc-500 font-medium">
                          {station.address}
                        </p>
                      </div>
                    </div>

                    {/* Lockers Mini Availability Bar */}
                    <div className="mt-3 pt-3 border-t border-zinc-200/80 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-[11px] text-zinc-600">
                        <Clock className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{station.operatingHours}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStation(station);
                        }}
                        className="px-4 py-1.5 rounded-xl bg-zinc-950 hover:bg-amber-500 hover:text-white text-white font-extrabold text-xs transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
                      >
                        <span>Đặt Tủ Ngay</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      )}

      {/* VIEW MODE 2: FULL DETAILED ADDRESS DIRECTORY (GRID & TABLE) */}
      {viewMode === 'list' && (
        <div className="space-y-4 text-left">
          <div className="flex items-center justify-between pb-2">
            <h3 className="font-extrabold text-base text-zinc-950">
              Danh Mục Địa Chỉ Cụ Thể Từng Trạm Tủ ({filteredStations.length} Trạm)
            </h3>
            <span className="text-xs text-zinc-500">
              Phủ sóng 16 quận huyện TP.HCM
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredStations.map((station, idx) => {
              const isHQ = station.id === 'sta-govap';
              const availableCount = (station.availableSizes?.S || 0) + (station.availableSizes?.M || 0) + (station.availableSizes?.L || 0);

              return (
                <div
                  key={station.id}
                  className="p-5 rounded-3xl bg-white border border-zinc-200 hover:border-amber-400 hover:shadow-lg transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-xl bg-zinc-900 text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {isHQ && (
                              <span className="px-2 py-0.5 rounded bg-orange-600 text-white text-[9px] font-black uppercase">
                                Trụ Sở Chính
                              </span>
                            )}
                            <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase">
                              {station.district}
                            </span>
                          </div>
                          <h4 className="font-black text-sm text-zinc-950 mt-1 leading-snug">
                            {station.name}
                          </h4>
                        </div>
                      </div>
                    </div>

                    {/* Detailed Specific Address */}
                    <div className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200 text-xs space-y-1">
                      <div className="flex items-start gap-1.5 text-zinc-800 font-medium">
                        <MapPin className="w-4 h-4 text-orange-500 shrink-0 mt-0.5" />
                        <span>{station.address}</span>
                      </div>
                    </div>

                    {/* Operating Hours & Locker Availability */}
                    <div className="grid grid-cols-2 gap-2 text-[11px]">
                      <div className="p-2.5 rounded-xl bg-zinc-50 border border-zinc-100 space-y-0.5">
                        <span className="text-zinc-400 block text-[10px]">Giờ hoạt động:</span>
                        <strong className="text-zinc-900 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-zinc-500" />
                          <span>{station.operatingHours.split('(')[0]}</span>
                        </strong>
                      </div>

                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 space-y-0.5">
                        <span className="text-emerald-700 block text-[10px]">Ô tủ khả dụng:</span>
                        <strong className="text-emerald-900">
                          Còn {availableCount} / {station.totalLockers} ô
                        </strong>
                      </div>
                    </div>

                    {/* Tags / Features */}
                    {station.tags && station.tags.length > 0 && (
                      <div className="flex items-center gap-1.5 flex-wrap pt-1">
                        {station.tags.map((tag) => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 font-medium">
                            ✓ {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-zinc-100 flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleFocusStationOnMap(station)}
                      className="flex-1 py-2 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs font-bold transition-all flex items-center justify-center gap-1"
                    >
                      <MapPin className="w-3.5 h-3.5 text-zinc-500" />
                      <span>Xem Bản Đồ</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onSelectStation(station)}
                      className="flex-1 py-2 px-3 rounded-xl bg-zinc-950 hover:bg-amber-500 hover:text-white text-white text-xs font-black transition-all flex items-center justify-center gap-1 shadow-sm active:scale-95"
                    >
                      <Zap className="w-3.5 h-3.5 text-amber-400" />
                      <span>Đặt Tủ Ngay</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
