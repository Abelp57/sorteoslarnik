// app/api/admin/tickets/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const action = body?.action;

    if (action === "generateMissing") {
      const raffleId: string = body?.raffleId;
      const start: number = body?.start;
      const end: number = body?.end;

      if (!raffleId || typeof start !== "number" || typeof end !== "number") {
        return NextResponse.json({ ok: false, error: "Parámetros inválidos" }, { status: 400 });
      }

      // Obtén existentes para evitar duplicados
      const existing = await prisma.ticket.findMany({
        where: { raffleId, number: { gte: start, lte: end } },
        select: { number: true },
      });
      const existingSet = new Set(existing.map(t => t.number));
      const toCreate: number[] = [];
      for (let n = start; n <= end; n++) if (!existingSet.has(n)) toCreate.push(n);

      if (toCreate.length) {
        // IMPORTANTE: sin skipDuplicates para SQLite
        await prisma.ticket.createMany({
          data: toCreate.map(n => ({ raffleId, number: n })),
        });
      }
      return NextResponse.json({ ok: true, created: toCreate.length });
    }

    if (action === "updateStatus") {
      const raffleId: string = body?.raffleId;
      const numbers: number[] = body?.numbers ?? [];
      const status: "AVAILABLE" | "RESERVED" | "SOLD" = body?.status;

      if (!raffleId || !Array.isArray(numbers) || numbers.length === 0 || !status) {
        return NextResponse.json({ ok: false, error: "Parámetros inválidos" }, { status: 400 });
      }

      // Update masivo por SQL crudo (rápido)
      const placeholders = numbers.map(() => "?").join(",");
      const params = [status, raffleId, ...numbers];

      await prisma.$executeRawUnsafe(
        `UPDATE Ticket SET status = ? WHERE raffleId = ? AND number IN (${placeholders})`,
        ...params
      );

      return NextResponse.json({ ok: true, updated: numbers.length });
    }

    if (action === "clearSelection") {
      // opcional si usas algo en UI
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ ok: false, error: "Acción no soportada" }, { status: 400 });
  } catch (e: any) {
    console.error("[tickets API] error:", e);
    return NextResponse.json({ ok: false, error: e.message ?? "Error interno" }, { status: 500 });
  }
}
