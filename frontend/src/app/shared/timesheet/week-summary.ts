import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

import { formatDuration } from '../../core/time/time-format';
import { TimesheetWeek } from '../../core/time/time.models';

@Component({
  selector: 'app-week-summary',
  template: `
    @if (week(); as current) {
      <div class="wh-kpis">
        <div class="wh-kpi wh-kpi-ink">
          <p class="wh-kpi-label">Heures travaillées</p>
          <p class="wh-kpi-value">{{ format(current.workedMinutes) }}</p>
          <p class="wh-kpi-note">sur {{ format(current.contractMinutes) }} au contrat</p>
        </div>
        @if (isPartTime()) {
          <div class="wh-kpi" [class.wh-kpi-lime]="complementary() > 0">
            <p class="wh-kpi-label">Heures complémentaires</p>
            <p class="wh-kpi-value">{{ format(complementary()) }}</p>
            <p class="wh-kpi-note">
              +10 % : {{ format(current.complementary.tier10Minutes) }} · +25 % :
              {{ format(current.complementary.tier25Minutes) }}
            </p>
          </div>
        } @else {
          <div class="wh-kpi" [class.wh-kpi-lime]="overtime() > 0">
            <p class="wh-kpi-label">Heures supplémentaires</p>
            <p class="wh-kpi-value">{{ format(overtime()) }}</p>
            <p class="wh-kpi-note">
              +25 % : {{ format(current.overtime.tier25Minutes) }} · +50 % :
              {{ format(current.overtime.tier50Minutes) }}
            </p>
            @if (current.paidLeaveCreditMinutes > 0) {
              <p class="wh-kpi-note">
                Congés payés comptés dans le seuil de 35 h : {{ format(current.paidLeaveCreditMinutes) }}
              </p>
            }
          </div>
        }
        <div class="wh-kpi">
          <p class="wh-kpi-label">Absences</p>
          <p class="wh-kpi-value">{{ current.absenceDays.toString().replace('.', ',') }} j</p>
          <p class="wh-kpi-note">jours ouvrés</p>
        </div>
        <div class="wh-kpi">
          <p class="wh-kpi-label">Jours travaillés</p>
          <p class="wh-kpi-value">{{ current.workingDays }}</p>
          <p class="wh-kpi-note">sur la semaine</p>
        </div>
      </div>
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WeekSummary {
  readonly week = input<TimesheetWeek | null>(null);

  protected readonly isPartTime = computed(() => (this.week()?.contractMinutes ?? 2100) < 2100);
  protected readonly overtime = computed(() => {
    const week = this.week();
    return week ? week.overtime.tier25Minutes + week.overtime.tier50Minutes : 0;
  });
  protected readonly complementary = computed(() => {
    const week = this.week();
    return week ? week.complementary.tier10Minutes + week.complementary.tier25Minutes : 0;
  });

  protected readonly format = formatDuration;
}
