-- The account created by accepting an invitation (export of the personal data).
ALTER TABLE "EmployeeInvitation" ADD COLUMN "acceptedById" UUID;

-- AddForeignKey
ALTER TABLE "EmployeeInvitation" ADD CONSTRAINT "EmployeeInvitation_acceptedById_fkey" FOREIGN KEY ("acceptedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Invitations accepted before: the account of the company that has the invited address.
UPDATE "EmployeeInvitation" AS invitation
SET "acceptedById" = account."id"
FROM "User" AS account
WHERE invitation."acceptedAt" IS NOT NULL
  AND account."companyId" = invitation."companyId"
  AND lower(account."email") = invitation."email";
