import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { applyRuntimeConfig } from './app/core/config/runtime-config';

applyRuntimeConfig()
  .then(() => bootstrapApplication(App, appConfig))
  .catch((err) => console.error(err));
