import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { PRICING_TEXT } from '../../core/pricing';
import { LegalField } from '../../shared/legal-field';
import { LegalPage } from './legal-page';

/** Terms of sale, for professionals only. */
@Component({
  selector: 'app-terms',
  imports: [LegalField, RouterLink],
  templateUrl: './terms.html',
  styleUrl: './legal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Terms extends LegalPage {
  protected readonly pricing = PRICING_TEXT;
}
