import { Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';

import { APP_LINKS } from '../core/links';
import { pathOf } from '../core/url-path';
import { BrandLogo } from '../shared/brand-logo';

export interface NavItem {
  path: string;
  label: string;
}

export const NAV_ITEMS: readonly NavItem[] = [
  { path: '/fonctionnalites', label: 'Fonctionnalités' },
  { path: '/tarifs', label: 'Tarifs' },
  { path: '/securite', label: 'Sécurité' },
  { path: '/guides', label: 'Guides' },
];

@Component({
  selector: 'app-site-header',
  imports: [BrandLogo, RouterLink, RouterLinkActive],
  host: { '(document:keydown.escape)': 'closeMenu()' },
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteHeader {
  protected readonly items = NAV_ITEMS;
  protected readonly links = APP_LINKS;
  /** State of the phone menu, a native <details> element that also works before hydration. */
  protected readonly menuOpen = signal(false);
  /**
   * Path of the page shown. A section stays highlighted on its sub-pages (routerLinkActive),
   * but only the link of the page itself is announced as the current page.
   */
  protected readonly currentPath = signal(pathOf(inject(Location).path()));
  private readonly toggle = viewChild<ElementRef<HTMLElement>>('toggle');

  constructor() {
    inject(Router)
      .events.pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => {
        this.currentPath.set(pathOf(event.urlAfterRedirects));
        this.menuOpen.set(false);
      });
  }

  protected onMenuToggle(menu: HTMLDetailsElement): void {
    this.menuOpen.set(menu.open);
  }

  /** The open menu covers the page: it closes when the keyboard leaves it. */
  protected onMenuFocusOut(event: FocusEvent, menu: HTMLDetailsElement): void {
    const next = event.relatedTarget;
    if (this.menuOpen() && next instanceof Node && !menu.contains(next)) {
      this.menuOpen.set(false);
    }
  }

  protected closeMenu(): void {
    if (this.menuOpen()) {
      this.menuOpen.set(false);
      this.toggle()?.nativeElement.focus();
    }
  }
}
