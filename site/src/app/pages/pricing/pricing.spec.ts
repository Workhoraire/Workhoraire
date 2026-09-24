import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LEGAL_INFO, LegalInfo, Publisher } from '../../core/legal/legal-info';
import { APP_LINKS } from '../../core/links';
import { Pricing } from './pricing';

/** Text with collapsed whitespace, for the tests that do not check the no-break spaces. */
function plain(text: string | null | undefined): string {
  return (text ?? '').replace(/\s+/g, ' ').trim();
}

const publisher: Publisher = {
  name: 'WorkHoraire SAS',
  legalForm: 'SAS',
  shareCapital: '1 000 €',
  address: '1 rue de l’Exemple, 75001 Paris',
  registration: 'RCS Paris 000 000 000',
  vatNumber: null,
  vatExempt: true,
  email: 'contact@example.com',
  phone: '01 00 00 00 00',
  publicationDirector: 'Prénom Nom',
};

function legalInfo(vatExempt: boolean | null): LegalInfo {
  return {
    publisher: { ...publisher, vatExempt },
    hosting: {
      name: 'OVH SAS',
      address: null,
      phone: null,
      website: 'https://www.ovhcloud.com/fr/',
    },
    offsiteBackup: null,
  };
}

describe('Pricing', () => {
  let fixture: ComponentFixture<Pricing>;
  let element: HTMLElement;

  async function render(vatExempt: boolean | null = null): Promise<void> {
    await TestBed.configureTestingModule({
      imports: [Pricing],
      providers: [{ provide: LEGAL_INFO, useValue: legalInfo(vatExempt) }],
    }).compileComponents();
    fixture = TestBed.createComponent(Pricing);
    element = fixture.nativeElement as HTMLElement;
    fixture.detectChanges();
  }

  function input(): HTMLInputElement {
    return element.querySelector<HTMLInputElement>('#employees')!;
  }

  function typeEmployees(value: string): void {
    input().value = value;
    input().dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  function leaveField(): void {
    input().dispatchEvent(new Event('change'));
    fixture.detectChanges();
  }

  function result(): string {
    return plain(element.querySelector('.result')?.textContent);
  }

  function hint(): string {
    return plain(element.querySelector('#employees-hint')?.textContent);
  }

  function simulatorLink(): HTMLAnchorElement {
    return element.querySelector<HTMLAnchorElement>('.simulator a.wh-button')!;
  }

  /** Answer of a question of the FAQ, as rendered (no-break spaces kept). */
  function rawAnswer(question: string): string {
    const item = Array.from(element.querySelectorAll('.faq-item')).find((faq) =>
      faq.querySelector('summary')?.textContent?.includes(question),
    );
    return item?.querySelector('p')?.textContent ?? '';
  }

  function answer(question: string): string {
    return plain(rawAnswer(question));
  }

  it('shows the monthly price of the default team of 8 active users', async () => {
    await render();

    expect(result()).toContain('24 € HT par mois');
    expect(result()).toContain('8 utilisateurs actifs × 3 € HT');
    expect(simulatorLink().getAttribute('href')).toBe(APP_LINKS.signUpEssential);
  });

  it('is free up to 3 active users and then offers the free plan', async () => {
    await render();
    typeEmployees('3');

    expect(result()).toContain('0 € HT par mois');
    expect(result()).toContain('Offre Découverte : gratuite jusqu’à 3 utilisateurs actifs');
    expect(plain(simulatorLink().textContent)).toBe('Commencer gratuitement');
    expect(simulatorLink().getAttribute('href')).toBe(APP_LINKS.signUp);
  });

  it('counts every active user from the 4th one', async () => {
    await render();
    typeEmployees('4');

    expect(result()).toContain('12 € HT par mois');
    expect(result()).toContain('4 utilisateurs actifs × 3 € HT');
    expect(plain(element.querySelector('.plan-featured')?.textContent)).toContain(
      'Dès 4 utilisateurs actifs, tous comptés (12 € HT par mois)',
    );
  });

  it('computes large teams, beyond the old limit of 999', async () => {
    await render();
    typeEmployees('1500');

    expect(result()).toContain('4 500 € HT par mois');
    expect(result()).toContain('1 500 utilisateurs actifs × 3 € HT');
    expect(hint()).toBe('');
  });

  it('explains the limit of the simulator, then shows the number used when the field is left', async () => {
    await render();
    typeEmployees('100000000');

    expect(result()).toContain('300 000 € HT par mois');
    expect(hint()).toBe(
      'Le simulateur va jusqu’à 100 000 utilisateurs actifs : le prix affiché est celui de 100 000 utilisateurs actifs.',
    );
    expect(input().getAttribute('aria-invalid')).toBe('true');
    expect(input().getAttribute('aria-describedby')).toBe('employees-hint');

    leaveField();
    expect(input().value).toBe('100000');
    expect(hint()).toBe('');
    expect(input().getAttribute('aria-describedby')).toBeNull();
  });

  it('never prices another number than the one shown after leaving the field', async () => {
    await render();
    typeEmployees('12.7');
    expect(hint()).toContain('nombre entier');

    leaveField();
    expect(input().value).toBe('12');
    expect(result()).toContain('36 € HT par mois');
  });

  it('writes a single user in the singular', async () => {
    await render();
    typeEmployees('1.5');

    expect(hint()).toBe(
      'Indiquez un nombre entier : le prix affiché est celui de 1 utilisateur actif.',
    );
  });

  it('keeps pricing the last number read when the field holds unreadable text', async () => {
    await render();
    typeEmployees('5');
    // A number field returns an empty value, flagged as bad input, for text such as "5 p".
    const unreadable = {
      target: { value: '', validity: { badInput: true } },
    } as unknown as Event;
    fixture.componentInstance['onEmployeesInput'](unreadable);
    fixture.detectChanges();

    expect(result()).toContain('15 € HT par mois');
    expect(hint()).toBe(
      'Indiquez un nombre entier : le prix affiché est celui de 5 utilisateurs actifs.',
    );
    expect(input().getAttribute('aria-invalid')).toBe('true');

    leaveField();
    expect(input().value).toBe('5');
    expect(hint()).toBe('');
  });

  it('keeps the status message in the page, so that screen readers announce it', async () => {
    await render();
    const status = element.querySelector('#employees-hint');
    expect(status?.getAttribute('role')).toBe('status');
    expect(status?.textContent).toBe('');

    typeEmployees('-2');
    expect(element.querySelector('#employees-hint')).toBe(status);
    expect(hint()).toBe('Le nombre d’utilisateurs actifs ne peut pas être négatif.');
  });

  it('offers monthly payment only', async () => {
    await render();

    expect(element.querySelector('input[name="billing"]')).toBeNull();
    expect(plain(element.textContent)).not.toContain('annuel');
  });

  it('treats an empty field as no user without rewriting it', async () => {
    await render();
    typeEmployees('');

    expect(result()).toContain('0 € HT par mois');
    expect(input().value).toBe('');
  });

  it('changes the number of users with the buttons', async () => {
    await render();
    const [less, more] = Array.from(element.querySelectorAll<HTMLButtonElement>('.stepper button'));

    more.click();
    fixture.detectChanges();
    expect(result()).toContain('27 € HT par mois');

    typeEmployees('0');
    expect(less.getAttribute('aria-disabled')).toBe('true');
  });

  it('states what an active user is and that everyone is counted from the 4th', async () => {
    await render();

    expect(plain(element.querySelector('.active-definition')?.textContent)).toBe(
      'Un utilisateur actif est une personne de l’équipe (salarié, manager ou dirigeant) qui a, dans le mois, des heures pointées ou ajoutées à sa feuille de temps, ou une absence validée. Au-delà de 3 utilisateurs actifs, tous sont comptés : 4 utilisateurs actifs font 12 € HT par mois. Un saisonnier sans heures ni absence dans le mois n’est pas compté.',
    );
    expect(plain(element.textContent)).not.toContain('seulement');
  });

  it('puts no-break spaces before « ? » and « : » and inside the amounts', async () => {
    await render();

    for (const summary of Array.from(element.querySelectorAll('.faq-item summary'))) {
      expect(summary.textContent?.trim())
        .withContext(summary.textContent ?? '')
        .toMatch(/ \?$/);
    }
    const detail = element.querySelector('.result-detail')?.textContent ?? '';
    expect(detail).toContain('8 utilisateurs actifs');
    expect(detail).toMatch(/3\s€ HT\.$/);
    expect(element.querySelector('.result-price')?.textContent).toContain(' HT par mois');
    expect(rawAnswer('résilier')).toContain('« Abonnement »');
    for (const item of Array.from(element.querySelectorAll('.faq-item p'))) {
      expect(item.textContent)
        .withContext(item.textContent ?? '')
        .not.toMatch(/ [:;?!»]/);
    }
  });

  it('describes the real way to cancel', async () => {
    await render();

    expect(answer('résilier')).toBe(
      'Oui. Sur la page « Abonnement » de l’application, le bouton « Factures et moyen de paiement » ouvre votre espace de facturation chez Stripe, où vous pouvez résilier. La résiliation prend effet à la fin de la période en cours.'.replace(
        /\s/g,
        ' ',
      ),
    );
  });

  it('states the VAT franchise when the publisher is exempt', async () => {
    await render(true);

    expect(plain(element.querySelector('.vat-note')?.textContent)).toBe(
      'Prix hors taxes (HT). TVA non applicable, art. 293 B du CGI.',
    );
    expect(answer('hors taxes')).toContain('TVA non applicable, art. 293 B du CGI');
  });

  it('adds the VAT of 20 % when the publisher is not exempt', async () => {
    await render(false);

    expect(plain(element.querySelector('.vat-note')?.textContent)).toBe(
      'Prix hors taxes (HT) : + TVA 20 %.',
    );
    expect(answer('hors taxes')).toContain('la TVA de 20 % s’y ajoute');
  });

  it('shows the missing VAT regime instead of inventing it', async () => {
    await render(null);

    expect(plain(element.querySelector('.vat-note')?.textContent)).toBe(
      'Prix hors taxes (HT). [À compléter : régime de TVA]',
    );
    expect(answer('hors taxes')).not.toContain('TVA non applicable');
    expect(answer('hors taxes')).not.toContain('20 %');
  });
});
