# API REST

Toutes les routes, sauf `/health`, exigent un jeton Keycloak (`Authorization: Bearer …`), puis un utilisateur applicatif actif. Le `companyId` n'est **jamais** fourni par le client.

- **Dates** : les jours sont au format `YYYY-MM-DD` ; les instants sont en ISO 8601 **avec fuseau** (`2026-09-23T08:00:00+02:00` ou `…Z`).
- **Erreurs** : format NestJS (`statusCode`, `message`). Les messages métier sont en anglais et traduits par le frontend (`core/http/error-message.ts`).

Colonne « Rôles » : **Tous** = ADMIN, MANAGER et EMPLOYEE ; **Équipe** = ADMIN et MANAGER.

## Compte

| Méthode et route | Rôles | Description |
|---|---|---|
| `GET /me` | Tous | Profil : rôle, contrat, entreprise (dont le fuseau) |
| `POST /onboarding/company` | Keycloak seul | Crée l'entreprise et son ADMIN (`name`, `siret?`, `timezone?`, `firstName?`, `lastName?` : le nom de l'administrateur est saisi dans le formulaire, Keycloak ne le demande plus) |
| `GET /employee-invitations/:token` | **Public** (le lien suffit) | Aperçu de l'invitation pour la page d'accueil : prénom, nom, e-mail, rôle, entreprise, expiration. 404 si le lien est inconnu, 409 s'il a déjà servi, 410 s'il a expiré ou a été remplacé |
| `POST /employee-invitations/:token/accept` | Keycloak seul | Accepte une invitation. Exige l'e-mail invité (403 sinon), vérifié si `KEYCLOAK_REQUIRE_VERIFIED_EMAIL=true` ; 410 si le lien a expiré ou a été remplacé |

## Salariés (ADMIN)

| Méthode et route | Description |
|---|---|
| `GET /employees` | Liste des salariés de l'entreprise |
| `GET /employees/:id` | Détail d'un salarié |
| `PATCH /employees/:id` | Modifie `firstName`, `lastName`, `email`, `role`, `isActive`, `payrollId` (chaîne vide pour l'effacer ; 409 s'il est déjà attribué dans l'entreprise) et `weeklyContractMinutes` (60 à 2880). Le contrat est **historisé** : il s'applique à partir du lundi de la semaine de `contractEffectiveFrom` (`YYYY-MM-DD`, semaine en cours par défaut), et les semaines précédentes gardent l'ancien contrat (ADR 0007) |
| `POST /employees/invitations` | Crée une invitation (`firstName`, `lastName`, `email`, `role?`, `weeklyContractMinutes?`) et renvoie le jeton une seule fois. Une nouvelle invitation pour la même adresse **remplace** la précédente, dont le lien cesse de fonctionner (`replacesPrevious: true`) |

## Pointage du salarié

| Méthode et route | Rôles | Corps | Description |
|---|---|---|---|
| `GET /time-clock/status` | Tous | – | Heure du serveur, pointage ouvert, journée, semaine, jours de la semaine |
| `POST /time-clock/clock-in` | Tous | `{ note? }` | Pointe l'arrivée. 409 si un pointage est déjà ouvert |
| `POST /time-clock/clock-out` | Tous | `{ note? }` | Pointe la sortie. 409 si aucun pointage n'est ouvert, ou s'il est ouvert depuis plus de 12 h : il faut alors déclarer l'heure réelle |
| `POST /time-clock/close-open-entry` | Tous | `{ endAt, reason }` | Déclare l'heure de fin d'une sortie oubliée. Écrit dans la piste d'audit |
| `GET /time-clock/audit-logs?from&to` | Tous | – | Corrections apportées à **mes** pointages |

## Corrections (Équipe)

| Méthode et route | Corps | Description |
|---|---|---|
| `POST /time-entries` | `{ userId, startAt, endAt, note?, reason }` | Ajoute une période manuelle |
| `PATCH /time-entries/:id` | `{ startAt?, endAt?, note?, reason }` | Corrige une période : seuls les champs envoyés changent (`null` est refusé), et renseigner `endAt` clôture un pointage ouvert. Une période ne change pas de jour (400) : il faut la supprimer, puis en créer une autre |
| `DELETE /time-entries/:id` | `{ reason }` | Supprime une période (204). La piste d'audit est conservée |
| `GET /time-entries/audit-logs?from&to&employeeId?` | – | Piste d'audit de l'entreprise, filtrée par salarié si besoin |

Règles communes : motif obligatoire (500 caractères au plus), pas de chevauchement (409), pas de fin dans le futur, 24 h au plus par période. Un **MANAGER ne peut pas modifier ses propres heures** (403).

Concurrence : les écritures sur les heures d'un même salarié sont sérialisées (verrou de ligne), si bien que deux corrections simultanées ne peuvent pas créer de chevauchement. Si la période a changé entre la lecture et l'écriture, l'API répond 409 (« This time entry has changed, reload it and retry »).

## Feuilles de temps

| Méthode et route | Rôles | Description |
|---|---|---|
| `GET /timesheets/me?from&to` | Tous | Ma feuille : jours, semaines, totaux, alertes |
| `GET /timesheets/team?from&to` | Équipe | Toute l'équipe, jours fériés compris |
| `GET /timesheets/employees/:id?from&to` | Équipe | Un salarié ; 404 s'il appartient à une autre entreprise |

Période : 93 jours au plus. Les semaines renvoyées sont toujours complètes, du lundi au dimanche. Voir [moteur-de-calcul.md](moteur-de-calcul.md).

## Absences

| Méthode et route | Rôles | Description |
|---|---|---|
| `GET /absences/me?status&from&to` | Tous | Mes demandes |
| `POST /absences` | Tous | `{ type, startDate, endDate, startsAfternoon?, endsMorning?, comment? }` |
| `POST /absences/:id/cancel` | Tous | Annule ma demande : en attente, ou acceptée mais pas encore commencée. Le salarié est enregistré comme auteur de la décision (`reviewedBy`) |
| `GET /absences?status&from&to&employeeId` | Équipe | Demandes de l'entreprise |
| `POST /absences/:id/approve` | Équipe | `{ comment? }` ; 409 si déjà traitée, ou si la période chevauche une absence déjà acceptée ; 403 pour sa propre demande (MANAGER) |
| `POST /absences/:id/reject` | Équipe | Idem, sans le contrôle de chevauchement |
| `POST /absences/:id/revoke` | Équipe | `{ comment }` obligatoire. Annule une demande en attente ou acceptée, **même commencée** (retour anticipé, erreur). Le motif est visible par le salarié. 409 si la demande est déjà refusée ou annulée ; 403 pour sa propre demande (MANAGER) |

Types d'absence : `PAID_LEAVE`, `RTT`, `SICK_LEAVE`, `UNPAID_LEAVE`, `FAMILY_EVENT`, `OTHER`.

Si deux demandes qui se chevauchent sont envoyées en même temps, une seule est enregistrée : le salarié est verrouillé pendant le contrôle.

## Tableau de bord et exports (Équipe)

| Méthode et route | Description |
|---|---|
| `GET /dashboard/team` | Présents, sorties non pointées, absents, heures du jour et de la semaine, demandes en attente, alertes |
| `GET /exports/timesheets?from&to&granularity=week\|day` | CSV (`text/csv; charset=utf-8`, en pièce jointe), 62 jours au plus |
