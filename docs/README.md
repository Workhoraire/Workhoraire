# Documentation WorkHoraire

Commencer par la **[synthèse](produit/00-synthese.md)**.

## Produit (`produit/`)

1. [00 Synthèse](produit/00-synthese.md)
2. [01 Marché et concurrence](produit/01-marche-et-concurrence.md)
3. [02 Cadre légal, RGPD et matrice de conformité](produit/02-cadre-legal-et-rgpd.md)
4. [03 Utilisateurs et besoins](produit/03-utilisateurs-et-besoins.md)
5. [04 Stratégie produit](produit/04-strategie-produit.md)
6. [05 Spécifications du MVP](produit/05-specifications-mvp.md)
7. [06 Roadmap](produit/06-roadmap.md)
8. [07 Kit de conformité client](produit/07-kit-conformite-client.md)
9. [08 Prix et hébergement](produit/08-prix-et-hebergement.md)
10. Études sourcées complètes (`produit/recherche/`) : [marché](produit/recherche/etude-de-marche-complete.md), [cadre juridique](produit/recherche/cadre-juridique-complet.md), [besoins utilisateurs](produit/recherche/besoins-utilisateurs-complet.md)

## Technique (`technique/`)

- [Architecture](technique/architecture.md)
- [Architecture cible](technique/architecture-cible.md) : site vitrine, inscription, facturation Stripe, production robuste par étapes
- [API REST](technique/api.md)
- [Moteur de calcul des heures](technique/moteur-de-calcul.md)
- [Sécurité et RGPD](technique/securite-et-rgpd.md), avec la checklist de mise en production
- [Tests et qualité](technique/tests-et-qualite.md), avec le scénario de recette
- [Exploitation](technique/exploitation.md) : mise en ligne, Keycloak, Stripe, sauvegardes, mises à jour, surveillance
- Décisions d'architecture (ADR) :
  - [0001 Pointages en périodes et piste d'audit](technique/adr/0001-pointages-en-periodes-et-piste-d-audit.md)
  - [0002 Calculs à la volée et seuils légaux par défaut](technique/adr/0002-calculs-a-la-volee-et-seuils-legaux-par-defaut.md)
  - [0003 Fuseau horaire de l'entreprise](technique/adr/0003-fuseau-horaire-de-l-entreprise.md)
  - [0004 Inscription libre et e-mail vérifié](technique/adr/0004-inscription-libre-et-email-verifie.md)
  - [0005 Exports CSV avant l'intégration paie](technique/adr/0005-exports-csv-avant-integration-paie.md)
  - [0006 Confiance sans surveillance, mode kiosque à décider](technique/adr/0006-confiance-sans-surveillance.md)
  - [0007 Historique des contrats, daté du lundi](technique/adr/0007-historique-des-contrats.md)
  - [0008 Architecture de production](technique/adr/0008-architecture-de-production.md) (proposé)

## Conventions

- Les faits sont **sourcés** (lien vers la page consultée, date de consultation). Les déductions sont marquées « Analyse » et les hypothèses « Hypothèse ».
- Les documents juridiques ne sont **pas des avis juridiques**.
- [AGENTS.md](../AGENTS.md) reste la source de vérité des règles de développement.
