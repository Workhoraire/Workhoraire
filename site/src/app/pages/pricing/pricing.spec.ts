import { ComponentFixture, TestBed } from '@angular/core/testing';

import { APP_LINKS } from '../../core/links';
import { Pricing } from './pricing';

/** Text with collapsed whitespace: prices contain no-break spaces. */
function plain(text: string | null | undefined): string {
  return (text ?? '').replace(/\s+/g, ' ').trim();
}

describe('Pricing', () => {
  let fixture: ComponentFixture<Pricing>;
  let element: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Pricing] }).compileComponents();
    fixture = TestBed.createComponent(Pricing);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  });

  function typeEmployees(value: string): void {
    const input = element.querySelector<HTMLInputElement>('#employees')!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function result(): string {
    return plain(element.querySelector('.result')?.textContent);
  }

  function simulatorLink(): HTMLAnchorElement {
    return element.querySelector<HTMLAnchorElement>('.simulator a.wh-button')!;
  }

  it('shows the monthly price of the default team of 8 active employees', () => {
    expect(result()).toContain('24 € HT par mois');
    expect(result()).toContain('8 salariés actifs × 3 € HT');
    expect(simulatorLink().getAttribute('href')).toBe(APP_LINKS.signUpEssential);
  });

  it('is free up to 3 active employees and then offers the free plan', () => {
    typeEmployees('3');

    expect(result()).toContain('0 € HT par mois');
    expect(result()).toContain('Offre Découverte');
    expect(plain(simulatorLink().textContent)).toBe('Commencer gratuitement');
    expect(simulatorLink().getAttribute('href')).toBe(APP_LINKS.signUp);
  });

  it('computes large teams, beyond the old limit of 999', () => {
    typeEmployees('1500');

    expect(result()).toContain('4 500 € HT par mois');
    expect(result()).toContain('1 500 salariés actifs × 3 € HT');
    expect(element.querySelector('#employees-hint')).toBeNull();
  });

  it('explains the limit of the simulator, then shows the number used when the field is left', () => {
    typeEmployees('100000000');

    expect(result()).toContain('300 000 € HT par mois');
    expect(plain(element.querySelector('#employees-hint')?.textContent)).toBe(
      'Le simulateur va jusqu’à 100 000 salariés actifs : le prix affiché est celui de 100 000 salariés.',
    );
    const input = element.querySelector<HTMLInputElement>('#employees')!;
    expect(input.getAttribute('aria-invalid')).toBe('true');

    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(input.value).toBe('100000');
    expect(element.querySelector('#employees-hint')).toBeNull();
  });

  it('never prices another number than the one shown after leaving the field', () => {
    typeEmployees('12.7');
    expect(plain(element.querySelector('#employees-hint')?.textContent)).toContain('nombre entier');

    const input = element.querySelector<HTMLInputElement>('#employees')!;
    input.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    expect(input.value).toBe('12');
    expect(result()).toContain('36 € HT par mois');
  });

  it('offers monthly payment only', () => {
    expect(element.querySelector('input[name="billing"]')).toBeNull();
    expect(plain(element.textContent)).not.toContain('annuel');
  });

  it('treats an empty field as no employee without rewriting it', () => {
    typeEmployees('');

    expect(result()).toContain('0 € HT par mois');
    expect(element.querySelector<HTMLInputElement>('#employees')!.value).toBe('');
  });

  it('changes the number of employees with the buttons', () => {
    const [less, more] = Array.from(element.querySelectorAll<HTMLButtonElement>('.stepper button'));

    more.click();
    fixture.detectChanges();
    expect(result()).toContain('27 € HT par mois');

    typeEmployees('0');
    expect(less.disabled).toBeTrue();
  });

  it('states what an active employee is', () => {
    expect(plain(element.querySelector('.active-definition')?.textContent)).toBe(
      'Un salarié actif est un salarié qui a pointé, ou qui a eu une absence validée, dans le mois : vous ne payez pas les saisonniers les mois où ils ne travaillent pas.',
    );
  });
});
