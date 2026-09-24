-- CreateTable
CREATE TABLE "ContractPeriod" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "effectiveFrom" DATE NOT NULL,
    "weeklyContractMinutes" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContractPeriod_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ContractPeriod_companyId_idx" ON "ContractPeriod"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "ContractPeriod_userId_effectiveFrom_key" ON "ContractPeriod"("userId", "effectiveFrom");

-- CreateIndex
CREATE UNIQUE INDEX "User_companyId_payrollId_key" ON "User"("companyId", "payrollId");

-- AddForeignKey
ALTER TABLE "ContractPeriod" ADD CONSTRAINT "ContractPeriod_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "Company"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContractPeriod" ADD CONSTRAINT "ContractPeriod_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;


-- Integrity rules that the Prisma schema cannot express.
ALTER TABLE "ContractPeriod" ADD CONSTRAINT "ContractPeriod_weeklyContractMinutes_check" CHECK ("weeklyContractMinutes" BETWEEN 60 AND 2880);
ALTER TABLE "ContractPeriod" ADD CONSTRAINT "ContractPeriod_effectiveFrom_monday_check" CHECK (EXTRACT(ISODOW FROM "effectiveFrom") = 1);

-- Existing employees keep their current contract for every past week.
INSERT INTO "ContractPeriod" ("id", "companyId", "userId", "effectiveFrom", "weeklyContractMinutes")
SELECT gen_random_uuid(), "companyId", "id", DATE '2000-01-03', "weeklyContractMinutes" FROM "User";
