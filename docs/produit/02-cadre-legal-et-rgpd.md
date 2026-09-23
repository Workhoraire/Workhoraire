# 02. Cadre légal, RGPD et matrice de conformité

> **Ce document n'est pas un avis juridique.** Il synthétise la note de recherche [`recherche/cadre-juridique-complet.md`](recherche/cadre-juridique-complet.md), qui cite l'article ou la décision de chaque règle, lue sur Légifrance, le Code du travail numérique ou cnil.fr (consultés le 23/09/2026). Une validation par un juriste reste nécessaire avant la commercialisation.

## 1. Les règles qui fondent le produit

| Règle | Contenu | Référence |
|---|---|---|
| Décompte obligatoire | Pour les salariés hors horaire collectif : heures de début et de fin **chaque jour**, **récapitulatif chaque semaine** | [D3171-8](https://code.travail.gouv.fr/code-du-travail/d3171-8), L3171-2 |
| Fiabilité | Un système d'enregistrement automatique doit être « **fiable et infalsifiable** » | [L3171-4](https://code.travail.gouv.fr/code-du-travail/l3171-4) al. 3 |
| Droit européen | Système « **objectif, fiable et accessible** » de mesure du temps journalier | CJUE, 14/05/2019, C-55/18 (CCOO) |
| Preuve | La preuve du respect des durées maximales et des repos incombe à **l'employeur** seul | Cass. soc. 20/02/2013, n° 11-28.811 |
| Conservation | Documents de décompte à la disposition de l'inspection pendant **1 an** (3 ans pour les forfaits en jours) ; prescription des salaires : **3 ans** | [D3171-16](https://code.travail.gouv.fr/code-du-travail/d3171-16), L3245-1 |
| Semaine | Du **lundi 0 h au dimanche 24 h**, sauf accord | [L3121-35](https://code.travail.gouv.fr/code-du-travail/l3121-35) |
| Heures supplémentaires | Au-delà de 35 h ; **+25 %** pour les 8 premières, **+50 %** ensuite, à défaut d'accord | L3121-27, [L3121-36](https://code.travail.gouv.fr/code-du-travail/l3121-36) |
| Congés et heures sup | Les congés payés pris dans la semaine **comptent pour le seuil** des heures supplémentaires | Cass. soc. 10/09/2025, n° 23-14.455 |
| Temps partiel | Heures complémentaires limitées à **1/10** du contrat sans accord, majorées de **10 %**, puis 25 % | L3123-28, L3123-29 |
| Durées maximales | **10 h par jour**, **48 h sur une semaine** | L3121-18, L3121-20 |
| Pause | **20 min** consécutives dès **6 h** de travail | L3121-16 |
| Repos | **11 h** consécutives chaque jour, pas plus de **6 jours** travaillés par semaine | L3131-1, L3132-1 |
| Jours fériés | 11 jours légaux | L3133-1 |
| RGPD | Le client employeur est **responsable du traitement**, WorkHoraire est **sous-traitant** (art. 28) | RGPD art. 28 |
| CNIL | Pointage **biométrique** ou avec **photo systématique** : excessif. **Géolocalisation** : seulement si aucun autre moyen n'existe | Fiche CNIL du 17/06/2026 ; CE 15/12/2017 n° 403776 |
| AIPD | Dispense pour le contrôle des horaires **sans biométrie** ; obligatoire pour la géolocalisation à large échelle | Délibérations CNIL 2019-118 et 2018-327 |

## 2. Matrice de conformité du MVP

Légende : ✅ couvert · 🟡 partiel · ⬜ à faire (roadmap) · ➖ hors périmètre.
Nature de l'exigence : **OL** obligation légale, **JP** jurisprudence, **RC** recommandation CNIL, **BP** bonne pratique. Pour beaucoup de lignes, l'obligation pèse sur le client employeur : WorkHoraire fournit l'outil qui permet de la respecter.

| # | Exigence | Nature | Statut | Dans WorkHoraire |
|---|---|---|---|---|
| 1 | Décompte quotidien + récapitulatif hebdomadaire | OL | ✅ | Pointage entrée/sortie ; feuille de temps par semaine civile ; export hebdomadaire |
| 2 | Mesure réelle pour tous les salariés | BP | ✅ | Tous les rôles pointent, y compris sous horaire collectif |
| 3 | Horodatage serveur, pas de modification silencieuse | OL | 🟡 | Heure du serveur (jamais celle de l'appareil) ; contraintes SQL. Une suppression est tracée avec la valeur d'origine, mais la ligne est effacée : une suppression logique et un chaînage par empreinte sont à étudier |
| 4 | Piste d'audit des corrections (auteur, date, avant/après, **motif obligatoire**), visible par le salarié | OL/BP | 🟡 | Journal en ajout seul, visible dans « Mes heures ». Il manque la **notification** au salarié et la contestation |
| 5 | Validation hebdomadaire et verrouillage après la clôture de paie | BP | ⬜ | Roadmap « Next » |
| 6 | Espace salarié : consultation et export de ses données | OL | 🟡 | Consultation jour et semaine ✅ ; export personnel ⬜ |
| 7 | Horaire collectif daté et affiché, registre des équipes | OL | ⬜ | Avec le module planning |
| 8 | Alertes : 10 h/jour, 48 h/semaine, 44 h sur 12 semaines, nuit | OL | 🟡 | 10 h ✅, 48 h ✅ ; 44 h sur 12 semaines et travail de nuit ⬜ |
| 9 | Repos : 11 h quotidien, 6 jours maximum, 35 h hebdomadaire, dimanche | OL | 🟡 | 11 h ✅, 6 jours ✅ ; repos hebdomadaire de 35 h et dimanche ⬜ |
| 10 | Pause de 20 min dès 6 h | OL | ✅ | Alerte « pause manquante » (une coupure compte comme pause) |
| 11 | Journal des alertes et de leur traitement | BP | ⬜ | Alertes calculées à la volée (ADR 0002) ; journal et accusé de lecture à prévoir |
| 12 | Profil « mineur » (8 h, 35 h, pause de 30 min, repos de 12 h) | OL | ⬜ | Profils de règles |
| 13 | Travail de nuit (plage, qualification de travailleur de nuit) | OL | ⬜ | |
| 14 | Heures sup à la semaine civile, 35 h, 25/50 %, taux conventionnels | OL | 🟡 | Barème légal ✅ ; barèmes conventionnels (ex. HCR 10/20/50) et RCR ⬜ |
| 15 | Congés payés comptés dans le seuil des heures sup | JP | ✅ | Jour de congé valorisé à 1/5 de la durée contractuelle hebdomadaire (**choix documenté** : la Cour ne précise pas la méthode) ; affiché et exporté |
| 16 | Contingent annuel (220 h) et contrepartie obligatoire en repos | OL | ⬜ | |
| 17 | Aménagement du temps sur plusieurs semaines ou l'année | OL | ⬜ | |
| 18 | Temps partiel : 1/10, 10/25 %, blocage avant 35 h, requalification | OL | 🟡 | Calcul 10/25 % ✅ et alerte au-delà de 1/10 ✅ ; alerte de requalification et minimum de 24 h ⬜ |
| 19 | Forfaits en jours, cadres dirigeants | OL | ⬜ | |
| 20 | Astreintes | OL | ⬜ | |
| 21 | Jours fériés (national, Alsace-Moselle, outre-mer, 1er mai) | OL | 🟡 | 11 jours nationaux ✅ ; variantes régionales et 1er mai travaillé ⬜ |
| 22 | Compteurs d'acquisition des congés (y compris la maladie depuis la loi de 2024) | OL | ⬜ | Demandes et validation ✅, **compteurs** ⬜ |
| 23 | Report de 15 mois et information à la reprise | OL | ⬜ | |
| 24 | Recrédit des congés si un arrêt maladie survient pendant les congés | JP | ⬜ | |
| 25 | Règles de planification des congés (ordre des départs, fractionnement) | OL | ⬜ | |
| 26 | Document mensuel annexé au bulletin | OL | ⬜ | À générer à partir des données existantes |
| 27 | Export paie : heures par taux, absences, congés | OL | 🟡 | Heures sup et complémentaires par taux ✅, jours d'absence par type ✅, matricule ✅ ; nuit, dimanche et jours fériés travaillés ⬜ ; format Silae natif ⬜ |
| 28 | Récapitulatif hebdomadaire des heures sup par taux | OL | ✅ | Export « synthèse hebdomadaire » (le mois de paiement est fixé par le gestionnaire de paie) |
| 29 | Export pour l'inspection du travail, accès du CSE | OL | 🟡 | Export « détail journalier » ✅ ; accès du CSE en lecture seule ⬜ |
| 30 | Conservation paramétrable, archivage séparé, purge | OL/RC | ⬜ | Politique proposée en § 4 |
| 31 | Aucune biométrie | RC | ✅ | Par conception (ADR 0006) |
| 32 | Pas de photo systématique | RC | ✅ | Par conception |
| 33 | Géolocalisation désactivée par défaut | JP/RC | ✅ | Non implémentée |
| 34 | Aucune surveillance de l'activité (inactivité, captures d'écran) | OL/RC | ✅ | Par conception |
| 35 | Kit d'information des salariés et note au CSE | OL (client) | ✅ | [07-kit-conformite-client.md](07-kit-conformite-client.md) |
| 36 | Documentation pour l'AIPD du client | OL | 🟡 | [../technique/securite-et-rgpd.md](../technique/securite-et-rgpd.md) |
| 37 | Contrat de sous-traitance (art. 28), registre, violations | OL | ⬜ | Hors code : à rédiger avec un juriste avant le premier client |
| 38 | Aucune réutilisation des données clients pour l'éditeur | OL | ✅ | Principe inscrit dans la stratégie produit |
| 39 | Sécurité : comptes nominatifs, habilitations, journalisation, chiffrement | OL/RC | 🟡 | Comptes Keycloak individuels, rôles, isolation par entreprise, protection anti-brute-force ✅ ; MFA administrateurs, journal d'accès, chiffrement au repos ⬜ |
| 40 | Hébergement dans l'UE | OL/BP | ⬜ | Décision de déploiement |
| 41 | Traitement des demandes d'accès et de rectification | OL | 🟡 | L'espace salarié couvre l'essentiel de l'accès |
| 42 | Évaluer la nécessité d'un DPO | OL | ⬜ | |
| 44–47 | Préréglages sectoriels (HCR, BTP, Mobilic, aide à domicile) | OL | ⬜ | Après validation du segment prioritaire |
| 48 | Règles versionnées avec date d'effet | BP | ⬜ | Nécessaire dès que les seuils deviennent paramétrables |

## 3. Choix de conception dictés par le droit

1. **Heure du serveur uniquement.** Le client n'envoie jamais l'heure d'un pointage en temps réel. Seules les corrections (manager, ou salarié pour une sortie oubliée) portent une heure déclarée, **toujours avec un motif et une trace**.
2. **Une correction n'efface jamais l'historique.** Le journal `TimeEntryAuditLog` n'a pas de clé étrangère vers le pointage, pour survivre à sa suppression.
3. **Une sortie oubliée ne compte aucune heure** tant que l'heure réelle n'est pas déclarée. On n'invente pas d'heures ; l'alerte « sortie non pointée » reste visible.
4. **Un manager ne corrige ni ne valide ses propres heures ou congés** (conflit d'intérêts). Un administrateur le peut, car il n'a personne au-dessus de lui dans l'outil.
5. **Les alertes sont informatives, pas bloquantes.** Elles reprennent les seuils légaux par défaut et rappellent qu'un accord collectif peut en prévoir d'autres.
6. **Minimisation.** Aucune donnée de localisation, de biométrie ni d'appareil n'est collectée. Pour les absences, le type « arrêt maladie » suffit, et l'interface demande de n'indiquer **aucune information médicale**.

## 4. Politique de conservation proposée (à valider)

Fondée sur D3171-16, L3245-1 et le référentiel CNIL RH du 02/04/2026 (§ 5.6 de l'annexe) :
- **Base active** : jusqu'à la clôture de la paie de la période et la fin de la fenêtre de correction.
- **Archivage intermédiaire séparé** (accès restreint) : **3 ans** par défaut, pour couvrir la prescription des salaires ; 1 an au minimum, 5 ans au maximum. Paramétrable par client.
- **Purge automatique** en fin de durée, y compris dans le journal d'audit.
- **Journaux techniques d'accès** : 3 mois.

Ce mécanisme n'est pas encore implémenté (ligne 30 de la matrice).

## 5. Points de vigilance juridique

- **Valorisation des congés dans le seuil des heures sup** : le 1/5 de la durée hebdomadaire est un choix de l'équipe, à faire valider. L'extension à d'autres absences (jours fériés chômés, par exemple) n'est pas vérifiée.
- **Semaines à cheval sur deux mois** : l'export les donne entières ; le rattachement au mois de paie relève du gestionnaire de paie.
- **Conventions collectives** : les seuils et taux conventionnels ne sont pas encore paramétrables. Le produit l'annonce sur le tableau de bord et dans les exports.
- Veille : projet de loi sur le travail le 1er mai (boulangers, fleuristes), réforme éventuelle suite à CCOO (§ 10 de l'annexe).
