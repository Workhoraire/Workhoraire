import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LegalField } from '../../shared/legal-field';
import { LegalPage } from './legal-page';

/** Legal notice (LCEN): publisher, publication director and hosting provider. */
@Component({
  selector: 'app-legal-notice',
  imports: [LegalField, RouterLink],
  templateUrl: './legal-notice.html',
  styleUrl: './legal.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalNotice extends LegalPage {}
