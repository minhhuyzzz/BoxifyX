import React from 'react';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

export const Testimonials: React.FC = () => {
  const reviews = [
    {
      id: 1,
      name: 'Thảo My',
      role: 'Du khách từ Hà Nội',
      location: 'Trạm Sân Bay Tân Sơn Nhất',
      rating: 5,
      comment:
        'Chuyến đi Sài Gòn của mình tiện hơn hẳn nhờ BoxifyX. Vừa hạ cánh Tân Sơn Nhất là gửi ngay 2 vali lớn vào Smart Locker, đi chơi cả ngày phố Bùi Viện rồi tối quay lại lấy đồ ra khách sạn rất nhẹ nhàng!',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 2,
      name: 'Minh Trí',
      role: 'Cư dân Căn hộ Quận Bình Thạnh',
      location: 'Dịch vụ Valet Storage 4 Thùng',
      rating: 5,
      comment:
        'Căn hộ 50m² của mình trước đây chất đầy đồ cắm trại, quạt sưởi và quần áo mùa đông. Dùng Valet Storage của BoxifyX họ giao thùng đến tận cửa, đóng gói xong mang đi lưu kho. Nhà rộng hẳn ra!',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    },
    {
      id: 3,
      name: 'Hoàng Yến',
      role: 'Chủ Shop Thời Trang Online',
      location: 'Valet Storage & Tủ Đồ Ảo',
      rating: 5,
      comment:
        'Thích nhất tính năng Tủ Đồ Ảo (Digital Closet) chụp ảnh và gắn tag từng thùng. Cần lấy thùng mẫu nào cho khách xem chỉ cần 1 click trên web là shipper giao tới trong 2 tiếng.',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section className="py-16 space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
          <span>Đánh Giá Từ Khách Hàng</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
          Hơn 5.000+ Người Dân TP.HCM Tin Dùng
        </h2>
        <p className="text-sm text-zinc-600">
          Trải nghiệm thực tế từ những người đã tối ưu hóa không gian sống và di chuyển cùng BoxifyX.
        </p>
      </div>

      {/* Grid Reviews */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="p-6 rounded-3xl bg-white border border-zinc-200 shadow-card hover:border-amber-400 hover:shadow-glow transition-all flex flex-col justify-between space-y-6 relative"
          >
            <Quote className="w-8 h-8 text-amber-200/80 absolute top-5 right-5" />

            <div className="space-y-4">
              {/* Stars */}
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500" />
                ))}
              </div>

              {/* Comment text */}
              <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-normal italic">
                "{rev.comment}"
              </p>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3 pt-4 border-t border-zinc-100">
              <img
                src={rev.avatar}
                alt={rev.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-amber-400/60 shadow-sm"
              />
              <div>
                <h4 className="font-bold text-sm text-zinc-950 flex items-center gap-1.5">
                  <span>{rev.name}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                </h4>
                <p className="text-[11px] text-zinc-500 font-medium">{rev.role}</p>
                <span className="text-[10px] text-amber-700 font-semibold">{rev.location}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
