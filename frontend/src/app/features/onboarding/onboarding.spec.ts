import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/auth/auth.service';
import { Onboarding } from './onboarding';
import { OnboardingService } from './onboarding.service';

async function render() {
  const onboarding = { createCompany: jasmine.createSpy('createCompany').and.returnValue(of({})) };

  await TestBed.configureTestingModule({
    imports: [Onboarding],
    providers: [
      provideRouter([]),
      provideNoopAnimations(),
      { provide: OnboardingService, useValue: onboarding },
      {
        provide: AuthService,
        useValue: {
          names: () => ({ firstName: 'Alice', lastName: 'Martin' }),
          logout: jasmine.createSpy('logout'),
        },
      },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(Onboarding);
  fixture.detectChanges();
  const element = fixture.nativeElement as HTMLElement;

  const type = (name: string, value: string) => {
    const input = element.querySelector<HTMLInputElement>(`input[formcontrolname="${name}"]`)!;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  };
  const submit = () => {
    element.querySelector<HTMLButtonElement>('button[type="submit"]')!.click();
    fixture.detectChanges();
  };
  return { element, fixture, onboarding, type, submit };
}

describe('Onboarding', () => {
  it('does not create the company until the terms of sale are accepted', async () => {
    const { element, onboarding, type, submit } = await render();
    type('name', 'Boulangerie Martin');

    submit();

    expect(onboarding.createCompany).not.toHaveBeenCalled();
    expect(element.querySelector('.terms-error')?.textContent).toContain(
      'Acceptez les conditions générales de vente',
    );
  });

  it('sends the acceptance with the company', async () => {
    const { element, fixture, onboarding, type, submit } = await render();
    type('name', 'Boulangerie Martin');
    element.querySelector<HTMLInputElement>('.terms input[type="checkbox"]')!.click();
    fixture.detectChanges();

    submit();

    expect(onboarding.createCompany).toHaveBeenCalledWith(
      jasmine.objectContaining({ name: 'Boulangerie Martin', acceptTerms: true }),
    );
  });

  it('links to the terms, the processing agreement and the privacy policy of the website', async () => {
    const { element } = await render();
    const links = Array.from(element.querySelectorAll<HTMLAnchorElement>('.terms a')).map((link) =>
      link.getAttribute('href'),
    );

    expect(links).toEqual([
      `${environment.siteUrl}/cgv`,
      `${environment.siteUrl}/sous-traitance`,
      `${environment.siteUrl}/confidentialite`,
    ]);
  });
});
