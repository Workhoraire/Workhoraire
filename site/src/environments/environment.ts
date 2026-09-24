/**
 * Public configuration of the marketing site (no secret here: it ships in the browser bundle).
 *
 * - `appUrl`: the WorkHoraire application, target of the sign-in and sign-up links.
 * - `siteUrl`: public address of this site, used for canonical URLs and Open Graph.
 *   `public/robots.txt` and `public/sitemap.xml` repeat it and must be updated with it.
 */
export const environment = {
  appUrl: 'http://localhost:4200',
  siteUrl: 'http://localhost:4400',
} as const;
