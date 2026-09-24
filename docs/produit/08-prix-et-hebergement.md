# 08. Prix et hébergement

> Proposition du 24/09/2026. Tous les prix viennent des pages officielles citées en fin de document (consultées le 24/09/2026) ; ils sont hors taxes sauf mention contraire. Les prix « à partir de » sont des bornes basses et peuvent dépendre de la durée d'engagement.

## 1. En bref

- **Prix** : gratuit jusqu'à 3 salariés, puis **3 € HT par salarié actif et par mois**, sans abonnement de base ni engagement. Remise de 17 % en paiement annuel : **pas encore proposée**, car l'application ne facture qu'au mois. Elle a été retirée du site en attendant.
- **Hébergement** : en France, en trois étapes.
  1. **Pilotes** : un VPS OVHcloud de 8 Go, pour environ 7 €/mois.
  2. **Lancement commercial** : un serveur Scaleway et une base PostgreSQL gérée, pour environ 33 €/mois.
  3. **Croissance** : ajout de la haute disponibilité quand le chiffre d'affaires la justifie.
- **Rentabilité de l'infrastructure** : 15 salariés payants couvrent l'hébergement de l'étape 2, par exemple deux entreprises de 8 salariés.
- **À prévoir** : facturation électronique obligatoire pour les PME et micro-entreprises à partir du **1er septembre 2027**.

## 2. Prix

### 2.1 Ce que fait le concurrent le plus proche

Pointeo, cité dans l'étude de marché (doc 01), publie sa grille complète :

| Offre Pointeo | Prix HT | Contenu |
|---|---|---|
| Gratuit | 0 € | Jusqu'à 3 employés, 1 site, 1 administrateur |
| Pro | 19 €/mois en annuel, 23 €/mois en mensuel, 3 employés inclus, puis **2,90 € par employé supplémentaire** | Employés et sites illimités, exports préformatés (Sage, Silae, ADP, Cegid, URSSAF) |
| Business | 49 €/mois en annuel, 59 €/mois en mensuel, 3 employés inclus, puis 2,90 € par employé | Administrateurs illimités, historique d'export de 5 ans |

Pointeo propose aussi une remise annuelle de 17 %, sans engagement, et un essai de 14 jours. Les offres facturées par établissement sont plus chères : Skello dès 59 €/mois, Combo dès 70 €/mois (doc 01).

### 2.2 Grille proposée

| Offre | Prix HT | Contenu |
|---|---|---|
| **Découverte** | 0 € jusqu'à 3 salariés actifs | Toutes les fonctions : pointage, feuilles de temps, alertes légales, absences, corrections tracées, exports |
| **Essentiel** | **3 € par salarié actif et par mois**, sans base ni minimum, sans engagement | Idem, sans limite de salariés, support par e-mail |
| Essentiel annuel | 2,50 € par salarié et par mois (30 € par an), soit 17 % de remise | Idem |
| **Pro** (plus tard) | Environ 5 € | Quand existeront les exports préformatés (Silae, Sage), le planning et la tablette de pointage |

**Un salarié actif** est un salarié qui a pointé ou posé une absence dans le mois. Les commerces et restaurants à saisonniers ne paient donc que les mois travaillés. C'est simple à expliquer et à vérifier dans la base, et c'est un argument de vente.

### 2.3 Comparaison, prix mensuels HT sans engagement

| Équipe | WorkHoraire | Pointeo Pro (23 € + 2,90 € par employé au-delà de 3) |
|---|---|---|
| 3 salariés | 0 € | 0 € (offre gratuite) |
| 5 salariés | 15 € | 28,80 € |
| 8 salariés | 24 € | 37,50 € |
| 15 salariés | 45 € | 57,80 € |
| 30 salariés | 90 € | 101,30 € |

**Analyse** : sans abonnement de base, nous sommes moins chers à toutes les tailles, surtout pour les petites équipes. Pointeo a plus de fonctions (GPS, QR code, planning, exports préformatés pour la paie). Nous avons un calcul des heures conforme au Code du travail (heures sup et complémentaires, jurisprudence 2025 sur les congés payés), des alertes légales et une piste d'audit visible par le salarié. Un prix plus bas compense les fonctions manquantes. Il faudra le relever avec l'offre Pro.

### 2.4 Lancement

1. **Pilotes** : 3 à 5 entreprises, gratuites pendant 3 mois, en échange d'entretiens (doc 04).
2. **Tarif fondateur** : les premiers clients payants gardent leur prix pendant 2 ans, même si la grille augmente.
3. **Paiement** : prélèvement SEPA mensuel par défaut, carte en option. Chaque mois, la facture compte les salariés actifs du mois.

### 2.5 Coûts variables : les frais de paiement (Stripe)

| Moyen de paiement | Frais Stripe | Pour une facture de 24 € |
|---|---|---|
| Prélèvement SEPA | 0,35 € par prélèvement + 0,7 % (Stripe Billing) | 0,52 €, soit 2,2 % |
| Carte standard de l'Espace économique européen | 1,5 % + 0,25 € + 0,7 % (Stripe Billing) | 0,78 €, soit 3,3 % |

Le prélèvement SEPA coûte moins cher. C'est aussi le moyen de paiement habituel entre professionnels.

### 2.6 Obligations de facturation

- **Facture électronique** : obligatoire pour l'émission des factures à partir du 1er septembre 2026 pour les grandes entreprises et les ETI, et à partir du **1er septembre 2027 pour les PME et micro-entreprises** (source : service-public, page mise à jour le 11/08/2026). Il faudra donc un outil de facturation compatible avant cette date.
- **TVA** : si la structure démarre en franchise en base de TVA, le seuil pour les prestations de services est de 37 500 € de chiffre d'affaires (tolérance à 41 250 €) en 2026. Les factures portent alors la mention « TVA non applicable - article 293 B du CGI ». Au-delà, la TVA de 20 % s'ajoute aux prix HT.

## 3. Hébergement

### 3.1 Besoins mesurés

| Composant | Mesure locale (au repos) | Référence |
|---|---|---|
| Keycloak | 805 Mo | 1 250 Mo par instance recommandés par Keycloak (caches et 10 000 sessions compris) |
| API NestJS | 82 Mo | – |
| PostgreSQL | 75 Mo ; base de 14 Mo | Croissance faible : quelques lignes par pointage |

**Conclusion** : un serveur de 4 Go est le minimum pour tout faire tourner ; 8 Go laissent de la marge. La base de données est l'actif critique : ses sauvegardes et la restauration doivent être testées.

**Principes retenus** : hébergement en France chez un fournisseur européen (argument de vente auprès des TPE, RGPD plus simple), pas de géant américain.

### 3.2 Options comparées (prix mensuels HT)

| Option | Composition | Coût | Pour | Contre |
|---|---|---|---|---|
| **A. VPS OVHcloud** | VPS-2 : 4 vCores, 8 Go, 75 Go NVMe ; tout sur le serveur (Docker Compose) | **dès 7,21 €** (VPS-1 de 4 Go : dès 3,81 €) | Le moins cher ; trafic illimité et sauvegarde quotidienne incluse | Tout repose sur un serveur ; mises à jour et sauvegardes à notre charge |
| **B. Scaleway, base gérée** | Instance PLAY2-NANO (2 vCPU, 4 Go) pour l'API, Keycloak et le site, et PostgreSQL géré DB-DEV-S (2 vCPU, 2 Go) | **environ 33 €** : 20,10 € + 11,23 €, plus le stockage (0,0993 €/Go) et les sauvegardes (0,03 €/Go) | La base, l'actif critique, est gérée et sauvegardée ; datacenters en France | Le serveur applicatif reste à entretenir |
| **C. Clever Cloud (PaaS)** | Application Node.js, PostgreSQL géré (1 Go : 15 €, sauvegarde quotidienne, 7 jours gardés) et Keycloak géré (37 €) | **plus de 52 €**, sans l'application (prix à estimer avec leur simulateur) | Plus aucun serveur à gérer | 2 à 3 fois plus cher que B |

### 3.3 Recommandation par étape

1. **Pilotes (maintenant)** : option A, VPS-2 OVHcloud en France.
   - Docker Compose avec Caddy (HTTPS automatique), l'API, le site Angular, Keycloak et PostgreSQL.
   - Sauvegarde quotidienne de la base (`pg_dump`), chiffrée et copiée **hors du serveur**. Restauration testée une fois par mois.
   - E-mails via Brevo : offre gratuite, ou Starter à 7 €/mois pour 5 000 e-mails, largement suffisant pour les invitations et les e-mails de Keycloak.
2. **Premiers clients payants** : option B, Scaleway.
   - PostgreSQL géré. Keycloak et l'API restent sur l'instance.
   - Un second petit environnement de préproduction (PLAY2-PICO, environ 10,42 €) pour tester les mises à jour avant la production.
3. **Croissance** : haute disponibilité de la base (nœud supplémentaire), seconde instance applicative, supervision, en suivant la checklist de sécurité ([../technique/securite-et-rgpd.md](../technique/securite-et-rgpd.md)).

L'option C convient si l'équipe ne veut gérer aucun serveur. Elle coûte plus cher.

### 3.4 Budget mensuel HT

| Étape | Hébergement | E-mails | Total indicatif |
|---|---|---|---|
| Pilotes | 7,21 € (VPS-2) | 0 € (offre gratuite) | **environ 7 €** |
| Lancement | environ 33 € (option B) + 10,42 € (préproduction) | 0 à 7 € | **environ 45 à 50 €** |

Le nom de domaine et le stockage externe des sauvegardes s'ajoutent ; leurs prix n'ont pas été relevés.

### 3.5 Seuil de rentabilité de l'infrastructure

À 3 € par salarié actif, 50 € par mois d'infrastructure sont couverts par environ 17 salariés payants, par exemple deux ou trois petites entreprises. Les frais de paiement (2 à 3 %) ne changent pas l'ordre de grandeur. Le vrai seuil de rentabilité dépend surtout du temps de l'équipe : 100 entreprises de 8 salariés rapportent 2 400 € HT par mois.

## 4. Décisions à prendre par l'équipe

1. Valider la grille (3 € par salarié actif) auprès de 5 à 10 prospects avant le lancement.
2. Choisir la structure juridique, qui détermine la TVA (franchise en base ou non) et l'outil de facturation électronique à mettre en place avant septembre 2027.
3. Commander le VPS des pilotes et décider qui s'occupe des sauvegardes et des mises à jour.

## Sources (consultées le 24/09/2026)

- Pointeo, tarifs : https://easypointage.fr/tarifs
- OVHcloud, VPS : https://www.ovhcloud.com/fr/vps/
- Scaleway, instances : https://www.scaleway.com/fr/tarifs/virtual-instances/
- Scaleway, bases de données gérées : https://www.scaleway.com/fr/tarifs/managed-databases/
- Clever Cloud, plans PostgreSQL et Keycloak (API publique) : https://api.clever-cloud.com/v2/products/addonproviders ; tarifs : https://clever.cloud/pricing/
- Brevo, tarifs : https://www.brevo.com/fr/pricing/
- Stripe, tarifs France : https://stripe.com/fr/pricing
- Keycloak, dimensionnement mémoire et CPU : https://www.keycloak.org/high-availability/multi-cluster/concepts-memory-and-cpu-sizing
- Facturation électronique, calendrier : https://entreprendre.service-public.gouv.fr/vosdroits/F31808
- Franchise en base de TVA, seuils 2026 : https://entreprendre.service-public.gouv.fr/vosdroits/F21746
- Concurrents facturés par établissement (Skello, Combo) : [01 Marché et concurrence](01-marche-et-concurrence.md)
