import { TestBed } from '@angular/core/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';

import { CurrentUserService } from '../../core/user/current-user.service';
import { Billing } from './billing';
import { formatDeadline, formatEuros, formatMonth } from './billing-format';
import { BillingOverview } from './billing.models';
import { BillingService } from './billing.service';

const overview: BillingOverview = {
  plan: 'DECOUVERTE',
  status: 'NONE',
  month: '2026-09',
  activeEmployees: 8,
  estimatedAmountCents: 2400,
  lastMonth: { month: '2026-08', activeEmployees: 1, amountCents: 0 },
  freeActiveEmployees: 3,
  pricePerActiveEmployeeCents: 300,
  paymentRequired: true,
  graceUntil: '2026-10-01T08:00:00.000Z',
  readOnly: false,
  paymentsEnabled: true,
  portalAvailable: false,
};

async function render(data: Partial<BillingOverview> = {}) {
  const billing = {
    getOverview: jasmine.createSpy('getOverview').and.returnValue(of({ ...overview, ...data })),
    createCheckout: jasmine.createSpy('createCheckout'),
    createPortal: jasmine.createSpy('createPortal'),
  };

  await TestBed.configureTestingModule({
    imports: [Billing],
    providers: [
      provideNoopAnimations(),
      { provide: BillingService, useValue: billing },
      {
        provide: CurrentUserService,
        useValue: { getCurrentUser: () => of({ company: { timezone: 'Europe/Paris' } }) },
      },
      { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: convertToParamMap({}) } } },
    ],
  }).compileComponents();

  const fixture = TestBed.createComponent(Billing);
  fixture.detectChanges();
  const element = fixture.nativeElement as HTMLElement;
  const buttons = () =>
    Array.from(element.querySelectorAll('button')).map((button) => button.textContent?.trim());
  return { element, buttons };
}

describe('Billing', () => {
  it('shows the usage, the estimate and the deadline to pay', async () => {
    const { element, buttons } = await render();
    // Non-breaking spaces (typography) compared as plain spaces.
    const text = (element.textContent ?? '').replace(/\s/g, ' ');

    expect(text).toContain('Utilisateurs actifs en septembre 2026');
    expect(text).toContain('24 € HT');
    expect(text).toContain('avant le 1er octobre 2026');
    expect(buttons()).toContain('credit_card Choisir l’offre Essentiel');
  });

  it('says that the company is read-only, and that clocking still works', async () => {
    const { element } = await render({ readOnly: true });

    expect(element.querySelector('[role="alert"]')?.textContent).toContain('lecture seule');
    expect(element.textContent).toContain('peuvent toujours pointer');
  });

  it('manages an active subscription in the Stripe portal instead of subscribing again', async () => {
    const { buttons } = await render({
      plan: 'ESSENTIEL',
      status: 'ACTIVE',
      paymentRequired: false,
      graceUntil: null,
      portalAvailable: true,
    });

    expect(buttons()).toEqual(['receipt_long Factures et moyen de paiement']);
  });

  it('offers no payment when online payment is not open', async () => {
    const { element, buttons } = await render({
      paymentsEnabled: false,
      paymentRequired: false,
      graceUntil: null,
    });

    expect(element.textContent).toContain('Le paiement en ligne n’est pas encore ouvert');
    expect(buttons()).toEqual([]);
  });

  it('formats amounts, months and deadlines in French', () => {
    expect(formatEuros(2400)).toBe('24 €');
    expect(formatEuros(750)).toBe('7,50 €');
    expect(formatMonth('2026-09')).toBe('septembre 2026');
    expect(formatDeadline('2026-10-01T08:00:00.000Z', 'Europe/Paris')).toBe('1er octobre 2026');
    expect(formatDeadline('2026-10-24T08:00:00.000Z', 'Europe/Paris')).toBe('24 octobre 2026');
  });
});
