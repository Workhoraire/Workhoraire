import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

import {
  formatDayLabel,
  formatShortDate,
  formatTime,
  fullName,
  toDateKey,
} from '../../core/time/time-format';
import { EntrySnapshot, TimeEntryAuditLog } from '../../core/time/time.models';

const ACTION_LABELS: Record<TimeEntryAuditLog['action'], string> = {
  CREATED: 'Période ajoutée',
  UPDATED: 'Période modifiée',
  DELETED: 'Période supprimée',
};

const ACTION_ICONS: Record<TimeEntryAuditLog['action'], string> = {
  CREATED: 'add_circle_outline',
  UPDATED: 'edit',
  DELETED: 'remove_circle_outline',
};

@Component({
  selector: 'app-audit-log-list',
  imports: [MatIconModule],
  template: `
    @if (logs().length === 0) {
      <p class="wh-muted">Aucune correction sur cette période.</p>
    } @else {
      <ol class="logs">
        @for (log of logs(); track log.id) {
          <li>
            <mat-icon aria-hidden="true">{{ icons[log.action] }}</mat-icon>
            <div>
              <p class="log-title">
                <strong>{{ labels[log.action] }}</strong>
                @if (showEmployee()) {
                  pour {{ name(log.employee) }}
                }
                · {{ describeSnapshot(log.before) }}
                @if (log.before && log.after) {
                  →
                }
                {{ describeSnapshot(log.after) }}
              </p>
              <p class="log-meta">
                Par {{ name(log.actor) }} le {{ when(log.createdAt) }} · Motif :
                « {{ log.reason }} »
              </p>
            </div>
          </li>
        }
      </ol>
    }
  `,
  styles: `
    .logs {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin: 0;
      padding: 0;
      list-style: none;
    }
    li {
      display: flex;
      gap: 0.6rem;
    }
    mat-icon {
      flex: 0 0 auto;
      color: var(--wh-coral-ink);
    }
    .log-title,
    .log-meta {
      margin: 0;
      line-height: 1.45;
    }
    .log-title {
      font-size: 0.9rem;
    }
    .log-meta {
      color: var(--wh-muted);
      font-size: 0.8rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuditLogList {
  readonly logs = input.required<TimeEntryAuditLog[]>();
  readonly timezone = input.required<string>();
  readonly showEmployee = input(false);

  protected readonly labels = ACTION_LABELS;
  protected readonly icons = ACTION_ICONS;
  protected readonly name = fullName;

  /** "21 sept. 2026 à 14:05", in the company timezone like every other time. */
  protected when(instant: string): string {
    return `${formatShortDate(toDateKey(instant, this.timezone()))} à ${formatTime(instant, this.timezone())}`;
  }

  protected describeSnapshot(snapshot: EntrySnapshot | null): string {
    if (!snapshot) {
      return '';
    }
    const day = formatDayLabel(toDateKey(snapshot.startAt, this.timezone()));
    const start = formatTime(snapshot.startAt, this.timezone());
    const end = snapshot.endAt ? formatTime(snapshot.endAt, this.timezone()) : 'en cours';
    return `${day} ${start}–${end}`;
  }
}
