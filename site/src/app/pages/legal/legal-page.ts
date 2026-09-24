import { Directive, inject } from '@angular/core';

import {
  LEGAL_INFO,
  LEGAL_UPDATED_ON,
  TERMS_VERSION,
  missingPublisherFields,
  requiresShareCapital,
} from '../../core/legal/legal-info';

/**
 * What the legal pages share: the publisher's identity, the host, the optional
 * off-site backup storage (core/legal/legal-info.json), the date and the version.
 */
@Directive()
export abstract class LegalPage {
  private readonly info = inject(LEGAL_INFO);

  protected readonly publisher = this.info.publisher;
  protected readonly hosting = this.info.hosting;
  protected readonly offsiteBackup = this.info.offsiteBackup;
  protected readonly updatedOn = LEGAL_UPDATED_ON;
  protected readonly version = TERMS_VERSION;
  protected readonly showShareCapital =
    this.publisher.shareCapital !== null || requiresShareCapital(this.publisher);
  /** The publisher's identity is not complete yet: the page says so. */
  protected readonly draft = missingPublisherFields(this.publisher).length > 0;
}
