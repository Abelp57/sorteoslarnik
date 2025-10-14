-- CreateTable
CREATE TABLE "MarketingFlyer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "imageUrl" TEXT,
    "isEnabled" BOOLEAN NOT NULL DEFAULT false,
    "delaySeconds" INTEGER NOT NULL DEFAULT 3,
    "autoCloseSeconds" INTEGER NOT NULL DEFAULT 8,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Sponsor" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "website" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ticket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "reservedUntil" DATETIME,
    "buyerName" TEXT,
    "buyerTel" TEXT,
    "raffleId" TEXT NOT NULL,
    CONSTRAINT "Ticket_raffleId_fkey" FOREIGN KEY ("raffleId") REFERENCES "Raffle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Ticket" ("buyerName", "buyerTel", "id", "number", "raffleId") SELECT "buyerName", "buyerTel", "id", "number", "raffleId" FROM "Ticket";
DROP TABLE "Ticket";
ALTER TABLE "new_Ticket" RENAME TO "Ticket";
CREATE INDEX "Ticket_raffleId_status_idx" ON "Ticket"("raffleId", "status");
CREATE UNIQUE INDEX "Ticket_raffleId_number_key" ON "Ticket"("raffleId", "number");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
