import { TimeEntryAuditAction } from '@prisma/client';
import { formatMailDate, formatMailDay, formatMailPeriod } from './mail-format';
import { correctionMail, escapeHtml, invitationMail, paymentRequiredMail } from './mail-templates';

describe('Transactional e-mails', () => {
  it('invites with the company, the inviter and the personal link', () => {
    const mail = invitationMail({
      firstName: 'Nora',
      companyName: 'Boulangerie Martin',
      inviterName: 'Alice Martin',
      link: 'https://app.example.com/employee-invitations/abc',
      expiresOn: '30 septembre 2026',
    });

    expect(mail.subject).toBe('Boulangerie Martin vous invite sur WorkHoraire');
    expect(mail.text).toContain('Alice Martin vous invite à rejoindre Boulangerie Martin');
    expect(mail.text).toContain('https://app.example.com/employee-invitations/abc');
    expect(mail.html).toContain('href="https://app.example.com/employee-invitations/abc"');
    expect(mail.html).toContain('Activer mon accès');
  });

  it('escapes names in HTML: a company name cannot inject markup', () => {
    const mail = invitationMail({
      firstName: 'Nora',
      companyName: '<script>alert(1)</script>',
      inviterName: 'Alice & Co',
      link: 'https://app.example.com/x',
      expiresOn: '30 septembre 2026',
    });

    expect(mail.html).not.toContain('<script>');
    expect(mail.html).toContain('&lt;script&gt;');
    expect(mail.html).toContain('Alice &amp; Co');
    expect(escapeHtml(`"'`)).toBe('&quot;&#39;');
  });

  it('describes a correction with before, after and the reason', () => {
    const mail = correctionMail({
      firstName: 'Emma',
      actorName: 'Karim Benali',
      action: TimeEntryAuditAction.UPDATED,
      day: 'lundi 21 septembre',
      before: '08:00 – 12:00',
      after: '08:00 – 12:30',
      reason: 'Livraison tardive',
      link: 'https://app.example.com/my-time',
    });

    expect(mail.subject).toBe('Vos heures du lundi 21 septembre ont été corrigées');
    expect(mail.text).toContain('Karim Benali a modifié une période dans vos heures du lundi 21 septembre.');
    expect(mail.text).toContain('Avant : 08:00 – 12:00');
    expect(mail.text).toContain('Après : 08:00 – 12:30');
    expect(mail.text).toContain('Motif : « Livraison tardive »');
  });

  it('formats days, dates and periods in the company timezone', () => {
    // 22:30 UTC is already the next day in Paris (UTC+2 in September).
    const instant = new Date('2026-09-21T22:30:00.000Z');

    expect(formatMailDay(instant, 'Europe/Paris')).toBe('mardi 22 septembre');
    expect(formatMailDate(instant, 'Europe/Paris')).toBe('22 septembre 2026');
    expect(formatMailDate(new Date('2026-10-01T10:00:00.000Z'), 'Europe/Paris')).toBe('1er octobre 2026');
    expect(formatMailDay(new Date('2026-10-01T10:00:00.000Z'), 'Europe/Paris')).toBe('jeudi 1er octobre');
    expect(
      formatMailPeriod({ startAt: '2026-09-21T06:00:00.000Z', endAt: null }, 'Europe/Paris'),
    ).toBe('08:00 – en cours');
  });
  it('warns the administrator before read-only mode, with the deadline', () => {
    const mail = paymentRequiredMail({
      firstName: 'Alice',
      companyName: 'Garage <Dupont>',
      activeEmployees: 5,
      deadline: '24 octobre 2026',
      link: 'https://app.example.com/abonnement',
    });

    expect(mail.subject).toBe('Offre gratuite dépassée : ajoutez un moyen de paiement');
    expect(mail.text).toContain('5 salariés ont utilisé WorkHoraire');
    expect(mail.text).toContain('avant le 24 octobre 2026');
    expect(mail.text).toContain('vos salariés pourront toujours pointer');
    expect(mail.html).toContain('Garage &lt;Dupont&gt;');
    expect(mail.html).not.toContain('<Dupont>');
    expect(mail.html).toContain('l’administrateur de Garage &lt;Dupont&gt;');
  });
});
