/* app/api/admin/winners/[id]/route.ts (with auto-close) */
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

// GET por id
export async function GET(_: Request, { params }: { params: { id: string } }) {
  const w = await prisma.winner.findUnique({ where: { id: params.id } });
  if (!w) return NextResponse.json({ ok: false, error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ ok: true, winner: w }, { status: 200 });
}

// PUT actualizar
export async function PUT(req: Request, { params }: { params: { id: string } }) {
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

    const updated = await prisma.winner.update({
      where: { id: params.id },
      data,
    });

    // Si quedó publicado y tiene rifa: cerrar
    if (updated.published && updated.raffleId) {
      await tryCloseRaffle(updated.raffleId);
    }

    return NextResponse.json({ ok: true, winner: updated }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Error al actualizar" }, { status: 400 });
  }
}

// DELETE
export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  try {
    await prisma.winner.delete({ where: { id: params.id } });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || "Error al eliminar" }, { status: 400 });
  }
}
