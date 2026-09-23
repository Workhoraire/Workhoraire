# Tests et qualité

Conformément à AGENTS.md, les tests portent sur les comportements métier critiques : authentification, autorisation, isolation des entreprises, pointage, calcul des heures et règles légales.

## 1. Pyramide de tests

| Niveau | Outil | Contenu | Commande |
|---|---|---|---|
| Unitaires backend | Jest | Moteur de calcul (fuseaux, heures sup, congés dans le seuil, heures complémentaires, alertes, jours fériés), services (isolation, rôles, conflits d'intérêts, audit, absences), DTO, CSV | `cd backend && npm test` |
| Intégration (e2e) backend | Jest + vraie base PostgreSQL | API HTTP complète : validation, gardes, SQL, contraintes, concurrence (5 pointages simultanés : 1 seul accepté), exports | `cd backend && npm run test:e2e` |
| Unitaires frontend | Karma + Jasmine (Chrome headless) | Formatage des durées et des dates, conversions de fuseau, libellés d’alertes, navigation selon le rôle, composant racine | `cd frontend && npx ng test --watch=false --browsers=ChromeHeadless` |
| Build | Angular CLI et Nest CLI | Compilation stricte (templates compris), budgets de taille | `npm run build` dans chaque dossier |

**Résultats au 23/09/2026** : 74 tests unitaires backend, 10 tests e2e et 11 tests frontend (dont la navigation selon le rôle), tous au vert. Builds OK : bundle initial de 469 kB, pour un budget de 500 kB.

## 2. Lancer les tests e2e

1. `docker compose up -d postgres`
2. La base `workhoraire_e2e` est créée automatiquement pour un volume neuf. Pour un volume existant, créez-la une fois :
   ```bash
   docker compose exec postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "CREATE DATABASE workhoraire_e2e"'
   ```
3. Renseignez `E2E_DATABASE_URL` dans `.env` (voir `.env.example`), puis lancez `cd backend && npm run test:e2e`.

La suite applique elle-même les migrations, **vide la base** et refuse de tourner sur une base dont le nom ne finit pas par `_e2e`. L'identité est simulée par un intergiciel de test qui produit le contenu d'un jeton Keycloak vérifié : le vrai garde Keycloak est donc exercé.

## 3. Recette visuelle

L'interface a été parcourue en taille mobile (375 × 812) sur des données réalistes : une boulangerie, 6 salariés, 3 semaines de pointages, des absences, une correction et un oubli de sortie. On a utilisé une copie locale de l'application, hors du dépôt, avec une identité simulée, **sans compte réel ni mot de passe**.

Défauts trouvés et corrigés pendant cette recette :
- **Sortie oubliée comptée « jusqu'à maintenant »** : 133 h dans la semaine, avec de fausses heures sup et de fausses alertes. Elle compte désormais 0 h et ne lève que l'alerte dédiée ; le tableau de bord la sépare des présents.
- **NG0950** sur la feuille de temps d'un salarié : un paramètre de route était lu dans le constructeur. Le chargement est maintenant réactif (`effect`).
- **Noms des salariés en majuscules** dans le tableau d'équipe, qui héritaient du style d'en-tête.
- **Lignes vides** (semaines sans activité) dans l'export hebdomadaire.
- **Libellé « Pauses »** renommé « Pauses et coupures ».
- Espacements des formulaires.

## 4. Scénario de recette manuelle (avant chaque mise en production)

1. **Inscription** : sur la page de connexion, choisir « Enregistrement », créer l'entreprise et vérifier l'arrivée sur le tableau de bord.
2. **Invitation** : dans Salariés, inviter un employé à 24 h/semaine avec un matricule, puis ouvrir le lien avec son compte : il arrive sur « Pointer ».
3. **Pointage** : pointer l'arrivée. Le bouton devient orange et le chronomètre tourne. Pointer la sortie : le total de la journée s'incrémente.
4. **Sortie oubliée** : laisser un pointage ouvert plus de 12 h, ou en créer un par l'API de test. La page « Pointer » demande l'heure de sortie ; le tableau de bord l'affiche en « Sorties non pointées ».
5. **Correction** : en manager, corriger une période avec un motif. Le salarié voit « Corrigé » et le motif dans « Mes heures ».
6. **Conflit d'intérêts** : un manager tente de corriger ses propres heures et reçoit un message explicite.
7. **Absences** : poser du 9 au 13 novembre 2026 : 4 jours ouvrés, le 11 novembre étant férié. La faire valider, puis vérifier qu'elle apparaît dans la feuille de temps.
8. **Export** : télécharger la synthèse du mois, l'ouvrir dans Excel, vérifier les accents, les décimales à virgule et les matricules.
9. **Mobile** : refaire les étapes 3 et 7 sur un téléphone ; la barre de navigation basse doit rester utilisable au pouce.

## 5. Ce qui manque encore

- Tests de composants Angular sur les pages (formulaires, états d'erreur) et tests de bout en bout dans le navigateur (Playwright), avec un Keycloak de test.
- Intégration continue : lancer les tests unitaires, le build et les tests e2e sur chaque pull request.
- Lint et formatage partagés (ESLint, Prettier).
- Test de charge de l'export mensuel pour 50 salariés.
