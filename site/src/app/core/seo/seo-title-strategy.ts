import { DOCUMENT, Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, RouterStateSnapshot, TitleStrategy } from '@angular/router';

import { environment } from '../../../environments/environment';
import { PageMeta, SITE_NAME } from './page-meta';

const SITE_URL = environment.siteUrl.replace(/\/+$/, '');

/** Absolute URL of a router URL, without query string nor fragment. */
export function canonicalUrl(routerUrl: string): string {
  const path = routerUrl.split(/[?#]/)[0] || '/';
  return `${SITE_URL}${path}`;
}

function deepestChild(route: ActivatedRouteSnapshot): ActivatedRouteSnapshot {
  let current = route;
  while (current.firstChild) {
    current = current.firstChild;
  }
  return current;
}

/**
 * Sets the title, the meta description, the Open Graph tags and the canonical link of each page
 * from its route (`title` and `data.page`). It runs during prerendering, so that every static
 * HTML file carries its own metadata, and again in the browser after each navigation.
 */
@Injectable()
export class SeoTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);
  private readonly document = inject(DOCUMENT);

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot) ?? SITE_NAME;
    const page = deepestChild(snapshot.root).data['page'] as PageMeta | undefined;
    const description = page?.description ?? '';
    const indexable = page?.indexable ?? true;
    const url = canonicalUrl(snapshot.url);

    this.title.setTitle(title);
    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: title });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: page?.ogType ?? 'website' });
    this.meta.updateTag({ property: 'og:site_name', content: SITE_NAME });
    this.meta.updateTag({ property: 'og:locale', content: 'fr_FR' });

    if (indexable) {
      this.meta.removeTag('name="robots"');
      this.meta.updateTag({ property: 'og:url', content: url });
      this.setCanonical(url);
    } else {
      this.meta.updateTag({ name: 'robots', content: 'noindex' });
      this.meta.removeTag('property="og:url"');
      this.setCanonical(null);
    }
  }

  private setCanonical(href: string | null): void {
    const head = this.document.head;
    let link = head.querySelector<HTMLLinkElement>('link[rel="canonical"]');

    if (href === null) {
      if (link) {
        head.removeChild(link);
      }
      return;
    }
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      head.appendChild(link);
    }
    link.setAttribute('href', href);
  }
}
