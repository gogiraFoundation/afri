// API Client for Afri Cleans
import type { Service, Booking, BookingFormData, ContactRequest, ContactFormData, Promotion, VATConfig } from '../types/api';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorPayload: unknown = await response.json().catch(() => ({ detail: 'An error occurred' }));
    const detail =
      errorPayload &&
      typeof errorPayload === 'object' &&
      'detail' in errorPayload &&
      typeof (errorPayload as { detail: unknown }).detail === 'string'
        ? (errorPayload as { detail: string }).detail
        : undefined;
    const message =
      errorPayload &&
      typeof errorPayload === 'object' &&
      'message' in errorPayload &&
      typeof (errorPayload as { message: unknown }).message === 'string'
        ? (errorPayload as { message: string }).message
        : undefined;
    throw new Error(detail || message || `HTTP error! status: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

function extractList<T>(data: unknown): T[] {
  if (Array.isArray(data)) {
    return data as T[];
  }
  if (
    data &&
    typeof data === 'object' &&
    'results' in data &&
    Array.isArray((data as { results: unknown }).results)
  ) {
    return (data as { results: T[] }).results;
  }
  return [];
}

export async function getServices(): Promise<Service[]> {
  const data: unknown = await apiRequest<unknown>('/services/');
  return extractList<Service>(data);
}

export class ApiValidationError extends Error {
  readonly fields: Record<string, string>;

  constructor(message: string, fields: Record<string, string>) {
    super(message);
    this.name = 'ApiValidationError';
    this.fields = fields;
  }
}

function parseDrfFieldErrors(payload: unknown): Record<string, string> {
  const out: Record<string, string> = {};
  if (!payload || typeof payload !== 'object') return out;
  const obj = payload as Record<string, unknown>;
  for (const [key, val] of Object.entries(obj)) {
    if (key === 'detail' || key === 'message') continue;
    if (Array.isArray(val) && val.length > 0 && typeof val[0] === 'string') {
      out[key] = val[0];
    } else if (typeof val === 'string') {
      out[key] = val;
    }
  }
  return out;
}

export async function createBooking(data: BookingFormData): Promise<Booking> {
  const url = `${API_BASE_URL}/bookings/`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const body: unknown = await response.json().catch(() => ({}));

  if (!response.ok) {
    const fields = parseDrfFieldErrors(body);
    const detail =
      body &&
      typeof body === 'object' &&
      'detail' in body &&
      typeof (body as { detail: unknown }).detail === 'string'
        ? (body as { detail: string }).detail
        : undefined;
    const message =
      body &&
      typeof body === 'object' &&
      'message' in body &&
      typeof (body as { message: unknown }).message === 'string'
        ? (body as { message: string }).message
        : undefined;
    if (Object.keys(fields).length > 0) {
      throw new ApiValidationError(detail || message || 'Please check the highlighted fields.', fields);
    }
    throw new Error(detail || message || `HTTP error! status: ${response.status}`);
  }

  return body as Booking;
}

export async function createContactRequest(data: ContactFormData): Promise<ContactRequest> {
  return apiRequest<ContactRequest>('/contact-requests/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getActivePromotion(): Promise<Promotion | null> {
  try {
    const data = await apiRequest<Promotion | null>('/promotion/');
    if (data === null || data === undefined) {
      return null;
    }
    return data;
  } catch {
    // Network or server errors: treat like no promotion for banner UX
    return null;
  }
}

export async function getVATConfig(): Promise<VATConfig> {
  return apiRequest<VATConfig>('/vat-config/');
}

