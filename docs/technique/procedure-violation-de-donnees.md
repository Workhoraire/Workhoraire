# Procédure en cas de violation de données

Une violation de données est la destruction, la perte, l'altération, la divulgation ou l'accès non autorisé à des données personnelles, accidentel ou illicite (article 4.12 du RGPD). Exemples pour WorkHoraire : fuite d'une sauvegarde et de sa phrase de passe, accès d'une entreprise aux heures d'une autre, e-mails envoyés au mauvais destinataire, compte administrateur piraté, perte de données sans sauvegarde exploitable.

L'éditeur a deux rôles, donc deux obligations :

| Données touchées | Rôle de l'éditeur | À faire |
|---|---|---|
| Heures, absences, identité des salariés d'un client | Sous-traitant | Prévenir chaque client touché dans les **48 heures** au plus tard (article 8 du contrat de sous-traitance ; article 33.2 du RGPD : « dans les meilleurs délais »). C'est le client qui notifie la CNIL et informe ses salariés, avec notre aide. |
| Comptes clients, facturation, journaux, support | Responsable | Notifier la CNIL **dans les 72 heures** si la violation présente un risque (article 33.1 du RGPD) ; informer les personnes si le risque est élevé (article 34). |

Dans tous les cas, l'incident est **documenté** dans le registre des violations, même s'il n'est notifié à personne (article 33.5).

## 1. Détecter et donner l'alerte

Sources possibles : alerte de supervision, anomalie dans les journaux, signalement d'un client ou d'un salarié, avertissement d'un prestataire (hébergeur, Brevo, Stripe). Noter tout de suite **l'heure à laquelle on en a pris connaissance** : les délais partent de là.

## 2. Contenir

Selon le cas, avant toute analyse approfondie :

- changer les secrets exposés (`.env.production`), dans l'ordre de la [procédure d'exploitation](exploitation.md) ;
- révoquer les clés et jetons concernés : clé SSH de déploiement, clés Stripe et Brevo, clé d'accès au stockage hors site ;
- désactiver le compte compromis, ou fermer ses sessions depuis la console Keycloak ;
- couper l'accès public si la fuite continue (arrêt du proxy), en gardant une copie des journaux.

Ne rien effacer : les journaux et l'état du serveur servent à l'analyse.

## 3. Évaluer

Répondre par écrit :

- **Quoi** : quelles données, pour quelles entreprises clientes ?
- **Combien** : nombre approximatif de personnes et d'enregistrements.
- **Comment** : cause, période concernée, fuite terminée ou non.
- **Conséquences probables** pour les personnes : divulgation d'horaires ou d'absences, usurpation de compte, perte de relevés d'heures.
- **Niveau de risque** :
  - aucun (données chiffrées et clé non compromise, par exemple) ;
  - risque ;
  - risque élevé.

## 4. Notifier

- **Clients touchés** (données de salariés), dans les 48 heures, par e-mail à leurs administrateurs. Donner ce qui est connu : nature de la violation, catégories et nombre approximatif de personnes et de données, conséquences probables, mesures prises ou proposées, contact. Compléter ensuite au fur et à mesure.
- **CNIL** (données dont l'éditeur est responsable), dans les 72 heures si la violation présente un risque, par le [téléservice de notification](https://notifications.cnil.fr/notifications/). Au-delà de 72 heures, expliquer le retard. Une notification incomplète peut être complétée ensuite.
- **Personnes concernées**, si le risque est élevé : message clair qui décrit la violation, ses conséquences et ce qu'elles peuvent faire (changer leur mot de passe, par exemple).

## 5. Consigner dans le registre des violations

Une ligne par incident, conservée avec le registre des traitements :

| Date de découverte | Faits et cause | Données et personnes touchées (catégories, nombre) | Conséquences | Mesures prises | Clients prévenus (date) | CNIL notifiée (date, n°) ou raison de ne pas notifier | Personnes informées |
|---|---|---|---|---|---|---|---|

## 6. Corriger et tirer les leçons

Corriger la cause, vérifier que la correction tient (test, répétition de restauration si besoin), mettre à jour la [procédure d'exploitation](exploitation.md) et ce document. Garder la trace des décisions dans le registre.

## Sources

- [RGPD](https://eur-lex.europa.eu/eli/reg/2016/679/oj), articles 4.12, 28, 33 et 34.
- CNIL, [Notifier une violation de données personnelles](https://www.cnil.fr/fr/notifier-une-violation-de-donnees-personnelles), consulté le 24/09/2026 : notification dans les 72 heures si possible, retard à justifier, documentation interne obligatoire dans tous les cas, téléservice réservé aux responsables de traitement.
