/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_SITE_ORIGIN?: string;
  readonly VITE_RECAPTCHA_SITE_KEY?: string;
  readonly VITE_DEFAULT_VAT_RATE?: string;
  readonly VITE_APPLY_VAT_BY_DEFAULT?: string;
  readonly VITE_API_BASE_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
