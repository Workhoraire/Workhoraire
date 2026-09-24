import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { APP_LINKS } from '../core/links';

/** Closing call to action of a page, on a dark band. */
@Component({
  selector: 'app-cta-band',
  imports: [RouterLink],
  template: `
    <section class="wh-section wh-section--ink" aria-labelledby="cta-title">
      <div class="wh-container inner">
        <div class="text">
          <h2 id="cta-title">{{ heading() }}</h2>
          <p class="wh-lead">{{ text() }}</p>
        </div>
        <div class="wh-actions">
          <a class="wh-button wh-button--lime" [href]="links.signUp">Commencer gratuitement</a>
          <a class="wh-button wh-button--outline" routerLink="/tarifs">Voir les tarifs</a>
        </div>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .inner {
      display: grid;
      align-items: end;
      gap: 2rem;
    }

    .text {
      max-width: 42rem;
    }

    h2 {
      margin-bottom: 0.4em;
    }

    .wh-lead {
      margin-bottom: 0;
    }

    @media (min-width: 64rem) {
      .inner {
        grid-template-columns: 1fr auto;
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CtaBand {
  readonly heading = input('Remplacez le tableur des heures');
  readonly text = input(
    'Gratuit jusqu’à 3 salariés actifs, puis 3 € HT par salarié actif et par mois, sans engagement.',
  );

  protected readonly links = APP_LINKS;
}
