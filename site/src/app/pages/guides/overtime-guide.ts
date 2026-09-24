import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { APP_LINKS } from '../../core/links';
import { CtaBand } from '../../shared/cta-band';

interface ContentsEntry {
  id: string;
  label: string;
}

/** Official texts of the Code du travail cited by the guide (Code du travail numérique). */
const ARTICLE_URL = 'https://code.travail.gouv.fr/code-du-travail';

@Component({
  selector: 'app-overtime-guide',
  imports: [CtaBand, RouterLink],
  templateUrl: './overtime-guide.html',
  styleUrl: './overtime-guide.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OvertimeGuide {
  protected readonly links = APP_LINKS;
  protected readonly path = '/guides/heures-supplementaires';

  protected readonly articles = {
    l3121_35: `${ARTICLE_URL}/l3121-35`,
    l3121_36: `${ARTICLE_URL}/l3121-36`,
    l3123_28: `${ARTICLE_URL}/l3123-28`,
    l3123_29: `${ARTICLE_URL}/l3123-29`,
  } as const;

  protected readonly contents: ContentsEntry[] = [
    { id: 'definition', label: 'Qu’est-ce qu’une heure supplémentaire ?' },
    { id: 'semaine-civile', label: 'Un décompte semaine par semaine' },
    { id: 'majorations', label: 'Les taux de majoration' },
    { id: 'exemple', label: 'Exemple : 39 heures dans la semaine' },
    { id: 'temps-partiel', label: 'Temps partiel : les heures complémentaires' },
    { id: 'conges-payes', label: 'Les congés payés dans le décompte' },
    { id: 'workhoraire', label: 'Ce que WorkHoraire calcule pour vous' },
    { id: 'sources', label: 'Sources' },
  ];
}
