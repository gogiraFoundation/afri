import type { BookingFormData } from '../../types/api';

export type VisitIntent = 'deep_clean' | 'end_of_tenancy' | 'regular_clean' | 'office_clean' | 'other';

export type PropertyPill = 'Flat' | 'House' | 'Office' | 'Airbnb' | 'Commercial';

export type PropertySize = 'Studio' | '1 Bed' | '2 Bed' | '3 Bed' | '4+ Bed';

export type TimeWindowValue = 'Morning' | 'Afternoon' | 'Evening' | 'Flexible';

export type WizardStep = 1 | 2 | 3;

export interface WizardDetailState {
  visitIntent: VisitIntent | null;
  propertyPill: PropertyPill | null;
  propertySize: PropertySize | null;
  otherDescribe: string;
}

export function jobTypeFromPropertyPill(pill: PropertyPill): BookingFormData['job_type'] {
  switch (pill) {
    case 'Office':
      return 'office';
    case 'Commercial':
      return 'commercial';
    case 'Flat':
    case 'House':
    case 'Airbnb':
    default:
      return 'residential';
  }
}
