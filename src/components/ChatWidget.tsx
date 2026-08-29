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
  Share2,
  PhoneCall,
  SendHorizontal
} from 'lucide-react';
import { askBoxifyAI, ChatMessageParam } from '../services/aiService';

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

import { ScrollToTop } from './ScrollToTop';

export const ChatWidget: React.FC<ChatWidgetProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'chat' | 'social'>('chat');
  const [inputText, setInputText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [unreadBadge, setUnreadBadge] = useState<boolean>(true);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'bot',
      text: '👋 Xin chào! Tôi là Trợ Lý AI của BoxifyX. Tôi có thể giải đáp mọi thắc mắc về 27 trạm Smart Locker, biểu phí lưu kho Valet 25°C hoặc hướng dẫn mở tủ nhanh.',
      time: 'Vừa xong',
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setUnreadBadge(false);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages, isTyping, activeTab]);

  const socialLinks = [
    {
      name: 'Hotline 24/7',
      desc: '1900 6868 (Khẩn cấp & Mở tủ)',
      href: 'tel:19006868',
      color: 'bg-red-500 hover:bg-red-600 text-white',
      badge: 'Miễn phí',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
    },
    {
      name: 'Zalo Official Account',
      desc: 'Tư vấn trực tiếp qua Zalo',
      href: 'https://zalo.me/0909123456',
      color: 'bg-blue-500 hover:bg-blue-600 text-white',
      badge: 'Phản hồi nhanh',
      icon: (
        <span className="font-extrabold text-sm tracking-tighter">Zalo</span>
      ),
    },
    {
      name: 'Facebook Messenger',
      desc: 'm.me/boxifyx.vn',
      href: 'https://m.me/boxifyx.vn',
      color: 'bg-gradient-to-tr from-blue-600 via-indigo-600 to-pink-500 text-white',
      badge: 'Trực tuyến',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.36 2 2 6.13 2 11.7c0 2.91 1.19 5.43 3.12 7.15.16.14.26.35.26.57v2.18c0 .54.55.91 1.05.7l2.42-1.03c.18-.08.38-.1.57-.05.82.23 1.69.35 2.58.35 5.64 0 10-4.13 10-9.7S17.64 2 12 2zm1.09 13.07l-2.67-2.85-5.21 2.85c-.38.21-.82-.21-.63-.6l5.7-8.08c.28-.39.86-.41 1.16-.03l2.68 2.84 5.2-2.84c.38-.21.82.21.63.6l-5.69 8.08c-.28.4-.87.42-1.17.03z" />
        </svg>
      ),
    },
    {
      name: 'Telegram Support',
      desc: '@boxifyx_support',
      href: 'https://t.me/boxifyx_support',
      color: 'bg-sky-500 hover:bg-sky-600 text-white',
      badge: 'Bảo mật',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69a.2.2 0 00-.05-.18c-.06-.05-.14-.03-.21-.02-.09.02-1.49.95-4.22 2.79-.4.27-.76.41-1.08.4-.36-.01-1.04-.2-1.55-.37-.63-.2-1.12-.31-1.08-.66.02-.18.27-.36.74-.55 2.92-1.27 4.86-2.11 5.83-2.52 2.77-1.16 3.35-1.36 3.73-1.36.08 0 .27.02.39.12.1.08.13.19.14.27-.01.06.01.24 0 .37z" />
        </svg>
      ),
    },
    {
      name: 'Kênh TikTok BoxifyX',
      desc: '@boxifyx.vn (Review trạm & kho)',
      href: 'https://tiktok.com/@boxifyx.vn',
      color: 'bg-zinc-900 hover:bg-zinc-800 text-white',
      badge: 'Video hướng dẫn',
      icon: (
        <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 00-1-.08A6.34 6.34 0 003 15.66a6.34 6.34 0 0010.82 4.47 6.27 6.27 0 001.95-4.47V8.08a8.27 8.27 0 004.82 1.55v-3.43a4.84 4.84 0 01-1-.51z" />
        </svg>
      ),
    },
  ];

  const quickPrompts = [
    {
      label: '📍 Tìm trạm tủ gần tôi',
      query: 'Tôi muốn tìm trạm tủ Smart Locker gần nhất ở TP.HCM',
    },
    {
      label: '📦 Giá lưu kho Valet bao nhiêu?',
      query: 'Giá gửi thùng Valet Storage theo tháng là bao nhiêu?',
    },
    {
      label: '🔑 Quên mã PIN mở tủ phải làm sao?',
      query: 'Nếu tôi lỡ quên mã PIN mở tủ Smart Locker thì làm thế nào?',
    },
    {
      label: '🛡️ Đồ gửi có an toàn & bảo hiểm không?',
      query: 'Hàng hóa gửi trong kho hoặc tủ có được bảo hiểm không?',
    },
  ];

  const handleSendMessage = async (textToSend?: string) => {
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

    // Build context history for AI
    const historyParams: ChatMessageParam[] = messages.slice(-4).map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text,
    }));

    try {
      // Call Real AI API Service
      const aiReply = await askBoxifyAI(query, historyParams);

      let targetPage: 'home' | 'locker' | 'valet' | 'closet' | 'pricing' | 'faq' | undefined;
      let targetActionLabel: string | undefined;

      const lower = query.toLowerCase();
      if (lower.includes('trạm') || lower.includes('vị trí') || lower.includes('ở đâu') || lower.includes('gần')) {
        targetPage = 'locker';
        targetActionLabel = 'Mở Bản Đồ 27 Trạm Tủ';
      } else if (lower.includes('giá') || lower.includes('bảng giá') || lower.includes('chi phí')) {
        targetPage = 'pricing';
        targetActionLabel = 'Xem Bảng Giá Chi Tiết';
      } else if (lower.includes('valet') || lower.includes('gửi thùng') || lower.includes('kho')) {
        targetPage = 'valet';
        targetActionLabel = 'Đặt Lưu Kho Valet';
      } else if (lower.includes('tủ đồ') || lower.includes('xem đồ') || lower.includes('giao trả')) {
        targetPage = 'closet';
        targetActionLabel = 'Mở Tủ Đồ Số Hóa';
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: aiReply,
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
    } catch {
      const fallbackMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: 'BoxifyX có 27 trạm Smart Locker toàn TP.HCM và dịch vụ Valet Storage 25°C giao nhận tận nhà. Vui lòng gọi Hotline 1900 6868 nếu cần hỗ trợ khẩn cấp nhé!',
        time: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Unified Vertical Floating Action Dock */}
      <div className="fixed z-40 bottom-20 lg:bottom-6 right-4 sm:right-6 flex flex-col items-center gap-2.5">
        {/* 1. Scroll To Top Button (Tự động hiện khi lướt xuống, nằm đỉnh cột) */}
        <ScrollToTop />

        {/* 2. Nút Mạng Xã Hội Đa Kênh (Zalo, Messenger, Telegram, TikTok) */}
        <button
          type="button"
          onClick={() => {
            setIsOpen(true);
            setActiveTab('social');
          }}
          className="w-11 h-11 rounded-full bg-zinc-900 hover:bg-black text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 group"
          title="Mạng xã hội & Kênh liên hệ (Zalo, Messenger, Telegram, TikTok...)"
          aria-label="Kênh mạng xã hội"
        >
          <Share2 className="w-4 h-4 group-hover:rotate-12 transition-transform" />
        </button>

        {/* 3. Nút Chat Zalo OA Trực Tiếp 1-Chạm */}
        <a
          href="https://zalo.me/0909123456"
          target="_blank"
          rel="noopener noreferrer"
          className="w-11 h-11 rounded-full bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 font-extrabold text-[11px] tracking-tight"
          title="Chat Zalo Official: 0909 123 456"
          aria-label="Chat Zalo Official"
        >
          Zalo
        </a>

        {/* 4. Nút Gọi Hotline Khẩn Cấp 24/7 (1900 6868) */}
        <a
          href="tel:19006868"
          aria-label="Gọi hotline 1900 6868"
          className="w-11 h-11 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-110 active:scale-95 transition-all duration-300"
          title="Hotline 24/7: 1900 6868 (Khẩn cấp & Mở tủ)"
        >
          <PhoneCall className="w-5 h-5 animate-pulse" />
        </a>

        {/* 5. Nút Mở Khung Chat AI BoxifyX */}
        <button
          type="button"
          onClick={() => {
            setIsOpen(!isOpen);
            if (!isOpen) setActiveTab('chat');
          }}
          className="relative flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-amber-600 text-white shadow-xl hover:shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group focus:outline-none"
          aria-label="Mở khung chat hỗ trợ AI"
          title="Trợ Lý AI BoxifyX 24/7"
        >
          {unreadBadge && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] font-bold text-white items-center justify-center">
                1
              </span>
            </span>
          )}
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6 transition-transform group-hover:rotate-12" />}
        </button>
      </div>

      {/* Chat Popover Window */}
      {isOpen && (
        <div className="fixed z-50 bottom-20 lg:bottom-6 right-4 lg:right-6 w-[360px] sm:w-[420px] max-w-[calc(100vw-32px)] h-[580px] max-h-[calc(100vh-120px)] bg-white rounded-3xl border border-zinc-200/90 shadow-2xl flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300">
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
                  <span className="px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
                    AI Online
                  </span>
                </h3>
                <p className="text-[11px] text-zinc-400">Kết nối AI thời gian thực • Hotline 1900 6868</p>
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

          {/* Navigation Tabs (AI Chat vs Social Channels) */}
          <div className="flex border-b border-zinc-100 bg-zinc-50/80 px-2 pt-1 text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('chat')}
              className={`flex-1 py-2.5 px-3 rounded-t-xl transition-all flex items-center justify-center gap-1.5 ${activeTab === 'chat'
                ? 'bg-white text-amber-600 border-t-2 border-amber-500 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900'
                }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>Trò Chuyện AI</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('social')}
              className={`flex-1 py-2.5 px-3 rounded-t-xl transition-all flex items-center justify-center gap-1.5 ${activeTab === 'social'
                ? 'bg-white text-amber-600 border-t-2 border-amber-500 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-900'
                }`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Kênh Mạng Xã Hội & SĐT</span>
            </button>
          </div>

          {/* TAB 1: AI Chat View */}
          {activeTab === 'chat' && (
            <>
              {/* Messages Body */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-zinc-50/40">
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

                    <div className={`max-w-[82%] space-y-1.5 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
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
                    <span className="text-[11px] text-zinc-400">AI đang phân tích câu trả lời...</span>
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
                    onClick={() => handleSendMessage(p.query)}
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
                  placeholder="Hỏi AI bất kỳ điều gì về BoxifyX..."
                  className="flex-1 px-3.5 py-2.5 rounded-2xl bg-zinc-100 border border-transparent focus:border-amber-400 focus:bg-white text-xs text-zinc-900 focus:outline-none transition-all"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim() || isTyping}
                  className="p-2.5 rounded-2xl bg-amber-500 hover:bg-amber-600 disabled:bg-zinc-200 disabled:text-zinc-400 text-white transition-all shadow-md active:scale-95 shrink-0"
                  aria-label="Gửi tin nhắn"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}

          {/* TAB 2: Social & Direct Phone Contact Hub */}
          {activeTab === 'social' && (
            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-zinc-50/50">
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200/70 text-amber-950 text-xs leading-relaxed space-y-1">
                <p className="font-extrabold flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-amber-600" />
                  <span>Trung Tâm Hỗ Trợ Đa Kênh BoxifyX</span>
                </p>
                <p className="text-zinc-600 text-[11px]">
                  Cần trợ giúp khẩn cấp tại trạm tủ, đặt lịch giao nhận đặc biệt hoặc hợp tác trạm? Hãy kết nối với chúng tôi qua các kênh dưới đây:
                </p>
              </div>

              <div className="space-y-2.5">
                {socialLinks.map((item, idx) => (
                  <a
                    key={idx}
                    href={item.href}
                    target={item.href.startsWith('tel:') ? '_self' : '_blank'}
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-zinc-200/80 hover:border-amber-400 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color} shadow-sm group-hover:scale-105 transition-transform`}>
                        {item.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-xs text-zinc-900 group-hover:text-amber-600 transition-colors">
                            {item.name}
                          </h4>
                          <span className="px-1.5 py-0.2 rounded bg-zinc-100 text-zinc-600 text-[9px] font-bold">
                            {item.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500">{item.desc}</p>
                      </div>
                    </div>

                    <ExternalLink className="w-4 h-4 text-zinc-400 group-hover:text-amber-500 transition-colors shrink-0" />
                  </a>
                ))}
              </div>

              {/* Warehouse Address details */}
              <div className="p-3.5 rounded-2xl bg-white border border-zinc-200/80 text-xs space-y-1.5">
                <h5 className="font-extrabold text-zinc-900">📍 Trụ sở & Kho Trung Tâm TP.HCM</h5>
                <p className="text-zinc-600 text-[11px] leading-relaxed">
                  102 Hoàng Văn Thụ, Phường 2, Quận Tân Bình, TP. Hồ Chí Minh
                </p>
                <p className="text-[11px] text-zinc-500">
                  Thời gian mở cửa kho: <strong>08:00 - 20:00 (Hàng ngày)</strong>
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
