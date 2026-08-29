/**
 * VietQR dynamic generator utility
 * Sử dụng chuẩn Napas 247 QuickPay QR code
 */
export function generateVietQrUrl({
  bankId = 'BIDV', // MBBank mặc định
  accountNo = '7302168136',
  template = 'compact2',
  amount,
  description,
  accountName = 'BOXIFYX TECH JSC'
}: {
  bankId?: string;
  accountNo?: string;
  template?: string;
  amount: number;
  description: string;
  accountName?: string;
}): string {
  const cleanDesc = encodeURIComponent(description.replace(/[^a-zA-Z0-9 ]/g, ''));
  const cleanName = encodeURIComponent(accountName);
  return `https://img.vietqr.io/image/${bankId}-${accountNo}-${template}.png?amount=${amount}&addInfo=${cleanDesc}&accountName=${cleanName}`;
}
