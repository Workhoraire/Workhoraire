import { Prisma } from '@prisma/client';

/**
 * Serialises the changes of one employee's entries or absences (row lock on
 * the user), so that two concurrent writes cannot both pass an overlap check.
 */
export async function lockEmployee(transaction: Prisma.TransactionClient, userId: string): Promise<void> {
  await transaction.$queryRaw`SELECT "id" FROM "User" WHERE "id" = ${userId}::uuid FOR UPDATE`;
}
