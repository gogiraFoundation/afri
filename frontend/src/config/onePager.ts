import {
  EMAIL_DISPLAY,
  PHONE_DISPLAY,
  TEL_HREF,
  WHATSAPP_HREF,
  MAILTO_HREF,
} from './site';

/** Brand lockup on the print one-pager (matches Eco-Clean messaging sitewide). */
export const ONE_PAGER_BRAND = 'Afri Eco-Clean';

export const onePagerTaglines = [
  'DBS-checked. Plant-based. Insured.',
  'Message us for a quote.',
] as const;

export const onePagerServiceCards = [
  {
    icon: '🏠',
    title: 'Regular Cleans',
    lines: ['Weekly/fortnightly', 'upkeep.'],
    priceLabel: 'From £28',
  },
  {
    icon: '✨',
    title: 'Deep Cleans',
    lines: ['One-off', 'thorough refresh.'],
    priceLabel: 'From £110',
  },
  {
    icon: '🔑',
    title: 'Move-Out',
    lines: ['Landlord-approved', 'inventory ready.'],
    priceLabel: 'From £130',
  },
] as const;

export const onePagerEcoBanner =
  '🌱 We bring our own plant-based products – never bleach, child & pet safe.';

export const onePagerPricingTitle = 'Transparent Pricing – All Prices Include VAT';

/** Home-size matrix; residential hourly anchor lives in `hourlyNote` (single source with PDF). */
export const onePagerPricingColumns = [
  { key: 'home', label: 'Home Size' },
  { key: 'regular', label: 'Weekly/Fortn.' },
  { key: 'deep', label: 'One-Off Deep' },
  { key: 'move', label: 'Move-Out' },
] as const;

export const onePagerPricingRows: ReadonlyArray<{
  home: string;
  regular: string;
  deep: string;
  move: string;
}> = [
  { home: 'Studio', regular: '£28', deep: '£110', move: '£130' },
  { home: '1 Bed / 1 Bath', regular: '£34', deep: '£140', move: '£170' },
  { home: '2 Bed / 1 Bath', regular: '£48', deep: '£190', move: '£230' },
  { home: '3 Bed / 2 Bath', regular: '£64', deep: '£260', move: '£310' },
];

export const onePagerExtrasLine =
  'Extras (per item): Oven +£16 | Fridge +£14 | Windows +£12';

export const onePagerSubscriptionBar =
  '🌟 Weekly/Fortnightly subscribers save 10% automatically on every clean.';

/** Aligns matrix with stated residential hourly floor (marketing). */
export const onePagerHourlyNote =
  'Residential cleaning from £20/hour (incl. VAT) — typical bundles in the table above.';

export const onePagerTestimonials = [
  {
    quote: 'The inventory clerk said it was the best he\'d seen.',
    author: '– Sarah T.',
  },
  {
    quote: 'Finally a cleaner that uses proper eco products. My cat is safe!',
    author: '– James L.',
  },
] as const;

export const onePagerGuarantee = {
  title: 'Our 24-Hour Re-Clean Guarantee',
  body: "If you're not delighted, we return free.",
};

export const onePagerTrustFooter = 'DBS | Insured | Plant-Based';

export const onePagerContact = {
  phoneDisplay: PHONE_DISPLAY,
  telHref: TEL_HREF,
  whatsappHref: WHATSAPP_HREF,
  emailDisplay: EMAIL_DISPLAY,
  mailtoHref: MAILTO_HREF,
};
