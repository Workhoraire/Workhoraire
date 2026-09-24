import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LEGAL_INFO } from '../../core/legal/legal-info';
import { NBSP } from '../../core/text';
import { CtaBand, FREE_PLAN_SENTENCE } from '../../shared/cta-band';
import { codeDuTravailUrl } from './code-du-travail';
import { GuideLayout, GuideSection } from './guide-layout';

/**
 * Guide for the employer: inform the employees (and the CSE) before the first
 * clock-in, with a model notice. Adapted from docs/produit/07-kit-conformite-client.md.
 */
@Component({
  selector: 'app-employee-information-guide',
  imports: [CtaBand, GuideLayout, RouterLink],
  templateUrl: './employee-information-guide.html',
  styleUrl: './guide.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmployeeInformationGuide {
  protected readonly path = '/guides/informer-les-salaries';
  protected readonly heading = `Mettre en place le pointage${NBSP}: informer vos salariés`;
  protected readonly lead =
    'Avant le premier pointage, chaque salarié doit savoir quelles données sont enregistrées et pourquoi. Voici les règles, et un modèle de note prêt à compléter.';
  protected readonly ctaText = `Heure du serveur, corrections visibles par le salarié, ni géolocalisation ni mesure de l’activité. ${FREE_PLAN_SENTENCE}`;
  /** Storage of a copy of the backups at another provider, when there is one (legal-info.json). */
  protected readonly offsiteBackup = inject(LEGAL_INFO).offsiteBackup;

  protected readonly sources = {
    l1222_4: codeDuTravailUrl('L1222-4'),
    l2312_38: codeDuTravailUrl('L2312-38'),
    gdpr13: 'https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre3',
  } as const;

  protected readonly sections: GuideSection[] = [
    { id: 'pourquoi', label: 'Pourquoi informer avant le premier pointage' },
    { id: 'cse', label: 'Le comité social et économique' },
    { id: 'modele', label: 'Le modèle de note d’information' },
    { id: 'preuve', label: 'Garder une preuve de la remise' },
    { id: 'workhoraire', label: 'Ce que WorkHoraire prévoit déjà' },
  ];
}
