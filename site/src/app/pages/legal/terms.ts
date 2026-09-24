import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  HOSTING,
  LEGAL_UPDATED_ON,
  PUBLISHER,
  TERMS_VERSION,
  missingPublisherFields,
} from '../../core/legal/legal-info';
import { LegalField } from '../../shared/legal-field';

/** Terms of sale, for professionals only. */
@Component({
  selector: 'app-terms',
  imports: [LegalField, RouterLink],
  templateUrl: './terms.html',
  styleUrl: './legal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Terms {
  protected readonly publisher = PUBLISHER;
  protected readonly hosting = HOSTING;
  protected readonly updatedOn = LEGAL_UPDATED_ON;
  protected readonly version = TERMS_VERSION;
  /** The publisher's identity is not complete yet: the page says so. */
  protected readonly draft = missingPublisherFields().length > 0;
}
