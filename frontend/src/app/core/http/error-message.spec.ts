import { HttpErrorResponse } from '@angular/common/http';

import { apiErrorMessage } from './error-message';

function errorResponse(status: number, message?: string | string[]): HttpErrorResponse {
  return new HttpErrorResponse({ status, error: message === undefined ? null : { message } });
}

describe('apiErrorMessage', () => {
  it('translates the business errors of the API', () => {
    expect(
      apiErrorMessage(errorResponse(409, 'This time entry has changed, reload it and retry')),
    ).toBe('Ce pointage vient d’être modifié par quelqu’un d’autre. Actualisez la page puis recommencez.');
    expect(
      apiErrorMessage(
        errorResponse(409, 'This entry has been open for more than 12 hours: declare its end time'),
      ),
    ).toContain('plus de 12 h');
    expect(
      apiErrorMessage(errorResponse(409, 'This payroll number is already used by another employee')),
    ).toBe('Ce matricule de paie est déjà attribué à un autre salarié.');
  });

  it('uses the first message when the API returns several', () => {
    expect(
      apiErrorMessage(errorResponse(400, ['The start time is not a valid date', 'other'])),
    ).toBe('L’heure de début est invalide.');
  });

  it('never shows an untranslated message: it falls back on the HTTP status', () => {
    expect(
      apiErrorMessage(errorResponse(400, 'weeklyContractMinutes must not be greater than 2880')),
    ).toBe('Vérifiez les informations saisies puis réessayez.');
    expect(apiErrorMessage(errorResponse(0))).toContain('injoignable');
    expect(apiErrorMessage(errorResponse(409), 'Conflit précis')).toBe('Conflit précis');
  });
});
