import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';

import { LEGAL_INFO } from '../../core/legal/legal-info';
import { APP_LINKS } from '../../core/links';
import { FREE_ACTIVE_EMPLOYEES, PRICING_TEXT, activeUsers, formatEuros } from '../../core/pricing';
import { NBSP } from '../../core/text';
import { LegalField } from '../../shared/legal-field';
import {
  EmployeeCount,
  MAX_SIMULATED_EMPLOYEES,
  estimatePrice,
  normalizeEmployeeCount,
  parseEmployeeCount,
} from './pricing-simulator';

interface Question {
  question: string;
  answer: string;
}

/** Tax regime of the publisher (legal-info.json): null while it is not decided. */
function vatAnswer(vatExempt: boolean | null): string {
  switch (vatExempt) {
    case true:
      return `Oui, les prix sont indiqués hors taxes (HT). TVA non applicable, art.${NBSP}293${NBSP}B du CGI${NBSP}: le montant facturé est le prix affiché. WorkHoraire s’adresse aux professionnels.`;
    case false:
      return `Oui, les prix sont indiqués hors taxes (HT)${NBSP}: la TVA de 20${NBSP}% s’y ajoute. WorkHoraire s’adresse aux professionnels.`;
    default:
      return 'Oui, les prix sont indiqués hors taxes (HT). WorkHoraire s’adresse aux professionnels.';
  }
}

@Component({
  selector: 'app-pricing',
  imports: [LegalField],
  templateUrl: './pricing.html',
  styleUrl: './pricing.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Pricing {
  protected readonly links = APP_LINKS;
  protected readonly pricing = PRICING_TEXT;
  protected readonly maxEmployees = MAX_SIMULATED_EMPLOYEES;
  protected readonly vatExempt = inject(LEGAL_INFO).publisher.vatExempt;

  /** Raw text of the field: it is not rewritten while the visitor types, even when empty. */
  protected readonly employeesText = signal('8');
  /**
   * A number field gives an empty value for text it cannot read, such as "8 p":
   * the last number read stays priced, and the page says so.
   */
  private readonly unreadable = signal(false);

  private readonly employees = computed<EmployeeCount>(() => {
    const typed = parseEmployeeCount(this.employeesText());
    return this.unreadable() ? { count: typed.count, issue: 'invalid' } : typed;
  });

  protected readonly estimate = computed(() => estimatePrice(this.employees().count));

  protected readonly price = computed(() => formatEuros(this.estimate().monthlyPrice));

  protected readonly detail = computed(() => {
    const { activeEmployees, unitPrice } = this.estimate();
    if (activeEmployees <= FREE_ACTIVE_EMPLOYEES) {
      return `Offre Découverte${NBSP}: gratuite jusqu’à ${PRICING_TEXT.freeLimit}.`;
    }
    return `${activeUsers(activeEmployees)} × ${formatEuros(unitPrice)}${NBSP}HT.`;
  });

  /** Why the price is not computed for the typed value, until the field is left. */
  protected readonly hint = computed(() => {
    const { count, issue } = this.employees();
    switch (issue) {
      case 'tooLarge':
        return `Le simulateur va jusqu’à ${activeUsers(MAX_SIMULATED_EMPLOYEES)}${NBSP}: le prix affiché est celui de ${activeUsers(count)}.`;
      case 'decimal':
      case 'invalid':
        return `Indiquez un nombre entier${NBSP}: le prix affiché est celui de ${activeUsers(count)}.`;
      case 'negative':
        return 'Le nombre d’utilisateurs actifs ne peut pas être négatif.';
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
      question: `Qu’est-ce qu’un utilisateur actif${NBSP}?`,
      answer: `Une personne de l’équipe (salarié, manager ou dirigeant) qui a, dans le mois, des heures pointées ou ajoutées à sa feuille de temps, ou une absence validée. Un saisonnier sans heures ni absence dans le mois n’est pas compté.`,
    },
    {
      question: `Que comprend l’offre Découverte${NBSP}?`,
      answer: `Toutes les fonctions de WorkHoraire, gratuitement, tant que vous avez au plus ${PRICING_TEXT.freeLimit} dans le mois.`,
    },
    {
      question: `Que se passe-t-il si je dépasse ${PRICING_TEXT.freeLimit}${NBSP}?`,
      answer: `Vous recevez un e-mail et vous disposez de ${PRICING_TEXT.gracePeriod} pour choisir l’offre Essentiel. Tous les utilisateurs actifs sont alors comptés${NBSP}: ${PRICING_TEXT.firstPaidTeam} font ${PRICING_TEXT.firstPaidPrice} par mois. Passé ce délai, WorkHoraire passe en lecture seule tant que l’abonnement n’est pas réglé${NBSP}: vos salariés peuvent toujours pointer, et vous pouvez consulter et exporter les heures.`,
    },
    {
      question: `Y a-t-il un engagement${NBSP}?`,
      answer: `Non. L’offre Essentiel est sans engagement et sans abonnement de base${NBSP}: chaque mois, vous payez les utilisateurs actifs du mois.`,
    },
    {
      question: `Comment se passe le paiement${NBSP}?`,
      answer: `Par prélèvement SEPA ou par carte bancaire, sur une page de paiement sécurisée de Stripe. Vous recevez une facture chaque mois.`,
    },
    {
      question: `Puis-je résilier à tout moment${NBSP}?`,
      answer: `Oui. Sur la page «${NBSP}Abonnement${NBSP}» de l’application, le bouton «${NBSP}Factures et moyen de paiement${NBSP}» ouvre votre espace de facturation chez Stripe, où vous pouvez résilier. La résiliation prend effet à la fin de la période en cours.`,
    },
    {
      question: `Que deviennent mes données si je résilie${NBSP}?`,
      answer: `Votre compte revient à l’offre Découverte. Vos données restent consultables et exportables au format CSV. Si vous fermez votre compte, elles sont supprimées selon les délais indiqués dans les conditions générales de vente.`,
    },
    {
      question: `Les prix sont-ils hors taxes${NBSP}?`,
      answer: vatAnswer(this.vatExempt),
    },
  ];

  protected onEmployeesInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.unreadable.set(input.validity.badInput);
    if (!input.validity.badInput) {
      this.employeesText.set(input.value);
    }
  }

  /** Leaving the field shows the number actually used for the price. */
  protected onEmployeesChange(event: Event): void {
    if (this.unreadable() || this.employeesText().trim() !== '') {
      const count = String(this.estimate().activeEmployees);
      this.unreadable.set(false);
      this.employeesText.set(count);
      // The binding does not write a value that did not change over the unreadable text.
      (event.target as HTMLInputElement).value = count;
    }
  }

  protected changeEmployees(delta: number): void {
    const count = normalizeEmployeeCount(this.estimate().activeEmployees + delta);
    this.unreadable.set(false);
    this.employeesText.set(String(count));
  }
}
