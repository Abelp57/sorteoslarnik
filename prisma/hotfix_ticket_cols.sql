-- Hotfix: columnas de control de boletos
ALTER TABLE "Ticket" ADD COLUMN "status" TEXT NOT NULL DEFAULT 'AVAILABLE';
ALTER TABLE "Ticket" ADD COLUMN "reservedUntil" DATETIME;

-- Índice útil para admin
CREATE INDEX IF NOT EXISTS "Ticket_raffleId_status_idx" ON "Ticket" ("raffleId", "status");
