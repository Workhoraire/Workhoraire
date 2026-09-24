import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { TitleStrategy, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';

import { environment } from '../../../environments/environment';
import { routes } from '../../app.routes';
import { PageMeta } from './page-meta';
import { SeoTitleStrategy, canonicalUrl } from './seo-title-strategy';

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

    expect(TestBed.inject(DOCUMENT).title).toBe('Tarifs : gratuit jusqu’à 3 salariés · WorkHoraire');
    expect(content('meta[name="description"]')).toContain('3 € HT par salarié actif et par mois');
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

  it('has a title and a description for every indexable page', () => {
    const pages = routes.filter((route) => route.path !== '**' && route.path !== '404');

    for (const route of pages) {
      const page = route.data?.['page'] as PageMeta | undefined;
      expect(route.title).withContext(`title of "/${route.path}"`).toMatch(/WorkHoraire/);
      expect(page?.description.length ?? 0)
        .withContext(`description of "/${route.path}"`)
        .toBeGreaterThan(50);
      expect(page?.description.length ?? 0)
        .withContext(`description of "/${route.path}"`)
        .toBeLessThanOrEqual(160);
      expect(page?.indexable ?? true).withContext(`"/${route.path}" is indexable`).toBeTrue();
    }
  });
});
