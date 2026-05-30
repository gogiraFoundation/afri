// API Types for Afri Cleans

export interface Service {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  long_description: string;
  is_active: boolean;
  display_order: number;
  price_from?: number;
}

export interface VATConfig {
  default_vat_rate: number;
  vat_rate_percent: number;
  apply_vat_by_default: boolean;
  currency: 'GBP';
  prices_include_vat: boolean;
}

export interface Booking {
  id?: number;
  name: string;
  email: string;
  phone: string;
  service: number;
  job_type: 'residential' | 'commercial' | 'office' | 'hourly';
  billing_type: 'fixed' | 'hourly';
  preferred_date: string;
  preferred_time_window: string;
  address: string;
  notes?: string;
  estimated_hours?: number | null;
  estimated_price?: number | null;
  promo_code?: string;
  promo_discount?: number | null;
  subtotal?: number | null;
  vat_amount?: number | null;
  total_with_vat?: number | null;
  vat_config?: VATConfig;
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at?: string;
}

export interface Promotion {
  id: number;
  title: string;
  subtitle?: string;
  badge_text?: string;
  discount_percentage: number;
  promo_code: string;
  is_active: boolean;
  is_currently_active: boolean;
  start_date?: string;
  end_date?: string;
  created_at?: string;
}

export interface ContactRequest {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  created_at?: string;
  handled?: boolean;
}

export interface BookingFormData {
  name: string;
  email: string;
  phone: string;
  service: number;
  job_type: 'residential' | 'commercial' | 'office' | 'hourly';
  billing_type: 'fixed' | 'hourly';
  preferred_date: string;
  preferred_time_window: string;
  address: string;
  notes?: string;
  estimated_hours?: number | null;
  promo_code?: string;
  promo_discount?: number | null;
  honeypot?: string;
  /** When backend enforces reCAPTCHA (CONTACT_FORM_CAPTCHA_SECRET). */
  captcha_token?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
  honeypot?: string;
}

