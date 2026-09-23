# Architecture

L'architecture suit [AGENTS.md](../../AGENTS.md) : un monolithe modulaire (Angular, NestJS, Prisma, PostgreSQL, Keycloak, Docker), sans nouveau framework ni nouveau service.

```text
Navigateur (Angular 20, mobile d'abord)
   │  OIDC Authorization Code + PKCE          ┌──────────────┐
   ├─────────────────────────────────────────▶│  Keycloak 26 │  comptes, mots de passe,
   │  Bearer access token (audience API)      └──────────────┘  inscription, anti-brute-force
   ▼
NestJS 11 (API REST)
   │  guards : Keycloak → utilisateur applicatif → rôle
   │  services métier (isolation par companyId)
   ▼
Prisma 6 ──▶ PostgreSQL 16 (schéma public ; Keycloak dans le schéma keycloak)
```

## 1. Modules backend

| Module | Rôle | Routes |
|---|---|---|
| `auth` | Vérifie le jeton Keycloak, charge l'utilisateur applicatif et son entreprise, contrôle les rôles | `GET /me` |
| `onboarding` | Crée l'entreprise et son premier ADMIN | `POST /onboarding/company` |
| `employees` | Salariés, invitations, contrat, matricule | `/employees`, `/employee-invitations` |
| `time-entries` | Pointage du salarié (`/time-clock`) ; corrections et piste d'audit (`/time-entries`) | voir [api.md](api.md) |
| `timesheets` | Feuilles de temps (moi, équipe, un salarié) ; **moteur de calcul** pur | `/timesheets` |
| `absences` | Demandes, validation, annulation | `/absences` |
| `dashboard` | Vue d'équipe du jour et de la semaine | `GET /dashboard/team` |
| `exports` | CSV pour la paie (hebdomadaire, journalier) | `GET /exports/timesheets` |
| `common/dates` | Dates locales dans le fuseau de l'entreprise, jours fériés, validation de période | – |

Chaque module suit le schéma `Controller → Service → Prisma`. Les contrôleurs restent minces, les règles métier sont dans les services, et les calculs dans des fonctions pures testées sans base.

## 2. Modèle de données

```text
Company 1─* User (salarié : rôle, contrat en vigueur, matricule, actif)
Company 1─* ContractPeriod (historique des contrats : durée hebdomadaire, date d'effet un lundi)
Company 1─* EmployeeInvitation (jeton haché, rôle, contrat)
Company 1─* TimeEntry (période de travail : startAt, endAt?, source CLOCK|MANUAL, note)
Company 1─* TimeEntryAuditLog (action, motif, avant/après en JSON ; pas de clé étrangère vers TimeEntry)
Company 1─* AbsenceRequest (type, statut, dates, demi-journées, validation)
```

Garanties en base (migrations `20260923100000_add_time_tracking_and_absences` et `20260923130000_add_contract_history`) :

| Garantie | Mécanisme |
|---|---|
| Un seul pointage ouvert par salarié, même en cas de requêtes simultanées | `TimeEntry.openUserId` vaut `userId` tant que la période est ouverte, avec un index unique |
| Cohérence d'une période | `CHECK (endAt > startAt)` ; `CHECK` liant `endAt` nul et `openUserId` renseigné |
| Absences cohérentes | `CHECK (endDate >= startDate)` |
| Contrat plausible | `CHECK (weeklyContractMinutes BETWEEN 60 AND 2880)`, sur `User` et `ContractPeriod` |
| Historique de contrat cohérent | Date d'effet un lundi (`CHECK (EXTRACT(ISODOW FROM "effectiveFrom") = 1)`), une seule période par salarié et par date |
| Matricule unique dans l'entreprise | Index unique `(companyId, payrollId)` |
| La piste d'audit survit à la suppression d'une période | `timeEntryId` sans clé étrangère ; `entryStartAt` sert au filtrage par période |
| Isolation par entreprise | `companyId` sur toutes les tables, repris de l'utilisateur authentifié, jamais du client |

Les instants sont stockés en UTC (`timestamp(3)`). Les jours sont calculés dans le fuseau de l'entreprise (`Company.timezone`) avec l'API `Intl` de Node.js, sans dépendance ajoutée (ADR 0003).

## 3. Sécurité applicative

- **Authentification** : Keycloak, via le client public `workhoraire-web` (PKCE). L'API est déclarée *bearer-only* (`workhoraire-api`), et l'audience du jeton est vérifiée.
- **Utilisateur applicatif** : le `sub` du jeton doit correspondre à un `User` actif, rattaché à une entreprise. Le rôle vient de la base, pas de Keycloak.
- **Autorisation** : `@Roles(...)` et `ApplicationRolesGuard`, plus des règles métier dans les services (le manager ne corrige pas ses propres heures).
- **Entrées** : `ValidationPipe` global en liste blanche, qui refuse les champs inconnus. Les instants doivent être au format ISO 8601 **avec fuseau**. Les dates d'une période sont validées et les périodes limitées à 93 jours (62 pour les exports).

Détail et checklist de production : [securite-et-rgpd.md](securite-et-rgpd.md).

## 4. Frontend

- Composants **standalone**, signaux, `OnPush`, formulaires réactifs, Angular Material 20 avec un thème **Material 3 aux couleurs de la marque** (`styles.scss`).
- **Mise en page** (`core/layout/shell`) : barre latérale sur ordinateur ; en mobile, barre supérieure et **navigation basse** adaptée au rôle.
- **Routes** chargées à la demande. Les gardes (`authGuard`, `companyGuard`, `managerGuard`, `adminGuard`) servent l'ergonomie ; **la sécurité reste côté API**.
- **Pages** :
  - `clock` : pointer ;
  - `my-time` : mes heures ;
  - `absences` ;
  - `dashboard` ;
  - `team` et `team/:employeeId` : feuilles de temps et corrections ;
  - `exports` ;
  - `employees`.
- **Composants partagés** (`shared/timesheet`) : navigateur de semaine, résumé de semaine, liste des jours, historique des corrections.
- **Dates** (`core/time/time-format.ts`) : affichage dans le fuseau de l'entreprise, jamais dans celui de l'appareil.
- **Polices auto-hébergées** (`@fontsource-variable/dm-sans`, `material-icons`) : aucun appel à un CDN tiers.

## 5. Flux clés

**Pointer**
1. `POST /time-clock/clock-in` crée une période ouverte, avec `startAt` = heure du serveur et `openUserId` = l'utilisateur.
2. En cas de conflit sur l'index unique, l'API répond 409 « déjà pointé ».
3. `POST /time-clock/clock-out` clôture la période ouverte. La mise à jour est conditionnée à `openUserId` pour éviter une double clôture.

**Corriger**
1. `PATCH /time-entries/:id` avec un motif.
2. Dans une transaction : verrou de la ligne du salarié (`SELECT … FOR UPDATE`), contrôle de chevauchement, mise à jour conditionnée à la version lue (`updatedAt`, sinon 409), puis écriture de `TimeEntryAuditLog` (avant/après).
3. Les demandes d'absence (création, validation) prennent le même verrou : deux demandes simultanées ne peuvent pas se chevaucher.

**Inviter**
1. L'ADMIN crée l'invitation (`POST /employees/invitations`) et transmet le lien.
2. Le lien ouvre une page d'accueil sans connexion (Keycloak en mode `check-sso` sur ces URL), qui lit l'aperçu public de l'invitation.
3. « Créer mon mot de passe » ouvre l'inscription Keycloak, adresse préremplie. Au retour, `POST /employee-invitations/:token/accept` rattache le compte à l'entreprise.

**Exporter**
1. `GET /exports/timesheets?granularity=week` calcule les feuilles de l'équipe sur des semaines complètes.
2. Le CSV est produit en UTF-8 avec BOM, séparé par `;`, protégé contre l'injection de formules.

## 6. Environnement local

- `docker compose up -d postgres keycloak`. Le realm est importé à la **première** création de la base Keycloak.
- Sur un Keycloak déjà créé, il faut reporter le profil utilisateur du realm, pour que l'inscription ne demande plus le prénom ni le nom. Lancer `node infrastructure/keycloak/apply-user-profile.mjs` (option `--dry-run` pour un essai à blanc). Le script lit le compte administrateur dans `.env` et envoie le profil du fichier de realm à l'API d'administration Keycloak.
- La base `workhoraire_e2e`, dédiée aux tests e2e, est créée par `infrastructure/postgres/init/02-e2e-database.sql`, mais seulement pour un volume neuf.
- Le `.env` à la racine est la source unique de configuration (voir `.env.example`). Si le port 5432 est déjà pris, changez `POSTGRES_PORT` et `DATABASE_URL`.
