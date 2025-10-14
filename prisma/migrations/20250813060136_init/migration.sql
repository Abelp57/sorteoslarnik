-- CreateTable
CREATE TABLE "Raffle" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "sold" INTEGER NOT NULL DEFAULT 0,
    "closeDate" DATETIME NOT NULL,
    "image" TEXT NOT NULL,
    "badge" TEXT,
    "badgeStyle" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "Winner" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "date" DATETIME NOT NULL,
    "prize" TEXT NOT NULL,
    "ticket" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
