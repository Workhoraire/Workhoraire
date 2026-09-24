import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/**
 * A value of the publisher's identity, or a visible placeholder while it is
 * missing from core/legal/legal-info.json.
 */
@Component({
  selector: 'app-legal-field',
  template: `
    @if (value(); as text) {
      {{ text }}
    } @else {
      <mark class="wh-placeholder">[À compléter : {{ label() }}]</mark>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalField {
  readonly value = input<string | null>(null);
  readonly label = input.required<string>();
}
