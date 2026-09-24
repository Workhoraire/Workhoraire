/**
 * Offer chosen on the website (/inscription?offre=essentiel), kept through the
 * Keycloak sign-up and the company creation. localStorage rather than
 * sessionStorage: the e-mail verification link may open in another tab.
 */
export type Offer = 'decouverte' | 'essentiel';

const STORAGE_KEY = 'workhoraire.chosen-offer';

function isOffer(value: string | null): value is Offer {
  return value === 'decouverte' || value === 'essentiel';
}

export function rememberOffer(value: string | null): void {
  if (!isOffer(value)) {
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, value);
  } catch {
    // Storage blocked: the company is created on the free plan, the offer can be chosen later.
  }
}

/** Returns the chosen offer once, then forgets it. */
export function takeOffer(): Offer | null {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
    return isOffer(value) ? value : null;
  } catch {
    return null;
  }
}
