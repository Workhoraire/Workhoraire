# Architecture cible : site vitrine, inscription, facturation et production

> Proposition du 24/09/2026, recentrée le même jour sur **ce qui reste à construire**. Ce qui est construit (site vitrine, inscription, facturation Stripe, e-mails, production sur un serveur) est décrit dans [architecture.md](architecture.md), et l'état daté du produit, fait et à faire, dans la [roadmap](../produit/06-roadmap.md). Ce document s'appuie sur les prix et les étapes d'hébergement de [../produit/08-prix-et-hebergement.md](../produit/08-prix-et-hebergement.md). Il respecte AGENTS.md : Angular, NestJS, PostgreSQL, Keycloak, Docker, et une application organisée en modules, sans microservices. Décision détaillée : [ADR 0008](adr/0008-architecture-de-production.md).

## 1. Objectifs

| Exigence | Pilotes | Lancement | Croissance |
|---|---|---|---|
| Disponibilité visée | 99 % (environ 7 h 18 d'arrêt par mois) | 99,5 % (environ 3 h 39) | 99,9 % (environ 44 min) |
| Données perdues au pire (RPO) | 24 h | 24 h, puis 1 h | 1 h ou moins |
| Temps de remise en service (RTO) | 4 h | 2 h | 30 min |
| Hébergement | 1 VPS OVHcloud | Instance Scaleway et PostgreSQL géré | Base doublée, 2 instances derrière un répartiteur de charge |

Toutes les données sont hébergées en France, chez des fournisseurs européens. Les relevés d'heures sont des données salariales : leur sauvegarde, et un test de restauration réussi, passent avant tout le reste.

## 2. Vue d'ensemble

Les noms de domaine sont des exemples, à réserver.

```mermaid
flowchart LR
  visiteur([Dirigeant ou salarié]) --> site["Site vitrine<br/>workhoraire.fr<br/>Angular prérendu, statique"]
  site -- "Commencer / Choisir l'offre" --> auth["Keycloak<br/>auth.workhoraire.fr<br/>inscription, connexion, MFA"]
  auth --> app["Application<br/>app.workhoraire.fr<br/>Angular"]
  app -- "HTTPS + jeton" --> api["API NestJS<br/>api.workhoraire.fr<br/>application en modules"]
  api --> db[("PostgreSQL<br/>données et comptes Keycloak")]
  auth --> db
  api -- "abonnements, factures" --> stripe["Stripe<br/>Checkout, espace client"]
  stripe -- "webhooks" --> api
  api -- "invitations, notifications" --> mail["E-mail transactionnel<br/>Brevo"]
  auth -- "vérification, mot de passe oublié" --> mail
  sup["Supervision<br/>disponibilité, journaux, alertes"] -.-> site & app & api & auth & db
```

**Pourquoi des sous-domaines séparés** : le site vitrine, l'application et Keycloak se déploient indépendamment. Les cookies de Keycloak restent isolés, et le site peut être mis en cache sans risque.

## 3. Le parcours client, du site à la facture

Construit. Le parcours est décrit dans [architecture.md](architecture.md) (§ 5, « S'abonner, du site à la facture »), et ses règles (salarié actif, délai de 30 jours, lecture seule, déclaration mensuelle) dans [exploitation.md](exploitation.md#4-paiement-en-ligne-stripe).

## 4. Composants

### 4.1 Site vitrine

Construit dans `site/` : voir [architecture.md](architecture.md), § 7. Pas encore construits :
- des pages de fonctionnalités par métier (restauration, commerce, artisans) ;
- une page de contact ;
- une mesure d'audience sans cookie, hébergée dans l'UE (doc 04).

### 4.2 Application et API

Construits : les modules `billing`, `notifications` et `privacy`, et les tables `Subscription`, `BillingUsage` et `ProcessedWebhook` (voir [architecture.md](architecture.md), § 1 et 2). Restent :
- la **purge automatique** des données au-delà de la durée de conservation, par une tâche planifiée ;
- un **verrou consultatif PostgreSQL** sur les tâches planifiées, obligatoire avant de lancer une seconde instance de l'API ([ADR 0008](adr/0008-architecture-de-production.md)).

### 4.3 Keycloak

Construits : thème de connexion aux couleurs de WorkHoraire, SMTP et vérification des e-mails, profil utilisateur réduit (e-mail et mot de passe). Restent :
- la **MFA obligatoire pour les administrateurs** ;
- 2 instances en cluster, à l'étape croissance.

### 4.4 Données

Construits : PostgreSQL 16, avec un schéma pour WorkHoraire et un pour Keycloak ; l'application se connecte avec un rôle **sans droit de modifier le schéma**, et les migrations Prisma passent par le propriétaire de la base (voir [architecture.md](architecture.md), § 7). Reste une règle pour déployer sans interruption : des migrations compatibles avec la version précédente de l'application (on ajoute, puis on retire).

## 5. Environnements et déploiement

| Environnement | Contenu | Données |
|---|---|---|
| Local | Docker Compose actuel | Données fictives |
| Préproduction | Copie de la production, plus petite | Données fictives, jamais de données clients |
| Production | Selon l'étape (§ 1) | Clients |

Aujourd'hui, la CI GitHub Actions lance les tests et construit les images sur chaque pull request et sur `main`, sans les publier. La production se déploie à la main, par `deploy.sh` ou depuis GitHub ([exploitation.md](exploitation.md#6-mises-à-jour-et-retour-arrière)). La préproduction n'existe pas encore.

**Cible (lot 4)** :
1. À chaque pull request : tests unitaires, tests e2e sur un PostgreSQL de test, build, vérification des dépendances.
2. Après la fusion dans `main` : images Docker (API, application, site), déploiement automatique en préproduction.
3. Pour la production, sur validation manuelle : sauvegarde, `prisma migrate deploy`, puis bascule vers les nouvelles images. **Retour arrière** : redéploiement des images précédentes.

## 6. Robustesse par étape

| Point de défaillance | Pilotes | Lancement | Croissance |
|---|---|---|---|
| Serveur applicatif | Un VPS : reconstruction scriptée depuis les sauvegardes | Une instance, et reconstruction scriptée | 2 instances derrière un répartiteur de charge |
| Base de données | Dump quotidien chiffré, copié hors du serveur | Base gérée avec sauvegardes automatiques, plus un dump quotidien exporté | Nœud de secours et restauration à un instant donné |
| Keycloak | Sur le VPS | Sur l'instance | 2 instances en cluster |
| Déploiements | Courte interruption | Courte interruption, annoncée | Sans interruption |
| **Test de restauration** | **Mensuel** | **Mensuel** | **Mensuel** |

## 7. Supervision et sécurité

- **Disponibilité** : l'API expose déjà `/health`. Une sonde extérieure la vérifie chaque minute, et une **page de statut publique** informe les clients.
- **Journaux et métriques** : journaux structurés, temps de réponse, erreurs 5xx, mémoire de Keycloak. Des alertes partent par e-mail. Les outils peuvent être auto-hébergés et libres (par exemple Uptime Kuma, Grafana, Loki, Prometheus), pour garder les données en France.
- **Sécurité** : suivre la checklist de [securite-et-rgpd.md](securite-et-rgpd.md). Notamment :
  - HTTPS partout, en-têtes HSTS et CSP ;
  - limite de requêtes sur l'API et la connexion ;
  - secrets hors du dépôt ;
  - analyse des dépendances et des images ;
  - sauvegardes chiffrées ;
  - **test d'intrusion avant l'ouverture au public**.
- **RGPD** : contrat de sous-traitance proposé sur le site, registre, purge automatique au-delà de la durée de conservation.

## 8. Plan de réalisation

| Lot | Contenu | Effort estimé |
|---|---|---|
| 0. Production pilote | Dockerfiles, `docker-compose.prod.yml` avec Caddy (HTTPS), noms de domaine, SMTP Brevo et vérification des e-mails, sauvegardes et test de restauration, sonde de disponibilité, GitHub Actions (tests et build) | 1 semaine |
| 1. Site vitrine | `site/` en Angular prérendu : accueil, tarifs et simulateur, fonctionnalités, sécurité, pages légales, plan du site pour le référencement | 1 à 2 semaines |
| 2. Facturation | Module `billing`, prix Stripe à l'usage (compteur, somme), Checkout, espace client, webhooks, comptage mensuel, limites de l'offre gratuite, lecture seule, page « Abonnement », CGV | 2 semaines |
| 3. E-mails | Module `notifications` : invitations envoyées par la plateforme, notifications de correction, rappels de sortie oubliée | 1 semaine |
| 4. Lancement | Passage à Scaleway (base gérée), préproduction, déploiement continu, journaux, métriques, alertes et page de statut | 1 semaine |
| 5. Obligations | Facture électronique via une plateforme agréée, **avant le 1er septembre 2027** | À planifier |
| 6. Croissance | Nœud de secours pour la base, 2 instances de l'API et de Keycloak, déploiement sans interruption, test d'intrusion | Selon la croissance |

Les efforts sont des estimations de l'équipe pour un ou deux développeurs. Elles sont à affiner au découpage des tâches.

Les lots 0 à 3 sont construits : voir [architecture.md](architecture.md). Ce qui reste de leur périmètre (noms de domaine, compte Brevo, sonde de disponibilité) relève de la mise en ligne. L'avancement daté est tenu dans la [roadmap](../produit/06-roadmap.md) ; l'ordre et le budget de la mise en ligne sont dans le [plan de lancement](../produit/09-plan-de-lancement.md), et la marche technique dans [exploitation.md](exploitation.md).
