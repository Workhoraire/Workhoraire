# 03. Utilisateurs et besoins

> Synthèse de [`recherche/besoins-utilisateurs-complet.md`](recherche/besoins-utilisateurs-complet.md) : constats sourcés (études, avis publics, guides d'éditeurs) et hypothèses clairement signalées.
> **Les personas sont des hypothèses construites à partir de ces constats, pas des personnes interrogées.** Ils doivent être confirmés en entretien (§ 5).

## 1. Qui achète, qui utilise

| Rôle | Dans WorkHoraire | Ce qu'il attend |
|---|---|---|
| Dirigeant ou RH de TPE/PME | ADMIN | Des heures justes pour la paie, la preuve en cas de litige, peu de temps passé |
| Responsable d'équipe ou de site | MANAGER | Qui est là, corriger les oublis vite, valider les absences |
| Salarié (souvent sans poste de travail ni e-mail professionnel) | EMPLOYEE | Pointer en quelques secondes, **voir ses heures**, poser ses congés |
| Expert-comptable ou gestionnaire de paie | Externe (export) | Un fichier propre, avec matricules, à date fixe, sans ressaisie |

**Secteurs où le besoin est le plus documenté** :
- **Hôtels, cafés, restaurants** : plus de 4 salariés sur 5 travaillent dans des établissements de moins de 50 personnes, environ 60 % des recrutements sont saisonniers, et le travail le week-end est majoritaire (données 2016 et 2017).
- **Ensuite** : commerce, propreté (temps partiel massif), BTP, santé privée.

Sources et chiffres : § 2.4 de l'annexe.

## 2. Douleurs documentées

| Douleur | Constat | Source |
|---|---|---|
| Heures sup non payées ou contestées | 58 % des salariés français font régulièrement des heures sup non rémunérées (ADP 2019) ; 6 h par semaine en moyenne en PME (ADP 2023) | Annexe § 0 et § 3.4 |
| Erreurs de paie | 23 % des salariés de PME se disent souvent sous-payés à cause d'erreurs de paie (ADP 2023) | Annexe § 3.2 |
| Preuve | En cas de litige, l'employeur doit justifier les horaires ; un salarié peut réclamer 3 ans de salaire | L3171-4, L3245-1 |
| Ressaisie en cabinet | Les cabinets citent les relances et la ressaisie des variables comme leur principale douleur | Annexe § 7.2 |
| Outils existants | Le salarié ne voit pas ses heures ; export paie payant ; prix opaques et engagement de 12 mois ; hors-ligne peu fiable | Annexe § 4.2 |
| Acceptabilité | 59 % des salariés surveillés préféreraient ne plus l'être, mais 44 % jugent utile la **preuve des heures** et 51 % pensent que leurs heures sup seraient mieux prises en compte (GetApp 2020) | Annexe § 5.9 |

**Donnée introuvable** : la part des TPE encore sur Excel ou papier n'est mesurée par aucune étude fiable. Nous ne l'utilisons pas.

## 3. Personas (hypothèses)

| | Contexte | Objectif principal | Frustration principale |
|---|---|---|---|
| **Nadia**, restauratrice (ADMIN) | 9 salariés, 1 site, paie chez l'expert-comptable, feuilles papier recopiées dans Excel | Envoyer des heures justes au cabinet du premier coup | Reconstituer les heures en fin de mois ; options payantes pour l'export |
| **Julien**, gérant de 3 boutiques (ADMIN/MANAGER) | 35 salariés, un responsable par site | Voir en temps réel qui est là et les heures sup qui arrivent | Prix par établissement ; responsables qui ne valident pas |
| **Sandrine**, cheffe d'équipe propreté/BTP (MANAGER) | 12 agents sur plusieurs sites, temps partiels | Valider en quelques minutes sur mobile, régler les oublis sans conflit | Fiches rendues en retard ; refus de « fliquer » par géolocalisation |
| **Mehdi**, salarié étudiant à temps partiel (EMPLOYEE) | Smartphone personnel, pas d'e-mail pro | Pointer en quelques secondes et **voir ses heures de la semaine** | Ne pas voir ses heures ni l'historique ; peur d'être surveillé |
| **Claire**, gestionnaire de paie en cabinet (externe) | Des dizaines de clients TPE sous Silae | Recevoir à date fixe un fichier avec matricules et codes | Relances, fichiers Excel hétérogènes, matricules manquants |

## 4. Jobs-to-be-done et réponse du MVP

| Job (« Quand…, je veux…, afin de… ») | Réponse dans WorkHoraire |
|---|---|
| **J1** Quand la fin du mois approche, je veux transmettre au cabinet des variables justes en quelques minutes | Export CSV hebdomadaire (heures sup par taux, absences par type, matricule), sans option payante |
| **J2** Quand un salarié conteste ses heures, je veux un relevé horodaté dont chaque correction est tracée | Heure du serveur, journal des corrections (qui, quand, avant/après, motif), export journalier |
| **J3** Quand je ne suis pas sur place, je veux voir qui est présent et les heures sup qui se profilent | Tableau de bord : présents maintenant, sorties non pointées, heures sup de la semaine, alertes |
| **J4** Quand j'arrive, je veux pointer en quelques secondes | Page « Pointer » avec un seul gros bouton, pensée pour le mobile |
| **J5** Quand j'ai oublié de pointer, je veux corriger avec un motif | Le salarié déclare sa sortie oubliée ; le manager corrige avec motif ; tout est visible par le salarié |
| **J6** Je veux être alerté des infractions sans connaître le Code du travail | Alertes 10 h, 48 h, pause, repos de 11 h, 6 jours, temps partiel, chacune avec sa base légale |
| **J7** Je veux vérifier mes heures pour avoir confiance | « Mes heures » : détail par jour, heures sup de la semaine, historique des corrections |
| **J8** Je veux être en règle avec la CNIL rapidement | Pas de biométrie, de photo ni de géolocalisation ; kit d'information des salariés |
| **J9** (cabinet) Je veux un fichier au format de mon logiciel | CSV générique ✅ ; format Silae natif et correspondance des rubriques : roadmap |

## 5. Hypothèses à valider en priorité

Tirées du § 9.3 de l'annexe (12 hypothèses au total) :

| ID | Hypothèse | Signal de validation | Impact si elle est fausse |
|---|---|---|---|
| H2 | La transmission des heures au cabinet est le moment le plus douloureux du mois | ≥ 1 h par mois et ≥ 1 aller-retour avec le cabinet | L'export n'est plus l'argument principal |
| H3 | Les oublis de pointage sont la première anomalie, avant la fraude | Majorité des récits d'anomalies = oublis | Il faudrait des mécanismes anti-fraude |
| H4 | Pointer doit prendre ≤ 5 s sur tablette et ≤ 3 gestes sur mobile | Temps observé sur le terrain | Le mode kiosque devient prioritaire |
| H5 | Voir ses heures augmente l'adhésion des salariés | Les salariés citent spontanément ce besoin | Moins d'effort sur l'espace salarié |
| H7 | Un export Silae inclus est décisif quand la paie est externalisée | Cité dans les 3 premiers critères | Le format Silae natif peut attendre |
| H9 | L'expert-comptable prescrit l'outil, ou s'y oppose | Cité comme conseiller ou décideur | Le canal cabinet n'est plus prioritaire |
| H11 | En TPE, les alertes doivent être informatives, pas bloquantes | Préférence exprimée | Il faudrait des alertes bloquantes paramétrables |

**Protocole** : 10 à 12 dirigeants ou managers, 6 à 8 salariés, 3 à 4 gestionnaires de paie. Entretiens sur site, sur des faits passés, en regardant les vrais fichiers. Le guide de 15 questions, plus 4 pour les cabinets, est au § 9.4 de l'annexe.
