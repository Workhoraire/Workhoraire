import { environment } from '../../environments/environment';

const appUrl = environment.appUrl.replace(/\/+$/, '');

/** Links from the site to the WorkHoraire application. */
export const APP_LINKS = {
  signIn: appUrl,
  /** Sign-up with the free "Découverte" plan: the default call to action. */
  signUp: `${appUrl}/inscription?offre=decouverte`,
  signUpEssential: `${appUrl}/inscription?offre=essentiel`,
} as const;
