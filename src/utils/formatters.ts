import confetti from 'canvas-confetti';

export function formatCurrency(amountMinor: number, currency: string = 'INR'): string {
  const major = amountMinor / 100;

  switch (currency.toUpperCase()) {
    case 'INR': {
      // Indian numbering system format (Lakhs & Crores)
      const absVal = Math.abs(major);
      const sign = major < 0 ? '-' : '';
      const formatted = absVal.toLocaleString('en-IN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return `${sign}₹${formatted}`;
    }
    case 'SGD':
      return `S$ ${(major).toLocaleString('en-SG', { minimumFractionDigits: 2 })}`;
    case 'JPY':
      // JPY doesn't have sub-units in common usage
      return `¥${Math.round(major).toLocaleString('ja-JP')}`;
    case 'KRW':
      return `₩${Math.round(major).toLocaleString('ko-KR')}`;
    case 'HKD':
      return `HK$ ${(major).toLocaleString('zh-HK', { minimumFractionDigits: 2 })}`;
    case 'AUD':
      return `A$ ${(major).toLocaleString('en-AU', { minimumFractionDigits: 2 })}`;
    case 'IDR':
      return `Rp ${Math.round(major).toLocaleString('id-ID')}`;
    case 'THB':
      return `฿${(major).toLocaleString('th-TH', { minimumFractionDigits: 2 })}`;
    case 'VND':
      return `₫${Math.round(major).toLocaleString('vi-VN')}`;
    case 'USD':
    default:
      return `$ ${(major).toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  }
}

export function formatDate(dateStr: string | null | undefined, locale: string = 'en'): string {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function triggerConfetti() {
  try {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'],
    });
  } catch {
    // Graceful fallback if in environment without canvas
  }
}

export async function generateSealHash(payload: string): Promise<string> {
  try {
    const msgUint8 = new TextEncoder().encode(payload + Date.now().toString());
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    return 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
  }
}

/**
 * Safely encode a UTF-8 string to Base64 without Latin1 range errors in btoa
 */
export function encodeUtf8ToBase64(str: string): string {
  try {
    const bytes = new TextEncoder().encode(str);
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  } catch {
    return btoa(unescape(encodeURIComponent(str)));
  }
}

/**
 * Safely decode a Base64 string back to UTF-8
 */
export function decodeBase64ToUtf8(b64: string): string {
  try {
    const binary = atob(b64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
  } catch {
    try {
      return decodeURIComponent(escape(atob(b64)));
    } catch {
      return '';
    }
  }
}

