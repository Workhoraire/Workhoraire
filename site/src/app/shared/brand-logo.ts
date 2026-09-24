import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

/** "WH" rounded square and the product name, linking to the home page. */
@Component({
  selector: 'app-brand-logo',
  imports: [RouterLink],
  template: `
    <a class="brand" routerLink="/" aria-label="WorkHoraire, accueil">
      <span class="mark" aria-hidden="true">WH</span>
      <span class="name">WorkHoraire</span>
    </a>
  `,
  styles: `
    :host {
      display: inline-flex;
    }

    .brand {
      display: inline-flex;
      align-items: center;
      gap: 0.65rem;
      border-radius: 0.8rem;
      color: inherit;
      font-weight: 800;
      letter-spacing: -0.04em;
      text-decoration: none;
    }

    .mark {
      display: grid;
      width: 2.35rem;
      height: 2.35rem;
      flex: 0 0 auto;
      place-items: center;
      border-radius: 0.75rem;
      background: var(--wh-ink);
      color: var(--wh-lime);
      font-size: 0.8rem;
      letter-spacing: -0.06em;
    }

    .name {
      font-size: 1.15rem;
    }

    /* On a dark background the colours of the mark are swapped. */
    :host(.on-ink) .mark {
      background: var(--wh-lime);
      color: var(--wh-ink);
    }
  `,
  host: {
    '[class.on-ink]': "tone() === 'ink'",
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandLogo {
  readonly tone = input<'paper' | 'ink'>('paper');
}
