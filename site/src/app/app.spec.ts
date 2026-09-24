import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [provideRouter([])],
    }).compileComponents();
  });

  it('renders the page landmarks and a skip link to the content', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('header')).toBeTruthy();
    expect(element.querySelector('main#contenu')).toBeTruthy();
    expect(element.querySelector('footer')).toBeTruthy();

    const skipLink = element.querySelector<HTMLAnchorElement>('.skip-link')!;
    expect(skipLink.getAttribute('href')).toBe('/#contenu');
  });

  it('moves the focus to the content when the skip link is used', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    element.querySelector<HTMLAnchorElement>('.skip-link')!.click();

    expect(document.activeElement).toBe(element.querySelector('main'));
  });

  it('links to the legal pages from the footer', () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();

    const legalLinks = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll<HTMLAnchorElement>(
        'footer nav[aria-label="Informations légales"] a',
      ),
    ).map((link) => link.getAttribute('href'));

    expect(legalLinks).toEqual(['/mentions-legales', '/confidentialite', '/cgv', '/sous-traitance']);
  });
});
