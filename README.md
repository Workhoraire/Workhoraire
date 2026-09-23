# WorkHoraire

Le pointage et le suivi des heures, simples et conformes, pour les TPE et PME françaises.

<p align="center">
  <img src="docs/captures/pointer.png" alt="Page « Pointer » d'une salariée : 7 h travaillées aujourd'hui, bouton « Reprendre le travail », détail de la journée et barres de la semaine" width="70%">
  &nbsp;
  <img src="docs/captures/pointer-mobile.png" alt="La même page sur téléphone, pendant une session en cours, avec le bouton orange « Pointer ma sortie » et la navigation en bas d'écran" width="24%">
</p>

- **Salariés** : pointer en un geste depuis leur téléphone, voir leur journée et leur semaine, déclarer une sortie oubliée, poser leurs absences, consulter chaque correction faite sur leurs heures.
- **Managers** : tableau de bord de l'équipe, heures par jour et par semaine, corrections tracées avec un motif obligatoire, validation et annulation des absences, alertes légales.
- **Dirigeants** : invitation des salariés par un simple lien, rôles, contrats datés, matricules de paie.
- **Paie** : exports CSV hebdomadaire (heures sup +25/+50 %, heures complémentaires +10/+25 %, absences par type, matricule) et journalier, lisibles directement dans Excel.

La vision produit, l'étude de marché, le cadre légal, la roadmap et la documentation technique sont dans [`docs/`](docs/README.md). Commencer par la [synthèse](docs/produit/00-synthese.md).

## Aperçu

> Captures réalisées avec des données de démonstration **fictives** : une boulangerie de 6 salariés, sur 3 semaines.

### Suivre l'équipe

| Tableau de bord | Heures de l'équipe |
|---|---|
| ![Tableau de bord : présents, sortie non pointée, demandes d'absence en attente et points de vigilance de la semaine](docs/captures/tableau-de-bord.png) | ![Tableau des heures de la semaine par salarié et par jour, avec les congés payés et une alerte](docs/captures/heures-equipe.png) |
| **Feuille de temps et corrections tracées** | **Validation des absences** |
| ![Feuille de temps d'une salariée : résumé de la semaine, périodes par jour, période marquée « Corrigé » avec sa note](docs/captures/feuille-de-temps.png) | ![Onglet « À valider » : une RTT et des congés payés, avec les boutons Refuser et Accepter](docs/captures/absences.png) |

### Paie et administration

| Exports pour la paie | Gestion de l'équipe |
|---|---|
| ![Page d'export : choix du mois, synthèse hebdomadaire et détail journalier en CSV](docs/captures/exports.png) | ![Page Salariés : formulaire d'invitation et liste des membres avec leur rôle, contrat et matricule](docs/captures/salaries.png) |

### Inviter un salarié : un lien, un mot de passe

L'administrateur génère un lien dans **Salariés** et le transmet. La personne invitée l'ouvre, voit quelle entreprise l'invite, puis choisit son mot de passe : son adresse est déjà remplie. Elle arrive ensuite directement dans l'entreprise, sur « Pointer ». Un lien perdu se régénère, et l'ancien cesse alors de fonctionner.

| 1. Le lien accueille la personne | 2. Il ne reste que le mot de passe |
|---|---|
| ![Page d'accueil de l'invitation : « Bonjour Nora », l'entreprise qui invite, l'adresse déjà renseignée et le bouton « Créer mon mot de passe »](docs/captures/invitation-accueil.png) | ![Page d'inscription Keycloak : adresse préremplie, mot de passe et confirmation seulement](docs/captures/invitation-mot-de-passe.png) |

## Stack

Angular 20 (standalone, Material 3) · NestJS 11 · Prisma 6 · PostgreSQL 16 · Keycloak 26 · Docker Compose. Les règles de développement sont dans [AGENTS.md](AGENTS.md).

## Démarrage rapide

```bash
cp .env.example .env            # puis remplacer les placeholders de mot de passe
docker compose up -d postgres keycloak
```

Dans un premier terminal, lancez l'API :

```bash
cd backend && npm install && npm run prisma:migrate:deploy && npm run start:dev
```

Dans un second terminal, lancez l'application :

```bash
cd frontend && npm install && npm start
```

- API : `http://localhost:3000` (santé : `GET /health`).
- Application : `http://localhost:4200`.
- Keycloak : `http://localhost:8180`.

Sur la page de connexion, **« Enregistrement »** crée un compte : seuls l'e-mail et le mot de passe sont demandés. Au premier accès, vous créez l'entreprise (avec votre prénom et votre nom) et vous en devenez l'administrateur. Vos salariés rejoignent ensuite l'entreprise par le lien d'invitation.

> Si le port 5432 est déjà occupé sur votre machine, changez `POSTGRES_PORT` dans `.env` et reportez le port dans `DATABASE_URL`.

> Votre Keycloak a été créé avant la configuration actuelle du realm ? Lancez une fois `node infrastructure/keycloak/apply-user-profile.mjs` pour que l'inscription ne demande plus le prénom ni le nom (voir [Keycloak local](#keycloak-local)).

## Configuration

Le `.env` à la racine est la source unique de configuration pour Docker, NestJS et Prisma. Il est ignoré par Git ; ne créez pas de second fichier de configuration dans `backend/`. Variables notables :

| Variable | Rôle |
|---|---|
| `DATABASE_URL` | Base applicative |
| `E2E_DATABASE_URL` | Base dédiée aux tests e2e, **vidée à chaque exécution** (son nom doit finir par `_e2e`) |
| `FRONTEND_URL` | Origine autorisée par CORS |
| `KEYCLOAK_*` | Serveur, realm et client de l'API ; compte administrateur de Keycloak |
| `KEYCLOAK_REQUIRE_VERIFIED_EMAIL` | Exige un e-mail vérifié pour accepter une invitation (`true` par défaut ; `false` seulement en local, sans SMTP : l'API refuse de démarrer avec `false` si `NODE_ENV=production`) |

La configuration publique du frontend (URL de l'API, realm et client Keycloak) est dans `frontend/src/environments/environment.ts`.

## Tests

```bash
cd backend && npm test               # unitaires (moteur de calcul, services, DTO)
cd backend && npm run test:e2e       # API complète sur une vraie base PostgreSQL (voir docs/technique/tests-et-qualite.md)
cd frontend && npx ng test --watch=false --browsers=ChromeHeadless
```

Au 23/09/2026 : 89 tests unitaires backend, 16 tests e2e et 31 tests frontend. Les tests e2e couvrent notamment la concurrence, l'isolation entre entreprises et la chaîne complète d'ajout d'un salarié. Le détail, les défauts trouvés en revue et le scénario de recette manuelle sont dans [docs/technique/tests-et-qualite.md](docs/technique/tests-et-qualite.md).

## Base de données

Les changements de schéma passent par des migrations Prisma (`backend/prisma/migrations`) :

```bash
cd backend
npm run prisma:validate
npm run prisma:migrate          # en développement : crée et applique une migration
npm run prisma:migrate:deploy   # applique les migrations existantes
```

Des contraintes `CHECK` complètent le schéma Prisma : une période se termine après son début, il y a un seul pointage ouvert par salarié, les dates d'absence sont cohérentes, et un changement de contrat prend effet un lundi. Voir [docs/technique/architecture.md](docs/technique/architecture.md).

## Utilisateurs, rôles et entreprises

- `GET /me` ne repose pas seulement sur les claims Keycloak. Le `sub` du jeton doit correspondre à `User.keycloakSubject` en base, et cet utilisateur doit être actif et rattaché à une `Company`. Une identité Keycloak inconnue est refusée (`403`), et un salarié désactivé voit une page qui le lui explique.
- Le rôle applicatif (`ADMIN`, `MANAGER` ou `EMPLOYEE`) est géré en base, pas par les rôles du realm Keycloak.
- Toutes les opérations utilisent l'entreprise de l'utilisateur authentifié : le frontend ne fournit jamais de `companyId`.
- **Invitations** : l'administrateur génère un lien valable 7 jours, qu'il transmet au salarié. Le lien ouvre une page d'accueil, puis l'inscription Keycloak avec l'adresse préremplie. Le mot de passe est saisi et géré par Keycloak, jamais par WorkHoraire. Le prénom, le nom, le rôle et le contrat viennent de l'invitation. Voir l'[ADR 0004](docs/technique/adr/0004-inscription-libre-et-email-verifie.md).

La liste complète des routes est dans [docs/technique/api.md](docs/technique/api.md).

## Keycloak local

Keycloak importe le realm `workhoraire` depuis `infrastructure/keycloak/realms/workhoraire-realm.json` : inscription ouverte, page de connexion en français, protection anti-brute-force, et profil utilisateur réduit (l'inscription ne demande que l'e-mail et le mot de passe).

- Le backend utilise le client *bearer-only* `workhoraire-api`.
- Le client public `workhoraire-web` sert à l'application Angular (Authorization Code + PKCE) et ajoute `workhoraire-api` comme audience des jetons.
- La console d'administration utilise `KEYCLOAK_ADMIN` et `KEYCLOAK_ADMIN_PASSWORD` du fichier `.env`.

### Partage du realm

Le fichier versionné est un export de configuration sans utilisateurs ni secret de production. **Un realm n'est importé qu'à sa première création.** Deux possibilités pour un Keycloak déjà créé :

- Pour reporter seulement le profil utilisateur (inscription par e-mail et mot de passe), sans perdre les comptes, lancez `node infrastructure/keycloak/apply-user-profile.mjs`. Ajoutez `--dry-run` pour un essai à blanc. Le script utilise le compte administrateur du `.env`.
- Pour repartir d'une configuration propre en local :

  ```bash
  docker compose down -v
  docker compose up -d postgres keycloak
  ```

  La commande `down -v` supprime les données locales PostgreSQL. Ne l'utilisez pas sur un environnement partagé ou de production.

Pour exporter une configuration mise à jour sans exporter les utilisateurs :

```bash
mkdir -p infrastructure/keycloak/exports
docker compose stop keycloak
docker compose run --rm --no-deps \
  -v "$PWD/infrastructure/keycloak/exports:/tmp/realm-export" \
  keycloak export --dir /tmp/realm-export --realm workhoraire --users skip
docker compose start keycloak
```

Vérifiez l'export et retirez toute donnée sensible avant de mettre à jour `infrastructure/keycloak/realms/workhoraire-realm.json`. Le dossier `infrastructure/keycloak/exports/` est ignoré par Git, car un export peut contenir des utilisateurs ou des secrets.

## Mise en production

Suivre la checklist de [docs/technique/securite-et-rgpd.md](docs/technique/securite-et-rgpd.md) : HTTPS, vérification des e-mails avec SMTP, MFA des administrateurs, hébergement dans l'UE, sauvegardes, contrat de sous-traitance RGPD.
