import { rememberOffer, takeOffer } from './chosen-offer';

describe('Chosen offer', () => {
  afterEach(() => localStorage.removeItem('workhoraire.chosen-offer'));

  it('keeps the offer chosen on the website until the company is created, once', () => {
    rememberOffer('essentiel');

    expect(takeOffer()).toBe('essentiel');
    expect(takeOffer()).toBeNull();
  });

  it('ignores unknown offers', () => {
    rememberOffer('premium');
    rememberOffer(null);

    expect(takeOffer()).toBeNull();
  });
});
