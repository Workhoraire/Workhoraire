# Moteur de calcul des heures

Code : `backend/src/timesheets/timesheet.calculator.ts` (fonctions pures, sans base de données). Seuils : `backend/src/timesheets/labor-rules.ts`. Tests : `timesheet.calculator.spec.ts` (15 cas), `local-date.spec.ts` (fuseaux, jours fériés).

Les références légales sont détaillées dans [../produit/02-cadre-legal-et-rgpd.md](../produit/02-cadre-legal-et-rgpd.md).

## 1. Données d'entrée

- **Pointages** (`TimeEntry`) : une **période de travail continue** (`startAt`, `endAt`). Une pause est l'intervalle entre deux périodes.
- **Absences acceptées** (`AbsenceRequest`), avec leurs demi-journées.
- **Historique des contrats** (`ContractPeriod`) : durée hebdomadaire en minutes (2100 = 35 h) et date d'effet, toujours un lundi (ADR 0007). Sans historique, la durée du salarié est utilisée.
- **Fuseau de l'entreprise** (IANA, `Europe/Paris` par défaut).
- **Instant courant** (`now`), injecté pour rendre les calculs testables.

## 2. Règles

| # | Règle | Détail | Base |
|---|---|---|---|
| R1 | Rattachement au jour | Une période compte pour le **jour local où elle commence**, dans le fuseau de l'entreprise. Un poste de 22 h à 6 h compte pour le jour du début | Choix produit, documenté (ADR 0003) |
| R2 | Minutes entières | Durée = fin − début, les deux **tronqués à la minute** : 08:00:40 → 12:00:10 donne 4 h 00, soit ce que lit le salarié | Choix produit |
| R3 | Pointage en cours | Compté **jusqu'à maintenant**, pour un affichage en direct | – |
| R4 | Sortie oubliée | Un pointage ouvert depuis **plus de 12 h** compte **0 minute** et lève `OPEN_ENTRY_TOO_LONG`, tant que l'heure réelle n'est pas déclarée | Ne jamais inventer d'heures |
| R5 | Semaine | Semaine civile, **du lundi 0 h au dimanche 24 h**. Les heures sup se calculent toujours sur des semaines complètes, même si la période demandée commence en milieu de semaine. Une période à cheval sur deux semaines (nuit du dimanche au lundi) est **coupée au lundi 0 h** pour les totaux hebdomadaires ; l'affichage par jour suit R1 | L3121-35 |
| R6 | Heures sup (contrat ≥ 35 h) | Excédent = heures travaillées + **crédit de congés payés** − 35 h. Les 8 premières heures sont à **+25 %**, les suivantes à **+50 %** | L3121-27, L3121-36 |
| R7 | Congés payés dans le seuil | Chaque jour de congé payé pris dans la semaine vaut 1/5 de la durée contractuelle hebdomadaire (demi-journée : la moitié). Contrat de 39 h : 7 h 48 par jour | Cass. soc. 10/09/2025, n° 23-14.455. **La valorisation à 1/5 est un choix de l'équipe**, la Cour ne précisant pas la méthode. Un jour de congé où des heures sont pointées n'est **pas crédité**, pour ne pas inventer d'heures sup |
| R8 | Heures complémentaires (contrat < 35 h) | Excédent = heures travaillées − contrat. Jusqu'à **1/10 du contrat** à **+10 %**, au-delà à **+25 %**, avec l'alerte `COMPLEMENTARY_HOURS_LIMIT`. Les congés payés ne sont pas crédités pour les temps partiels (non vérifié en jurisprudence) | L3123-28, L3123-29 |
| R9 | Jours fériés | Les 11 jours légaux, Pâques calculé par l'algorithme de Meeus/Jones/Butcher. Alsace-Moselle et outre-mer ne sont pas encore gérés | L3133-1 |
| R10 | Absences | Comptées en **jours ouvrés** : du lundi au vendredi, jours fériés exclus. Une demi-journée compte 0,5 | Choix produit (le Code raisonne en jours ouvrables ; paramètre à venir) |
| R11 | Contrat applicable | Chaque semaine est calculée avec le contrat **en vigueur le lundi** de cette semaine. Changer le contrat ne modifie donc pas les semaines passées | Choix produit : relevés et exports stables (ADR 0007) |

## 3. Alertes

| Code | Déclenchement | Base |
|---|---|---|
| `DAILY_MAX_EXCEEDED` | Plus de 10 h travaillées dans la journée | L3121-18 |
| `MISSING_BREAK` | Au moins 6 h travaillées et aucune interruption de 20 min consécutives entre deux périodes du jour | L3121-16 |
| `INSUFFICIENT_DAILY_REST` | Moins de 11 h entre la fin de la dernière période d'un jour et le début de la première période du jour suivant travaillé. Le jour qui précède la période demandée est chargé pour contrôler le premier jour | L3131-1 |
| `WEEKLY_MAX_EXCEEDED` | Plus de 48 h dans la semaine civile | L3121-20 |
| `TOO_MANY_WORKING_DAYS` | 7 jours travaillés dans la semaine | L3132-1 |
| `COMPLEMENTARY_HOURS_LIMIT` | Heures complémentaires au-delà de 1/10 du contrat | L3123-28 |
| `OPEN_ENTRY_TOO_LONG` | Pointage ouvert depuis plus de 12 h | Règle produit |
| `WORK_DURING_ABSENCE` | Heures pointées un jour entièrement couvert par une absence acceptée. Les données se contredisent : il faut annuler l'absence ou corriger les heures | Règle produit |

Les alertes sont **recalculées à chaque lecture** et ne sont pas stockées (ADR 0002). Elles sont informatives et jamais bloquantes.

## 4. Exemples de référence (tests automatisés)

| Situation | Résultat attendu |
|---|---|
| 4 jours de 8 h + 1 jour de 3 h, contrat de 35 h | 35 h, aucune heure sup, aucune alerte |
| 5 jours de 9 h 30, contrat de 39 h | 47 h 30 : 8 h à +25 %, 4 h 30 à +50 % |
| Contrat de 39 h, 1 jour de congé payé + 4 jours de 7 h 48 | 31 h 12 travaillées + 7 h 48 de crédit : **4 h à +25 %**. Si l'absence est un arrêt maladie, aucune heure sup |
| Contrat de 24 h, 28 h travaillées | 4 h complémentaires : 2 h 24 à +10 %, 1 h 36 à +25 %, alerte 1/10 |
| 07:00-12:00 puis 12:10-18:10 | Alertes 10 h (11 h) et pause (10 min) |
| Poste de 17 h à 1 h, reprise à 9 h | 8 h rattachées au premier jour ; alerte repos (8 h) le lendemain |
| Pointage ouvert depuis 24 h | 0 h comptée, seule l'alerte « sortie non pointée » est levée |
| Congés payés du lundi au vendredi, mais 7 h travaillées jeudi et vendredi | 14 h travaillées + 3 jours de crédit (21 h) : aucune heure sup ; alerte « heures pointées pendant une absence » jeudi et vendredi |
| Poste du dimanche 22 h au lundi 6 h, puis 5 jours de 7 h | 6 h après le lundi 0 h + 35 h = 41 h dans la semaine du lundi : 6 h à +25 % |
| Contrat de 35 h, puis de 28 h à partir du lundi 28 septembre | Semaine du 21 : seuil de 35 h ; semaine du 28 : contrat de 28 h |
| 23:30 UTC un lundi | Rattaché au mardi en heure de Paris (UTC+2) |
| Congés du vendredi après-midi au mardi matin, férié le mercredi 11 novembre | 2 jours ouvrés (0,5 + 1 + 0,5) ; week-end non compté |

## 5. Limites connues

- Pas de paramétrage des accords : taux, seuils, semaine de référence et contingent sont les valeurs légales par défaut.
- Pas de moyenne de 44 h sur 12 semaines, pas de repos hebdomadaire de 35 h, pas de travail de nuit ni de profil « mineur ».
- La coupure d'un poste en deux services compte comme une pause : c'est correct pour la règle des 20 minutes, mais l'amplitude n'est pas contrôlée.
- Pour une semaine à cheval sur deux mois, l'export donne la semaine entière et le rattachement au mois de paie est à décider par le gestionnaire.
