-- Reminder e-mail of a forgotten clock-out, sent once per open entry.
ALTER TABLE "TimeEntry" ADD COLUMN "reminderSentAt" TIMESTAMP(3);
