# Registre des activités de traitement

Article 30 du RGPD. Registre tenu par l'éditeur de WorkHoraire, dans ses deux rôles :

- **responsable** des traitements liés à son propre service (partie A) ;
- **sous-traitant** des entreprises clientes pour les données de leurs salariés (partie B).

> Version du 24/09/2026. L'identité et le contact de l'éditeur sont ceux des mentions légales (`site/src/app/core/legal/legal-info.json`). Ils seront complétés à l'immatriculation de la société, avant l'ouverture au public. Aucun délégué à la protection des données n'est désigné.

Les textes publics disent la même chose : [politique de confidentialité](../../site/src/app/pages/legal/privacy.html) et [contrat de sous-traitance](../../site/src/app/pages/legal/processing-agreement.html). En cas de changement (nouvelle donnée, nouveau prestataire, nouvelle durée), les trois documents sont mis à jour ensemble.

## A. Traitements dont l'éditeur est responsable (article 30.1)

| Traitement | Finalité | Base légale | Personnes | Données | Destinataires | Hors UE | Conservation |
|---|---|---|---|---|---|---|---|
| Sécurité du site et du service | Détecter et bloquer les abus, enquêter sur un incident | Intérêt légitime (6.1.f) | Visiteurs, utilisateurs | Adresse IP, date et heure, adresse demandée (jetons d'invitation masqués), navigateur ; événements de connexion du service de connexion | Équipe technique de l'éditeur, hébergeur | Non | 6 mois |
| Comptes des entreprises clientes | Créer et gérer le compte, fournir le service, informer sur l'abonnement | Exécution du contrat (6.1.b) | Administrateurs des clients | Nom, prénom et e-mail de l'administrateur, nom de l'entreprise, SIRET, fuseau horaire, date et version des CGV acceptées | Équipe de l'éditeur, hébergeur, Brevo (e-mails) | Accès possible de prestataires de Brevo depuis les États-Unis, avec les garanties du RGPD | Durée du contrat, puis suppression sous 30 jours ; preuve d'acceptation des CGV : 5 ans après la fin du contrat |
| Facturation et paiement | Facturer, encaisser, tenir la comptabilité | Contrat (6.1.b), obligation légale pour la comptabilité (6.1.c) | Clients payants | Dénomination, adresse de facturation, n° de TVA, e-mail, nombre d'utilisateurs actifs par mois, factures | Stripe | Oui : Stripe peut transférer aux États-Unis (cadre UE–États-Unis, clauses contractuelles types) | Pièces comptables : 10 ans (article L123-22 du Code de commerce) |
| Échanges avec le support | Répondre aux questions et demandes d'assistance | Intérêt légitime (6.1.f) | Clients, prospects, salariés qui écrivent | Nom, e-mail, entreprise, contenu des messages | Équipe de l'éditeur | Non | 3 ans après le dernier échange |

Le site ne dépose aucun cookie et ne mesure pas l'audience. L'application n'utilise que des éléments strictement nécessaires : session de connexion et stockage local de l'offre choisie.

## B. Traitements effectués pour le compte des clients (article 30.2)

| Rubrique | Contenu |
|---|---|
| Responsables du traitement | Chaque entreprise cliente. La liste à jour (nom, SIRET, e-mail de l'administrateur) est dans la base de production, table `Company` et administrateurs associés. |
| Catégories de traitements | Pointage et décompte du temps de travail ; calcul des heures supplémentaires et complémentaires ; alertes sur les durées maximales et les repos ; gestion des absences ; corrections tracées ; exports pour la paie ; e-mails de service (invitations, corrections, rappels de sortie non pointée, compte) ; téléchargement de ses données par chaque utilisateur. |
| Personnes concernées | Salariés, managers et administrateurs des clients. |
| Données | Identité (nom, prénom, e-mail professionnel), rôle, durée contractuelle hebdomadaire, matricule de paie, heures de début et de fin et notes, corrections (auteur, motif, avant/après), absences (type, dates, commentaire), identifiant technique du compte de connexion. Aucune donnée biométrique, de géolocalisation ni de santé : pour un arrêt maladie, seul le type d'absence est connu. |
| Sous-traitants ultérieurs | L'hébergeur du service (France). Brevo, pour les e-mails (Union européenne ; accès possible de ses prestataires depuis les États-Unis, avec les garanties du RGPD). Le prestataire de la copie hors site des sauvegardes, s'il est activé : il doit alors figurer dans `legal-info.json` (champ `offsiteBackup`), donc dans le contrat de sous-traitance. |
| Transferts hors UE | Aucun de la part de l'éditeur. Seul l'accès possible des prestataires de Brevo, décrit ci-dessus. |
| Durée | Durée du contrat, puis suppression sous 30 jours après la clôture ; les sauvegardes s'effacent ensuite par rotation (30 jours). À la demande du client, suppression ou anonymisation des données d'un salarié parti, une fois écoulée la durée de conservation qu'il a fixée. |
| Mesures de sécurité | Annexe du contrat de sous-traitance, détaillée dans [Sécurité et RGPD](securite-et-rgpd.md) : chiffrement des échanges, cloisonnement des entreprises, droits par rôle vérifiés par l'API, piste d'audit en ajout seul, sauvegardes chiffrées avec test de restauration, comptes et mots de passe gérés par Keycloak. |

## Tenue du registre

- **Qui** : le fondateur, avec l'aide de l'équipe technique.
- **Quand** : à chaque version qui change les données, les prestataires ou les durées, et au moins une fois par an.
- **Violations** : les incidents sont consignés dans le registre des violations, selon la [procédure en cas de violation de données](procedure-violation-de-donnees.md).
