# Tests et qualité

Conformément à AGENTS.md, les tests portent sur les comportements métier critiques : authentification, autorisation, isolation des entreprises, pointage, calcul des heures et règles légales.

## 1. Pyramide de tests

| Niveau | Outil | Contenu | Commande |
|---|---|---|---|
| Unitaires backend | Jest | Moteur de calcul (fuseaux, heures sup, congés dans le seuil, congé travaillé, nuit du dimanche au lundi, contrat par semaine, heures complémentaires, alertes, jours fériés), services (isolation, rôles, conflits d'intérêts, audit, verrous, absences, contrats, invitations), DTO, CSV | `cd backend && npm test` |
| Intégration (e2e) backend | Jest + vraie base PostgreSQL | API HTTP complète : validation, gardes, SQL, contraintes, concurrence (5 pointages simultanés : 1 seul accepté ; 3 demandes d'absence simultanées : 1 seule acceptée), annulation d'absence par le manager, historique de contrat, invitation remplacée, **chaîne complète d'ajout d'un salarié** (invitation, acceptation, premier pointage, visibilité chez l'admin, rôle, désactivation, réactivation, cas refusés), exports | `cd backend && npm run test:e2e` |
| Unitaires frontend | Karma + Jasmine (Chrome headless) | Formatage des durées et des dates, conversions de fuseau, libellés d’alertes, traduction des erreurs de l'API, champs réellement modifiés dans une correction, page d'invitation (accueil sans compte, création du mot de passe, liens expirés) et ses messages, gardes de compte (sans entreprise, désactivé), navigation selon le rôle, composant racine | `cd frontend && npx ng test --watch=false --browsers=ChromeHeadless` |
| Build | Angular CLI et Nest CLI | Compilation stricte (templates compris), budgets de taille | `npm run build` dans chaque dossier |

**Résultats au 23/09/2026** : 89 tests unitaires backend, 16 tests e2e et 31 tests frontend, tous au vert. Builds OK : bundle initial de 458 kB, pour un budget de 500 kB.

## 2. Lancer les tests e2e

1. `docker compose up -d postgres`
2. La base `workhoraire_e2e` est créée automatiquement pour un volume neuf. Pour un volume existant, créez-la une fois :
   ```bash
   docker compose exec postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "CREATE DATABASE workhoraire_e2e"'
   ```
3. Renseignez `E2E_DATABASE_URL` dans `.env` (voir `.env.example`), puis lancez `cd backend && npm run test:e2e`.

La suite applique elle-même les migrations et **vide la base**. Elle refuse de tourner sur une base dont le nom ne finit pas par `_e2e` : le nom est contrôlé dans `E2E_DATABASE_URL` avant même les migrations. L'identité est simulée par un intergiciel de test qui produit le contenu d'un jeton Keycloak vérifié : le vrai garde Keycloak est donc exercé.

## 3. Recette visuelle

L'interface a été parcourue en taille mobile (375 × 812) sur des données réalistes : une boulangerie, 6 salariés, 3 semaines de pointages, des absences, une correction et un oubli de sortie. On a utilisé une copie locale de l'application, hors du dépôt, avec une identité simulée, **sans compte réel ni mot de passe**.

Défauts trouvés et corrigés pendant cette recette :
- **Sortie oubliée comptée « jusqu'à maintenant »** : 133 h dans la semaine, avec de fausses heures sup et de fausses alertes. Elle compte désormais 0 h et ne lève que l'alerte dédiée ; le tableau de bord la sépare des présents.
- **NG0950** sur la feuille de temps d'un salarié : un paramètre de route était lu dans le constructeur. Le chargement est maintenant réactif (`effect`).
- **Noms des salariés en majuscules** dans le tableau d'équipe, qui héritaient du style d'en-tête.
- **Lignes vides** (semaines sans activité) dans l'export hebdomadaire.
- **Libellé « Pauses »** renommé « Pauses et coupures ».
- Espacements des formulaires.

## 4. Revue de code et recette du 23/09/2026

Une revue complète du code, puis une recette faite avec de vrais comptes Keycloak, ont trouvé les défauts suivants. Tous sont corrigés et couverts par des tests.

| Défaut | Correction |
|---|---|
| Modifier la durée d'un contrat recalculait toutes les semaines passées : des heures sup déjà payées changeaient de nature | Historique des contrats daté d'un lundi (ADR 0007) |
| Une nuit du dimanche au lundi comptait entièrement dans la semaine du dimanche | Coupure au lundi 0 h pour les totaux hebdomadaires |
| Un congé payé était crédité même un jour travaillé, ce qui inventait des heures sup | Pas de crédit ce jour-là, et alerte « heures pointées pendant une absence » |
| Une absence acceptée ne pouvait plus être annulée une fois commencée (retour anticipé) | Annulation par un manager, avec un motif visible du salarié |
| Deux demandes d'absence simultanées pouvaient se chevaucher ; une demande chevauchant une absence acceptée pouvait être validée | Verrou par salarié ; contrôle à la validation |
| Deux corrections simultanées pouvaient se chevaucher ou s'écraser sans prévenir | Verrou par salarié et verrou optimiste (409) |
| Une correction pouvait déplacer une période sur un autre jour, hors de l'historique de ce jour | Refusée : il faut supprimer puis recréer |
| Pointer la sortie « maintenant » restait possible jusqu'à 24 h d'oubli | Refusé au-delà de 12 h, comme la règle de sortie oubliée |
| Corriger seulement la note renvoyait les heures sans leurs secondes : fausse modification dans l'historique | Seuls les champs modifiés sont envoyés |
| Messages d'erreur de l'API affichés en anglais | Traduits en français |
| Pointeuse : un poste de nuit en cours s'ajoutait au jour courant ; la date d'arrivée d'une sortie oubliée suivait le champ de saisie ; l'historique suivait le fuseau de l'appareil | Rattachement au jour du début ; date tirée du pointage ; fuseau de l'entreprise |
| Navigation rapide entre les semaines : une réponse tardive pouvait afficher la mauvaise semaine | La requête précédente est annulée |
| Demandes à valider masquées au-delà de 500 demandes dans l'historique | Chargées à part |
| Matricule de paie en double possible | Unique dans l'entreprise |
| Tests e2e : migrations lancées avant le contrôle du nom de la base | Contrôle en premier |
| Vérification de l'e-mail désactivable en production | Refusée au démarrage |
| Recette : formulaires d'invitation et d'absence en erreur juste après un envoi réussi | L'état « envoyé » est réinitialisé |
| Recette : un lien d'invitation perdu bloquait l'adresse pendant 7 jours | Un nouveau lien remplace l'ancien |
| Recette : un salarié inscrit avec une autre adresse que celle de l'invitation a créé sa propre entreprise | Avertissement sur la page de création d'entreprise |
| Recette : ouvert avec le mauvais compte, le lien d'invitation ne proposait que « Retour à l'accueil » ou « Se déconnecter », qui menaient tous deux à la création d'une entreprise | Bouton « Changer de compte », qui revient au lien après la déconnexion ; le compte utilisé est nommé ; « Aller à mon espace » seulement si ce compte a déjà une entreprise |
| Recette : un seul message pour « invitation déjà utilisée » et « compte déjà rattaché à une autre entreprise » | Deux messages distincts, avec la marche à suivre |
| Recette : un salarié désactivé voyait l'application, avec une erreur sur chaque page | Page dédiée « Compte désactivé » |
| Recette : pour accepter une invitation, il fallait trouver « Enregistrement », puis retaper son adresse (une faute de frappe créait un compte sans lien avec l'invitation), son prénom et son nom | Page d'accueil de l'invitation, puis inscription avec l'adresse préremplie : seul le mot de passe est demandé (ADR 0004) |

## 5. Scénario de recette manuelle (avant chaque mise en production)

1. **Inscription** : sur la page de connexion, choisir « Enregistrement » (seuls l'adresse et le mot de passe sont demandés). Créer l'entreprise avec son prénom et son nom, puis vérifier l'arrivée sur le tableau de bord.
2. **Invitation** : dans Salariés, inviter un employé à 24 h/semaine avec un matricule. Ouvrir le lien dans une **fenêtre de navigation privée** : la page d'accueil nomme l'entreprise. « Créer mon mot de passe » ouvre l'inscription avec l'adresse préremplie ; après le mot de passe, le salarié arrive sur « Pointer ». Générer une seconde invitation pour la même adresse : l'ancien lien est refusé. Ouvrir un lien avec un autre compte : la page nomme ce compte et propose « Changer de compte ».
3. **Pointage** : pointer l'arrivée. Le bouton devient orange et le chronomètre tourne. Pointer la sortie : le total de la journée s'incrémente.
4. **Sortie oubliée** : laisser un pointage ouvert plus de 12 h, ou en créer un par l'API de test. La page « Pointer » demande l'heure de sortie ; le tableau de bord l'affiche en « Sorties non pointées ».
5. **Correction** : en manager, corriger une période avec un motif. Le salarié voit « Corrigé » et le motif dans « Mes heures ».
6. **Conflit d'intérêts** : un manager tente de corriger ses propres heures et reçoit un message explicite.
7. **Absences** : poser du 9 au 13 novembre 2026 : 4 jours ouvrés, le 11 novembre étant férié. La faire valider, puis vérifier qu'elle apparaît dans la feuille de temps.
8. **Annulation d'absence** : en manager, annuler une absence acceptée avec un motif (Absences, Historique de l'équipe). Le salarié voit « Annulée par … » et le motif.
9. **Contrat** : passer un salarié de 35 h à 28 h à partir d'une date future. La semaine en cours reste calculée sur 35 h.
10. **Export** : télécharger la synthèse du mois, l'ouvrir dans Excel, vérifier les accents, les décimales à virgule et les matricules.
11. **Mobile** : refaire les étapes 3 et 7 sur un téléphone ; la barre de navigation basse doit rester utilisable au pouce.

## 6. Ce qui manque encore

- Tests de composants Angular sur les pages (formulaires, états d'erreur) et tests de bout en bout dans le navigateur (Playwright), avec un Keycloak de test.
- Intégration continue : lancer les tests unitaires, le build et les tests e2e sur chaque pull request.
- Lint et formatage partagés (ESLint, Prettier).
- Test de charge de l'export mensuel pour 50 salariés.
