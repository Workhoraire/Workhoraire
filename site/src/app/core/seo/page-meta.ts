export const SITE_NAME = 'WorkHoraire';

/** SEO data of a page, stored in the `data.page` property of its route. */
export interface PageMeta {
  /** Meta description, also used for Open Graph (about 150 characters). */
  description: string;
  /** `false` for pages that search engines must not index, such as the 404 page. */
  indexable?: boolean;
  ogType?: 'website' | 'article';
}
