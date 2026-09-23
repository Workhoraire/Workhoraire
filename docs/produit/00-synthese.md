# 00. Synthèse : WorkHoraire en deux pages

## Le problème

En France, l'employeur doit enregistrer **chaque jour** les heures de début et de fin de ses salariés qui ne suivent pas un horaire collectif, et les récapituler **chaque semaine** (D3171-8). En cas de litige, c'est à lui de justifier les horaires ; un système automatique doit être « fiable et infalsifiable » (L3171-4). Le droit européen exige un système « objectif, fiable et accessible » (CJUE, 2019).

Les **1,5 million d'entreprises employeuses de 0 à 49 salariés** (8,2 millions de salariés, Urssaf 2024) sont mal servies :
- les spécialistes sont facturés par établissement, soit environ 20 € par salarié et par mois pour une TPE de 3 personnes ;
- les gratuits internationaux ignorent la paie française ;
- l'export vers l'expert-comptable est souvent une option payante.

## La réponse

**WorkHoraire** : un pointage simple, **juste** (Code du travail et jurisprudence 2025 intégrés), **prouvable** (heure du serveur, piste d'audit) et **partagé** (le salarié voit ses heures), **sans surveillance** (ni biométrie, ni photo, ni géolocalisation).

## Ce qui est livré dans cette version

| Pour le salarié | Pour le manager et le dirigeant | Pour la paie |
|---|---|---|
| Pointer en un geste depuis le téléphone, avec l'heure du serveur | Tableau de bord : présents, sorties oubliées, absents, alertes | Export CSV hebdomadaire : heures sup +25/+50, heures complémentaires +10/+25, absences par type, matricule |
| Sa journée, sa semaine, ses heures sup | Heures de l'équipe par jour et par semaine | Export CSV journalier (preuve, contrôle) |
| Déclarer une sortie oubliée (tracée) | Corriger avec motif obligatoire, historique complet | Fichier lisible dans Excel en français, protégé contre l'injection |
| Voir chaque correction faite sur ses heures | Valider, refuser ou annuler les absences | – |
| Demander des congés (demi-journées, jours ouvrés, fériés exclus) | Alertes légales : 10 h, 48 h, pause, repos de 11 h, 6 jours, temps partiel | – |

**Qualité** :
- 89 tests unitaires et 16 tests d'intégration sur une vraie base PostgreSQL (dont la concurrence, l’isolation entre entreprises et la chaîne complète d'ajout d'un salarié), plus 31 tests frontend ;
- recette visuelle sur mobile avec des données réalistes, puis revue de code complète et recette avec de vrais comptes : défauts trouvés et corrigés avant livraison ([détail](../technique/tests-et-qualite.md)).

## Décisions à prendre par l'équipe

1. **Inscription libre** (ADR 0004) : elle change le parcours d'invitation prévu à l'origine.
2. **Mode kiosque** (ADR 0006) : il impose une authentification hors de Keycloak ; trois options sont décrites.
3. **Valorisation des congés payés dans le seuil des heures sup** (1/5 de la durée hebdomadaire) : à faire valider par un juriste.
4. **Grille tarifaire** : hypothèse de 0 € jusqu'à 3 salariés, puis 3 € par salarié actif, sans minimum. À tester auprès de prospects.

## Prochaines étapes recommandées

1. **Entretiens** : 10 à 12 dirigeants, 6 à 8 salariés, 3 à 4 gestionnaires de paie. Le guide est prêt (annexe besoins, § 9.4).
2. **Validation hebdomadaire et notifications**, puis **export Silae natif**, puis **mode kiosque** (roadmap).
3. **Préparation de la production** : checklist sécurité (HTTPS, SMTP, MFA des administrateurs, hébergement UE), contrat de sous-traitance, politique de conservation.
4. **Audit de Pointeo**, le concurrent français le plus proche.

## Carte des documents

| Document | Contenu |
|---|---|
| [01 Marché et concurrence](01-marche-et-concurrence.md) | Cible chiffrée, 20 concurrents, prix, tendances, canaux |
| [02 Cadre légal et RGPD](02-cadre-legal-et-rgpd.md) | Règles et **matrice de conformité** (48 exigences et leur statut) |
| [03 Utilisateurs et besoins](03-utilisateurs-et-besoins.md) | Personas (hypothèses), jobs-to-be-done, hypothèses à valider |
| [04 Stratégie produit](04-strategie-produit.md) | Vision, positionnement, principes, prix, go-to-market, indicateurs, risques |
| [05 Spécifications du MVP](05-specifications-mvp.md) | Récits utilisateurs et critères d'acceptation |
| [06 Roadmap](06-roadmap.md) | Maintenant, ensuite, plus tard, dette technique |
| [07 Kit de conformité client](07-kit-conformite-client.md) | Note d'information des salariés, note au CSE, checklist |
| [Technique](../technique/) | Architecture, API, moteur de calcul, sécurité, tests, ADR |
| [Recherche](recherche/) | Les trois études complètes et sourcées (marché, droit, besoins) |
