-- AlterTable: add eventType column to technical_events
-- Using '' as default so existing rows get a valid non-null value
ALTER TABLE "technical_events" ADD COLUMN "eventType" TEXT NOT NULL DEFAULT '';
