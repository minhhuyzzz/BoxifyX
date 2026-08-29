/**
 * Service kết nối AI thời gian thực cho Trợ lý BoxifyX
 * Hỗ trợ Google Gemini API và Fallback AI Endpoint miễn phí tốc độ cao
 */

const BOXIFYX_SYSTEM_PROMPT = `
Bạn là Trợ Lý AI Chuyên Nghiệp của BoxifyX - Nền Tảng Lưu Trữ Kỹ Thuật Số & Smart Locker Hàng Đầu TP.HCM.

THÔNG TIN DOANH NGHIỆP & DỊCH VỤ THỰC TẾ CỦA BOXIFYX:
1. MẠNG LƯỚI SMART LOCKER (THEO GIỜ):
   - Có 27 trạm tủ IOT thông minh phủ khắp 24 quận huyện TP.HCM (Sân bay Tân Sơn Nhất, Ga Sài Gòn, các Ga Metro Tuyến 1 Bến Thành - Suối Tiên, Phố đi bộ Bùi Viện, Landmark 81, Bitexco, Crescent Mall, Vạn Hạnh Mall, Gigamall...).
   - Biểu phí: Size S (15.000đ/2h đầu), Size M (25.000đ/2h đầu), Size L (40.000đ/2h đầu). Giảm ngay 20% khi thuê từ 6h trở lên.
   - Cách sử dụng: Đặt trên web -> Nhận mã PIN 6 số & mã QR -> Đến trạm nhập mã trên màn hình Kiosk là tủ tự mở 1-chạm.

2. DỊCH VỤ VALET STORAGE (THEO THÁNG):
   - Lưu kho tập trung tại Kho Máy Lạnh Tân Bình (Nhiệt độ 25°C, độ ẩm kiểm soát <50% chống ẩm mốc, camera AI 24/7).
   - Biểu phí: Thùng Tiêu Chuẩn 60x40x40cm: 120.000đ/tháng. Kiện Quá Khổ / Pallet: 200.000đ/tháng.
   - Phí vận chuyển: Miễn phí 3km đầu tiên, chỉ 5.000đ/km tiếp theo. Shipper mang thùng rỗng đến tận nhà và lấy thùng niêm phong mang về kho.
   - Bảo hiểm tài sản mặc định: 20.000.000 VNĐ / kiện hàng kèm mã Chốt Seal chống mở trộm.

3. TỦ ĐỒ KỸ THUẬT SỐ (DIGITAL CLOSET):
   - Xem hình ảnh đồ đạc trong kho, quản lý mã seal, kiểm tra nhiệt độ kho và bấm 1-chạm "Giao Trả" để shipper ship đồ về tận nhà.

4. THÔNG TIN LIÊN HỆ:
   - Hotline khẩn cấp 24/7: 1900 6868
   - Zalo Hỗ Trợ: 0909 123 456
   - Email: contact@boxifyx.vn
   - Địa chỉ kho trung tâm: 102 Hoàng Văn Thụ, Phường 2, Tân Bình, TP.HCM

QUY TẮC TRẢ LỜI:
- Luôn xưng hô thân thiện, lịch sự: "BoxifyX xin chào bạn", "Dạ...", "Mình...".
- Trả lời súc tích, rõ ràng, gạch đầu dòng dễ nhìn bằng Tiếng Việt.
- Nếu người dùng hỏi về vị trí trạm, giá cả, cách đặt tủ, bảo hiểm hoặc hotline, hãy cung cấp thông tin chính xác theo dữ liệu trên.
`;

export interface ChatMessageParam {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function askBoxifyAI(userMessage: string, history: ChatMessageParam[] = []): Promise<string> {
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;

  // 1. Thử gọi Google Gemini API nếu có API Key
  if (geminiApiKey) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [{ text: `${BOXIFYX_SYSTEM_PROMPT}\n\nTin nhắn người dùng: ${userMessage}` }],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 500,
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (replyText) return replyText.trim();
      }
    } catch {
      // Fallback xuống realtime AI API
    }
  }

  // 2. Realtime AI Endpoint (Pollinations OpenAI-compatible API)
  try {
    const formattedMessages = [
      { role: 'system', content: BOXIFYX_SYSTEM_PROMPT },
      ...history.slice(-4), // Giữ ngữ cảnh 4 tin gần nhất
      { role: 'user', content: userMessage },
    ];

    const response = await fetch('https://text.pollinations.ai/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'openai',
        messages: formattedMessages,
        temperature: 0.7,
      }),
    });

    if (response.ok) {
      const data = await response.json();
      const reply = data?.choices?.[0]?.message?.content;
      if (reply) return reply.trim();
    }
  } catch {
    // Fallback nếu ngoại tuyến
  }

  // 3. Smart local knowledge rule-based fallback
  const lower = userMessage.toLowerCase();
  if (lower.includes('trạm') || lower.includes('ở đâu') || lower.includes('vị trí') || lower.includes('gần')) {
    return 'Dạ BoxifyX hiện có 27 trạm Smart Locker phủ khắp TP.HCM như Sân bay Tân Sơn Nhất, Ga Sài Gòn, các Ga Metro Tuyến 1, Bùi Viện, Landmark 81... Bạn có thể nhấn vào mục "Trạm tủ" trên thanh menu để định vị GPS trạm gần bạn nhất ạ!';
  }
  if (lower.includes('giá') || lower.includes('chi phí') || lower.includes('bao nhiêu')) {
    return 'Dạ biểu phí BoxifyX như sau ạ:\n• Smart Locker: Từ 15.000đ/2h đầu (giảm 20% khi thuê từ 6h).\n• Lưu kho Valet: 120.000đ/tháng (Thùng Standard) & 200.000đ/tháng (Kiện Quá Khổ), miễn phí 3km ship đầu tiên, bảo hiểm 20 triệu/kiện ạ.';
  }
  if (lower.includes('pin') || lower.includes('mở tủ') || lower.includes('quên')) {
    return 'Dạ bạn có thể kiểm tra mã PIN 6 số và mã QR trong mục "Đơn Của Tôi" trên web. Nếu đang ở trạm mà gặp sự cố, bạn gọi ngay Hotline 1900 6868 để nhân viên mở khóa từ xa trong 30 giây nhé!';
  }
  if (lower.includes('hotline') || lower.includes('liên hệ') || lower.includes('sdt') || lower.includes('zalo')) {
    return 'Dạ bạn có thể liên hệ BoxifyX qua:\n📞 Hotline 24/7: 1900 6868\n💬 Zalo OA: 0909 123 456\n📍 Kho trung tâm: 102 Hoàng Văn Thụ, Tân Bình, TP.HCM ạ!';
  }

  return 'Dạ cảm ơn bạn đã quan tâm! BoxifyX cung cấp Smart Locker theo giờ tại 27 trạm và Lưu kho Valet 25°C giao nhận tận nhà. Bạn cần hỗ trợ thêm thông tin gì hãy nhắn cho mình hoặc gọi Hotline 1900 6868 nhé!';
}
