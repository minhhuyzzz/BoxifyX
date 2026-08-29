import React, { useState, useEffect } from 'react';
import {
  FileText,
  Shield,
  Lock,
  PackageCheck,
  Award,
  AlertTriangle,
  HelpCircle,
  Phone,
  Mail,
  ChevronRight,
  CheckCircle2,
  Scale,
  Building2,
  Clock,
  ExternalLink,
  Info,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export type PolicyTab = 'terms' | 'privacy' | 'sealing' | 'insurance' | 'dispute';

interface PolicyPageProps {
  initialTab?: PolicyTab;
  onNavigate?: (page: any) => void;
}

export const PolicyPage: React.FC<PolicyPageProps> = ({ initialTab = 'terms', onNavigate }) => {
  const [activeTab, setActiveTab] = useState<PolicyTab>(initialTab);

  // Sync with initialTab prop updates
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  // Sync with URL hash if present
  useEffect(() => {
    const handleHashSync = () => {
      const hash = window.location.hash || '';
      if (hash.includes('tab=')) {
        const tabParam = hash.split('tab=')[1]?.split('&')[0] as PolicyTab;
        if (['terms', 'privacy', 'sealing', 'insurance', 'dispute'].includes(tabParam)) {
          setActiveTab(tabParam);
        }
      }
    };

    handleHashSync();
    window.addEventListener('hashchange', handleHashSync);
    return () => window.removeEventListener('hashchange', handleHashSync);
  }, []);

  const handleTabChange = (tabId: PolicyTab) => {
    setActiveTab(tabId);
    window.location.hash = `#/policy?tab=${tabId}`;
  };

  const tabs = [
    {
      id: 'terms' as PolicyTab,
      label: 'Điều Khoản Dịch Vụ',
      shortLabel: 'Điều Khoản',
      icon: FileText,
      badge: 'Bắt Buộc',
    },
    {
      id: 'privacy' as PolicyTab,
      label: 'Chính Sách Bảo Mật (NĐ 13)',
      shortLabel: 'Bảo Mật',
      icon: Shield,
      badge: 'Nghị Định 13/2023',
    },
    {
      id: 'sealing' as PolicyTab,
      label: 'Quy Chuẩn Niêm Phong & Hàng Cấm',
      shortLabel: 'Niêm Phong',
      icon: PackageCheck,
      badge: 'Nghiêm Ngặt',
    },
    {
      id: 'insurance' as PolicyTab,
      label: 'Bảo Hiểm Tài Sản 20 Triệu',
      shortLabel: 'Bảo Hiểm 20Tr',
      icon: Award,
      badge: 'Đền Bù 100%',
    },
    {
      id: 'dispute' as PolicyTab,
      label: 'Quy Trình Xử Lý Khiếu Nại',
      shortLabel: 'Khiếu Nại',
      icon: Scale,
      badge: '24/7 Hotline',
    },
  ];

  return (
    <div className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-left space-y-8 animate-fade-in">
      
      {/* Header Banner */}
      <div className="rounded-3xl bg-zinc-950 p-6 sm:p-10 text-white shadow-2xl border border-zinc-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:20px_20px] opacity-10 pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5" />
            <span>Pháp Lý & Quy Định Vận Hành Minh Bạch</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
            Trung Tâm Chính Sách & Quy Định BoxifyX
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
            Cam kết pháp lý rõ ràng, bảo vệ quyền lợi 100% cho khách hàng sử dụng hệ sinh thái Tủ Thông Minh Smart Locker và Kho Lưu Trữ Cá Nhân Valet Storage tại TP.HCM.
          </p>
        </div>

        {/* Quick Meta Stats */}
        <div className="mt-6 pt-6 border-t border-zinc-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-zinc-500 block text-[11px]">Cập nhật lần cuối:</span>
            <strong className="text-white">Tháng 08/2026</strong>
          </div>
          <div>
            <span className="text-zinc-500 block text-[11px]">Cơ quan chủ quản:</span>
            <strong className="text-amber-400">BoxifyX Technology JSC</strong>
          </div>
          <div>
            <span className="text-zinc-500 block text-[11px]">Mức bảo hiểm tối đa:</span>
            <strong className="text-emerald-400">20.000.000 đ / Vụ</strong>
          </div>
          <div>
            <span className="text-zinc-500 block text-[11px]">Hỗ trợ pháp lý 24/7:</span>
            <strong className="text-white">1900 8899</strong>
          </div>
        </div>
      </div>

      {/* Tab Navigation Pill Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border shrink-0 ${
                isActive
                  ? 'bg-zinc-950 text-white border-zinc-950 shadow-md ring-2 ring-amber-400/50'
                  : 'bg-white text-zinc-600 border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-zinc-400'}`} />
              <span>{tab.label}</span>
              <span
                className={`text-[9px] px-1.5 py-0.2 rounded-full font-extrabold ${
                  isActive ? 'bg-amber-400/20 text-amber-300' : 'bg-zinc-100 text-zinc-500'
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Tab Content Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-zinc-200 shadow-sm space-y-8">

        {/* TAB 1: ĐIỀU KHOẢN SỬ DỤNG DỊCH VỤ */}
        {activeTab === 'terms' && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-zinc-200 pb-4">
              <span className="text-xs font-extrabold text-orange-600 uppercase tracking-wider block mb-1">Mục 1</span>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-950">
                Điều Khoản Sử Dụng Dịch Vụ BoxifyX
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Áp dụng cho toàn bộ người dùng đăng ký tài khoản, gửi đồ tại trạm Smart Locker và sử dụng dịch vụ Valet Storage.
              </p>
            </div>

            <div className="space-y-6 text-xs sm:text-sm text-zinc-700 leading-relaxed">
              <section className="space-y-2">
                <h3 className="text-base font-extrabold text-zinc-950 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 text-xs flex items-center justify-center font-black">1.1</span>
                  <span>Định Nghĩa Dịch Vụ & Chủ Thể Hợp Đồng</span>
                </h3>
                <p>
                  BoxifyX là giải pháp công nghệ cung cấp hạ tầng tủ gửi đồ tự động theo giờ (Smart Locker) và dịch vụ điều phối giao nhận - lưu trữ đồ đạc cá nhân trong kho chuyên dụng (Valet Storage) tại khu vực Thành phố Hồ Chí Minh.
                </p>
                <p>
                  Khi người dùng bấm xác nhận "Đặt Tủ" hoặc "Đặt Lưu Kho", một thỏa thuận cung ứng dịch vụ điện tử chính thức được thiết lập giữa người dùng và Công ty Cổ phần Công nghệ BoxifyX.
                </p>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-extrabold text-zinc-950 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 text-xs flex items-center justify-center font-black">1.2</span>
                  <span>Quy Định Sử Dụng Smart Locker Theo Giờ</span>
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-zinc-600">
                  <li><strong>Thời gian giữ chỗ trước:</strong> Hệ thống tự động giữ chốt ô tủ trong vòng 10 phút sau khi tạo đơn đặt trực tuyến để quý khách di chuyển tới kiosk.</li>
                  <li><strong>Mã khóa & Bảo mật PIN:</strong> Mỗi lượt thuê tủ được cấp một mã PIN 6 chữ số ngẫu nhiên hoặc QR Token dùng một lần. Quý khách có trách nhiệm tự bảo mật mã khóa này, không chia sẻ cho người lạ.</li>
                  <li><strong>Tính phí quá hạn:</strong> Sau khi hết thời gian thuê đăng ký, cước phụ thu được tính theo block 1 giờ tiêu chuẩn (10.000 đ - 25.000 đ tùy size). Đồ đạc quá hạn trên 72 giờ không có người liên hệ gia hạn sẽ được đội phản ứng nhanh chuyển về Kho Trung Tâm Tân Bình để đảm bảo an toàn.</li>
                </ul>
              </section>

              <section className="space-y-2">
                <h3 className="text-base font-extrabold text-zinc-950 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 text-xs flex items-center justify-center font-black">1.3</span>
                  <span>Quy Định Dịch Vụ Lưu Kho Valet Storage Theo Tháng</span>
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-zinc-600">
                  <li><strong>Giao nhận thùng rỗng:</strong> BoxifyX cung cấp thùng nhựa tiêu chuẩn chịu tải 50kg và seal niêm phong mã vạch miễn phí tận nơi (Miễn phí vận chuyển 3km đầu tiên tính từ kho trung tâm).</li>
                  <li><strong>Chu kỳ thanh toán:</strong> Phí lưu kho được tính theo chu kỳ 30 ngày. Khách hàng có thể gia hạn hoặc yêu cầu hoàn trả đồ bất cứ lúc nào thông qua tính năng "Yêu cầu lấy đồ" trong Tủ Đồ Số Hóa.</li>
                </ul>
              </section>
            </div>
          </div>
        )}

        {/* TAB 2: CHÍNH SÁCH BẢO MẬT */}
        {activeTab === 'privacy' && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-zinc-200 pb-4">
              <span className="text-xs font-extrabold text-blue-600 uppercase tracking-wider block mb-1">Mục 2</span>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-950">
                Chính Sách Bảo Mật Dữ Liệu & Quyền Riêng Tư
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Tuân thủ Nghị định 13/2023/NĐ-CP của Chính phủ Việt Nam về bảo vệ dữ liệu cá nhân (PDPD).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs text-blue-900">
                  <Shield className="w-4 h-4 text-blue-600" />
                  <span>Mã Hóa Dữ Liệu Cấp Ngân Hàng (AES-256)</span>
                </div>
                <p className="text-xs text-blue-950/80 leading-relaxed">
                  Mọi thông tin cá nhân gồm Số điện thoại, Email, Địa chỉ nhà và Lịch sử đơn hàng đều được mã hóa chuẩn AES-256 trên hệ cơ sở dữ liệu Supabase Enterprise.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 font-bold text-xs text-emerald-900">
                  <Lock className="w-4 h-4 text-emerald-600" />
                  <span>Quyền Riêng Tư Của Tủ Đồ Số Hóa</span>
                </div>
                <p className="text-xs text-emerald-950/80 leading-relaxed">
                  Hình ảnh và danh mục đồ vật bạn tải lên "Tủ Đồ" là dữ liệu riêng tư 100%. Nhân viên kho chỉ kiểm tra số seal niêm phong bên ngoài thùng, tuyệt đối KHÔNG ĐƯỢC PHÉP mở thùng khi chốt seal còn nguyên vẹn.
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-zinc-700 leading-relaxed">
              <h3 className="text-base font-extrabold text-zinc-950">Cam kết không chia sẻ dữ liệu</h3>
              <p>
                BoxifyX cam kết không bán, không cho thuê và không chia sẻ thông tin khách hàng cho bất kỳ đơn vị quảng cáo hoặc bên thứ ba nào, trừ trường hợp có yêu cầu bằng văn bản từ cơ quan điều tra có thẩm quyền theo quy định của Pháp luật Việt Nam.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: QUY CHUẨN NIÊM PHONG & HÀNG CẤM */}
        {activeTab === 'sealing' && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-zinc-200 pb-4">
              <span className="text-xs font-extrabold text-red-600 uppercase tracking-wider block mb-1">Mục 3</span>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-950">
                Quy Chuẩn Niêm Phong & Danh Mục Hàng Cấm Lưu Trữ
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Quy định bắt buộc nhằm bảo đảm an toàn cháy nổ, vệ sinh môi trường và tuân thủ Luật An ninh quốc gia.
              </p>
            </div>

            {/* Warning Box: Prohibited Items */}
            <div className="p-5 rounded-2xl bg-red-50 border-2 border-red-200 space-y-3">
              <div className="flex items-center gap-2 text-red-900 font-black text-sm">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
                <span>DANH MỤC HÀNG HÓA TUYỆT ĐỐI CẤM LƯU TRỮ TRONG TỦ & KHO</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-red-950">
                <div className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✕</span>
                  <span>Chất nổ, xăng dầu, gas, pháo hoa, bình xịt dễ bắt lửa.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✕</span>
                  <span>Vũ khí, súng đạn, hung khí nguy hiểm, công cụ hỗ trợ.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✕</span>
                  <span>Chất cấm, ma túy, tiền chất, độc chất hóa học, sinh học.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✕</span>
                  <span>Thực phẩm tươi sống, động thực vật sống, hàng có mùi hôi thối.</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✕</span>
                  <span>Tiền mặt mệnh giá lớn, vàng miếng, kim cương quý hiếm (vui lòng gửi két sắt ngân hàng).</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-600 font-bold">✕</span>
                  <span>Hàng hóa lậu, hàng giả không rõ nguồn gốc xuất xứ.</span>
                </div>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-zinc-700 leading-relaxed">
              <h3 className="text-base font-extrabold text-zinc-950">Cơ chế chốt Seal bảo mật 1 lần</h3>
              <p>
                Mỗi thùng Valet Storage được cung cấp kèm 2 chốt seal nhựa chuyên dụng có mã số Series duy nhất. Khách hàng tự tay bấm chốt seal sau khi đóng gói. Khi nhận lại đồ, nếu chốt seal có dấu hiệu bị cắt đứt hoặc sai lệch mã số, khách hàng có quyền từ chối nhận và yêu cầu lập biên bản bảo hiểm ngay tại chỗ.
              </p>
            </div>
          </div>
        )}

        {/* TAB 4: BẢO HIỂM TÀI SẢN 20 TRIỆU */}
        {activeTab === 'insurance' && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-zinc-200 pb-4">
              <span className="text-xs font-extrabold text-emerald-600 uppercase tracking-wider block mb-1">Mục 4</span>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-950">
                Chính Sách Bảo Hiểm Tài Sản Đến 20.000.000 VNĐ
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Hợp đồng liên kết bảo hiểm trách nhiệm hàng hóa với các đơn vị bảo hiểm hàng đầu Việt Nam.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-amber-300" />
                  <span className="font-black text-base">Gói Bảo Hiểm Toàn Diện BoxifyX Care</span>
                </div>
                <span className="px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold backdrop-blur-md">
                  Tích hợp sẵn 100% Đơn Hàng
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-50 leading-relaxed">
                Tất cả đơn hàng Smart Locker và Valet Storage hợp lệ đều được tự động bảo hiểm đối với các rủi ro: Mất mát, trộm cắp đột nhập trạm tủ, hỏa hoạn cháy nổ kho bãi, ngập lụt thiên tai và tai nạn giao thông trong quá trình vận chuyển.
              </p>
              <div className="pt-2 border-t border-white/20 flex items-center justify-between text-xs">
                <span>Hạn mức đền bù tối đa:</span>
                <strong className="text-xl font-black text-amber-300">20.000.000 VNĐ / Vụ</strong>
              </div>
            </div>

            <div className="space-y-3 text-xs sm:text-sm text-zinc-700 leading-relaxed">
              <h3 className="text-base font-extrabold text-zinc-950">Quy trình bồi thường minh bạch:</h3>
              <ol className="list-decimal pl-5 space-y-2 text-zinc-600">
                <li><strong>Bước 1 - Tiếp nhận:</strong> Khách hàng thông báo sự cố qua tổng đài 1900 8899 hoặc ứng dụng trong vòng 24 giờ sau khi phát hiện.</li>
                <li><strong>Bước 2 - Đối soát & Giám định:</strong> Bộ phận an ninh trích xuất dữ liệu camera CCTV 4K, cảm biến IoT và nhật ký đóng mở điện tử trong vòng 24 - 48 giờ làm việc.</li>
                <li><strong>Bước 3 - Chi trả bồi thường:</strong> Sau khi hoàn tất biên bản giám định, khoản tiền bồi thường được chuyển khoản trực tiếp vào tài khoản ngân hàng của khách hàng trong tối đa 03 ngày làm việc.</li>
              </ol>
            </div>
          </div>
        )}

        {/* TAB 5: GIẢI QUYẾT KHIẾU NẠI & TRANH CHẤP */}
        {activeTab === 'dispute' && (
          <div className="space-y-6 animate-fade-in">
            <div className="border-b border-zinc-200 pb-4">
              <span className="text-xs font-extrabold text-purple-600 uppercase tracking-wider block mb-1">Mục 5</span>
              <h2 className="text-xl sm:text-2xl font-black text-zinc-950">
                Quy Trình Tiếp Nhận Khiếu Nại & Giải Quyết Tranh Chấp
              </h2>
              <p className="text-xs sm:text-sm text-zinc-500 mt-1">
                Quy trình chuẩn hóa 3 cấp độ giải quyết thỏa đáng, ưu tiên tối đa quyền lợi khách hàng.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center font-bold text-xs">
                  Cấp 1
                </div>
                <h4 className="font-extrabold text-xs text-zinc-950">Tổng Đài Hotline 24/7</h4>
                <p className="text-xs text-zinc-500">
                  Xử lý ngay các vấn đề: Kẹt chốt tủ, quên mã PIN, đổi lịch hẹn giao nhận qua hotline <strong>1900 8899</strong>.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
                  Cấp 2
                </div>
                <h4 className="font-extrabold text-xs text-zinc-950">Hội Đồng Giám Định</h4>
                <p className="text-xs text-zinc-500">
                  Đối soát log thiết bị IoT, kiểm tra hình ảnh camera kho bãi, phản hồi kết luận trong 24 giờ.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-zinc-50 border border-zinc-200 space-y-2">
                <div className="w-8 h-8 rounded-xl bg-zinc-950 text-white flex items-center justify-center font-bold text-xs">
                  Cấp 3
                </div>
                <h4 className="font-extrabold text-xs text-zinc-950">Tòa Án Trọng Tài</h4>
                <p className="text-xs text-zinc-500">
                  Trường hợp hai bên không đạt được thỏa thuận thương lượng, vụ việc sẽ được đưa ra Tòa án có thẩm quyền tại TP.HCM.
                </p>
              </div>
            </div>

            {/* Direct Contact Support Box */}
            <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <h4 className="font-extrabold text-sm text-zinc-950">Cần Hỗ Trợ Khẩn Cấp Hoặc Phản Ánh Dịch Vụ?</h4>
                <p className="text-xs text-zinc-600">Đội ngũ pháp chế & chăm sóc khách hàng BoxifyX luôn sẵn sàng lắng nghe 24/7.</p>
              </div>
              <div className="flex items-center gap-3">
                <a
                  href="tel:19008899"
                  className="px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Phone className="w-4 h-4" />
                  <span>1900 8899</span>
                </a>
                <a
                  href="mailto:phapche@boxifyx.vn"
                  className="px-4 py-2.5 rounded-xl bg-zinc-950 hover:bg-zinc-800 text-white font-extrabold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  <span>phapche@boxifyx.vn</span>
                </a>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
