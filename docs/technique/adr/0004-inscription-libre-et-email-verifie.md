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
