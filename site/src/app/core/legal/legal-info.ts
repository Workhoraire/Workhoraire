import { InjectionToken } from '@angular/core';

import { formatFrenchDate } from '../text';
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
  /** "1 000 €": required for a company, null for a sole proprietorship. */
  shareCapital: string | null;
  /** Registered office. */
  address: string | null;
  /** "RCS Paris 123 456 789" (RCS followed by the city of the registry, R123-237), or the SIREN of a sole proprietorship. */
  registration: string | null;
  /** Intra-community VAT number: required without the VAT franchise, null under it. */
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

/**
 * Object storage of another provider that receives a copy of every encrypted
 * backup (BACKUP_OFFSITE of docker-compose.prod.yml), or null while the
 * backups stay at the host. Fill it before enabling BACKUP_OFFSITE: it is a
 * subprocessor, listed in the data processing agreement and the privacy policy.
 */
export interface OffsiteBackup {
  /** Provider, as named in its contract. */
  name: string;
  /** Country of the storage, or "Union européenne" with the country. */
  location: string;
}

export const PUBLISHER: Publisher = info.publisher;
export const HOSTING: Hosting = info.hosting;
export const OFFSITE_BACKUP: OffsiteBackup | null = info.offsiteBackup;

export interface LegalInfo {
  publisher: Publisher;
  hosting: Hosting;
  offsiteBackup: OffsiteBackup | null;
}

/** The content of legal-info.json, injected so that tests can provide other values. */
export const LEGAL_INFO = new InjectionToken<LegalInfo>('LEGAL_INFO', {
  providedIn: 'root',
  factory: () => ({ publisher: PUBLISHER, hosting: HOSTING, offsiteBackup: OFFSITE_BACKUP }),
});

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

/** Legal forms of a sole proprietorship, which has no share capital. */
const SOLE_PROPRIETORSHIP = /entrepreneur individuel|\bEIRL?\b|micro-entrepreneur/i;

/** A company publishes its share capital (LCEN, article 1-1, I, 2°); a sole proprietorship has none. */
export function requiresShareCapital(publisher: Publisher): boolean {
  return publisher.legalForm !== null && !SOLE_PROPRIETORSHIP.test(publisher.legalForm);
}

/**
 * Missing fields of the publisher's identity, including those that depend on
 * its situation: the share capital of a company, and the VAT number without
 * the VAT franchise (LCEN, article 19). scripts/set-urls.mjs applies the same
 * rules to refuse a production build.
 */
export function missingPublisherFields(publisher: Publisher = PUBLISHER): string[] {
  const missing: string[] = REQUIRED_PUBLISHER_FIELDS.filter((field) => publisher[field] === null);
  if (requiresShareCapital(publisher) && publisher.shareCapital === null) {
    missing.push('shareCapital');
  }
  if (publisher.vatExempt === false && publisher.vatNumber === null) {
    missing.push('vatNumber');
  }
  return missing;
}

/**
 * Version of the terms of sale and of the data processing agreement. The
 * application stores it with the acceptance of each company: change it with
 * backend/src/onboarding/terms.ts, and tell the customers 30 days in advance.
 */
export const TERMS_VERSION = '2026-09-24';
/** "24 septembre 2026", the date shown at the top of the legal pages. */
export const LEGAL_UPDATED_ON = formatFrenchDate(TERMS_VERSION);
