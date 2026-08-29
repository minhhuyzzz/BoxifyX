import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Phone,
  HelpCircle,
  ExternalLink,
  ShieldCheck,
  Bot,
  User,
  ChevronDown
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'bot' | 'user';
  text: string;
  time: string;
  quickActions?: { label: string; action: () => void }[];
}

interface ChatWidgetProps {
  onNavigate?: (page: 'home' | 'locker' | 'valet' | 'closet' | 'pricing' | 'faq') => void;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [unreadBadge, setUnreadBadge] = useState<boolean>(true);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'bot',
      text: '👋 Xin chào! Tôi là Trợ Lý AI của BoxifyX. Tôi có thể hỗ trợ bạn tra cứu 27 trạm Smart Locker, tính giá lưu kho Valet hoặc hướng dẫn mở tủ nhanh.',
      time: 'Vừa xong',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setUnreadBadge(false);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages, isTyping]);

  const quickPrompts = [
    {
      label: '📍 Tìm trạm tủ gần tôi',
      query: 'Tôi muốn tìm trạm tủ Smart Locker gần nhất ở TP.HCM',
      reply: 'BoxifyX hiện có 27 trạm tủ phân bổ tại Sân bay Tân Sơn Nhất, Ga Sài Gòn, các ga Metro Tuyến 1, Bùi Viện và các TTTM lớn trên toàn TP.HCM. Bạn có thể nhấn vào nút "Trạm tủ" trên menu để xem bản đồ định vị GPS trực tiếp!',
      actionLabel: 'Xem Bản Đồ 27 Trạm Tủ',
      page: 'locker' as const,
    },
    {
      label: '📦 Giá lưu kho Valet bao nhiêu?',
      query: 'Giá gửi thùng Valet Storage theo tháng là bao nhiêu?',
      reply: 'Dịch vụ Valet Storage tại Kho máy lạnh 25°C có biểu phí cực kỳ ưu đãi:\n• Thùng Tiêu Chuẩn (60x40x40cm): 120.000đ/tháng\n• Kiện Quá Khổ / Pallet: 200.000đ/tháng\n• Phí giao nhận shipper: Miễn phí 3km đầu, chỉ 5.000đ/km tiếp theo.',
      actionLabel: 'Đặt Lưu Kho Valet',
      page: 'valet' as const,
    },
    {
      label: '🔑 Quên mã PIN mở tủ phải làm sao?',
      query: 'Nếu tôi lỡ quên mã PIN mở tủ Smart Locker thì làm thế nào?',
      reply: 'Bạn có thể vào mục "Đơn Của Tôi" (góc trên màn hình) để xem lại mã PIN 6 số và mã QR mở tủ. Nếu cần hỗ trợ khẩn cấp tại trạm, vui lòng gọi Hotline 1900 6868 để kỹ thuật viên mở từ xa.',
    },
    {
      label: '🛡️ Đồ gửi có an toàn và bảo hiểm không?',
      query: 'Hàng hóa gửi trong kho hoặc tủ có được bảo hiểm không?',
      reply: 'Tất cả các kiện hàng lưu kho Valet đều được cấp mã Seal niêm phong chống mở trộm, lưu trữ tại phòng máy lạnh 25°C độ ẩm <50% và đi kèm gói bảo hiểm hàng hóa mặc định lên tới 20.000.000 VNĐ/kiện.',
    },
  ];

  const handleSendMessage = (textToSend?: string) => {
    const query = textToSend || inputText.trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // AI / Smart response logic
    setTimeout(() => {
      let botReply = 'Cảm ơn bạn đã nhắn! Bộ phận CSKH và kỹ thuật viên BoxifyX sẵn sàng hỗ trợ bạn 24/7 qua Hotline 1900 6868 hoặc Zalo OA.';
      let targetPage: 'home' | 'locker' | 'valet' | 'closet' | 'pricing' | 'faq' | undefined;
      let targetActionLabel: string | undefined;

      const lower = query.toLowerCase();

      if (lower.includes('trạm') || lower.includes('vị trí') || lower.includes('ở đâu') || lower.includes('gần nhất') || lower.includes('địa chỉ')) {
        botReply = 'BoxifyX có 27 trạm Smart Locker phủ khắp TP.HCM (Sân bay TSN, Ga Metro, Quận 1, Gò Vấp, Bình Thạnh, Thủ Đức...). Bạn có thể mở Bản Đồ để chọn trạm gần nhất và đặt tủ giữ chỗ trước.';
        targetPage = 'locker';
        targetActionLabel = 'Mở Bản Đồ Trạm Tủ';
      } else if (lower.includes('giá') || lower.includes('chi phí') || lower.includes('tiền') || lower.includes('valet') || lower.includes('tháng') || lower.includes('thùng')) {
        botReply = '💰 Biểu phí dịch vụ BoxifyX:\n• Smart Locker: Từ 15.000đ/2h đầu (giảm thêm 20% khi thuê từ 6h trở lên).\n• Valet Storage: 120.000đ/tháng (Thùng Standard) & 200.000đ/tháng (Kiện Quá Khổ), bảo hiểm 20.000.000đ/kiện.';
        targetPage = 'pricing';
        targetActionLabel = 'Xem Bảng Giá Chi Tiết';
      } else if (lower.includes('pin') || lower.includes('mở tủ') || lower.includes('quên') || lower.includes('kẹt') || lower.includes('mã')) {
        botReply = 'Mã PIN 6 số và mã QR mở tủ luôn được lưu tự động trong mục "Đơn Của Tôi". Khi đến trạm, bạn chỉ cần nhập PIN trên màn hình Kiosk hoặc quét QR là tủ tự bật mở ngay.';
      } else if (lower.includes('tủ đồ') || lower.includes('xem đồ') || lower.includes('lấy đồ') || lower.includes('giao trả')) {
        botReply = 'Bạn có thể vào mục "Tủ Đồ (Digital Closet)" để xem ảnh chụp từng thùng đồ trong kho và bấm 1-chạm để gọi shipper giao trả đồ về nhà bất cứ lúc nào!';
        targetPage = 'closet';
        targetActionLabel = 'Xem Tủ Đồ Số Hóa';
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: botReply,
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        quickActions: targetPage && onNavigate && targetActionLabel ? [
          {
            label: targetActionLabel,
            action: () => {
              onNavigate(targetPage!);
              setIsOpen(false);
            },
          },
        ] : undefined,
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 700);
  };

  const handleQuickPromptClick = (prompt: typeof quickPrompts[0]) => {
    handleSendMessage(prompt.query);
  };

  return (
    <>
      {/* Floating Chat Bubble Button */}
      <div className="fixed z-40 bottom-20 lg:bottom-6 right-4 lg:right-6 flex items-center">
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 text-white shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group focus:outline-none"
            aria-label="Mở khung chat hỗ trợ"
          >
            {/* Notification unread pulse */}
            {unreadBadge && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] font-bold text-white items-center justify-center">
                  1
                </span>
              </span>
            )}
            <MessageSquare className="w-6 h-6 transition-transform group-hover:rotate-12" />
          </button>
        )}
      </div>

      {/* Chat Popover Window */}
      {isOpen && (
        <div className="fixed z-50 bottom-20 lg:bottom-6 right-4 lg:right-6 w-[360px] sm:w-[400px] max-w-[calc(100vw-32px)] h-[560px] max-h-[calc(100vh-120px)] bg-white rounded-3xl border border-zinc-200/90 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="p-4 bg-zinc-950 text-white flex items-center justify-between border-b border-zinc-800">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md">
                  <Bot className="w-5 h-5" />
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 border-2 border-zinc-950" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                  <span>Trợ Lý BoxifyX</span>
                  <span className="px-1.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 text-[10px] font-bold">
                    AI 24/7
                  </span>
                </h3>
                <p className="text-[11px] text-zinc-400">Trực tuyến • Phản hồi tức thì</p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <a
                href="tel:19006868"
                className="p-2 rounded-xl text-zinc-400 hover:text-amber-400 hover:bg-zinc-900 transition-colors"
                title="Gọi Hotline 1900 6868"
              >
                <Phone className="w-4 h-4" />
              </a>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
                aria-label="Đóng khung chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Hotline & Safety Banner */}
          <div className="px-4 py-2 bg-amber-50/80 border-b border-amber-100 flex items-center justify-between text-xs text-amber-900 font-medium">
            <span className="flex items-center gap-1 text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>Bảo hiểm 20Tr • Hỗ trợ 24/7</span>
            </span>
            <a
              href="tel:19006868"
              className="text-[11px] font-bold text-amber-700 hover:underline flex items-center gap-0.5"
            >
              <span>Hotline: 1900 6868</span>
            </a>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-zinc-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'bot' && (
                  <div className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center text-xs shrink-0 shadow-sm mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`max-w-[80%] space-y-1.5 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                  <div
                    className={`p-3.5 rounded-2xl text-xs leading-relaxed font-normal whitespace-pre-line shadow-sm ${msg.sender === 'user'
                      ? 'bg-zinc-950 text-white rounded-tr-none'
                      : 'bg-white text-zinc-800 border border-zinc-200/80 rounded-tl-none'
                      }`}
                  >
                    {msg.text}
                  </div>

                  {msg.quickActions && msg.quickActions.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.quickActions.map((qa, idx) => (
                        <button
                          key={idx}
                          type="button"
                          onClick={qa.action}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold shadow-sm transition-all active:scale-95"
                        >
                          <span>{qa.label}</span>
                          <ExternalLink className="w-3 h-3" />
                        </button>
                      ))}
                    </div>
                  )}

                  <span className="text-[10px] text-zinc-400 px-1 block">
                    {msg.time}
                  </span>
                </div>

                {msg.sender === 'user' && (
                  <div className="w-7 h-7 rounded-xl bg-zinc-900 text-white flex items-center justify-center text-xs shrink-0 shadow-sm mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-zinc-400 text-xs pl-2">
                <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="flex gap-1 items-center bg-white px-3 py-2 rounded-2xl border border-zinc-200 shadow-sm">
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick FAQ Suggestion Chips */}
          <div className="px-3 py-2 bg-white border-t border-zinc-100 overflow-x-auto scrollbar-none flex gap-1.5">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleQuickPromptClick(p)}
                className="shrink-0 px-2.5 py-1 rounded-full bg-zinc-100 hover:bg-amber-100 hover:text-amber-900 text-zinc-700 text-[11px] font-medium transition-colors border border-zinc-200/60"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-white border-t border-zinc-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Nhập câu hỏi của bạn..."
              className="flex-1 px-3.5 py-2.5 rounded-2xl bg-zinc-100 border border-transparent focus:border-amber-400 focus:bg-white text-xs text-zinc-900 focus:outline-none transition-all"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="p-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-200 disabled:text-zinc-400 text-white transition-all shadow-md active:scale-95 shrink-0"
              aria-label="Gửi tin nhắn"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};
