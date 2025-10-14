/*
  Warnings:

  - You are about to drop the column `badge` on the `Raffle` table. All the data in the column will be lost.
  - You are about to drop the column `badgeStyle` on the `Raffle` table. All the data in the column will be lost.
  - You are about to drop the column `drawMethod` on the `Raffle` table. All the data in the column will be lost.
  - You are about to drop the column `drawPlatform` on the `Raffle` table. All the data in the column will be lost.
  - You are about to drop the column `features` on the `Raffle` table. All the data in the column will be lost.
  - You are about to drop the column `galleryImages` on the `Raffle` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `Raffle` table. All the data in the column will be lost.
  - You are about to drop the column `mainImage` on the `Raffle` table. All the data in the column will be lost.
  - You are about to drop the column `shortDescription` on the `Raffle` table. All the data in the column will be lost.
  - You are about to drop the column `sold` on the `Raffle` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `holderEmail` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `holderName` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `holderPhone` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `reservedUntil` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Winner` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `Winner` table. All the data in the column will be lost.
  - You are about to drop the column `prize` on the `Winner` table. All the data in the column will be lost.
  - You are about to drop the column `ticket` on the `Winner` table. All the data in the column will be lost.
  - Added the required column `raffleId` to the `Winner` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Raffle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "price" INTEGER NOT NULL,
    "digits" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "startNumber" INTEGER NOT NULL DEFAULT 1,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "closeDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "drawAt" DATETIME
);
INSERT INTO "new_Raffle" ("category", "closeDate", "createdAt", "description", "digits", "drawAt", "id", "price", "startNumber", "status", "title", "total", "updatedAt") SELECT "category", "closeDate", "createdAt", "description", "digits", "drawAt", "id", "price", "startNumber", "status", "title", "total", "updatedAt" FROM "Raffle";
DROP TABLE "Raffle";
ALTER TABLE "new_Raffle" RENAME TO "Raffle";
CREATE TABLE "new_Ticket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" INTEGER NOT NULL,
    "buyerName" TEXT,
    "buyerTel" TEXT,
    "raffleId" TEXT NOT NULL,
    CONSTRAINT "Ticket_raffleId_fkey" FOREIGN KEY ("raffleId") REFERENCES "Raffle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Ticket" ("id", "number", "raffleId") SELECT "id", "number", "raffleId" FROM "Ticket";
DROP TABLE "Ticket";
ALTER TABLE "new_Ticket" RENAME TO "Ticket";
CREATE UNIQUE INDEX "Ticket_raffleId_number_key" ON "Ticket"("raffleId", "number");
CREATE TABLE "new_Winner" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "raffleId" TEXT NOT NULL,
    "name" TEXT,
    "number" INTEGER,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "imageUrl" TEXT,
    CONSTRAINT "Winner_raffleId_fkey" FOREIGN KEY ("raffleId") REFERENCES "Raffle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Winner" ("date", "id", "name") SELECT "date", "id", "name" FROM "Winner";
DROP TABLE "Winner";
ALTER TABLE "new_Winner" RENAME TO "Winner";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
