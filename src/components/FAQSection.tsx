import React, { useState } from 'react';
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react';
import { PageView } from './Navbar';

interface FAQSectionProps {
  onNavigateToFaq?: () => void;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ onNavigateToFaq }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Smart Locker tính phí như thế nào và có ưu đãi gì khi gửi lâu?',
      a: 'Phí thuê tủ tính theo block 2 giờ đầu (Size S: 10.000 đ, Size M: 18.000 đ, Size L: 25.000 đ). Từ giờ thứ 3 trở đi chỉ tính từ 5.000 đ - 12.000 đ/giờ. Đặc biệt, bất kỳ đơn thuê nào từ 24 giờ trở lên đều được hệ thống tự động giảm 20% trên tổng hóa đơn!',
    },
    {
      q: 'Tính năng Gửi Hộ / Ủy quyền P2P hoạt động ra sao?',
      a: 'Khi đặt tủ, bạn chỉ cần chọn "Gửi Hộ / Người Khác Nhận Đồ" và điền số điện thoại người nhận. Hệ thống sẽ tạo liên kết bảo mật và mã PIN 6 số. Người nhận chỉ cần đến đúng trạm tủ, quét QR hoặc nhập mã PIN là cửa tủ tự mở mà không cần tải app.',
    },
    {
      q: 'Thùng Standard Valet Storage (60x40x40 cm) chứa được bao nhiêu đồ?',
      a: 'Thùng Standard BoxifyX có thể chứa khoảng 20-30 chiếc áo khoác/áo len, hoặc 40 cuốn sách giáo trình, hoặc 5-6 đôi giày. Thùng làm bằng nhựa Polypropylene nguyên sinh chịu tải lên đến 35kg.',
    },
    {
      q: 'Nếu tôi lấy đồ trễ hơn thời gian dự kiến đã đặt thì sao?',
      a: 'Không vấn đề gì! Tủ sẽ tự động chuyển sang trạng thái "Quá Hạn". Khi bạn đến lấy đồ, màn hình sẽ hiển thị mã VietQR đóng phần phụ phí phát sinh theo đúng đơn giá giờ lẻ. Sau khi quét mã thanh toán trong 2 giây, chốt điện sẽ tự động mở.',
    },
    {
      q: 'Kho lưu trữ Tân Bình có an toàn trong mùa mưa ngập TP.HCM không?',
      a: 'Kho trung tâm BoxifyX đặt tại khu vực cao ráo Tân Bình, toàn bộ thùng hàng được lưu trữ trên hệ thống pallet và kệ sắt chịu lực cao hơn mặt sàn tối thiểu 30cm. Kho luôn duy trì nhiệt độ 25°C và độ ẩm dưới 50% suốt 24/7.',
    },
    {
      q: 'Tôi có thể yêu cầu shipper lấy hoặc trả lẻ 1 thùng đồ được không?',
      a: 'Hoàn toàn được! Thông qua tính năng "Tủ Đồ Số Hóa (Digital Closet)" trên Web App, bạn có thể xem ảnh chụp từng thùng và bấm nút yêu cầu hoàn trả riêng lẻ từng món đồ về địa chỉ nhà bạn bất cứ lúc nào.',
    },
  ];

  return (
    <section className="py-16 space-y-8 text-left">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
          <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
          <span>Giải Đáp Thắc Mắc</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-zinc-950 tracking-tight">
          Câu Hỏi Thường Gặp (FAQ)
        </h2>
        <p className="text-sm text-zinc-600">
          Mọi thông tin bạn cần biết về dịch vụ lưu trữ thông minh BoxifyX tại TP.HCM.
        </p>
      </div>

      {/* Accordion List */}
      <div className="max-w-3xl mx-auto space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all overflow-hidden ${
                isOpen ? 'bg-amber-50/40 border-amber-300 shadow-sm' : 'bg-white border-zinc-200 hover:border-zinc-300'
              }`}
            >
              <button
                type="button"
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-zinc-950"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-5 h-5 text-zinc-500 shrink-0 transition-transform duration-300 ${
                    isOpen ? 'rotate-180 text-amber-600' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-zinc-600 leading-relaxed font-normal border-t border-amber-200/50 mt-1">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* View Full FAQ Link */}
      {onNavigateToFaq && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={onNavigateToFaq}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-zinc-950 hover:bg-amber-500 hover:text-zinc-950 text-white font-extrabold text-xs transition-all shadow-md active:scale-95"
          >
            <span>Xem Đầy Đủ Tất Cả Câu Hỏi Tại Trung Tâm FAQ</span>
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      )}
    </section>
  );
};
