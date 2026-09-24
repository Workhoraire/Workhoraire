// Deletes a company and all its data when its account is closed (terms of
// sale, article 11: within 30 days of the closure). Invoices stay at Stripe,
// which keeps them for the 10 years of accounting retention.
//
// Without --confirm, only shows what would be deleted:
//   node --env-file=../.env scripts/delete-company.mjs <companyId>
//   node --env-file=../.env scripts/delete-company.mjs <companyId> --confirm
// In production: docker compose -f docker-compose.prod.yml --env-file .env.production
//   exec api node scripts/delete-company.mjs <companyId> [--confirm]
import { PrismaClient } from '@prisma/client';

const [companyId, flag] = process.argv.slice(2);
if (!companyId || !/^[0-9a-f-]{36}$/i.test(companyId)) {
  console.error('Usage: node scripts/delete-company.mjs <companyId> [--confirm]');
  process.exit(1);
}

const prisma = new PrismaClient();
try {
  const company = await prisma.company.findUnique({
    where: { id: companyId },
    include: {
      users: { select: { keycloakSubject: true, email: true } },
      subscription: { select: { stripeCustomerId: true, status: true } },
      _count: {
        select: {
          timeEntries: true,
          timeEntryAuditLogs: true,
          absenceRequests: true,
          contractPeriods: true,
          invitations: true,
          billingUsages: true,
        },
      },
    },
  });
  if (!company) {
    console.error(`No company ${companyId}`);
    process.exit(1);
  }

  console.log(`Company: ${company.name} (${company.id})`);
  console.log(`Users: ${company.users.length}`, company._count);
  if (company.subscription?.status === 'ACTIVE' || company.subscription?.status === 'PAST_DUE') {
    console.error('The Stripe subscription is still running: cancel it first, from the customer portal or Stripe.');
    process.exit(1);
  }

  if (flag !== '--confirm') {
    console.log('Dry run: nothing deleted. Add --confirm to delete.');
  } else {
    const where = { companyId };
    await prisma.$transaction([
      prisma.timeEntryAuditLog.deleteMany({ where }),
      prisma.timeEntry.deleteMany({ where }),
      prisma.absenceRequest.deleteMany({ where }),
      prisma.contractPeriod.deleteMany({ where }),
      prisma.employeeInvitation.deleteMany({ where }),
      prisma.billingUsage.deleteMany({ where }),
      prisma.subscription.deleteMany({ where }),
      prisma.user.deleteMany({ where }),
      prisma.company.delete({ where: { id: companyId } }),
    ]);
    console.log('Deleted. The encrypted backups forget it after their 30-day rotation.');
  }

  // The sign-in accounts live in Keycloak: delete them in its console too.
  console.log('Keycloak accounts to delete (Users, search by e-mail):');
  for (const user of company.users) {
    console.log(`- ${user.email ?? '(no e-mail)'} (${user.keycloakSubject})`);
  }
  if (company.subscription?.stripeCustomerId) {
    console.log(`Stripe customer kept for the invoices: ${company.subscription.stripeCustomerId}`);
  }
} finally {
  await prisma.$disconnect();
}
