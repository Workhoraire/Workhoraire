# API REST

Toutes les routes, sauf `GET /health`, l'aperçu d'invitation et le webhook Stripe, exigent un jeton Keycloak (`Authorization: Bearer …`). Toutes, sauf les deux routes marquées « Keycloak seul » (création de l'entreprise, acceptation d'une invitation), exigent aussi un utilisateur applicatif actif, rattaché à une entreprise. Le `companyId` n'est **jamais** fourni par le client.

- **Adresse e-mail** : celle de l'utilisateur applicatif est reprise du jeton dès que Keycloak l'a vérifiée. Aucune route ne permet de la modifier.
- **Lecture seule** : quand l'abonnement d'une entreprise est impayé depuis plus de 30 jours (et seulement si le paiement en ligne est configuré), toute route `POST`, `PUT`, `PATCH` ou `DELETE` répond **402**, sauf le pointage (`/time-clock/*`) et le paiement (`/billing/checkout`, `/billing/portal`). Les lectures et les exports restent ouverts. Les routes sans utilisateur applicatif (création de l'entreprise, acceptation d'une invitation, webhook Stripe) ne sont pas concernées.
- **Limite de requêtes** : 300 par minute et par adresse IP (`THROTTLE_LIMIT_PER_MINUTE`), 20 par minute pour l'aperçu d'invitation et pour la création d'invitations ; au-delà, **429**. `GET /health` et le webhook Stripe ne sont pas limités.

- **Dates** : les jours sont au format `YYYY-MM-DD` ; les instants sont en ISO 8601 **avec fuseau** (`2026-09-23T08:00:00+02:00` ou `…Z`).
- **Validation** : un champ inconnu ou mal formé répond **400**. Les prénoms, les noms et le nom de l'entreprise refusent les adresses web (`://` ou `www.`), car ils sont recopiés dans les e-mails.
- **Erreurs** : format NestJS (`statusCode`, `message`). Les messages métier sont en anglais et traduits par le frontend (`core/http/error-message.ts`).

Colonne « Rôles » : **Tous** = ADMIN, MANAGER et EMPLOYEE ; **Équipe** = ADMIN et MANAGER.

## Santé

| Méthode et route | Rôles | Description |
|---|---|---|
| `GET /health` | **Public** | Répond `{"status":"ok"}`. Sert de contrôle de santé à l'image Docker de l'API et à la surveillance externe |

## Compte

| Méthode et route | Rôles | Description |
|---|---|---|
| `GET /me` | Tous | Profil : rôle, contrat, entreprise (dont le fuseau) |
| `GET /me/data-export` | Tous | Fichier JSON de toutes les données de la personne connectée : profil, contrats, pointages, absences, corrections (articles 15 et 20 du RGPD). Uniquement les siennes |
| `POST /onboarding/company` | Keycloak seul | Crée l'entreprise et son ADMIN (`name`, `siret?`, `timezone?`, `firstName?`, `lastName?` : le nom de l'administrateur est saisi dans le formulaire, Keycloak ne le demande plus). `acceptTerms: true` est obligatoire : l'API enregistre la date et la version des CGV et du contrat de sous-traitance acceptés. 400 si le nom (2 à 120 caractères), le SIRET (14 chiffres) ou le fuseau sont invalides ; 403 si l'adresse du compte n'est pas vérifiée par Keycloak (quand `KEYCLOAK_REQUIRE_VERIFIED_EMAIL=true`, valeur par défaut) ; 409 si le compte est déjà rattaché à une entreprise ou si le SIRET est déjà utilisé |
| `GET /employee-invitations/:token` | **Public** (le lien suffit) | Aperçu de l'invitation pour la page d'accueil : prénom, nom, e-mail, rôle, entreprise, expiration. 404 si le lien est inconnu, 409 s'il a déjà servi, 410 s'il a expiré ou a été remplacé |
| `POST /employee-invitations/:token/accept` | Keycloak seul | Accepte une invitation. Exige l'e-mail invité (403 sinon), vérifié si `KEYCLOAK_REQUIRE_VERIFIED_EMAIL=true` ; 404 si le lien est inconnu ; 409 s'il a déjà servi ou si le compte est déjà rattaché à une entreprise ; 410 s'il a expiré ou a été remplacé |

## Salariés (ADMIN)

| Méthode et route | Description |
|---|---|
| `GET /employees` | Liste des salariés de l'entreprise |
| `GET /employees/:id` | Détail d'un salarié |
| `PATCH /employees/:id` | Modifie `firstName`, `lastName`, `role`, `isActive`, `payrollId` (chaîne vide pour l'effacer ; 409 s'il est déjà attribué dans l'entreprise) et `weeklyContractMinutes` (60 à 2880). L'adresse e-mail n'est pas modifiable : c'est celle du compte de connexion, reprise de Keycloak. Le contrat est **historisé** : il s'applique à partir du lundi de la semaine de `contractEffectiveFrom` (`YYYY-MM-DD`, semaine en cours par défaut), et les semaines précédentes gardent l'ancien contrat (ADR 0007). 400 si `contractEffectiveFrom` est envoyé sans `weeklyContractMinutes` ou si aucun champ n'est envoyé ; 403 si un administrateur se désactive ou se retire le rôle ADMIN ; 404 pour un salarié d'une autre entreprise. Un administrateur qui perd ce rôle ou son accès voit expirer les invitations qu'il avait envoyées |
| `POST /employees/invitations` | Crée une invitation (`firstName`, `lastName`, `email`, `role?`, `weeklyContractMinutes?`) et renvoie le jeton une seule fois. Quand un serveur SMTP est configuré, le lien part aussi par e-mail à l'adresse invitée : `emailSent` indique si le serveur l'a accepté. Une nouvelle invitation pour la même adresse **remplace** la précédente, dont le lien cesse de fonctionner (`replacesPrevious: true`). 400 si un nom contient une adresse web ; 409 si l'adresse est déjà celle d'un salarié de l'entreprise ; 429 au-delà de 20 invitations par minute ou de 100 par 24 h pour l'entreprise |

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

## Abonnement

| Méthode et route | Rôles | Description |
|---|---|---|
| `GET /billing` | ADMIN | Offre, statut, salariés actifs du mois et du mois précédent, montants estimés, échéance du délai de paiement, lecture seule, paiement en ligne ouvert ou non |
| `POST /billing/checkout` | ADMIN | Renvoie l'adresse d'une page Stripe Checkout pour souscrire l'offre Essentiel. 409 si un abonnement est déjà en cours, 503 si le paiement en ligne n'est pas configuré |
| `POST /billing/portal` | ADMIN | Renvoie l'adresse de l'espace client Stripe : factures, moyen de paiement, résiliation. 409 s'il n'y a pas encore de client Stripe, 503 si le paiement en ligne n'est pas configuré |
| `POST /billing/webhook` | **Stripe** (signature `Stripe-Signature`) | Événements d'abonnement et de facture. 400 si la signature est absente ou fausse, 503 si le paiement en ligne n'est pas configuré ; un événement déjà traité est ignoré |
