# ADR 0002. Heures et alertes calculées à la volée, avec les seuils légaux par défaut

- **Statut** : accepté (MVP)
- **Date** : 2026-09-23

## Contexte

Les feuilles de temps, les heures supplémentaires et les alertes dépendent des pointages, des absences, du contrat et du fuseau. Une correction peut toucher une semaine déjà consultée. Les conventions collectives modifient les seuils, mais leur prise en charge exhaustive est hors de portée du MVP (plus de 900 conventions dans Silae).

## Décision

1. Les feuilles de temps, les heures sup et les alertes sont **recalculées à chaque lecture** par une fonction pure (`calculateTimesheet`), à partir des données sources. Rien n'est stocké en double.
2. Les seuils sont les **valeurs légales par défaut**, regroupées dans `labor-rules.ts` avec leur article de référence. L'interface rappelle qu'un accord collectif peut prévoir d'autres valeurs.
3. Les alertes sont **informatives**, jamais bloquantes.

## Conséquences

- Pas de désynchronisation possible : une correction se répercute immédiatement partout (écran, tableau de bord, export).
- La fonction pure se teste facilement : 12 scénarios, dont l'heure d'été et la jurisprudence de 2025.
- Le coût de calcul reste négligeable pour une TPE (au plus 93 jours × 50 salariés). Au-delà, il faudra mettre en cache ou matérialiser les semaines clôturées.
- Il n'y a pas d'historique des alertes (« alerte vue ou traitée le… ») : à ajouter avec la validation hebdomadaire (matrice n° 11).
- Rendre les seuils paramétrables imposera de **versionner les règles avec une date d'effet** (matrice n° 48), pour que le calcul d'une période passée ne change pas.
