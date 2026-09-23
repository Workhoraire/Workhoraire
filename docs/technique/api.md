# API REST

Toutes les routes, sauf `/health`, exigent un jeton Keycloak (`Authorization: Bearer …`), puis un utilisateur applicatif actif. Le `companyId` n'est **jamais** fourni par le client.

- **Dates** : les jours sont au format `YYYY-MM-DD` ; les instants sont en ISO 8601 **avec fuseau** (`2026-09-23T08:00:00+02:00` ou `…Z`).
- **Erreurs** : format NestJS (`statusCode`, `message`). Les messages métier sont en anglais et traduits par le frontend (`core/http/error-message.ts`).

Colonne « Rôles » : **Tous** = ADMIN, MANAGER et EMPLOYEE ; **Équipe** = ADMIN et MANAGER.

## Compte

| Méthode et route | Rôles | Description |
|---|---|---|
| `GET /me` | Tous | Profil : rôle, contrat, entreprise (dont le fuseau) |
| `POST /onboarding/company` | Keycloak seul | Crée l'entreprise et son ADMIN |
| `POST /employee-invitations/:token/accept` | Keycloak seul | Accepte une invitation. Exige l'e-mail invité, vérifié si `KEYCLOAK_REQUIRE_VERIFIED_EMAIL=true` |

## Salariés (ADMIN)

| Méthode et route | Description |
|---|---|
| `GET /employees` | Liste des salariés de l'entreprise |
| `GET /employees/:id` | Détail d'un salarié |
| `PATCH /employees/:id` | Modifie `firstName`, `lastName`, `email`, `role`, `isActive`, `weeklyContractMinutes` (60 à 2880), `payrollId` (chaîne vide pour l'effacer) |
| `POST /employees/invitations` | Crée une invitation (`firstName`, `lastName`, `email`, `role?`, `weeklyContractMinutes?`) ; renvoie le jeton une seule fois |

## Pointage du salarié

| Méthode et route | Rôles | Corps | Description |
|---|---|---|---|
| `GET /time-clock/status` | Tous | – | Heure du serveur, pointage ouvert, journée, semaine, jours de la semaine |
| `POST /time-clock/clock-in` | Tous | `{ note? }` | Pointe l'arrivée. 409 si un pointage est déjà ouvert |
| `POST /time-clock/clock-out` | Tous | `{ note? }` | Pointe la sortie. 409 si aucun pointage n'est ouvert, ou s'il est ouvert depuis plus de 24 h |
| `POST /time-clock/close-open-entry` | Tous | `{ endAt, reason }` | Déclare l'heure de fin d'une sortie oubliée. Écrit dans la piste d'audit |
| `GET /time-clock/audit-logs?from&to` | Tous | – | Corrections apportées à **mes** pointages |

## Corrections (Équipe)

| Méthode et route | Corps | Description |
|---|---|---|
| `POST /time-entries` | `{ userId, startAt, endAt, note?, reason }` | Ajoute une période manuelle |
| `PATCH /time-entries/:id` | `{ startAt?, endAt?, note?, reason }` | Corrige une période ; renseigner `endAt` clôture un pointage ouvert |
| `DELETE /time-entries/:id` | `{ reason }` | Supprime une période (204). La piste d'audit est conservée |
| `GET /time-entries/audit-logs?from&to&employeeId?` | – | Piste d'audit de l'entreprise, filtrée par salarié si besoin |

Règles communes : motif obligatoire (500 caractères au plus), pas de chevauchement (409), pas de fin dans le futur, 24 h au plus par période. Un **MANAGER ne peut pas modifier ses propres heures** (403).

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
| `POST /absences/:id/cancel` | Tous | Annule ma demande : en attente, ou acceptée mais pas encore commencée |
| `GET /absences?status&from&to&employeeId` | Équipe | Demandes de l'entreprise |
| `POST /absences/:id/approve` | Équipe | `{ comment? }` ; 409 si déjà traitée ; 403 pour sa propre demande (MANAGER) |
| `POST /absences/:id/reject` | Équipe | Idem |

Types d'absence : `PAID_LEAVE`, `RTT`, `SICK_LEAVE`, `UNPAID_LEAVE`, `FAMILY_EVENT`, `OTHER`.

## Tableau de bord et exports (Équipe)

| Méthode et route | Description |
|---|---|
| `GET /dashboard/team` | Présents, sorties non pointées, absents, heures du jour et de la semaine, demandes en attente, alertes |
| `GET /exports/timesheets?from&to&granularity=week\|day` | CSV (`text/csv; charset=utf-8`, en pièce jointe), 62 jours au plus |
