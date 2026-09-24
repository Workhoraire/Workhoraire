import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { LEGAL_INFO } from '../../core/legal/legal-info';
import { NBSP } from '../../core/text';
import { CtaBand } from '../../shared/cta-band';
import { Icon, IconName } from '../../shared/icon';

interface Measure {
  icon: IconName;
  title: string;
  text: string;
}

@Component({
  selector: 'app-security',
  imports: [CtaBand, Icon, RouterLink],
  templateUrl: './security.html',
  styleUrl: './security.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Security {
  private readonly info = inject(LEGAL_INFO);

  /** Only facts confirmed by the team: no certification, figure or customer reference. */
  protected readonly measures: Measure[] = [
    {
      icon: 'pin',
      title: 'Base de données en France',
      text: `La base de données de l’application est hébergée en France, chez ${this.info.hosting.name}. Les e-mails du service passent par Brevo, dans l’Union européenne.`,
    },
    {
      icon: 'lock',
      title: 'Échanges chiffrés',
      text: 'Les échanges entre votre navigateur et WorkHoraire sont chiffrés (HTTPS).',
    },
    {
      icon: 'history',
      title: 'Piste d’audit en ajout seul',
      text: 'Chaque correction d’heures s’ajoute à l’historique, sans jamais le réécrire. Le salarié voit les corrections faites sur ses heures.',
    },
    {
      icon: 'users',
      title: 'Rôles et séparation des tâches',
      text: `Administrateur, manager ou employé${NBSP}: chacun accède à ce que son rôle permet. Un manager ne corrige pas ses propres heures.`,
    },
    {
      icon: 'eyeOff',
      title: 'Aucun traceur publicitaire',
      text: `WorkHoraire n’utilise aucun traceur publicitaire. Ce site non plus${NBSP}: il ne dépose aucun cookie.`,
    },
    {
      icon: 'document',
      title: 'Contrat de sous-traitance RGPD',
      text: `WorkHoraire traite les données de l’application pour le compte de l’employeur. Le contrat de sous-traitance (article${NBSP}28 du RGPD) est publié sur ce site et fait partie des conditions générales de vente.`,
    },
    {
      icon: 'database',
      title: 'Sauvegardes chiffrées chaque nuit',
      text: this.info.offsiteBackup
        ? `Les données de l’application sont sauvegardées chaque nuit, chiffrées, chez l’hébergeur et en copie hors du serveur, chez ${this.info.offsiteBackup.name} (${this.info.offsiteBackup.location}). Leur restauration est testée.`
        : 'Les données de l’application sont sauvegardées chaque nuit, chiffrées, chez l’hébergeur, et leur restauration est testée.',
    },
  ];
}
