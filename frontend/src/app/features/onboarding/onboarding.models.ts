export interface CreateCompanyRequest {
  /** The administrator's name: the sign-up page only asks for an e-mail and a password. */
  firstName: string;
  lastName: string;
  name: string;
  siret?: string;
  timezone: string;
}
