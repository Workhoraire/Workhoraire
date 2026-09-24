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

/** Data processing agreement (article 28 of the GDPR), part of the terms of sale. */
@Component({
  selector: 'app-processing-agreement',
  imports: [LegalField, RouterLink],
  templateUrl: './processing-agreement.html',
  styleUrl: './legal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcessingAgreement {
  protected readonly publisher = PUBLISHER;
  protected readonly hosting = HOSTING;
  protected readonly updatedOn = LEGAL_UPDATED_ON;
  protected readonly version = TERMS_VERSION;
  /** The publisher's identity is not complete yet: the page says so. */
  protected readonly draft = missingPublisherFields().length > 0;
}
