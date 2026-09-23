import { HttpErrorResponse } from '@angular/common/http';

/** French messages for the business errors returned by the API. */
const KNOWN_MESSAGES: Record<string, string> = {
  'You are already clocked in': 'Votre arrivée est déjà pointée.',
  'You are not clocked in': 'Vous n’avez pas de pointage en cours.',
  'The clock-out time must be after the clock-in time':
    'L’heure de sortie doit être postérieure à l’heure d’arrivée.',
  'This entry has been open for more than 24 hours: declare its end time':
    'Ce pointage est ouvert depuis plus de 24 h : indiquez l’heure réelle de votre sortie.',
  'The end time must be after the start time': 'L’heure de fin doit être après l’heure de début.',
  'An entry cannot end in the future': 'Une période ne peut pas se terminer dans le futur.',
  'An entry cannot start in the future': 'Une période ne peut pas commencer dans le futur.',
  'An entry cannot last more than 24 hours': 'Une période ne peut pas dépasser 24 heures.',
  'This period overlaps another time entry of the employee':
    'Cette période chevauche un autre pointage du salarié.',
  'A manager cannot modify their own time entries':
    'Un manager ne peut pas corriger ses propres heures : demandez-le à un administrateur.',
  'Time entry not found': 'Ce pointage n’existe plus. Actualisez la page.',
  'This period overlaps another absence request':
    'Cette période chevauche une autre demande d’absence.',
  'The request does not cover any working day': 'La demande ne couvre aucun jour ouvré.',
  'The end date must be on or after the start date':
    'La date de fin doit être égale ou postérieure à la date de début.',
  'A single day cannot start in the afternoon and end in the morning':
    'Une journée ne peut pas commencer l’après-midi et finir le matin.',
  'A manager cannot review their own absence request':
    'Un manager ne peut pas valider sa propre demande : un administrateur doit le faire.',
  'This absence request has already been reviewed': 'Cette demande a déjà été traitée.',
  'This absence request can no longer be cancelled': 'Cette demande ne peut plus être annulée.',
  'This absence request has changed, reload it and retry':
    'Cette demande a été modifiée entre-temps. Actualisez la page.',
  'Employee not found': 'Salarié introuvable.',
};

export function apiErrorMessage(response: HttpErrorResponse, fallback?: string): string {
  const message = response.error?.message;
  const first = Array.isArray(message) ? message[0] : message;

  if (typeof first === 'string' && KNOWN_MESSAGES[first]) {
    return KNOWN_MESSAGES[first];
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
    case 404:
      return 'Élément introuvable. Actualisez la page.';
    case 409:
      return fallback ?? 'Cette opération entre en conflit avec des données existantes.';
    default:
      return fallback ?? 'Une erreur est survenue. Réessayez dans quelques instants.';
  }
}
