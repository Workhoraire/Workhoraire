-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "siret" VARCHAR(14),
ADD COLUMN     "timezone" VARCHAR(64) NOT NULL DEFAULT 'Europe/Paris';

-- CreateIndex
CREATE UNIQUE INDEX "Company_siret_key" ON "Company"("siret");
