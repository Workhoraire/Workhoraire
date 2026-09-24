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
