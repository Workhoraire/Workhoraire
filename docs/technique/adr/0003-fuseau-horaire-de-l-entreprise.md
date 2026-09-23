# ADR 0003. Les jours et les semaines se calculent dans le fuseau de l'entreprise

- **Statut** : accepté (MVP)
- **Date** : 2026-09-23

## Contexte

Les instants sont stockés en UTC. Or une « journée » de travail, une semaine civile ou un jour férié sont des notions locales. Le passage à l'heure d'été et un serveur en UTC suffisent à décaler des heures d'un jour sur l'autre si l'on raisonne en UTC ou dans le fuseau du navigateur.

## Décision

1. Chaque entreprise a un fuseau IANA (`Company.timezone`, `Europe/Paris` par défaut, validé à l'onboarding).
2. Tous les calculs de jour (rattachement d'une période, bornes de requête, semaine civile) passent par `common/dates/local-date.ts`, qui s'appuie sur `Intl.DateTimeFormat`. **Aucune dépendance ajoutée** (AGENTS.md : pas de dépendance sans justification).
3. Une période est rattachée au **jour local où elle commence** : un poste de nuit compte pour le jour de sa prise de poste.
4. Le frontend affiche les heures dans le fuseau de l'entreprise (`core/time/time-format.ts`), jamais dans celui de l'appareil. Les instants envoyés à l'API portent toujours un fuseau explicite.

## Conséquences

- Les tests couvrent le passage à l'heure d'été et d'hiver (29 mars et 25 octobre 2026) et le changement de jour à minuit en heure locale.
- Le rattachement au jour de prise de poste est une convention répandue, mais certaines conventions collectives peuvent en retenir une autre : à paramétrer si un segment le demande.
- Une entreprise dont les sites sont dans plusieurs fuseaux nécessitera un fuseau par site (roadmap multi-sites).
