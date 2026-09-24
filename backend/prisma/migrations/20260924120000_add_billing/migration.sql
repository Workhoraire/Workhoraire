-- CreateEnum
CREATE TYPE "PlanCode" AS ENUM ('DECOUVERTE', 'ESSENTIEL');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('NONE', 'ACTIVE', 'PAST_DUE', 'CANCELED');

-- CreateTable
CREATE TABLE "Subscription" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "plan" "PlanCode" NOT NULL DEFAULT 'DECOUVERTE',
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'NONE',
    "stripeCustomerId" VARCHAR(255),
    "stripeSubscriptionId" VARCHAR(255),
    "paymentRequiredSince" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BillingUsage" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "month" DATE NOT NULL,
    "activeEmployees" INTEGER NOT NULL,
    "amountCents" INTEGER NOT NULL,
    "reportedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BillingUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProcessedWebhook" (
    "id" VARCHAR(255) NOT NULL,
    "receivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProcessedWebhook_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_companyId_key" ON "Subscription"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeCustomerId_key" ON "Subscription"("stripeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_stripeSubscriptionId_key" ON "Subscription"("stripeSubscriptionId");

-- CreateIndex
CREATE UNIQUE INDEX "BillingUsage_companyId_month_key" ON "BillingUsage"("companyId", "month");

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BillingUsage" ADD CONSTRAINT "BillingUsage_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- Counts and amounts are never negative.
ALTER TABLE "BillingUsage" ADD CONSTRAINT "BillingUsage_values_check" CHECK ("activeEmployees" >= 0 AND "amountCents" >= 0);
