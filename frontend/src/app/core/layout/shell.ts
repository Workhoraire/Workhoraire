import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter, map, skip } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { CurrentUser, isManagerRole } from '../auth/auth.models';
import { ROLE_LABELS } from '../time/labels';
import { fullName, initials } from '../time/time-format';
import { CurrentUserService } from '../user/current-user.service';

type Access = 'all' | 'manager' | 'admin';

interface NavItem {
  path: string;
  label: string;
  shortLabel: string;
  icon: string;
  access: Access;
  section: 'Mon espace' | 'Équipe' | 'Administration';
}

const NAV_ITEMS: NavItem[] = [
  {
    path: '/clock',
    label: 'Pointer',
    shortLabel: 'Pointer',
    icon: 'touch_app',
    access: 'all',
    section: 'Mon espace',
  },
  {
    path: '/my-time',
    label: 'Mes heures',
    shortLabel: 'Heures',
    icon: 'schedule',
    access: 'all',
    section: 'Mon espace',
  },
  {
    path: '/absences',
    label: 'Absences',
    shortLabel: 'Absences',
    icon: 'beach_access',
    access: 'all',
    section: 'Mon espace',
  },
  {
    path: '/dashboard',
    label: 'Tableau de bord',
    shortLabel: 'Accueil',
    icon: 'space_dashboard',
    access: 'manager',
    section: 'Équipe',
  },
  {
    path: '/team',
    label: 'Heures de l’équipe',
    shortLabel: 'Équipe',
    icon: 'groups',
    access: 'manager',
    section: 'Équipe',
  },
  {
    path: '/exports',
    label: 'Exports paie',
    shortLabel: 'Exports',
    icon: 'download',
    access: 'manager',
    section: 'Équipe',
  },
  {
    path: '/employees',
    label: 'Salariés',
    shortLabel: 'Salariés',
    icon: 'badge',
    access: 'admin',
    section: 'Administration',
  },
  {
    path: '/abonnement',
    label: 'Abonnement',
    shortLabel: 'Abonnement',
    icon: 'credit_card',
    access: 'admin',
    section: 'Administration',
  },
];

/** Order of the bottom navigation on phones; the rest goes in the "Plus" menu. */
const MOBILE_PRIORITY = [
  '/dashboard',
  '/clock',
  '/team',
  '/absences',
  '/my-time',
  '/exports',
  '/employees',
  '/abonnement',
];
const MOBILE_SLOTS = 4;

@Component({
  selector: 'app-shell',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
  ],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Shell {
  private readonly authService = inject(AuthService);
  private readonly currentUserService = inject(CurrentUserService);

  protected readonly user = signal<CurrentUser | null>(null);
  private readonly content = viewChild.required<ElementRef<HTMLElement>>('content');

  protected readonly items = computed(() => {
    const user = this.user();
    if (!user) {
      return [];
    }
    return NAV_ITEMS.filter(
      (item) =>
        item.access === 'all' ||
        (item.access === 'manager' && isManagerRole(user.role)) ||
        (item.access === 'admin' && user.role === 'ADMIN'),
    );
  });

  protected readonly sections = computed(() => {
    const sections = new Map<string, NavItem[]>();
    for (const item of this.items()) {
      sections.set(item.section, [...(sections.get(item.section) ?? []), item]);
    }
    return [...sections.entries()].map(([title, items]) => ({ title, items }));
  });

  /** Few pages (an employee): same order as the sidebar. Many: the most used first. */
  private readonly mobileOrdered = computed(() => {
    const items = this.items();
    if (items.length <= MOBILE_SLOTS + 1) {
      return items;
    }
    return [...items].sort(
      (left, right) => MOBILE_PRIORITY.indexOf(left.path) - MOBILE_PRIORITY.indexOf(right.path),
    );
  });

  protected readonly mobileItems = computed(() => {
    const ordered = this.mobileOrdered();
    return ordered.length <= MOBILE_SLOTS + 1 ? ordered : ordered.slice(0, MOBILE_SLOTS);
  });

  protected readonly moreItems = computed(() => {
    const ordered = this.mobileOrdered();
    return ordered.length <= MOBILE_SLOTS + 1 ? [] : ordered.slice(MOBILE_SLOTS);
  });

  private readonly router = inject(Router);
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );
  /** The "Plus" button is highlighted when the current page is in its menu. */
  protected readonly moreActive = computed(() =>
    this.moreItems().some((item) => this.currentUrl().startsWith(item.path)),
  );
  protected readonly userError = signal(false);

  protected readonly roleLabels = ROLE_LABELS;
  /** Legal pages of the website, for every user, employees included. */
  protected readonly legalLinks = {
    privacy: `${environment.siteUrl}/confidentialite`,
    terms: `${environment.siteUrl}/cgv`,
  };
  protected readonly fullName = fullName;
  protected readonly initials = initials;

  constructor() {
    // After each page change, the keyboard and screen readers start on the new content.
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        skip(1),
        takeUntilDestroyed(),
      )
      .subscribe(() => this.content().nativeElement.focus());

    this.loadUser();
  }

  protected loadUser(): void {
    this.userError.set(false);
    this.currentUserService.getCurrentUser().subscribe({
      next: (user) => this.user.set(user),
      error: () => {
        this.user.set(null);
        this.userError.set(true);
      },
    });
  }

  protected focusContent(event: Event): void {
    event.preventDefault();
    this.content().nativeElement.focus();
  }

  /** Keycloak's account page, computed on click so that it returns to the current page. */
  protected openAccount(): void {
    window.location.assign(this.authService.accountUrl());
  }

  protected async logout(): Promise<void> {
    this.currentUserService.clearCurrentUser();
    await this.authService.logout();
  }
}
