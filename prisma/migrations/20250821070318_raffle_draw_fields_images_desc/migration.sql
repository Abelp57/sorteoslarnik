-- AlterTable
ALTER TABLE "Raffle" ADD COLUMN "drawAt" DATETIME;
ALTER TABLE "Raffle" ADD COLUMN "drawMethod" TEXT DEFAULT 'LIVE_STREAM';
ALTER TABLE "Raffle" ADD COLUMN "drawPlatform" TEXT;
ALTER TABLE "Raffle" ADD COLUMN "features" TEXT;
ALTER TABLE "Raffle" ADD COLUMN "galleryImages" TEXT;
ALTER TABLE "Raffle" ADD COLUMN "mainImage" TEXT;
ALTER TABLE "Raffle" ADD COLUMN "shortDescription" TEXT;
