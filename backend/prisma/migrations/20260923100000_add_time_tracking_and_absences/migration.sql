-- CreateEnum
CREATE TYPE "TimeEntrySource" AS ENUM ('CLOCK', 'MANUAL');

-- CreateEnum
CREATE TYPE "TimeEntryAuditAction" AS ENUM ('CREATED', 'UPDATED', 'DELETED');

-- CreateEnum
CREATE TYPE "AbsenceType" AS ENUM ('PAID_LEAVE', 'RTT', 'SICK_LEAVE', 'UNPAID_LEAVE', 'FAMILY_EVENT', 'OTHER');

-- CreateEnum
CREATE TYPE "AbsenceStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "payrollId" VARCHAR(50),
ADD COLUMN     "weeklyContractMinutes" INTEGER NOT NULL DEFAULT 2100;

-- AlterTable
ALTER TABLE "EmployeeInvitation" ADD COLUMN     "weeklyContractMinutes" INTEGER NOT NULL DEFAULT 2100;

-- CreateTable
CREATE TABLE "TimeEntry" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "startAt" TIMESTAMP(3) NOT NULL,
    "endAt" TIMESTAMP(3),
    "openUserId" UUID,
    "source" "TimeEntrySource" NOT NULL DEFAULT 'CLOCK',
    "note" VARCHAR(500),
    "createdById" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimeEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeEntryAuditLog" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "timeEntryId" UUID NOT NULL,
    "employeeId" UUID NOT NULL,
    "actorId" UUID NOT NULL,
    "action" "TimeEntryAuditAction" NOT NULL,
    "reason" VARCHAR(500) NOT NULL,
    "entryStartAt" TIMESTAMP(3) NOT NULL,
    "before" JSONB,
    "after" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TimeEntryAuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AbsenceRequest" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" "AbsenceType" NOT NULL,
    "status" "AbsenceStatus" NOT NULL DEFAULT 'PENDING',
    "startDate" DATE NOT NULL,
    "endDate" DATE NOT NULL,
    "startsAfternoon" BOOLEAN NOT NULL DEFAULT false,
    "endsMorning" BOOLEAN NOT NULL DEFAULT false,
    "comment" VARCHAR(500),
    "reviewComment" VARCHAR(500),
    "reviewedById" UUID,
    "reviewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AbsenceRequest_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TimeEntry_openUserId_key" ON "TimeEntry"("openUserId");

-- CreateIndex
CREATE INDEX "TimeEntry_companyId_startAt_idx" ON "TimeEntry"("companyId", "startAt");

-- CreateIndex
CREATE INDEX "TimeEntry_userId_startAt_idx" ON "TimeEntry"("userId", "startAt");

-- CreateIndex
CREATE INDEX "TimeEntryAuditLog_companyId_entryStartAt_idx" ON "TimeEntryAuditLog"("companyId", "entryStartAt");

-- CreateIndex
CREATE INDEX "TimeEntryAuditLog_timeEntryId_idx" ON "TimeEntryAuditLog"("timeEntryId");

-- CreateIndex
CREATE INDEX "TimeEntryAuditLog_employeeId_entryStartAt_idx" ON "TimeEntryAuditLog"("employeeId", "entryStartAt");

-- CreateIndex
CREATE INDEX "AbsenceRequest_companyId_startDate_idx" ON "AbsenceRequest"("companyId", "startDate");

-- CreateIndex
CREATE INDEX "AbsenceRequest_userId_startDate_idx" ON "AbsenceRequest"("userId", "startDate");

-- AddForeignKey
ALTER TABLE "TimeEntry" ADD CONSTRAINT "TimeEntry_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeEntry" ADD CONSTRAINT "TimeEntry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeEntry" ADD CONSTRAINT "TimeEntry_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeEntryAuditLog" ADD CONSTRAINT "TimeEntryAuditLog_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeEntryAuditLog" ADD CONSTRAINT "TimeEntryAuditLog_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeEntryAuditLog" ADD CONSTRAINT "TimeEntryAuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AbsenceRequest" ADD CONSTRAINT "AbsenceRequest_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AbsenceRequest" ADD CONSTRAINT "AbsenceRequest_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AbsenceRequest" ADD CONSTRAINT "AbsenceRequest_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- Integrity rules that the Prisma schema cannot express.
ALTER TABLE "TimeEntry" ADD CONSTRAINT "TimeEntry_endAt_after_startAt_check" CHECK ("endAt" IS NULL OR "endAt" > "startAt");
ALTER TABLE "TimeEntry" ADD CONSTRAINT "TimeEntry_openUserId_check" CHECK (("endAt" IS NULL AND "openUserId" = "userId") OR ("endAt" IS NOT NULL AND "openUserId" IS NULL));
ALTER TABLE "AbsenceRequest" ADD CONSTRAINT "AbsenceRequest_dates_check" CHECK ("endDate" >= "startDate");
ALTER TABLE "User" ADD CONSTRAINT "User_weeklyContractMinutes_check" CHECK ("weeklyContractMinutes" BETWEEN 60 AND 2880);
ALTER TABLE "EmployeeInvitation" ADD CONSTRAINT "EmployeeInvitation_weeklyContractMinutes_check" CHECK ("weeklyContractMinutes" BETWEEN 60 AND 2880);
