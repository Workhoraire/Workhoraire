# ADR 0008. Architecture de production : site vitrine prérendu, facturation Stripe dans l'application, hébergement par étapes

- **Statut** : accepté le 24/09/2026 (voir la mise à jour en fin de document ; la décision 3 est modifiée)
- **Date** : 2026-09-24

## Contexte

Pour vendre WorkHoraire, il faut :
- un site vitrine qui présente l'offre et les tarifs, bien référencé ;
- une inscription en libre-service ;
- une facturation mensuelle au nombre de salariés actifs (doc 08) ;
- une production fiable pour des données salariales.

AGENTS.md impose Angular, NestJS, PostgreSQL, Keycloak et Docker, une application organisée en modules dans un seul programme, et pas de microservices sans besoin concret.

## Décision

1. **Site vitrine** : une application Angular distincte (`site/`), **prérendue en HTML statique** au build. La technologie reste celle de l'équipe. Le site est rapide et bien référencé, sans serveur à maintenir. Il ne contient ni cookie ni traceur tiers.
2. **Facturation** : un module `billing` dans l'API NestJS, qui s'appuie sur **Stripe** (Checkout, espace client, facturation à l'usage avec un compteur, webhooks). WorkHoraire ne stocke aucune donnée de paiement.
3. **E-mails et tâches planifiées** : modules `notifications` (Brevo) et `jobs` dans l'API. Un verrou PostgreSQL permet d'avoir plusieurs instances. *Modifiée le 24/09/2026 : voir la mise à jour ci-dessous.*
4. **Hébergement en France, par étapes**. Pilotes : un VPS. Lancement : une instance et une base PostgreSQL gérée. Croissance : haute disponibilité. Chaque étape fixe ses objectifs de disponibilité et de sauvegarde (architecture-cible.md, § 1).
5. **Sous-domaines séparés** pour le site, l'application, l'API et Keycloak.

## Options écartées

- **Site vitrine sur un autre outil** (générateur de site statique, CMS hébergé) : il introduit une technologie hors d'AGENTS.md pour un gain limité.
- **Site vitrine intégré à l'application** : le site hériterait de la connexion obligatoire et des cycles de déploiement de l'application, avec un référencement moins bon.
- **Service de facturation séparé** : c'est un microservice sans besoin concret, contraire à AGENTS.md.
- **Hyperscaler américain** : plus cher à ce stade, et il affaiblit l'argument de souveraineté auprès des TPE.

## Conséquences

- Un troisième dossier applicatif, `site/`, avec son build et son déploiement statique.
- Une dépendance à Stripe pour l'encaissement. Il faudra le compléter par une plateforme agréée pour la facture électronique, avant le 1er septembre 2027.
- De nouvelles tables (`Subscription`, `BillingUsage`, `ProcessedWebhook`) et de nouveaux tests : webhooks rejoués, comptage des salariés actifs, passage en lecture seule.

## Mise à jour du 24/09/2026 : ce qui a été construit

Les décisions 1, 2, 4 et 5 sont appliquées : site vitrine dans `site/`, module `billing` avec Stripe, hébergement par étapes (pilotes prévus sur un VPS OVHcloud en France, doc 08), sous-domaines séparés. Le détail est dans [architecture.md](../architecture.md).

La décision 3 est modifiée :
- Il n'y a **pas de module `jobs`**. Chaque tâche planifiée vit dans son module, avec `@nestjs/schedule` : `BillingJob` dans `billing/` (chaque jour à 04:00 UTC) et `ForgottenClockOutJob` dans `time-entries/` (toutes les 15 minutes).
- L'API tourne en **une seule instance**, et aucun verrou n'est posé aujourd'hui.
- **Un verrou consultatif PostgreSQL est obligatoire avant de lancer une seconde instance de l'API**, pour qu'une tâche planifiée ne s'exécute jamais deux fois en même temps.
- Les e-mails passent bien par le module `notifications` (SMTP : Brevo en production, Mailpit en local).

S'y ajoute un module `privacy`, pour l'export des données personnelles.
