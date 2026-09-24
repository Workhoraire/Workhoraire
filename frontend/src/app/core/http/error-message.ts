import { HttpErrorResponse } from '@angular/common/http';

/** French messages for the business errors returned by the API. */
const KNOWN_MESSAGES: Record<string, string> = {
  'You are already clocked in': 'Votre arrivée est déjà pointée.',
  'You are not clocked in': 'Vous n’avez pas de pointage en cours.',
  'The clock-out time must be after the clock-in time':
    'L’heure de sortie doit être postérieure à l’heure d’arrivée.',
  'This entry has been open for more than 12 hours: declare its end time':
    'Ce pointage est ouvert depuis plus de 12 h\u00a0: indiquez l’heure réelle de votre sortie.',
  'The end time must be after the start time': 'L’heure de fin doit être après l’heure de début.',
  'An entry cannot end in the future': 'Une période ne peut pas se terminer dans le futur.',
  'An entry cannot start in the future': 'Une période ne peut pas commencer dans le futur.',
  'An entry cannot last more than 24 hours': 'Une période ne peut pas dépasser 24 heures.',
  'This period overlaps another time entry of the employee':
    'Cette période chevauche un autre pointage du salarié.',
  'A manager cannot modify their own time entries':
    'Un manager ne peut pas corriger ses propres heures\u00a0: demandez-le à un administrateur.',
  'Time entry not found': 'Ce pointage n’existe plus. Actualisez la page.',
  'An entry cannot be moved to another day: delete it and create a new one':
    'Une période ne peut pas changer de jour\u00a0: supprimez-la, puis ajoutez-la sur le bon jour.',
  'This time entry has changed, reload it and retry':
    'Ce pointage vient d’être modifié par quelqu’un d’autre. Actualisez la page puis recommencez.',
  'The start and end times must be valid dates': 'Les heures de début et de fin sont invalides.',
  'The start time is not a valid date': 'L’heure de début est invalide.',
  'Dates must be valid calendar dates (YYYY-MM-DD)': 'Les dates saisies sont invalides.',
  'This period overlaps another absence request':
    'Cette période chevauche une autre demande d’absence.',
  'The request does not cover any working day': 'La demande ne couvre aucun jour ouvré.',
  'The end date must be on or after the start date':
    'La date de fin doit être égale ou postérieure à la date de début.',
  'A single day cannot start in the afternoon and end in the morning':
    'Une journée ne peut pas commencer l’après-midi et finir le matin.',
  'A manager cannot review their own absence request':
    'Un manager ne peut pas valider sa propre demande\u00a0: un administrateur doit le faire.',
  'This absence request has already been reviewed': 'Cette demande a déjà été traitée.',
  'This absence request can no longer be cancelled': 'Cette demande ne peut plus être annulée.',
  'This absence request has changed, reload it and retry':
    'Cette demande a été modifiée entre-temps. Actualisez la page.',
  'This absence request is already closed': 'Cette demande est déjà close (refusée ou annulée).',
  'Absence request not found': 'Cette demande d’absence n’existe plus. Actualisez la page.',
  'Employee not found': 'Salarié introuvable.',
  'This payroll number is already used by another employee':
    'Ce matricule de paie est déjà attribué à un autre salarié.',
  'An administrator cannot deactivate or demote their own account':
    'Vous ne pouvez pas désactiver votre propre compte ni retirer votre rôle d’administrateur.',
  'This email is already associated with an employee':
    'Cette adresse e-mail est déjà utilisée par un salarié.',
  'This invitation could not be created': 'L’invitation n’a pas pu être créée. Réessayez.',
  'At least one employee field is required': 'Aucune modification à enregistrer.',
  'contractEffectiveFrom must be a valid date (YYYY-MM-DD)':
    'La date d’application du contrat est invalide.',
  'The application user is inactive': 'Votre compte est désactivé. Contactez votre administrateur.',
  'The subscription is unpaid: the company is in read-only mode':
    'Abonnement impayé\u00a0: WorkHoraire est en lecture seule. Le pointage reste possible\u00a0; l’administrateur peut régler l’abonnement depuis la page « Abonnement ».',
  'Online payment is not configured': 'Le paiement en ligne n’est pas encore ouvert.',
  'The company already has a subscription: use the customer portal':
    'Votre entreprise a déjà un abonnement\u00a0: gérez-le avec « Factures et moyen de paiement ».',
  'The company has no Stripe customer yet': 'Aucun moyen de paiement n’a encore été ajouté.',
  'Too many invitations today: try again tomorrow':
    'Vous avez atteint la limite de 100 invitations par jour. Réessayez demain.',
  'Verify your e-mail address before creating a company':
    'Vérifiez d’abord votre adresse e-mail\u00a0: ouvrez le lien reçu par e-mail, puis rechargez cette page.',
  'firstName cannot contain a web address': 'Le prénom ne peut pas contenir d’adresse web.',
  'lastName cannot contain a web address': 'Le nom ne peut pas contenir d’adresse web.',
  'name cannot contain a web address': 'Le nom de l’entreprise ne peut pas contenir d’adresse web.',
  'This SIRET is already associated with a company':
    'Ce SIRET est déjà utilisé par une entreprise inscrite sur WorkHoraire. Vérifiez le numéro saisi.',
  'The Keycloak user is already associated with a company':
    'Votre compte est déjà rattaché à une entreprise.',
  'SIRET must contain exactly 14 digits': 'Le SIRET doit contenir exactement 14 chiffres.',
  'Timezone must be a valid IANA timezone': 'Le fuseau horaire choisi n’est pas reconnu.',
  'The contract cannot change before the week the employee joined':
    'Le contrat ne peut pas changer avant la semaine d’arrivée du salarié.',
  'Online payment is temporarily unavailable':
    'Le paiement en ligne est momentanément indisponible. Réessayez dans quelques minutes.',
  'The payment page is not available':
    'La page de paiement n’est pas disponible pour le moment. Réessayez dans quelques instants.',
};

/** Messages carrying a number, e.g. "The period cannot exceed 62 days". */
const KNOWN_PATTERNS: [RegExp, (count: string) => string][] = [
  [
    /^The period cannot exceed (\d+) days$/,
    (count) => `La période ne peut pas dépasser ${count} jours.`,
  ],
  [
    /^A request cannot exceed (\d+) days$/,
    (count) => `Une demande d’absence ne peut pas dépasser ${count} jours.`,
  ],
];

export function apiErrorMessage(response: HttpErrorResponse, fallback?: string): string {
  const message = response.error?.message;
  const first = Array.isArray(message) ? message[0] : message;

  if (typeof first === 'string' && KNOWN_MESSAGES[first]) {
    return KNOWN_MESSAGES[first];
  }
  for (const [pattern, translate] of KNOWN_PATTERNS) {
    const match = typeof first === 'string' ? pattern.exec(first) : null;
    if (match) {
      return translate(match[1]);
    }
  }

  switch (response.status) {
    case 0:
      return 'Le serveur est injoignable. Vérifiez votre connexion puis réessayez.';
    case 400:
      return fallback ?? 'Vérifiez les informations saisies puis réessayez.';
    case 401:
      return 'Votre session a expiré. Reconnectez-vous pour continuer.';
    case 403:
      return 'Vous n’avez pas les droits nécessaires pour cette action.';
    case 429:
      return 'Trop de demandes en peu de temps. Réessayez dans une minute.';
    case 402:
      return 'Abonnement impayé\u00a0: WorkHoraire est en lecture seule. Le pointage reste possible.';
    case 404:
      return 'Élément introuvable. Actualisez la page.';
    case 409:
      return fallback ?? 'Cette opération entre en conflit avec des données existantes.';
    default:
      return fallback ?? 'Une erreur est survenue. Réessayez dans quelques instants.';
  }
}
