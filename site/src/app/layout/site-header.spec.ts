import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';

import { environment } from '../../environments/environment';
import { SiteHeader } from './site-header';

@Component({ template: '' })
class Blank {}

describe('SiteHeader', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteHeader],
      providers: [
        provideRouter([
          { path: '', component: Blank },
          { path: 'tarifs', component: Blank },
          { path: 'guides', component: Blank },
          { path: 'guides/heures-supplementaires', component: Blank },
        ]),
      ],
    }).compileComponents();
  });

  it('links to the sections of the site', () => {
    const fixture = TestBed.createComponent(SiteHeader);
    fixture.detectChanges();

    const links = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLAnchorElement>('.nav-desktop a'),
    ).map((link) => [link.textContent?.trim(), link.getAttribute('href')]);

    expect(links).toEqual([
      ['Fonctionnalités', '/fonctionnalites'],
      ['Tarifs', '/tarifs'],
      ['Sécurité', '/securite'],
      ['Guides', '/guides'],
    ]);
  });

  it('sends visitors to the application to sign in or to sign up for free', () => {
    const fixture = TestBed.createComponent(SiteHeader);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('.sign-in')?.getAttribute('href')).toBe(environment.appUrl);
    expect(element.querySelector('.start')?.getAttribute('href')).toBe(
      `${environment.appUrl}/inscription?offre=decouverte`,
    );
  });

  it('highlights the section of a sub-page, but only announces the page itself as current', async () => {
    const fixture = TestBed.createComponent(SiteHeader);
    const guides = (): HTMLAnchorElement =>
      (fixture.nativeElement as HTMLElement).querySelector<HTMLAnchorElement>(
        '.nav-desktop a[href="/guides"]',
      )!;
    const router = TestBed.inject(Router);

    async function navigate(url: string): Promise<void> {
      await router.navigateByUrl(url);
      fixture.detectChanges();
      // routerLinkActive updates its classes in a microtask.
      await fixture.whenStable();
      fixture.detectChanges();
    }

    await navigate('/guides/heures-supplementaires');
    expect(guides().classList).toContain('active');
    expect(guides().getAttribute('aria-current')).toBeNull();

    await navigate('/guides');
    expect(guides().classList).toContain('active');
    expect(guides().getAttribute('aria-current')).toBe('page');
  });

  it('closes the phone menu after a navigation', async () => {
    const fixture = TestBed.createComponent(SiteHeader);
    fixture.detectChanges();
    const menu = (fixture.nativeElement as HTMLElement).querySelector<HTMLDetailsElement>('.menu')!;

    menu.open = true;
    menu.dispatchEvent(new Event('toggle'));
    fixture.detectChanges();

    await TestBed.inject(Router).navigateByUrl('/tarifs');
    fixture.detectChanges();

    expect(menu.open).toBeFalse();
  });
});
