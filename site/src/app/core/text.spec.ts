import { LEGAL_UPDATED_ON, TERMS_VERSION } from './legal/legal-info';
import { NBSP, formatFrenchDate } from './text';

describe('French text helpers', () => {
  it('uses a real no-break space', () => {
    expect(NBSP).toBe(' ');
    expect(NBSP.charCodeAt(0)).toBe(0xa0);
  });

  it('writes dates the French way', () => {
    expect(formatFrenchDate('2026-09-24')).toBe('24 septembre 2026');
    expect(formatFrenchDate('2026-10-01')).toBe('1er octobre 2026');
  });

  it('shows the version date of the legal pages', () => {
    expect(LEGAL_UPDATED_ON).toBe(formatFrenchDate(TERMS_VERSION));
  });
});
