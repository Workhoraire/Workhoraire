# WorkHoraire — site vitrine

Site public de WorkHoraire : accueil, fonctionnalités, tarifs (avec simulateur), sécurité, guide des heures supplémentaires et pages légales.

C'est une application Angular 20 **pré-rendue en HTML statique** au moment du build (`@angular/ssr`, `outputMode: "static"`) : chaque page existe en HTML complet, lisible par les moteurs de recherche, puis Angular prend le relais dans le navigateur. En production, un simple serveur de fichiers suffit, sans Node.js.

Le site n'utilise ni cookie, ni traceur, ni mesure d'audience. La police DM Sans est auto-hébergée (`@fontsource-variable/dm-sans`) : aucune requête ne part vers un service tiers.

## Commandes

```bash
npm install
npm start          # http://localhost:4400 (ng serve --port 4400)
npm run build      # build de production et pré-rendu de toutes les pages
npx ng test --watch=false --browsers=ChromeHeadless
```

## Fichiers produits

`npm run build` écrit le site dans **`dist/site/browser/`** :

- un `index.html` par page : `index.html`, `fonctionnalites/index.html`, `tarifs/index.html`, `securite/index.html`, `guides/index.html`, `guides/heures-supplementaires/index.html`, `mentions-legales/index.html`, `confidentialite/index.html`, `cgv/index.html` ;
- `404.html`, la page à renvoyer (avec le statut 404) pour une adresse inconnue ; elle est copiée depuis `404/index.html` par `scripts/copy-404.mjs` après le build ;
- les fichiers JavaScript et CSS, les polices (`media/`), les captures (`captures/`), `robots.txt` et `sitemap.xml`.

Le serveur web doit servir `/tarifs` avec `tarifs/index.html`, et `404.html` pour tout le reste. `index.csr.html` est généré par Angular mais n'est pas utilisé.

## Configuration

`src/environments/environment.ts` :

| Clé | Rôle | Valeur locale |
|---|---|---|
| `appUrl` | Adresse de l'application : liens « Se connecter », « Commencer gratuitement » (`/inscription?offre=decouverte`) et offre Essentiel (`/inscription?offre=essentiel`) | `http://localhost:4200` |
| `siteUrl` | Adresse publique du site : URL canoniques et balises Open Graph | `http://localhost:4400` |

`public/robots.txt` et `public/sitemap.xml` sont statiques et contiennent l'adresse du site en dur : les mettre à jour en même temps que `siteUrl`. Toute nouvelle page indexable doit aussi être ajoutée à `sitemap.xml`.

## Contenu à compléter avant la mise en ligne

Les mentions légales, la politique de confidentialité et les CGV contiennent des champs signalés « [À compléter : …] » (raison sociale, adresse, SIREN, directeur de la publication, hébergeur, contact pour les données, clauses des CGV). Aucune identité d'entreprise ni aucun engagement juridique n'a été inventé.

Les captures de `public/captures/` viennent de `docs/captures/` (données de démonstration fictives).
