import { HttpErrorResponse } from '@angular/common/http';

import { invitationProblem } from './invitation-problem';

function refused(status: number, message?: string): HttpErrorResponse {
  return new HttpErrorResponse({ status, error: message ? { message } : null });
}

describe('invitationProblem', () => {
  it('asks to switch to the invited account, naming the account in use', () => {
    const problem = invitationProblem(
      refused(403, 'The invitation email does not match the authenticated Keycloak user'),
      'said@example.com',
    );

    expect(problem.kind).toBe('wrong-account');
    expect(problem.message).toContain('(said@example.com)');
    expect(problem.canSwitchAccount).toBeTrue();
  });

  it('tells apart an account of another company from an invitation already used', () => {
    const otherCompany = invitationProblem(
      refused(409, 'The Keycloak user is already associated with a company'),
      'said@example.com',
    );
    const used = invitationProblem(refused(409, 'This invitation has already been used'), null);

    expect(otherCompany.kind).toBe('other-company');
    expect(otherCompany.message).toContain('appartient déjà à une entreprise');
    expect(used.kind).toBe('already-used');
    expect(used.message).toContain('déjà été utilisée');
  });

  it('sends back to the administrator for an expired, replaced or unknown link', () => {
    for (const status of [404, 410]) {
      const problem = invitationProblem(refused(status), null);
      expect(problem.message).withContext(String(status)).toContain('nouveau lien');
      expect(problem.canSwitchAccount).withContext(String(status)).toBeFalse();
      expect(problem.canRetry).withContext(String(status)).toBeFalse();
    }
  });

  it('only offers to retry when the server could not be reached', () => {
    expect(invitationProblem(refused(0), null)).toEqual(
      jasmine.objectContaining({ kind: 'unknown', canRetry: true }),
    );
  });
});
