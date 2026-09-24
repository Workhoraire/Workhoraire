-- Proof of the acceptance of the terms by a closed company, kept 5 years after its deletion.
CREATE TABLE "TermsAcceptanceArchive" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "companyName" VARCHAR(120) NOT NULL,
    "siret" VARCHAR(14),
    "administratorEmails" TEXT[],
    "termsAcceptedAt" TIMESTAMP(3) NOT NULL,
    "termsVersion" VARCHAR(20),
    "closedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TermsAcceptanceArchive_pkey" PRIMARY KEY ("id")
);
