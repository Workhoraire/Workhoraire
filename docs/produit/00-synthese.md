# 00. Synthèse : WorkHoraire en deux pages

## Le problème

En France, l'employeur doit enregistrer **chaque jour** les heures de début et de fin de ses salariés qui ne suivent pas un horaire collectif, et les récapituler **chaque semaine** (D3171-8). En cas de litige, c'est à lui de justifier les horaires ; un système automatique doit être « fiable et infalsifiable » (L3171-4). Le droit européen exige un système « objectif, fiable et accessible » (CJUE, 2019).

Les **1,5 million d'entreprises employeuses de 0 à 49 salariés** (8,2 millions de salariés, Urssaf 2024) sont mal servies :
- les spécialistes sont facturés par établissement, soit environ 20 € par salarié et par mois pour une TPE de 3 personnes ;
- les gratuits internationaux ignorent la paie française ;
- l'export vers l'expert-comptable est souvent une option payante.

## La réponse

**WorkHoraire** : un pointage simple, **juste** (Code du travail et jurisprudence 2025 intégrés), **prouvable** (heure du serveur, piste d'audit) et **partagé** (le salarié voit ses heures), **sans surveillance** (ni biométrie, ni photo, ni géolocalisation).

## Où en est le produit

Ce qui est fait et ce qui vient ensuite est tenu, daté, dans la [roadmap](06-roadmap.md) : c'est la seule source à jour. Le produit couvre le pointage à l'heure du serveur, les feuilles de temps et les alertes légales, les absences, les exports CSV pour la paie, l'abonnement avec paiement Stripe, les e-mails et l'export des données personnelles. Il est prêt à être mis en ligne ([plan de lancement](09-plan-de-lancement.md)). Le détail des fonctions est dans les [spécifications](05-specifications-mvp.md).

**Qualité** : tests unitaires, tests d'intégration sur une vraie base PostgreSQL (dont la concurrence, l'isolation entre entreprises et la chaîne complète d'ajout d'un salarié), tests de l'application et du site vitrine ; recette visuelle sur mobile, revue de code, recette avec de vrais comptes, revue de sécurité et audit d'accessibilité. Chiffres et détail : [tests-et-qualite.md](../technique/tests-et-qualite.md).

## Décisions à prendre par l'équipe

1. **Inscription libre** (ADR 0004) : elle change le parcours d'invitation prévu à l'origine.
2. **Mode kiosque** (ADR 0006) : il impose une authentification hors de Keycloak ; trois options sont décrites.
3. **Valorisation des congés payés dans le seuil des heures sup** (1/5 de la durée hebdomadaire) : à faire valider par un juriste.
4. **Grille tarifaire** : 0 € jusqu'à 3 salariés actifs, puis 3 € HT par salarié actif, sans minimum ([doc 08](08-prix-et-hebergement.md)). L'application l'applique déjà ; elle reste à valider auprès de prospects.

## Prochaines étapes

La mise en ligne suit le [plan de lancement](09-plan-de-lancement.md). Les développements suivants, les entretiens et l'audit de Pointeo sont dans la [roadmap](06-roadmap.md).

## Carte des documents

| Document | Contenu |
|---|---|
| [01 Marché et concurrence](01-marche-et-concurrence.md) | Cible chiffrée, 20 concurrents, prix, tendances, canaux |
| [02 Cadre légal et RGPD](02-cadre-legal-et-rgpd.md) | Règles et **matrice de conformité** (48 exigences et leur statut) |
| [03 Utilisateurs et besoins](03-utilisateurs-et-besoins.md) | Personas (hypothèses), jobs-to-be-done, hypothèses à valider |
| [04 Stratégie produit](04-strategie-produit.md) | Vision, positionnement, principes, prix, go-to-market, indicateurs, risques |
| [05 Spécifications du MVP](05-specifications-mvp.md) | Récits utilisateurs et critères d'acceptation |
| [06 Roadmap](06-roadmap.md) | État daté, seule source à jour : fait, mise en ligne, ensuite, plus tard, dette technique |
| [07 Kit de conformité client](07-kit-conformite-client.md) | Note d'information des salariés, note au CSE, checklist |
| [08 Prix et hébergement](08-prix-et-hebergement.md) | Grille de prix comparée à Pointeo, frais de paiement, facture électronique, hébergement en France par étape et budget |
| [09 Plan de lancement](09-plan-de-lancement.md) | Ce qui est prêt, budget de démarrage, étapes dans l'ordre (qui fait quoi), recette de bout en bout |
| [Technique](../technique/) | Architecture, API, moteur de calcul, sécurité, tests, ADR |
| [Recherche](recherche/) | Les trois études complètes et sourcées (marché, droit, besoins) |
