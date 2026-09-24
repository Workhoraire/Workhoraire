import { TimeEntryAuditAction } from '@prisma/client';

/** An e-mail in plain text and simple HTML: French, no image, no tracking. */
export interface MailContent {
  subject: string;
  text: string;
  html: string;
}

const HTML_ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => HTML_ESCAPES[character]);
}

/** Paragraphs are HTML already escaped by the caller. */
function layout(
  title: string,
  paragraphs: string[],
  action?: { label: string; url: string },
  footer = 'Cet e-mail est envoyé par WorkHoraire, l’outil de pointage de votre employeur.',
): string {
  const body = paragraphs.map((paragraph) => `<p style="margin:0 0 16px;line-height:1.5">${paragraph}</p>`).join('');
  const button = action
    ? `<p style="margin:24px 0"><a href="${escapeHtml(action.url)}" style="display:inline-block;background:#17211d;color:#c8ef73;padding:12px 22px;border-radius:999px;text-decoration:none;font-weight:700">${escapeHtml(action.label)}</a></p>`
    : '';
  return [
    '<!doctype html><html lang="fr"><body style="margin:0;background:#f4f5ef;font-family:Arial,Helvetica,sans-serif;color:#17211d">',
    '<div style="max-width:560px;margin:0 auto;padding:32px 24px">',
    '<p style="margin:0 0 24px;font-size:18px;font-weight:800">WorkHoraire</p>',
    `<h1 style="margin:0 0 16px;font-size:22px">${escapeHtml(title)}</h1>`,
    body,
    button,
    `<p style="margin-top:32px;color:#68736d;font-size:12px">${escapeHtml(footer)}</p>`,
    '</div></body></html>',
  ].join('');
}

export interface InvitationMail {
  firstName: string;
  companyName: string;
  inviterName: string;
  link: string;
  /** "30 septembre 2026" */
  expiresOn: string;
}

export function invitationMail(data: InvitationMail): MailContent {
  const subject = `${data.companyName} vous invite sur WorkHoraire`;
  const text = [
    `Bonjour ${data.firstName},`,
    '',
    `${data.inviterName} vous invite à rejoindre ${data.companyName} sur WorkHoraire, pour pointer vos heures.`,
    '',
    'Pour activer votre accès, ouvrez ce lien et choisissez votre mot de passe :',
    data.link,
    '',
    `Ce lien est personnel et valable jusqu’au ${data.expiresOn}.`,
  ].join('\n');
  const html = layout(
    `Bonjour ${data.firstName},`,
    [
      `${escapeHtml(data.inviterName)} vous invite à rejoindre <strong>${escapeHtml(data.companyName)}</strong> sur WorkHoraire, pour pointer vos heures.`,
      'Pour activer votre accès, il ne reste qu’à choisir votre mot de passe.',
      `Ce lien est personnel et valable jusqu’au ${escapeHtml(data.expiresOn)}.`,
    ],
    { label: 'Activer mon accès', url: data.link },
  );
  return { subject, text, html };
}

export interface CorrectionMail {
  firstName: string | null;
  actorName: string;
  action: TimeEntryAuditAction;
  /** "lundi 21 septembre" */
  day: string;
  /** "08:00 – 12:00", absent for an added period. */
  before: string | null;
  /** Absent for a deleted period. */
  after: string | null;
  reason: string;
  link: string;
}

const ACTION_VERBS: Record<TimeEntryAuditAction, string> = {
  CREATED: 'ajouté une période',
  UPDATED: 'modifié une période',
  DELETED: 'supprimé une période',
};

/** Tells the employee about a correction of their hours, with its reason. */
export function correctionMail(data: CorrectionMail): MailContent {
  const greeting = data.firstName ? `Bonjour ${data.firstName},` : 'Bonjour,';
  const subject = `Vos heures du ${data.day} ont été corrigées`;
  const change = `${data.actorName} a ${ACTION_VERBS[data.action]} dans vos heures du ${data.day}.`;
  const details = [
    data.before ? `Avant : ${data.before}` : null,
    data.after ? `Après : ${data.after}` : null,
    `Motif : « ${data.reason} »`,
  ].filter((line): line is string => line !== null);
  const text = [
    greeting,
    '',
    change,
    ...details,
    '',
    'Chaque correction reste visible dans « Mes heures » :',
    data.link,
    'En cas de désaccord, parlez-en à votre responsable.',
  ].join('\n');
  const html = layout(
    greeting,
    [
      escapeHtml(change),
      details.map(escapeHtml).join('<br>'),
      'Chaque correction reste visible dans « Mes heures ». En cas de désaccord, parlez-en à votre responsable.',
    ],
    { label: 'Voir mes heures', url: data.link },
  );
  return { subject, text, html };
}

export interface PaymentRequiredMail {
  firstName: string | null;
  companyName: string;
  activeEmployees: number;
  /** "24 octobre 2026" */
  deadline: string;
  link: string;
}

/** Tells the administrator that the free plan is exceeded, and until when to pay. */
export function paymentRequiredMail(data: PaymentRequiredMail): MailContent {
  const greeting = data.firstName ? `Bonjour ${data.firstName},` : 'Bonjour,';
  const subject = 'Offre gratuite dépassée : ajoutez un moyen de paiement';
  const usage = `${data.activeEmployees} salariés ont utilisé WorkHoraire chez ${data.companyName} sur un même mois. L’offre Découverte est gratuite jusqu’à 3 salariés actifs ; au-delà, l’offre Essentiel coûte 3 € HT par salarié actif et par mois.`;
  const deadline = `Ajoutez un moyen de paiement avant le ${data.deadline}. Passé ce délai, WorkHoraire passera en lecture seule : vos salariés pourront toujours pointer et vous pourrez consulter et exporter les heures, mais plus rien modifier.`;
  const text = [greeting, '', usage, '', deadline, '', data.link].join('\n');
  const html = layout(
    greeting,
    [escapeHtml(usage), escapeHtml(deadline)],
    { label: 'Choisir l’offre Essentiel', url: data.link },
    `Cet e-mail est envoyé par WorkHoraire à l’administrateur de ${data.companyName}.`,
  );
  return { subject, text, html };
}

export interface PaymentFailedMail {
  firstName: string | null;
  companyName: string;
  /** "24 octobre 2026" */
  deadline: string;
  link: string;
}

/** Tells the administrator that a payment failed, and until when to fix it. */
export function paymentFailedMail(data: PaymentFailedMail): MailContent {
  const greeting = data.firstName ? `Bonjour ${data.firstName},` : 'Bonjour,';
  const subject = 'Échec du paiement de votre abonnement WorkHoraire';
  const failure = `Le dernier paiement de l’abonnement WorkHoraire de ${data.companyName} a échoué. Stripe va réessayer automatiquement.`;
  const deadline = `Pour éviter toute interruption, vérifiez ou mettez à jour votre moyen de paiement avant le ${data.deadline}. Passé ce délai, WorkHoraire passera en lecture seule : vos salariés pourront toujours pointer et vous pourrez consulter et exporter les heures, mais plus rien modifier.`;
  const text = [greeting, '', failure, '', deadline, '', data.link].join('\n');
  const html = layout(
    greeting,
    [escapeHtml(failure), escapeHtml(deadline)],
    { label: 'Mettre à jour le paiement', url: data.link },
    `Cet e-mail est envoyé par WorkHoraire à l’administrateur de ${data.companyName}.`,
  );
  return { subject, text, html };
}
