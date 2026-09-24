import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CtaBand } from '../../shared/cta-band';
import { Screenshot } from '../../shared/screenshot';

interface Section {
  id: string;
  label: string;
}

interface LegalLimit {
  value: string;
  label: string;
}

@Component({
  selector: 'app-features',
  imports: [CtaBand, RouterLink, Screenshot],
  templateUrl: './features.html',
  styleUrl: './features.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Features {
  protected readonly sections: Section[] = [
    { id: 'pointage', label: 'Pointage' },
    { id: 'feuille-de-temps', label: 'Feuille de temps' },
    { id: 'alertes', label: 'Alertes légales' },
    { id: 'heures-supplementaires', label: 'Heures sup' },
    { id: 'absences', label: 'Absences' },
    { id: 'exports', label: 'Exports paie' },
    { id: 'invitation', label: 'Invitation' },
  ];

  /** Default limits of the Code du travail checked by the application (with no-break spaces). */
  protected readonly limits: LegalLimit[] = [
    { value: '10 h', label: 'de travail au plus par jour' },
    { value: '48 h', label: 'de travail au plus par semaine' },
    { value: '20 min', label: 'de pause dès 6 h de travail' },
    { value: '11 h', label: 'de repos au moins entre deux journées' },
    { value: '6 jours', label: 'travaillés au plus par semaine' },
    { value: '1/10', label: 'du contrat : limite des heures complémentaires' },
  ];
}
