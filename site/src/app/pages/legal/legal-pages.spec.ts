import { Type } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Publisher, missingPublisherFields } from '../../core/legal/legal-info';
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

async function render<T>(component: Type<T>): Promise<string> {
  await TestBed.configureTestingModule({
    imports: [component],
    providers: [provideRouter([])],
  }).compileComponents();
  const fixture = TestBed.createComponent(component);
  fixture.detectChanges();
  return ((fixture.nativeElement as HTMLElement).textContent ?? '').replace(/\s+/g, ' ');
}

describe('legal pages', () => {
  it('lists the identity fields still missing, and none once complete', () => {
    expect(missingPublisherFields({ ...complete, name: null, phone: null })).toEqual(['name', 'phone']);
    expect(missingPublisherFields(complete)).toEqual([]);
    // Optional: the share capital of a sole proprietorship, the VAT number under the franchise.
    expect(missingPublisherFields({ ...complete, shareCapital: null, vatNumber: null })).toEqual([]);
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

  it('states the late-payment penalties and the read-only rule in the terms of sale', async () => {
    const text = await render(Terms);

    expect(text).toContain('réservé aux professionnels');
    expect(text).toContain('indemnité forfaitaire pour frais de recouvrement de 40 €');
    expect(text).toContain('les salariés peuvent toujours pointer');
    expect(text).toContain('Version 2026-09-24.');
  });

  it('describes the processing, the subprocessors and the breach notification', async () => {
    const text = await render(ProcessingAgreement);

    expect(text).toContain('Brevo (Sendinblue SAS, Paris)');
    expect(text).toContain('au plus tard 48 heures après en avoir pris connaissance');
    // Brevo's own providers may reach the e-mail data from the United States.
    expect(text).toContain('peuvent y accéder depuis les États-Unis');
    expect(text).toContain('registre des catégories d’activités de traitement');
  });

  it('gives the contacts to exercise rights, CNIL included', async () => {
    const text = await render(Privacy);

    expect(text).toContain('Ce site ne dépose aucun cookie');
    expect(text).toContain('www.cnil.fr/fr/plaintes');
    expect(text).toContain('Service des plaintes, 3 place de Fontenoy, 75007 Paris');
    expect(text).toContain('10 ans (article L123-22 du Code de commerce)');
  });
});
