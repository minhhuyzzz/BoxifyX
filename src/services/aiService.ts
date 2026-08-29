/**
 * Service kết nối AI thời gian thực cho BoxifyX
 * Hỗ trợ Google Gemini API, OpenAI API và Bộ xử lý ngôn ngữ tự nhiên chuyên sâu BoxifyX
 */

export const BOXIFYX_SYSTEM_PROMPT = `
Bạn là Trợ Lý AI Chuyên Nghiệp của BoxifyX - Nền Tảng Lưu Trữ Kỹ Thuật Số & Smart Locker Hàng Đầu TP.HCM.

THÔNG TIN DỊCH VỤ THỰC TẾ CỦA BOXIFYX:
1. MẠNG LƯỚI SMART LOCKER (THEO GIỜ):
   - Có 27 trạm tủ IOT thông minh phủ khắp TP.HCM (Sân bay Tân Sơn Nhất Ga Quốc Tế & Quốc Nội, Ga Sài Gòn, các Ga Metro Tuyến 1 Bến Thành - Suối Tiên, Bùi Viện, Landmark 81, Bitexco, Crescent Mall, Vạn Hạnh Mall, Gigamall, Làng Đại Học ĐHQG...).
   - Biểu phí chuẩn: 
     • Size S (30x40x50cm - Balo, túi xách): 15.000đ/2h đầu, 5.000đ/h tiếp theo.
     • Size M (45x50x60cm - Vali xách tay 20 inch): 25.000đ/2h đầu, 8.000đ/h tiếp theo.
     • Size L (60x60x85cm - Vali ký gửi 28 inch): 40.000đ/2h đầu, 12.000đ/h tiếp theo.
   - Ưu đãi: Giảm ngay 20% khi đặt thuê từ 6 tiếng trở lên.
   - Cách sử dụng: Đặt trên web -> Nhận mã PIN 6 số & mã QR -> Đến trạm nhập mã trên màn hình cảm ứng Kiosk là tủ tự mở 1-chạm.

2. DỊCH VỤ VALET STORAGE (THEO THÁNG):
   - Lưu kho tập trung tại Kho Máy Lạnh Tân Bình (Nhiệt độ phòng mát 25°C, độ ẩm kiểm soát <50% chống ẩm mốc, camera AI 24/7).
   - Biểu phí:
     • Thùng Tiêu Chuẩn (60x40x40cm): 120.000đ/tháng
     • Kiện Quá Khổ / Pallet: 200.000đ/tháng
   - Phí vận chuyển: Miễn phí 3km đầu tiên, chỉ 5.000đ/km tiếp theo. Shipper mang thùng rỗng đến tận nhà và lấy thùng niêm phong mang về kho.
   - Bảo hiểm tài sản: Mặc định lên đến 20.000.000 VNĐ/kiện có mã Chốt Seal niêm phong chống mở trộm.

3. TỦ ĐỒ KỸ THUẬT SỐ (DIGITAL CLOSET):
   - Xem hình ảnh đồ đạc trong kho, quản lý mã seal, kiểm tra nhiệt độ kho và bấm 1-chạm "Giao Trả" để shipper ship đồ về tận nhà.

4. THÔNG TIN LIÊN HỆ & CỨU HỘ:
   - Hotline khẩn cấp 24/7: 0777 868 762 (hoặc 1900 6868)
   - Zalo Hỗ Trợ: 0777 868 762
   - Địa chỉ kho trung tâm: 102 Hoàng Văn Thụ, Phường 2, Tân Bình, TP.HCM

QUY TẮC PHẢN HỒI:
- Luôn xưng hô thân thiện, lịch sự: "BoxifyX xin chào bạn", "Dạ...", "Mình...".
- Trả lời súc tích, định dạng markdown đẹp mắt, gạch đầu dòng rõ ràng bằng Tiếng Việt.
`;

export interface ChatMessageParam {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function askBoxifyAI(userMessage: string, history: ChatMessageParam[] = []): Promise<string> {
  const geminiApiKey =
    import.meta.env.VITE_GEMINI_API_KEY ||
    (typeof window !== 'undefined' ? localStorage.getItem('boxifyx_gemini_api_key') : null);

  const openaiApiKey =
    import.meta.env.VITE_OPENAI_API_KEY ||
    (typeof window !== 'undefined' ? localStorage.getItem('boxifyx_openai_api_key') : null);

  // 1. Thử gọi Google Gemini 1.5 Flash API nếu có Key
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
                parts: [
                  {
                    text: `${BOXIFYX_SYSTEM_PROMPT}\n\nLịch sử hội thoại gần nhất:\n${history.map((h) => `${h.role}: ${h.content}`).join('\n')}\n\nTin nhắn người dùng: ${userMessage}`,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 600,
            },
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (replyText) return replyText.trim();
      }
    } catch (e) {
      console.warn('Gemini API call failed, switching to backup processor:', e);
    }
  }

  // 2. Thử gọi OpenAI API nếu có Key
  if (openaiApiKey) {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${openaiApiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: BOXIFYX_SYSTEM_PROMPT },
            ...history.slice(-4),
            { role: 'user', content: userMessage },
          ],
          temperature: 0.7,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const reply = data?.choices?.[0]?.message?.content;
        if (reply) return reply.trim();
      }
    } catch (e) {
      console.warn('OpenAI API call failed:', e);
    }
  }

  // 3. Bộ xử lý Ngôn Ngữ Tự Nhiên & Chuyên Gia BoxifyX (Intelligent Semantic Engine)
  const q = userMessage.toLowerCase().trim();

  // Nhóm 1: Chào hỏi & giới thiệu
  if (q.includes('xin chào') || q.includes('hello') || q.includes('hi') || q === 'chào' || q.includes('là ai') || q.includes('giới thiệu')) {
    return `👋 **BoxifyX xin chào bạn!**\n\nBoxifyX là nền tảng lưu trữ cá nhân thông minh hàng đầu TP.HCM với 2 dịch vụ cốt lõi:\n1. ⚡ **Smart Locker theo giờ**: Gửi vali, balo tại 27 trạm Kiosk (Sân bay TSN, Ga Sài Gòn, Ga Metro, Bùi Viện...) với mã PIN/QR mở tủ tức thì.\n2. 🚚 **Lưu kho Valet theo tháng**: Kho máy lạnh 25°C Tân Bình, shipper giao nhận thùng tận cửa nhà, bảo hiểm 20 triệu/kiện.\n\nBạn cần mình hỗ trợ tìm trạm gần nhất hay báo giá dịch vụ nào ạ?`;
  }

  // Nhóm 2: Vị trí trạm tủ & tìm trạm gần nhất
  if (q.includes('trạm') || q.includes('ở đâu') || q.includes('vị trí') || q.includes('gần') || q.includes('sân bay') || q.includes('metro') || q.includes('quận') || q.includes('bùi viện')) {
    return `📍 **Mạng lưới 27 Trạm Smart Locker BoxifyX tại TP.HCM:**\n\n• **Sân Bay Tân Sơn Nhất**: 2 trạm (Ga Quốc Tế Cửa D2 & Ga Quốc Nội Cột 10).\n• **Ga Xe Lửa Sài Gòn**: 01 Nguyễn Thông, P.9, Quận 3.\n• **Tuyến Metro Số 1**: Ga Bến Thành, Ga Nhà Hát TP, Ga Ba Son, Ga Tân Cảng, Ga Thảo Điền, Ga An Phú.\n• **Trung tâm Quận 1 & Quận 3**: Phố đi bộ Bùi Viện, Hồ Con Rùa Hub, Diamond Plaza, Bitexco Financial Tower.\n• **Các TTTM lớn**: Landmark 81, Crescent Mall (Q.7), Vạn Hạnh Mall (Q.10), Gigamall (Thủ Đức).\n• **Khu vực khác**: Gò Vấp, Bình Thạnh, Phú Nhuận, Tân Bình, Làng Đại Học ĐHQG, QTSC Quận 12.\n\n👉 Bạn hãy nhấn nút **"Trạm tủ"** trên thanh menu để hệ thống tự động định vị GPS trạm gần bạn nhất nhé!`;
  }

  // Nhóm 3: Biểu phí & giá cả
  if (q.includes('giá') || q.includes('bao nhiêu') || q.includes('bảng giá') || q.includes('chi phí') || q.includes('tiền') || q.includes('phí ship')) {
    return `💰 **Biểu Phí Dịch Vụ BoxifyX Minh Bạch & Tiết Kiệm:**\n\n**1. Thuê Smart Locker (Theo giờ):**\n• **Size S** (Balo, túi xách): 15.000đ / 2h đầu (thêm 5.000đ/h tiếp theo)\n• **Size M** (Vali cabin 20 inch): 25.000đ / 2h đầu (thêm 8.000đ/h tiếp theo)\n• **Size L** (Vali lớn 28 inch): 40.000đ / 2h đầu (thêm 12.000đ/h tiếp theo)\n🎁 *Ưu đãi: Giảm ngay 20% khi thuê từ 6 tiếng trở lên!*\n\n**2. Lưu Kho Valet Storage (Theo tháng - Kho 25°C):**\n• **Thùng Standard** (60x40x40cm): 120.000đ / tháng\n• **Kiện Quá Khổ / Pallet**: 200.000đ / tháng\n• **Phí Shipper**: Miễn phí 3km đầu, chỉ 5.000đ/km tiếp theo.\n• **Bảo hiểm**: 20.000.000 VNĐ / kiện có chốt Seal niêm phong.`;
  }

  // Nhóm 4: Quên mã PIN, mở tủ, sự cố
  if (q.includes('pin') || q.includes('mở tủ') || q.includes('quên') || q.includes('kẹt') || q.includes('mã') || q.includes('qr') || q.includes('sự cố')) {
    return `🔑 **Hướng Dẫn Mở Tủ & Khôi Phục Mã PIN Nhanh Chóng:**\n\n1. **Xem lại mã PIN**: Đăng nhập web và nhấn vào biểu tượng **"Đơn Của Tôi"** (góc trên màn hình) để xem Mã PIN 6 số và Mã QR của bạn.\n2. **Thao tác tại trạm**: Chạm vào màn hình Kiosk -> Nhập mã PIN 6 số hoặc đưa mã QR vào máy quét -> Cửa tủ sẽ tự động bật mở.\n3. **Cứu hộ khẩn cấp từ xa**: Nếu bị kẹt tủ hoặc quên hoàn toàn thông tin, bạn hãy gọi ngay Hotline **0777 868 762** (hoặc 1900 6868), tổng đài viên sẽ xác minh số điện thoại và mở khóa tủ từ xa trong 30 giây!`;
  }

  // Nhóm 5: Lưu kho Valet & Tủ đồ số hóa
  if (q.includes('valet') || q.includes('tủ đồ') || q.includes('giao trả') || q.includes('lưu kho') || q.includes('gửi thùng') || q.includes('bảo quản')) {
    return `📦 **Quy Trình Lưu Kho Valet & Tủ Đồ Số Hóa:**\n\n1. **Đặt đơn**: Chọn số lượng thùng trên web và hẹn giờ nhận thùng rỗng.\n2. **Giao nhận**: Shipper giao thùng tận nhà -> Bạn xếp đồ và bấm Chốt Seal chống trộm -> Shipper mang về Kho Mát 25°C Tân Bình.\n3. **Số hóa (Digital Closet)**: Hình ảnh đồ đạc, mã seal và nhiệt độ kho được cập nhật trực tiếp trên mục "Tủ Đồ".\n4. **Giao trả tận nơi**: Khi cần dùng, chỉ cần bấm **"Yêu Cầu Giao Trả"**, shipper sẽ mang thùng về tận cửa trong vòng 2–4 tiếng.`;
  }

  // Nhóm 6: An toàn, bảo hiểm, phòng cháy, cấm gửi
  if (q.includes('bảo hiểm') || q.includes('an toàn') || q.includes('mất') || q.includes('hư') || q.includes('cấm') || q.includes('cháy')) {
    return `🛡️ **Cam Kết An Ninh & Bảo Hiểm BoxifyX:**\n\n• **Bảo hiểm vật chất**: Gói bảo hiểm lên đến **20.000.000 VNĐ / kiện hàng** bảo vệ trước mọi rủi ro.\n• **Chốt Seal Niêm Phong**: Mỗi thùng được cấp mã Seal có số sê-ri độc quyền, chống mở trộm 100%.\n• **Kiểm soát nhiệt ẩm**: Phòng máy lạnh liên tục 25°C, độ ẩm <50% ngăn ngừa ẩm mốc đồ da, len dạ, sách báo, thiết bị điện tử.\n• **Quy định cấm gửi**: Không gửi chất dễ cháy nổ, vũ khí, tiền mặt, kim loại quý và thực phẩm tươi sống dễ ôi thiu.`;
  }

  // Nhóm 7: Thông tin liên hệ, hotline, zalo, địa chỉ
  if (q.includes('liên hệ') || q.includes('sdt') || q.includes('số điện thoại') || q.includes('hotline') || q.includes('zalo') || q.includes('địa chỉ') || q.includes('tổng đài')) {
    return `📞 **Thông Tin Liên Hệ Chính Thức BoxifyX:**\n\n• **Hotline Hỗ Trợ 24/7**: **0777 868 762**\n• **Zalo OA**: **0777 868 762** (Tư vấn trực tiếp)\n• **Email**: contact@boxifyx.vn\n• **Kho Trung Tâm**: 102 Hoàng Văn Thụ, Phường 2, Quận Tân Bình, TP.HCM\n• **Giờ làm việc**: Phục vụ 24/7 tất cả các ngày trong tuần (kể cả lễ tết).`;
  }

  // Mặc định phản hồi thân thiện
  return `Dạ BoxifyX đã nhận được câu hỏi: *"${userMessage}"*.\n\nBoxifyX cung cấp giải pháp **Smart Locker theo giờ tại 27 trạm** và **Lưu kho Valet 25°C giao nhận tận nhà**. Bạn có thể cho mình biết cụ thể nhu cầu lưu trữ của bạn (ví dụ: cần gửi vali bao lâu, hay cần lưu thùng đồ mấy tháng) để mình tư vấn gói tối ưu nhất nhé! Hoặc bạn có thể gọi nhanh qua Hotline **0777 868 762** để được hỗ trợ tức thì ạ.`;
}
