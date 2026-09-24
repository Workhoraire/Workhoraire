import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

import { APP_LINKS } from '../../core/links';
import {
  FREE_ACTIVE_EMPLOYEES,
  MAX_SIMULATED_EMPLOYEES,
  estimatePrice,
  formatCount,
  formatEuros,
  normalizeEmployeeCount,
  parseEmployeeCount,
} from './pricing-simulator';

interface Question {
  question: string;
  answer: string;
}

/** No-break space, used before "?" and ":" as French typography requires. */
const NBSP = ' ';

@Component({
  selector: 'app-pricing',
  templateUrl: './pricing.html',
  styleUrl: './pricing.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pricing {
  protected readonly links = APP_LINKS;
  protected readonly maxEmployees = MAX_SIMULATED_EMPLOYEES;

  /** Raw text of the field: it is not rewritten while the visitor types, even when empty. */
  protected readonly employeesText = signal('8');

  private readonly employees = computed(() => parseEmployeeCount(this.employeesText()));

  protected readonly estimate = computed(() => estimatePrice(this.employees().count));

  protected readonly price = computed(() => formatEuros(this.estimate().monthlyPrice));

  protected readonly detail = computed(() => {
    const { activeEmployees, unitPrice } = this.estimate();
    if (activeEmployees <= FREE_ACTIVE_EMPLOYEES) {
      return `Offre Découverte${NBSP}: gratuite jusqu’à 3${NBSP}salariés actifs.`;
    }
    return `${formatCount(activeEmployees)}${NBSP}salariés actifs × ${formatEuros(unitPrice)}${NBSP}HT.`;
  });

  /** Why the price is not computed for the typed value, until the field is left. */
  protected readonly hint = computed(() => {
    const { count, issue } = this.employees();
    switch (issue) {
      case 'tooLarge':
        return `Le simulateur va jusqu’à ${formatCount(MAX_SIMULATED_EMPLOYEES)}${NBSP}salariés actifs${NBSP}: le prix affiché est celui de ${formatCount(count)}${NBSP}salariés.`;
      case 'decimal':
        return `Indiquez un nombre entier${NBSP}: le prix affiché est celui de ${formatCount(count)}${NBSP}salariés.`;
      case 'negative':
        return 'Le nombre de salariés ne peut pas être négatif.';
      default:
        return null;
    }
  });

  protected readonly cta = computed(() =>
    this.estimate().plan === 'decouverte'
      ? { label: 'Commencer gratuitement', href: this.links.signUp }
      : { label: 'Choisir Essentiel', href: this.links.signUpEssential },
  );

  protected readonly questions: Question[] = [
    {
      question: `Qu’est-ce qu’un salarié actif${NBSP}?`,
      answer: `Un salarié qui a pointé, ou qui a eu une absence validée, dans le mois${NBSP}: vous ne payez pas les saisonniers les mois où ils ne travaillent pas.`,
    },
    {
      question: `Que comprend l’offre Découverte${NBSP}?`,
      answer:
        'Toutes les fonctions de WorkHoraire, gratuitement, tant que vous avez au plus 3 salariés actifs dans le mois.',
    },
    {
      question: `Que se passe-t-il si je dépasse 3${NBSP}salariés actifs${NBSP}?`,
      answer: `Vous recevez un e-mail et vous disposez de 30${NBSP}jours pour choisir l’offre Essentiel. Passé ce délai, WorkHoraire passe en lecture seule tant que l’abonnement n’est pas réglé${NBSP}: vos salariés peuvent toujours pointer, et vous pouvez consulter et exporter les heures.`,
    },
    {
      question: `Y a-t-il un engagement${NBSP}?`,
      answer: `Non. L’offre Essentiel est sans engagement et sans abonnement de base${NBSP}: chaque mois, vous payez les salariés actifs du mois.`,
    },
    {
      question: `Comment se passe le paiement${NBSP}?`,
      answer: `Par prélèvement SEPA ou par carte bancaire, sur une page de paiement sécurisée de Stripe. Vous recevez une facture chaque mois.`,
    },
    {
      question: `Puis-je résilier à tout moment${NBSP}?`,
      answer: `Oui, en un clic depuis la page «${NBSP}Abonnement${NBSP}» de l’application. La résiliation prend effet à la fin de la période en cours.`,
    },
    {
      question: `Que deviennent mes données si je résilie${NBSP}?`,
      answer: `Votre compte revient à l’offre Découverte. Vos données restent consultables et exportables au format CSV. Si vous fermez votre compte, elles sont supprimées selon les délais indiqués dans les conditions générales de vente.`,
    },
    {
      question: `Les prix sont-ils hors taxes${NBSP}?`,
      answer: 'Oui, les prix sont indiqués hors taxes (HT). WorkHoraire s’adresse aux professionnels.',
    },
  ];

  protected onEmployeesInput(event: Event): void {
    this.employeesText.set((event.target as HTMLInputElement).value);
  }

  /** Leaving the field shows the number actually used for the price. */
  protected onEmployeesChange(): void {
    if (this.employeesText().trim() !== '') {
      this.employeesText.set(String(this.estimate().activeEmployees));
    }
  }

  protected changeEmployees(delta: number): void {
    const count = normalizeEmployeeCount(this.estimate().activeEmployees + delta);
    this.employeesText.set(String(count));
  }
}
