import type { Service } from '../../types/api';
import type { VisitIntent, PropertyPill, PropertySize } from './types';
import { jobTypeFromPropertyPill } from './types';

const SLUG_DEEP = 'deep-clean-end-of-tenancy';
const SLUG_OFFICE = 'office-cleaning';

export function serviceIdForVisitIntent(services: Service[], intent: VisitIntent): number {
  const id = (slug: string) => services.find(s => s.slug === slug)?.id ?? 0;
  switch (intent) {
    case 'deep_clean':
    case 'end_of_tenancy': {
      const v = id(SLUG_DEEP);
      return v || services[0]?.id || 0;
    }
    case 'regular_clean':
    case 'other': {
      const v = id('residential-cleaning');
      return v || services[0]?.id || 0;
    }
    case 'office_clean': {
      const v = id(SLUG_OFFICE);
      return v || id('residential-cleaning') || services[0]?.id || 0;
    }
    default:
      return services[0]?.id || 0;
  }
}

export function visitTypeNoteLine(intent: VisitIntent, otherDescribe: string): string {
  switch (intent) {
    case 'deep_clean':
      return 'Visit type: Deep clean';
    case 'end_of_tenancy':
      return 'Visit type: End of tenancy';
    case 'regular_clean':
      return 'Visit type: Regular clean';
    case 'office_clean':
      return 'Visit type: Office clean';
    case 'other': {
      const extra = otherDescribe.trim();
      return extra ? `Visit type: Other — ${extra}` : 'Visit type: Other';
    }
    default:
      return '';
  }
}

export interface StructuredNotesInput {
  propertyPill: PropertyPill;
  propertySize: PropertySize;
  jobType: ReturnType<typeof jobTypeFromPropertyPill>;
  visitLine: string;
}

export function buildStructuredNotesPrefix(input: StructuredNotesInput): string {
  const lines = [
    `Property: ${input.propertyPill} (${input.jobType})`,
    `Property size: ${input.propertySize}`,
    input.visitLine,
  ].filter(Boolean);
  return lines.join('\n');
}

export function combineNotesForSubmit(prefix: string, userNotes: string): string {
  const u = userNotes.trim();
  if (!u) return prefix;
  return `${prefix}\n\n${u}`;
}
