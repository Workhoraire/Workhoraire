import { Injectable } from '@nestjs/common';
import { AbsenceType } from '@prisma/client';
import { ApplicationUser } from '../auth/auth.types';
import { assertValidPeriod } from '../common/dates/period';
import { isoWeekday } from '../common/dates/local-date';
import { computedRange } from '../timesheets/timesheet.calculator';
import { ComplianceAlert, ComplianceAlertCode } from '../timesheets/timesheet.types';
import { TimesheetsService } from '../timesheets/timesheets.service';
import { formatDays, formatDecimalHours, toCsv } from './csv';

export type ExportGranularity = 'week' | 'day';

/** Two months: payroll is monthly, and weekly exports are extended to whole weeks. */
export const MAX_EXPORT_DAYS = 62;

const ABSENCE_COLUMNS: Array<{ type: AbsenceType; label: string }> = [
  { type: AbsenceType.PAID_LEAVE, label: 'Congés payés (j)' },
  { type: AbsenceType.RTT, label: 'RTT (j)' },
  { type: AbsenceType.SICK_LEAVE, label: 'Maladie (j)' },
  { type: AbsenceType.UNPAID_LEAVE, label: 'Sans solde (j)' },
  { type: AbsenceType.FAMILY_EVENT, label: 'Événement familial (j)' },
  { type: AbsenceType.OTHER, label: 'Autre absence (j)' },
];

const ABSENCE_LABELS: Record<AbsenceType, string> = {
  PAID_LEAVE: 'Congés payés',
  RTT: 'RTT',
  SICK_LEAVE: 'Maladie',
  UNPAID_LEAVE: 'Sans solde',
  FAMILY_EVENT: 'Événement familial',
  OTHER: 'Autre absence',
};

const ALERT_LABELS: Record<ComplianceAlertCode, string> = {
  OPEN_ENTRY_TOO_LONG: 'Sortie non pointée',
  DAILY_MAX_EXCEEDED: 'Plus de 10 h travaillées',
  MISSING_BREAK: 'Pause de 20 min manquante',
  INSUFFICIENT_DAILY_REST: 'Repos quotidien < 11 h',
  WEEKLY_MAX_EXCEEDED: 'Plus de 48 h dans la semaine',
  TOO_MANY_WORKING_DAYS: 'Plus de 6 jours travaillés',
  COMPLEMENTARY_HOURS_LIMIT: 'Heures complémentaires > 1/10 du contrat',
  WORK_DURING_ABSENCE: 'Travail pendant une absence',
};

const WEEKDAYS = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];

function alertsLabel(alerts: ComplianceAlert[]): string {
  return [...new Set(alerts.map((alert) => ALERT_LABELS[alert.code]))].join(', ');
}

@Injectable()
export class ExportsService {
  constructor(private readonly timesheetsService: TimesheetsService) {}

  async timesheetCsv(
    actor: ApplicationUser,
    from: string,
    to: string,
    granularity: ExportGranularity,
    now = new Date(),
  ): Promise<{ filename: string; content: string }> {
    assertValidPeriod(from, to, MAX_EXPORT_DAYS);

    const content =
      granularity === 'week'
        ? await this.weeklyCsv(actor, from, to, now)
        : await this.dailyCsv(actor, from, to, now);

    return {
      filename: `workhoraire-${granularity === 'week' ? 'semaines' : 'jours'}-${from}_${to}.csv`,
      content,
    };
  }

  /** One line per employee and civil week overlapping the period (weeks are never cut). */
  private async weeklyCsv(actor: ApplicationUser, from: string, to: string, now: Date): Promise<string> {
    const range = computedRange(from, to);
    const team = await this.timesheetsService.getTeamTimesheet(actor, range.from, range.to, now);

    const header = [
      'Matricule',
      'Nom',
      'Prénom',
      'E-mail',
      'Semaine du',
      'Semaine au',
      'Contrat (h/sem.)',
      'Heures travaillées (h)',
      'Congés payés comptés dans le seuil (h)',
      'Heures sup. +25 % (h)',
      'Heures sup. +50 % (h)',
      'Heures compl. +10 % (h)',
      'Heures compl. +25 % (h)',
      ...ABSENCE_COLUMNS.map((column) => column.label),
      'Alertes',
    ];

    const lines = team.rows.flatMap((row) =>
      row.weeks
        // Weeks without work, absence or alert would only add lines of zeros.
        .filter((week) => week.workedMinutes > 0 || week.absenceDays > 0 || week.alerts.length > 0)
        .map((week) => {
        const weekDays = row.days.filter((day) => day.date >= week.weekStart && day.date <= week.weekEnd);
        const absenceDays = (type: AbsenceType): number =>
          weekDays.reduce(
            (total, day) =>
              total +
              day.absences
                .filter((absence) => absence.type === type)
                .reduce((sum, absence) => sum + absence.portion, 0),
            0,
          );

        return [
          row.employee.payrollId ?? '',
          row.employee.lastName ?? '',
          row.employee.firstName ?? '',
          row.employee.email ?? '',
          week.weekStart,
          week.weekEnd,
          formatDecimalHours(week.contractMinutes),
          formatDecimalHours(week.workedMinutes),
          formatDecimalHours(week.paidLeaveCreditMinutes),
          formatDecimalHours(week.overtime.tier25Minutes),
          formatDecimalHours(week.overtime.tier50Minutes),
          formatDecimalHours(week.complementary.tier10Minutes),
          formatDecimalHours(week.complementary.tier25Minutes),
          ...ABSENCE_COLUMNS.map((column) => formatDays(absenceDays(column.type))),
          alertsLabel([...weekDays.flatMap((day) => day.alerts), ...week.alerts]),
        ];
      }),
    );

    return toCsv([header, ...lines]);
  }

  /** One line per employee and day with work or an absence. */
  private async dailyCsv(actor: ApplicationUser, from: string, to: string, now: Date): Promise<string> {
    const team = await this.timesheetsService.getTeamTimesheet(actor, from, to, now);
    const holidays = new Map(team.publicHolidays.map((holiday) => [holiday.date, holiday.name]));
    const time = new Intl.DateTimeFormat('fr-FR', {
      timeZone: team.timezone,
      hour: '2-digit',
      minute: '2-digit',
    });
    const formatTime = (value: string | null): string => (value ? time.format(new Date(value)) : '');

    const header = [
      'Matricule',
      'Nom',
      'Prénom',
      'E-mail',
      'Date',
      'Jour',
      'Jour férié',
      'Première entrée',
      'Dernière sortie',
      'Pauses et coupures (h)',
      'Heures travaillées (h)',
      'Absence',
      'Alertes',
    ];

    const lines = team.rows.flatMap((row) =>
      row.days
        .filter((day) => day.workedMinutes > 0 || day.hasOpenEntry || day.absences.length > 0)
        .map((day) => [
          row.employee.payrollId ?? '',
          row.employee.lastName ?? '',
          row.employee.firstName ?? '',
          row.employee.email ?? '',
          day.date,
          WEEKDAYS[isoWeekday(day.date) - 1],
          holidays.get(day.date) ?? '',
          formatTime(day.firstStartAt),
          day.hasOpenEntry ? 'en cours' : formatTime(day.lastEndAt),
          formatDecimalHours(day.breakMinutes),
          formatDecimalHours(day.workedMinutes),
          day.absences
            .map((absence) => `${ABSENCE_LABELS[absence.type]} (${formatDays(absence.portion)} j)`)
            .join(', '),
          alertsLabel(day.alerts),
        ]),
    );

    return toCsv([header, ...lines]);
  }
}
