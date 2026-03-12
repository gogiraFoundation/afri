// API Client for Afri Cleans
import type { Service, Booking, BookingFormData, ContactRequest, ContactFormData, Promotion, BlogPost } from '../types/api';

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
    const error = await response.json().catch(() => ({ detail: 'An error occurred' }));
    throw new Error(error.detail || error.message || `HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function getServices(): Promise<Service[]> {
  const data = await apiRequest<any>('/services/');

  // Handle both plain list and DRF paginated response
  if (Array.isArray(data)) {
    return data as Service[];
  }

  if (data && Array.isArray(data.results)) {
    return data.results as Service[];
  }

  return [];
}

export async function createBooking(data: BookingFormData): Promise<Booking> {
  return apiRequest<Booking>('/bookings/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function createContactRequest(data: ContactFormData): Promise<ContactRequest> {
  return apiRequest<ContactRequest>('/contact-requests/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function getActivePromotion(): Promise<Promotion | null> {
  try {
    return await apiRequest<Promotion>('/promotion/');
  } catch (error) {
    // Return null if no active promotion
    return null;
  }
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const data = await apiRequest<any>('/blog-posts/');

  if (Array.isArray(data)) {
    return data as BlogPost[];
  }

  if (data && Array.isArray(data.results)) {
    return data.results as BlogPost[];
  }

  return [];
}

export async function getBlogPost(slug: string): Promise<BlogPost> {
  return apiRequest<BlogPost>(`/blog-posts/${slug}/`);
}

