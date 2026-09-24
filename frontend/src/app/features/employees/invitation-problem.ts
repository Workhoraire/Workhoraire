import { HttpErrorResponse } from '@angular/common/http';

export type InvitationProblemKind =
  | 'unverified-email'
  | 'wrong-account'
  | 'other-company'
  | 'already-used'
  | 'expired'
  | 'not-found'
  | 'unknown';

export interface InvitationProblem {
  kind: InvitationProblemKind;
  message: string;
  /** Sign out and come back to the same link, to use the invited account. */
  canSwitchAccount: boolean;
  canRetry: boolean;
}

/**
 * Explains why an invitation link was refused and what the person can do.
 * The way out is never "create a company": an invited employee who does that
 * ends up alone in a new company instead of joining the team.
 */
export function invitationProblem(
  response: HttpErrorResponse,
  accountEmail: string | null,
): InvitationProblem {
  const message: unknown = response.error?.message;
  const account = accountEmail ? ` (${accountEmail})` : '';

  if (
    response.status === 403 &&
    message === 'The Keycloak email must be verified to accept this invitation'
  ) {
    return {
      kind: 'unverified-email',
      message: 'Confirmez d’abord votre adresse e-mail (lien reçu par e-mail), puis rouvrez l’invitation.',
      canSwitchAccount: true,
      canRetry: true,
    };
  }
  if (response.status === 403) {
    return {
      kind: 'wrong-account',
      message: `Cette invitation est destinée à une autre adresse e-mail que celle de votre compte${account}. Changez de compte : connectez-vous, ou créez un compte, avec l’adresse qui a reçu l’invitation.`,
      canSwitchAccount: true,
      canRetry: false,
    };
  }
  if (response.status === 409 && message === 'The Keycloak user is already associated with a company') {
    return {
      kind: 'other-company',
      message: `Votre compte${account} appartient déjà à une entreprise, et un compte ne peut appartenir qu’à une seule. Pour rejoindre celle-ci, demandez une invitation pour une autre adresse e-mail, puis créez un compte avec cette adresse.`,
      canSwitchAccount: true,
      canRetry: false,
    };
  }
  if (response.status === 409) {
    return {
      kind: 'already-used',
      message: 'Cette invitation a déjà été utilisée. Si c’est vous qui l’avez acceptée, votre espace est prêt.',
      canSwitchAccount: true,
      canRetry: false,
    };
  }
  if (response.status === 410) {
    return {
      kind: 'expired',
      message: 'Ce lien a expiré ou a été remplacé par un lien plus récent. Demandez un nouveau lien à votre administrateur.',
      canSwitchAccount: false,
      canRetry: false,
    };
  }
  if (response.status === 404) {
    return {
      kind: 'not-found',
      message: 'Ce lien d’invitation est inconnu. Vérifiez qu’il a été copié en entier, ou demandez un nouveau lien à votre administrateur.',
      canSwitchAccount: false,
      canRetry: false,
    };
  }
  return {
    kind: 'unknown',
    message: 'L’invitation n’a pas pu être acceptée. Vérifiez votre connexion, puis réessayez.',
    canSwitchAccount: false,
    canRetry: true,
  };
}
