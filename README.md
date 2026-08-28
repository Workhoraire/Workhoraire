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

La configuration partagee est presentee dans `.env.example`. Les commandes
Prisma utilisent directement le `.env` racine :

```bash
cd backend
npm run prisma:validate
```

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
`Users`. Attribuer ensuite un role realm parmi `ADMIN`, `MANAGER` ou
`EMPLOYEE` dans `Role mapping`.

Le backend utilise le client bearer-only `workhoraire-api`. Le client public
`workhoraire-web` est reserve a la future application Angular et ajoute
`workhoraire-api` comme audience des access tokens.

## Utilisateur applicatif

`GET /me` ne repose pas uniquement sur les claims Keycloak. Le `sub` du token
doit correspondre a `User.keycloakSubject` en base, et cet utilisateur doit
etre rattache a une `Company`. Le role utilise par l'application est celui de
la base (`ADMIN`, `MANAGER` ou `EMPLOYEE`). Une identité Keycloak inconnue est
refusee avec une reponse `403`.

La creation de la premiere societe et le rattachement des utilisateurs ne sont
pas encore exposes par une route publique. Cette etape sera implementee dans
le flux d'administration suivant.

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
