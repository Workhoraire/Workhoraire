# Workhoraire
Un SaaS destiné aux entreprises souhaitant moderniser leur système de pointage.

## Backend

Le backend NestJS se trouve dans `backend/`.

```bash
cp .env.example .env
cd backend
npm install
npm run start:dev
```

L'endpoint de santé est disponible sur `GET http://localhost:3000/health`.
L'identité courante est disponible sur `GET http://localhost:3000/me` avec un
access token Keycloak dans l'en-tête `Authorization: Bearer ...`.

Le fichier `.env` racine est la source unique de configuration locale pour
Docker, NestJS et Prisma. Il est ignore par Git. Pour lancer PostgreSQL et
Keycloak en local, copiez d'abord `.env.example` vers `.env` et remplacez les
placeholders de mot de passe :

```bash
docker compose up -d postgres keycloak
```

Le backend autorise les appels navigateur provenant de `FRONTEND_URL`, defini
par defaut sur `http://localhost:4200`.

## Frontend

Le frontend Angular standalone se trouve dans `frontend/`. Sa configuration
publique (URL API, realm et client Keycloak) est dans
`frontend/src/environments/environment.ts`.

```bash
cd frontend
npm install
npm start
```

L'application est ensuite disponible sur `http://localhost:4200`. Elle utilise
le client public `workhoraire-web` avec Authorization Code + PKCE, puis charge
le profil applicatif via `GET /me`.

Un utilisateur Keycloak qui n'est pas encore rattaché à une entreprise est
redirigé vers l'onboarding. Le formulaire appelle `POST /onboarding/company`
avec le nom, le SIRET facultatif et le fuseau horaire. La création de la
`Company` et du premier `User` ADMIN est réalisée dans une transaction.

La configuration partagee est presentee dans `.env.example`. Les commandes
Prisma utilisent directement le `.env` racine :

```bash
cd backend
npm run prisma:validate
```

## Gestion des employés

Le modèle `User` représente directement un employé rattaché à une `Company`.
Il contient son prénom, son nom, son e-mail, son rôle et son statut actif.
L'interface de gestion est disponible sur `/employees` pour les utilisateurs
ayant le rôle `ADMIN`.

Les endpoints principaux sont :

```text
GET   /employees
GET   /employees/:id
PATCH /employees/:id
POST  /employees/invitations
POST  /employee-invitations/:token/accept
```

Toutes les opérations d'administration utilisent l'entreprise de l'utilisateur
authentifié. Le frontend ne fournit jamais de `companyId`.

La première version des invitations génère un lien à copier et à transmettre
au salarié. Il doit disposer d'un compte dans le realm Keycloak et se connecter
avec l'adresse invitée avant d'ouvrir le lien. L'acceptation crée son `User`
dans la bonne entreprise ; le mot de passe reste entièrement géré par
Keycloak et n'est jamais demandé ni stocké par WorkHoraire. L'envoi d'e-mails
automatique sera ajouté avec la configuration SMTP de Keycloak.

## Keycloak local

Le service Keycloak est expose sur `http://localhost:8180` et importe
automatiquement le realm `workhoraire` depuis
`infrastructure/keycloak/realms/workhoraire-realm.json`.

```bash
docker compose up -d postgres keycloak
```

Le backend charge le `.env` racine. Il ne faut pas créer de second fichier de
configuration dans `backend/`.

```bash
cd backend
npm run start:dev
```

Le compte administrateur utilise les valeurs `KEYCLOAK_ADMIN` et
`KEYCLOAK_ADMIN_PASSWORD` du fichier `.env`. Apres connexion a la console,
selectionner le realm `workhoraire`, puis creer les utilisateurs dans
`Users` si un compte Keycloak doit être préparé pour une invitation. Le rôle
applicatif (`ADMIN`, `MANAGER` ou `EMPLOYEE`) est géré par WorkHoraire en base,
et non par les rôles realm Keycloak.

Le backend utilise le client bearer-only `workhoraire-api`. Le client public
`workhoraire-web` est utilise par l'application Angular et ajoute
`workhoraire-api` comme audience des access tokens.

## Utilisateur applicatif

`GET /me` ne repose pas uniquement sur les claims Keycloak. Le `sub` du token
doit correspondre a `User.keycloakSubject` en base, et cet utilisateur doit
etre rattache a une `Company`. Le role utilise par l'application est celui de
la base (`ADMIN`, `MANAGER` ou `EMPLOYEE`). Une identité Keycloak inconnue est
refusee avec une reponse `403`.

La creation de la premiere societe et le rattachement initial sont realises par
le parcours d'onboarding apres authentification Keycloak. Les employes suivants
rejoignent une entreprise via une invitation generee par son administrateur.

## Partage du realm

Le fichier versionne est un export de configuration sans utilisateurs ni
secret de production. Un realm est importe automatiquement uniquement lors de
sa premiere creation. Pour repartir d'une configuration propre en local :

```bash
docker compose down -v
docker compose up -d postgres keycloak
```

La commande `down -v` supprime les donnees locales PostgreSQL. Ne pas l'utiliser
sur un environnement partage ou de production.

Pour exporter une configuration mise a jour sans exporter les utilisateurs :

```bash
mkdir -p infrastructure/keycloak/exports
docker compose stop keycloak
docker compose run --rm --no-deps \
  -v "$PWD/infrastructure/keycloak/exports:/tmp/realm-export" \
  keycloak export --dir /tmp/realm-export --realm workhoraire --users skip
docker compose start keycloak
```

Verifier l'export, retirer toute donnee sensible, puis mettre a jour
`infrastructure/keycloak/realms/workhoraire-realm.json`. Le dossier
`infrastructure/keycloak/exports/` est ignore par Git car un export peut
contenir des utilisateurs ou des secrets.
