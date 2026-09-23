# WorkHoraire

Le pointage et le suivi des heures, simples et conformes, pour les TPE et PME françaises.

- **Salariés** : pointer en un geste, voir sa journée et sa semaine, déclarer une sortie oubliée, poser ses absences.
- **Managers et dirigeants** : tableau de bord de l'équipe, heures par jour et par semaine, corrections tracées avec motif, validation des absences, alertes légales.
- **Paie** : exports CSV hebdomadaire (heures sup +25/+50 %, heures complémentaires +10/+25 %, absences, matricule) et journalier.

La vision produit, l'étude de marché, le cadre légal, la roadmap et la documentation technique sont dans [`docs/`](docs/README.md). Commencer par la [synthèse](docs/produit/00-synthese.md).

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

Sur la page de connexion, **« Enregistrement »** crée un compte. Au premier accès, l'onboarding crée l'entreprise, et vous en devenez l'administrateur.

> Si le port 5432 est déjà occupé sur votre machine, changez `POSTGRES_PORT` dans `.env` et reportez le port dans `DATABASE_URL`.

## Configuration

Le `.env` à la racine est la source unique de configuration pour Docker, NestJS et Prisma. Il est ignoré par Git ; ne créez pas de second fichier de configuration dans `backend/`. Variables notables :

| Variable | Rôle |
|---|---|
| `DATABASE_URL` | Base applicative |
| `E2E_DATABASE_URL` | Base dédiée aux tests e2e, **vidée à chaque exécution** (son nom doit finir par `_e2e`) |
| `FRONTEND_URL` | Origine autorisée par CORS |
| `KEYCLOAK_*` | Serveur, realm et client de l'API |
| `KEYCLOAK_REQUIRE_VERIFIED_EMAIL` | Exige un e-mail vérifié pour accepter une invitation (`true` par défaut ; `false` seulement en local, sans SMTP) |

La configuration publique du frontend (URL de l'API, realm et client Keycloak) est dans `frontend/src/environments/environment.ts`.

## Tests

```bash
cd backend && npm test               # unitaires (moteur de calcul, services, DTO)
cd backend && npm run test:e2e       # API complète sur une vraie base PostgreSQL (voir docs/technique/tests-et-qualite.md)
cd frontend && npx ng test --watch=false --browsers=ChromeHeadless
```

## Base de données

Les changements de schéma passent par des migrations Prisma (`backend/prisma/migrations`) :

```bash
cd backend
npm run prisma:validate
npm run prisma:migrate          # en développement : crée et applique une migration
npm run prisma:migrate:deploy   # applique les migrations existantes
```

Des contraintes `CHECK` complètent le schéma Prisma : une période se termine après son début, il y a un seul pointage ouvert par salarié, les dates d'absence sont cohérentes. Voir [docs/technique/architecture.md](docs/technique/architecture.md).

## Utilisateurs, rôles et entreprises

- `GET /me` ne repose pas seulement sur les claims Keycloak. Le `sub` du jeton doit correspondre à `User.keycloakSubject` en base, et cet utilisateur doit être actif et rattaché à une `Company`. Une identité Keycloak inconnue est refusée (`403`).
- Le rôle applicatif (`ADMIN`, `MANAGER` ou `EMPLOYEE`) est géré en base, pas par les rôles du realm Keycloak.
- Toutes les opérations utilisent l'entreprise de l'utilisateur authentifié : le frontend ne fournit jamais de `companyId`.
- **Invitations** : l'administrateur génère un lien valable 7 jours, qu'il transmet au salarié. Le salarié crée son compte (ou se connecte) avec l'adresse invitée, puis ouvre le lien. Son mot de passe reste géré par Keycloak.

La liste complète des routes est dans [docs/technique/api.md](docs/technique/api.md).

## Keycloak local

Keycloak importe le realm `workhoraire` depuis `infrastructure/keycloak/realms/workhoraire-realm.json` : inscription ouverte, page de connexion en français, protection anti-brute-force.

- Le backend utilise le client *bearer-only* `workhoraire-api`.
- Le client public `workhoraire-web` sert à l'application Angular (Authorization Code + PKCE) et ajoute `workhoraire-api` comme audience des jetons.
- La console d'administration utilise `KEYCLOAK_ADMIN` et `KEYCLOAK_ADMIN_PASSWORD` du fichier `.env`.

### Partage du realm

Le fichier versionné est un export de configuration sans utilisateurs ni secret de production. **Un realm n'est importé qu'à sa première création.** Pour repartir d'une configuration propre en local :

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
