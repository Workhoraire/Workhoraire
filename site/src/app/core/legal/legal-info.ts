import info from './legal-info.json';

/**
 * Identity of the publisher of WorkHoraire, shown in the legal notice, the
 * privacy policy, the terms of sale and the data processing agreement.
 *
 * The company is not created yet (docs/produit/08-prix-et-hebergement.md, §4):
 * fill every `null` of legal-info.json before going live. A production build
 * refuses to run while a required field is missing (scripts/set-urls.mjs).
 */
export interface Publisher {
  /** Company name, or the entrepreneur's name for a sole proprietorship. */
  name: string | null;
  /** "SAS", "SASU", or "Entrepreneur individuel (EI)", the mention required for a sole proprietorship (R123-237, 9°). */
  legalForm: string | null;
  /** "1 000 €": companies only, null for a sole proprietorship. */
  shareCapital: string | null;
  /** Registered office. */
  address: string | null;
  /** "RCS Paris 123 456 789" (RCS followed by the city of the registry, R123-237), or the SIREN of a sole proprietorship. */
  registration: string | null;
  /** Intra-community VAT number; null under the VAT franchise ("franchise en base"). */
  vatNumber: string | null;
  /** true under the VAT franchise: prices and invoices carry no VAT (CGI, art. 293 B). */
  vatExempt: boolean | null;
  /** Contact address, also used for personal data requests. */
  email: string | null;
  phone: string | null;
  publicationDirector: string | null;
}

export interface Hosting {
  name: string;
  address: string | null;
  phone: string | null;
  website: string;
}

export const PUBLISHER: Publisher = info.publisher;
export const HOSTING: Hosting = info.hosting;

/** Fields that the legal notice cannot do without (LCEN, articles 1-1 and 19; Code de commerce, R123-237). */
export const REQUIRED_PUBLISHER_FIELDS = [
  'name',
  'legalForm',
  'address',
  'registration',
  'vatExempt',
  'email',
  'phone',
  'publicationDirector',
] as const satisfies readonly (keyof Publisher)[];

export function missingPublisherFields(publisher: Publisher = PUBLISHER): string[] {
  return REQUIRED_PUBLISHER_FIELDS.filter((field) => publisher[field] === null);
}

/**
 * Version of the terms of sale and of the data processing agreement. The
 * application stores it with the acceptance of each company: change it with
 * backend/src/onboarding/terms.ts, and tell the customers 30 days in advance.
 */
export const TERMS_VERSION = '2026-09-24';
export const LEGAL_UPDATED_ON = '24 septembre 2026';

/** Subprocessors of the data of the application (article 28 of the GDPR). */
export interface Subprocessor {
  name: string;
  purpose: string;
  location: string;
  data: string;
}
