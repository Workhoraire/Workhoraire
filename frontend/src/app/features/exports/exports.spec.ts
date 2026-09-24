import { recentMonths } from './exports';

describe('recentMonths', () => {
  it('lists the current month first, then the previous ones across the year', () => {
    expect(recentMonths('2026-02-10', 3)).toEqual([
      { value: '2026-02', label: 'février 2026' },
      { value: '2026-01', label: 'janvier 2026' },
      { value: '2025-12', label: 'décembre 2025' },
    ]);
  });
});
