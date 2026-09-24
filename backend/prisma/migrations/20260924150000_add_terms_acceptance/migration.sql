-- Acceptance of the terms of sale and of the data processing agreement, recorded when the company is created.
ALTER TABLE "Company" ADD COLUMN "termsAcceptedAt" TIMESTAMP(3),
ADD COLUMN "termsVersion" VARCHAR(20);
