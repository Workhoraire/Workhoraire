# 04. Stratégie produit

> Ce document assume des **choix**. Ils s'appuient sur les constats sourcés des documents 01 à 03 ; ce qui relève de l'hypothèse est signalé et doit être validé (entretiens, pilotes, données d'usage).

## 1. Vision

**Donner à chaque petite entreprise un relevé d'heures juste, prouvable et partagé avec ses salariés, sans surveiller personne.**

WorkHoraire remplace le tableau Excel et les feuilles papier par un outil que le salarié utilise en quelques secondes et que le dirigeant peut produire sans crainte en cas de contrôle, de litige ou de clôture de paie.

## 2. Proposition de valeur

| Pour… | Qui… | WorkHoraire… | Contrairement à… |
|---|---|---|---|
| les TPE et petites PME françaises (1 à 49 salariés) | gèrent les heures sur Excel ou papier et confient souvent la paie à un expert-comptable | fournit un pointage simple, les heures sup calculées selon le Code du travail, les alertes légales et l'export pour la paie **inclus** | des outils facturés par établissement ou avec des options payantes pour l'export, et des gratuits qui ignorent le droit et la paie français |

Trois promesses vérifiables dans le produit :
1. **Juste** : calcul à la semaine civile, heures sup +25/+50 %, heures complémentaires, congés payés dans le seuil (jurisprudence 2025), jours fériés, fuseau horaire de l'entreprise.
2. **Prouvable** : heure du serveur, piste d'audit de chaque correction avec son motif, exports horodatés.
3. **Partagé** : le salarié voit ses heures, ses heures sup et chaque correction qui le concerne.

## 3. Principes produit

1. **Confiance plutôt que surveillance** : ni biométrie, ni photo, ni géolocalisation, ni mesure d'activité (ADR 0006).
2. **Transparence réciproque** : tout ce que le manager voit sur un salarié, le salarié le voit aussi.
3. **Ne jamais inventer d'heures** : une sortie oubliée compte zéro heure tant qu'elle n'est pas déclarée.
4. **Le droit par défaut, explicable** : chaque alerte cite sa base légale et rappelle qu'un accord peut prévoir d'autres seuils.
5. **Simple d'abord** : un bouton pour pointer, une page par besoin, pas de paramétrage obligatoire pour démarrer.
6. **Données du client** : aucune réutilisation des pointages pour les besoins propres de l'éditeur (RGPD art. 28 § 10).

## 4. Périmètre stratégique

| Ce que nous faisons | Ce que nous ne faisons pas (maintenant) |
|---|---|
| Pointage web et mobile, feuilles de temps, alertes légales, absences, export paie | Planning avancé en shifts (terrain de Combo et Skello) |
| Règles du Code du travail par défaut | Moteur exhaustif des conventions collectives (Silae en intègre plus de 900) |
| Export CSV pour tout logiciel de paie, puis format Silae | Faire la paie nous-mêmes (PayFit) |
| TPE et petites PME mono-site ou à quelques sites | Grands comptes, badgeuses physiques, secteur public |

## 5. Modèle économique (hypothèses à tester)

Constats (doc 01) : les offres par établissement coûtent environ 20 € par salarié et par mois pour une TPE de 3 salariés ; les offres par utilisateur, 3 à 7 € ; Pointeo est gratuit jusqu'à 3 salariés, puis dès 19 €/mois.

**Hypothèse de grille initiale**, ci-dessous. La grille retenue, que l'application applique, est celle du [doc 08](08-prix-et-hebergement.md) (§ 2.2) ; elle est à valider auprès de 5 à 10 prospects avant le lancement (doc 08, § 4).

| Offre | Prix | Contenu |
|---|---|---|
| Découverte | 0 € jusqu'à 3 salariés actifs | Pointage, feuilles de temps, alertes, absences, export CSV |
| Essentiel | 3 € HT par salarié actif et par mois, **sans minimum par établissement**, sans engagement | Idem, sans limite de salariés, support par e-mail |
| Cabinet | Remise ou commission pour les experts-comptables prescripteurs | Accès multi-dossiers (roadmap) |

- **Salarié actif** : salarié qui a pointé, ou qui a eu une absence validée, dans le mois. La définition est affichée sur la page Tarifs du site, comme le fait Combo.
- **Garde-fous** : pas d'option payante pour l'export paie ni pour la piste d'audit. Ce sont les deux reproches principaux faits aux concurrents.

## 6. Mise sur le marché

1. **Pilotes** (3 à 5 entreprises, dont au moins une en restauration et une en commerce) : accompagnés, gratuits, en échange d'entretiens et de données d'usage.
2. **Canal expert-comptable** : c'est lui qui reçoit l'export. Il faut montrer à 3 ou 4 cabinets un fichier qu'ils importent sans retraitement, puis développer le format Silae natif.
3. **Contenu** : guides « sortir d'Excel », calcul des heures sup, obligations de décompte, kit CNIL téléchargeable. Les concurrents font du SEO sur ces sujets (doc 01, § 6).
4. **Palier gratuit** de 1 à 3 salariés, avec une activation guidée : créer l'entreprise, inviter, premier pointage.

## 7. Indicateurs de succès

| Niveau | Indicateur | Pourquoi |
|---|---|---|
| **North Star** | Salariés actifs qui pointent chaque semaine | Mesure l'usage réel, et donc la valeur produite pour le client |
| Activation | Part des entreprises créées dont au moins un salarié pointe dans les 7 jours | Le produit est adopté, pas seulement testé |
| Fiabilité | Part des journées sans correction ; taux de sorties oubliées | Qualité du relevé, moins de conflits |
| Valeur paie | Part des entreprises qui exportent chaque mois | Le job principal (J1) est rempli |
| Conformité | Alertes par salarié et par mois, et leur évolution | Le produit aide à respecter le droit |
| Rétention | Entreprises actives au mois M+3 | Adéquation produit-marché |

**Prérequis** : aucune mesure d'audience n'est encore en place. Elle doit rester respectueuse de la vie privée : agrégée, sans traceur tiers, hébergée dans l'UE.

## 8. Risques principaux

| Risque | Parade |
|---|---|
| Pointeo occupe déjà le créneau TPE gratuit + alertes + exports | Différencier par la transparence salarié, la piste d'audit visible et la qualité des calculs (jurisprudence 2025) ; auditer l'offre de Pointeo |
| Les gratuits internationaux tirent les prix vers zéro | Conformité française et export paie : ce qu'ils n'ont pas |
| Les logiciels de paie intègrent un pointage « suffisant » (Silae RH, PayFit) | S'intégrer avec eux plutôt que les concurrencer |
| Complexité des conventions collectives | Assumer « Code du travail par défaut », puis des préréglages sectoriels ciblés (HCR en premier) |
| Coût d'acquisition élevé sans canal | Priorité au canal expert-comptable et au contenu |
| Incident de sécurité sur des données salariés | Checklist de mise en production ([../technique/securite-et-rgpd.md](../technique/securite-et-rgpd.md)), hébergement UE, MFA des administrateurs |
