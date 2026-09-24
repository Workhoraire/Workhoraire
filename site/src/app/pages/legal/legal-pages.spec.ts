import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import {
  HOSTING,
  LEGAL_INFO,
  LegalInfo,
  OffsiteBackup,
  Publisher,
  missingPublisherFields,
} from '../../core/legal/legal-info';
import { LegalNotice } from './legal-notice';
import { Privacy } from './privacy';
import { ProcessingAgreement } from './processing-agreement';
import { Terms } from './terms';

const complete: Publisher = {
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

const offsiteBackup: OffsiteBackup = {
  name: 'Stockage Exemple SAS',
  location: 'Union européenne (Allemagne)',
};

/** Renders a legal page, with the legal information of legal-info.json unless another is given. */
async function renderPage<T>(component: Type<T>, info?: Partial<LegalInfo>): Promise<HTMLElement> {
  await TestBed.configureTestingModule({
    imports: [component],
    providers: [
      provideRouter([]),
      ...(info
        ? [
            {
              provide: LEGAL_INFO,
              useValue: { publisher: complete, hosting: HOSTING, offsiteBackup: null, ...info },
            },
          ]
        : []),
    ],
  }).compileComponents();
  const fixture = TestBed.createComponent(component);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

function plain(element: Element | null | undefined): string {
  return (element?.textContent ?? '').replace(/\s+/g, ' ').trim();
}

async function render<T>(component: Type<T>, info?: Partial<LegalInfo>): Promise<string> {
  return plain(await renderPage(component, info));
}

/** Text of each cell of the subprocessors table, row by row. */
function subprocessors(element: HTMLElement): string[][] {
  return Array.from(element.querySelectorAll('table tbody tr'), (row) =>
    Array.from(row.querySelectorAll('td'), (cell) => plain(cell)),
  );
}

describe('legal pages', () => {
  it('lists the identity fields still missing, and none once complete', () => {
    expect(missingPublisherFields({ ...complete, name: null, phone: null })).toEqual([
      'name',
      'phone',
    ]);
    expect(missingPublisherFields(complete)).toEqual([]);
    // A sole proprietorship has no share capital; the VAT franchise has no VAT number.
    expect(
      missingPublisherFields({
        ...complete,
        legalForm: 'Entrepreneur individuel (EI)',
        shareCapital: null,
      }),
    ).toEqual([]);
  });

  it('requires the share capital of a company and the VAT number without the franchise', () => {
    expect(missingPublisherFields({ ...complete, shareCapital: null })).toEqual(['shareCapital']);
    expect(missingPublisherFields({ ...complete, legalForm: 'SARL', shareCapital: null })).toEqual([
      'shareCapital',
    ]);
    expect(missingPublisherFields({ ...complete, vatExempt: false })).toEqual(['vatNumber']);
    expect(
      missingPublisherFields({ ...complete, vatExempt: false, vatNumber: 'FR00000000000' }),
    ).toEqual([]);
  });

  it('shows what is missing instead of inventing it', async () => {
    const text = await render(LegalNotice);

    expect(text).toContain('Directeur de la publication');
    expect(text).toContain('hébergés en France');
    if (missingPublisherFields().length > 0) {
      expect(text).toContain('[À compléter : dénomination sociale ou nom de l’entrepreneur]');
      expect(text).toContain('sera complétée à l’immatriculation');
    }
  });

  it('asks for the share capital of a company in the legal notice', async () => {
    const element = await renderPage(LegalNotice, {
      publisher: { ...complete, shareCapital: null },
    });
    const capital = Array.from(element.querySelectorAll('dt')).find(
      (term) => plain(term) === 'Capital social',
    );

    expect(plain(capital?.nextElementSibling)).toBe('[À compléter : capital social]');
    expect(plain(element)).toContain('sera complétée à l’immatriculation');
  });

  it('states the late-payment penalties and the read-only rule in the terms of sale', async () => {
    const text = await render(Terms);

    expect(text).toContain('réservé aux professionnels');
    expect(text).toContain('indemnité forfaitaire pour frais de recouvrement de 40 €');
    expect(text).toContain('les salariés peuvent toujours pointer');
    expect(text).toContain('Version 2026-09-24.');
  });

  it('defines the active user and prices every one of them in the terms of sale', async () => {
    const text = await render(Terms);

    expect(text).toContain(
      'Utilisateur actif Un utilisateur (salarié, manager ou dirigeant) qui a, au cours d’un mois civil et dans le fuseau horaire de l’entreprise, des heures pointées ou ajoutées à sa feuille de temps, ou une absence validée qui tombe dans ce mois.',
    );
    expect(text).toContain('au plus 3 utilisateurs actifs dans le mois');
    expect(text).toContain(
      '3 € hors taxes par utilisateur actif et par mois, tous les utilisateurs actifs du mois étant comptés',
    );
    expect(text).toContain('Ils disposent de 30 jours pour souscrire l’offre Essentiel');
    expect(text).toContain('par le bouton « Factures et moyen de paiement »');
    expect(text).toContain('l’ensemble de ses données lui est remis sur demande');
  });

  it('describes the processing, the subprocessors and the breach notification', async () => {
    const text = await render(ProcessingAgreement);

    expect(text).toContain('Brevo (Sendinblue SAS, Paris)');
    expect(text).toContain(
      'invitations, notifications de correction, rappels de sortie non pointée, e-mails de compte (vérification de l’adresse, mot de passe oublié)',
    );
    expect(text).toContain('au plus tard 48 heures après en avoir pris connaissance');
    // Brevo's own providers may reach the e-mail data from the United States.
    expect(text).toContain('peuvent y accéder depuis les États-Unis');
    expect(text).toContain('tient un registre des catégories d’activités de traitement');
    expect(text).not.toContain('exporter ses données à tout moment');
    expect(text).toContain('le sous-traitant lui remet sur demande l’ensemble de ses données');
    expect(text).toContain('supprime ou anonymise les données d’un salarié parti');
  });

  it('keeps the backups at the host until an off-site storage is declared', async () => {
    const text = await render(ProcessingAgreement, { offsiteBackup: null });

    expect(text).toContain('La base de données du service est hébergée en France, chez OVH SAS.');
    expect(text).toContain('Ses sauvegardes chiffrées restent chez cet hébergeur.');
    expect(text).not.toContain('Les données du service sont hébergées en France');
  });

  it('lists the off-site backup storage as a subprocessor once declared', async () => {
    const element = await renderPage(ProcessingAgreement, { offsiteBackup });

    expect(subprocessors(element)).toContain([
      'Stockage Exemple SAS',
      'Conservation hors du serveur d’une copie des sauvegardes, chiffrée avant l’envoi',
      'Union européenne (Allemagne)',
    ]);
    expect(plain(element)).toContain(
      'Une copie de ses sauvegardes, chiffrée avant l’envoi, est conservée chez Stockage Exemple SAS',
    );
    expect(plain(element)).not.toContain('restent chez cet hébergeur');
  });

  it('lists only the host and the e-mail provider while the backups stay at the host', async () => {
    const element = await renderPage(ProcessingAgreement, { offsiteBackup: null });

    expect(subprocessors(element).map(([name, , location]) => [name, location])).toEqual([
      ['OVH SAS', 'France'],
      ['Brevo (Sendinblue SAS, Paris)', 'Union européenne'],
    ]);
  });

  it('gives the contacts to exercise rights, CNIL included', async () => {
    const text = await render(Privacy);

    expect(text).toContain('Ce site ne dépose aucun cookie');
    expect(text).toContain('www.cnil.fr/fr/plaintes');
    expect(text).toContain('Service des plaintes, 3 place de Fontenoy, 75007 Paris');
    expect(text).toContain('10 ans (article L123-22 du Code de commerce)');
  });

  it('says where the data are and how the data of a departed employee are deleted', async () => {
    const text = await render(Privacy, { offsiteBackup: null });

    expect(text).toContain(
      'La base de données de l’application est hébergée en France, chez OVH SAS.',
    );
    expect(text).toContain('Les e-mails du service passent par Brevo, dans l’Union européenne.');
    expect(text).toContain('les sauvegardes ne quittent pas cet hébergeur');
    expect(text).toContain(
      'notre support les supprime ou les anonymise, à la demande de votre employeur',
    );
    expect(text).toContain('rappels de sortie non pointée, e-mails de compte');
    expect(text).not.toContain('Les données de l’application sont hébergées en France');
  });

  it('names the off-site backup storage in the privacy policy once declared', async () => {
    const text = await render(Privacy, { offsiteBackup });

    expect(text).toContain(
      'Une copie chiffrée de ses sauvegardes est conservée chez Stockage Exemple SAS (Union européenne (Allemagne)).',
    );
    expect(text).toContain(
      'Stockage Exemple SAS, conservation hors du serveur d’une copie des sauvegardes',
    );
    expect(text).not.toContain('ne quittent pas cet hébergeur');
  });
});
