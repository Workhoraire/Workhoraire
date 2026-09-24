import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Routes, TitleStrategy, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { environment } from '../../../environments/environment';
import { routes } from '../../app.routes';
import { PageMeta } from './page-meta';
import { SHARE_IMAGE, SeoTitleStrategy, canonicalUrl } from './seo-title-strategy';

/** Routes prerendered to an HTML page of their own: all but the wildcard route. */
function prerenderedRoutes(all: Routes = routes): Routes {
  return all.filter((route) => route.path !== '**');
}

function pageOf(path: string | undefined): PageMeta | undefined {
  return routes.find((route) => route.path === path)?.data?.['page'] as PageMeta | undefined;
}

describe('SeoTitleStrategy', () => {
  let head: HTMLHeadElement;

  function content(selector: string): string | null {
    return head.querySelector(selector)?.getAttribute('content') ?? null;
  }

  function canonical(): string | null {
    return head.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? null;
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideRouter(routes), { provide: TitleStrategy, useClass: SeoTitleStrategy }],
    });
    head = TestBed.inject(DOCUMENT).head;
  });

  it('gives each page its title, description, Open Graph tags and canonical URL', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/tarifs');

    expect(TestBed.inject(DOCUMENT).title).toBe(
      'Tarifs : gratuit jusqu’à 3 utilisateurs · WorkHoraire',
    );
    expect(content('meta[name="description"]')).toContain(
      '3 € HT par utilisateur actif et par mois',
    );
    expect(content('meta[property="og:title"]')).toBe(TestBed.inject(DOCUMENT).title);
    expect(content('meta[property="og:description"]')).toBe(content('meta[name="description"]'));
    expect(content('meta[property="og:type"]')).toBe('website');
    expect(content('meta[property="og:url"]')).toBe(`${environment.siteUrl}/tarifs`);
    expect(canonical()).toBe(`${environment.siteUrl}/tarifs`);
    expect(head.querySelector('meta[name="robots"]')).toBeNull();

    await harness.navigateByUrl('/guides/heures-supplementaires');
    expect(content('meta[property="og:type"]')).toBe('article');
    expect(canonical()).toBe(`${environment.siteUrl}/guides/heures-supplementaires`);
  });

  it('gives every page a card for sharing', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/securite');

    expect(content('meta[property="og:image"]')).toBe(`${environment.siteUrl}/og-image.png`);
    expect(content('meta[property="og:image:width"]')).toBe('1200');
    expect(content('meta[property="og:image:height"]')).toBe('630');
    expect(content('meta[property="og:image:alt"]')).toBe(SHARE_IMAGE.alt);
    expect(content('meta[name="twitter:card"]')).toBe('summary_large_image');

    // The card exists and has the announced size.
    const image = await fetch('/og-image.png');
    expect(image.ok).withContext('public/og-image.png is served').toBeTrue();
    const bytes = new DataView(await image.arrayBuffer());
    expect([bytes.getUint32(16), bytes.getUint32(20)]).toEqual([1200, 630]);
  });

  it('keeps unknown pages out of search engines', async () => {
    const harness = await RouterTestingHarness.create();
    await harness.navigateByUrl('/tarifs');
    await harness.navigateByUrl('/page-qui-n-existe-pas');

    expect(TestBed.inject(DOCUMENT).title).toBe('Page introuvable · WorkHoraire');
    expect(content('meta[name="robots"]')).toBe('noindex');
    expect(canonical()).toBeNull();
    expect(head.querySelector('meta[property="og:url"]')).toBeNull();
  });

  it('builds canonical URLs without query string nor fragment', () => {
    expect(canonicalUrl('/')).toBe(`${environment.siteUrl}/`);
    expect(canonicalUrl('/tarifs?offre=essentiel#faq')).toBe(`${environment.siteUrl}/tarifs`);
  });

  it('has a short, unique title and a unique description for every page', () => {
    const pages = prerenderedRoutes();
    const titles = pages.map((route) => route.title as string);
    const descriptions = pages.map((route) => pageOf(route.path)?.description ?? '');

    for (const route of pages) {
      const page = pageOf(route.path);
      const title = route.title as string;
      expect(title)
        .withContext(`title of "/${route.path}"`)
        .toMatch(/WorkHoraire/);
      expect(title.length)
        .withContext(`title of "/${route.path}": ${title}`)
        .toBeLessThanOrEqual(60);
      expect(page?.description.length ?? 0)
        .withContext(`description of "/${route.path}"`)
        .toBeGreaterThan(40);
      expect(page?.description.length ?? 0)
        .withContext(`description of "/${route.path}"`)
        .toBeLessThanOrEqual(160);
    }
    expect(new Set(titles).size).withContext('unique titles').toBe(titles.length);
    expect(new Set(descriptions).size).withContext('unique descriptions').toBe(descriptions.length);
  });

  it('lists exactly the indexable prerendered pages in sitemap.xml', async () => {
    const indexable = prerenderedRoutes()
      .filter((route) => pageOf(route.path)?.indexable ?? true)
      .map((route) => canonicalUrl(`/${route.path}`));

    const sitemap = await (await fetch('/sitemap.xml')).text();
    const listed = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g), (match) => match[1]);

    expect([...listed].sort()).toEqual([...indexable].sort());
    expect(new Set(listed).size).withContext('no duplicate').toBe(listed.length);
  });
});
