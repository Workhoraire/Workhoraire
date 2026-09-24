import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { applyRuntimeConfig } from './app/core/config/runtime-config';

/** Without a working start (sign-in service unreachable, missing configuration), say so instead of a blank page. */
function showStartupError(): void {
  const box = document.createElement('main');
  box.className = 'wh-startup-error';
  const title = document.createElement('h1');
  title.textContent = 'WorkHoraire ne répond pas.';
  const text = document.createElement('p');
  text.textContent =
    'Le service de connexion est injoignable pour le moment. Vérifiez votre connexion à Internet, puis réessayez.';
  const retry = document.createElement('button');
  retry.type = 'button';
  retry.textContent = 'Réessayer';
  retry.addEventListener('click', () => window.location.reload());
  box.append(title, text, retry);
  document.body.replaceChildren(box);
  retry.focus();
}

applyRuntimeConfig()
  .then(() => bootstrapApplication(App, appConfig))
  .catch((err) => {
    console.error(err);
    showStartupError();
  });
