import type { VisitIntent } from './types';

export interface ServiceCardOption {
  id: VisitIntent;
  title: string;
  description: string;
  icon: 'sparkle' | 'key' | 'repeat' | 'building' | 'dots';
}

export const SERVICE_CARD_OPTIONS: ServiceCardOption[] = [
  {
    id: 'deep_clean',
    title: 'Deep clean',
    description: 'A thorough reset for kitchens, bathrooms, and living spaces.',
    icon: 'sparkle',
  },
  {
    id: 'end_of_tenancy',
    title: 'End of tenancy',
    description: 'Handover-ready finish — ideal before inspection.',
    icon: 'key',
  },
  {
    id: 'regular_clean',
    title: 'Regular clean',
    description: 'Recurring visits to keep your home consistently fresh.',
    icon: 'repeat',
  },
  {
    id: 'office_clean',
    title: 'Office clean',
    description: 'Desks, meeting rooms, kitchens, and washrooms.',
    icon: 'building',
  },
  {
    id: 'other',
    title: 'Other',
    description: 'Tell us briefly — we will tailor the visit.',
    icon: 'dots',
  },
];
