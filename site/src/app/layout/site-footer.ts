import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SiteAuthService } from '../core/auth/site-auth.service';
import { APP_LINKS } from '../core/links';
import { BrandLogo } from '../shared/brand-logo';

@Component({
  selector: 'app-site-footer',
  imports: [BrandLogo, RouterLink],
  templateUrl: './site-footer.html',
  styleUrl: './site-footer.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SiteFooter {
  protected readonly links = APP_LINKS;
  protected readonly auth = inject(SiteAuthService);

  protected logout(): void {
    void this.auth.logout();
  }
}
