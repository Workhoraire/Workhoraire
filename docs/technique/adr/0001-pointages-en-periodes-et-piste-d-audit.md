# ADR 0001. Pointages modélisés en périodes, avec une piste d'audit séparée

- **Statut** : accepté (MVP)
- **Date** : 2026-09-23

## Contexte

Le Code du travail impose d'enregistrer chaque jour le début et la fin de chaque période de travail (D3171-8), avec un système « fiable et infalsifiable » (L3171-4). Les oublis de pointage sont fréquents et doivent pouvoir être corrigés sans perdre l'historique.

## Décision

1. Une ligne `TimeEntry` = **une période de travail continue** (`startAt`, `endAt` nul tant qu'elle est ouverte). Une pause est l'intervalle entre deux périodes : le salarié pointe sa sortie, puis de nouveau son arrivée.
2. **Un seul pointage ouvert par salarié**, garanti en base : `openUserId` vaut `userId` tant que la période est ouverte, et un index unique le protège. Deux requêtes simultanées ne peuvent pas ouvrir deux périodes.
3. Chaque création, modification ou suppression **manuelle** écrit une ligne `TimeEntryAuditLog` (auteur, action, **motif obligatoire**, valeurs avant et après en JSON), dans la même transaction. Le journal n'a **pas de clé étrangère** vers `TimeEntry`, pour survivre à une suppression.
4. Les pointages en temps réel (`source = CLOCK`) prennent l'heure du serveur ; les saisies après coup sont marquées `MANUAL`.

## Conséquences

- Les heures se calculent simplement (somme des durées) et les pauses se déduisent des intervalles.
- Le salarié et le manager voient les mêmes corrections, avec leur motif.
- Une période supprimée disparaît de la table, mais sa valeur d'origine reste dans le journal. Une **suppression logique** et un **chaînage par empreinte** du journal renforceraient la preuve : c'est une piste identifiée dans la matrice de conformité (n° 3).

## Alternatives écartées

- **Journal d'événements entrée/sortie** (chaque badge est un événement) : plus fidèle aux badgeuses physiques, mais le calcul demande d'apparier les événements et de gérer les incohérences (deux entrées de suite, etc.). Surdimensionné pour le MVP.
- **Modification sans historique** : incompatible avec la preuve et la transparence attendues.
