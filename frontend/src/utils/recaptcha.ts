/**
 * Optional reCAPTCHA v3 for booking when VITE_RECAPTCHA_SITE_KEY is set
 * and the backend expects captcha_token (CONTACT_FORM_CAPTCHA_SECRET).
 */

declare global {
  interface Window {
    grecaptcha?: {
      ready: (cb: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

let loadPromise: Promise<void> | null = null;

function loadScript(siteKey: string): Promise<void> {
  if (loadPromise) return loadPromise;
  loadPromise = new Promise((resolve, reject) => {
    if (typeof document === 'undefined') {
      reject(new Error('No document'));
      return;
    }
    const existing = document.querySelector(`script[data-recaptcha-booking="1"]`);
    if (existing) {
      resolve();
      return;
    }
    const s = document.createElement('script');
    s.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
    s.async = true;
    s.defer = true;
    s.dataset.recaptchaBooking = '1';
    s.onload = () => resolve();
    s.onerror = () => reject(new Error('Failed to load reCAPTCHA'));
    document.head.appendChild(s);
  });
  return loadPromise;
}

export async function getBookingCaptchaToken(): Promise<string | undefined> {
  const siteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY as string | undefined;
  if (!siteKey || typeof window === 'undefined') return undefined;

  await loadScript(siteKey);
  const g = window.grecaptcha;
  if (!g?.execute) return undefined;

  return new Promise(resolve => {
    g.ready(() => {
      g.execute!(siteKey, { action: 'booking' })
        .then(token => resolve(token))
        .catch(() => resolve(undefined));
    });
  });
}
