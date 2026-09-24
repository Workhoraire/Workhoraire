# 01. Marché et concurrence

> Synthèse de l'étude complète [`recherche/etude-de-marche-complete.md`](recherche/etude-de-marche-complete.md), qui cite ses sources ligne par ligne (toutes consultées le 23/09/2026).
> Convention : **Analyse** = déduction ou calcul de l'équipe, pas un fait sourcé.

## 1. La cible en chiffres

| Segment (entreprises employeuses, secteur privé, 2024) | Entreprises | Salariés | Salariés / entreprise |
|---|---:|---:|---:|
| 0 à 9 salariés | 1 302 504 | 3 823 218 | 2,9 |
| 10 à 49 salariés | 215 659 | 4 394 936 | 20,4 |
| **0 à 49 (cible WorkHoraire)** | **1 518 163** | **8 218 154** | 5,4 |

Source : [open.urssaf.fr, données 2024](https://open.urssaf.fr/explore/dataset/nombre-etab-effectifs-salaries-et-masse-salariale-secteur-prive-tranche-ent/information/) ; ratios calculés par l'équipe.

- Les entreprises de 0 à 9 salariés ont en moyenne **1,02 établissement** : la cible est presque toujours **mono-site** (Analyse).
- Marché mondial des logiciels de pointage estimé entre **3,3 et 3,72 Md$ en 2025** selon les cabinets. Les projections à 10 ans varient du simple au double, et **aucun chiffre public fiable n'existe pour la France** (détail et sources en § 1.3 de l'annexe).
- 69 % des TPE de 1 à 9 salariés ont un « logiciel de gestion, comptabilité ou RH », une catégorie large qui ne mesure pas le pointage ([IFOP 2024](https://www.ifop.com/wp-content/uploads/2024/07/120745-presentation-barometre-de-la-digitalisation-des-tpe-vague-4.pdf)).
- **Aucune étude publique ne mesure la part des TPE encore sur Excel ou papier.** Nous ne citons donc aucun chiffre sur ce point.

## 2. Paysage concurrentiel

Six familles d'acteurs, 20 solutions étudiées (tableaux complets en § 2 de l'annexe) :

| Famille | Exemples | Modèle de prix | Limite pour une TPE (Analyse) |
|---|---|---|---|
| Planning + pointage terrain | Combo, Skello, Shyfter, Shiftbase, Agendrix | Surtout **par établissement** : dès 59 à 60 €/mois ([Skello](https://www.skello.io/pricing), [Combo](https://combohr.com/fr/pricing)) | Cher par salarié quand l'équipe est petite ; outils pensés pour le planning en shifts |
| SIRH modulaires | Lucca, Eurécia, Factorial, Sesame, Bizneo | Par salarié, environ 3 à 7 € | Minimums, seuils de taille, modules à additionner |
| GTA historique | Kelio, Octime, Horoquartz, Nibelis | Sur devis, badgeuses | Surdimensionné, prix opaques |
| Paie + pointage | PayFit, Silae RH | Groupé avec la paie ([PayFit : 27 €/salarié + 49 €/mois](https://payfit.com/pricing-lp/)) | Impose de migrer ou de payer la paie |
| Freemium international | Jibble, Connecteam, Clockify | Gratuit, puis prix par siège en $ | Pas d'intégration vérifiée avec la paie française |
| Pure player TPE français | **Pointeo** ([easypointage.fr](https://easypointage.fr/)) | Gratuit jusqu'à 3 salariés, puis dès 19 €/mois | **Concurrent direct** : positionnement proche du nôtre |

Ce que les clients reprochent aux outils existants (constats d'avis publics, § 4 de l'annexe besoins) :
1. **Le salarié ne voit pas ses propres heures** ni l'historique des modifications (Combo, Skello).
2. **L'export vers la paie est payant ou limité** : le lien Silae est à +1,50 €/salarié/mois chez Combo.
3. Des prix opaques ou en hausse, avec des engagements de 12 mois.
4. Le support après-vente, la fiabilité mobile et le mode hors ligne.

## 3. Prix du marché

Coût mensuel pour 1 établissement (prix publics « dès », calculs de l'équipe, détail en § 3.2 de l'annexe) :

| Solution | 5 salariés | 20 salariés |
|---|---:|---:|
| Skello Badgeuse Standard | ≥ 59 € | ≥ 59 € |
| Combo Time + pointeuse | ≥ 70 € | ≥ 100 € |
| Shiftbase Basic | 30 € | 86 € |
| Agendrix (pointage inclus) | 27,50 € | 110 € |
| Pointeo Pro (mensuel) | 28,80 € | 72,30 € |
| Jibble | 0 € | 0 € |

Pointeo : grille relevée le 24/09/2026 ([doc 08](08-prix-et-hebergement.md), § 2.1) : 23 € par mois avec 3 salariés inclus, puis 2,90 € par salarié ; montants calculés par l'équipe.

**Analyse :** pour la TPE moyenne de 2,9 salariés, les offres par établissement reviennent à environ **20 € par salarié et par mois**, contre environ 5,5 € pour une offre par utilisateur. Il existe un **creux tarifaire** entre les gratuits sans paie française et les spécialistes facturés par établissement.

## 4. Tendances utiles à nos choix

| Tendance (sourcée dans l'annexe, § 4) | Conséquence pour WorkHoraire |
|---|---|
| L'obligation de mesurer le temps se renforce en Europe (CJUE 2019, Allemagne 2022, projet espagnol) | La **preuve** (horodatage serveur, piste d'audit) est un argument de vente, pas seulement une exigence technique |
| La CNIL juge excessifs la biométrie et la photo systématique ; la géolocalisation n'est admise que si aucun autre moyen n'existe | **Vie privée dès la conception** : ni biométrie, ni photo, ni géolocalisation au MVP |
| Convergence paie et temps autour de **Silae** (8 M de bulletins par mois, environ 80 % des cabinets selon RH Matin et Compta Online) | L'export pour le cabinet est **inclus**, et un format Silae natif est la priorité suivante |
| Le kiosque tablette partagé se généralise | Le mode kiosque est une priorité de la roadmap (voir ADR 0006) |
| L'IA est très présente dans l'offre, mais 77 % des dirigeants de TPE n'envisagent pas d'outils d'IA ([IFOP](https://www.ifop.com/wp-content/uploads/2024/07/120745-presentation-barometre-de-la-digitalisation-des-tpe-vague-4.pdf)) | Pas d'IA comme argument d'achat |

## 5. Segments mal servis (Analyse)

- **A1 : TPE de 1 à 9 salariés, mono-site, hors restauration et commerce organisés en shifts.** Artisans, commerces de proximité, services : le segment le plus nombreux. Leurs besoins sont le pointage, les heures sup, des congés simples et un export pour le comptable.
- **A2 : PME de 10 à 49 salariés dont la paie est chez l'expert-comptable.** Trop petites pour Kelio ou Octime ; PayFit leur impose de migrer la paie.
- **A3 : employeurs qui veulent une preuve sans surveillance intrusive.** Peu d'offres d'entrée mettent en avant un journal d'audit : il est réservé à l'offre Enterprise chez Clockify.

## 6. Canaux d'acquisition observés

Priorités proposées (Analyse, § 6 de l'annexe) :
1. **Experts-comptables** et écosystème Silae : Eurécia réserve son offre TPE aux cabinets, Skello a un programme comptables, Combo un partenariat avec Baker Tilly.
2. **Référencement naturel** sur les requêtes « sortie d'Excel » : feuille d'heures, calcul des heures sup, badgeuse gratuite.
3. **Freemium** de 1 à 3 salariés, face à Pointeo.

## 7. Limites

- Les rapports de marché payants n'ont été lus qu'en résumé public.
- Les prix « dès » sont des bornes basses.
- L'éditeur de Pointeo n'a pas été identifié. Sa grille a été relevée le 24/09/2026 (doc 08, § 2.1) ; restent **à auditer** l'essai et l'éditeur (roadmap).
