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
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  seo_title?: string;
  seo_description?: string;
  is_published: boolean;
  published_at?: string;
  created_at?: string;
  updated_at?: string;
}

