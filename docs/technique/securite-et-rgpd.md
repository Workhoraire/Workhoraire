# Sécurité et RGPD (volet technique)

Complément technique de [../produit/02-cadre-legal-et-rgpd.md](../produit/02-cadre-legal-et-rgpd.md). Ce document sert aussi de **description du traitement** que l'éditeur, en tant que sous-traitant, remet à ses clients pour leur registre et, le cas échéant, leur AIPD. L'avancement des points à faire est suivi dans la [roadmap](../produit/06-roadmap.md).

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
| Sous-traitants ultérieurs | Ceux du contrat de sous-traitance publié sur le site (`/sous-traitance`) : l'hébergeur du serveur (OVHcloud, en France) ; le fournisseur SMTP (Brevo, Sendinblue SAS, Paris), pour les e-mails d'invitation, de correction et de rappel de sortie oubliée : données hébergées dans l'UE, certains de ses prestataires techniques pouvant y accéder depuis les États-Unis avec les garanties du RGPD |
| Paiement de l'abonnement (hors sous-traitance) | **Stripe** encaisse l'abonnement de l'entreprise cliente. Il ne reçoit que des données de l'entreprise (raison sociale, e-mail de l'administrateur, adresse et n° de TVA saisis sur sa page) et le **nombre** de salariés actifs du mois, jamais leur identité ni leurs heures |
| Conservation | Politique proposée : base active jusqu'à la paie, archive de 3 ans, puis purge. **Pas encore automatisée** (roadmap n° 6) |
| AIPD | La délibération CNIL 2019-118 dispense d'AIPD le contrôle des horaires **sans biométrie**. Toute future option de géolocalisation imposerait une réanalyse |

## 2. Mesures en place

**Identité et accès**
- Keycloak : comptes nominatifs, mots de passe jamais stockés par WorkHoraire, OIDC avec PKCE, audience vérifiée.
- Realm : protection anti-brute-force (10 échecs, attente croissante jusqu'à 15 min) et politique de mot de passe (12 caractères au moins, différent de l'e-mail et de l'identifiant). **Cette politique est à confronter à la recommandation CNIL en vigueur sur les mots de passe avant la production.**
- Sessions : 30 minutes sans activité et 10 heures au plus, les valeurs par défaut de Keycloak. Avec « Rester connecté », choisi par la personne, la session tient 14 jours sans activité et 30 jours au plus : un salarié qui pointe sur son téléphone n'a pas à retaper son mot de passe matin et soir.
- Chacun gère son mot de passe et peut activer la double authentification (MFA) depuis « Mot de passe et sécurité » (espace compte de Keycloak).
- Journal des connexions du realm (connexions, échecs, mots de passe oubliés), conservé 180 jours. Le client `admin-cli` du realm refuse la connexion directe par mot de passe : on ne se connecte que par la page de connexion.
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
- Piste d'audit en ajout seul, sans clé étrangère vers le pointage : elle survit à sa suppression. Aucune route ne modifie ni ne supprime une entrée d'audit. En production, la base le garantit aussi : le rôle de l'API n'a ni `UPDATE` ni `DELETE` sur cette table. Seul le propriétaire de la base en supprime, à la clôture d'un compte.

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
| Un manager efface des heures pour réduire la paie | Motif obligatoire, piste d'audit visible par le salarié, e-mail au salarié pour chaque correction faite par un autre | Contestation par le salarié |
| Accès aux données d'une autre entreprise | Filtrage systématique par `companyId`, tests | Revue de code sur chaque nouvelle route |
| Vol de compte administrateur | Anti-brute-force Keycloak ; journal des connexions (180 jours) ; administrateur de Keycloak nominatif, avec OTP, créé à la mise en ligne ([exploitation.md](exploitation.md), § 3) | MFA obligatoire pour les ADMIN |
| Invitation détournée (lien transmis à un tiers) | Jeton aléatoire de 256 bits, haché, usage unique, expiration à 7 jours, e-mail identique et **vérifié** exigé ; un nouveau lien pour la même adresse annule le précédent ; l'aperçu public du lien ne montre que l'invitation elle-même (prénom, nom, adresse, entreprise) ; le mot de passe est saisi dans Keycloak, jamais dans WorkHoraire ; le lien part par e-mail à l'adresse invitée | Liste des invitations en attente, révocables |
| Injection de formule dans l'export | Neutralisation des préfixes dangereux | – |
| Déni de service par requêtes lourdes | Périodes bornées ; limitation de débit (300 requêtes par minute et par adresse IP, 20 par minute pour les invitations) | Pagination des listes (plafonnées à 500 lignes aujourd'hui) |

## 3 bis. Revue de sécurité du 24/09/2026

Une revue du code et de la configuration, de bout en bout, a trouvé les défauts suivants. Tous sont corrigés et vérifiés.

| Gravité | Défaut | Correction |
|---|---|---|
| Critique | Keycloak 26.1.1 : prise de contrôle d'un compte sans authentification par le flux « mot de passe oublié » (CVE-2026-18963, corrigée en 26.7.2 ; sources relevées le 24/09/2026 : [ticket Keycloak](https://github.com/keycloak/keycloak/issues/51833), [avis Red Hat](https://access.redhat.com/security/cve/cve-2026-18963)) | Keycloak 26.7.4, en développement comme en production ; le thème et les données ont été vérifiés après la migration |
| Critique | `bootstrap.sh` pouvait fermer l'accès SSH : il recopiait la clé de root, que cloud-init préfixe d'une commande qui refuse la connexion, et la triait avant la clé normale | Les clés d'un compte existant ne sont plus touchées ; un nouveau compte ne reçoit que des clés sans option |
| Haute | Envoi d'e-mails vers n'importe quelle adresse, depuis l'expéditeur WorkHoraire : un administrateur changeait l'adresse d'un salarié, puis corrigeait ses heures | L'adresse est celle, vérifiée, du compte de connexion : l'administrateur ne la modifie plus. Pas d'e-mail pour ses propres corrections, 20 invitations par minute et 100 par jour et par entreprise, adresses web refusées dans les noms |
| Haute | Scripts du serveur non exécutables après un clone (fichiers enregistrés depuis Windows) | Ils sont appelés par `bash`, y compris par la commande forcée de GitHub Actions |
| Haute | Une restauration après une migration pouvait laisser la base à moitié supprimée (`pg_restore --clean`, sans transaction) | `restore.sh` sauvegarde d'abord la base actuelle, puis la supprime et la recrée depuis la sauvegarde (`pg_restore --create`) |
| Moyenne | Entreprise créée avec une adresse non vérifiée | Vérification exigée dans le realm dès sa création, et contrôlée par l'API |
| Moyenne | L'API et Keycloak partageaient le super-utilisateur de la base | Trois rôles : le propriétaire migre et sauvegarde ; Keycloak possède son schéma ; l'API lit et écrit les données, sans DDL ni accès à Keycloak. Contrôlé en répétition. L'API ne peut en plus ni modifier ni supprimer la piste d'audit des corrections |
| Moyenne | Images de base jamais mises à jour | `deploy.sh` récupère les nouvelles images de base à chaque déploiement |
| Moyenne | Les changements du Caddyfile ne s'appliquaient pas : fichier monté seul, jamais rechargé | Dossier monté ; `deploy.sh` valide la configuration, puis la recharge |
| Moyenne | Copie hors serveur impossible avec une clé en écriture seule, et un échec bloquait le déploiement | Options de rclone adaptées ; un échec n'est plus qu'un avertissement, et le signal de vie des sauvegardes n'est alors pas envoyé |
| Moyenne | Valeurs d'exemple et mots de passe qui cassent les adresses de connexion acceptés dans `.env.production` | `deploy.sh` les refuse : lettres et chiffres seulement |
| Moyenne | Rôles de la base créés une seule fois : un mot de passe changé dans `.env.production` n'était jamais appliqué | Rôles, mots de passe et droits réappliqués à chaque déploiement |
| Moyenne | Adresses IP gardées sans limite de durée dans les journaux des conteneurs | Journal systemd, 6 mois au plus ; journal d'accès du proxy, un fichier par jour, supprimé après 180 jours |
| Basse | Jetons d'invitation dans le Referer et l'adresse de retour Keycloak des journaux | Masqués aussi (vérifié sur un vrai Caddy) |
| Basse | Invitations d'un administrateur rétrogradé toujours valables | Elles expirent quand il perd le rôle ou l'accès |
| Basse | Double abonnement Stripe avec deux pages de paiement ouvertes | La page ouverte précédemment est fermée avant d'en créer une autre |
| Basse | Clé SSH de GitHub Actions équivalente à root | Commande forcée : cette clé ne peut déployer qu'un commit de `main` ; le workflow exige en plus une intégration continue réussie |
| Basse | Copies de sauvegarde effaçables depuis le serveur | Le serveur ne les supprime plus ; la clé d'accès doit seulement pouvoir écrire |
| Basse | Mises à jour de Docker jamais installées automatiquement | Ajoutées aux mises à jour automatiques ; les conteneurs continuent de tourner pendant la mise à jour |
| Dépendances | `nodemailer`, `multer`, `qs` | Mises à jour, dont `nodemailer` 10 (envoi réel vérifié). Il reste 3 alertes faibles, liées à `keycloak-connect` |

Les corrections de l'infrastructure (SSH, scripts, restauration, Caddyfile, copie hors serveur, `.env.production`, rôles, journaux, Docker) ont été vérifiées par `shellcheck`, `actionlint`, `caddy validate`, un vrai Caddy (en-têtes, jetons masqués, redirection `www`) et des simulations des scripts. L'application des rôles à une base existante et la nouvelle restauration restent à répéter sur une vraie base PostgreSQL ([exploitation.md](exploitation.md), § 9).

Il reste un point connu : le SIRET est unique en base mais n'est pas vérifié. Une entreprise pourrait donc réserver celui d'une autre. À traiter si le cas se présente, par exemple par une vérification auprès du répertoire SIRENE.

## 4. Checklist de mise en production

- [ ] HTTPS partout (Caddy) et `FRONTEND_URL` sur le domaine réel. Le realm garde l'exigence HTTPS de Keycloak pour les adresses externes (réglage par défaut « external »).
- [ ] Keycloak : `verifyEmail: true` avec un SMTP configuré ; `KEYCLOAK_REQUIRE_VERIFIED_EMAIL=true` (valeur par défaut) ; URI de redirection et *web origins* limités au domaine de production ; mode `start` (pas `start-dev`).
- [ ] Mots de passe forts et uniques pour Postgres et l'administrateur Keycloak, stockés dans un coffre de secrets. Le `.env` ne quitte jamais le serveur : même le script des réglages de Keycloak tourne sur le serveur. `deploy.sh` refuse les valeurs d'exemple et les mots de passe autres que lettres et chiffres.
- [ ] Administrateur de Keycloak : un compte nominatif avec OTP, et l'administrateur temporaire du premier démarrage supprimé ([exploitation.md](exploitation.md), § 3).
- [ ] MFA (OTP) obligatoire pour les comptes ADMIN.
- [ ] Hébergement dans l'Union européenne, sauvegardes chiffrées de Postgres testées (restauration), chiffrement au repos.
- [x] Journaux limités à 6 mois : journal d'accès du proxy (un fichier par jour, supprimé après 180 jours ; jetons d'invitation et en-têtes d'authentification masqués), journaux des conteneurs et du système (journal systemd), journal des connexions de Keycloak (180 jours). Reste à faire : l'alerte sur les erreurs.
- [ ] Signal de vie des sauvegardes (`BACKUP_HEARTBEAT_URL`) et copie hors du serveur activés ([exploitation.md](exploitation.md), § 5).
- [x] Limitation de débit sur l'API (`@nestjs/throttler`) et en-têtes de sécurité (CSP, HSTS) posés par le proxy Caddy : voir [exploitation.md](exploitation.md).
- [ ] Contrat de sous-traitance (art. 28) : publié sur le site (`/sous-traitance`) et accepté avec les CGV à la création de l'entreprise. Il reste à compléter l'identité de l'éditeur, puis à rédiger le registre des traitements du sous-traitant et la procédure de gestion des violations (notification au client sous 48 h, prévue au contrat).
- [ ] Purge automatique des données au-delà de la durée de conservation.
- [ ] Test de charge sur l'export mensuel, et audit d'accessibilité complet de l'application : le site a été audité le 24/09/2026, l'application seulement relue sur ses gabarits ([tests-et-qualite.md](tests-et-qualite.md#5-bis-audit-daccessibilité-du-24092026)).

## 5. Données de développement

- Le `.env` local est ignoré par Git ; ses mots de passe ont été générés aléatoirement pour la machine de développement.
- La base `workhoraire_e2e` est **vidée à chaque exécution** des tests e2e. Ceux-ci refusent de tourner sur une base dont le nom ne finit pas par `_e2e` : ce nom est contrôlé dans `E2E_DATABASE_URL` avant même les migrations, puis sur la base connectée avant de la vider.
