# 05. Spécifications du MVP

> Récits utilisateurs et critères d'acceptation **tels qu'implémentés** dans cette version. Les règles de calcul détaillées sont dans [../technique/moteur-de-calcul.md](../technique/moteur-de-calcul.md) ; les routes d'API dans [../technique/api.md](../technique/api.md).
> Les numéros de test renvoient aux fichiers `*.spec.ts` et `backend/test/api.e2e-spec.ts`.

## Epic A. Compte et entreprise (existant, complété)

**A1. Créer mon entreprise** : en tant que dirigeant, je crée mon espace et deviens ADMIN.
- Prénom et nom de l'administrateur, nom de l'entreprise (2 à 120 caractères), SIRET facultatif (14 chiffres), fuseau horaire IANA (Europe/Paris par défaut).
- La création de l'entreprise et de l'administrateur est atomique ; un compte déjà rattaché est refusé.
- Par défaut, l'adresse du compte doit être vérifiée par Keycloak (403 sinon) : les e-mails de l'entreprise y partent.
- Les CGV et le contrat de sous-traitance sont acceptés par une case à cocher obligatoire ; l'API enregistre la date et la version acceptées.
- L'offre choisie sur le site (`/inscription?offre=…`) est gardée jusqu'à la création de l'entreprise ; avec Essentiel, la page « Abonnement » s'ouvre ensuite.
- La page avertit les salariés invités : ils ne doivent pas créer d'entreprise, mais ouvrir le lien reçu et s'inscrire avec l'adresse exacte de l'invitation.

**A2. Inviter un salarié**, avec son rôle et sa **durée contractuelle hebdomadaire** (1 à 48 h, 35 h par défaut).
- Le lien ouvre une page d'accueil : « Bonjour Nora, Boulangerie Martin vous invite… ». Le bouton « Créer mon mot de passe » ouvre l'inscription avec l'adresse déjà remplie : **seuls le mot de passe et sa confirmation sont demandés**. Au retour, la personne arrive directement dans l'entreprise. « J'ai déjà un compte » permet de se connecter.
- Le lien d'invitation expire au bout de 7 jours et n'est utilisable qu'une fois ; le jeton est stocké haché.
- Le lien part aussi par e-mail à l'adresse invitée quand un serveur SMTP est configuré ; il peut toujours être copié. Une entreprise envoie au plus 100 invitations par 24 h.
- L'acceptation exige l'adresse e-mail invitée et, par défaut, une adresse **vérifiée** par Keycloak (ADR 0004).
- La durée contractuelle de l'invitation est reprise sur le compte créé.
- Une nouvelle invitation pour la même adresse remplace la précédente, dont le lien ne fonctionne plus : un lien perdu ne bloque pas l'adresse.
- Ouvert avec un autre compte, le lien nomme le compte utilisé et propose « Changer de compte » : après la déconnexion, on revient sur le lien pour se connecter ou s'inscrire avec la bonne adresse. La page ne propose jamais de créer une entreprise.

**A3. Gérer les salariés** (ADMIN) : nom, rôle, durée contractuelle, **matricule paie**, activation.
- L'adresse e-mail est celle du compte de connexion : seul le salarié peut la changer, et WorkHoraire reprend l'adresse vérifiée par Keycloak.
- Un administrateur ne peut ni se désactiver ni se rétrograder. Un administrateur qui perd ce rôle ou son accès voit expirer les invitations qu'il avait envoyées.
- Un changement de durée contractuelle est **daté** : il s'applique à partir du lundi de la semaine choisie (la semaine en cours par défaut), et les semaines précédentes gardent l'ancien contrat (ADR 0007).
- Le matricule paie est unique dans l'entreprise.
- Un salarié désactivé ne peut plus se connecter à l'application : une page le lui explique. Son historique reste dans les feuilles de temps et les exports.

## Epic B. Pointage

**B1. Pointer mon arrivée et ma sortie** en un geste, depuis un téléphone ou un ordinateur.
- L'heure enregistrée est **celle du serveur**, jamais celle de l'appareil.
- Un seul pointage peut être ouvert par salarié, garanti par une contrainte d'unicité en base : sur 5 requêtes simultanées, une seule réussit (test e2e).
- Une note facultative (500 caractères au plus) peut accompagner le pointage.
- Pendant le travail, un chronomètre de session s'affiche, calé sur l'horloge du serveur.

**B2. Voir ma journée et ma semaine** : périodes du jour, pauses et coupures, total du jour, total de la semaine par rapport au contrat, barres par jour, alertes du jour et de la semaine.

**B3. Déclarer une sortie oubliée** : un pointage ouvert depuis plus de 12 h est considéré comme oublié.
- Il compte **0 heure** et déclenche l'alerte « Sortie non pointée ».
- Le salarié déclare l'heure réelle de fin, avec un motif. La fin doit être après le début, pas dans le futur, et la période ne peut dépasser 24 h.
- La déclaration est inscrite dans la piste d'audit, avec le salarié comme auteur.
- Pointer la sortie « maintenant » est refusé au-delà de 12 h d'ouverture : le salarié déclare alors l'heure réelle.
- Un e-mail de rappel part une seule fois, peu après les 12 h (vérification toutes les 15 minutes).

## Epic C. Corrections et traçabilité (MANAGER, ADMIN)

**C1. Ajouter une période** pour un salarié (badge oublié) : début, fin et **motif obligatoire**.
- La période est marquée « Saisie manuelle ».
- Elle est refusée si elle chevauche une autre période, se termine dans le futur ou dépasse 24 h.
- Elle est refusée (404) si le salarié appartient à une autre entreprise.

**C2. Corriger une période** : début, fin ou note, avec **motif obligatoire**.
- Renseigner la fin d'un pointage ouvert le clôture.
- Seuls les champs réellement modifiés sont enregistrés. Une période ne change pas de jour : il faut la supprimer, puis l'ajouter au bon jour.
- Deux corrections simultanées ne peuvent pas créer de chevauchement. Une correction faite sur une version périmée est refusée, avec un message qui demande d'actualiser la page.
- La période est marquée « Corrigé ».

**C3. Supprimer une période** avec un motif. Elle disparaît des heures, mais la piste d'audit conserve sa valeur d'origine.

**C4. Consulter l'historique des corrections**. Pour chaque correction : auteur, date, avant → après, motif.
- Le manager voit les corrections de l'équipe ; le salarié voit les siennes dans « Mes heures ».

**Règle de conflit d'intérêts** : un MANAGER ne peut corriger ni ses propres heures ni ses propres congés (403) ; un ADMIN le peut.

**Notification** : chaque correction faite par un autre que le salarié lui est envoyée par e-mail, avec le motif (Epic J).

## Epic D. Feuilles de temps et alertes

**D1. Heures de l'équipe** (MANAGER, ADMIN) : un tableau par salarié et par jour de la semaine, avec :
- les jours fériés, les absences et les pointages en cours ;
- le total de la semaine et les heures sup ou complémentaires ;
- le nombre d'alertes, détaillées au survol.

**D2. Feuille de temps d'un salarié** : le détail par jour, avec les actions de correction et l'historique.

**D3. Calculs** (voir le moteur de calcul) :
- les heures sont rattachées au jour local de début, dans le fuseau de l'entreprise ;
- semaine civile du lundi au dimanche ; une nuit du dimanche au lundi est coupée au lundi 0 h pour le total de la semaine ;
- chaque semaine est calculée avec le contrat en vigueur son lundi ;
- heures sup +25 % puis +50 % au-delà de 35 h, les congés payés comptant dans le seuil, sauf un jour où des heures sont pointées ;
- heures complémentaires +10 % jusqu'à 1/10 du contrat, puis +25 %.

**D4. Alertes** : 10 h par jour, 48 h par semaine, pause de 20 min dès 6 h, repos de 11 h, plus de 6 jours travaillés, heures complémentaires au-delà de 1/10 du contrat, sortie non pointée, heures pointées pendant une absence validée.
- Chaque alerte indique la valeur mesurée, le seuil et sa base légale.
- Les alertes sont informatives, jamais bloquantes.

## Epic E. Absences

**E1. Demander une absence** : congés payés, RTT, arrêt maladie, sans solde, événement familial ou autre.
- Demi-journées possibles : après-midi du premier jour, matin du dernier.
- Le décompte se fait en **jours ouvrés**, jours fériés exclus : par exemple, du 9 au 13 novembre 2026 = 4 jours.
- La demande est refusée si elle ne couvre aucun jour ouvré, chevauche une demande en attente ou acceptée (à la demi-journée près), ou dure plus de 366 jours.
- Le commentaire est facultatif, et l'interface rappelle de n'y mettre aucune information médicale.
- Si deux demandes identiques sont envoyées en même temps (double clic, deux appareils), une seule est enregistrée.

**E2. Valider ou refuser** (MANAGER, ADMIN), avec un commentaire facultatif.
- Une demande ne se traite qu'une fois, même si deux personnes valident en même temps.
- La validation est refusée si la période chevauche une absence déjà acceptée.
- Un MANAGER ne traite pas sa propre demande.

**E3. Annuler ma demande** tant qu'elle est en attente, ou acceptée mais pas encore commencée. J'apparais alors comme l'auteur de l'annulation.

**E4.** Les absences acceptées apparaissent dans les feuilles de temps, le tableau de bord et les exports.

**E5. Annuler une absence acceptée** (MANAGER, ADMIN), même commencée (retour anticipé, erreur de saisie), avec un **motif obligatoire**. Le salarié voit qui l'a annulée, et pourquoi. Un MANAGER n'annule pas sa propre absence.

## Epic F. Tableau de bord (MANAGER, ADMIN)

- Présents maintenant, et **sorties non pointées** affichées à part ; absents du jour.
- Heures du jour ; heures, heures sup et heures complémentaires de la semaine ; demandes d'absence en attente.
- Les points de vigilance de la semaine, avec un lien vers la feuille de temps concernée.
- Rafraîchissement automatique toutes les minutes.

## Epic G. Exports pour la paie (MANAGER, ADMIN)

**G1. Synthèse hebdomadaire (CSV)** : une ligne par salarié et par semaine civile qui recoupe la période.
- Colonnes : matricule, identité, contrat, heures travaillées, congés payés comptés dans le seuil, heures sup +25/+50, heures complémentaires +10/+25, jours d'absence par type, alertes.
- Les semaines sans activité sont omises.

**G2. Détail journalier (CSV)** : première entrée, dernière sortie, pauses et coupures, heures, absence et alertes, par salarié et par jour.

**G3. Format** :
- UTF-8 avec BOM, séparateur `;`, décimales à virgule : le fichier s'ouvre directement dans Excel en français.
- Protection contre l'injection de formules (valeurs commençant par `=`, `+`, `-` ou `@`).
- 62 jours au plus par export.

## Epic H. Abonnement (ADMIN)

**H1. Voir mon abonnement** : la page « Abonnement » affiche l'offre, les salariés actifs du mois en cours et du mois précédent, et le montant estimé HT.
- Un salarié actif a pointé, ou a eu une absence validée, dans le mois (fuseau de l'entreprise).
- Découverte : gratuite jusqu'à 3 salariés actifs. Essentiel : 3 € HT par salarié actif, tous comptés ([doc 08](08-prix-et-hebergement.md)).

**H2. Souscrire et gérer** : « Choisir l'offre Essentiel » ouvre une page de paiement Stripe (prélèvement SEPA ou carte). « Factures et moyen de paiement » ouvre l'espace client Stripe : factures, moyen de paiement, résiliation.

**H3. Dépassement et impayé** : au premier dépassement de l'offre gratuite sans abonnement, les administrateurs reçoivent un e-mail et disposent de 30 jours. Passé ce délai, ou 30 jours après un impayé, l'entreprise passe en lecture seule (402) : le pointage, la consultation, les exports et le paiement restent possibles, et aucune donnée n'est supprimée.
- Sans clés Stripe, le paiement est coupé : la page affiche l'usage, et aucune entreprise ne passe en lecture seule.

## Epic I. Données personnelles

**I1. Télécharger mes données** (tous les rôles) : depuis « Mes heures », un fichier JSON contient le profil, les contrats, les pointages, les absences et les corrections de la personne connectée : ses données, et seulement les siennes (articles 15 et 20 du RGPD).

## Epic J. E-mails

Envoyés par le serveur SMTP configuré (Brevo en production, Mailpit en local). Sans `SMTP_HOST`, rien n'est envoyé et le lien d'invitation reste à copier.
- **Invitation** : le lien part à l'adresse invitée.
- **Correction** : le salarié est prévenu de chaque correction de ses heures faite par un autre, avec le motif.
- **Rappel de sortie oubliée** : un seul e-mail par pointage resté ouvert plus de 12 h.
- **Abonnement** (administrateurs) : dépassement de l'offre gratuite, échec de paiement.

## Exigences non fonctionnelles

| Domaine | Exigence | État |
|---|---|---|
| Sécurité | Isolation stricte par entreprise : `companyId` jamais lu depuis le client, vérifié à chaque requête | ✅ testé (unitaires et e2e) |
| Sécurité | Validation stricte des entrées (liste blanche, champs inconnus refusés, dates ISO avec fuseau) | ✅ |
| Intégrité | Contraintes SQL : fin > début, un seul pointage ouvert, dates d'absence cohérentes, durée contractuelle de 1 à 48 h, contrats datés d'un lundi, matricule unique ; verrous contre les écritures simultanées | ✅ testé (e2e) |
| Accessibilité | Libellés ARIA, contrastes, navigation au clavier, `lang="fr"` | 🟡 audit du 24/09/2026 (WCAG 2.2 AA, RGAA 4.1) : site audité, application relue sur ses gabarits ([détail](../technique/tests-et-qualite.md#5-bis-audit-daccessibilité-du-24092026)) |
| Mobile | Mise en page mobile d'abord, barre de navigation basse, bouton de pointage large | ✅ vérifié visuellement |
| Performance | Bundle initial < 500 kB (457 kB) ; pages chargées à la demande | ✅ |
| Vie privée | Polices auto-hébergées (aucun appel à Google Fonts) ; pas de traceur | ✅ |
| Fuseaux | Calculs dans le fuseau de l'entreprise, heure d'été incluse | ✅ testé |

## Hors périmètre

Ce qui n'est pas encore fait est suivi dans la [roadmap](06-roadmap.md), seule source datée de l'état du produit.
