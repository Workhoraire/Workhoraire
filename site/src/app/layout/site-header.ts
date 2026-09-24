import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { filter } from 'rxjs';

import { APP_LINKS } from '../core/links';
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
  templateUrl: './site-header.html',
  styleUrl: './site-header.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteHeader {
  protected readonly items = NAV_ITEMS;
  protected readonly links = APP_LINKS;
  /** State of the phone menu, a native <details> element that also works before hydration. */
  protected readonly menuOpen = signal(false);

  constructor() {
    inject(Router)
      .events.pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.menuOpen.set(false));
  }

  protected onMenuToggle(menu: HTMLDetailsElement): void {
    this.menuOpen.set(menu.open);
  }

  protected closeMenu(toggle: HTMLElement): void {
    if (this.menuOpen()) {
      this.menuOpen.set(false);
      toggle.focus();
    }
  }
}
