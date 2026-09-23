# ADR 0005. Des exports CSV génériques avant une intégration paie

- **Statut** : accepté (MVP)
- **Date** : 2026-09-23

## Contexte

La paie des TPE est très souvent faite par l'expert-comptable, et Silae équiperait environ 80 % des cabinets (annexe besoins, § 7). Les concurrents font payer l'export Silae (Combo : +1,50 €/salarié/mois), et c'est un reproche fréquent. Une intégration par API impose un partenariat et une correspondance des rubriques propre à chaque client.

## Décision

1. Deux exports CSV **inclus**, lisibles directement dans Excel en français (UTF-8 avec BOM, `;`, décimales à virgule) :
   - **synthèse hebdomadaire** : une ligne par salarié et par semaine civile, avec heures sup et complémentaires par taux, congés payés comptés dans le seuil, jours d'absence par type et alertes ;
   - **détail journalier** : entrées, sorties, pauses et coupures, heures, absences.
2. Le **matricule paie** est ajouté au salarié et placé en première colonne : il sert de clé d'import chez les gestionnaires.
3. Les semaines ne sont jamais coupées : la semaine civile sert de base au calcul des heures sup, et le rattachement d'une semaine à cheval sur deux mois relève du gestionnaire de paie.
4. Les valeurs sont neutralisées contre l'injection de formules.

## Conséquences

- L'export est utilisable dès maintenant avec n'importe quel logiciel ou tableur.
- L'étape suivante (roadmap n° 3) est un **format Silae natif**, avec une correspondance des rubriques paramétrée une fois par client et un pré-contrôle bloquant (matricule manquant). Il faudra la construire avec 3 ou 4 gestionnaires de paie.
