import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LegalField } from '../../shared/legal-field';
import { LegalPage } from './legal-page';

/**
 * Data processing agreement (article 28 of the GDPR), part of the terms of sale.
 * Its subprocessors table lists the off-site backup storage once legal-info.json declares it.
 */
@Component({
  selector: 'app-processing-agreement',
  imports: [LegalField, RouterLink],
  templateUrl: './processing-agreement.html',
  styleUrl: './legal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProcessingAgreement extends LegalPage {}
