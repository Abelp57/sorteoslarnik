-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "raffleId" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'AVAILABLE',
    "reservedUntil" DATETIME,
    "holderName" TEXT,
    "holderPhone" TEXT,
    "holderEmail" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Ticket_raffleId_fkey" FOREIGN KEY ("raffleId") REFERENCES "Raffle" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Raffle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "image" TEXT,
    "price" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "sold" INTEGER NOT NULL DEFAULT 0,
    "closeDate" DATETIME,
    "badge" TEXT,
    "badgeStyle" TEXT,
    "startNumber" INTEGER NOT NULL DEFAULT 1,
    "digits" INTEGER NOT NULL DEFAULT 4,
    "status" TEXT NOT NULL DEFAULT 'PUBLISHED',
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Raffle" ("badge", "badgeStyle", "category", "closeDate", "createdAt", "id", "image", "price", "sold", "title", "total", "updatedAt") SELECT "badge", "badgeStyle", "category", "closeDate", "createdAt", "id", "image", "price", "sold", "title", "total", "updatedAt" FROM "Raffle";
DROP TABLE "Raffle";
ALTER TABLE "new_Raffle" RENAME TO "Raffle";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "Ticket_raffleId_number_idx" ON "Ticket"("raffleId", "number");

-- CreateIndex
CREATE INDEX "Ticket_raffleId_status_idx" ON "Ticket"("raffleId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_raffleId_number_key" ON "Ticket"("raffleId", "number");
