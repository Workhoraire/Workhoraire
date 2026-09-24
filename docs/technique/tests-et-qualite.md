# Tests et qualité

Conformément à AGENTS.md, les tests portent sur les comportements métier critiques : authentification, autorisation, isolation des entreprises, pointage, calcul des heures et règles légales.

## 1. Pyramide de tests

| Niveau | Outil | Contenu | Commande |
|---|---|---|---|
| Unitaires backend | Jest | Moteur de calcul (fuseaux, heures sup, congés dans le seuil, congé travaillé, nuit du dimanche au lundi, contrat par semaine, heures complémentaires, alertes, jours fériés), services (isolation, rôles, conflits d'intérêts, audit, verrous, absences, contrats, invitations), facturation avec un faux Stripe (mois facturés à partir de la souscription, rattrapage, relances), changements d'heure, garde Keycloak, contrôle de la configuration au démarrage, adresses web refusées dans les noms, DTO, CSV | `cd backend && npm test` |
| Intégration (e2e) backend | Jest + vraie base PostgreSQL | API HTTP complète : validation, gardes, SQL, contraintes, concurrence (5 pointages simultanés : 1 seul accepté ; 3 demandes d'absence simultanées : 1 seule acceptée), annulation d'absence par le manager, historique de contrat, invitation remplacée, **chaîne complète d'ajout d'un salarié** (invitation, acceptation, premier pointage, visibilité chez l'admin, rôle, désactivation, réactivation, cas refusés), exports, **facturation** (salariés actifs du mois, délai de 30 jours, lecture seule sauf pointage, Checkout, webhooks signés, rejoués ou falsifiés, déclaration mensuelle unique, résiliation), avec un faux compte Stripe, **rappel de sortie oubliée** (envoyé une seule fois), **export des données personnelles** (uniquement les siennes) | `cd backend && npm run test:e2e` |
| Unitaires frontend | Karma + Jasmine (Chrome headless) | Formatage des durées et des dates, conversions de fuseau, libellés d'alertes, traduction des erreurs de l'API, pointage (erreur conservée, double clic ignoré), navigation entre les semaines, fenêtre de correction (erreurs affichées dedans, poste de nuit), absences (chargement, erreurs, confirmations), heures de l'équipe (détail des alertes, semaine dans l'adresse), téléchargements, champs réellement modifiés dans une correction, page d'invitation (accueil sans compte, création du mot de passe, liens expirés) et ses messages, gardes de compte (sans entreprise, désactivé), navigation selon le rôle, page Abonnement (estimation, échéance, lecture seule, portail), offre choisie sur le site, création d'entreprise (acceptation des CGV obligatoire, liens vers les pages légales), composant racine | `cd frontend && npx ng test --watch=false --browsers=ChromeHeadless` |
| Site vitrine | Karma + Jasmine | Simulateur de prix (grands effectifs, valeurs invalides, limite expliquée), page tarifs et TVA, pages légales (champs manquants signalés, pénalités de retard, sous-traitants, copie hors site, droits), typographie (espaces insécables), balises SEO et de partage par page, plan du site identique aux pages pré-rendues, en-tête | `cd site && npx ng test --watch=false --browsers=ChromeHeadless` |
| Build | Angular CLI et Nest CLI | Compilation stricte (templates compris), budgets de taille | `npm run build` dans chaque dossier |

**Résultats au 24/09/2026** : 145 tests unitaires backend, 20 tests e2e, 75 tests frontend et 65 tests du site vitrine, tous au vert. Builds OK. Les six images Docker de production (api, migrate, app, site, keycloak, backup) se construisent, et la pile a été répétée en local en HTTPS (voir [exploitation.md](exploitation.md#9-répéter-la-production-en-local)) : sur une base existante puis sur des volumes neufs, avec synchronisation des rôles, sauvegarde puis restauration complète, contrôle de restauration, effacement d'une entreprise avec archivage de la preuve d'acceptation des CGV, et journal d'accès sans jeton d'invitation.

## 2. Lancer les tests e2e

1. `docker compose up -d postgres`
2. La base `workhoraire_e2e` est créée automatiquement pour un volume neuf. Pour un volume existant, créez-la une fois :
   ```bash
   docker compose exec postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "CREATE DATABASE workhoraire_e2e"'
   ```
3. Renseignez `E2E_DATABASE_URL` dans `.env` (voir `.env.example`), puis lancez `cd backend && npm run test:e2e`.

La suite applique elle-même les migrations et **vide la base**. Elle refuse de tourner sur une base dont le nom ne finit pas par `_e2e` : le nom est contrôlé dans `E2E_DATABASE_URL` avant même les migrations. L'application est configurée comme en production (`configureApp`, partagé avec `main.ts`). Seule la vérification de la signature des jetons Keycloak est remplacée : un jeton `test:<sujet>` vaut jeton vérifié de ce sujet, et tout autre jeton passe par la vraie vérification.

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

Les e-mails arrivent dans Mailpit en local (`http://localhost:8025`), dans les vraies boîtes en production.

1. **Inscription** : sur la page de connexion, choisir « Enregistrement » (seuls l'adresse et le mot de passe sont demandés), puis ouvrir le lien de l'e-mail de vérification. Créer l'entreprise avec son prénom et son nom, en cochant l'acceptation des CGV, puis vérifier l'arrivée sur le tableau de bord.
2. **Invitation** : dans Salariés, inviter un salarié à 24 h/semaine avec un matricule ; l'e-mail d'invitation arrive. Ouvrir le lien dans une **fenêtre de navigation privée** : la page d'accueil nomme l'entreprise. « Créer mon mot de passe » ouvre l'inscription avec l'adresse préremplie ; après le mot de passe, le salarié arrive sur « Pointer ». Générer une seconde invitation pour la même adresse : l'ancien lien est refusé. Ouvrir un lien avec un autre compte : la page nomme ce compte et propose « Changer de compte ».
3. **Pointage** : pointer l'arrivée. Le bouton devient orange et le chronomètre tourne. Pointer la sortie : le total de la journée s'incrémente.
4. **Sortie oubliée** : laisser un pointage ouvert plus de 12 h, ou en créer un par l'API de test. La page « Pointer » demande l'heure de sortie ; le tableau de bord l'affiche en « Sorties non pointées ». Un seul e-mail de rappel part au salarié.
5. **Correction** : en manager, corriger une période avec un motif. Le salarié voit « Corrigé » et le motif dans « Mes heures », et reçoit un e-mail.
6. **Conflit d'intérêts** : un manager tente de corriger ses propres heures et reçoit un message explicite.
7. **Absences** : poser du 9 au 13 novembre 2026 : 4 jours ouvrés, le 11 novembre étant férié. La faire valider, puis vérifier qu'elle apparaît dans la feuille de temps.
8. **Annulation d'absence** : en manager, annuler une absence acceptée avec un motif (Absences, Historique de l'équipe). Le salarié voit « Annulée par … » et le motif.
9. **Contrat** : passer un salarié de 35 h à 28 h à partir d'une date future. La semaine en cours reste calculée sur 35 h.
10. **Export** : télécharger la synthèse du mois, l'ouvrir dans Excel, vérifier les accents, les décimales à virgule et les matricules.
11. **Mobile** : refaire les étapes 3 et 7 sur un téléphone ; la barre de navigation basse doit rester utilisable au pouce.
12. **Données personnelles** : en salarié, « Télécharger mes données » dans « Mes heures » ; le fichier JSON ne contient que ses propres données.
13. **Abonnement** : en administrateur, avec plus de 3 salariés actifs dans le mois, la page « Abonnement » annonce l'estimation et le délai de 30 jours. Avec les clés Stripe de test, souscrire, puis ouvrir « Factures et moyen de paiement » ([exploitation.md](exploitation.md#4-paiement-en-ligne-stripe), § 4).
14. **Production seulement** : tester la restauration d'une sauvegarde ([exploitation.md](exploitation.md#5-sauvegardes-et-restauration), § 5).

## 5 bis. Audit d'accessibilité du 24/09/2026

L'audit a suivi le WCAG 2.2 AA et le RGAA 4.1.
- **Site** : Lighthouse, axe-core à 1280 et 320 px, parcours au clavier, contrastes mesurés au pixel sur les fonds en dégradé. Lighthouse donnait 96 à 100 sur les 11 pages.
- **Application** : relecture des gabarits.

Corrections faites :
- **Focus** : indicateur visible sur tous les composants Material, en lime sur les fonds sombres.
- **Clavier** : lien « Aller au contenu », focus placé sur le contenu après chaque navigation, boutons qui gardent le focus quand ils se désactivent.
- **Contrastes** : gris, corail et cartes lime au-dessus de 4,5:1, contour des champs à 3:1.
- **Lecteurs d'écran** :
  - le chronomètre n'est plus annoncé à chaque seconde ;
  - les barres de la semaine deviennent une liste lisible ;
  - les alertes et les états du tableau d'équipe sont dits, pas seulement vus ;
  - les indicateurs de chargement sont nommés ;
  - « Lien copié » est annoncé.
- **Formulaires** : un message d'erreur par champ obligatoire, l'ordre des dates relié au champ, la case des CGV marquée obligatoire.
- **Structure** : titres de page et vrais niveaux de titres.
- **Site** :
  - le menu mobile se ferme quand le focus le quitte ou avec Échap ;
  - la page courante est signalée autrement que par la couleur ;
  - les boutons du simulateur gardent le focus ;
  - les tableaux sont nommés et atteignables au clavier.

## 5 ter. Recette dans le navigateur du 24/09/2026

Le parcours complet a été joué dans Chrome, avec de vrais clics et une vraie saisie au clavier, et une capture à chaque étape (62 étapes) :

- **Visiteur** : accueil, fonctionnalités, tarifs et simulateur, sécurité, guides, pages légales, liens vers l'inscription et la connexion.
- **Nouvelle cliente** : création de l'entreprise avec les CGV, carte « Premiers pas », invitation d'une salariée et d'un manager (lien et e-mail).
- **Salariée** : acceptation de l'invitation, pointage d'arrivée et de sortie avec note, page sur téléphone, « Mes heures », téléchargement de ses données, demande de congés.
- **Administratrice** :
  - validation des congés et correction tracée d'une période ;
  - exports CSV du mois dernier et du mois en cours ;
  - abonnement ;
  - modification d'un contrat, désactivation avec confirmation puis réactivation ;
  - tentative d'accès à une salariée d'une autre entreprise, refusée (404).
- **E-mails reçus** (Mailpit) : deux invitations, la correction, le rappel de sortie oubliée.

Les pages Keycloak (inscription, connexion) ont été ouvertes sans rien saisir. Pour le reste, l'identité est simulée, comme dans les tests e2e : l'API et l'application sont les vraies, sur une base de démonstration séparée. Aucune erreur JavaScript n'est apparue, et aucune réponse d'erreur de l'API, hormis les refus attendus. Le parcours a été relancé après les corrections de la revue du même jour.

## 6. Ce qui manque encore

- Tests de composants Angular sur les pages (formulaires, états d'erreur) et tests de bout en bout dans le navigateur (Playwright), avec un Keycloak de test.
- Intégration continue : en place (`.github/workflows/ci.yml`), avec un contrôle de l'infrastructure (Compose, scripts, workflows). Elle tourne sur chaque pull request et sur `main`, mais pas sur chaque push d'une branche : cela suffit pour tenir dans les 2 000 minutes gratuites par mois d'un dépôt privé. La rendre obligatoire avant chaque fusion demande la protection de branche, qui n'existe pas avec GitHub Free sur un dépôt privé. En attendant, le déploiement depuis GitHub exige une CI verte sur le commit déployé.
- Lint et formatage partagés (ESLint, Prettier).
- Test de charge de l'export mensuel pour 50 salariés.
