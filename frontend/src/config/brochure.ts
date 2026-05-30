/** Copy and structured content for the standalone /brochure page */

export const BROCHURE_BRAND = 'Afri Cleans';

/** Marketing flier PNG in `frontend/public/` — used by “Download brochure”. */
export const BROCHURE_FLIER_HREF = '/africleans-flyer.png';
export const BROCHURE_FLIER_DOWNLOAD_NAME = 'Afri-Cleans-flyer.png';

export const brochureTrustItems = [
  'Fully insured',
  'Flexible bookings',
  'Eco-friendly products',
  'Trusted local service',
] as const;

export const brochureTrustLine = brochureTrustItems.join(' · ');

/** Residential (type-led block on minimal brochure) */
export const brochureServiceFeaturedResidential = {
  icon: '\u{1F3E0}',
  title: 'Residential cleaning',
  description:
    'Regular and one-off home cleaning tailored to your household and schedule.',
} as const;

/** First row in the right column (emphasised) */
export const brochureServiceFeaturedCommercial = {
  icon: '\u{1F3E2}',
  title: 'Commercial cleaning',
  description: 'Professional upkeep for offices and workspaces with minimal disruption.',
} as const;

export const brochureServiceSecondary = [
  {
    icon: '\u{2728}',
    title: 'Deep cleaning',
    line: 'Kitchens, bathrooms, living spaces, and high-touch areas.',
  },
  {
    icon: '\u{1FA9F}',
    title: 'Window cleaning',
    line: 'Interior and exterior glass where accessible.',
  },
  {
    icon: '\u{1F6C1}',
    title: 'Bathroom cleaning',
    line: 'Sanitised surfaces, fixtures, and grout lines.',
  },
  {
    icon: '\u{1F373}',
    title: 'Kitchen cleaning',
    line: 'Worktops, cabinets, and appliance exteriors.',
  },
  {
    icon: '\u{1F33F}',
    title: 'Eco-friendly cleaning',
    line: 'Family-friendly product options on request.',
  },
  {
    icon: '\u{1F9F1}',
    title: 'Post-construction cleaning',
    line: 'Dust and debris removal for handover-ready spaces.',
  },
] as const;

export type BrochureService = {
  icon: string;
  title: string;
  description: string;
};

export const brochureServices: readonly BrochureService[] = [
  { ...brochureServiceFeaturedResidential },
  { ...brochureServiceFeaturedCommercial },
  ...brochureServiceSecondary.map((s) => ({
    icon: s.icon,
    title: s.title,
    description: s.line,
  })),
];

export const brochureWhyItems = [
  {
    title: 'Reliable arrival times',
    body: 'We respect your schedule and communicate clearly before every visit.',
  },
  {
    title: 'Detail-focused cleaning',
    body: 'Consistent, careful work on kitchens, bathrooms, and high-traffic areas.',
  },
  {
    title: 'Flexible booking options',
    body: 'One-off, weekly, fortnightly, or custom schedules to suit your routine.',
  },
  {
    title: 'Safe & eco-conscious products',
    body: 'Effective cleaning with family-friendly options available when you prefer them.',
  },
] as const;

export const brochureProcessSteps = [
  {
    title: 'Request a quote',
    body: 'Tell us about your property and preferred schedule.',
  },
  {
    title: 'We confirm availability',
    body: 'We review your request and provide a clear estimate.',
  },
  {
    title: 'Enjoy a cleaner space',
    body: 'Our team arrives ready and fully equipped.',
  },
] as const;

export const brochureAbout = {
  heading: 'Cleaning designed around your schedule',
  paragraphs: [
    'Afri Cleans provides dependable residential and commercial cleaning with a focus on quality, punctuality, and clear communication.',
    'From one-off deep cleans to ongoing maintenance, we tailor every visit to your space, priorities, and routine.',
  ],
} as const;
