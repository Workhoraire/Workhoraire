/**
 * End-to-end tests of the REST API against a real PostgreSQL database.
 *
 * Instead of the keycloak-connect middleware (which needs a running Keycloak),
 * a test middleware builds the verified token content from the
 * `x-test-subject` header. Everything else (Keycloak guard, validation,
 * application guards, services, Prisma, SQL constraints) is production code.
 *
 * The database is wiped: E2E_DATABASE_URL must point to a database whose name
 * ends with `_e2e`. See docs/technique/tests-et-qualite.md.
 */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NextFunction, Response } from 'express';
import Stripe from 'stripe';
import { execFileSync } from 'node:child_process';
import { AddressInfo } from 'node:net';
import { resolve } from 'node:path';
import { AppModule } from '../src/app.module';
import { KeycloakRequest } from '../src/auth/auth.types';
import { BillingService } from '../src/billing/billing.service';
import { STRIPE_CLIENT } from '../src/billing/stripe.provider';
import { MailService } from '../src/notifications/mail.service';
import { PrismaService } from '../src/prisma/prisma.service';

function testIdentityMiddleware(request: KeycloakRequest, _response: Response, next: NextFunction): void {
  const subject = request.headers['x-test-subject'];

  if (typeof subject === 'string') {
    request.kauth = {
      grant: {
        access_token: {
          content: { sub: subject, email: `${subject}@example.com`, email_verified: true },
        },
      },
    };
  }

  next();
}

describe('WorkHoraire API (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let baseUrl: string;
  const ids: Record<string, string> = {};

  async function call(
    subject: string,
    method: string,
    path: string,
    body?: unknown,
  ): Promise<{ status: number; body: any; text: string; headers: Headers }> {
    const response = await fetch(`${baseUrl}${path}`, {
      method,
      headers: {
        'content-type': 'application/json',
        'x-test-subject': subject,
      },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    // Decode manually so that a UTF-8 byte order mark is kept in the text.
    const text = new TextDecoder('utf-8', { ignoreBOM: true }).decode(await response.arrayBuffer());
    let parsed: unknown = null;
    try {
      parsed = text ? JSON.parse(text) : null;
    } catch {
      parsed = null;
    }
    return { status: response.status, body: parsed, text, headers: response.headers };
  }

  beforeAll(async () => {
    const databaseUrl = process.env['E2E_DATABASE_URL'];
    if (!databaseUrl) {
      throw new Error('E2E_DATABASE_URL must be set (see .env.example)');
    }
    // Checked before anything touches the database, migrations included.
    const databaseName = decodeURIComponent(new URL(databaseUrl).pathname.slice(1));
    if (!databaseName.endsWith('_e2e')) {
      throw new Error(`Refusing to use "${databaseName}": E2E_DATABASE_URL must end with _e2e`);
    }
    process.env['DATABASE_URL'] = databaseUrl;
    // Every test request comes from the same IP: no rate limit here.
    process.env['THROTTLE_LIMIT_PER_MINUTE'] = '100000';
    // Payments on, with a fake Stripe account: the billing test replaces every
    // Stripe call it makes, so nothing leaves the machine.
    process.env['STRIPE_SECRET_KEY'] = 'sk_test_e2e';
    process.env['STRIPE_PRICE_ID'] = 'price_e2e';
    process.env['STRIPE_WEBHOOK_SECRET'] = 'whsec_e2e';

    const backendRoot = resolve(__dirname, '..');
    execFileSync(
      process.execPath,
      [resolve(backendRoot, 'node_modules/prisma/build/index.js'), 'migrate', 'deploy'],
      { cwd: backendRoot, env: process.env, stdio: 'ignore' },
    );

    app = await NestFactory.create(AppModule, { logger: false, rawBody: true });
    app.use(testIdentityMiddleware);
    app.useGlobalPipes(
      new ValidationPipe({ forbidNonWhitelisted: true, transform: true, whitelist: true }),
    );
    await app.listen(0, '127.0.0.1');
    baseUrl = `http://127.0.0.1:${(app.getHttpServer().address() as AddressInfo).port}`;

    prisma = app.get(PrismaService);
    const [{ current_database: database }] = await prisma.$queryRaw<
      Array<{ current_database: string }>
    >`SELECT current_database()`;
    if (!database.endsWith('_e2e')) {
      throw new Error(`Refusing to wipe "${database}": use a database whose name ends with _e2e`);
    }

    await prisma.$executeRawUnsafe(
      'TRUNCATE "ProcessedWebhook", "BillingUsage", "Subscription", "TimeEntryAuditLog", "TimeEntry", "AbsenceRequest", "ContractPeriod", "EmployeeInvitation", "User", "Company" CASCADE',
    );

    const companyA = await prisma.company.create({ data: { name: 'Boulangerie Martin' } });
    const companyB = await prisma.company.create({ data: { name: 'Autre entreprise' } });
    ids.companyA = companyA.id;

    const users = [
      { key: 'admin', companyId: companyA.id, role: 'ADMIN' as const, firstName: 'Alice' },
      { key: 'manager', companyId: companyA.id, role: 'MANAGER' as const, firstName: 'Marc' },
      { key: 'employee', companyId: companyA.id, role: 'EMPLOYEE' as const, firstName: 'Emma' },
      { key: 'partTime', companyId: companyA.id, role: 'EMPLOYEE' as const, firstName: 'Paul' },
      { key: 'outsider', companyId: companyB.id, role: 'EMPLOYEE' as const, firstName: 'Olga' },
    ];
    for (const user of users) {
      const created = await prisma.user.create({
        data: {
          keycloakSubject: `sub-${user.key}`,
          email: `${user.key}@example.com`,
          firstName: user.firstName,
          lastName: 'Test',
          role: user.role,
          companyId: user.companyId,
          weeklyContractMinutes: user.key === 'partTime' ? 24 * 60 : 35 * 60,
        },
      });
      ids[user.key] = created.id;
    }
  });

  afterAll(async () => {
    await app?.close();
  });

  it('returns the current user with the company timezone and contract', async () => {
    const response = await call('sub-employee', 'GET', '/me');

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      role: 'EMPLOYEE',
      weeklyContractMinutes: 2100,
      company: { name: 'Boulangerie Martin', timezone: 'Europe/Paris' },
    });
  });

  it('clocks in and out, with a single open entry even under concurrent requests', async () => {
    const attempts = await Promise.all(
      Array.from({ length: 5 }, () => call('sub-employee', 'POST', '/time-clock/clock-in', {})),
    );
    const statuses = attempts.map((attempt) => attempt.status).sort();
    expect(statuses).toEqual([201, 409, 409, 409, 409]);

    const status = await call('sub-employee', 'GET', '/time-clock/status');
    expect(status.status).toBe(200);
    expect(status.body.openEntry).toMatchObject({ isOpen: true, source: 'CLOCK' });
    expect(status.body.today.entries).toHaveLength(1);

    const clockOut = await call('sub-employee', 'POST', '/time-clock/clock-out', { note: 'Fin' });
    expect(clockOut.status).toBe(201);
    expect(clockOut.body).toMatchObject({ isOpen: false, note: 'Fin' });

    const again = await call('sub-employee', 'POST', '/time-clock/clock-out', {});
    expect(again.status).toBe(409);
  });

  it('lets a manager add, correct and delete entries with an audit trail', async () => {
    const created = await call('sub-manager', 'POST', '/time-entries', {
      userId: ids.employee,
      startAt: '2026-09-21T08:00:00+02:00',
      endAt: '2026-09-21T12:00:00+02:00',
      reason: 'Badge oublié',
    });
    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({ source: 'MANUAL', durationMinutes: 240 });

    const overlapping = await call('sub-manager', 'POST', '/time-entries', {
      userId: ids.employee,
      startAt: '2026-09-21T11:00:00+02:00',
      endAt: '2026-09-21T13:00:00+02:00',
      reason: 'Doublon',
    });
    expect(overlapping.status).toBe(409);

    const updated = await call('sub-manager', 'PATCH', `/time-entries/${created.body.id}`, {
      endAt: '2026-09-21T12:30:00+02:00',
      reason: 'Heure de sortie corrigée',
    });
    expect(updated.status).toBe(200);
    expect(updated.body.durationMinutes).toBe(270);

    const second = await call('sub-admin', 'POST', '/time-entries', {
      userId: ids.employee,
      startAt: '2026-09-21T13:30:00+02:00',
      endAt: '2026-09-21T17:30:00+02:00',
      reason: 'Après-midi',
    });
    expect(second.status).toBe(201);

    const toDelete = await call('sub-admin', 'POST', '/time-entries', {
      userId: ids.employee,
      startAt: '2026-09-20T08:00:00+02:00',
      endAt: '2026-09-20T09:00:00+02:00',
      reason: 'Erreur de saisie',
    });
    const deleted = await call('sub-admin', 'DELETE', `/time-entries/${toDelete.body.id}`, {
      reason: 'Saisie erronée',
    });
    expect(deleted.status).toBe(204);

    const trail = await call(
      'sub-manager',
      'GET',
      `/time-entries/audit-logs?from=2026-09-20&to=2026-09-21&employeeId=${ids.employee}`,
    );
    expect(trail.status).toBe(200);
    expect(trail.body.map((log: { action: string }) => log.action).sort()).toEqual([
      'CREATED',
      'CREATED',
      'CREATED',
      'DELETED',
      'UPDATED',
    ]);

    const ownTrail = await call('sub-employee', 'GET', '/time-clock/audit-logs?from=2026-09-20&to=2026-09-21');
    expect(ownTrail.status).toBe(200);
    expect(ownTrail.body).toHaveLength(5);
  });

  it('enforces roles, the manager self-correction rule and tenant isolation', async () => {
    const byEmployee = await call('sub-employee', 'POST', '/time-entries', {
      userId: ids.employee,
      startAt: '2026-09-19T08:00:00+02:00',
      endAt: '2026-09-19T09:00:00+02:00',
      reason: 'Test',
    });
    expect(byEmployee.status).toBe(403);

    const ownByManager = await call('sub-manager', 'POST', '/time-entries', {
      userId: ids.manager,
      startAt: '2026-09-19T08:00:00+02:00',
      endAt: '2026-09-19T09:00:00+02:00',
      reason: 'Test',
    });
    expect(ownByManager.status).toBe(403);

    const otherCompany = await call('sub-manager', 'POST', '/time-entries', {
      userId: ids.outsider,
      startAt: '2026-09-19T08:00:00+02:00',
      endAt: '2026-09-19T09:00:00+02:00',
      reason: 'Test',
    });
    expect(otherCompany.status).toBe(404);

    const outsiderTimesheet = await call(
      'sub-manager',
      'GET',
      `/timesheets/employees/${ids.outsider}?from=2026-09-21&to=2026-09-27`,
    );
    expect(outsiderTimesheet.status).toBe(404);

    const team = await call('sub-manager', 'GET', '/timesheets/team?from=2026-09-21&to=2026-09-27');
    expect(team.status).toBe(200);
    expect(team.body.rows.map((row: { employee: { id: string } }) => row.employee.id)).not.toContain(
      ids.outsider,
    );
    expect(team.body.rows).toHaveLength(4);

    const employeeTeam = await call('sub-employee', 'GET', '/timesheets/team?from=2026-09-21&to=2026-09-27');
    expect(employeeTeam.status).toBe(403);
  });

  it('keeps corrections on their day and rejects null values', async () => {
    const entry = await call('sub-admin', 'POST', '/time-entries', {
      userId: ids.employee,
      startAt: '2026-09-18T08:00:00+02:00',
      endAt: '2026-09-18T09:00:00+02:00',
      reason: 'Réunion',
    });
    expect(entry.status).toBe(201);

    const moved = await call('sub-admin', 'PATCH', `/time-entries/${entry.body.id}`, {
      startAt: '2026-09-17T08:00:00+02:00',
      endAt: '2026-09-17T09:00:00+02:00',
      reason: 'Mauvais jour',
    });
    expect(moved.status).toBe(400);
    expect(moved.body.message).toBe(
      'An entry cannot be moved to another day: delete it and create a new one',
    );

    const nullEnd = await call('sub-admin', 'PATCH', `/time-entries/${entry.body.id}`, {
      endAt: null,
      reason: 'Réouverture',
    });
    expect(nullEnd.status).toBe(400);

    const deleted = await call('sub-admin', 'DELETE', `/time-entries/${entry.body.id}`, {
      reason: 'Saisie de test',
    });
    expect(deleted.status).toBe(204);
  });

  it('validates inputs strictly', async () => {
    const noOffset = await call('sub-manager', 'POST', '/time-entries', {
      userId: ids.employee,
      startAt: '2026-09-18T08:00:00',
      endAt: '2026-09-18T09:00:00',
      reason: 'Test',
    });
    expect(noOffset.status).toBe(400);

    const unknownField = await call('sub-employee', 'POST', '/time-clock/clock-in', {
      companyId: ids.companyA,
    });
    expect(unknownField.status).toBe(400);

    const badPeriod = await call('sub-employee', 'GET', '/timesheets/me?from=2026-09-30&to=2026-09-01');
    expect(badPeriod.status).toBe(400);
  });

  it('computes the timesheet with worked time, breaks and corrected entries', async () => {
    const response = await call('sub-employee', 'GET', '/timesheets/me?from=2026-09-21&to=2026-09-27');

    expect(response.status).toBe(200);
    const monday = response.body.days[0];
    expect(monday).toMatchObject({ date: '2026-09-21', workedMinutes: 510, breakMinutes: 60 });
    expect(monday.entries.every((entry: { isCorrected: boolean }) => entry.isCorrected)).toBe(true);
  });

  it('handles an absence request from creation to approval', async () => {
    const created = await call('sub-employee', 'POST', '/absences', {
      type: 'PAID_LEAVE',
      startDate: '2026-10-05',
      endDate: '2026-10-07',
      endsMorning: true,
      comment: 'Vacances',
    });
    expect(created.status).toBe(201);
    expect(created.body).toMatchObject({ status: 'PENDING', days: 2.5 });

    const overlapping = await call('sub-employee', 'POST', '/absences', {
      type: 'RTT',
      startDate: '2026-10-06',
      endDate: '2026-10-06',
    });
    expect(overlapping.status).toBe(409);

    const afternoon = await call('sub-employee', 'POST', '/absences', {
      type: 'RTT',
      startDate: '2026-10-07',
      endDate: '2026-10-07',
      startsAfternoon: true,
    });
    expect(afternoon.status).toBe(201);

    const pending = await call('sub-manager', 'GET', '/absences?status=PENDING');
    expect(pending.body).toHaveLength(2);

    const approved = await call('sub-manager', 'POST', `/absences/${created.body.id}/approve`, {
      comment: 'Bonnes vacances',
    });
    expect(approved.status).toBe(201);
    expect(approved.body).toMatchObject({ status: 'APPROVED', reviewedBy: { id: ids.manager } });

    const twice = await call('sub-admin', 'POST', `/absences/${created.body.id}/reject`, {});
    expect(twice.status).toBe(409);

    const timesheet = await call('sub-employee', 'GET', '/timesheets/me?from=2026-10-05&to=2026-10-11');
    expect(timesheet.body.totals.absenceDays).toBe(2.5);
  });

  it('lets a manager revoke an approved absence, with a reason the employee can read', async () => {
    const [approved] = (await call('sub-manager', 'GET', '/absences?status=APPROVED')).body;

    const byEmployee = await call('sub-employee', 'POST', `/absences/${approved.id}/revoke`, {
      comment: 'Je reviens plus tôt',
    });
    expect(byEmployee.status).toBe(403);

    const withoutReason = await call('sub-manager', 'POST', `/absences/${approved.id}/revoke`, {});
    expect(withoutReason.status).toBe(400);

    const revoked = await call('sub-manager', 'POST', `/absences/${approved.id}/revoke`, {
      comment: 'Retour anticipé',
    });
    expect(revoked.status).toBe(201);
    expect(revoked.body).toMatchObject({
      status: 'CANCELLED',
      reviewComment: 'Retour anticipé',
      reviewedBy: { id: ids.manager },
    });

    const again = await call('sub-admin', 'POST', `/absences/${approved.id}/revoke`, {
      comment: 'Encore',
    });
    expect(again.status).toBe(409);

    const mine = await call('sub-employee', 'GET', '/absences/me');
    expect(mine.body.find((request: { id: string }) => request.id === approved.id)).toMatchObject({
      status: 'CANCELLED',
      reviewComment: 'Retour anticipé',
    });

    // The pending afternoon is not counted: the week no longer has any absence.
    const timesheet = await call('sub-employee', 'GET', '/timesheets/me?from=2026-10-05&to=2026-10-11');
    expect(timesheet.body.totals.absenceDays).toBe(0);
  });

  it('accepts only one of several identical absence requests sent at the same time', async () => {
    const attempts = await Promise.all(
      Array.from({ length: 3 }, () =>
        call('sub-partTime', 'POST', '/absences', {
          type: 'RTT',
          startDate: '2026-11-02',
          endDate: '2026-11-03',
        }),
      ),
    );
    expect(attempts.map((attempt) => attempt.status).sort()).toEqual([201, 409, 409]);

    const created = attempts.find((attempt) => attempt.status === 201)!;
    const cancelled = await call('sub-partTime', 'POST', `/absences/${created.body.id}/cancel`, {});
    expect(cancelled.status).toBe(201);
    expect(cancelled.body).toMatchObject({ status: 'CANCELLED', reviewedBy: { id: ids.partTime } });
  });

  it('exports a payroll CSV readable by French spreadsheets', async () => {
    const payroll = await call('sub-admin', 'PATCH', `/employees/${ids.employee}`, { payrollId: 'E-042' });
    expect(payroll.status).toBe(200);
    expect(payroll.body.payrollId).toBe('E-042');

    const response = await call(
      'sub-admin',
      'GET',
      '/exports/timesheets?from=2026-09-01&to=2026-09-30&granularity=week',
    );

    expect(response.status).toBe(200);
    expect(response.headers.get('content-type')).toContain('text/csv');
    expect(response.headers.get('content-disposition')).toContain(
      'workhoraire-semaines-2026-09-01_2026-09-30.csv',
    );
    expect(response.text.startsWith('﻿Matricule;Nom;Prénom;E-mail;Semaine du')).toBe(true);
    expect(response.text).toContain('E-042;Test;Emma;employee@example.com;2026-09-21;2026-09-27;35,00;8,50;0,00');

    const daily = await call('sub-admin', 'GET', '/exports/timesheets?from=2026-09-21&to=2026-09-21&granularity=day');
    expect(daily.text).toContain('E-042;Test;Emma;employee@example.com;2026-09-21;lundi;;08:00;17:30;1,00;8,50');

    const byEmployee = await call('sub-employee', 'GET', '/exports/timesheets?from=2026-09-01&to=2026-09-30');
    expect(byEmployee.status).toBe(403);
  });

  it('applies a contract change from the Monday of the chosen week only', async () => {
    const withoutContract = await call('sub-admin', 'PATCH', `/employees/${ids.partTime}`, {
      contractEffectiveFrom: '2026-10-01',
    });
    expect(withoutContract.status).toBe(400);

    // 24 h, then 28 h from Thursday 1 October 2026, i.e. from Monday 28 September.
    const changed = await call('sub-admin', 'PATCH', `/employees/${ids.partTime}`, {
      weeklyContractMinutes: 28 * 60,
      contractEffectiveFrom: '2026-10-01',
    });
    expect(changed.status).toBe(200);

    const timesheet = await call(
      'sub-admin',
      'GET',
      `/timesheets/employees/${ids.partTime}?from=2026-09-21&to=2026-10-04`,
    );
    expect(timesheet.status).toBe(200);
    expect(
      timesheet.body.weeks.map((week: { weekStart: string; contractMinutes: number }) => [
        week.weekStart,
        week.contractMinutes,
      ]),
    ).toEqual([
      ['2026-09-21', 24 * 60],
      ['2026-09-28', 28 * 60],
    ]);

    const duplicatePayroll = await call('sub-admin', 'PATCH', `/employees/${ids.partTime}`, {
      payrollId: 'E-042',
    });
    expect(duplicatePayroll.status).toBe(409);
  });

  it('builds the team dashboard', async () => {
    await call('sub-partTime', 'POST', '/time-clock/clock-in', {});

    const response = await call('sub-admin', 'GET', '/dashboard/team');

    expect(response.status).toBe(200);
    expect(response.body.activeEmployees).toBe(4);
    expect(response.body.presentNow).toEqual([
      expect.objectContaining({ employee: expect.objectContaining({ id: ids.partTime }), isOverdue: false }),
    ]);
    expect(response.body.pendingAbsenceRequests).toBe(1);
  });

  it('invites an employee, a new link replacing a lost one', async () => {
    const invitation = { firstName: 'Nina', lastName: 'Test', email: 'sub-nina@example.com' };

    const first = await call('sub-admin', 'POST', '/employees/invitations', invitation);
    expect(first.status).toBe(201);
    expect(first.body.replacesPrevious).toBe(false);

    const second = await call('sub-admin', 'POST', '/employees/invitations', invitation);
    expect(second.status).toBe(201);
    expect(second.body.replacesPrevious).toBe(true);

    const lostLink = await call('sub-nina', 'POST', `/employee-invitations/${first.body.token}/accept`);
    expect(lostLink.status).toBe(410);
    expect((await fetch(`${baseUrl}/employee-invitations/${first.body.token}`)).status).toBe(410);

    const otherEmail = await call('sub-intruder', 'POST', `/employee-invitations/${second.body.token}/accept`);
    expect(otherEmail.status).toBe(403);

    const accepted = await call('sub-nina', 'POST', `/employee-invitations/${second.body.token}/accept`);
    expect(accepted.status).toBe(201);

    const me = await call('sub-nina', 'GET', '/me');
    expect(me.body).toMatchObject({
      role: 'EMPLOYEE',
      weeklyContractMinutes: 2100,
      company: { name: 'Boulangerie Martin' },
    });
  });

  it('runs the whole chain of adding an employee, from the invitation to deactivation', async () => {
    // Only an administrator invites.
    const byManager = await call('sub-manager', 'POST', '/employees/invitations', {
      firstName: 'Léo',
      lastName: 'Chaîne',
      email: 'sub-leo@example.com',
    });
    expect(byManager.status).toBe(403);

    const invitation = await call('sub-admin', 'POST', '/employees/invitations', {
      firstName: 'Léo',
      lastName: 'Chaîne',
      email: 'Sub-Leo@Example.com',
      role: 'EMPLOYEE',
      weeklyContractMinutes: 24 * 60,
    });
    expect(invitation.status).toBe(201);
    expect(invitation.body).toMatchObject({ email: 'sub-leo@example.com', weeklyContractMinutes: 1440 });

    // The link alone, without any account, tells who invites the person: the
    // sign-up page is then pre-filled with the invited address.
    const preview = await fetch(`${baseUrl}/employee-invitations/${invitation.body.token}`);
    expect(preview.status).toBe(200);
    expect(await preview.json()).toMatchObject({
      firstName: 'Léo',
      email: 'sub-leo@example.com',
      role: 'EMPLOYEE',
      companyName: 'Boulangerie Martin',
    });
    expect((await fetch(`${baseUrl}/employee-invitations/not-a-token`)).status).toBe(404);

    // Before accepting, the new Keycloak account belongs to no company.
    const beforeAccept = await call('sub-leo', 'GET', '/me');
    expect(beforeAccept.status).toBe(403);
    expect(beforeAccept.body.message).toBe('The Keycloak user is not associated with a company');

    const unknownLink = await call('sub-leo', 'POST', '/employee-invitations/not-a-token/accept');
    expect(unknownLink.status).toBe(404);

    const wrongAccount = await call('sub-intruder', 'POST', `/employee-invitations/${invitation.body.token}/accept`);
    expect(wrongAccount.status).toBe(403);

    // The invited person accepts: role, contract and company come from the invitation.
    const accepted = await call('sub-leo', 'POST', `/employee-invitations/${invitation.body.token}/accept`);
    expect(accepted.status).toBe(201);
    expect(accepted.body).toMatchObject({
      role: 'EMPLOYEE',
      weeklyContractMinutes: 1440,
      firstName: 'Léo',
      company: { id: ids.companyA },
    });
    const leoId: string = accepted.body.id;

    const twice = await call('sub-leo', 'POST', `/employee-invitations/${invitation.body.token}/accept`);
    expect(twice.status).toBe(409);
    expect((await fetch(`${baseUrl}/employee-invitations/${invitation.body.token}`)).status).toBe(409);

    // The administrator sees the new employee, with the contract of the invitation.
    const employees = await call('sub-admin', 'GET', '/employees');
    expect(employees.body.find((employee: { id: string }) => employee.id === leoId)).toMatchObject({
      email: 'sub-leo@example.com',
      role: 'EMPLOYEE',
      isActive: true,
      weeklyContractMinutes: 1440,
    });

    // First day: the employee clocks in, and the team views show it.
    expect((await call('sub-leo', 'POST', '/time-clock/clock-in', {})).status).toBe(201);
    const dashboard = await call('sub-admin', 'GET', '/dashboard/team');
    expect(
      dashboard.body.presentNow.map((item: { employee: { id: string } }) => item.employee.id),
    ).toContain(leoId);
    const today = (await call('sub-leo', 'GET', '/time-clock/status')).body.today.date as string;
    const team = await call('sub-admin', 'GET', `/timesheets/team?from=${today}&to=${today}`);
    expect(team.body.rows.map((row: { employee: { id: string } }) => row.employee.id)).toContain(leoId);
    expect((await call('sub-leo', 'POST', '/time-clock/clock-out', {})).status).toBe(201);

    // Promoted to manager, he gets access to the team.
    expect((await call('sub-leo', 'GET', `/timesheets/team?from=${today}&to=${today}`)).status).toBe(403);
    const promoted = await call('sub-admin', 'PATCH', `/employees/${leoId}`, { role: 'MANAGER' });
    expect(promoted.status).toBe(200);
    expect((await call('sub-leo', 'GET', `/timesheets/team?from=${today}&to=${today}`)).status).toBe(200);

    // Deactivated: no more access, but the history stays with the administrator.
    const deactivated = await call('sub-admin', 'PATCH', `/employees/${leoId}`, { isActive: false });
    expect(deactivated.status).toBe(200);
    const blocked = await call('sub-leo', 'GET', '/me');
    expect(blocked.status).toBe(403);
    expect(blocked.body.message).toBe('The application user is inactive');
    expect((await call('sub-leo', 'POST', '/time-clock/clock-in', {})).status).toBe(403);
    expect(
      (await call('sub-admin', 'GET', '/employees')).body.find(
        (employee: { id: string }) => employee.id === leoId,
      ),
    ).toMatchObject({ isActive: false });

    const reactivated = await call('sub-admin', 'PATCH', `/employees/${leoId}`, { isActive: true });
    expect(reactivated.status).toBe(200);
    expect((await call('sub-leo', 'GET', '/me')).body).toMatchObject({ role: 'MANAGER', isActive: true });

    // The same address cannot be invited twice in the company.
    const again = await call('sub-admin', 'POST', '/employees/invitations', {
      firstName: 'Léo',
      lastName: 'Chaîne',
      email: 'sub-leo@example.com',
    });
    expect(again.status).toBe(409);

    // Someone who already belongs to another company cannot join a second one,
    // and the refused attempt does not consume the invitation.
    const crossCompany = await call('sub-admin', 'POST', '/employees/invitations', {
      firstName: 'Olga',
      lastName: 'Test',
      email: 'sub-outsider@example.com',
    });
    expect(crossCompany.status).toBe(201);
    const refused = await call('sub-outsider', 'POST', `/employee-invitations/${crossCompany.body.token}/accept`);
    expect(refused.status).toBe(409);
    expect(refused.body.message).toBe('The Keycloak user is already associated with a company');
    const stillOpen = await prisma.employeeInvitation.findUnique({ where: { id: crossCompany.body.id } });
    expect(stillOpen?.acceptedAt).toBeNull();
  });

  it('bills active employees, and makes an unpaid company read-only except for clocking', async () => {
    const stripe = app.get<Stripe>(STRIPE_CLIENT);
    const billing = app.get(BillingService);
    const DAY = 24 * 60 * 60 * 1000;

    // A garage with 5 active employees in June 2026 (4 clocked in, 1 on approved
    // leave), and the same 4 clocking in in July.
    const garage = await prisma.company.create({ data: { name: 'Garage Dupont' } });
    const admin = await prisma.user.create({
      data: {
        keycloakSubject: 'sub-garage-admin',
        email: 'garage-admin@example.com',
        firstName: 'Gaston',
        role: 'ADMIN',
        companyId: garage.id,
      },
    });
    const staff = [];
    for (let index = 1; index <= 5; index += 1) {
      staff.push(
        await prisma.user.create({
          data: {
            keycloakSubject: `sub-garage-${index}`,
            email: `garage-${index}@example.com`,
            firstName: `Méca${index}`,
            companyId: garage.id,
          },
        }),
      );
    }
    for (const worker of staff.slice(0, 4)) {
      for (const day of ['2026-06-10', '2026-07-06']) {
        await prisma.timeEntry.create({
          data: {
            companyId: garage.id,
            userId: worker.id,
            createdById: worker.id,
            startAt: new Date(`${day}T07:00:00Z`),
            endAt: new Date(`${day}T15:00:00Z`),
          },
        });
      }
    }
    await prisma.absenceRequest.create({
      data: {
        companyId: garage.id,
        userId: staff[4].id,
        type: 'PAID_LEAVE',
        status: 'APPROVED',
        startDate: new Date('2026-05-25'),
        endDate: new Date('2026-06-05'),
        reviewedById: admin.id,
        reviewedAt: new Date('2026-05-20T10:00:00Z'),
      },
    });

    // Only the administrator sees the subscription.
    expect((await call('sub-garage-1', 'GET', '/billing')).status).toBe(403);
    const page = await call('sub-garage-admin', 'GET', '/billing');
    expect(page.status).toBe(200);
    expect(page.body).toMatchObject({
      plan: 'DECOUVERTE',
      freeActiveEmployees: 3,
      pricePerActiveEmployeeCents: 300,
      paymentsEnabled: true,
    });

    // Early July: June is over the free plan, the 30-day grace period starts.
    const user = await prisma.user.findUniqueOrThrow({ where: { id: admin.id }, include: { company: true } });
    const july = await billing.getOverview(user, new Date('2026-07-02T10:00:00Z'));
    expect(july).toMatchObject({
      month: '2026-07',
      activeEmployees: 4,
      estimatedAmountCents: 1200,
      lastMonth: { month: '2026-06', activeEmployees: 5, amountCents: 1500 },
      paymentRequired: true,
      graceUntil: '2026-08-01T10:00:00.000Z',
      readOnly: false,
    });
    const august = await billing.getOverview(user, new Date('2026-08-02T10:00:00Z'));
    expect(august).toMatchObject({ paymentRequired: true, readOnly: true });
    // Back under the limit two months in a row: nothing to pay any more.
    const october = await billing.getOverview(user, new Date('2026-10-02T10:00:00Z'));
    expect(october).toMatchObject({ paymentRequired: false, graceUntil: null, readOnly: false });

    // Past the grace period: changes are refused, reading and clocking are not.
    await prisma.subscription.update({
      where: { companyId: garage.id },
      data: { paymentRequiredSince: new Date(Date.now() - 31 * DAY) },
    });
    const newcomer = { firstName: 'Nina', lastName: 'Test', email: 'nina@example.com' };
    const refused = await call('sub-garage-admin', 'POST', '/employees/invitations', newcomer);
    expect(refused.status).toBe(402);
    expect(refused.body.message).toBe('The subscription is unpaid: the company is in read-only mode');
    expect((await call('sub-garage-admin', 'GET', '/employees')).status).toBe(200);
    expect((await call('sub-garage-1', 'POST', '/time-clock/clock-in', {})).status).toBe(201);
    expect((await call('sub-garage-1', 'POST', '/time-clock/clock-out', {})).status).toBe(201);

    // Paying stays possible: Stripe Checkout, with the company as customer.
    const createCustomer = jest
      .spyOn(stripe.customers, 'create')
      .mockResolvedValue({ id: 'cus_e2e' } as never);
    const createSession = jest
      .spyOn(stripe.checkout.sessions, 'create')
      .mockResolvedValue({ url: 'https://checkout.stripe.com/c/pay/cs_test_e2e' } as never);
    const checkout = await call('sub-garage-admin', 'POST', '/billing/checkout');
    expect(checkout.status).toBe(200);
    expect(checkout.body.url).toBe('https://checkout.stripe.com/c/pay/cs_test_e2e');
    expect(createCustomer).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'Garage Dupont', metadata: { companyId: garage.id } }),
    );
    expect(createSession).toHaveBeenCalledWith(
      expect.objectContaining({
        mode: 'subscription',
        customer: 'cus_e2e',
        line_items: [{ price: 'price_e2e' }],
        success_url: expect.stringContaining('/abonnement?paiement=ok'),
      }),
    );

    // Stripe confirms: signed, applied once, and the status is read back from Stripe.
    const retrieve = jest
      .spyOn(stripe.subscriptions, 'retrieve')
      .mockResolvedValue({ id: 'sub_e2e', status: 'active' } as never);
    async function sendWebhook(event: object, secret = 'whsec_e2e'): Promise<number> {
      const payload = JSON.stringify(event);
      const response = await fetch(`${baseUrl}/billing/webhook`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
          'stripe-signature': stripe.webhooks.generateTestHeaderString({ payload, secret }),
        },
        body: payload,
      });
      return response.status;
    }
    const completed = {
      id: 'evt_e2e_checkout',
      object: 'event',
      type: 'checkout.session.completed',
      data: {
        object: {
          id: 'cs_test_e2e',
          object: 'checkout.session',
          mode: 'subscription',
          customer: 'cus_e2e',
          subscription: 'sub_e2e',
        },
      },
    };
    expect(await sendWebhook(completed, 'whsec_forged')).toBe(400);
    expect(await sendWebhook(completed)).toBe(200);
    expect(await sendWebhook(completed)).toBe(200);
    expect(retrieve).toHaveBeenCalledTimes(1);
    expect(await prisma.processedWebhook.count({ where: { id: 'evt_e2e_checkout' } })).toBe(1);
    expect(await prisma.subscription.findUnique({ where: { companyId: garage.id } })).toMatchObject({
      plan: 'ESSENTIEL',
      status: 'ACTIVE',
      stripeSubscriptionId: 'sub_e2e',
      paymentRequiredSince: null,
    });
    expect((await call('sub-garage-admin', 'POST', '/employees/invitations', newcomer)).status).toBe(201);

    // A failed payment: 30 days to fix it, the administrators are warned once, not at each retry.
    const send = jest.spyOn(app.get(MailService), 'send').mockResolvedValue(true);
    retrieve.mockResolvedValue({ id: 'sub_e2e', status: 'past_due' } as never);
    const invoiceEvent = (id: string, type: string) => ({
      id,
      object: 'event',
      type,
      data: { object: { id: `in_${id}`, object: 'invoice', customer: 'cus_e2e' } },
    });
    expect(await sendWebhook(invoiceEvent('evt_e2e_failed_1', 'invoice.payment_failed'))).toBe(200);
    expect(await sendWebhook(invoiceEvent('evt_e2e_failed_2', 'invoice.payment_failed'))).toBe(200);
    const pastDue = await prisma.subscription.findUniqueOrThrow({ where: { companyId: garage.id } });
    expect(pastDue.status).toBe('PAST_DUE');
    expect(pastDue.paymentRequiredSince).not.toBeNull();
    expect(send).toHaveBeenCalledTimes(1);
    expect(send).toHaveBeenCalledWith(
      'garage-admin@example.com',
      expect.objectContaining({ subject: 'Échec du paiement de votre abonnement WorkHoraire' }),
    );

    // Stripe's next attempt succeeds: back to normal.
    retrieve.mockResolvedValue({ id: 'sub_e2e', status: 'active' } as never);
    expect(await sendWebhook(invoiceEvent('evt_e2e_paid', 'invoice.paid'))).toBe(200);
    expect(await prisma.subscription.findUnique({ where: { companyId: garage.id } })).toMatchObject({
      status: 'ACTIVE',
      paymentRequiredSince: null,
    });

    // Early July, the daily job reports June to Stripe, once.
    const meterEvent = jest
      .spyOn(stripe.billing.meterEvents, 'create')
      .mockResolvedValue({} as never);
    await billing.runDaily(new Date('2026-07-02T06:00:00Z'));
    await billing.runDaily(new Date('2026-07-03T06:00:00Z'));
    expect(meterEvent).toHaveBeenCalledTimes(1);
    const june = await prisma.billingUsage.findFirstOrThrow({ where: { companyId: garage.id } });
    expect(june).toMatchObject({ activeEmployees: 5, amountCents: 1500 });
    expect(june.reportedAt).not.toBeNull();
    expect(meterEvent).toHaveBeenCalledWith({
      event_name: 'active_employees',
      identifier: `usage-${june.id}`,
      payload: { stripe_customer_id: 'cus_e2e', value: '5' },
    });

    // Cancelled from the customer portal: back to the free plan.
    retrieve.mockResolvedValue({ id: 'sub_e2e', status: 'canceled' } as never);
    const deleted = {
      id: 'evt_e2e_deleted',
      object: 'event',
      type: 'customer.subscription.deleted',
      data: { object: { id: 'sub_e2e', object: 'subscription', customer: 'cus_e2e', status: 'canceled' } },
    };
    expect(await sendWebhook(deleted)).toBe(200);
    expect(await prisma.subscription.findUnique({ where: { companyId: garage.id } })).toMatchObject({
      plan: 'DECOUVERTE',
      status: 'CANCELED',
      stripeSubscriptionId: null,
    });

    jest.restoreAllMocks();
  });

  it('is protected by database constraints as well', async () => {
    await expect(
      prisma.timeEntry.create({
        data: {
          companyId: ids.companyA,
          userId: ids.employee,
          createdById: ids.employee,
          startAt: new Date('2026-09-10T10:00:00Z'),
          endAt: new Date('2026-09-10T09:00:00Z'),
        },
      }),
    ).rejects.toThrow();

    await expect(
      prisma.user.update({ where: { id: ids.employee }, data: { weeklyContractMinutes: 10 } }),
    ).rejects.toThrow();
  });
});
