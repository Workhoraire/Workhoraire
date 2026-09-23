# ADR 0006. Confiance sans surveillance : ni biométrie, ni photo, ni géolocalisation ; kiosque à décider

- **Statut** : accepté pour les exclusions ; **proposé** pour le mode kiosque (décision d'équipe requise)
- **Date** : 2026-09-23

## Contexte

- La CNIL juge excessifs le pointage biométrique et la photo systématique (fiche du 17/06/2026). Elle n'admet la géolocalisation pour contrôler le temps de travail que si aucun autre moyen n'est possible (CE 15/12/2017, n° 403776).
- Les salariés se méfient de la surveillance, mais valorisent la preuve de leurs heures (annexe besoins, § 5.9).
- Le marché propose souvent une tablette partagée à l'entrée (« kiosque »), où le salarié s'identifie par un code PIN. C'est utile pour les salariés sans smartphone ni e-mail.

## Décision

1. **Exclus du produit**, même en option : biométrie, photo à chaque pointage, mesure de l'activité, captures d'écran.
2. **Géolocalisation** : non implémentée. Si elle était un jour demandée, ce serait une collecte ponctuelle au seul pointage, désactivée par défaut, jamais utilisée pour calculer le temps, avec avertissement AIPD et justification du client.
3. **Mode kiosque : proposé, non implémenté.** Il implique une authentification **hors de Keycloak** : un code PIN par salarié, sur un appareil déclaré par l'entreprise. AGENTS.md interdit d'introduire une authentification spécifique sans demande explicite. C'est donc une **décision d'architecture à prendre par l'équipe**.

   Options :
   - (a) jeton d'appareil, émis par un ADMIN et révocable, avec code PIN salarié haché et limitation des essais ;
   - (b) compte Keycloak technique « kiosque » par site, et sélection du salarié avec son PIN ;
   - (c) QR code affiché sur place et scanné par le téléphone personnel du salarié, déjà authentifié.

   **Recommandation** : commencer par (c), qui ne demande aucune nouvelle authentification, puis (a) si les entretiens confirment le besoin de tablette partagée (H4).

## Conséquences

- La conformité CNIL est un argument commercial simple : aucune AIPD n'est nécessaire pour le pointage de base (délibération 2019-118).
- Certains prospects demanderont la géolocalisation (chantiers, propreté) : le produit l'assume et la roadmap l'encadre.
