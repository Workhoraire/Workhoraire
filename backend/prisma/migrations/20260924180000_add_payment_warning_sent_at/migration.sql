-- When the administrators received the e-mail about the current grace period: sent again each day until delivered.
ALTER TABLE "Subscription" ADD COLUMN "paymentWarningSentAt" TIMESTAMP(3);

-- The grace periods already running were announced when they started.
UPDATE "Subscription" SET "paymentWarningSentAt" = "paymentRequiredSince" WHERE "paymentRequiredSince" IS NOT NULL;
