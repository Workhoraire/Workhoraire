import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  template: `
    <section class="wh-section wh-glow" aria-labelledby="page-title">
      <div class="wh-container">
        <p class="code" aria-hidden="true">404</p>
        <h1 id="page-title">Page introuvable</h1>
        <p class="wh-lead">La page que vous cherchez n’existe pas ou a été déplacée.</p>
        <div class="wh-actions">
          <a class="wh-button wh-button--primary" routerLink="/">Retour à l’accueil</a>
          <a class="wh-button wh-button--outline" routerLink="/fonctionnalites">
            Voir les fonctionnalités
          </a>
          <a class="wh-button wh-button--outline" routerLink="/tarifs">Voir les tarifs</a>
        </div>
      </div>
    </section>
  `,
  styles: `
    :host {
      display: block;
    }

    .code {
      margin: 0 0 0.5rem;
      color: var(--wh-coral-ink);
      font-size: clamp(4rem, 14vw, 8rem);
      font-weight: 800;
      letter-spacing: -0.06em;
      line-height: 1;
    }

    .wh-lead {
      margin-bottom: 2rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFound {}
