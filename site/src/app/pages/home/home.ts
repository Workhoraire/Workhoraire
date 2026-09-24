import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { APP_LINKS } from '../../core/links';
import { PRICING_TEXT } from '../../core/pricing';
import { CtaBand } from '../../shared/cta-band';
import { Icon, IconName } from '../../shared/icon';
import { Screenshot } from '../../shared/screenshot';

interface Audience {
  icon: IconName;
  title: string;
  promise: string;
  points: string[];
}

interface Benefit {
  icon: IconName;
  title: string;
  text: string;
}

@Component({
  selector: 'app-home',
  imports: [CtaBand, Icon, RouterLink, Screenshot],
  templateUrl: './home.html',
  styleUrl: './home.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Home {
  protected readonly links = APP_LINKS;
  protected readonly pricing = PRICING_TEXT;

  protected readonly audiences: Audience[] = [
    {
      icon: 'phone',
      title: 'Salariés',
      promise: 'Pointer en un geste et garder un œil sur ses heures.',
      points: [
        'Arrivée et sortie pointées depuis le téléphone',
        'Journée et semaine toujours visibles',
        'Congés et absences demandés dans l’application',
        'Chaque correction de ses heures consultable',
      ],
    },
    {
      icon: 'users',
      title: 'Managers',
      promise: 'Suivre l’équipe sans tableur.',
      points: [
        'Présents, absents et sorties non pointées du jour',
        'Oublis corrigés avec un motif tracé',
        'Absences acceptées ou refusées',
        'Alertes légales de la semaine',
      ],
    },
    {
      icon: 'briefcase',
      title: 'Dirigeants et paie',
      promise: 'Des heures justes, prêtes pour la paie.',
      points: [
        'Salariés invités par un simple lien',
        'Heures supplémentaires et complémentaires calculées',
        'Exports CSV lisibles dans Excel',
        'Rôles, contrats et matricules de paie',
      ],
    },
  ];

  protected readonly benefits: Benefit[] = [
    {
      icon: 'clock',
      title: 'L’heure du serveur fait foi',
      text: 'Le pointage enregistre l’heure du serveur, pas celle du téléphone.',
    },
    {
      icon: 'history',
      title: 'Des corrections transparentes',
      text: 'Chaque correction est tracée avec son motif, et le salarié la voit.',
    },
    {
      icon: 'percent',
      title: 'Le Code du travail intégré',
      text: 'Heures supplémentaires et complémentaires calculées par semaine civile, avec les majorations légales par défaut.',
    },
    {
      icon: 'alert',
      title: 'Des alertes légales',
      text: 'Plus de 10 h par jour ou de 48 h par semaine, pause ou repos insuffisant : les dépassements sont signalés.',
    },
    {
      icon: 'download',
      title: 'Prêt pour la paie',
      text: 'Des exports CSV lisibles dans Excel, à transmettre à votre gestionnaire de paie.',
    },
    {
      icon: 'link',
      title: 'Une équipe invitée par lien',
      text: 'Le salarié ouvre le lien reçu par e-mail, choisit son mot de passe, puis confirme son adresse depuis l’e-mail de vérification.',
    },
  ];
}
