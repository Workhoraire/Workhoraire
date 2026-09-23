# Sécurité et RGPD (volet technique)

Complément technique de [../produit/02-cadre-legal-et-rgpd.md](../produit/02-cadre-legal-et-rgpd.md). Ce document sert aussi de **description du traitement** que l'éditeur, en tant que sous-traitant, remet à ses clients pour leur registre et, le cas échéant, leur AIPD.

## 1. Description du traitement

| Élément | Contenu |
|---|---|
| Responsable du traitement | L'entreprise cliente (employeur) |
| Sous-traitant | L'éditeur de WorkHoraire (art. 28 RGPD) |
| Finalités | Décompte du temps de travail, paie (heures sup et complémentaires, absences), gestion des absences, respect des durées maximales et des repos |
| Personnes concernées | Salariés de l'entreprise cliente |
| Données | Identité (nom, prénom, e-mail), rôle, durée contractuelle, matricule de paie ; horodatages de début et de fin de travail, notes ; corrections (auteur, motif, valeurs avant et après) ; absences (type, dates, commentaire). Identité Keycloak : identifiant technique (`sub`) et e-mail |
| Données exclues par conception | Biométrie, photo, localisation, données d'appareil, mesure de l'activité, informations médicales (seul le type « arrêt maladie » est connu) |
| Destinataires | Personnes habilitées du client (ADMIN, MANAGER) ; le salarié pour ses propres données ; le gestionnaire de paie destinataire des exports (fichier remis par le client) |
| Conservation | Politique proposée : base active jusqu'à la paie, archive de 3 ans, puis purge. **Pas encore automatisée** (roadmap n° 6) |
| AIPD | La délibération CNIL 2019-118 dispense d'AIPD le contrôle des horaires **sans biométrie**. Toute future option de géolocalisation imposerait une réanalyse |

## 2. Mesures en place

**Identité et accès**
- Keycloak : comptes nominatifs, mots de passe jamais stockés par WorkHoraire, OIDC avec PKCE, audience vérifiée.
- Realm : protection anti-brute-force (10 échecs, attente croissante jusqu'à 15 min) et politique de mot de passe (12 caractères au moins, différent de l'e-mail et de l'identifiant). **Cette politique est à confronter à la recommandation CNIL en vigueur sur les mots de passe avant la production.**
- Utilisateur applicatif obligatoire : un compte Keycloak sans rattachement à une entreprise est refusé (403), de même qu'un compte désactivé.
- Rôles vérifiés côté API. Les gardes Angular ne servent que l'ergonomie.
- Règles de séparation des tâches : un MANAGER ne corrige pas ses propres heures, et il ne valide ni n'annule ses propres congés.
- `KEYCLOAK_REQUIRE_VERIFIED_EMAIL=false`, réservé au développement local, empêche l'API de démarrer si `NODE_ENV=production`.

**Isolation des clients**
- `companyId` issu de l'utilisateur authentifié, jamais du client. Tout accès par identifiant (salarié, pointage, absence) est filtré sur l'entreprise, et un identifiant d'une autre entreprise renvoie 404.
- Tests dédiés : tests unitaires des services, et e2e « tenant isolation » sur une vraie base PostgreSQL.

**Intégrité et preuve**
- L'heure des pointages est celle du serveur.
- Contraintes SQL (unicité du pointage ouvert, `CHECK`), transactions pour les corrections.
- Concurrence : les écritures sur un même salarié (corrections, demandes et validations d'absence) sont sérialisées par un verrou de ligne. Une correction faite sur une version périmée est refusée (409, verrou optimiste) au lieu d'écraser silencieusement celle d'un collègue.
- Une période corrigée ne peut pas changer de jour. Elle reste donc visible dans l'historique des corrections de son jour, que chacun consulte par période.
- Piste d'audit en ajout seul, sans clé étrangère vers le pointage : elle survit à sa suppression. Aucune route ne modifie ni ne supprime une entrée d'audit.

**Entrées et sorties**
- Validation en liste blanche (`forbidNonWhitelisted`), instants ISO avec fuseau obligatoire, textes bornés à 500 caractères, périodes bornées (93 jours, 62 pour les exports).
- CSV protégé contre l'injection de formules (`=`, `+`, `-`, `@`, tabulation, retour chariot).
- Angular échappe les données affichées ; aucun `innerHTML` avec des données utilisateur.

**Vie privée côté navigateur**
- Polices et icônes auto-hébergées : aucune requête vers Google Fonts ni vers un CDN.
- Aucun traceur, aucune mesure d'audience tierce.

## 3. Menaces principales et parades

| Menace | Parade actuelle | À faire |
|---|---|---|
| Un salarié gonfle ses heures | Heure du serveur ; seule la sortie oubliée est déclarative, et elle est tracée et visible du manager | Validation hebdomadaire par le manager |
| Un manager modifie ses propres heures | Refus 403 et piste d'audit | – |
| Un manager efface des heures pour réduire la paie | Motif obligatoire, piste d'audit visible par le salarié | Notification du salarié à chaque correction |
| Accès aux données d'une autre entreprise | Filtrage systématique par `companyId`, tests | Revue de code sur chaque nouvelle route |
| Vol de compte administrateur | Anti-brute-force Keycloak | MFA obligatoire pour les ADMIN, journal des connexions |
| Invitation détournée (lien transmis à un tiers) | Jeton aléatoire de 256 bits, haché, usage unique, expiration à 7 jours, e-mail identique et **vérifié** exigé ; un nouveau lien pour la même adresse annule le précédent | Envoi de l'invitation par e-mail depuis la plateforme ; liste des invitations en attente, révocables |
| Injection de formule dans l'export | Neutralisation des préfixes dangereux | – |
| Déni de service par requêtes lourdes | Périodes bornées | Limitation de débit (rate limiting), pagination des listes (plafonnées à 500 lignes aujourd'hui) |

## 4. Checklist de mise en production

- [ ] HTTPS partout. Mettre `KEYCLOAK_SSL_REQUIRED=external` (ou `all`) et `FRONTEND_URL` sur le domaine réel.
- [ ] Keycloak : `verifyEmail: true` avec un SMTP configuré ; `KEYCLOAK_REQUIRE_VERIFIED_EMAIL=true` (valeur par défaut) ; URI de redirection et *web origins* limités au domaine de production ; mode `start` (pas `start-dev`).
- [ ] Mots de passe forts et uniques pour Postgres et l'administrateur Keycloak, stockés dans un coffre de secrets. Le `.env` ne quitte jamais le serveur.
- [ ] MFA (OTP) obligatoire pour les comptes ADMIN.
- [ ] Hébergement dans l'Union européenne, sauvegardes chiffrées de Postgres testées (restauration), chiffrement au repos.
- [ ] Journalisation des accès et des erreurs, sans données personnelles inutiles, conservée 3 mois.
- [ ] Limitation de débit sur l'API et en-têtes de sécurité (CSP, HSTS) sur le frontend.
- [ ] Contrat de sous-traitance (art. 28), registre des traitements du sous-traitant, procédure de gestion des violations.
- [ ] Purge automatique des données au-delà de la durée de conservation.
- [ ] Audit d'accessibilité (RGAA) et test de charge sur l'export mensuel.

## 5. Données de développement

- Le `.env` local est ignoré par Git ; ses mots de passe ont été générés aléatoirement pour la machine de développement.
- La base `workhoraire_e2e` est **vidée à chaque exécution** des tests e2e. Ceux-ci refusent de tourner sur une base dont le nom ne finit pas par `_e2e` : ce nom est contrôlé dans `E2E_DATABASE_URL` avant même les migrations, puis sur la base connectée avant de la vider.
