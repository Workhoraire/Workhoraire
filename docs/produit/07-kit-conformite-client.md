# 07. Kit de conformité pour les entreprises clientes

> **Modèles à adapter, qui ne remplacent pas un conseil juridique.** Ils mettent en forme les obligations décrites dans [`02-cadre-legal-et-rgpd.md`](02-cadre-legal-et-rgpd.md) (L1222-4, art. 13 RGPD, L2312-38). L'employeur, **responsable du traitement**, les complète et les diffuse. WorkHoraire intervient comme **sous-traitant**.

## 1. Checklist de mise en place

- [ ] **Informer chaque salarié par écrit avant le premier pointage** (L1222-4), en gardant une preuve de la date de remise : modèle en § 2.
- [ ] **Entreprise d'au moins 50 salariés** : informer et consulter le CSE **avant** la décision de mise en place (L2312-38) : modèle en § 3. Entre 11 et 49 salariés, l'information des représentants du personnel est recommandée par la CNIL.
- [ ] Inscrire le traitement « Gestion du temps de travail » au **registre des traitements** de l'entreprise.
- [ ] Définir la **durée de conservation** : 3 ans conseillés, pour couvrir la prescription des salaires (L3245-1).
- [ ] Désigner les personnes **habilitées** : administrateurs et managers, avec le moins d'administrateurs possible.
- [ ] Renseigner la **durée contractuelle** et le **matricule paie** de chaque salarié.
- [ ] Vérifier la **convention collective** : WorkHoraire applique les seuils légaux par défaut, et un accord peut prévoir d'autres taux ou limites.
- [ ] Accepter le **contrat de sous-traitance** (art. 28 RGPD) : publié sur le site, il est accepté avec les CGV à la création de l'entreprise (§ 4).

## 2. Modèle : note d'information des salariés

Même texte que le guide du site, page `/guides/informer-les-salaries` ([source](../../site/src/app/pages/guides/employee-information-guide.html)) : modifier les deux ensemble.

> **Objet : mise en place d'un outil de décompte du temps de travail (WorkHoraire)**
>
> À compter du **[date]**, **[raison sociale, adresse]** (« l'employeur ») enregistre le temps de travail au moyen de l'application WorkHoraire.
>
> **Pourquoi ?**
> - Décompter la durée du travail, comme l'impose le Code du travail (art. L3171-2 et D3171-8).
> - Calculer la rémunération, les heures supplémentaires et les heures complémentaires.
> - Gérer les demandes d'absence.
> - Vérifier le respect des durées maximales et des temps de repos.
>
> **Sur quelle base ?** Une obligation légale (décompte du temps de travail), l'exécution de votre contrat de travail (paie) et l'intérêt légitime de l'employeur (organisation du travail).
>
> **Quelles données ?**
> - Nom, prénom, adresse e-mail, rôle, durée contractuelle et matricule de paie.
> - Heures d'arrivée et de départ, notes que vous saisissez.
> - Corrections apportées à vos pointages, avec leur auteur et leur motif.
> - Demandes d'absence (type, dates, commentaire facultatif). **N'indiquez jamais d'information médicale.**
>
> L'heure enregistrée est celle du serveur, pas celle de votre appareil. Seule une sortie oubliée se déclare après coup, avec un motif, et cette déclaration est tracée. **Aucune donnée biométrique, aucune photo et aucune donnée de localisation n'est collectée.** L'application ne mesure pas votre activité.
>
> **Qui y a accès ?**
> - Les personnes habilitées de l'entreprise : **[fonctions]**.
> - Le gestionnaire de paie ou l'expert-comptable **[nom]**, pour la paie.
> - L'éditeur de WorkHoraire, en qualité de sous-traitant, pour le fonctionnement technique du service. La base de données est hébergée en France. *(Si l'éditeur indique une copie des sauvegardes hors du serveur, ajoutez : « Une copie chiffrée des sauvegardes est conservée chez [prestataire] ([lieu]). »)*
> - Brevo, le prestataire d'envoi des e-mails de WorkHoraire (invitation, corrections, rappels, e-mails de compte), qui héberge ces données dans l'Union européenne. Certains de ses prestataires techniques peuvent y accéder depuis les États-Unis, avec les garanties prévues par le RGPD.
>
> **Combien de temps ?** Pendant votre contrat, puis pendant **[durée]** après votre départ. Ensuite, à la demande de l'employeur, le support de l'éditeur de WorkHoraire supprime ou anonymise vos données.
>
> **Vos droits.**
> - Vous consultez à tout moment vos heures, vos heures supplémentaires et l'historique des corrections qui vous concernent, et vous téléchargez toutes vos données, dans « Mes heures ».
> - Vous disposez d'un droit d'accès, de rectification, d'effacement et de limitation, d'un droit à la portabilité des données traitées pour l'exécution de votre contrat, et d'un droit d'opposition aux traitements fondés sur l'intérêt légitime. L'effacement ne s'applique pas aux données que la loi impose de conserver.
> - Pour les exercer, écrivez à **[contact ou DPO]**.
> - Vous pouvez aussi adresser une réclamation à la CNIL (www.cnil.fr).
>
> Aucune décision n'est prise à votre égard de manière entièrement automatisée. Les alertes (dépassement de durée, pause, repos) servent à l'employeur à respecter ses obligations.
>
> Fait à **[lieu]**, le **[date]**. Remis à **[nom du salarié]**, qui en accuse réception : **[signature et date]**.

## 3. Modèle : note d'information et de consultation du CSE (au moins 50 salariés)

> **Objet : projet de mise en place de l'outil WorkHoraire (L2312-38 et L2312-8)**
>
> 1. **Finalités** : décompte du temps de travail (L3171-2, D3171-8), calcul de la paie, gestion des absences, contrôle du respect des durées maximales et des repos.
> 2. **Fonctionnement** :
>    - pointage par chaque salarié depuis son téléphone ou un ordinateur, avec l'heure du serveur ;
>    - corrections uniquement par les personnes habilitées, avec un motif obligatoire et un historique consultable par le salarié.
> 3. **Ce que l'outil ne fait pas** : ni biométrie, ni photo, ni géolocalisation, ni mesure de l'activité, ni suivi des déplacements dans les locaux.
> 4. **Données et durées de conservation** : voir la note d'information des salariés (annexe).
> 5. **Accès** : **[fonctions]**. Le CSE peut consulter les documents de décompte (L3171-2).
> 6. **Calendrier** : information des salariés le **[date]**, mise en service le **[date]**.
>
> L'avis du CSE est sollicité lors de la réunion du **[date]**.

## 4. Ce que l'éditeur fournit au client

Ces engagements sont formalisés dans le contrat de sous-traitance, publié sur le site (`/sous-traitance`) et accepté avec les CGV à la création de l'entreprise.

- Le contrat de sous-traitance (art. 28) et la liste des sous-traitants ultérieurs (hébergeur, envoi d'e-mails).
- La description des mesures de sécurité : [../technique/securite-et-rgpd.md](../technique/securite-et-rgpd.md).
- L'aide à l'exercice des droits : chaque salarié consulte ses heures et les corrections faites dessus, et télécharge toutes ses données au format JSON depuis « Mes heures » (droits d'accès et de portabilité, articles 15 et 20 du RGPD).
- La notification de toute violation de données dans les meilleurs délais (art. 33 § 2).
- La restitution et la suppression des données en fin de contrat.
