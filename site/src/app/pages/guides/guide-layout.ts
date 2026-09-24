import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { formatFrenchDate } from '../../core/text';

export interface GuideSection {
  /** Id of the section in the guide, target of its link in the contents. */
  id: string;
  label: string;
}

/**
 * Frame of a guide: breadcrumb, title, date of the last update, contents and
 * body. The guide's sections are projected into the body.
 */
@Component({
  selector: 'app-guide-layout',
  imports: [RouterLink],
  templateUrl: './guide-layout.html',
  styleUrl: './guide-layout.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GuideLayout {
  /** Path of the guide, for the links of the contents. */
  readonly path = input.required<string>();
  /** Last item of the breadcrumb: a short name of the guide. */
  readonly crumb = input.required<string>();
  readonly heading = input.required<string>();
  readonly lead = input.required<string>();
  /** "2026-09-24" */
  readonly updatedOn = input.required<string>();
  readonly sections = input.required<readonly GuideSection[]>();

  protected readonly updatedLabel = computed(() => formatFrenchDate(this.updatedOn()));
}
