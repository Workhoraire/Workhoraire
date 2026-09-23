# ADR 0007. Historique des contrats, daté du lundi

- **Statut** : accepté (MVP)
- **Date** : 2026-09-23

## Contexte

Les heures sup et les heures complémentaires se calculent par semaine civile, par rapport à la durée contractuelle du salarié (moteur de calcul, R6 à R8). Jusqu'ici, cette durée était un simple champ du salarié. La revue de code a montré qu'en la modifiant (passage de 35 h à 28 h, par exemple), **toutes les semaines passées étaient recalculées** avec le nouveau contrat : les heures sup déjà payées devenaient des heures complémentaires, et un export refait ne correspondait plus à la paie versée.

Comme les calculs sont faits à la volée (ADR 0002), la seule façon d'avoir des semaines passées stables est de conserver l'historique des données sources.

## Décision

1. Une table `ContractPeriod` conserve chaque durée contractuelle avec sa **date d'effet**. Une contrainte SQL impose que cette date soit **un lundi**, et une seule période est possible par salarié et par date.
2. Chaque semaine est calculée avec le contrat **en vigueur le lundi** de cette semaine. Un changement en milieu de semaine s'applique à la semaine entière qui le contient : c'est la même règle que le décompte des heures sup, qui porte sur la semaine civile.
3. L'administrateur choisit la date d'effet, et c'est la semaine en cours par défaut. Une date passée corrige le contrat de manière rétroactive, jusqu'au changement suivant.
4. Les salariés existants reçoivent une période initiale datée du 3 janvier 2000 (un lundi), reprise de leur contrat actuel : la migration ne change aucun calcul. Le champ `User.weeklyContractMinutes` garde le contrat en vigueur cette semaine, pour l'affichage.

## Conséquences

- Les semaines passées, et donc les exports, ne changent plus quand le contrat change.
- L'historique n'est pas encore visible dans l'interface. Il ne s'y voit qu'à travers les calculs (colonne « Contrat » de l'export hebdomadaire). À ajouter avec la fiche salarié.
- Le même principe servira à versionner les autres paramètres, comme les seuils d'un accord collectif (ADR 0002, matrice n° 48).
