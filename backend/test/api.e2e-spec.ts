/**
 * End-to-end tests of the REST API against a real PostgreSQL database.
 *
 * Instead of the keycloak-connect middleware (which needs a running Keycloak),
 * a test middleware builds the verified token content from the
 * `x-test-subject` header. Everything else (Keycloak guard, validation,
 * application guards, services, Prisma, SQL constraints) is production code.
 *
 * The database is wiped: DATABASE_URL must point to a database whose name ends
 * with `_e2e`. See docs/technique/tests.md.
 */
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NextFunction, Response } from 'express';
import { execFileSync } from 'node:child_process';
import { AddressInfo } from 'node:net';
import { resolve } from 'node:path';
import { AppModule } from '../src/app.module';
import { KeycloakRequest } from '../src/auth/auth.types';
import { PrismaService } from '../src/prisma/prisma.service';

function testIdentityMiddleware(request: KeycloakRequest, _response: Response, next: NextFunction): void {
  const subject = request.headers['x-test-subject'];

  if (typeof subject === 'string') {
    request.kauth = {
      grant: { access_token: { content: { sub: subject, email: `${subject}@example.com` } } },
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
    process.env['DATABASE_URL'] = databaseUrl;

    const backendRoot = resolve(__dirname, '..');
    execFileSync(
      process.execPath,
      [resolve(backendRoot, 'node_modules/prisma/build/index.js'), 'migrate', 'deploy'],
      { cwd: backendRoot, env: process.env, stdio: 'ignore' },
    );

    app = await NestFactory.create(AppModule, { logger: false });
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
      'TRUNCATE "TimeEntryAuditLog", "TimeEntry", "AbsenceRequest", "EmployeeInvitation", "User", "Company" CASCADE',
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
