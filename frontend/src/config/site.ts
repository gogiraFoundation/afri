/** Shared marketing / contact copy — single source of truth for header, footer, promo bar */
export const SITE_BRAND = 'Afri Cleans';

export const SITE_TAGLINE = 'Eco-conscious cleaning';

export { default as logoSrc } from '../assets/logo-transparent.png';

export const PHONE_DISPLAY = '07412 345678';

export const TEL_HREF = 'tel:+447412345678';

export const WHATSAPP_HREF =
  'https://wa.me/447412345678?text=Hi%20Afri%20Cleans%2C%20I%27d%20like%20a%20quote.';

export const EMAIL_DISPLAY = 'info@africleans.com';

export const MAILTO_HREF = 'mailto:info@africleans.com';

/** Home-page contact section anchor (marketing mode). */
export const CONTACT_SECTION_ID = 'contact';

export const CONTACT_HASH_HREF = '/#contact';

/** Client-side short path for QR and share links; nginx `try_files` serves `index.html` for SPA. */
export const BOOKING_PATH = '/book';

/** Redirect target for `/book` short links (legacy QR codes). */
export const BOOKING_HASH_HREF = CONTACT_HASH_HREF;

export function scrollToContact(): void {
  const element = document.getElementById(CONTACT_SECTION_ID);
  if (!element) return;
  const prefersReduced =
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  element.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth' });
}

/** WhatsApp deep link for print QR codes (opens chat for a quote). */
export function quoteQrUrl(): string {
  return WHATSAPP_HREF;
}

/**
 * Absolute `https://…/book` URL for QR codes and PDF links.
 * Set `VITE_PUBLIC_SITE_ORIGIN` in production (e.g. `https://africleans.com`) so QR works before go-live on that host.
 */
export function bookingPageAbsoluteUrl(): string {
  const envOrigin =
    typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_PUBLIC_SITE_ORIGIN
      ? String(import.meta.env.VITE_PUBLIC_SITE_ORIGIN).replace(/\/$/, '')
      : '';
  if (envOrigin) {
    return `${envOrigin}${BOOKING_PATH}`;
  }
  if (typeof window !== 'undefined' && window.location?.origin) {
    return `${window.location.origin.replace(/\/$/, '')}${BOOKING_PATH}`;
  }
  return `https://africleans.com${BOOKING_PATH}`;
}

/** Human-readable booking URL line (e.g. for print). */
export function bookingPageDisplayPath(): string {
  try {
    const u = new URL(bookingPageAbsoluteUrl());
    return `${u.hostname}${BOOKING_PATH}`;
  } catch {
    return `africleans.com${BOOKING_PATH}`;
  }
}
