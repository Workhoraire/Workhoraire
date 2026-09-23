# WorkHoraire : étude de marché et de la concurrence

**Pointage et gestion des temps pour TPE/PME françaises (cible prioritaire : 1 à 49 salariés sortant d'Excel ou du papier)**

Rédigée le 23/09/2026. Toutes les sources ont été consultées le 23/09/2026 (liste complète en fin de document, § 8).

> **Conventions de lecture**
> - Chaque fait est suivi d'un lien vers la page réellement consultée.
> - **Analyse :** signale une déduction ou un calcul de l'auteur, et non un fait sourcé.
> - « n.v. » = non vérifié ; « non trouvé » = aucune source trouvée ; « prix non publié » = aucun tarif affiché sur la page officielle consultée.
> - Les prix sont HT, tels qu'affichés au 23/09/2026. Les devises d'origine sont conservées, sans conversion USD→EUR. « Dès / à partir de » est une borne basse.
> - Les contenus d'éditeurs (pages marketing, blogs, comparatifs publiés par un concurrent) sont déclaratifs et potentiellement biaisés. Ils sont signalés comme tels.
>
> **Glossaire** : GTA = gestion des temps et des activités ; T&A = *time & attendance* ; WFM = *workforce management* ; EVP = éléments variables de paie ; CCN = convention collective ; CHR = cafés-hôtels-restaurants ; ETP = équivalent temps plein.

---

## 0. Synthèse (points clés)

1. **Cible** : en 2024, **1 518 163 entreprises employeuses de 0 à 49 salariés** (régime général, hors agriculture) employaient **8 218 154 salariés** en moyenne. Parmi elles, **1 302 504 entreprises de 0 à 9 salariés** comptent 3 823 218 salariés, soit **2,9 salariés par entreprise** en moyenne et un site quasi unique ([open.urssaf.fr – API données 2024](https://open.urssaf.fr/api/explore/v2.1/catalog/datasets/nombre-etab-effectifs-salaries-et-masse-salariale-secteur-prive-tranche-ent/records?limit=20&order_by=annee%20desc&select=annee,tranche_d_effectif,nombre_d_entreprises,nombre_d_etablissements,effectifs_salaries_moyens)). Les moyennes et parts sont des calculs de l'auteur (**Analyse**).
2. **Marché mondial T&A** : les estimations 2025 vont de **3,3 Md$** ([imarcgroup.com](https://www.imarcgroup.com/time-attendance-software-market)) à **3,72 Md$** ([thebusinessresearchcompany.com](https://www.thebusinessresearchcompany.com/report/time-and-attendance-software-global-market-report)), puis 4,11 à 4,31 Md$ en 2026 ([mordorintelligence.com – T&A](https://www.mordorintelligence.com/industry-reports/time-and-attendance-software-market)). Les projections divergent d'un facteur 2 : 5,7 Md$ en 2034 (IMARC) contre 11,92 Md$ en 2035 ([marketresearchfuture.com](https://www.marketresearchfuture.com/reports/time-and-attendance-software-market-21975)). Aucun chiffre public fiable n'a été trouvé pour le marché GTA France.
3. **Équipement** :
   - 69 % des TPE de 1 à 9 salariés disposent d'un « logiciel de gestion, comptabilité ou RH », une catégorie large ([ifop.com – vague 4](https://www.ifop.com/wp-content/uploads/2024/07/120745-presentation-barometre-de-la-digitalisation-des-tpe-vague-4.pdf)).
   - Environ **35 % des établissements de 1 à 9 salariés exploitent leurs données RH/paie** pour piloter leur activité, contre 69 % des 10 à 49 salariés. C'est un calcul de l'auteur à partir des microdonnées France Num 2025 ([data.economie.gouv.fr – item 740](https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/bfn-resultats-2025/records?select=taille_etablissement,libelle_reponse,sum(poids)%20as%20w,count(*)%20as%20n&where=code_unifie=%22740%22&group_by=taille_etablissement,libelle_reponse&limit=100)).
   - Aucune étude publique récente mesurant spécifiquement l'usage d'un logiciel de pointage par les TPE n'a été trouvée.
4. **Concurrence fragmentée**, où le top 10 mondial ne pèse que 25 % des revenus ([thebusinessresearchcompany.com](https://www.thebusinessresearchcompany.com/report/time-and-attendance-software-global-market-report)). Elle se répartit en six familles :
   - Spécialistes FR du planning et du pointage terrain, facturés par établissement : Combo, Skello, Shyfter.
   - SIRH modulaires facturés par salarié : Lucca, Eurécia, Factorial, Sesame, Bizneo.
   - GTA « lourde » sur devis : Kelio, Octime, Horoquartz, Nibelis.
   - Paie incluant le pointage : PayFit, badgeuse Silae RH.
   - Freemium internationaux sans intégration paie FR vérifiée : Jibble, Connecteam, Clockify.
   - Un pure player TPE français, Pointeo : gratuit jusqu'à 3 salariés, puis dès 19 €/mois ([easypointage.fr](https://easypointage.fr/)).
5. **Prix** : les planchers par établissement démarrent à 39 €/mois (Shyfter), 59 €/mois (Skello Badgeuse Standard) et 60 €/mois plus 2 € par salarié pour la pointeuse (Combo) ([skello.io/pricing](https://www.skello.io/pricing), [combohr.com/fr/pricing](https://combohr.com/fr/pricing), [shyfter.com/en/pricing](https://shyfter.com/en/pricing)). Les offres par utilisateur coûtent environ 3 à 7 € par salarié et par mois. **Analyse :** pour une TPE moyenne de 2,9 salariés, les offres par établissement reviennent à environ 20 € par salarié et par mois, contre environ 5,5 € pour une offre par utilisateur.
6. **Tendances** :
   - Obligation de mesurer le temps de travail : CJUE 2019, Allemagne 2022, projet espagnol de registre exclusivement numérique.
   - Encadrement CNIL : la biométrie et la photo systématique sont jugées excessives pour le contrôle des horaires, et la géolocalisation n'est admise qu'à titre subsidiaire.
   - Kiosque tablette partagé, convergence paie/temps autour de Silae et PayFit, hébergement France/UE.
   - L'IA est mise en avant dans les offres haut de gamme, mais **77 % des dirigeants de TPE n'envisagent pas d'outils IA** ([ifop.com – vague 4](https://www.ifop.com/wp-content/uploads/2024/07/120745-presentation-barometre-de-la-digitalisation-des-tpe-vague-4.pdf)).
7. **Opportunité (Analyse)** : un pointage conforme au droit français, simple et facturé par salarié actif sans plancher par établissement. L'offre d'entrée inclurait l'export Silae, le kiosque avec pointage mobile et PC, un journal d'audit et une conception respectueuse de la vie privée. Elle viserait les **TPE de 1 à 9 salariés hors CHR/retail organisés en shifts**, avec une distribution via les **experts-comptables**. **Risques** : Pointeo occupe déjà ce créneau ; les gratuits internationaux tirent les prix vers le bas ; les suites de paie intègrent un pointage « suffisant ».

---

## 1. Taille du marché et cible

### 1.1 Entreprises en France par catégorie (INSEE, dernière édition : données 2023)

**Tableau 1 : catégories d'entreprises en 2023.** Champ : secteurs principalement marchands non agricoles et non financiers. Source : INSEE Focus n° 372 du 10/12/2025, par L. Léveillé et S. Oparowski ([insee.fr/fr/statistiques/8675639](https://www.insee.fr/fr/statistiques/8675639)).

| Catégorie | Nombre d'entreprises | Effectifs salariés (milliers d'ETP) | Part des ETP | Part de la valeur ajoutée |
|---|---:|---:|---:|---:|
| Microentreprises (MIC) | 4 042 715 | 2 524,2 | 17,0 % | 16,3 % |
| PME hors MIC | 163 992 | 4 323,9 | 29,1 % | 23,2 % |
| ETI | 7 031 | 3 826,0 | 25,8 % | 26,4 % |
| Grandes entreprises | 312 | 4 167,9 | 28,1 % | 34,1 % |

- Définitions INSEE ([insee.fr/fr/statistiques/8675639](https://www.insee.fr/fr/statistiques/8675639)) :
  - **Microentreprise** : moins de 10 personnes, et chiffre d'affaires annuel ou total de bilan n'excédant pas 2 M€.
  - **PME** : moins de 250 personnes, et chiffre d'affaires d'au plus 50 M€ ou total de bilan d'au plus 43 M€.
- Vue élargie dans « L'essentiel sur les entreprises » (mis à jour le 26/01/2026, données 2023) : 5,2 millions d'entreprises marchandes non agricoles et non financières, 15,9 millions de salariés en ETP. On y compte 4 995 894 microentreprises (96,5 %), 174 614 PME hors MIC (3,4 %), 7 442 ETI et 333 grandes entreprises ([insee.fr/fr/statistiques/5424748](https://www.insee.fr/fr/statistiques/5424748)).
- ⚠️ Les microentreprises INSEE incluent les entreprises **sans salarié**. Pour la cible de WorkHoraire, il faut donc compter les **entreprises employeuses** (§ 1.2).

### 1.2 Entreprises employeuses par taille (Urssaf, données 2024)

**Tableau 2 : entreprises employeuses du secteur privé par tranche d'effectif en 2024** ([open.urssaf.fr – API données 2024](https://open.urssaf.fr/api/explore/v2.1/catalog/datasets/nombre-etab-effectifs-salaries-et-masse-salariale-secteur-prive-tranche-ent/records?limit=20&order_by=annee%20desc&select=annee,tranche_d_effectif,nombre_d_entreprises,nombre_d_etablissements,effectifs_salaries_moyens)).

| Tranche (salariés) | Entreprises | Établissements | Effectifs salariés moyens |
|---|---:|---:|---:|
| 0 à 9 | 1 302 504 | 1 333 298 | 3 823 218 |
| 10 à 19 | 133 567 | 158 934 | 1 844 804 |
| 20 à 49 | 82 092 | 119 631 | 2 550 132 |
| 50 à 99 | 25 373 | 52 514 | 1 742 483 |
| 100 à 249 | 14 547 | 54 404 | 2 234 757 |
| 250 à 499 | 4 519 | 33 470 | 1 555 680 |
| 500 à 1 999 | 2 967 | 65 172 | 2 633 591 |
| 2 000 et plus | 640 | 82 210 | 3 888 810 |

Caractéristiques du jeu de données ([open.urssaf.fr – fiche du jeu de données](https://open.urssaf.fr/explore/dataset/nombre-etab-effectifs-salaries-et-masse-salariale-secteur-prive-tranche-ent/information/)) :
- Champ : « Établissements employeurs du secteur privé, régime général, hors agriculture, hors Mayotte ».
- Une entreprise est comptée lorsqu'elle déclare une masse salariale sur le trimestre.
- L'effectif est la moyenne des effectifs trimestriels.
- Les apprentis sont inclus depuis un changement de méthode le 15/09/2023.

**Analyse (calculs de l'auteur à partir du tableau 2) :**

| Segment | Entreprises | Part des entreprises employeuses | Salariés | Part des salariés | Salariés par entreprise | Établissements par entreprise |
|---|---:|---:|---:|---:|---:|---:|
| **0–49 (cible WorkHoraire)** | **1 518 163** | **96,9 %** | **8 218 154** | **40,5 %** | 5,4 | – |
| 0–9 (cœur TPE) | 1 302 504 | 83,2 % | 3 823 218 | 18,9 % | 2,9 | 1,02 |
| 10–49 | 215 659 | 13,8 % | 4 394 936 | 21,7 % | 20,4 | 1,29 |
| Total, toutes tailles | 1 566 209 | 100 % | 20 273 475 | 100 % | 12,9 | – |

- Évolution 2023 → 2024 : les entreprises de 0 à 9 salariés passent de 1 314 379 à 1 302 504 (−0,9 %). Celles de 10 à 19 salariés sont stables (133 602 → 133 567) et celles de 20 à 49 salariés progressent légèrement (81 912 → 82 092, +0,2 %) ([open.urssaf.fr – API](https://open.urssaf.fr/api/explore/v2.1/catalog/datasets/nombre-etab-effectifs-salaries-et-masse-salariale-secteur-prive-tranche-ent/records?limit=20&order_by=annee%20desc&select=annee,tranche_d_effectif,nombre_d_entreprises,nombre_d_etablissements,effectifs_salaries_moyens)). Les pourcentages sont calculés par l'auteur.
- **Analyse :** le cœur de cible est très majoritairement mono-site, avec 1,02 établissement par entreprise de 0 à 9 salariés. Une tarification **par établissement** pèse donc sur un petit nombre de salariés (voir § 3.2).

### 1.3 Taille du marché des logiciels T&A et WFM (mondial, Europe, France)

**Tableau 3 : estimations publiques.** Seuls les résumés publics ont été consultés, les rapports complets étant payants.

| Cabinet | Périmètre | Valeur de base | Projection | TCAC | Autres données publiques | Mise à jour | Source |
|---|---|---|---|---|---|---|---|
| The Business Research Company | Logiciels T&A, monde | 3,72 Md$ (2025) ; 4,11 Md$ (2026) | 6,06 Md$ (2030) | 10,4 % (2026–2030) | Europe de l'Ouest : 784,64 M$ (2025) ; Amérique du Nord 1er ; top 10 = 25 % des revenus | Sept. 2026 | [thebusinessresearchcompany.com](https://www.thebusinessresearchcompany.com/report/time-and-attendance-software-global-market-report) |
| Mordor Intelligence | Logiciels T&A, monde | 4,31 Md$ (2026) | 6,37 Md$ (2031) | 8,1 % | Cloud : 71,25 % (2025) ; grandes entreprises : 44,35 % (2025) ; Amérique du Nord : 34,55 % ; conformité : +12,8 %/an | 11/09/2026 | [mordorintelligence.com – T&A](https://www.mordorintelligence.com/industry-reports/time-and-attendance-software-market) |
| IMARC Group | Logiciels T&A, monde | 3,3 Md$ (2025) | 5,7 Md$ (2034) | 6,29 % (2026–2034) | Amérique du Nord > 37,8 % (2025) | 21/06/2026 | [imarcgroup.com](https://www.imarcgroup.com/time-attendance-software-market) |
| Market Research Future | Logiciels T&A, monde | 3,262 Md$ (2024) ; 3,67 Md$ (2025) | 11,92 Md$ (2035) | 12,5 % (2025–2035) | ⚠️ La même page affiche aussi 4,28 Md$ (2025), 10,94 Md$ (2035) et 8,70 % ; Europe : 1,19 Md$ ; France : « 21,4 % share of region » ; PME : +12,2 %/an | 09/09/2026 | [marketresearchfuture.com](https://www.marketresearchfuture.com/reports/time-and-attendance-software-market-21975) |
| Mordor Intelligence | WFM, monde (périmètre plus large) | 9,36 Md$ (2025) ; 9,76 Md$ (2026) | 12,04 Md$ (2031) | 4,29 % | PME : +6,44 %/an ; Europe ≈ 28 % (2025) ; cloud : 63,81 % | 23/07/2026 | [mordorintelligence.com – WFM](https://www.mordorintelligence.com/industry-reports/workforce-management-software-market-industry) |
| Markess by Exægis (cité par RH Matin) | SIRH France (tout le SIRH, pas seulement la GTA) | 4,5 Md€ (2024) | – | +8 %/an depuis 2021 | – | Article du 29/01/2024 | [rhmatin.com – tendances SIRH 2024](https://www.rhmatin.com/sirh/sirh-saas/tendances-sirh-2024-un-marche-dynamique-et-innovant-au-service-de-la-performance-operationnelle.html) |

**Écarts entre sources (constat chiffré) :**
- 2025 : de 3,3 Md$ (IMARC) à 3,72 Md$ (TBRC), soit environ 13 % d'écart. MRFR donne deux valeurs contradictoires, 3,67 et 4,28 Md$.
- 2026 : 4,11 Md$ (TBRC) contre 4,31 Md$ (Mordor), soit environ 5 % d'écart.
- Horizon 2034–2035 : 5,7 Md$ (IMARC) contre 11,92 Md$ (MRFR), soit un facteur de 2,1. Les TCAC vont de 6,3 % à 12,5 %.
- **Analyse :** ces écarts s'expliquent par des périmètres différents (matériel et services inclus ou non, T&A ou WFM) et des méthodes non publiées. Les chiffres de MRFR sont incohérents sur une même page et ne doivent pas être utilisés seuls.

**France :**
- **Non trouvé** : aucun chiffre public et gratuit sur la taille du marché GTA ou pointage en France. Le Blueprint Exaegis 2025/2026 qualifie ce marché de « mature en stock » mais « très actif en flux », sans le chiffrer ([exaegis.com – Blueprint GTA](https://exaegis.com/actualites/blueprint-gta-gestion-des-temps-activit%C3%A9s-et-planification-des-ressources-2025/2026)).
- **Analyse :** en appliquant la part France de MRFR (21,4 %) à l'Europe (1,19 Md$), on obtient environ 255 M$ pour la France, toutes tailles d'entreprises confondues. Fiabilité faible : source incohérente et année non précisée.

**Analyse : plafond théorique du potentiel TPE/PME 1–49 en France (calcul de l'auteur, pas un marché observé)**
- Formule : 8 218 154 salariés × 12 mois × prix unitaire. La fourchette de prix, de 2 à 6 € par salarié et par mois, correspond aux prix publics par utilisateur du § 3.
- Résultat : **197 M€/an à 2 €, 394 M€/an à 4 € et 592 M€/an à 6 €**, si 100 % des salariés étaient équipés.
- Le montant réellement captable est bien inférieur : équipement partiel, gratuits, offres groupées avec la paie.

### 1.4 Taux d'équipement des TPE/PME en outils RH / SIRH

| Indicateur | Population | Valeur | Remarques | Source |
|---|---|---|---|---|
| Disposent d'un « logiciel de gestion, comptabilité ou RH » | 613 dirigeants de TPE de 1 à 9 salariés, par téléphone du 29/04 au 27/05/2024, méthode des quotas (IFOP pour Oxygen/Mastercard) | **69 %** en mai 2024, contre 68 % en mars 2023, 62 % en janvier 2022 et 65 % en décembre 2020. **29 %** n'en ont pas et n'ont pas l'intention de s'équiper ; 2 % en projet | Catégorie agrégée (gestion + compta + RH) : **ne mesure pas l'équipement en pointage/GTA** | [ifop.com – vague 4](https://www.ifop.com/wp-content/uploads/2024/07/120745-presentation-barometre-de-la-digitalisation-des-tpe-vague-4.pdf) |
| « Exploitez-vous les données suivantes de votre entreprise pour piloter l'activité ? », item « RH / paie » | Baromètre France Num 2025 (DGE), 11 021 répondants | Global **40,0 %** ; 0 salarié : 32,4 % ; **1 à 9 : 34,6 %** ; **10 à 49 : 69,2 %** ; 50 à 249 : 91,2 % | **Calcul de l'auteur** : part pondérée (somme des poids) des « Oui », par taille d'établissement, sur les microdonnées ouvertes. Mesure l'exploitation des données, **pas l'équipement logiciel** | [data.economie.gouv.fr – item 740 (pondérations)](https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/bfn-resultats-2025/records?select=taille_etablissement,libelle_reponse,sum(poids)%20as%20w,count(*)%20as%20n&where=code_unifie=%22740%22&group_by=taille_etablissement,libelle_reponse&limit=100) ; [libellé de la question](https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/bfn-resultats-2025/records?select=libelle_unifie,descriptif_de_question,valeurs_dans_calcul&where=code_unifie=%22740%22&limit=1) |
| Item « taux d'équipement en logiciel RH/paie » dans France Num 2025 | – | **Non trouvé** parmi les libellés contenant « logiciel », « gestion » ou « planning ». Seuls existent des items compta, caisse, CRM, achats, production, etc. | Le chiffre de « 40 % » parfois repris correspond à l'**exploitation des données RH/paie**, pas à un équipement | [data.economie.gouv.fr – liste des items](https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/bfn-resultats-2025/records?select=code_unifie,libelle_unifie,count(*)%20as%20n&where=search(libelle_unifie,%22logiciel%22)%20or%20search(libelle_unifie,%22gestion%22)%20or%20search(libelle_unifie,%22planning%22)&group_by=code_unifie,libelle_unifie&limit=100) |
| Dynamique du marché GTA (ETI/PME) | 26 fournisseurs analysés, publication du 11/03/2026 | Citation : « nombreux projets de primo-équipement 'structurant', ainsi que des migrations d'Excel ou d'outils internes » | Qualitatif ; concerne plutôt le mid-market | [exaegis.com – Blueprint GTA](https://exaegis.com/actualites/blueprint-gta-gestion-des-temps-activit%C3%A9s-et-planification-des-ressources-2025/2026) |
| Témoignage d'un cabinet comptable | Consultante SIRH de Baker Tilly, dans un article de Combo mis à jour le 03/10/2024 | Citation : « 80% des clients ne sont pas équipés digitalement » | Anecdotique et promotionnel, périmètre non précisé | [combohr.com – partenariat Baker Tilly](https://combohr.com/fr/blog/partenariat-baker-tilly-combo) |
| Qui gère la paie des très petites entreprises | Entreprises de 1 à 5 salariés | Citation : « majoritairement par les experts comptables, avec seulement 15% pour les sociétés éditrices de logiciels ». Un sondage IFOP situe la paie à environ 10 % du CA des experts-comptables, soit plus de 900 M€ | **Non daté, source primaire non retrouvée, fiabilité faible** | [fiche-de-paie.fr](https://www.fiche-de-paie.fr/externalisation-de-la-paie-tour-dhorizon/) |
| Part des TPE/PME utilisant un logiciel de pointage/GTA plutôt qu'Excel ou le papier | – | **Non trouvé** : aucune étude publique récente identifiée | – | – |

---

## 2. Paysage concurrentiel

### 2.1 Typologie

| Famille | Acteurs étudiés | Modèle de prix dominant | Positionnement |
|---|---|---|---|
| Planning et pointage « équipes terrain » | Combo, Skello, Shyfter, Shiftbase, Agendrix, Planday | Par établissement (Combo, Skello, Shyfter) ou par utilisateur (Agendrix, Shiftbase, Planday) | Restauration, commerce et santé organisés en shifts |
| SIRH modulaires avec module Temps | Lucca, Eurécia, Factorial, Sesame HR, Bizneo HR | Par salarié, souvent dégressif, avec parfois un minimum | PME et ETI |
| GTA « historique » avec badgeuses | Kelio (Bodet), Octime, Horoquartz, Nibelis | Prix non publié, matériel éventuel | PME à grands comptes, secteur public |
| Paie incluant le pointage | PayFit, Silae (badgeuse Silae RH), Kelio (123Paie), Nibelis | Groupé avec la paie | Paie d'abord |
| Freemium internationaux | Jibble, Connecteam, Clockify | Gratuit, puis prix par siège en USD | Généralistes |
| Pure player TPE français | Pointeo | Gratuit jusqu'à 3 salariés, puis forfait | TPE/PME françaises |

- Preuve de présence en France pour les acteurs historiques : le Blueprint Exaegis GTA 2025/2026 analyse 26 fournisseurs présents en France. On y trouve notamment ADP, Combo, Horoquartz, Kelio, Lucca, Nibelis, Octime, Protime (SD Worx), Skello, Tamigo et UKG ([exaegis.com – Blueprint GTA](https://exaegis.com/actualites/blueprint-gta-gestion-des-temps-activit%C3%A9s-et-planification-des-ressources-2025/2026)).

### 2.2 Tableau de synthèse : 20 solutions retenues, présence en France vérifiée sauf mention

| # | Solution | Preuve de présence en France | Cible déclarée | Modèle | Prix d'entrée public (pointage) | Page tarifs |
|---|---|---|---|---|---|---|
| 1 | **Combo** (ex-Snapshift) | Site et tarifs FR ; Blueprint Exaegis | Équipes terrain : hôtellerie, boulangerie, commerce, restauration, pharmacie… ; « 10 000+ entreprises » ([combohr.com](https://combohr.com/)) | Par établissement, prix progressif selon le nombre de salariés, plus options par employé | Time dès 60 €/mois/établissement, plus pointeuse à 2 €/employé/mois | [combohr.com/fr/pricing](https://combohr.com/fr/pricing) |
| 2 | **Skello** | Site FR ; 80 % de clients français ([rhmatin.com – Skello](https://www.rhmatin.com/sirh/sirh-saas/planification-rh-comment-skello-avance-en-europe-et-sur-l-ia.html)) | Hôtellerie-restauration, commerce, santé, BTP, industrie, services ([skello.io – badgeuses](https://www.skello.io/fonctionnalites/suivi-des-temps-de-travail/badgeuses)) | Par établissement (« Dès ») | Badgeuse Standard dès 59 €/mois | [skello.io/pricing](https://www.skello.io/pricing) |
| 3 | **Kelio** (Bodet Software) | kelio.com/fr, adresse à Cholet ; leader du Blueprint 2026 | PME à grands comptes ; « 20 000 clients » ([kelio.com/fr](https://www.kelio.com/fr/)) | Sur devis, matériel éventuel | Prix non publié | [kelio.com/fr](https://www.kelio.com/fr/) |
| 4 | **Lucca** (Feuilles de temps) | lucca.fr, bureaux à Paris, Nantes et Marseille ([lucca.fr](https://www.lucca.fr/)) | PME et ETI ; cible déclarée « 150–200 salariés » ([rhmatin.com – Lucca × Silae](https://www.rhmatin.com/sirh/sirh-et-paie-lucca-et-silae-trouvent-un-terrain-d-entente-par-les-api.html)) | Par collaborateur, dégressif ; forfait pour les petites équipes | 3,00 € HT/collab/mois (indicatif, +100 collaborateurs) | [lucca.fr – tarifs Feuilles de temps](https://www.lucca.fr/suivi-des-temps/timesheet/tarifs) |
| 5 | **Factorial** | factorial.fr, prix en € | PME (n.v.) | Par utilisateur, plan sur mesure | Dès 6,9 €/utilisateur/mois (module Temps non isolé) | [factorial.fr/tarifs](https://factorial.fr/tarifs) |
| 6 | **PayFit** | payfit.com, prix en € | TPE/PME, paie | Base mensuelle plus prix par salarié | GTA incluse à partir de « Paie Avancée » : 27 €/salarié + 49 €/mois | [payfit.com/pricing-lp](https://payfit.com/pricing-lp/) |
| 7 | **Eurécia** | « Données stockées en France » ([eurecia.com – pointeuse](https://www.eurecia.com/fonctionnalites/logiciel-pointeuse-badgeuse)) | TPE 1–10 via expert-comptable ; PME/ETI 11–500 | Par collaborateur, par packs de 10, dégressif | Dès 4,20 €/collab/mois (11–500) | [eurecia.com/tarifs](https://www.eurecia.com/tarifs) |
| 8 | **Shiftbase** | Site FR ([shiftbase.com/fr](https://www.shiftbase.com/fr)), prix en € | Entreprises organisées en shifts ; « 8 000+ entreprises » | Base mensuelle plus prix par salarié | Basic 30 €/mois (6 salariés inclus) + 4 €/salarié | [shiftbase.com/pricing](https://www.shiftbase.com/pricing) |
| 9 | **Agendrix** | Pages fr-fr, prix en € | PME | Par utilisateur actif | 3,25 € + 2,25 € (module Temps et présences) par utilisateur et par mois | [agendrix.com/fr-fr/prix](https://www.agendrix.com/fr-fr/prix) |
| 10 | **Jibble** | jibble.io/fr | Tous | Freemium | Gratuit, utilisateurs illimités ; prix des plans payants n.v. | [jibble.io/fr/plans-d-amelioration](https://www.jibble.io/fr/plans-d-amelioration) |
| 11 | **Clockify** | clockify.me/fr | Tous | Par siège, plus sièges kiosque | Gratuit jusqu'à 5 utilisateurs ; Basic 3,99 $/siège/mois (annuel) | [clockify.me/pricing](https://clockify.me/pricing) |
| 12 | **Connecteam** | ⚠️ Page FR introuvable (404) ; prix en $ : **présence FR n.v.** | Équipes terrain | Forfait jusqu'à 30 utilisateurs, puis prix par utilisateur | Gratuit jusqu'à 10 utilisateurs ; Basic 29 $/mois (annuel) | [connecteam.com/pricing](https://connecteam.com/pricing/) |
| 13 | **Octime** (Expresso) | octime.com ; Blueprint | 25 à 200 salariés, multisectoriel ([octime.com/expresso](https://www.octime.com/expresso/)) | SaaS | Prix non publié | [octime.com/expresso](https://www.octime.com/expresso/) |
| 14 | **Horoquartz** (eTemptation / eTSentiel) | horoquartz.com, Massy ; Blueprint | PME-PMI (eTSentiel) à grands comptes, secteur public | – | Prix non publié | [horoquartz.com/etemptation](https://www.horoquartz.com/etemptation/) |
| 15 | **Planday** | planday.com/fr | Entreprises organisées en shifts | Par utilisateur, minimum 5 utilisateurs | Montants non affichés dans le contenu consulté | [planday.com/fr/tarifs](https://www.planday.com/fr/tarifs/) |
| 16 | **Sesame HR** | sesamehr.fr, France listée ; « plus de 20 000 clients » ([sesamehr.fr](https://www.sesamehr.fr/)) | PME, **au moins 15 salariés** | Par salarié actif | Essential 3,75 $/salarié/mois | [sesamehr.com/pricing](https://www.sesamehr.com/pricing/) |
| 17 | **Bizneo HR** | bizneo.com/fr, clients français cités ([bizneo.com/fr](https://www.bizneo.com/fr/)) | PME, ETI, grands comptes | Par salarié | « from US$6 » par employé et par mois | [bizneo.com/en/pricing](https://www.bizneo.com/en/pricing/) |
| 18 | **Shyfter** | Locale fr-fr sur la page tarifs | Hôtellerie, commerce, santé… (n.v.) | Forfait mensuel | Time tracking : 39 €/mois | [shyfter.com/en/pricing](https://shyfter.com/en/pricing) |
| 19 | **Pointeo** (easypointage.fr) | « TPE et PME françaises », « Hébergé en France » ; **éditeur non identifié sur la page** | TPE/PME | Freemium plus forfait | Gratuit jusqu'à 3 employés, puis dès 19 €/mois HT | [easypointage.fr](https://easypointage.fr/) |
| 20 | **Silae** (badgeuse Silae RH) et **Nibelis** | silae.fr ; nibelis.com, Blueprint | Silae : cabinets et entreprises (1 M d'entreprises via ses partenaires) ; Nibelis : 50 à 250 salariés et plus | Groupé avec la paie | Prix non publié | [silae-rh.zendesk.com – Badgeuse](https://silae-rh.zendesk.com/hc/fr/articles/18904979890578--Badgeuse) ; [nibelis.com – GTA](https://nibelis.com/produits-suite-rh-logiciel-gta-presence/) |

**Acteur écarté :**
- **Folk HR / Folks RH**, écarté faute de présence en France vérifiée.
- folkhr.com est inaccessible (HTTP 500) ([folkhr.com](https://folkhr.com/)).
- Folks RH se présente comme un logiciel conçu pour les PME canadiennes, et la France n'y est pas mentionnée ([folksrh.com/en](https://folksrh.com/en/)).

### 2.3 Matrice des modes de pointage

Légende : ✓ = confirmé par la source ; ✗ = explicitement non proposé ; – = non mentionné dans la source consultée (n.v.).

| Solution | Web/PC | App mobile | Tablette / kiosque partagé | QR code | Géolocalisation | Badgeuse physique (RFID/terminal) | Biométrie | Photo | Source |
|---|---|---|---|---|---|---|---|---|---|
| Combo | ✗ (« pas sur PC, Mac ou navigateur web ») | ✗ (tablette d'au moins 8'' requise) | ✓ (code PIN + signature) | ✗ | ✓ optionnelle, « ne bloque pas le pointage hors zone » | ✗ | ✗ | ✓ aléatoire, optionnelle | [guide.combohr.com](https://guide.combohr.com/fr/articles/4521867-qu-est-ce-que-la-pointeuse-combo) |
| Skello | – | ✓ | ✓ (code PIN) | – | ✓ | – | – | ✓ optionnelle | [skello.io – badgeuses](https://www.skello.io/fonctionnalites/suivi-des-temps-de-travail/badgeuses) |
| Kelio | ✓ (déclaration web) | – | – | – | – | ✓ | ✓ (empreinte ; GTA et accès) | – | [kelio.com/fr](https://www.kelio.com/fr/) ; [kelio.com – biométrie](https://www.kelio.com/hardware/clocking-in/biometric-clocking-terminals.html) |
| Lucca | ✓ (badgeuse virtuelle, déclaratif) | – | – | – | – | ✓ | – | – | [lucca.fr – Feuilles de temps](https://www.lucca.fr/suivi-des-temps/timesheet/) |
| Factorial | ✓ | ✓ (hors-ligne) | ✓ (identifiant sur appareil partagé) | ✓ | ✓ | – | ✗ en Europe : reconnaissance faciale indisponible depuis le 01/10/2024 | – | [help.factorialhr.com – suivi du temps](https://help.factorialhr.com/fr_FR/suivi-du-temps/a-propos-du-systeme-de-suivi-du-temps) |
| PayFit | – | ✓ (« pointeuse digitale ») | – | – | – (non mentionnée) | – | – | – | [payfit.com – GTA](https://payfit.com/fr/gestion-des-temps-et-activites/) |
| Eurécia | ✓ (ordinateur) | ✓ (badge virtuel + QR) | – | ✓ | – | ✓ (RFID) ; code PIN | – | – | [eurecia.com – pointeuse](https://www.eurecia.com/fonctionnalites/logiciel-pointeuse-badgeuse) |
| Shiftbase | ✓ (« depuis n'importe quel appareil ») | ✓ (même mention) | ✓ (1 kiosque en Basic, illimité en Premium et au-delà) | – | – | – | – | – | [shiftbase.com/fr](https://www.shiftbase.com/fr) ; [shiftbase.com/pricing](https://www.shiftbase.com/pricing) |
| Agendrix | ✓ (ordinateur) | ✓ | ✓ (tablette) | – | ✓ (géorepérage) | ✓ (RFID : carte, puce, badge, jeton) | – | – | [agendrix.com – RFID](https://www.agendrix.com/fr-fr/pointeuse-badgeuse-rfid) |
| Jibble | ✓ | ✓ | ✓ | – | ✓ (GPS) | – | ✓ (reconnaissance faciale) | – | [jibble.io/upgrade-plans](https://www.jibble.io/upgrade-plans) |
| Clockify | ✓ (minuteur, feuille de temps) | – | ✓ (à partir de Basic) | – | ✓ (GPS, plan Pro) | – | – | – | [clockify.me/pricing](https://clockify.me/pricing) ; [clockify.me/fr](https://clockify.me/fr/) |
| Connecteam | – | – | ✓ (« Kiosk Station ») | – | ✓ (géorepérage à partir d'Advanced) | – | – | – | [connecteam.com/pricing](https://connecteam.com/pricing/) |
| Octime | ✓ (badgeuse virtuelle) | ✓ (myOCTIME) | – | – | – | ✓ (terminaux ID-SENSE et ID-ROCK) | ✗ (« La CNIL ne permet pas l'usage de badgeuse biométrique… ») | – | [octime.com – badgeuses](https://www.octime.com/badgeuse-pointeuse/) |
| Horoquartz | ✓ | ✓ (mTemptation) | – | – | – | ✓ (badgeuses, Pulsi) | – | – | [horoquartz.com/etemptation](https://www.horoquartz.com/etemptation/) |
| Planday | – (« pointage simple ») | – | – | – | – | – | – | – | [planday.com/fr/tarifs](https://www.planday.com/fr/tarifs/) |
| Sesame HR | – (modes non détaillés) | – | – | – | – | – | – | – | [sesamehr.fr](https://www.sesamehr.fr/) |
| Bizneo HR | ✓ | ✓ | ✓ (code PIN ou QR) | ✓ | ✓ | ✓ (RFID, tourniquets : contrôle d'accès) | ✓ (empreinte : contrôle d'accès) | – | [bizneo.com/en/pricing](https://www.bizneo.com/en/pricing/) |
| Shyfter | – | ✓ | ✓ (tablette) | ✓ | ✓ | – | – | ✓ (« Photo verification ») | [shyfter.com/en/pricing](https://shyfter.com/en/pricing) |
| Pointeo | ✓ (web multi-sites) | ✓ (iOS/Android) | ✓ (code PIN sur tablette) | ✓ | ✓ (GPS) | – | – | – | [easypointage.fr](https://easypointage.fr/) |
| Silae RH | ✓ (navigateur, sur ordinateur ou mobile) | – | – | – | – | – | – | – | [silae-rh.zendesk.com – Badgeuse](https://silae-rh.zendesk.com/hc/fr/articles/18904979890578--Badgeuse) |
| Nibelis | ✓ (pointeuse virtuelle, saisie horaire, déclaration hebdomadaire) | – | – | – | – | ✓ (facultative) | – | – | [nibelis.com – GTA](https://nibelis.com/produits-suite-rh-logiciel-gta-presence/) |

### 2.4 Matrice planning, absences, paie et conformité

| Solution | Planning | Absences / congés | Export ou intégration paie (vérifié) | Conformité et audit (vérifié) | Source |
|---|---|---|---|---|---|
| Combo | ✓ | ✓ (gestion avancée dans l'offre People) | Export paie simple (Time) ; « au format de vos outils (PayFit, Sigma…) » (People) ; **Silae en option à +1,5 €/employé/mois** | Rappels des règles de convention collective ; heures réelles validées par le manager avant clôture | [combohr.com/fr/pricing](https://combohr.com/fr/pricing) ; [combohr.com](https://combohr.com/) ; [guide.combohr.com](https://guide.combohr.com/fr/articles/4521867-qu-est-ce-que-la-pointeuse-combo) |
| Skello | ✓ (génération automatique et IA dans Max) | ✓ | Silae, PayFit, Sage, ADP, Cegid, Lucca, plus les caisses Lightspeed et L'addition | Alertes de retard, suivi des heures sup, seuils de tolérance | [skello.io/en/pricing](https://www.skello.io/en/pricing) ; [skello.io – comptables](https://www.skello.io/comptables-et-pro-de-la-paie) ; [skello.io – badgeuses](https://www.skello.io/fonctionnalites/suivi-des-temps-de-travail/badgeuses) |
| Kelio | ✓ | ✓ | Paie en ligne « 123Paie » ; intégration avec les outils de paie et SIRH | Plusieurs conventions collectives, annualisation, « moteur de calcul paramétrable » | [kelio.com/fr](https://www.kelio.com/fr/) ; [kelio.com – Blueprint](https://www.kelio.com/fr/societe/actualites/1267-kelio-positionne-leader-solutions-gta-planification-blueprint-markess.html) |
| Lucca | Semaines types | ✓ (module Absences, facturé à part) | Export des EVP ; partenariat API avec Silae (janvier 2024) | Détection des « dépassements, les retards, les repos, le travail de nuit » ; majorations automatiques | [lucca.fr – Feuilles de temps](https://www.lucca.fr/suivi-des-temps/timesheet/) ; [rhmatin.com – Lucca × Silae](https://www.rhmatin.com/sirh/sirh-et-paie-lucca-et-silae-trouvent-un-terrain-d-entente-par-les-api.html) |
| Factorial | ✓ (shifts, affectation automatique) | ✓ | Silae par API : embauches, absences, EVP, heures ; compteurs de congés rapatriés de Silae | – | [factorial.fr/tarifs](https://factorial.fr/tarifs) ; [help.factorialhr.com – Silae](https://help.factorialhr.com/fr_FR/integrations-de-paie/silae-integration) |
| PayFit | – (codes projets) | ✓ (tous les plans) | Paie native : les heures alimentent la paie sans ressaisie | Heures sup calculées selon le contrat | [payfit.com/pricing-lp](https://payfit.com/pricing-lp/) ; [payfit.com – GTA](https://payfit.com/fr/gestion-des-temps-et-activites/) |
| Eurécia | ✓ (module) | ✓ (module) | API vers les logiciels de paie (**noms non listés** sur la page consultée) | Alertes : retard, départ anticipé, oubli, double badge | [eurecia.com/tarifs](https://www.eurecia.com/tarifs) ; [eurecia.com – GTA](https://www.eurecia.com/logiciel-temps-et-activites) ; [eurecia.com – pointeuse](https://www.eurecia.com/fonctionnalites/logiciel-pointeuse-badgeuse) |
| Shiftbase | ✓ (dès l'offre gratuite) | ✓ (dès Basic) | Export paie (dès Basic) ; SD Worx, Personio | Module « Compliance+ » annoncé (« soon ») | [shiftbase.com/pricing](https://www.shiftbase.com/pricing) ; [shiftbase.com/fr](https://www.shiftbase.com/fr) |
| Agendrix | ✓ | ✓ (« Gestion des demandes ») | Silae par fichier « IMPORTSILAE » | – | [agendrix.com/fr-fr/prix](https://www.agendrix.com/fr-fr/prix) ; [support.agendrix.com – Silae](https://support.agendrix.com/en/articles/11628893-how-to-export-payroll-data-to-silae) |
| Jibble | – | ✓ | Xero, QuickBooks Online, PayrollPanda, Deel. **Aucune intégration Silae, PayFit, Sage, Cegid, EBP ou ADP France** | Heures sup ; piste d'audit (non détaillée) | [jibble.io/collections/integrations](https://www.jibble.io/collections/integrations) ; [jibble.io/upgrade-plans](https://www.jibble.io/upgrade-plans) |
| Clockify | ✓ (plan Pro) | ✓ (dès Standard) | Aucune intégration paie FR mentionnée | Journal d'audit **réservé à Enterprise** | [clockify.me/pricing](https://clockify.me/pricing) ; [clockify.me/fr](https://clockify.me/fr/) |
| Connecteam | ✓ | – | « Payroll Integration » (noms n.v.) | Pointage de sortie automatique (« Auto Clock Out ») | [connecteam.com/pricing](https://connecteam.com/pricing/) |
| Octime Expresso | ✓ | ✓ (processus de validation) | « Interfaçable avec les principaux outils de paie et SIRH » (noms n.v.) | Alertes sur les durées maximales et les repos ; règles conventionnelles | [octime.com/expresso](https://www.octime.com/expresso/) |
| Horoquartz | ✓ | ✓ | n.v. | « règles légales » (non détaillé) | [horoquartz.com/etemptation](https://www.horoquartz.com/etemptation/) |
| Planday | ✓ | ✓ (offre Plus) | Reporting paie et intégrations (offre Plus ; noms n.v.) | – | [planday.com/fr/tarifs](https://www.planday.com/fr/tarifs/) |
| Sesame HR | ✓ (shifts) | ✓ | n.v. | Heures sup et complémentaires | [sesamehr.com/pricing](https://www.sesamehr.com/pricing/) ; [sesamehr.fr](https://www.sesamehr.fr/) |
| Bizneo HR | ✓ | ✓ | n.v. | RTT, forfait jours, conventions collectives (déclaratif) | [bizneo.com/fr](https://www.bizneo.com/fr/) |
| Shyfter | ✓ (dès Basic) | ✓ (dès Basic) | Exports PDF/Excel (Time tracking) ; intégrations paie dans Standard (noms n.v.) | – | [shyfter.com/en/pricing](https://shyfter.com/en/pricing) |
| Pointeo | – | – | Exports « Sage, Silae, ADP, Cegid et URSSAF » (déclaratif) | Alertes 10 h/jour, 35 h et 48 h/semaine ; conservation 5 ans | [easypointage.fr](https://easypointage.fr/) |
| Silae RH | – | ✓ (modules congés/absences) | Paie Silae native | Détection automatique des heures sup ou complémentaires par rapport au contrat | [silae-rh.zendesk.com – Badgeuse](https://silae-rh.zendesk.com/hc/fr/articles/18904979890578--Badgeuse) ; [silae.fr](https://www.silae.fr/) |
| Nibelis | ✓ | ✓ (affichées sur les plannings) | Paie Nibelis native : heures, primes, paniers repas | – | [nibelis.com – GTA](https://nibelis.com/produits-suite-rh-logiciel-gta-presence/) |

### 2.5 Fiches détaillées : forces et faiblesses

**1. Combo (ex-Snapshift)**
- Taille : « 10 000+ entreprises » et « 150 000 salariés » utilisent Combo chaque jour ([combohr.com](https://combohr.com/)).
- Notes affichées : 4,7/5 sur Capterra et 4,8/5 sur Google ([combohr.com](https://combohr.com/)).
- Tarifs : Time dès 60 €/mois/établissement et People dès 80 €, avec la mention « Prix progressif selon votre nombre de salariés ». Options : pointeuse +2 €/employé/mois, distribution des bulletins +1,2 €, lien vers Silae +1,5 €. L'engagement annuel donne 10 % de remise. Essai de 7 jours sans carte bancaire. Un salarié actif est un salarié qui « apparaît au moins une fois dans le mois sur un planning » ([combohr.com/fr/pricing](https://combohr.com/fr/pricing)).
- Pointeuse : uniquement sur tablette (iOS 15.1+ ou Android 11+, écran d'au moins 8''), pas de RFID, de QR code ni de biométrie. La géolocalisation ne bloque pas les pointages hors zone. Le hors-ligne est limité ([guide.combohr.com](https://guide.combohr.com/fr/articles/4521867-qu-est-ce-que-la-pointeuse-combo)).
- Avis : 4,7/5 sur 111 avis Capterra. Défauts cités entre 2022 et 2023 : shifts non modifiables depuis l'application mobile, intégration PayFit perfectible. Un avis indique que la réglementation n'est pas entièrement couverte et que l'outil « n'alerte pas sur toutes les erreurs ». Il manque aussi des rapports annuels de congés/RTT ([capterra.com – avis Combo](https://www.capterra.com/p/193701/Combo/reviews/)).
- Partenariat avec le cabinet Baker Tilly, qui revendique 30 000 clients ([combohr.com – Baker Tilly](https://combohr.com/fr/blog/partenariat-baker-tilly-combo)).
- ⚠️ Un article du blog de Skello, concurrent direct, cite des prix Combo par utilisateur (6,90 €/utilisateur/mois en annuel, 99 € de frais de mise en place). Ces prix sont incompatibles avec la grille officielle par établissement ([skello.io – avis Combo](https://www.skello.io/blog/avis-combo-alternatives)). Les comparatifs de concurrents sont à manier avec prudence.
- **Analyse :** point fort : la verticalisation CHR/commerce et la préparation de paie. Point faible pour un bureau ou une TPE sans tablette : pas de pointage depuis un PC. Le coût plancher est élevé pour moins de 5 salariés.

**2. Skello**
- Taille : « 30 000 équipes » et « 700 000 salariés », note de 4,5/5 sur plus de 2 000 avis ([skello.io – comparateur](https://www.skello.io/landing/comparateur-badgeuse)). Selon RH Matin (18/12/2025) : 25 000 clients, 600 000 utilisateurs actifs, 400 salariés. L'assistant d'IA générative est déployé chez tous les clients depuis novembre 2025. L'objectif est de 100 M€ d'ARR fin 2027, après 40 M€ levés en 2021 ([rhmatin.com – Skello](https://www.rhmatin.com/sirh/sirh-saas/planification-rh-comment-skello-avance-en-europe-et-sur-l-ia.html)).
- Prix sur la page FR, tous exprimés en « Dès … /mois » :

  | Offre | Prix |
  |---|---|
  | Planning Standard | 79 € |
  | Planning Max | 109 € |
  | Badgeuse Standard | 59 € |
  | Badgeuse Max | 89 € |
  | Duo Standard | 99 € |
  | Duo Max | 129 € |
  | Offre Business (200 à 10 000 salariés) | Sur mesure |

  L'engagement annuel donne 10 % de remise ([skello.io/pricing](https://www.skello.io/pricing)).
- La page anglaise affiche Planning Max à 107 € ([skello.io/en/pricing](https://www.skello.io/en/pricing)). L'écart est non expliqué.
- Options : Payroll Service dès 20 €/employé/mois, avec des cabinets partenaires comme In Extenso et BDO ; RH Expert dès 20 €/mois ([skello.io/en/pricing](https://www.skello.io/en/pricing)).
- Unité de facturation : « 79 €/mois par établissement » selon le guide de prix d'Agendrix, concurrent, du 01/04/2026 ([agendrix.com – guide des prix](https://www.agendrix.com/fr-fr/blogue/logiciel-planning-comparaison-prix)). La variation selon l'effectif n'est pas précisée sur la page Skello consultée.
- Avis : 4,3/5 sur 434 avis Trustpilot, dont 79 % à 5★ et 10 % à 1★. Critiques d'août 2026 : service après-vente peu disponible, bugs de l'application badgeuse, « convention collective mal appliquée », erreurs de calcul des congés, relances de résiliation restées sans réponse ([fr.trustpilot.com – Skello](https://fr.trustpilot.com/review/www.skello.io)).
- **Analyse :** point fort : l'écosystème (intégrations paie et caisse, programme pour les comptables). Point faible pour une TPE : un tarif par établissement de 59 à 129 €/mois et une qualité de support critiquée.

**3. Kelio (Bodet Software)**
- Taille : 20 000 clients ; modules Temps et activités, Congés et absences, Planning ; paie « 123Paie » accompagnée ou externalisée. Aucun prix n'est affiché ([kelio.com/fr](https://www.kelio.com/fr/)).
- Terminaux biométriques à empreinte « for Time and Attendance management and Access Control ». La page avertit : « biometrics are forbidden in some states » ([kelio.com – biométrie](https://www.kelio.com/hardware/clocking-in/biometric-clocking-terminals.html)).
- Classé « Leader » du Blueprint Exaegis 2026 : gestion de plusieurs conventions collectives, annualisation, API, adapté aux organisations multisites. Citation : « logiciel de GTA, planification et contrôle d'accès adossés à du matériel propriétaire » ([kelio.com – Blueprint](https://www.kelio.com/fr/societe/actualites/1267-kelio-positionne-leader-solutions-gta-planification-blueprint-markess.html)).
- **Analyse :** référence pour les PME et ETI industrielles et multisites. Le prix sur devis et le matériel sont peu adaptés aux TPE de 1 à 9 salariés.

**4. Lucca (Feuilles de temps)**
- Fonctions : pointage « auto-déclaratif, badgeuse virtuelle ou badgeuse physique », majorations automatiques, alertes. Clients cités : Orange, Accor, Deezer, Novo Nordisk ([lucca.fr – Feuilles de temps](https://www.lucca.fr/suivi-des-temps/timesheet/)).
- Prix indicatifs pour plus de 100 collaborateurs : Feuilles de temps à 3,00 € HT et Absences à 3,11 € HT par collaborateur et par mois, « Sans durée d'engagement » ([lucca.fr – tarifs Feuilles de temps](https://www.lucca.fr/suivi-des-temps/timesheet/tarifs) ; [lucca.fr/tarifs](https://www.lucca.fr/tarifs/)).
- Grille d'un revendeur officiel (Mon Partenaire SIRH) :
  - Feuilles de temps : forfait de base de 69,30 € pour les petites équipes, puis 3,85 €/collaborateur (20 à 49) jusqu'à 2,25 € (500 à 599).
  - Absences : dès 71,10 € HT/mois en forfait pour moins de 20 collaborateurs ([monpartenairesirh.fr](https://monpartenairesirh.fr/tarifs-lucca)).
- Plus d'1 000 000 d'utilisateurs, certification ISO 27001, agent IA « Ask Lucca » ([lucca.fr](https://www.lucca.fr/)).
- Partenariat API avec Silae annoncé le 24/01/2024. Cible déclarée : PME de 150 à 200 salariés ([rhmatin.com – Lucca × Silae](https://www.rhmatin.com/sirh/sirh-et-paie-lucca-et-silae-trouvent-un-terrain-d-entente-par-les-api.html)).
- **Analyse :** pour une TPE de moins de 20 salariés, les modules Temps et Absences cumulés coûtent environ 140 € HT/mois selon la grille du revendeur (69,30 + 71,10). Le produit est surdimensionné pour une TPE qui sort d'Excel.

**5. Factorial**
- Prix « à partir de 6.9€ par mois et par utilisateur » avec plans sur mesure. Modules Temps : absences, pointage géolocalisé, kiosque QR code, planning. Essai gratuit sans carte bancaire ([factorial.fr/tarifs](https://factorial.fr/tarifs)).
- Modes de pointage : web, application mobile (hors-ligne), QR code, kiosque par identifiant. La reconnaissance faciale est indisponible en Europe depuis le 01/10/2024, suite à un changement de critères du Comité européen de la protection des données ([help.factorialhr.com – suivi du temps](https://help.factorialhr.com/fr_FR/suivi-du-temps/a-propos-du-systeme-de-suivi-du-temps)).
- Intégration Silae par API ([help.factorialhr.com – Silae](https://help.factorialhr.com/fr_FR/integrations-de-paie/silae-integration)).
- **Analyse :** suite RH complète, mais le prix du seul module Temps n'est pas publié et la suite dépasse le besoin « pointage + heures sup ».

**6. PayFit**

| Offre | Prix | Contenu |
|---|---|---|
| Starter | 26 €/salarié/mois | Congés et absences |
| Paie | 20 € + 49 €/mois | Congés et absences |
| Paie Avancée | 27 € + 49 €/mois | **Seule offre avec « Gestion des temps et activité »** |
| RH+ | 30 € + 49 €/mois | Paie Avancée + entretiens, objectifs, feedback |

- Conditions : sans engagement, mise en place offerte, premier mois offert jusqu'au 30/09/2026. Plus de 50 intégrations, dont Alan, Qonto et Pennylane ([payfit.com/pricing-lp](https://payfit.com/pricing-lp/)).
- Module temps : « pointeuse digitale » (début et fin de journée, pauses) et heures versées directement en paie. Ni géolocalisation ni badgeuse ne sont mentionnées ([payfit.com – GTA](https://payfit.com/fr/gestion-des-temps-et-activites/)).
- **Analyse :** le pointage n'est accessible qu'avec l'offre de paie. Si la paie reste chez l'expert-comptable, cas fréquent en TPE, PayFit n'est pas une alternative au pointage seul.

**7. Eurécia**
- Offres :
  - Starter pour les TPE de 1 à 10 salariés, « accessible via votre cabinet d'expertise comptable ».
  - Business pour 11 à 500 salariés : dès 4,20 €/collaborateur/mois HT, par packs de 10, dégressif.
  - Enterprise au-delà de 500 salariés, sur devis.
- Essai de 30 jours sans engagement ([eurecia.com/tarifs](https://www.eurecia.com/tarifs)).
- Pointage : badge RFID, badge virtuel sur smartphone avec QR code, ordinateur, code PIN. Alertes instantanées. « Données stockées en France » ([eurecia.com – pointeuse](https://www.eurecia.com/fonctionnalites/logiciel-pointeuse-badgeuse)).
- Plus de 2 500 clients revendiqués ; API vers les logiciels de paie ([eurecia.com – GTA](https://www.eurecia.com/logiciel-temps-et-activites)). Un nombre de connecteurs paie est parfois cité par des sites tiers : n.v.
- **Analyse :** le canal expert-comptable est pertinent pour les TPE, mais le prix TPE n'est pas public.

**8. Shiftbase**
- Offres :

  | Offre | Prix | Contenu |
  |---|---|---|
  | Free | 0 € (jusqu'à 15 salariés) | Planning, sans pointage ni kiosque |
  | Basic | 30 €/mois (6 salariés inclus) + 4 €/salarié | Pointage, absences, export paie, 1 kiosque |
  | Premium | 72 €/mois (12 inclus) + 5 €/salarié | Kiosques illimités |
  | Enterprise | 336 €/mois (48 inclus) + 6 €/salarié | – |

- Options : App Center+ à 20 €/mois, HR Pro à 1 €/employé (prix de lancement), Compliance+ à 0,50 €/employé (« soon »). Remise annuelle de 10 %, essai de 14 jours ([shiftbase.com/pricing](https://www.shiftbase.com/pricing)).
- « 8 000+ entreprises » ; intégrations SD Worx et Personio ([shiftbase.com/fr](https://www.shiftbase.com/fr)).
- **Analyse :** modèle hybride base + salarié, très compétitif à 5 ou 6 salariés. Les intégrations paie françaises ne sont pas vérifiées.

**9. Agendrix**
- Prix :
  - Essentiel : 3,25 €/utilisateur/mois (2,93 € en annuel).
  - Plus : 5,25 € (4,73 € en annuel).
  - Module Temps et présences : 2,25 € (2,03 € en annuel).
- Conditions : essai jusqu'à 21 jours sans carte bancaire, sans contrat ([agendrix.com/fr-fr/prix](https://www.agendrix.com/fr-fr/prix)).
- Pointage : RFID, tablette ou ordinateur transformé en pointeuse, application mobile, géorepérage ([agendrix.com – RFID](https://www.agendrix.com/fr-fr/pointeuse-badgeuse-rfid)).
- Export Silae par fichier « IMPORTSILAE » (article du 06/07/2026) ([support.agendrix.com – Silae](https://support.agendrix.com/en/articles/11628893-how-to-export-payroll-data-to-silae)).
- **Analyse :** référence de prix par utilisateur, environ 5,5 € par salarié et par mois avec le pointage.

**10. Jibble**
- « Gratuit à vie · Utilisateurs illimités », avec pointage mobile et web, feuilles de temps et intégrations Slack, Teams et QuickBooks ([jibble.io/fr – FAQ](https://www.jibble.io/fr/aide/faq-sur-les-plans-dabonnements)).
- Fonctions : kiosque, reconnaissance faciale, GPS ([jibble.io/upgrade-plans](https://www.jibble.io/upgrade-plans)).
- Intégrations paie : Xero, QuickBooks, PayrollPanda et Deel uniquement ([jibble.io/collections/integrations](https://www.jibble.io/collections/integrations)).
- Prix des plans payants : **non lisibles** sur les pages officielles consultées (n.v.).
- **Analyse :** le gratuit illimité fixe un prix psychologique de 0 €, mais sans conformité ni paie françaises vérifiées. La reconnaissance faciale est problématique au regard de la doctrine CNIL (§ 4).

**11. Clockify**
- Offres par siège, en annuel (en mensuel entre parenthèses) :

  | Offre | Prix/siège/mois | Siège kiosque limité | Ajouts |
  |---|---|---|---|
  | Free | 0 $, jusqu'à 5 utilisateurs | – | – |
  | Basic | 3,99 $ (4,99 $) | 0,79 $ | Kiosque |
  | Standard | 5,49 $ (6,99 $) | 1,19 $ | Congés |
  | Pro | 7,99 $ (9,99 $) | 1,59 $ | GPS et planning |
  | Enterprise | 11,99 $ (14,99 $) | 2,39 $ | Journal d'audit |

  Source : [clockify.me/pricing](https://clockify.me/pricing).
- Site en français ; plus de 7 M d'utilisateurs ; aucune intégration paie française mentionnée ([clockify.me/fr](https://clockify.me/fr/)).
- **Analyse :** le « siège kiosque » à bas prix confirme la segmentation entre les salariés qui ne font que pointer et les utilisateurs complets. C'est une idée tarifaire réutilisable.

**12. Connecteam**
- Small Business Plan gratuit « for life » jusqu'à 10 utilisateurs, avec toutes les fonctions.
- Payant, par mois pour les 30 premiers utilisateurs puis par utilisateur supplémentaire (prix mensuel entre parenthèses) :
  - Basic : 29 $ (35 $), puis 0,8 $ (1 $) par utilisateur.
  - Advanced : 49 $ (59 $), puis 2,5 $ (3 $).
  - Expert : 99 $ (119 $), puis 4,2 $ (5 $).
- Kiosque, géorepérage, intégration paie ([connecteam.com/pricing](https://connecteam.com/pricing/)).
- Présence en France n.v. : connecteam.com/fr renvoie une erreur 404 ([connecteam.com/fr](https://connecteam.com/fr/)).

**13. Octime (Expresso)**
- Offre pour les « structures de 25 à 200 salariés » ; alertes sur les durées maximales et les repos ; interfaçable avec la paie. Déploiement en « 5 jours » ; « 1,7 millions d'utilisateurs ». Aucun prix affiché ([octime.com/expresso](https://www.octime.com/expresso/)).
- Pointage : badgeuse virtuelle, terminaux ID-SENSE et ID-ROCK, application myOCTIME. Octime rappelle l'interdiction CNIL de la biométrie pour le contrôle du temps ([octime.com – badgeuses](https://www.octime.com/badgeuse-pointeuse/)).
- **Analyse :** hors cible TPE, par sa taille minimale et son prix non publié.

**14. Horoquartz (eTemptation / eTSentiel)**
- Présence : agroalimentaire, banque, collectivités, commerce, industrie, transport. Offre PME-PMI « eTSentiel ».
- Outils : application mTemptation, badgeuses dont Pulsi. Aucun prix affiché ([horoquartz.com/etemptation](https://www.horoquartz.com/etemptation/)).
- **Analyse :** GTA d'entreprise, hors cible TPE.

**15. Planday**
- Offres Starter et Plus facturées « Par utilisateur/mois », montants non affichés dans le contenu consulté ; Pro personnalisé.
- Minimum de 5 utilisateurs, essai de 30 jours sans carte bancaire.
- Starter : pointage simple et reporting paie basique. Plus : absences et intégrations paie ([planday.com/fr/tarifs](https://www.planday.com/fr/tarifs/)).
- La page britannique affiche une devise en livres sterling ([planday.com/pricing](https://www.planday.com/pricing/)). Prix France : n.v.

**16. Sesame HR**
- Offres :

  | Offre | Prix |
  |---|---|
  | Essential | 3,75 $/salarié/mois |
  | Connect | 4,25 $/salarié/mois |
  | Growth | 6,25 $/salarié/mois |
  | Scale | 7,00 $/salarié/mois |

- Conditions : **« The minimum is 15 employees »**, 20 % de remise en annuel, essai de 14 jours ([sesamehr.com/pricing](https://www.sesamehr.com/pricing/)).
- Site français : « plus de 20 000 clients » et suivi des heures sup et complémentaires ([sesamehr.fr](https://www.sesamehr.fr/)).
- **Analyse :** les TPE de moins de 15 salariés sont exclues de fait de la grille publique.

**17. Bizneo HR**
- Prix « from US$6 » par employé et par mois ; offres Pro et Advanced sur devis. Pointage : kiosque PIN ou QR, géolocalisation, contrôle d'accès RFID ou empreinte ([bizneo.com/en/pricing](https://www.bizneo.com/en/pricing/)).
- « plus de 6 000 entreprises » ; gestion revendiquée des RTT, forfaits jours et conventions collectives ; données hébergées en Europe ([bizneo.com/fr](https://www.bizneo.com/fr/)).

**18. Shyfter**

| Offre | Prix mensuel | Contenu |
|---|---|---|
| Time tracking | 39 € | QR code, géolocalisation, vérification photo, pauses automatiques, exports PDF/Excel, application mobile et tablette |
| Basic | 59 € | Planning, absences, contrats |
| Standard | 89 € | IA, intégrations paie et caisse |
| Business | 129 € | Règles de paie sur mesure, API |

- Remise annuelle de 15 % ([shyfter.com/en/pricing](https://shyfter.com/en/pricing)).
- **Analyse :** l'offre « pointage seul » la moins chère parmi les forfaits européens observés, mais les intégrations paie ne commencent qu'à 89 €.

**19. Pointeo (easypointage.fr)**
- Positionnement : « TPE et PME françaises ».
- Modes : GPS, QR code, kiosque avec code PIN, télétravail.
- Alertes : 10 h par jour, 35 h et 48 h par semaine.
- Exports : Sage, Silae, ADP, Cegid.
- Prix : « Gratuit jusqu'à 3 employés · puis dès 19 €/mois HT · sans engagement ».
- Conformité : « Hébergé en France », conservation des données 5 ans ([easypointage.fr](https://easypointage.fr/)).
- Éditeur, SIREN et date de création non identifiés sur la page : existence commerciale et taille **n.v.**
- **Analyse :** concurrent le plus proche du positionnement envisagé pour WorkHoraire. À auditer en priorité (essai, mentions légales, grille au-delà de 19 €).

**20. Silae (badgeuse Silae RH) et Nibelis**
- Silae RH : badgeuse dans le navigateur (« Commencer ma journée », pause, « Terminer ma journée »). Les heures sup ou complémentaires sont détectées par rapport au contrat après validation. Activation via le support, aucun prix affiché ([silae-rh.zendesk.com – Badgeuse](https://silae-rh.zendesk.com/hc/fr/articles/18904979890578--Badgeuse)).
- Silae revendique 8 millions de bulletins par mois, 1 million d'entreprises, 6 000 partenaires et plus de 900 conventions collectives ([silae.fr](https://www.silae.fr/)).
- Nibelis : sociétés de 50 à 250 salariés et plus ; plus de 2 000 sociétés clientes ; 5 millions de bulletins par an. Pointeuse virtuelle ou physique, saisie horaire, bascule en paie ([nibelis.com – GTA](https://nibelis.com/produits-suite-rh-logiciel-gta-presence/)).
- **Analyse :** Silae est à la fois le **partenaire incontournable**, puisqu'il équipe les experts-comptables, et un **concurrent potentiel**, avec une badgeuse intégrée à la paie.

---

## 3. Benchmark des prix

### 3.1 Tableau de synthèse : modèle de facturation, prix d'entrée et contenu de l'offre d'entrée

| Solution | Modèle de facturation | Prix d'entrée public | Contenu de l'offre d'entrée | Engagement et essai | Source |
|---|---|---|---|---|---|
| Combo | Par établissement (progressif) + options par employé | Time dès 60 €/mois/établissement ; pointeuse +2 €/employé ; Silae +1,5 € | Planning, ratios, messagerie, export paie simple ; pointeuse en option | Mensuel ou annuel (−10 %) ; 7 jours sans carte | [combohr.com/fr/pricing](https://combohr.com/fr/pricing) |
| Skello | Par établissement (« Dès ») | Badgeuse Standard dès 59 €/mois ; Duo Standard dès 99 € | Pointage tablette et mobile, géolocalisation, suivi des heures | Mensuel ou annuel (−10 %) ; 14 jours | [skello.io/pricing](https://www.skello.io/pricing) ; [skello.io/en/pricing](https://www.skello.io/en/pricing) |
| Shyfter | Forfait mensuel | Time tracking à 39 €/mois | QR code, géolocalisation, photo, pauses automatiques, exports PDF/Excel | Annuel −15 % ; essai n.v. | [shyfter.com/en/pricing](https://shyfter.com/en/pricing) |
| Shiftbase | Base + par salarié | Basic à 30 €/mois (6 inclus) + 4 € par salarié supplémentaire | Planning, pointage, absences, export paie, 1 kiosque | Annuel −10 % ; 14 jours ; offre gratuite jusqu'à 15 salariés sans pointage | [shiftbase.com/pricing](https://www.shiftbase.com/pricing) |
| Agendrix | Par utilisateur actif | 5,50 € par utilisateur et par mois (3,25 + 2,25), soit 4,96 € en annuel | Planning, demandes, rapports et pointage | Sans contrat ; jusqu'à 21 jours | [agendrix.com/fr-fr/prix](https://www.agendrix.com/fr-fr/prix) |
| Lucca Feuilles de temps | Par collaborateur, dégressif ; forfait pour les petites équipes | 3,00 € HT (au-delà de 100 collaborateurs) ; revendeur : forfait de 69,30 € ou 3,85 € (20 à 49) | Pointage déclaratif, virtuel ou physique, alertes ; absences en module séparé | Sans durée d'engagement | [lucca.fr – tarifs](https://www.lucca.fr/suivi-des-temps/timesheet/tarifs) ; [monpartenairesirh.fr](https://monpartenairesirh.fr/tarifs-lucca) |
| Eurécia | Par collaborateur (packs de 10) | Dès 4,20 €/mois (11 à 500) ; TPE via expert-comptable, prix non publié | Selon les modules retenus | Ajustable à tout moment ; 30 jours | [eurecia.com/tarifs](https://www.eurecia.com/tarifs) |
| Factorial | Par utilisateur, plan sur mesure | Dès 6,9 € par utilisateur et par mois | Socle RH ; modules Temps en option | Essai sans carte ; résiliable | [factorial.fr/tarifs](https://factorial.fr/tarifs) |
| PayFit | Base + par salarié, paie incluse | Paie Avancée : 27 €/salarié + 49 €/mois | Paie, DSN, congés, gestion des temps | Sans engagement ; premier mois offert jusqu'au 30/09/2026 | [payfit.com/pricing-lp](https://payfit.com/pricing-lp/) |
| Sesame HR | Par salarié actif, minimum 15 | 3,75 $ par salarié et par mois | Pointage, congés, shifts | Annuel −20 % ; 14 jours | [sesamehr.com/pricing](https://www.sesamehr.com/pricing/) |
| Bizneo HR | Par salarié | « from US$6 » | Pointage application et web, géolocalisation, kiosque | n.v. | [bizneo.com/en/pricing](https://www.bizneo.com/en/pricing/) |
| Planday | Par utilisateur, minimum 5 | Montants non affichés | Starter : planning, pointage simple, reporting paie | Annulable à tout moment ; 30 jours | [planday.com/fr/tarifs](https://www.planday.com/fr/tarifs/) |
| Clockify | Par siège, plus sièges kiosque | Gratuit jusqu'à 5 ; Basic 3,99 $ (annuel) ou 4,99 $ (mensuel) ; siège kiosque dès 0,79 $ | Kiosque et exports en Basic | Mensuel ou annuel | [clockify.me/pricing](https://clockify.me/pricing) |
| Connecteam | Forfait jusqu'à 30 utilisateurs + par utilisateur | Gratuit jusqu'à 10 ; Basic 29 $ (annuel) ou 35 $/mois (mensuel) | Pointeuse, kiosque, intégration paie | Mensuel ou annuel | [connecteam.com/pricing](https://connecteam.com/pricing/) |
| Jibble | Freemium | Gratuit, utilisateurs illimités ; plans payants n.v. | Pointage mobile et web, feuilles de temps | – | [jibble.io/fr – FAQ](https://www.jibble.io/fr/aide/faq-sur-les-plans-dabonnements) |
| Pointeo | Freemium + forfait | Gratuit jusqu'à 3 ; dès 19 €/mois HT | GPS, QR code, kiosque, alertes légales, exports paie | Sans engagement | [easypointage.fr](https://easypointage.fr/) |
| Kelio, Octime, Horoquartz, Nibelis, Silae RH | Sur devis ou non publié | Prix non publié | – | – | [kelio.com/fr](https://www.kelio.com/fr/) ; [octime.com/expresso](https://www.octime.com/expresso/) ; [horoquartz.com/etemptation](https://www.horoquartz.com/etemptation/) ; [nibelis.com](https://nibelis.com/produits-suite-rh-logiciel-gta-presence/) ; [silae-rh.zendesk.com](https://silae-rh.zendesk.com/hc/fr/articles/18904979890578--Badgeuse) |

**Fourchettes observées (constat, sources ci-dessus) :**
- **Par utilisateur ou salarié** : de 3,00 € HT (Lucca, au-delà de 100 collaborateurs) à environ 6,9 € (Factorial), ou 3,75 à 6 $ (Sesame, Bizneo). Pointage compris chez Agendrix : 5,50 €.
- **Par établissement ou forfait** : de 39 €/mois (Shyfter) à 129 €/mois (Skello Duo Max).
- **Groupé avec la paie** : 27 €/salarié + 49 €/mois (PayFit Paie Avancée).
- **Gratuit** : jusqu'à 3 salariés (Pointeo), 5 (Clockify, sans kiosque), 10 (Connecteam) ou sans limite (Jibble). Shiftbase est gratuit jusqu'à 15 salariés, mais sans pointage.
- **Essais** : de 7 jours (Combo) à 30 jours (Eurécia, Planday). Les engagements sont généralement mensuels, avec 10 à 20 % de remise en annuel.

### 3.2 Analyse : simulation du coût mensuel pour 1 établissement

**Hypothèses** : facturation mensuelle, offre d'entrée incluant le pointage, prix publics bas (« dès »), hors frais de mise en place, matériel et TVA. Les calculs sont de l'auteur.

| Solution (offre retenue) | Formule | 5 salariés | Par salarié | 20 salariés | Par salarié |
|---|---|---:|---:|---:|---:|
| Skello Badgeuse Standard | ≥ 59 € (variation selon l'effectif n.v.) | ≥ 59 € | ≥ 11,8 € | ≥ 59 € | ≥ 2,95 € |
| Skello Duo Standard (planning + badgeuse) | ≥ 99 € | ≥ 99 € | ≥ 19,8 € | ≥ 99 € | ≥ 4,95 € |
| Combo Time + pointeuse | ≥ 60 € + 2 € × salariés (progressif) | ≥ 70 € | ≥ 14,0 € | ≥ 100 € | ≥ 5,0 € |
| Shyfter Time tracking | 39 € | 39 € | 7,8 € | 39 € | 1,95 € |
| Shiftbase Basic | 30 € (6 inclus) + 4 € par salarié supplémentaire | 30 € | 6,0 € | 86 € | 4,3 € |
| Agendrix Essentiel + Temps et présences | 5,50 € × salariés | 27,50 € | 5,5 € | 110 € | 5,5 € |
| Lucca Feuilles de temps (grille revendeur) | Forfait de 69,30 € ; 3,85 € × salariés entre 20 et 49 | 69,30 € | 13,9 € | 77 € | 3,85 € |
| Eurécia Business | 4,20 € × salariés (packs de 10 ; 11 à 500 salariés) | non applicable (TPE via expert-comptable) | – | 84 € | 4,2 € |
| Factorial | ≥ 6,9 € × salariés | ≥ 34,50 € | ≥ 6,9 € | ≥ 138 € | ≥ 6,9 € |
| PayFit Paie Avancée (**paie incluse**) | 27 € × salariés + 49 € | 184 € | 36,8 € | 589 € | 29,5 € |
| Clockify Basic (mensuel) | 4,99 $ × salariés | 24,95 $ | 4,99 $ | 99,80 $ | 4,99 $ |
| Connecteam | Gratuit jusqu'à 10 ; Basic à 35 $ jusqu'à 30 salariés | 0 $ | 0 $ | 35 $ | 1,75 $ |
| Jibble Free | 0 | 0 | 0 | 0 | 0 |
| Pointeo | Gratuit jusqu'à 3 ; dès 19 € | ≥ 19 € | ≥ 3,8 € | n.d. (grille non publiée) | – |
| Sesame Essential | 3,75 $ × salariés, minimum 15 | non applicable (sous le minimum) | – | 75 $ | 3,75 $ |

**Lecture (Analyse) :**
- Pour la **TPE moyenne de 2,9 salariés** (§ 1.2), le coût par salarié et par mois est d'environ :

  | Solution | Coût par salarié et par mois |
  |---|---|
  | Skello Badgeuse Standard | 20 € |
  | Combo Time + pointeuse | 22 € |
  | Lucca Feuilles de temps | 24 € |
  | Shiftbase | 10 € |
  | Agendrix | 5,5 € |
  | Pointeo, Connecteam, Jibble | 0 € |

- Il existe donc un **creux tarifaire** entre les gratuits sans paie française vérifiée et les spécialistes français facturés par établissement.
- À 20 salariés, les écarts se resserrent, entre 2 et 7 € par salarié. La concurrence porte alors sur la conformité, les intégrations et le service.

---

## 4. Tendances du marché (constats sourcés, implications en « Analyse »)

| # | Tendance | Constats sourcés | Analyse : implication pour WorkHoraire |
|---|---|---|---|
| 1 | **Obligation de mesurer le temps de travail** | Voir le détail sous le tableau (CJUE, France, Allemagne, Espagne) | Aucune obligation française explicite d'outil numérique n'a été trouvée. En revanche, la preuve objective, l'horodatage et la traçabilité des corrections deviennent la norme européenne. Un **journal d'audit** est un argument « preuve en cas de contrôle ». La jurisprudence française postérieure à 2019 n'a pas été vérifiée |
| 2 | **Cloud / SaaS dominant** | Le cloud représente 71,25 % du marché T&A en 2025, avec +11,35 %/an ([mordorintelligence.com – T&A](https://www.mordorintelligence.com/industry-reports/time-and-attendance-software-market)). Pour le WFM, le cloud pèse 63,81 % ([mordorintelligence.com – WFM](https://www.mordorintelligence.com/industry-reports/workforce-management-software-market-industry)). Selon MRFR, les PME croissent plus vite que les grandes entreprises, portées par la tarification par siège et la saisie mobile qui remplace les feuilles de temps manuelles (paraphrase) ([marketresearchfuture.com](https://www.marketresearchfuture.com/reports/time-and-attendance-software-market-21975)) | Un SaaS web et mobile (Angular + NestJS) est dans la norme ; ce n'est pas un différenciateur |
| 3 | **Mobile et tablette en mode kiosque partagé** | Combo pointe uniquement sur tablette ([guide.combohr.com](https://guide.combohr.com/fr/articles/4521867-qu-est-ce-que-la-pointeuse-combo)). Skello propose tablette avec PIN et mobile ([skello.io – badgeuses](https://www.skello.io/fonctionnalites/suivi-des-temps-de-travail/badgeuses)). Factorial offre kiosque et QR ([help.factorialhr.com](https://help.factorialhr.com/fr_FR/suivi-du-temps/a-propos-du-systeme-de-suivi-du-temps)). Clockify vend des sièges « kiosque » dès 0,79 $ ([clockify.me/pricing](https://clockify.me/pricing)). Shiftbase inclut 1 kiosque en Basic ([shiftbase.com/pricing](https://www.shiftbase.com/pricing)). Pointeo propose un kiosque à code PIN ([easypointage.fr](https://easypointage.fr/)) | Le **trio web + mobile + kiosque** est attendu dès l'offre d'entrée. Un tarif réduit pour les salariés qui ne font que pointer est une option |
| 4 | **Convergence paie et temps** | PayFit n'inclut la GTA qu'à partir de Paie Avancée ([payfit.com/pricing-lp](https://payfit.com/pricing-lp/)). Kelio propose sa paie 123Paie ([kelio.com/fr](https://www.kelio.com/fr/)). Nibelis bascule les heures en paie ([nibelis.com](https://nibelis.com/produits-suite-rh-logiciel-gta-presence/)). Silae intègre une badgeuse dans Silae RH ([silae-rh.zendesk.com](https://silae-rh.zendesk.com/hc/fr/articles/18904979890578--Badgeuse)). Son API couvre les EVP (primes, absences, heures sup) ([silae.fr/api-silae](https://www.silae.fr/api-silae/)), et Silae revendique « plus de 600 partenaires » API ([rhmatin.com – Lucca × Silae](https://www.rhmatin.com/sirh/sirh-et-paie-lucca-et-silae-trouvent-un-terrain-d-entente-par-les-api.html)). Skello vend un Payroll Service dès 20 €/employé ([skello.io/en/pricing](https://www.skello.io/en/pricing)) | L'**export ou l'API Silae** est incontournable pour les TPE dont la paie est chez l'expert-comptable. Le logiciel de paie est aussi un concurrent pour le « pointage suffisant » |
| 5 | **Conformité et alertes légales** | Lucca détecte les « dépassements, les retards, les repos, le travail de nuit » ([lucca.fr](https://www.lucca.fr/suivi-des-temps/timesheet/)). Octime alerte sur les durées maximales et les repos ([octime.com/expresso](https://www.octime.com/expresso/)). Pointeo alerte à 10 h, 35 h et 48 h ([easypointage.fr](https://easypointage.fr/)). Les applications de conformité croissent de 12,8 %/an ([mordorintelligence.com – T&A](https://www.mordorintelligence.com/industry-reports/time-and-attendance-software-market)). Shiftbase annonce un module Compliance+ ([shiftbase.com/pricing](https://www.shiftbase.com/pricing)). Seuils légaux français : voir le détail sous le tableau | Un **moteur d'alertes « Code du travail de base »** est un différenciateur accessible. La gestion exhaustive des conventions collectives est un gouffre, Silae en intégrant plus de 900 ([silae.fr](https://www.silae.fr/)) : à reporter après le lancement |
| 6 | **Recul de la biométrie, encadrement de la photo et de la géolocalisation** | Voir le détail sous le tableau (doctrine CNIL, pratiques des éditeurs) | **Protection de la vie privée dès la conception** : pas de biométrie, photo non systématique ou absente, géolocalisation optionnelle et limitée au temps de travail. Argument « conforme CNIL » face à Jibble ou aux badgeuses biométriques |
| 7 | **IA : forte offre, faible demande des TPE** | Voir le détail sous le tableau (offre des éditeurs, demande des TPE) | L'IA n'est **pas un argument d'achat prioritaire** pour une TPE qui sort d'Excel. À réserver à des fonctions invisibles, comme la détection d'anomalies |
| 8 | **Hébergement France/UE et sécurité** | Eurécia indique « Données stockées en France » ([eurecia.com – pointeuse](https://www.eurecia.com/fonctionnalites/logiciel-pointeuse-badgeuse)) et Pointeo « Hébergé en France » ([easypointage.fr](https://easypointage.fr/)). Bizneo annonce des données hébergées en Europe ([bizneo.com/fr](https://www.bizneo.com/fr/)). Lucca est certifié ISO 27001 ([lucca.fr](https://www.lucca.fr/)). 83 % des dirigeants de TPE jugent la sécurité des données importante ([ifop.com – vague 4](https://www.ifop.com/wp-content/uploads/2024/07/120745-presentation-barometre-de-la-digitalisation-des-tpe-vague-4.pdf)) | Un hébergement en France ou dans l'UE est un argument de réassurance peu coûteux. Il ne différencie pas face à Eurécia ou Pointeo |
| 9 | **Freemium et croissance tirée par le produit** | Jibble est gratuit sans limite d'utilisateurs ([jibble.io/fr – FAQ](https://www.jibble.io/fr/aide/faq-sur-les-plans-dabonnements)), Connecteam jusqu'à 10 ([connecteam.com/pricing](https://connecteam.com/pricing/)), Clockify jusqu'à 5 ([clockify.me/pricing](https://clockify.me/pricing)), Shiftbase jusqu'à 15 sans pointage ([shiftbase.com/pricing](https://www.shiftbase.com/pricing)) et Pointeo jusqu'à 3 ([easypointage.fr](https://easypointage.fr/)) | Un palier gratuit, même très petit, est attendu pour être comparé. Il faut arbitrer entre acquisition et cannibalisation |
| 10 | **Marché fragmenté, actif « en flux »** | Le top 10 mondial pèse 25 % des revenus ([thebusinessresearchcompany.com](https://www.thebusinessresearchcompany.com/report/time-and-attendance-software-global-market-report)). Exaegis décrit un marché « mature en stock » mais « très actif en flux », avec des migrations depuis Excel ([exaegis.com](https://exaegis.com/actualites/blueprint-gta-gestion-des-temps-activit%C3%A9s-et-planification-des-ressources-2025/2026)) | Un nouvel entrant peut exister sur une niche. Le coût d'acquisition sera le facteur critique (§ 6) |

**Détail de la tendance 1 : obligation de mesurer le temps de travail**
- **Union européenne** : la CJUE a jugé le 14/05/2019 (affaire C-55/18) que « les États membres doivent imposer aux employeurs l'obligation de mettre en place un système objectif, fiable et accessible permettant de mesurer la durée du temps de travail journalier effectué par chaque travailleur ». Les modalités sont laissées aux États, en tenant compte « de la taille de certaines entreprises » ([curia.europa.eu – communiqué 61/19](https://curia.europa.eu/jcms/upload/docs/application/pdf/2019-05/cp190061fr.pdf)).
- **France** :
  - Article D3171-8 : décompte quotidien (heures de début et de fin, ou nombre d'heures) et récapitulatif hebdomadaire pour les salariés qui ne suivent pas le même horaire collectif affiché ([code.travail.gouv.fr – D3171-8](https://code.travail.gouv.fr/code-du-travail/d3171-8)).
  - Article D3171-16 : documents de décompte tenus à la disposition de l'inspection du travail pendant 1 an, 3 ans pour les forfaits jours ([code.travail.gouv.fr – D3171-16](https://code.travail.gouv.fr/code-du-travail/d3171-16)).
- **Allemagne** : le BAG, dans sa décision du 13/09/2022 (1 ABR 22/21), a consacré une obligation légale d'enregistrer le temps de travail, sans imposer de format électronique ([goerg.de – BAG](https://www.goerg.de/en/insights/publications/13-09-2022/bag-statutory-obligation-to-record-working-time-yet-works-councils-lack-the-right-to-take-the-initiative-to-introduce-electronic-timekeeping)).
- **Espagne** : un projet de décret imposerait un registre **exclusivement numérique**, où le papier et les tableurs Excel seraient interdits, avec une traçabilité immuable des modifications, un accès à distance pour l'inspection, l'exclusion de la biométrie à risque et une conservation de 4 ans. Un avis critique du Conseil d'État a été rendu le 23/03/2026. Le texte n'était pas publié au BOE au 07/04/2026 ([protime.eu](https://www.protime.eu/es-es/noticias/registro-horario-digital-obligatorio-2026)) et toujours non approuvé selon une page mise à jour en juin 2026 ([controlhorario.com](https://controlhorario.com/ley-registro-horario/)). **Statut au 23/09/2026 : n.v.**

**Détail de la tendance 5 : seuils légaux français utiles aux alertes**
- Durées maximales : 10 h par jour, 48 h sur une semaine, 44 h en moyenne sur 12 semaines ; pause de 20 minutes après 6 h de travail ; durée légale de 35 h par semaine, 151,67 h par mois ou 1 607 h par an ([service-public.gouv.fr – F1911](https://www.service-public.gouv.fr/particuliers/vosdroits/F1911)).
- Repos quotidien : au moins 11 h consécutives ([service-public.gouv.fr – F990](https://www.service-public.gouv.fr/particuliers/vosdroits/F990)).
- Heures supplémentaires : majoration de 25 % de la 36e à la 43e heure puis de 50 %, au moins 10 % par accord. Contingent annuel de 220 h par défaut. Contrepartie obligatoire en repos de 50 % jusqu'à 20 salariés et de 100 % au-delà ([service-public.gouv.fr – F2391](https://www.service-public.gouv.fr/particuliers/vosdroits/F2391)).

**Détail de la tendance 6 : biométrie, photo et géolocalisation**
- Doctrine de la CNIL sur le contrôle des horaires ([cnil.fr – horaires](https://www.cnil.fr/fr/lacces-aux-locaux-et-le-controle-des-horaires-sur-le-lieu-de-travail)) :
  - Le contrôle par biométrie ou avec « prise de photographie systématique » « apparaît excessive ».
  - Les badges et codes sont à privilégier.
  - Le CSE doit être informé ou consulté.
  - Les données de temps sont conservées jusqu'à 5 ans en archivage intermédiaire.
- La géolocalisation n'est admise pour contrôler le temps de travail que si « cela ne peut être réalisé par un autre moyen ». Elle est interdite hors du temps de travail, et le salarié doit pouvoir la désactiver ([cnil.fr – géolocalisation](https://www.cnil.fr/fr/la-geolocalisation-des-vehicules-des-salaries)).
- Pratiques des éditeurs :
  - Factorial a coupé la reconnaissance faciale en Europe le 01/10/2024 ([help.factorialhr.com](https://help.factorialhr.com/fr_FR/suivi-du-temps/a-propos-du-systeme-de-suivi-du-temps)).
  - Jibble propose encore la reconnaissance faciale ([jibble.io/upgrade-plans](https://www.jibble.io/upgrade-plans)).
  - Kelio vend des terminaux à empreinte ([kelio.com – biométrie](https://www.kelio.com/hardware/clocking-in/biometric-clocking-terminals.html)).

**Détail de la tendance 7 : IA**
- Offre des éditeurs :
  - Skello propose un assistant IA illimité dans ses offres Max ([skello.io/en/pricing](https://www.skello.io/en/pricing)), généralisé en novembre 2025 ([rhmatin.com – Skello](https://www.rhmatin.com/sirh/sirh-saas/planification-rh-comment-skello-avance-en-europe-et-sur-l-ia.html)).
  - Shyfter intègre l'IA dans son offre Standard à 89 € ([shyfter.com/en/pricing](https://shyfter.com/en/pricing)).
  - PayFit propose un assistant IA ([payfit.com/pricing-lp](https://payfit.com/pricing-lp/)) et Lucca l'agent « Ask Lucca » ([lucca.fr](https://www.lucca.fr/)).
  - Selon Mordor, les copilotes d'IA générative sont devenus le principal différenciateur concurrentiel des grands éditeurs (paraphrase) ([mordorintelligence.com – WFM](https://www.mordorintelligence.com/industry-reports/workforce-management-software-market-industry)).
- Demande des TPE ([ifop.com – vague 4](https://www.ifop.com/wp-content/uploads/2024/07/120745-presentation-barometre-de-la-digitalisation-des-tpe-vague-4.pdf)) :
  - 20 % ont mis en place au moins une solution d'IA.
  - 77 % n'envisageraient pas d'outils d'IA.
  - Le premier frein est l'« absence d'utilité », à 59 %.
- France Num : 25 % des TPE-PME utilisent l'IA en 2025, contre 13 % en 2024, et 23 % chez les 1 à 4 salariés ([tpeactu.fr – France Num 2025](https://tpeactu.fr/2025/09/21/barometre-france-num-2025/)).

---

## 5. Opportunités et angles morts pour un nouvel entrant visant les TPE qui sortent d'Excel

### 5.1 Constats sourcés

| # | Constat | Source |
|---|---|---|
| C1 | Planchers par établissement : Skello Badgeuse Standard dès 59 €/mois et Duo dès 99 € ; Combo dès 60 €/mois plus 2 €/employé pour la pointeuse ; Shyfter à 39 €/mois | [skello.io/pricing](https://www.skello.io/pricing) ; [combohr.com/fr/pricing](https://combohr.com/fr/pricing) ; [shyfter.com/en/pricing](https://shyfter.com/en/pricing) |
| C2 | Seuils de taille : Sesame exige au moins 15 salariés ; Planday au moins 5 utilisateurs ; Octime Expresso vise 25 à 200 salariés ; Nibelis 50 à 250 et plus ; la cible déclarée de Lucca est de 150 à 200 salariés ; l'offre TPE d'Eurécia passe uniquement par l'expert-comptable | [sesamehr.com/pricing](https://www.sesamehr.com/pricing/) ; [planday.com/fr/tarifs](https://www.planday.com/fr/tarifs/) ; [octime.com/expresso](https://www.octime.com/expresso/) ; [nibelis.com](https://nibelis.com/produits-suite-rh-logiciel-gta-presence/) ; [rhmatin.com – Lucca × Silae](https://www.rhmatin.com/sirh/sirh-et-paie-lucca-et-silae-trouvent-un-terrain-d-entente-par-les-api.html) ; [eurecia.com/tarifs](https://www.eurecia.com/tarifs) |
| C3 | Forfaits Lucca pour moins de 20 collaborateurs : 69,30 € (Feuilles de temps) et 71,10 € (Absences), selon le revendeur | [monpartenairesirh.fr](https://monpartenairesirh.fr/tarifs-lucca) |
| C4 | Prix non publiés : Kelio, Octime, Horoquartz, Nibelis, badgeuse Silae RH. Montants non affichés : Planday, plans payants de Jibble | [kelio.com/fr](https://www.kelio.com/fr/) ; [octime.com/expresso](https://www.octime.com/expresso/) ; [horoquartz.com](https://www.horoquartz.com/etemptation/) ; [nibelis.com](https://nibelis.com/produits-suite-rh-logiciel-gta-presence/) ; [silae-rh.zendesk.com](https://silae-rh.zendesk.com/hc/fr/articles/18904979890578--Badgeuse) ; [planday.com/fr/tarifs](https://www.planday.com/fr/tarifs/) ; [jibble.io/upgrade-plans](https://www.jibble.io/upgrade-plans) |
| C5 | Chez PayFit, la GTA n'est disponible qu'avec l'offre de paie Paie Avancée (27 €/salarié + 49 €/mois) | [payfit.com/pricing-lp](https://payfit.com/pricing-lp/) |
| C6 | Les gratuits internationaux n'ont pas d'intégration paie française vérifiée : Jibble se limite à Xero, QuickBooks, PayrollPanda et Deel ; Clockify n'en mentionne aucune ; la page FR de Connecteam renvoie une 404 | [jibble.io/collections/integrations](https://www.jibble.io/collections/integrations) ; [clockify.me/fr](https://clockify.me/fr/) ; [connecteam.com/fr](https://connecteam.com/fr/) |
| C7 | Fonctions critiques vendues en option ou en haut de gamme : lien Silae chez Combo (+1,5 €/employé) ; journal d'audit réservé à Enterprise chez Clockify (11,99 $/siège) ; GPS réservé à Pro | [combohr.com/fr/pricing](https://combohr.com/fr/pricing) ; [clockify.me/pricing](https://clockify.me/pricing) |
| C8 | Limites relevées : Combo pointe uniquement sur tablette, avec une géolocalisation non bloquante. Avis sur Combo : alertes réglementaires incomplètes, application mobile limitée. Avis sur Skello : support, « convention collective mal appliquée », bugs de la badgeuse, résiliation | [guide.combohr.com](https://guide.combohr.com/fr/articles/4521867-qu-est-ce-que-la-pointeuse-combo) ; [capterra.com – Combo](https://www.capterra.com/p/193701/Combo/reviews/) ; [fr.trustpilot.com – Skello](https://fr.trustpilot.com/review/www.skello.io) |
| C9 | Verticalisation CHR, commerce et santé chez les leaders du planning terrain | [combohr.com](https://combohr.com/) ; [skello.io – badgeuses](https://www.skello.io/fonctionnalites/suivi-des-temps-de-travail/badgeuses) |
| C10 | Demande de sortie d'Excel : migrations depuis Excel observées (mid-market) ; modèles Excel utilisés comme appâts marketing par les concurrents | [exaegis.com](https://exaegis.com/actualites/blueprint-gta-gestion-des-temps-activit%C3%A9s-et-planification-des-ressources-2025/2026) ; [agendrix.com – modèle Excel](https://www.agendrix.com/fr/modele-excel-gratuit-feuilles-de-temps-de-travail) |
| C11 | 29 % des TPE n'ont pas de logiciel de gestion, compta ou RH et n'ont pas l'intention de s'équiper. L'exploitation des données RH/paie est de 34,6 % chez les 1 à 9 salariés, contre 69,2 % chez les 10 à 49 (calcul de l'auteur) | [ifop.com – vague 4](https://www.ifop.com/wp-content/uploads/2024/07/120745-presentation-barometre-de-la-digitalisation-des-tpe-vague-4.pdf) ; [data.economie.gouv.fr – item 740](https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/bfn-resultats-2025/records?select=taille_etablissement,libelle_reponse,sum(poids)%20as%20w,count(*)%20as%20n&where=code_unifie=%22740%22&group_by=taille_etablissement,libelle_reponse&limit=100) |
| C12 | Un concurrent français vise déjà les TPE avec du freemium : Pointeo, gratuit jusqu'à 3 salariés puis dès 19 €, avec alertes légales, exports Silae, Sage, ADP et Cegid, hébergé en France | [easypointage.fr](https://easypointage.fr/) |
| C13 | Silae est au centre de la paie gérée par les experts-comptables : 8 M de bulletins par mois, 1 M d'entreprises, 6 000 partenaires | [silae.fr](https://www.silae.fr/) |

### 5.2 Analyse : segments mal servis

- **A1. TPE de 1 à 9 salariés, mono-site, hors CHR et commerce en shifts** : artisans, commerces de proximité, services, cabinets. C'est le segment le plus nombreux, avec 1,30 M d'entreprises employeuses (§ 1.2).
  - Leurs besoins : pointage, calcul des heures sup, congés simples et export pour le comptable.
  - Les spécialistes du planning (C1, C9) sont trop chers par salarié et surdimensionnés.
  - Les SIRH et GTA (C2 à C4) sont hors seuil ou sur devis.
  - Les gratuits (C6) sont inadaptés à la paie et au droit du travail français.
- **A2. Petites PME de 10 à 49 salariés dont la paie est chez l'expert-comptable (Silae)** : elles sont trop petites pour Kelio, Octime ou Nibelis (devis, badgeuses), et PayFit impose de migrer la paie (C5). Environ 216 000 entreprises et 4,4 M de salariés (§ 1.2).
- **A3. TPE qui veulent la preuve en cas de contrôle ou de litige, sans surveillance intrusive** : horodatage, historique des corrections, sans biométrie ni photo systématique (tendances 1 et 6). Peu d'offres d'entrée mettent en avant un **journal d'audit** (C7).

### 5.3 Analyse : angles morts exploitables et positionnement possible de WorkHoraire (hypothèses à tester)

1. **Prix** :
   - Facturation **par salarié actif**, dans une zone de 2 à 4 € par salarié et par mois.
   - **Pas de plancher par établissement**, ou un plancher faible, en dessous des 19 € de Pointeo et des 30 € de Shiftbase.
   - Sans engagement, avec un palier gratuit de 1 à 3 salariés, à arbitrer face à Pointeo.
   - Définition claire du « salarié actif », sur le modèle de Combo (C1, C7, § 3.2).
2. **Offre d'entrée tout compris**, là où les concurrents vendent ces fonctions en options (C7) :
   - pointage web, mobile et kiosque tablette à code PIN ;
   - calcul des heures sup à 25 % et 50 % ;
   - alertes de base : 10 h par jour, 48 h par semaine, 44 h sur 12 semaines, repos de 11 h, pause de 20 min ;
   - absences simples ;
   - **export Silae** et export CSV générique ;
   - **journal d'audit** des corrections ;
   - rôles ADMIN, MANAGER et EMPLOYEE.
3. **« Sortie d'Excel » en moins d'une heure** : import CSV ou Excel des salariés et horaires, modèles d'horaires types, export équivalent au tableau Excel actuel pour rassurer (C10).
4. **Protection de la vie privée comme argument commercial** : pas de biométrie, photo au plus aléatoire et optionnelle ou absente, géolocalisation optionnelle limitée au temps de travail, mention d'information CNIL et modèle de note au CSE fournis (tendance 6).
5. **Transparence** : grille publique avec simulateur, face aux prix « Dès » et « sur devis » (C4).
6. **À ne pas faire au lancement** : gestion exhaustive des conventions collectives (Silae en intègre plus de 900), badgeuses physiques, biométrie, IA générative comme argument principal (tendances 5 et 7).
7. **Risques principaux** :
   - Pointeo occupe un positionnement quasi identique (C12).
   - Les gratuits fixent un prix de référence à 0 € (C6).
   - La paie intègre le pointage : PayFit, Silae RH (tendance 4).
   - Les spécialistes pourraient baisser leurs prix d'entrée.
   - Sans canal comptable, le coût d'acquisition risque d'être élevé (§ 6).

---

## 6. Canaux d'acquisition observés

| Canal | Pratiques observées (sourcées) | Source |
|---|---|---|
| **Experts-comptables et cabinets de paie** | Eurécia réserve son offre TPE « Starter » au cabinet d'expertise comptable. Skello a un programme dédié aux comptables et professionnels de la paie et revendique « 10h gagnées chaque mois par client ». Son Payroll Service passe par des cabinets partenaires (In Extenso, BDO). Combo a signé un partenariat avec Baker Tilly, qui revendique 30 000 clients | [eurecia.com/tarifs](https://www.eurecia.com/tarifs) ; [skello.io – comptables](https://www.skello.io/comptables-et-pro-de-la-paie) ; [skello.io/en/pricing](https://www.skello.io/en/pricing) ; [combohr.com – Baker Tilly](https://combohr.com/fr/blog/partenariat-baker-tilly-combo) |
| **Écosystème paie et API (Silae, PayFit)** | Silae compte 6 000 partenaires et « plus de 600 partenaires qui utilisent nos API ». Son API couvre les EVP. Lucca met en avant « Moins de friction à l'achat » grâce à l'API Silae. Factorial (API), Agendrix (fichier) et Combo (option payante) proposent tous un lien Silae. PayFit revendique plus de 50 intégrations | [silae.fr](https://www.silae.fr/) ; [rhmatin.com – Lucca × Silae](https://www.rhmatin.com/sirh/sirh-et-paie-lucca-et-silae-trouvent-un-terrain-d-entente-par-les-api.html) ; [silae.fr/api-silae](https://www.silae.fr/api-silae/) ; [help.factorialhr.com – Silae](https://help.factorialhr.com/fr_FR/integrations-de-paie/silae-integration) ; [support.agendrix.com](https://support.agendrix.com/en/articles/11628893-how-to-export-payroll-data-to-silae) ; [payfit.com/pricing-lp](https://payfit.com/pricing-lp/) |
| **Intégrations caisse (CHR, commerce)** | Skello s'intègre avec les caisses Lightspeed et L'addition | [skello.io – comptables](https://www.skello.io/comptables-et-pro-de-la-paie) |
| **Revendeurs et intégrateurs** | Lucca est distribué par des revendeurs officiels, dont Mon Partenaire SIRH | [monpartenairesirh.fr](https://monpartenairesirh.fr/tarifs-lucca) |
| **Contenu et référencement naturel** | Skello publie des pages ciblant la marque d'un concurrent (« Avis Combo […] : prix et alternatives », mise à jour le 31/07/2026). Agendrix publie un guide des prix comparant Skello, Combo et Deputy (01/04/2026) et propose un modèle Excel gratuit contre un e-mail, avec relance vers un essai | [skello.io – avis Combo](https://www.skello.io/blog/avis-combo-alternatives) ; [agendrix.com – guide des prix](https://www.agendrix.com/fr-fr/blogue/logiciel-planning-comparaison-prix) ; [agendrix.com – modèle Excel](https://www.agendrix.com/fr/modele-excel-gratuit-feuilles-de-temps-de-travail) |
| **Freemium et essais gratuits** | Paliers gratuits chez Jibble, Connecteam, Clockify, Shiftbase et Pointeo. Essais de 7 jours (Combo), 14 jours (Skello, Shiftbase, Sesame), 21 jours (Agendrix) ou 30 jours (Eurécia, Planday) | [jibble.io/fr – FAQ](https://www.jibble.io/fr/aide/faq-sur-les-plans-dabonnements) ; [connecteam.com/pricing](https://connecteam.com/pricing/) ; [clockify.me/pricing](https://clockify.me/pricing) ; [shiftbase.com/pricing](https://www.shiftbase.com/pricing) ; [easypointage.fr](https://easypointage.fr/) ; [combohr.com/fr/pricing](https://combohr.com/fr/pricing) ; [skello.io/pricing](https://www.skello.io/pricing) ; [agendrix.com/fr-fr/prix](https://www.agendrix.com/fr-fr/prix) ; [eurecia.com/tarifs](https://www.eurecia.com/tarifs) ; [planday.com/fr/tarifs](https://www.planday.com/fr/tarifs/) |
| **Avis et plateformes de comparaison** | Combo affiche ses notes Capterra, GetApp et Google. Skello affiche une note de 4,5/5 sur plus de 2 000 avis. Les avis Trustpilot et Capterra sont publics | [combohr.com](https://combohr.com/) ; [skello.io – comparateur](https://www.skello.io/landing/comparateur-badgeuse) ; [fr.trustpilot.com – Skello](https://fr.trustpilot.com/review/www.skello.io) ; [capterra.com – Combo](https://www.capterra.com/p/193701/Combo/reviews/) |
| **Verticalisation sectorielle** | Combo cible la boulangerie, la pharmacie, la restauration rapide et traditionnelle. Skello cible 7 secteurs | [combohr.com](https://combohr.com/) ; [skello.io – badgeuses](https://www.skello.io/fonctionnalites/suivi-des-temps-de-travail/badgeuses) |

**Analyse : priorités de canal pour WorkHoraire**
1. **Experts-comptables et Silae**, le canal le plus rentable pour atteindre les TPE dont la paie est externalisée. Leviers : export ou API Silae natif et gratuit, espace comptable multi-dossiers, commission ou offre « cabinet ».
2. **Référencement naturel sur les requêtes de sortie d'Excel**, sur le modèle des concurrents : « feuille d'heures Excel », « calcul heures supplémentaires », « badgeuse gratuite », « alternative à [concurrent] ».
3. **Freemium de 1 à 3 salariés**, avec une activation guidée.
4. **Places de marché des éditeurs de paie et de comptabilité.** Pennylane et Tiime sont cités parmi les partenaires de Silae ([silae.fr/api-silae](https://www.silae.fr/api-silae/)). Leurs conditions de référencement sont n.v.

---

## 7. Limites de l'étude

- **Rapports de marché payants** : seuls les résumés publics ont été consultés. Le rapport MRFR affiche des valeurs contradictoires sur une même page. Aucune taille de marché GTA France fiable et gratuite n'a été trouvée.
- **Prix** : les mentions « Dès » ou « À partir de » sont des bornes basses. La variation selon l'effectif n'est pas publiée chez Skello et Combo. Les montants de Planday et des plans payants de Jibble ne sont pas lisibles dans le contenu consulté (pages dynamiques). Les prix de Kelio, Octime, Horoquartz, Nibelis et de la badgeuse Silae RH ne sont pas publiés. Les prix en USD n'ont pas été convertis.
- **Pages inaccessibles ou vides** :
  - francenum.gouv.fr (contenu vide, rapport PDF illisible) ;
  - economie.gouv.fr et mastercard.com (erreur 403) ;
  - eur-lex (contenu vide) ;
  - connecteam.com/fr (404), folkhr.com (500) ;
  - skello.io/tarifs, payfit.com/fr/tarifs, sesamehr.fr/tarifs (404) ;
  - absyscyborg.com (erreur d'en-tête).
- **Non vérifié** :
  - l'hébergement des données de Skello, Combo et Factorial ;
  - la liste exhaustive des connecteurs paie d'Eurécia, Octime, Horoquartz, Planday, Shyfter et Connecteam ;
  - la jurisprudence française postérieure à 2019 sur l'obligation de mesurer le temps ;
  - le statut du décret espagnol au 23/09/2026 ;
  - l'éditeur, la taille et l'ancienneté de Pointeo ;
  - le pays d'origine de plusieurs éditeurs (non affirmé dans ce rapport).
- **Biais** : les données d'éditeurs (clients, gains de temps, fonctionnalités) sont déclaratives. Deux comparatifs cités sont publiés par des concurrents (Skello, Agendrix). Les avis clients sont individuels et non représentatifs.
- **Calculs de l'auteur** : les parts, moyennes, simulations de prix, parts France Num par taille et plafonds théoriques sont signalés « Analyse » ou « calcul de l'auteur ».
- **Quota de recherche web** : le quota de la session, soit 200 requêtes, a été atteint en fin d'étude. Les dernières vérifications ont été faites par consultation directe des pages.

---

## 8. Sources consultées (toutes consultées le 23/09/2026)

### Statistiques et études
1. INSEE Focus n° 372, « Le tissu productif français par catégorie d'entreprises en 2023 » (10/12/2025) : https://www.insee.fr/fr/statistiques/8675639
2. INSEE, « L'essentiel sur… les entreprises » (mis à jour le 26/01/2026) : https://www.insee.fr/fr/statistiques/5424748
3. Urssaf open data, données 2024 par tranche (API) : https://open.urssaf.fr/api/explore/v2.1/catalog/datasets/nombre-etab-effectifs-salaries-et-masse-salariale-secteur-prive-tranche-ent/records?limit=20&order_by=annee%20desc&select=annee,tranche_d_effectif,nombre_d_entreprises,nombre_d_etablissements,effectifs_salaries_moyens
4. Urssaf open data, même jeu de données, requête complète : https://open.urssaf.fr/api/explore/v2.1/catalog/datasets/nombre-etab-effectifs-salaries-et-masse-salariale-secteur-prive-tranche-ent/records?limit=100&order_by=annee%20desc
5. Urssaf open data, fiche descriptive du jeu de données : https://open.urssaf.fr/explore/dataset/nombre-etab-effectifs-salaries-et-masse-salariale-secteur-prive-tranche-ent/information/
6. France Num 2025, microdonnées, item 740 « Analyse des données : RH / paie » (pondérations par taille) : https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/bfn-resultats-2025/records?select=taille_etablissement,libelle_reponse,sum(poids)%20as%20w,count(*)%20as%20n&where=code_unifie=%22740%22&group_by=taille_etablissement,libelle_reponse&limit=100
7. France Num 2025, libellé de l'item 740 : https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/bfn-resultats-2025/records?select=libelle_unifie,descriptif_de_question,valeurs_dans_calcul&where=code_unifie=%22740%22&limit=1
8. France Num 2025, liste des items « logiciel », « gestion », « planning » : https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/bfn-resultats-2025/records?select=code_unifie,libelle_unifie,count(*)%20as%20n&where=search(libelle_unifie,%22logiciel%22)%20or%20search(libelle_unifie,%22gestion%22)%20or%20search(libelle_unifie,%22planning%22)&group_by=code_unifie,libelle_unifie&limit=100
9. France Num 2025, liste des items « humaines », « paie », « RH » : https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/bfn-resultats-2025/records?select=code_unifie,libelle_unifie,count(*)%20as%20n&where=search(libelle_unifie,%22humaines%22)%20or%20search(libelle_unifie,%22paie%22)%20or%20search(libelle_unifie,%22RH%22)&group_by=code_unifie,libelle_unifie&limit=50
10. France Num 2025, structure du jeu de données : https://data.economie.gouv.fr/api/explore/v2.1/catalog/datasets/bfn-resultats-2025/records?limit=3
11. TPE Actu, Baromètre France Num 2025 (21/09/2025) : https://tpeactu.fr/2025/09/21/barometre-france-num-2025/
12. IFOP pour Oxygen/Mastercard, « Les dirigeants de TPE et la digitalisation de leur entreprise – Vague 4 » (mai 2024, PDF) : https://www.ifop.com/wp-content/uploads/2024/07/120745-presentation-barometre-de-la-digitalisation-des-tpe-vague-4.pdf
13. RH Matin, tendances SIRH 2024, données Markess (29/01/2024) : https://www.rhmatin.com/sirh/sirh-saas/tendances-sirh-2024-un-marche-dynamique-et-innovant-au-service-de-la-performance-operationnelle.html
14. Exaegis, Blueprint GTA 2025/2026 (11/03/2026) : https://exaegis.com/actualites/blueprint-gta-gestion-des-temps-activit%C3%A9s-et-planification-des-ressources-2025/2026
15. Kelio, « Kelio classé leader dans le Blueprint 2026 d'Exaegis » (02/02/2026) : https://www.kelio.com/fr/societe/actualites/1267-kelio-positionne-leader-solutions-gta-planification-blueprint-markess.html
16. Fiche-de-paie.fr, externalisation de la paie (non daté) : https://www.fiche-de-paie.fr/externalisation-de-la-paie-tour-dhorizon/
17. INSEE, TIC 2025 (pas d'indicateur RH spécifique, non utilisé pour les chiffres) : https://www.insee.fr/fr/statistiques/8677764

### Rapports de marché (résumés publics)
18. The Business Research Company, Time and Attendance Software Global Market Report (sept. 2026) : https://www.thebusinessresearchcompany.com/report/time-and-attendance-software-global-market-report
19. Mordor Intelligence, Time and Attendance Software Market (mis à jour le 11/09/2026) : https://www.mordorintelligence.com/industry-reports/time-and-attendance-software-market
20. IMARC Group, Time and Attendance Software Market (mis à jour le 21/06/2026) : https://www.imarcgroup.com/time-attendance-software-market
21. Market Research Future, Time and Attendance Software Market (mis à jour le 09/09/2026) : https://www.marketresearchfuture.com/reports/time-and-attendance-software-market-21975
22. Mordor Intelligence, Workforce Management Software Market (mis à jour le 23/07/2026) : https://www.mordorintelligence.com/industry-reports/workforce-management-software-market-industry

### Concurrents : pages officielles, aide en ligne, presse, avis
23. Combo, tarifs : https://combohr.com/fr/pricing
24. Combo, centre d'aide (pointeuse) : https://guide.combohr.com/fr/articles/4521867-qu-est-ce-que-la-pointeuse-combo
25. Combo, page d'accueil : https://combohr.com/
26. Combo, partenariat Baker Tilly (mis à jour le 03/10/2024) : https://combohr.com/fr/blog/partenariat-baker-tilly-combo
27. Combo, page experts-comptables (sans contenu exploitable) : https://combohr.com/fr/lp/experts-comptables
28. Capterra, avis sur Combo : https://www.capterra.com/p/193701/Combo/reviews/
29. Skello, tarifs (FR) : https://www.skello.io/pricing
30. Skello, pricing (EN) : https://www.skello.io/en/pricing
31. Skello, comparateur de badgeuses : https://www.skello.io/landing/comparateur-badgeuse
32. Skello, page Badgeuses : https://www.skello.io/fonctionnalites/suivi-des-temps-de-travail/badgeuses
33. Skello, page Comptables et professionnels de la paie : https://www.skello.io/comptables-et-pro-de-la-paie
34. Skello, blog « Avis Combo » (mis à jour le 31/07/2026) : https://www.skello.io/blog/avis-combo-alternatives
35. Skello, blog « Pointeuse horaire prix » (consulté, non utilisé pour les chiffres) : https://www.skello.io/blog/pointeuse-horaire-prix
36. Trustpilot, avis sur Skello : https://fr.trustpilot.com/review/www.skello.io
37. RH Matin, Skello en Europe et IA (18/12/2025) : https://www.rhmatin.com/sirh/sirh-saas/planification-rh-comment-skello-avance-en-europe-et-sur-l-ia.html
38. Kelio, page d'accueil FR : https://www.kelio.com/fr/
39. Kelio, terminaux biométriques : https://www.kelio.com/hardware/clocking-in/biometric-clocking-terminals.html
40. Lucca, Feuilles de temps : https://www.lucca.fr/suivi-des-temps/timesheet/
41. Lucca, tarifs Feuilles de temps : https://www.lucca.fr/suivi-des-temps/timesheet/tarifs
42. Lucca, tarifs généraux : https://www.lucca.fr/tarifs/
43. Lucca, page d'accueil : https://www.lucca.fr/
44. Lucca, magazine (page index, sans noms d'outils) : https://www.lucca.fr/magazine/administration/suivi-temps/logiciels-pointage-heures
45. Mon Partenaire SIRH, tarifs Lucca (revendeur) : https://monpartenairesirh.fr/tarifs-lucca
46. RH Matin, Lucca × Silae (25/01/2024) : https://www.rhmatin.com/sirh/sirh-et-paie-lucca-et-silae-trouvent-un-terrain-d-entente-par-les-api.html
47. Factorial, tarifs : https://factorial.fr/tarifs
48. Factorial, aide « système de suivi du temps » : https://help.factorialhr.com/fr_FR/suivi-du-temps/a-propos-du-systeme-de-suivi-du-temps
49. Factorial, aide « intégration Silae » : https://help.factorialhr.com/fr_FR/integrations-de-paie/silae-integration
50. PayFit, offres et tarifs : https://payfit.com/pricing-lp/
51. PayFit, gestion des temps et activités : https://payfit.com/fr/gestion-des-temps-et-activites/
52. Eurécia, tarifs : https://www.eurecia.com/tarifs
53. Eurécia, logiciel pointeuse-badgeuse : https://www.eurecia.com/fonctionnalites/logiciel-pointeuse-badgeuse
54. Eurécia, logiciel temps et activités : https://www.eurecia.com/logiciel-temps-et-activites
55. Shiftbase, pricing : https://www.shiftbase.com/pricing
56. Shiftbase, page FR : https://www.shiftbase.com/fr
57. Agendrix, prix (fr-fr) : https://www.agendrix.com/fr-fr/prix
58. Agendrix, pointeuse-badgeuse RFID : https://www.agendrix.com/fr-fr/pointeuse-badgeuse-rfid
59. Agendrix, export Silae (06/07/2026) : https://support.agendrix.com/en/articles/11628893-how-to-export-payroll-data-to-silae
60. Agendrix, guide des prix des logiciels de planning en France (01/04/2026) : https://www.agendrix.com/fr-fr/blogue/logiciel-planning-comparaison-prix
61. Agendrix, modèle Excel gratuit de feuilles de temps : https://www.agendrix.com/fr/modele-excel-gratuit-feuilles-de-temps-de-travail
62. Jibble, page des plans : https://www.jibble.io/upgrade-plans
63. Jibble, page des plans (FR) : https://www.jibble.io/fr/plans-d-amelioration
64. Jibble, FAQ des abonnements (FR) : https://www.jibble.io/fr/aide/faq-sur-les-plans-dabonnements
65. Jibble, intégrations : https://www.jibble.io/collections/integrations
66. Jibble, page pricing (prix non lisibles) : https://www.jibble.io/pricing
67. Jibble, article sur les prix des logiciels de suivi du temps (ne contient pas les prix de Jibble) : https://www.jibble.io/article/time-tracking-software-pricing-plans
68. Clockify, pricing : https://clockify.me/pricing
69. Clockify, page FR : https://clockify.me/fr/
70. Connecteam, pricing : https://connecteam.com/pricing/
71. Connecteam, page FR (erreur 404) : https://connecteam.com/fr/
72. Octime, Expresso : https://www.octime.com/expresso/
73. Octime, badgeuses-pointeuses : https://www.octime.com/badgeuse-pointeuse/
74. Horoquartz, eTemptation : https://www.horoquartz.com/etemptation/
75. Planday, tarifs (FR) : https://www.planday.com/fr/tarifs/
76. Planday, pricing (UK) : https://www.planday.com/pricing/
77. Sesame HR, pricing : https://www.sesamehr.com/pricing/
78. Sesame HR, page FR : https://www.sesamehr.fr/
79. Bizneo HR, pricing : https://www.bizneo.com/en/pricing/
80. Bizneo HR, page FR : https://www.bizneo.com/fr/
81. Shyfter, pricing : https://shyfter.com/en/pricing
82. Pointeo : https://easypointage.fr/
83. Silae RH, aide « Badgeuse » : https://silae-rh.zendesk.com/hc/fr/articles/18904979890578--Badgeuse
84. Silae, page d'accueil : https://www.silae.fr/
85. Silae, API : https://www.silae.fr/api-silae/
86. Nibelis, suivi des présences et GTA : https://nibelis.com/produits-suite-rh-logiciel-gta-presence/
87. Folks RH (Canada) : https://folksrh.com/en/
88. Folk HR (erreur HTTP 500) : https://folkhr.com/ et https://folkhr.com/pricing/

### Cadre juridique et réglementaire
89. CJUE, communiqué de presse n° 61/19, affaire C-55/18 (14/05/2019, PDF) : https://curia.europa.eu/jcms/upload/docs/application/pdf/2019-05/cp190061fr.pdf
90. Code du travail numérique, article D3171-8 : https://code.travail.gouv.fr/code-du-travail/d3171-8
91. Code du travail numérique, article D3171-16 : https://code.travail.gouv.fr/code-du-travail/d3171-16
92. CNIL, « L'accès aux locaux et le contrôle des horaires sur le lieu de travail » : https://www.cnil.fr/fr/lacces-aux-locaux-et-le-controle-des-horaires-sur-le-lieu-de-travail
93. CNIL, « La géolocalisation des véhicules des salariés » : https://www.cnil.fr/fr/la-geolocalisation-des-vehicules-des-salaries
94. Service-public.gouv.fr, F1911, durée du travail (mis à jour le 25/09/2025) : https://www.service-public.gouv.fr/particuliers/vosdroits/F1911
95. Service-public.gouv.fr, F2391, heures supplémentaires (mis à jour le 08/06/2026) : https://www.service-public.gouv.fr/particuliers/vosdroits/F2391
96. Service-public.gouv.fr, F990, repos quotidien (vérifié le 20/09/2023) : https://www.service-public.gouv.fr/particuliers/vosdroits/F990
97. Görg, décision BAG du 13/09/2022 (1 ABR 22/21) : https://www.goerg.de/en/insights/publications/13-09-2022/bag-statutory-obligation-to-record-working-time-yet-works-councils-lack-the-right-to-take-the-initiative-to-introduce-electronic-timekeeping
98. Protime, registre horaire numérique obligatoire en Espagne (mis à jour le 07/04/2026) : https://www.protime.eu/es-es/noticias/registro-horario-digital-obligatorio-2026
99. Controlhorario.com, loi espagnole sur le registre horaire (mise à jour en juin 2026) : https://controlhorario.com/ley-registro-horario/

### Pages consultées mais inaccessibles, vides ou non utilisées (transparence)
100. France Num, guide pointage TPE/PME (contenu vide) : https://www.francenum.gouv.fr/guides-et-conseils/gestion-des-ressources-humaines/systeme-dinformation-de-gestion-des-ressources-7
101. France Num, guide GTA (contenu vide) : https://www.francenum.gouv.fr/guides-et-conseils/gestion-des-ressources-humaines/systeme-dinformation-de-gestion-des-ressources-5
102. France Num, page Baromètre 2025 (contenu vide) : https://www.francenum.gouv.fr/guides-et-conseils/strategie-numerique/comprendre-le-numerique/barometre-france-num-2025-le
103. France Num, rapport 2025 (PDF illisible) : https://www.francenum.gouv.fr/files/2025-09/Barom%C3%A8tre%20France%20Num%202025%20-%20Rapport.pdf
104. Data Economie, page Baromètre France Num (pas de données sur la page) : https://data.economie.gouv.fr/pages/barometre-france-num/
105. economie.gouv.fr, article Baromètre 2025 (erreur 403) : https://www.economie.gouv.fr/actualites/transformation-numerique-des-tpepme-les-enseignements-du-barometre-2025-de-france-num
106. Mastercard Newsroom 2026 (erreur 403) : https://www.mastercard.com/news/europe/fr-fr/salle-de-presse/communiques-de-presse/fr-fr/2026/des-tpe-mieux-equipees-mais-prudentes-face-a-l-ia-la-cybersecurite-et-la-facturation-electronique
107. EUR-Lex, arrêt C-55/18 (contenu vide ; communiqué CURIA utilisé à la place) : https://eur-lex.europa.eu/legal-content/FR/TXT/?uri=CELEX%3A62018CJ0055
108. Skello, tarifs (erreur 404) : https://www.skello.io/tarifs
109. PayFit, tarifs (erreur 404) : https://payfit.com/fr/tarifs/
110. Sesame HR, tarifs FR (erreur 404) : https://www.sesamehr.fr/tarifs/
111. Combo, redirection de l'ancienne URL tarifs (vers une 404) : https://www.combohr.com/fr/tarifs
112. PricingSaaS, Planday (données incohérentes, non utilisées) : https://pricingsaas.com/companies/planday
113. actiTIME, « Jibble pricing » (contenu actiTIME, non utilisé) : https://www.actitime.com/software-collections/jibble-pricing
114. Impli, avis Skello (pas d'information d'hébergement) : https://www.impli.fr/avis/skello
115. Absys Cyborg, Lucca (erreur d'en-tête) : https://www.absyscyborg.com/fr/logiciels/lucca/timmi/timmi-feuilles-de-temps
116. Temps d'Avance, webinar GTA (sans chiffres) : https://www.tempsdavance.com/project/dynamiques-de-la-gta-quelles-tendances-et-perspectives-davenir/
117. LogicielRH, comparatif pointage TPE/PME (contradictions avec les pages officielles, non utilisé pour les prix) : https://logicielrh.fr/2026/06/25/logiciel-pointage-tpe-pme/
118. Expert-comptable-tpe.fr, externalisation de la paie (pas de statistiques) : https://www.expert-comptable-tpe.fr/externalisation-paie-expert-comptable/
119. Shyfter, article sur le coût d'un système de pointage (redirection, non suivie) : https://shyfter.co/fr/actualites/cout-de-mise-en-place-dun-systeme-de-pointage/

*Fin du document.*
