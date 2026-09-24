# WorkHoraire — application

Application Angular 20 des salariés, managers et administrateurs : pointage, heures, absences, heures de l'équipe, exports pour la paie, salariés et abonnement.

La présentation, le démarrage de toute la pile (base, Keycloak, API) et les règles de développement sont dans le [README à la racine](../README.md). L'architecture de l'application est décrite dans [docs/technique/architecture.md](../docs/technique/architecture.md) (§ 4).

## Commandes

```bash
npm install
npm start          # http://localhost:4200 (ng serve)
npm run build      # build de production dans dist/frontend/browser/
npx ng test --watch=false --browsers=ChromeHeadless
```

L'API (`http://localhost:3000`) et Keycloak (`http://localhost:8180`) doivent tourner : voir le démarrage rapide du README à la racine.

## Configuration

`src/environments/environment.ts` donne les adresses utilisées par `ng serve` : API, site vitrine et Keycloak (realm `workhoraire`, client `workhoraire-web`). Dans l'image Docker, `docker/entrypoint.sh` écrit au démarrage `/config.json` à partir des variables `API_URL`, `KEYCLOAK_URL` et `SITE_URL`, et ce fichier remplace ces adresses (`src/app/core/config/runtime-config.ts`) : la même image sert dans tous les environnements.
