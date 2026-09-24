-- Start of the current paid subscription: the months before it were on the free offer (terms of sale, §7 and §8).
ALTER TABLE "Subscription" ADD COLUMN "subscribedAt" TIMESTAMP(3);

-- Subscriptions already running: their last change is the best known date.
UPDATE "Subscription" SET "subscribedAt" = "updatedAt" WHERE "status" IN ('ACTIVE', 'PAST_DUE');
