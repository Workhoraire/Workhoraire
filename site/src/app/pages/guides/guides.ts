import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CtaBand } from '../../shared/cta-band';
import { Icon } from '../../shared/icon';

interface GuideSummary {
  path: string;
  title: string;
  description: string;
}

/** Published guides. Also add each new guide to `public/sitemap.xml`. */
const GUIDES: GuideSummary[] = [
  {
    path: '/guides/heures-supplementaires',
    title: 'Heures supplémentaires : le calcul pour une semaine de 35 heures',
    description:
      'Semaine civile, majorations de 25 % et 50 %, heures complémentaires des temps partiels et congés payés, avec un exemple chiffré.',
  },
];

@Component({
  selector: 'app-guides',
  imports: [CtaBand, Icon, RouterLink],
  templateUrl: './guides.html',
  styleUrl: './guides.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Guides {
  protected readonly guides = GUIDES;
}
