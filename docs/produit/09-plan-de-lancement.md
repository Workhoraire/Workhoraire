# 09. Plan de lancement

> État au 24/09/2026. Le produit est prêt à être mis en ligne. Il ne manque que ce qui demande un paiement, un compte ou l'identité de l'éditeur. La marche technique détaillée est dans [exploitation.md](../technique/exploitation.md), l'état daté du produit dans la [roadmap](06-roadmap.md).
> Rôles : **Fondateur** (comptes, paiements, identité de l'éditeur) et **Développement** (serveur, déploiement). Les pages de service-public.fr, inpi.fr et docs.stripe.com citées ici n'ont pas de date de consultation relevée : à revérifier avant achat. Les autres prix viennent du doc 08 (consultés le 24/09/2026).

## 1. Déjà prêt, sans rien acheter

- **Application**, API, site vitrine et pages légales. Les pages légales attendent seulement l'identité de l'éditeur.
- **Facturation Stripe** : écrite et testée avec un faux Stripe, mais coupée tant que les clés ne sont pas renseignées.
- **E-mails** : invitations, corrections, dépassement de l'offre gratuite, échec de paiement et rappel de sortie oubliée.
- **Pages de connexion** aux couleurs de WorkHoraire.
- **Export des données personnelles** par chaque salarié (articles 15 et 20 du RGPD).
- **Serveur** : préparation par un script, déploiement par script ou depuis GitHub (un commit de `main` dont l'intégration continue a réussi), sauvegardes chiffrées chaque nuit avec une copie hors serveur possible et un signal de vie.

## 2. Budget

| Poste | Coût | Quand |
|---|---|---|
| Micro-entreprise | Gratuite pour une activité commerciale ([service-public.fr](https://entreprendre.service-public.gouv.fr/vosdroits/F23282)) | Avant l'ouverture au public |
| Serveur OVHcloud VPS-2 | Dès 7,21 € HT par mois ; le prix exact dépend de la durée d'engagement choisie au panier | Jour J |
| Domaine `workhoraire.fr` | Prix affiché au panier | Jour J |
| Brevo (e-mails) | Offre gratuite pour commencer ; Starter à 7 € par mois pour 5 000 e-mails (doc 08) | Jour J |
| Stripe | Pas d'abonnement ; frais à chaque paiement (doc 08) | Premiers clients payants |
| Stockage des sauvegardes hors serveur | Facturé au volume chez le fournisseur choisi | Première semaine |
| Dépôt de la marque à l'INPI (conseillé) | 190 € pour une classe, puis 40 € par classe supplémentaire ([inpi.fr](https://www.inpi.fr/realiser-demarches/propriete-intellectuelle/deposant-et-cout-dune-marque)). Pour un logiciel en ligne, les classes 9 et 42 font 230 € | Avant de communiquer largement |

## 3. Dès maintenant, gratuitement

1. **Vérifier la marque** : rechercher « WorkHoraire » dans la base des marques de l'INPI (data.inpi.fr). Une recherche sur le web n'a montré aucun produit sous ce nom (source à compléter), mais seule la base de l'INPI fait foi.
2. **Choisir la structure juridique** (doc 08, § 4). La micro-entreprise est la plus rapide et la moins chère pour démarrer.
3. **Créer un compte Stripe en mode test.** Stripe permet de tout tester avant d'activer le compte et sans fournir d'informations sur l'entreprise ([docs.stripe.com](https://docs.stripe.com/get-started/account/activate)). Il suffit de mettre les clés de test dans le `.env` local : on valide alors en local tout le parcours de paiement (exploitation, § 4).

## 4. Jour J : quand le budget est là

| Étape | Qui | Temps |
|---|---|---|
| 1. Immatriculer l'entreprise, puis remplir `site/src/app/core/legal/legal-info.json` (ou transmettre les informations à Développement) | Fondateur | Selon la démarche |
| 2. Commander le VPS (Ubuntu 24.04, en France), avec la clé SSH ajoutée à la commande, et le domaine | Fondateur | 30 min |
| 3. Créer le compte Brevo et lancer l'authentification du domaine d'envoi : Brevo donne les enregistrements DNS à créer | Fondateur | 20 min |
| 4. Créer les entrées DNS : `@`, `www`, `app`, `api`, `auth`, CAA, et celles de Brevo (exploitation, § 1) | Fondateur | 10 min |
| 5. Préparer le serveur (`bootstrap.sh`), remplir `.env.production` avec le SMTP de Brevo, et déployer (`deploy.sh`) | Développement | 30 min |
| 6. Appliquer les réglages Keycloak (`apply-realm-settings.mjs`, sur le serveur), puis créer l'administrateur Keycloak permanent avec double authentification (exploitation, § 3) | Développement | 15 min |
| 7. Recette de bout en bout, voir ci-dessous | Fondateur et Développement | 30 min |

La recette de bout en bout suit le [scénario de recette](../technique/tests-et-qualite.md#5-scénario-de-recette-manuelle-avant-chaque-mise-en-production), sur le vrai domaine et avec les vrais e-mails, jusqu'au test de restauration d'une sauvegarde.

## 5. Première semaine

- Activer la copie des sauvegardes hors du serveur, chez un fournisseur en France (exploitation, § 5), puis la déclarer dans `legal-info.json` (champ `offsiteBackup`, exploitation, § 7).
- Brancher une surveillance externe de `https://API_HOST/health` et le signal de vie des sauvegardes (`BACKUP_HEARTBEAT_URL`), avec alerte par e-mail (exploitation, § 8).
- Préparer le déploiement depuis GitHub (exploitation, § 6).
- Activer la double authentification (MFA) des administrateurs des entreprises dans Keycloak.
- Limiter les droits d'écriture sur le dépôt GitHub. Un dépôt privé en offre gratuite ne permet pas de protéger la branche `main` ; le déploiement depuis GitHub exige déjà un commit de `main` dont l'intégration continue a réussi.
- Prévoir un redémarrage du serveur chaque mois, à une heure creuse (exploitation, § 8).

## 6. Premiers clients payants

- Valider Stripe en mode test : abonnement, facture, échec de paiement, résiliation (exploitation, § 4). Passer ensuite en mode réel avec les clés live.
- Avant la première facture, régler le bas de page des factures Stripe : mention de TVA et pénalités de retard (exploitation, § 4).
- Relire les CGV avec un juriste avant de les proposer largement.
- Préparer la facturation électronique : obligatoire pour l'émission par les PME et micro-entreprises à partir du **1er septembre 2027** (doc 08).
