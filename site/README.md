# WorkHoraire — site vitrine

Site public de WorkHoraire : accueil, fonctionnalités, tarifs (avec simulateur), sécurité, guides (heures supplémentaires, information des salariés) et pages légales (mentions légales, confidentialité, CGV, contrat de sous-traitance).

C'est une application Angular 20 **prérendue en HTML statique** au moment du build (`@angular/ssr`, `outputMode: "static"`) : chaque page existe en HTML complet, lisible par les moteurs de recherche, puis Angular prend le relais dans le navigateur. En production, un simple serveur de fichiers suffit, sans Node.js.

Le site n'utilise ni cookie, ni traceur, ni mesure d'audience. La police DM Sans est auto-hébergée (`@fontsource-variable/dm-sans`) : aucune requête ne part vers un service tiers.

## Commandes

```bash
npm install
npm start          # http://localhost:4400 (ng serve --port 4400)
npm run build      # build de production et prérendu de toutes les pages
npx ng test --watch=false --browsers=ChromeHeadless
```

## Fichiers produits

`npm run build` écrit le site dans **`dist/site/browser/`** :

- un `index.html` par page : `index.html`, `fonctionnalites/index.html`, `tarifs/index.html`, `securite/index.html`, `guides/index.html`, `guides/heures-supplementaires/index.html`, `guides/informer-les-salaries/index.html`, `mentions-legales/index.html`, `confidentialite/index.html`, `cgv/index.html`, `sous-traitance/index.html` ;
- `404.html`, la page à renvoyer (avec le statut 404) pour une adresse inconnue ; elle est copiée depuis `404/index.html` par `scripts/copy-404.mjs` après le build ;
- les fichiers JavaScript et CSS, les polices (`media/`), les captures (`captures/`), `robots.txt` et `sitemap.xml`.

Le serveur web doit servir `/tarifs` avec `tarifs/index.html`, et `404.html` pour tout le reste. `index.csr.html` est généré par Angular mais n'est pas utilisé.

## Configuration

`src/environments/environment.ts` :

| Clé | Rôle | Valeur locale |
|---|---|---|
| `appUrl` | Adresse de l'application : liens « Se connecter », « Commencer gratuitement » (`/inscription?offre=decouverte`) et offre Essentiel (`/inscription?offre=essentiel`) | `http://localhost:4200` |
| `siteUrl` | Adresse publique du site : URL canoniques et balises Open Graph | `http://localhost:4400` |

`public/robots.txt` et `public/sitemap.xml` sont statiques et contiennent l'adresse locale du site. Pour la production, `scripts/set-urls.mjs`, lancé par l'image Docker avec `SITE_URL` et `APP_URL`, remplace les adresses locales par les adresses publiques dans ces deux fichiers et dans `environment.ts`. Toute nouvelle page indexable doit aussi être ajoutée à `sitemap.xml`.

## Contenu à compléter avant la mise en ligne

L'identité de l'éditeur se renseigne dans `src/app/core/legal/legal-info.json` : dénomination, forme juridique, adresse du siège, immatriculation (RCS ou SIREN), régime de TVA et numéro de TVA, e-mail et téléphone de contact, directeur de la publication. L'hébergeur (OVH SAS) y est déjà. Tant qu'un de ces champs vaut `null`, les mentions légales, la politique de confidentialité, les CGV et le contrat de sous-traitance affichent « [À compléter : …] ». Pour une adresse publique, `scripts/set-urls.mjs` refuse de construire le site tant qu'un champ obligatoire manque. Aucune identité d'entreprise ni aucun engagement juridique n'a été inventé.

Les captures de `public/captures/` viennent de `docs/captures/` (données de démonstration fictives).
