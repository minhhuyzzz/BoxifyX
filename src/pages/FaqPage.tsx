import React, { useState, useMemo } from 'react';
import {
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Zap,
  Truck,
  CreditCard,
  ShieldCheck,
  Phone,
  Mail,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  MapPin
} from 'lucide-react';
import { PageView } from '../components/Navbar';

interface FaqItem {
  id: string;
  category: 'locker' | 'valet' | 'payment' | 'security';
  categoryLabel: string;
  question: string;
  answer: string;
  highlight?: string;
  tags: string[];
}

const FAQ_DATA: FaqItem[] = [
  // --- SMART LOCKER ---
  {
    id: 'faq-1',
    category: 'locker',
    categoryLabel: 'Smart Locker',
    question: 'Dịch vụ Smart Locker hoạt động ra sao? Tôi có cần tải App không?',
    answer: 'Không cần tải App rườm rà! Bạn có thể đặt tủ trực tiếp trên nền tảng Web App BoxifyX từ mọi thiết bị. Sau khi chọn kích thước (S/M/L) và thời gian thuê, hệ thống sẽ cấp ngay Mã PIN 6 số và mã QR mở tủ tức thì. Bạn chỉ cần quét mã QR tại kiosk trạm tủ là cửa sẽ tự động bật mở trong 0.5 giây.',
    highlight: 'Mở cửa tức thì bằng QR/PIN, không cần cài đặt App.',
    tags: ['Smart Locker', 'Mở khóa QR', 'Không cần App'],
  },
  {
    id: 'faq-2',
    category: 'locker',
    categoryLabel: 'Smart Locker',
    question: 'Tính năng chia sẻ người nhận đồ P2P (Peer-to-Peer) là gì?',
    answer: 'Tính năng P2P cho phép bạn gửi đồ vào tủ và chia sẻ quyền mở tủ cho người thân, bạn bè hoặc khách hàng lấy đồ. Bạn chỉ cần nhập số điện thoại người nhận khi đặt tủ, hệ thống sẽ tự động gửi mã PIN và đường link mở tủ bảo mật đến SMS/Zalo của họ.',
    highlight: 'Giao nhận đồ không tiếp xúc 24/7 an toàn.',
    tags: ['P2P', 'Giao đồ cho bạn', 'Mã PIN SMS'],
  },
  {
    id: 'faq-3',
    category: 'locker',
    categoryLabel: 'Smart Locker',
    question: 'Nếu tôi để đồ quá số giờ đã đặt trước thì có bị phạt không?',
    answer: 'BoxifyX không phạt bạn! Hệ thống áp dụng chính sách quá giờ linh hoạt: Cước phí quá giờ được tính đúng theo đơn giá niêm yết theo giờ (Ví dụ: Size S là 5.000đ/giờ, Size M là 10.000đ/giờ). Bạn chỉ cần thanh toán phần chênh lệch phát sinh bằng VietQR khi bấm mở tủ nhận đồ.',
    highlight: 'Tính phí quá giờ theo đúng giá gốc, không phụ thu phạt.',
    tags: ['Quá giờ', 'Gia hạn', 'VietQR'],
  },
  {
    id: 'faq-4',
    category: 'locker',
    categoryLabel: 'Smart Locker',
    question: 'Nếu tôi quên mã PIN mở tủ thì phải làm sao?',
    answer: 'Bạn chỉ cần truy cập vào mục "Đơn Của Tôi" trên website để xem lại mã PIN hoặc bấm nút "Gửi Lại Mã OTP Về Điện Thoại". Ngoài ra, tổng đài kỹ thuật 1900 8899 hỗ trợ 24/7 có thể mở tủ khẩn cấp từ xa sau khi xác thực thông tin chính chủ.',
    tags: ['Quên mã', 'Hỗ trợ 24/7', 'Tổng đài 1900 8899'],
  },

  // --- VALET STORAGE ---
  {
    id: 'faq-5',
    category: 'valet',
    categoryLabel: 'Lưu Kho Valet',
    question: 'Quy trình gửi đồ dịch vụ Valet Storage diễn ra như thế nào?',
    answer: 'Quy trình gồm 4 bước tiện lợi:\n1. Bạn đặt đơn trên web (chọn số thùng Standard hoặc kiện lớn quá khổ).\n2. Shipper BoxifyX giao thùng carton rỗng + chốt niêm phong Seal tận nhà miễn phí 3km.\n3. Bạn đóng gói đồ đạc, bấm chốt Seal bảo mật và shipper mang về kho.\n4. Đồ được lưu tại kho mát 25°C và tự động hiển thị trong "Tủ Đồ Số Hóa".',
    highlight: 'Giao thùng rỗng và nhận hàng tận nhà 100%.',
    tags: ['Valet Storage', 'Quy trình', 'Giao tận nơi'],
  },
  {
    id: 'faq-6',
    category: 'valet',
    categoryLabel: 'Lưu Kho Valet',
    question: 'Chốt seal niêm phong có an toàn không? Nhân viên có mở đồ ra xem không?',
    answer: 'Tuyệt đối KHÔNG! Chốt Seal của BoxifyX là chốt nhựa công nghệ cao có mã số độc nhất (Ví dụ: SEAL-HCM-9021). Sau khi bạn tự tay bấm chốt seal tại nhà, không ai có thể mở thùng mà không làm gãy chốt. Khi shipper giao trả về nhà, bạn kiểm tra đúng mã số seal nguyên vẹn mới nhận đồ.',
    highlight: 'Chốt seal bảo mật một chiều, chống mở trộm 100%.',
    tags: ['Chốt Seal', 'Bảo mật niêm phong', 'Chống mở trộm'],
  },
  {
    id: 'faq-7',
    category: 'valet',
    categoryLabel: 'Lưu Kho Valet',
    question: 'Kho bãi của BoxifyX có đảm bảo nhiệt độ và chống ẩm mốc không?',
    answer: 'Kho lưu trữ trung tâm của BoxifyX tại TP.HCM được trang bị hệ thống điều hòa kiểm soát nhiệt độ ổn định 25°C, độ ẩm <50%, hệ thống hút ẩm công nghiệp và khử khuẩn định kỳ. Phù hợp hoàn hảo để lưu giữ quần áo dạ, giày hiệu, tài liệu, sách vở và thiết bị điện tử.',
    highlight: 'Kho mát 25°C & Độ ẩm <50% kiểm soát liên tục.',
    tags: ['Kho mát 25°C', 'Chống ẩm mốc', 'Bảo quản tài liệu'],
  },
  {
    id: 'faq-8',
    category: 'valet',
    categoryLabel: 'Lưu Kho Valet',
    question: 'Khi tôi cần lấy lại đồ thì mất bao lâu shipper sẽ giao đến?',
    answer: 'Bạn chỉ cần vào "Tủ Đồ" trên website, bấm "Yêu Cầu Lấy Đồ" trên thùng bạn muốn lấy, chọn ngày giờ và địa chỉ nhận. BoxifyX hỗ trợ giao trả trong vòng 2 - 4 giờ đối với yêu cầu hỏa tốc hoặc đúng khung giờ bạn đã đặt trước.',
    tags: ['Giao trả đồ', 'Tủ Đồ', 'Hỏa tốc'],
  },

  // --- THANH TOÁN & BẢNG GIÁ ---
  {
    id: 'faq-9',
    category: 'payment',
    categoryLabel: 'Thanh Toán & Cước Phí',
    question: 'BoxifyX chấp nhận các phương thức thanh toán nào?',
    answer: 'Chúng tôi hỗ trợ 2 phương thức thanh toán thuận tiện nhất:\n1. Thanh toán chuyển khoản quét mã VietQR tự động (BIDV - Xử lý tức thì trong 2 giây).\n2. Thanh toán tiền mặt (COD) trực tiếp cho shipper khi nhận thùng hoặc thanh toán tại Kiosk.',
    highlight: 'Hỗ trợ VietQR quét mã tức thì & COD tiền mặt.',
    tags: ['VietQR', 'COD', 'Thanh toán tự động'],
  },
  {
    id: 'faq-10',
    category: 'payment',
    categoryLabel: 'Thanh Toán & Cước Phí',
    question: 'Tôi có thể xuất hóa đơn giá trị gia tăng (VAT) cho doanh nghiệp không?',
    answer: 'Có! BoxifyX cung cấp hóa đơn điện tử VAT hợp lệ cho khách hàng cá nhân và doanh nghiệp. Khi đặt đơn hoặc thanh toán, bạn chỉ cần để lại thông tin Tên công ty, Mã số thuế và Email nhận hóa đơn trong phần ghi chú.',
    tags: ['Hóa đơn VAT', 'Doanh nghiệp', 'Chi phí hợp lệ'],
  },

  // --- BẢO HIỂM & AN NINH ---
  {
    id: 'faq-11',
    category: 'security',
    categoryLabel: 'Bảo Hiểm & An Toàn',
    question: 'Chính sách bảo hiểm tài sản 20.000.000đ được áp dụng như thế nào?',
    answer: 'Mọi thùng đồ gửi qua dịch vụ Valet Storage đều được tự động kích hoạt gói bảo hiểm BoxifyX Care trị giá lên đến 20.000.000 VNĐ/thùng. Nếu xảy ra các rủi ro hiếm hoi như thất lạc, hỏa hoạn hoặc hư hỏng trong quá trình lưu kho, chúng tôi cam kết bồi thường theo đúng thỏa thuận hợp đồng trong vòng 7 ngày làm việc.',
    highlight: 'Bảo hiểm mặc định 20.000.000đ cho mỗi thùng đồ.',
    tags: ['Bảo hiểm 20 triệu', 'BoxifyX Care', 'Bồi thường minh bạch'],
  },
  {
    id: 'faq-12',
    category: 'security',
    categoryLabel: 'Bảo Hiểm & An Toàn',
    question: 'Những mặt hàng nào bị nghiêm cấm gửi tại BoxifyX?',
    answer: 'Để đảm bảo an toàn tuyệt đối cho toàn bộ hệ thống, chúng tôi nghiêm cấm lưu trữ:\n• Hàng quốc cấm, vũ khí, chất nổ, chất dễ cháy, pháo hoa.\n• Thực phẩm tươi sống, hàng dễ ôi thiu, động vật sống.\n• Tiền mặt, vàng bạc đá quý, ngoại tệ số lượng lớn.\n• Chất độc hại, hóa chất ăn mòn, chất gây ô nhiễm.',
    highlight: 'Nghiêm cấm chất cháy nổ, thực phẩm tươi sống, hàng quốc cấm.',
    tags: ['Hàng cấm', 'An toàn PCCC', 'Quy chuẩn lưu trữ'],
  },
];

interface FaqPageProps {
  onNavigate?: (page: PageView) => void;
}

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigate }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [openFaqIds, setOpenFaqIds] = useState<Record<string, boolean>>({
    'faq-1': true,
    'faq-5': true,
    'faq-9': true,
    'faq-11': true,
  });
  const [feedbackGiven, setFeedbackGiven] = useState<Record<string, 'yes' | 'no'>>({});

  const categories = [
    { id: 'all', label: 'Tất Cả Câu Hỏi', icon: Sparkles },
    { id: 'locker', label: 'Smart Locker', icon: Zap },
    { id: 'valet', label: 'Lưu Kho Valet', icon: Truck },
    { id: 'payment', label: 'Thanh Toán & Giá', icon: CreditCard },
    { id: 'security', label: 'Bảo Hiểm & An Ninh', icon: ShieldCheck },
  ];

  const filteredFaqs = useMemo(() => {
    return FAQ_DATA.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        item.question.toLowerCase().includes(q) ||
        item.answer.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q));
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  const toggleFaq = (id: string) => {
    setOpenFaqIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleFeedback = (id: string, type: 'yes' | 'no') => {
    setFeedbackGiven((prev) => ({ ...prev, [id]: type }));
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 text-left animate-fade-in">
      
      {/* HERO BANNER */}
      <div className="relative overflow-hidden p-8 sm:p-12 rounded-3xl bg-zinc-950 text-white border border-zinc-800 shadow-2xl space-y-6">
        <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none" />

        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-black uppercase tracking-wider border border-amber-500/30">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>Trung Tâm Trợ Giúp & Giải Đáp Thắc Mắc</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
            Câu Hỏi Thường Gặp (FAQ)
          </h1>

          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
            Tìm câu trả lời nhanh chóng cho mọi thắc mắc về cách sử dụng Smart Locker theo giờ, quy trình gửi kho Valet giao tận nhà, chính sách bảo hiểm và bảng giá dịch vụ.
          </p>
        </div>

        {/* Realtime Search Box */}
        <div className="relative z-10 max-w-xl">
          <div className="relative">
            <Search className="w-5 h-5 text-zinc-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nhập từ khóa tìm kiếm (mở tủ, phí quá giờ, chốt seal, bảo hiểm...)"
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-zinc-900/90 border border-zinc-700 text-white placeholder-zinc-400 text-xs sm:text-sm font-medium focus:bg-zinc-900 focus:ring-2 focus:ring-amber-500 outline-none transition-all shadow-inner"
            />
          </div>
        </div>
      </div>

      {/* CATEGORY FILTER BUTTONS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          const count = cat.id === 'all'
            ? FAQ_DATA.length
            : FAQ_DATA.filter((f) => f.category === cat.id).length;

          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${
                isSelected
                  ? 'bg-zinc-950 text-white shadow-md'
                  : 'bg-white border border-zinc-200 text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-zinc-500'}`} />
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                isSelected ? 'bg-amber-500 text-zinc-950 font-black' : 'bg-zinc-100 text-zinc-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* FAQ ACCORDION LIST */}
      <div className="space-y-4">
        {filteredFaqs.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-zinc-200 space-y-3">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
              <HelpCircle className="w-8 h-8" />
            </div>
            <h3 className="font-extrabold text-base text-zinc-950">Không tìm thấy câu hỏi phù hợp</h3>
            <p className="text-xs text-zinc-500 max-w-md mx-auto">
              Không có câu hỏi nào khớp với từ khóa "{searchQuery}". Bạn có thể liên hệ trực tiếp hotline 1900 8899 để được nhân viên hỗ trợ ngay lập tức.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-5 py-2.5 rounded-xl bg-zinc-950 text-white text-xs font-bold shadow"
            >
              Xem tất cả câu hỏi
            </button>
          </div>
        ) : (
          filteredFaqs.map((faq) => {
            const isOpen = !!openFaqIds[faq.id];
            const feedback = feedbackGiven[faq.id];

            return (
              <div
                key={faq.id}
                className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden ${
                  isOpen ? 'border-amber-400 shadow-md ring-1 ring-amber-300/60' : 'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                {/* Accordion Question Header */}
                <button
                  type="button"
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 select-none"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2.5 py-0.5 rounded-md bg-amber-100 text-amber-900 text-[10px] font-black uppercase tracking-wider">
                        {faq.categoryLabel}
                      </span>
                      {faq.tags.map((tag) => (
                        <span key={tag} className="text-[10px] text-zinc-400">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <h3 className="text-sm sm:text-base font-extrabold text-zinc-950 leading-snug">
                      {faq.question}
                    </h3>
                  </div>

                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                    isOpen ? 'bg-amber-500 text-zinc-950 rotate-180' : 'bg-zinc-100 text-zinc-500'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Accordion Answer Body */}
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-2 border-t border-zinc-100 space-y-4 text-xs text-zinc-700 leading-relaxed animate-fade-in">
                    {faq.highlight && (
                      <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 font-bold text-xs flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
                        <span>{faq.highlight}</span>
                      </div>
                    )}

                    <div className="whitespace-pre-line text-xs sm:text-sm text-zinc-600 space-y-2">
                      {faq.answer}
                    </div>

                    {/* Feedback Rating */}
                    <div className="pt-3 border-t border-zinc-100 flex items-center justify-between text-[11px] text-zinc-500">
                      <span>Câu trả lời này có giải quyết được thắc mắc của bạn không?</span>
                      <div className="flex items-center gap-2">
                        {feedback ? (
                          <span className="text-emerald-600 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Cảm ơn bạn đã phản hồi!</span>
                          </span>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleFeedback(faq.id, 'yes')}
                              className="px-3 py-1 rounded-lg bg-zinc-100 hover:bg-emerald-50 hover:text-emerald-700 text-zinc-700 font-bold flex items-center gap-1 transition-colors"
                            >
                              <ThumbsUp className="w-3 h-3" />
                              <span>Có</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleFeedback(faq.id, 'no')}
                              className="px-3 py-1 rounded-lg bg-zinc-100 hover:bg-rose-50 hover:text-rose-700 text-zinc-700 font-bold flex items-center gap-1 transition-colors"
                            >
                              <ThumbsDown className="w-3 h-3" />
                              <span>Chưa rõ</span>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* EMERGENCY 24/7 SUPPORT CONTACT BANNER */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 text-white border border-zinc-800 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-left">
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black uppercase tracking-wider border border-emerald-500/30">
            Hỗ Trợ Trực Tuyến 24/7
          </span>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Vẫn Còn Câu Hỏi Khác Cần Giải Đáp?
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 max-w-lg">
            Đội ngũ tư vấn viên và chuyên viên kỹ thuật IoT của BoxifyX luôn túc trực 24/7 sẵn sàng giải đáp và xử lý mọi sự cố của bạn.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
          <a
            href="tel:19008899"
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-600 text-zinc-950 font-black text-xs sm:text-sm shadow-glow flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Phone className="w-4 h-4" />
            <span>Gọi Hotline: 1900 8899</span>
          </a>

          {onNavigate && (
            <button
              type="button"
              onClick={() => onNavigate('policy')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
            >
              <span>Xem Chính Sách Dịch Vụ</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

    </div>
  );
};
