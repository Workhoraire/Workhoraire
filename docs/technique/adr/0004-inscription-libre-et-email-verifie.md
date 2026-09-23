# ADR 0004. Inscription en libre-service et e-mail vérifié pour accepter une invitation

- **Statut** : accepté pour le développement ; production conditionnée à la checklist de sécurité
- **Date** : 2026-09-23

## Contexte

Avant ce changement, l'inscription était désactivée dans le realm Keycloak. Un salarié invité devait donc avoir un compte créé à la main par l'administrateur de la plateforme, ce qui est impossible pour un SaaS en libre-service. Le parcours visé est le suivant : un dirigeant s'inscrit, crée son entreprise et invite ses salariés, qui créent eux-mêmes leur compte.

## Décision

1. Realm `workhoraire` :
   - `registrationAllowed: true`, avec l'e-mail comme identifiant ;
   - page de connexion en français ;
   - protection anti-brute-force ;
   - politique de mot de passe (12 caractères au moins, différent de l'e-mail et de l'identifiant).
2. L'API exige un **e-mail vérifié** (`email_verified`) pour accepter une invitation, car l'e-mail sert à prouver l'identité de l'invité. Ce contrôle est actif par défaut (`KEYCLOAK_REQUIRE_VERIFIED_EMAIL`, défaut `true`). Le `.env` local le désactive, faute de serveur SMTP pour envoyer les e-mails de vérification.
3. En production : `verifyEmail: true` et SMTP configuré dans Keycloak.

## Conséquences

- N'importe qui peut créer un compte, puis une entreprise. C'est voulu (essai gratuit), mais cela appelle, avant l'ouverture publique, une limitation de débit, une protection anti-robots sur l'inscription (côté Keycloak) et une surveillance.
- Le README « partage du realm » s'applique toujours : le realm n'est importé qu'à la **première** création de la base Keycloak. Pour appliquer cette configuration à un environnement existant, il faut soit recréer la base Keycloak, soit reporter les réglages dans la console.
- **À valider par l'équipe** : ce choix modifie le parcours prévu à l'origine (comptes préparés par l'administrateur).

## Mise à jour du 23/09/2026 : invitation en un mot de passe

La recette a montré que le parcours d'invitation était trop long et source d'erreurs. Le lien ouvrait la page de **connexion** Keycloak : il fallait trouver « Enregistrement », retaper son adresse (une faute de frappe créait un compte sans lien avec l'invitation), puis son prénom et son nom.

Décision :
1. Le lien ouvre une **page d'accueil** WorkHoraire, sans connexion préalable. Elle affiche l'entreprise qui invite et l'adresse invitée, grâce à une route publique d'aperçu (`GET /employee-invitations/:token`). Le lien, un jeton aléatoire de 256 bits, reste la seule clé.
2. Le bouton « Créer mon mot de passe » ouvre directement la page d'**inscription** Keycloak, avec l'adresse préremplie (`login_hint`). Au retour, l'invitation est acceptée automatiquement.
3. Keycloak ne demande plus le prénom ni le nom (profil utilisateur : attributs modifiables par un administrateur seulement). Pour un salarié, WorkHoraire les reprend de l'invitation. Pour un dirigeant, ils sont saisis dans le formulaire de création d'entreprise.

Il ne reste donc qu'à choisir le mot de passe et à le confirmer. Le mot de passe reste saisi dans Keycloak, jamais dans WorkHoraire.

Options écartées :
- **Formulaire de mot de passe dans WorkHoraire**, avec création du compte par l'API d'administration Keycloak. WorkHoraire manipulerait alors les mots de passe, il faudrait un compte de service Keycloak très privilégié, et la preuve de possession de l'adresse disparaîtrait.
- **Invitation envoyée par Keycloak** (e-mail d'action ou fonction « Organizations »). Elle exige un serveur SMTP ; c'est la cible pour la production, où l'e-mail prouvera en plus que la personne possède bien l'adresse.

Le realm n'étant importé qu'à la création de la base Keycloak, la configuration du profil utilisateur doit être reportée à la main sur un environnement existant (voir `architecture.md`, § 6).
