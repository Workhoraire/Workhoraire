import { Route, Routes } from '@angular/router';

import { FREE_ACTIVE_EMPLOYEES, PRICING_TEXT, formatEuros } from './core/pricing';
import { PageMeta } from './core/seo/page-meta';
import { NBSP } from './core/text';

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
 * also add it to `public/sitemap.xml` (seo-title-strategy.spec.ts checks it).
 */
export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'WorkHoraire · Le pointage simple et conforme pour les TPE',
    data: {
      page: {
        description: `Pointage sur téléphone à l’heure du serveur, heures supplémentaires calculées, alertes légales et exports pour la paie. Gratuit jusqu’à ${PRICING_TEXT.freeLimit}.`,
      } satisfies PageMeta,
    },
    loadComponent: () => import('./pages/home/home').then(({ Home }) => Home),
  },
  {
    path: 'fonctionnalites',
    title: 'Fonctionnalités : pointage et heures sup · WorkHoraire',
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
    title: `Tarifs : gratuit jusqu’à ${FREE_ACTIVE_EMPLOYEES} utilisateurs · WorkHoraire`,
    data: {
      page: {
        description: `Découverte${NBSP}: ${formatEuros(0)} jusqu’à ${PRICING_TEXT.freeLimit}. Essentiel${NBSP}: ${PRICING_TEXT.unitPrice} par utilisateur actif et par mois, tous comptés, sans abonnement de base ni engagement.`,
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
          'Base de données hébergée en France, échanges chiffrés, piste d’audit visible par le salarié, sauvegardes chiffrées chaque nuit, aucun traceur publicitaire.',
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
          'Guides pratiques du temps de travail en France : heures supplémentaires, temps partiel, congés payés et information des salariés avant le pointage.',
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
    path: 'guides/informer-les-salaries',
    title: 'Informer vos salariés du pointage · WorkHoraire',
    data: {
      page: {
        description:
          'Informer chaque salarié avant le premier pointage (L1222-4), consulter le CSE dès 50 salariés : les règles et un modèle de note d’information prêt à compléter.',
        ogType: 'article',
      } satisfies PageMeta,
    },
    loadComponent: () =>
      import('./pages/guides/employee-information-guide').then(
        ({ EmployeeInformationGuide }) => EmployeeInformationGuide,
      ),
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
          'Aucun cookie ni traceur sur le site. Données traitées pour le compte de l’employeur, base de données hébergée en France. Vos droits et comment les exercer.',
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
