import { validateSync } from 'class-validator';
import { NoWebAddress } from './no-web-address';

class Named {
  @NoWebAddress()
  name!: string;

  constructor(name: string) {
    this.name = name;
  }
}

function accepted(name: string): boolean {
  return validateSync(new Named(name)).length === 0;
}

describe('NoWebAddress', () => {
  it('accepts ordinary person and company names', () => {
    for (const name of [
      'S.A.R.L. Martin',
      'Ets. Dupont & Fils',
      'Café d’Anaïs',
      "Café d'Anaïs",
      'Jean-Pierre',
      "O'Brien",
      'M. Durand',
      'Boulangerie Martin & Co.',
      'St.Denis Traiteur',
    ]) {
      expect({ name, accepted: accepted(name) }).toEqual({ name, accepted: true });
    }
  });

  it('refuses web addresses, e-mail addresses, paths and domain names', () => {
    for (const name of [
      'https://paie.example',
      'www.paie-rh',
      'paie@rh.example',
      'paie/rh',
      'paie\\rh',
      'paie-urgente.fr',
      'Service Paie-RH.COM - reconnectez-vous',
      'secure.login.online',
      'Validez sur mon-compte.click maintenant',
    ]) {
      expect({ name, accepted: accepted(name) }).toEqual({ name, accepted: false });
    }
  });
});
