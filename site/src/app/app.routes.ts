import { Route, Routes } from '@angular/router';

import { PageMeta } from './core/seo/page-meta';

const notFound: Omit<Route, 'path'> = {
  title: 'Page introuvable · WorkHoraire',
  data: {
    page: {
      description: 'Cette page n’existe pas ou a été déplacée.',
      indexable: false,
    } satisfies PageMeta,
  },
  loadComponent: () => import('./pages/not-found/not-found').then(({ NotFound }) => NotFound),
};

/**
 * Every route is prerendered at build time. When adding an indexable page,
 * also add it to `public/sitemap.xml`.
 */
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'WorkHoraire · Le pointage simple et conforme pour les TPE',
    data: {
      page: {
        description:
          'Pointage sur téléphone à l’heure du serveur, heures supplémentaires calculées, alertes légales et exports pour la paie. Gratuit jusqu’à 3 salariés actifs.',
      } satisfies PageMeta,
    },
    loadComponent: () => import('./pages/home/home').then(({ Home }) => Home),
  },
  {
    path: 'fonctionnalites',
    title: 'Fonctionnalités : pointage, heures sup, alertes · WorkHoraire',
    data: {
      page: {
        description:
          'Pointage en un geste, corrections tracées, alertes légales, heures supplémentaires et complémentaires, absences en demi-journées et exports CSV pour la paie.',
      } satisfies PageMeta,
    },
    loadComponent: () => import('./pages/features/features').then(({ Features }) => Features),
  },
  {
    path: 'tarifs',
    title: 'Tarifs : gratuit jusqu’à 3 salariés · WorkHoraire',
    data: {
      page: {
        description:
          'Découverte : 0 € jusqu’à 3 salariés actifs. Essentiel : 3 € HT par salarié actif et par mois, sans abonnement de base ni engagement. Simulez votre prix.',
      } satisfies PageMeta,
    },
    loadComponent: () => import('./pages/pricing/pricing').then(({ Pricing }) => Pricing),
  },
  {
    path: 'securite',
    title: 'Sécurité et protection des données · WorkHoraire',
    data: {
      page: {
        description:
          'Hébergement en France, échanges chiffrés, piste d’audit visible par le salarié, sauvegardes chiffrées chaque nuit, aucun traceur publicitaire.',
      } satisfies PageMeta,
    },
    loadComponent: () => import('./pages/security/security').then(({ Security }) => Security),
  },
  {
    path: 'guides',
    title: 'Guides du temps de travail · WorkHoraire',
    data: {
      page: {
        description:
          'Guides pratiques sur les règles du temps de travail en France : heures supplémentaires, majorations, temps partiel et congés payés.',
      } satisfies PageMeta,
    },
    loadComponent: () => import('./pages/guides/guides').then(({ Guides }) => Guides),
  },
  {
    path: 'guides/heures-supplementaires',
    title: 'Heures supplémentaires : calcul et majorations · WorkHoraire',
    data: {
      page: {
        description:
          'Semaine civile, majorations de 25 % et 50 %, heures complémentaires, congés payés : comment calculer les heures supplémentaires d’une semaine de 35 heures.',
        ogType: 'article',
      } satisfies PageMeta,
    },
    loadComponent: () =>
      import('./pages/guides/overtime-guide').then(({ OvertimeGuide }) => OvertimeGuide),
  },
  {
    path: 'mentions-legales',
    title: 'Mentions légales · WorkHoraire',
    data: {
      page: {
        description:
          'Mentions légales de WorkHoraire : éditeur du site et du service, directeur de la publication, hébergeur en France.',
      } satisfies PageMeta,
    },
    loadComponent: () =>
      import('./pages/legal/legal-notice').then(({ LegalNotice }) => LegalNotice),
  },
  {
    path: 'confidentialite',
    title: 'Politique de confidentialité · WorkHoraire',
    data: {
      page: {
        description:
          'Aucun cookie ni traceur sur le site. Données de l’application hébergées en France et traitées pour le compte de l’employeur. Vos droits et comment les exercer.',
      } satisfies PageMeta,
    },
    loadComponent: () => import('./pages/legal/privacy').then(({ Privacy }) => Privacy),
  },
  {
    path: 'cgv',
    title: 'Conditions générales de vente · WorkHoraire',
    data: {
      page: {
        description:
          'Conditions générales de vente de WorkHoraire, réservées aux professionnels : offres, prix, paiement, lecture seule en cas d’impayé, résiliation et données.',
      } satisfies PageMeta,
    },
    loadComponent: () => import('./pages/legal/terms').then(({ Terms }) => Terms),
  },
  {
    path: 'sous-traitance',
    title: 'Contrat de sous-traitance RGPD · WorkHoraire',
    data: {
      page: {
        description:
          'Contrat de sous-traitance (article 28 du RGPD) : données traitées pour l’employeur, sous-traitants ultérieurs, violations de données et mesures de sécurité.',
      } satisfies PageMeta,
    },
    loadComponent: () =>
      import('./pages/legal/processing-agreement').then(
        ({ ProcessingAgreement }) => ProcessingAgreement,
      ),
  },
  // Prerendered to 404.html, the page that the web server returns for unknown addresses.
  { path: '404', ...notFound },
  { path: '**', ...notFound },
];
