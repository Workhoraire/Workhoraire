import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

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
  /** Only facts confirmed by the team: no certification, figure or customer reference. */
  protected readonly measures: Measure[] = [
    {
      icon: 'pin',
      title: 'Hébergement en France',
      text: 'Les données de l’application sont hébergées en France.',
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
      text: 'Administrateur, manager ou employé : chacun accède à ce que son rôle permet. Un manager ne corrige pas ses propres heures.',
    },
    {
      icon: 'eyeOff',
      title: 'Aucun traceur publicitaire',
      text: 'WorkHoraire n’utilise aucun traceur publicitaire. Ce site non plus : il ne dépose aucun cookie.',
    },
    {
      icon: 'document',
      title: 'Contrat de sous-traitance RGPD',
      text: 'WorkHoraire traite les données de l’application pour le compte de l’employeur. Le contrat de sous-traitance (article 28 du RGPD) est publié sur ce site et fait partie des conditions générales de vente.',
    },
    {
      icon: 'database',
      title: 'Sauvegardes chiffrées chaque nuit',
      text: 'Les données de l’application sont sauvegardées chaque nuit, chiffrées, et leur restauration est testée.',
    },
  ];
}
