/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export const OFFICIAL_PUBLIC_URL = 'https://ais-pre-bn5t4fumf5n6rm2ju75esy-95443394070.europe-west1.run.app';

/**
 * Returns the public share URL without Google developer authentication protection.
 * If running on ais-dev-*, it converts to ais-pre-* so that recipients can access it immediately without credentials.
 */
export function getPublicShareUrl(): string {
  if (typeof window === 'undefined') return OFFICIAL_PUBLIC_URL;
  try {
    const origin = window.location.origin;
    if (origin.includes('ais-dev-')) {
      return origin.replace('ais-dev-', 'ais-pre-');
    }
    if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
      return OFFICIAL_PUBLIC_URL;
    }
    return origin || OFFICIAL_PUBLIC_URL;
  } catch {
    return OFFICIAL_PUBLIC_URL;
  }
}

export function getSharePayload(language: 'ar' | 'en' = 'ar') {
  const url = getPublicShareUrl();
  const title = language === 'ar' ? 'حسب قلب الله' : 'According to God\'s Heart';
  const subtitle =
    language === 'ar'
      ? 'منصة التكريس والعلوم الكنسية والتقييم الروحي — مفتوحة للمشاركة'
      : 'Consecration, Church Sciences & Spiritual Growth Platform — Open for all';
  const text = `${title} ✝️\n${subtitle}\n\nافتح الرابط المباشر بدون قيود:\n${url}`;

  return { title, text, url };
}

export async function copyPublicShareLink(language: 'ar' | 'en' = 'ar'): Promise<boolean> {
  const { url } = getSharePayload(language);
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(url);
      return true;
    }
  } catch {
    // fallback below
  }

  try {
    const input = document.createElement('input');
    input.value = url;
    document.body.appendChild(input);
    input.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(input);
    return successful;
  } catch {
    return false;
  }
}

export async function shareNatively(language: 'ar' | 'en' = 'ar'): Promise<boolean> {
  const { title, text, url } = getSharePayload(language);
  if (typeof navigator !== 'undefined' && navigator.share) {
    try {
      await navigator.share({ title, text, url });
      return true;
    } catch (err: unknown) {
      if ((err as Error)?.name === 'AbortError') return false;
    }
  }
  return await copyPublicShareLink(language);
}

export function openWhatsAppShare(language: 'ar' | 'en' = 'ar'): void {
  const { text } = getSharePayload(language);
  window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
}

export function openTelegramShare(language: 'ar' | 'en' = 'ar'): void {
  const { text, url } = getSharePayload(language);
  window.open(`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`, '_blank');
}

export function openFacebookShare(language: 'ar' | 'en' = 'ar'): void {
  const { url } = getSharePayload(language);
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
}
