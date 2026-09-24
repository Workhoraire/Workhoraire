import { Location, ViewportScroller } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  afterNextRender,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';

import { SiteFooter } from './layout/site-footer';
import { SiteHeader } from './layout/site-header';

function pathOf(url: string): string {
  return url.split(/[?#]/)[0] || '/';
}

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SiteFooter, SiteHeader],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly injector = inject(Injector);
  private readonly main = viewChild.required<ElementRef<HTMLElement>>('main');

  /**
   * Target of the skip link. It carries the page path because of `<base href="/">`:
   * a bare "#contenu" would lead to the home page in the prerendered HTML.
   */
  protected readonly contentHref = signal(`${pathOf(inject(Location).path())}#contenu`);

  constructor() {
    // In-page links (such as the guide contents) must not hide their target under the sticky header.
    inject(ViewportScroller).setOffset([0, 96]);

    let previousPath: string | null = null;

    inject(Router)
      .events.pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(),
      )
      .subscribe((event) => {
        const path = pathOf(event.urlAfterRedirects);
        this.contentHref.set(`${path}#contenu`);

        // After a client-side navigation, keyboard and screen reader users start from the new page.
        if (previousPath !== null && path !== previousPath) {
          afterNextRender(() => this.main().nativeElement.focus({ preventScroll: true }), {
            injector: this.injector,
          });
        }
        previousPath = path;
      });
  }

  protected skipToContent(event: Event): void {
    event.preventDefault();
    this.main().nativeElement.focus();
  }
}
