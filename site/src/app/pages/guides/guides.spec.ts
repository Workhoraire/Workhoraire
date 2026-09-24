import { Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { HOSTING, LEGAL_INFO, PUBLISHER } from '../../core/legal/legal-info';
import { EmployeeInformationGuide } from './employee-information-guide';
import { OvertimeGuide } from './overtime-guide';

async function render<T>(
  component: Type<T>,
  offsiteBackup: { name: string; location: string } | null = null,
): Promise<ComponentFixture<T>> {
  await TestBed.configureTestingModule({
    imports: [component],
    providers: [
      provideRouter([]),
      { provide: LEGAL_INFO, useValue: { publisher: PUBLISHER, hosting: HOSTING, offsiteBackup } },
    ],
  }).compileComponents();
  const fixture = TestBed.createComponent(component);
  fixture.detectChanges();
  return fixture;
}

function plain(element: Element | null): string {
  return (element?.textContent ?? '').replace(/\s+/g, ' ').trim();
}

describe('guides', () => {
  it('frame each guide with its breadcrumb, title, date and contents', async () => {
    const element = (await render(OvertimeGuide)).nativeElement as HTMLElement;

    expect(element.querySelectorAll('h1').length).toBe(1);
    expect(element.querySelector('h1')?.textContent).toBe(
      'Heures supplémentaires : le calcul pour une semaine de 35 heures',
    );
    expect(plain(element.querySelector('.breadcrumb [aria-current="page"]'))).toBe(
      'Heures supplémentaires',
    );
    expect(element.querySelector('.updated time')?.getAttribute('datetime')).toBe('2026-09-24');
    expect(element.querySelector('.updated time')?.textContent).toBe('24 septembre 2026');

    const contents = Array.from(element.querySelectorAll<HTMLAnchorElement>('.contents a'));
    expect(contents.length).toBe(8);
    for (const link of contents) {
      const id = link.getAttribute('href')?.split('#')[1] ?? '';
      expect(link.getAttribute('href')).toBe(`/guides/heures-supplementaires#${id}`);
      expect(element.querySelector(`section#${id}`))
        .withContext(id)
        .not.toBeNull();
    }
    expect(contents[0].textContent).toBe('Qu’est-ce qu’une heure supplémentaire ?');
  });

  it('ends each guide with a call to action whose prices keep their no-break spaces', async () => {
    const element = (await render(OvertimeGuide)).nativeElement as HTMLElement;

    expect(element.querySelector('app-cta-band .wh-lead')?.textContent).toContain(
      'Gratuit jusqu’à 3 utilisateurs actifs.',
    );
  });

  it('links to the official texts of the Code du travail', async () => {
    const element = (await render(OvertimeGuide)).nativeElement as HTMLElement;
    const links = Array.from(
      element.querySelectorAll<HTMLAnchorElement>('a[href^="https://code.travail.gouv.fr"]'),
    );

    expect(links.map((link) => link.getAttribute('href'))).toContain(
      'https://code.travail.gouv.fr/code-du-travail/l3121-35',
    );
  });

  describe('the model notice for the employees', () => {
    it('lists every right of the employee', async () => {
      const element = (await render(EmployeeInformationGuide)).nativeElement as HTMLElement;
      const model = plain(element.querySelector('.model'));

      expect(model).toContain(
        'droit d’accès, de rectification, d’effacement et de limitation, d’un droit à la portabilité des données traitées pour l’exécution de votre contrat',
      );
      expect(model).toContain(
        'd’un droit d’opposition aux traitements fondés sur l’intérêt légitime',
      );
    });

    it('names the e-mail provider and where the data are', async () => {
      const element = (await render(EmployeeInformationGuide)).nativeElement as HTMLElement;
      const model = plain(element.querySelector('.model'));

      expect(model).toContain('La base de données est hébergée en France.');
      expect(model).toContain('Brevo, le prestataire d’envoi des e-mails de WorkHoraire');
      expect(model).toContain('peuvent y accéder depuis les États-Unis');
      expect(model).not.toContain('Les données sont hébergées en France');
      expect(model).not.toContain('copie chiffrée des sauvegardes');
    });

    it('names the off-site backup storage once declared', async () => {
      const fixture = await render(EmployeeInformationGuide, {
        name: 'Stockage Exemple SAS',
        location: 'France',
      });
      const model = plain((fixture.nativeElement as HTMLElement).querySelector('.model'));

      expect(model).toContain(
        'Une copie chiffrée des sauvegardes est conservée chez Stockage Exemple SAS (France).',
      );
    });

    it('promises no deletion that the application does not do', async () => {
      const element = (await render(EmployeeInformationGuide)).nativeElement as HTMLElement;
      const text = plain(element);

      expect(text).not.toContain('avant suppression');
      expect(text).toContain(
        'Pendant votre contrat, puis pendant [durée] après votre départ. Ensuite, à la demande de l’employeur, le support de l’éditeur de WorkHoraire supprime ou anonymise vos données.',
      );
    });

    it('tells that a forgotten exit is declared after the fact', async () => {
      const element = (await render(EmployeeInformationGuide)).nativeElement as HTMLElement;
      const text = plain(element);

      expect(text).toContain(
        'Seule une sortie oubliée se déclare après coup, avec un motif, et cette déclaration est tracée.',
      );
      expect(text).toContain(
        'Seule une sortie oubliée se déclare après coup, avec un motif, et reste tracée.',
      );
      expect(text).not.toContain('aucune surveillance');
    });
  });
});
