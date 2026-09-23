# WorkHoraire : cadre juridique du pointage et de la gestion des temps (France, TPE/PME) traduit en exigences produit

> **AVERTISSEMENT : ce document ne constitue pas un avis juridique.** C'est une note de recherche documentaire destinée à une équipe produit, rédigée à partir de sources publiques consultées en ligne le **23/09/2026**. Elle ne remplace pas la consultation d'un avocat ou d'un juriste sur un cas précis. Les conventions collectives, accords de branche et accords d'entreprise des clients peuvent modifier une grande partie des valeurs « par défaut » présentées ici.

**Date de la recherche :** 23/09/2026
**Périmètre :** droit du travail français (secteur privé, particularités d'Alsace-Moselle et d'outre-mer signalées), RGPD et loi Informatique et Libertés, doctrine et sanctions de la CNIL, jurisprudence (CJUE, Cour de cassation, Conseil d'État).

**Méthode et conventions**
- Chaque règle cite l'article et l'URL que j'ai **réellement consultée**. J'ai lu les articles du Code du travail soit sur **Légifrance**, soit sur le **Code du travail numérique** (`code.travail.gouv.fr`, service du ministère du Travail qui reproduit la version Légifrance et affiche la date de la version en vigueur). Dans ce document, « v. jj/mm/aaaa » désigne la date de version affichée par la source.
- **[Non vérifié]** : point que je n'ai pas pu confirmer sur une source primaire.
- **[Analyse]** : déduction de ma part à partir des textes cités, à faire valider par un juriste.
- **Limites de la recherche.** L'outil de consultation ne pouvait pas lire EUR-Lex ni CURIA. Pour l'arrêt C-55/18, j'ai donc utilisé le communiqué de presse officiel de la CJUE et les citations de son point 60 reprises par la Cour de cassation. Le quota de recherches web a été épuisé en cours d'étude : les points restés non confirmés sont listés en section 10.
- Le domaine `service-public.fr` redirige désormais vers `service-public.gouv.fr` (redirection 301 constatée le 23/09/2026).

---

## Sommaire

0. L'essentiel en 14 points
1. Obligation de décompte du temps de travail (L3171-1 à L3171-4, D3171-1 à D3171-16, CJUE CCOO)
2. Durées maximales, repos, pauses, travail de nuit
3. Heures supplémentaires et heures complémentaires
4. Jours fériés et congés payés (dont loi n° 2024-364)
5. RGPD et CNIL appliqués au pointage
6. Paie : mentions du bulletin et contenu de l'export de temps
7. Spécificités sectorielles (HCR, BTP, transport routier léger / Mobilic, aide à domicile)
8. Évolutions 2023-2026 (chronologie)
9. Synthèse des exigences produit (tableau)
10. Points non vérifiés et sujets de veille
11. Sources consultées

---

## 0. L'essentiel en 14 points

1. **Décompte individuel obligatoire** pour les salariés qui ne suivent pas le même horaire collectif affiché : enregistrement **quotidien** des heures de début et de fin de chaque période de travail (ou du nombre d'heures), plus une **récapitulation hebdomadaire** ([D3171-8](https://code.travail.gouv.fr/code-du-travail/d3171-8) ; [L3171-2](https://code.travail.gouv.fr/code-du-travail/l3171-2)).
2. **Conservation pour l'inspection du travail :** 1 an pour les documents de décompte des heures (ou la durée de la période de référence si l'aménagement dépasse un an), 1 an pour le récapitulatif des astreintes, 3 ans pour les forfaits en jours ([D3171-16](https://code.travail.gouv.fr/code-du-travail/d3171-16)).
3. **Un système d'enregistrement automatique doit être « fiable et infalsifiable »** ([L3171-4](https://code.travail.gouv.fr/code-du-travail/l3171-4), al. 3). En cas de litige, l'employeur doit fournir au juge les éléments qui justifient les horaires réellement effectués.
4. **CJUE, 14 mai 2019, CCOO (C-55/18) :** les États membres doivent imposer un **« système objectif, fiable et accessible »** qui mesure la durée du travail journalier de chaque travailleur. Aucune loi française de transposition spécifique n'a été identifiée. La Cour de cassation cite cet arrêt (7/02/2024 ; 18/03/2026).
5. **Charge de la preuve :** elle est partagée pour les heures supplémentaires (Cass. soc. 18/03/2020). Elle pèse **sur le seul employeur** pour le respect des seuils et plafonds (durées maximales, repos) (Cass. soc. 20/02/2013). Le seul dépassement de la durée maximale ouvre droit à réparation (Cass. soc. 26/01/2022).
6. **Valeurs légales par défaut :** 35 h par semaine ; 10 h par jour (12 h par accord) ; 48 h au cours d'une même semaine ; 44 h en moyenne sur 12 semaines consécutives (46 h par accord) ; 11 h de repos quotidien ; repos hebdomadaire de 24 h + 11 h ; 20 min de pause dès 6 h de travail ; travail de nuit entre 21 h et 6 h à défaut d'accord.
7. **Heures supplémentaires :** décompte **par semaine**, qui court **du lundi 0 h au dimanche 24 h** sauf accord ; majoration de 25 % pour les 8 premières heures, puis 50 % (un accord peut fixer un taux d'au moins 10 %) ; contingent de **220 h** par défaut ; contrepartie obligatoire en repos de 50 % (≤ 20 salariés) ou 100 % (> 20 salariés).
8. **Nouveauté jurisprudentielle (Cass. soc. 10/09/2025, n° 23-14.455) :** pour un salarié soumis à un décompte hebdomadaire, les heures de **congé payé** pris dans la semaine comptent pour le seuil de déclenchement des heures supplémentaires.
9. **Temps partiel :** heures complémentaires dans la limite de 1/10 de la durée contractuelle (1/3 par accord), majorées de 10 % puis 25 % ; alerte de requalification si l'horaire moyen dépasse le contrat d'au moins 2 h par semaine sur 12 semaines.
10. **Congés payés (loi n° 2024-364) :** 2 jours ouvrables par mois pendant un arrêt maladie non professionnel (plafond de 24 jours par période) ; report de 15 mois ; l'employeur doit informer le salarié dans le mois qui suit la reprise. Depuis Cass. soc. 10/09/2025 (n° 23-22.732), une maladie survenue pendant les congés ouvre droit au report des jours concernés.
11. **RGPD :** le client employeur est **responsable du traitement** et WorkHoraire est **sous-traitant** (art. 28 RGPD). Le salarié doit être informé avant toute collecte ([L1222-4](https://code.travail.gouv.fr/code-du-travail/l1222-4) ; art. 13 RGPD). Dans les entreprises d'au moins 50 salariés, le CSE doit être informé et consulté avant la mise en œuvre de tout moyen de contrôle de l'activité ([L2312-38](https://code.travail.gouv.fr/code-du-travail/l2312-38)).
12. **CNIL (fiche mise à jour le 17/06/2026) :** l'installation d'un pointage **biométrique**, ou d'un pointage avec **photographie systématique**, « apparaît excessive » et contraire au principe de minimisation. La **géolocalisation** ne peut servir à contrôler la durée du travail que si aucun autre moyen n'est possible, même moins efficace (CE 15/12/2017 ; Cass. soc. 18/03/2026).
13. **Conservation (référentiel CNIL RH du 02/04/2026, mis à jour le 20/05/2026) :** base active jusqu'à l'émission du bulletin de paie ; archivage intermédiaire de 1 an (3 ans pour les forfaits) ; journaux de contrôle d'accès limités à 3 mois ; jusqu'à 5 ans lorsque les données servent au suivi du temps de travail (fiche CNIL).
14. **Export paie :** le bulletin doit distinguer les heures au taux normal et les heures majorées **avec leurs taux** ([R3243-1](https://code.travail.gouv.fr/code-du-travail/r3243-1) 5°). Le récapitulatif hebdomadaire des heures supplémentaires et complémentaires, **par taux et par mois de paiement** ([D241-25 CSS](https://www.legifrance.gouv.fr/codes/id/LEGISCTA000026407536/), décret n° 2025-318), conditionne la réduction de cotisations.

---

## 1. Obligation de décompte du temps de travail

### 1.1 Qui doit décompter quoi

| Situation | Obligation (paraphrase fidèle) | Article (version) |
|---|---|---|
| Tout employeur | Afficher les heures de début et de fin du travail ainsi que les heures et la durée des repos. En cas d'aménagement du temps de travail (L3121-44), l'affichage comprend la répartition de la durée du travail. La programmation individuelle des astreintes est portée à la connaissance de chaque salarié. | [L3171-1](https://code.travail.gouv.fr/code-du-travail/l3171-1) (v. 10/08/2016) |
| Horaire collectif | L'horaire, établi selon l'heure légale, indique le début et la fin de chaque période de travail. Aucun salarié ne peut travailler en dehors de cet horaire, sauf heures supplémentaires dans le contingent et dérogations permanentes. | [D3171-1](https://code.travail.gouv.fr/code-du-travail/d3171-1) |
| Horaire collectif | L'horaire est daté, signé et affiché lisiblement dans chaque lieu de travail concerné. | [D3171-2](https://code.travail.gouv.fr/code-du-travail/d3171-2) |
| Horaire collectif | Toute modification donne lieu, avant son application, à une rectification affichée dans les mêmes conditions. | [D3171-3](https://code.travail.gouv.fr/code-du-travail/d3171-3) |
| Horaire collectif | Un double de l'horaire et de ses rectifications est adressé **préalablement** à l'agent de contrôle de l'inspection du travail. | [D3171-4](https://code.travail.gouv.fr/code-du-travail/d3171-4) (v. 13/02/2021) ; sanction : [R3173-1](https://code.travail.gouv.fr/code-du-travail/r3173-1) (contravention de 4e classe, appliquée autant de fois qu'il y a de salariés concernés) |
| Aménagement sur plusieurs semaines (L3121-44 / D3121-27) | Afficher le nombre de semaines de la période de référence et, pour chaque semaine, l'horaire et la répartition. Les changements sont affichés en respectant le délai de 7 jours (L3121-47) ou le délai conventionnel. | [D3171-5](https://code.travail.gouv.fr/code-du-travail/d3171-5) |
| Travail par relais, roulement ou équipes successives | Composition nominative de chaque équipe (intérimaires compris), soit par tableau affiché, soit par registre tenu à jour et mis à la disposition de l'inspection et de la délégation du personnel au CSE. | [D3171-7](https://code.travail.gouv.fr/code-du-travail/d3171-7) (v. 13/02/2021) |
| **Salariés ne suivant pas le même horaire collectif** | L'employeur établit, pour chaque salarié, les documents de décompte de la durée du travail, des repos compensateurs acquis et de leur prise effective. **Le CSE peut consulter ces documents.** | [L3171-2](https://code.travail.gouv.fr/code-du-travail/l3171-2) (v. 01/01/2018, ord. n° 2017-1386) |
| Idem | **Chaque jour :** enregistrement, « selon tous moyens », des heures de début et de fin de chaque période de travail, **ou** relevé du nombre d'heures accomplies. **Chaque semaine :** récapitulation du nombre d'heures accomplies par chaque salarié. | [D3171-8](https://code.travail.gouv.fr/code-du-travail/d3171-8) |
| Exceptions à D3171-8 | (1) Forfaits en heures, lorsque l'accord fixe les modalités de contrôle de la durée du travail. (2) Accords de branche étendus prévoyant une quantification préalable du temps de travail fondée sur des critères objectifs, avec des modalités de contrôle. | [D3171-9](https://code.travail.gouv.fr/code-du-travail/d3171-9) |
| Forfait en jours (L3121-58) | Décompte **annuel** par récapitulation des journées ou demi-journées travaillées. | [D3171-10](https://code.travail.gouv.fr/code-du-travail/d3171-10) |
| Repos compensateur de remplacement (RCR) et contrepartie obligatoire en repos (COR) | Sauf précision conventionnelle, information par un document annexé au bulletin de paie. **Dès que le crédit atteint 7 heures**, ce document signale l'ouverture du droit et l'obligation de prendre le repos **dans un délai maximum de 2 mois**. | [D3171-11](https://code.travail.gouv.fr/code-du-travail/d3171-11) |
| Salariés hors horaire collectif | **Document mensuel dont le double est annexé au bulletin.** Il reprend les mentions de D3171-11 et indique : (1) le cumul des heures supplémentaires depuis le début de l'année ; (2) le RCR acquis ; (3) les heures de repos compensateur prises dans le mois ; (4) les jours de repos pris dans le mois (dispositif de réduction du temps de travail par jours ou demi-journées). | [D3171-12](https://code.travail.gouv.fr/code-du-travail/d3171-12) |
| Aménagement L3121-44 | Le total des heures accomplies depuis le début de la période de référence figure, à la fin de celle-ci ou au départ du salarié, sur un document annexé au dernier bulletin de la période. | [D3171-13](https://code.travail.gouv.fr/code-du-travail/d3171-13) |
| Droit d'accès | Le droit d'accès aux informations nominatives (renvoi à l'ancien article 39 de la loi n° 78-17) s'applique aux documents qui comptabilisent la durée du travail. | [D3171-14](https://code.travail.gouv.fr/code-du-travail/d3171-14) |
| Format électronique | Les documents de D3171-7 à D3171-13 **peuvent être électroniques si des garanties de contrôle équivalentes sont maintenues.** La seconde phrase de l'article renvoie à la « déclaration préalable » de la loi de 1978 : son articulation avec le régime issu du RGPD n'a pas été vérifiée **[Non vérifié]**. | [D3171-15](https://code.travail.gouv.fr/code-du-travail/d3171-15) (v. 23/10/2016) |

Le chapitre réglementaire s'arrête à D3171-16 : l'URL de D3171-17 renvoie une erreur 404 sur le Code du travail numérique.

### 1.2 Mise à disposition de l'inspection du travail, conservation et sanctions

- **[L3171-3](https://code.travail.gouv.fr/code-du-travail/l3171-3)** (v. 10/08/2016) : l'employeur tient à la disposition de l'agent de contrôle (L8112-1) les documents qui comptabilisent le temps de travail de chaque salarié. La nature des documents et la durée de mise à disposition sont fixées par voie réglementaire.
- **[D3171-16](https://code.travail.gouv.fr/code-du-travail/d3171-16)** (v. 01/01/2017) : conservation à disposition de l'inspection :
  - 1° **1 an**, y compris en cas d'horaires individualisés, ou la durée de la période de référence si l'aménagement dépasse l'année, pour les documents qui comptabilisent les **heures** de chaque salarié ;
  - 2° **1 an** pour le document mensuel qui récapitule les heures d'**astreinte** et leur compensation ;
  - 3° **3 ans** pour les documents qui comptabilisent les **jours** des salariés en **forfait**.
- **Sanctions pénales :** [R3173-2](https://code.travail.gouv.fr/code-du-travail/r3173-2) punit la méconnaissance des deux premiers alinéas de L3171-1 et de L3171-2 d'une contravention de 4e classe, appliquée autant de fois qu'il y a de salariés concernés. Le montant de cette contravention n'a pas été vérifié ici.
- **Sanctions administratives :** [L8115-1](https://code.travail.gouv.fr/code-du-travail/l8115-1) 3° permet une amende administrative en cas de manquement à L3171-2 (« établissement d'un décompte de la durée de travail »). Les 1° et 2° visent les durées maximales (L3121-18 à L3121-25) et les repos (L3131-1 à L3131-3, L3132-2). Selon [L8115-3](https://code.travail.gouv.fr/code-du-travail/l8115-3), l'amende peut atteindre **4 000 € par travailleur concerné**. Ce plafond est doublé en cas de nouveau manquement dans les 2 ans suivant la notification d'une amende, et majoré de 50 % en cas de nouveau manquement dans l'année qui suit un avertissement. Le Code du travail numérique affiche une version de L8115-1 datée du **27/06/2026**, qui comporte notamment un 6° relatif au document unique d'évaluation des risques : c'est une modification récente, mais je n'ai pas vérifié le texte qui l'a introduite.

### 1.3 Preuve en cas de litige sur les heures

- **[L3171-4](https://code.travail.gouv.fr/code-du-travail/l3171-4)** (v. 01/05/2008 ; également lu sur [Légifrance](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006902808)) :
  - al. 1 : en cas de litige sur l'existence ou le nombre d'heures, l'employeur fournit au juge les éléments de nature à justifier les horaires effectivement réalisés par le salarié ;
  - al. 2 : au vu de ces éléments et de ceux du salarié, le juge forme sa conviction, au besoin après des mesures d'instruction ;
  - al. 3 : si le décompte est assuré par un système d'enregistrement automatique, celui-ci doit être **« fiable et infalsifiable »**.
- **Cass. soc., 18 mars 2020, n° 18-10.919 (publié) :** le salarié présente des éléments « suffisamment précis » sur les heures non rémunérées qu'il revendique, afin que l'employeur, « qui assure le contrôle des heures de travail effectuées », puisse répondre avec ses propres éléments. Le juge évalue ensuite souverainement le nombre d'heures, sans avoir à détailler son calcul. L'arrêt ne cite pas la CJUE. [Légifrance](https://www.legifrance.gouv.fr/juri/id/JURITEXT000041845583/)
- **Cass. soc., 20 février 2013, n° 11-28.811 (publié) :** le partage de la preuve prévu par L3171-4 ne s'applique pas à la preuve du respect des seuils et plafonds du droit de l'Union et des durées maximales du droit interne. Cette preuve **incombe à l'employeur**. [Légifrance](https://www.legifrance.gouv.fr/juri/id/JURITEXT000027104181)
- **Cass. soc., 26 janvier 2022, n° 20-21.636 (FS-B) :** « le seul constat du dépassement de la durée maximale de travail ouvre droit à la réparation » (48 h hebdomadaires ; directive 2003/88, art. 6 b). [Légifrance](https://www.legifrance.gouv.fr/juri/id/JURITEXT000045097657)
- **Cass. ass. plén., 22 décembre 2023, n° 20-20.648 :** une preuve obtenue de façon illicite ou déloyale n'est pas nécessairement écartée. Le juge met en balance le droit à la preuve et les droits contraires : la production doit être indispensable et l'atteinte strictement proportionnée au but poursuivi. [Légifrance](https://www.legifrance.gouv.fr/juri/id/JURITEXT000048769030)
  - [Analyse] Les données de WorkHoraire pourront servir de preuve à l'employeur comme au salarié. Leur fiabilité (horodatage, traçabilité) conditionne leur force probante. Une collecte non conforme (par exemple une géolocalisation non déclarée) expose le client à un débat sur la recevabilité de la preuve et à des sanctions RGPD.

### 1.4 CJUE, 14 mai 2019, C-55/18, Federación de Servicios de Comisiones Obreras (CCOO) c/ Deutsche Bank SAE

**Source consultée :** le [communiqué de presse officiel de la CJUE n° 61/19](https://curia.europa.eu/jcms/upload/docs/application/pdf/2019-05/cp190061fr.pdf). Le texte intégral n'était pas lisible via EUR-Lex ou CURIA ; le point 60 est cité par la Cour de cassation (voir ci-dessous).

**Ce que l'arrêt exige :**
- Les directives 2003/88/CE (temps de travail) et 89/391/CEE (santé et sécurité), lues à la lumière de l'article 31 § 2 de la Charte, **s'opposent** à une réglementation qui n'impose pas aux employeurs d'établir un système permettant de mesurer la durée du temps de travail **journalier** effectué par **chaque** travailleur.
- Les États membres doivent imposer aux employeurs de mettre en place un **« système objectif, fiable et accessible »** (point 60, repris mot pour mot par la Cour de cassation).
- Il revient aux États membres d'en fixer les **modalités concrètes**, notamment la forme, en tenant compte des particularités de chaque secteur d'activité, voire de la taille de certaines entreprises (communiqué).
- Justification : sans un tel système, il est impossible de déterminer de façon objective et fiable les heures travaillées, leur répartition et les heures supplémentaires. Les travailleurs ont alors beaucoup de mal à faire valoir leurs droits. À l'inverse, l'enregistrement donne un accès aisé à des données objectives et facilite le contrôle par les autorités et les juges (communiqué).

**Application en France :**
- **Transposition :** je n'ai identifié **aucun texte français spécifique** transposant CCOO. La Cour de cassation raisonne à partir des articles L3171-2 à L3171-4 et D3171-8 existants, lus à la lumière de l'arrêt. **Réforme en cours : aucune identifiée [Non vérifié : recherche limitée].**
- **Cass. soc., 7 février 2024, n° 22-15.842 (publié) :** la Cour cite le point 60 de CCOO puis juge que l'absence d'un tel système ne prive pas l'employeur du droit de soumettre au débat contradictoire tout élément de droit, de fait et de preuve. [Légifrance](https://www.legifrance.gouv.fr/juri/id/JURITEXT000049130153)
- **Cass. soc., 18 mars 2026, n° 24-18.976 (publié), une fédération syndicale des activités postales c/ Mediaposte, dispositif « Distrio » :** la Cour cite L1121-1, le point 60 de CCOO et D3171-8. Elle rappelle que la géolocalisation n'est licite pour contrôler la durée du travail que si aucun autre moyen, fût-il moins efficace, ne le permet. Elle approuve la cour d'appel qui a jugé le dispositif licite pour les raisons suivantes :
  - les distributeurs n'avaient qu'une « liberté d'organisation très relative » ;
  - le boîtier était activé par le salarié pendant la seule phase de distribution et n'enregistrait rien une fois désactivé ;
  - les parcours étaient conservés par un tiers de confiance, sans suivi en direct ;
  - un échange n'avait lieu qu'en cas de dépassement de plus de 5 % du temps planifié ;
  - les autres solutions étaient inopérantes : système auto-déclaratif (pas de vérification objective), comptes rendus ou sondages, accompagnement hiérarchique.

  La cour d'appel a donc pu retenir qu'aucun autre dispositif n'assurait un contrôle « objectif, fiable et accessible ». [Légifrance](https://www.legifrance.gouv.fr/juri/id/JURITEXT000053765290)
- [Analyse] La lecture la plus prudente de CCOO consiste à enregistrer le temps **réel** de chaque jour pour **tous** les salariés, y compris ceux soumis à un horaire collectif affiché : l'horaire affiché ne mesure pas les heures réellement effectuées. Pour WorkHoraire, c'est un argument commercial autant qu'une exigence de conception. Le système doit être objectif (horodatage non modifiable par l'utilisateur), fiable (traçabilité des corrections) et accessible (consultation par le salarié et export pour les autorités).
- **CJUE, 19 décembre 2024, C-531/23 (« Loredas », travailleurs domestiques) : [Non vérifié]**, texte non consultable. À vérifier si WorkHoraire vise les particuliers employeurs.

### 1.5 Conséquences pour le produit (section 1)

- Pointage **quotidien** des heures de début et de fin (ou du nombre d'heures) pour chaque salarié, avec **récapitulation hebdomadaire** automatique (D3171-8). Recommandé aussi pour les salariés sous horaire collectif [Analyse CCOO].
- Horodatage **serveur**, journal des événements **en ajout seul** et traçabilité complète des corrections (qui, quand, valeur avant et après, motif), afin de rendre le système « fiable et infalsifiable » (L3171-4).
- Espace salarié : consultation des relevés jour, semaine et mois, et export (exigence « accessible » de CCOO ; D3171-14 ; art. 15 RGPD).
- Génération et archivage de l'**horaire collectif** daté et signé, historique de ses rectifications et envoi du double à l'inspection (D3171-2 à D3171-4). Registre des équipes (D3171-7).
- Documents à annexer au bulletin : document mensuel D3171-12, information sur le RCR et la COR avec alerte à 7 h et échéance à 2 mois (D3171-11), total de fin de période d'aménagement (D3171-13).
- Export « inspection du travail » lisible et électronique (D3171-15), conservé au moins 1 an (3 ans pour les forfaits en jours) (D3171-16). Accès en consultation pour le CSE (L3171-2 al. 2).

---

## 2. Durées maximales, repos, pauses et travail de nuit

### 2.1 Définitions utiles au moteur de calcul

- **Temps de travail effectif :** temps pendant lequel le salarié est à la disposition de l'employeur et se conforme à ses directives sans pouvoir vaquer librement à des occupations personnelles ([L3121-1](https://code.travail.gouv.fr/code-du-travail/l3121-1)).
- **Pauses et restauration :** elles comptent comme temps de travail effectif lorsque les critères de L3121-1 sont réunis ([L3121-2](https://code.travail.gouv.fr/code-du-travail/l3121-2)).
- **Habillage et déshabillage :** ils ouvrent droit à des contreparties (repos ou argent) lorsque la tenue est imposée et que l'habillage a lieu dans l'entreprise ou sur le lieu de travail ([L3121-3](https://code.travail.gouv.fr/code-du-travail/l3121-3)).
- **Trajet domicile / lieu d'exécution :** ce n'est pas du temps de travail effectif. En revanche, le dépassement du temps de trajet normal donne droit à une contrepartie, et la part du trajet qui coïncide avec l'horaire de travail n'entraîne aucune perte de salaire ([L3121-4](https://code.travail.gouv.fr/code-du-travail/l3121-4)).
- **Astreinte :** l'intervention est du temps de travail effectif. La période d'astreinte donne droit à une contrepartie, et le salarié est informé de sa programmation individuelle dans un délai raisonnable ([L3121-9](https://code.travail.gouv.fr/code-du-travail/l3121-9)). Hors intervention, l'astreinte compte dans les repos quotidien et hebdomadaire ([L3121-10](https://code.travail.gouv.fr/code-du-travail/l3121-10)). En fin de mois, l'employeur remet un récapitulatif des heures d'astreinte et de leur compensation ([R3121-2](https://code.travail.gouv.fr/code-du-travail/r3121-2)).
- **Régime d'équivalence :** mode spécifique de détermination du temps de travail effectif pour des emplois comportant des périodes d'inaction ([L3121-13](https://code.travail.gouv.fr/code-du-travail/l3121-13)).
- **Cadres dirigeants :** ils ne relèvent pas des titres II et III (durée du travail, repos, congés) ([L3111-2](https://code.travail.gouv.fr/code-du-travail/l3111-2)).

### 2.2 Tableau des valeurs légales

| Règle | Valeur par défaut | Article | Dérogations principales |
|---|---|---|---|
| Durée légale | **35 h** de travail effectif par semaine (temps complet) | [L3121-27](https://code.travail.gouv.fr/code-du-travail/l3121-27) | Ce n'est pas un plafond : c'est le seuil des heures supplémentaires. |
| Durée quotidienne maximale | **10 h** de travail effectif | [L3121-18](https://code.travail.gouv.fr/code-du-travail/l3121-18) | Autorisation de l'inspecteur du travail, urgence, ou accord d'entreprise (à défaut de branche) en cas d'activité accrue ou pour des raisons d'organisation, **jusqu'à 12 h** ([L3121-19](https://code.travail.gouv.fr/code-du-travail/l3121-19)). |
| Durée hebdomadaire maximale absolue | **48 h** au cours d'une même semaine | [L3121-20](https://code.travail.gouv.fr/code-du-travail/l3121-20) | Circonstances exceptionnelles : autorisation administrative, après avis du CSE, **jusqu'à 60 h** ([L3121-21](https://code.travail.gouv.fr/code-du-travail/l3121-21)). |
| Durée hebdomadaire moyenne | **44 h** sur toute période de 12 semaines consécutives | [L3121-22](https://code.travail.gouv.fr/code-du-travail/l3121-22) | Accord d'entreprise (à défaut de branche) : **46 h** ([L3121-23](https://code.travail.gouv.fr/code-du-travail/l3121-23)) ; à défaut d'accord, autorisation administrative dans la limite de 46 h ([L3121-24](https://code.travail.gouv.fr/code-du-travail/l3121-24)). |
| Pause | **20 min consécutives** dès que le temps de travail quotidien **atteint 6 h** | [L3121-16](https://code.travail.gouv.fr/code-du-travail/l3121-16) | Un accord peut prévoir une pause plus longue ([L3121-17](https://code.travail.gouv.fr/code-du-travail/l3121-17)). |
| Repos quotidien | **11 h consécutives** | [L3131-1](https://code.travail.gouv.fr/code-du-travail/l3131-1) | Accord d'entreprise (à défaut de branche), notamment pour la continuité du service ou les interventions fractionnées ([L3131-2](https://code.travail.gouv.fr/code-du-travail/l3131-2)), **sans descendre sous 9 h** ([D3131-6](https://code.travail.gouv.fr/code-du-travail/d3131-6)) ; urgence (L3131-1). |
| Jours travaillés | **6 jours au plus par semaine** | [L3132-1](https://code.travail.gouv.fr/code-du-travail/l3132-1) | Non. |
| Repos hebdomadaire | **24 h consécutives + 11 h** de repos quotidien, soit 35 h | [L3132-2](https://code.travail.gouv.fr/code-du-travail/l3132-2) | |
| Repos dominical | Le repos hebdomadaire est donné le dimanche | [L3132-3](https://code.travail.gouv.fr/code-du-travail/l3132-3) | Nombreuses dérogations, par exemple les dérogations de droit avec repos par roulement ([L3132-12](https://code.travail.gouv.fr/code-du-travail/l3132-12)). Elles ne sont pas détaillées ici. |
| Travail de nuit (définition) | Travail accompli pendant une période d'au moins 9 h consécutives comprenant l'intervalle **minuit-5 h**, qui commence au plus tôt à 21 h et finit au plus tard à 7 h | [L3122-2](https://code.travail.gouv.fr/code-du-travail/l3122-2) | La plage est fixée par accord. |
| Travail de nuit (défaut) | À défaut d'accord : **21 h-6 h** (minuit-7 h pour les activités visées à L3122-3) | [L3122-20](https://code.travail.gouv.fr/code-du-travail/l3122-20) | |
| Qualité de « travailleur de nuit » | Au moins 2 fois par semaine, au moins 3 h de nuit par jour ; **ou** un nombre minimal d'heures sur une période de référence | [L3122-5](https://code.travail.gouv.fr/code-du-travail/l3122-5) | Nombre d'heures à défaut d'accord : **270 h sur 12 mois consécutifs** ([L3122-23](https://code.travail.gouv.fr/code-du-travail/l3122-23)). |
| Travailleur de nuit : durée quotidienne | **8 h** au plus | [L3122-6](https://code.travail.gouv.fr/code-du-travail/l3122-6) | L3122-17, L3132-16 à L3132-19 ; circonstances exceptionnelles (inspecteur du travail). |
| Travailleur de nuit : durée hebdomadaire moyenne | **40 h** sur 12 semaines consécutives | [L3122-7](https://code.travail.gouv.fr/code-du-travail/l3122-7) | L3122-18. |
| Travailleur de nuit : contreparties | Repos compensateur obligatoire et, le cas échéant, compensation salariale | [L3122-8](https://code.travail.gouv.fr/code-du-travail/l3122-8) | Montant fixé par accord. |
| Jeunes travailleurs (moins de 18 ans) | **8 h par jour et 35 h par semaine** | [L3162-1](https://code.travail.gouv.fr/code-du-travail/l3162-1) (v. 01/01/2019) | Dérogations limitées ; jamais au-delà de la durée normale des adultes de l'établissement. |
| Jeunes : pause | Pas plus de **4 h 30** de travail ininterrompu ; au-delà, **30 min** consécutives de pause | [L3162-3](https://code.travail.gouv.fr/code-du-travail/l3162-3) | |
| Jeunes : repos quotidien | **12 h** (**14 h** pour les moins de 16 ans) | [L3164-1](https://code.travail.gouv.fr/code-du-travail/l3164-1) | |
| Jeunes : repos hebdomadaire | **2 jours consécutifs** | [L3164-2](https://code.travail.gouv.fr/code-du-travail/l3164-2) | Dérogation par accord (36 h minimum). |
| Jeunes : nuit | **Interdit.** Est « de nuit » le travail entre 22 h et 6 h (16-18 ans) ou entre 20 h et 6 h (moins de 16 ans) | [L3163-1](https://code.travail.gouv.fr/code-du-travail/l3163-1), [L3163-2](https://code.travail.gouv.fr/code-du-travail/l3163-2) | Dérogations exceptionnelles, jamais entre minuit et 4 h (sauf extrême urgence). |
| Forfait en jours | Réservé aux cadres autonomes et aux salariés dont la durée du travail ne peut pas être prédéterminée | [L3121-58](https://code.travail.gouv.fr/code-du-travail/l3121-58) | À défaut de stipulations conventionnelles : document de contrôle du nombre et des dates des journées ou demi-journées travaillées, vérification du respect des repos, entretien annuel ([L3121-65](https://code.travail.gouv.fr/code-du-travail/l3121-65)). |

**Rappel sur la preuve :** l'employeur doit prouver le respect des seuils et plafonds (Cass. soc. 20/02/2013). Le seul dépassement de la durée maximale ouvre droit à réparation (Cass. soc. 26/01/2022). Voir § 1.3.

### 2.3 Conséquences pour le produit (section 2)

- Moteur de **contrôle en continu** avec alertes au salarié, au manager et aux RH avant et après un dépassement : 10 h par jour (ou plafond conventionnel jusqu'à 12 h), 48 h dans la semaine, 44 h (ou 46 h) en moyenne glissante sur 12 semaines, 11 h de repos entre deux journées (plancher conventionnel de 9 h), 35 h de repos hebdomadaire, 6 jours au plus, pause de 20 min dès 6 h.
- **Profils de règles** : adulte, travailleur de nuit (8 h et 40 h), jeune de 16 à 18 ans, jeune de moins de 16 ans, forfait en jours (décompte en jours), cadre dirigeant (hors décompte), astreintes.
- Détection automatique du **travail de nuit** (plage conventionnelle, ou 21 h-6 h par défaut) et suivi du seuil de 270 h sur 12 mois pour la qualification de travailleur de nuit.
- Journal horodaté des alertes et de leur traitement : il aide l'employeur à prouver le respect des plafonds, puisque la charge de cette preuve lui incombe.
- Paramétrage par établissement et par accord : plafonds dérogatoires, pauses conventionnelles, plage de nuit.

---

## 3. Heures supplémentaires et heures complémentaires

### 3.1 Déclenchement et semaine de référence

- **Définition :** toute heure accomplie **au-delà de la durée légale hebdomadaire ou de la durée considérée comme équivalente** est une heure supplémentaire. Elle ouvre droit à une majoration de salaire ou, le cas échéant, à un repos compensateur équivalent ([L3121-28](https://code.travail.gouv.fr/code-du-travail/l3121-28)).
- **Décompte par semaine** ([L3121-29](https://code.travail.gouv.fr/code-du-travail/l3121-29)).
- **Semaine civile (vérifié) :** sauf stipulation contraire d'un accord, **la semaine débute le lundi à 0 heure et se termine le dimanche à 24 heures** ([L3121-35](https://code.travail.gouv.fr/code-du-travail/l3121-35)). Un accord d'entreprise (à défaut de branche) peut retenir une autre période de 7 jours consécutifs ([L3121-32](https://code.travail.gouv.fr/code-du-travail/l3121-32)).
- **Durée collective supérieure à 35 h :** la rémunération mensuelle peut être calculée sur les 52/12 de la durée hebdomadaire, majorations comprises ([L3121-31](https://code.travail.gouv.fr/code-du-travail/l3121-31)).
- **Congés payés et seuil de déclenchement : revirement du 10 septembre 2025.** Cass. soc., 10 sept. 2025, n° 23-14.455 (publié, cassation partielle), rendu au visa de L3121-28, de l'article 7 § 1 de la directive 2003/88, de l'article 31 § 2 de la Charte et de CJUE 13/01/2022, C-514/20 :
  - Pour un salarié soumis à un **décompte hebdomadaire**, il faut écarter partiellement L3121-28 en ce qu'il exige un travail effectif.
  - Ce salarié « peut prétendre au paiement des majorations pour heures supplémentaires qu'il aurait perçues s'il avait travaillé durant toute la semaine ». [Légifrance](https://www.legifrance.gouv.fr/juri/id/JURITEXT000052267314)
  - La méthode de valorisation des heures correspondant aux jours de congé n'est pas détaillée dans l'extrait consulté. L'extension de cette solution à d'autres absences, par exemple les jours fériés chômés, n'a pas été vérifiée. **[Non vérifié]**

### 3.2 Majorations

- **Par accord :** un accord d'entreprise (à défaut de branche) fixe le ou les taux de majoration, qui ne peuvent être **inférieurs à 10 %** ([L3121-33](https://code.travail.gouv.fr/code-du-travail/l3121-33) I 1°, v. 01/01/2020).
- **À défaut d'accord : 25 %** pour chacune des **8 premières** heures supplémentaires, puis **50 %** pour les suivantes ([L3121-36](https://code.travail.gouv.fr/code-du-travail/l3121-36)).
- **Repos compensateur de remplacement (RCR) :** un accord peut remplacer tout ou partie du paiement et des majorations par un repos équivalent ([L3121-33](https://code.travail.gouv.fr/code-du-travail/l3121-33) II). Dans une entreprise sans délégué syndical, l'employeur peut le mettre en place si le CSE, s'il existe, ne s'y oppose pas ([L3121-37](https://code.travail.gouv.fr/code-du-travail/l3121-37)).

### 3.3 Contingent annuel et contrepartie obligatoire en repos (COR)

- **Principe :** les heures supplémentaires s'accomplissent dans un **contingent annuel**, et les heures au-delà ouvrent droit à une **COR**. Seules les heures accomplies au-delà de la durée légale s'imputent sur le contingent. **Ne s'y imputent pas** : les heures compensées par un repos compensateur équivalent et les heures de travaux urgents (L3132-4) ([L3121-30](https://code.travail.gouv.fr/code-du-travail/l3121-30)).
- **Contingent par défaut : 220 heures** par salarié, sauf pour les forfaits annuels en heures ([D3121-24](https://code.travail.gouv.fr/code-du-travail/d3121-24) ; [L3121-39](https://code.travail.gouv.fr/code-du-travail/l3121-39)). Un accord peut en fixer un autre ([L3121-33](https://code.travail.gouv.fr/code-du-travail/l3121-33) I 2°). Le CSE est **informé** des heures accomplies dans le contingent et donne son **avis** sur celles effectuées au-delà (L3121-33 I).
- **COR à défaut d'accord :** **50 %** des heures au-delà du contingent dans les entreprises de **20 salariés au plus**, **100 %** au-delà de 20 salariés ([L3121-38](https://code.travail.gouv.fr/code-du-travail/l3121-38), v. 01/01/2020 ; effectif calculé selon L130-1 CSS).
- **Modalités de la COR :**
  - Le droit est ouvert **dès 7 heures** ; la journée ou demi-journée prise est déduite à hauteur des heures qui auraient été travaillées ; le repos est pris **dans les 2 mois** ([D3121-18](https://code.travail.gouv.fr/code-du-travail/d3121-18)).
  - Prise par journée entière ou demi-journée, au choix du salarié ; assimilée à du travail effectif ; sans perte de rémunération ([D3121-19](https://code.travail.gouv.fr/code-du-travail/d3121-19)).
  - L'absence de demande ne fait pas perdre le droit : l'employeur demande alors au salarié de prendre ses repos dans un délai maximum d'un an ([D3121-17](https://code.travail.gouv.fr/code-du-travail/d3121-17)).
  - Ordre de priorité entre demandes simultanées ([D3121-21](https://code.travail.gouv.fr/code-du-travail/d3121-21)).
  - Indemnité en espèces si le contrat prend fin avant la prise du repos ([D3121-23](https://code.travail.gouv.fr/code-du-travail/d3121-23)).
  - Information du salarié par document annexé au bulletin (D3171-11).

### 3.4 Aménagement du temps de travail sur plus d'une semaine

- Les heures supplémentaires sont décomptées **à l'issue de la période de référence**. Cette période ne peut dépasser **3 ans** par accord et **9 semaines** par décision unilatérale. Pour une période annuelle, le seuil est de **1 607 h** ; sinon, c'est une moyenne de 35 h sur la période ([L3121-41](https://code.travail.gouv.fr/code-du-travail/l3121-41)).
- **Contenu de l'accord :** période de référence (1 an, ou 3 ans si un accord de branche l'autorise), délais de prévenance, traitement des absences, arrivées et départs. L'accord peut prévoir une limite annuelle inférieure à 1 607 h et une limite hebdomadaire haute au-delà de laquelle les heures sont payées le mois même ([L3121-44](https://code.travail.gouv.fr/code-du-travail/l3121-44)).
- **Décision unilatérale à défaut d'accord :** **9 semaines** au plus pour les entreprises de moins de 50 salariés, **4 semaines** pour celles de 50 salariés et plus ([L3121-45](https://code.travail.gouv.fr/code-du-travail/l3121-45)). L'employeur établit un programme indicatif soumis à l'avis du CSE et prévient les salariés **7 jours ouvrés** avant tout changement d'horaire ([D3121-27](https://code.travail.gouv.fr/code-du-travail/d3121-27)).

### 3.5 Temps partiel : heures complémentaires

| Règle | Valeur | Article |
|---|---|---|
| Majoration | Chaque heure complémentaire est majorée | [L3123-8](https://code.travail.gouv.fr/code-du-travail/l3123-8) |
| Plafond absolu | Les heures complémentaires ne peuvent pas porter la durée du travail au niveau de la durée légale, ou de la durée conventionnelle si elle est inférieure | [L3123-9](https://code.travail.gouv.fr/code-du-travail/l3123-9) |
| Limite à défaut d'accord | **1/10** de la durée hebdomadaire ou mensuelle prévue au contrat | [L3123-28](https://code.travail.gouv.fr/code-du-travail/l3123-28) |
| Limite par accord | Jusqu'au **1/3** de la durée contractuelle (accord d'entreprise, ou de branche étendu) | [L3123-20](https://code.travail.gouv.fr/code-du-travail/l3123-20) |
| Taux par accord de branche étendu | **10 % minimum** | [L3123-21](https://code.travail.gouv.fr/code-du-travail/l3123-21) |
| Taux à défaut d'accord | **10 %** jusqu'au 1/10, puis **25 %** entre le 1/10 et le 1/3 | [L3123-29](https://code.travail.gouv.fr/code-du-travail/l3123-29) |
| Requalification de l'horaire | Si, pendant 12 semaines consécutives (ou 12 semaines sur 15, ou la période de l'accord si elle est plus longue), l'horaire moyen réel **dépasse d'au moins 2 h par semaine** l'horaire contractuel, le contrat est modifié (préavis de 7 jours, sauf opposition du salarié) | [L3123-13](https://code.travail.gouv.fr/code-du-travail/l3123-13) |
| Durée minimale à défaut d'accord | **24 h par semaine**, ou l'équivalent mensuel ou sur la période d'aménagement | [L3123-27](https://code.travail.gouv.fr/code-du-travail/l3123-27) |

### 3.6 Volet social et fiscal des heures supplémentaires (utile à la paie)

- **Réduction de cotisations salariales** sur les heures supplémentaires et complémentaires ([L241-17 CSS](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000037947458), v. 01/01/2019).
- **Condition documentaire : [D241-25 CSS](https://www.legifrance.gouv.fr/codes/id/LEGISCTA000026407536/)**, modifié par le **décret n° 2025-318 du 4 avril 2025** (en vigueur le 07/04/2025) :
  - l'employeur tient à disposition les informations de D3171-1 à D3171-15 ;
  - si elles ne sont pas immédiatement accessibles, il les complète **au moins une fois par an et pour chaque salarié** par un **récapitulatif hebdomadaire** des heures supplémentaires ou complémentaires (ou du nombre d'heures si le décompte n'est pas hebdomadaire) ;
  - ce récapitulatif indique **le mois de leur paiement** et les distingue **selon le taux de majoration applicable**.
- **Déduction forfaitaire de cotisations patronales :** [L241-18-1 CSS](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000046982267), version en vigueur au 31/12/2025, modifiée par la **loi n° 2025-1403 du 30 décembre 2025, art. 21**. Elle vise les entreprises « dont l'effectif comprend au moins vingt salariés » et s'applique aux revenus d'activité des périodes d'emploi courant à compter du 01/01/2026. Le montant est fixé par décret. **[Non vérifié]** : la rédaction antérieure (bornage éventuel à 250 salariés) et le montant réglementaire.
- **Exonération d'impôt sur le revenu** des rémunérations d'heures supplémentaires et complémentaires, dans la limite annuelle de **7 500 €** ([art. 81 quater CGI](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000046195916), v. 18/08/2022, loi n° 2022-1157).

### 3.7 Conséquences pour le produit (section 3)

- Moteur d'heures supplémentaires configurable :
  - semaine lundi 0 h-dimanche 24 h par défaut, ou autre période de 7 jours fixée par accord ;
  - seuil de 35 h ou durée d'équivalence ;
  - barème par défaut (25 % sur 8 h, puis 50 %) ou conventionnel (au moins 10 %, par exemple 10/20/50 en HCR) ;
  - bascule en paiement ou en RCR.
- **Intégration des congés payés dans le seuil hebdomadaire** (Cass. 10/09/2025). Valorisation paramétrable (par exemple l'horaire planifié du jour) et traçée **[Analyse]**.
- Compteurs : **contingent annuel** (220 h ou valeur conventionnelle), hors RCR et travaux urgents, avec alertes à l'approche ; **COR** à 50 % ou 100 % selon l'effectif, droit ouvert à 7 h, échéance à 2 mois, relance annuelle, solde de fin de contrat.
- Périodes de référence pluri-hebdomadaires : unilatérales (≤ 9 semaines sous 50 salariés, ≤ 4 semaines au-delà) ou conventionnelles (1 à 3 ans, seuil de 1 607 h, limite haute hebdomadaire), avec régularisation en fin de période et document de fin de période (D3171-13).
- Temps partiel : compteur d'heures complémentaires borné à 1/10 ou 1/3, blocage avant 35 h, taux de 10 % puis 25 %, alerte de requalification (+2 h par semaine en moyenne sur 12 semaines), contrôle de la durée minimale de 24 h.
- Export annuel **conforme à D241-25** : semaine par semaine, heures supplémentaires et complémentaires par taux, avec leur mois de paiement.

---

## 4. Jours fériés et congés payés

### 4.1 Jours fériés

- **Liste légale (11 jours)** ([L3133-1](https://code.travail.gouv.fr/code-du-travail/l3133-1), v. 10/08/2016, inchangée au 23/09/2026) : 1er janvier, lundi de Pâques, 1er mai, 8 mai, Ascension, lundi de Pentecôte, 14 juillet, Assomption, Toussaint, 11 novembre, Noël.
- **1er mai :**
  - **férié et chômé** ([L3133-4](https://code.travail.gouv.fr/code-du-travail/l3133-4)) ;
  - son chômage ne réduit pas le salaire, et les salariés payés à l'heure, à la journée ou au rendement perçoivent une indemnité égale au salaire perdu ([L3133-5](https://code.travail.gouv.fr/code-du-travail/l3133-5)) ;
  - dans les établissements qui ne peuvent pas interrompre le travail, le salarié occupé ce jour-là perçoit, **en plus** de son salaire, une indemnité **égale à ce salaire** ([L3133-6](https://code.travail.gouv.fr/code-du-travail/l3133-6)).
- **Autres jours fériés :** seul le 1er mai est obligatoirement chômé ; les autres le sont selon l'accord ou l'usage ([service-public, F2405](https://www.service-public.gouv.fr/particuliers/vosdroits/F2405), « Vérifié le 01 janvier 2026 »). Le chômage d'un jour férié n'entraîne **aucune perte de salaire** pour les salariés qui ont **au moins 3 mois d'ancienneté**. Cette règle ne vise ni les travailleurs à domicile, ni les intermittents, ni les salariés temporaires ([L3133-3](https://code.travail.gouv.fr/code-du-travail/l3133-3)).
- **Alsace-Moselle (Moselle, Bas-Rhin, Haut-Rhin, avec exclusions de professions)** ([L3134-1](https://code.travail.gouv.fr/code-du-travail/l3134-1)) : liste de jours **chômés** élargie au **Vendredi saint** « dans les communes ayant un temple protestant ou une église mixte » et aux **premier et second jours de Noël (26 décembre)** ([L3134-13](https://code.travail.gouv.fr/code-du-travail/l3134-13)).
- **Outre-mer : commémoration de l'abolition de l'esclavage** ([service-public, F2405](https://www.service-public.gouv.fr/particuliers/vosdroits/F2405)) :

  | Territoire | Date |
  |---|---|
  | Mayotte | 27 avril |
  | Martinique | 22 mai |
  | Guadeloupe | 27 mai |
  | Saint-Martin | 27 mai |
  | Guyane | 10 juin |
  | Saint-Barthélemy | 9 octobre |
  | La Réunion | 20 décembre |
- **Journée de solidarité :** journée de travail supplémentaire non rémunérée ([L3133-7](https://code.travail.gouv.fr/code-du-travail/l3133-7)), dans la limite de **7 heures**, proratisée pour les temps partiels, et d'une journée pour les forfaits en jours ([L3133-8](https://code.travail.gouv.fr/code-du-travail/l3133-8)).
- **Évolutions récentes :**
  - Le projet de suppression de deux jours fériés (été 2025) a été **retiré** par le Premier ministre à la mi-septembre 2025 ([franceinfo, article du 14/09/2025](https://www.franceinfo.fr/economie/budget/budget-sebastien-lecornu-renonce-a-la-suppression-de-deux-jours-feries_7491502.html), source de presse). L3133-1 est inchangé.
  - **Projet de loi** « de sécurisation du travail le 1er mai des salariés volontaires des boulangers-pâtissiers artisanaux et des artisans fleuristes grâce au dialogue social de branche » : déposé le 29/04/2026, adopté par le Sénat en 1re lecture le 16/06/2026, **en cours de 1re lecture à l'Assemblée nationale** (page mise à jour le 22/09/2026) ([Sénat, dossier pjl25-588](https://www.senat.fr/dossier-legislatif/pjl25-588.html)). **Il n'est pas en vigueur.**

### 4.2 Congés payés : acquisition

- **2,5 jours ouvrables par mois** de travail effectif chez le même employeur, dans la limite de **30 jours ouvrables** ([L3141-3](https://code.travail.gouv.fr/code-du-travail/l3141-3)).
- Sont **assimilées à un mois** les périodes de 4 semaines ou de 24 jours de travail ([L3141-4](https://code.travail.gouv.fr/code-du-travail/l3141-4)). Un résultat non entier est **arrondi au nombre entier supérieur** ([L3141-7](https://code.travail.gouv.fr/code-du-travail/l3141-7)).
- **Périodes assimilées à du travail effectif** ([L3141-5](https://code.travail.gouv.fr/code-du-travail/l3141-5) ; version en vigueur **depuis le 24/12/2025**, modifiée par la **loi n° 2025-1249 du 22/12/2025, art. 41**, lue sur [Légifrance](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033020810/)) :
  1. congés payés ;
  2. maternité, paternité et accueil de l'enfant, adoption ;
  3. contreparties obligatoires en repos ;
  4. jours de repos d'un accord L3121-44 ;
  5. accident du travail et maladie professionnelle (aucune limite de durée dans la version en vigueur) ;
  6. service national ;
  7. **arrêt pour accident ou maladie non professionnels** (loi n° 2024-364) ;
  8. **suspension pour exercice d'un mandat électif local**, dans les limites de L3142-88 (**nouveauté de décembre 2025**).
- **Maladie non professionnelle :** **2 jours ouvrables par mois**, dans la limite de **24 jours ouvrables** par période de référence ([L3141-5-1](https://code.travail.gouv.fr/code-du-travail/l3141-5-1), v. 24/04/2024).
- **Période de référence :** fixée par accord ([L3141-10](https://code.travail.gouv.fr/code-du-travail/l3141-10)) ; à défaut, elle commence le **1er juin**, ou le **1er avril** pour les professions affiliées à une caisse de congés comme le BTP ([R3141-4](https://code.travail.gouv.fr/code-du-travail/r3141-4)). Un accord peut aussi majorer la durée du congé selon l'âge, l'ancienneté ou le handicap (L3141-10).

### 4.3 Congés payés : prise

- Les congés **peuvent être pris dès l'embauche** ([L3141-12](https://code.travail.gouv.fr/code-du-travail/l3141-12)), dans une période qui comprend dans tous les cas **le 1er mai-31 octobre** ([L3141-13](https://code.travail.gouv.fr/code-du-travail/l3141-13)).
- **À défaut d'accord**, l'employeur fixe la période de prise et l'ordre des départs, après avis du CSE, selon des critères légaux (situation de famille, ancienneté, activité chez d'autres employeurs). Il ne peut modifier l'ordre et les dates **moins d'un mois** avant le départ, sauf circonstances exceptionnelles ([L3141-16](https://code.travail.gouv.fr/code-du-travail/l3141-16)).
- La période de prise est communiquée **au moins 2 mois** avant son ouverture ([D3141-5](https://code.travail.gouv.fr/code-du-travail/d3141-5)) ; l'ordre des départs, **un mois** avant le départ ([D3141-6](https://code.travail.gouv.fr/code-du-travail/d3141-6)).
- **24 jours ouvrables au plus** d'un seul tenant, sauf dérogation individuelle (contraintes géographiques, personne handicapée ou âgée au foyer) ([L3141-17](https://code.travail.gouv.fr/code-du-travail/l3141-17)).
- **Fractionnement à défaut d'accord :** une fraction continue d'au moins **12 jours ouvrables** entre le 1er mai et le 31 octobre ; **2 jours supplémentaires** si au moins 6 jours sont pris hors de cette période, **1 jour** pour 3 à 5 jours. Le salarié peut y renoncer par accord individuel ([L3141-23](https://code.travail.gouv.fr/code-du-travail/l3141-23)).
- **Indemnité :**
  - 1/10 de la rémunération brute de la période de référence, en y intégrant les périodes du 7° de L3141-5 (maladie non professionnelle) à hauteur de **80 %** de la rémunération correspondante ;
  - **elle ne peut être inférieure au maintien de salaire** ([L3141-24](https://code.travail.gouv.fr/code-du-travail/l3141-24), v. 24/04/2024).

### 4.4 Jours ouvrables et jours ouvrés

- **Jours ouvrables :** tous les jours de la semaine, sauf le jour de repos hebdomadaire (généralement le dimanche) et les jours fériés. **Jours ouvrés :** jours effectivement travaillés dans l'entreprise, en général 5 par semaine. **5 semaines = 30 jours ouvrables** ([service-public, F2258](https://www.service-public.gouv.fr/particuliers/vosdroits/F2258), « Vérifié le 30 avril 2026 »).
- [Analyse] Pour une semaine de 5 jours, cela représente 25 jours ouvrés. Le Code du travail raisonne en jours ouvrables (L3141-3). Le décompte en jours ouvrés est une convention d'entreprise qui ne doit pas être moins favorable ; cette règle n'a pas été vérifiée sur une source primaire **[Non vérifié]**.

### 4.5 Loi n° 2024-364 du 22 avril 2024 (art. 37) : ce qui change pour un logiciel d'absences

**Source :** [Légifrance, art. 37](https://www.legifrance.gouv.fr/jorf/article_jo/JORFARTI000049453299) (JO du 23/04/2024). Articles modifiés ou créés : L1251-19, L3141-5, **L3141-5-1**, **L3141-19-1 à L3141-19-3**, L3141-20, **L3141-21-1**, L3141-22, L3141-24. Entrée en vigueur au **24/04/2024**, d'après les versions datées du Code du travail numérique et [entreprendre.service-public (A17308)](https://entreprendre.service-public.gouv.fr/actualites/A17308).

| Point | Règle | Article |
|---|---|---|
| Acquisition pendant la maladie non professionnelle | 2 jours ouvrables par mois, plafond de 24 par période | [L3141-5](https://code.travail.gouv.fr/code-du-travail/l3141-5) 7° ; [L3141-5-1](https://code.travail.gouv.fr/code-du-travail/l3141-5-1) |
| Report | Congés impossibles à prendre pour cause de maladie ou d'accident : **période de report de 15 mois**, qui court **à partir de la date où le salarié reçoit l'information** de L3141-19-3 | [L3141-19-1](https://code.travail.gouv.fr/code-du-travail/l3141-19-1) |
| Arrêt long | Congés acquis pendant un arrêt (5° ou 7°) : si le contrat est suspendu **depuis au moins un an** à la fin de la période d'acquisition, le report court **dès la fin de cette période**. À la reprise, le report, s'il n'a pas expiré, est suspendu jusqu'à l'information | [L3141-19-2](https://code.travail.gouv.fr/code-du-travail/l3141-19-2) |
| **Obligation d'information** | **Dans le mois qui suit la reprise**, par tout moyen conférant **date certaine** (notamment le bulletin de paie) : (1) le nombre de jours de congé disponibles ; (2) la date limite pour les prendre | [L3141-19-3](https://code.travail.gouv.fr/code-du-travail/l3141-19-3) |
| Report conventionnel | Un accord peut fixer une période de report **plus longue** | [L3141-21-1](https://code.travail.gouv.fr/code-du-travail/l3141-21-1) |
| Indemnité | Périodes de maladie non professionnelle retenues à 80 % dans l'assiette du dixième | [L3141-24](https://code.travail.gouv.fr/code-du-travail/l3141-24) |
| Rétroactivité (art. 37 II) | Application du **1er décembre 2009** à l'entrée en vigueur de la loi, sous réserve des décisions définitives et des stipulations plus favorables. Les congés supplémentaires ne peuvent porter le total au-delà de **24 jours ouvrables** par période. Les actions doivent être introduites, **à peine de forclusion, dans les 2 ans** suivant l'entrée en vigueur | Nota de [L3141-5-1](https://code.travail.gouv.fr/code-du-travail/l3141-5-1) ; [art. 37](https://www.legifrance.gouv.fr/jorf/article_jo/JORFARTI000049453299) |
| Délais pour agir (lecture administrative) | Salariés en poste : 2 ans ; salariés partis : 3 ans (prescription des salaires) | [entreprendre.service-public A17308](https://entreprendre.service-public.gouv.fr/actualites/A17308) ; [L3245-1](https://code.travail.gouv.fr/code-du-travail/l3245-1) |

[Analyse] Comptée à partir du 24/04/2024, la forclusion de deux ans a pris fin **vers le 24/04/2026**. La date exacte de computation n'a pas été vérifiée.

**Jurisprudence liée :**
- **Cass. soc., 13 sept. 2023, n° 22-17.340 (publié) :** droit aux congés payés au titre d'un arrêt maladie non professionnel. C'est l'origine de la réforme. [Légifrance](https://www.legifrance.gouv.fr/juri/id/JURITEXT000048085897)
- **Cass. soc., 10 sept. 2025, n° 23-22.732 (publié), revirement :** le salarié en arrêt maladie pendant ses congés payés « a le droit de bénéficier ultérieurement des jours de congé payé coïncidant avec la période d'arrêt ». Condition : que l'arrêt ait été **notifié à l'employeur**. [Légifrance](https://www.legifrance.gouv.fr/juri/id/JURITEXT000052267316)
- **Cass. soc., 10 sept. 2025, n° 23-14.455 :** les congés payés comptent dans le seuil de déclenchement des heures supplémentaires en cas de décompte hebdomadaire (voir § 3.1).

### 4.6 Conséquences pour le produit (section 4)

- **Calendrier des jours fériés par établissement** : 11 jours nationaux ; Alsace-Moselle avec le 26/12 et le Vendredi saint selon la commune ; dates d'outre-mer. Chaque jour est marqué chômé ou travaillé selon l'accord ou l'usage, le **1er mai** est verrouillé comme chômé (travail possible avec indemnité égale au salaire lorsque l'activité ne peut s'interrompre), la journée de solidarité est paramétrable (7 h, proratisée).
- **Compteurs de congés par période d'acquisition** : taux de 2,5 ou 2 jours selon le motif de l'absence, plafond de 24 jours pour la maladie non professionnelle, nouveau motif « mandat électif local », arrondi supérieur, début de période paramétrable (1er juin ou 1er avril pour les caisses), gestion en jours ouvrables ou ouvrés.
- **Date d'expiration par lot de congés** (report de 15 mois ou durée conventionnelle), avec le cas de l'arrêt d'au moins un an.
- **Notification automatique à la reprise après un arrêt** : solde et date limite, envoyée dans le mois qui suit, avec preuve de date certaine (accusé de réception horodaté, ou mention sur le bulletin de paie via l'export).
- **Maladie survenant pendant les congés** : recrédit des jours de congé couverts par un arrêt notifié.
- **Planification** : publication de la période de prise au moins 2 mois avant, ordre des départs communiqué 1 mois avant, blocage des modifications à moins d'un mois (sauf motif tracé), contrôle du maximum de 24 jours consécutifs et de la fraction de 12 jours en été, calcul des jours de fractionnement.
- **Transmission à la paie** : dates de congé, motifs et périodes d'absence (notamment la maladie non professionnelle, retenue à 80 % dans l'assiette du dixième).

---

## 5. RGPD et CNIL appliqués au pointage

### 5.1 Rôles des parties

- **Client employeur :** responsable du traitement. **WorkHoraire :** **sous-traitant** au sens de l'article 28 du RGPD pour les données de pointage de ses clients. Le référentiel CNIL de 2019 rappelle qu'un contrat doit encadrer le recours à un sous-traitant ([référentiel « gestion du personnel », § 6 et § 10](https://www.cnil.fr/sites/default/files/atoms/files/referentiel_grh_novembre_2019_0.pdf)).
- **Risque de requalification :** un sous-traitant qui détermine lui-même les finalités et les moyens d'un traitement en devient responsable (art. 28 § 10 RGPD, [texte sur cnil.fr, chapitre IV](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre4)). C'est le cas par exemple d'une réutilisation des pointages clients pour des statistiques propres à l'éditeur ou pour entraîner un modèle d'IA.

### 5.2 Base légale

- **RGPD, article 6 § 1** : b) exécution du contrat, c) obligation légale, f) intérêt légitime ([texte sur cnil.fr, chapitre II](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2)).
- **Référentiel CNIL « gestion du personnel »** ([délibération n° 2019-160 du 21/11/2019](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000041798580), JO du 15/04/2020 ; [PDF CNIL](https://www.cnil.fr/sites/default/files/atoms/files/referentiel_grh_novembre_2019_0.pdf)) :
  - bases les plus fréquentes en RH : obligation légale, contrat, intérêt légitime, mission d'intérêt public ;
  - le **consentement** n'est mobilisable qu'exceptionnellement, en raison du lien de subordination (§ 4) ;
  - **attention :** le référentiel exclut de son champ les traitements ayant pour objet ou pour effet le **contrôle individuel de l'activité des salariés** (§ 2).
- **Fiche CNIL** « [L'accès aux locaux et le contrôle des horaires sur le lieu de travail](https://www.cnil.fr/fr/lacces-aux-locaux-et-le-controle-des-horaires-sur-le-lieu-de-travail) » (mise à jour le **17/06/2026**) : la base légale à indiquer aux salariés est par exemple une obligation issue du Code du travail ou l'intérêt légitime de l'employeur.
- [Analyse] Pour le pointage : **obligation légale** (L3171-2, D3171-8, L3171-3, D3171-16) pour le décompte des salariés hors horaire collectif ; **exécution du contrat** pour la paie ; **intérêt légitime** pour les usages non imposés (planning, décompte des salariés sous horaire collectif). Pas de consentement.

### 5.3 Principes et proportionnalité

- **Proportionnalité :** nul ne peut restreindre les droits et libertés par des mesures qui ne seraient ni justifiées par la nature de la tâche ni proportionnées au but recherché ([L1121-1](https://code.travail.gouv.fr/code-du-travail/l1121-1)).
- **Minimisation** (art. 5 § 1 c RGPD) et **limitation de la conservation** (art. 5 § 1 e) ([cnil.fr, chapitre II](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2)).
- **Fiche CNIL (17/06/2026) :**
  - le dispositif doit être proportionné et non excessif ;
  - il **ne doit pas servir au contrôle des déplacements à l'intérieur des locaux** ;
  - il ne doit pas être détourné de sa finalité ;
  - l'accès aux données est réservé aux personnes **habilitées** (services RH et sécurité notamment).

### 5.4 Information préalable des salariés

- **[L1222-4](https://code.travail.gouv.fr/code-du-travail/l1222-4) :** aucune information concernant personnellement un salarié ne peut être collectée par un dispositif qui n'a pas été **porté préalablement à sa connaissance**.
- **Article 13 RGPD** ([cnil.fr, chapitre III](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre3)). Informations à donner :
  - identité du responsable et coordonnées du DPO ;
  - finalités et base légale, et intérêts légitimes le cas échéant ;
  - destinataires et transferts hors UE ;
  - **durée de conservation** ou critères utilisés ;
  - droits d'accès, de rectification, d'effacement, de limitation et d'opposition, droit de réclamation auprès de la CNIL ;
  - caractère obligatoire ou non de la fourniture des données ;
  - existence d'une décision automatisée.
- **Référentiel 2019 (§ 8) :** l'information écrite est à privilégier, pour pouvoir prouver son contenu et sa date.

### 5.5 Consultation des représentants du personnel

- **Entreprises d'au moins 50 salariés :** [L2312-38](https://code.travail.gouv.fr/code-du-travail/l2312-38) figure dans la section « Attributions du CSE dans les entreprises d'au moins cinquante salariés » (L2312-8 à L2312-84 ; [Légifrance](https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072050/LEGISCTA000035609482/)) :
  - al. 2 : le CSE est **informé**, avant leur introduction, sur les **traitements automatisés de gestion du personnel** et sur leurs modifications ;
  - al. 3 : le CSE est **informé et consulté, avant la décision de mise en œuvre**, sur les **moyens ou techniques permettant un contrôle de l'activité des salariés**.

  S'y ajoute la consultation générale sur la durée du travail et l'introduction de nouvelles technologies ([L2312-8](https://code.travail.gouv.fr/code-du-travail/l2312-8) II 3° et 4°). Seuil : 50 salariés ([L2312-1](https://code.travail.gouv.fr/code-du-travail/l2312-1)). Les modalités de calcul de l'effectif n'ont pas été vérifiées.
- **Entreprises de 11 à 49 salariés :** pas de consultation au titre de L2312-38. La délégation du personnel présente les réclamations sur l'application du Code du travail, notamment la durée du travail ([L2312-5](https://code.travail.gouv.fr/code-du-travail/l2312-5)). La fiche CNIL recommande que les instances représentatives soient **informées ou consultées avant toute décision**.
- **Dans tous les cas :** le CSE peut consulter les documents de décompte ([L3171-2](https://code.travail.gouv.fr/code-du-travail/l3171-2) al. 2).

### 5.6 Durées de conservation

**a) Référentiel CNIL « Les durées de conservation des données à caractère personnel : gestion des ressources humaines »**, publié le **02/04/2026** et mis à jour le **20/05/2026** ([PDF](https://www.cnil.fr/sites/default/files/2026-04/referentiel_durees_de_conservation_gestion_des_ressources_humaines.pdf) ; [présentation](https://www.cnil.fr/fr/referentiel-durees-conservation-donnees-rh)). La CNIL le présente comme du « droit souple » : son respect n'est pas obligatoire, mais il distingue les durées imposées par les textes des durées qu'elle recommande.

| Finalité (référentiel 2026) | Base active | Archivage intermédiaire | Fondement cité | Nature |
|---|---|---|---|---|
| **Suivi du temps de travail** (contrôle et établissement de la durée du travail) : document récapitulant les heures du mois et leur compensation | **De la collecte jusqu'à l'émission du bulletin de paie** de la période | Pour contester le temps de travail : **1 an**, ou la durée de la période de référence si l'aménagement dépasse l'année ; **3 ans** pour les salariés en forfait | D3171-16 ; L3245-1 | Obligation |
| **Contrôle d'accès sans biométrie** : données d'identification | Durée de l'habilitation | Sans objet. **Si les données servent au suivi du temps de travail : jusqu'à 5 ans** | Fiche CNIL accès et horaires | Recommandation |
| Contrôle d'accès sans biométrie : **journaux d'accès** | **3 mois** après leur enregistrement | Idem | Idem | Recommandation |
| Contrôle d'accès biométrique : journaux | 6 mois glissants | Seulement en cas d'obligation ou pour la preuve d'un contentieux, dans la limite de la prescription | Règlement type biométrie | Obligation |
| Bulletins de paie (mise à disposition) | 1 mois après transmission | **5 ans** ; en version électronique, disponibilité **50 ans** ou jusqu'à l'âge de la retraite + 6 ans ; action en paiement des salaires : 3 ans | L3243-4 ; D3243-8 | Obligation |
| Éléments de calcul de l'assiette des cotisations | 1 mois au plus | **6 ans** | L243-16 CSS | Obligation |
| Tachygraphes | Jusqu'à la gestion de la paie | 1 an après utilisation (1 an ou la période de référence en cas d'aménagement ; 3 ans pour les forfaits) | Règlement (UE) n° 165/2014 ; D3171-16 | Obligation |
| Géolocalisation de véhicules : optimisation des tournées | **2 mois** | 1 an | Fiche CNIL géolocalisation | Recommandation |
| Géolocalisation de véhicules : facturation | Jusqu'à la facturation | 1 an comme preuve d'intervention, à défaut d'autre moyen | Idem | Recommandation |

Le référentiel impose une **séparation**, physique ou logique (restriction des habilitations), entre la base active et l'archivage intermédiaire.

**b) Fiche CNIL « accès aux locaux et contrôle des horaires » (17/06/2026) :**
- données de journalisation des accès supprimées **3 mois** après leur enregistrement ;
- données d'identification et de journalisation utilisées **pour le suivi du temps de travail** conservables **en archivage intermédiaire jusqu'à 5 ans**.

**c) Référentiel « gestion du personnel » de 2019 :** son tableau de durées (§ 7) couvre la paie, le registre unique du personnel et les mandats des représentants. Il ne contient **pas de ligne propre aux données de pointage ou de badgeuse** ; celles-ci figurent dans les deux documents précédents.

**d) Autres durées utiles :**
- prescription des salaires : **3 ans** ([L3245-1](https://code.travail.gouv.fr/code-du-travail/l3245-1)) ;
- livret individuel de contrôle dans les transports routiers : **3 ans** (arrêté du 06/03/2025, voir § 7.3).

[Analyse] **Politique par défaut possible pour WorkHoraire, à faire valider :**
- base active jusqu'à la clôture de la paie et la fin de la fenêtre de correction ;
- archivage intermédiaire séparé et à accès restreint d'au moins **1 an** (3 ans pour les forfaits en jours) ;
- durée d'archivage configurable, avec **3 ans** par défaut pour couvrir la prescription salariale et **5 ans au maximum** ;
- purge automatique en fin de durée ;
- journaux techniques d'accès limités à 3 mois.

### 5.7 Biométrie

- **RGPD, art. 9 :** traitement de données biométriques aux fins d'identifier une personne de manière unique interdit par principe ; exception en droit du travail si le droit l'autorise (9 § 2 b) ; les États peuvent ajouter des conditions (9 § 4) ([cnil.fr, chapitre II](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2)).
- **Position de la CNIL (fiche du 17/06/2026) :** « l'installation de dispositifs de contrôle des horaires par des dispositifs biométriques (badge, reconnaissance faciale, etc.), ou qui intègreraient une prise de photographie systématique à chaque pointage apparaît excessive et serait contraire au principe de minimisation » ([fiche](https://www.cnil.fr/fr/lacces-aux-locaux-et-le-controle-des-horaires-sur-le-lieu-de-travail)).
- **Règlement type (délibération n° 2019-001 du 10/01/2019)**, JO du 28/03/2019, **contraignant** ([Légifrance JORF](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000038277620) ; [Légifrance CNIL](https://www.legifrance.gouv.fr/cnil/id/CNILTEXT000044189179/)) :
  - **art. 2 :** il n'admet que le contrôle d'accès aux **locaux** limitativement identifiés comme devant faire l'objet d'une restriction de circulation, et aux **appareils et applications** professionnels limitativement identifiés ;
  - **art. 3 :** l'employeur doit justifier la nécessité de la biométrie ;
  - **art. 11 :** une AIPD est obligatoire avant la mise en œuvre.

  Une recherche des termes « horaires », « temps de travail », « présence » et « pointage » dans le texte ne renvoie que des « plages horaires » d'accès. [Analyse] Le **contrôle des horaires n'entre pas dans les finalités admises** par le règlement type. Voir aussi les pages CNIL [biométrie au travail](https://www.cnil.fr/fr/les-dispositifs-de-biometrie-sur-le-lieu-de-travail) et [Q/R contrôle d'accès biométrique](https://www.cnil.fr/fr/cnil-direct/question/controle-dacces-biometrique-sur-les-lieux-de-travail-quelles-conditions).
- **Précédent (ancien, antérieur au RGPD) :** en 2018, la CNIL a infligé une amende de 10 000 € à une société notamment pour une pointeuse à empreintes digitales utilisée pour les horaires ([Next, 21/09/2018](https://next.ink/7500/107066-dans-sanction-cnil-rappelle-sensibilite-biometrie-au-travail/), source de presse ; décision primaire non consultée).

### 5.8 Géolocalisation

- **CE, 15 décembre 2017, n° 403776, Société Odeolis (publié au Lebon) :** « L'utilisation par un employeur d'un système de géolocalisation pour assurer le contrôle de la durée du travail de ses salariés n'est licite que lorsque ce contrôle ne peut pas être fait par un autre moyen, fût-il moins efficace que la géolocalisation ». Le Conseil d'État rejette la requête contre la mise en demeure de la CNIL, car l'entreprise disposait d'autres moyens, notamment déclaratifs. [Légifrance](https://www.legifrance.gouv.fr/ceta/id/CETATEXT000036233170/)
- **Cass. soc., 18 mars 2026, n° 24-18.976 (publié) :** même principe, appliqué pour admettre un dispositif très encadré (voir § 1.4). [Légifrance](https://www.legifrance.gouv.fr/juri/id/JURITEXT000053765290)
- **Fiche CNIL « La géolocalisation des véhicules des salariés »** (mise à jour le 30/05/2023) ([cnil.fr](https://www.cnil.fr/fr/la-geolocalisation-des-vehicules-des-salaries)) :
  - suivi du temps de travail admis seulement « accessoirement », « lorsque cela ne peut être réalisé par un autre moyen » ;
  - interdits : contrôler un employé en permanence, suivre des salariés qui disposent d'une liberté d'organisation, collecter les trajets domicile-travail et les pauses, calculer le temps de travail **si un autre outil existe**, suivre les représentants du personnel dans l'exercice de leur mandat ;
  - le salarié doit pouvoir **désactiver** la collecte ou la transmission en dehors du temps de travail ;
  - conservation : **2 mois** en principe, **1 an** pour l'optimisation des tournées ou la preuve des interventions, **5 ans** pour le suivi du temps de travail ;
  - les salariés et le CSE sont informés avant l'installation.
- **AIPD :** la liste CNIL des traitements soumis à AIPD vise les « traitements de données de localisation à large échelle », avec comme exemple une **« application mobile permettant de collecter les données de géolocalisation des utilisateurs »** (voir § 5.10).
- [Analyse] **Pour une application de pointage sur smartphone :**
  - le pointage lui-même est « un autre moyen » de mesurer le temps : utiliser la géolocalisation pour **calculer** le temps de travail sera en principe excessif ;
  - si un client veut vérifier le **lieu** du pointage (présence sur un chantier, par exemple), la collecte doit rester **ponctuelle** (au seul moment du pointage, jamais en continu ni hors temps de travail), justifiée et documentée par le client, précédée de l'information des salariés, de la consultation du CSE et d'une AIPD, avec une conservation courte ;
  - la CNIL n'a **pas** de position spécifique connue sur la géolocalisation ponctuelle au pointage **[Non vérifié]**.

### 5.9 Surveillance de l'activité : sanctions CNIL récentes

| Décision | Faits reprochés et solution | Enseignement produit |
|---|---|---|
| **CNIL, SAN-2023-021 du 27/12/2023, Amazon France Logistique** : amende de 32 M€ ([Légifrance, délibération aujourd'hui pseudonymisée en « société X »](https://www.legifrance.gouv.fr/cnil/id/CNILTEXT000048989272)). **CE, 23/12/2025, n° 492830** : amende **ramenée à 15 M€** ([Légifrance](https://www.legifrance.gouv.fr/ceta/id/CETATEXT000053163189)) | Le CE juge licites, sur le fondement de l'intérêt légitime (art. 6 § 1 f), trois indicateurs issus des scanners (« stow machine gun », « idle time » au-delà de 10 min, temps de latence autour des pauses). Il **confirme** plusieurs manquements : conservation indifférenciée de toutes les données pendant 31 jours jugée disproportionnée (minimisation), défaut d'information des intérimaires et sur la vidéosurveillance, sécurité insuffisante de l'accès au logiciel de vidéosurveillance. L'URL CNIL consultée pour cette sanction renvoie « Cet article n'est plus disponible » ; je n'ai pas vérifié qu'il s'agissait bien de la page d'origine. | Durées de conservation **différenciées par finalité** ; information complète de toutes les catégories de travailleurs, intérimaires compris ; sécurité des accès. Les indicateurs d'activité restent à haut risque. |
| **CNIL, SAN-2024-021 du 19/12/2024**, publiée le 04/02/2025 : **40 000 €**, entreprise du secteur immobilier ([cnil.fr](https://www.cnil.fr/fr/surveillance-excessive-des-salaries-sanction-de-40-000-euros-entreprise-secteur-immobilier)) | Logiciel qui mesure « l'inactivité » (3 à 15 min sans clavier ni souris), **captures d'écran** régulières, retenues sur salaire possibles, vidéosurveillance permanente avec **son**. Manquements aux articles 5 § 1 c, 6, 12-13, 32 (compte administrateur partagé sans traçabilité) et 35 (pas d'AIPD). La CNIL rappelle que des périodes sans usage de l'ordinateur peuvent correspondre à du travail effectif. | **Ne jamais** intégrer de mesure d'inactivité, de captures d'écran ou d'enregistrement de frappe ; comptes administrateurs nominatifs et journalisés. |
| **CNIL, sanction du 04/09/2025** (procédure simplifiée) : **7 000 €**, éditeur de logiciel d'aide au recrutement, **en qualité de sous-traitant** ([liste des sanctions CNIL](https://www.cnil.fr/fr/les-sanctions-prononcees-par-la-cnil), page mise à jour le 14/04/2026) | Encadrement insuffisant de la relation avec le responsable (art. 28), registre des activités de traitement, sécurité (art. 32), défaut de documentation d'une violation de données. | Un éditeur SaaS RH est directement sanctionnable : contrat conforme à l'art. 28, registre du sous-traitant, sécurité, registre des violations. |

La même liste recense d'autres sanctions de 2024-2025 liées à la vidéosurveillance ou aux enregistrements téléphoniques de salariés (par exemple 16/01/2025 : 10 000 € ; 18/09/2025 : 100 000 €, grand magasin, vidéosurveillance). Je n'ai relevé aucune sanction de 2026 portant spécifiquement sur la surveillance des salariés dans la version consultée.

### 5.10 Analyse d'impact (AIPD)

- **Traitements dispensés d'AIPD** ([délibération n° 2019-118 du 12/09/2019](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000039248939)) :
  - les « traitements mis en œuvre aux seules fins de gestion des contrôles d'accès physiques et des **horaires pour le calcul du temps de travail**, en dehors de tout dispositif biométrique », à l'exclusion des données sensibles ou hautement personnelles ;
  - la gestion RH des organismes de **moins de 250 personnes**, sans profilage. Le référentiel de 2019 (§ 11) cite en exemple « le contrôle du temps de travail (sans dispositif biométrique, sans données sensibles ou à caractère hautement personnel) ».
- **Traitements soumis à AIPD obligatoire** ([délibération n° 2018-327 du 11/10/2018](https://www.legifrance.gouv.fr/cnil/id/CNILTEXT000037560659/) ; [liste avec exemples, PDF CNIL](https://www.cnil.fr/sites/cnil/files/atoms/files/liste-traitements-aipd-requise.pdf) ; [page CNIL](https://www.cnil.fr/fr/analyse-dimpact-relative-la-protection-des-donnees-publication-dune-liste-des-traitements-pour)) :
  - « surveiller de manière constante l'activité des employés » (exemples : prévention des fuites de données, vidéosurveillance d'employés manipulant de l'argent, **chronotachygraphe**) ;
  - « données de localisation à large échelle » (exemple : application mobile de géolocalisation) ;
  - données biométriques de personnes vulnérables ;
  - profilage RH.
- **Règle des critères du CEPD :** une AIPD est obligatoire dès que **2 des 9 critères** sont réunis. Les employés peuvent être considérés comme **personnes vulnérables** ([référentiel 2019, § 11](https://www.cnil.fr/sites/default/files/atoms/files/referentiel_grh_novembre_2019_0.pdf)).
- [Analyse] Le **pointage WorkHoraire de base** (sans biométrie, sans géolocalisation, sans suivi d'activité) relève a priori de la dispense. **L'activation de la géolocalisation** ou de tout suivi continu fait basculer vers l'AIPD, puisque la vulnérabilité des salariés et la surveillance systématique font déjà 2 critères. Le sous-traitant doit **aider** le client à réaliser son AIPD (art. 28 § 3 f).

### 5.11 Droits des salariés, dont le droit d'accès

- **Art. 15 RGPD :** droit d'obtenir une **copie** des données. **Art. 12 § 3 :** réponse sous **1 mois**, prolongeable de 2 mois ([cnil.fr, chapitre III](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre3)). Le droit d'accès s'applique expressément aux documents de décompte ([D3171-14](https://code.travail.gouv.fr/code-du-travail/d3171-14)).
- **Page CNIL [droit d'accès des salariés](https://www.cnil.fr/fr/le-droit-dacces-des-salaries-leurs-donnees-et-aux-courriels-professionnels)** (05/01/2022, mise à jour le 31/01/2025) : accès gratuit, communication dans un format compréhensible, limites tenant aux droits des tiers (occultation d'abord, refus motivé ensuite).
- **Référentiel 2019 (§ 9) :** le droit d'opposition ne s'applique pas aux traitements fondés sur une obligation légale ou sur le contrat. Il s'exerce en revanche contre ceux fondés sur l'intérêt légitime, pour des raisons tenant à la situation particulière de la personne. Le droit à la portabilité vise les données fournies sur la base du consentement ou du contrat.

### 5.12 Sous-traitance (art. 28 RGPD) : obligations de WorkHoraire envers ses clients

Source : [RGPD, chapitre IV, sur cnil.fr](https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre4) (paraphrase fidèle).
- **Art. 28 § 1 :** le client ne fait appel qu'à un sous-traitant présentant des **garanties suffisantes**.
- **Art. 28 § 2 :** pas de sous-traitant ultérieur (hébergeur, envoi d'e-mails, support…) sans **autorisation écrite préalable**, spécifique ou générale. En cas d'autorisation générale, le client est **informé des changements** et peut s'y **opposer**.
- **Art. 28 § 3 :** contrat écrit (§ 9) qui précise l'objet, la durée, la nature et la finalité du traitement, les types de données et les catégories de personnes. Le sous-traitant s'engage à :
  - (a) ne traiter les données que sur **instruction documentée**, y compris pour les transferts ;
  - (b) soumettre son personnel à la **confidentialité** ;
  - (c) appliquer les mesures de **sécurité de l'article 32** ;
  - (d) respecter les conditions de la sous-traitance ultérieure ;
  - (e) **aider** le client à répondre aux demandes d'exercice des droits ;
  - (f) aider le client pour les articles 32 à 36 (sécurité, violations, AIPD, consultation préalable) ;
  - (g) **supprimer ou restituer** les données en fin de contrat ;
  - (h) fournir les informations nécessaires aux **audits** et y contribuer ;
  - **alerter immédiatement** le client si une instruction lui paraît contraire au droit.
- **Art. 28 § 4 :** les mêmes obligations sont répercutées sur les sous-traitants ultérieurs. **Art. 28 § 10 :** un sous-traitant qui détermine les finalités devient responsable du traitement.
- **Art. 30 § 2 :** registre des activités de traitement tenu par le sous-traitant. **Art. 33 § 2 :** notification des violations au client « dans les meilleurs délais ».
- **Art. 37 § 1 b :** DPO obligatoire si les activités de base du sous-traitant exigent un « suivi régulier et systématique à grande échelle » des personnes. [Analyse / Non vérifié] Pour un SaaS de pointage multi-clients, la question doit être **évaluée et documentée**.
- **Transferts hors UE** (art. 44 et s.) : décision d'adéquation, règles d'entreprise contraignantes, clauses types, etc. ([référentiel 2019, § 6.2](https://www.cnil.fr/sites/default/files/atoms/files/referentiel_grh_novembre_2019_0.pdf)).
- **Outils CNIL :** [exemples de clauses de sous-traitance](https://www.cnil.fr/fr/sous-traitance-exemple-de-clauses) (2017) ; mesures de sécurité listées au § 10 du référentiel 2019 : identifiants uniques, habilitations par profil avec revue annuelle, journalisation, chiffrement, sauvegardes, archivage sécurisé, clause de restitution et destruction.

### 5.13 Autres textes utiles aux notifications et au télétravail

- **Droit à la déconnexion :** thème de négociation obligatoire, ou **charte** à défaut d'accord ([L2242-17](https://code.travail.gouv.fr/code-du-travail/l2242-17) 7°).
- **Télétravail :** l'accord ou la charte précise les **modalités de contrôle du temps de travail** et les **plages horaires** pendant lesquelles l'employeur peut habituellement contacter le salarié ([L1222-9](https://code.travail.gouv.fr/code-du-travail/l1222-9) II 3° et 4°, v. 21/07/2023).

---

## 6. Paie : mentions du bulletin et contenu de l'export de temps

### 6.1 Mentions obligatoires du bulletin qui dépendent des temps ([R3243-1](https://code.travail.gouv.fr/code-du-travail/r3243-1), v. 01/01/2024)

- **5° :** période et nombre d'heures auxquels se rapporte le salaire, en distinguant les **heures payées au taux normal** et les heures **majorées pour heures supplémentaires ou pour toute autre cause**, avec **le ou les taux appliqués** ;
  - a) nature et volume du **forfait** (hebdomadaire, mensuel, annuel en heures ou en jours) ;
  - b) nature de la base de calcul lorsqu'elle n'est pas la durée du travail.
- **12° :** **dates de congé** et montant de l'indemnité, lorsqu'un congé tombe dans la période de paie.
- **13° :** montant total des exonérations et exemptions de cotisations et contributions sociales figurant dans l'annexe visée à l'article LO 111-4 du CSS. [Analyse] Les dispositifs liés aux heures supplémentaires relèvent a priori de cette mention.
- **16° :** en cas d'**activité partielle**, nombre d'heures indemnisées, taux et sommes versées.
- **Interdiction :** aucune mention de l'**exercice du droit de grève** ni de l'**activité de représentation** sur le bulletin. La rémunération de la représentation figure sur une fiche annexe ([R3243-4](https://code.travail.gouv.fr/code-du-travail/r3243-4)).

### 6.2 Documents annexes et justificatifs liés aux temps

- **Document mensuel annexé au bulletin** pour les salariés hors horaire collectif : cumul annuel des heures supplémentaires, RCR acquis, repos pris, jours de réduction du temps de travail pris ([D3171-12](https://code.travail.gouv.fr/code-du-travail/d3171-12)).
- **Information RCR et COR**, avec alerte à 7 h et échéance à 2 mois ([D3171-11](https://code.travail.gouv.fr/code-du-travail/d3171-11)).
- **Total de fin de période d'aménagement** ([D3171-13](https://code.travail.gouv.fr/code-du-travail/d3171-13)).
- **Récapitulatif mensuel des astreintes** ([R3121-2](https://code.travail.gouv.fr/code-du-travail/r3121-2)).
- **Information sur les congés à la reprise après un arrêt**, qui peut passer par le bulletin ([L3141-19-3](https://code.travail.gouv.fr/code-du-travail/l3141-19-3)).
- **Récapitulatif hebdomadaire des heures supplémentaires et complémentaires par taux et par mois de paiement**, au moins annuel ([D241-25 CSS](https://www.legifrance.gouv.fr/codes/id/LEGISCTA000026407536/)).

### 6.3 Contenu minimal recommandé pour l'export de temps

| Donnée exportée | Pourquoi | Fondement |
|---|---|---|
| Identifiants salarié et établissement, période de paie | Rattachement | R3243-1 1° à 5° |
| Heures travaillées, heures au taux normal | Mention obligatoire | R3243-1 5° |
| Heures supplémentaires **par taux** (25 et 50 %, ou barème conventionnel, par exemple 10/20/50 en HCR), par semaine et par mois de paiement | Bulletin, réduction de cotisations, exonération fiscale | R3243-1 5° ; L3121-36 ; D241-25 CSS ; L241-17 CSS ; 81 quater CGI |
| Heures complémentaires **par taux** (10 et 25 %) | Idem | L3123-29 ; D241-25 |
| Autres heures majorées : nuit, dimanche, jours fériés, **1er mai travaillé** (indemnité égale au salaire) | Majorations « pour toute autre cause » | R3243-1 5° ; L3133-6 ; L3122-8 |
| Nature et volume du forfait, jours travaillés (forfait en jours) | Mention obligatoire et contrôle | R3243-1 5° a ; D3171-10 ; L3121-65 |
| RCR et COR : acquis, pris, solde ; cumul annuel des heures supplémentaires ; consommation du contingent | Annexes obligatoires | D3171-11 ; D3171-12 ; L3121-30 |
| Congés payés : dates, nombre de jours, lot d'acquisition, date d'expiration ; périodes de maladie non professionnelle (80 % dans l'assiette) | Bulletin et calcul de l'indemnité | R3243-1 12° ; L3141-24 ; L3141-19-3 |
| Absences par motif (maladie, accident du travail, congés spéciaux, sans solde, activité partielle en heures, grève) | Retenues et indemnisations ; **grève non mentionnée sur le bulletin** | R3243-1 16° ; R3243-4 |
| Heures d'astreinte et interventions | Compensation, récapitulatif mensuel | L3121-9 ; R3121-2 |
| Journée de solidarité | Pas de rémunération dans la limite de 7 h | L3133-8 |
| Fin de période d'aménagement : total des heures et régularisation | Annexe du dernier bulletin | D3171-13 ; L3121-41 |

---

## 7. Spécificités sectorielles (ce qui change pour un outil de pointage)

### 7.1 Hôtels, cafés, restaurants (HCR, IDCC 1979)

Source : **avenant n° 2 du 5 février 2007** relatif à l'aménagement du temps de travail, **en vigueur et étendu** (arrêté du 26/03/2007, depuis le 01/04/2007) ([avenant sur Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000005670080/?idConteneur=KALICONT000005635534)).

- **Art. 3 :** durée hebdomadaire fixée à **39 heures**, d'après la page de l'avenant consultée.
- **Art. 4** ([Légifrance](https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000005826386)) : heures de la **36e à la 39e majorées de 10 %**, de la **40e à la 43e de 20 %**, **à partir de la 44e de 50 %**.
- **Art. 6** ([Légifrance](https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000005826388)) : durées maximales journalières, heures supplémentaires comprises : **personnel administratif hors site 10 h**, **cuisinier 11 h**, **autre personnel 11 h 30**, **personnel de réception 12 h**. Durées hebdomadaires : **46 h** sur 12 semaines consécutives et **48 h** au maximum absolu. Les travailleurs de nuit sont exclus de cet article.
- **Art. 8, affichage et contrôle** ([Légifrance](https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000005826390)) :
  - enregistrement **quotidien** des heures de début et de fin, ou relevé des heures ;
  - **récapitulatif hebdomadaire** qui, à défaut d'autre document, est **émargé par le salarié et par l'employeur** et tenu à disposition de l'inspection ;
  - document mensuel annexé au bulletin.
- **Contingent : 360 h par an** dans les établissements permanents, **90 h par trimestre** dans les établissements saisonniers ([Code du travail numérique, contribution HCR, mise à jour le 04/12/2025](https://code.travail.gouv.fr/contribution/1979-heures-supplementaires)).
- **Impact produit :** barème HCR prêt à l'emploi ; plafonds journaliers par **catégorie de poste** ; **validation ou émargement électronique hebdomadaire** par le salarié et l'employeur, possible en format électronique à garanties équivalentes (D3171-15) ; contingent de 360 h ou 90 h par trimestre.
- **[Non vérifié] :** règles HCR sur le repos hebdomadaire et les veilleurs de nuit.

### 7.2 Bâtiment et travaux publics (BTP)

- **Congés payés gérés par des caisses :** dans les entreprises qui relèvent des conventions collectives nationales étendues du BTP, les congés sont servis par des **caisses de congés** ([D3141-12](https://code.travail.gouv.fr/code-du-travail/d3141-12) ; [L3141-32](https://code.travail.gouv.fr/code-du-travail/l3141-32)). La période de référence **commence le 1er avril** ([R3141-4](https://code.travail.gouv.fr/code-du-travail/r3141-4)).
- **Chômage intempéries :** régime d'indemnisation des arrêts de travail causés par les intempéries ([L5424-6](https://code.travail.gouv.fr/code-du-travail/l5424-6)). Sont des intempéries les conditions atmosphériques et les inondations qui rendent le travail dangereux ou impossible ([L5424-8](https://code.travail.gouv.fr/code-du-travail/l5424-8)).
- **Canicule :** le **décret n° 2024-630 du 28/06/2024** crée D5424-7-1, qui retient notamment les **périodes de canicule** (avec la neige, le gel, le verglas, la pluie et le vent fort), les modalités étant renvoyées à un arrêté. Entrée en vigueur le lendemain de sa publication au JO du 29/06/2024 ([Légifrance](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000049832099)).
- **Chaleur intense, tous secteurs :** le **décret n° 2025-482 du 27/05/2025** crée R4463-1 et suivants. R4463-3 3° prévoit « l'adaptation de l'organisation du travail, et notamment des horaires de travail ». Entrée en vigueur différée, dont une partie subordonnée à un arrêté ([Légifrance](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000051676074)). Date exacte d'entrée en vigueur : **[Non vérifié]**.
- **Impact produit :** codes d'absence « intempéries » et « canicule » distincts ; export des congés vers la caisse plutôt que vers la paie ; période de référence au 1er avril ; plannings modifiables rapidement en cas de vigilance canicule.

### 7.3 Transport routier léger : livret individuel de contrôle (LIC) et Mobilic

- **Arrêté du 6 mars 2025** relatif à l'horaire de service et au livret individuel de contrôle dans les transports routiers, en vigueur le 20/03/2025 ([Légifrance](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000051347969)) :
  - champ défini par renvoi à R3312-19 et R3312-58 du Code des transports ;
  - **art. 2 :** le LIC « peut être tenu, conservé et présenté sous format électronique » dans les conditions de l'annexe III, qui correspondent à **Mobilic**, outil développé par le ministère chargé des transports ;
  - **annexe III :** enregistrement du lieu de prise de service puis **enregistrement en temps réel** des tâches ; le salarié dispose de **24 heures** après le début de sa journée pour modifier et valider ; l'employeur dispose ensuite de **2 jours ouvrés** pour modifier et valider à son tour ;
  - **art. 4 :** conservation **3 ans** après la dernière utilisation du livret ;
  - **art. 5 :** abrogation de l'**arrêté du 20 juillet 1998**.
- **Mobilic (FAQ officielle) :**
  - Mobilic est la dématérialisation du LIC ; il faut utiliser soit Mobilic, soit le LIC papier ; les véhicules de moins de 3,5 t sont visés ([FAQ, réglementation](https://faq.mobilic.beta.gouv.fr/comprendre-ce-quest-mobilic/securite-et-confidentialite-des-donnees.md)) ;
  - un **logiciel métier** peut se connecter par **API** (identifiant `client_id`) et transmettre automatiquement les temps, mais un **compte Mobilic reste obligatoire** pour l'entreprise et chaque salarié ([FAQ, interconnexion](https://faq.mobilic.beta.gouv.fr/usages-et-fonctionnement-de-mobilic-gestionnaire/substituer-mobilic-avec-un-logiciel-metier-interconnexion.md)) ;
  - le service est porté par la Fabrique numérique du ministère de la Transition écologique et se trouve en phase de « consolidation » depuis le 10/11/2025 ([beta.gouv.fr](https://beta.gouv.fr/startups/mobilic.html)).
- **Arrêté du 9 décembre 2025** « autorisant le traitement de données Mobilic » : titre relevé dans les résultats Légifrance, **contenu non consulté [Non vérifié]**. Une évolution au **1er juillet 2026** concernant les véhicules autour de 2,5 t est évoquée dans la FAQ : **[Non vérifié]**.
- **Poids lourds :** les données de **tachygraphe** se conservent 1 an après utilisation (règlement (UE) n° 165/2014, [référentiel CNIL 2026](https://www.cnil.fr/sites/default/files/2026-04/referentiel_durees_de_conservation_gestion_des_ressources_humaines.pdf)). Le chronotachygraphe figure dans la liste des traitements soumis à AIPD.
- **Impact produit :** **ne pas se substituer au LIC** ; s'interfacer avec l'API Mobilic ; reproduire le modèle de validation (salarié sous 24 h, employeur sous 2 jours ouvrés, puis verrouillage) ; conservation 3 ans.

### 7.4 Aide et soins à domicile (convention BAD, IDCC 2941)

- **Art. 14 « Déplacements »**, en vigueur et étendu depuis le 01/10/2022 ([Légifrance](https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000047495024)) :
  - les temps de déplacement nécessaires entre **deux séquences successives de travail effectif au cours d'une même demi-journée** sont du **temps de travail effectif** rémunéré comme tel ;
  - si les séquences **ne sont pas consécutives**, le temps de déplacement est **reconstitué** et traité de la même façon ;
  - les mêmes règles valent pour les interventions de nuit.
- Le trajet du domicile vers la première intervention relève de [L3121-4](https://code.travail.gouv.fr/code-du-travail/l3121-4) : pas de temps de travail effectif, mais une contrepartie en cas de dépassement du trajet normal.
- **Impact produit :** calcul automatique des temps inter-interventions, avec reconstitution et paramétrage de la notion de demi-journée ; distinction entre trajet domicile-intervention et trajet inter-interventions.
- **[Non vérifié] :** particuliers employeurs (IDCC 3239) et arrêt CJUE C-531/23 « Loredas » (19/12/2024) sur l'enregistrement du temps des travailleurs domestiques ; pratiques de « télégestion » propres à la branche.

---

## 8. Évolutions 2023-2026 (chronologie)

| Date | Évolution | Impact WorkHoraire | Source |
|---|---|---|---|
| 13/09/2023 | Cass. soc. n° 22-17.340 : congés payés acquis pendant un arrêt maladie non professionnel | Module congés | [Légifrance](https://www.legifrance.gouv.fr/juri/id/JURITEXT000048085897) |
| 22/12/2023 | Ass. plén. n° 20-20.648 : preuve illicite ou déloyale recevable sous conditions | Valeur probante des pointages | [Légifrance](https://www.legifrance.gouv.fr/juri/id/JURITEXT000048769030) |
| 27/12/2023 | CNIL SAN-2023-021 (Amazon France Logistique) : 32 M€ | Surveillance de l'activité | [Légifrance](https://www.legifrance.gouv.fr/cnil/id/CNILTEXT000048989272) |
| 07/02/2024 | Cass. soc. n° 22-15.842 : cite CCOO (point 60) | Décompte et preuve | [Légifrance](https://www.legifrance.gouv.fr/juri/id/JURITEXT000049130153) |
| 22/04/2024 (en vigueur le 24/04/2024) | Loi n° 2024-364, art. 37 : congés et maladie, report de 15 mois, information | Module congés | [Légifrance](https://www.legifrance.gouv.fr/jorf/article_jo/JORFARTI000049453299) |
| 28/06/2024 | Décret n° 2024-630 : canicule intégrée au chômage intempéries du BTP | Codes d'absence BTP | [Légifrance](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000049832099) |
| 19/12/2024 | CNIL SAN-2024-021 : 40 000 € (inactivité, captures d'écran) | Fonctions interdites | [CNIL](https://www.cnil.fr/fr/surveillance-excessive-des-salaries-sanction-de-40-000-euros-entreprise-secteur-immobilier) |
| 06/03/2025 | Arrêté LIC et Mobilic (abroge l'arrêté du 20/07/1998) | Transport léger | [Légifrance](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000051347969) |
| 04/04/2025 (en vigueur le 07/04/2025) | Décret n° 2025-318 : D241-25 CSS (récapitulatif des heures supplémentaires et complémentaires par taux et mois) | Export paie | [Légifrance](https://www.legifrance.gouv.fr/codes/id/LEGISCTA000026407536/) |
| 27/05/2025 | Décret n° 2025-482 : chaleur intense, adaptation des horaires | Planning | [Légifrance](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000051676074) |
| 04/09/2025 | CNIL : 7 000 € contre un éditeur de logiciel RH sous-traitant | Contrat art. 28, sécurité | [CNIL](https://www.cnil.fr/fr/les-sanctions-prononcees-par-la-cnil) |
| 10/09/2025 | Cass. soc. n° 23-14.455 (congés dans le seuil des heures supplémentaires) et n° 23-22.732 (maladie pendant les congés) | Moteur d'heures supplémentaires, congés | [Légifrance 1](https://www.legifrance.gouv.fr/juri/id/JURITEXT000052267314) ; [Légifrance 2](https://www.legifrance.gouv.fr/juri/id/JURITEXT000052267316) |
| Mi-septembre 2025 (article du 14/09/2025) | Retrait du projet de suppression de deux jours fériés | Calendrier inchangé | [franceinfo](https://www.franceinfo.fr/economie/budget/budget-sebastien-lecornu-renonce-a-la-suppression-de-deux-jours-feries_7491502.html) ; [L3133-1](https://code.travail.gouv.fr/code-du-travail/l3133-1) |
| 22/12/2025 | Loi n° 2025-1249 : L3141-5 8° (mandat électif local assimilé à du travail effectif pour les congés) | Module congés | [Légifrance](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033020810/) |
| 23/12/2025 | CE n° 492830 : amende Amazon ramenée à 15 M€ | Surveillance de l'activité | [Légifrance](https://www.legifrance.gouv.fr/ceta/id/CETATEXT000053163189) |
| 30/12/2025 | Loi n° 2025-1403, art. 21 : L241-18-1 CSS (entreprises d'au moins 20 salariés ; revenus à compter du 01/01/2026) | Export paie | [Légifrance](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000046982267) |
| 18/03/2026 | Cass. soc. n° 24-18.976 : géolocalisation « Distrio » jugée licite (Mediaposte) | Géolocalisation | [Légifrance](https://www.legifrance.gouv.fr/juri/id/JURITEXT000053765290) |
| 02/04/2026 (mis à jour le 20/05/2026) | CNIL : référentiel des durées de conservation RH | Purge et archivage | [CNIL](https://www.cnil.fr/fr/referentiel-durees-conservation-donnees-rh) |
| 29/04/2026, en cours | Projet de loi sur le travail le 1er mai (boulangers, fleuristes) : adopté par le Sénat le 16/06/2026, en discussion à l'Assemblée nationale | Calendrier du 1er mai | [Sénat](https://www.senat.fr/dossier-legislatif/pjl25-588.html) |
| 17/06/2026 | CNIL : fiche accès aux locaux et contrôle des horaires mise à jour (biométrie et photo jugées excessives ; 5 ans) | Pas de biométrie ni de photo | [CNIL](https://www.cnil.fr/fr/lacces-aux-locaux-et-le-controle-des-horaires-sur-le-lieu-de-travail) |
| 27/06/2026 | L8115-1 : nouvelle version affichée (amendes administratives) | Risque de sanction | [Code du travail numérique](https://code.travail.gouv.fr/code-du-travail/l8115-1) |

---

## 9. Synthèse des exigences produit

**Légende de la colonne « Nature » :**
- **OL** = obligation légale ou réglementaire (y compris conventionnelle étendue lorsqu'elle est indiquée) ;
- **JP** = obligation issue de la jurisprudence ;
- **RC** = recommandation ou doctrine de la CNIL ;
- **BP** = bonne pratique ou déduction [Analyse].

Pour beaucoup de lignes, l'obligation pèse sur le **client employeur** : WorkHoraire fournit l'outil qui permet de la respecter.

| # | Domaine | Exigence fonctionnelle WorkHoraire | Fondement | Nature |
|---|---|---|---|---|
| 1 | Décompte | Enregistrement **quotidien** des heures de début et de fin (ou du nombre d'heures) par salarié, et **récapitulatif hebdomadaire** automatique | L3171-2 ; D3171-8 | OL |
| 2 | Décompte | Mode « temps réel pour tous », y compris pour les salariés sous horaire collectif (option activée par défaut) | CJUE C-55/18 ; Cass. 07/02/2024 et 18/03/2026 | BP (appui JP et droit UE) |
| 3 | Fiabilité | **Horodatage serveur**, journal des événements en ajout seul (idéalement chaîné par empreinte), aucune suppression physique d'un pointage, synchronisation hors ligne avec l'heure du terminal conservée séparément | L3171-4 al. 3 (« fiable et infalsifiable ») | OL (résultat) / BP (moyens) |
| 4 | Corrections | **Piste d'audit des corrections** : auteur, date, valeur avant et après, **motif obligatoire** ; correction visible et **notifiée au salarié**, qui peut la contester | L3171-4 ; CCOO (« objectif, fiable ») | OL / BP |
| 5 | Corrections | Workflow de validation : le salarié valide sa journée ou sa semaine, puis le manager ; verrouillage après délai ou clôture de paie ; toute réouverture est tracée | Modèle de l'arrêté du 06/03/2025 (24 h / 2 jours ouvrés) ; HCR art. 8 (émargement) | BP (OL en transport léger ; conventionnelle en HCR) |
| 6 | Accès | **Espace salarié** : consultation des pointages et compteurs jour, semaine et mois ; export (PDF, CSV) de ses données | CCOO (« accessible ») ; D3171-14 ; art. 15 RGPD | OL / JP |
| 7 | Horaire collectif | Éditeur d'**horaire collectif** daté et signé, historique des rectifications, export du double pour l'inspection ; registre des équipes et roulements | L3171-1 ; D3171-1 à D3171-4 ; D3171-7 ; R3173-1 | OL |
| 8 | Alertes durées | Alertes de dépassement : **10 h par jour** (plafond conventionnel jusqu'à 12 h), **48 h dans la semaine** (60 h si autorisation), **44 h sur 12 semaines** (46 h), **nuit** : 8 h par jour et 40 h sur 12 semaines | L3121-18 à L3121-24 ; L3122-6 ; L3122-7 | OL (respect) / BP (alerte) |
| 9 | Alertes repos | Contrôle du **repos quotidien de 11 h** (plancher conventionnel de 9 h), du **repos hebdomadaire de 35 h**, de **6 jours au plus**, du **dimanche** (dérogations paramétrées) | L3131-1 ; L3131-2 ; D3131-6 ; L3132-1 à L3132-3 | OL |
| 10 | Pauses | Détection de l'absence de **pause de 20 min dès 6 h** ; saisie des pauses et paramétrage de la pause rémunérée ou non | L3121-16 ; L3121-2 | OL |
| 11 | Preuve | Journal des alertes et de leur traitement ; rapports de conformité exportables (plafonds, repos) | Cass. 20/02/2013 (preuve à la charge de l'employeur) ; Cass. 26/01/2022 | BP (appui JP) |
| 12 | Jeunes | Profil « mineur » : 8 h par jour, 35 h par semaine, pause de 30 min après 4 h 30, repos de 12 h (14 h avant 16 ans), 2 jours consécutifs, interdiction du travail de nuit (22 h-6 h, ou 20 h-6 h avant 16 ans) | L3162-1 ; L3162-3 ; L3164-1 ; L3164-2 ; L3163-1 ; L3163-2 | OL |
| 13 | Nuit | Plage de nuit paramétrable (21 h-6 h par défaut), compteur de qualification de travailleur de nuit (270 h sur 12 mois), compteur des contreparties | L3122-2 ; L3122-5 ; L3122-20 ; L3122-23 ; L3122-8 | OL |
| 14 | Heures supplémentaires | Moteur hebdomadaire : semaine **lundi 0 h-dimanche 24 h** (autre période de 7 jours si accord), seuil de 35 h ou d'équivalence, taux **25/50** par défaut, taux conventionnels d'au moins 10 % (préréglage HCR 10/20/50), option RCR | L3121-28 ; L3121-29 ; L3121-32 ; L3121-33 ; L3121-35 ; L3121-36 ; L3121-37 ; HCR art. 4 | OL |
| 15 | Heures supplémentaires | **Heures de congé payé prises dans la semaine comptées dans le seuil** de déclenchement (décompte hebdomadaire), valorisation paramétrable et tracée | Cass. soc. 10/09/2025, n° 23-14.455 | JP |
| 16 | Contingent et COR | Compteur de **contingent** (220 h par défaut ; 360 h en HCR) hors RCR et travaux urgents, alertes à 80 % et 100 % ; **COR** à 50 % ou 100 % selon l'effectif, droit ouvert à 7 h, échéance à 2 mois, relance à un an, solde de fin de contrat | L3121-30 ; L3121-38 ; D3121-17 à D3121-24 ; D3171-11 | OL |
| 17 | Aménagement | Périodes de référence pluri-hebdomadaires (≤ 9 semaines sous 50 salariés, ≤ 4 semaines au-delà, 1 à 3 ans par accord), seuil de 1 607 h, limite hebdomadaire haute, régularisation et **total de fin de période** | L3121-41 ; L3121-44 ; L3121-45 ; D3121-27 ; D3171-5 ; D3171-13 | OL |
| 18 | Temps partiel | Heures complémentaires ≤ 1/10 (1/3 par accord), **blocage avant 35 h**, taux de 10 % puis 25 %, **alerte de requalification** (+2 h par semaine en moyenne sur 12 semaines), contrôle du minimum de 24 h | L3123-9 ; L3123-13 ; L3123-20 ; L3123-21 ; L3123-27 ; L3123-28 ; L3123-29 | OL |
| 19 | Forfaits | Forfait en jours décompté en **jours et demi-journées**, document de contrôle, suivi du repos, rappel d'entretien annuel ; **cadres dirigeants** exclus du décompte | L3121-58 ; L3121-65 ; D3171-10 ; L3111-2 | OL |
| 20 | Astreintes | Planning individuel des astreintes, saisie des interventions (temps de travail effectif), **récapitulatif mensuel**, prise en compte dans les repos | L3121-9 ; L3121-10 ; R3121-2 ; D3171-16 2° | OL |
| 21 | Jours fériés | Calendrier par établissement : 11 jours nationaux, **Alsace-Moselle** (26/12, Vendredi saint selon la commune), **outre-mer** (dates de l'abolition), **1er mai** chômé (indemnité égale au salaire si travaillé), journée de solidarité de 7 h proratisée, garantie de salaire à partir de 3 mois d'ancienneté | L3133-1 ; L3133-3 à L3133-8 ; L3134-1 ; L3134-13 ; service-public F2405 | OL |
| 22 | Congés : acquisition | 2,5 jours ouvrables par mois (30 au plus), **2 jours par mois en maladie non professionnelle (24 au plus)**, périodes assimilées dont accident du travail et mandat électif local, arrondi supérieur, période de référence au 1er juin ou 1er avril, jours ouvrables ou ouvrés | L3141-3 ; L3141-4 ; L3141-5 ; L3141-5-1 ; L3141-7 ; R3141-4 | OL |
| 23 | Congés : report | **Date d'expiration par lot** (report de 15 mois ou durée conventionnelle), cas de l'arrêt d'au moins un an, **notification à la reprise** (solde et date limite) sous un mois avec **preuve de date certaine** | L3141-19-1 ; L3141-19-2 ; L3141-19-3 ; L3141-21-1 | OL |
| 24 | Congés : maladie | Recrédit des congés en cas d'arrêt maladie **notifié** pendant les congés | Cass. soc. 10/09/2025, n° 23-22.732 | JP |
| 25 | Congés : planification | Publication de la période de prise 2 mois avant, ordre des départs 1 mois avant, blocage des modifications à moins d'un mois (motif tracé), contrôles du maximum de 24 jours consécutifs, de la fraction de 12 jours en été et des jours de fractionnement | L3141-13 ; L3141-16 ; L3141-17 ; L3141-23 ; D3141-5 ; D3141-6 | OL |
| 26 | Annexes du bulletin | Génération du **document mensuel** (cumul des heures supplémentaires, RCR acquis et pris, jours de repos), de l'information RCR et COR, du total de fin de période | D3171-11 ; D3171-12 ; D3171-13 | OL |
| 27 | Export paie | Export conforme au § 6.3 : heures par taux, heures complémentaires par taux, forfait, congés (dates), activité partielle, astreintes, nuit, dimanche, jours fériés, 1er mai ; **aucune mention « grève » destinée au bulletin** | R3243-1 ; R3243-4 ; L3133-6 | OL (pour le client) |
| 28 | Export social | **Récapitulatif hebdomadaire annuel** des heures supplémentaires et complémentaires par taux et **mois de paiement** ; totaux éligibles à L241-17 et au plafond de 7 500 € | D241-25 CSS (décret 2025-318) ; L241-17 CSS ; 81 quater CGI | OL |
| 29 | Inspection et CSE | Export « inspection du travail » (électronique à garanties équivalentes) ; accès en lecture seule pour les élus du CSE aux documents de décompte | L3171-3 ; D3171-15 ; L3171-2 al. 2 | OL |
| 30 | Conservation | **Politique de rétention paramétrable** : base active jusqu'à la clôture de paie ; **archivage séparé** à accès restreint ; minimum 1 an (3 ans pour les forfaits en jours ; 3 ans pour le LIC) ; défaut suggéré de 3 ans ; maximum 5 ans ; **purge automatique** ; journaux d'accès à 3 mois | D3171-16 ; L3245-1 ; référentiel CNIL 2026 ; fiche CNIL | OL (minimums) / RC (maximums, séparation) |
| 31 | Biométrie | **Aucune biométrie** (empreinte, visage, veine) pour le pointage, non proposée même en option | Fiche CNIL (17/06/2026) ; règlement type 2019-001, art. 2 ; RGPD art. 9 | RC (quasi-interdiction) |
| 32 | Photo | **Pas de photo systématique** à chaque pointage (pas de « selfie de pointage ») | Fiche CNIL (17/06/2026) | RC |
| 33 | Géolocalisation | **Désactivée par défaut**. Si le client l'active : collecte **ponctuelle au seul pointage**, jamais de suivi continu ni hors temps de travail, justification écrite du client (absence d'autre moyen), rappel d'information, du CSE et de l'AIPD, conservation courte, jamais utilisée pour **calculer** le temps | CE 15/12/2017 n° 403776 ; Cass. 18/03/2026 ; fiche CNIL géolocalisation ; L1121-1 | JP / RC / BP |
| 34 | Surveillance | **Aucune** mesure d'inactivité, capture d'écran, enregistrement de frappe, webcam ou suivi des déplacements dans les locaux | CNIL SAN-2024-021 ; fiche CNIL ; L1121-1 ; art. 5 § 1 c | OL / RC |
| 35 | Information | **Kit de conformité client** : modèle de note d'information (art. 13), preuve de remise à chaque salarié, modèle de note au CSE (≥ 50 salariés : information et consultation préalables) | L1222-4 ; art. 13 RGPD ; L2312-38 ; L2312-8 | OL (client) / BP (éditeur) |
| 36 | AIPD | Documentation produit pour l'AIPD du client ; signalement dans l'interface qu'une AIPD est probablement requise dès l'activation d'une option à risque (géolocalisation) | Art. 35 RGPD ; délibérations 2018-327 et 2019-118 ; art. 28 § 3 f | OL |
| 37 | Contrat art. 28 | Contrat de sous-traitance conforme (points a à h), **liste des sous-traitants ultérieurs** et procédure d'objection, registre du sous-traitant, **notification des violations sans délai**, restitution (export complet) et destruction en fin de contrat, droit d'audit | Art. 28 ; art. 30 § 2 ; art. 33 § 2 RGPD ; sanction CNIL du 04/09/2025 | OL |
| 38 | Finalités | Aucune réutilisation des données clients pour les finalités propres de l'éditeur (statistiques commerciales, entraînement d'IA) sans cadre juridique | Art. 28 § 10 RGPD | OL |
| 39 | Sécurité | Authentification forte des administrateurs, **comptes nominatifs** (aucun compte partagé), habilitations par profil (salarié, manager, RH, paie, CSE en lecture, inspection), revue des droits, journalisation des accès, chiffrement, sauvegardes | Art. 32 RGPD ; référentiel 2019 § 10 ; SAN-2024-021 | OL / RC |
| 40 | Hébergement | Hébergement dans l'UE, ou encadrement des transferts (art. 44 et s.) | Art. 44 et s. RGPD ; référentiel 2019 § 6.2 | OL (si transfert) / BP (UE) |
| 41 | Droits | Module de traitement des demandes (accès, rectification, portabilité), délai de 1 mois suivi | Art. 12 § 3, 15, 16 et 20 RGPD | OL |
| 42 | DPO | Évaluer et documenter la nécessité d'un DPO pour WorkHoraire (suivi régulier et systématique à grande échelle ?) | Art. 37 § 1 b RGPD | OL (à évaluer) |
| 43 | Notifications | Plages sans notification paramétrables (droit à la déconnexion), plages de contact en télétravail | L2242-17 7° ; L1222-9 | BP (appui légal) |
| 44 | HCR | Préréglage HCR : taux 10/20/50, contingent de 360 h (90 h par trimestre en saisonnier), plafonds journaliers par catégorie, **émargement hebdomadaire électronique** salarié et employeur | Avenant n° 2 du 05/02/2007, art. 4, 6 et 8 | OL (conventionnelle étendue) |
| 45 | BTP | Codes d'absence intempéries et canicule, export des congés vers la caisse, période de référence au 1er avril, planning « chaleur » | L5424-6 ; L5424-8 ; D5424-7-1 ; D3141-12 ; R3141-4 ; R4463-3 | OL |
| 46 | Transport léger | Interfaçage **API Mobilic** (le LIC n'est pas remplacé), mêmes délais de validation, conservation de 3 ans | Arrêté du 06/03/2025 ; FAQ Mobilic | OL (LIC) / BP (intégration) |
| 47 | Aide à domicile | Calcul automatique des **temps de déplacement entre interventions** (temps de travail effectif), avec reconstitution pour les séquences non consécutives | Convention BAD, art. 14 ; L3121-4 | OL (conventionnelle étendue) |
| 48 | Paramétrage | **Règles datées** : versionnage des paramètres légaux et conventionnels avec date d'effet, pour recalculer une période passée avec les règles alors applicables (réformes de 2024 et 2025, jurisprudences de 2025) | Nombreuses modifications de 2024 à 2026 (§ 8) | BP |

---

## 10. Points non vérifiés et sujets de veille

1. **Transposition de CCOO ou réforme en cours** en France : aucune identifiée (recherche limitée).
2. **CJUE, 19/12/2024, C-531/23 « Loredas »** (enregistrement du temps des travailleurs domestiques) : non consulté.
3. **Valorisation des congés dans le seuil des heures supplémentaires** (Cass. 10/09/2025) : méthode (heures planifiées, 1/5 de l'horaire hebdomadaire…) non précisée dans l'extrait consulté. Extension éventuelle aux jours fériés chômés ou à d'autres absences : non vérifiée.
4. **L241-18-1 CSS** : rédaction antérieure à 2026 (bornage à 250 salariés ?) et montant réglementaire de la déduction non vérifiés.
5. **D3171-15** : portée actuelle de la référence à la « déclaration préalable » CNIL depuis le RGPD.
6. **Décret n° 2025-482 (chaleur)** : date exacte d'entrée en vigueur (la page du ministère était protégée par un contrôle anti-robot, qui n'a pas été contourné).
7. **Mobilic** : contenu de l'arrêté du 09/12/2025 et évolution au 01/07/2026 pour les véhicules légers.
8. **HCR** : repos hebdomadaire conventionnel et régime des veilleurs de nuit.
9. **Particuliers employeurs (IDCC 3239)** et **télégestion** dans l'aide à domicile.
10. **Montant des contraventions de 4e classe** (R3173-1, R3173-2).
11. **Calcul de l'effectif de 50 salariés** pour les attributions du CSE (L2312-2 non consulté).
12. **Décompte des congés en jours ouvrés** : principe de non-défaveur non vérifié sur source primaire.
13. **Règlement (UE) 2024/1689 sur l'IA** : non étudié. Si WorkHoraire ajoute des fonctions d'IA d'évaluation ou de surveillance des travailleurs, une analyse spécifique sera nécessaire.
14. **Projet de loi sur le travail le 1er mai (boulangers, fleuristes)** : en cours d'examen à l'Assemblée nationale au 22/09/2026, à suivre.
15. **Position de la CNIL sur la géolocalisation ponctuelle lors d'un pointage mobile** : aucune doctrine spécifique trouvée.

---

## 11. Sources consultées (le 23/09/2026)

### Code du travail : Code du travail numérique (code.travail.gouv.fr, ministère du Travail)

- **Titre VII, contrôle de la durée du travail :** [L3171-1](https://code.travail.gouv.fr/code-du-travail/l3171-1), [L3171-2](https://code.travail.gouv.fr/code-du-travail/l3171-2), [L3171-3](https://code.travail.gouv.fr/code-du-travail/l3171-3), [L3171-4](https://code.travail.gouv.fr/code-du-travail/l3171-4)
- **D3171 :** [D3171-1](https://code.travail.gouv.fr/code-du-travail/d3171-1), [D3171-2](https://code.travail.gouv.fr/code-du-travail/d3171-2), [D3171-3](https://code.travail.gouv.fr/code-du-travail/d3171-3), [D3171-4](https://code.travail.gouv.fr/code-du-travail/d3171-4), [D3171-5](https://code.travail.gouv.fr/code-du-travail/d3171-5), [D3171-7](https://code.travail.gouv.fr/code-du-travail/d3171-7), [D3171-8](https://code.travail.gouv.fr/code-du-travail/d3171-8), [D3171-9](https://code.travail.gouv.fr/code-du-travail/d3171-9), [D3171-10](https://code.travail.gouv.fr/code-du-travail/d3171-10), [D3171-11](https://code.travail.gouv.fr/code-du-travail/d3171-11), [D3171-12](https://code.travail.gouv.fr/code-du-travail/d3171-12), [D3171-13](https://code.travail.gouv.fr/code-du-travail/d3171-13), [D3171-14](https://code.travail.gouv.fr/code-du-travail/d3171-14), [D3171-15](https://code.travail.gouv.fr/code-du-travail/d3171-15), [D3171-16](https://code.travail.gouv.fr/code-du-travail/d3171-16)
- **Sanctions :** [R3173-1](https://code.travail.gouv.fr/code-du-travail/r3173-1), [R3173-2](https://code.travail.gouv.fr/code-du-travail/r3173-2), [L8115-1](https://code.travail.gouv.fr/code-du-travail/l8115-1), [L8115-3](https://code.travail.gouv.fr/code-du-travail/l8115-3)
- **Durée du travail et heures supplémentaires :** [L3111-2](https://code.travail.gouv.fr/code-du-travail/l3111-2), [L3121-1](https://code.travail.gouv.fr/code-du-travail/l3121-1), [L3121-2](https://code.travail.gouv.fr/code-du-travail/l3121-2), [L3121-3](https://code.travail.gouv.fr/code-du-travail/l3121-3), [L3121-4](https://code.travail.gouv.fr/code-du-travail/l3121-4), [L3121-9](https://code.travail.gouv.fr/code-du-travail/l3121-9), [L3121-10](https://code.travail.gouv.fr/code-du-travail/l3121-10), [L3121-13](https://code.travail.gouv.fr/code-du-travail/l3121-13), [L3121-16](https://code.travail.gouv.fr/code-du-travail/l3121-16), [L3121-17](https://code.travail.gouv.fr/code-du-travail/l3121-17), [L3121-18](https://code.travail.gouv.fr/code-du-travail/l3121-18), [L3121-19](https://code.travail.gouv.fr/code-du-travail/l3121-19), [L3121-20](https://code.travail.gouv.fr/code-du-travail/l3121-20), [L3121-21](https://code.travail.gouv.fr/code-du-travail/l3121-21), [L3121-22](https://code.travail.gouv.fr/code-du-travail/l3121-22), [L3121-23](https://code.travail.gouv.fr/code-du-travail/l3121-23), [L3121-24](https://code.travail.gouv.fr/code-du-travail/l3121-24), [L3121-27](https://code.travail.gouv.fr/code-du-travail/l3121-27), [L3121-28](https://code.travail.gouv.fr/code-du-travail/l3121-28), [L3121-29](https://code.travail.gouv.fr/code-du-travail/l3121-29), [L3121-30](https://code.travail.gouv.fr/code-du-travail/l3121-30), [L3121-31](https://code.travail.gouv.fr/code-du-travail/l3121-31), [L3121-32](https://code.travail.gouv.fr/code-du-travail/l3121-32), [L3121-33](https://code.travail.gouv.fr/code-du-travail/l3121-33), [L3121-35](https://code.travail.gouv.fr/code-du-travail/l3121-35), [L3121-36](https://code.travail.gouv.fr/code-du-travail/l3121-36), [L3121-37](https://code.travail.gouv.fr/code-du-travail/l3121-37), [L3121-38](https://code.travail.gouv.fr/code-du-travail/l3121-38), [L3121-39](https://code.travail.gouv.fr/code-du-travail/l3121-39), [L3121-41](https://code.travail.gouv.fr/code-du-travail/l3121-41), [L3121-44](https://code.travail.gouv.fr/code-du-travail/l3121-44), [L3121-45](https://code.travail.gouv.fr/code-du-travail/l3121-45), [L3121-58](https://code.travail.gouv.fr/code-du-travail/l3121-58), [L3121-65](https://code.travail.gouv.fr/code-du-travail/l3121-65)
- **D3121 et R3121 :** [D3121-17](https://code.travail.gouv.fr/code-du-travail/d3121-17), [D3121-18](https://code.travail.gouv.fr/code-du-travail/d3121-18), [D3121-19](https://code.travail.gouv.fr/code-du-travail/d3121-19), [D3121-21](https://code.travail.gouv.fr/code-du-travail/d3121-21), [D3121-23](https://code.travail.gouv.fr/code-du-travail/d3121-23), [D3121-24](https://code.travail.gouv.fr/code-du-travail/d3121-24), [D3121-27](https://code.travail.gouv.fr/code-du-travail/d3121-27), [R3121-2](https://code.travail.gouv.fr/code-du-travail/r3121-2)
- **Travail de nuit :** [L3122-2](https://code.travail.gouv.fr/code-du-travail/l3122-2), [L3122-5](https://code.travail.gouv.fr/code-du-travail/l3122-5), [L3122-6](https://code.travail.gouv.fr/code-du-travail/l3122-6), [L3122-7](https://code.travail.gouv.fr/code-du-travail/l3122-7), [L3122-8](https://code.travail.gouv.fr/code-du-travail/l3122-8), [L3122-20](https://code.travail.gouv.fr/code-du-travail/l3122-20), [L3122-23](https://code.travail.gouv.fr/code-du-travail/l3122-23)
- **Temps partiel :** [L3123-8](https://code.travail.gouv.fr/code-du-travail/l3123-8), [L3123-9](https://code.travail.gouv.fr/code-du-travail/l3123-9), [L3123-13](https://code.travail.gouv.fr/code-du-travail/l3123-13), [L3123-20](https://code.travail.gouv.fr/code-du-travail/l3123-20), [L3123-21](https://code.travail.gouv.fr/code-du-travail/l3123-21), [L3123-27](https://code.travail.gouv.fr/code-du-travail/l3123-27), [L3123-28](https://code.travail.gouv.fr/code-du-travail/l3123-28), [L3123-29](https://code.travail.gouv.fr/code-du-travail/l3123-29)
- **Repos :** [L3131-1](https://code.travail.gouv.fr/code-du-travail/l3131-1), [L3131-2](https://code.travail.gouv.fr/code-du-travail/l3131-2), [D3131-6](https://code.travail.gouv.fr/code-du-travail/d3131-6), [L3132-1](https://code.travail.gouv.fr/code-du-travail/l3132-1), [L3132-2](https://code.travail.gouv.fr/code-du-travail/l3132-2), [L3132-3](https://code.travail.gouv.fr/code-du-travail/l3132-3), [L3132-12](https://code.travail.gouv.fr/code-du-travail/l3132-12)
- **Jours fériés :** [L3133-1](https://code.travail.gouv.fr/code-du-travail/l3133-1), [L3133-3](https://code.travail.gouv.fr/code-du-travail/l3133-3), [L3133-4](https://code.travail.gouv.fr/code-du-travail/l3133-4), [L3133-5](https://code.travail.gouv.fr/code-du-travail/l3133-5), [L3133-6](https://code.travail.gouv.fr/code-du-travail/l3133-6), [L3133-7](https://code.travail.gouv.fr/code-du-travail/l3133-7), [L3133-8](https://code.travail.gouv.fr/code-du-travail/l3133-8), [L3134-1](https://code.travail.gouv.fr/code-du-travail/l3134-1), [L3134-13](https://code.travail.gouv.fr/code-du-travail/l3134-13)
- **Congés payés :** [L3141-3](https://code.travail.gouv.fr/code-du-travail/l3141-3), [L3141-4](https://code.travail.gouv.fr/code-du-travail/l3141-4), [L3141-5](https://code.travail.gouv.fr/code-du-travail/l3141-5), [L3141-5-1](https://code.travail.gouv.fr/code-du-travail/l3141-5-1), [L3141-7](https://code.travail.gouv.fr/code-du-travail/l3141-7), [L3141-10](https://code.travail.gouv.fr/code-du-travail/l3141-10), [L3141-12](https://code.travail.gouv.fr/code-du-travail/l3141-12), [L3141-13](https://code.travail.gouv.fr/code-du-travail/l3141-13), [L3141-16](https://code.travail.gouv.fr/code-du-travail/l3141-16), [L3141-17](https://code.travail.gouv.fr/code-du-travail/l3141-17), [L3141-19-1](https://code.travail.gouv.fr/code-du-travail/l3141-19-1), [L3141-19-2](https://code.travail.gouv.fr/code-du-travail/l3141-19-2), [L3141-19-3](https://code.travail.gouv.fr/code-du-travail/l3141-19-3), [L3141-20](https://code.travail.gouv.fr/code-du-travail/l3141-20), [L3141-21-1](https://code.travail.gouv.fr/code-du-travail/l3141-21-1), [L3141-23](https://code.travail.gouv.fr/code-du-travail/l3141-23), [L3141-24](https://code.travail.gouv.fr/code-du-travail/l3141-24), [L3141-32](https://code.travail.gouv.fr/code-du-travail/l3141-32), [R3141-4](https://code.travail.gouv.fr/code-du-travail/r3141-4), [D3141-5](https://code.travail.gouv.fr/code-du-travail/d3141-5), [D3141-6](https://code.travail.gouv.fr/code-du-travail/d3141-6), [D3141-12](https://code.travail.gouv.fr/code-du-travail/d3141-12)
- **Jeunes travailleurs :** [L3162-1](https://code.travail.gouv.fr/code-du-travail/l3162-1), [L3162-3](https://code.travail.gouv.fr/code-du-travail/l3162-3), [L3163-1](https://code.travail.gouv.fr/code-du-travail/l3163-1), [L3163-2](https://code.travail.gouv.fr/code-du-travail/l3163-2), [L3164-1](https://code.travail.gouv.fr/code-du-travail/l3164-1), [L3164-2](https://code.travail.gouv.fr/code-du-travail/l3164-2)
- **Libertés, information et CSE :** [L1121-1](https://code.travail.gouv.fr/code-du-travail/l1121-1), [L1222-4](https://code.travail.gouv.fr/code-du-travail/l1222-4), [L1222-9](https://code.travail.gouv.fr/code-du-travail/l1222-9), [L2242-17](https://code.travail.gouv.fr/code-du-travail/l2242-17), [L2312-1](https://code.travail.gouv.fr/code-du-travail/l2312-1), [L2312-5](https://code.travail.gouv.fr/code-du-travail/l2312-5), [L2312-8](https://code.travail.gouv.fr/code-du-travail/l2312-8), [L2312-38](https://code.travail.gouv.fr/code-du-travail/l2312-38)
- **Paie et intempéries :** [R3243-1](https://code.travail.gouv.fr/code-du-travail/r3243-1), [R3243-4](https://code.travail.gouv.fr/code-du-travail/r3243-4), [L3245-1](https://code.travail.gouv.fr/code-du-travail/l3245-1), [L5424-6](https://code.travail.gouv.fr/code-du-travail/l5424-6), [L5424-8](https://code.travail.gouv.fr/code-du-travail/l5424-8)
- **Convention HCR :** [contribution HCR sur les heures supplémentaires](https://code.travail.gouv.fr/contribution/1979-heures-supplementaires) ; pages conventions [HCR](https://code.travail.gouv.fr/convention-collective/1979-hotels-cafes-restaurants) et [BAD](https://code.travail.gouv.fr/convention-collective/2941-aide-accompagnement-soins-et-services-a-domicile-bad)

### Légifrance : codes, lois, décrets et arrêtés

- L3171-4 : https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000006902808
- Titre VII (L3171-1 à L3172-2) : https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072050/LEGISCTA000006160759/
- L3141-5 (version du 24/12/2025) : https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000033020810/
- Section 3, CSE d'au moins 50 salariés : https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006072050/LEGISCTA000035609482/
- Loi n° 2024-364, art. 37 : https://www.legifrance.gouv.fr/jorf/article_jo/JORFARTI000049453299
- CSS L241-17 : https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000037947458
- CSS D241-21 à D241-25 : https://www.legifrance.gouv.fr/codes/id/LEGISCTA000026407536/
- CSS L241-18-1 : https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000046982267
- CGI, art. 81 quater : https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000046195916
- Décret n° 2024-630 : https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000049832099
- Décret n° 2025-482 : https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000051676074
- Arrêté du 6 mars 2025 (LIC et Mobilic) : https://www.legifrance.gouv.fr/loda/id/JORFTEXT000051347969
- HCR, avenant n° 2 du 05/02/2007 : https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000005670080/?idConteneur=KALICONT000005635534
  - art. 4 : https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000005826386
  - art. 6 : https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000005826388
  - art. 8 : https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000005826390
- Convention BAD, art. 14 : https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000047495024
- Recherches Légifrance utilisées pour identifier les décisions : arrêté du 6 mars 2025, pourvois 20-21.636, 11-28.811, 20-20.648, 22-17.340, SAN-2023-021, 81 quater, convention BAD

### Légifrance : jurisprudence

- Cass. soc. 18/03/2020, n° 18-10.919 : https://www.legifrance.gouv.fr/juri/id/JURITEXT000041845583/
- Cass. soc. 20/02/2013, n° 11-28.811 : https://www.legifrance.gouv.fr/juri/id/JURITEXT000027104181
- Cass. soc. 26/01/2022, n° 20-21.636 : https://www.legifrance.gouv.fr/juri/id/JURITEXT000045097657
- Cass. ass. plén. 22/12/2023, n° 20-20.648 : https://www.legifrance.gouv.fr/juri/id/JURITEXT000048769030
- Cass. soc. 13/09/2023, n° 22-17.340 : https://www.legifrance.gouv.fr/juri/id/JURITEXT000048085897
- Cass. soc. 07/02/2024, n° 22-15.842 : https://www.legifrance.gouv.fr/juri/id/JURITEXT000049130153
- Cass. soc. 10/09/2025, n° 23-14.455 : https://www.legifrance.gouv.fr/juri/id/JURITEXT000052267314
- Cass. soc. 10/09/2025, n° 23-22.732 : https://www.legifrance.gouv.fr/juri/id/JURITEXT000052267316
- Cass. soc. 18/03/2026, n° 24-18.976 : https://www.legifrance.gouv.fr/juri/id/JURITEXT000053765290
- CE 15/12/2017, n° 403776 (Odeolis) : https://www.legifrance.gouv.fr/ceta/id/CETATEXT000036233170/
- CE 23/12/2025, n° 492830 (Amazon France Logistique) : https://www.legifrance.gouv.fr/ceta/id/CETATEXT000053163189
- CNIL SAN-2023-021 : https://www.legifrance.gouv.fr/cnil/id/CNILTEXT000048989272
- CNIL, délibération n° 2019-160 (référentiel gestion du personnel) : https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000041798580
- CNIL, délibération n° 2019-001 (règlement type biométrie) : https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000038277620 et https://www.legifrance.gouv.fr/cnil/id/CNILTEXT000044189179/
- CNIL, délibération n° 2018-327 (liste des AIPD requises) : https://www.legifrance.gouv.fr/cnil/id/CNILTEXT000037560659/
- CNIL, délibération n° 2019-118 (liste des AIPD non requises) : https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000039248939

### CJUE

- Communiqué de presse n° 61/19 (C-55/18, CCOO) : https://curia.europa.eu/jcms/upload/docs/application/pdf/2019-05/cp190061fr.pdf
- EUR-Lex (https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX%3A62018CJ0055) et CURIA : tentatives de lecture infructueuses (contenu vide renvoyé à l'outil)

### CNIL

- Fiche « L'accès aux locaux et le contrôle des horaires sur le lieu de travail » (mise à jour le 17/06/2026) : https://www.cnil.fr/fr/lacces-aux-locaux-et-le-controle-des-horaires-sur-le-lieu-de-travail
- Page thématique : https://www.cnil.fr/fr/lacces-aux-locaux-la-biometrie-et-le-controle-des-horaires
- Référentiel des durées de conservation RH (02/04/2026, mis à jour le 20/05/2026) : https://www.cnil.fr/sites/default/files/2026-04/referentiel_durees_de_conservation_gestion_des_ressources_humaines.pdf
- Présentation de ce référentiel : https://www.cnil.fr/fr/referentiel-durees-conservation-donnees-rh
- Référentiel « gestion du personnel » (2019) : https://www.cnil.fr/sites/default/files/atoms/files/referentiel_grh_novembre_2019_0.pdf
- Géolocalisation des véhicules des salariés : https://www.cnil.fr/fr/la-geolocalisation-des-vehicules-des-salaries
- Biométrie sur le lieu de travail : https://www.cnil.fr/fr/les-dispositifs-de-biometrie-sur-le-lieu-de-travail
- Q/R contrôle d'accès biométrique : https://www.cnil.fr/fr/cnil-direct/question/controle-dacces-biometrique-sur-les-lieux-de-travail-quelles-conditions
- Liste des AIPD requises : https://www.cnil.fr/fr/analyse-dimpact-relative-la-protection-des-donnees-publication-dune-liste-des-traitements-pour et https://www.cnil.fr/sites/cnil/files/atoms/files/liste-traitements-aipd-requise.pdf
- Droit d'accès des salariés : https://www.cnil.fr/fr/le-droit-dacces-des-salaries-leurs-donnees-et-aux-courriels-professionnels
- Sanctions prononcées par la CNIL (page mise à jour le 14/04/2026) : https://www.cnil.fr/fr/les-sanctions-prononcees-par-la-cnil
- Sanction SAN-2024-021 : https://www.cnil.fr/fr/surveillance-excessive-des-salaries-sanction-de-40-000-euros-entreprise-secteur-immobilier
- URL consultée pour la sanction Amazon, qui renvoie « Cet article n'est plus disponible » : https://www.cnil.fr/fr/surveillance-des-salaries-la-cnil-sanctionne-amazon-france-logistique-dune-amende-de-32-millions
- Exemples de clauses de sous-traitance : https://www.cnil.fr/fr/sous-traitance-exemple-de-clauses
- RGPD sur cnil.fr : https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre2, https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre3, https://www.cnil.fr/fr/reglement-europeen-protection-donnees/chapitre4

### Service-Public et autres sites publics

- Jours fériés et ponts (vérifié le 01/01/2026) : https://www.service-public.gouv.fr/particuliers/vosdroits/F2405
- Calcul des congés payés (vérifié le 30/04/2026) : https://www.service-public.gouv.fr/particuliers/vosdroits/F2258
- Congés payés et maladie (A17308) : https://entreprendre.service-public.gouv.fr/actualites/A17308
- Sénat, dossier pjl25-588 (travail le 1er mai) : https://www.senat.fr/dossier-legislatif/pjl25-588.html
- Mobilic : https://beta.gouv.fr/startups/mobilic.html ; https://faq.mobilic.beta.gouv.fr/ ; https://faq.mobilic.beta.gouv.fr/llms.txt ; https://faq.mobilic.beta.gouv.fr/comprendre-ce-quest-mobilic/securite-et-confidentialite-des-donnees.md ; https://faq.mobilic.beta.gouv.fr/usages-et-fonctionnement-de-mobilic-gestionnaire/substituer-mobilic-avec-un-logiciel-metier-interconnexion.md ; https://mobilic.beta.gouv.fr/ (page applicative, contenu non lisible)
- travail-emploi.gouv.fr, décret chaleur : https://travail-emploi.gouv.fr/publication-du-decret-relatif-la-protection-des-travailleurs-contre-les-risques-lies-la-chaleur (bloquée par un contrôle anti-robot, non contourné)

### Sources secondaires (contexte uniquement, non utilisées comme fondement)

- franceinfo, 14/09/2025, retrait de la suppression de deux jours fériés : https://www.franceinfo.fr/economie/budget/budget-sebastien-lecornu-renonce-a-la-suppression-de-deux-jours-feries_7491502.html
- Next, 21/09/2018, sanction CNIL sur une pointeuse biométrique : https://next.ink/7500/107066-dans-sanction-cnil-rappelle-sensibilite-biometrie-au-travail/
- ANDRH, arrêts du 10/09/2025 : https://www.andrh.fr/article/conges-payes-deux-revirements-majeurs-de-la-cour-de-cassation
- Le Mag juridique, Cass. 07/02/2024 : https://www.lemag-juridique.com/veille/articles/social-labsence-de-systeme-objectif-de-mesure-du-temps-de-travail-du-salarie-ne-prive-pas-lemployeur-du-debat-contradictoire-6301.htm

*Fin du rapport. Rappel : ce document ne constitue pas un avis juridique.*
