# WorkHoraire : besoins utilisateurs des TPE/PME françaises en pointage et gestion des temps

*Recherche documentaire (desk research), version du 23/09/2026. Sources consultées le 23/09/2026.*
*Périmètre : entreprises françaises de 1 à 49 salariés qui gèrent aujourd'hui leurs heures sur Excel ou sur papier. Rôles étudiés : ADMIN (dirigeant/RH), MANAGER, EMPLOYEE, plus un acteur externe : l'expert-comptable ou le gestionnaire de paie.*

---

## Sommaire

0. Synthèse
1. Méthode, conventions et limites
2. Qui achète, qui utilise, et dans quels secteurs
3. Les douleurs de la gestion sur Excel ou papier
4. Outils existants : ce que les utilisateurs apprécient et reprochent
5. Contextes d'usage
6. Critères d'achat, adoption et causes d'abandon
7. Rôle de l'expert-comptable et du gestionnaire de paie
8. Patterns UX repérés chez les leaders
9. Hypothèses à valider : personas, jobs-to-be-done, guide d'entretien
10. Données introuvables ou non vérifiées
11. Sources consultées

---

## 0. Synthèse

1. **Une obligation légale crée le besoin, et la preuve est l'enjeu central.** Quand les salariés ne suivent pas un horaire collectif affiché, l'employeur doit :
   - enregistrer chaque jour les heures de début et de fin (ou le nombre d'heures) ;
   - faire un récapitulatif chaque semaine ;
   - établir chaque mois un document annexé au bulletin, qui indique le cumul des heures supplémentaires et le repos compensateur.

   En cas de litige, c'est l'employeur qui doit justifier les horaires devant le juge. Tout système automatique doit être « fiable et infalsifiable ». Un salarié peut réclamer des salaires sur 3 ans. Mentionner moins d'heures que les heures réellement faites est une dissimulation d'emploi, qui donne droit à une indemnité de 6 mois de salaire en cas de rupture. Sources : [D3171-8](https://code.travail.gouv.fr/code-du-travail/d3171-8), [D3171-12](https://code.travail.gouv.fr/code-du-travail/d3171-12), [L3171-4](https://code.travail.gouv.fr/code-du-travail/l3171-4), [L3245-1](https://code.travail.gouv.fr/code-du-travail/l3245-1), [L8221-5](https://code.travail.gouv.fr/code-du-travail/l8221-5), [L8223-1](https://code.travail.gouv.fr/code-du-travail/l8223-1).

2. **La gestion manuelle est répandue mais mal mesurée.** La seule enquête trouvée vient d'un éditeur (Beebole, 2022) et sa méthodologie n'est pas accessible. Elle indique que seulement 36 % des PME mesurent le temps de travail, et le plus souvent à la main ([Blog RH](https://www.blog-rh.com/2022/03/enquete-mesure-temps-travail-beebole/)). Les chiffres de 30 % et de 60 % qui circulent n'ont pas pu être vérifiés (voir section 10).

3. **Les heures supplémentaires et les erreurs de paie sont des douleurs documentées.** Selon ADP :
   - 58 % des salariés français font régulièrement des heures supplémentaires non rémunérées (2019) ;
   - les salariés de PME en font 6 h par semaine en moyenne (étude 2023) ;
   - 23 % des salariés de PME se disent souvent ou toujours sous-payés à cause d'erreurs de paie (2023).

   Sources : [ADP 2019](https://www.fr.adp.com/a-propos-adp/communiques-de-presse/heures-supplementaires-non-remunerees-moitie-salaries-francais.aspx), [ADP PME](https://www.fr.adp.com/ressources/insights/people-at-work-etude-workforce-view-pme-et-eti.aspx).

4. **Les secteurs où le besoin est le plus fort.**
   - **HCR (le mieux documenté)** : plus de 4 salariés sur 5 travaillent dans des établissements de moins de 50 personnes. Environ 60 % des projets de recrutement sont saisonniers. 81 % des salariés travaillent le samedi et 62 % le dimanche. Un récapitulatif hebdomadaire signé est exigé, avec des majorations d'heures supplémentaires propres à la convention.
   - **Ensuite, avec des preuves plus minces** : commerce, propreté (temps partiel massif, salariés multi-employeurs), BTP, santé privée (travail de nuit).
   - **Aide à domicile** : c'est une niche à part, qui repose sur la télégestion exigée par les financeurs.

5. **Ce que disent les avis sur les outils existants.**
   - **Points appréciés** : la simplicité et le temps gagné sur les plannings.
   - **Reproches** : application salarié limitée (le salarié ne voit pas ses heures, ses compteurs ni l'historique), export vers la paie payant ou limité, prix opaque ou en hausse avec engagement, support après-vente, bugs de synchronisation et de mode hors-ligne, paramétrage lourd chez les acteurs historiques.

6. **La confiance conditionne l'acceptabilité.**
   - La CNIL juge excessives la biométrie et la photo systématique pour contrôler les horaires ([CNIL](https://www.cnil.fr/fr/lacces-aux-locaux-et-le-controle-des-horaires-sur-le-lieu-de-travail)).
   - La géolocalisation n'est admise que si aucun autre moyen n'existe, et jamais en dehors du temps de travail ([CNIL géolocalisation](https://www.cnil.fr/fr/la-geolocalisation-des-vehicules-des-salaries)).
   - Parmi les salariés déjà surveillés, 59 % préféreraient ne plus l'être. En même temps, 44 % jugent utile la preuve des heures travaillées et 51 % pensent que leurs heures supplémentaires seraient mieux prises en compte ([GetApp 2020](https://www.getapp.fr/blog/1822/mefiance-utilite-rapport-ambigu-salarie-surveillance)).

7. **Le contexte d'usage.**
   - Salariés « deskless » : 91 % des Français possèdent un smartphone ([Arcep 2026](https://www.arcep.fr/cartes-et-donnees/nos-publications-chiffrees/barometre-du-numerique/le-barometre-du-numerique-edition-2026.html)), mais beaucoup n'ont pas d'e-mail professionnel.
   - Tablette partagée à l'entrée, connectivité instable. Chez Combo, les pointages sont perdus au-delà de 72 h hors ligne ([Combo](https://guide.combohr.com/fr/articles/6636635-comment-fonctionne-le-mode-hors-ligne-de-la-pointeuse-combo)).
   - Horaires atypiques (44 % des salariés), postes de nuit qui passent minuit, temps partiels.

8. **L'expert-comptable est un acteur clé.** Silae équiperait environ 80 % des cabinets et produirait 7,5 à 8 millions de bulletins par mois ([RH Matin](https://www.rhmatin.com/paie/logiciels-paie/logiciels-de-paie-silae-sous-pression-revise-les-tarifs-visant-les-experts-comptables.html), [Compta Online](https://www.compta-online.com/paie-silae-payfit-ao8818)).
   - Le cabinet attend un fichier CSV mensuel avec matricule et codes de rubriques, validé avant une date butoir, sans ressaisie.
   - Les cabinets décrivent leur douleur principale : relancer les clients et ressaisir les variables ([Agiris](https://www.agiris.fr/articles/paie/variables-de-paie-eviter-la-saisie-infernale-en-cabinet)).

9. **Patterns UX à retenir** (détail en section 8) :
   - Pointage sur tablette partagée avec code PIN, signature ou photo aléatoire.
   - Rappels, et journée laissée « à résoudre » plutôt qu'une clôture automatique silencieuse.
   - Validation manager avec auto-validation des journées sans anomalie.
   - Alertes légales informatives ou bloquantes.
   - Parcours de demande d'absence avec statuts.

---

## 1. Méthode, conventions et limites

**Méthode.** J'ai mené une recherche web le 23/09/2026 et consulté environ 120 pages. Il s'agit de :
- textes officiels (Code du travail numérique, CNIL, ministère de la Justice, solidarites.gouv.fr) ;
- statistiques publiques (INSEE, DARES citée par l'INRS, France Travail, DRIEETS, Arcep) ;
- enquêtes publiées (ADP, Capterra, GetApp, Beebole, baromètre Tissot/PayFit, SDI) ;
- avis clients (Capterra, Trustpilot, App Store France, Appvizer) ;
- centres d'aide et pages tarifs d'éditeurs (Combo, Skello, Factorial, Jibble, Lucca) ;
- presse spécialisée (L'Hôtellerie Restauration, RH Matin, Compta Online, Next, Village Justice).

**Conventions.**
- Tout **constat** est suivi de sa source, sous forme de lien vers l'URL réellement consultée.
- **« Hypothèse : »** signale une inférence de ma part, qui n'est pas sourcée.
- **« (affirmation éditeur) »** signale un chiffre marketing non étayé par une étude.
- Les notes des plateformes d'avis ne sont **pas représentatives** : les auteurs d'avis sont auto-sélectionnés et les éditeurs sollicitent souvent leurs clients. Elles servent à repérer des thèmes, pas à mesurer une satisfaction.
- **Verbatims** : pour respecter le droit d'auteur des personnes qui ont écrit les avis, leurs contenus sont **paraphrasés**. Une seule citation courte est reproduite, en section 5.8. Les extraits de textes de loi (actes officiels) sont cités brièvement.

**Limites d'accès.** Les pages suivantes n'ont pas pu être lues et ne sont donc pas utilisées comme sources :
- les guides France Num et le rapport du Baromètre France Num 2025 (contenu vide) ;
- la page DARES sur les horaires atypiques (captcha) ;
- G2 (erreur 403) ;
- Google Play (page illisible) ;
- le support Lucca (page illisible) ;
- des pages de presse américaine (erreur HTTP 451).

En fin de mission, le quota de recherche web était épuisé. Certains points, comme les indemnités spécifiques du BTP ou les chiffres propres au commerce de détail, n'ont donc pas pu être approfondis.

**Biais.** De nombreuses sources sont des contenus d'éditeurs. Je les utilise surtout pour **décrire des fonctionnalités** (patterns), pas pour chiffrer le marché.

---

## 2. Qui achète, qui utilise, et dans quels secteurs

### 2.1 Taille du marché (repères)

- En 2023, la France compte 5,2 millions d'entreprises marchandes non agricoles et non financières ([INSEE](https://www.insee.fr/fr/statistiques/5424748), page mise à jour le 26/01/2026).
  - 4 995 894 sont des microentreprises (96,5 %) ;
  - 174 614 sont des PME hors microentreprises (3,4 %) ;
  - les microentreprises concentrent 17,1 % des salariés en équivalent temps plein, les PME hors micro 29,2 %.
  - Les catégories INSEE (moins de 10 salariés, et 10 à 249) ne correspondent pas exactement à la cible 1 à 49 salariés.

### 2.2 Acheteurs et utilisateurs

**Constats**

- **Dans les TPE, le dirigeant gère souvent seul l'administratif.**
  - Dans une enquête du Syndicat des Indépendants (02/05/2023), 71 % des dirigeants déclarent gérer seuls les charges administratives ([SDI](https://sdi-pme.fr/enquete-sur-le-temps-passe-et-les-couts-administratifs-des-independants-et-dirigeants-de-tpe/)).
  - 54 % des TPE y consacrent entre 1 et 3 % de leur chiffre d'affaires en externalisation.
- **Quand une fonction RH existe, elle est saturée.** 60 % des professionnels RH passent au moins la moitié de leur temps sur des tâches administratives, et 54 % disent manquer de temps et de ressources (baromètre Éditions Tissot / PayFit, 09/04/2026, [PayFit](https://payfit.com/fr/ressources/barometre-2026-rh-au-quotidien/)). La taille des entreprises interrogées n'est pas précisée.
- **Les outils du marché séparent un terminal partagé pour pointer et une application personnelle salarié/manager.**
  - Combo distingue l'application tablette « La Pointeuse Combo » de l'application « Combo » installée sur le téléphone des salariés ([guide Combo](https://guide.combohr.com/fr/articles/4521867-la-pointeuse-combo-simple-et-efficace)).
  - Skello fait de même avec une application badgeuse d'un côté et une application équipes de l'autre ([App Store Skello badgeuse](https://apps.apple.com/fr/app/time-clock-by-skello/id1222875548?l=en)).
- **Qui achète aujourd'hui, d'après les avis.**
  - Sur Capterra, les avis sur Combo viennent de la restauration, du commerce de détail, de la santé et du bien-être, des loisirs et de la construction ([Capterra Combo](https://www.capterra.com/p/193701/Combo/)).
  - Ceux sur Skello viennent de l'hôtellerie, de la restauration, du commerce de détail, des hôpitaux et des cabinets médicaux ([Capterra Skello](https://www.capterra.com/p/179936/Skello/reviews/)).
  - Combo cible explicitement les restaurants, hôtels, boulangeries, pharmacies et magasins ([App Store Combo](https://apps.apple.com/fr/app/combo/id1112460631)).
- **Un déclencheur documenté : l'inspection du travail.**
  - Quand une entreprise ne contrôle pas régulièrement la durée du travail, l'inspection exige souvent une badgeuse.
  - La loi n'impose pas de badgeuse : des relevés manuels signés par les salariés suffisent ([L'Hôtellerie Restauration, 2012](https://www.lhotellerie-restauration.fr/actualite/avec-ou-sans-badgeuse-vous-devez-decompter-le-temps-de-travail) ; [question-réponse d'un restaurateur](https://www.lhotellerie-restauration.fr/sos-experts/question-reponse/pointeuse-les-restaurant-ont-ils-l-obligation-d-en-installer-24037)).
- **Pour se renseigner avant d'acheter**, les entreprises françaises qui réussissent leurs achats s'appuient d'abord sur des experts du secteur (55 %), puis sur des sites d'avis et de comparaison (41 %) ([Capterra 2026](https://www.capterra.fr/blog/7672/acheter-logiciel-en-france-tendances)).

**Hypothèses**

- Hypothèse : dans une entreprise de 1 à 9 salariés, l'acheteur, l'administrateur et le valideur sont la même personne, le dirigeant. Entre 10 et 49 salariés, un office manager, un assistant RH ou le DAF prépare les données et le dirigeant signe.
- Hypothèse : quand la paie est externalisée, l'expert-comptable est un prescripteur fort. C'est cohérent avec le poids des conseils d'experts dans les sources d'information.
- Hypothèse : les déclencheurs d'achat sont surtout des événements plutôt qu'une démarche d'optimisation : litige ou réclamation d'heures supplémentaires, contrôle de l'inspection, passage de 10 salariés, ouverture d'un deuxième site, départ de la personne qui tenait le fichier Excel, changement de cabinet comptable.

### 2.3 Le cadre légal qui crée le besoin, tous secteurs confondus

| Obligation | Référence | Implication produit (hypothèse) |
|---|---|---|
| Documents de décompte obligatoires si tous les salariés ne suivent pas le même horaire collectif ; le CSE peut les consulter | [L3171-2](https://code.travail.gouv.fr/code-du-travail/l3171-2) | Un décompte individuel est nécessaire |
| Enregistrement **quotidien** du début et de la fin de chaque période (ou du nombre d'heures), plus un récapitulatif **hebdomadaire** | [D3171-8](https://code.travail.gouv.fr/code-du-travail/d3171-8) | Unité de base : la journée, avec des cumuls par semaine |
| Document **mensuel annexé au bulletin** : cumul des heures supplémentaires depuis le début de l'année, repos compensateur acquis et pris | [D3171-12](https://code.travail.gouv.fr/code-du-travail/d3171-12) | Générer un relevé mensuel par salarié |
| Conservation **1 an** des documents de décompte (3 ans pour les forfaits jours) | [D3171-16](https://code.travail.gouv.fr/code-du-travail/d3171-16) | Archivage |
| En litige, l'employeur fournit au juge les éléments justifiant les horaires ; un enregistrement automatique doit être « fiable et infalsifiable » | [L3171-4](https://code.travail.gouv.fr/code-du-travail/l3171-4) | Horodatage serveur et journal des corrections |
| Action en paiement du salaire prescrite après **3 ans** | [L3245-1](https://code.travail.gouv.fr/code-du-travail/l3245-1) | Hypothèse : conserver les preuves au moins 3 ans, au-delà du minimum d'un an |
| Mentionner sur le bulletin moins d'heures que les heures réellement faites constitue une dissimulation d'emploi ; indemnité forfaitaire de 6 mois de salaire en cas de rupture | [L8221-5](https://code.travail.gouv.fr/code-du-travail/l8221-5), [L8223-1](https://code.travail.gouv.fr/code-du-travail/l8223-1) | L'enjeu financier est fort pour le dirigeant |
| La CJUE impose aux États de prévoir un système **objectif, fiable et accessible** de mesure du temps de travail quotidien (arrêt du 14/05/2019, C-55/18) | [Force Ouvrière](https://www.force-ouvriere.fr/temps-de-travail-l-employeur-doit-le-mesurer) | « Accessible » renvoie aussi à l'accès du salarié à ses propres données |

### 2.4 Secteurs où le besoin est le plus fort

| Secteur | Constats sourcés | Ce qui rend le besoin spécifique |
|---|---|---|
| **Hôtels, cafés, restaurants (HCR)** | Au 31/12/2016, 1 003 300 salariés, dont 39,8 % dans des établissements de moins de 10 salariés et 42,4 % dans des établissements de 10 à 49 ; environ 60 % des projets de recrutement sont saisonniers (enquête BMO 2017) ; 39,7 % des salariés ont moins de 30 ans ; 81 % des employés et agents de maîtrise travaillent le samedi et 62 % le dimanche (DARES 2016) ([France Travail, déc. 2017](https://www.francetravail.org/files/live/sites/peorg/files/documents/Statistiques-et-analyses/E&S/ES_39_les%20metiers%20de%20l'hotellerie%20et%20de%20la%20restauration.pdf)). Récapitulatif hebdomadaire signé par le salarié et l'employeur, document mensuel annexé à la paie ([GHR](https://www.ghr.fr/social/les-obligations-liees-a-l-execution-du-contrat-de-travail/l-encadrement-de-la-duree-du-travail/le-controle-du-temps-de-travail?lang=fr)). Majorations HCR : +10 % de la 36e à la 39e heure, +20 % de la 40e à la 43e, +50 % au-delà ([LégiSocial](https://www.legisocial.fr/conventions-collectives-nationales/1979-hcr-hotels-cafes-restaurants/heures-supplementaires-temps-partiel.html)). Contingent annuel de 360 h en établissement permanent, 90 h par trimestre en établissement saisonnier ([Code du travail numérique](https://code.travail.gouv.fr/contribution/1979-heures-supplementaires)). | Très petites structures, rotation du personnel, extras et saisonniers, services coupés, week-ends, règles conventionnelles propres au secteur. C'est le cœur de cible des outils actuels (Combo, Skello). |
| **Commerce de détail, boulangerie, pharmacie** | 35 % des salariés travaillent le samedi (DARES, cité par l'[INRS](https://www.inrs.fr/risques/travail-horaires-atypiques/donnees-generales-et-exposition-aux-risques.html)). Présence forte parmi les auteurs d'avis ([Capterra Skello](https://www.capterra.com/p/179936/Skello/reviews/), [Capterra Combo](https://www.capterra.com/p/193701/Combo/)) et dans le ciblage de Combo ([App Store Combo](https://apps.apple.com/fr/app/combo/id1112460631)). | Hypothèse : besoins proches de l'HCR (shifts, samedis, temps partiels) ; les points de vente multiples font émerger un besoin multi-sites. |
| **BTP, artisans** | Dans l'enquête ADP 2019, 59 % des répondants du secteur « bâtiment et ingénierie » font au moins 5 h non rémunérées par semaine ([ADP 2019](https://www.fr.adp.com/a-propos-adp/communiques-de-presse/heures-supplementaires-non-remunerees-moitie-salaries-francais.aspx)). Selon l'éditeur Traxxeo : les types d'heures sont nombreux (pluie, nuit, heures supplémentaires, heures complémentaires), les budgets d'heures sont suivis par chantier ([Traxxeo](https://traxxeo.com/gestion-temps/calcul-heures/gestion-des-heures/)), et il peut s'écouler jusqu'à 15 jours entre la transmission des feuilles Excel et leur traitement ([Traxxeo Excel](https://traxxeo.com/gestion-temps/excel/)) (affirmation éditeur). | Plusieurs chantiers, absence de poste fixe, chef d'équipe relais. Hypothèse : indemnités de trajet et de panier à exporter vers la paie, à valider. |
| **Propreté** | Plus de 15 000 entreprises, plus de 600 000 emplois, 64 % de femmes ([Monde de la Propreté](https://www.monde-proprete.com/chiffres-cles-proprete)). Trois quarts des salariés à temps partiel, 45 % avec des contrats de moins de 17,5 h par semaine, de nombreux postes en horaires décalés, plus de la moitié des salariés multi-employeurs ([DRIEETS Île-de-France, février 2014, données 2012](https://idf.drieets.gouv.fr/sites/idf.drieets.gouv.fr/IMG/pdf/focus_sae_proprete_-_version_definitive.pdf)). 90 % de multi-employeurs, avec 3 employeurs en moyenne (INSEE DADS 2023, cité par la [CFDT, 09/12/2024](https://services.cfdt.fr/sinformer/nos-combats/les-gouvernements-changent-mais-la-federation-des-entreprises-de-proprete-dhygiene-et-services-associes-fep-reste-la-meme)). | Travail chez le client (pas de tablette fixe), petits contrats, horaires très tôt ou très tard. La géolocalisation est tentante mais encadrée par la CNIL (voir 5.9). |
| **Aide à domicile** | Le guide officiel des bonnes pratiques des services d'aide à domicile (SAAD) indique que les conseils départementaux peuvent encourager la télégestion chez tous les bénéficiaires. Télégestion et optimisation des plannings peuvent limiter les horaires fragmentés. Le temps de trajet ne peut pas être compté comme temps d'intervention financé par l'APA ou la PCH (Cass. civ. 1, 12/10/2016) ([solidarites.gouv.fr](https://solidarites.gouv.fr/sites/solidarite/files/2023-01/Aide%20%C3%A0%20domicile%20aux%20personnes%20%C3%A2g%C3%A9es%20et%20aux%20personnes%20handicap%C3%A9es%20par%20les%20SAAD%20prestataires%20%20le%20guide%20des%20bonnes%20pratiques.pdf)). | Hypothèse : c'est une niche où la télégestion dépend des départements et de la facturation au financeur, avec des outils spécialisés en place. À ne pas viser en premier. |
| **Santé privée** (cliniques, cabinets, établissements pour personnes âgées) | Infirmières et aides-soignantes font partie des 5 professions qui travaillent le plus la nuit ([INRS](https://www.inrs.fr/risques/travail-horaires-atypiques/donnees-generales-et-exposition-aux-risques.html)). On trouve des avis d'hôpitaux et de cabinets médicaux sur Skello ([Capterra Skello](https://www.capterra.com/p/179936/Skello/reviews/)). | Hypothèse : postes de 12 h, nuits, week-ends ; fort besoin d'alertes sur les temps de repos. |
| **Logistique, transport** | Les conducteurs sont la première profession travaillant de nuit ([INRS](https://www.inrs.fr/risques/travail-horaires-atypiques/donnees-generales-et-exposition-aux-risques.html)). Amazon France Logistique a été sanctionné par la CNIL (32 M€, 23/01/2024) pour une surveillance jugée excessivement intrusive via des scanners et des indicateurs d'inactivité ([Décideurs Juridiques](https://www.decideurs-juridiques.com/affaires-juridiques/57358-surveillance-des-salaries-la-cnil-inflige-une-amende-de-32-millions-d-euros-a-amazon-france-logistique.html)). Le Conseil d'État a ramené l'amende à 15 M€ (23/12/2025), a validé l'intérêt légitime comme base légale, mais a maintenu le manquement à la minimisation (conservation des données pendant 31 jours) ([Haas Avocats](https://www.haas-avocats.com/reglementation/surveillance-des-salaries-chez-amazon-le-conseil-detat-precise-le-cadre-rgpd/)). | Sujet sensible socialement. Hypothèse : le transport routier relève de régimes spécifiques et sort de la cible initiale. |
| **Agences, services** | Le pointage auto-déclaratif convient aux commerciaux, aux télétravailleurs et aux salariés en mission ; la badgeuse y est souvent perçue comme du « flicage » ([Lucca, 18/11/2021](https://www.lucca.fr/magazine/administration/suivi-temps/choisir-pointage-auto-declaratif)). Dans l'enquête Beebole, les PME qui mesurent le temps l'utilisent pour l'analyse (65 %), le budget (19 %) et des raisons légales (31 %) ([TPE Mag](https://www.tpe-mag.fr/temps-de-travail-une-donnee-essentielle.html)). | Hypothèse : le besoin porte sur des feuilles de temps par projet plutôt que sur un pointage. Segment secondaire. |

**Hypothèse de priorisation (à valider en entretien) :**
1. HCR
2. Commerce alimentaire, boulangerie, pharmacie
3. Propreté
4. BTP second œuvre
5. Santé privée

Aide à domicile et transport sont à écarter au lancement.

---

## 3. Les douleurs de la gestion sur Excel ou papier

### 3.1 Quelle part des entreprises est encore « en manuel » ?

- **Enquête Beebole** (éditeur, relayée par [Blog RH, mars 2022](https://www.blog-rh.com/2022/03/enquete-mesure-temps-travail-beebole/)) :
  - 36 % des PME françaises mesurent le temps de travail de leurs employés ;
  - la majorité de ces entreprises utilisent des feuilles de temps manuelles ;
  - la première raison de rester en manuel est l'habitude, puis l'économie ;
  - 73 % des dirigeants équipés jugent un outil plus efficace que le suivi manuel, et 55 % disent y gagner en visibilité ;
  - un dirigeant de PME sur trois dit manquer de données pour décider au quotidien.
- **Chiffres divergents.** [TPE Mag](https://www.tpe-mag.fr/temps-de-travail-une-donnee-essentielle.html) cite, pour la même enquête, 32 % des PME qui mesurent et 57 % sans aucun outil. La méthodologie (taille d'échantillon, date, tailles d'entreprise) n'apparaît dans aucune des pages consultées : **confiance faible**.
- **Non vérifié.** Des extraits de recherche attribués à France Num avancent que seules 30 % des PME utiliseraient une solution digitale de gestion des temps et que plus de 60 % utiliseraient Excel. La page n'a pas pu être lue : ces chiffres ne sont pas retenus.
- **Douleurs qualitatives listées par des éditeurs, sans données** : feuilles illisibles ou perdues, formules Excel cassées, doublons, pas d'horodatage, modifications sans trace, pas de suivi en temps réel ([Esperoo](https://esperoo.fr/blog/feuille-de-pointage-gestion-temps-travail), [Timy](https://www.timy-badgeuse.fr/post/gestion-temps-travail-tpe-pme-2026)).

### 3.2 Erreurs et paie

- **ADP, focus PME 2023.** Échantillon : 1 027 salariés de PME en France ; terrain d'octobre à novembre 2022. 23 % des salariés de PME se disent toujours ou souvent sous-payés à cause d'erreurs de paie ([ADP PME](https://www.fr.adp.com/ressources/insights/people-at-work-etude-workforce-view-pme-et-eti.aspx)).
- **ADP, People at Work 2024.** Plus de 34 000 travailleurs dans 18 pays. 67 % des répondants français déclarent être régulièrement sous-payés à la suite d'une erreur sur leur fiche de paie ([ADP 2024](https://www.fr.adp.com/ressources/insights/people-at-work-2024.aspx)). C'est un chiffre déclaratif, étonnamment élevé : à manier avec prudence.
- **BTP.** Les erreurs des fiches Excel se répercutent sur les bulletins et deviennent difficiles à corriger ; il peut s'écouler jusqu'à 15 jours entre la transmission et le traitement ([Traxxeo](https://traxxeo.com/gestion-temps/excel/)) (affirmation éditeur).
- **Chiffre non sourcé.** Combo affirme que les restaurateurs perdent 15 à 20 h par mois sur une paie manuelle, sans citer d'étude ([Combo, blog paie HCR, 11/06/2026](https://combohr.com/fr/blog/logiciel-paie-hcr)).

### 3.3 Temps passé

- 71 % des dirigeants de TPE gèrent seuls leurs charges administratives ([SDI](https://sdi-pme.fr/enquete-sur-le-temps-passe-et-les-couts-administratifs-des-independants-et-dirigeants-de-tpe/)).
- Côté cabinet comptable, les équipes paie passent chaque fin de mois à courir après les éléments variables de paie : relances répétées, ressaisie manuelle, erreurs de calcul, délais serrés ([Agiris, 12/02/2025](https://www.agiris.fr/articles/paie/variables-de-paie-eviter-la-saisie-infernale-en-cabinet)).
- Des témoignages de cabinets, publiés par un éditeur, évoquent environ une journée de travail gagnée par mois quand les clients saisissent leurs variables en ligne plutôt que par e-mail ([Flocompta](https://flocompta.com/)).
- **Donnée manquante** : aucune étude indépendante ne mesure le temps qu'un dirigeant de TPE passe à préparer les heures pour la paie.

### 3.4 Heures supplémentaires et litiges

- **Ampleur.**
  - ADP 2019, sur 1 410 répondants français : 58 % font régulièrement des heures supplémentaires non rémunérées, 4 h 37 par semaine en moyenne, et 12 % plus de 10 h ([ADP 2019](https://www.fr.adp.com/a-propos-adp/communiques-de-presse/heures-supplementaires-non-remunerees-moitie-salaries-francais.aspx)).
  - Salariés de PME : 6 h par semaine, contre 5 h pour l'ensemble des salariés français ([ADP PME](https://www.fr.adp.com/ressources/insights/people-at-work-etude-workforce-view-pme-et-eti.aspx)).
- **Jurisprudence.**
  - Cass. soc. 18/03/2020, n° 18-10.919 : le salarié présente des éléments suffisamment précis ; l'employeur, qui assure le contrôle des heures, y répond avec ses propres éléments ([Village Justice](https://www.village-justice.com/articles/paiement-des-heures-supplementaires-nouvel-amenagement-charge-preuve-favorable,34532.html)).
  - Cass. soc. 27/01/2021, n° 17-31.046 : l'employeur ne peut pas écarter une demande au motif que le salarié ne détaille pas ses pauses ; c'est à lui de prouver qu'elles ont été prises ([CFDT](https://www.cfdt.fr/mes-droits/actualites-juridiques/duree-et-organisation-du-travail/heures-supplementaires-la-charge-de-la-preuve-ne-repose-pas-sur-le-seul-salarie)).
  - Cass. 11/05/2023 : le seul dépassement de la durée maximale de travail ouvre droit à réparation ([Force Ouvrière](https://www.force-ouvriere.fr/temps-de-travail-l-employeur-doit-le-mesurer)).
- **Statistiques des prud'hommes.**
  - 84 051 affaires nouvelles au fond en 2022, contre 146 576 en 2012 ; 81,5 % contestent le motif de la rupture.
  - Les demandes de créances salariales représentent environ 10 % des affaires (8,6 % sans contestation de la rupture, 2,5 % sans rupture).
  - La nomenclature officielle **n'isole pas** les heures supplémentaires ([ministère de la Justice, mai 2024](https://www.justice.gouv.fr/sites/default/files/2024-07/etude_affaires%20prudhomales_mai_2024.pdf)).
- Hypothèse : les réclamations d'heures supplémentaires arrivent surtout **au moment de la rupture**, en complément d'une contestation du licenciement. Le risque se concrétise donc tard, d'où le besoin de preuves conservées au moins 3 ans.

### 3.5 Manque de preuve et fiabilité

- Un enregistrement automatique doit être « fiable et infalsifiable » ([L3171-4](https://code.travail.gouv.fr/code-du-travail/l3171-4)). En HCR, le récapitulatif hebdomadaire doit être signé par le salarié et l'employeur ([GHR](https://www.ghr.fr/social/les-obligations-liees-a-l-execution-du-contrat-de-travail/l-encadrement-de-la-duree-du-travail/le-controle-du-temps-de-travail?lang=fr)).
- Cass. soc. 08/03/2023, n° 21-20.798 : des données de badgeage servant au contrôle d'accès ont été invoquées pour prouver une fraude sur les horaires déclarés. Une preuve illicite n'est pas forcément écartée : le juge vérifie la proportionnalité ([Maître Data](https://www.maitredata.com/app/jurisprudence/cass-soc-8-mars-2023-n21-20798)).
- Hypothèse : la facilité à modifier un fichier Excel est à la fois appréciée (souplesse) et une faiblesse juridique (absence de trace).

### 3.6 Oublis de pointage

- **Donnée manquante** : aucune statistique publique sur la fréquence des oublis n'a été trouvée.
- **Signaux dans les avis.**
  - Kelio : quand un pointage oublié n'est pas validé parce que le manager est absent, les RH peuvent croire que le salarié n'a pas travaillé, et il est impossible d'ajouter une note ([Capterra Kelio](https://www.capterra.com/p/181942/Kelio/reviews/)).
  - Jibble : sans sortie automatique, les relevés d'heures gonflent ([Capterra Jibble](https://www.capterra.com/p/156992/Jibble/reviews/)).
  - Clockify : un chronomètre oublié donne des relevés faux ([Capterra Clockify](https://www.capterra.com/p/169607/Clockify/reviews/)).
- **Juridique.**
  - Selon Factorial, un oubli ne peut pas donner lieu à une sanction pécuniaire ([Factorial](https://factorial.fr/blog/oubli-pointage/)).
  - Cass. soc. 21/06/2018, n° 16-22.804 : un licenciement pour des pauses répétées non badgées a été cassé, parce que l'employeur ne prouvait pas que son règlement intérieur était opposable (dépôt et affichage) ([Légifrance](https://www.legifrance.gouv.fr/juri/id/JURITEXT000037135967)). Sanctionner un défaut de pointage suppose donc une procédure rigoureuse.

### 3.7 Triche et badgeage de complaisance

- **Donnée manquante** : aucune étude française chiffrée n'a été trouvée. Une enquête américaine d'éditeur relayée par la presse était inaccessible (erreur HTTP 451) ; elle n'est pas retenue.
- **Ce que font les outils et ce qu'en dit la CNIL.**
  - Un avis App Store sur Jibble apprécie la reconnaissance faciale et le géorepérage pour empêcher un collègue de pointer à la place d'un autre ([App Store Jibble](https://apps.apple.com/fr/app/jibble-time-tracking/id1541142980?see-all=reviews)).
  - Combo prend une **photo aléatoire, non systématique** ([guide Combo](https://guide.combohr.com/fr/articles/4521867-la-pointeuse-combo-simple-et-efficace)).
  - Skello propose au choix une signature, une photo aléatoire ou une photo **systématique** ([aide Skello](https://help.skello.io/en/articles/7182933-how-to-set-the-time-clock-rules)).
  - La CNIL juge excessive une photo systématique à chaque pointage ([CNIL](https://www.cnil.fr/fr/lacces-aux-locaux-et-le-controle-des-horaires-sur-le-lieu-de-travail)).
- Hypothèse : en TPE de moins de 10 salariés, l'oubli pèse plus que la fraude. La fraude devient un sujet dans les PME multi-sites où le dirigeant n'est pas présent.

### 3.8 Manque de visibilité en temps réel

- Un manager de 3 restaurants explique, dans un témoignage publié par Combo, qu'il ne peut pas être sur place tous les jours. La pointeuse lui permet de voir à distance qui a pointé, les heures d'arrivée et de départ, et les heures supplémentaires ([Combo](https://combohr.com/fr/blog/pointeuse-horaire)).
- Un DAF d'hôtel met en avant, dans un témoignage publié par Skello, le suivi des heures en temps réel ([Skello](https://www.skello.io/blog/la-nouvelle-badgeuse-skello-pincez-vous-vous-ne-revez-pas)).
- Les utilisateurs de Shiftbase apprécient la vue en temps réel des plannings, des heures et des disponibilités sur plusieurs sites ([Capterra Shiftbase](https://www.capterra.com/p/177706/ShiftTime/reviews/)).

---

## 4. Outils existants : ce que les utilisateurs apprécient et reprochent

### 4.1 Vue d'ensemble

Notes relevées le 23/09/2026. Elles ne sont pas représentatives.

| Outil | Positionnement observé | Notes et volumes | Apprécié (paraphrase) | Reproché (paraphrase) |
|---|---|---|---|---|
| **Combo** (ex-Snapshift) | Planning et pointeuse sur tablette ; HCR et commerce | Capterra 4,7/5 sur 111 avis, 96 % positifs ([Capterra](https://www.capterra.com/p/193701/Combo/)). App Store « Combo » 4,1/5 sur 139 avis ([App Store](https://apps.apple.com/fr/app/combo/id1112460631?see-all=reviews)). « La Pointeuse Combo » 3,2/5 sur 10 avis ([App Store](https://apps.apple.com/fr/app/la-pointeuse-combo/id1273971338)). | Mise en place facile, pointeuse utile, suivi des heures, support réactif, respect des conventions collectives ([Capterra BE](https://fr.capterra.be/reviews/193701/snapshift)) | Pas de modification des shifts depuis le mobile ; tarif mal proportionné au nombre réel de salariés ; application mobile à optimiser ; un avis 1 étoile décrit 2 mois de service non fonctionnel et un support inefficace ([Capterra](https://www.capterra.com/p/193701/Combo/)). Côté salarié : planning du mois et heures pointées invisibles, impossible de dépointer après un délai, pas d'historique des modifications ([App Store](https://apps.apple.com/fr/app/combo/id1112460631?see-all=reviews)). Tablette qui plante (2021), support qui incrimine le réseau (2023) ([App Store Pointeuse](https://apps.apple.com/fr/app/la-pointeuse-combo/id1273971338)). |
| **Skello** | Planning et badgeuse ; HCR, commerce, santé | Capterra France 4,4/5 sur 30 avis ([Capterra FR](https://www.capterra.fr/reviews/179936/skello)). Trustpilot 4,3/5 sur 434 avis ([Trustpilot](https://fr.trustpilot.com/review/www.skello.io?stars=1&stars=2)). App Store équipes 4,5/5 sur 2 300 notes ; badgeuse 4,3/5 sur 25 notes. | Plannings créés et modifiés rapidement, interface claire, gain de temps, support disponible ([Capterra](https://www.capterra.com/p/179936/Skello/reviews/)) | Payer pour extraire les données vers la paie ; hausse des tarifs ; prix affiché sur le site différent de la facture ; pas de comparaison entre planifié et réalisé (1 avis) ; application parfois peu fluide ; mises à jour qui demandent un temps d'adaptation ([Capterra](https://www.capterra.com/p/179936/Skello/reviews/)). Avis Trustpilot à 1 ou 2 étoiles : support après-vente injoignable, prélèvements contestés, calculs de congés erronés, bugs de badgeage, export manuel payant au lieu de l'API promise, coût jugé excessif pour un simple outil de planning ([Trustpilot](https://fr.trustpilot.com/review/www.skello.io?stars=1&stars=2)). Application : bug de la badgeuse sur iPad (2019) ([App Store badgeuse](https://apps.apple.com/fr/app/time-clock-by-skello/id1222875548?l=en)). |
| **Factorial** | Logiciel RH généraliste pour PME, avec un module temps | Capterra 4,3/5 sur 320 avis ([Capterra](https://www.capterra.com/p/168685/Factorial-HR-Software/reviews/)). App Store 4,7/5 sur 2 300 notes. | Interface intuitive, RH centralisées | Support lent ; prix doublé sans préavis (1 avis) ; bugs d'interface ; une prime spécifique non gérable avec le système de pointage (1 avis, clinique vétérinaire) ([Capterra](https://www.capterra.com/p/168685/Factorial-HR-Software/reviews/)). Application : notifications perdues après une mise à jour, reconnexion quotidienne, iPad en mode portrait uniquement, saisies parfois incorrectes ([App Store](https://apps.apple.com/fr/app/factorial/id1479184236?see-all=reviews)). |
| **Kelio** (Bodet) | Gestion des temps historique, badgeuses physiques | Capterra 4,1/5 sur 12 avis ([Capterra](https://www.capterra.com/p/181942/Kelio/reviews/)). Appvizer 4,2/5 (27 avis agrégés d'autres sites) ; Appvizer le juge peu adapté aux entreprises de moins de 10 salariés ([Appvizer](https://www.appvizer.fr/ressources-humaines/systeme-dinformation-rh-sirh/kelio)). | Suivi des temps et absences, reporting, personnalisation | Interface datée, peu intuitive ; aucune intégration vers la paie ou Sage (1 avis) ; support minimal ; dépendance à la validation du manager en cas d'oubli ([Capterra](https://www.capterra.com/p/181942/Kelio/reviews/)) |
| **Lucca** (feuilles de temps) | Logiciel RH modulaire, déclaratif ou badgeuse virtuelle | Capterra 4,8/5 sur 21 avis ([Capterra](https://capterra.com/p/224901/Lucca/reviews/)) | Intuitif, gain de temps | Tarification par modules jugée coûteuse ; données peu lisibles en période de paie, avec des vérifications sous Excel ; application mobile et reporting améliorables ([Capterra](https://capterra.com/p/224901/Lucca/reviews/)) |
| **Jibble** | Gratuit sans limite d'utilisateurs, kiosque, biométrie, GPS | Capterra 4,8/5 sur 2 011 avis ([Capterra](https://www.capterra.com/p/156992/Jibble/reviews/)). App Store France 4,7/5 sur 69 notes. | Très simple, formation minimale, offre gratuite, temps réel | Mode kiosque capricieux ; GPS source d'échecs de pointage ; synchronisation difficile en connexion faible ; mode hors-ligne aléatoire, avec des pertes ; heures gonflées faute de sortie automatique ; options premium vite chères ([Capterra](https://www.capterra.com/p/156992/Jibble/reviews/)). Localisation parfois mal prise en compte ; entrée non enregistrée si l'on verrouille le téléphone juste après ([App Store](https://apps.apple.com/fr/app/jibble-time-tracking/id1541142980?see-all=reviews)). |
| **Clockify** | Chronomètre et feuilles de temps (usage bureau) | Capterra 4,8/5 sur 9 268 avis ([Capterra](https://www.capterra.com/p/169607/Clockify/reviews/)) | Simplicité du démarrage et de l'arrêt du chronomètre | Application mobile moins intuitive que la version ordinateur ; synchronisation ; chronomètres oubliés ; reconnaissance faciale trop sensible qui bloque les pointages ; support lent sur la facturation |
| **Shiftbase** | Planning et pointage ; HCR et commerce | Capterra 4,4/5 sur 216 avis ([Capterra](https://www.capterra.com/p/177706/ShiftTime/reviews/)) | Convivial, gain de temps, vue multi-sites en temps réel | Application mobile peu claire ; pas d'intégration directe à la paie (1 avis) ; paramétrage délicat des différents types de contrat ; absences absentes de certains rapports |

### 4.2 Thèmes récurrents

**Points positifs**

- **Simplicité et prise en main rapide** : c'est le thème positif le plus fréquent (Combo, Skello, Factorial, Jibble, Shiftbase, Lucca ; mêmes sources que le tableau).
- **Gain de temps sur les plannings et les calculs d'heures** : Skello, Shiftbase.
- **Support réactif pendant la mise en place** : Combo, Skello sur [Capterra FR](https://www.capterra.fr/reviews/179936/skello).

**Points négatifs**

1. **Le salarié ne voit pas ses propres données.**
   - Avis App Store sur Combo et Skello (voir 5.8).
   - Dans Combo, les compteurs d'heures sont réservés aux rôles propriétaire, admin, directeur et manager ([guide Combo](https://guide.combohr.com/fr/articles/12137476-comment-comprendre-et-utiliser-les-compteurs-plannings-dans-combo)), et les soldes de congés ne sont pas consultables dans l'application mobile ([guide Combo](https://guide.combohr.com/en/articles/12149532-how-to-request-time-off-from-the-combo-mobile-app)).
2. **Export vers la paie payant ou limité.**
   - Skello : sur [Capterra](https://www.capterra.com/p/179936/Skello/reviews/) et [Trustpilot](https://fr.trustpilot.com/review/www.skello.io?stars=1&stars=2).
   - Combo : la synchronisation Silae est une option à +1,50 € par salarié et par mois ([Combo tarifs](https://combohr.com/fr/pricing)).
   - Shiftbase, Kelio et Lucca : voir le tableau.
3. **Prix et tarification.** Hausses de tarif, prix affiché différent de la facture, décalage avec l'effectif réel, prix doublé (Skello, Combo, Factorial).
4. **Support après-vente et facturation.** Skello sur Trustpilot, Factorial, Kelio, avis 1 étoile sur Combo.
5. **Fiabilité technique.** Synchronisation, mode hors-ligne, plantages, notifications (Jibble, Clockify, Factorial, Combo, Skello).
6. **Paramétrage et ergonomie.** Kelio daté ; types de contrat délicats chez Shiftbase ; alertes Skello personnalisables seulement via le support ([aide Skello](https://help.skello.io/en/articles/8238426-how-to-activate-and-use-schedule-alerts-on-skello)).
7. **Biométrie et GPS peu fiables.** Reconnaissance faciale trop sensible chez Clockify, GPS approximatif chez Jibble.

- Hypothèse : les deux premiers thèmes (transparence pour le salarié et export paie inclus) sont les leviers de différenciation les moins exploités par les leaders.

---

## 5. Contextes d'usage

### 5.1 Appareils

- **Smartphone personnel.**
  - 91 % des Français de 12 ans et plus possèdent un smartphone ([Arcep, baromètre 2026](https://www.arcep.fr/cartes-et-donnees/nos-publications-chiffrees/barometre-du-numerique/le-barometre-du-numerique-edition-2026.html)).
  - Dans une enquête GetApp menée en octobre 2021 auprès de salariés de PME de moins de 250 personnes, 26 % des salariés géolocalisés ont, à la demande de leur employeur, une application de géolocalisation sur leur téléphone personnel ([GetApp 2021](https://www.getapp.fr/blog/2341/geolocalisation-entreprise-suivi-ou-surveillance)).
- **Tablette partagée.**
  - La pointeuse Combo fonctionne uniquement sur tablette (iOS 15.1 ou Android 11 minimum, écran d'au moins 8 pouces) ([guide Combo](https://guide.combohr.com/fr/articles/4521867-la-pointeuse-combo-simple-et-efficace)).
  - Skello : chaque salarié a un code PIN unique et confidentiel, avec une photo ou une signature en option ([Skello](https://www.skello.io/en/product/time-tracking/tablet-clock-in-system)).
  - Jibble : kiosque avec code PIN ([Jibble](https://www.jibble.io/help/clocking-in-and-out-with-a-pin)).
- **PC ou badge virtuel** : Lucca propose une badgeuse virtuelle sur smartphone, tablette ou PC, une feuille de temps pré-remplie ou une badgeuse physique ([Lucca](https://www.lucca.fr/suivi-des-temps/timesheet/)).

### 5.2 Salariés sans e-mail professionnel

- Emergence Capital, en 2020, compte 2,7 milliards de travailleurs « deskless », soit 80 % des actifs dans le monde. Plus de la moitié apportent leur propre équipement au travail et 60 % sont insatisfaits de leurs outils (environ 1 500 répondants, données non spécifiques à la France) ([Emergence Capital](https://www.emcap.com/thoughts/technology-for-the-deskless-workforce)).
- **Donnée manquante** : aucune statistique française sur la part de salariés sans e-mail professionnel n'a été trouvée.
- Comment les outils diffusent le code PIN :
  - Skello envoie le PIN par e-mail par défaut ; il reste visible dans l'application et le manager peut le réinitialiser ([aide Skello](https://help.skello.io/en/articles/4298921-how-to-find-your-employees-pin-codes)) ;
  - Jibble permet de récupérer un PIN oublié par e-mail ou SMS ([Jibble](https://www.jibble.io/help/clocking-in-and-out-with-a-pin)).
- Hypothèse : extras, étudiants et saisonniers n'ont pas d'e-mail professionnel. Il faut prévoir une invitation par SMS, par QR code ou par un code remis par le manager, sans créer de compte e-mail.

### 5.3 Multi-sites

- Combo facture par établissement ([Combo tarifs](https://combohr.com/fr/pricing)). Son application permet de passer d'un compte ou d'un établissement à l'autre ([App Store Combo](https://apps.apple.com/fr/app/combo/id1112460631)).
- Chez Skello, la tarification se fait par tranche d'utilisateurs et par établissement ; un salarié présent sur plusieurs établissements n'est compté qu'une fois ([aide Skello](https://help.skello.io/fr/articles/11524729-comment-fonctionne-la-tarification-skello)).

### 5.4 Connectivité

- **Mode hors-ligne de Combo** ([guide Combo](https://guide.combohr.com/fr/articles/6636635-comment-fonctionne-le-mode-hors-ligne-de-la-pointeuse-combo)) :
  - les pointages sont stockés localement et synchronisés toutes les 15 minutes ;
  - **au-delà de 72 h hors ligne, ils sont perdus définitivement** ;
  - Combo recommande de brancher la tablette en Ethernet ;
  - le mode hors-ligne a des fonctionnalités limitées ([guide Combo](https://guide.combohr.com/fr/articles/4521867-la-pointeuse-combo-simple-et-efficace)).
- Côté Jibble, le mode hors-ligne est jugé aléatoire et la synchronisation difficile en connexion faible ([Capterra Jibble](https://www.capterra.com/p/156992/Jibble/reviews/)). Un avis sur la pointeuse Combo reproche au support d'imputer les problèmes au réseau ([App Store](https://apps.apple.com/fr/app/la-pointeuse-combo/id1273971338)).

### 5.5 Travail décalé et de nuit

- 44 % des salariés, soit 10,4 millions de personnes, travaillent en horaires atypiques au moins une fois par mois : 35 % le samedi, 23 % le soir, 9 % la nuit (données DARES citées par l'[INRS](https://www.inrs.fr/risques/travail-horaires-atypiques/donnees-generales-et-exposition-aux-risques.html) ; la page DARES d'origine n'était pas accessible).
- Un poste de 22 h à 5 h s'affiche sur deux jours dans la plupart des outils, ce qui gêne la lecture. Le calcul des heures de nuit se fait sur des plages paramétrables ([Planning Web](https://www.sodeasoft.com/planning-web/planning-travail-de-nuit/)).
- Hypothèse : selon les conventions, les heures sont rattachées au jour calendaire ou au jour de prise de poste. Un juriste doit valider ce point ; la page d'aide consultée pour le vérifier était inaccessible.

### 5.6 Temps partiels et saisonniers

- Cadre légal des heures complémentaires :
  - elles ne peuvent pas porter la durée du travail au niveau de la durée légale ([L3123-9](https://code.travail.gouv.fr/code-du-travail/l3123-9)) ;
  - un accord peut en porter la limite jusqu'au tiers de la durée prévue au contrat ([L3123-20](https://code.travail.gouv.fr/code-du-travail/l3123-20)).
- Ordres de grandeur sectoriels : trois quarts de temps partiel dans la propreté (voir 2.4), environ 60 % de recrutements saisonniers en HCR.
- Selon l'éditeur Shyfter, en restauration rapide : postes de 3 à 6 h, rotation du personnel de 80 à 120 % par an, alerte quand un étudiant atteint 80 % de son quota annuel d'heures ([Shyfter](https://shyfter.com/fr-fr/secteurs/restauration-rapide/pointage-badgeuse-fast-food)) (affirmation éditeur).

### 5.7 Combien de secondes pour pointer ?

- **Donnée manquante** : aucune recherche indépendante sur le temps de pointage acceptable n'a été trouvée.
- Affirmations d'éditeurs :
  - Shyfter affirme qu'un pointage par code PIN prend 3 secondes ([Shyfter](https://shyfter.com/fr-fr/secteurs/restauration-rapide/pointage-badgeuse-fast-food)) ;
  - chez Combo, le salarié touche son nom puis signe avec le doigt, avec une photo en option ([Combo](https://combohr.com/fr/blog/pointeuse-horaire)) ;
  - Skello décrit un parcours réduit à un code PIN et une photo ([Skello](https://www.skello.io/blog/la-nouvelle-badgeuse-skello-pincez-vous-vous-ne-revez-pas)).
- Hypothèse : viser 5 secondes au plus entre l'arrivée devant la tablette et la confirmation, et 3 gestes au plus sur smartphone. À mesurer en observation terrain lors d'un changement d'équipe.

### 5.8 Transparence pour le salarié

- **Demandes des salariés dans les avis.**
  - Un avis App Store sur Combo (02/05/2025) : « on ne peut pas voir nos heures de pointage » ([App Store Combo](https://apps.apple.com/fr/app/combo/id1112460631?see-all=reviews)). C'est la seule citation reproduite dans ce rapport.
  - Le même avis regrette de ne pas pouvoir consulter le planning du mois. Un autre avis réclame un historique des modifications visible côté salarié.
  - Sur Skello, des utilisateurs réclament un compteur d'heures hebdomadaire et l'affichage des heures supplémentaires de la semaine ([App Store Skello](https://apps.apple.com/fr/app/skello-lapp-des-%C3%A9quipes/id1215389131?see-all=reviews&platform=iphone)).
- **Ce que les salariés valorisent.** L'aspect jugé le plus utile de la surveillance est la preuve des heures travaillées (44 %), et 51 % estiment que leurs heures supplémentaires seraient plus facilement prises en compte ([GetApp 2020](https://www.getapp.fr/blog/1822/mefiance-utilite-rapport-ambigu-salarie-surveillance)).
- **Base légale.** Le document mensuel annexé au bulletin rend déjà certaines informations dues au salarié ([D3171-12](https://code.travail.gouv.fr/code-du-travail/d3171-12)).
- Hypothèse : montrer au salarié ses heures, ses heures supplémentaires et l'historique en temps réel est le principal levier pour que le pointage soit accepté (transparence réciproque).

### 5.9 Acceptabilité sociale : géolocalisation, biométrie, photo

- **Position de la CNIL sur le contrôle des horaires** (page mise à jour le 17/06/2026, [CNIL](https://www.cnil.fr/fr/lacces-aux-locaux-et-le-controle-des-horaires-sur-le-lieu-de-travail)) :
  - les dispositifs doivent être proportionnés ;
  - un contrôle des horaires par biométrie apparaît excessif au regard du principe de minimisation ;
  - une photo systématique à chaque pointage apparaît excessive ;
  - les journaux techniques sont conservés 3 mois, les données de suivi du temps jusqu'à 5 ans en archivage intermédiaire ;
  - les représentants du personnel doivent être informés ou consultés avant l'installation, et chaque salarié doit recevoir une information individuelle.
- **Géolocalisation** ([CNIL, 30/05/2023](https://www.cnil.fr/fr/la-geolocalisation-des-vehicules-des-salaries)) :
  - le suivi du temps de travail n'est admis qu'à titre accessoire, s'il ne peut pas être fait autrement ;
  - aucune collecte hors du temps de travail (trajets domicile-travail, pauses) ;
  - le salarié doit pouvoir désactiver la géolocalisation hors temps de travail ;
  - conservation de 5 ans quand les données servent au suivi du temps.
- **Sanction.** En 2018, la CNIL a infligé 10 000 € d'amende à une entreprise de télésurveillance qui contrôlait les horaires par empreintes digitales, entre autres manquements ([Next](https://next.ink/7500/107066-dans-sanction-cnil-rappelle-sensibilite-biometrie-au-travail/)).
- **Perception par les salariés.**
  - GetApp, octobre 2021 (1 020 répondants, dont 567 salariés de PME) : 36 % des salariés géolocalisés ignorent pourquoi ; 21 % y voient un manque de confiance ; 26 % disent que cela pèserait sur leur décision d'accepter un emploi ([GetApp 2021](https://www.getapp.fr/blog/2341/geolocalisation-entreprise-suivi-ou-surveillance)).
  - GetApp, novembre 2020 (1 418 répondants) : 45 % travaillent dans une entreprise qui utilise des outils de surveillance ; parmi les personnes surveillées, 59 % préféreraient ne plus l'être (sentiment d'infantilisation, manque de confiance) et 41 % l'acceptent ([GetApp 2020](https://www.getapp.fr/blog/1822/mefiance-utilite-rapport-ambigu-salarie-surveillance)).
  - Capterra, février 2022 (706 salariés) : 23 % disent que leur entreprise utilise au moins un outil de surveillance, qui porte d'abord sur la présence (62 %) et la gestion du temps (61 %). 68 % jugent l'impact négatif pour l'entreprise ; les craintes portent sur la confiance (72 %), la vie privée (64 %) et le stress (64 %). 29 % des salariés concernés ont ressenti une pression pour accepter le dispositif ([Capterra 2022](https://www.capterra.fr/blog/2672/pratiques-surveillance-employes-en-france)).
- **Offres du marché.**
  - Jibble propose reconnaissance faciale, selfie, GPS, géorepérage et même captures d'écran périodiques ([Jibble tarifs](https://www.jibble.io/pricing), [Jibble politique](https://www.jibble.io/help/configuring-your-time-tracking-policy)).
  - Skello propose une photo systématique en option ([aide Skello](https://help.skello.io/en/articles/7182933-how-to-set-the-time-clock-rules)).
  - Skello recommande de consulter le CSE, d'informer chaque salarié par écrit et de mettre à jour le règlement intérieur ([aide Skello](https://help.skello.io/fr/articles/9841802-quelles-sont-les-etapes-a-suivre-pour-mettre-en-place-la-badgeuse)).
- Hypothèse : proposer par défaut, pour les TPE, un mode « confiance » sans géolocalisation, sans biométrie et sans photo, plus un kit d'information des salariés prêt à l'emploi. La photo aléatoire serait une option pour les structures multi-sites, à tester en entretien.

---

## 6. Critères d'achat, adoption et causes d'abandon

### 6.1 Critères observés

- **Étude Capterra France 2026.** Terrain en août 2025 ; 283 répondants français, entreprises de 5 salariés et plus, grandes entreprises comprises, donc pas spécifique aux TPE ([Capterra 2026](https://www.capterra.fr/blog/7672/acheter-logiciel-en-france-tendances)).
  - Les entreprises qui réussissent leurs achats privilégient la sécurité (66 %), les fonctionnalités (58 %) et le rapport qualité-prix (53 %).
  - Elles bouclent leur sélection en environ 4 mois.
  - 38 % d'entre elles établissent un plan de mise en œuvre, contre 18 % des acheteurs déçus.
- **Langue.** 72 % des PME et ETI interrogées préfèrent un logiciel en français quand elles ont le choix. C'est un indicateur indirect : l'enquête date de novembre-décembre 2018 et porte sur les CRM (435 répondants qualifiés) ([Capterra 2018](https://www.capterra.fr/blog/507/enquete-crm-pme-francaises-2019)).
- **Prix et modèle économique** :
  - **Combo** ([Combo tarifs](https://combohr.com/fr/pricing)) : offre « Time » à partir de 60 € par mois et par établissement, offre « People » à 80 €, avec une tarification progressive selon le nombre de salariés actifs. Options : pointeuse +2 € par salarié et par mois, synchronisation Silae +1,50 €, diffusion des bulletins +1,20 €. Engagement de 12 mois (paiement annuel avec 10 % de remise, ou mensuel sur 12 mois). Essai gratuit de 7 jours.
  - **Factorial** : à partir de 6,9 € par utilisateur et par mois, avec des offres modulaires ([Factorial tarifs](https://factorial.fr/tarifs)).
  - **Skello** : tarif par établissement et par tranche d'utilisateurs, contrôlé sur la moyenne de 30 jours ([aide Skello](https://help.skello.io/fr/articles/11524729-comment-fonctionne-la-tarification-skello)).
  - **Jibble** : gratuit, utilisateurs illimités ([Jibble tarifs](https://www.jibble.io/pricing)).
- **Délai de mise en place.** Pour la badgeuse, Skello juge raisonnable un délai de 1 à 5 mois, qui inclut consultation du CSE, information des salariés et mise à jour du règlement intérieur ([aide Skello](https://help.skello.io/fr/articles/9841802-quelles-sont-les-etapes-a-suivre-pour-mettre-en-place-la-badgeuse)).
- **Intégration à la paie.** Le sujet revient souvent dans les avis (voir 4.2, point 2).

### 6.2 Freins et causes d'abandon

- **Rester en manuel.** Les raisons sont l'habitude, puis la gratuité ([Blog RH / Beebole](https://www.blog-rh.com/2022/03/enquete-mesure-temps-travail-beebole/)).
- **Regrets d'achat** ([Capterra 2026](https://www.capterra.fr/blog/7672/acheter-logiciel-en-france-tendances)) :
  - 49 % des acheteurs français regrettent au moins un achat de logiciel ;
  - 92 % des acheteurs déçus ont connu des perturbations au déploiement ;
  - causes citées : coûts imprévus, performances décevantes, sécurité insuffisante (25 %), support ou formation inadaptés (15 %).
- **Causes d'abandon visibles dans les avis.**
  - Service non fonctionnel pendant 2 mois avec un support inefficace (Combo, 1 étoile, [Capterra](https://www.capterra.com/p/193701/Combo/)).
  - Outil inadapté et prix d'appel trompeur (Skello, restaurant, 1 étoile, [Capterra](https://www.capterra.com/p/179936/Skello/reviews/)).
  - Prix doublé (Factorial, 1 étoile, [Capterra](https://www.capterra.com/p/168685/Factorial-HR-Software/reviews/)).
  - Litiges de facturation et support injoignable ([Trustpilot Skello](https://fr.trustpilot.com/review/www.skello.io?stars=1&stars=2)).
- **Échecs de déploiement.** Selon Shyfter, 80 % des déploiements qui échouent le font pour des raisons humaines, mais aucune source n'est citée ([Shyfter](https://shyfter.com/fr-be/solutions/badgeuse/les-etapes-de-la-mise-en-place-dun-systeme-de-pointage)). Les indicateurs recommandés sont le taux d'oubli de pointage, les anomalies récurrentes et la satisfaction.

**Hypothèses (critères d'achat pour une TPE de 1 à 49 salariés)**

- Hypothèse : les critères éliminatoires sont un prix lisible et global sans option payante pour l'export paie, l'absence d'engagement de 12 mois, un support en français joignable, et une mise en route en moins d'une heure (modèle de convention collective et import des salariés).
- Hypothèse : l'accord de l'expert-comptable, qui doit pouvoir lire l'export sans retraitement, pèse davantage que les fonctionnalités de planning.

---

## 7. Rôle de l'expert-comptable et du gestionnaire de paie

### 7.1 Poids et outils

- **Silae.**
  - 7,5 millions de bulletins par mois et environ 80 % de part de marché auprès des experts-comptables ([RH Matin, 31/10/2024](https://www.rhmatin.com/paie/logiciels-paie/logiciels-de-paie-silae-sous-pression-revise-les-tarifs-visant-les-experts-comptables.html)).
  - La profession compte 22 000 professionnels et 170 000 collaborateurs. Silae a annoncé un effort tarifaire en 2025 pour les entreprises de moins de 10 salariés.
  - Chiffres plus récents, communiqués par l'éditeur : 8 millions de bulletins par mois et environ 80 % des cabinets ([Compta Online, 20/07/2026](https://www.compta-online.com/paie-silae-payfit-ao8818)).
- **PayFit** : 22 000 clients en France, au Royaume-Uni et en Espagne ([Compta Online](https://www.compta-online.com/paie-silae-payfit-ao8818)) ; plus de 250 000 bulletins par mois ([PayFit, 09/07/2026](https://payfit.com/fr/fiches-pratiques/logiciels-de-paie-les-plus-utilises-par-les-pme-en-france/)).
- **Autres logiciels.** PayFit cite aussi Silae, Sage, Cegid, ADP et Nibelis parmi les plus utilisés par les PME. Il rapporte 2,4 millions de DSN déposées chaque mois pour 2,2 millions d'entreprises (source net-entreprises) ([PayFit](https://payfit.com/fr/fiches-pratiques/logiciels-de-paie-les-plus-utilises-par-les-pme-en-france/)).
- **Données manquantes** : la part d'EBP et la part des TPE qui confient leur paie à un expert-comptable n'ont pas été trouvées.

### 7.2 Ce que l'expert-comptable attend d'un export de temps (constats)

- **Contenu.** L'export Combo vers Silae contient, par salarié identifié par son **matricule** : heures normales et supplémentaires, absences, primes et indemnités, avantages en nature (repas servis), acomptes et remboursements ([Combo, export Silae](https://guide.combohr.com/fr/articles/2720818-notre-export-de-paie-au-format-silae)).
- **Format.**
  - Fichier CSV, avec les codes HS-[code Silae] pour les heures, AB-[code] pour les absences et EV-[colonne] pour les variables. Ces codes doivent correspondre au paramétrage Silae du client.
  - Il n'y a **pas de synchronisation automatique** : le fichier est exporté puis importé à chaque période.
  - **Point critique** : un salarié sans matricule est absent du fichier, **sans message d'erreur** ([Combo](https://guide.combohr.com/fr/articles/2720818-notre-export-de-paie-au-format-silae)).
  - Autre exemple : l'éditeur oHRis utilise un CSV à 5 colonnes (matricule ; code paie ; décompte ; date de début ; date de fin), avec des codes d'absence au format AB-code ([oHRis](https://documentation.ohris.info/doku.php/exports:export_paie_silae)).
- **Périodicité et calendrier.** La paie est mensuelle. Exemple de calendrier : fin de saisie des éléments variables le 20, calcul le 21, clôture le 24, virements le 27, DSN le 5 du mois suivant. Les éléments transmis en retard sont traités le mois suivant. Circuit de validation : le manager, puis le gestionnaire de paie, puis un contrôle global de cohérence ([Culture RH, 27/03/2026](https://culture-rh.com/elements-variable-de-paie-fabiliser-chaine-securiser-paie/)).
- **Document légal** : relevé mensuel annexé au bulletin ([D3171-12](https://code.travail.gouv.fr/code-du-travail/d3171-12)).
- **Douleurs.** Relances, ressaisie, erreurs et délais ([Agiris](https://www.agiris.fr/articles/paie/variables-de-paie-eviter-la-saisie-infernale-en-cabinet)) ; fichiers Excel qui se perdent dans les boîtes mail ; ressaisie supprimée grâce à la collecte en ligne (témoignages de cabinets publiés par [Flocompta](https://flocompta.com/)).
- **Concurrence possible des cabinets.** Silae propose sa propre collecte déclarative des variables, soumise à validation, avec historique ([Silae](https://www.silae.fr/solution-rh-paie/elements-variables-de-paie/)). Hypothèse : le cabinet peut donc pousser son propre portail plutôt que l'outil de pointage du client.

**Hypothèses (à valider avec 3 ou 4 gestionnaires de paie)**

- Hypothèse : le cabinet veut un accès en lecture à la période validée et un « verrou » de clôture horodaté.
- Hypothèse : il veut définir une seule fois la correspondance avec ses codes de rubriques pour chaque client, puis disposer d'un pré-contrôle bloquant avant export (matricule manquant, journées non validées, heures supplémentaires sans taux).
- Hypothèse : il attend un PDF par salarié conforme à D3171-12, et un export inclus sans surcoût par salarié.

---

## 8. Patterns UX repérés chez les leaders

| Moment | Pattern observé | Exemples et sources | Commentaire (hypothèse) |
|---|---|---|---|
| **Pointer** | Tablette partagée : le salarié touche son nom puis s'identifie par code PIN ou signe du doigt | Combo : nom et signature, photo aléatoire non systématique, horodatage non modifiable ([guide Combo](https://guide.combohr.com/fr/articles/4521867-la-pointeuse-combo-simple-et-efficace), [blog Combo](https://combohr.com/fr/blog/pointeuse-horaire)). Skello : PIN unique, signature ou photo aléatoire ou systématique ([aide Skello](https://help.skello.io/en/articles/7182933-how-to-set-the-time-clock-rules)). Jibble : PIN de 4 chiffres généré automatiquement ; au-delà de 3 erreurs, blocage de 60 secondes ; reconnaissance faciale avec repli sur le PIN ([Jibble](https://www.jibble.io/help/clocking-in-and-out-with-a-pin)) | PIN à 4 chiffres et signature : le bon compromis en TPE. Éviter la photo systématique (position CNIL). |
| | Smartphone : bouton entrée/sortie, QR code ou géolocalisation | Factorial : bouton, QR code, géolocalisation ([Factorial tarifs](https://factorial.fr/tarifs), [App Store](https://apps.apple.com/fr/app/factorial/id1479184236)). Jibble : option qui autorise le pointage jusqu'à 15 min avant le début prévu ([Jibble](https://www.jibble.io/help/configuring-your-time-tracking-policy)) | Le QR code sur place peut remplacer la géolocalisation. |
| | Déclaratif ou pré-rempli | Lucca : feuille de temps pré-remplie ou badgeuse virtuelle ([Lucca](https://www.lucca.fr/suivi-des-temps/timesheet/)) | Adapté aux agences et aux cadres. |
| **Règles de calcul** | Tolérances et arrondis | Skello : arrondi à 5, 10 ou 15 minutes ; tolérance paramétrable (par exemple 10 à 15 min), 119 min au maximum, au-delà un nouveau shift est créé ; pas de tolérance pour les arrivées anticipées ([aide Skello](https://help.skello.io/en/articles/7182933-how-to-set-the-time-clock-rules)) | Arrondis à valider juridiquement : risque d'arrondi toujours défavorable au salarié. |
| **Pauses** | Pause badgée ou déduite automatiquement | Combo : les pauses ne sont pas déduites automatiquement, sauf si la convention collective prévoit une pause automatique ([guide Combo](https://guide.combohr.com/fr/articles/4521867-la-pointeuse-combo-simple-et-efficace)). Skello : pauses badgeables ou désactivées ; si elles sont désactivées, une sortie clôt le shift ([aide Skello](https://help.skello.io/en/articles/7182933-how-to-set-the-time-clock-rules)). Jibble : bouton « pause » activable ou masquable. Shyfter : déduction automatique ou saisie manuelle ([Shyfter](https://shyfter.com/fr-fr/secteurs/restauration-rapide/pointage-badgeuse-fast-food)) | La preuve de la pause incombe à l'employeur (Cass. 27/01/2021). La pause badgée ou confirmée a donc de la valeur. |
| | Alertes sur les pauses | Factorial : alerte « absence de pause » et « durée de pause insuffisante » ([Factorial](https://help.factorialhr.com/fr_FR/suivi-du-temps/about-time-tracking-alerts)) | S'aligner sur la règle des 20 min après 6 h. |
| **Oublis** | Rappels | Jibble : rappels d'entrée et de sortie, avec des réglages par organisation, par personne et par session ([Jibble](https://www.jibble.io/help/set-reminders-automatic-clock-out)). Shyfter : rappel dans les 10 minutes après le début du shift ([Shyfter](https://shyfter.com/fr-fr/secteurs/restauration-rapide/pointage-badgeuse-fast-food)). Factorial : notifications push ou e-mail, alerte « pointage manquant » ([Factorial](https://help.factorialhr.com/fr_FR/suivi-du-temps/time-tracking-notifications)) | Envoyer un rappel poli, à l'heure planifiée, pas avant. |
| | Sortie oubliée | Factorial : le salarié confirme les heures suivies ou estimées, sinon le poste reste « non résolu » et ne compte pas dans le solde tant qu'il n'est pas corrigé ; la correction passe par une demande ([Factorial](https://help.factorialhr.com/fr_FR/suivi-du-temps/about-missed-clock-outs)). Jibble : sortie automatique conseillée comme **filet de sécurité**, pas comme substitut ([Jibble](https://www.jibble.io/help/set-reminders-automatic-clock-out)) | Préférer une journée « à résoudre » à une sortie automatique silencieuse, pour préserver la fiabilité. |
| | Pointage hors planning | Combo : un salarié peut pointer sans shift prévu, mais le manager doit valider ([guide Combo](https://guide.combohr.com/fr/articles/4521867-la-pointeuse-combo-simple-et-efficace)) | |
| | Circuit de correction | Octime : déclaration, validation du manager, régularisation par les RH, conservation d'au moins 1 an ([Octime](https://www.octime.com/oubli-de-badgeage-comment-securiser-les-temps-de-presence-en-entreprise/)) | La correction doit porter un motif et rester visible par le salarié. |
| **Validation par le manager** | Validation avant la clôture de paie | Combo : validation manuelle des heures pointées avant la clôture ([guide Combo](https://guide.combohr.com/fr/articles/4521867-la-pointeuse-combo-simple-et-efficace)). Skello : la validation des journées de badgeage met à jour les heures payées selon les règles ([aide Skello](https://help.skello.io/en/articles/7182933-how-to-set-the-time-clock-rules)) | |
| | Auto-validation par exception | Lucca : les feuilles sans heures supplémentaires ni alerte sont validées automatiquement ; le manager reçoit des alertes sur les situations atypiques ([Lucca](https://www.lucca.fr/suivi-des-temps/timesheet/)) | Pattern clé pour les TPE : le dirigeant ne traite que les anomalies. |
| | Demandes de modification | Factorial : la modification d'un jour déjà suivi part en demande chez l'approbateur, avec un badge « En attente » ([Factorial](https://help.factorialhr.com/fr_FR/suivi-du-temps/comment-enregistrer-et-modifier-manuellement-votre-pointage)) | |
| **Absences** | Demande depuis le mobile avec statuts | Combo : type, dates, commentaire, puis envoi ; statuts « En attente », « Acceptée » (le planning se met à jour et une notification part) ou « Refusée » ; annulation possible tant que la demande est en attente ; **soldes non visibles** dans le mobile ([guide Combo](https://guide.combohr.com/en/articles/12149532-how-to-request-time-off-from-the-combo-mobile-app)). Factorial : validation par le manager depuis le mobile ([App Store Factorial](https://apps.apple.com/fr/app/factorial/id1479184236)) | Afficher le solde au moment de la demande. |
| **Alertes légales** | Contrôles au moment du planning | Skello : jours consécutifs, repos quotidien et hebdomadaire, durée maximale hebdomadaire, volume par jour, amplitude ; alertes **informatives** ou **bloquantes** ; non prises en compte sur mobile ; personnalisation via le support ([aide Skello](https://help.skello.io/en/articles/8238426-how-to-activate-and-use-schedule-alerts-on-skello)) | Alertes informatives par défaut, bloquantes en option. |
| | Contrôles sur le réalisé | Lucca : heures supplémentaires, retards, repos, travail de nuit ([Lucca](https://www.lucca.fr/suivi-des-temps/timesheet/)). Factorial : pointage manquant, sortie non faite, absence de pause, pause trop courte ([Factorial](https://help.factorialhr.com/fr_FR/suivi-du-temps/about-time-tracking-alerts)) | |
| **Hors ligne** | Stockage local et synchronisation | Combo : synchronisation toutes les 15 minutes, perte au-delà de 72 h ([guide Combo](https://guide.combohr.com/fr/articles/6636635-comment-fonctionne-le-mode-hors-ligne-de-la-pointeuse-combo)) | Alerter l'administrateur avant la perte, par exemple à 24 h. |

**Seuils légaux à intégrer dans les alertes (Code du travail)**

- Pause de 20 minutes consécutives dès 6 h de travail ([L3121-16](https://code.travail.gouv.fr/code-du-travail/l3121-16)).
- Repos quotidien de 11 h consécutives ([L3131-1](https://code.travail.gouv.fr/code-du-travail/l3131-1)).
- Repos hebdomadaire de 24 h, auxquelles s'ajoutent les 11 h de repos quotidien ([L3132-2](https://code.travail.gouv.fr/code-du-travail/l3132-2)).
- 10 h de travail effectif par jour au maximum, sauf dérogations ([L3121-18](https://code.travail.gouv.fr/code-du-travail/l3121-18)).
- 48 h au maximum sur une même semaine ([L3121-20](https://code.travail.gouv.fr/code-du-travail/l3121-20)).
- 44 h en moyenne au maximum sur 12 semaines consécutives ([L3121-22](https://code.travail.gouv.fr/code-du-travail/l3121-22)).
- Règles conventionnelles, par exemple en HCR : majorations de 10, 20 et 50 %, contingent de 360 h (voir 2.4).

---

## 9. Hypothèses à valider : personas, jobs-to-be-done et guide d'entretien

> **Avertissement** : tout ce qui suit est **hypothétique**. Les personas et les « citations-types » sont **construits** à partir des constats sourcés des sections 2 à 8. Ce ne sont pas des propos réels. Ils doivent être confirmés ou invalidés en entretien.

### 9.1 Personas (hypothèses)

**P1. « Nadia », restauratrice indépendante (rôle ADMIN)**

- **Contexte** : restaurant de 9 salariés sur un seul site, avec extras et saisonniers en été. Paie confiée à l'expert-comptable. Heures suivies sur papier signé chaque semaine et recopiées dans Excel. Pas de fonction RH.
  - S'appuie sur : 2.4 HCR, 2.2, 7.1.
- **Objectifs** : envoyer au cabinet des heures justes du premier coup ; maîtriser le coût des heures supplémentaires ; être en règle (récapitulatif hebdomadaire, relevé mensuel) ; pouvoir se défendre en cas de réclamation.
- **Frustrations** : reconstituer les heures en fin de mois ; oublis de pointage des extras ; règles de majoration propres à l'HCR ; options payantes et engagements de 12 mois des outils du marché ; support injoignable après la vente.
  - S'appuie sur : 3.2, 3.4, 4.2, 6.1.
- **Citations-types construites** :
  - « Le soir de la clôture, je recompte les feuilles signées une par une. »
  - « Si un ancien serveur me réclame ses heures sup, je dois pouvoir tout ressortir. »
  - « Je ne veux pas payer en plus pour envoyer les heures à mon comptable. »

**P2. « Julien », gérant multi-sites (rôle ADMIN ou MANAGER)**

- **Contexte** : 3 boutiques (boulangerie ou franchise), 35 salariés, un responsable par site, une tablette par site, une connexion inégale selon les sites.
  - S'appuie sur : 3.8, 5.3, 5.4.
- **Objectifs** : savoir en temps réel qui est présent sur chaque site ; repérer les heures supplémentaires avant qu'elles coûtent ; appliquer les mêmes règles partout ; que ses responsables valident chaque semaine.
- **Frustrations** : prix « par établissement plus options » ; pointages perdus hors ligne ; responsables qui ne valident pas ; pas de comparaison entre le planifié et le réalisé.
  - S'appuie sur : 4.1, 5.4, 6.1.
- **Citations-types construites** :
  - « À 7 h, je veux voir depuis mon téléphone qui est arrivé dans chaque boutique. »
  - « Mes responsables ne valident que si ça leur prend deux minutes. »

**P3. « Sandrine », cheffe d'équipe terrain en propreté ou dans le BTP (rôle MANAGER)**

- **Contexte** : 12 agents répartis chez plusieurs clients ou sur plusieurs chantiers ; horaires très tôt ou très tard ; nombreux temps partiels et salariés multi-employeurs ; réseau mobile aléatoire ; elle récupère souvent elle-même les fiches.
  - S'appuie sur : 2.4 Propreté et BTP, 5.4, 5.6.
- **Objectifs** : valider les heures en quelques minutes sur mobile ; régler les oublis sans conflit ; prouver la présence sur site sans « fliquer ».
- **Frustrations** : fiches rendues en retard ; types d'heures multiples ; contraintes CNIL sur la géolocalisation ; agents sans e-mail ou peu à l'aise avec une application.
  - S'appuie sur : 3.2, 5.2, 5.9.
- **Citations-types construites** :
  - « Le vendredi, il me manque toujours deux fiches. »
  - « Je ne veux pas géolocaliser mes agents, mais il me faut une preuve de passage. »

**P4. « Mehdi », employé polyvalent, étudiant à temps partiel (rôle EMPLOYEE)**

- **Contexte** : 22 ans, utilise son smartphone personnel, n'a pas d'e-mail professionnel, a des shifts variables et parfois un second employeur.
  - S'appuie sur : 2.4 HCR (39,7 % de moins de 30 ans), 5.1, 5.2.
- **Objectifs** : pointer en quelques secondes ; voir ses heures et ses heures supplémentaires de la semaine ; corriger facilement une erreur ; poser un congé en voyant son solde ; être payé juste.
- **Frustrations** : ne pas voir ses heures ni l'historique ; ne plus pouvoir dépointer après un délai ; peur d'être surveillé (photo, géolocalisation) ; application qui déconnecte ou bugue.
  - S'appuie sur : 4.1, 5.8, 5.9.
- **Citations-types construites** :
  - « Je veux juste savoir combien d'heures j'ai faites cette semaine. »
  - « Une photo à chaque pointage, franchement non. »

**P5. « Claire », gestionnaire de paie en cabinet d'expertise comptable (acteur externe)**

- **Contexte** : plusieurs dizaines de clients TPE sous Silae ; date butoir mensuelle ; DSN à préparer.
  - S'appuie sur : 7.1, 7.2.
- **Objectifs** : recevoir à date fixe des variables complètes, validées par l'employeur, dans ses codes de rubriques ; zéro ressaisie ; traçabilité ; moins de bulletins rectificatifs.
- **Frustrations** : relances ; fichiers Excel envoyés par mail ; matricules manquants ; modifications tardives ; formats hétérogènes d'un client à l'autre.
  - S'appuie sur : 3.3, 7.2.
- **Citations-types construites** :
  - « Je passe plus de temps à relancer qu'à faire la paie. »
  - « Un CSV propre avec les matricules et mes codes, c'est tout ce que je demande. »

### 9.2 Jobs-to-be-done (hypothèses)

| # | Job : « Quand…, je veux…, afin de… » | Persona | Constats liés |
|---|---|---|---|
| J1 | Quand la fin du mois approche, je veux transmettre au cabinet des variables justes et complètes en quelques minutes, afin d'éviter les allers-retours et les erreurs de paie. | P1, P2, P5 | 3.2, 3.3, 7.2 |
| J2 | Quand un salarié conteste ses heures ou qu'un contrôle arrive, je veux produire un relevé horodaté, validé et dont chaque correction est tracée, afin de me protéger. | P1, P2 | 2.3, 3.4, 3.5 |
| J3 | Quand je ne suis pas sur place, je veux voir qui est présent et quelles heures supplémentaires se profilent, afin d'agir avant qu'elles coûtent. | P2, P3 | 3.8 |
| J4 | Quand j'arrive au travail, pressé ou les mains prises, je veux pointer en quelques secondes sans compte e-mail, afin de commencer mon service. | P4 | 5.1, 5.2, 5.7 |
| J5 | Quand j'ai oublié de pointer, je veux corriger en indiquant un motif et que mon manager valide en un geste, afin d'être payé juste sans conflit. | P4, P3 | 3.6, 8 |
| J6 | Quand je prépare ou vérifie un planning, je veux être alerté des infractions (repos de 11 h, 48 h, pauses), afin de rester en règle sans connaître le Code du travail par cœur. | P1, P2 | 8 |
| J7 | Quand je veux vérifier ma paie, je veux voir mes heures, mes heures supplémentaires et leur historique, afin d'avoir confiance. | P4 | 5.8 |
| J8 | Quand je mets l'outil en place, je veux qu'il applique ma convention et qu'il fournisse l'information à remettre aux salariés, afin d'être opérationnel rapidement et en règle avec la CNIL. | P1, P2 | 5.9, 6.1 |
| J9 | Quand je prépare la paie de mes clients, je veux recevoir un fichier au format de mon logiciel, verrouillé à date fixe, afin de ne rien ressaisir. | P5 | 7.2 |

### 9.3 Hypothèses clés et signaux de validation

| ID | Hypothèse | Signal qui la validerait en entretien |
|---|---|---|
| H1 | L'achat est déclenché par un événement (litige, contrôle, croissance, nouveau site, départ de la personne qui gérait l'Excel). | Au moins la moitié des dirigeants citent spontanément un événement |
| H2 | La transmission des heures au cabinet est le moment le plus douloureux du mois. | Au moins 1 h par mois et au moins un aller-retour avec le cabinet par mois |
| H3 | Les oublis sont la première anomalie, avant la fraude. | Les récits d'anomalies portent en majorité sur des oublis |
| H4 | Le pointage doit prendre 5 s au plus sur tablette et 3 gestes au plus sur mobile. | Durée observée et tolérance déclarée |
| H5 | Voir ses heures améliore l'adhésion des salariés. | Les salariés citent le besoin de vérifier leurs heures ou heures supplémentaires |
| H6 | Géolocalisation et photo systématique sont rejetées ; la photo aléatoire est acceptable si elle est expliquée. | Réactions des salariés et des dirigeants aux options présentées |
| H7 | Un export Silae inclus dans le prix est décisif quand la paie est externalisée. | Critère cité parmi les trois premiers |
| H8 | En dessous de 10 salariés, l'engagement de 12 mois et les options payantes sont rédhibitoires. | Refus explicite ou abandon d'essai pour cette raison |
| H9 | L'expert-comptable prescrit l'outil ou y oppose un veto. | Il est cité comme conseiller ou décideur |
| H10 | Le mode hors-ligne est nécessaire sur au moins un tiers des sites (sous-sols, chantiers). | Problèmes de réseau rapportés sur site |
| H11 | En TPE, les alertes légales doivent être informatives et non bloquantes. | Préférence exprimée entre alerte bloquante et informative |
| H12 | Les managers valident chaque semaine si les journées sans anomalie sont auto-validées. | Fréquence actuelle de validation et intérêt pour la validation par exception |

### 9.4 Guide d'entretien utilisateur (15 questions + annexe expert-comptable)

**Recrutement proposé**
- 10 à 12 dirigeants ou managers : environ 4 en HCR, 2 en commerce, 2 à 3 en propreté ou BTP, 1 en santé privée. Mélange de structures de 1 à 9 et de 10 à 49 salariés, en mono-site et en multi-sites.
- 6 à 8 salariés : dont des temps partiels, des étudiants ou saisonniers, et des personnes sans e-mail professionnel.
- 3 à 4 gestionnaires de paie en cabinet.

**Déroulé**
- Durée : 45 à 60 min pour un dirigeant, 20 à 30 min pour un salarié.
- Faire l'entretien sur site si possible, idéalement au moment d'un changement d'équipe.
- Demander à voir les **artefacts** : le fichier Excel, les feuilles signées, le dernier envoi au cabinet.
- Faire raconter des **faits passés** (« la dernière fois que… ») et ne rien présenter du produit avant la fin.

**A. Dirigeants et managers (10 questions)**

1. Décrivez-moi votre équipe : effectif, types de contrat, sites, horaires. Qui s'occupe aujourd'hui des heures et de qui dépend la paie ? *(rôles, H9)*
2. Racontez-moi la dernière clôture de paie étape par étape, depuis la collecte des heures jusqu'à l'envoi au cabinet. Combien de temps cela a-t-il pris et combien d'allers-retours ? *(H2, J1)*
3. Pouvez-vous me montrer votre outil actuel (Excel, feuilles, cahier) ? Qu'est-ce qui marche bien et que vous ne voudriez surtout pas perdre ? *(attachement à la souplesse, 3.5)*
4. Racontez-moi la dernière fois qu'un salarié a oublié de pointer ou a contesté ses heures. Comment cela s'est-il réglé ? *(H3, J5)*
5. Avez-vous déjà eu une réclamation d'heures supplémentaires, un passage aux prud'hommes ou un contrôle de l'inspection ? Quels documents avez-vous pu produire ? *(H1, J2)*
6. Quand vous n'êtes pas sur place, comment savez-vous qui est présent et si des heures supplémentaires se profilent ? *(J3)*
7. Qu'est-ce qui vous ferait craindre qu'un système de pointage soit mal vécu par vos équipes ? Que pensez-vous de la géolocalisation ou de la photo ? *(H6, 5.9)*
8. Avez-vous déjà essayé puis abandonné un logiciel de planning, de pointage ou de paie ? Qu'est-ce qui a déclenché l'essai, puis l'abandon ? *(H8, 6.2)*
9. Si vous deviez choisir un outil demain, qui déciderait ? Qui consulteriez-vous ? Quels seraient vos critères éliminatoires, votre budget mensuel raisonnable et la durée d'engagement acceptable ? *(H7, H8, H9)*
10. Qu'attend exactement votre cabinet chaque mois : contenu, format, date ? Pouvez-vous me montrer le dernier envoi ? *(J1, J9, 7.2)*

**B. Salariés (5 questions)**

11. Racontez-moi votre arrivée au travail hier : à quel moment et comment vos heures ont-elles été notées, et combien de temps cela a-t-il pris ? *(H4, J4)*
12. Avez-vous une adresse e-mail professionnelle ? Accepteriez-vous de pointer avec votre téléphone personnel ? Qu'est-ce qui vous gênerait ? *(5.1, 5.2)*
13. Comment vérifiez-vous aujourd'hui que vos heures, et vos heures supplémentaires, sont bien payées ? Que voudriez-vous pouvoir consulter ? *(H5, J7)*
14. La dernière fois que vous avez oublié de pointer ou fait une erreur, que s'est-il passé ? *(H3, J5)*
15. Qu'est-ce qui vous mettrait mal à l'aise dans un système de pointage (photo, localisation, contrôle des pauses) ? Qu'est-ce qui vous rassurerait ? *(H6)*

**Annexe : gestionnaires de paie (facultatif, 4 questions)**

- A1. Comment vos clients TPE vous transmettent-ils leurs variables ? Combien de relances et de ressaisies faites-vous chaque mois ?
- A2. Pouvez-vous me montrer un fichier « idéal » : colonnes, codes, format ? Qu'est-ce qui génère le plus d'erreurs ?
- A3. Quelle date butoir fixez-vous et quelle validation attendez-vous de l'employeur ? Un accès direct à l'outil de votre client vous serait-il utile ?
- A4. Recommandez-vous des outils à vos clients ? Selon quels critères ? Les refusez-vous parfois ? *(H9)*

---

## 10. Données introuvables ou non vérifiées

| Sujet | Statut |
|---|---|
| Part des TPE/PME qui gèrent les heures sur Excel ou papier plutôt qu'avec un logiciel | Pas d'étude robuste. Seule l'enquête éditeur Beebole a été trouvée ; méthodologie non accessible ; chiffres divergents selon les relais (36 % ou 32 %). Les chiffres de 30 % (solution digitale) et de plus de 60 % (Excel) attribués à France Num n'ont pas été vérifiés (page illisible). |
| Fréquence des oublis de pointage | Aucune statistique trouvée. |
| Badgeage de complaisance en France | Aucune étude trouvée. L'enquête américaine de l'éditeur OnTheClock, relayée par la presse, était inaccessible (erreur HTTP 451) et n'est pas retenue. |
| Temps de pointage jugé acceptable | Uniquement des affirmations d'éditeurs (3 secondes chez Shyfter, quelques secondes chez Skello). |
| Temps que les TPE passent à préparer la paie | Uniquement une affirmation Combo non sourcée (15 à 20 h par mois). |
| Part des TPE qui externalisent la paie chez un expert-comptable | Non trouvée. |
| Parts de marché d'EBP, Sage et Cegid auprès des TPE | Non trouvées. Seuls existent les chiffres communiqués par Silae et PayFit. |
| Heures supplémentaires aux prud'hommes | La nomenclature officielle ne les isole pas ; seul le poids des créances salariales est connu (environ 10 %). |
| Part des salariés français sans e-mail professionnel | Non trouvée. Seul existe un chiffre mondial (Emergence Capital). |
| Études annoncées d'éditeurs : Skello x BVA, Lucca, Combo, Indy, Bpifrance | Étude Skello x BVA non retrouvée sur la page consultée. Aucune étude chiffrée avec méthodologie trouvée chez Lucca, Combo, Indy ou Bpifrance sur ce sujet. La page Bpifrance consultée ne contient pas de données. |
| Page DARES « horaires atypiques 2021 », guides France Num, rapport du Baromètre France Num 2025, G2, Google Play, support Lucca, page d'aide Eurécia sur les heures de nuit | Inaccessibles lors de la consultation (captcha, erreur 403 ou contenu vide). |
| Rattachement des heures de nuit au jour calendaire ou au jour de prise de poste | Non vérifié : à faire valider par un juriste. |

---

## 11. Sources consultées (le 23/09/2026)

**Textes officiels et jurisprudence**
- https://code.travail.gouv.fr/code-du-travail/d3171-8
- https://code.travail.gouv.fr/code-du-travail/l3171-2
- https://code.travail.gouv.fr/code-du-travail/l3171-4
- https://code.travail.gouv.fr/code-du-travail/d3171-12
- https://code.travail.gouv.fr/code-du-travail/d3171-16
- https://code.travail.gouv.fr/code-du-travail/l3245-1
- https://code.travail.gouv.fr/code-du-travail/l8221-5
- https://code.travail.gouv.fr/code-du-travail/l8223-1
- https://code.travail.gouv.fr/code-du-travail/l3121-16
- https://code.travail.gouv.fr/code-du-travail/l3131-1
- https://code.travail.gouv.fr/code-du-travail/l3132-2
- https://code.travail.gouv.fr/code-du-travail/l3121-18
- https://code.travail.gouv.fr/code-du-travail/l3121-20
- https://code.travail.gouv.fr/code-du-travail/l3121-22
- https://code.travail.gouv.fr/code-du-travail/l3123-9
- https://code.travail.gouv.fr/code-du-travail/l3123-20
- https://code.travail.gouv.fr/contribution/1979-heures-supplementaires
- https://www.legifrance.gouv.fr/juri/id/JURITEXT000037135967
- https://www.village-justice.com/articles/paiement-des-heures-supplementaires-nouvel-amenagement-charge-preuve-favorable,34532.html
- https://www.cfdt.fr/mes-droits/actualites-juridiques/duree-et-organisation-du-travail/heures-supplementaires-la-charge-de-la-preuve-ne-repose-pas-sur-le-seul-salarie
- https://www.force-ouvriere.fr/temps-de-travail-l-employeur-doit-le-mesurer
- https://www.maitredata.com/app/jurisprudence/cass-soc-8-mars-2023-n21-20798
- https://www.justice.gouv.fr/sites/default/files/2024-07/etude_affaires%20prudhomales_mai_2024.pdf
- https://www.ghr.fr/social/les-obligations-liees-a-l-execution-du-contrat-de-travail/l-encadrement-de-la-duree-du-travail/le-controle-du-temps-de-travail?lang=fr
- https://www.legisocial.fr/conventions-collectives-nationales/1979-hcr-hotels-cafes-restaurants/heures-supplementaires-temps-partiel.html
- https://www.lhotellerie-restauration.fr/actualite/avec-ou-sans-badgeuse-vous-devez-decompter-le-temps-de-travail
- https://www.lhotellerie-restauration.fr/sos-experts/question-reponse/pointeuse-les-restaurant-ont-ils-l-obligation-d-en-installer-24037

**CNIL et vie privée**
- https://www.cnil.fr/fr/lacces-aux-locaux-et-le-controle-des-horaires-sur-le-lieu-de-travail
- https://www.cnil.fr/fr/la-geolocalisation-des-vehicules-des-salaries
- https://www.cnil.fr/fr/lacces-aux-locaux-la-biometrie-et-le-controle-des-horaires
- https://next.ink/7500/107066-dans-sanction-cnil-rappelle-sensibilite-biometrie-au-travail/
- https://www.decideurs-juridiques.com/affaires-juridiques/57358-surveillance-des-salaries-la-cnil-inflige-une-amende-de-32-millions-d-euros-a-amazon-france-logistique.html
- https://www.haas-avocats.com/reglementation/surveillance-des-salaries-chez-amazon-le-conseil-detat-precise-le-cadre-rgpd/

**Statistiques publiques et secteurs**
- https://www.insee.fr/fr/statistiques/5424748
- https://www.inrs.fr/risques/travail-horaires-atypiques/donnees-generales-et-exposition-aux-risques.html
- https://www.francetravail.org/files/live/sites/peorg/files/documents/Statistiques-et-analyses/E&S/ES_39_les%20metiers%20de%20l'hotellerie%20et%20de%20la%20restauration.pdf
- https://idf.drieets.gouv.fr/sites/idf.drieets.gouv.fr/IMG/pdf/focus_sae_proprete_-_version_definitive.pdf
- https://services.cfdt.fr/sinformer/nos-combats/les-gouvernements-changent-mais-la-federation-des-entreprises-de-proprete-dhygiene-et-services-associes-fep-reste-la-meme
- https://www.federation-proprete.com/chiffres-cles-secteur-hygiene-proprete/
- https://www.monde-proprete.com/chiffres-cles-proprete
- https://solidarites.gouv.fr/sites/solidarite/files/2023-01/Aide%20%C3%A0%20domicile%20aux%20personnes%20%C3%A2g%C3%A9es%20et%20aux%20personnes%20handicap%C3%A9es%20par%20les%20SAAD%20prestataires%20%20le%20guide%20des%20bonnes%20pratiques.pdf
- https://www.arcep.fr/cartes-et-donnees/nos-publications-chiffrees/barometre-du-numerique/le-barometre-du-numerique-edition-2026.html
- https://www.blogdumoderateur.com/barometre-numerique-tpe-pme-france-2025/

**Enquêtes et études**
- https://www.fr.adp.com/a-propos-adp/communiques-de-presse/heures-supplementaires-non-remunerees-moitie-salaries-francais.aspx
- https://www.fr.adp.com/ressources/insights/people-at-work-etude-workforce-view-pme-et-eti.aspx
- https://www.fr.adp.com/ressources/insights/people-at-work-2024.aspx
- https://sdi-pme.fr/enquete-sur-le-temps-passe-et-les-couts-administratifs-des-independants-et-dirigeants-de-tpe/
- https://payfit.com/fr/ressources/barometre-2026-rh-au-quotidien/
- https://www.blog-rh.com/2022/03/enquete-mesure-temps-travail-beebole/
- https://www.tpe-mag.fr/temps-de-travail-une-donnee-essentielle.html
- https://www.capterra.fr/blog/7672/acheter-logiciel-en-france-tendances
- https://www.capterra.fr/blog/507/enquete-crm-pme-francaises-2019
- https://www.capterra.fr/blog/2672/pratiques-surveillance-employes-en-france
- https://www.getapp.fr/blog/1822/mefiance-utilite-rapport-ambigu-salarie-surveillance
- https://www.getapp.fr/blog/2341/geolocalisation-entreprise-suivi-ou-surveillance
- https://www.emcap.com/thoughts/technology-for-the-deskless-workforce

**Avis clients**
- https://www.capterra.com/p/179936/Skello/reviews/
- https://www.capterra.fr/reviews/179936/skello
- https://www.capterra.com/p/193701/Combo/
- https://www.capterra.fr/reviews/193701/combo
- https://fr.capterra.be/reviews/193701/snapshift
- https://www.capterra.com/p/168685/Factorial-HR-Software/reviews/
- https://www.capterra.com/p/181942/Kelio/reviews/
- https://capterra.com/p/224901/Lucca/reviews/
- https://www.capterra.com/p/156992/Jibble/reviews/
- https://www.capterra.com/p/169607/Clockify/reviews/
- https://www.capterra.com/p/177706/ShiftTime/reviews/
- https://www.appvizer.fr/ressources-humaines/systeme-dinformation-rh-sirh/kelio
- https://fr.trustpilot.com/review/www.skello.io?stars=1&stars=2
- https://fr.trustpilot.com/review/combohr.com (aucun avis publié)
- https://apps.apple.com/fr/app/skello-lapp-des-%C3%A9quipes/id1215389131?see-all=reviews&platform=iphone
- https://apps.apple.com/fr/app/time-clock-by-skello/id1222875548?l=en
- https://apps.apple.com/fr/app/combo/id1112460631
- https://apps.apple.com/fr/app/combo/id1112460631?see-all=reviews
- https://apps.apple.com/fr/app/la-pointeuse-combo/id1273971338
- https://apps.apple.com/fr/app/factorial/id1479184236
- https://apps.apple.com/fr/app/factorial/id1479184236?see-all=reviews
- https://apps.apple.com/fr/app/jibble-time-tracking/id1541142980?see-all=reviews

**Documentation, tarifs et contenus d'éditeurs**
- https://guide.combohr.com/fr/articles/4521867-la-pointeuse-combo-simple-et-efficace
- https://guide.combohr.com/fr/articles/6636635-comment-fonctionne-le-mode-hors-ligne-de-la-pointeuse-combo
- https://guide.combohr.com/fr/articles/2720818-notre-export-de-paie-au-format-silae
- https://guide.combohr.com/en/articles/12149532-how-to-request-time-off-from-the-combo-mobile-app
- https://guide.combohr.com/fr/articles/12137476-comment-comprendre-et-utiliser-les-compteurs-plannings-dans-combo
- https://combohr.com/fr/pricing
- https://combohr.com/fr/blog/pointeuse-horaire
- https://combohr.com/fr/blog/logiciel-paie-hcr
- https://combohr.com/fr/blog/heures-supplementaires-restauration
- https://help.skello.io/en/articles/7182933-how-to-set-the-time-clock-rules
- https://help.skello.io/en/articles/8238426-how-to-activate-and-use-schedule-alerts-on-skello
- https://help.skello.io/en/articles/4298921-how-to-find-your-employees-pin-codes
- https://help.skello.io/fr/articles/9841802-quelles-sont-les-etapes-a-suivre-pour-mettre-en-place-la-badgeuse
- https://help.skello.io/fr/articles/11524729-comment-fonctionne-la-tarification-skello
- https://www.skello.io/en/product/time-tracking/tablet-clock-in-system
- https://www.skello.io/blog/la-nouvelle-badgeuse-skello-pincez-vous-vous-ne-revez-pas
- https://www.skello.io/blog/restauration-grande-distribution-7-conseils-planning-reussi-et-equitable
- https://www.lhotellerie-restauration.fr/journal/equipement-materiel/2016-11/skello-pour-economiser-sur-la-gestion-administrative-du-personnel.htm
- https://help.factorialhr.com/fr_FR/suivi-du-temps/about-missed-clock-outs
- https://help.factorialhr.com/fr_FR/suivi-du-temps/about-time-tracking-alerts
- https://help.factorialhr.com/fr_FR/suivi-du-temps/time-tracking-notifications
- https://help.factorialhr.com/fr_FR/suivi-du-temps/comment-enregistrer-et-modifier-manuellement-votre-pointage
- https://factorial.fr/blog/oubli-pointage/
- https://factorial.fr/tarifs
- https://www.jibble.io/help/set-reminders-automatic-clock-out
- https://www.jibble.io/help/clocking-in-and-out-with-a-pin
- https://www.jibble.io/help/configuring-your-time-tracking-policy
- https://www.jibble.io/pricing
- https://www.lucca.fr/suivi-des-temps/timesheet/
- https://www.lucca.fr/magazine/administration/suivi-temps/choisir-pointage-auto-declaratif
- https://www.lucca.fr/magazine/administration/suivi-temps/pointeuse-temps-travail-loi
- https://shyfter.com/fr-fr/secteurs/restauration-rapide/pointage-badgeuse-fast-food
- https://shyfter.com/fr-be/solutions/badgeuse/les-etapes-de-la-mise-en-place-dun-systeme-de-pointage
- https://www.octime.com/oubli-de-badgeage-comment-securiser-les-temps-de-presence-en-entreprise/
- https://www.sodeasoft.com/planning-web/planning-travail-de-nuit/
- https://traxxeo.com/gestion-temps/excel/
- https://traxxeo.com/gestion-temps/calcul-heures/gestion-des-heures/
- https://esperoo.fr/blog/feuille-de-pointage-gestion-temps-travail
- https://www.timy-badgeuse.fr/post/gestion-temps-travail-tpe-pme-2026
- https://www.ontheclock.com/blog/time-theft (aucune enquête propriétaire sur la page)

**Paie et expertise comptable**
- https://www.rhmatin.com/paie/logiciels-paie/logiciels-de-paie-silae-sous-pression-revise-les-tarifs-visant-les-experts-comptables.html
- https://www.compta-online.com/paie-silae-payfit-ao8818
- https://payfit.com/fr/fiches-pratiques/logiciels-de-paie-les-plus-utilises-par-les-pme-en-france/
- https://documentation.ohris.info/doku.php/exports:export_paie_silae
- https://www.silae.fr/solution-rh-paie/elements-variables-de-paie/
- https://www.agiris.fr/articles/paie/variables-de-paie-eviter-la-saisie-infernale-en-cabinet
- https://flocompta.com/
- https://culture-rh.com/elements-variable-de-paie-fabiliser-chaine-securiser-paie/

**Tentées mais inaccessibles (non utilisées comme sources)**
- https://www.francenum.gouv.fr/guides-et-conseils/gestion-des-ressources-humaines/systeme-dinformation-de-gestion-des-ressources-5
- https://www.francenum.gouv.fr/guides-et-conseils/gestion-des-ressources-humaines/systeme-dinformation-de-gestion-des-ressources-7
- https://www.francenum.gouv.fr/files/2025-09/Barom%C3%A8tre%20France%20Num%202025%20-%20Rapport.pdf
- https://dares.travail-emploi.gouv.fr/publication/le-travail-en-horaires-atypiques-en-2021
- https://www.wsbtv.com/news/time-theft-report/SF4F7UB7PY677GFBEXZISEXSSA/
- https://www.kkyx.com/news/time-theft-report/SF4F7UB7PY677GFBEXZISEXSSA/
- https://beebole.com/blog/enquete-pmes-temps-travail
- https://www.g2.com/products/skello/reviews
- https://play.google.com/store/apps/details?id=com.snappad&hl=fr
- https://play.google.com/store/apps/details?id=com.snapshift&hl=fr
- https://support.luccasoftware.com/s/article/comprendre-le-param%C3%A9trage-de-lucca-feuilles-de-temps?language=fr
- https://help.eurecia.com/hc/fr/articles/115002001529-Gestion-des-heures-de-nuit
- https://www.usine-digitale.fr/cybersecurite/data-protection/cnil/surveillance-au-travail-le-conseil-detat-desavoue-la-cnil-et-reduit-de-moitie-lamende-infligee-a-amazon.QNXQPNDTJ5FHVGCABLZXUYY3FA.html
- https://www.economie.gouv.fr/actualites/transformation-numerique-des-tpepme-les-enseignements-du-barometre-2025-de-france-num
- https://flash.bpifrance.fr/pret-articles-temoignages-tpe-pme/tpe-pme-rh-ete-5-astuces
