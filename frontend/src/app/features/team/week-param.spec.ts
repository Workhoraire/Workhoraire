import { weekFromParam, weekQueryParams } from './week-param';

const CURRENT_WEEK = '2026-09-21';

describe('Week carried in the address', () => {
  it('opens the week of the given date, on its Monday', () => {
    expect(weekFromParam('2026-09-07', CURRENT_WEEK)).toBe('2026-09-07');
    expect(weekFromParam('2026-09-10', CURRENT_WEEK)).toBe('2026-09-07');
  });

  it('falls back on the current week for a missing, invalid or future week', () => {
    expect(weekFromParam(null, CURRENT_WEEK)).toBe(CURRENT_WEEK);
    expect(weekFromParam('septembre', CURRENT_WEEK)).toBe(CURRENT_WEEK);
    expect(weekFromParam('2026-02-30', CURRENT_WEEK)).toBe(CURRENT_WEEK);
    expect(weekFromParam('2026-10-05', CURRENT_WEEK)).toBe(CURRENT_WEEK);
  });

  it('only writes the week in the links when it is not the current one', () => {
    expect(weekQueryParams('2026-09-07', CURRENT_WEEK)).toEqual({ semaine: '2026-09-07' });
    expect(weekQueryParams(CURRENT_WEEK, CURRENT_WEEK)).toEqual({ semaine: null });
  });
});
