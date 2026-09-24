# 06. Roadmap

> **État au 24/09/2026.** Ce document est la **seule source à jour** de ce qui est fait et de ce qui reste à faire : les autres documents y renvoient au lieu de le répéter.
> Priorisation par **valeur client** (jobs J1 à J9 du doc 03), **obligation légale** (matrice du doc 02) et **effort**. Chaque élément « Ensuite » cite l'hypothèse ou l'exigence qui le justifie. L'ordre est à réviser après les entretiens et les pilotes.

## Fait (au 24/09/2026)

### Le MVP

| Livré | Pourquoi |
|---|---|
| Pointage avec l'heure du serveur, un seul pointage ouvert garanti en base | Décompte quotidien fiable (D3171-8, L3171-4) |
| Sortie oubliée : 0 h comptée, puis déclaration par le salarié, tracée | L'oubli est l'anomalie la plus probable (H3) ; ne pas inventer d'heures |
| Corrections des managers avec motif obligatoire, piste d'audit visible par le salarié | Preuve (J2) et transparence (J7) |
| Moteur de calcul : semaine civile, heures sup 25/50 %, heures complémentaires 10/25 %, congés payés dans le seuil (jurisprudence 2025), jours fériés, fuseaux | Justesse de la paie (J1) |
| Alertes légales de base | Conformité sans expertise (J6) |
| Absences avec demi-journées, validation, jours ouvrés | Besoin de base de toutes les TPE |
| Tableau de bord de l'équipe | Visibilité à distance (J3) |
| Exports CSV hebdomadaire et journalier, avec matricule | Transmission au cabinet (J1, J9) |
| Inscription libre avec e-mail vérifié, connexion en français, protection anti-brute-force | Parcours SaaS en libre-service |

### Commercialisation et production

| Livré | Pourquoi |
|---|---|
| **Abonnement** : Découverte gratuite jusqu'à 3 salariés actifs, Essentiel à 3 € HT par salarié actif, paiement Stripe (prélèvement SEPA ou carte) ; lecture seule si l'abonnement n'est pas réglé 30 jours après un dépassement de l'offre gratuite ou un impayé, le pointage restant ouvert | Modèle économique (doc 08) |
| **Site vitrine** prérendu : tarifs avec simulateur, guides, pages légales (mentions légales, confidentialité, CGV, contrat de sous-traitance) ; CGV et contrat acceptés à la création de l'entreprise | Acquisition (doc 04, § 6) ; contrat de sous-traitance (matrice n° 37) |
| **E-mails** : invitation, correction faite sur mes heures, rappel de sortie oubliée au-delà de 12 h, dépassement de l'offre gratuite, échec de paiement | Correction notifiée au salarié (matrice n° 4) ; oublis (H3) |
| **Export de toutes ses données** par le salarié (JSON, depuis « Mes heures ») | Matrice n° 6 et 41 ; RGPD art. 15 et 20 |
| Adresse vérifiée exigée pour créer une entreprise ; adresse des comptes reprise de Keycloak, que l'administrateur ne peut plus modifier | Revue de sécurité du 24/09/2026 |
| Pages de connexion aux couleurs de WorkHoraire ; « Rester connecté » jusqu'à 30 jours | Pointer sur son téléphone sans retaper son mot de passe |
| **Production sur un serveur** : Caddy (HTTPS, en-têtes de sécurité, journal d'accès), images Docker, rôles séparés dans la base, sauvegardes chiffrées chaque nuit avec copie hors serveur possible, déploiement par script ou depuis GitHub | Pilotes (docs 08 et 09) ; sécurité (matrice n° 39) |
| **Intégration continue** sur chaque pull request et sur `main` (tests, builds, images Docker, contrôle de l'infrastructure) ; déploiement seulement d'un commit dont la CI est verte ; mises à jour proposées par Dependabot | Qualité |
| Revue de sécurité et audit d'accessibilité du 24/09/2026 | [securite-et-rgpd.md](../technique/securite-et-rgpd.md), § 3 bis ; [tests-et-qualite.md](../technique/tests-et-qualite.md), § 5 bis |

## Mise en ligne (en cours)

Ce qui demande un compte, un paiement ou l'identité de l'éditeur, dans l'ordre du [plan de lancement](09-plan-de-lancement.md) :
- identité de l'éditeur dans les pages légales, puis relecture des CGV par un juriste ;
- nom de domaine, serveur OVHcloud en France, compte Brevo et domaine d'envoi authentifié ;
- validation de Stripe en mode test, puis passage aux clés réelles ;
- première semaine : surveillance externe de `/health`, copie des sauvegardes hors du serveur, double authentification (MFA) des administrateurs, protection de la branche `main`.

## Ensuite (prochains cycles, dans l'ordre proposé)

| # | Élément | Justification | Effort (estimation) |
|---|---|---|---|
| 1 | **Validation hebdomadaire et clôture de période** : le manager valide ; les semaines sans anomalie sont validées automatiquement ; verrou après l'export paie ; réouverture tracée | Matrice n° 5 ; pattern de validation par exception (annexe besoins § 8) ; H12 | M |
| 2 | **Notifications restantes** : demande d'absence traitée. Les e-mails de correction et de rappel de sortie oubliée sont faits | Rappels et suivi des demandes (annexe besoins § 8) | À réestimer |
| 3 | **Export Silae natif** : correspondance des rubriques paramétrée une fois par client, pré-contrôle bloquant (matricule manquant, semaine non validée) | H7 ; le cabinet est l'acteur clé (annexe besoins § 7) | M |
| 4 | **Mode kiosque** : tablette partagée, salarié identifié par code PIN, sans compte e-mail | H4 ; salariés sans e-mail (annexe besoins § 5.2) ; standard du marché. **Décision d'architecture à prendre** (ADR 0006) | L |
| 5 | **Compteurs de congés** : acquisition de 2,5 j/mois, 2 j/mois en maladie (loi 2024-364), report de 15 mois, soldes visibles au moment de la demande | Matrice n° 22-23 ; soldes invisibles reprochés aux concurrents | L |
| 6 | **Conservation** : durées paramétrables, archivage séparé, purge automatique | Matrice n° 30 ; RGPD art. 5 | M |
| 7 | **Document mensuel D3171-12** et export PDF ou CSV des heures par le salarié. L'export JSON de toutes ses données est fait | Matrice n° 6 et 26 | S |
| 8 | **Alertes complémentaires** : moyenne de 44 h sur 12 semaines, repos hebdomadaire de 35 h, requalification des temps partiels, travail de nuit | Matrice n° 8, 9, 13, 18 | M |
| 9 | **MFA obligatoire pour les administrateurs**, journal des connexions. Les sauvegardes chiffrées et le journal d'accès du proxy sont faits ; la mise en ligne dans l'UE est dans la section précédente | Matrice n° 39-40 | À réestimer |

## Lancement commercial (après les pilotes)

- **Lot 4** : base PostgreSQL gérée (Scaleway), préproduction, déploiement continu, journaux, métriques, alertes et page de statut ([architecture-cible.md](../technique/architecture-cible.md), § 8).
- **Offre annuelle** (2,50 € par salarié et par mois) : retirée du site tant que l'application ne facture qu'au mois (doc 08).
- **Facture électronique** : obligatoire pour l'émission par les PME et micro-entreprises à partir du 1er septembre 2027 (doc 08, § 2.6).

## En parallèle : valider le marché

- **Entretiens** : 10 à 12 dirigeants, 6 à 8 salariés, 3 à 4 gestionnaires de paie. Le guide est prêt (annexe besoins, § 9.4).
- **Grille tarifaire** : la valider auprès de 5 à 10 prospects avant le lancement (doc 08, § 4).
- **Pointeo** : grille relevée le 24/09/2026 (doc 08, § 2.1) ; restent à auditer l'essai et l'éditeur (doc 01, § 7).

## Plus tard (à confirmer par le marché)

- **Préréglages conventionnels**, en commençant par l'HCR : taux 10/20/50, contingent de 360 h, émargement hebdomadaire. À engager seulement si l'HCR est confirmée comme segment prioritaire.
- **Planning** et écart entre planifié et réalisé.
- **Multi-sites** : établissements, responsables par site, calendriers de jours fériés régionaux (Alsace-Moselle, outre-mer).
- **Hors ligne** pour le kiosque, avec une alerte avant toute perte de données (Combo perd les pointages au-delà de 72 h).
- **Espace expert-comptable** multi-dossiers.
- **Contingent annuel et contrepartie obligatoire en repos**, aménagement du temps sur plusieurs semaines, forfaits en jours, astreintes.
- **Règles versionnées** avec date d'effet, pour recalculer le passé avec les règles alors applicables.

## Ce que nous refusons de faire

- La biométrie et la photo systématique : la CNIL les juge excessives.
- La géolocalisation continue, et la géolocalisation pour **calculer** le temps de travail (CE 15/12/2017).
- La mesure d'inactivité, les captures d'écran et tout suivi d'activité : voir la sanction CNIL SAN-2024-021.

## Dette technique identifiée

- Vérification des jetons côté API : depuis le 24/09/2026, l'API vérifie elle-même chaque jeton (signature, émetteur, audience, expiration) avec le gestionnaire de jetons de `keycloak-connect` ; ses routes d'administration ne sont plus exposées. Une vérification OIDC standard (JWKS) rendrait l'API indépendante de cet adaptateur : à évaluer.
- Pas d'outil de lint ou de formatage partagé dans le dépôt (ESLint, Prettier) : à ajouter pour homogénéiser.
- L'intégration continue tourne sur chaque pull request et sur `main`. La rendre obligatoire avant chaque fusion demande la protection de branche, absente de GitHub Free pour un dépôt privé : à activer avec un plan payant, ou en rendant le dépôt public.
- Les tâches planifiées (facturation, rappels) n'ont pas de verrou : l'API tourne en une seule instance, et un verrou consultatif PostgreSQL est à ajouter avant d'en lancer une seconde (ADR 0008).
- L'historique des contrats d'un salarié n'est visible qu'à travers les calculs : l'afficher dans sa fiche.
- Les invitations en attente ne sont pas listées : les afficher, avec la possibilité de les révoquer. Aujourd'hui, un nouveau lien remplace l'ancien.
- Le SIRET est unique en base mais n'est pas vérifié : une entreprise pourrait réserver celui d'une autre ([securite-et-rgpd.md](../technique/securite-et-rgpd.md), § 3 bis).
