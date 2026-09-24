export interface CreateCompanyRequest {
  /** The administrator's name: the sign-up page only asks for an e-mail and a password. */
  firstName: string;
  lastName: string;
  name: string;
  siret?: string;
  timezone: string;
  /** Terms of sale and data processing agreement, accepted with the check box. */
  acceptTerms: true;
}
