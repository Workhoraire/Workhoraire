import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { APP_LINKS } from '../../core/links';
import { NBSP } from '../../core/text';
import { CtaBand, FREE_PLAN_SENTENCE } from '../../shared/cta-band';
import { codeDuTravailUrl } from './code-du-travail';
import { GuideLayout, GuideSection } from './guide-layout';

@Component({
  selector: 'app-overtime-guide',
  imports: [CtaBand, GuideLayout, RouterLink],
  templateUrl: './overtime-guide.html',
  styleUrl: './guide.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OvertimeGuide {
  protected readonly links = APP_LINKS;
  protected readonly path = '/guides/heures-supplementaires';
  protected readonly heading = `Heures supplémentaires${NBSP}: le calcul pour une semaine de 35${NBSP}heures`;
  protected readonly lead = `Semaine civile, taux de majoration, temps partiel et congés payés${NBSP}: les règles à connaître, avec un exemple chiffré.`;
  protected readonly ctaText = `Décompte par semaine civile, majorations légales par défaut et congés payés pris en compte. ${FREE_PLAN_SENTENCE}`;

  /** Official texts of the Code du travail cited by the guide. */
  protected readonly articles = {
    l3121_35: codeDuTravailUrl('L3121-35'),
    l3121_36: codeDuTravailUrl('L3121-36'),
    l3123_28: codeDuTravailUrl('L3123-28'),
    l3123_29: codeDuTravailUrl('L3123-29'),
  } as const;

  protected readonly sections: GuideSection[] = [
    { id: 'definition', label: `Qu’est-ce qu’une heure supplémentaire${NBSP}?` },
    { id: 'semaine-civile', label: 'Un décompte semaine par semaine' },
    { id: 'majorations', label: 'Les taux de majoration' },
    { id: 'exemple', label: `Exemple${NBSP}: 39${NBSP}heures dans la semaine` },
    { id: 'temps-partiel', label: `Temps partiel${NBSP}: les heures complémentaires` },
    { id: 'conges-payes', label: 'Les congés payés dans le décompte' },
    { id: 'workhoraire', label: 'Ce que WorkHoraire calcule pour vous' },
    { id: 'sources', label: 'Sources' },
  ];
}
