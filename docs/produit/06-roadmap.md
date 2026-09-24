# 06. Roadmap

> Priorisation par **valeur client** (jobs J1 à J9 du doc 03), **obligation légale** (matrice du doc 02) et **effort**. Chaque élément « Next » cite l'hypothèse ou l'exigence qui le justifie. L'ordre est à réviser après les entretiens et les pilotes.

## Maintenant (fait dans cette version)

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

## Ensuite (prochains cycles, dans l'ordre proposé)

| # | Élément | Justification | Effort (estimation) |
|---|---|---|---|
| 1 | **Validation hebdomadaire et clôture de période** : le manager valide ; les semaines sans anomalie sont validées automatiquement ; verrou après l'export paie ; réouverture tracée | Matrice n° 5 ; pattern de validation par exception (annexe besoins § 8) ; H12 | M |
| 2 | **Notifications** (e-mail, via le SMTP de Keycloak ou un service UE) : correction faite sur mes heures, demande d'absence traitée, rappel de sortie oubliée | Matrice n° 4 (correction notifiée au salarié) ; rappels de pointage (annexe besoins § 8) | M |
| 3 | **Export Silae natif** : correspondance des rubriques paramétrée une fois par client, pré-contrôle bloquant (matricule manquant, semaine non validée) | H7 ; le cabinet est l'acteur clé (annexe besoins § 7) | M |
| 4 | **Mode kiosque** : tablette partagée, salarié identifié par code PIN, sans compte e-mail | H4 ; salariés sans e-mail (annexe besoins § 5.2) ; standard du marché. **Décision d'architecture à prendre** (ADR 0006) | L |
| 5 | **Compteurs de congés** : acquisition de 2,5 j/mois, 2 j/mois en maladie (loi 2024-364), report de 15 mois, soldes visibles au moment de la demande | Matrice n° 22-23 ; soldes invisibles reprochés aux concurrents | L |
| 6 | **Conservation** : durées paramétrables, archivage séparé, purge automatique | Matrice n° 30 ; RGPD art. 5 | M |
| 7 | **Export de mes données** par le salarié (PDF/CSV) et document mensuel D3171-12 | Matrice n° 6 et 26 | S |
| 8 | **Alertes complémentaires** : moyenne de 44 h sur 12 semaines, repos hebdomadaire de 35 h, requalification des temps partiels, travail de nuit | Matrice n° 8, 9, 13, 18 | M |
| 9 | **MFA des administrateurs**, journal des accès, sauvegardes chiffrées ; déploiement dans l'UE | Matrice n° 39-40 | M |

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

- Vérification des jetons côté API : l'adaptateur `keycloak-connect` fonctionne, mais une vérification OIDC standard (signature via JWKS, audience, expiration) rendrait l'API indépendante de cet adaptateur. À évaluer avant la production (maintenance, sécurité, tests).
- Pas d'outil de lint ou de formatage partagé dans le dépôt (ESLint, Prettier) : à ajouter pour homogénéiser.
- Pas de Dockerfile pour `backend` et `frontend`, alors qu'AGENTS.md prévoit les quatre services en conteneurs.
- Pas d'intégration continue : lancer les tests unitaires, le build et les tests e2e sur chaque pull request.
- L'historique des contrats d'un salarié n'est visible qu'à travers les calculs : l'afficher dans sa fiche.
- Les invitations en attente ne sont pas listées : les afficher, avec la possibilité de les révoquer. Aujourd'hui, un nouveau lien remplace l'ancien.
