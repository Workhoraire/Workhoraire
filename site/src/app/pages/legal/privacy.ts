import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LegalField } from '../../shared/legal-field';
import { LegalPage } from './legal-page';

/** Privacy policy: what WorkHoraire processes as controller, and as processor for the employers. */
@Component({
  selector: 'app-privacy',
  imports: [LegalField, RouterLink],
  templateUrl: './privacy.html',
  styleUrl: './legal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Privacy extends LegalPage {}
