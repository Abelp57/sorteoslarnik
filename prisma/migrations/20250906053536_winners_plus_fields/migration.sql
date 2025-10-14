-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Winner" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "raffleId" TEXT NOT NULL,
    "name" TEXT,
    "number" INTEGER,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "imageUrl" TEXT,
    "phone" TEXT,
    "prize" TEXT,
    "proofImage" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "Winner_raffleId_fkey" FOREIGN KEY ("raffleId") REFERENCES "Raffle" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Winner" ("date", "id", "imageUrl", "name", "number", "raffleId") SELECT "date", "id", "imageUrl", "name", "number", "raffleId" FROM "Winner";
DROP TABLE "Winner";
ALTER TABLE "new_Winner" RENAME TO "Winner";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
