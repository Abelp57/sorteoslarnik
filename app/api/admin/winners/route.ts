/* app/api/admin/winners/route.ts (with auto-close) */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

function toDate(v: any): Date | null {
  if (!v) return null;
  try {
    const s = typeof v === "string" && v.length === 16 ? v + ":00" : v;
    const d = new Date(s);
    return isNaN(+d) ? null : d;
  } catch { return null; }
}

async function tryCloseRaffle(raffleId?: string | null) {
  if (!raffleId) return;
  try {
    // Intenta CLOSED; si el enum difiere, intenta FINISHED
    try {
      await prisma.raffle.update({
        where: { id: raffleId },
        data: { status: "CLOSED" as any, closeDate: new Date() },
      });
      return;
    } catch {
      await prisma.raffle.update({
        where: { id: raffleId },
        data: { status: "FINISHED" as any, closeDate: new Date() },
      });
    }
  } catch {}
}

// GET: lista
export async function GET() {
  const rows = await prisma.winner.findMany({
    orderBy: { id: "desc" },
    include: { raffle: { select: { id: true, title: true, status: true } } },
    take: 1000,
  });
  return NextResponse.json({ items: rows }, { status: 200 });
}

// POST: crear ganador
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const data: any = {};
    if (body.name !== undefined) data.name = String(body.name).trim();
    if (body.phone !== undefined) data.phone = body.phone ? String(body.phone).trim() : null;
    if (body.prize !== undefined) data.prize = String(body.prize).trim();
    if (body.ticketNumber !== undefined) data.number = body.ticketNumber === null || body.ticketNumber === "" ? null : Number(body.ticketNumber);
    if (body.proofImage !== undefined) data.proofImage = body.proofImage || null;
    if (body.published !== undefined) data.published = !!body.published;
    if (body.raffleId !== undefined) data.raffleId = body.raffleId || null;
    if (body.occurredAt !== undefined) data.date = toDate(body.occurredAt);

    const created = await prisma.winner.create({ data });

    // Si el ganador queda publicado y está asociado a rifa, ciérrala.
    if (created.published && created.raffleId) {
      await tryCloseRaffle(created.raffleId);
    }

    return NextResponse.json({ ok: true, winner: created }, { status: 201 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Error al crear ganador" }, { status: 400 });
  }
}
